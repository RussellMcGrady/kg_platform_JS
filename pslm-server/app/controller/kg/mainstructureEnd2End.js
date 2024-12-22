/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
// const graphdb = require('../../neo4j.js')
const axios = require('axios');

const querystring = require('querystring');
const url = require('url');
const { session } = require('neo4j-driver');
const fs = require('fs')
const child_process = require('child_process');
const { json, response } = require('express');
const archiver = require('archiver');
const path = require('path');
const rimraf = require('rimraf')
// const UUID = require('uuid');
const xlsx = require('node-xlsx');

async function mainstructureEnd2End() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)

    // const req = test
    // req.pro_info = JSON.parse(req.pro_info)

    // const req = JSON.stringify(this.request.body)
    const date = new Date()
    var req = this.request.body
    req = JSON.parse(req.data)
    // var similarity = '35'
    // if (req.similarity) { similarity = req.similarity }
    console.log("######", req)
    // req = JSON.parse(req.data)
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    // var ID = UUID.v1();

    //要遍历的文件夹所在的路径

    function readXLSX(path) {
        // 解析得到文档中的所有 sheet
        var sheets1 = xlsx.parse(path);
        // 获取xlsx第一个标签栏的数据
        var sheet1Data = sheets1[0].data;
        // 定义数据列表
        let sheet1List = [];
        let sheet1ListHead = [];
        // 循环拼装数据
        sheet1Data.forEach((item, index) => {
            if (index == 0) {
                // 去除标题栏
                sheet1ListHead = item
                return;
            } else {
                let tmp = {}
                for (var i = 0; i < sheet1ListHead.length; i++) {
                    tmp[sheet1ListHead[i]] = item[i]
                }
                sheet1List.push(tmp);
            }
        })
        return sheet1List;
    }

    var res = await (new Promise(function (resolve, reject) {
        // Num 包括通用性genNum、复用次数reuseNum、独立性indivNum三个指标
        var mainstructureStep1 = child_process.spawnSync('java', ['-jar', './app/controller/kg/mainstructureEnd2End.jar', './app/static/uploadGraphcsv/mainStructure/'+req.fileInput, './app/static/uploadGraphcsv/mainStructure/outputEnd2End'])
        if (mainstructureStep1.stderr.toString().includes('Exception')) {
            const response = {
                code: 50000,
                // data: mainstructureStep1.stderr.toString(),
                msg: 'database request failed'
            }
            console.error(mainstructureStep1.stderr.toString())

            reject(response);
        } else {
            // rimraf('./app/static/uploadGraphcsv/mainStructure/output/最优主结构节点关系文件', function(err) {
            //     if (err) { console.log(err) }
            // })
            sheet1List = readXLSX('./app/static/uploadGraphcsv/mainStructure/outputEnd2End/finalOut/所有产品族评价表格.xlsx')
            sheet2List = readXLSX('./app/static/uploadGraphcsv/mainStructure/outputEnd2End/finalOut/所有方案评价表格.xlsx')
            sheet3List = readXLSX('./app/static/uploadGraphcsv/mainStructure/outputEnd2End/finalOut/最优产品族评价表格.xlsx')

            mainStrfiles = fs.readdirSync('./app/static/uploadGraphcsv/mainStructure/outputEnd2End/finalOut/最优主结构节点关系文件/')
            productfiles = fs.readdirSync('./app/static/uploadGraphcsv/mainStructure/outputEnd2End/bomCSV/')

            const response = {
                code: 20000,
                data: mainstructureStep1.stdout.toString(),
                sheet1List: JSON.stringify(sheet1List),
                sheet2List: JSON.stringify(sheet2List),
                sheet3List: JSON.stringify(sheet3List),
                mainStrfiles: JSON.stringify(mainStrfiles),
                productfiles: JSON.stringify(productfiles),
                msg: 'database request success'
            }
            resolve(response);
        }

    }).then(function (response) {
        console.log(response)
        return JSON.stringify(response)
    })
    )
    this.body = res

}

module.exports = mainstructureEnd2End

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

async function mainstructure() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)

    // const req = test
    // req.pro_info = JSON.parse(req.pro_info)

    // const req = JSON.stringify(this.request.body)
    const date = new Date()
    var req = this.request.body
    // var similarity = '35'
    // if (req.similarity) { similarity = req.similarity }
    console.log("######", req)
    // req = JSON.parse(req.data)


    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    // var ID = UUID.v1();

    // function deleteall(path) {
    //     var files = [];
    //     if (fs.existsSync(path)) {
    //         files = fs.readdirSync(path);
    //         files.forEach(function (file, index) {
    //             var curPath = path + "/" + file;
    //             if (fs.statSync(curPath).isDirectory()) { // recurse
    //                 deleteall(curPath);
    //             } else { // delete file
    //                 fs.unlinkSync(curPath);
    //             }
    //         });
    //         fs.rmdirSync(path);
    //     }
    // }

    var res = await (new Promise(function (resolve, reject) {
        // Num 包括通用性genNum、复用次数reuseNum、独立性indivNum三个指标
        if (req.inputFile1 && req.inputFile2 && req.inputFile3 && req.genNum && req.reuseNum && req.indivNum) {
            // rimraf('./app/static/uploadGraphcsv/mainStructure/output/最优主结构节点关系文件.zip', function(err) {
            //     if (err) { console.log(err) }
            // })
            // rimraf('./app/static/uploadGraphcsv/mainStructure/output/最优产品族评价表格.xlsx', function(err) {
            //     if (err) { console.log(err) }
            // })
            // rimraf('./app/static/uploadGraphcsv/mainStructure/output/所有方案评价表格.xlsx', function(err) {
            //     if (err) { console.log(err) }
            // })
            // rimraf('./app/static/uploadGraphcsv/mainStructure/output/所有产品族评价表格.xlsx', function(err) {
            //     if (err) { console.log(err) }
            // })
            // rimraf('./app/static/uploadGraphcsv/mainStructure/outputTmp/bomCSV.zip', function(err) {
            //     if (err) { console.log(err) }
            // })
            // rimraf('./app/static/uploadGraphcsv/mainStructure/outputTmp/简化BOM.xlsx', function(err) {
            //     if (err) { console.log(err) }
            // })
            // var mainStructure = child_process.spawnSync('java', ['-jar', './app/controller/kg/Matrix.jar', './app/static/uploadGraphcsv/mainStructure/输入/bom.xlsx', 'Sheet1', './app/static/uploadGraphcsv/mainStructure/输入/module.xlsx', 'Sheet1', '35', './app/static/uploadGraphcsv/mainStructure/test'])
            var mainstructureStep1 = child_process.spawnSync('java', ['-jar', './app/controller/kg/mainstructureStep1.jar', './app/static/uploadGraphcsv/mainStructure/' + req.inputFile1, './app/static/uploadGraphcsv/mainStructure/' + req.inputFile2, './app/static/uploadGraphcsv/mainStructure/' + req.inputFile3, './app/static/uploadGraphcsv/mainStructure/outputTmp'])
            var mainstructureStep2 = child_process.spawnSync('python', ['./app/controller/kg/mainstructureStep2.py', './app/static/uploadGraphcsv/mainStructure/outputTmp/中间过程'])
            var mainstructureStep3 = child_process.spawnSync('java', ['-jar', './app/controller/kg/mainstructureStep3.jar', './app/static/uploadGraphcsv/mainStructure/outputTmp/简化BOM.xlsx', './app/static/uploadGraphcsv/mainStructure/outputTmp/中间过程', 0, req.genNum, req.reuseNum, req.indivNum, './app/static/uploadGraphcsv/mainStructure/output'])
            if(mainstructureStep1.stderr.toString().includes('Exception') || mainstructureStep2.stderr.toString().includes('Traceback') || mainstructureStep3.stderr.toString().includes('Exception')) {
                const response = {
                    code: 50000,
                    // data: mainstructureStep1.stderr.toString(),
                    msg: 'database request success'
                }
                console.error(mainstructureStep1.stderr.toString())
                console.error(mainstructureStep2.stderr.toString())
                console.error(mainstructureStep3.stderr.toString())
                reject(response);
            } else {
                // 实现文件下载 
                var currDirStep1 = path.normalize('./app/static/uploadGraphcsv/mainStructure/outputTmp'),
                    fileArrayStep1 = ['bomCSV'],
                    fileNameArrayStep1 = [];

                var currDirStep3 = path.normalize('./app/static/uploadGraphcsv/mainStructure/output'),
                    fileArrayStep3 = ['最优主结构节点关系文件'],
                    fileNameArrayStep3 = [];

                //将文件和文件夹分开命名
                fileArrayStep1.forEach(function (file) {
                    // 文件夹用/符号结尾
                    if (!file.includes('/')) {
                        fileNameArrayStep1.push(file);
                    } else {
                        fileNameArrayStep1.push(path.join(file, "**"));  //文件夹格式：folderName/**
                    }
                });

                fileArrayStep3.forEach(function (file) {
                    // 文件夹用/符号结尾
                    if (!file.includes('/')) {
                        fileNameArrayStep3.push(file);
                    } else {
                        fileNameArrayStep3.push(path.join(file, "**"));  //文件夹格式：folderName/**
                    }
                });

                if (fileArrayStep1.length === 0 && fileArrayStep3.length === 0) {
                    // var response = { "code": "fail", "data": "no files" };
                    const response = {
                        code: 50000,
                        data: "no files",
                        msg: 'database request success'
                    }
                    reject(response);
                }

                var zipNameStep1 = 'bomCSV.zip',
                    zipNameStep3 = '最优主结构节点关系文件.zip';
                var outputStep1 = fs.createWriteStream(path.join("./app/static/uploadGraphcsv/mainStructure/outputTmp/", zipNameStep1)),
                    outputStep3 = fs.createWriteStream(path.join("./app/static/uploadGraphcsv/mainStructure/output/", zipNameStep3));
                var archiveStep1 = archiver.create('zip', {}),
                    archiveStep3 = archiver.create('zip', {});
                archiveStep1.pipe(outputStep1);   //和输出流相接
                archiveStep3.pipe(outputStep3);   //和输出流相接

                archiveStep1.directory('./app/static/uploadGraphcsv/mainStructure/outputTmp/bomCSV', false)
                archiveStep3.directory('./app/static/uploadGraphcsv/mainStructure/output/最优主结构节点关系文件', false)

                archiveStep1.on('error', function (err) {
                    // var response = { "code": "failed", "data": err };
                    const response = {
                        code: 50000,
                        data: err,
                        msg: 'database request success'
                    }
                    reject(response);
                });
                archiveStep3.on('error', function (err) {
                    // var response = { "code": "failed", "data": err };
                    const response = {
                        code: 50000,
                        data: err,
                        msg: 'database request success'
                    }
                    reject(response);
                });
                archiveStep1.on('end', function (a) {
                    //输出下载链接
                    var zipDirStep1 = 'mainStructure/outputTmp/'
                    var bomCsvdownloadUrl = "/file/download?dir=" + encodeURIComponent(zipDirStep1) + "&name=" + encodeURIComponent(zipNameStep1) + "&comefrom=archive";
                    var BOMUrl = "/file/download?dir=mainStructure/outputTmp/" + "&name=简化BOM.xlsx";
                    archiveStep3.on('end', function (a) {
                        var zipDirStep3 = 'mainStructure/output/'
                        var mainStrCsvdownloadUrl = "/file/download?dir=" + encodeURIComponent(zipDirStep3) + "&name=" + encodeURIComponent(zipNameStep3) + "&comefrom=archive";
                        var allFamilyEvalUrl = "/file/download?dir=mainStructure/output/" + "&name=所有产品族评价表格.xlsx";
                        var allApproachEvalUrl = "/file/download?dir=mainStructure/output/" + "&name=所有方案评价表格.xlsx";
                        var bestFamilyEvalUrl = "/file/download?dir=mainStructure/output/" + "&name=最优产品族评价表格.xlsx";

                        const response = {
                            code: 20000,
                            bomCsvdownloadUrl: bomCsvdownloadUrl,
                            mainStrCsvdownloadUrl: mainStrCsvdownloadUrl,
                            BOMUrl: BOMUrl,
                            allFamilyEvalUrl: allFamilyEvalUrl,
                            allApproachEvalUrl: allApproachEvalUrl,
                            bestFamilyEvalUrl: bestFamilyEvalUrl,
                            data: mainstructureStep3.stdout.toString(),
                            msg: 'database request success'
                        }
                        resolve(response)
                        // 删除文件夹
                        rimraf('./app/static/uploadGraphcsv/mainStructure/outputTmp/中间过程', function(err) {
                            if (err) { console.log(err) }
                        })
                        rimraf('./app/static/uploadGraphcsv/mainStructure/outputTmp/bomCSV', function(err) {
                            if (err) { console.log(err) }
                        })
                        rimraf('./app/static/uploadGraphcsv/mainStructure/output/最优主结构节点关系文件', function(err) {
                            if (err) { console.log(err) }
                        })
                    });
                    archiveStep3.finalize();
                });
                archiveStep1.finalize();
            }
        } else {
            const response = {
                code: 50000,
                data: '请上传文件',
                msg: 'database request success'
            }
            reject(response);
        }
        // var filePath = './app/static/uploadGraphcsv/mainStructure/' + req.output
        // resolve(response)
    }).then(function (response) {
        console.log(response)
        return JSON.stringify(response)
    })
    )
    this.body = res

}

module.exports = mainstructure

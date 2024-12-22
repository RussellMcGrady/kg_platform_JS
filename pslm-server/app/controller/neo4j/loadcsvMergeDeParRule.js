/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')

const querystring = require('querystring');
const url = require('url');



async function loadcsvMergeDeParRule() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)
    var req = this.request.body
    // req = [JSON.stringify({"label": "其他", "id": 11}), JSON.stringify({"label": "其他", "id": 12})]
    req.H = JSON.parse(req.H)
    req.R = JSON.parse(req.R)
    req.path = JSON.parse(req.path)
    // req.label = JSON.parse(req.label)
    console.log("######", req.H)
    // req = JSON.parse(req)

    const date = new Date()
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    

    // function getMaxStr(str1, str2) {
    //     var max = str1.length > str2.length ? str1 : str2
    //     var min = (max === str1 ? str2 : str1)
    //     for (var i = 0; i < min.length; i++) {
    //       for (var x = 0, y = min.length - i; y !== min.length + 1; x++, y++) {
    //       // y表示所取字符串的长度
    //         var newStr = min.substring(x, y)
    //         // 判断max中是否包含newStr
    //         if (max.indexOf(newStr) !== -1) {
    //           return newStr
    //         }
    //       }
    //     }
    //     return -1
    //   }

    var DePar = []
    var res0 = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var count = 0;
        graphdb.loadcsv(req.folder, req.path)
            .then(result => {
                result.records.forEach(record => {
                    DePar.push(record._fields[1])
                })
                const response0 = {
                    code: 20000,
                    msg: 'database request success'
                }
                resolve(response0)
            })
            .catch(error => {
                const response0 = {
                    code: 50000,
                    msg: 'database request bad',
                }
                reject(response0)
            })
            
    }).then(function (response0) {
        // console.log(response0)
        return JSON.stringify(response0)
    })
    )

    // merge 需求节点
    for (var i in DePar) {
        var N = {}, H = {}, M = {}, T = {}, R = {}
        N.label = DePar[i].demandLabel
        N.name = DePar[i].name
        H.label = DePar[i].productLabel
        if (DePar[i].targetLevel === 'm') {
            M.label = DePar[i].targetLabel
        } else if (DePar[i].targetLevel === 't') {
            T.label = DePar[i].targetLabel
        }
        R.label = DePar[i].relLabel
        var res1 = await (new Promise(function (resolve, reject) {

            var exData = {};

            var NODE = [];

            var LINK = [];

            var count = 0;

            graphdb.DeParRule(N, H, M, T, R)
                .then(result => {
                    result.records.forEach(record => {
                        record._fields.forEach(i => {
                            if (i.__proto__.__isNode__) {
                                NODE.push(i)
                                count = count + 1
                            }
                            else {
                                LINK.push(i)
                            }
                        })
                    })
                    exData.nodes = NODE;
                    exData.relationships = LINK;
                    exData.cypher = result.summary.query.text
                    const response1 = {
                        code: 20000,
                        // data: exData,
                        msg: 'database request success'
                    }
                    resolve(response1)
                })
                .catch(error => {
                    const response1 = {
                        code: 50000,
                        // data: exData,
                        msg: 'database request bad',
                    }
                    reject(response1)
                })
                
        }).then(function (response1) {
            // console.log(response1)
            return JSON.stringify(response1)
        })
        )
    }

    var res = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var count = 0;

        graphdb.queryRelationship(req.H, req.R)
            .then(result => {
                result.records.forEach(record => {
                    NODE.push(record._fields)
                    })
                exData.nodes = NODE;
                exData.relationships = LINK;
                exData.cypher = result.summary.query.text
                const response = {
                    code: 20000,
                    data: exData,
                    msg: 'database request success'
                }
                resolve(response)
            })
            .catch(error => {
                const response = {
                    code: 50000,
                    // data: exData,
                    msg: 'database request bad',
                }
                reject(response)
            })
            
    }).then(function (response) {
        // console.log(response)
        return JSON.stringify(response)
    })
    )

    this.body = res
}

module.exports = loadcsvMergeDeParRule

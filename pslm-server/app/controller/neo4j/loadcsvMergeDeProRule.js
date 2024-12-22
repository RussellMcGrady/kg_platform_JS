/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')

const querystring = require('querystring');
const url = require('url');



async function loadcsvMergeDeProRule() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)
    var req = this.request.body
    // req = [JSON.stringify({"label": "其他", "id": 11}), JSON.stringify({"label": "其他", "id": 12})]
    req.path = JSON.parse(req.path)
    // req.label = JSON.parse(req.label)
    console.log("######", req.path)
    // req = JSON.parse(req)

    const date = new Date()
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    

    var obj = {}, H = {}, R = {}, T = {}
    var res0 = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var count = 0;
        var labels = []
        var properties = []
        graphdb.loadcsv(req.folder, req.path)
            .then(result => {
                result.records.forEach(record => {
                    if (count === 0) {
                        labels.push(record._fields[0][0])
                        labels.push(record._fields[0][2])
                        labels.push(record._fields[0][4])
                        properties.push(record._fields[0][1])
                        properties.push(record._fields[0][3])
                        count += 1
                    } else {
                        // for (var i = 1; i < record._fields[0].length; i++) {
                            if (!record._fields[0].includes('')) {
                                var name = record._fields[0][1] + '_' + record._fields[0][3] + '_' + record._fields[0][4]
                                H[name] = {}
                                H[name]['label'] = record._fields[0][0]
                                H[name][properties[0]] = record._fields[0][1]
                                R[name] = {}
                                R[name]['label'] = record._fields[0][4]
                                T[name] = {}
                                T[name]['label'] = record._fields[0][2]
                                T[name][properties[1]] = record._fields[0][3]
                            }
                            count += 1
                        // }
                    }
                })
                obj["H"] = H
                obj["R"] = R
                obj["T"] = T

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
    for (var aa in obj.H) {
        var hTmp = {}
        hTmp[aa] = obj.H[aa]
        var hUpTmp = {}
        hUpTmp[aa] = obj.H[aa]
        var res1 = await (new Promise(function (resolve, reject) {

            var exData = {};

            var NODE = [];

            var LINK = [];

            var count = 0;

            graphdb.mergeOnEntity(hTmp, hUpTmp)
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

    // merge 产品节点
    for (var bb in obj.T) {
        var tTmp = {}
        tTmp[bb] = obj.T[bb]
        var tUpTmp = {}
        tUpTmp[bb] = obj.T[bb]
        var res2 = await (new Promise(function (resolve, reject) {

            var exData = {};

            var NODE = [];

            var LINK = [];

            var count = 0;

            graphdb.mergeOnEntity(tTmp, tUpTmp)
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
                    const response2 = {
                        code: 20000,
                        // data: exData,
                        msg: 'database request success'
                    }
                    resolve(response2)
                })
                .catch(error => {
                    const response2 = {
                        code: 50000,
                        // data: exData,
                        msg: 'database request bad',
                    }
                    resolve(response2)
                })
                
        }).then(function (response2) {
            // console.log(response2)
            return JSON.stringify(response2)
        })
        )
    }
    // merge 关系
    for (var kk in obj.R) {
        var hTmp = {}
        hTmp[kk] = obj.H[kk]
        var rTmp = {}
        rTmp[kk] = obj.R[kk]
        var tTmp = {}
        tTmp[kk] = obj.T[kk]

        var res = await (new Promise(function (resolve, reject) {

            var exData = {};

            var NODE = [];

            var LINK = [];

            var count = 0;
            graphdb.mergeRelationshipBatchRelLabel(hTmp, rTmp, tTmp)
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
                    const response = {
                        code: 20000,
                        data: exData,
                        count: count,
                        msg: 'database request success'
                    }
                    resolve(response)
                })
                .catch(error => {
                    const response = {
                        code: 50000,
                        data: exData,
                        msg: 'database request bad',

                    }
                    resolve(response)
                })
                
        }).then(function (response) {
            // console.log(response)
            return JSON.stringify(response)
        })
        )
    }

    this.body = res
}

module.exports = loadcsvMergeDeProRule

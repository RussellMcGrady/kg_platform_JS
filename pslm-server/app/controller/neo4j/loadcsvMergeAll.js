/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')
const querystring = require('querystring');
const url = require('url');



async function loadcsvMergeAll() {
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
    var ruleLabel = []
    var res0 = await (new Promise(function (resolve, reject) {

        var count = 0
        var hLabel = []
        var tLabel = []
        var hProperties = []
        var tProperties = []
        graphdb.loadcsv(req.folder, req.path)
            .then(result => {
                result.records.forEach(record => {
                    if (count === 0) {
                        hLabel = record._fields[0][0]
                        for (var i = 1; i<record._fields[0].length; i++) {
                            if (record._fields[0][i] !== 'label') {
                                hProperties.push(record._fields[0][i])
                            } else {
                                tLabel = record._fields[0][i]
                                for (var j = i+1; j<record._fields[0].length-1; j++) {
                                    tProperties.push(record._fields[0][j])
                                }
                                break
                            }
                        }
                        count += 1
                    } else {
                        // for (var i = 1; i < record._fields[0].length; i++) {
                            if (!record._fields[0].includes('')) {
                                var name = record._fields[0][1] + '_' + record._fields[0].slice(-2)[0] + '_' + record._fields[0].slice(-1)[0]
                                H[name] = {}
                                H[name][hLabel] = record._fields[0][0]
                                for (var i in hProperties) {
                                    i = Number(i)
                                    H[name][hProperties[i]] = record._fields[0][i + 1]
                                }
                                R[name] = {}
                                R[name]['label'] = record._fields[0].slice(-1)[0]
                                T[name] = {}
                                T[name][tLabel] = record._fields[0][hProperties.length + 1]
                                ruleLabel = T[name][tLabel]
                                for (var i in tProperties) {
                                    i = Number(i)
                                    T[name][tProperties[i]] = record._fields[0][i + 1 + hProperties.length + 1]
                                }
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
        hUpTmp[aa] = {}
        hUpTmp[aa]['name'] = obj.H[aa]['name']
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
        tUpTmp[bb] = {}
        tUpTmp[bb]['name'] = obj.T[bb]['name']
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
                    reject(response2)
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
                        ruleLabel: ruleLabel,
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
                    reject(response)
                })
                
        }).then(function (response) {
            // console.log(response)
            return JSON.stringify(response)
        })
        )
    }

    this.body = res
}

module.exports = loadcsvMergeAll

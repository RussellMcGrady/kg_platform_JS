/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
const graphdb = require('../../neo4j.js')
const axios = require('axios');
const { formatDateTime } = require('../../util/util')
const querystring = require('querystring');
const url = require('url');


async function device2kg() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)

    // const req = test
    // req.pro_info = JSON.parse(req.pro_info)

    //const req = JSON.stringify(this.request.body)
    const date = new Date()
    var req = this.request.body
    console.log("######", req.data)
    req = JSON.parse(req.data)
    // req = JSON.parse(req.data)
    // req = JSON.parse(req.EsSearchResult)

    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    params.created_datetime = formatDateTime(date);

    function preprocess(triple) {
        var H = {}, T = {}, R = {}, org = {}, device = {}
        var name = triple.deviceName + '_' + triple.org.replace(/\s*/g, '')
        device.label = '科学装置'
        org.label = '单位'
        org.name = triple.org.replace(/\s*/g, '')
        device.name = triple.deviceName
        H[name] = device
        R[name] = { label:'依托单位' }
        T[name] = org

        var obj = {}
        obj["H"] = H
        obj["R"] = R
        obj["T"] = T

        return obj
    }

    var exData = {};

    var NODE = [];

    var LINK = [];

    var id = [];

    var count = 0

    var i1 = 0, j1 = 1

    var obj = preprocess(req)

    // merge 结点
    for (var ee in obj.T) {
        var hTmp = {}
        hTmp[ee] = obj.T[ee]
        var tTmp = {}
        tTmp[ee] = obj.T[ee]
        // merge 结点
        var res2 = await (new Promise(function (resolve, reject) {
            graphdb.mergeOnEntity(hTmp, tTmp)
                .then(result => {
                    const response2 = {
                        code: 20000,
                        msg: 'database request success'
                    }
                    resolve(response2)
                })
                .catch(error => {
                    const response2 = {
                        code: 50000,
                        msg: 'database request bad',
                    }
                    resolve(response2)
                })
                
        }).then(function (response2) {
            console.log(response2)
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
            graphdb.mergeRelationshipBatchRel(hTmp, rTmp, tTmp)
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
            console.log(response)
            return JSON.stringify(response)
        })
        )
    }

    this.body = res
}

module.exports = device2kg

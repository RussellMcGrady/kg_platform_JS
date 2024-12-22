/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
const graphdb = require('../../neo4j.js')
const axios = require('axios');

const querystring = require('querystring');
const url = require('url');

async function productConfigurationRuleCompletion() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)
    var req = this.request.body
    req = JSON.parse(req.data)
    req.H = JSON.parse(req.H)
    req.T = JSON.parse(req.T)
    req.R = JSON.parse(req.R)
    const date = new Date()
    console.log("######", req)


    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;

    var count = 0
    var H = {}, R = {}, T = {}
    H["completion"] = req.H
    T["completion"] = req.T
    R["completion"] = req.R
    // 头结点
    var res1 = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var count = 0;

        graphdb.mergeOnEntity(H, H)
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
    // 尾结点
    var res2 = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var count = 0;

        graphdb.mergeOnEntity(T, T)
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
    // 关系
    var res = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var count = 0;
        graphdb.mergeRelationshipBatchRelLabel(H, R, T)
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
                    data: error,
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

module.exports = productConfigurationRuleCompletion

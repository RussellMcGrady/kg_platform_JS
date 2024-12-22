/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
const graphdb = require('../../neo4j.js')
const axios = require('axios');

const querystring = require('querystring');
const url = require('url');

async function productConfigurationRuleQuery() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)

    // const req = test
    // req.pro_info = JSON.parse(req.pro_info)

    //const req = JSON.stringify(this.request.body)
    const date = new Date()
    var req = this.request.body
    console.log("######", req)
    req.H = JSON.parse(req.H)


    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;

    var count = 0

    const res1 = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var id = []

        graphdb.queryCount(req.H)
            .then(result => {
                // console.log(result)
                count = result.records[0]._fields[0].low
                const response1 = {
                    code: 20000,
                    msg: 'database request success'
                }
                resolve(response1)
            })
            .catch(error => {
                const response1 = {
                    code: 50000,
                    msg: 'database request bad',
                }
                reject(response1)
            })
    }).then(function (response1) {
        console.log(response1)
        return JSON.stringify(response1)
    })
    )

    var res = await (new Promise(function (resolve, reject) {
        
        var exData = {};

        var NODE = [];

        var LINK = [];

        var id = [];
        graphdb.productConfigurationRuleQuery(req.H, req.type)
            .then(result => {
                if (req.type === 'rule' || req.type === 'list') {
                    result.records.forEach(record => {
                        NODE.push(record._fields)
                    })
                } else if (req.type === 'graph') {
                    result.records.forEach(record => {
                        record._fields.forEach(i => {
                            if (i.__proto__.__isNode__) {
                                NODE.push(i)
                                // count = count + 1
                            }
                            else {
                                LINK.push(i)
                            }
                        })
                    })
                }
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
                    error: error,
                    msg: 'database request bad',

                }
                reject(response)
            })
            
    }).then(function (response) {
        console.log(response)
        return JSON.stringify(response)
    })
    )

    this.body = res
}

module.exports = productConfigurationRuleQuery

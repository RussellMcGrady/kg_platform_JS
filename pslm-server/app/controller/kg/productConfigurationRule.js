/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
const graphdb = require('../../neo4j.js')
const axios = require('axios');

const querystring = require('querystring');
const url = require('url');

async function productConfigurationRule() {
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
    req.H = JSON.parse(req.H)
    req.M = JSON.parse(req.M)
    req.T = JSON.parse(req.T)
    req.res = JSON.parse(req.res)
    // req = JSON.parse(req.data)
    // req = JSON.parse(req.EsSearchResult)

    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    

    var exData = {};

    var NODE = [];

    var LINK = [];

    var id = [];

    var count = 0

    var res = await (new Promise(function (resolve, reject) {
        graphdb.productConfigurationRule(req.H, req.M, req.T, req.res, req.type)
            .then(result => {
                result.records.forEach(record => {
                    if (req.type === 'rule') {
                        NODE.push(record._fields)
                    } else {
                        record._fields.forEach(i => {
                            if (i.__proto__.__isNode__) {
                                NODE.push(i)
                            }
                            else {
                                LINK.push(i)
                            }
                        })
                    }
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
                    error: error,
                    msg: 'database request bad',

                }
                resolve(response)
            })
            
    }).then(function (response) {
        console.log(response)
        return JSON.stringify(response)
    })
    )

    this.body = res
}

module.exports = productConfigurationRule

/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
const graphdb = require('../../neo4j.js')
const axios = require('axios');

const querystring = require('querystring');
const url = require('url');


async function productConfigurationRuleReasoning() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)
    var req = this.request.body
    req = JSON.parse(req.data)
    req.H = JSON.parse(req.H)
    const date = new Date()
    console.log("######", req)


    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;

    var count = 0

    var res0 = await (new Promise(function (resolve, reject) {
        graphdb.productConfigurationRuleReasoning(req)
            .then(result => {
                count = result.records[0]._fields[0].low
                const response0 = {
                    code: 20000,
                    count: count,
                    msg: 'database request success'
                }
                resolve(response0)
            })
            .catch(error => {
                const response0 = {
                    code: 50000,
                    error: error,
                    msg: 'database request bad',

                }
                reject(response0)
            })
            
    }).then(function (response0) {
        console.log(response0)
        return JSON.stringify(response0)
    })
    )

    var fnCount = false

    var res = await (new Promise(function (resolve, reject) {
        
        var exData = {};

        var NODE = [];

        var LINK = [];
            
        var NAME = {}

        var reqH = {}
        reqH = req.H;
        graphdb.productConfigurationRuleReasoning(req, fnCount)
            .then(result => {
                result.records.forEach(record => {
                    record._fields[0].labels.forEach(name => {
                        if(!name.includes('_') || !name.includes('-')) {
                            if(!Object.keys(NAME).includes(name)) {
                                var H = reqH
                                var T = {
                                    label: req.ruleLabel.label,
                                    name: name
                                }
                                var node = {
                                    H: H,
                                    T: T
                                }
                                NAME[name] = 1
                                NODE.push(node)
                            } else {
                                NAME[name] += 1
                            }
                        }
                    })
                })
                NODE.forEach(item => {
                    item.T.prob = NAME[item.T.name]/count
                })
                exData.nodes = NODE;
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

module.exports = productConfigurationRuleReasoning

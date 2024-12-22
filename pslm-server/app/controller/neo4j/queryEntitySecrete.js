/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
// const axios = require('axios');
const graphdbSecrete = require('../../neo4jSecrete.js')
const { formatDateTime } = require('../../util/util')
const querystring = require('querystring');
const url = require('url');



async function queryEntitySecrete() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)
    // const req = this.request.body

    var req = this.request.body
    req = JSON.parse(req.data)

    const date = new Date()
    // const req = this.request.body
    console.log("######", req)
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    params.created_datetime = formatDateTime(date);

    var count = 0

    const res1 = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var id = []

        graphdbSecrete.queryCount(req)
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
            resolve(response1)
        })
    }).then(function (response1) {
        console.log(response1)
        return JSON.stringify(response1)
    })
    )

    const res = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        // var count = 0;

        // graphdb.queryEntity(req.H)
        graphdbSecrete.queryEntity(req)
            .then(result => {
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
    this.body = res

}

module.exports = queryEntitySecrete

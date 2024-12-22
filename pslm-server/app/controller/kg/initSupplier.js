/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
// const axios = require('axios');
const graphdb = require('../../neo4j.js')
const { formatDateTime } = require('../../util/util')
const querystring = require('querystring');
const url = require('url');



async function initSupplier() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)
    var req = this.request.body
    // req = JSON.parse(req.data)

    const date = new Date()
    // const req = this.request.body
    console.log("######", req)
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    params.created_datetime = formatDateTime(date);

    const res = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];
        // graphdb.queryEntity(req.H)
        graphdb.initSupplier()
            .then(result => {
                result.records.forEach(record => {
                    record._fields.forEach(i => {
                        if (i.__proto__.__isNode__) {
                            NODE.push(i)
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
                    errcode: 20000,
                    data: exData,
                    errmsg: 'database request success'
                }
                resolve(response)
            })
            .catch(error => {
                const response = {
                    errcode: 500,
                    data: exData,
                    errmsg: 'database request bad',

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

module.exports = initSupplier

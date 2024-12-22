/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')

const querystring = require('querystring');
const url = require('url');


async function deleteRelationship() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)
    // const req = this.request.body
    var req = this.request.body
    req.H = JSON.parse(req.H)
    req.R = JSON.parse(req.R)
    req.T = JSON.parse(req.T)

    const date = new Date()
    // const req = this.request.body
    console.log("######", req)
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    

    var H = {}, R = {}, T = {}
    var name = 'kjzy'
    H[name] = req.H
    R[name] = req.R
    T[name] = req.T

    const res = await (new Promise(async function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var count = 0;

        // graphdb.queryEntity(req.H)
        await graphdb.deleteRelationship(H, R, T)
            .then(result => {
                result.records.forEach(record => {
                    record._fields.forEach(i => {
                        if (i.__proto__.__isNode__) {
                            NODE.push(i)
                        }
                        else {
                            LINK.push(i)
                            count = count + 1
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
                reject(response)
            })

    }).then(function (response) {
        console.log(response)
        return JSON.stringify(response)
    })
    )
    this.body = res

}

module.exports = deleteRelationship
/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')

const querystring = require('querystring');
const url = require('url');


async function shortestPath() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    //const req = JSON.stringify(this.request.body)
    const date = new Date()
    // var req = querystring.parse(url.parse(this.url).query)
    var req = this.request.body
    console.log(req)
 
    // req = JSON.parse(req.data)

    req.H = JSON.parse(req.H)
    req.T = JSON.parse(req.T)

    // const req = this.request.body
    console.log("######", req)
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    

    const res = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var count = 0

        graphdb.shortestPath(req.length, req.option, req.H, req.T)
            .then(result => {
                result.records.forEach(record => {
                    record._fields.forEach(i => {
                        if (i.__proto__.__isPath__) {
                            i.segments.forEach(segment => {
                                LINK.push(segment.relationship)
                                NODE.push(segment.start)
                                NODE.push(segment.end)
                                count = count + 1
                            })
                        }
                        else if (i.__proto__.__isNode__) {
                            NODE.push(i)
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
                    // data: exData,
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

module.exports = shortestPath

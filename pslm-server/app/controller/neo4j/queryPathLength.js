/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')

const querystring = require('querystring');
const url = require('url');



async function queryPathLength() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)
    // const req = this.request.body

    var req = this.request.body
    req = JSON.parse(req.data)
    req.H = JSON.parse(req.H)
    req.T = JSON.parse(req.T)

    const date = new Date()
    // const req = this.request.body
    console.log("######", req)
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    
    const res = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var count = 0;

        graphdb.queryPathLength(req.H, req.T)
            .then(result => {
                count = result.records[0]._fields[0].low
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
        console.log(response)
        return JSON.stringify(response)
    })
    )
    this.body = res

}

module.exports = queryPathLength

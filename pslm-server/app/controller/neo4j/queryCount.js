/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')

const querystring = require('querystring');
const url = require('url');


async function queryCount() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    //const req = JSON.stringify(this.request.body)
    const date = new Date()
    // const req = querystring.parse(url.parse(this.url).query)
    var req = this.request.body
    req = JSON.parse(req.data)

    
    console.log("######", req)
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    

    var count = 0

    const res = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var id = []

        graphdb.queryCount(req)
        .then(result => {
            // console.log(result)
            count = result.records[0]._fields[0].low
            const response = {
                code: 20000,
                count: count,
                msg: 'database request success'
            }
            resolve(response)
        })
        .catch(error => {
            const response = {
                code: 50000,
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

module.exports = queryCount

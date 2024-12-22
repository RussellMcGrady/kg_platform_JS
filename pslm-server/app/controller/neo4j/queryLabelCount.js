/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')

const querystring = require('querystring');
const url = require('url');



async function queryLabelCount() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)
    // const req = this.request.body
    var req = this.request.body

    const date = new Date()
    // req.labelArr = JSON.parse(req.labelArr)
    // console.log("######", req.labelArr)
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    

    const res = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var id = []

        graphdb.queryLabelCount(req.labelArr)
            .then(result => {
                // console.log(result)
                var count = result.records[0]._fields[0].low
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
                reject(response)
            })

    }).then(function (response) {
        // console.log(response)
        return JSON.stringify(response)
    })
    )
    this.body = res

}

module.exports = queryLabelCount

/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')

const querystring = require('querystring');
const url = require('url');

async function deleteDB() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    const date = new Date()
    // var req = querystring.parse(url.parse(this.url).query)
    var req = this.request.body
    // req.H = JSON.parse(req.H)
    console.log("######", req.labelArr)

    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    

    const res = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var count = 0
        // var T = {
        //     '名称':'浙大联科',
        //     'abstract':'爱你'
        // }
        // graphdb.deleteEntity(req.H, req.T, req.R)
        graphdb.deleteDB(req.labelArr)
            .then(result => {
                result.records.forEach(record => {
                    record._fields.forEach(i => {
                        if (i.__proto__.__isNode__) {
                            NODE.push(i)
                        }
                        if (i.__proto__.__isInteger__) {
                            count = i
                        } else {
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

module.exports = deleteDB

/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')

const querystring = require('querystring');
const url = require('url');


async function createTriple() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    //const req = JSON.stringify(this.request.body)
    const date = new Date()
    // const req = querystring.parse(url.parse(this.url).query)
    // console.log("######", req)
    var req = this.request.body
    req = JSON.parse(req.data)

    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    

    const res = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];
        // graphdb.createTriple(req.labelH, req.labelT, req.labelR, req.H, req.T, req.R)

        graphdb.createTriple(req.H, req.T, req.R)
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
                    errcode: 200,
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

module.exports = createTriple

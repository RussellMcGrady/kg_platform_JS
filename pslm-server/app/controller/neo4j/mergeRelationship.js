/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')

const querystring = require('querystring');
const url = require('url');


async function mergeRelationship() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    const req = querystring.parse(url.parse(this.url).query)
    req.H = JSON.parse(req.H)
    req.R = JSON.parse(req.R)
    req.T = JSON.parse(req.T)

    //const req = JSON.stringify(this.request.body)
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

        // var H = {
        //     名字:'猪仔'
        // }

        // var R = {
        //     关系:'公司同事'
        // }

        // var T = {
        //     名字:'聪聪'
        // }
        // graphdb.mergeRelationship(req.labelH, req.labelR, req.labelT, req.H, req.R, req.T)

        graphdb.mergeRelationship(req.H, req.R, req.T)
            .then(result => {
                result.records.forEach(record => {
                    record._fields.forEach(i => {
                        if (i.__proto__.__isNode__) {
                            NODE.push(i)
                            count = count + 1
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
                    code: 500,
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

module.exports = mergeRelationship

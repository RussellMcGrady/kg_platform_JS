/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')

const querystring = require('querystring');
const url = require('url');


async function removeProperty() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)

    var req = this.request.body
    req = JSON.parse(req.data)
    
    req.H = JSON.parse(req.H)
    req.hRemove = JSON.parse(req.hRemove)

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

        var id = [];

        var count = 0;

        // var H = {
        //     '名称':'浙大联科',
        //     'abstract':'我爱浙大'
        // }

        // var hRemove = {
        //     'abstract':'我爱浙大'
        // }

        graphdb.removeProperty(req.H, req.hRemove)
            .then(result => {
                result.records.forEach(record => {
                    record._fields.forEach(i => {
                        if (i.__proto__.__isNode__) {
                            if (!id.includes(i.identity.low)) {
                                // console.log(i.identity.low)
                                id.push(i.identity.low)
                                NODE.push(i)
                                count = count + 1
                            }
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
                    errcode: 50000,
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

module.exports = removeProperty

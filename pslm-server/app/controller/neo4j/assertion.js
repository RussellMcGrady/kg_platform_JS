/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')


async function assertion() {
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
    const params = {};
    params.task_id = req.taskId;


    const res = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var count = 0
        // var H = {
        //     '名称':'浙大联科',
        //     'age':'130'
        // }
        // graphdb.judgement(req.length, req.judgement, req.H)

        graphdb.assertion(req.length, req.assertion, req.H, req.T, req.condition, req.option)
            .then(result => {
                if (req.option === 'list') {
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
                } else {
                    result.records.forEach(record => {
                        record._fields.forEach(i => {
                            if (i.__proto__.__isPath__) {
                                i.segments.forEach(segment => {
                                    LINK.push(segment.relationship)
                                    NODE.push(segment.start)
                                    NODE.push(segment.end)
                                })
                            }
                        })
                    })
                }

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
            .catch((err) => {
                console.error(err)
                const response = {
                    code: 50000,
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

module.exports = assertion

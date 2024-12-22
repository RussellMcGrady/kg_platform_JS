/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')



async function nodeClick() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    //const req = JSON.stringify(this.request.body)
    const date = new Date()
    var req = this.request.body
    
    console.log("######", req)
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    

    const res = await (new Promise(function (resolve, reject) {

        var exData = {};

        var NODE = [];

        var LINK = [];

        var count = 0

        graphdb.nodeClick(req.id, req.H)
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

module.exports = nodeClick

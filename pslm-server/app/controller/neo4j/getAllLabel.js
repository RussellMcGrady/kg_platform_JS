/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')


async function getAllLabel() {
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)
    var req = this.request.body
    // req = JSON.parse(req.data)

    const date = new Date()
    // const req = this.request.body
    console.log("######", req)
    const params = {};
    params.task_id = req.taskId;
    

    const res = await (new Promise(function (resolve, reject) {

        var labels = [];

        graphdb.getAllLabel()
            .then(result => {
                result.records.forEach(record => {
                    record._fields.forEach(i => {
                        labels.push(i)
                    })
                })
                const response = {
                    errcode: 20000,
                    data: labels,
                    errmsg: 'database request success'
                }
                resolve(response)
            })
            .catch(error => {
                const response = {
                    errcode: 50000,
                    error: error,
                    errmsg: 'database request bad',

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

module.exports = getAllLabel

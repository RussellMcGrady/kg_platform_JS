/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
const graphdb = require('../../neo4j.js')

async function sunburstModel() {
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)

    // const req = test
    // req.pro_info = JSON.parse(req.pro_info)

    //const req = JSON.stringify(this.request.body)
    var req = this.request.body
    req.labelArr = JSON.parse(req.labelArr)
    req.H = JSON.parse(req.H)
    // console.log("######", req)

    const params = {};
    params.task_id = req.taskId;


    var data = {}
    var response = {}

    for (var i in req.labelArr) {
        data[i] = []
        data[i + '_all'] = []
        var dataTmp = []
        dataTmp = JSON.parse(req.labelArr[i])

        // 主干
        await (new Promise(function (resolve, reject) {
            graphdb.queryLabelCount(req.labelArr[i], req.H)
                .then(result => {
                    // console.log(result.records[0]._fields[0].low)
                    var count = result.records[0]._fields[0].low
                    data[i + '_all'].push(count)
                    resolve(data)
                })
                .catch(error => {
                    console.error(error)
                    const response = {
                        code: 50000,
                        msg: 'database request bad',
                    }
                    reject(response)
                })
        })
        )

        // 树枝
        for (var element in dataTmp) {
            await (new Promise(function (resolve, reject) {

                graphdb.queryLabelCount(JSON.stringify([dataTmp[element]]), req.H)
                    .then(result => {
                        // console.log(result.records[0]._fields[0].low)
                        var count = result.records[0]._fields[0].low
                        var childObj = {
                            name: dataTmp[element],
                            value: count,
                            children: []
                        }
                        data[i].push(childObj)
                        response = {
                            code: 20000,
                            data: data,
                            msg: 'database request success'
                        }
                        resolve(response)
                    })
                    .catch(() => {
                        response = {
                            code: 50000,
                            msg: 'database request bad',
                        }
                        reject(response)
                    })
            })
                .then(function (response) {
                    // console.log(response)
                    return JSON.stringify(response)
                })
            )
        }
    }

    this.body = JSON.stringify(response)
}
module.exports = sunburstModel

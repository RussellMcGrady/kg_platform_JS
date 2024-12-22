/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')

const querystring = require('querystring');
const url = require('url');



async function mergeOnEntity() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)
    var req = this.request.body
    // req = [JSON.stringify({"label": "其他", "id": 11}), JSON.stringify({"label": "其他", "id": 12})]
    console.log("######", req)
    // req = JSON.parse(req)

    const date = new Date()
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;


    function preprocess(triples) {
        var H = {}, R = {}, T = {}, hUp = {}, tUp = {}
        Object.keys(triples).forEach(index => {
            // triples.forEach(triple => {
            var triple = JSON.parse(triples[index])
            var name = triple.label + "_" + triple.id
            H[name] = {}
            H[name] = triple
            hUp[name] = {}
            hUp[name]["label"] = triple.label
            if (triple.id) {
                hUp[name]["id"] = triple.id
            } else if (triple.name) {
                hUp[name]["name"] = triple.name
            }

        })
        var obj = {}
        obj["H"] = H
        obj["hUp"] = hUp
        return obj
    }

    var obj = preprocess(req)

    // for (var aa in obj.hUp) {
    var res = await (new Promise(function (resolve, reject) {
        Object.keys(obj.hUp).forEach(aa => {
            var hTmp = {}
            hTmp[aa] = obj.H[aa]
            var hUpTmp = {}
            hUpTmp[aa] = obj.hUp[aa]

            var exData = {};

            var NODE = [];

            var LINK = [];

            var count = 0;

            // var H = {}, hUp = {}
            // name = req.label + '_' + req.id
            // H[name] = {}
            // H[name] = req
            // hUp[name] = {}
            // hUp[name]["label"] = H[name].label
            // hUp[name]["id"] = H[name].id

            graphdb.mergeOnEntity(hTmp, hUpTmp)
                .then(result => {
                    const response = {
                        code: 20000,
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
            })
        }).then(function (response) {
            console.log(response)
            return JSON.stringify(response)
        })
    )
    this.body = res
}

module.exports = mergeOnEntity

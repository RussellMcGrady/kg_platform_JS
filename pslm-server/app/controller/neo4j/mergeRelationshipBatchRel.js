/**
 * Created by ly on 2020/7/7
 * 专利查询
 */

const graphdb = require('../../neo4j.js')

const querystring = require('querystring');
const url = require('url');


async function mergeRelationshipBatchRel() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // var req = querystring.parse(url.parse(this.url).query)
    var req = this.request.body
    console.log("######", req)
    // req = [JSON.stringify({H:{"label": "其他", "id": 12}, R:{"label": 1}, T:{"label":"其他", "id": 11}}),JSON.stringify({H:{"label": "其他", "id": 13}, R:{"label": 2}, T:{"label":"其他", "id": 14}})]
    // req.H = JSON.parse(req.H)
    // req.R = JSON.parse(req.R)
    // req.T = JSON.parse(req.T)
    const date = new Date()
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;


    function prepreocess(triples) {
        var H = {}, R = {}, T = {}
        triples.forEach(triple => {
            triple = JSON.parse(triple)
            var name = triple.H.id + "_" + triple.R.label + "_" + triple.T.id
            H[name] = {}
            H[name] = triple.H
            R[name] = {}
            R[name] = triple.R
            T[name] = {}
            T[name] = triple.T
        })
        var obj = {}
        obj["H"] = H
        obj["R"] = R
        obj["T"] = T
        return obj
    }

    var obj = prepreocess(req)

    // merge 关系
    // for (var kk in obj.R) {
    var res = await (new Promise(function (resolve, reject) {
        Object.keys(obj.R).forEach(kk => {
            var hTmp = {}
            hTmp[kk] = obj.H[kk]
            var rTmp = {}
            rTmp[kk] = obj.R[kk]
            var tTmp = {}
            tTmp[kk] = obj.T[kk]

            graphdb.mergeRelationshipBatchRel(hTmp, rTmp, tTmp)
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
                        code: 50000,
                        data: exData,
                        msg: 'database request bad',

                    }
                    resolve(response)
                })
            })
        }).then(function (response) {
            console.log(response)
            return JSON.stringify(response)
        })
    )
    this.body = res

}

module.exports = mergeRelationshipBatchRel

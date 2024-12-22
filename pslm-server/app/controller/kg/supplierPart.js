/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
const graphdb = require('../../neo4j.js')
const axios = require('axios');
const { formatDateTime } = require('../../util/util')
const querystring = require('querystring');
const url = require('url');
const { session } = require('neo4j-driver');

async function supplierPart() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)

    // const req = test
    // req.pro_info = JSON.parse(req.pro_info)

    //const req = JSON.stringify(this.request.body)
    const date = new Date()
    var req = this.request.body
    console.log("######", req)
    req = JSON.parse(req.data).data

    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    params.created_datetime = formatDateTime(date);

    // 获取图谱label
    // label.split(',')[0].slice(1,)

    function preprocess(req) {
        var H = {}, T = {}, R = {}, hS = {}, hUpS = {}, tP = {}, tUpP = {}
        req.forEach(triple => {
            var parts = {}, attrS = {}, attrP = {}
            parts.label = '[category_label_rd,三级分类]'
            attrP.label = '[category_label_rd,三级分类]'
            triple.label = '供应商'
            attrS.label = '供应商'
            triple.name = triple.name
            triple.urbanCluster = triple.cluster
            parts.value = triple.category_id_rd
            parts.name = triple.category_label_rd

            attrS.name = triple.name
            // attrS.id = triple.id
            attrP.value = triple.category_id_rd
            attrP.name = triple.category_label_rd

            var name = 'supplier_' + triple.name + '_' + triple.category_id_rd

            H[name] = attrS
            R[name] = { label: '供应' }
            // T[name] = {}
            T[name] = attrP

            // 部件
            for (var i in triple) {
                if (i != 'cluster' && i != 'category_id_st' && i != "category_label_st" && i != "category_id_sec" && i != "category_label_sec" && i != "category_id_rd" && i != "category_label_rd") {
                    H[name][i] = triple[i]
                }
            }
            hS[name] = H[name]
            hUpS[name] = attrS
            tP[name] = T[name]
            tUpP[name] = attrP
        })

        var obj = {}
        obj["H"] = H
        obj["R"] = R
        obj["T"] = T
        obj["hS"] = hS
        obj["hUpS"] = hUpS
        obj["tP"] = tP
        obj["tUpP"] = tUpP
        return obj
    }

    var exData = {};

    var NODE = [];

    var LINK = [];

    var id = [];

    var count = 0

    var obj = preprocess(req)

    for (var aa in obj.hUpS) {
        var hTmp = {}
        hTmp[aa] = obj.hS[aa]
        var hUpTmp = {}
        hUpTmp[aa] = obj.hUpS[aa]

        // merge 结点
        var res0 = await (new Promise(function (resolve, reject) {
            graphdb.mergeOnEntity(hTmp, hUpTmp)
                .then(result => {
                    const response0 = {
                        code: 20000,
                        msg: 'database request success'
                    }
                    resolve(response0)
                })
                .catch(error => {
                    const response0 = {
                        code: 50000,
                        msg: 'database request bad',
                    }
                    resolve(response0)
                })
                
        }).then(function (response0) {
            console.log(response0)
            return JSON.stringify(response0)
        })
        )
    }

    for (var bb in obj.tUpP) {
        var tTmp = {}
        tTmp[bb] = obj.tP[bb]
        var tUpTmp = {}
        tUpTmp[bb] = obj.tUpP[bb]

        // merge 结点
        var res1 = await (new Promise(function (resolve, reject) {
            graphdb.mergeOnEntity(tTmp, tUpTmp)
                .then(result => {
                    const response1 = {
                        code: 20000,
                        msg: 'database request success'
                    }
                    resolve(response1)
                })
                .catch(error => {
                    const response1 = {
                        code: 50000,
                        msg: 'database request bad',
                    }
                    resolve(response1)
                })
                
        }).then(function (response1) {
            console.log(response1)
            return JSON.stringify(response1)
        })
        )
    }

    // merge 关系
    for (var kk in obj.R) {
        var hTmp = {}
        hTmp[kk] = obj.H[kk]
        var rTmp = {}
        rTmp[kk] = obj.R[kk]
        var tTmp = {}
        tTmp[kk] = obj.T[kk]

        var res = await (new Promise(function (resolve, reject) {
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
                
        }).then(function (response) {
            console.log(response)
            return JSON.stringify(response)
        })
        )
    }

    this.body = res
}

module.exports = supplierPart

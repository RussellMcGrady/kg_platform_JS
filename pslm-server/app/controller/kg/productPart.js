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

async function productPart() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)

    // const req = test
    // req.pro_info = JSON.parse(req.pro_info)

    //const req = JSON.stringify(this.request.body)
    const date = new Date()
    var req = this.request.body
    console.log("######", req.category)
    req = JSON.parse(req.category)

    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    params.created_datetime = formatDateTime(date);

    function preprocess(req) {
        var H = {}, T = {}, R = {}
        var pro_id, part_id, parts_id
        req.forEach(product => {
            product.name = product.label
            product.label = '[category_label_st,一级分类]'
            pro_id = product.value
            global.partTmp = []

            // 初始化
            product.children.forEach(part2 => {
                part2.name = part2.label
                part2.label = '[category_label_sec,二级分类]'
                part_id = part2.value

                var name = 'product_' + pro_id + '_' + part_id
                global.partTmp.push(name)
            })
            for (t in global.partTmp) {
                // 头结点
                H[global.partTmp[t]] = {}
            }

            // 部件
            for (var i in product) {
                if (i == 'children') {
                    product.children.forEach(part2 => {
                        part_id = part2.value
                        global.partsTmp = []

                        // 初始化
                        part2.children.forEach(part3 => {
                            part3.name = part3.label
                            part3.label = '[category_label_rd,三级分类]'
                            parts_id = part3.value

                            var name2 = 'part_' + part_id + '_' + parts_id
                            global.partsTmp.push(name2)
                        })

                        for (t in global.partsTmp) {
                            // 头结点
                            H[global.partsTmp[t]] = {}
                        }

                        var name = 'product_' + pro_id + '_' + part_id

                        T[name] = {}
                        R[name] = { label: '部件' }

                        for (j in part2) {
                            if (j == 'children') {
                                part2.children.forEach(part3 => {
                                    parts_id = part3.value

                                    var name2 = 'part_' + part_id + '_' + parts_id
                                    T[name2] = {}
                                    R[name2] = { label: '零件' }

                                    for (k in part3) {
                                        if (k != 'children') {
                                            T[name2][k] = part3[k]
                                        }
                                        else continue
                                    }
                                })
                            }
                            else {
                                for (t in global.partsTmp) {
                                    // 头结点
                                    H[global.partsTmp[t]][j] = part2[j]
                                }
                                // 尾节点
                                T[name][j] = part2[j]
                            }
                        }
                    })
                }
                else {
                    for (t in global.partTmp) {
                        // 二级分类头结点
                        H[global.partTmp[t]][i] = product[i]
                    }
                }
            }
        })
        var obj = {}
        obj["H"] = H
        obj["R"] = R
        obj["T"] = T
        return obj
    }

    var exData = {};

    var NODE = [];

    var LINK = [];

    var id = [];

    var count = 0

    var i1 = 0, j1 = 1

    for (var k1 = 0; k1 < req.length; k1 = k1 + 1) {
        var reqTmp = req.slice(i1, j1)
        var obj = preprocess(reqTmp)

        // merge 关系
        for (var aa in obj.H) {
            var hTmp = {}
            hTmp[aa] = obj.H[aa]
            var hUpTmp = {}
            hUpTmp[aa] = obj.H[aa]
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

        // merge 关系
        for (var bb in obj.T) {
            var tTmp = {}
            tTmp[bb] = obj.T[bb]
            var tUpTmp = {}
            tUpTmp[bb] = obj.T[bb]
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
        i1 = i1 + 1
        j1 = j1 + 1
    }

    this.body = res
}

module.exports = productPart

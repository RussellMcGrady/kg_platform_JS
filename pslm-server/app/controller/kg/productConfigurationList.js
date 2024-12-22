/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
const graphdb = require('../../neo4j.js')
const axios = require('axios');
const {v4: uuidv4} = require('uuid');

const querystring = require('querystring');
const url = require('url');

async function productConfigurationList() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)

    // const req = test
    // req.pro_info = JSON.parse(req.pro_info)

    //const req = JSON.stringify(this.request.body)
    const date = new Date()
    var req = this.request.body
    console.log("######", req.data)
    req = JSON.parse(req.data)
    // req = JSON.parse(req.data)
    // req = JSON.parse(req.EsSearchResult)

    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;

    function treeLoop(item, segment) {
        if (item.properties.name === segment.start.properties.name) {
            if (!item.children) {
                item.children = []
                item.children.push(segment.end)
            } else {
                var checkList = []
                item.children.forEach(child => {
                    checkList.push(child.properties.name)
                })
                if (!checkList.includes(segment.end.properties.name)) {
                    item.children.push(segment.end)
                }
            }
            return item
        } else if (item.children) {
            item.children.forEach(child => {
                treeLoop(child, segment)
            })
        } else {
            return item
        }
    }
    function layerLoop(node, layer) {
        node.layer = layer
        if (node.children) {
            node.children.forEach(item => {
                layerLoop(item, Number(layer)+1)
            })
        }
        return node
    }

    var exData = {};

    var NODE = [];

    var LINK = [];

    var id = [];

    var count = 0

    var fnCount = true
    var res1 = await (new Promise(function (resolve, reject) {
        graphdb.productConfigurationListSpanTree(req.label, req.reqObj, req.clickId, req.transferlabel, req.transferid, req.skip, req.limit, fnCount, req.fnLink)
            .then(result => {
                result.records.forEach(record => {
                    count += record._fields[0].low
                    // console.log(record._fields[0].low)
                })
                const response1 = {
                    code: 20000,
                    msg: 'database request success'
                }
                resolve(response1)
            })
            .catch(error => {
                const response1 = {
                    code: 50000,
                    error: error,
                    msg: 'database request bad',
                }
                reject(response1)
            })
            
    }).then(function (response1) {
        // console.log(response1)
        return JSON.stringify(response1)
    })
    )

    fnCount = false
    var score = 0
    if (req.fnLink) {
        var res = await (new Promise(function (resolve, reject) {
            graphdb.productConfigurationListSpanTree(req.label, req.reqObj, req.clickId, req.transferlabel, req.transferid, req.skip, req.limit, fnCount, req.fnLink)
                .then(result => {
                    result.records.forEach(record => {
                        // 第二个参数为相似性
                        if (record._fields[1] > 0) {
                            score = record._fields[1]
                            record._fields.forEach(i => {
                                if (i.__proto__.__isNode__) {
                                    i['linkScore'] = score
                                    NODE.push(i)
                                } else if (i.__proto__.__isRelationship__) {
                                    LINK.push(i)
                                }
                            })
                        }
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
                        error: error,
                        msg: 'database request bad',

                    }
                    reject(response)
                })
                
        }).then(function (response) {
            // console.log(response)
            return JSON.stringify(response)
        })
        )
    } else {
        var res = await (new Promise(async function (resolve, reject) {
            var result = await graphdb.productConfigurationListSpanTree(req.label, req.reqObj, req.clickId, req.transferlabel, req.transferid, req.skip, req.limit, fnCount, req.fnLink)
            result.records.forEach(record => {
                record._fields.forEach(i => {
                    if (i.__proto__.__isPath__) {
                        i.segments.forEach(segment => {
                            segment.start.id = uuidv4()
                            segment.end.id = uuidv4()
                            LINK.push(segment.relationship)
                            if (NODE.length>0) {
                                // 叶子
                                NODE.forEach(item => {
                                    item = treeLoop(item, segment)
                                })
                            } else {
                                // 根节点
                                segment.start.children = []
                                segment.start.children.push(segment.end)
                                NODE.push(segment.start)
                            }
                        })
                    }
                })
            })
            NODE.forEach(node => {
                node = layerLoop(node, 2)
            })
            exData.nodes = NODE;
            exData.relationships = LINK;
            exData.cypher = result.summary.query.text
            const response = {
                code: 20000,
                data: exData,
                count: 1000000,
                msg: 'database request success'
            }
            resolve(response)
        }).then(function (response) {
            // console.log(response)
            return JSON.stringify(response)
        })
        )
    }

    this.body = res
}

module.exports = productConfigurationList

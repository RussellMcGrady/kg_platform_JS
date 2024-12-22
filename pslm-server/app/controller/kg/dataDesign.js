/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
const graphdb = require('../../neo4j.js')
const axios = require('axios');
const { formatDateTime } = require('../../util/util')
const querystring = require('querystring');
const url = require('url');

async function dataDesign() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)

    // const req = test
    // req.pro_info = JSON.parse(req.pro_info)

    //const req = JSON.stringify(this.request.body)
    const date = new Date()
    var req = this.request.body
    req = JSON.parse(req.model)
    console.log("######", req)

    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    params.created_datetime = formatDateTime(date);

    req.pro_info.label = "[pro_info,项目]"
    req.product =  {
        "value": 885,
        "name": "厨电-叶轮",}
    req.product.label = '[category_label_rd,三级分类]'

    req.bom = { label: "[bom,物料清单]", name: "123456" }
    req.core = { label: "[core,核心企业]", 
    "sup_name": "中山市小榄镇汇力五金制品有限公司",
    "sup_tags": "完善信息",
    "sup_has_right": 0,
    "sup_if_cooperation": 0,
    "sup_if_evaluation": 0,
    "sup_score": null,
    "sup_address": "中山市小榄镇九洲基联丰路边富乐围B座",
    "sup_reg_money": "500",
    "sup_demand_num": 0,
    "sup_enter_date": "2015-09-09",
    "created_datetime": "2020-08-30T07:35:20.000Z",
    "is_delete": 0}
    req.core.name = req.core.sup_name

    req.supplier = { label: "[supplier,供应商]",
    "sup_name": "嵊州市英格电器有限公司",
    "sup_tags": "完善信息",
    "sup_has_right": 0,
    "sup_if_cooperation": 0,
    "sup_if_evaluation": 0,
    "sup_score": null,
    "sup_address": "嵊州市甘霖镇镇南工贸区",
    "sup_reg_money": "2000",
    "sup_demand_num": 0,
    "sup_enter_date": "2020-07-31",
    "created_datetime": "2020-08-30T07:35:20.000Z",
    "is_delete": 0}
    req.supplier.name = req.supplier.sup_name

    var H = {}, T = {}, R = {}
    //产品、Bom
    H.productBom = req.product
    T.productBom = req.bom
    R.productBom = { label: '产品BOM' }
    //1+n
    H.coreSupplier = req.core
    T.coreSupplier = req.supplier
    R.coreSupplier = { label: '合作' }

    //1、项目
    H.coreProject = req.core
    T.coreProject = req.pro_info
    R.coreProject = { label: '启动' }

    //n、产品
    H.supplierProduct = req.supplier
    T.supplierProduct = req.product
    R.supplierProduct = { label: '供应' }

    //产品、1
    H.productCore = req.product
    T.productCore = req.core
    R.productCore = { label: '交付' }

    //项目、设计
    var index = 0

    req.designParts.forEach(designPart => {
        var name1 = "projectDesign_" + index
        designPart.value = designPart.label
        designPart.name = designPart.label
        designPart.label = "[designParts,设计]"

        H[name1] = req.pro_info
        T[name1] = designPart
        R[name1] = { label: '研发' }

        var index2 = 0
        if (designPart.resource.length != 0) {
            designPart.resource.forEach(i => {
                //设计、资源
                var name2 = "designResource_" + index + index2
                // designPart.value = designPart.label
                // designPart.label = "[designParts,设计]"
                i.label = "[paper,论文]"

                H[name2] = designPart
                if (i.KAuthors.length != 0) {
                    T[name2] = { "KAuthors": i.KAuthors[0].name, "abstractText": i.abstractText, "knowledgetype": i.knowledgetype.name, "titleName": i.titleName, label: i.label }
                }
                else {
                    T[name2] = { "abstractText": i.abstractText, "knowledgetype": i.knowledgetype.name, "titleName": i.titleName, label: i.label }
                }
                R[name2] = { label: '参考' }
                index2 = index2 + 1
            })
        }
        index = index + 1
    }
    )

    //设计、产品
    index = 0
    req.designParts.forEach(designPart => {
        var name = "designProduct_" + index
        // designPart.value = designPart.label
        // designPart.label = "[designParts,设计]"
        H[name] = designPart
        T[name] = req.product
        R[name] = { label: '新产品' }
        index = index + 1
    })


    var exData = {};

    var NODE = [];

    var LINK = [];

    var id = [];

    var count = 0

    const res1 = await (new Promise(function (resolve, reject) {

        graphdb.mergeRelationshipBatchEntity(H, T)
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

    const res = await (new Promise(function (resolve, reject) {

        // graphdb.mergeRelationshipBatchEntity(H, T)

        graphdb.mergeRelationshipBatchRel(H, R, T)
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
    this.body = res
}

module.exports = dataDesign

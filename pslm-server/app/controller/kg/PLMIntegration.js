/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
const graphdb = require('../../neo4j.js')
const axios = require('axios');
const { formatDateTime } = require('../../util/util')
const querystring = require('querystring');
const url = require('url');


async function PLMIntegration() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)

    // const req = test
    // req.pro_info = JSON.parse(req.pro_info)

    //const req = JSON.stringify(this.request.body)
    const date = new Date()
    var req = this.request.body
    // console.log("######", req.data)
    // req = JSON.parse(req.data)

    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    params.created_datetime = formatDateTime(date);

    // function preprocess(triples) {
    //     var H = {}, T = {}, R = {}
    //     triples.forEach(triple => {
    //         var czy = ["武汉", "黄石", "鄂州", "黄冈", "孝感", "咸宁", "仙桃", "潜江", "天门", "襄阳", "宜昌", "荆州", "荆门", "长沙", "株洲", "湘潭", "岳阳", "益阳", "常德", "衡阳", "娄底", "南昌", "九江", "景德镇", "鹰潭", "新余", "宜春", "萍乡", "上饶", "抚州", "吉安"]
    //         var hc = ["哈尔滨", "大庆", "齐齐哈尔", "绥化", "牡丹江", "长春", "吉林", "四平", "辽源", "松原", "延边"]
    //         var cy = ["成都", "重庆", "自贡", "泸州", "德阳", "遂宁", "内江", "乐山", "南充", "眉山", "宜宾", "广安", "资阳", "绵阳", "达州", "雅安"]
    //         var csj = ["上海", "南京", "无锡", "常州", "苏州", "南通", "盐城", "扬州", "镇江", "泰州", "杭州", "宁波", "嘉兴", "湖州", "绍兴", "金华", "舟山", "台州", "合肥", "芜湖", "马鞍山", "铜陵", "安庆", "滁州", "池州", "宣城"]
    //         var zy = ["郑州", "洛阳", "开封", "南阳", "安阳", "商丘", "新乡", "平顶山", "许昌", "焦作", "周口", "信阳", "驻马店", "鹤壁", "濮阳", "漯河", "三门峡", "济源", "长治", "晋城", "运城", "邢台", "邯郸", "聊城", "菏泽", "宿州", "淮北", "蚌埠", "阜阳", "亳州"]
    //         var bbw = ["南宁", "北海", "钦州", "防城港", "玉林", "崇左", "湛江", "茂名", "阳江", "海口", "儋州", "东方", "澄迈", "临高", "昌江"]
    //         var gzpy = ["西安", "宝鸡", "咸阳", "铜川", "渭南", "商洛", "运城", "临汾", "天水", "平凉", "庆阳"]
    //         var hbey = ["呼和浩特", "包头", "鄂尔多斯", "榆林"]
    //         var lx = ["兰州", "西宁", "海东", "白银", "定西", "临夏回族自治州", "海北藏族自治州", "海南藏族自治州", "黄南藏族自治州"]
    //         var jjj = ["北京", "天津", "石家庄", "唐山", "保定", "秦皇岛", "廊坊", "沧州", "承德", "张家口"]

    //         if (triple._source.title != null && triple._source.org != null) {
    //             var standard = {}, orgs = [], authors = []
    //             standard.label = '标准'
    //             // org.label = '单位'

    //             standard.score = triple._score
    //             standard.id = triple._id

    //             if (triple._source.auids != null) {
    //                 triple._source.authorinfo.forEach(au => {
    //                     var author = {}
    //                     if (au.AUID) {
    //                         author.name = au.NAME
    //                         author.label = '作者'
    //                         author.id = au.AUID
    //                         authors.push(author)
    //                     }
    //                 })
    //             }
    //             else {
    //                 standard.author = triple._source.author
    //             }

    //             standard.abstract = triple._source.abstract
    //             standard.cc = triple._source.cc
    //             standard.keyword = triple._source.keyword
    //             standard.ekey = triple._source.ekey
    //             standard.date = triple._source.date
    //             standard.impdate = triple._source.impdate
    //             standard.dbid = triple._source.dbid
    //             standard.type = triple._source.type

    //             standard.impdate = triple._source.impdate
    //             standard.isid = triple._source.isid

    //             standard.issdate = triple._source.issdate
    //             standard.lan = triple._source.lan
    //             standard.sn = triple._source.sn
    //             standard.wid = triple._source.wid
    //             standard.status = triple._source.status
    //             standard.type = triple._source.type
    //             standard.weight = triple._source.weight

    //             standard.title = triple._source.title
    //             standard.tie = triple._source.tie
    //             standard.fname = triple._source.fname
    //             standard.ref = triple._source.ref
    //             standard.name = triple._source.title

    //             triple._source.org.split('%').forEach(au => {
    //                 var org = {}
    //                 org.name = au.split(/%| |,/)[0]
    //                 org.label = '单位'
    //                 // org.forgprovince = triple._source.forgprovince
    //                 // org.province = triple._source.orgprovince
    //                 // org.orgcity = triple._source.orgcity

    //                 czy.forEach(data => {
    //                     if (org.name.includes(data)) {
    //                         standard.urbanCluster = '长江中游城市群'
    //                     }
    //                 })
    //                 hc.forEach(data => {
    //                     if (org.name.includes(data)) {
    //                         standard.urbanCluster = '哈长城市群'
    //                     }
    //                 })
    //                 cy.forEach(data => {
    //                     if (org.name.includes(data)) {
    //                         standard.urbanCluster = '成渝城市群'
    //                     }
    //                 })
    //                 csj.forEach(data => {
    //                     if (org.name.includes(data)) {
    //                         standard.urbanCluster = '长江三角洲城市群'
    //                     }
    //                 })
    //                 zy.forEach(data => {
    //                     if (org.name.includes(data)) {
    //                         standard.urbanCluster = '中原城市群'
    //                     }
    //                 })
    //                 bbw.forEach(data => {
    //                     if (org.name.includes(data)) {
    //                         standard.urbanCluster = '北部湾城市群'
    //                     }
    //                 })
    //                 gzpy.forEach(data => {
    //                     if (org.name.includes(data)) {
    //                         standard.urbanCluster = '关中平原城市群'
    //                     }
    //                 })
    //                 hbey.forEach(data => {
    //                     if (org.name.includes(data)) {
    //                         standard.urbanCluster = '呼包鄂榆城市群'
    //                     }
    //                 })
    //                 lx.forEach(data => {
    //                     if (org.name.includes(data)) {
    //                         standard.urbanCluster = '兰西城市群'
    //                     }
    //                 })
    //                 jjj.forEach(data => {
    //                     if (org.name.includes(data)) {
    //                         standard.urbanCluster = '京津冀城市群'
    //                     }
    //                 })
    //                 orgs.push(org)
    //             })

    //             if (authors.length > 0) {
    //                 authors.forEach(author => {
    //                     var name1 = 'standard_' + standard.title + '_author_' + author.name
    //                     H[name1] = standard
    //                     R[name1] = { label: '作者' }
    //                     T[name1] = author

    //                     // var name = '_author_' + author.name
    //                     // H[name] = author
    //                     // hUpAu[name] = author
    //                 })
    //             }
    //             orgs.forEach(org => {
    //                 var name2 = 'standard_' + standard.title + '_org_' + org.name
    //                 H[name2] = standard
    //                 R[name2] = { label: '发行单位' }
    //                 T[name2] = org
    //             })
    //         }

    //     })
    //     var obj = {}
    //     obj["H"] = H
    //     obj["R"] = R
    //     obj["T"] = T
    //     return obj
    // }

    var exData = {};

    var NODE = [];

    var LINK = [];

    var id = [];

    var count = 0

    var i1 = 0, j1 = 1

    // var obj = preprocess(req.hits.hits)

    // merge 结点
    if (req.PLM === 'ZDLKPLM') {
        // merge node of BOM
        var res1 = await (new Promise(function (resolve, reject) {
            graphdb.mergePLMOnEntity(req.PLM, req.productID)
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
                    reject(response1)
                })
        }).then(function (response1) {
            console.log(response1)
            return JSON.stringify(response1)
        })
        )
        // get BOM Material
        var res2 = await (new Promise(function (resolve, reject) {
            graphdb.mergePLMOnEntityMaterial()
                .then(result => {
                    const response2 = {
                        code: 20000,
                        msg: 'database request success'
                    }
                    resolve(response2)
                })
                .catch(error => {
                    const response2 = {
                        code: 50000,
                        msg: 'database request bad',
                    }
                    reject(response2)
                })
        }).then(function (response2) {
            console.log(response2)
            return JSON.stringify(response2)
        })
        )
        // get BOM Label
        var res0 = await (new Promise(function (resolve, reject) {
            graphdb.mergePLMOnEntityLabel()
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
                    reject(response0)
                })
        }).then(function (response0) {
            console.log(response0)
            return JSON.stringify(response0)
        })
        )
        // merge rel of BOM
        var res3 = await (new Promise(function (resolve, reject) {
            graphdb.mergePLMRelationshipBatchRelLabel(req.PLM, req.productID)
                .then(result => {
                    const response3 = {
                        code: 20000,
                        msg: 'database request success'
                    }
                    resolve(response3)
                })
                .catch(error => {
                    const response3 = {
                        code: 50000,
                        msg: 'database request bad',
                    }
                    reject(response3)
                })
        }).then(function (response3) {
            console.log(response3)
            return JSON.stringify(response3)
        })
        )
        // merge supplier node
        var res4 = await (new Promise(function (resolve, reject) {
            graphdb.mergePLMSupplierOnEntity(req.PLM)
                .then(result => {
                    const response4 = {
                        code: 20000,
                        msg: 'database request success'
                    }
                    resolve(response4)
                })
                .catch(error => {
                    const response4 = {
                        code: 50000,
                        msg: 'database request bad',
                    }
                    reject(response4)
                })
        }).then(function (response4) {
            console.log(response4)
            return JSON.stringify(response4)
        })
        )
        // merge supplier-product rel
        var res = await (new Promise(function (resolve, reject) {
            graphdb.mergePLMSupplierRelationshipBatchRelLabel(req.PLM)
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
        }).then(function (response) {
            console.log(response)
            return JSON.stringify(response)
        })
        )
    }
    this.body = res
}

module.exports = PLMIntegration

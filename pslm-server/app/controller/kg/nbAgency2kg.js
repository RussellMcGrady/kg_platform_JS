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
const { createCipher } = require('crypto');

async function nbagency2kg() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)

    // const req = test
    // req.pro_info = JSON.parse(req.pro_info)

    //const req = JSON.stringify(this.request.body)
    const date = new Date()
    var req = this.request.body

    req = JSON.parse(req.data)
    // 上一步可以返回totalItemCout字段
    req = JSON.parse(req).data

    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    params.created_datetime = formatDateTime(date);

    function preprocess(triples) {
        var H = {}, R = {}, T = {}, hUpA = {}, hA = {}
        triples.forEach(triple => {
            var czy = ["武汉", "黄石", "鄂州", "黄冈", "孝感", "咸宁", "仙桃", "潜江", "天门", "襄阳", "宜昌", "荆州", "荆门", "长沙", "株洲", "湘潭", "岳阳", "益阳", "常德", "衡阳", "娄底", "南昌", "九江", "景德镇", "鹰潭", "新余", "宜春", "萍乡", "上饶", "抚州", "吉安"]
            var hc = ["哈尔滨", "大庆", "齐齐哈尔", "绥化", "牡丹江", "长春", "吉林", "四平", "辽源", "松原", "延边"]
            var cy = ["成都", "重庆", "自贡", "泸州", "德阳", "遂宁", "内江", "乐山", "南充", "眉山", "宜宾", "广安", "资阳", "绵阳", "达州", "雅安"]
            var csj = ["上海", "南京", "无锡", "常州", "苏州", "南通", "盐城", "扬州", "镇江", "泰州", "杭州", "宁波", "嘉兴", "湖州", "绍兴", "金华", "舟山", "台州", "合肥", "芜湖", "马鞍山", "铜陵", "安庆", "滁州", "池州", "宣城"]
            var zy = ["郑州", "洛阳", "开封", "南阳", "安阳", "商丘", "新乡", "平顶山", "许昌", "焦作", "周口", "信阳", "驻马店", "鹤壁", "濮阳", "漯河", "三门峡", "济源", "长治", "晋城", "运城", "邢台", "邯郸", "聊城", "菏泽", "宿州", "淮北", "蚌埠", "阜阳", "亳州"]
            var bbw = ["南宁", "北海", "钦州", "防城港", "玉林", "崇左", "湛江", "茂名", "阳江", "海口", "儋州", "东方", "澄迈", "临高", "昌江"]
            var gzpy = ["西安", "宝鸡", "咸阳", "铜川", "渭南", "商洛", "运城", "临汾", "天水", "平凉", "庆阳"]
            var hbey = ["呼和浩特", "包头", "鄂尔多斯", "榆林"]
            var lx = ["兰州", "西宁", "海东", "白银", "定西", "临夏回族自治州", "海北藏族自治州", "海南藏族自治州", "黄南藏族自治州"]
            var jjj = ["北京", "天津", "石家庄", "唐山", "保定", "秦皇岛", "廊坊", "沧州", "承德", "张家口"]

            if (triple.agencyName !== null && triple.agencyName !== "") {
                var agency = {}, attr = {}, shareholders = [], executive = {}
                attr.label = "代理机构"
                agency.label = "代理机构"

                agency.name = triple.agencyName
                agency.agencyName = triple.agencyName
                agency.agencyCod = triple.agencyCod
                agency.agencystate = triple.agencystate
                agency.email = triple.email
                agency.fax = triple.fax
                agency.tel = triple.phone
                agency.serialId = triple.serialId
                agency.unitAddress = triple.unitAddress

                czy.forEach(data => {
                    if (agency.name.includes(data)) {
                        agency.urbanCluster = '长江中游城市群'
                    }
                })
                hc.forEach(data => {
                    if (agency.name.includes(data)) {
                        agency.urbanCluster = '哈长城市群'
                    }
                })
                cy.forEach(data => {
                    if (agency.name.includes(data)) {
                        agency.urbanCluster = '成渝城市群'
                    }
                })
                csj.forEach(data => {
                    if (agency.name.includes(data)) {
                        agency.urbanCluster = '长三角城市群'
                    }
                })
                zy.forEach(data => {
                    if (agency.name.includes(data)) {
                        agency.urbanCluster = '中原城市群'
                    }
                })
                bbw.forEach(data => {
                    if (agency.name.includes(data)) {
                        agency.urbanCluster = '北部湾城市群'
                    }
                })
                gzpy.forEach(data => {
                    if (agency.name.includes(data)) {
                        agency.urbanCluster = '关中平原城市群'
                    }
                })
                hbey.forEach(data => {
                    if (agency.name.includes(data)) {
                        agency.urbanCluster = '呼包鄂榆城市群'
                    }
                })
                lx.forEach(data => {
                    if (agency.name.includes(data)) {
                        agency.urbanCluster = '兰西城市群'
                    }
                })
                jjj.forEach(data => {
                    if (agency.name.includes(data)) {
                        agency.urbanCluster = '京津冀城市群'
                    }
                })
                attr.name = agency.name

                if (triple.legalPerson !== null && triple.legalPerson !== "") {
                    executive.name = triple.legalPerson
                    executive.agencyCod = triple.agencyCod
                    executive.label = "高管"

                    var name = agency.agencyCod + "_" + executive.name
                    H[name] = attr
                    R[name] = { label: '法人' }
                    T[name] = executive
                }
                if (triple.shareholders !== null && triple.shareholders !== "") {
                    triple.shareholders.split('、').forEach(sh => {
                        if (sh !== triple.legalPerson) {
                            var shareholder = {}
                            shareholder.name = sh
                            shareholder.label = '高管'
                            shareholder.agencyCod = triple.agencyCod
                            shareholders.push(shareholder)
                        }
                    })
                    shareholders.forEach(shareholder => {
                        var name1 = 'agency_' + agency.agencyCod + '_shareholder_' + shareholder.name + shareholder.agencyCod
                        H[name1] = attr
                        R[name1] = { label: '股东' }
                        T[name1] = shareholder

                        var name2 = 'executive_' + executive.name + '_shareholder_' + shareholder.name + shareholder.agencyCod
                        H[name2] = executive
                        R[name2] = { label: '合伙人' }
                        T[name2] = shareholder
                    })
                }

                // attr.agencyCod = triple.agencyCod
                var name3 = 'agency' + attr.name
                hA[name3] = agency
                hUpA[name3] = attr
            }
        })
        var obj = {}
        obj["H"] = H
        obj["R"] = R
        obj["T"] = T
        obj["hA"] = hA
        obj["hUpA"] = hUpA
        return obj
    }

    var exData = {};

    var NODE = [];

    var LINK = [];

    var id = [];

    var count = 0

    var i1 = 0, j1 = 1

    var obj = preprocess(req)

    for (var aa in obj.hUpA) {
        var hTmp = {}
        hTmp[aa] = obj.hA[aa]
        var hUpTmp = {}
        hUpTmp[aa] = obj.hUpA[aa]

        // merge 结点
        var res1 = await (new Promise(function (resolve, reject) {
            graphdb.mergeOnEntity(hTmp, hUpTmp)
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

    for (var bb in obj.H) {
        var hTmp = {}
        hTmp[bb] = obj.H[bb]
        var hUpTmp = {}
        hUpTmp[bb] = obj.H[bb]

        var res2 = await (new Promise(function (resolve, reject) {
            graphdb.mergeOnEntity(hTmp, hUpTmp)
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
                    resolve(response2)
                })
                
        }).then(function (response2) {
            console.log(response2)
            return JSON.stringify(response2)
        })
        )
    }

    for (var cc in obj.T) {
        var tTmp = {}
        tTmp[cc] = obj.T[cc]
        var tUpTmp = {}
        tUpTmp[cc] = obj.T[cc]

        var res2 = await (new Promise(function (resolve, reject) {
            graphdb.mergeOnEntity(tTmp, tUpTmp)
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
                    resolve(response3)
                })
                
        }).then(function (response3) {
            console.log(response3)
            return JSON.stringify(response3)
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

module.exports = nbagency2kg

/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
const graphdb = require('../../neo4j.js')
const axios = require('axios');
const { formatDateTime } = require('../../util/util')
const querystring = require('querystring');
const url = require('url');


async function wfMeeting2kg() {
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
    req = JSON.parse(req.data)
    req = JSON.parse(req.EsSearchResult)

    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    params.created_datetime = formatDateTime(date);

    function preprocess(triples) {
        var H = {}, T = {}, R = {}, hO = {}, hUpO = {}, hJ = {}, hUpJ = {}
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

            if (triple._source.author != null && triple._source.ml != null && triple._source.title != null && (triple._source.forg != null || triple._source.pub != null)) {
                var meeting = {}, authors = [], org = {}, journal = {}, attrO = {}, attrJ = {}
                meeting.label = '会议论文'
                org.label = '单位'
                attrO.label = '单位'
                journal.label = '会议'
                attrJ.label = '会议'
                meeting.score = triple._score
                meeting.id = triple._id

                if (triple._source.auids != null) {
                    triple._source.authorinfo.forEach(au => {
                        var author = {}, auOrg = {}, attrauOrg = {}
                        if (au.AUID) {
                            author.name = au.NAME
                            author.label = '作者'
                            author.id = au.AUID

                            auOrg.name = au.ORG[0]
                            auOrg.label = '单位'
                            attrauOrg.label = '单位'
                            attrauOrg.name = auOrg.name

                            auOrg.FUNIT = au.FUNIT[0]
                            auOrg.province = au.ORGPROVINCE[0]
                            auOrg.city = au.ORGCITY[0]
                            auOrg.id = au.ORGID
                            auOrg.SUNIT = au.SUNIT[0]
                            auOrg.SUNIT = au.SUNIT[0]
                            
                            var name3 = 'author_' + author.name + '_org_' + auOrg.name
                            H[name3] = author
                            R[name3] = { label: '所属单位' }
                            T[name3] = attrauOrg
                            hO[name3] = auOrg
                            hUpO[name3] = attrauOrg

                            authors.push(author)
                        }
                    })
                }
                else {
                    meeting.author = triple._source.author
                }

                meeting.abstract = triple._source.abstract
                meeting.eab = triple._source.eab
                meeting.date = triple._source.date
                meeting.doi = triple._source.doi
                meeting.eissn = triple._source.eissn
                meeting.issn = triple._source.issn
                meeting.pno = triple._source.pno
                meeting.lan = triple._source.lan
                meeting.pp = triple._source.pp
                meeting.pub = triple._source.pub
                meeting.type = triple._source.type

                if (triple._source.fpn != null) {
                    meeting.fund = triple._source.fpn
                }
                else {
                    meeting.fund = triple._source.fund
                }
                meeting.fundsupport = triple._source.fundsupport

                journal.ml = triple._source.ml
                journal.mn = triple._source.mn
                journal.hn = triple._source.hn
                journal.hid = triple._source.hid

                journal.name = triple._source.mn
                attrJ.name = triple._source.mn
                attrJ.hid = triple._source.hid

                if (triple._source.forg != null) {
                    org.name = triple._source.forg.split(/%| |,/)[0]
                }
                else if (triple._source.pub != null) {
                    org.name = triple._source.pub.split(/%| |,/)[0]
                } else { org.name = triple._source.pp }

                org.orgcgx = triple._source.orgcgx
                org.orgcgxid = triple._source.orgcgxid
                org.orgcity = triple._source.orgcity
                org.orgclass = triple._source.orgclass
                org.orgcys = triple._source.orgcys
                org.orgcysid = triple._source.orgcysid
                org.orgprovince = triple._source.orgprovince
                if (triple._source.orgcity != null) {
                    meeting.city = triple._source.orgcity
                } else if (triple._source.forg != null) {
                    meeting.city = triple._source.forg
                } else { meeting.city = triple._source.pp }

                attrO.name = org.name
                czy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '长江中游城市群'
                        meeting.urbanCluster = '长江中游城市群'
                    }
                })
                hc.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '哈长城市群'
                        meeting.urbanCluster = '哈长城市群'
                    }
                })
                cy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '成渝城市群'
                        meeting.urbanCluster = '成渝城市群'
                    }
                })
                csj.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '长三角城市群'
                        meeting.urbanCluster = '长三角城市群'
                    }
                })
                zy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '中原城市群'
                        meeting.urbanCluster = '中原城市群'
                    }
                })
                bbw.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '北部湾城市群'
                        meeting.urbanCluster = '北部湾城市群'
                    }
                })
                gzpy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '关中平原城市群'
                        meeting.urbanCluster = '关中平原城市群'
                    }
                })
                hbey.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '呼包鄂榆城市群'
                        meeting.urbanCluster = '呼包鄂榆城市群'
                    }
                })
                lx.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '兰西城市群'
                        meeting.urbanCluster = '兰西城市群'
                    }
                })
                jjj.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '京津冀城市群'
                        meeting.urbanCluster = '京津冀城市群'
                    }
                })

                meeting.keyword = triple._source.keyword
                meeting.ekey = triple._source.ekey

                meeting.title = triple._source.title
                meeting.weight = triple._source.weight
                meeting.wid = triple._source.wid

                meeting.name = triple._source.title
                if (authors.length > 0) {
                    authors.forEach(author => {
                        var name1 = 'meeting_' + meeting.title + '_author_' + author.name
                        H[name1] = meeting
                        R[name1] = { label: '作者' }
                        T[name1] = author
                        var name3 = 'author_' + author.name + '_org_' + org.name
                        H[name3] = author
                        R[name3] = { label: '所属单位' }
                        T[name3] = attrO
                        var name4 = 'author_' + author.name + '_journal_' + journal.name
                        H[name4] = author
                        R[name4] = { label: '投稿' }
                        T[name4] = attrJ
                        var name = '_author_' + author.name
                        // H[name] = author
                    })
                }

                var name2 = 'meeting_' + meeting.title + '_journal_' + journal.name
                H[name2] = meeting
                R[name2] = { label: '发表' }
                T[name2] = attrJ

                var name5 = 'meeting_' + meeting.title + '_org_' + org.name
                H[name5] = meeting
                R[name5] = { label: '所属单位' }
                T[name5] = attrO

                hO[name2] = org
                hUpO[name2] = attrO
                hJ[name2] = journal
                hUpJ[name2] = attrJ
            }

        })
        var obj = {}
        obj["H"] = H
        obj["R"] = R
        obj["T"] = T
        obj["hO"] = hO
        obj["hUpO"] = hUpO
        obj["hJ"] = hJ
        obj["hUpJ"] = hUpJ
        return obj
    }

    var exData = {};

    var NODE = [];

    var LINK = [];

    var id = [];

    var count = 0

    var i1 = 0, j1 = 1

    var obj = preprocess(req.hits.hits)

    for (var bb in obj.hUpO) {
        var hTmp = {}
        hTmp[bb] = obj.hO[bb]
        var hUpTmp = {}
        hUpTmp[bb] = obj.hUpO[bb]

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
    for (var dd in obj.hUpJ) {
        var hTmp = {}
        hTmp[dd] = obj.hJ[dd]
        var hUpTmp = {}
        hUpTmp[dd] = obj.hUpJ[dd]

        // merge 结点
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

    // merge 结点
    for (var cc in obj.H) {
        var hTmp = {}
        hTmp[cc] = obj.H[cc]
        var tTmp = {}
        tTmp[cc] = obj.H[cc]
        // merge 结点
        var res1 = await (new Promise(function (resolve, reject) {
            graphdb.mergeOnEntity(hTmp, tTmp)
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

    // merge 结点
    for (var ee in obj.T) {
        var hTmp = {}
        hTmp[ee] = obj.T[ee]
        var tTmp = {}
        tTmp[ee] = obj.T[ee]
        // merge 结点
        var res3 = await (new Promise(function (resolve, reject) {
            graphdb.mergeOnEntity(hTmp, tTmp)
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

module.exports = wfMeeting2kg
/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
const graphdb = require('../../neo4j.js')
const axios = require('axios');
const { formatDateTime } = require('../../util/util')
const querystring = require('querystring');
const url = require('url');

const { createCipher } = require('crypto');

async function wfRef2kg() {
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
        var H = {}, T = {}, R = {}, hO = {}, hUpO = {}, hOY = {}, hUpOY = {}
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

            if (triple._source.title != null && triple._source.type != null && triple._source.ywtitle != null && triple._source.ywtype != null && triple._source.author != null && triple._source.ywauthor != null && triple._source.org != null && triple._source.yworg != null) {
                var paper = {}, ywpaper = {}, authors = [], ywauthors = [], org = {}, yworg = {}, attrO = {}, attrOY = {}
                org.label = '单位'
                attrO.label = '单位'
                yworg.label = '单位'
                attrOY.label = '单位'
                ywpaper.score = triple._score

                if (triple._source.authorid != null) {
                    i = 0
                    triple._source.author.split('%').forEach(au => {
                        var author = {}
                        author.name = au
                        author.label = '作者'
                        author.id = triple._source.authorid.split('%')[i]
                        authors.push(author)
                        i = i + 1
                    })
                }
                else {
                    paper.author = triple._source.author
                }

                if (triple._source.fpn != null) {
                    paper.fund = triple._source.fpn
                }
                else {
                    paper.fund = triple._source.fund
                }

                org.name = triple._source.org.split(/%| |,/)[0]
                org.orgcity = triple._source.orgcity
                org.orgid = triple._source.orgid
                org.orgprovince = triple._source.orgprovince
                org.orgclass = triple._source.orgtype
                attrO.name = org.name
                czy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '长江中游城市群'
                        paper.urbanCluster = '长江中游城市群'
                    }
                })
                hc.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '哈长城市群'
                        paper.urbanCluster = '哈长城市群'
                    }
                })
                cy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '成渝城市群'
                        paper.urbanCluster = '成渝城市群'
                    }
                })
                csj.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '长三角城市群'
                        paper.urbanCluster = '长三角城市群'
                    }
                })
                zy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '中原城市群'
                        paper.urbanCluster = '中原城市群'
                    }
                })
                bbw.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '北部湾城市群'
                        paper.urbanCluster = '北部湾城市群'
                    }
                })
                gzpy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '关中平原城市群'
                        paper.urbanCluster = '关中平原城市群'
                    }
                })
                hbey.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '呼包鄂榆城市群'
                        paper.urbanCluster = '呼包鄂榆城市群'
                    }
                })
                lx.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '兰西城市群'
                        paper.urbanCluster = '兰西城市群'
                    }
                })
                jjj.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '京津冀城市群'
                        paper.urbanCluster = '京津冀城市群'
                    }
                })
                paper.id = triple._source.lwid
                paper.title = triple._source.title
                paper.type = triple._source.type
                paper.label = paper.type
                paper.ckey = triple._source.ckey
                paper.ekey = triple._source.ekey
                paper.doi = triple._source.doi
                paper.subscore = triple._source.score
                paper.vol = triple._source.vol
                paper.patt = triple._source.patt

                paper.joucn = triple._source.joucn
                paper.jouid = triple._source.jouid
                paper.mn = triple._source.mn
                paper.name = paper.title

                if (triple._source.ckey != null) {
                    paper.keyword = triple._source.ckey
                }
                else if (triple._source.ekey != null) {
                    paper.keyword = triple._source.ekey
                }

                ywpaper.title = triple._source.ywtitle
                ywpaper.type = triple._source.ywtype
                ywpaper.label = ywpaper.type

                ywpaper.ckey = triple._source.ywckey
                ywpaper.doi = triple._source.ywdoi
                ywpaper.ekey = triple._source.ywekey
                ywpaper.fund = triple._source.ywfund
                ywpaper.patt = triple._source.ywpatt
                ywpaper.subscore = triple._source.ywscore
                ywpaper.name = triple._source.ywtitle
                ywpaper.degree = triple._source.ywdegree
                ywpaper.id = triple._source.ywid
                ywpaper.teacher = triple._source.ywtea
                ywpaper.joucn = triple._source.ywjoucn
                ywpaper.jouid = triple._source.ywjouid
                ywpaper.mn = triple._source.ywwn

                if (triple._source.ywauthorid != null) {
                    i = 0
                    triple._source.ywauthor.split('%').forEach(au => {
                        var ywauthor = {}
                        ywauthor.name = au
                        ywauthor.label = '作者'
                        ywauthor.id = triple._source.ywauthorid.split('%')[i]
                        ywauthors.push(ywauthor)
                        i = i + 1
                    })
                }
                else {
                    ywpaper.author = triple._source.ywauthor
                }

                yworg.name = triple._source.yworg.split(/%| |,/)[0]
                yworg.orgcity = triple._source.yworgcity
                yworg.orgid = triple._source.yworgid
                yworg.orgprovince = triple._source.yworgprovince
                yworg.orgclass = triple._source.yworgtype
                attrOY.name = yworg.name
                czy.forEach(data => {
                    if (yworg.name.includes(data)) {
                        yworg.urbanCluster = '长江中游城市群'
                        ywpaper.urbanCluster = '长江中游城市群'
                    }
                })
                hc.forEach(data => {
                    if (yworg.name.includes(data)) {
                        yworg.urbanCluster = '哈长城市群'
                        ywpaper.urbanCluster = '哈长城市群'
                    }
                })
                cy.forEach(data => {
                    if (yworg.name.includes(data)) {
                        yworg.urbanCluster = '成渝城市群'
                        ywpaper.urbanCluster = '成渝城市群'
                    }
                })
                csj.forEach(data => {
                    if (yworg.name.includes(data)) {
                        yworg.urbanCluster = '长三角城市群'
                        ywpaper.urbanCluster = '长三角城市群'
                    }
                })
                zy.forEach(data => {
                    if (yworg.name.includes(data)) {
                        yworg.urbanCluster = '中原城市群'
                        ywpaper.urbanCluster = '中原城市群'
                    }
                })
                bbw.forEach(data => {
                    if (yworg.name.includes(data)) {
                        yworg.urbanCluster = '北部湾城市群'
                        ywpaper.urbanCluster = '北部湾城市群'
                    }
                })
                gzpy.forEach(data => {
                    if (yworg.name.includes(data)) {
                        yworg.urbanCluster = '关中平原城市群'
                        ywpaper.urbanCluster = '关中平原城市群'
                    }
                })
                hbey.forEach(data => {
                    if (yworg.name.includes(data)) {
                        yworg.urbanCluster = '呼包鄂榆城市群'
                        ywpaper.urbanCluster = '呼包鄂榆城市群'
                    }
                })
                lx.forEach(data => {
                    if (yworg.name.includes(data)) {
                        yworg.urbanCluster = '兰西城市群'
                        ywpaper.urbanCluster = '兰西城市群'
                    }
                })
                jjj.forEach(data => {
                    if (yworg.name.includes(data)) {
                        yworg.urbanCluster = '京津冀城市群'
                        ywpaper.urbanCluster = '京津冀城市群'
                    }
                })

                var name = 'paper_' + paper.title + '_ywpaper_' + ywpaper.title
                H[name] = ywpaper
                R[name] = { label: '引用' }
                T[name] = paper
                hO[name] = org
                hUpO[name] = attrO
                hOY[name] = yworg
                hUpOY[name] = attrOY

                if (authors.length > 0) {
                    authors.forEach(author => {
                        var name1 = 'paper_' + paper.title + '_author_' + author.name
                        H[name1] = paper
                        R[name1] = { label: '作者' }
                        T[name1] = author
                        var name3 = 'author_' + author.name + '_org_' + org.name
                        H[name3] = author
                        R[name3] = { label: '所属单位' }
                        T[name3] = attrO
                        var name = '_author_' + author.name
                        // H[name] = author
                    })
                }
                if (ywauthors.length > 0) {
                ywauthors.forEach(ywauthor => {
                    var ywname1 = 'paper_' + ywpaper.title + '_author_' + ywauthor.name
                    H[ywname1] = ywpaper
                    R[ywname1] = { label: '作者' }
                    T[ywname1] = ywauthor
                    var ywname3 = 'author_' + ywauthor.name + '_org_' + yworg.name
                    H[ywname3] = ywauthor
                    R[ywname3] = { label: '所属单位' }
                    T[ywname3] = attrOY
                    var name = '_ywauthor_' + ywauthor.name
                    // H[name] = ywauthor
                })
            }
            }

        })
        var obj = {}
        obj["H"] = H
        obj["R"] = R
        obj["T"] = T
        obj["hO"] = hO
        obj["hUpO"] = hUpO
        obj["hOY"] = hOY
        obj["hUpOY"] = hUpOY
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


    for (var cc in obj.hUpOY) {
        var hTmp = {}
        hTmp[cc] = obj.hOY[cc]
        var hUpTmp = {}
        hUpTmp[cc] = obj.hUpOY[cc]

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

module.exports = wfRef2kg

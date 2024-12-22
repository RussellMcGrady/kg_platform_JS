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

async function wfPatent2kg() {
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
        var H = {}, T = {}, R = {}, hA = {}, hUpA = {}, hO = {}, hUpO = {}
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
            if ((triple._source.author != null || triple._source.reqpep != null) && triple._source.title != null && triple._source.agency != null && triple._source.org != null) {
                var patent = {}, authors = [], agency = {}, attrA = {}, org = {}, attrO = {}
                patent.label = '专利'
                agency.label = '代理机构'
                attrA.label = '代理机构'
                org.label = '单位'
                attrO.label = '单位'

                patent.score = triple._score
                patent.id = triple._id

                patent.abstract = triple._source.abstract
                patent.eab = triple._source.eab
                patent.dbid = triple._source.dbid
                patent.pubpath = triple._source.pubpath
                patent.weight = triple._source.weight

                if (triple._source.agency === null) {
                    agency.name = 'null'
                }
                else {
                    // 待验证
                    agency.name = triple._source.agency.split(' ')[0].split('(普通合伙)')[0].split('（普通合伙）')[0]
                    agency.agencyName = agency.name
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
                    agency.agent = triple._source.agent
                }
                org.name = triple._source.org.split(/%| |,/)[0]
                org.orgid = triple._source.orgcfshid
                org.orgprovince = triple._source.orgprovince
                org.orgcity = triple._source.orgcity
                org.orgclass = triple._source.orgclass
                org.orgcsh = triple._source.orgcsh
                org.orgcshid = triple._source.orgcshid
                org.orgtype = triple._source.orgtype

                attrA.name = agency.name
                attrO.name = org.name

                czy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '长江中游城市群'
                        patent.urbanCluster = '长江中游城市群'
                    }
                })
                hc.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '哈长城市群'
                        patent.urbanCluster = '哈长城市群'
                    }
                })
                cy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '成渝城市群'
                        patent.urbanCluster = '成渝城市群'
                    }
                })
                csj.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '长三角城市群'
                        patent.urbanCluster = '长三角城市群'
                    }
                })
                zy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '中原城市群'
                        patent.urbanCluster = '中原城市群'
                    }
                })
                bbw.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '北部湾城市群'
                        patent.urbanCluster = '北部湾城市群'
                    }
                })
                gzpy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '关中平原城市群'
                        patent.urbanCluster = '关中平原城市群'
                    }
                })
                hbey.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '呼包鄂榆城市群'
                        patent.urbanCluster = '呼包鄂榆城市群'
                    }
                })
                lx.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '兰西城市群'
                        patent.urbanCluster = '兰西城市群'
                    }
                })
                jjj.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '京津冀城市群'
                        patent.urbanCluster = '京津冀城市群'
                    }
                })

                patent.type = triple._source.type
                patent.anno = triple._source.anno
                patent.annodate = triple._source.annodate
                patent.country = triple._source.country
                patent.dom = triple._source.dom
                patent.keyword = triple._source.keyword
                patent.ls = triple._source.ls
                patent.maincls = triple._source.maincls
                patent.patno = triple._source.patno
                patent.patt = triple._source.patt
                patent.reqaddr = triple._source.reqaddr
                patent.reqno = triple._source.reqno
                patent.reqpep = triple._source.reqpep
                patent.title = triple._source.title
                patent.name = triple._source.title

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
                    patent.author = triple._source.author
                }
                if (authors.length > 0) {
                    authors.forEach(author => {
                        var name1 = 'patent_' + patent.title + '_author_' + author.name
                        H[name1] = patent
                        R[name1] = { label: '作者' }
                        T[name1] = author
                        var name4 = 'author_' + author.name + '_agency_' + agency.name
                        H[name4] = author
                        R[name4] = { label: '合作' }
                        T[name4] = attrA
                        var name = '_author_' + author.name
                        // H[name] = author
                        // hUpAu[name] = author
                    })
                }
                // var name1 = 'patent_' + patent.reqno + '_author_' + author.name
                var name2 = 'patent_' + patent.reqno + '_agengcy_' + agency.name
                // var name3 = 'author_' + author.name + '_org_' + org.name
                // var name4 = 'author_' + author.name + '_agency_' + agency.name

                // H[name1] = patent
                // R[name1] = { label: '作者' }
                // T[name1] = author

                H[name2] = patent
                R[name2] = { label: '申请机构' }
                T[name2] = attrA

                var name5 = 'patent_' + patent.title + '_org_' + org.name
                H[name5] = patent
                R[name5] = { label: '所属单位' }
                T[name5] = attrO

                hA[name2] = agency
                hUpA[name2] = attrA
                hO[name2] = org
                hUpO[name2] = attrO
            }
        })
        var obj = {}
        obj["H"] = H
        obj["R"] = R
        obj["T"] = T
        obj["hA"] = hA
        obj["hUpA"] = hUpA
        obj["hO"] = hO
        obj["hUpO"] = hUpO
        // obj["hAu"] = hAu
        // obj["hUpAu"] = hUpAu

        return obj
    }

    var exData = {};

    var NODE = [];

    var LINK = [];

    var id = [];

    var count = 0

    var i1 = 0, j1 = 1

    var obj = preprocess(req.hits.hits)

    // merge 关系
    for (var aa in obj.hUpA) {
        var hTmp = {}
        hTmp[aa] = obj.hA[aa]
        var hUpTmp = {}
        hUpTmp[aa] = obj.hUpA[aa]

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
    for (var bb in obj.hUpO) {
        var hTmp = {}
        hTmp[bb] = obj.hO[bb]
        var hUpTmp = {}
        hUpTmp[bb] = obj.hUpO[bb]

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
    // for (var dd in obj.hUpAu) {
    //     var hTmp = {}
    //     hTmp[dd] = obj.hAu[dd]
    //     var hUpTmp = {}
    //     hUpTmp[dd] = obj.hUpAu[dd]

    //     // merge 结点
    //     var res3 = await (new Promise(function (resolve, reject) {
    //         graphdb.mergeOnEntity(hTmp, hUpTmp)
    //             .then(result => {
    //                 const response3 = {
    //                     code: 20000,
    //                     msg: 'database request success'
    //                 }
    //                 resolve(response3)
    //             })
    //             .catch(error => {
    //                 const response3 = {
    //                     code: 50000,
    //                     msg: 'database request bad',
    //                 }
    //                 resolve(response3)
    //             })
    //             
    //     }).then(function (response3) {
    //         console.log(response3)
    //         return JSON.stringify(response3)
    //     })
    //     )
    // }

    // merge 结点
    for (var cc in obj.H) {
        var hTmp = {}
        hTmp[cc] = obj.H[cc]
        var tTmp = {}
        tTmp[cc] = obj.H[cc]
        // merge 结点
        var res4 = await (new Promise(function (resolve, reject) {
            graphdb.mergeOnEntity(hTmp, tTmp)
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
                    resolve(response4)
                })
                
        }).then(function (response4) {
            console.log(response4)
            return JSON.stringify(response4)
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
        var res2 = await (new Promise(function (resolve, reject) {
            graphdb.mergeOnEntity(hTmp, tTmp)
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

module.exports = wfPatent2kg

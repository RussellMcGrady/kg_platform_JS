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

async function wfScholar2kg() {
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

    function prepreocess(triples) {
        var H = {}, T = {}, R = {}, hO = {}, hUpO = {}, tO = {}, tUpO = {}
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

            if (triple._source.cname != null && triple._source.aorg != null) {
                var scholar = {}, org = {}, attrS = {}, attrO = {}
                scholar.label = '学者'
                org.label = '单位'
                attrO.label = '单位'
                attrS.label = '学者'

                scholar.score = triple._score
                scholar.id = triple._id
                scholar.WFid = triple._id

                scholar.abstract = triple._source.abstract
                scholar.address = triple._source.addr

                scholar.cname = triple._source.cname
                scholar.ename = triple._source.ename
                scholar.name = triple._source.cname
                scholar.personName = triple._source.cname
                scholar.degree = triple._source.degree
                scholar.direction = triple._source.direction
                scholar.researchField = scholar.researchField
                scholar.hornor = scholar.hornor
                scholar.edu = triple._source.edu
                scholar.city = triple._source.city
                scholar.province = triple._source.province
                scholar.county = triple._source.county
                scholar.email = triple._source.email
                scholar.freq = triple._source.freq
                scholar.h = triple._source.h
                scholar.quoteCount = triple._source.freq
                scholar.gender = triple._source.gender
                scholar.intro = triple._source.intro
                scholar.journalCount = triple._source.journalCount
                scholar.native = triple._source.native
                scholar.nativeSheng = triple._source.nativeSheng
                scholar.nativeShi = triple._source.nativeShi
                scholar.nativeXian = triple._source.nativeXian
                scholar.relfund = triple._source.relfund
                scholar.reljour = triple._source.reljour
                scholar.photopath = triple._source.photopath
                scholar.professionName = triple._source.title
                scholar.tel = triple._source.tel
                scholar.org = triple._source.aorg.split(/%| |,/)[0]

                attrS.name = triple._source.cname
                attrS.tel = triple._source.tel
                attrS.email = triple._source.email
                attrS.professionName = triple._source.title
                attrS.id = triple._id
                attrS.province = triple._source.province
                attrS.org = triple._source.aorg.split(/%| |,/)[0]

                if (scholar.city != null) {
                    czy.forEach(data => {
                        if (scholar.city.includes(data)) {
                            scholar.urbanCluster = '长江中游城市群'
                        }
                    })
                    hc.forEach(data => {
                        if (scholar.city.includes(data)) {
                            scholar.urbanCluster = '哈长城市群'
                        }
                    })
                    cy.forEach(data => {
                        if (scholar.city.includes(data)) {
                            scholar.urbanCluster = '成渝城市群'
                        }
                    })
                    csj.forEach(data => {
                        if (scholar.city.includes(data)) {
                            scholar.urbanCluster = '长三角城市群'
                        }
                    })
                    zy.forEach(data => {
                        if (scholar.city.includes(data)) {
                            scholar.urbanCluster = '中原城市群'
                        }
                    })
                    bbw.forEach(data => {
                        if (scholar.city.includes(data)) {
                            scholar.urbanCluster = '北部湾城市群'
                        }
                    })
                    gzpy.forEach(data => {
                        if (scholar.city.includes(data)) {
                            scholar.urbanCluster = '关中平原城市群'
                        }
                    })
                    hbey.forEach(data => {
                        if (scholar.city.includes(data)) {
                            scholar.urbanCluster = '呼包鄂榆城市群'
                        }
                    })
                    lx.forEach(data => {
                        if (scholar.city.includes(data)) {
                            scholar.urbanCluster = '兰西城市群'
                        }
                    })
                    jjj.forEach(data => {
                        if (scholar.city.includes(data)) {
                            scholar.urbanCluster = '京津冀城市群'
                        }
                    })
                }
                org.org = triple._source.org
                org.orgid = triple._source.orgid

                org.aorg = triple._source.aorg
                org.borg = triple._source.borg
                org.corg = triple._source.corg
                org.eorg = triple._source.eorg

                org.name = triple._source.aorg.split(/%| |,/)[0]
                attrO.name = org.name

                czy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '长江中游城市群'
                    }
                })
                hc.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '哈长城市群'
                    }
                })
                cy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '成渝城市群'
                    }
                })
                csj.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '长三角城市群'
                    }
                })
                zy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '中原城市群'
                    }
                })
                bbw.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '北部湾城市群'
                    }
                })
                gzpy.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '关中平原城市群'
                    }
                })
                hbey.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '呼包鄂榆城市群'
                    }
                })
                lx.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '兰西城市群'
                    }
                })
                jjj.forEach(data => {
                    if (org.name.includes(data)) {
                        org.urbanCluster = '京津冀城市群'
                    }
                })

                var name2 = 'scholar_' + scholar.name + '_org_' + org.name

                H[name2] = attrS
                R[name2] = { label: '所属单位' }
                T[name2] = attrO
                hO[name2] = scholar
                hUpO[name2] = attrS
                tO[name2] = org
                tUpO[name2] = attrO
            }

        })
        var obj = {}
        obj["H"] = H
        obj["R"] = R
        obj["T"] = T
        obj["hO"] = hO
        obj["hUpO"] = hUpO
        obj["tO"] = tO
        obj["tUpO"] = tUpO
        // obj["tO"] = tO
        // obj["tUpO"] = tUpO
        return obj
    }

    var exData = {};

    var NODE = [];

    var LINK = [];

    var id = [];

    var count = 0

    var i1 = 0, j1 = 1

    var obj = prepreocess(req.hits.hits)

    for (var aa in obj.hUpO) {
        var hTmp = {}
        hTmp[aa] = obj.hO[aa]
        var hUpTmp = {}
        hUpTmp[aa] = obj.hUpO[aa]

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
    
    for (var bb in obj.tUpO) {
        var tTmp = {}
        tTmp[bb] = obj.tO[bb]
        var tUpTmp = {}
        tUpTmp[bb] = obj.tUpO[bb]
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
    // merge 结点
    // var res1 = await (new Promise(function (resolve, reject) {
    //     graphdb.mergeRelationshipBatchEntity(obj.H, obj.T)
    //         .then(result => {
    //             const response1 = {
    //                 code: 20000,
    //                 msg: 'database request success'
    //             }
    //             resolve(response1)
    //         })
    //         .catch(error => {
    //             const response1 = {
    //                 code: 50000,
    //                 msg: 'database request bad',
    //             }
    //             resolve(response1)
    //         })
    //         
    // }).then(function (response1) {
    //     console.log(response1)
    //     return JSON.stringify(response1)
    // })
    // )

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

module.exports = wfScholar2kg

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

async function wfKjResource2kg() {
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
    req.H = JSON.parse(req.H)
    req.R = JSON.parse(req.R)
    req.T = JSON.parse(req.T)
    // req = JSON.parse(req.data)

    // req = {
    //     "H":{
    //     "label":"用户",
    //     "name": "周俊杰",
    //     "id": "1",
    //     "avatar": "",
    //     "company_id":"1",
    //     "company_name": "浙江月立电器有限公司"
    //     },
    //     "R":{
    //       "label": "专利" 
    //     },
    //   "T":{
    //   "label":"专利",
    //   "_id": "ZLW20200414000001230319",
    //   "_index": "wf_mds_chn_zhuanli",
    //   "_score": "117.98659",
    //   "_source": {
    //   "abstract": "本发明属于资源管理的技术领域,具体公开了一种科技资源管理方法包括如下步骤:步骤1:分析资源的数据生命周期;步骤2:分析资源的科技资源需求层次;步骤3:将科技资源进行大数据处理;数据生命周期包括包括将资源分为产生期、整合优化期、存储期、服务期和衰退期,科技资源需求层次包括包括将资源分为获取需求、拥有需求、交互需求、质量需求和共享需求,大数据处理将包括将资源分为数据层、处理层和应用层.其可以保障战略目标实现,其还可以提高生产力、竞争力,以达到科技资源利用率的最大化.",
    //   "agency": "北京名华博信知识产权代理有限公司",
    //   "agent": "薛飞",
    //   "anno": "CN110851509A",
    //   "annodate": "2020-02-28",
    //   "au": "徐迪威%马志平%罗亮%林珠%方少亮%李海威%陈树敏",
    //   "auid": null,
    //   "auids": null,
    //   "author": "徐迪威%马志平%罗亮%林珠%方少亮%李海威%陈树敏",
    //   "authorid": null,
    //   "cate": null,
    //   "cdid": null,
    //   "certdate": null,
    //   "cid": "TP3%F25",
    //   "ckey": "科技资源%数据处理%资源管理%需求层次%生命周期%资源利用率%质量需求%整合优化%目标实现%交互需求",
    //   "cls": "G06F16/25(2019.01)%G06F16/2458(2019.01)%G06F16/901(2019.01)%G06F16/903(2019.01)%G%G06%G06F%G06F16%G06F16/25%G06F16/2458%G06F16/901%G06F16/903",
    //   "country": "广东",
    //   "date": "2019-09-10",
    //   "dbid": "FMZL",
    //   "dec": null,
    //   "dmcls": "G06F",
    //   "doctype": "zhuanli",
    //   "dom": "1.一种科技资源管理方法,其特征在于包括如下步骤: 步骤1:分析资源的数据生命周期; 步骤2:分析资源的科技资源需求层次; 步骤3:将科技资源进行大数据处理; 所述数据生命周期包括包括将资源分为产生期、整合优化期、存储期、服务期和衰退期,所述科技资源需求层次包括包括将资源分为获取需求、拥有需求、交互需求、质量需求和共享需求,所述大数据处理将包括将资源分为数据层、处理层和应用层. 2.根据权利要求1所述的科技资源管理方法,其特征在于:所述产生期包括资源提供商产生在自我运作或经授权许可使用时产生特定资源的期间. 3.根据权利要求1所述的科技资源管理方法,其特征在于:所述整合优化期包括资源提供商或资源整合商在对元数据进行整合、优化、加工、提炼的期间. 4.根据权利要求1所述的科技资源管理方法,其特征在于:所述存储期包括资源在多种介质上存储的期间,所述介质包括磁盘、纸张、仓库、磁带或光盘. 5.根据权利要求1所述的科技资源管理方法,其特征在于:所述服务期包括资源在内部使用以及向外扩展应对不同应用的期间;所述衰退期指资源在服务期的后期. 6.根据权利要求1所述的科技资源管理方法,其特征在于:所述获取需求为:为了达到目的,人们对特定资源有特定的获取需要. 7.根据权利要求1所述的科技资源管理方法,其特征在于:所述拥有需求为:获得资源之后,其有利用价值,人们有独自拥有的想法;所述交互需求为:人们不再满足于独自拥有资源,期望能够与其它资源拥有者交换,以资源换取更多的资源. 8.根据权利要求1所述的科技资源管理方法,其特征在于:所述质量需求为:人们期望拥有的资源是高质量、高安全、高可靠的. 9.根据权利要求1所述的科技资源管理方法,其特征在于:所述共享需求为:人们期望发挥资源的最大化效用,满足各方面的需要,同时收取合法的利益所得. 10.根据权利要求1所述的科技资源管理方法,其特征在于:所述数据层为:对资源进行数字化处理后得到结构化、半结构化和非结构化数据;所述处理层为:将数据层的数据进行采集、融合、分发等处理,通常使用ETL工具进行管理;所述应用层为:将数据进行综合利用和挖掘分析,提供决策支持智能服务.",
    //   "endorgtype": null,
    //   "f_ID": 32578413,
    //   "fau": "徐迪威",
    //   "fendorgcity": null,
    //   "fendorgid": null,
    //   "fendorgprovince": null,
    //   "fendorgtype": null,
    //   "fls": "<?xml version=\"1.0\" encoding=\"utf-8\" ?><LegalStatusList><LegalStatus><Date>20200228</Date><Status>公开</Status><ExtraInfo>公开</ExtraInfo></LegalStatus></LegalStatusList>",
    //   "forgc": "广东省科技基础条件平台中心",
    //   "forgcity": null,
    //   "forgid": null,
    //   "forgprovince": null,
    //   "forgstrucid": null,
    //   "forgtype": null,
    //   "halfyear": 2,
    //   "id": "ZLW20200414000001230319",
    //   "intapp": null,
    //   "intpub": null,
    //   "invpat": null,
    //   "jidu": "201903",
    //   "keyword": "科技资源%数据处理%资源管理%需求层次%生命周期%资源利用率%质量需求%整合优化%目标实现%交互需求",
    //   "ls": null,
    //   "maincls": "G06F16/25(2019.01)",
    //   "mcid": "TP3%F25",
    //   "nianyue": "201909",
    //   "oreqno": null,
    //   "org": "广东省科技基础条件平台中心",
    //   "orgc": "广东省科技基础条件平台中心",
    //   "orgcity": null,
    //   "orgid": null,
    //   "orgintactid": null,
    //   "orgnum": null,
    //   "orgprovince": null,
    //   "orgstrucid": null,
    //   "orgtype": null,
    //   "patno": "CN201910852118.X",
    //   "patt": "发明专利",
    //   "pctapp": null,
    //   "pctinf": null,
    //   "pctpub": null,
    //   "pn": "8",
    //   "priority": null,
    //   "pubpath": "BOOKS/FM/2020/20200228/201910852118.X/000001.TIF",
    //   "quarter": 3,
    //   "ref": null,
    //   "reqaddr": "510000 广东省广州市连新路171号",
    //   "reqno": "CN201910852118.X",
    //   "reqnov": "201910852118.X",
    //   "reqpep": "广东省科技基础条件平台中心",
    //   "reviewer": null,
    //   "seraddr": null,
    //   "smcls": "G06",
    //   "source": "1",
    //   "ti": "一种科技资源管理方法",
    //   "title": "一种科技资源管理方法",
    //   "tmcls": "G",
    //   "weight": 6,
    //   "year": "2019",
    //   "zmcls": "G06F16/25(2019.01)%G%G06%G06F%G06F16"
    //   }
    //   }
    // }
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    params.created_datetime = formatDateTime(date);

    function prepreocess(triple) {
        var resource = {}
        // resource
        if (triple.label === '专利') {
            resource.label = triple.label

            resource.score = triple._score
            resource.id = triple._id

            resource.abstract = triple._source.abstract
            resource.eab = triple._source.eab
            resource.dbid = triple._source.dbid
            resource.pubpath = triple._source.pubpath
            resource.weight = triple._source.weight
            resource.type = triple._source.type
            resource.anno = triple._source.anno
            resource.annodate = triple._source.annodate
            resource.province = triple._source.country
            resource.dom = triple._source.dom
            resource.keyword = triple._source.keyword
            resource.ls = triple._source.ls
            resource.maincls = triple._source.maincls
            resource.patno = triple._source.patno
            resource.patt = triple._source.patt
            resource.reqaddr = triple._source.reqaddr
            resource.reqno = triple._source.reqno
            resource.reqpep = triple._source.reqpep
            resource.title = triple._source.title
            resource.name = triple._source.title
        }
        else if (triple.label === '期刊') {
            resource.label = triple.label
            resource.score = triple._score
            resource.id = triple._id

            resource.subscore = triple._source.score
            resource.abstract = triple._source.abstract
            resource.eab = triple._source.eab
            resource.type = triple._source.type

            resource.date = triple._source.date
            resource.docid = triple._source.docid
            resource.ecore = triple._source.ecore
            resource.doi = triple._source.doi
            resource.issn = triple._source.issn
            resource.eissn = triple._source.eissn
            if (triple._source.fpn != null) {
                resource.fund = triple._source.fpn
            }
            else {
                resource.fund = triple._source.fund
            }
            resource.fundsupport = triple._source.fundsupport
            if (triple._source.orgcity != null) {
                resource.province = triple._source.orgcity
            }
            else {
                resource.province = triple._source.forg
            }
            resource.keyword = triple._source.keyword
            resource.lan = triple._source.lan
            resource.pg = triple._source.pg
            resource.sci = triple._source.sci
            resource.title = triple._source.title
            resource.vol = triple._source.vol
            resource.ynfree = triple._source.ynfree
            resource.weight = triple._source.weight
            resource.wid = triple._source.wid
            resource.name = triple._source.title
        }
        else if (triple.label === '会议') {
            resource.label = triple.label
            resource.score = triple._score
            resource.id = triple._id

            resource.abstract = triple._source.abstract
            resource.eab = triple._source.eab
            resource.date = triple._source.date
            resource.doi = triple._source.doi
            resource.eissn = triple._source.eissn
            resource.issn = triple._source.issn
            resource.pno = triple._source.pno
            resource.lan = triple._source.lan
            resource.pp = triple._source.pp
            resource.pub = triple._source.pub
            resource.type = triple._source.type

            if (triple._source.fpn != null) {
                resource.fund = triple._source.fpn
            }
            else {
                resource.fund = triple._source.fund
            }
            resource.fundsupport = triple._source.fundsupport

            if (triple._source.orgcity != null) {
                resource.province = triple._source.orgcity
            } else if (triple._source.forg != null) {
                resource.province = triple._source.forg
            } else { resource.province = triple._source.pp }

            resource.keyword = triple._source.keyword
            resource.ekey = triple._source.ekey

            resource.title = triple._source.title
            resource.weight = triple._source.weight
            resource.wid = triple._source.wid

            resource.name = triple._source.title

        }
        else if (triple.label === '标准') {
            resource.label = triple.label
            resource.score = triple._score
            resource.id = triple._id

            resource.author = triple._score.author
            resource.auids = triple._score.auids
            resource.abstract = triple._source.abstract
            resource.cc = triple._source.cc
            resource.keyword = triple._source.keyword
            resource.ekey = triple._source.ekey
            resource.date = triple._source.date
            resource.impdate = triple._source.impdate
            resource.dbid = triple._source.dbid
            resource.type = triple._source.type
            resource.lan = triple._source.lan
            resource.sn = triple._source.sn
            resource.status = triple._source.status
            resource.type = triple._source.type
            resource.weight = triple._source.weight
            resource.title = triple._source.title
            resource.tie = triple._source.tie
            resource.fname = triple._source.fname
            resource.ref = triple._source.ref
            resource.name = triple._source.title
        }
        else if (triple.label === '引文') {
            resource.label = triple.label
            resource.score = triple._score
            resource.id = triple._id

            resource.title = triple._source.ywtitle
            resource.type = triple._source.ywtype
            // resource.label = resource.type
            resource.ckey = triple._source.ywckey
            resource.doi = triple._source.ywdoi
            resource.ekey = triple._source.ywekey
            resource.fund = triple._source.ywfund
            resource.patt = triple._source.ywpatt
            resource.subscore = triple._source.ywscore
            resource.name = triple._source.ywtitle
        }

        return resource
    }

    var exData = {};

    var NODE = [];

    var LINK = [];

    var id = [];

    var count = 0

    var i1 = 0, j1 = 1

    var H = {}, hUp = {}, hUpTmp = {}, R = {}, T = {}
    var name = 'kjzy'
    hUpTmp.id = req.H.id
    hUpTmp.label = req.H.label
    H[name] = req.H
    hUp[name] = hUpTmp
    R[name] = req.R
    T[name] = prepreocess(req.T)

    // merge 结点
    var res0 = await (new Promise(function (resolve, reject) {
        graphdb.mergeOnEntity(H, hUp)
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

    // merge 结点
    var res1 = await (new Promise(function (resolve, reject) {
        graphdb.mergeOnEntity(T, T)
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

    // merge 关系

    var res = await (new Promise(function (resolve, reject) {
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

module.exports = wfKjResource2kg

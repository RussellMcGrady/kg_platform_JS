/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
const axios = require('axios');
const { formatDateTime } = require('../../util/util')
const querystring = require('querystring');
const url = require('url');
const graphdb = require('../../neo4j.js')

async function patent() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    const req = querystring.parse(url.parse(this.url).query)

    //const req = JSON.stringify(this.request.body)
    const date = new Date()
    // const req = this.request.body
    console.log("######", req)
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    params.created_datetime = formatDateTime(date);

    var patentTalent = {}
    // patentTalent.labelH = req.patent.label
    // patentTalent.labelT = req.talent.label
    // patentTalent.labelR = "关系"
    patentTalent.H = req.patent
    patentTalent.T = req.talent
    patentTalent.R = { label: '作者' }
    // patentTalent.R = { 关系: '发明人' }
    // patentTalent = JSON.stringify(patentTalent)

    var patentCompany = {}
    // patentCompany.labelH = req.patent.label
    // patentCompany.labelT = req.company.label
    // patentCompany.labelR = "关系"
    patentCompany.H = req.patent
    patentCompany.T = req.company
    patentCompany.R = { label: '申请机构' }
    // patentCompany = JSON.stringify(patentCompany)

    var talentCompany = {}
    // talentCompany.labelH = req.talent.label
    // talentCompany.labelT = req.company.label
    // talentCompany.labelR = "关系"
    talentCompany.H = req.talent
    talentCompany.T = req.company
    talentCompany.R = { label: '所属机构' }
    // talentCompany = JSON.stringify(talentCompany)


    // const res = await (new Promise(function (resolve, reject) {
    const res = await axios({
        method: 'post',
        url: 'http://huping.ticp.io/kg/mergeRelationship',
        data: patentTalent
    }).then(res => {
        axios({
            method: 'post',
            url: 'http://huping.ticp.io/kg/mergeRelationship',
            data: patentCompany
        }).then(res => {
            axios({
                method: 'post',
                url: 'http://huping.ticp.io/kg/mergeRelationship',
                data: talentCompany
            })
        })
    })
    this.body = res

}

module.exports = patent

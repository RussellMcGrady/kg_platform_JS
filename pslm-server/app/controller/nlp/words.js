/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
// const axios = require('axios');
const nlp = require('../../stanfordnlp.js')
const { formatDateTime } = require('../../util/util')
const querystring = require('querystring');
const url = require('url');



async function words() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)
    var req = this.request.body
    // req = JSON.parse(req.data)
    // sent = 'Marie was born in Paris.'
    // lan = 'en'
    console.log("######", req)

    const date = new Date()
    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    params.created_datetime = formatDateTime(date);
    var exData = {};

    const res = await (new Promise(function (resolve, reject) {
        nlp.annotate(req.lan, req.sent)
            .then(sent => {
                exData = sent.words()
                console.log(exData)
                const response = {
                    code: 20000,
                    data: exData,
                    msg: 'database request success'
                }
                resolve(response)
                // console.log(sent.nerTags());
            })
            .catch(err => {
                console.log('err', err)
                const response = {
                    code: 50000,
                    data: err,
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

module.exports = words

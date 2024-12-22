/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
const axios = require('axios');

const { formatDateTime } = require('../../util/util')
const querystring = require('querystring');
const url = require('url');



async function nluExtraction() {
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

  const res = await (new Promise(function (resolve, reject) {
    axios.get('https://api.ownthink.com/slu', {
      params: {
        spoken: req.text
      }
    })
      .then(function (res) {
        const response = {
          code: 20000,
          data: res.data,
          msg: 'database request success',

        }
        resolve(response)
      })
      .catch(function (error) {
        const response = {
          code: 50000,
          data: err,
          msg: 'database request bad',

        }
        resolve(response)
      });
  }).then(function (response) {
    console.log(response)
    return JSON.stringify(response)
  })
  )
  this.body = res

}

module.exports = nluExtraction

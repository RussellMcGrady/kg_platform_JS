/**
 * Created by ly on 2020/7/7
 * 专利查询
 */
// const axios = require('axios');
const { PythonShell } = require('python-shell')

const { formatDateTime } = require('../../util/util')
const querystring = require('querystring');
const url = require('url');



async function cutExtraction() {
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
    var options = {
      mode: 'text',
    //   pythonPath: 'D:\\ProgramData\\Anaconda3\\python.exe',
      pythonOptions: ['-u'], // get print results in real-time
      scriptPath: 'app/controller/nlp/',
      args: ['cutExtraction', req.text]
    };

    const res = await (new Promise(function (resolve, reject) {
        PythonShell.run('ownthink.py', options, function (err, results) {
            // if (err) throw err;
            if (err) {
                const response = {
                    code: 50000,
                    data: err,
                    msg: 'database request bad',

                }
                resolve(response)
            }
            // results is an array consisting of messages collected during execution
            // console.log('results: %j', results);
            const response = {
                code: 20000,
                data: results,
                msg: 'database request success'
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

module.exports = cutExtraction


const querystring = require('querystring');
const url = require('url');
const fs = require('fs');
const path = require('path');

async function getImg() {
    const req = querystring.parse(url.parse(this.url).query)
    // var files = this.request.files;
    // files = files.files
    // console.log(files)
    // const req = this.request.body;
    var currDir = path.normalize(req.dir),
        fileName = req.name,
        currFile = path.join(currDir, fileName),
        currFile = './app/static/uploadGraphcsv/' + currFile;

    this.set('Access-Control-Allow-Origin', '*')
    this.set('Content-Type', 'image/png');
    const res = await (new Promise(function (resolve, reject) {
        fs.readFile(currFile, function (err, data) {
            if (err) {
                const response = {
                    code: 50000,
                    // data: exData,
                    msg: 'database request bad',

                }
                reject(response)
            } else {
                // const response = {
                //     code: 20000,
                //     data: data,
                //     msg: 'database request success'
                // }
                resolve(data)
            }
        })
    }).then(function (response) {
        // console.log(response)
        return response
    })
    )
    this.body = res
}
module.exports = getImg;

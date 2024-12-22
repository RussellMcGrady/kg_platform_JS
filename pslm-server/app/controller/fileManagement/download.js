
const querystring = require('querystring');
const url = require('url');
const fs = require('fs');
const path = require('path');
const send = require('koa-send');

async function download() {
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
    this.attachment(currFile)
    this.body = fs.createReadStream(currFile)
    send(this, currFile);
}
module.exports = download;

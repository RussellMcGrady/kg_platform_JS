const fs = require('fs');
const UUID = require('uuid');

async function uploadKG(){
    this.set('Access-Control-Allow-Origin','*');
    var files = this.request.files;
    files = files.files
    const req = this.request.body;
    console.log(req)

    var ID = UUID.v1();
    var fileList = []
    var fileArray = []
    if(!files.length || files.length <2) {
        fileArray.push(files)
    } else {
        fileArray = files
    }
    for (var key in fileArray) {
        var file = fileArray[key];

       // console.log(file.path)
        var reader = fs.createReadStream(file.path); // 创建可读流
        var ext = file.name.split('.').pop(); // 获取上传文件扩展名
        // const storedFileName = fileName+'-'+(Math.round((Math.random())*100000000)).toString()
        var storedFileName = file.name.split('.').slice(-2)[0]
        //console.log('storedFileName',storedFileName)
        fs.mkdir(`app/static/uploadGraphcsv/${req.folder}`, { recursive: true }, (err) => {
            if(err) throw err; // 如果出现错误就抛出错误信息
            console.log('文件夹创建成功');        
          });
        var upStream = fs.createWriteStream(`app/static/uploadGraphcsv/${req.folder}/${storedFileName}-${ID}.${ext}`); // 创建可写流

        reader.pipe(upStream); // 可读流通过管道写入可写流
        // return this.body = FILE_HOST + storedFileName + '.' + ext;
        fileList.push(storedFileName + '-' + ID + '.' + ext)
    }
    this.body = fileList
   // const file = this.request.body.files.file; // 获取上传文件

}

module.exports = uploadKG;

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
const fs = require('fs')
const child_process = require('child_process');
const { json } = require('express');

async function graphEmbeddingNode2Vec() {
    const that = this
    this.set('Access-Control-Allow-Origin', '*')
    this.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // const req = querystring.parse(url.parse(this.url).query)

    // const req = test
    // req.pro_info = JSON.parse(req.pro_info)

    // const req = JSON.stringify(this.request.body)
    const date = new Date()
    var req = this.request.body
    console.log("######", req)
    // req = JSON.parse(req.data)


    const userid = req.userid;
    const params = {};
    params.task_id = req.taskId;
    params.created_datetime = formatDateTime(date);

    var res = await (new Promise(function (resolve, reject) {
        graphdb.graphEmbeddingNode2Vec(req.nodeLabelArray, req.relationLabelArray, req.orientation, req.embeddingDimension, req.walkLength, req.limit)
            .then(result => {
                // fs.writeFile('app/static/graphEmbeddingNode2Vec.js', '', 'utf8', (err) => {
                //     if (err) throw err;
                //   });
                // result.records.forEach(record => {
                //     let content = JSON.stringify(record.keys) + ',' + JSON.stringify(record._fields) + '\n'
                //         fs.writeFile('app/static/graphEmbeddingNode2Vec.js', content, { flag: 'a+' }, err => {
                //             if (err) {console.log(err)}
                //         })
                // })

                child_process.spawnSync('python', ['app/controller/nlp/embeddingVis.py', req.hLabel, req.rLabel, req.tLabel, req.limit]);

                fs.readFile("app/static/embVis/node2vec-color.json", "utf-8", function(err, data){
                    // let j = JSON.parse(data);
                    let embeddings = fs.readFileSync("app/static/emb/embeddings.txt", "utf-8").toString()
                    const response = {
                        code: 20000,
                        visData: data,
                        embeddings: embeddings,
                        msg: 'database request success'
                    }
                    resolve(response)
                    })
            })
            .catch(error => {
                const response = {
                    code: 50000,
                    data: error,
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

module.exports = graphEmbeddingNode2Vec

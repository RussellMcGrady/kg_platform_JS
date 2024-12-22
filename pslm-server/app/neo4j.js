const path = require('path')
const fs = require('fs');
const iconv = require('iconv-lite');
const jschardet = require("jschardet");

var neo4j = require('neo4j-driver')
var driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', '123456'),
    {
        maxTransactionRetryTime: 30000
    }
)
// var session = driver.session()
var graphdb = {}

graphdb.getAllLabel = function () {
    var session = driver.session()
    var cypher = 'call db.labels()'
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.getSchema = function (hLabel) {
    var session = driver.session()
    var cypher = 'call call db.schema.visualization()'
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.querySingleLabel = function (hLabel) {
    var session = driver.session()
    var cypher = 'MATCH (h:`' + hLabel['label'] + '`) RETURN distinct h skip ' + hLabel['skip'] + ' limit ' + hLabel['limit']
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.queryLabelCount = function (labelArr, H) {
    var session = driver.session()
    var cypher = ''
    if (Object.keys(H).length > 0) {
        cypher = cypher + 'MATCH (h:`' + H['label'] + '`)-[*..20]->(n) WHERE '
        if (Object.keys(H).length > 1) {
            for (var i in H) {
                // console.log(i)
                if (i != 'label' && i != 'id' && i != 'limit' && i != 'skip') {
                    cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' AND "
                }
            }
            cypher = cypher.slice(0, -4)

        } else {
            cypher = cypher.slice(0, -6)
        }
        cypher = cypher + ' with n '
    }
    cypher = cypher + 'MATCH (n) where ANY ( label in labels(n) WHERE label in ' + labelArr + ' )  return count(distinct n)'

    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.queryCount = function (hLabel) {
    var session = driver.session()
    var cypher = 'MATCH (h:`' + hLabel['label'] + '`) WHERE '
    // console.log(cypher)
    if (Object.keys(hLabel).length > 3) {
        for (var i in hLabel) {
            // console.log(i)
            if (i != 'label' && i != 'limit' && i != 'skip') {
                cypher = cypher + 'h.`' + i + "` =~ '.*" + hLabel[i] + ".*' AND "
            }
        }
        if (hLabel['id']) {
            cypher = cypher + ' id(h) = ' + hLabel['id']
        } else {
            cypher = cypher.slice(0, -4)
        }
    } else {
        cypher = cypher.slice(0, -6)
    }
    cypher = cypher + ' RETURN count(distinct h)'
    // the Promise way, where the complete result is collected before we act on it:
    // console.log(cypher)
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.queryKgInterface = function (H) {
    var session = driver.session()
    // console.log(H)
    var cypher = 'MATCH (h:`' + H['label'] + '`) WHERE '
    // console.log(cypher)
    if (Object.keys(H).length > 3) {
        for (var i in H) {
            // console.log(i)
            if (i != 'label' && i != 'id' && i != 'limit' && i != 'skip') {
                cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' AND "
            }
        }
        if (H['id']) {
            cypher = cypher + ' id(h) = ' + H['id']
        } else {
            cypher = cypher.slice(0, -4)
        }
    } else {
        cypher = cypher.slice(0, -6)
    }
    cypher = cypher + ' RETURN distinct h skip ' + H['skip'] + ' limit ' + H['limit']
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.queryKgPropInterface = function (hProp) {
    var session = driver.session()
    var cypher = 'MATCH (h) WHERE EXISTS(h.`'
    cypher = cypher + hProp.key + '`) AND '
    // // console.log(cypher)
    for (var i in hProp) {
        if (i != 'key' && i != 'limit' && i != 'skip') {
            cypher = cypher + 'h.`' + hProp.key + "` =~ '.*" + hProp[i] + ".*' or "
        }
    }
    cypher = cypher.slice(0, -3)
    cypher = cypher + 'RETURN DISTINCT h, h.`' + hProp.key + '` AS `' + hProp.key + '` skip ' + hProp['skip'] + ' limit ' + hProp['limit']
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.querySingleResource = function (H) {
    var session = driver.session()
    console.log(H)
    var cypher = 'MATCH (h:`' + H['label'] + '`) WHERE '
    // console.log(cypher)
    for (var i in H) {
        console.log(i)
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + 'h.`' + i + "` = '" + H[i] + "' AND "
        }
    }
    cypher = cypher.slice(0, -4)
    cypher = cypher + ' RETURN distinct h skip ' + H['skip'] + ' limit ' + H['limit']
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}
// query triple
graphdb.queryEntity = function (H) {
    var session = driver.session()
    var cypher = 'MATCH (h:`' + H['label'] + '`)-[r]-(t) WHERE '
    // console.log(cypher)
    for (var i in H) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' AND "
        }
    }
    cypher = cypher.slice(0, -4)
    cypher = cypher + ' RETURN * skip ' + H['skip'] + ' limit ' + H['limit']
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}
// query tail
graphdb.queryTail = function (H, T) {
    var session = driver.session()
    var cypher = 'MATCH (h:`' + H['label'] + '`)-[r]-(t:`' + T['label'] + '`) WHERE '
    // console.log(cypher)
    for (var i in H) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' AND "
        }
    }
    cypher = cypher.slice(0, -4)
    cypher = cypher + ' RETURN DISTINCT t skip ' + T['skip'] + ' limit ' + T['limit']
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

// query treeNode child
graphdb.queryChild = function (H) {
    var session = driver.session()
    var cypher = 'MATCH (h:`' + H['label'] + '`)-[r]->(t) WHERE '
    // console.log(cypher)
    for (var i in H) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' AND "
        }
    }
    cypher = cypher.slice(0, -4)
    cypher = cypher + ' RETURN DISTINCT t skip ' + H['skip'] + ' limit ' + H['limit']
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.queryPathLength = function (H, T) {
    var session = driver.session()
    var cypher = 'MATCH p = (h:`' + H['label'] + '`)-[*]->(t:`' + T['label'] + '`) WHERE '
    // console.log(cypher)
    if (Object.keys(H).length > 1) {
        for (var i in H) {
            if (i != 'label' && i != 'limit' && i != 'skip') {
                cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' AND "
            }
        }
    }
    if (Object.keys(T).length > 1) {
        for (var i in T) {
            if (i != 'label' && i != 'limit' && i != 'skip') {
                cypher = cypher + 't.`' + i + "` =~ '.*" + T[i] + ".*' AND "
            }
        }
    }
    if (Object.keys(H).length > 1 || Object.keys(T).length > 1) {
        cypher = cypher.slice(0, -4)
    } else {
        cypher = cypher.slice(0, -6)
    }

    cypher = cypher + ' RETURN MAX(length(p))'
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.queryRelationship = function (H, R) {
    var session = driver.session()
    var cypher = 'MATCH (h:`' + H['label'] + '`)-[r:`' + R['label'] + '`]-(t) WHERE '
    // console.log(cypher)
    for (var i in H) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' AND "
        }
    }
    cypher = cypher.slice(0, -4)
    cypher = cypher + ' RETURN distinct h, t skip ' + H['skip'] + ' limit ' + H['limit']
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}


graphdb.loadcsv = function (folder, file) {
    var session = driver.session()
    var filePath = path.join(__dirname, "/static/uploadGraphcsv/" + folder + '/' + file)
    filePath = filePath.replace(/\\/g, '\\\\')
    // var filePathUTF = path.join(__dirname, "/static/uploadGraphcsv/" + folder + '/utf8_' + file)
    // filePathUTF = filePathUTF.replace(/\\/g, '\\\\')
    //filePath ==> 文件路径
    var stream = fs.createReadStream(filePath, { encoding: "binary" });
    let data = "";
    stream.on("error", err => {
        console.error("读取行错误");
        console.error(err);
    });
    stream.on("data", chunk => {
        data += chunk;
        var res = jschardet.detect(data);
        // console.log(res.encoding)  //输出文件编码格式
        const buf = Buffer.from(data, "binary");
        const str = iconv.decode(buf, res.encoding); // 得到正常的字符串，没有乱码

        var upStream = fs.createWriteStream(filePath); // 创建可写流
        //写入数据到流
        upStream.write(str, 'utf8')
        //关闭写入流，表明已没有数据要被写入可写流
        // upStream.end()
    });
    // stream.on("end", () => {
    // });

    // var cypher = "CALL apoc.load.csv('FILE:///D:/ProgramData/hw-pslm-server/app/static/uploadGraphcsv/" + folder + '/' + path + "') YIELD map, list RETURN *"
    var cypher = "CALL apoc.load.csv('FILE:///" + filePath + "') YIELD map, list RETURN *"

    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })
    return result
}

graphdb.mergeOnEntity = function (H, attr) {
    var session = driver.session()
    var cypher = ""
    var count = 0
    for (h_i in attr) {
        // cypher = cypher + 'MERGE (h_' + count + ':`' + H[h_i]['label'] + '`{ `'
        cypher = cypher + 'MERGE (h_' + count + '{ `'

        // // console.log(cypher)
        for (var i in attr[h_i]) {
            if (i != 'label' && i != 'limit' && i != 'resource' && i != 'skip' && attr[h_i][i] != null && attr[h_i][i].length != 0) {
                cypher = cypher + i + '` : "' + attr[h_i][i].toString().replace(/\"/g, '\\"') + '" , `'
            }
        }
        cypher = cypher.slice(0, -3) + ' }) ON MATCH SET '

        for (var j in H[h_i]) {
            if (j != 'label' && j != 'limit' && j != 'resource' && j != 'skip' && H[h_i][j] != null && H[h_i][j].length != 0) {
                cypher = cypher + ' h_' + count + '.`' + j + '` = "' + H[h_i][j].toString().replace(/\"/g, '\\"') + '" , '
            }
        }
        cypher = cypher.slice(0, -2) + ',  h_' + count + ': `' + H[h_i]['label'] + '` ON CREATE SET '
        for (var j in H[h_i]) {
            if (j != 'label' && j != 'limit' && j != 'resource' && j != 'skip' && H[h_i][j] != null && H[h_i][j].length != 0) {
                cypher = cypher + ' h_' + count + '.`' + j + '` = "' + H[h_i][j].toString().replace(/\"/g, '\\"') + '" , '
            }
        }
        cypher = cypher.slice(0, -2) + ',  h_' + count + ': `' + H[h_i]['label']

        count = count + 1
    }
    cypher = cypher + '` RETURN * LIMIT 10'
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.mergeRelationshipBatchEntity = function (H, T) {
    var session = driver.session()
    var cypher = ""
    var count = 0
    for (h_i in H) {
        cypher = cypher + 'MERGE (h_' + count + ':`' + H[h_i]['label'] + '`{ `'
        // // console.log(cypher)
        for (var i in H[h_i]) {
            if (i != 'label' && i != 'limit' && i != 'resource' && i != 'skip' && H[h_i][i] != null && H[h_i][i].length != 0) {
                if (typeof (H[h_i][i]) == 'object') {
                    H[h_i][i] = JSON.stringify(H[h_i][i])
                }
                cypher = cypher + i + '` : "' + H[h_i][i].toString().replace(/\"/g, '\\"') + '" , `'
            }
        }
        count = count + 1
        cypher = cypher.slice(0, -3) + ' }) '
    }

    var count = 0
    for (var t_i in T) {
        var cypher = cypher + 'MERGE (t_' + count + ':`' + T[t_i]['label'] + '`{ `'
        // // console.log(cypher)
        for (var i in T[t_i]) {
            if (i != 'label' && i != 'limit' && i != 'skip' && i != 'resource' && T[t_i][i] != null && T[t_i][i].length != 0) {
                cypher = cypher + i + '` : "' + T[t_i][i].toString().replace(/\"/g, '\\"') + '" , `'
            }
        }
        count = count + 1
        cypher = cypher.slice(0, -3) + ' }) '
    }

    cypher = cypher + ' RETURN * limit 10'
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.mergeRelationshipBatchRel = function (H, R, T) {
    var session = driver.session()
    cypher = ''
    // the Promise way, where the complete result is collected before we act on it:
    var count = 0
    for (var r_i in R) {
        cypher = cypher + ' MATCH ('
        cypher = cypher + 'n_' + count + ':`' + H[r_i]['label'] + '`{ `'
        for (var i in H[r_i]) {
            if (i != 'label' && i != 'limit' && i != 'resource' && i != 'skip' && H[r_i][i] != null && H[r_i][i].length != 0) {
                cypher = cypher + i + '` : "' + H[r_i][i].toString().replace(/\"/g, '\\"') + '" , `'
            }
        }
        cypher = cypher.slice(0, -3) + ' }) ' + ' MATCH ('
        cypher = cypher + 'm_' + count + ':`' + T[r_i]['label'] + '`{ `'
        for (var i in T[r_i]) {
            if (i != 'label' && i != 'limit' && i != 'skip' && i != 'resource' && T[r_i][i] != null && T[r_i][i].length != 0) {
                cypher = cypher + i + '` : "' + T[r_i][i].toString().replace(/\"/g, '\\"') + '" , `'
            }
        }
        cypher = cypher.slice(0, -3) + ' }) '
        count = count + 1
    }
    // // console.log(cypher)

    var count = 0
    for (var r_i in R) {
        cypher = cypher + ' MERGE (n_' + count + ')-[r_' + count + ':`' + R[r_i]['label'] + '`]->(m_' + count + ') '
        count = count + 1
    }

    cypher = cypher + ' RETURN * '
    // console.log(cypher)
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

// 融合多标签
graphdb.mergeRelationshipBatchRelLabel = function (H, R, T) {
    var session = driver.session()
    cypher = ''
    // the Promise way, where the complete result is collected before we act on it:
    var count = 0
    for (var r_i in R) {
        cypher = cypher + ' MATCH ('
        cypher = cypher + 'n_' + count + '{ `'
        for (var i in H[r_i]) {
            if (i != 'label' && i != 'limit' && i != 'resource' && i != 'skip' && H[r_i][i] != null && H[r_i][i].length != 0) {
                cypher = cypher + i + '` : "' + H[r_i][i].toString().replace(/\"/g, '\\"') + '" , `'
            }
        }
        cypher = cypher.slice(0, -3) + ' }) ' + ' MATCH ('

        cypher = cypher + 'm_' + count + '{ `'
        for (var i in T[r_i]) {
            if (i != 'label' && i != 'limit' && i != 'skip' && i != 'resource' && T[r_i][i] != null && T[r_i][i].length != 0) {
                cypher = cypher + i + '` : "' + T[r_i][i].toString().replace(/\"/g, '\\"') + '" , `'
            }
        }
        cypher = cypher.slice(0, -3) + ' }) ' + ' SET  n_' + count + ': `' + H[r_i]['label'] + '` SET  m_' + count + ': `' + T[r_i]['label'] + '` '
        count = count + 1
    }
    // // console.log(cypher)

    var count = 0
    for (var r_i in R) {
        cypher = cypher + ' MERGE (n_' + count + ')-[r_' + count + ':`' + R[r_i]['label'] + '`]->(m_' + count + ') '
        count = count + 1
    }

    cypher = cypher + ' RETURN * LIMIT 10'
    // console.log(cypher)
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.deleteEntity = function (H) {
    var session = driver.session()
    if (H['id'] != null && H['id'].length != 0) {
        var cypher = 'MATCH (h:`' + H['label'] + '`) WHERE '
        // console.log(cypher)
        for (var i in H) {
            if (i != 'label' && i != 'limit' && i != 'skip') {
                cypher = cypher + 'h.`' + i + "` = '" + H[i] + "' AND "

            }
        }
        // for (var i in T) {
        //     cypher = cypher + 't.' + i + " = " + T[i] + " AND "
        // }
        // for (var i in R) {
        //     cypher = cypher + 'r.' + i + " = " + R[i] + " AND "
        // }
        cypher = cypher.slice(0, -4)
        cypher = cypher + ' detach DELETE h RETURN *, count(h)'
        // console.log(cypher)
        // the Promise way, where the complete result is collected before we act on it:
        var result = session.writeTransaction(async txc => {
            var innerResult = await txc.run(cypher)
            return innerResult
        })

        return result
    }
}

graphdb.deleteDB = function (labelArr) {
    // ['专家', '专利', '代理机构', '会议论文', '作者', '供应商', '单位', '图书', '会议', '期刊', '学者', '杂志', '标准', '科学装置', '高新技术企业', '高管']
    var session = driver.session()
    var cypher = 'MATCH (n) where NONE ( label in labels(n) WHERE label in ' + labelArr + ' ) detach delete n'

    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.deleteRelationship = function (H, R, T) {
    var session = driver.session()
    var cypher = ''
    var count = 0
    for (var h_i in H) {
        cypher = cypher + 'MATCH (h_' + count + ':`' + H[h_i]['label'] + '`)-[r_' + count + ':`' + R[h_i]['label'] + '`]-(t_' + count + ':`' + T[h_i]['label'] + '`) WHERE '
        for (var i in H[h_i]) {
            if (i != 'label' && i != 'limit' && i != 'skip') {
                cypher = cypher + ' h_' + count + '.`' + i + "` = '" + H[h_i][i] + "' AND "
            }
        }

        for (var i in T[h_i]) {
            if (i != 'label' && i != 'limit' && i != 'skip') {
                cypher = cypher + ' t_' + count + '.`' + i + "` = '" + T[h_i][i] + "' AND "
            }
        }

        cypher = cypher.slice(0, -4) + ' detach DELETE r_' + count + ' ; '
        count = count + 1
    }

    cypher = cypher.slice(0, -2) + ' RETURN * '
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.setEntity = function (H, hUpdate) {
    var session = driver.session()
    var cypher = 'MATCH (h:`' + H['label'] + '`)-[r]-(t) WHERE '
    for (var i in H) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + 'h.`' + i + "` = '" + H[i] + "' and "
        }
    }
    cypher = cypher.slice(0, -4) + ' SET '
    for (var i in hUpdate) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + ' h.`' + i + "` = '" + hUpdate[i] + "' , "
        }
    }
    cypher = cypher.slice(0, -2)
    cypher = cypher + ' RETURN h limit 30'
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.removeProperty = function (H, hRemove) {
    var session = driver.session()
    var cypher = 'MATCH (h:`' + H['label'] + '`)-[r]-(t) WHERE '
    for (var i in H) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + ' h.`' + i + "` = '" + H[i] + "' and "
        }
    }
    cypher = cypher.slice(0, -4) + ' REMOVE '
    for (var i in hRemove) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + ' h.`' + i + '` , '
        }
    }
    cypher = cypher.slice(0, -2)
    cypher = cypher + ' RETURN h limit 30'
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

// ALL, NONE
// MATCH p=(n:`代理机构`)-[*1..2]-() where none (x IN nodes(p) WHERE n.urbanCluster =~ '') RETURN distinct n limit 5
graphdb.assertion = function (length, assertion, H, T, condition, option) {
    var session = driver.session()
    var cypher = 'MATCH p=(h:`' + H['label'] + '`)-[*..' + length + ']-'
    if (T['label'] === '产品') {
        cypher += '>'
    }
    cypher += '(t:`' + T['label'] + '`) WHERE ' + assertion + ' (x IN nodes(p) WHERE '
    for (var i in H) {
        if (i != 'label' && i != 'limit' && i != 'skip' && i != 'id') {
            cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' AND "
        } else if (i === 'id') {
            cypher = cypher + ' id(h) = ' + H['id'] + ' AND '
        }
    }
    // for (var i in T) {
    //     if (i != 'label' && i != 'limit' && i != 'skip') {
    //         if (condition !== '=') {
    //             cypher = cypher + 't.`' + i + "` " + condition + " " + Number(T[i]) + " AND "
    //         } else {
    //             cypher = cypher + 't.`' + i + "` " + condition + " '" + T[i] + "' AND "
    //         }
    //     }
    // }
    for (var i in T) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + 't.`' + i + "` =~ '.*" + T[i] + ".*' AND "
        }
    }

    cypher = cypher.slice(0, -4) + ')'
    if (option === 'list') {
        cypher = ''
        cypher += 'MATCH p=(h:`' + H['label'] + '`)-[*..1]->(t:`产品`) where labels(t) = ' + JSON.stringify(T['label'])
        if (H['label'] === '产品') {
            cypher = cypher + ' RETURN DISTINCT t skip ' + H['skip'] + ' limit ' + H['limit']
        } else {
            cypher = cypher + ' RETURN DISTINCT h skip ' + H['skip'] + ' limit ' + H['limit']
        }
    } else {
        cypher = cypher + ' RETURN p limit 50'
    }
    console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.shortestPath = function (length, option, H, T) {
    var session = driver.session()
    var cypher = 'MATCH (h:`' + H['label'] + '`) WHERE '
    // console.log(cypher)
    if (Object.keys(H).length > 1) {
        for (var i in H) {
            if (i != 'label' && i != 'limit' && i != 'skip') {
                cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' OR "
            }
        }
        cypher = cypher.slice(0, -3) + ' with h MATCH (t:`' + T['label'] + '`) WHERE '
    } else {
        cypher = cypher.slice(0, -6) + ' with h MATCH (t:`' + T['label'] + '`) WHERE '
    }

    if (Object.keys(T).length > 3) {
        for (var i in T) {
            if (i != 'label' && i != 'limit' && i != 'skip') {
                cypher = cypher + 't.`' + i + "` =~ '.*" + T[i] + ".*' OR "
            }
        }
        cypher = cypher.slice(0, -3)
    } else {
        cypher = cypher.slice(0, -6)
    }
    // cypher = cypher + ' with h,t match p=shortestpath((h)'
    cypher = cypher + ' with h,t match p=(h)-[*..' + length + ']-(t) WITH *, relationships(p) AS r '
    // for (var i = 1; i < length; i++) {
    //     cypher += '-[]->()'
    // }
    // cypher += '-[]->(t) WITH *, relationships(p) AS r '

    if (option === 'list') {
        cypher = cypher + ' RETURN distinct t skip ' + T['skip'] + ' limit ' + T['limit']
    }
    else if (option === 'graph') {
        cypher = cypher + ' RETURN p limit ' + T['limit']
    }
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.nodeClick = function (id, H = null) {
    var session = driver.session()
    var cypher = ''
    console.log(H)
    H = JSON.parse(H)
    if (!H || H.label === '') {
        cypher += 'MATCH p=(n)-[]-(m) where ID(n)= ' + id + ' WITH *, relationships(p) AS r RETURN p limit 30'
    } else {
        cypher += 'MATCH p=(h:`' + H['label'] + '`)-[]-(t) where  ID(t)= ' + id + ' AND '
        for (var i in H) {
            if (i != 'label' && i != 'limit' && i != 'skip') {
                cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' AND "
            }
        }
        cypher = cypher.slice(0, -4)
        cypher += ' WITH *, relationships(p) AS r RETURN p limit 30'
    }
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session
        .run(cypher)
    return result
}

graphdb.nodeSurrounding = function (length, H) {
    var session = driver.session()
    var cypher = 'MATCH (h:`' + H['label'] + '`), p=(h)-[*..' + length + ']->(t) WHERE '
    // console.log(cypher)
    for (var i in H) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' AND "
        }
    }
    cypher = cypher.slice(0, -4)
    cypher = cypher + ' RETURN p limit ' + H['limit']
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session
        .run(cypher)
    return result
}

graphdb.initPatent = function () {
    var session = driver.session()
    var cypher = 'MATCH (n:`专利`)-[r]-(m) RETURN * limit 60'
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}
graphdb.initSupplier = function () {
    var session = driver.session()
    var cypher = 'MATCH (n:`[supplier,供应商]`)-[r]-(m) RETURN * limit 60'
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}
graphdb.initProduct = function () {
    var session = driver.session()
    var cypher = 'MATCH (n:`[category_label_rd,三级分类]`)-[r]-(m) RETURN * LIMIT 60'
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}
graphdb.init = function (H) {
    var session = driver.session()
    console.log(H)
    var cypher = 'MATCH (h:`' + H['label'] + '`)-[r]-(m) WHERE '
    // console.log(cypher)
    if (Object.keys(H).length > 1) {
        for (var i in H) {
            console.log(i)
            if (i != 'label' && i != 'limit' && i != 'skip') {
                cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' AND "
            }
        }
        cypher = cypher.slice(0, -4)
    } else {
        cypher = cypher.slice(0, -6)
    }
    cypher = cypher + ' RETURN * LIMIT 10'
    // console.log(cypher)

    // var cypher = 'MATCH (n:`' + hLabel['label'] + '`)-[r]-(m) RETURN * LIMIT 60'
    // // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}


graphdb.mergeRelationshipBatchsetRel = function (H, R, T) {
    var session = driver.session()
    cypher = ''
    // the Promise way, where the complete result is collected before we act on it:
    var count = 0
    for (var r_i in R) {
        cypher = cypher + ' MATCH ('
        cypher = cypher + 'n_' + count + ':`' + H[r_i]['label'] + '`{ `'
        for (var i in H[r_i]) {
            if (i != 'label' && i != 'limit' && i != 'resource' && i != 'skip' && H[r_i][i] != null && H[r_i][i].length != 0) {
                cypher = cypher + i + '` : "' + H[r_i][i].toString().replace(/\"/g, '\\"') + '" , `'
            }
        }
        cypher = cypher.slice(0, -3) + ' }) ' + ' MATCH ('
        cypher = cypher + 'm_' + count + ':`' + T[r_i]['label'] + '`{ `'
        for (var i in T[r_i]) {
            if (i != 'label' && i != 'limit' && i != 'skip' && i != 'resource' && T[r_i][i] != null && T[r_i][i].length != 0) {
                cypher = cypher + i + '` : "' + T[r_i][i].toString().replace(/\"/g, '\\"') + '" , `'
            }
        }
        cypher = cypher.slice(0, -3) + ' }) '
        count = count + 1
    }
    // // console.log(cypher)

    var count = 0
    for (var r_i in R) {
        cypher = cypher + ' MATCH (n_' + count + ')-[r_' + count + ':`' + R[r_i]['label'] + '`]->(m_' + count + ')  SET '
        for (var i in R[r_i]) {
            if (i != 'label' && i != 'limit' && i != 'skip') {
                cypher = cypher + ' r_' + count + '.`' + i + "` = '" + R[r_i][i] + "' , "
            }
        }
        cypher = cypher.slice(0, -2) + ' ; '
        count = count + 1
    }

    cypher = cypher.slice(0, -2) + ' RETURN * '
    // console.log(cypher)
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}
graphdb.createTriple = function (H, T, R) {
    var session = driver.session()
    var cypher = 'CREATE (h:`' + H['label'] + '`), (t:`' + T['label'] + '`), (h)-[r:`' + R['label'] + '`]->(t) SET '
    // console.log(cypher)
    for (var i in H) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + 'h.' + i + " = '" + H[i] + "' , "
        }
    }
    for (var i in T) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + 't.' + i + " = '" + T[i] + "' , "
        }
    }
    // for (var i in R) {
    //     if (i != 'label' && i != 'limit' && i != 'skip') {
    //         cypher = cypher + 'r.' + i + " = '" + R[i] + "' , "
    //     }
    // }
    cypher = cypher.slice(0, -2)
    cypher = cypher + ' RETURN * limit 30'
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.setRelationship = function (R, rUpdate) {
    var session = driver.session()
    var cypher = 'MATCH (h)-[r]-(t) WHERE '
    for (var i in R) {
        cypher = cypher + 'r.' + i + " = '" + R[i] + "' AND "
    }
    cypher = cypher.slice(0, -4)
    for (var i in rUpdate) {
        cypher = cypher + 'SET r.' + i + " = '" + rUpdate[i] + "' , "
    }
    cypher = cypher.slice(0, -2)
    cypher = cypher + ' RETURN * limit 100'
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

graphdb.graphEmbeddingNode2Vec = function (nodeLabelArray, relationLabelArray, orientation = 'NATURAL', embeddingDimension = 64, walkLength = 80, limit = 10) {
    var session = driver.session()
    //NATURAL, REVERSE, UNDIRECTED
    var cypher = 'CALL gds.alpha.node2vec.write({nodeProjection: ' + nodeLabelArray + ',relationshipProjection: ' + relationLabelArray + ',embeddingDimension: ' + embeddingDimension + ',iterations: 50,walkLength: ' + walkLength + ',writeProperty: "embeddingNode2Vec"})'

    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        // console.log(cypher)
        // cypher = 'MATCH (h:`' + hLabel + '`)-[:`' + rLabel + '`]->(t:`' + tLabel + '`) RETURN h.name AS `' + hLabel + '`, h.embeddingNode2Vec AS embedding, t.name AS `' + tLabel + '` LIMIT ' + limit
        // // console.log(cypher)
        var innerResult = await txc.run(cypher)
        return innerResult
    })


    return result
}

graphdb.graphEmbeddingGraphSage = function (hLabel, rLabel, tLabel, orientation = 'NATURAL', embeddingDimension = 64, walkLength = 10, limit = 10) {
    var session = driver.session()
    var cypher = 'CALL gds.beta.graphSage.train({nodeProjection: ' + hLabel + ',relationshipProjection: ' + rLabel + ', modelName: "trainedModel", projectedFeatureDimension:4, degreeAsProperty:true })'
    // console.log(cypher)

    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        // await txc.run(cypher)

        // cypher = 'CALL gds.beta.model.drop("cameraModel")'
        // // console.log(cypher)
        var innerResult = await txc.run(cypher)
        return innerResult
    })


    return result
}

graphdb.productConfigurationGraph = function (label, reqObj) {
    var session = driver.session()
    // var cypher = 'MATCH (h:`' + label + '`)-[]->(m) WHERE '
    var cypher = ''
    for (var i in reqObj) {
        if (reqObj[i].length !== 0) {
            reqObj[i].forEach((element, index) => {
                cypher += 'MATCH p = (h:`' + label + '`)-[*..' + (Number(i) - 2).toString() + ']->(t:`' + element.label + '`) WHERE '
                for (var j in element) {
                    if (j != 'label' && j != 'limit' && j != 'skip') {
                        cypher += 't.`' + j + '` =~ ".*' + element[j].replace(/\"/g, '\\"') + '.*" AND '
                    }
                }
                cypher = cypher.slice(0, -4) + ' RETURN DISTINCT h UNION '
            });
        }
    }
    cypher = cypher.slice(0, -6)
    cypher = cypher + ' LIMIT 60'
    console.log(cypher)

    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        // await txc.run(cypher)

        // cypher = 'CALL gds.beta.model.drop("cameraModel")'
        // // console.log(cypher)
        var innerResult = await txc.run(cypher)
        return innerResult
    })


    return result
}

graphdb.productConfigurationListSpanTree = function (label, reqObj, clickId = 0, transferlabel, transferid, skip = 0, limit = 10, fnCount = true, fnLink = false, maxLevel = 5) {
    var session = driver.session()
    var cypher = ''
    if (fnLink) {
        for (var i in reqObj) {
            if (reqObj[i].length !== 0) {
                reqObj[i].forEach((element, index) => {
                    cypher += 'MATCH p = (h:`' + label + '`)-[*..' + (Number(i) - 2).toString() + ']->(t:`' + element.label + '`) WHERE '
                    for (var j in element) {
                        if (j != 'label' && j != 'limit' && j != 'skip') {
                            cypher += 't.`' + j + '` =~ ".*' + element[j].replace(/\"/g, '\\"') + '.*" AND '
                        }
                    }
                    cypher = cypher.slice(0, -4)
                    // 特定应用场景
                    if (fnCount && fnLink) {
                        if (transferlabel) {
                            cypher = cypher + ' WITH * MATCH p1 = (h)-[*]->(tTrans) WHERE ANY ( label in labels(tTrans) WHERE label in ["' + transferlabel + '"] ) RETURN count(DISTINCT tTrans) '
                        }
                    } else if (!fnCount && fnLink) {
                        if (transferlabel) {
                            cypher = cypher + ' WITH * MATCH p1 = (h)-[*]->(tTrans) WHERE ANY ( label in labels(tTrans) WHERE label in ["' + transferlabel + '"] )  '

                            cypher = cypher + ' WITH * MATCH (tOri) where ID(tOri)=' + transferid + ' WITH tTrans, tOri RETURN  DISTINCT tTrans, gds.alpha.linkprediction.resourceAllocation(tOri, tTrans'
                            cypher = cypher + ') AS score ORDER BY score DESC SKIP ' + skip + ' LIMIT ' + limit
                        }
                    }
                    cypher = cypher + ' UNION '
                });
            }
        }
        cypher = cypher.slice(0, -6)
    } else {
        if (fnCount && !fnLink) {
            var cypher = ''
            cypher += 'MATCH p = (h:`' + label + '`) WHERE '
            // 特定应用场景
            if (typeof (clickId) === 'number') {
                cypher += ' ID(h) = ' + clickId + ' '
            } else if (typeof (clickId) === 'string') {
                cypher += " h.name = '" + clickId + "' "
            } else {
                cypher = cypher.slice(0, -6)
            }
            // maxLevel 写死5
            cypher = cypher + ' WITH h CALL apoc.path.subgraphNodes(h,{relationshipFilter: ">", minLevel: 0, maxLevel:5}) yield node RETURN count(distinct node)'
        } else if (!fnCount && !fnLink) {
            var cypher = ''
            cypher += 'MATCH p = (h:`' + label + '`) WHERE '
            // 特定应用场景
            if (typeof (clickId) === 'number') {
                cypher += ' ID(h) = ' + clickId + ' '
            } else if (typeof (clickId) === 'string') {
                cypher += " h.name = '" + clickId + "' "
            } else {
                cypher = cypher.slice(0, -6)
            }
            // cypher = cypher + ' WITH h CALL apoc.path.spanningTree(h,{relationshipFilter: ">", minLevel: 1, maxLevel: ' + maxLevel + '}) YIELD path RETURN path'
            cypher = cypher + ' WITH h MATCH p = (h)-[*..' + maxLevel + ']->(t) return DISTINCT p'
        }
    }
    console.log(cypher)

    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })
    return result
}

graphdb.productConfigurationList = function (label, reqObj, clickId = 0, transferlabel, transferid, skip = 0, limit = 10, fnCount = true, fnLink = false) {
    var session = driver.session()
    var cypher = ''
    for (var i in reqObj) {
        if (reqObj[i].length !== 0) {
            reqObj[i].forEach((element, index) => {
                cypher += 'MATCH p = (h:`' + label + '`)-[*..' + (Number(i) - 2).toString() + ']->(t:`' + element.label + '`) WHERE '
                for (var j in element) {
                    if (j != 'label' && j != 'limit' && j != 'skip') {
                        cypher += 't.`' + j + '` =~ ".*' + element[j].replace(/\"/g, '\\"') + '.*" AND '
                    }
                }
                // 特定应用场景
                if (clickId !== 0 && typeof (clickId) === 'number') {
                    cypher += ' ID(h) = ' + clickId + ' '
                } else if (typeof (clickId) === 'string') {
                    cypher += " h.name = '" + clickId + "' "
                } else {
                    cypher = cypher.slice(0, -4)
                }

                if (fnCount && !fnLink) {
                    cypher = cypher + ' with * MATCH (h)-[]->(tAll) RETURN count(DISTINCT tAll) '
                } else if (fnCount && fnLink) {
                    if (transferlabel) {
                        cypher = cypher + ' WITH * MATCH p1 = (h)-[*]->(tTrans) WHERE ANY ( label in labels(tTrans) WHERE label in ["' + transferlabel + '"] ) RETURN count(DISTINCT tTrans) '
                    }
                } else if (!fnCount && fnLink) {
                    if (transferlabel) {
                        cypher = cypher + ' WITH * MATCH p1 = (h)-[*]->(tTrans) WHERE ANY ( label in labels(tTrans) WHERE label in ["' + transferlabel + '"] )  '

                        cypher = cypher + ' WITH * MATCH (tOri) where ID(tOri)=' + transferid + ' WITH tTrans, tOri RETURN  DISTINCT tTrans, gds.alpha.linkprediction.resourceAllocation(tOri, tTrans'
                        cypher = cypher + ') AS score ORDER BY score DESC SKIP ' + skip + ' LIMIT ' + limit
                    }
                } else if (!fnCount && !fnLink) {
                    cypher = cypher + ' with * MATCH (h)-[]->(tAll) RETURN DISTINCT tAll ORDER BY labels(tAll) SKIP ' + skip + ' LIMIT ' + limit
                }
                cypher = cypher + ' UNION '
            });
        }
    }
    cypher = cypher.slice(0, -6)
    // console.log(cypher)

    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })


    return result
}

graphdb.productConfigurationTree = function (label, reqObj, clickName = '', skip = 0, limit = 10, fnCount = true, fnInit = true) {
    var session = driver.session()
    var cypher = ''
    if (fnInit) {
        for (var i in reqObj) {
            if (reqObj[i].length !== 0) {
                reqObj[i].forEach((element, index) => {
                    cypher += 'MATCH p = (h:`' + label + '`)-[*..' + (Number(i) - 2).toString() + ']->(t:`' + element.label + '`) WHERE '
                    for (var j in element) {
                        if (j != 'label' && j != 'limit' && j != 'skip') {
                            cypher += 't.`' + j + '` =~ ".*' + element[j].replace(/\"/g, '\\"') + '.*" AND '
                        }
                    }
                    cypher = cypher.slice(0, -4)
                    // 特定应用场景
                    if (fnInit) {
                        if (fnCount) {
                            cypher = cypher + ' RETURN count(DISTINCT h) '
                        } else {
                            cypher = cypher + ' RETURN DISTINCT h ORDER BY labels(h) SKIP ' + skip + ' LIMIT ' + limit
                        }
                    } else {
                        if (fnCount) {
                            cypher = cypher + ' RETURN count(DISTINCT t) '
                        } else {
                            cypher = cypher + ' RETURN DISTINCT t ORDER BY labels(t) SKIP ' + skip + ' LIMIT ' + limit
                        }
                    }
                    cypher = cypher + ' UNION '
                });
            }
        }
        cypher = cypher.slice(0, -6)
        // console.log(cypher)
    } else {
        cypher += 'MATCH (h)-[]->(t)  WHERE '
        if (clickName !== '') {
            cypher += ' h.name = "' + clickName + '" WITH * '
        }
        if (fnInit) {
            if (fnCount) {
                cypher = cypher + ' RETURN count(DISTINCT h) '
            } else {
                cypher = cypher + ' RETURN DISTINCT h ORDER BY labels(h) SKIP ' + skip + ' LIMIT ' + limit
            }
        } else {
            if (fnCount) {
                cypher = cypher + ' RETURN count(DISTINCT t) '
            } else {
                cypher = cypher + ' RETURN DISTINCT t ORDER BY labels(t) SKIP ' + skip + ' LIMIT ' + limit
            }
        }
    }
    // console.log(cypher)

    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })
    return result
}

// 配置规则推理
graphdb.productConfigurationRule = function (H, M, T, res, type) {
    var session = driver.session()
    // var cypher = 'MATCH (h:`' + label + '`)-[]->(m) WHERE '
    var cypher = ''
    cypher += 'MATCH (h:`' + H['label'] + '`) '
    cypher += 'MATCH (m:`' + M['label'] + '`) '
    cypher += 'MATCH (t:`' + T['label'] + '`) '
    cypher += ' WHERE '

    for (var i in H) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' AND "
        }
    }
    for (var i in M) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + 'm.`' + i + "` =~ '.*" + M[i] + ".*' AND "
        }
    }
    for (var i in T) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + 't.`' + i + "` =~ '.*" + T[i] + ".*' AND "
        }
    }
    cypher = cypher.slice(0, -4)

    if (type === 'option') {
        cypher += 'MATCH (h)-[]-(m)-[]-(t) WITH t MATCH (t)-[]-(i:`' + res['label'] + '`) '
        cypher += 'RETURN DISTINCT i SKIP ' + res['skip'] + ' LIMIT ' + res['limit']
    } else if (type === 'graph') {
        cypher += 'MATCH (h)-[r1]-(m)-[r2]-(t) WITH * MATCH (t)-[r3]-(i:`' + res['label'] + '`) '
        cypher += 'RETURN * ' + ' LIMIT ' + res['limit']
    } else if (type === 'rule') {
        cypher += 'MATCH (h)-[]-(m)-[]-(t) WITH m, t MATCH (t)-[]-(i:`' + res['label'] + '`) '
        cypher += 'RETURN DISTINCT m, i SKIP ' + res['skip'] + ' LIMIT ' + res['limit']
    }

    // console.log(cypher)

    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        // await txc.run(cypher)

        // cypher = 'CALL gds.beta.model.drop("cameraModel")'
        // // console.log(cypher)
        var innerResult = await txc.run(cypher)
        return innerResult
    })


    return result
}

// 配置规则导入查询
graphdb.productConfigurationRuleQuery = function (H, type) {
    var session = driver.session()
    var cypher = 'MATCH (h:`' + H['label'] + '`)-[r]-(t) WHERE '
    // console.log(cypher)
    if (Object.keys(H).length > 3) {
        for (var i in H) {
            if (i != 'label' && i != 'limit' && i != 'skip') {
                cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' AND "
            }
        }
        cypher = cypher.slice(0, -4)
    } else {
        cypher = cypher.slice(0, -6)
    }

    if (type === 'graph') {
        cypher = cypher + ' RETURN * skip ' + H['skip'] + ' limit ' + H['limit']
    } else if (type === 'list') {
        cypher = cypher + ' RETURN DISTINCT h, r, t skip ' + H['skip'] + ' limit ' + H['limit']
    } else if (type === 'rule') {
        cypher = cypher + ' RETURN DISTINCT h, t skip ' + H['skip'] + ' limit ' + H['limit']
    }
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

//配置规则推理
graphdb.productConfigurationRuleReasoning = function (H, fnCount = true) {
    var session = driver.session()
    var cypher = 'MATCH (h) WHERE  '
    for (var i in H) {
        if (i != 'label' && i != 'limit' && i != 'skip' && typeof (H[i]) !== 'object') {
            if (H[i].split('/')) {
                H[i].split('/').forEach(keyword => {
                    cypher = cypher + 'h.`' + i + "` =~ '.*" + keyword + ".*' or "
                })
            } else {
                cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' or "
            }
        }
    }
    cypher = cypher.slice(0, -4)
    cypher = cypher + ' WITH h MATCH (h)<-[r]-(t) where NONE ( label in labels(h) WHERE label in ["整机", "主结构"] ) WITH h, r'
    if (fnCount) {
        cypher = cypher + ' RETURN count(DISTINCT h)'
    } else {
        cypher = cypher + ' RETURN DISTINCT h skip ' + H['skip'] + ' limit ' + H['limit']
    }
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })

    return result
}

// 配置规则自动生成
graphdb.DeParRule = function (N, H, M, T, R) {
    var session = driver.session()
    // var cypher = 'MATCH (h:`' + label + '`)-[]->(m) WHERE '
    var cypher = ''
    cypher += 'MATCH (n:`' + N['label'] + '`) '
    cypher += 'MATCH (h:`' + H['label'] + '`) '
    cypher += ' WHERE '

    for (var i in N) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + 'n.`' + i + "` =~ '.*" + N[i] + ".*' AND "
        }
    }
    cypher = cypher.slice(0, -4)

    if (M['label']) {
        cypher += 'MATCH (m:`' + M['label'] + '`) '
        cypher += 'MATCH (n)-[r1]-(h)-[r2]-(m) MERGE (n)-[r:`' + R['label'] + '`]->(m) '
        cypher += 'RETURN DISTINCT n, m '
    } else if (T['label']) {
        cypher += 'MATCH (t:`' + T['label'] + '`) '
        cypher += 'MATCH (n)-[r1]-(h)-[r2]-(m)-[r3]-(t) MERGE (n)-[r:`' + R['label'] + '`]->(t) '
        cypher += 'RETURN DISTINCT n, t '
    }


    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })


    return result
}

graphdb.DeParRuleGraph = function (H, R) {
    var session = driver.session()
    var cypher = 'MATCH (h:`' + H['label'] + '`)-[r:`' + R['label'] + '`]-(t) WHERE '
    // console.log(cypher)
    for (var i in H) {
        if (i != 'label' && i != 'limit' && i != 'skip') {
            cypher = cypher + 'h.`' + i + "` =~ '.*" + H[i] + ".*' AND "
        }
    }
    cypher = cypher.slice(0, -4)
    cypher = cypher + ' RETURN *  limit ' + H['limit']
    // console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })


    return result
}

// 集成PLM
graphdb.mergePLMOnEntity = function (plm, productClass="电推剪") {
    var session = driver.session()
    if (plm === 'ZDLKPLM') {
        var cypher = 'CALL apoc.load.jdbc("jdbc:sqlserver://;servername=10.0.0.32;databaseName=opsa;user=sa;password=123", '
        if (!productClass) {
            cypher += '"ppdm.bom_ppdm.zpbomversionmax"'
        } else {
            cypher += '"select len(结构号)/5 +1 层级,a.结构号,a.产品代号,a.材料, a.数量, a.产品编码, a.类别, a.是否核心物料, a.BOMver, a.规格, a.供应商, a.备注,a.名称, a.制造方式, a.是否进口, b.物料类别, b.FNumber_TX 物料编码 from ppdm.bom_ppdm.zpbomVersionMax a left join ppdm.dbo.Material_Base b on a.物料编码 = b.Fnumber_tx where a.BOMType=0 and exists(select 1 from ppdm.bom_ppdm.zpbomVersionMax c where 产品代号=a.产品代号 and 产品编码=a.产品编码 and a.BOMType=BOMType and 结构号=\'1\' AND exists(select 1 from ppdm.dbo.material_base where FNumber_TX=c.物料编码 and 物料类别=\''+ productClass +'\')) order by a.产品代号,a.产品编码,a.结构号"'
        }
        cypher += ') YIELD row MERGE (p:`产品`{id:row.`物料编码`, name:row.`名称`}) ON MATCH SET p.`结构号` = row.`结构号`, p.`物料类别` = row.`物料类别`, p.`材料` = row.`材料`, p.`数量` = row.`数量`, p.partType = row.`类别`, p.`制造方式` = row.`制造方式`, p.`核心物料` = row.`是否核心物料`, p.BOMID = row.`产品编码`, p.BOMEdition = row.`BOMver`, p.productID = row.`产品代号`, p.`规格` = row.`规格`, p.`供应商` = row.`供应商`, p.prop = row.`备注` ON CREATE SET p.`结构号` = row.`结构号`, p.`物料类别` = row.`物料类别`, p.`材料` = row.`材料`, p.`核心物料` = row.`是否核心物料`, p.`数量` = row.`数量`, p.partType = row.`类别`, p.`制造方式` = row.`制造方式`, p.BOMID = row.`产品编码`, p.BOMEdition = row.`BOMver`, p.productID = row.`产品代号`, p.`规格` = row.`规格`, p.`供应商` = row.`供应商`, p.prop = row.`备注` return *'
    }
    console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })
    return result
}

graphdb.mergePLMOnEntityMaterial = function () {
    var session = driver.session()
    // var cypher = 'MATCH (p:`产品`) CALL apoc.create.setLabels( p, [ p.name, \'产品\' ] ) YIELD node return p; '
    var cypher = 'CALL apoc.load.jdbc("jdbc:sqlserver://;servername=10.0.0.32;databaseName=opsa;user=sa;password=123","ppdm.dbo.Material_Base") YIELD row MERGE (p:`产品`{id:row.FNumber_TX}) ON CREATE SET p.name = row.`名称`, p.labels = row.`物料类别`, p.`材料` = row.`材料`, p.`制造方式` = row.`制造方式`, p.`进口` = row.`是否进口`, p.`规格` = row.`规格`, p.`作废标志` = row.`作废标志`, p.`重量单位` = row.`重量单位`, p.`单位重量` = row.`单位重量` ON MATCH SET p.name = row.`名称`, p.labels = row.`物料类别`, p.`材料` = row.`材料`, p.`制造方式` = row.`制造方式`, p.`进口` = row.`是否进口`, p.`规格` = row.`规格`, p.`作废标志` = row.`作废标志`, p.`重量单位` = row.`重量单位`, p.`单位重量` = row.`单位重量` RETURN *'
    console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })
    return result
}

graphdb.mergePLMOnEntityLabel = function () {
    var session = driver.session()
    var cypher = 'MATCH (p:`产品`) CALL apoc.create.setLabels( p, [p.labels, \'产品\'] ) YIELD node return p; '
    console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })
    return result
}

graphdb.mergePLMRelationshipBatchRelLabel = function (plm, productID) {
    var session = driver.session()
    if (plm === 'ZDLKPLM') {
        var cypher = 'CALL apoc.load.jdbc("jdbc:sqlserver://;servername=10.0.0.32;databaseName=opsa;user=sa;password=123","SELECT distinct isnull(b.物料编码,\'_\') 父物料编码,isnull(b.名称,\'_\') 父名称,a.物料编码,a.名称,len(a.结构号)/5 +1 层级,a.结构号 FROM ppdm.bom_ppdm.zpbomversionmax a left join ppdm.bom_ppdm.zpbomversionmax b on a.[产品代号]=b.[产品代号] and a.产品编码=b.产品编码 and a.结构号 like b.结构号+\'%\' and len(a.结构号)=len(b.结构号)+5 '
        if (!productID) {
            cypher += ''
        } else {
            cypher += 'where a.产品代号=\'' + productID + '\''
        }
        cypher += '") YIELD row MATCH (h{id:row.`父物料编码`}) MATCH (t{id:row.`物料编码`}) merge (h)-[r:BOM{`层级`: row.`层级`, `结构号`: row.`结构号`}]->(t) return *'
    }
    console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })


    return result
}

graphdb.mergePLMSupplierOnEntity = function (plm) {
    var session = driver.session()
    if (plm === 'ZDLKPLM') {
        var cypher = 'CALL apoc.load.jdbc("jdbc:sqlserver://;servername=10.0.0.32;databaseName=opsa;user=sa;password=123","TB_CustomBillData22") YIELD row MERGE (p:`供应商`{id:row.PKID_TX}) ON MATCH SET p.name = row.CustomAttr54443, p.`productionValue` = row.CustomAttr54461, p.`productionCapacity` = row.CustomAttr54732, p.userIntention = row.CustomAttr54444, p.phone = row.CustomAttr54445, p.email = row.CustomAttr54447, p.url = row.CustomAttr54448, p.address = row.CustomAttr54449, p.shareholder = row.CustomAttr54450, p.source = row.CustomAttr54451, p.country = row.CustomAttr54452, p.province = row.CustomAttr54453, p.city = row.CustomAttr54454, p.industry = row.CustomAttr54455, p.postcode = row.CustomAttr54456, p.product = row.CustomAttr54457, p.software = row.CustomAttr54458, p.prop = row.CustomAttr54460+\'/\'+row.CustomAttr54465+\'/\'+row.CustomAttr54467+\'/\'+row.CustomAttr54468, p.companyType = row.CustomAttr54469, p.productType = row.CustomAttr54490, p.urbanCluster = \'长三角城市群\' ON CREATE SET p.name = row.CustomAttr54443, p.`productionValue` = row.CustomAttr54461, p.`productionCapacity` = row.CustomAttr54732, p.userIntention = row.CustomAttr54444, p.phone = row.CustomAttr54445, p.email = row.CustomAttr54447, p.url = row.CustomAttr54448, p.address = row.CustomAttr54449, p.shareholder = row.CustomAttr54450, p.source = row.CustomAttr54451, p.country = row.CustomAttr54452, p.province = row.CustomAttr54453, p.city = row.CustomAttr54454, p.industry = row.CustomAttr54455, p.postcode = row.CustomAttr54456, p.product = row.CustomAttr54457, p.software = row.CustomAttr54458, p.prop = row.CustomAttr54460+\'/\'+row.CustomAttr54465+\'/\'+row.CustomAttr54467+\'/\'+row.CustomAttr54468, p.companyType = row.CustomAttr54469, p.productType = row.CustomAttr54490, p.urbanCluster = \'长三角城市群\' return p'
    }
    console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })
    return result
}

graphdb.mergePLMSupplierRelationshipBatchRelLabel = function (plm) {
    var session = driver.session()
    if (plm === 'ZDLKPLM') {
        var cypher = 'MATCH (h) MATCH (t:`供应商`)  WHERE NONE ( label in labels(h) WHERE label in [\'供应商\'] ) and t.product = h.name MERGE (h)<-[r:produce]-(t) RETURN * '
        // var cypher = 'MATCH (h) MATCH (t:`供应商`) WHERE NONE ( label in labels(h) WHERE label in [\'供应商\'] ) and t.产品=~ \'.*电机.*\' and  h.name=~ \'.*DC电机-HC-530.*\' MERGE (h)<-[r:produce]-(t) RETURN *'
    }
    console.log(cypher)
    // the Promise way, where the complete result is collected before we act on it:
    var result = session.writeTransaction(async txc => {
        var innerResult = await txc.run(cypher)
        return innerResult
    })
    return result
}

// script of LY

// 导出csv
// MATCH (n)-[r]->(m)
// WITH collect(DISTINCT n) AS n, collect(DISTINCT m) AS m, collect(r) AS r
// CALL apoc.export.csv.data(n + m, r, "kjzy.csv", {stream: true})
// YIELD file, nodes, relationships, properties, data
// RETURN file, nodes, relationships, properties, data

// 导入csv
// CALL apoc.import.csv(
//     [{fileName: 'FILE:///D:/Program Files/neo4j-community-4.0.0-windows/neo4j-community-4.0.5-kjzy/kjzy+ZDLKPLMNode.csv', labels: []}],
//     [{fileName: 'FILE:///D:/Program Files/neo4j-community-4.0.0-windows/neo4j-community-4.0.5-kjzy/kjzy+ZDLKPLMRel.csv', type: ''}],
//     {delimiter: ',', stringIds: false, ignoreBlankString: true, ignoreDuplicateNodes: true}
//   );

// skip (0+i)*j limit j

// CALL db.schema.visualization()

// CALL gds.alpha.node2vec.stream({
//   nodeProjection: "产品-摄像头",
//   relationshipProjection: {
//     零部件: {
//       type: "零部件",
//       orientation: "UNDIRECTED"
//     }
//   },
//   embeddingDimension: 10,
//   iterations: 10,
//   walkLength: 10
// })
// YIELD nodeId, embedding
// RETURN gds.util.asNode(nodeId).name AS place, embedding
// LIMIT 5;

// CALL gds.alpha.node2vec.write({
//     nodeProjection: "产品-摄像头",
// relationshipProjection: {
//   零部件: {
//     type: "零部件",
//     orientation: "UNDIRECTED"
//   }
// },
//     embeddingDimension: 64,
//     iterations: 10,
//     walkLength: 10,
//     writeProperty: "embeddingNode2vec"
//   })


// CALL gds.beta.graphSage.train(
//     {
//       nodeProjection: ["产品-摄像头","产品-pcb"],
//       relationshipProjection: "零部件",
//       aggregator: 'mean', // pool
//       activationFunction: 'sigmoid', // relu
//       sampleSizes: [25, 10],
//       modelName: 'cameraModel',
//       projectedFeatureDimension:4,
//       degreeAsProperty:true
//     }
//   )
// CALL gds.beta.model.drop("cameraModel")


// 月立库
// 192.168.114.1

// CALL apoc.load.jdbc("jdbc:sqlserver://;servername=10.0.0.32;databaseName=opsa;user=sa;password=123","select len(结构号)/5 +1 层级,a.结构号,a.产品代号,a.材料, a.数量, a.产品编码, a.类别, a.是否核心物料, a.BOMver, a.规格, a.供应商, a.备注,a.名称, a.制造方式, a.是否进口, b.物料类别, b.FNumber_TX 物料编码 from ppdm.bom_ppdm.zpbomVersionMax a left join ppdm.dbo.Material_Base b on a.物料编码 = b.Fnumber_tx where a.BOMType=0 and exists(select 1 from ppdm.bom_ppdm.zpbomVersionMax c where 产品代号=a.产品代号 and 产品编码=a.产品编码 and a.BOMType=BOMType and 结构号='1' AND exists(select 1 from ppdm.dbo.material_base where FNumber_TX=c.物料编码 and 物料类别='电推剪')) order by a.产品代号,a.产品编码,a.结构号") YIELD row MERGE (p:`产品`{id:row.`物料编码`, 名称:row.`名称`}) ON MATCH SET p.`物料类别` = row.`物料类别`, p.`材料` = row.`材料`, p.`数量` = row.`数量`, p.partType = row.`类别`, p.`制造方式` = row.`制造方式`, p.`核心物料` = row.`是否核心物料`, p.BOMID = row.`BOMver`, p.productID = row.`产品代号`, p.`规格` = row.`规格`, p.`供应商` = row.`供应商`, p.prop = row.`备注` ON CREATE SET p.`物料类别` = row.`物料类别`, p.`材料` = row.`材料`, p.`核心物料` = row.`是否核心物料`, p.`数量` = row.`数量`, p.partType = row.`类别`, p.`制造方式` = row.`制造方式`, p.BOMID = row.`BOMver`, p.productID = row.`产品代号`, p.`规格` = row.`规格`, p.`供应商` = row.`供应商`, p.prop = row.`备注` WITH collect(p) AS product
// CALL apoc.export.csv.data(product, [], "product.csv", {})
// YIELD file RETURN file

// 联科库
// CALL apoc.load.jdbc("jdbc:sqlserver://;servername=192.168.1.254;databaseName=opsa;user=adm;password=123","TB_CustomBillData22") YIELD row RETURN *;
// CALL apoc.load.jdbc("jdbc:sqlserver://;servername=192.168.1.254;databaseName=opsa;user=adm;password=123","ppdm.bom_ppdm.zpbomversionmax") YIELD row RETURN *;
// CALL apoc.load.jdbc("jdbc:sqlserver://;servername=192.168.1.254;databaseName=opsa;user=adm;password=123","ppdm.dbo.Material_Base") YIELD row RETURN *;

// 联科产品-供应商
// CALL apoc.load.jdbc("jdbc:sqlserver://;servername=192.168.1.254;databaseName=opsa;user=adm;password=123","ppdm.bom_ppdm.zpbomversionmax") YIELD row MERGE (p:`产品`{id:row.`物料编码`, name:row.`名称`}) ON MATCH SET p.`材料` = row.`材料`, p.`数量` = row.`数量`, p.partType = row.`类别`, p.`制造方式` = row.`制造方式`, p.`核心物料` = row.`是否核心物料`, p.BOMID = row.`产品编码`, p.BOMEdition = row.`BOMver`, p.productID = row.`产品代号`, p.`规格` = row.`规格`, p.`供应商` = row.`供应商`, p.prop = row.`备注` ON CREATE SET p.`材料` = row.`材料`, p.`核心物料` = row.`是否核心物料`, p.`数量` = row.`数量`, p.partType = row.`类别`, p.`制造方式` = row.`制造方式`, p.BOMID = row.`产品编码`, p.BOMEdition = row.`BOMver`, p.productID = row.`产品代号`, p.`规格` = row.`规格`, p.`供应商` = row.`供应商`, p.prop = row.`备注` return *
// CALL apoc.load.jdbc("jdbc:sqlserver://;servername=192.168.1.254;databaseName=opsa;user=adm;password=123","TB_CustomBillData22") YIELD row MERGE (p:`供应商`{id:row.PKID_TX}) ON MATCH SET p.name = row.CustomAttr54443, p.`productionValue` = row.CustomAttr54461, p.`productionCapacity` = row.CustomAttr54732, p.userIntention = row.CustomAttr54444, p.phone = row.CustomAttr54445, p.email = row.CustomAttr54447, p.url = row.CustomAttr54448, p.address = row.CustomAttr54449, p.shareholder = row.CustomAttr54450, p.source = row.CustomAttr54451, p.country = row.CustomAttr54452, p.province = row.CustomAttr54453, p.city = row.CustomAttr54454, p.industry = row.CustomAttr54455, p.postcode = row.CustomAttr54456, p.product = row.CustomAttr54457, p.software = row.CustomAttr54458, p.prop = row.CustomAttr54460+\'/\'+row.CustomAttr54465+\'/\'+row.CustomAttr54467+\'/\'+row.CustomAttr54468, p.companyType = row.CustomAttr54469, p.productType = row.CustomAttr54490, p.urbanCluster = \'长三角城市群\' ON CREATE SET p.name = row.CustomAttr54443, p.`productionValue` = row.CustomAttr54461, p.`productionCapacity` = row.CustomAttr54732, p.userIntention = row.CustomAttr54444, p.phone = row.CustomAttr54445, p.email = row.CustomAttr54447, p.url = row.CustomAttr54448, p.address = row.CustomAttr54449, p.shareholder = row.CustomAttr54450, p.source = row.CustomAttr54451, p.country = row.CustomAttr54452, p.province = row.CustomAttr54453, p.city = row.CustomAttr54454, p.industry = row.CustomAttr54455, p.postcode = row.CustomAttr54456, p.product = row.CustomAttr54457, p.software = row.CustomAttr54458, p.prop = row.CustomAttr54460+\'/\'+row.CustomAttr54465+\'/\'+row.CustomAttr54467+\'/\'+row.CustomAttr54468, p.companyType = row.CustomAttr54469, p.productType = row.CustomAttr54490, p.urbanCluster = \'长三角城市群\' return p
// CALL apoc.load.jdbc("jdbc:sqlserver://;servername=192.168.1.254;databaseName=opsa;user=adm;password=123","ppdm.dbo.Material_Base") YIELD row MERGE (p:`产品`{id:row.FNumber_TX}) ON CREATE SET p.`材料` = row.`材料`, p.`制造方式` = row.`制造方式`, p.`进口` = row.`是否进口`, p.`规格` = row.`规格`, p.`作废标志` = row.`作废标志`, p.`重量单位` = row.`重量单位`, p.`单位重量` = row.`单位重量`  ON MATCH SET p.`材料` = row.`材料`, p.`制造方式` = row.`制造方式`, p.`进口` = row.`是否进口`, p.`规格` = row.`规格`, p.`作废标志` = row.`作废标志`, p.`重量单位` = row.`重量单位`, p.`单位重量` = row.`单位重量` RETURN *;

// SELECT distinct b.物料编码 父物料编码,b.名称 父名称,a.物料编码,a.名称 FROM ppdm.bom_ppdm.zpbomversionmax a left join ppdm.bom_ppdm.zpbomversionmax b on a.[产品代号]=b.[产品代号] and a.产品编码=b.产品编码 and a.结构号 like b.结构号+'%' and len(a.结构号)=len(b.结构号)+5 where a.产品代号='Y05060-002copy'
// select * from ppdm.bom_ppdm.zpbomversionmax where 产品代号=\'311545001\'

// 异步（重复）
// CALL apoc.periodic.iterate(
//     'CALL apoc.load.jdbc("jdbc:sqlserver://;servername=192.168.1.254;databaseName=opsa;user=adm;password=123","ppdm.bom_ppdm.zpbomversionmax") YIELD row',
//     'MERGE (p:`产品`{id:row.`代号`}) ON MATCH SET p.name = row.`名称`, p.layer = row.`结构号` ON CREATE SET p.name = row.`名称`, p.layer = row.`结构号` return *',
//     { batchSize: 10, parallel: true })

// CALL apoc.periodic.iterate(
//     'CALL apoc.load.jdbc("jdbc:sqlserver://;servername=192.168.1.254;databaseName=opsa;user=adm;password=123","TB_CustomBillData22") YIELD row',
//     'MERGE (p:`供应商`{id:row.`PKID_TX`}) ON MATCH SET p.name = row.`CustomAttr54443`, p.product = row.`CustomAttr54457`  ON CREATE SET p.name = row.`CustomAttr54443`, p.product = row.`CustomAttr54457` return *',
//     { batchSize: 10, parallel: true })

// 修改物料label
// match (n:`供应商`)
// CALL apoc.create.setLabels( n, [ n.name ] )
// YIELD node
// RETURN node;

// MATCH (p:`产品`) CALL apoc.create.setLabels( p, [ p.name, '产品' ] ) YIELD node return p

// merge 关系
// Match (h) Match (t:`供应商`)  where NONE ( label in labels(h) WHERE label in ['供应商'] ) and t.product = h.name return *
// Match (h) Match (t:`供应商`) where NONE ( label in labels(h) WHERE label in ['供应商'] ) and t.产品=~ '.*电机.*' and  h.name=~ '.*DC电机-HC-530.*' merge (h)<-[r:has]-(t) return *
// CALL apoc.load.jdbc("jdbc:sqlserver://;servername=192.168.1.254;databaseName=opsa;user=adm;password=123","SELECT distinct isnull(b.物料编码,'_') 父物料编码,isnull(b.名称,'_') 父名称,a.物料编码,a.名称 FROM ppdm.bom_ppdm.zpbomversionmax a left join ppdm.bom_ppdm.zpbomversionmax b on a.[产品代号]=b.[产品代号] and a.产品编码=b.产品编码 and a.结构号 like b.结构号+'%' and len(a.结构号)=len(b.结构号)+5 where a.产品代号='Y05060-002copy'") YIELD row MATCH (h{id:row.`父物料编码`}) MATCH (t{id:row.`物料编码`}) merge (h)-[r:BOM]->(t) return *

// CALL apoc.load.jdbc("jdbc:sqlserver://;servername=192.168.1.254;databaseName=opsa;user=adm;password=123","select * from ppdm.bom_ppdm.zpbomversionmax where 产品代号=\'Y05060-002copy\'") YIELD row MERGE (p:`产品`{id:row.`物料编码`}) ON MATCH SET p.name = row.`名称` ON CREATE SET p.name = row.`名称`return *


// 去重
// MATCH (com:`专利`)
// WITH {name:com.name} as item,collect(com) as list
// where size(list)>1 
// unwind list[1..size(list)] as user 
// detach delete user

// MATCH (n)
// WITH n.name AS name, COLLECT(n) AS nodelist, COUNT(*) AS count
// WHERE count > 1
// CALL apoc.refactor.mergeNodes(nodelist) YIELD node
// RETURN count(node)

module.exports = graphdb

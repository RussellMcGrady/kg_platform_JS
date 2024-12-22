/*****
 * Created by lysy on 2024/12/22.
 *
 */
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/pslm-workflow";
var mongodb = {}

/**
 * 测试连接
 */
mongodb.connect = function () {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        console.log("mongodb数据库已连接!");
        db.close();
    });
}
/****
 * 查询单条数据
 * @param collection 集合名称
 * @param cypher
 * @param fn
 */
mongodb.queryOne = function (collection,cypher,fn) {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pslm-workflow");
        dbo.collection(collection).find(cypher).toArray(function(err, res) {
            if (err) throw err;
            console.log(res);
            db.close();
            fn(err,res)
        });
    });
}
/****
 * 查询分页
 * @param collection 集合名称
 * @param cypher
 * @param skip
 * @param limit
 */
mongodb.query = function (collection,cypher,skip,limit) {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pslm-workflow");
        dbo.collection(collection).find(cypher).skip(skip).limit(limit).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
        });
    });
}
/****
 * 插入单条数据
 * @param collection
 * @param cypher
 * @param fn
 */
mongodb.insert = function (collection,cypher,fn) {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pslm-workflow");
        dbo.collection(collection).insertOne(cypher, function(err, res) {
            if (err) throw err;
            console.log("数据插入成功");
            db.close();
            fn(err,res)
        });
    });
}
/****
 * 插入多条数据
 * @param collection
 * @param cypher
 */
mongodb.insertMany = function (collection,cypher) {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pslm-workflow");
        dbo.collection(collection).insertMany(cypher, function(err, res) {
            if (err) throw err;
            console.log("数据插入成功");
            db.close();
        });
    });
}
/****
 * 更新单条数据
 * @param collection
 * @param whereStr
 * @param updateStr
 */
mongodb.update = function (collection,whereStr,updateStr,fn) {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pslm-workflow");
        dbo.collection(collection).updateOne(whereStr, updateStr, function(err, res) {
            if (err) throw err;
            console.log("文档更新成功");
            db.close();
            fn(err,res)
        });
    });
}
/***
 * 更新多条数据
 * @param collection
 * @param whereStr
 * @param updateStr
 */
mongodb.updateMany = function (collection,whereStr,updateStr) {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pslm-workflow");
        dbo.collection("collection").updateMany(whereStr, updateStr, function(err, res) {
            if (err) throw err;
            console.log(res.result.nModified + " 条文档被更新");
            db.close();
        });
    });
}
/****
 * 删除单条数据
 * @param collection
 * @param whereStr
 */
mongodb.delete = function (collection,whereStr) {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pslm-workflow");
        dbo.collection("collection").deleteOne(whereStr, function(err, obj) {
            if (err) throw err;
            console.log("文档删除成功");
            db.close();
        });
    });
}
/****
 * 删除多条数据
 * @param collection
 * @param whereStr
 */
mongodb.deleteMany = function (collection,whereStr) {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db("pslm-workflow");
        dbo.collection("collection").deleteMany(whereStr, function(err, res) {
            if (err) throw err;
            console.log(res.result.nModified + " 条文档被更新");
            db.close();
        });
    });
}
module.exports = mongodb

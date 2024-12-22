/*
* 连接池连接数据库
* */
const mysql = require("mysql");
const env = require('./env');
var db = {}

db.query = function (sql, arr, fn) {
    const db_config = env.db_config
    let pool = mysql.createPool(db_config);

    pool.getConnection(function (err, connection) {//通过getConnection()方法进行数据库连接
        if (err) {
            console.log(`mysq连接失败${err}`);
        } else {
           // console.log(`mysql连接成功`);
            if (!sql) return
            connection.query(sql, arr, function (err, response) {
                if (err) {
                    fn(err, response)
                    console.log(`SQL error:${err}`)

                } else {

                    connection.release();//释放连接池中的数据库连接
                    pool.end();//关闭连接池
                    fn(err, response)
                }

            })
            /* connect.query('select * from news',function(err,result){
                 if(err){
                     console.log(`SQL error:${err}`)
                 }else{
                     console.log(result);
                     connect.release();//释放连接池中的数据库连接
                     pool.end();//关闭连接池
                 }
             });*/
            // connect.release();//释放连接池中的数据库连接
            // pool.end();//关闭连接池
        }
    });

},

    db.insert = function (sql, arr, fn) {
        const db_config = env.db_config
        let pool = mysql.createPool(db_config);

        pool.getConnection(function (err, connection) {//通过getConnection()方法进行数据库连接
            if (err) {
                console.log(`mysq连接失败${err}`);
            } else {
                //console.log(`mysql连接成功`);
                if (!sql) return
                connection.query(sql, arr, function (err, response) {
                    if (err) {
                        fn(err, response)
                        console.log(`SQL error:${err}`)
                    } else {

                        connection.release();//释放连接池中的数据库连接
                        pool.end();//关闭连接池
                        fn(err, response)
                    }

                })
                /* connect.query('select * from news',function(err,result){
                     if(err){
                         console.log(`SQL error:${err}`)
                     }else{
                         console.log(result);
                         connect.release();//释放连接池中的数据库连接
                         pool.end();//关闭连接池
                     }
                 });*/
                // connect.release();//释放连接池中的数据库连接
                // pool.end();//关闭连接池
            }
        });

    },

    module.exports = db;

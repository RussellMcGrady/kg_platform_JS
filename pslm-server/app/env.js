const config = {
    scheme: 'release',
    connect: {
        beta: 'mongodb://127.0.0.1:27017/tokentable',
        release: 'mongodb://127.0.0.1:27017/tokentable'
    },
    //数据库连接配置
    db_config:{
        host:"localhost",
        user:"root",
        password:"123456",
        port:"3306",
        database:"sunflow",
        charset:'UTF8MB4_GENERAL_CI'
    },

    appkey:'dingscfs4greelx2ttpd',
    appsecret:'GxIqcZ74tc0fYedPkTeSuaBnTxUPOXxDBiUGQebbt-nu7WhME_2lH_KvwDJ-OcP_',
    CorpID: 'ding33c7dcb7127ce71935c2f4657eb6378f',
    CorpSecret: 'o-_HCMaE01o-h8f-gwI0lPQB9Hzhea-wCFd1dRF_Ml2MJ7CMyhQbPIz4Tpd8mu6W',
    OAPI_HOST: {
        release: 'https://oapi.dingtalk.com'
    },
    // FILE_HOST:'https://cattery.zhangjinkms.com:520/'
    FILE_HOST:'http://305179sq43.goho.co/'
};

if (process.env.NODE_ENV !== 'product') {
    config.scheme = 'release';
}

module.exports = config;

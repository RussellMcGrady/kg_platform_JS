# kg_platform_JS
//The KG-enabled industrial platform in JS language

//This is the basic version of the platform, including the end to end product configuration design and graph applications.

//unpack three packages, and install the essential dependencies in advance. 
//make sure to check the java version (17), nodejs version (v16.20.0), koa version (^2.6.2)
// check package.json in vue-client
"babel-loader": "^8.4.1", "@babel/core": "^7.26.0", "@babel/preset-env": "^7.26.0", "sass": "^1.83.0", "sass-loader": "^7.3.1", vue (2.7).
pip install *

// if npm install for vue-client, do
copy .\map to node_modules\echarts
copy src\api\resource\knowledge.js to node_modules\neo4jd3\dist\js

//neo4j is the database, run command as below
 ./bin/neo4j.bat console

//pslm-* is the server, run command as below
npm run serve

//vue-* is the client, run command as below
npm run dev

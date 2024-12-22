const logger = require('../logger');
const {formatDateTime} = require('../util/util')
function parseAssess(takeTaskList, assessNum) {

    var arrayList = takeTaskList;
    var n = arrayList.length;  //作业数
    var m = parseInt(assessNum);        //互评数
    var date = new Date();
    if (assessNum >= arrayList.length) {
        logger.log('error', '互评数量不得超过作业总数');
        return;
    }
    //将作业随机排列
     if (!Array.prototype.derangedArray) {
         Array.prototype.derangedArray = function () {
             for (var k, x, i = this.length; i; k = parseInt(Math.random() * i), x = this[--i], this[i] = this[k], this[k] = x) ;
             return this;
         };
     }
     arrayList = arrayList.derangedArray()
   //  console.log('derangedList',arrayList.derangedArray())

    var assessList = [] //任务列表
    var list = new Array(n);
    for (let i = 0; i < n; i++) {
        list[i] = new Array(n);
    }
   /* for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            list[i][j] = 0;
        }
    }*/

    for (let i = 0; i < n - m; i++) {
        for (let j = i + 1; j <= i + m; j++) {
           // list[i][j]=1;
            assessList.push({assess_take_task_id:arrayList[i],assessed_take_task_id:arrayList[j],created_datetime:formatDateTime(date)})
        }

    }

    for (let i = n - m; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (i - j >= n - m) {
             //   list[i][j] = 1;
                assessList.push({assess_take_task_id:arrayList[i],assessed_take_task_id:arrayList[j],created_datetime:formatDateTime(date)})
            }
        }
        for (let j = n - m; j < n; j++) {
            if (i < j) {
              //  list[i][j] = 1;
                assessList.push({assess_take_task_id:arrayList[i],assessed_take_task_id:arrayList[j],created_datetime:formatDateTime(date)})
            }
        }
    }
   // console.log(list)
   // console.log(assessList)
    return (assessList)
}

module.exports = parseAssess;

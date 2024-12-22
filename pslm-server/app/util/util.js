function formatTime(time) {
    if (typeof time !== 'number' || time < 0) {
        return time
    }

    var hour = parseInt(time / 3600)
    time = time % 3600
    var minute = parseInt(time / 60)
    time = time % 60
    var second = time

    return ([hour, minute, second]).map(function (n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }).join(':')
}
var formatDateTime = function (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+ ':'+second;
};

//将日期转换为yyyy-mm-dd的格式
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

//计算两个日期的天数差
function dateDiff(firstDate,secondDate){
    var firstDate = new Date(firstDate);
    var secondDate = new Date(secondDate);
    var diff = Math.abs(firstDate.getTime() - secondDate.getTime())
    var result = parseInt(diff / (1000 * 60 * 60 * 24));
    return result
}



function formatLocation(longitude, latitude) {
    if (typeof longitude === 'string' && typeof latitude === 'string') {
        longitude = parseFloat(longitude)
        latitude = parseFloat(latitude)
    }

    longitude = longitude.toFixed(2)
    latitude = latitude.toFixed(2)

    return {
        longitude: longitude.toString().split('.'),
        latitude: latitude.toString().split('.')
    }
}


//从数据库获取用户信息
function queryUserInfo() {
    var that = this
    wx.request({
        url: getApp().globalData.urlPath + 'QuickFixServer_htc/userAction.action?type=list',
        data: {
            openid: getApp().globalData.openid,
        },
        header: {
            'content-type': 'text/html;charset=utf-8'
        },
        success: function (res) {

            console.log("查询个人信息:",res);
            var result = res.data.ulist;
            //获取到用户信息
            if (result.length > 0) {
                const userInfo=result[0]
                //缓存不变的数据
                wx.setStorageSync('id', userInfo.id)
                wx.setStorageSync('avatarUrl', userInfo.avatarurl)
                wx.setStorageSync('nickName', userInfo.nickname)
                wx.setStorageSync('gender', userInfo.sex)
                wx.setStorageSync('coupleid', userInfo.coupleid)
                //已绑定，查询对方信息
                if (userInfo.coupleid&&userInfo.coupleid != '') {
                    //查询对方信息
                    //that.queryCoupleInfo(userInfo.coupleid)
                    wx.request({
                        url: getApp().globalData.urlPath + 'QuickFixServer_htc/userAction.action?type=list',
                        data: {
                            openid: userInfo.coupleid,
                        },
                        header: {
                            'content-type': 'text/html;charset=utf-8'
                        },
                        success: function (res) {

                            console.log("查询对方信息",res);
                            var result = res.data.ulist;
                            if (result.length > 0) {
                                const userInfo=result[0]
                                //缓存对方信息
                                wx.setStorageSync('couId', userInfo.id)
                                wx.setStorageSync('couAvatarUrl', userInfo.avatarurl)
                                wx.setStorageSync('couNickName', userInfo.nickname)
                                wx.setStorageSync('couGender', userInfo.sex)

                            }

                        }
                    })

                } else {
                    //初始化对方信息为空
                    wx.setStorageSync('couId', '')
                    wx.setStorageSync('couAvatarUrl', '')
                    wx.setStorageSync('couNickName', '')
                    wx.setStorageSync('couGender', '')
                    console.log("还没有邀请")
                }
            }else{
                setTimeout(() => {
                    wx.showToast({
                        title: '网络连接失败',
                        icon: "none",
                    });
                    setTimeout(() => {
                        wx.hideToast();
                    }, 2000)
                }, 0);
            }

        },
        fail: function (res) {
            console.log("加载失败");
            wx.hideNavigationBarLoading();
            setTimeout(() => {
                wx.showToast({
                    title: '网络连接失败',
                    icon: "none",
                });
                setTimeout(() => {
                    wx.hideToast();
                }, 2000)
            }, 0);

        }
    })
}
module.exports = {
    formatTime: formatTime,
    formatDate:formatDate,
    formatDateTime:formatDateTime,
    dateDiff:dateDiff,
    formatLocation: formatLocation,
    queryUserInfo: queryUserInfo
}

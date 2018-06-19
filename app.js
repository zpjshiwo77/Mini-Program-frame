const API = require('/common/js/API.js');

App({
    onLaunch: function (options) {
        wx.login({
            success: function (res) {
                if (res.code) {
                    API.loginWX(res.code);
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },

    setShareData: function (onShareSuccess, onShareFail) {;
        return {
            title: 'OPPO趣味答题',
            path: '/pages/index/index',
            imageUrl: '/images/share.jpg',
            success: function (res) {
                if (onShareSuccess) onShareSuccess();
            },
            fail: function (res) {
                if (onShareFail) onShareFail();
            }
        };
    },

    globalData: {
        userInfo: null,             //用户信息
        systemInfo: null,           //系统信息
        webUrl: null,               //内嵌h5链接
        SessionKey: null            //登录返回的session信息
    }

})
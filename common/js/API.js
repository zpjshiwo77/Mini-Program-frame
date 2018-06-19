//页面的request请求都放这里 方便管理
//主要是为了处理sessionkey
//获取应用实例
const app = getApp();

var API = {

    requestDomain: "",

    _send: function (opts) {
        var that = this;
        var data = opts.data;
        var method = "POST" || opts.method;
        var headerType = "application/x-www-form-urlencoded" || opts.headerType;
        if (opts.login) data.SessionKey = app.globalData.SessionKey;

        wx.request({
            url: that.requestDomain + opts.url,
            data: data,
            method: method,
            header: {
                'content-type': headerType
            },
            dataType: 'json',
            success: (res) => {
                if (opts.onSucces) opts.onSucces(res.data);
            },
            fail: (err) => {
                if (opts.onFail) opts.onFail(err);
            }
        });

    },

    //通用login 所有小程序都会有登陆授权操作 去服务器获取sessionkey
    loginWX: function(code){
        // this._send({
        //     url: "/handler/OAuth.ashx",
        //     data: {
        //         method: "Login",
        //         code:code
        //     },
        //     onSucces: function(res){
        //         app.globalData.SessionKey = res.result;
        //     }
        // });
    }
};

module.exports = API;
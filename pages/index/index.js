//index.js
const app = getApp();
const ImgLoader = require('../../components/img-loader/img-loader.js');

//-------------------------------------------------------初始化-------------------------------------------------------

Page({
    data: {
        loadingPer: 0
    },

    getUserInfo: function (userRes) {
        if (userRes.detail.errMsg == 'getUserInfo:fail auth deny') {
            wx.showModal({
                title: '提示',
                content: '应用需要获取您的昵称和头像信息,请允许访问你的个人信息哦.',
                showCancel: false
            })
        } else {
            app.globalData.userInfo = userRes.detail.userInfo;
        }
    },

    //资源加载
    initLoading: function () {
        wx.showLoading({
            title: '素材加载中...',
        })
        let per = 0;
        let imgLoader = new ImgLoader({
            onLoading: (data, msg) => {
                //data信息里面包含图片的加载地址以及宽高和加载进度
                //msg 加载成功还是失败
                per = Math.round(data.loaded / data.total * 100);
                this.setData({
                    loadingPer: per
                });
            },
            onComplete: () => {
                imgLoader = null;
                wx.hideLoading();
            }
        });
        imgLoader.addImage('/images/share.jpg');
        imgLoader.start();
    },

    onLoad: function (option) {
        this.initLoading();
    },
    onReady: function () { },//监听页面初次渲染完成
    onShow: function () { },//监听页面显示
    onHide: function () { },//监听页面隐藏
    onUnload: function () { },//监听页面卸载
    onPullDownRefresh: function () { },//页面相关事件处理函数--监听用户下拉动作
    onReachBottom: function () { },//页面上拉触底事件的处理函数
    onShareAppMessage: function () { }//用户点击右上角分享
})//end page


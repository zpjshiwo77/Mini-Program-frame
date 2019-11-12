const API = require('/common/js/API.js');
const Bgm = require('/common/js/base/bgm.js');

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

        this.bgmInit();
        this.checkUpdateGame();
    },

    /**
     * 检查微信更新
     */
    checkUpdateGame() {
        if (wx.getUpdateManager) {
            let updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate(function (res) {
                if (res.hasUpdate) {
                    wx.showLoading({
                        title: '升级中',
                        mask: true
                    })
                    updateManager.onUpdateReady(function (res) {
                        wx.hideLoading();
                        wx.showModal({
                            title: '升级提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function (res) {
                                if (res.confirm) {
                                    updateManager.applyUpdate()
                                }
                            }
                        });
                    });
                    updateManager.onUpdateFailed(function () {
                        wx.hideLoading();
                        wx.showModal({
                            title: '升级失败',
                            content: '新版本下载失败，请检查网络！',
                            showCancel: false
                        });
                    })
                }
            })
        }
    },

    /**
     * 背景音乐初始化
     */
    bgmInit() {
        Bgm.on({
            src: "https://upload.cdn.be-xx.com/dior-ladyart/image/assets/music/bgMusic.mp3"
        });
    },

    setShareData: function (onShareSuccess, onShareFail) {
        return {
            title: '测试标题',
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
        userInfo: null,                                     //用户信息
        systemInfo: null,                                   //系统信息
        webUrl: null,                                       //内嵌h5链接
        SessionKey: null,                                   //登录返回的session信息
        Bgm: Bgm,                                           //背景音乐管理器
        bgmPlay: true                                       //背景音乐的播放状态
    }

})
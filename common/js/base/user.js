// class User {
//     constructor() {
//         this.code = null;                       //登陆拿到的code 后面用来转换个人数据用的
//         this.userInfo = null;                   //登陆拿到的用户信息 
//         this.successFuc = null;                 //登陆成功回掉函数
//         this.haslog = true;

//         this.appid = "wx29b36995dd2d651d";
//         this.sessionKey = "";
//     }

//     init(options) {
//         this.successFuc = options.success || function () { };
//         this.wxLogin((loginData) => {
//             if (loginData){
//                 this.wxGetUserInfo(() => {
//                     this.successFuc(this.userInfo);
//                 });
//             }else{
//                 this.successFuc(null);
//             }
//         });
//     }
//     //wx登陆
//     wxLogin(cb) {
//         wx.login({
//             success: (res) => {
//                 this.code = res.code;
//                 this.log(res);
//                 //这里登录回拿到一个code 需要后端来将code解析成openid
//                 cb(true);
//             },
//             fail: (res) => {
//                 this.log(res);
//                 cb(false);
//             }
//         })
//     }
//     //微信code转用户信息 这个需要后端来转一下
//     wxCodeToOpenId(cb){
//         cb();
//     }
//     //开始弹授权
//     wxGetUserInfo(cb) {
//         wx.getUserInfo({
//             success: (res) => {
//                 this.userRes = res;
//                 this.userInfo = res.userInfo;
//                 this.userInfo.rawData = res.rawData;
//                 this.userInfo.code = this.code;
//                 this.userInfo.signature = res.signature;
//                 this.log(res);
//                 cb();
//             },
//             fail: (res) => {
//                 //如果用户选择拒绝授权
//                 this.log(res);
//                 wx.showModal({
//                     title: '用户未授权',
//                     content: '如需正常使用\n需用户允许获取用户信息',
//                     showCancel: false,
//                     success: () => {
//                         wx.openSetting({
//                             success: (res) => {
//                                 console.log('openSetting success', res.authSetting);
//                                 this.wxGetUserInfo(cb);
//                             }
//                         });
//                     }
//                 })
//             }
//         })
//     }
//     log(value) {
//         if (this.haslog) console.log(value);
//     }
// }

// export { User }


const iuser = function () {
    let user = {
        code: null,
        userInfo: null
    };
    let cb = function () { };

    function getUserInfo() {
        wx.getUserInfo({
            success: res => {
                console.log('wx getUserInfo success');
                user.parse(res);
                cb(true);
            },
            fail: res => {
                console.warn('wx getUserInfo fail', res);
                cb(false);
            }
        })
    }

    function goAuth(){

    }

    /**
     * 登录 （如果code过期了 可以调用这个放发重新获取）
     * @params {Function} callback 回调函数
     */
    user.login = function (callback) {
        wx.login({
            success: (res) => {
                console.log('wx login success');
                user.code = res.code;
                callback();
            },
            fail: (res) => {
                console.warn('wx login fail', res);
            }
        })
    }

    /**
     * 初始化
     * @params {Function} callback 回调函数
     */
    user.getUserInfo = function (callback) {
        cb = callback;
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                    getUserInfo();
                } else {
                    cb(false);
                }
            }
        })
    }

    /**
     * 解析用户数据
     */
    user.parse = function (data) {
        user.encryptedData = data.encryptedData;
        user.iv = data.iv;
        user.rawData = data.rawData;
        user.signature = data.signature;
        user.userInfo = data.userInfo;
    }


    return user;
};

module.exports = iuser();




                    // //false的情况 会让用户点击授权按钮 这里包含两种情况 一种是允许 一种是拒绝
                    // curPage._getUserInfo = (userRes) => {
                    //     console.log('userRes.detail.errMsg:' + userRes.detail.errMsg);
                    //     if (userRes.detail.errMsg == 'getUserInfo:fail auth deny') {
                    //         wx.showModal({
                    //             title: '提示',
                    //             content: '应用需要获取您的昵称和头像信息,请允许访问你的个人信息哦.',
                    //             showCancel: false
                    //         })
                    //     } else {
                    //         iuser.parse(userRes.detail);
                    //         this.globalData.userInfo = iuser.userInfo;
                    //         this.setPageData({ userInfo: iuser.userInfo });
                    //         curPage.setData({
                    //             hasUserInfo: true
                    //         });
                    //         cb();
                    //     }
                    // }
                    // curPage.setData({
                    //     hasUserInfo: false
                    // });
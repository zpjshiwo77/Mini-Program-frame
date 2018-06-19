//scope.userInfo	        wx.getUserInfo	                                            用户信息
//scope.userLocation	    wx.getLocation, wx.chooseLocation	                        地理位置
//scope.address	            wx.chooseAddress	                                        通讯地址
//scope.invoiceTitle	    wx.chooseInvoiceTitle	                                    发票抬头
//scope.werun	            wx.getWeRunData	                                            微信运动步数
//scope.record	            wx.startRecord	                                            录音功能
//scope.writePhotosAlbum	wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum	    保存到相册
//scope.camera		                                                                    摄像头


/**
 * 地理位置 成功直接返回经纬度信息
 * 录音 只会告诉是否已授权录音
 */
function WXAuth(){
    const WX_LOCATION = "scope.userLocation";                   //地理位置
    const WX_RECORD = "scope.record";                           //录音
    const WX_MSG = {};
    const MSG_OK = "用户同意";
    const MSG_ERR = "用户拒绝";
    WX_MSG[WX_LOCATION] = '地理位置';
    WX_MSG[WX_RECORD] = '录音';


    var s = this;

    var auth = function (authName, cb){
        //cb 返回true 说明用户同意了 false 拒绝了
        wx.getSetting({
            success: (res) => {
                console.log(res);
                if (!res.authSetting[authName]) {
                    wx.openSetting({
                        success: (res) => {
                            if (!res.authSetting[authName]) {
                                cb(false);
                            } else {
                                cb(true);
                            }
                        }
                    })
                } else {
                    cb(true);
                }
            }
        })
    }
    var authorize = function(authName, cb) {
        //询问用户授权请求
        wx.authorize({
            scope: authName,
            success: (res) => {
                cb({
                    errcode: 0,
                    errmsg: MSG_OK + WX_MSG[authName]
                });
            },
            fail: (res) => {
                //如果用户拒绝了 会提示用户是否重新授权 
                showModel(WX_MSG[authName], (value) => {
                    if (value) {
                        auth(authName, (value) => {
                            if (value) {
                                cb({
                                    errcode: 0,
                                    errmsg: MSG_OK + WX_MSG[authName]
                                });
                            } else {
                                cb({
                                    errcode: -1,
                                    errmsg: MSG_ERR + WX_MSG[authName]
                                });
                            }
                        });
                    } else {
                        cb({
                            errcode: -1,
                            errmsg: MSG_ERR + WX_MSG[authName]
                        });
                    }
                });
            }
        })
    }

    //内部方法 提示
    var showModel = function (name, cb) {
        wx.showModal({
            title: '提示',
            content: '是否开启' + name + '权限？',
            success: (res) => {
                if (res.confirm) {
                    cb(true);
                } else if (res.cancel) {
                    cb(false);
                }
            }
        })
    }

    /**
     * 录音权限
     */
    s.recordAuth = function (cb) {
        authorize(WX_RECORD, cb);
    },
    
    /**
     * 地理位置权限
     * cb 回调
     * type 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
     * refresh 是否重新获取地理位置 默认false 如果当前有 就从缓存里面拿
     * 参考文档： https://mp.weixin.qq.com/debug/wxadoc/dev/api/location.html#wxgetlocationobject
     */
    s.locationAuth = function (cb, type, refresh) {
        type = type || "wgs84";
        refresh = refresh || false;
        if (refresh) {

        } else {
            let localName = WX_LOCATION + "_" + type;
            let location = wx.getStorageSync(localName);
            if (location) {
                cb(location);
            } else {
                authorize(WX_LOCATION, (res) => {
                    console.log(res);
                    if (res.errcode == 0) {
                        wx.getLocation({
                            type: 'gcj02',
                            success: (res) => {
                                //存到缓存里面
                                let obj = {
                                    errcode: 0,
                                    errmsg: "ok",
                                    result: res
                                }
                                wx.setStorageSync(localName, obj);
                                cb(obj);
                            },
                            fail: (res) => {
                                cb({
                                    errcode: -1,
                                    errmsg: "getLocation fail",
                                    result: null
                                });
                            }
                        })
                    } else {
                        res.result = null;
                        cb(res);
                    }
                });
            }
        }
    }

    return s;

}
module.exports = new WXAuth();





// const WXAuth = {
//     //内部方法 外部别调用
//     auth: function (authName, cb) {
//         //cb 返回true 说明用户同意了 false 拒绝了
//         wx.getSetting({
//             success: (res) => {
//                 console.log(res);
//                 if (!res.authSetting[authName]) {
//                     wx.openSetting({
//                         success: (res) => {
//                             if (!res.authSetting[authName]) {
//                                 cb(false);
//                             } else {
//                                 cb(true);
//                             }
//                         }
//                     })
//                 } else {
//                     cb(true);
//                 }
//             }
//         })
//     },
//     //内部方法
//     authorize: function (authName, cb) {
//         //询问用户授权请求
//         wx.authorize({
//             scope: authName,
//             success: (res) => {
//                 cb({
//                     errcode: 0,
//                     errmsg: MSG_OK + WX_MSG[authName]
//                 });
//             },
//             fail: (res) => {
//                 //如果用户拒绝了 会提示用户是否重新授权 
//                 this.showModel(WX_MSG[authName], (value) => {
//                     if (value) {
//                         this.auth(authName, (value) => {
//                             if (value) {
//                                 cb({
//                                     errcode: 0,
//                                     errmsg: MSG_OK + WX_MSG[authName]
//                                 });
//                             } else {
//                                 cb({
//                                     errcode: -1,
//                                     errmsg: MSG_ERR + WX_MSG[authName]
//                                 });
//                             }
//                         });
//                     } else {
//                         cb({
//                             errcode: -1,
//                             errmsg: MSG_ERR + WX_MSG[authName]
//                         });
//                     }
//                 });
//             }
//         })
//     },
//     //内部方法 提示
//     showModel: function (name, cb) {
//         wx.showModal({
//             title: '提示',
//             content: '是否开启' + name + '权限？',
//             success: (res) => {
//                 if (res.confirm) {
//                     cb(true);
//                 } else if (res.cancel) {
//                     cb(false);
//                 }
//             }
//         })
//     },
//     /**
//      * 录音权限
//      */
//     recordAuth: function (cb) {
//         this.authorize(WX_RECORD, cb);
//     },
    
//     /**
//      * 地理位置权限
//      * cb 回调
//      * type 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
//      * refresh 是否重新获取地理位置 默认false 如果当前有 就从缓存里面拿
//      * 参考文档： https://mp.weixin.qq.com/debug/wxadoc/dev/api/location.html#wxgetlocationobject
//      */
//     locationAuth: function (cb, type, refresh) {
//         type = type || "wgs84";
//         refresh = refresh || false;
//         if (refresh){
            
//         }else{
//             let localName = WX_LOCATION + "_" + type;
//             let location = wx.getStorageSync(localName);
//             if (location){
//                 cb(location);
//             }else{
//                 this.authorize(WX_LOCATION, (res) => {
//                     console.log(res);
//                     if (res.errcode == 0) {
//                         wx.getLocation({
//                             type: 'gcj02',
//                             success: (res) => {
//                                 //存到缓存里面
//                                 let obj = {
//                                     errcode: 0,
//                                     errmsg: "ok",
//                                     result: res
//                                 }
//                                 wx.setStorageSync(localName, obj);
//                                 cb(obj);
//                             },
//                             fail: (res) => {
//                                 cb({
//                                     errcode: -1,
//                                     errmsg: "getLocation fail",
//                                     result: null
//                                 });
//                             }
//                         })
//                     } else {
//                         res.result = null;
//                         cb(res);
//                     }
//                 });
//             }
//         }
//     }
// }

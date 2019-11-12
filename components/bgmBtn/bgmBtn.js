const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        play: {
            type: Boolean,
            value: true
        }
    },

    observers: {
        'play': function (play) {
            if(this.data.attachedFlag){
                if(play) this.bgmplay();
                else this.bgmpause();
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        bgmPlay:true,
        hidePlay:false,
        attachedFlag:false
    },

    ready(){
    },
    lifetimes:{
        attached(){
            this.setData({
                attachedFlag: true
            })
            if(app.globalData.bgmPlay) this.bgmplay();
            else this.bgmpause();
        }
    },
    pageLifetimes: {
        show(){
            if(this.data.hidePlay){
                app.globalData.Bgm.play();
            }
        },
        hide(){
            if(this.data.bgmPlay){
                app.globalData.Bgm.pause();
                this.setData({hidePlay:true});
            }
            else{
                this.setData({hidePlay:false});
            }
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        bgmplay(){
            this.setData({
                bgmPlay:true
            });
            app.globalData.Bgm.play();
            app.globalData.bgmPlay = true;
            // console.log(app.globalData.bgmPlay)
        },
        bgmpause(){
            this.setData({
                bgmPlay:false
            });
            app.globalData.Bgm.pause();
            app.globalData.bgmPlay = false;
            // console.log(app.globalData.bgmPlay)
        }
    }
})

const ibgm = function() {
	let bgm={};
	let opts={};
	let innerAudioContext;
	
	bgm.on=function(src,options){
		console.log('bgm src:'+src);
		if(src){
			let defaults = {loop:true,autoplay:true,onPlay:function(){},onPause:function(){},onStop:function(){},onEnded:function(){},onTimeUpdate:function(){} };
			Object.assign(opts, defaults, options);
	      	console.log(opts);
	      	innerAudioContext = wx.createInnerAudioContext();
	      	innerAudioContext.src = src;
	      	innerAudioContext.autoplay = opts.autoplay;
			innerAudioContext.loop=opts.loop;
			
			innerAudioContext.onPlay(() => {
			    console.log('开始播放');
			    let pages = getCurrentPages();
		    	let page = pages[pages.length - 1];
			    page.setData({
			    	bgmPlay:true
			    });
			    wx.setStorageSync('bgmState', 1);
			    opts.onPlay();
			});
			
			innerAudioContext.onPause(() => {
			    console.log('暂停播放');
			    let pages = getCurrentPages();
		    	let page = pages[pages.length - 1];
			    page.setData({
			    	bgmPlay:false
			    });
			    wx.setStorageSync('bgmState', 0);
			    opts.onPause();
			});
			
			innerAudioContext.onStop(() => {
			    console.log('停止播放');
			    let pages = getCurrentPages();
		    	let page = pages[pages.length - 1];
			    page.setData({
			    	bgmPlay:false
			    });
			    wx.setStorageSync('bgmState', 0);
			    opts.onStop();
			});
			
			innerAudioContext.onError((res) => {
			    console.log(res.errMsg);
				console.log(res.errCode);
			});
			
			innerAudioContext.onEnded(() => {
			    console.log('播放结束');
				opts.onEnded();
			});
			
			innerAudioContext.onTimeUpdate((res) => {
//			    console.log(innerAudioContext.currentTime+'/'+innerAudioContext.duration);
				opts.onTimeUpdate(innerAudioContext.currentTime,innerAudioContext.duration);
			});
		}//edn if
	}//edn func
	
	bgm.play=function(){
		console.log('bgm play');
		innerAudioContext.play();
	}//edn func
	
	bgm.pause=function(){
		console.log('bgm pause');
		innerAudioContext.pause();
	}//edn func
	
	bgm.stop=function(){
		console.log('bgm stop');
		innerAudioContext.stop();
	}//edn func
	
	bgm.audio=function(){
		return innerAudioContext();
	}//edn func
	
	bgm.off=function(){
		innerAudioContext.destroy();
	}//edn func
	
	return bgm;
	
};

module.exports = ibgm();
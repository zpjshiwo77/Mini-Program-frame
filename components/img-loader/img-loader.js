/**
 * 图片预加载组件
 * @param  {Object}     options         {onLoading,onComplete}
 */
function ImgLoader(options){
	let s = this;
	let pages = getCurrentPages();
    let page = pages[pages.length - 1];
    page._imgOnLoad = _imgOnLoad;
    page._imgOnLoadError = _imgOnLoadError;
    page.data.imgLoadList = [];
    let onLoading = options.onLoading || function () { };
    let onComplete = options.onComplete || function () { };
    let imgInfo = {};
    let imgList = [];
    let imgIndex = 0;
    let imgTotal = 0;


    //绑定图片加载完成事件
    function _imgOnLoad(ev) {
        imgIndex++;
        let src = ev.currentTarget.dataset.src,
            width = ev.detail.width,
            height = ev.detail.height,
            loaded = imgIndex,
            total = imgTotal;

        //记录已下载图片的尺寸信息
        imgInfo[src] = { width, height };
        _removeFromLoadList(src);

        _runCallback('Loading ok', { src, width, height, loaded, total })
    }

    //绑定图片加载失败事件
    function _imgOnLoadError(ev) {
        imgIndex++;
        let src = ev.currentTarget.dataset.src,
            loaded = imgIndex,
            total = imgTotal;
        _removeFromLoadList(src)
        _runCallback('Loading failed', { src, loaded, total })
    }

    //将图片从下载队列中移除
    function _removeFromLoadList(src) {
        let list = page.data.imgLoadList
        list.splice(list.indexOf(src), 1)
        page.setData({ 'imgLoadList': list })
    }
    //执行回调
    function _runCallback (err, data) {
        onLoading(data, err);
        if (imgIndex == imgTotal) {
            onComplete();
        }
    }

    /***
     * 添加要加载的图片url
     * @param  {String}   src      图片地址
     */
    s.addImage = function(src){
        if (!src) return;
        imgList.push(src);
    }
    /***
     * 开始加载
     */
    s.start = function(){
        imgTotal = imgList.length;
        //将图片数据赋值到当前
        page.setData({
            imgLoadList: imgList
        });
    }
	
    return s;
}

module.exports = ImgLoader
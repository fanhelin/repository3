/**
 * 工具包
 *date, 时间对象
 daySpliter 日期分隔符,
 needTime 是否需要时间,
 timeSpliter 时间分隔符
 */
const formatTime = (date, daySpliter,needTime,timeSpliter) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  var ret = [year, month, day].map(formatNumber).join(daySpliter) ;
  if (needTime)  {
    ret +=' ' + [hour, minute, second].map(formatNumber).join(timeSpliter) ;
  }
  return ret ;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * @dateStr 时间日期字符串
 * @formater 格式字符串{yy-mm-dd hh:MM:ss}
 */
const formatDateTimeStr = (dateStr,formater) =>{
  if(dateStr.length < 14){
       return dateStr ;
  }
  
  var arr = dateStr.split("") ;
  var yy = arr[0] + arr[1] + arr[2] + arr[3];
  formater = formater.replace('yy',yy);
  var mm = arr[4] + arr[5] ;
  formater = formater.replace('mm', mm);
  var dd = arr[6] + arr[7]  ;
  formater = formater.replace('dd', dd);
  var hh = arr[8] + arr[9] ;
  formater = formater.replace('hh', hh);
  var MM = arr[10] + arr[11];
  formater = formater.replace('MM', MM);
  var ss = arr[12] + arr[13];
  formater = formater.replace('ss', ss); 
  return formater ;
};

/**
 * 获取数组下标
 * @arr,搜索数组
 * @k_v [{k:'k1',v:'v1'},{k:'k2',v:'v2'}....]:
 * @f : 'index'|'item' 分别代表返回类型是【 索引】还是【元素】
 */
const getArrayItem = function(arr,k_v,f){
  f = f || 'index' ;
  if (arr == null || k_v == null || !(arr instanceof Array) ||!(k_v instanceof Array)) {
        return f == 'index' ? -1 : null ;
      }
      function fit(obj,kv){
          for(var n=0 ; n< k_v.length ; n++) {
            if (obj[kv[n].k] && obj[kv[n].k] == kv[n].v ){return true ;}
          }
          return false ;
      }
      for(var i=0 ;i<arr.length ;i++){
        if(fit(arr[i], k_v)){
           return f == 'index'? i:arr[i] ;
        }
      }
      return f == 'index' ? -1 : null;
};
/**
 * 从目标数组中搜索符合条件的元素，
 * 已子数组形式返回
 * @arr,搜索数组
 * @k_v [{k:'k1',v:'v1'},{k:'k2',v:'v2'}....]:
 * */
const searchFromArray=function(soureArr,k_v){
    var newArr =[] ;

    if (soureArr == null || k_v == null || !(soureArr instanceof Array) || !(k_v instanceof Array)) {
        return newArr;
    }
    function fit(obj, kv) {
      for (var n = 0; n < k_v.length; n++) {
        if (obj[kv[n].k] && obj[kv[n].k].indexOf(kv[n].v) != -1) { return true; }
      }
      return false;
    }
    for (var i = 0; i < soureArr.length; i++) {
      if (fit(soureArr[i], k_v)) {
        newArr.push(soureArr[i]) ;
      }
    }
    return newArr;

}

const accMul= function(a, b){
  var c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) { }
  try {
    c += e.split(".")[1].length;
  } catch (f) { }
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
} 


const accAdd = function(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (a * e + b * e) / e;
} 


const showToast = function(msg, minTimes) {

  wx.showModal({
    title: '提示',
    content: msg,
    success: function (res) {
      if (res.confirm) {

      } else if (res.cancel) {

      }
    }
  })
}

/**http 工具 
 * 对小程序wx.request的包装。
*/
class HttpUtil {

  //ES6中新型构造器
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * post请求封装
   * @url :请求url
   * @data：请求参数
   * @scb 成功回调
   * @fcb 失败回调
   */
  post(url, data, scb, fcb) {
    wx.showNavigationBarLoading();
    wx.request({
      method: 'post',
      url: this.baseUrl + url, // 仅为示例，并非真实的接口地址
      data: data,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: s => {
        typeof scb == "function" && scb(s.data);
        wx.hideNavigationBarLoading();
      },
      fail: f => {
        typeof fcb == "function" && fcb(f);
        wx.hideNavigationBarLoading();
      }
    });
  }
/**
   * get请求封装
   * @url :请求url
   * @data：请求参数
   * @scb 成功回调
   * @fcb 失败回调
   */
  get(url, data, scb, fcb) {
    wx.showNavigationBarLoading();
    wx.request({
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      url: this.baseUrl + url,
      data: data,
      success: r => {
        typeof scb == "function" && scb(r.data);
        wx.hideNavigationBarLoading();
      },
      fail: e => {
        typeof fcb == "function" && fcb(e);
        wx.hideNavigationBarLoading();
      }
    });
  }
};

//module.exports.HttpUtil = HttpUtil;

module.exports = {
  formatTime: formatTime ,
  formatDateTimeStr: formatDateTimeStr,
  HttpUtil: HttpUtil ,
  getArrayItem: getArrayItem,
  searchFromArray: searchFromArray,
  accMul: accMul,
  accAdd: accAdd,
  showToast: showToast,
  /**
   * 页面间传值小工具 
   * @key 保存在storage 中的key
   * @needClear 取值完毕后是否清除保存
  */
  getStore:function(key,needClear){
         var val = wx.getStorageSync(key) ;
         if (needClear){
             wx.setStorageSync(key, null);
         }
         return val ;
    }
}
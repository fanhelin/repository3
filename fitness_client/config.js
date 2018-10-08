
var util = require("utils/util.js");
/**/
//location static final
const lsf = { 
   KEY_APP_INFO:'KEY_APP_INFO',
   USER_SESSION:'USER_SESSION',
   SHOPING_CART:'SHOPING_CART',
   CURRENT_GOODS:'CURRENT_GOODS',
   KEY_NEED_RELOAD:'KEY_NEED_RELOAD' ,
   UPLOAD_IMG_INFO:'UPLOAD_IMG_INFO', // {sfz:'',zmz:'',tjb:'',xcxy:''}
   PRIVILEG_CODE: "PRIVILEG_CODE",
   SH_STATE:'SH_STATE'

};

//server config
const ser = {
  baseUrl1: 'http://127.0.0.1:8080/fitness_manage/',
  baseUrl2: 'https://www.weixinsmall.cc/fitness_manage/' ,
  baseUrl: 'https://www.fitsis.cn/fitness_manage/',

  imageUrl1: "http://127.0.0.1:8080/uploadfile",
  imageUrl2: "http://www.weixinsmall.cc/uploadfile/",
  imageUrl: "http://www.fitsis.cn:3389/uploadfile/",
  app_info_code:'fitness_01'
};

//action url config
const act = {
  getAppInfo: 'app/getAppInfo.do',
  getOpenid:'app/getOpenid.do',
  getUserInfo:'app/getUserInfo.do',
  getAllCourse:'app/getAllCourse.do',
  getCourseChapters:'app/getCourseChapters.do',
  addClient:'app/addClient.do',
  updateClient: 'app/updateClient.do',
  getRcvInfos: 'rcv/getRcvInfos.do',
  setDRcvInfo: 'rcv/setDRcvInfo.do',
  addRcvInfo: 'rcv/addRcvInfo.do',
  delRcvInfo: 'rcv/delRcvInfo.do',
  modifyRcvInfo: 'rcv/modifyRcvInfo.do',
  findPracticeList: "practice/findPracticeList.do",
  unifiedOrder:'payment/unifiedOrder.do',
  reSign:"payment/reSign.do",
  findChapterByCourse:"app/findChapterByCourse.do",
  getCommoditys:"commodity/getCommoditys.do",
  addPractice:"app/addPractice.do",
  exchangeScore:"score/exchangeScore.do",
  courseRestart:"app/courseRestart.do",
  updateSignInfo:"client/updateSign.do",
  loadHisExs: 'score/loadHisExs.do',
  alreayBuy:'app/alreayBuy.do'
};
const http = new util.HttpUtil(ser.baseUrl);

module.exports = {
  util : util ,
  lsf: lsf,
  ser: ser,
  act: act,
  http: http 
} ;
const app = getApp()
Page({
  data: {
    imge_url: app.ser.imageUrl+"commodity/",
    score:0,
    showtab: 'comdList',  //顶部选项卡索引
    showtabtype: 'comdList', //选中类型
    tabnav: {},  //顶部选项卡数据
    last: false,
    hasMore: true,
    showLoading: false,
    page: 1,
    list:[],
    scrollWidth:'',
    scrollHeight:'',
    status:'',
    comList:[],
    hisExcList:[]
  },
  onLoad: function (options) {
    var that = this;
  var status = options.status ;
 
  that.setData({
      showtab: status,
      tabnav: {
        tabnum: 2,
        tabitem: [
          {
            "id": 1,
            "type": "comdList",
            "text": "商品列表"
          },
          {
            "id": 2,
            "type": "hisExs",
            "text": "历史兑换"
          },
         
        ]
      },
    });
  

  },
  onShow:function(){
    var me = this ;
    app.getClientInfo(sd=>{
      if (sd && sd.client){
            me.setData({ score: sd.client.score}) ; 
          }
    } ,fd=>{

    }) ;
     
      me.getSystemInfo();
      me.loadComdityList();
      me.loadHisExs(sd => { }, fd => { });
    

  },

  getSystemInfo: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
          scrollWidth: res.windowWidth,
        })
      }
    })
  },

  setTab: function (e) { //设置选项卡选中索引
    var that  = this;
    const edata = e.currentTarget.dataset;
    that.setData({
      showtab: edata.tabindex,
      showtabtype: edata.type,
      list:[],
      last:false,
      hasMore:true,
      showLoading:false,
      page:1
    })
  },

  goGoodsDetail: function (e) {
    var code = e.currentTarget.dataset.code;
    var index = e.currentTarget.dataset.index;
    wx.setStorageSync(app.lsf.CURRENT_GOODS, this.data.comList[index]);
    wx.navigateTo({
      url: '/pages/goods/goodsDetail',
    })
  },

  goExchange:function(e){
    var code = e.currentTarget.dataset.code;
    var index = e.currentTarget.dataset.index;
    wx.setStorageSync(app.lsf.CURRENT_GOODS, this.data.comList[index]) ;
    wx.navigateTo({
      url: '/pages/goods/goodsDetail' ,
    })
  },

  loadComdityList:function(sb,fb){
    var me = this ;
    var doPost = function(appInfo){
      app.http.post(app.act.getCommoditys, appInfo, sd => {
          console.log("sd=", sd);
          if (sd.success && sd.data) {
            me.setData({ comList: JSON.parse(sd.data )});
             sb && typeof sb =="function" && sb(sd.data) ;
          }else{
            fb && typeof fb == "function" && fb(sd);
          }

        }, fd => {
            me.setData({ comList: [] });
            fb && typeof fb == "function" && fb(fd);
        });
      }
    app.getAppInfo(sd=>{
         console.log("getAppInfo sd=",sd) ;
         doPost(sd.appInfo) ;
    } ,fd=>{
         console.log("getAppInfo fd=",fd) ;
    }) ;

  },
  loadHisExs:function(sb,fb){
    var me = this;
    var doPost = function (openid) {
      app.http.post(app.act.loadHisExs, {openid:openid}, sd => {
        console.log("sd=", sd);
        if (sd.success && sd.data) {
          me.setData({ hisExcList: sd.data });
          sb && typeof sb == "function" && sb(sd.data);
        } else {
          fb && typeof fb == "function" && fb(sd);
        }

      }, fd => {
        me.setData({ hisExcList: [] });
        fb && typeof fb == "function" && fb(fd);
      });
    }
    app.login(sd => {
      console.log("login sd=", sd);
      doPost(sd.openid);
    }, fd => {
      console.log("login fd=", fd);
    });
  }

})

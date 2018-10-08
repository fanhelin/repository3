//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    userInfo: {},
    registered:true,
    client: null,
    showAuthorization:false
  },
  onShow:function (){
    var me = this ;
    app.getClientInfo(sd => {
      console.log('me.js getUserInfo success sd:', sd);
      me.setData({
        client: sd.client || null,
        registered: (!sd.client) ? false : true
      });
    }, fd => {
      console.log("getUserInfo fail fd:", fd);
    });
   
  },
  onLoad: function () {
    var me = this

    wx.getUserInfo({
      success: function (res) {
        me.setData({
          userInfo: res.userInfo
        });
      },
      fail:function(){
         me.setData({
           showAuthorization :true
         });
      }
    });
      
  

  },
  userdata:function (){
      wx.navigateTo({url: "/pages/userdata/index"})
  },
  address: function (){
    wx.navigateTo({ url:"/pages/address/address"});
  },
  
  order:function (){
    //订单
    wx.navigateTo({ url: "/pages/order/order"})
  },
  keep:function () {
    //收藏
  },
  share:function (){
    //分享
  },
  goToRegist:function(e){
    var regState = e.currentTarget.dataset.regState;
    console.log("gotoRegist e=",e) ;
    wx.navigateTo({ url: "/pages/regist/regist?regState=" + regState }) ;
  },
  toMyVido: function () {
    wx.navigateTo({
      url: '/pages/courseDetail/clientCourse'
    });
  },
  toSoreExchange:function(){
    wx.navigateTo({
      url: '/pages/exchange/comOrderList'
    });
  },
  onGotUserInfo:function(e){
    console.log("e:",e) ;

    this.setData({
       userInfo: e.detail.userInfo,
       showAuthorization : !e.detail.userInfo
    });
  }
})

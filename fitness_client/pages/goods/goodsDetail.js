// pages/exchange/goodsDetail.js
var app = getApp() ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: app.ser.imageUrl + "commodity/",
    indicatorDots: true,//是否显示面板指示点
    autoplay: true,  //是否自动切换
    interval: 5000, //自动切换时间
    duration: 1000,  //滑动时间
    goods: {} ,
    score:0,
    needRcv:true,
    defaultRcvInfo:null,
    hideWin: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this ;
    var goods = app.util.getStore(app.lsf.CURRENT_GOODS) ;
    console.log("googs:",goods) ;
    this.setData({goods: goods}) ;

    app.getClientInfo(sd=>{
      sd.client && sd.client.score && me.setData({ score: sd.client.score})
    },fd=>{
        console.log("getClientInfo fail fd=",fd) ;
    }) ;

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.needRcv) {
      this.getDefaultdeRcvInfo();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  getDefaultdeRcvInfo: function () {
    var me = this;

    function getDefault(rcvInfos) {
      if (!rcvInfos || rcvInfos.length == 0) {
        return null;
      }

      for (var i = 0; i < rcvInfos.length; i++) {
        if (rcvInfos[i] && rcvInfos[i].isDefault == 1) {
          return rcvInfos[i];
        }
      }
      return rcvInfos[0];
    }

    app.getRcvInfos(_ => {
      me.setData({ defaultRcvInfo: getDefault(_) });
    });

  },

  onWinCancel: function (e) {
    this.setData({hideWin: true });
  },

  onWinWinOk: function (e) {
    var me = this;
    if (!me.data.defaultRcvInfo){
        wx.showToast({
          title: '请添加配送信息',
        })
        return ;
    }
    var doPost = function (openid) {
      //调用登录接口
      var goods = me.data.goods ;
      var score = { };
      score.app_info_code= app.ser.app_info_code ;
      score.openid=openid;
      score.rcv_name = me.data.defaultRcvInfo.name;
      score.mobile = me.data.defaultRcvInfo.mobile;
      score.address = me.data.defaultRcvInfo.address;
      score.com_code = goods.code ;
      score.score = goods.score ;
      score.leftScore = me.data.score - goods.score ;

      app.http.post(app.act.exchangeScore, score, sd => {
        console.log("exchange sd=",sd) ;
        if (sd.success) {
            app.getClientInfo(sd => {
              sd.client.score = sd.client.score - score.score ;
              sd.client && sd.client.score && me.setData({ score: sd.client.score }) ;
            }, fd => {
              console.log("getClientInfo fail fd=", fd);
            });

            goods.sum = goods.sum - 1 ;
            me.setData({ 
              goods: goods ,
              hideWin: true
              }) ;
          
        } else {
            
        }
      }, fd => {
        console.log("exchange sd=", fd);
      });
    }
    app.login(sd=>{
         doPost(sd.openid) ;
    }) ;
  
  },
  goExchange: function (e) {
    this.setData({
      hideWin: false
    });
  
  },
   toAddress: function (e) {
    console.log("toAddress:", e);
    wx.navigateTo({ url: '/pages/address/address' });
  },
})
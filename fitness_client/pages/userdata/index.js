//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var me = this
    app.getUserInfo(function (userInfo){
         me.setData({
             userInfo:userInfo
          });
    }) ;

   
 
  
  },
  onShow:function (){

    this.getDefaultdeRcvInfo();
      console.log("页面被重新加载");
  },
  address:function (){
     wx.navigateTo({ url: '/pages/address/index'});
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

  }
})

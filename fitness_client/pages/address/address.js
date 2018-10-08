
//address.js
//获取应用实例
var app = getApp()

Page({
  data: {
    allAddress: [],//地址列表
  },
  onLoad: function () {
   
  },
  onShow:function(){

    app.getRcvInfos(_=>{
        this.setData({
           allAddress: _
        })
    });
      
  },
  radioChange:function(e){
      console.log(e);
      var code = e.detail.value;
      this.setDefaultRcvInfo(code,sd=>{
          wx.navigateBack();
      },fd=>{
        app.util.showToast("设置失败");
      });
     
  },
  addrss:function (e){
        wx.navigateTo({url:"/pages/address/addto/addto?id="})
  },
  addto:function (e){
        var id = e.currentTarget.dataset.id;
        console.log(id);
        wx.navigateTo({ url:"/pages/address/addto/addto?id="+id})
  },
  setDefaultRcvInfo: function (code ,cb,fb) {
    var me = this;

    var doPost = function (openid) {
      //调用登录接口
      var data = { app_info_code: app.ser.app_info_code, openid: openid, rcv_code: code };
      app.http.post(app.act.setDRcvInfo, data, sd => {
        if (sd.success) {
             app.setDefaultRcvInfo(code);
           typeof cb == "function" && cb(sd);
        } else {
          typeof fb == "function" && fb(sd);
        }
      }, fd => {
        typeof fb == "function" && fb(fd);
      });
    }
    app.login(sd => {
      doPost(sd.openid);
    });
  }
})

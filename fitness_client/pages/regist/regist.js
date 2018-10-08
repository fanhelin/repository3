// pages/regist/regist.js
var app = getApp() ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
       //regState : 1 ,
       client:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //var regState = options.regState;
    //this.setData({regState:regState}) ;
    var me = this ;
    app.getClientInfo(sd=>{
       console.log("getClientInfo sd:",sd) ;
        me.setData({client:sd.client}) ;
    } ,fd=>{
        console.log(" getClentInfo fd:",fd) ;
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
  onTapMobile:function(){

  },
  formSubmit:function(e){
    var me = this;
    var val = e.detail.value;
    if (me.data.client) {
      me.modifyClient(val,()=>{
        wx.showToast({
          title: '修改成功',
        }); 

        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        }, 1000);

      },()=>{
        wx.showToast({
          title: '修改失败',
        }); 
      });

    } else {
      me.addClient(val,()=>{
        wx.showToast({
          title: '注册成功',
        });

        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        }, 1000);
      },()=>{
        wx.showToast({
          title: '注册失败',
        });
      });
    }
  },
  addClient:function(val,sb,fb){
      
      var doPost = function(openid){
        var data = { app_info_code: app.ser.app_info_code ,openid:openid,name:val.name,mobile:val.mobile,address:val.address };
        app.http.post(app.act.addClient, data, sd => {
          if (sd.success && sd.data) {
            app.globalData.clientInfo.client = sd.data ;
            typeof sb == "function" && sb(app.globalData.clientInfo.client);
          } else {
             typeof fb == "function" && fb(sd);
          }
        }, fd => {
             typeof fb == "function" && fb(fd);
        });
      }

      app.login(sd=>{
          doPost(sd.openid) ;
      } ,fd=>{
          console.log("login fd:",fd) ;
      }) ;
  },
  modifyClient: function (val, sb, fb) {

    var doPost = function (openid) {
      var data = { app_info_code: app.ser.app_info_code, openid: openid, name: val.name, mobile: val.mobile, address: val.address };
      app.http.post(app.act.updateClient, data, sd => {
        if (sd.success && sd.data) {
           app.globalData.clientInfo.client.name = val.name;
           app.globalData.clientInfo.client.mobile = val.mobile;
           app.globalData.clientInfo.client.address = val.address;
          typeof sb == "function" && sb(app.globalData.clientInfo.client);
        } else {
          typeof fb == "function" && fb(sd);
        }
      }, fd => {
        typeof fb == "function" && fb(fd);
      });
    }

    app.login(sd => {
      doPost(sd.openid);
    }, fd => {
      console.log("login fd:", fd);
    });
  }
})
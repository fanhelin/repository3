//app.js
const con = require('config.js');
App({
  ser:con.ser,
  lsf:con.lsf,
  act:con.act,
  util:con.util,
  http:con.http,
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    this.login(sd=>
    {
      console.log("login sd=", sd);
    },fd=>{
      console.log("login fd=", fd);
    }) ;

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null, //微信用户信息
    clientInfo:null, //客户信息
    rcvInfos:null, //收货地址
    allCourses:[], // 课程
    pageHistoryData:{//保存页面后退后的数据
      
    }
  }, 
 
  getClientInfo: function (cb,fb,reload) {
    var me = this;
    if (me.globalData.clientInfo && !reload) {
      typeof cb == "function" && cb(me.globalData.clientInfo)
    } else {

      var _doGetUser = function (openid) {
        //调用登录接口
        var data = { app_info_code: me.ser.app_info_code ,openid:openid};
        me.http.post(me.act.getUserInfo, data, sd => {
             if(sd.success && sd.data){
               me.globalData.clientInfo = sd.data ;
                 typeof cb == "function" && cb(me.globalData.clientInfo) ;
             }else{
                  typeof fb == "function" && fb(sd);
             }
        }, fd => {
             typeof fb == "function" && fb(fd);
        });
      }
      me.login(sd=>{
        _doGetUser(sd.openid) ;
      } );
  
    }
  },
  getAppInfo: function (sb, fb) {
    var me = this;
    if (me.globalData && me.globalData.appInfo) {
      sb && typeof sb === 'function' && sb(me.globalData.appInfo);
    } else {
    
      var data = { app_info_code: me.ser.app_info_code };
      me.http.post(me.act.getAppInfo, data,
        sd => {
          if (sd.success) {
            me.globalData.appInfo = sd.data;
            sb && typeof sb === 'function' && sb(sd.data);
          } else {
            fb && typeof fb === 'function' && fb(sd.data);
          }
        }, fd => {
            fb && typeof fb === 'function' && fb(fd);
        });
    }
  },
  login: function (scb, fcb) {
    var me = this;
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        var sessionInfo = wx.getStorageSync(me.lsf.USER_SESSION);
        if (sessionInfo) {
          typeof scb == "function" && scb(sessionInfo);
        } else {
          me.doLogin(scb, fcb);
        }

      },
      fail: function () {
        //登录态过期
        me.doLogin(scb, fcb);
      }
    });

  },
  doLogin: function (scb, fcb) {
    var me = this;
    wx.login({
      success: function (res) {
        console.log("wx.login success:", res);

        var data = {
          app_info_code: me.ser.app_info_code,
          code: res.code
        };
        me.http.post(me.act.getOpenid, data, _ => {
          console.log("app ->getOpenid success:", _);
          if (_.success) {
            wx.setStorageSync(me.lsf.USER_SESSION, _.data);
            typeof scb == "function" && scb(_.data);
          } else {
            typeof fcb == "function" && fcb(_.data);
          }
        }, f => {
          console.error("getOpenid error:", f);
          //util.showToast("out/onLogin error:", f);
        });
        //
      },
      fail: function (res) {
        console.log("wx.login fail:", res);
      }
    });
  },
  getRcvInfos: function (cb,fb) {
    var me = this;

    var rcvInfos = me.globalData.rcvInfos;
    if (rcvInfos) {
      typeof cb == "function" && cb(rcvInfos);
      return;
    } else {

      var doPost = function (openid) {
        //调用登录接口
        var data = { app_info_code: me.ser.app_info_code, openid: openid };
        me.http.post(me.act.getRcvInfos, data, sd => {
          if (sd.success && sd.data) {
            me.globalData.rcvInfos = sd.data;
            typeof cb == "function" && cb(me.globalData.rcvInfos);
          } else {
            typeof fb == "function" && fb(sd);
          }
        }, fd => {
          typeof fb == "function" && fb(fd);
        });
      }
      me.login(sd => {
         doPost(sd.openid);
      });
      return ;
    }

  },

  setDefaultRcvInfo:function (code) {
    var rcvInfos = this.globalData.rcvInfos;
    rcvInfos.forEach((v, i, a) => {
      if (v && v.rcv_code == code) {
        v.isDefault = 1;
      } else {
        v && (v.isDefault = 0);
      }
    });
  },
  loadAllCourse: function (sb, fb) {
    var me = this ;
    //每次登陆，只需要加载一次课程信息
    if (me.globalData.allCourses && me.globalData.allCourses.length > 0) {
      (typeof sb == "function" && sb(me.globalData.allCourses));
      return;
    }

    var data = { app_info_code: me.ser.app_info_code };
    me.http.post(me.act.getAllCourse, data, sd => {
      if (sd.success && sd.data) {
        me.globalData.allCourses = sd.data;
        typeof sb == "function" && sb(me.globalData.allCourses);
      } else {
        typeof fb == "function" && fb(sd);
      }
    }, fd => {
      typeof fb == "function" && fb(fd);
    });
  }
})
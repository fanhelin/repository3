// pages/practice/doPractice.js
var app = getApp();
var playstart=0;
var playend=0;
var playtimes=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: app.ser.imageUrl,
    course:{},
    chapter:{},
    qiandao_img:'../../res/images/qiandao_no.png',
    isPayEnd:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    });
    var that = this;
    var name = options.name;
    var code = options.code;
    var sequence = options.sequence;
    var data = { code: code, sequence: sequence };
    console.log("data:", data);
    app.http.post(app.act.findChapterByCourse, data, sd => {
      console.log("findChapterByCourse:", sd);
      if (sd.success && sd.data) {
        that.setData({
          course:{name:name,code:code},
          chapter: sd.data
        });
      } else {
        typeof fb == "function" && fb(sd);
      }
    }, fd => {
      typeof fb == "function" && fb(fd);
    });
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
    wx.showShareMenu({
      withShareTicket: true
    });
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '分享视频',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  endplay:function(e){
    playtimes = playtimes + (new Date().getTime() - playstart) / 1000 / 60;
    this.setData({
      qiandao_img:"../../res/images/qiandao.png",
      isPayEnd:true
    });
    var course_code = this.data.course.code;
    var chapter_code = this.data.chapter.code;
    var openid = app.globalData.clientInfo.client.openid;
    var app_info_code = app.ser.app_info_code;
    var sequence = this.data.chapter.sequence;
    var data = { course_code: course_code, chapter_code: chapter_code, app_info_code: app_info_code, sequence: sequence, num: parseInt(playtimes), openid: openid};
    app.http.post(app.act.addPractice, data, sd => {
      console.log("addPractice:", sd);
      if (sd.success ) {
        app.getClientInfo(null,null,true);
      } else {
        typeof fb == "function" && fb(sd);
      }
    }, fd => {
      typeof fb == "function" && fb(fd);
    });
  },
  startplay:function(e){
    playstart=new Date().getTime();
  },
  pauseplay: function(e){
    playtimes = playtimes + (new Date().getTime() - playstart)/1000/60;
  },
  doQiandao:function(e){
    if (!this.data.isPayEnd)
      return;
    console.log("last_sign_day:", app.globalData.clientInfo.client.last_sign_day);
    var last_sign_day = app.globalData.clientInfo.client.last_sign_day;
    if (last_sign_day != null && last_sign_day.length>10){
      last_sign_day=last_sign_day.split(" ")[0];
      var new_day = app.util.formatTime(new Date(), '-', false,':');
      
      if (last_sign_day == new_day){
        wx.showToast({
          title: '你今天已完成签到！',
          icon: 'none',
          duration: 1600
        });
        //return;
      }
      
    }
    wx.navigateTo({
      url: '../sign/sign',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    });
  },
  dofenxiang:function(){
    wx.showToast({
      title: '请点击屏幕右上方[...]分享给朋友！',
      icon:'none',
      duration: 1600
    });
    wx.showShareMenu({
      withShareTicket: true
    });
  }
})
//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    courseList: [],
    imge_url: app.ser.imageUrl
  },
  onShow: function () {
    var that = this;
    var needReload = app.util.getStore(app.lsf.KEY_NEED_RELOAD,true) ;
    if (!needReload) {
      needReload = false ;
    }  
    app.getClientInfo(sd => {
      if (sd && sd.courses) {
        that.setData({
          courseList: sd.courses
        });
      }
    }, fd => {
      partice.setData({
        courseList: []
      });

      }, needReload);
  },
  onLoad: function () {
    
  },
  courseDetail:function(e){
    var index = e.currentTarget.dataset.index;
    var code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../courseDetail/clientCourseDetail?index=' + index + '&code=' + code,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  goPractice: function (e) {
    var sequence = e.currentTarget.dataset.seq;
    var code = e.currentTarget.dataset.code;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../practice/doPractice?code=' + code + '&sequence=' + sequence+'&name='+name,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  goPractice_agin: function (e) {
    var that=this;
    var openid = app.globalData.clientInfo.client.openid;
    var course_code = e.currentTarget.dataset.code;
    var data = { course_code: course_code, openid: openid};
    app.http.post(app.act.courseRestart, data, sd => {
      console.log("courseRestart:", sd);
      if (sd.success) {
        app.getClientInfo(sd => {
          if (sd && sd.courses) {
            that.setData({
              courseList: sd.courses
            });
          }
        }, fd => {
          partice.setData({
            courseList: []
          });

        },true);
        e.currentTarget.dataset.seq=1;
        that.goPractice(e);
      } else {
        typeof fb == "function" && fb(sd);
      }
    }, fd => {
      typeof fb == "function" && fb(fd);
    });
  }
})
//获取应用实例
var app = getApp();
Page({
  data: {
    imageUrl: app.ser.imageUrl,
    indicatorDots: true,//是否显示面板指示点
    autoplay: true,  //是否自动切换
    interval: 5000, //自动切换时间
    duration: 1000,  //滑动时间
    course: {},
    chapters:[]
  },
  onLoad: function (options) {
    var that = this;
    var index = options.index;
    var code = options.code;
    app.globalData.pageHistoryData.Course_index = index;
    app.getClientInfo(sd => {
      if (sd && sd.courses) {
        that.setData({
          course: sd.courses[index]
        });
      }
    }, fd => {
      that.setData({
        course: {}
      });

    });
    var data = { course_code: that.data.course.code };
    app.http.post(app.act.getCourseChapters, data, sd => {
      console.log("getCourseChapters:", sd);
      if (sd.success && sd.data) {
        that.setData({
          chapters: sd.data
        });
      } else {
        typeof fb == "function" && fb(sd);
      }
    }, fd => {
      typeof fb == "function" && fb(fd);
    });
  },
  onShow: function () {
    var that = this;
    if (!app.globalData.pageHistoryData.Course_index)
      return;
    var index =app.globalData.pageHistoryData.Course_index;
    app.getClientInfo(sd => {
      if (sd && sd.courses) {
        that.setData({
          course: sd.courses[index]
        });
      }
    }, fd => {
      that.setData({
        course: {}
      });

    });
  },
  goPractice: function(e){
    var index = e.currentTarget.dataset.index;
    var code = this.data.course.code;
    var sequence = this.data.chapters[index].sequence;
    var name = this.data.course.name;
    wx.navigateTo({
      url: '../practice/doPractice?code=' + code + '&sequence=' + sequence + '&name=' + name,
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
  }
})
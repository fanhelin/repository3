//index.js
//获取应用实例
const app = getApp() ;
Page({
  data: {
    imageUrl: app.ser.imageUrl,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indicatorDots:true,
    autoplay:false,
    interval:5000,
    duration:1,
    client:{},
    practices:[] ,
    finished_hours:0,
    total_hours:0,
    left_chapters:0,
    lastCourse : null , 
    left_hours:0,
    styStateAnimation: {},
    userImgAnimation: {},
    hidden: "false",
    userInfo: {},
    registered: true,
    currentChapter:'',
    guis: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var me = this ;
    wx.setNavigationBarTitle({
      title: '练习',
    })

    app.getAppInfo(sd=>{
      console.log('success:',sd) ;
    },fd=>{
      console.log("fail:",fd) ;
    }) ;

  },
  findPracticeList: function(){
     wx.navigateTo({url: '/pages/practice/practice'});
  },
  findClientCourse: function () {
    wx.navigateTo({ url: '/pages/courseDetail/clientCourse' });
  },onShow:function(){
    var me = this ;

    me.getUserInfo();

    me.data.finished_hours = 0 ; //重置
    me.data.total_hours = 0; //重置
    me.data.left_chapters =0 ;

    app.getClientInfo(sd => {
       //统计客户全部练习时间
      if (sd && sd.courses){
        sd.courses.forEach((e, i, a) =>{
          me.data.total_hours += e.totalMinutes ;
          me.data.left_chapters += e.left_chapters ;
        }) ;
      }
        //统计客户已练习时间
      if (sd && sd.practices) {
        sd.practices.forEach((e, i, a) => {
            //console.log('i=', i, "e=", e, "a=", a);
            me.data.finished_hours += e.minute;
        });
      }
      me.setData({
        client: sd.client,
        practices: sd.practices,
        left_hours: (me.data.total_hours - me.data.total_hours).toFixed(1) ,
        finished_hours: (me.data.finished_hours / 60).toFixed(1),
        total_hours: (me.data.total_hours / 60).toFixed(1),
        left_chapters : me.data.left_chapters,
        registered: (!sd.client) ? false : true
      });

      if (sd.practices && sd.practices.length >0){
        var lastCourse = sd.practices[sd.practices.length - 1]  ;//按datetime排序的最后一个为最后练习 
        me.getCourseChapters(lastCourse.course_code,sd =>{
       
             lastCourse.chapters = sd ;
             console.log("last lastCourse:", lastCourse);
             me.setData({
               lastCourse: lastCourse 
             }) ;
        } ,fd=>{
             
        });
      }
 



    }, fd => {
      console.log("getClientInfo fail fd:", fd);
    });
  },
  getCourseChapters:function(courseCode,sb,fb){
     var data = { course_code: courseCode };
        app.http.post(app.act.getCourseChapters, data, sd => {
          console.log("getCourseChapters:", sd);
          if (sd.success && sd.data) {
            typeof sb == "function" && sb(sd.data);
          } else {
            typeof fb == "function" && fb(sd);
          }
        }, fd => {
          typeof fb == "function" && fb(fd);
        });
  },

  scrooll: function (e) {
    var that = this,
      top = e.detail.scrollTop,
      hid = "false",
      ratio = 1 - top / that.data.userImgSize,
      animation = {},   //文字动画
      headAmt = {};     //头像动画    

    if (top > 400 - 130) {                   //upper过多
      hid = "true";
    } else {
      animation = wx.createAnimation({
        transformOrigin: "50% 50%",
        timingFunction: "linear",
        delay: 0
      });
      animation.scale(ratio, ratio).opacity(ratio).step();

      headAmt = wx.createAnimation({
        transformOrigin: "50% 50%",
        timingFunction: "linear",
        delay: 0
      });
      headAmt.scale(ratio, ratio).opacity(ratio).translateY(top * 2).step();
    }
    that.setData({
      hidden: hid,
      styStateAnimation: animation.export(),
      userImgAnimation: headAmt.export(),
    });
  } ,
  onSwiperChange:function(e){
    console.log("onSwiperChange:",e) ;
    if (this.data.lastCourse && this.data.lastCourse.chapters){
      this.setData({ currentChapter: this.data.lastCourse.chapters[e.detail.current].name });
    }
  },
 getUserInfo:function(){
      var me = this ;
      if (!me.data.guis){
      wx.getUserInfo({
        success: function (res) {
          
          me.setData({
            userInfo: res.userInfo,
            guis: true
          });
        },
        fail: function () {
          me.setData({
            guis: false
          });
        }
      });
    }

  },
  toTestVideo:function(e){
    console.dir("dddddd2222");
    console.dir(e);
    wx.navigateTo({ url: '/pages/test/videoTest' }); 
  }

})

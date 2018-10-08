// pages/courseDetail/courseDetail.js

//获取应用实例
var app = getApp();
Page({
  isReg: false, //是否注册
  data: {
    imageUrl: app.ser.imageUrl,
    indicatorDots: true,//是否显示面板指示点
    autoplay: true,  //是否自动切换
    interval: 5000, //自动切换时间
    duration: 1000,  //滑动时间
    course: {},
    buyCount: 1,
  
  },
  onLoad: function (options) {
    var me = this ;
    var id = options.id;
    var code = options.code;
  
    me.getCourseChapters(code ,sd=>{
        console.log("getCourseChapters sd:", sd);
        me.setData({ course : sd}) ;
    } ,fd=>{
        console.log("getCourseChapters fd:",fd) ;
        me.setData({ course: {} });
    }) ;
  },
  onShow: function () { 
    var me = this ;
    app.getClientInfo(
        sd=>{
          sd.client && sd.client.openid && (me.isReg = true ) ; 
        } ,
        null
    ) ;

  },

  getCourseChapters:function (course_code,sb, fb) {
    app.loadAllCourse(sd => {
      var course = app.util.getArrayItem(sd, [{ k: 'code', v: course_code }], 'item');
      if (course == null) {
        typeof fb == "function" && fb({ ret: -1, 'msg': '没找到对应课程' });
        return;
      }
      if (course.chapters && course.chapters instanceof Array && course.chapters.length > 0) {
        typeof sb == "function" && sb(course);
        return;
      }
      var data = { app_info_code: app.ser.app_info_code, course_code: course_code };
      app.http.post(app.act.getCourseChapters, data, sd => {
        if (sd.success && sd.data) {
          course.chapters = sd.data;
          typeof sb == "function" && sb(course);
        } else {
          typeof fb == "function" && fb(sd);
        }
      }, fd => {
        typeof fb == "function" && fb(fd);
      });
        


    }, fd => {
        console.log("loadAllCourse fd=", fd);
    });


   
  },
  changeBuyCount: function (e) {
   
    var id = e.currentTarget.id;
    var count = this.data.buyCount;
    if (id == "add") {
      if (count >=1) 
        {return;}//视频不允许改变数量
      count = (count > 0) ? count + 1 : 1
    } else {
      count = (count > 0) ? count - 1 : 0
    }
    this.setData({ buyCount: count });
  },
  /**fhr 2017/9/9**/
  buyNow: function () {

    if(!this.isReg){
        wx.showModal({
          title: '提示',
          content: '您还未注册，不能购买视频',
        });
       return ;
    }

    var isBuyNow = true;
    this.addToCart(null, isBuyNow);
  },

  /**fhr 2017/9/9**/
  addToCart: function (e, isBuyNow = false) {
    

      if (!this.isReg) {
        wx.showModal({
          title: '提示',
          content: '您还未注册，不能购买视频',
        });
        return;
      }


      if (this.data.buyCount < 1) {
        wx.showToast({
          title: '请设置商品数量',
          icon: 'success',
          duration: 2000
        });

        setTimeout(() => {
          wx.hideToast();
        }, 2000);
        return;
      }

      var comd = this.data.course;
      //取出购物车商品
      comd = {
        com_code: comd.code, com_name: comd.name,
        title: comd.name, main_pic: this.data.imageUrl + comd.code + "/" + comd.image_name, price: comd.price, pay: comd.price,
        buycount: this.data.buyCount
      };

    function doAddToCart() {
      try {
        var allComds = wx.getStorageSync(app.lsf.SHOPING_CART);
        if (allComds == null || !allComds) {
          allComds = [];
        }

        var exist = false;
        var index = 0;
        for (var i = 0; i < allComds.length; i++) {
          var temp = allComds[i];
          if (temp.com_code == comd.com_code) {
            if (temp.buycount > 0) {  // 购买
              exist = true;
              index = i;
            } else {
              allComds.splice(i, 1);  // 购买数量为0的删除
            }
            break;
          }
        }

        if (exist) {
          wx.showModal({
            title: '提示',
            content: '已存在该商品，是否替换原商品？',
            success: function (res) {
              if (res.confirm) {
                allComds.splice(index, 1);  // 购买数量为0的删除
                allComds.push(comd);
                wx.setStorageSync(app.lsf.SHOPING_CART, allComds);

                wx.showToast({
                  title: '已加入购物车',
                  icon: 'success',
                  duration: 2000
                });

                setTimeout(() => {
                  wx.hideToast();
                  if (isBuyNow) {
                    wx.switchTab({ url: '/pages/shoppingcar/shoppingcar' });
                  } else {
                    wx.navigateBack({ delta: 1 });
                  }
                }, 2000);

              } else if (res.cancel) {
                console.log('用户点击取消');

              }
            }
          })
        } else {
          allComds.push(comd);
          wx.setStorageSync(app.lsf.SHOPING_CART, allComds);

          wx.showToast({
            title: '已加入购物车',
            icon: 'success',
            duration: 2000
          });

          setTimeout(() => {
            wx.hideToast();
            if (isBuyNow) {
              wx.switchTab({ url: '/pages/shoppingcar/shoppingcar' });
            } else {
              wx.navigateBack({ delta: 1 });
            }
          }, 2000);
        }


      } catch (e) {
        console.log("addToCart exception :", e);
      }
    }

    this.alreadyBuy(comd.com_code, function(isAlreayBuy){
      if (isAlreayBuy){
        wx.showToast({
          title: '您已购买',
          icon: 'success',
          duration: 2000
        });
        return ;
      }else{
        doAddToCart() ;
      }
    },null) ;

  },
  alreadyBuy: function (course_code,sb,fb){
    var that = this;
    var openid = app.globalData.clientInfo.client.openid;
    var data = { course_code: course_code, openid: openid };
    app.http.post(app.act.alreayBuy, data, sd => {
      console.log("alreadyBuy:", sd);
      if (sd.success) {
          var isAlreayBuy = false ;
          if(sd.data.count>0){
            isAlreayBuy = true ;
          }
         sb && typeof sb == "function" && sb(isAlreayBuy);
          
      } else {
         typeof fb == "function" && fb(sd);
      }
    }, fd => {
      typeof fb == "function" && fb(fd);
    });
  }
  
})
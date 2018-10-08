//logs.js

var app = getApp()
Page({
  iCount: 0,
  data: {
    allCmds: {}, 
    sumPrice: 0,
    defaultRcvInfo: null,
    needRcv:false
  },
  onLoad: function () {
    var that = this;

  },
  onShow: function () {
   // sta();
    var allCmds = wx.getStorageSync(app.lsf.SHOPING_CART);
    var sumPrice = 0;
    for (var i = 0; i < allCmds.length; i++) {
      var price = allCmds[i].price;
      var count = allCmds[i].buycount;
      price = app.util.accMul(price, count);
      allCmds[i].pay = price;
      sumPrice = app.util.accAdd(sumPrice, price);
    }
    this.setData({ allCmds: allCmds, sumPrice: sumPrice });
    if (this.data.needRcv){
       this.getDefaultdeRcvInfo();
    }
   
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

  toAddress: function (e) {
    console.log("toAddress:", e);
    wx.navigateTo({ url: '/pages/address/address' });
  },

  settlement: function () {
    var me = this;
    //检查地址是否为空
    if (this.data.needRcv &&(!this.data.defaultRcvInfo || !this.data.defaultRcvInfo.rcv_code) ) {
      wx.showModal({
        title: '提示',
        content: '请您先添加邮寄地址！',
        success: function (res) {
          if (res.confirm) {
            me.toAddress();
          }
          return;
        }
      });
    }

    //继续生成订单
    var rcv_code = this.data.needRcv?this.data.defaultRcvInfo.rcv_code :'';
    var allCmds = this.data.allCmds;

   var orderCmds = [] ;
    allCmds.forEach(function (cmd) {
      orderCmds.push({ course_code: cmd.com_code, num: cmd.buycount, price: cmd.price, course_name: cmd.com_name}) ;

    });
    
     /*
      wx.showToast({
            title: '正在下单...',
            icon: 'loading',
            duration: 1000
            });
      */
    me.unifedOrder("健身视频", me.data.sumPrice, orderCmds) ;
  },

  unifedOrder: function (body, totalFee, commodity ) {
    var me = this;
    app.getAppInfo(sd => {
      var data = sd.appInfo;
      app.login(lsd => {
        data.openid = lsd.openid;
        data.total_fee = totalFee * 100 ; //将元转换为分
        data.body = body;
        // JSON.stringify(commodity) ;
        commodity = { appInfo: sd.appInfo, goods: commodity} ;
        data.commodity = JSON.stringify(commodity); ;
        
        app.http.post(app.act.unifiedOrder, data, psd => {
          console.log("uinfedOrder post psd:", psd);
          if (psd.success) {
              //me.reSign(sd.appInfo, psd.data.prepay_id);
            me.invokPayment(psd.data);
          } else {
            wx.showModal({
              title: '提示',
              content: '统一下单失败',
            });
            console.error("uinfedOrder post bus fail:", psd.message);
          }
        }, pfd => {
          wx.showModal({
            title: '提示',
            content: '统一下单失败',
          });
          console.error("unifedOrder post pfd:", pfd);

        });
      }, lfd => {
        wx.showModal({
          title: '提示',
          content: '统一下单失败',
        });
        console.error("unifedOrder login:", lfd);
      });

    }, fd => {
      wx.showModal({
        title: '提示',
        content: '统一下单失败',
      });
      console.error("unifedOrder getAppInfo:", fd);
    });
  },

  reSign: function (appInfo, prepay_id) {
    var me = this;
    var data = appInfo;
    data.prepay_id = prepay_id;
    app.http.post(app.act.reSign, data, sd => {
      console.log("二次签名,sd：", sd);
      if (sd.success) {

        me.invokPayment(sd.data, prepay_id);
      } else {
        wx.showModal({
          title: '提示',
          content: '二次签名失败'
        });
        console.error("reSign post buss fail:", sd.message);
      }
    }, fd => {
      wx.showModal({
        title: '提示',
        content: '二次签名失败'
      });
      console.error("reSign post fd:", fd);
    });
  },
  invokPayment: function (data) {
    var me = this;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function (res) {
        console.log("requestPayment,success ,res：", res,data);
        //清除购物车
           wx.setStorageSync(app.lsf.SHOPING_CART, []);
           me.setData({ allCmds:[]}) ;
           app.util.showToast("支付成功");
           setTimeout(() => {
             //wx.navigateBack({ delta: 1 });
             wx.setStorageSync(app.lsf.KEY_NEED_RELOAD, true) ;
             wx.navigateTo({
               url: '/pages/courseDetail/clientCourse'
             });

           }, 2000);
      },
      fail: function (res) {
        console.log("requestPayment,fai ,res：", res);
        app.util.showToast("失败");
      }
    });
  },
  invokPayment_old: function (data, prepay_id) {
    var me = this;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function (res) {
        console.log("requestPayment,success ,res：", res);
        //清除购物车
        wx.setStorageSync(app.lsf.SHOPING_CART,[]);
        app.util.showToast("支付成功");
        setTimeout(()=>{
          wx.navigateBack({ delta: 1 });
        },2000) ;
      },
      fail: function (res) {
        console.log("requestPayment,fai ,res：", res);
        app.util.showToast("失败");
      }
    });
  }
})

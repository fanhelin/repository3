// pages/shoppingcar/shoppingcar.js
var app = getApp() ;
Page({
  maxNum:1,
  data: {
    allCmds: {},
    sumPrice: 0
  },
  onLoad: function () {

  },
  onShow: function () {
    this.showAllCmds();
  },
  settlement: function () {
    wx.navigateTo({ url: '/pages/settlement/settlement' })
  },
  jia: function (e) {
    this.jiaj(e, true);
  },
  jian: function (e) {
    this.jiaj(e, false);
  },
  showAllCmds: function () {

    var allCmds = wx.getStorageSync(app.lsf.SHOPING_CART);
    var sumPrice = 0;
    for (var i = 0; i < allCmds.length; i++) {
      var price = allCmds[i].price;
      var count = allCmds[i].buycount;
      price = app.util.accMul(price, count);
      sumPrice = app.util.accAdd(sumPrice, price);
    }

    this.setData({
      allCmds: allCmds,
      sumPrice: sumPrice
    });
  },
  toDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?id=' + id + "&code=" + code
    }
    );
  },
  jiaj: function (e, flag) {
    var me = this ;
    var id = e.currentTarget.dataset.id;
    var s = 0;
    var allCmds = this.data.allCmds;
    for (var i = 0; i < allCmds.length; i++) {
      if (allCmds[i].com_code == id) {
        if (flag) {
          
          if (this.maxNum >= allCmds[i].buycount){
            wx.showToast({
              title: '最多购买' + me.maxNum+'份',
              icon: 'success',
              duration: 2000
            });
              return  ;
          }
          s = allCmds[i].buycount + 1;
        } else {
          s = allCmds[i].buycount - 1;
        }
        //最低值不得低于1
        if (1 > s) {
          allCmds.splice(i, 1);
        } else {
          allCmds[i].buycount = s;
        }
        break;
      }
    }
    wx.setStorageSync(app.lsf.SHOPING_CART, allCmds);
    this.setData({
      allCmds: allCmds
    });
    this.showAllCmds();
  }
})

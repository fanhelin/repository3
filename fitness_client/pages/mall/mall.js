// pages/mall/mall.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: app.ser.imageUrl,
    courses:[],
    searchText:'',
    scrollHeight:500,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this ;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res.model)
        // console.log('pixelRatio',res.pixelRatio)
        // console.log('windowWidth',res.windowWidth)
        // console.log("windowHeight",res.windowHeight)
        // console.log(res.language)
        // console.log(res.version)
        // console.log(res.platform)
          me.setData({scrollHeight : res.windowHeight - 48}) ;
      }
    })

     wx.setNavigationBarTitle({
       title: '视频商城',
     });

     app.loadAllCourse(sd=>{
         console.log("loadAllCourse sd=",sd) ;
         me.setData({courses:sd}) ;
     },fd=>{
       console.log("loadAllCourse fd=", fd);
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
  wxSearchFn:function(){

    var newArr = app.util.searchFromArray(app.globalData.allCourses, [{ k: 'name', v: this.data.searchText}]) ;
    this.setData({ courses: newArr}) ;
  },
  wxSearchInput: function (e) {
     this.setData({ searchText: e.detail.value });
  },
  todetail:function(e){
    var id = e.currentTarget.id;
    var code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../courseDetail/courseDetail?id=' + id + '&code=' + code,
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
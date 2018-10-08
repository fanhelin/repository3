// pages/register/upload.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    filePath:null,
    uploadType: null,
    preName: null,
    choosedImag: false,
    uploadProgress: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      filePath: app.ser.imageUrl + 'client/' + app.globalData.clientInfo.client.sign_image
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

  onSelectFile: function () {
    var me = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var filePath = res.tempFilePaths[0] ;
        me.setData({
          filePath: filePath,
          choosedImag: true
        });
      },
      fail: function (res) {
        console.log("chooseImage fail:", res);
        me.setData({
          choosedImag: false
        });
      }
    });
  },

  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  onUploadFile: function () {
    var me = this;
    if (me.data.filePath == null || !me.data.choosedImag) {
      return;
    }
    var url = app.ser.baseUrl + app.act.updateSignInfo;
    const uploadTask = wx.uploadFile({
      method: 'POST',
      url: url, //仅为示例，非真实的接口地址
      filePath: me.data.filePath,
      name: 'file',
      formData: {
        'app_info_code': app.ser.app_info_code,
        'openid': app.globalData.clientInfo.client.openid,
        'con_sign_days': app.globalData.clientInfo.client.con_sign_days,
        'last_sign_day': app.globalData.clientInfo.client.last_sign_day,
        'score': app.globalData.clientInfo.client.score
      },
      success: function (res) {
        console.log("res:", res);
        var data = JSON.parse(res.data);
        if (res.statusCode == 200 && data.success) {
          app.getClientInfo(null,null,true);
          wx.showToast({
            title: '上传图片成功',
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1000);
        } else {
          wx.showToast({
            title: '上传图片失败',
          });
        }
      }
    });
    uploadTask.onProgressUpdate((res) => {
      me.setData({ uploadProgress: '上传进度:' + res.progress + '% ' + res.totalBytesSent + "/" + res.totalBytesExpectedToSend });
    });
  }
})
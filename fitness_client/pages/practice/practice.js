//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    practiceList:[],
    imge_url: app.ser.imageUrl
  },
  onShow: function () {


  },
  onLoad: function () {
    var partice = this;
    // var data = { app_info_code: app.ser.app_info_code,openid:app.globalData.clientInfo.client.openid};
    // app.http.post(app.act.findPracticeList, data, sd => {
    //   console.log("findPracticeList:", sd);
    //   if (sd.success && sd.data) {
    //     partice.setData({
    //       practiceList: sd.data
    //     });
    //   } else {
    //     typeof fb == "function" && fb(sd);
    //   }
    // }, fd => {
    //   typeof fb == "function" && fb(fd);
    // });
    app.getClientInfo(sd=>{
      if (sd && sd.practices){
        partice.setData({
          practiceList: sd.practices
         });
      }
    } ,fd=>{
      partice.setData({
        practiceList: []
      });

    }) ;
  }
})
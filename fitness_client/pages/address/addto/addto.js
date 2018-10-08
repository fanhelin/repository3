
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    rcvInfo:''
  },
  //事件处理函数
  onLoad: function (options) {
    var me = this;
  
    //添加地址
    var code = options.id;
    //var openid = this.data.userInfo.openid;
    if (code){
      me.getRcvInfo(code) ;
    }
  },
  getRcvInfo:function(code){
    var me = this ;
    app.getRcvInfos(_=>{
      var item = app.util.getArrayItem(_, [{ k: 'rcv_code', v: code }], 'item') ;
      item && me.setData({ rcvInfo: item });
        //  for(var i=0 ;i< _.length ;i++){
        //     if(_[i].rcv_code == code){
        //       me.setData({rcvInfo:_[i]}) ;
        //        return ;
        //     }
        //  }
    });
  },
  onShow:function (){
    //  sta();
  },
  formSubmit: function (e){
      //提交表单
      /*wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 1000
      });*/

      var me = this ;
      var val = e.detail.value;
      if (me.data.rcvInfo){
          me.modifyRcvInfo(me.data.rcvInfo.rcv_code ,val,sd=>{
            wx.navigateBack();
          });

      }else{
        me.addRcvInfo(val,sd=>{
            wx.navigateBack() ;
        }) ;
      }
  },
  addRcvInfo:function(val,cb,fb){
    var me = this ;
    var doPost = function (openid) {
      //调用登录接口
      var data = { app_info_code: app.ser.app_info_code, openid: openid, name: val.name, mobile: val.mobile, address: val.address };
      app.http.post(app.act.addRcvInfo, data, sd => {
        if (sd.success && sd.data) {
          app.getRcvInfos(ris => {
            ris.push(sd.data);
            typeof cb == "function" && cb(sd.data);
          });
         
        } else {
          typeof fb == "function" && fb(sd);
        }
      }, fd => {
        typeof fb == "function" && fb(fd);
      });
    }
    app.login(sd => {
      doPost(sd.openid);
    });

    return ;
  },
  modifyRcvInfo:function(rcv_code,val,cb,fb){
    var me = this;

    var doPost = function (openid) {
      //调用登录接口
      var data = { app_info_code: app.ser.app_info_code, openid: openid, rcv_code: rcv_code,name: val.name, mobile: val.mobile, address: val.address };
      app.http.post(app.act.modifyRcvInfo, data, sd => {
        if (sd.success && sd.data) {
          app.getRcvInfos(ris => {
            var item = app.util.getArrayItem(ris, [{ k: 'rcv_code', v: rcv_code }, 'item']);
            if (item){
              item.name = val.name;
              item.mobile = val.mobile;
              item.address = val.address;
              typeof cb == "function" && cb(item);
            }else{
               typeof fb == "function" && fb(sd);
            }
           
          });

        } else {
          typeof fb == "function" && fb(sd);
        }
      }, fd => {
          typeof fb == "function" && fb(fd);
      });
    }
    app.login(sd => {
      doPost(sd.openid);
    });

  },
  deleteAddress:function(){

    if ((this.data.rcvInfo) && (this.data.rcvInfo.rcv_code!='')){
          var rcv_code = this.data.rcvInfo.rcv_code;
          this.deleteRcvInfo(rcv_code,sd=>{
            console.log("deleteRcvInfo sd=",sd) ;
              wx.navigateBack();
          });   
      }else{
          console.log("删除收货人信息失败");
      }
  },

  deleteRcvInfo: function (rcv_code,sb,fb) {
    var me = this;

    var doPost = function (openid) {
      //调用登录接口
      var data = { app_info_code: app.ser.app_info_code, openid: openid, rcv_code: rcv_code };
      app.http.post(app.act.delRcvInfo, data, sd => {
        if (sd.success && sd.data) {
          
          app.getRcvInfos(ris => {
            for (var i = 0; i < ris.length; i++) {
              if (ris[i].rcv_code == rcv_code) {
                ris.splice(i, 1);
                break;
              }
            }
            typeof cb == "function" && cb(item);
          });

        } else {
          typeof fb == "function" && fb(sd);
        }
      }, fd => {
        typeof fb == "function" && fb(fd);
      });
    }
    app.login(sd => {
      doPost(sd.openid);
    });
  }


})

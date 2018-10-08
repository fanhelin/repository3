function getRandomColor() {
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
// src2="http://www.fitsis.cn:3389/uploadfile/course_53540ab18fcf41ffa746295/chapter_39a/efef8681cacbff8b560965f5345908ee.mp4"
Page({
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo');
    console.dir("dddddddddd") ;
    console.dir(res) ;
  },
  inputValue: '',
  data: {
    src: '',
    danmuList:
    [{
      text: '第 1s 出现的弹幕',
      color: '#ff0000',
      time: 1
    },
    {
      text: '第 3s 出现的弹幕',
      color: '#ff00ff',
      time: 3
    }]
  },
  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },
  bindSendDanmu: function () {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  },
  bindPlay: function () {
    this.videoContext.play()
  },
  bindPause: function () {
    this.videoContext.pause()
  },
  videoErrorCallback: function (e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  }
})
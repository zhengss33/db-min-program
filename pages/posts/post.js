// pages/posts/post.js
const postData = require('../../data/posts-data.js');

Page({
  data:{
    banner: postData.postList.slice(0,4)
  },

  onShareAppMessage: function() {
    return{
      title: '小程序-豆瓣阅读',
      path: 'pages/movies/movies',
      success: function() {
        console.log('success');
      },
      fail: function(res) {
        console.log(res);
      }
    }
  },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({postList: postData.postList});
  },

  onPostTap: function(event){
      const postId = event.currentTarget.dataset.postid;
      wx.navigateTo({
        url: 'post-detail/post-detail?id='+postId
      });
  },

  onSwiperTap: function(event) {
     const postId = event.target.dataset.postid;
     wx.navigateTo({
       url: 'post-detail/post-detail?id='+postId
     });
  }
})
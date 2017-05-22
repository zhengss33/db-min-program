// pages/posts/post-detail/post-detail.js
const postData = require('../../../data/posts-data.js');
const app = getApp();

Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    const postId = options.id;
    const detail = postData.postList[postId];
    
    this.setData({
      detail: detail,
      currentPostId: postId,
    })

    //获取文章是否收藏
    this.isCollected();
    this.playAudioListern();
    this.checkPlayingAudio(postId)
  },

  playAudioListern: function(){
    wx.onBackgroundAudioPlay(() => {
      this.setData({
        isPlayingAudio: true
      });
      app.globalData.g_currentAudioPostId = this.data.currentPostId;
    });

    wx.onBackgroundAudioPause(() => {
      this.setData({
        isPlayingAudio: false
      })
    });

    wx.onBackgroundAudioStop(() => {
      this.setData({
        isPlayingAudio: false
      })
    });
  },

  checkPlayingAudio: function(postId){
    const globalData = app.globalData;

    if(globalData.g_isPlayingAudio && globalData.g_currentAudioPostId === postId) {
      this.setData({
        isPlayingAudio: true
      });
    }
  },

  isCollected: function() {
    const postId = this.data.curentPostId;
    let postsCollected = wx.getStorageSync('posts_collected');


    if(postsCollected) {
      const postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      })
    } else {
      postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }
  },

  onCollected: function(event){
    let postsCollected = wx.getStorageSync('posts_collected');
    const collected = !this.data.collected;

    this.setData({
        collected: collected
    })

    postsCollected[this.data.currentPostId] = collected;
    wx.setStorageSync('posts_collected', postsCollected);

    wx.showToast({
      title: collected ? '收藏成功' : '取消成功',
      duration: 1000
    })
  },

  onShare: function() {
    const itemList = [
        '分享至朋友圈',
        '分享至微信好友',
        '分享至QQ好友'
      ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function(res) {
        console.log(res)
        if (!res.cancel) {
          wx.showModal({
            title: '分享',
            content: '是否分享至' + itemList[res.tapIndex]
          })
        }
      }
    })
  },

  onAudioTap: function(event) {
    const isPlayingAudio = this.data.isPlayingAudio;
    const currentPostId = this.data.currentPostId;
    const audioInfo = postData.postList[currentPostId].music;
    
    if(isPlayingAudio) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingAudio: false
      });
      app.globalData.g_isPlayingAudio = false;
    } else {
      wx.playBackgroundAudio({
        dataUrl: audioInfo.url,
        title: audioInfo.title,
        coverImgUrl: audioInfo.coverImg
      });
      this.setData({
        isPlayingAudio: true
      });
      app.globalData.g_isPlayingAudio = true;
    }
  }
})
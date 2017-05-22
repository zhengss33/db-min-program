// pages/movies/more-movie/more-movie.js
const util = require('../../../utils/util.js');
const app = getApp();

Page({
  data:{
    movies: {},
    requestUrl: '',
    totalCount: 0,
    isEmpty: true,
    loadingState: false,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    const category = options.category;
    const doubanBaseUrl = app.globalData.doubanBaseUrl;
    let dataUrl = '';
    wx.setNavigationBarTitle({
      title: category,
    });

    switch (category) {
      case '正在热映':
      dataUrl = '/v2/movie/in_theaters';
      break;

      case '即将上映':
      dataUrl = '/v2/movie/coming_soon';
      break;

      case '豆瓣Top250':
      dataUrl = '/v2/movie/top250';
      break;
    }

    this.setData({
      requestUrl: doubanBaseUrl + dataUrl
    });
    util.http(doubanBaseUrl + dataUrl, this.processDoubanData);
  },

  processDoubanData: function(moviesDouban) {
    let movies = [];
    let totalMovies = {};
    for(let idx in moviesDouban.subjects) {
      let subject = moviesDouban.subjects[idx];
      let title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...';
      }

      let temp = {
        stars: util.convertToStarsArr(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.setData({
        isEmpty: false
      });
    }
    this.setData({
      movies: totalMovies
    })
    this.data.totalCount += 20;
    this.setData({ loadingState: false });
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function(event) {
    wx.showNavigationBarLoading();
    let nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20'

    if (!this.data.loadingState ) {
      this.setData({ loadingState: true});
      util.http(nextUrl, this.processDoubanData);
    }    
  },

  onPullDownRefresh: function(event) {
    wx.showNavigationBarLoading();
    let refreshUrl = this.data.requestUrl + '?start=0&count=20';
    this.setData({
      movies: {},
      isEmpty: true,
      totalCount: 0,
    })
    util.http(refreshUrl, this.processDoubanData)
  },

  onMovieTap: function(event) {
    const movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    });
  }
})
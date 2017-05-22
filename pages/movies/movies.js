// pages/movies/movies.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data:{
    in_theaters: {},
    coming_soon: {},
    top250: {},
    containerShow: true,
    searchPanelShow: false,
    searchResult: {},
    searchValue: '',
  },

  onShareAppMessage: function() {
    return{
      title: '小程序-豆瓣电影',
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
    const doubanBaseUrl = app.globalData.doubanBaseUrl;
    const in_theatersUrl = '/v2/movie/in_theaters?start=0&count=3';
    const coming_soonUrl = '/v2/movie/coming_soon?start=0&count=3';
    const top250Url = '/v2/movie/top250?start=0&count=3';

    this.getMovieList(doubanBaseUrl + in_theatersUrl, 'in_theaters', '正在热映');
    this.getMovieList(doubanBaseUrl + coming_soonUrl, 'coming_soon', '即将上映');
    this.getMovieList(doubanBaseUrl + top250Url, 'top250', '豆瓣Top250');
  },

  getMovieList: function(url,settedKey,categoryTitle) {
    wx.request({
      url: url,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "content-type": "json"}, // 设置请求的 header
      success: (res) => {
        this.processDoubanData(res.data, settedKey, categoryTitle);
      },
      fail: (error) => {
        console.log(error)
      }
    })    
  },

  processDoubanData: function(moviesData, settedKey, categoryTitle) {
    let movies = [];
    const subjects = moviesData.subjects;
    for( let idx in subjects) {
      const subject = subjects[idx];
      let title = subject.title;
      if(title.length >= 6) {
        title = title.substring(0,6) + '...';
      }

      let temp = {
        title: title,
        average: subject.rating.average,
        stars: util.convertToStarsArr(subject.rating.stars),
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    let readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
  },

  moreMovies: function(event) {
    const category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },

  onCancelTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
      searchValue: '',
    })
  },

  onBindFocus: function(event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true,
    })
  },

  onBindBlur: function(event) {
    const inputValue = event.detail.value;
    const doubanBaseUrl = app.globalData.doubanBaseUrl;
    const searchUrl = doubanBaseUrl + '/v2/movie/search?q=' + inputValue;

    this.getMovieList(searchUrl, 'searchResult', '');
  },

  onMovieTap: function(event) {
    const movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    });
  }
})
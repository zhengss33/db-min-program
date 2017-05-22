// pages/movies/movie-detail/movie-detail.js
const app = getApp();
const util = require('../../../utils/util.js');

Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    const movieId = options.id;
    const movieUrl = app.globalData.doubanBaseUrl + '/v2/movie/subject/' + movieId;

    util.http(movieUrl, this.processDoubanData);
  },

  processDoubanData: function(data) {
    if (!data) {
        return;
    }
    let director = {
        avatar: "",
        name: "",
        id: ""
    }
    if (data.directors[0] != null) {
        if (data.directors[0].avatars != null) {
            director.avatar = data.directors[0].avatars.large

        }
        director.name = data.directors[0].name;
        director.id = data.directors[0].id;
    }
    let movie = {
        movieImg: data.images ? data.images.large : "",
        country: data.countries[0],
        title: data.title,
        originalTitle: data.original_title,
        wishCount: data.wish_count,
        commentCount: data.comments_count,
        year: data.year,
        generes: data.genres.join("、"),
        stars: util.convertToStarsArr(data.rating.stars),
        score: data.rating.average,
        director: director,
        casts: util.convertToCastString(data.casts),
        castsInfo: util.convertToCastInfos(data.casts),
        summary: data.summary
    }
    this.setData({
      movie: movie
    })
  },

  viewMoviePostImg: function(event) {
    const imgSrc = event.currentTarget.dataset.src;
    wx.previewImage({
        current: imgSrc,
        urls: [imgSrc]
    })
  },
})
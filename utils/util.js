function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function convertToStarsArr(stars) {
  let num = stars.toString().substring(0,1);
  let arr = [];
  for(let i = 1; i<=5; i++) {
    if( i <= num) {
      arr.push(1);
    } else {
      arr.push(0)
    }
  } 
  return arr;
}

function http(url, callback) {
    wx.request({
      url: url,
      data: {},
      method: 'GET', 
      header: { "Content-Type": "json"}, 
      success: function(res){
        callback(res.data);
      },
      fail: function(error) {
        console.log(error)
      }
    }) 
}

function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

module.exports = {
  formatTime: formatTime,
  convertToStarsArr: convertToStarsArr,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos,
}

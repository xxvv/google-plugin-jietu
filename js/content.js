chrome.runtime.onMessage.addListener(function (msg) {
  if (msg.strat) {
    strat()
  }
  if (msg.type === 'jietu') {
    scrollScreen(msg.type, msg.index)
  }
  if (msg.type === 'image') {
    getImage(msg)
  }
})

function bindHover(e) {
  var sref = $(this)
  e.stopPropagation();
  e.preventDefault();
  if (sref.parent('.jt-hover').hasClass('jt-hover')) {
    return
  }
  $('.jt-hover .jt-del-element').remove()
  $('.jt-hover').removeClass('jt-hover')
  var _sref = sref
  if (sref[0].nodeName === 'IMG') _sref = sref.parent()
  _sref.addClass('jt-hover')
  _sref.append('<button class="jt-del-element jt-button jt-button_warning" type="button">删除元素</button>')
}

function strat () {
  $("body").append("<iframe id='jt-iframe' class='jt-iframe-normal' src='"+chrome.extension.getURL("iframe.html")+"' frameborder='0' scrolling='no' seamless='seamless'>");
  // 给所有元素绑定mouse
  $(document.body).on('mouseenter', '*', bindHover)
  $(document.body).on('click', '.jt-del-element', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).parent().remove()
  })
}
let width
function scrollScreen (type, index) {
  var _index = index || 0
  var body = $('body')
  if (!width) width = body.width()
  var window_height = window.innerHeight
  var offset_height = body.height()
  var scroll_height = _index * window_height
  $('html,body').animate({scrollTop: scroll_height}, 0)
  var scroll_num = Math.ceil(offset_height / window_height)
  chrome.runtime.sendMessage({
    type: 'screenshot', 
    index: _index,
    isdone: _index >= scroll_num,
    width: width,
    height: window_height,
    allHeight: offset_height
  }, function () {})
}
var imgs = []
function getImage (msg) {
  // 存储图片
  var img = new Image()
  img.src = msg.image
  img.width = msg.width
  img.height = msg.height
  img.onload = function () {
    imgs.push(img)
    if (msg.isdone) {
      // 添加canvas元素
      var canvas = document.createElement('canvas')
      canvas.height = msg.allHeight
      canvas.width = msg.width
      var ctx = canvas.getContext('2d')
      $.each(imgs, function (i, _img) {
        // 最后一个特殊处理
        var height = i * msg.height
        if (i > 0 && i === imgs.length - 1) {
          height = msg.allHeight - msg.height
        }
        ctx.drawImage(_img, 0, height);
      })
      var type = 'png'
      var imgData = canvas.toDataURL('image/' + type)
      imgData = imgData.replace(_fixType(type),'image/octet-stream')
      // 下载后的问题名
      var filename = new Date().getTime() + '.' + type
      saveFile(imgData, filename)
      // var w = window.open('about:blank',"", "_blank");  
      // w.document.write("<img src='"+canvas.toDataURL("image/png")+"' alt='from canvas'/>")
    }
  }
  
  
}

/**
 * 获取mimeType
 * @param  {String} type the old mime-type
 * @return the new mime-type
 */
var _fixType = function(type) {
  type = type.toLowerCase().replace(/jpg/i, 'jpeg');
  var r = type.match(/png|jpeg|bmp|gif/)[0];
  return 'image/' + r;
};
 

/**
 * 在本地进行文件保存
 * @param  {String} data     要保存到本地的图片数据
 * @param  {String} filename 文件名
 */
var saveFile = function(data, filename){
  var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  save_link.href = data;
  save_link.download = filename;
 
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  save_link.dispatchEvent(event);
};


window.addEventListener('message', function(e) {
  if (e.data.type == "jt-hover-el-close") {
    // window.location.reload();
    $(document.body).off('mouseenter', bindHover)
    $('#jt-iframe').remove()
    $('.jt-hover').find('.jt-del-element').remove().end().toggleClass('jt-hover')
	}
})
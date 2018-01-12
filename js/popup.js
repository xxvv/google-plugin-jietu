$(function () {
  $("#jt-hidden-btn").click(function(){
    sendMsg({strat: true }, function (res) {
      // window.close()
      window.close()
    })
    
  });
  $('#jt-jietu-btn').click(function () {
    // 全屏模式
    
    sendMsg({type: 'jietu' }, function (res) {
      window.close()
      // console.log(res)
    })
  })
})

function sendMsg (msg, fn) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
    chrome.tabs.sendMessage(tab[0].id, msg, fn)
  })
}

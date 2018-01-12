
function sendMsg (msg, fn) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
    chrome.tabs.sendMessage(tab[0].id, msg, fn)
  })
}
chrome.runtime.onMessage.addListener(function (msg) {
  var isdone = msg.isdone
  if (msg.type === 'screenshot') {
    chrome.tabs.captureVisibleTab(null, {format: 'png', quality: 80}, function (image) {
      console.log(image)
      // You can add that image HTML5 canvas, or Element.
      if (!isdone) {
        sendMsg({type: 'jietu', index: msg.index + 1})
      }
      sendMsg(Object.assign({}, msg, {type: 'image', image: image}))
      // if (i < scroll_num) scroll(i + 1)
    })
  }
})
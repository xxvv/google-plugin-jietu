$(function () {
  $('#jt-close').on('click', function () {
    console.log('close')
    parent.postMessage({type: 'jt-hover-el-close'}, '*')
  })
})
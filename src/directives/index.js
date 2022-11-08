// 存放所有自定义指令

export const imageerror = {
  // 指令对象 会在当前dom元素插入到节点之后执行
  inserted(dom, options) {
    // 图片异常的逻辑
    // 监听img标签的错误事件 因为图片加载失败 会触发 onerror事件
    dom.src = dom.src || options.value
    // options是指令中的变量的解释  其中有一个属性叫做value
    // dom 表示当前指令作用的dom对象
    // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发土拍你的一个事件 => onerror
    dom.onerror = function() {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // dom可以注册error事件
      dom.src = options.value
    }
  },
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}

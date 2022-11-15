<template>
  <div>
    <svg-icon icon-class="fullscreen" style="color:#fff; width: 20px; height: 20px" @click="changeScreen" />
  </div>
</template>

<script>
// import ScreenFull from 'screenfull'
export default {
  data() {
    return {
      flag: false
    }
  },
  methods: {
    changeScreen() {
      // 原生的全屏写法
      if (this.flag) {
        document.exitFullscreen()
        this.flag = false
      } else {
        document.documentElement.requestFullscreen()
        this.flag = true
      }

      //   使用screenfull插件写法  报错
    //   if (!ScreenFull.isEnabled) {
    //     // 此时全屏不可用
    //     this.$message.warning('此时全屏组件不可用')
    //     return
    //   }
    //   // 如果可用就全屏
    //   ScreenFull.toggle()
    }
  }
}
</script>

<style>

</style>

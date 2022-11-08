<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="{ disabled : fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percent" style="width: 180px;" />
    <el-dialog title="图片" :visible.sync="showDialog">
      <img width="100%" :src="imgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
// 引入腾讯云cos包
import COS from 'cos-js-sdk-v5'
// 实例化COS对象
const cos = new COS({
  SecretId: 'AKIDniVqwmPnvujO0oVEvSmyABMWdd3JVezJ',
  SecretKey: 'lNyeCZorhIlz5zeFkAb8dv9Nj06zhCWp'
})
export default {
  data() {
    return {
      // 将图片地址设置为数组
      fileList: [],
      showDialog: false,
      imgUrl: '',
      // 记录当前正在上传的uid
      currentFileUid: null,
      // 当前百分比
      percent: 0,
      // 控制进度条显示
      showPercent: false
    }
  },
  computed: {
    // 设定计算属性 判断是否已经上传一张图片
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 删除文件
    handleRemove(file, fileList) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    //   this.fileList = fileList
    },
    // 修改文件
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    // 文件上传检查
    beforeUpload(file) {
      // 检查文件格式
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        // 上传终止
        return false
      }
      // 检查文件大小 图片必须小于5MM
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 已经确定当前上传的就是当前的这个file了
      this.currentFileUid = file.uid
      this.showPercent = true
      // 一定要return ture，否则默认为undefined
      return true
    },
    // 上传操作
    upload(params) {
      // 执行上传操作
      if (params.file) {
        cos.putObject({
          // 存储桶
          Bucket: 'ijustsmiled-1314898233',
          // 地域名
          Region: 'ap-chongqing',
          // 文件名
          Key: params.file.name,
          // 要上传的文件对象
          Body: params.file,
          // 上传的文件类型
          StorageClass: 'STANDARD',
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          if (!err && data.statusCode === 200) {
            //   console.log(err || data)
            // 此时说明文件上传成功 要获取成功的返回地址
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
            // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图已经上传完毕  这个属性要为我们后期应用的时候做标记
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
            // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>

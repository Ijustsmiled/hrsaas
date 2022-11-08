<template>
  <div class="detail-container">
    <div class="app-container">
      <div class="dashboard-container">
        <div class="app-container">
          <el-card>
            <el-tabs>
              <el-tab-pane label="登录账户设置">

                <!-- 放置表单 -->
                <el-form ref="userFrom" :rules="rules" :model="userInfo" label-width="120px" style="margin-left: 120px; margin-top:30px">
                  <el-form-item label="姓名:" prop="username">
                    <el-input v-model="userInfo.username" style="width:300px" />
                  </el-form-item>
                  <el-form-item label="密码:" prop="password2">
                    <el-input v-model="userInfo.password2" style="width:300px" type="password" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="saveUser">保存</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="个人详情">
                <el-row type="flex" justify="end">
                  <el-tooltip content="打印个人基本信息">
                    <router-link :to="`/employees/print/${userId}?type=personal`">
                      <i class="el-icon-printer" />
                    </router-link>
                  </el-tooltip>
                </el-row>
                <!-- <user-info /> -->
                <!-- 使用动态组件绑定，方便切换 -->
                <component :is="userComponent" />
              </el-tab-pane>
              <el-tab-pane label="岗位信息">
                <el-row type="flex" justify="end">
                  <el-tooltip content="打印岗位信息">
                    <router-link :to="`/employees/print/${userId}?type=job`">
                      <i class="el-icon-printer" />
                    </router-link>
                  </el-tooltip>
                </el-row>
                <!-- <job-info /> -->
                <component :is="jobComponent" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      // 直接将路由中的参数赋值给data属性
      userId: this.$route.params.id,
      // 承接用户信息
      userInfo: {
        username: '',
        // 使用password2因为获取的password是密文，需要中间值承接一下
        password2: ''
      },
      // 校验规则
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      },
      // 动态组件变量
      userComponent: 'user-info',
      jobComponent: 'job-info'
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
  // 通过id获取用户详细信息
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    // 将新的用户名和密码提交修改
    saveUser() {
      // 校验表单
      this.$refs.userFrom.validate().then(async() => {
        // userInfo中使用的是password2，需要转换为password
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('保存成功')
      })
    }
  }
}
</script>

  <style>

  </style>

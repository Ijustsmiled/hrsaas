<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件 -->
    <el-form ref="deptFrom" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24份 -->
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取 消</el-button>
        <el-button type="primary" size="small" @click="btnOk">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 自定义校验部门名称规则
    const checkNameRepeat = async(rule, value, callback) => {
      // 获取最新数据架构
      const { depts } = await getDepartments()
      let isRepeat = false
      // 判断编辑还是新增
      if (this.formData.id) {
        // 编辑校验规则
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 筛选查找是否有重复的部门名称
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 自定义校验部门编码规则
    const checkCodeRepeat = async(rule, value, callback) => {
      // 获取最新数据架构
      const { depts } = await getDepartments()
      let isRepeat = false
      // 判断编辑还是新增
      if (this.formData.id) {
        // 编辑校验规则
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
      // 筛选查找是否有重复的部门编码
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      // 表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      // 校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }],
        code: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }],
        manager: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求为1-50个字符', trigger: 'blur' }]
      },
      // 接收获取的员工简单列表的数据
      peoples: []
    }
  },
  computed: {
    // 利用计算属性 根据表单是否有id属性 判断树新增还是编辑
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    // 获取负责人数据列表
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 点击确定添加部门
    btnOk() {
      // 校验表单
      this.$refs.deptFrom.validate(async(isOk) => {
        if (isOk) {
          // 判断是编辑还是新增
          if (this.formData.id) {
            // 调用编辑接口
            await updateDepartments(this.formData)
          } else {
            // 调用新增接口
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 提交父组件，更新数据
          this.$emit('addDepts')
          // 提交父组件，关闭弹出层
          // 子组件 update:固定写法 (update:props名称, 值)
          this.$emit('update:showDialog', false)
        }
      })
    },
    btnCancel() {
      // 重置数据 因为resetFields 只能重置 表单上的数据 非表单上的数据 比如 编辑中id 不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 提交父组件，关闭弹出层
      this.$emit('update:showDialog', false)
      // 重置校验字段
      this.$refs.deptFrom.resetFields()
    },
    // 获取部门详情
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style>

</style>

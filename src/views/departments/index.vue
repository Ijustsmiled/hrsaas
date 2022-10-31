<template>
  <div v-loading="loading" class="departments-container">
    <div class="app-container">
      <!-- 组织架构内容 -- 头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <tree-tools-vue :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 树形结构 -->
        <!--  -->
        <!-- default-expand-all 是否默认展开子节点 -->
        <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
        <!-- 作用域插槽 slot-scope = "obj" 接受传递给插槽的数据 data 每个节点的数据对象 -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <tree-tools-vue
            slot-scope="{ data }"
            :tree-node="data"
            @addDepts="addDepts"
            @editDepts="editDepts"
            @delDepts="getDepartments"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 防止新增组件弹层 -->
    <!-- 父组件 sync修饰符 -->
    <add-dept-vue
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartments"
    />
  </div>
</template>

<script>
import treeToolsVue from './components/tree-tools.vue'
import addDeptVue from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  components: {
    treeToolsVue,
    addDeptVue
  },
  data() {
    return {
      company: { },
      departs: [],
      // 与上面props属性相对应
      defaultProps: {
        // 表示 从这个属性显示内容
        label: 'name',
        // 表示 从这个属性查找子节点
        children: 'children'
      },
      // 控制添加弹出显示
      showDialog: false,
      // 当前的部门
      node: null,
      // 用来控制进度弹层的显示和隐藏
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 获取所有部门
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      // 获取顶部内容
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      // 获取所有内容，通过自定义方法将数组型数据转为树形数据
      this.departs = tranListToTreeData(result.depts, '')
      this.loading = false
    },
    // 添加数据
    addDepts(node) {
      // 显示弹出层
      this.showDialog = true
      // 存入当前的部门数据
      this.node = node
    },
    // 编辑数据
    editDepts(node) {
      // 显示弹出层
      this.showDialog = true
      this.node = node
      // 父组件调用子组件的方法
      // 直接调用子组件中的方法 传入一个id
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>

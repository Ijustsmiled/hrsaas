<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%;">
    <!-- 左侧内容 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧内容 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <!-- 下拉菜单 -->
        <el-col>
          <!-- 内容 -->
          <el-dropdown @command="operateDepts">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉内容 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-show="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-show="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 操作节点的方法
    operateDepts(type) {
      if (type === 'add') {
        // 触发添加事件
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        // 触发编辑事件
        this.$emit('editDepts', this.treeNode)
      } else if (type === 'del') {
        // 触发删除事件
        this.$confirm('确定要删除该部门吗', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          // 调用删除方法， 删除部门
          delDepartments(this.treeNode.id).then(() => {
            // 删除成功 传递父组件更新数据
            this.$emit('delDepts')
            this.$message.success('删除部门成功')
          })
        })
      }
    }
  }
}
</script>

<style scoped>
</style>

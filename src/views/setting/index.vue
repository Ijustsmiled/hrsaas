<template>
  <div class="setting-container">
    <div class="app-container">
      <!-- 内容放置 -->
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="角色名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <!-- 注意：最后千万不能加逗号 -->
              <el-pagination
                layout="prev,pager,next"
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
    <!-- 编辑弹出层 -->
    <!-- 注意：点击确定按钮会触发，close关闭事件 -->
    <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, updateRole, getRoleDetail, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      // 承接角色信息数组
      list: [],
      // 放置页码相关数据
      page: {
        page: 1,
        pagesize: 10,
        // 记录总数
        total: 0
      },
      // 承接公司信息对象
      formData: {},
      // 控制弹出层显示
      showDialog: false,
      // 专门接收新增或者编辑的表单数据
      roleForm: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      showPermDialog: false, // 控制分配权限弹层的显示后者隐藏
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null // 用来记录分配角色的id
    }
  },
  // 调用companyId
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    // 分页
    changePage(newpage) {
      // newpage是当前点击页码
      // 将当前页码赋值个当前最新页码
      this.page.page = newpage
      this.getRoleList()
    },
    // 获取公司信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 删除角色信息
    async deleteRole(id) {
      try {
        // 提示信息
        await this.$confirm('确认删除该角色吗', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        // 调用删除方法
        await deleteRole(id)
        // 重新加载数据
        this.getRoleList()
        this.$message.success('删除数据成功')
      } catch (err) {
        console.log(err)
      }
    },
    // 编辑获取角色详情
    async editRole(id) {
      // 获取角色详情
      this.roleForm = await getRoleDetail(id)
      // 开启弹出层
      this.showDialog = true
    },
    // 点击缺点修改数据
    async btnOK() {
      try {
        // 校验表单
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          // 编辑信息
          await updateRole(this.roleForm)
        } else {
          // 新增信息
          await addRole(this.roleForm)
        }
        // 重新加载数据
        this.getRoleList()
        this.$message.success('操作成功')
        // 关闭弹出层
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    // 点击取消触发关闭弹出层
    btnCancel() {
      // 清空表单
      this.roleForm = {
        name: '',
        description: ''
      }
      // 清除校验规则
      this.$refs.roleForm.resetFields()
      // 关闭弹出层
      this.showDialog = false
    },
    // 获取权限点数据 再点击的时候调用 获取权限点数据
    async assignPerm(id) {
      // 转化list到树形数据
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      // 应该去获取 这个id的权限点
      // 有id就可以id应该先记录下来
      this.roleId = id
      // permIds 是当前觉得拥有的权限点数据
      const { permIds } = await getRoleDetail(id)
      // 将当前角色所拥有的权限id赋值
      this.selectCheck = permIds
      this.showPermDialog = true
    },
    async btnPermOK() {
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      // 重置数据
      this.selectCheck = []
      this.showPermDialog = false
    }
  }
}
</script>

  <style>

  </style>

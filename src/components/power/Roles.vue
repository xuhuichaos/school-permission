<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row>
        <el-button type="primary" @click="addDialogVisible = true"
          ><el-icon><Plus /></el-icon>
          <span style="vertical-align: middle"> 添加角色 </span></el-button
        >
      </el-row>
      <el-table :data="roleList" style="width: 100%" border stripe>
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色" width="180">
        </el-table-column>
        <el-table-column prop="description" label="描述" width="180">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template v-slot="slotProps">
            <div>
              <el-icon style="color: #67c23a" v-if="slotProps.row.status == 1"
                ><CircleCheck
              /></el-icon>
              <el-icon style="color: #f56c6c" v-else><CircleClose /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="slotProps">
            <el-tooltip content="修改角色" placement="top">
              <el-button
                type="primary"
                size="default"
                @click="showEditDialog(slotProps.row.id)"
              >
                <el-icon style="vertical-align: middle">
                  <Edit />
                </el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="删除角色" placement="top">
              <el-button type="danger" @click="removeRole(slotProps.row.id)">
                <el-icon style="vertical-align: middle">
                  <Delete />
                </el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="分配权限" placement="top">
              <el-button
                type="warning"
                @click="showRightDialog(slotProps.row.id)"
              >
                <el-icon style="vertical-align: middle"><Finished /></el-icon>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="添加新角色"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addFormRef"
        :model="role"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="role.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="role.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addRole"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog v-model="editDialogVisible" title="修改角色信息" width="40%">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="角色状态">
          <el-select v-model="editForm.status" class="m-2" size="large">
    <el-option
      label="启用"
      :value="1"
    />
    <el-option
      label="禁用"
      :value="0"
    />
  </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editRole"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      v-model="ShowRightDialogVisible"
      @close="rightDialogClosed"
      title="分配权限"
      width="40%"
    >
      <el-tree
        :data="rightList"
        :props="defaultProps"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ShowRightDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="assignmentRight"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import FormatTime from '@/renderTime'
export default {
  data() {
    return {
      // 角色列表
      roleList: [],
      // 树形权限展示列表
      rightList: [],
      rolePermissions: [],
      role: {
        createTime: '',
        deleted: 0,
        description: '',
        id: 0,
        roleName: '',
        status: 0,
        updateTime: ''
      },
      editForm: {},
      // 添加角色对话框的显示与隐藏
      addDialogVisible: false,
      // 修改角色对话框的显示与隐藏
      editDialogVisible: false,
      // 分配权限对话框的显示与隐藏
      ShowRightDialogVisible: false,
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 树形的配置对象
      defaultProps: {
        children: 'childern',
        label: 'description'
      },
      // 角色以分配的权限，默认选中的节点id数组
      defKeys: [],
      // 当前分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRoles()
    this.getRolePermission()
  },
  methods: {
    // 获取角色列表
    async getRoles() {
      const { data: res } = await this.$http.get('/api/role/all')
      if (!res.success) return this.$message.error('获取角色列表失败!')
      const data = res.data.roles
      FormatTime(data, 'createTime')
      this.roleList = data
      console.log(this.roleList)
    },
    async getRolePermission() {
      const { data: res } = await this.$http.get('/api/rolePermission/all')
      console.log(res)
      if (!res.success) return this.$message.error('获取角色权限列表失败!')
      const data = res.data.rolePermissions
      this.rolePermissions = data
      console.log(this.rolePermissions)
    },
    // 获取修改角色的信息
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/api/role/one', {
        params: { id: id }
      })
      console.log(id)
      if (!res.success) {
        return this.$message.error('查询角色信息失败!')
      }
      console.log(res.data.role)
      this.editForm = res.data.role
      this.editDialogVisible = true
    },
    // 添加角色
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.post('/api/role/add', this.role)
        console.log(res)
        if (!res.success) return this.$message.error('添加角色权限失败！')
        this.addDialogVisible = false
        this.getRoles()
        this.$message.success('添加角色权限成功！')
      })
    },
    // 提交修改角色的信息
    editRole() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.post(
          '/api/role/edit',
          this.editForm
        )
        if (!res.success) return this.$message.error('修改角色信息失败！')
        this.editDialogVisible = false
        this.getRoles()
        this.$message.success('修改角色信息成功！')
      })
    },
    // 删除角色
    async removeRole(id) {
      const confirmResult = await this.$confirm(
        '是否永久删除该角色?',
        '删除角色',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      // 点击确认，返回值为字符串 confirm
      // 点击删除，返回值为字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.get('/api/role/delete', {
        params: { id: id }
      })
      console.log(res)
      if (!res.success) return this.$message.error(res.msg)
      this.getRoles()
      this.$message.success(res.msg)
    },
    showRightDialog(id) {
      this.roleId = id
      const roleIdIndex = this.rolePermissions.findIndex((item) => {
        return item.roleId == id
      })
      this.$http.get('/api/permission/tree').then((res) => {
        this.rightList = res.data.data.tree
        console.log(roleIdIndex)
        if (roleIdIndex != -1) {
          this.defKeys =
            this.rolePermissions[roleIdIndex].permissionIds.split(',')
          console.log(this.defKeys)
        }
      })
      this.ShowRightDialogVisible = true
    },
    // 监听添加角色对话框关闭清除数据
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 监听分配权限对话框的关闭事件
    rightDialogClosed() {
      this.defKeys = []
    },
    // 确认分配权限的事件
    async assignmentRight() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedNodes()
      ]
      console.log(keys.join())
      const { data: res } = await this.$http.post('/api/rolePermission/edit', {
        createTime: '',
        id: 0,
        permissionIds: keys.join(),
        roleId: this.roleId,
        updateTime: ''
      })
      console.log(res)
      if (!res.success) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRoles()
      this.getRolePermission()
      this.ShowRightDialogVisible = false
    }
  }
}
</script>

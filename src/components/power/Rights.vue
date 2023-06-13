<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="addDialogVisible = true"
          ><el-icon><Plus /></el-icon>
          <span style="vertical-align: middle"> 添加权限 </span></el-button
        >
      </el-row>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="description"
          label="权限名称"
          width="100"
        ></el-table-column>
        <el-table-column prop="url" label="路径"></el-table-column>
        <el-table-column prop="type" label="类别" width="100"></el-table-column>
        <el-table-column prop="level" label="权限等级" width="85">
          <template v-slot="slotProps">
            <el-tag effect="plain" v-if="slotProps.row.hasChildren === 1"
              >一级</el-tag
            >
            <el-tag effect="plain" type="success" v-else>二级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pid" label="父级权限" width="95" align="center">
          <template v-slot="slotProps">
            <el-tag effect="plain" v-if="slotProps.row.pid === 8"
              >学校管理</el-tag>
            <el-tag effect="plain" v-if="slotProps.row.pid === 6"
              >专业管理</el-tag>
              <el-tag effect="plain" v-if="slotProps.row.pid === 36"
              >用户管理</el-tag>
              <el-tag effect="plain" v-if="slotProps.row.pid === 35"
              >api管理</el-tag>
              <el-tag effect="plain" v-if="slotProps.row.pid === 34"
              >内容管理</el-tag>
            <el-tag effect="plain" type="success" v-if="slotProps.row.pid === 0">无</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="140">
          <template v-slot="slotProps">
            <el-tooltip content="修改权限" placement="top">
              <el-button
                type="primary"
                @click="showEditDialog(slotProps.row.id)"
              >
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="删除权限" placement="top">
              <el-button
                type="danger"
                @click="removePermission(slotProps.row.id)"
              >
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="添加新权限"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addFormRef"
        :model="permission"
        :rules="FormRules"
        label-width="80px"
      >
        <el-form-item label="权限名称" prop="description">
          <el-input v-model="permission.description"></el-input>
        </el-form-item>
        <el-form-item label="父级权限" prop="pid">
          <el-select
            v-model="permission.pid"
            placeholder="请选择父级权限"
          >
            <el-option
              v-for="item in rightsList"
              :key="item.id"
              :label="item.description"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-input v-model="permission.type"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="url">
          <el-input v-model="permission.url"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addPermission"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog v-model="editDialogVisible" title="修改用户信息" width="40%">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="FormRules"
        label-width="80px"
      >
        <el-form-item label="权限名称" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="父级权限" prop="pid">
          <el-select
            v-model="editForm.pid"
            clearable
            placeholder="请选择父级权限"
          >
            <el-option
              v-for="item in rightsList"
              :key="item.id"
              :label="item.description"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-input v-model="editForm.type"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="url">
          <el-input v-model="editForm.url"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editPermission"> 确定 </el-button>
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
      // 获取的权限列表
      rightsList: [],
      // 添加权限的表单
      permission: {
        code: '',
        createTime: '',
        deleted: 0,
        description: '',
        hasChildren: 1,
        id: 0,
        pid: 0,
        type: '',
        updateTime: '',
        url: ''
      },
      editForm: {},
      // 添加权限对话框的显示与隐藏
      addDialogVisible: false,
      // 修改权限对话框的显示与隐藏
      editDialogVisible: false,
      FormRules: {
        description: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        pid: [
          {
            required: true,
            message: '请输入父级默认0是顶级管理',
            trigger: 'blur'
          }
        ],
        type: [{ required: true, message: '请输入类别', trigger: 'blur' }],
        url: [{ required: true, message: '请输入路径', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('/api/permission/all')
      console.log(res)
      if (!res.success) return this.$message.error('获取权限列表失败！')
      FormatTime(res.data.permissions, 'createTime')
      this.rightsList = res.data.permissions
    },
    // 获取修改用户的信息
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/api/permission/one', {
        params: { id: id }
      })
      console.log(id)
      if (!res.success) {
        return this.$message.error('查询权限信息失败!')
      }
      console.log(res.data.permission)
      this.editForm = res.data.permission
      this.editDialogVisible = true
    },
    // 添加权限
    addPermission() {
      // 表单提交预验证
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return false
        // 生成随机id
        const permissionId = Math.floor(Math.random() * (100000 - 1 + 1)) + 1
        const permissionCode = Math.floor(Math.random() * (1000 - 1 + 1)) + 1
        this.permission.id = permissionId
        this.permission.code = permissionCode
        const { data: res } = await this.$http.post(
          '/api/permission/add',
          this.permission
        )
        console.log(res, this.permission)
        if (!res.success) return this.$message.error('添加权限失败！')
        this.addDialogVisible = false
        this.getRightsList()
        this.$message.success('添加权限成功！')
      })
    },
    // 监听添加权限对话框关闭清除数据
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 提交修改用户的信息
    editPermission() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.post(
          '/api/permission/edit',
          this.editForm
        )
        if (!res.success) return this.$message.error('修改用户信息失败！')
        this.editDialogVisible = false
        this.getRightsList()
        this.$message.success('修改用户信息成功！')
      })
    },
    // 删除权限
    async removePermission(id) {
      const confirmResult = await this.$confirm(
        '是否永久删除该权限?',
        '删除权限',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      // 点击确认，返回值为字符串 confirm
      // 点击删除，返回值为字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.get('/api/permission/delete', {
        params: { id: id }
      })
      console.log(res)
      if (!res.success) return this.$message.error(res.msg)
      this.getRightsList()
      this.$message.success('删除权限成功')
    }
  }
}
</script>

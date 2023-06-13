<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row>
        <div class="search">
            <el-input
              v-model.trim="searchStr"
              placeholder="请输入搜索内容"
              class="input-with-select"
              width="200px"
              @blur="userinfoAll"
            >
              <template #append>
                <el-button @click="userinfoSearch">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
        <el-button type="primary" @click="addDialogVisible = true"
          ><el-icon><Plus /></el-icon>
          <span style="vertical-align: middle"> 添加用户 </span></el-button
        >
      </el-row>
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="userType" label="类别" width="100">
        </el-table-column>
        <el-table-column prop="state" label="状态" width="80">
          <template v-slot="slotProps">
            <div>
              <el-icon style="color: #67c23a" v-if="slotProps.row.state == 1"
                ><CircleCheck
              /></el-icon>
              <el-icon style="color: #f56c6c" v-else><CircleClose /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="175">
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="slotProps">
            <el-tooltip content="修改用户" placement="top">
              <el-button
                type="primary"
                @click="showEditDialog(slotProps.row.id)"
              >
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="删除用户" placement="top">
              <el-button type="danger" @click="removeUser(slotProps.row.id)">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top">
              <el-button type="warning" @click="showAssignRole(slotProps.row)">
                <el-icon><Setting /></el-icon>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current"
        :page-sizes="[1, 2, 5, 10, 20, 50]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="添加新用户"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addFormRef"
        :model="userinfo"
        :rules="addFormRules"
        label-width="80px"
      >
      <el-form-item label="id">
          <el-input v-model="userinfo.id"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userinfo.userName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userinfo.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userinfo.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="userType">
          <el-input v-model="userinfo.userType"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addUserInfo"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="修改用户信息"
      width="40%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="userType">
          <el-input v-model="editForm.userType"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editUserInfo"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      v-model="roleDialogVisible"
      @close="roleDialogClosed"
      title="分配角色"
      width="40%"
    >
      <div>
        <p>当前用户：{{ this.assignRole_userinfo.userName }}</p>
        <p>
          当前用户类别：{{
            this.assignRole_userinfo.userType
              ? this.assignRole_userinfo.userType
              : '无'
          }}
        </p>
      </div>
      <el-select v-model="selectRoleId" placeholder="请选择角色">
        <el-option
          v-for="item in roleList"
          :key="item.id" 
          :label="item.description"
          :value="item.id"
          :disabled="!item.status"
        />
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="assignmentRole"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import FormatTime from '@/renderTime'
export default {
  data() {
    // 自定义用户名规则
    var checkUsername = (rule, value, callback) => {
      var regUsername = /^[0-9a-zA-Z_]{3,16}$/
      if (!regUsername.test(value)) {
        return callback(new Error('请输入合法用户名'))
      }
      callback()
    }
    // 自定义类别规则
    var checkType = (rule, value, callback) => {
      var regType = /^学生|教师|教辅|管理员$/
      if (!regType.test(value)) {
        return callback(new Error('类别分为学生,教师,教辅,管理员'))
      }
      callback()
    }
    // 自定义密码规则
    var checkPwd = (rule, value, callback) => {
      var regPwd = /^[0-9a-zA-Z]{6,16}$/
      if (!regPwd.test(value)) return callback(new Error('请输入合法密码'))
      callback()
    }
    return {
      searchStr: '',
      // 获取用户列表的参数对象
      queryInfo: {
        colums: [],
        // 当前页数
        current: 1,
        // 当前每页显示多少条数据
        size: 20
      },
      // 用户列表
      userlist: [],
      // 角色列表
      roleList: [],
      // 分配角色选中的角色id
      selectRoleId: '',
      // userId: '',
      total: 0,
      // 添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 分配角色对话框的显示与隐藏
      roleDialogVisible: false,
      userinfo: {
        binding: 0,
        createTime: '',
        deleted: 0,
        email: '',
        id: 0,
        mobile: '',
        password: '',
        state: 1,
        token: '',
        updateTime: '',
        userName: '',
        userType: ''
      },
      // 待分配的角色信息
      assignRole_userinfo: {},
      addFormRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 16, message: '用户名的长度为3-16位', trigger: 'blur' },
          { validator: checkUsername, trigger: 'blur' }
        ],
        userType: [
          { required: true, message: '请输入类别', trigger: 'blur' },
          { validator: checkType, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 16, message: '密码的长度为8-16位', trigger: 'blur' },
          { validator: checkPwd, trigger: 'blur' }
        ]
      },
      editForm: {},
      editFormRules: {
        userName: [
          { required: false, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 16, message: '用户名的长度为3-16位', trigger: 'blur' },
          { validator: checkUsername, trigger: 'blur' }
        ],
        email: [{ required: false, message: '请输入邮箱', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 16, message: '密码的长度为8-16位', trigger: 'blur' },
          { validator: checkPwd, trigger: 'blur' }
        ],
        userType: [
          { required: false, message: '请输入类别', trigger: 'blur' },
          { validator: checkType, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.post(
        '/api/userinfo/page',
        this.queryInfo
      )
      console.log(res)
      if (!res.success) return this.$message.error('获取用户列表信息失败!')
      const data = res.data.page
      FormatTime(data.records, 'createTime')
      this.userlist = data.records
      this.total = data.total
    },
    // 监听每页显示个数
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.size = newSize
      this.getUserList()
    },
    // 监听页数改变
    handleCurrentChange(newPage) {
      this.queryInfo.current = newPage
      this.getUserList()
    },
    // 监听添加用户对话框关闭清除数据
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 获取修改用户的信息
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/api/userinfo/one', {
        params: { id: id }
      })
      console.log(id)
      if (!res.success) {
        return this.$message.error('查询用户信息失败!')
      }
      console.log(res.data.userinfo)
      this.editForm = res.data.userinfo
      this.editDialogVisible = true
    },
    // 添加用户
    addUserInfo() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.get(
        '/api/userinfo/all'
      )
      console.log(res)
      if (!res.success) return this.$message.error('获取用户列表信息失败!')
      const flag = res.data.userinfos.findIndex(item => {
        return item.id == this.userinfo.id || item.userName == this.userinfo.userName
      })
      console.log(flag);
      if(flag != -1) {
        return this.$message.error('用户id重复或用户名重复')
      }
        const { data: res2 } = await this.$http.post(
          '/api/userinfo/add',
          this.userinfo
        )
        console.log(res2)
        if (!res2.success) return this.$message.error('添加用户信息失败！')
        this.addDialogVisible = false
        this.getUserList()
        this.$message.success('添加用户信息成功！')
      })
    },
    // 提交修改用户的信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.post(
          '/api/userinfo/edit',
          this.editForm
        )
        if (!res.success) return this.$message.error('修改用户信息失败！')
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改用户信息成功！')
      })
    },
    // 用户删除事件
    async removeUser(id) {
      const confirmResult = await this.$confirm(
        '是否永久删除该用户?',
        '删除用户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      // 点击确认，返回值为字符串 confirm
      // 点击删除，返回值为字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.get('/api/userinfo/delete', {
        params: { id: id }
      })
      console.log(res)
      if (!res.success) return this.$message.error(res.msg)
      this.getUserList()
      this.$message.success(res.msg)
    },
    // 显示分配角色对话框事件
    async showAssignRole(userinfo) {
      this.assignRole_userinfo = userinfo
      const { data: res2 } = await this.$http.get('/api/role/all')
      if (!res2.success) return this.$message.error('获取角色列表失败!')
      const data = res2.data.roles
      this.roleList = data
      console.log(this.roleList)
      // 显示对话框前先查询获取当前选择用户是否以分配角色
      const { data: res } = await this.$http.get(
        '/api/userRole/getRoleIdsByUserId',
        { params: { userId: userinfo.id } }
      )
      console.log(res)
      if (res.success) {
        console.log(typeof res.data.roleIds)
        this.selectRoleId = Number(res.data.roleIds)
      }
      this.roleDialogVisible = true
    },
    // 确认提交分配角色事件
    async assignmentRole() {
      const { data: res } = await this.$http.post(
        '/api/userRole/saveOrUpdate',
        {
          createTime: '',
          id: 0,
          roleIds: this.selectRoleId,
          updateTime: '',
          userId: this.assignRole_userinfo.id
        }
      )
      if (!res.success) return this.$message.error('用户分配角色失败!')
      console.log(res)
      this.$message.success('分配角色成功')
      this.roleDialogVisible = false
    },
    // 分配角色对话框关闭事件
    roleDialogClosed() {
      this.selectRoleId = ''
    },
    // 根据id查询用户
    async userinfoSearch() {
      const { data: res } = await this.$http.get('/api/userinfo/one', {
        params: { id: this.searchStr }
      })
      console.log(res);
      if (!res.success) {
        return this.$message.error('查询用户信息失败，用户不存在!')
      }
      console.log(this.userlist ,res.data);
      this.userlist = [res.data.userinfo]
    },
    userinfoAll() {
      console.log(this.searchStr);
      if (!this.searchStr) {
        this.getUserList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  margin-right: 20px;
}
</style>
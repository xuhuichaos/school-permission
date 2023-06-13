<template>
  <div class="common-layout">
    <!-- <el-container>
      <el-header>
        <div class="logo">
            <span>后台管理</span>
          </div>
          <div class="search">
            <el-input
              v-model="searchStr"
              placeholder="请输入搜索内容"
              class="input-with-select"
              width="200px"
            >
              <template #append>
                <el-button>
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
        </el-header>
      <el-container>
          <el-aside width="200px">
        <el-menu
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          default-active="2"
          text-color="#fff"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="/home/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/home/roles">
            <el-icon><View /></el-icon>
            <span>角色管理</span>
          </el-menu-item>
          <el-menu-item index="/home/rights">
            <el-icon><setting /></el-icon>
            <span>权限管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container> -->
    <el-container>
      <el-aside width="200px">
        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" default-active="2"
          text-color="#fff" @open="handleOpen" @close="handleClose">
          <div class="logo">
            <span>后台管理</span>
          </div>
          <el-menu-item index="/home/users" @click="handleMenuItemClick('/home/users')">
            <el-icon>
              <User />
            </el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/home/roles" @click="handleMenuItemClick('/home/roles')">
            <el-icon>
              <View />
            </el-icon>
            <span>角色管理</span>
          </el-menu-item>
          <el-menu-item index="/home/rights" @click="handleMenuItemClick('/home/rights')">
            <el-icon>
              <setting />
            </el-icon>
            <span>权限管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'HoMe',
  data() {
    return {
      searchStr: ''
    }
  },
  methods: {
    handleMenuItemClick(path) {
      this.$router.push(path);
    },
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    handleOpen(key, keyPath) {
      this.$router.push(key)
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  },
  created() {
    document.title = '权限管理';
  }
}
</script>

<style lang="less" scoped>
.common-layout {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #cdcdcd;
}

.search {
  width: 30%;
  line-height: 60px;
  float: right;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  overflow-x: hidden;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

.el-container {
  height: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  padding-top: 20px;
}

/deep/ .el-menu--collapse {
  height: 100%;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}

.el-radio-button:first-child .el-radio-button__inner {
  border: 0;
  border-left: 0;
  padding: 10px 25px 0;
}
</style>

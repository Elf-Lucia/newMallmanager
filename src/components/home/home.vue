<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4"><img src="../../assets/logo.png" alt="" /> </el-col>
        <el-col :span="16"><h2>电商管理平台</h2></el-col>
        <el-col :span="4" class="exit"
          ><a href="javascript:;" @click.prevent="handleExit()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside">
        <!-- 侧边栏导航el-menu -->
        <el-menu :unique-opened="false" :router="true">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">用户管理</span>
            </template>
            <el-menu-item index="user">
              <i class="el-icon-location"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 权限管理 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span slot="title">权限管理</span>
            </template>
            <el-menu-item index="roles">
              <i class="el-icon-location"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="rights">
              <i class="el-icon-location"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 商品管理 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-location"></i>
              <span slot="title">商品列表</span>
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-location"></i>
              <span slot="title">分类参数</span>
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-location"></i>
              <span slot="title">商品分类</span>
            </el-menu-item>
          </el-submenu>
          <!-- 订单管理 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-help"></i>
              <span slot="title">订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-location"></i>
              <span slot="title">订单列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 数据统计 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-data"></i>
              <span slot="title">数据统计</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-location"></i>
              <span slot="title">数据报表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  beforeCreate() {
    //在组件出现之前获取token，有就渲染组件
    let token = localStorage.getItem("token");
    if (!token) {
      this.$router.push({ name: "login" });
    }
  },
  mounted() {},
  methods: {
    // 退出
    handleExit() {
      if (confirm("您确认退出吗")) {
        localStorage.clear("token");
        this.$message("退出成功");
        this.$router.push({ name: "login" });
      }
    },
  },
};
</script>

<style scoped>
.container {
  margin: 0;
  padding: 0;
  height: 100%;
}
.header {
  background-color: #b3c0d1;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.header img {
  text-align: left;
  vertical-align: middle;
  height: 60px;
}
.header .exit {
  text-align: right;
  text-decoration: none;
  color: black;
}
.aside {
  width: 200px;
  background-color: #d3dce6;
}
.aside ul {
  height: calc(100vh - 150px);
}
.main {
  background-color: #e9eef3;
  padding: 10px;
}
</style>
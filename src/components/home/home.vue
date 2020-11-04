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
        <el-menu :router="true">
          <el-submenu
            :index="item1.order + ''"
            v-for="(item1, index) in ulList"
            :key="index"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">{{ item1.authName }}</span>
            </template>
            <el-menu-item
              :index="item2.path"
              v-for="(item2, i) in item1.children"
              :key="i"
            >
              <i class="el-icon-location"></i>
              <span slot="title">{{ item2.authName }}</span>
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
    return {
      ulList: [],
    };
  },
  beforeCreate() {
  
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 退出
    handleExit() {
      if (confirm("您确认退出吗")) {
        localStorage.clear("token");
        this.$message("退出成功");
        this.$router.push({ name: "login" });
      }
    },
    //左侧导航菜单
    async getList() {
      const res = await this.$http.get(`menus`);
      this.ulList = res.data;
      // console.log(res);
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

.main {
  background-color: #e9eef3;
  padding: 10px;
}
</style>
<template>
  <el-card class="box-card">
    <!-- 导航 首页/用户管理/用户列表-->
    <el-breadcrumb separator="/" class="user">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-input
      placeholder="请输入内容"
      class="input-with-select input-text"
      v-model="query"
    >
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <!-- 添加 -->
    <el-button type="success" plain class="add">添加用户</el-button>
    <!-- 表格展示 -->
    <el-table :data="tableData" class="list-table" stripe style="width: 100%">
      <el-table-column prop="id" label="#" width="40" type="index">
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="100"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="create_time" label="创建日期"> </el-table-column>
      <el-table-column label="用户状态">
        <el-switch
          v-model="value"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="small"
          circle
        ></el-button>
        <el-button
          type="success"
          icon="el-icon-check"
          size="small"
          circle
        ></el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          circle
        ></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="pagenum"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      query: "",
      value: true,
      pageSize: 1,
      pagenum: 1,
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      let AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pageSize}`
      );
      console.log(res)
      const { data, meta } = res;
      this.tableData = data.users;
    },
  },
};
</script>

<style scoped>
.input-text {
  width: 35%;
  margin: 10px 0;
}
.add {
  margin: 0 5px;
}
.list-table {
  margin: 10px;
}
</style>
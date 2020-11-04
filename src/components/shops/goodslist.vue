<template>
  <el-card class="box-card">
    <!-- 导航 首页/用户管理/用户列表-->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 搜索 -->
    <el-input
      placeholder="请输入内容"
      class="input-with-select input-text"
      v-model="query"
      @input="searchUser()"
      clearable
      @clear="clearInput()"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="searchUser()"
      ></el-button>
    </el-input>
    <!-- 添加 -->
    <el-button
      type="success"
      plain
      class="add"
      @click="$router.push({ name: 'goodsadd' })"
      >添加商品</el-button
    >
    <!-- 表格展示 -->
    <el-table
      :data="goodsList"
      class="list-table"
      stripe
      v-loading="loading"
      style="width: 100%; min-height: 500px"
      height="250"
    >
      <el-table-column prop="id" label="#" width="40" type="index">
      </el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="280">
      </el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)">
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"> </el-table-column>
      <el-table-column prop="add_time" label="创建日期">
        <template slot-scope="goodsList">
          {{ goodsList.row.add_time | frmdate }}
        </template>
      </el-table-column>

      <el-table-column prop="address" label="操作">
        <template>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            plain
            circle
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="small"
            plain
            circle
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            plain
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      //查询的数据
      query: "",
      // 分页相关的数据
      pagesize: 5,
      pagenum: 1,
      total: -1,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      loading: "true",
      formLabelWidth: "120px",
      currentRoleId: -1,
      currentUserName: "",
      currentUserId: -1,
      //保存所有的角色数据
      roles: [],
    };
  },
  mounted() {
    this.getgoodsList();
  },
  computed: {},
  methods: {
    //删除按钮
    deleteUser(id) {
      //---打开一个消息盒子confirm
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${id}`);
          this.$message({
            type: "success",
            message: res.meta.msg,
          });
          this.pagenum = 1;
          this.getgoodsList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //清空搜索框触发
    clearInput() {
      this.getgoodsList();
    },
    // 搜索用户
    searchUser() {
      //按照query进行搜索
      this.getgoodsList();
    },
    //分页
    handleSizeChange(val) {
      //每页条数改变时会触发
      this.pagesize = val;
      this.getgoodsList(); //重新获取数据
      // console.log(`每页 ${val} 条`, this.pagesize);
    },
    handleCurrentChange(val) {
      //当前页改变时发生变化
      this.pagenum = val;
      this.getgoodsList(); //重新获取数据
      // console.log(`当前页: ${val}`, this.pagenum);
    },
    //获取用户列表数据
    async getgoodsList() {
      // let AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      // console.log(res);
      const {
        data: { goods, total },
        meta: { status, msg },
      } = res;
      if (status === 200) {
        this.loading = false;
        this.goodsList = goods;
        this.total = total;

        this.$message.success(msg);
      }
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
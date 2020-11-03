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
      @click="dialogFormVisibleAdd = true"
      >添加用户</el-button
    >
    <!-- 表格展示 -->
    <el-table
      :data="userlist"
      class="list-table"
      stripe
      style="width: 100%; min-height: 500px"
      height="250"
    >
      <el-table-column prop="id" label="#" width="40" type="index">
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="100">
      </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="create_time" label="创建日期">
        <!-- 如果单元格内显示的内容不是字符串，需要给被显示的内容包裹一层template -->
        <!-- template和el-table-column是两个标签，要在template标签里面使用外面标签的数据
        需要加slot-scope属性，该属性的值要使用数据的数据源userlist
        ->userlist.row指的是数组中的每个对象
         -->
        <template slot-scope="userlist">
          {{ userlist.row.create_time | frmdate }}
        </template>
      </el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="editState(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            plain
            circle
            @click="showEditDia(scope.row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="small"
            plain
            circle
            @click="addRoleDia(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            plain
            circle
            @click="deleteUser(userlist.row.id)"
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
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth" required>
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" required>
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth" required>
          <el-input
            v-model="form.username"
            disabled
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="EditUser(form.id)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth" required>
          {{ currentUserName }}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          {{ currentRoleId }}
          <el-select v-model="currentRoleId">
            <el-option label="请选择" value="-1"></el-option>

            <el-option
              :label="item.roleName"
              v-for="(item, i) in roles"
              :value="item.id"
              :key="i"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      userlist: [],
      //查询的数据
      query: "",
      // 分页相关的数据
      pageSize: 5,
      pagenum: 1,
      total: -1,
      //添加用户对话框
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      formLabelWidth: "120px",
      currentRoleId: -1,
      currentUserName: "",
      currentUserId:-1,
      //保存所有的角色数据
      roles: [],
    };
  },
  mounted() {
    this.getUserList();
  },
  computed: {},
  methods: {
    //分配角色的提交按钮
    async setRole() {

      this.dialogFormVisibleRole = false;
      const resultSet = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.currentRoleId,
      });
     const {
        data: { rid },
        meta: { status, msg },
      } = resultSet;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    //分配角色对话框
    async addRoleDia(user) {
      console.log(user, '')
      this.dialogFormVisibleRole = true;
      this.currentUserName = user.username;
      //获取所有的角色roles
      const resRole = await this.$http.get(`roles`);
      this.roles = resRole.data;

      //获取到当前用户的角色id->rid
      const resultId = await this.$http.get(`users/${user.id}`);
      //打开对话框给currentUserId赋值
      this.currentUserId=user.id
      const {
        data: { rid },
        meta: { status, msg },
      } = resultId;
      if (status === 200) {
        this.currentRoleId = rid;
      } else {
        this.$message.error(msg);
      }
    },

    //修改用户状态
    async editState(user) {
      // console.log(uId, type);
      const result = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      const {
        data,
        meta: { status, msg },
      } = result;
      if (status === 200) {
        this.$message.success(msg);
        this.getUserList();
      } else {
        this.$message.error(msg);
      }
    },
    //编辑用户
    async showEditDia(user) {
      this.dialogFormVisibleEdit = true;
      this.form = user;
    },
    //编辑用户点击提交确认按钮
    async EditUser(userId) {
      this.dialogFormVisibleEdit = false;
      const result = await this.$http.put(`users/${userId}`, this.form);
      const {
        data,
        meta: { status, msg },
      } = result;
      // console.log(result, '')
      if (status === 200) {
        this.$message.success(msg);
        this.getUserList();
      } else {
        this.$message.error(msg);
      }
    },
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
          this.getUserList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //添加用户的弹出框确认
    async addUser() {
      this.dialogFormVisibleAdd = false;
      if (this.form.username.length == 0 || this.form.password.length === 0) {
        // alert("用户名或密码必填");
        this.dialogFormVisibleAdd = true;
      }
      const res = await this.$http.post(`users`, this.form);
      const {
        data,
        meta: { status, msg },
      } = res;
      if (status === 201) {
        this.$message.success(msg);
        this.getUserList();
      } else {
        this.$message.error(msg);
      }
      // 清空文本框
      // this.form = {};
      for (const key in this.form) {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = "";
        }
      }
    },
    //清空搜索框触发
    clearInput() {
      this.getUserList();
    },
    // 搜索用户
    searchUser() {
      //按照query进行搜索
      this.getUserList();
    },
    //分页
    handleSizeChange(val) {
      //每页条数改变时会触发
      this.pageSize = val;
      this.pagenum = 1;
      this.getUserList(); //重新获取数据
      // console.log(`每页 ${val} 条`, this.pageSize);
    },
    handleCurrentChange(val) {
      //当前页改变时发生变化
      this.pagenum = val;
      this.getUserList(); //重新获取数据
      // console.log(`当前页: ${val}`, this.pagenum);
    },
    //获取用户列表数据
    async getUserList() {
      let AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pageSize}`
      );
      // console.log(res);
      const {
        data: { users, total },
        meta: { status, msg },
      } = res;
      if (status === 200) {
        this.userlist = users;
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
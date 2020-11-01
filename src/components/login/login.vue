<template>
  <div class="login-wrap">
    <el-form
      label-position="top"
      label-width="80px"
      :model="formData"
      class="login-form"
    >
      <h3>用户登录</h3>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password"></el-input>
      </el-form-item>
      <el-button type="primary" @click="handleLogin()" class="login-button"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    //登录请求

    async handleLogin() {
      let result = await this.$http.post("login", this.formData);
      const {
        data,
        meta: { msg, status },
      } = result;
      if (status === 200) {
        this.$router.push({ name: "home" });
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
  },
};
</script>

<style scoped>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}
.login-wrap .login-form .login-button {
  width: 100%;
}
</style>
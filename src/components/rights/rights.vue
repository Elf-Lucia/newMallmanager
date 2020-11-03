<template>
  <el-card class="box-card bord">
    <div slot="header" class="clearfix">
      <!-- 导航 -->
      <my-bread level1='权限管理' level2='权限列表'></my-bread>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="#" width="40" type="index">
      </el-table-column>
      <el-table-column prop="name" label="权限名称" width="180">
      </el-table-column>
      <el-table-column prop="address" label="层级"> </el-table-column>
      <el-table-column prop="address" label="路径"> </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import myBread from "../cuscom//bread.vue";
export default {
  data() {
    return {
      tableData: [],
      type: "list",
    };
  },
  components: {
    myBread,
  },
  created() {
    this.getData();
  },

  methods: {
    async getData() {
      const dataList = await this.$http.get(`rights?type=${this.type}`);
      console.log(dataList);
    },
  },
};
</script>

<style scoped>
.bord {
  min-height: calc(100vh - 85px);
}
</style>
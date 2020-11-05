<template>
  <el-card class="box-card bord">
    <div slot="header" class="clearfix">
      <!-- 导航 -->
      <my-bread level1="订单管理" level2="订单列表"></my-bread>
    </div>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column label="#" type="index"> </el-table-column>
      <el-table-column label="订单编号" prop="order_number"> </el-table-column>
      <el-table-column label="订单价格" prop="order_price"> </el-table-column>
      <el-table-column label="是否付款">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status === '0'">已付款</el-tag>
          <el-tag v-else-if="scope.row.pay_status !== '0'" type="danger"
            >未付款</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"> </el-table-column>
      <el-table-column label="下单时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | frmdate }}
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
            @click="handleEditOrder(scope.row)"
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
    <!-- 编辑订单 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="省市区" :label-width="formLabelWidth">
          <el-cascader :options="city" v-model="selectedOptions"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editOrder(form.id)">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
// 导入城市数据
import city from "../../assets/city.js";
export default {
  data() {
    return {
      list: [],
      query: "",
      pagenum: 1,
      pageSize: 10,
      total: 1,
      formLabelWidth: "120px",
      dialogFormVisibleEdit: false,
      form: {
        address: "",
      },
      city: [],
      selectedOptions: [],
    };
  },
  created() {
    this.getOrder();
  },

  methods: {
    //   点击提交按钮
    editOrder() {},
    //   点击编辑按钮
    handleEditOrder() {
      this.dialogFormVisibleEdit = true;
      //   给省市区赋值
      this.city = city;
    },
    //改变分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getOrder();
    },

    handleCurrentChange(val) {
      this.pagenum = val;
      this.getOrder();
    },

    //获取订单列表
    async getOrder() {
      const list = await this.$http.get(
        `orders?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pageSize}`
      );
      this.list = list.data.goods;
      this.total = list.data.total;
      console.log(list);
    },
  },
};
</script>

<style scoped>
.bord {
  min-height: calc(100vh - 85px);
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.mt {
  margin-bottom: 5px;
}
.ml {
  margin: 0 5px 5px;
}
</style>
<template>
  <el-card class="box-card">
    <!-- 导航 首页/用户管理/用户列表-->
    <my-bread level1="商品管理" level2="分类参数" class="type"></my-bread>
    <!-- 提示 -->
    <el-alert
      title="只允许为第三级分类设置参数"
      type="warning"
      class="tip"
      show-icon
      center
      v-if="this.selectdOptions.length !== 3"
    >
    </el-alert>
    <el-row>
      <el-col :span="24">
        <!-- 级联选择器 -->
        <span>商品分类</span>
        {{ selectdOptions }}
        <el-cascader
          v-model="selectdOptions"
          :show-all-levels="false"
          :options="options"
          :props="props"
          @change="handleChange"
        ></el-cascader>
      </el-col>
    </el-row>
    <!-- tab -->
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
      class="tab"
    >
      <el-tab-pane label="动态参数" name="first">
        <el-button type="primary">设置动态参数</el-button>
        <el-table :data="dynamicsParams" style="width: 100%">
          <el-table-column type="expand" label="#">
            <template slot-scope="scope">
              <el-tag
                :key="tag"
                v-for="tag in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row, tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
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
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="second">
        <el-button type="primary">设置静态参数</el-button>
        <el-table :data="staticParams" style="width: 100%">
          <el-table-column label="#" type="index"> </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
          <el-table-column label="属性值" prop="attr_vals"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
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
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 级联选择器绑定的数据
      props: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      options: [], //绑定的数据源
      selectdOptions: [], //最终选择的label对应的value会出现在这里
      // tab选中的
      activeName: "first",
      //动态参数
      dynamicsParams: [],
      //静态参数
      staticParams: [],
      inputVisible: false,
      inputValue: "",
    };
  },
  mounted() {
    this.getCatoriesList();
  },
  methods: {
    //切换tab
    async handleClick() {
      //获取静态参数
      if (this.selectdOptions.length === 3 && this.activeName === "second") {
        //发送请求，获取静态参数
        const res = await this.$http.get(
          `categories/${this.selectdOptions[2]}/attributes?sel=only`
        );
        console.log(res);
        const {
          data,
          meta: { status, msg },
        } = res;
        if (status === 200) {
          this.staticParams = data;
          this.$message.success(msg);
        }
      }
    },
    //删除tag触发
    async handleClose(attrVals, tag) {
      //要先改数组
      attrVals.attr_vals.splice(attrVals.attr_vals.indexOf(tag), 1);
      //发送请求，删除动态参数
      /**
       * attr_name参数名称不能为空
       * attr_sel[only,many]不能为空
       * attr_vals
       */
      let putData = {
        attr_name: attrVals.attr_name,
        attr_sel: "many",
        attr_vals: attrVals.attr_vals.join(","),
      };
      const res = await this.$http.put(
        `categories/${this.selectdOptions[2]}/attributes/${attrVals.attr_id}`,
        putData
      );
      console.log(res);
    },

    // 点击input框触发
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async handleInputConfirm(attrVals) {
      let inputValue = this.inputValue;
      if (inputValue) {
        attrVals.attr_vals.push(inputValue);
        //发送请求添加参数
        let putData = {
          attr_name: attrVals.attr_name,
          attr_sel: "many",
          attr_vals: attrVals.attr_vals.join(","),
        };
        const res = await this.$http.put(
          `categories/${this.selectdOptions[2]}/attributes/${attrVals.attr_id}`,
          putData
        );
        console.log("cat", res);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    //选择级联选择器
    async handleChange() {
      if (this.selectdOptions.length === 3) {
        //发送请求，获取动态参数
        const res = await this.$http.get(
          `categories/${this.selectdOptions[2]}/attributes?sel=many`
        );
        // console.log(res);
        const {
          data,
          meta: { status, msg },
        } = res;
        if (status === 200) {
          this.dynamicsParams = data;
          // 把数组中的attr_vals这个字符串变成数组
          this.dynamicsParams.forEach((item) => {
            item.attr_vals.length === 0
              ? []
              : (item.attr_vals = item.attr_vals.trim().split(","));
          });

          this.$message.success(msg);
        }
      }
    },
    //获取三级分类数据
    async getCatoriesList() {
      // let AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      const {
        data,
        meta: { status, msg },
      } = res;
      if (status === 200) {
        this.options = data;
        this.$message.success(msg);
      }
    },
  },
};
</script>

<style scoped>
.tip,
.tab,
.type {
  margin: 15px 0;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
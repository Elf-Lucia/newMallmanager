<template>
  <el-card class="box-card">
    <!-- 导航 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <el-alert
      title="添加商品信息"
      type="success"
      class="tip"
      center
      show-icon
    ></el-alert>
    <!-- 步骤条
     -->
    <el-steps
      class="steps"
      :space="400"
      align-center
      :active="active * 1"
      finish-status="success"
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 表单 -->
    <el-form ref="form" :model="form">
      <el-tabs
        @tab-click="tabChange()"
        class="tabs"
        v-model="active"
        tab-position="left"
      >
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="selectdOptions"
              :options="options"
              :props="props"
              @change="handleChange"
              style="display: block;width30%"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item
            v-for="item1 in dynamicsParams"
            :key="item1.attr_id"
            :label="item1.attr_name"
          >
            {{ item1.attr_vals }}
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox
                :label="item2"
                v-for="(item2, i) in item1.attr_vals"
                :key="i"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item
            :label="item.attr_name"
            v-for="(item, i) in staticParams"
            :key="i"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-upload
            class="upload-demo"
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :headers="headers"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <!-- 点我-添加商品 -->
            <el-button type="primary" @click="addGoods()">添加商品</el-button>
            <!-- 富文本编辑器 -->
            <quillEditor class="editor"></quillEditor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  data() {
    return {
      active: "1",
      // 级联选择器绑定的数据
      props: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      query: "",
      options: [], //绑定的数据源
      selectdOptions: [], //最终选择的label对应的value会出现在这里
      form: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: [], //动态参数和静态参数
      },
      // 三级分类的参数
      dynamicsParams: [],
      checkList: [],
      //静态属性
      staticParams: [],
      // 发送上传图片请求的头部
      headers: {
        ["Authorization"]: localStorage.getItem("token"),
      },
    };
  },
  mounted() {
    this.getCatoriesList();
  },
  components: {
    quillEditor,
  },
  methods: {
    //添加商品
    async addGoods() {
      //发请求前处理this.form中未处理的数据
      this.form.goods_cat = this.selectdOptions.join(","); //级联选择器绑定的数据
      //动态参数+静态属性
      let arr1 = this.dynamicsParams.map((item) => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      let arr2 = this.staticParams.map((item) => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      this.form.attrs = [...arr1, ...arr2];
      const res = await this.$http.post(`goods`, this.form);
      //跳转商品列表页
      this.$router.push({ name: "goods" });
    },
    //图片上传时的相关方法
    // 预览图片触发
    handlePreview(file) {},
    //删除图片触发
    handleRemove(file) {
      // console.log(file);
      //删除的地址的信息，从当前数组中移除x掉的图片地址
      let index = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(index, 1);
      // console.log(this.form.pics);
    },
    //上传图片成功
    handleSuccess(file) {
      // console.log(file);
      this.form.pics.push({
        pic: file.data.tmp_path,
      }); //图片临时存储的路径
    },
    // 点击不同tab时触发该方法
    async tabChange() {
      //点击的第二个tab并且三级分类有值
      if (this.active === "2") {
        if (this.selectdOptions.length !== 3) {
          this.$message.error("请先选择三级分类");
          return;
        } else {
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
              item.attr_vals = item.attr_vals.trim().split(",");
            });

            this.$message.success(msg);
          }
        }
      } else if (this.active === "3") {
        if (this.selectdOptions.length !== 3) {
          this.$message.error("请先选择三级分类");
          return;
        }
        //发送请求，获取静态参数
        const res = await this.$http.get(
          `categories/${this.selectdOptions[2]}/attributes?sel=only`
        );
        // console.log(res);
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
    //级联选择器选择数据发生的方法
    handleChange() {
      //必须选择三级分类，点击第二个tab才会获取数据
      //选择第二个tab时获取参数
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
.tip {
  margin: 5px 0;
  text-align: center;
}
.editor .ql-snow {
  min-height: 300px;
}
</style>
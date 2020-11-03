<template>
  <el-card class="box-card bord">
    <div slot="header" class="clearfix">
      <!-- 导航 -->
      <my-bread level1="权限管理" level2="角色列表"></my-bread>
    </div>
    <el-row>
      <el-col>
        <!-- 添加角色按钮 -->
        <el-button plain @click="addRole()">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="roleList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item, i) in scope.row.children" :key="i" class="mt">
            <el-col :span="4">
              <el-tag closable @close="deleteRight(scope.row, item.id)">{{
                item.authName
              }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2, i) in item.children" :key="i" class="mt">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="success"
                    @close="deleteRight(scope.row, item2.id)"
                    >{{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    v-for="(item3, i) in item2.children"
                    :key="i"
                    closable
                    class="ml"
                    type="danger"
                    @close="deleteRight(scope.row, item3.id)"
                    >{{ item3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 无权限的提示 -->
          <span v-if="scope.row.children.length === 0">未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column label="#" type="index"> </el-table-column>
      <el-table-column label="角色名称" prop="roleName"> </el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
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
            @click="showSetRightDia(scope.row)"
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
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="dialogTreeVisible">
      <el-tree
        ref="tree"
        :data="treeRight"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrChecked"
        :props="defaultProps"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTreeVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRights()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色Dia -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleRoleAdd">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRoleAdd = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleRoleAdd = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      roleList: [],
      formLabelWidth: "120px",
      dialogFormVisibleRoleAdd: false,
      form: {},
      // 分配权限
      dialogTreeVisible: false,
      treeRight: [],
      defaultProps: {
        label: "authName",
        children: "children",
      },
      // arrexpend: [],
      arrChecked: [],
      currentRoleId: -1,
    };
  },
  created() {
    this.getData();
  },

  methods: {
    showEditDia() {},
    addRoleDia() {},
    //添加角色权限
    async addRights() {
      this.dialogTreeVisible = false;
      // 树形结构中全选的id  arr1  getCheckedKeys
      let arr1 = this.$refs.tree.getCheckedKeys();
      //树形结构中半选的id  arr2   getHalfCheckedKeys
      let arr2 = this.$refs.tree.getHalfCheckedKeys();
      //arr1+arr2
      let arr = [...arr1, ...arr2];

      const treeRight = await this.$http.post(
        `roles/${this.currentRoleId}/rights`,
        {
          rids: arr.join(","), //树形结构中选中或半选的id
        }
      );
      //更新视图
      this.getData()
    },
    //显示设置权限对话框
    async showSetRightDia(role) {
      this.currentRoleId = role.id;
      this.dialogTreeVisible = true;
      const treeRight = await this.$http.get(`rights/tree`);
      this.treeRight = treeRight.data;
      //把所有的权限的id值放在一个数组里，达到全部展开的效果
      // var arrtemp1 = [];
      // this.treeRight.forEach((item1) => {
      //   arrtemp1.push(item1.id);
      //   item1.children.forEach((item2) => {
      //     arrtemp1.push(item2.id);
      //     item2.children.forEach((item3) => {
      //       arrtemp1.push(item3.id);
      //     });
      //   });
      // });
      // this.arrexpend = arrtemp1;
      //获取到当前角色有的权限，并且让其默认勾选
      console.log(role);
      var check = [];
      role.children.forEach((item1) => {
        // check.push(item1.id);
        item1.children.forEach((item2) => {
          // check.push(item2.id);
          item2.children.forEach((item3) => {
            check.push(item3.id);
          });
        });
      });

      // console.log(check);
      this.arrChecked = check;
    },
    //添加角色
    addRole() {
      this.dialogFormVisibleRoleAdd = true;
    },
    // 点击tag删除权限
    async deleteRight(Role, RightId) {
      // console.log(RoleId,RightId);
      const roleList = await this.$http.delete(
        `roles/${Role.id}/rights/${RightId}`
      );
      const {
        data,
        meta: { status, msg },
      } = roleList;
      console.log(roleList);
      if (status === 200) {
        this.$message.success(msg);
        //删除权限成功，只更新当前角色的剩余权限
        // this.getData(); 不需要更新整个表格
        Role.children = data;
      } else {
        this.$message.error(msg);
      }
    },
    //获取角色列表
    async getData() {
      const roleList = await this.$http.get(`roles`);
      this.roleList = roleList.data;
      // console.log(this.roleList);
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
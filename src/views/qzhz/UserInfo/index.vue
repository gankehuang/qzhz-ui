<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <!-- <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="会员名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <!-- <el-form-item label="性别" prop="gender">
        <el-select v-model="queryParams.gender" placeholder="请输入用户性别" clearable size="small">
          <el-option v-for="dict in sexOptions" 
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item> -->

      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['qzhz:UserInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['qzhz:UserInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['qzhz:UserInfo:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['qzhz:UserInfo:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-refresh"
          size="mini"
          @click="handleClearCache"
          v-hasPermi="['system:dict:remove']"
        >清理缓存</el-button>
      </el-col> -->
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="UserInfoList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="用户手机号" align="center" prop="phone" />
      <el-table-column label="成员数量" align="center" prop="memberNum" />
      <el-table-column label="会员姓名" align="center" prop="userinfos">
        <template slot-scope="scope">
          <router-link
            v-for="item in scope.row.userinfos"
            :key="item.mid"
            :to="'/Guarantor/type/data1/' + item.mid"
            class="link-type"
          >
            <span style="margin-right: 5px">{{ item.name }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" prop="createTime" />
      <!-- <el-table-column label="性别" align="center" prop="gender" :formatter="sexFormat" /> -->
      <!-- <template slot-scope="scope">
          <span v-if="scope.row.gender == '1'">男</span>
          <span v-if="scope.row.gender == '2'">女</span>
          <span v-if="scope.row.gender == '0'">未知</span>
        </template>
      </el-table-column> -->

      <el-table-column label="登录次数" align="center" prop="loginNum" />
      <el-table-column
        label="末次登录时间"
        align="center"
        prop="lastLoginTime"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['qzhz:UserInfo:edit']"
          >修改</el-button> -->
          <el-button
            v-if="scope.row.memberNum == 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['qzhz:UserInfo:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改用户信息表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="用户密码" prop="passWord">
          <el-input v-model="form.passWord" placeholder="请输入用户密码" />
        </el-form-item>
        <el-form-item label="手机号/账号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号/账号" />
        </el-form-item>
        <el-form-item label="头像" prop="faceUrl">
          <el-input v-model="form.faceUrl" placeholder="请输入头像" />
        </el-form-item>
        <el-form-item label="用户性别 0-未知；1-男；2-女" prop="gender">
          <el-input
            v-model="form.gender"
            placeholder="请输入用户性别 0-未知；1-男；2-女"
          />
        </el-form-item>
        <el-form-item label="成员数量@@" prop="memberNum">
          <el-input v-model="form.memberNum" placeholder="请输入成员数量@@" />
        </el-form-item>
        <el-form-item label="登录次数@@" prop="loginNum">
          <el-input v-model="form.loginNum" placeholder="请输入登录次数@@" />
        </el-form-item>
        <el-form-item label="末次登录时间@@" prop="lastLoginTime">
          <el-input
            v-model="form.lastLoginTime"
            placeholder="请输入末次登录时间@@"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUserInfo,
  getUserInfo,
  delUserInfo,
  addUserInfo,
  updateUserInfo,
  exportUserInfo,
} from "@/api/qzhz/UserInfo";
import { clearCache } from "@/api/system/dict/type";
export default {
  name: "UserInfo",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户信息表表格数据
      UserInfoList: [],
      sexOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        userName: null,
        passWord: null,
        phone: null,
        faceUrl: null,
        gender: null,
        memberNum: null,
        loginNum: null,
        lastLoginTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_user_sex").then((response) => {
      this.sexOptions = response.data;
    });
  },
  methods: {
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.gender);
    },

    /** 查询用户信息表列表 */
    getList() {
      this.loading = true;
      listUserInfo(this.queryParams).then((response) => {
        this.UserInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        createTime: null,
        updateTime: null,
        userName: null,
        passWord: null,
        phone: null,
        faceUrl: null,
        gender: null,
        memberNum: null,
        loginNum: null,
        lastLoginTime: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户信息表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getUserInfo(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户信息表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateUserInfo(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUserInfo(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.userId || this.ids;
      this.$confirm(
        "删除后将不能登录，重新注册后可继续登录，确认删除该用户吗？",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delUserInfo(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户信息表数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportUserInfo(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
    /** 清理缓存按钮操作 */
    handleClearCache() {
      clearCache().then((response) => {
        this.msgSuccess("清理成功");
      });
    },
  },
};
</script>

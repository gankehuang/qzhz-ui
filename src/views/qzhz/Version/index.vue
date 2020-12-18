<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="版本号" prop="versionNo">
        <el-input
          v-model="queryParams.versionNo"
          placeholder="请输入版本号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否强制升级" prop="isUpgrade">
        <el-input
          v-model="queryParams.isUpgrade"
          placeholder="请输入是否强制升级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['qzhz:Version:add']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['qzhz:Version:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['qzhz:Version:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['qzhz:Version:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="VersionList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="版本号" align="center" prop="versionNo" />
      <el-table-column label="来源" align="center" prop="sourceType" />
      <el-table-column label="版本升级地址" align="center" prop="downloadUrl" />
      <el-table-column label="更新说明" align="center" prop="remark">
        <template slot-scope="scope">
          <div v-html="scope.row.remark"></div>
        </template>
      </el-table-column>

      <el-table-column label="是否强制升级" align="center" prop="isUpgrade">
        <template slot-scope="scope">
          <span>{{ scope.row.isUpgrade == 0 ? "否" : "是" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['qzhz:Version:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['qzhz:Version:remove']"
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

    <!-- 添加或修改版本信息表对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="版本号" prop="versionNo">
          <el-input
            v-model="form.versionNo"
            maxlength="10"
            placeholder="请输入版本号(例：x.x.x)"
          />
        </el-form-item>
        <el-form-item label="来源" prop="sourceType">
          <el-radio-group v-model="form.sourceType">
            <el-radio label="android+ios">android+ios</el-radio>
            <el-radio label="android">android</el-radio>
            <el-radio label="ios">ios</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="版本升级地址" prop="downloadUrl">
          <el-input
            v-model="form.downloadUrl"
            maxlength="200"
            placeholder="请输入更新说明"
          />
        </el-form-item>
        <el-form-item label="更新说明" prop="remark">
          <!-- <el-input v-model="form.remark" maxlength="200" placeholder="请输入更新说明" /> -->
          <editor v-model="form.remark" :min-height="192" />
        </el-form-item>
        <el-form-item label="是否强制升级" prop="isUpgrade">
          <!-- <el-input v-model="form.isUpgrade" placeholder="请输入是否强制升级" /> -->
          <el-radio-group v-model="form.isUpgrade">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
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
  listVersion,
  getVersion,
  delVersion,
  addVersion,
  updateVersion,
  exportVersion,
} from "@/api/qzhz/Version";
import Editor from "@/components/Editor";
export default {
  components: { Editor },
  name: "Version",
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
      // 版本信息表表格数据
      VersionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        versionNo: null,
        isUpgrade: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        versionNo: [
          { required: true, message: "版本号不能为空", trigger: "blur" },
          {
            pattern: /^\d{1}(\.\d{1})(\.\d{1})$/,
            message: "  请输入正确的版本号",
          },
        ],
        remark: [
          { required: true, message: "更新说明不能为空", trigger: "blur" },
        ],
        isUpgrade: [
          { required: true, message: "是否强制升级不能为空", trigger: "blur" },
        ],
        sourceType: [
          { required: true, message: "来源不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询版本信息表列表 */
    getList() {
      this.loading = true;
      listVersion(this.queryParams).then((response) => {
        this.VersionList = response.rows;
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
        versionNo: null,
        remark: null,
        isUpgrade: null,
        createTime: null,
        updateTime: null,
        sourceType: null,
        downloadUrl: null,
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
      this.title = "添加版本信息表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getVersion(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改版本信息表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateVersion(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addVersion(this.form).then((response) => {
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
      const ids = row.id || this.ids;
      this.$confirm(
        "删除后，用户在APP客户端将不会收到升级弹窗提醒，确认要删除吗?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delVersion(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有版本信息表数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportVersion(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>

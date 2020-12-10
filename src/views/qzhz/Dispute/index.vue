<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
      <!-- <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="会员id" prop="mId">
        <el-input
          v-model="queryParams.mId"
          placeholder="请输入会员id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="加入计划" prop="planNo">
        <el-select v-model="queryParams.planNo" placeholder="请选择所属计划" clearable size="small">
          <el-option v-for="dict in planOptions"
            :key="dict.planNo"
            :label="dict.planName"
            :value="dict.planNo"/>
        </el-select>
      </el-form-item>
      <el-form-item label="电子凭证编号" prop="documentNo">
        <el-input
          v-model="queryParams.documentNo"
          placeholder="请输入电子凭证编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择审核状态" clearable size="small">
          <el-option v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="审核备注" prop="checkRemark">
        <el-input
          v-model="queryParams.checkRemark"
          placeholder="请输入审核备注"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['qzhz:Dispute:add']"
        >新增</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['qzhz:Dispute:edit']"
        >修改</el-button> -->
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['qzhz:Dispute:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['qzhz:Dispute:export']"
        >导出</el-button>
      </el-col> -->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="DisputeList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="用户id" align="center" prop="userId" /> -->
      <!-- <el-table-column label="会员id" align="center" prop="mId" /> -->
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="加入计划" align="center" prop="planNo" :formatter="planFormat" />
      <el-table-column label="电子凭证编号" align="center" prop="documentNo" />
      <el-table-column label="审核状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="争议内容" align="center" prop="disputeContent" />
      <el-table-column label="审核备注" align="center" prop="checkRemark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['qzhz:Dispute:edit']"
          >修改</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['qzhz:Dispute:remove']"
          >删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改争议记录管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <!-- <el-form-item label="主键id" prop="id">
          <el-input v-model="form.id" placeholder="请输入主键id" />
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item> -->
        <!-- <el-form-item label="会员id" prop="mId">
          <el-input v-model="form.mId" placeholder="请输入会员id" />
        </el-form-item> -->
        <el-form-item label="加入计划" prop="planNo">
          <el-select v-model="form.planNo" placeholder="请选择加入计划" clearable size="small">
            <el-option v-for="dict in planOptions"
              :key="dict.planNo"
              :label="dict.planName"
              :value="dict.planNo"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电子凭证编号" prop="documentNo">
          <el-input v-model="form.documentNo" placeholder="请输入电子凭证编号" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="form.status" placeholder="请选择审核状态" clearable size="small">
            <el-option v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item label="争议内容">
          <editor v-model="form.disputeContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="审核备注" prop="checkRemark">
          <el-input v-model="form.checkRemark" placeholder="请输入审核备注" />
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
import { listDispute, getDispute, delDispute, addDispute, updateDispute, exportDispute } from "@/api/qzhz/Dispute";
import Editor from '@/components/Editor';
import { planList } from "@/api/qzhz/Blacklist";
export default {
  name: "Dispute",
  components: { Editor },
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
      // 争议记录管理表格数据
      DisputeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        mId: null,
        planNo: null,
        documentNo: null,
        status: null,
        disputeContent: null,
        checkRemark: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      statusOptions: [],  // 审核状态
      planOptions: [],  // 计划列表
    };
  },
  created() {
    planList({}).then(response => {
      this.planOptions = response.data;
    });
    this.getDicts("QZHZ_ AUDIT_STATUS").then(response => {
      this.statusOptions = response.data;
    });
    this.getList(); 
  },
  methods: {
    statusFormat(row, column) {
      // return this.selectDictLabel(this.voucherOptions, row.status);
      let list = this.statusOptions;
      for(let i=0; i<list.length; i++) {
        if (list[i].dictValue == row.status) {
          return list[i].dictLabel;
          break;
        }
      }
    },
    planFormat(row, column) {
      let list = this.planOptions;
      for(let i=0; i<list.length; i++) {
        if (list[i].planNo == row.planNo) {
          return list[i].planName;
          break;
        }
      }
    },
    /** 查询争议记录管理列表 */
    getList() {
      this.loading = true;
      listDispute(this.queryParams).then(response => {
        this.DisputeList = response.rows;
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
        mId: null,
        planNo: null,
        documentNo: null,
        status: "0",
        disputeContent: null,
        checkRemark: null,
        createTime: null,
        updateTime: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加争议记录管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDispute(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改争议记录管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDispute(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDispute(this.form).then(response => {
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
      this.$confirm('是否确认删除争议记录管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDispute(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有争议记录管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDispute(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>

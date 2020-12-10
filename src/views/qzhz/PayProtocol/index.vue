<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
      
      <el-form-item label="支付平台" prop="payType">
        <el-select v-model="queryParams.payType" placeholder="请选择支付平台" clearable size="small">
          <el-option v-for="dict in payTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="协议编号" prop="protocolNo">
        <el-input
          v-model="queryParams.protocolNo"
          placeholder="请输入协议编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="交易状态" prop="protocolStatus">
        <el-select v-model="queryParams.protocolStatus" placeholder="请选择协议状态" clearable size="small">
          <el-option v-for="dict in payStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="签约时间" prop="signupTime">
        <el-date-picker type="date" placeholder="请选择签约时间" v-model="queryParams.signupTime" style="width: 195px" size="small" ></el-date-picker>
        
      </el-form-item>
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
          v-hasPermi="['qzhz:PayProtocol:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['qzhz:PayProtocol:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['qzhz:PayProtocol:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['qzhz:PayProtocol:export']"
        >导出</el-button>
      </el-col> -->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="PayProtocolList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" align="center" />
      <!-- <el-table-column label="用户id" align="center" prop="userId" /> -->
      <el-table-column label="支付平台" align="center" prop="payType" :formatter="payTypeFormat" />
      <el-table-column label="协议编号" align="center" prop="protocolNo" />
      <el-table-column label="交易状态" align="center" prop="protocolStatus" :formatter="payStatusFormat" />
      <el-table-column label="签约时间" align="center" prop="signupTime" />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['qzhz:PayProtocol:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['qzhz:PayProtocol:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改支付代扣协议表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="支付平台" prop="payType">
          <el-select v-model="form.payType" placeholder="请选择支付平台">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="协议编号" prop="protocolNo">
          <el-input v-model="form.protocolNo" placeholder="请输入协议编号" />
        </el-form-item>
        <el-form-item label="协议状态">
          <el-radio-group v-model="form.protocolStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="签约时间" prop="signupTime">
          <el-input v-model="form.signupTime" placeholder="请输入签约时间" />
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
import { listPayProtocol, getPayProtocol, delPayProtocol, addPayProtocol, updatePayProtocol, exportPayProtocol } from "@/api/qzhz/PayProtocol";

export default {
  name: "PayProtocol",
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
      // 支付代扣协议表表格数据
      PayProtocolList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        payType: null,
        protocolNo: null,
        protocolStatus: null,
        signupTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      payTypeOptions: [],
      payStatusOptions: [],
    };
  },
  created() {
    this.getList();
    this.getDicts("QZHZ_PAY_PLATFORM").then(response => {
      this.payTypeOptions = response.data;
    });
    this.getDicts("QZHZ_TRADE_STATUS").then(response => {
      this.payStatusOptions = response.data;
    });
  },
  methods: {
    payTypeFormat(row, column) {
      return this.selectDictLabel(this.payTypeOptions, row.payType);
    },
    payStatusFormat(row, column) {
      return this.selectDictLabel(this.payStatusOptions, row.protocolStatus);
    },
    /** 查询支付代扣协议表列表 */
    getList() {
      this.loading = true;
      listPayProtocol(this.queryParams).then(response => {
        this.PayProtocolList = response.rows;
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
        payType: null,
        protocolNo: null,
        protocolStatus: "0",
        signupTime: null,
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
      this.title = "添加支付代扣协议表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPayProtocol(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改支付代扣协议表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePayProtocol(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPayProtocol(this.form).then(response => {
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
      this.$confirm('是否确认删除支付代扣协议表编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPayProtocol(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有支付代扣协议表数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPayProtocol(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>

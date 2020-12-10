<template>
  <div class="app-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      
      <!-- <el-form-item label="账单编号" prop="billNo">
        <el-input
          v-model="queryParams.billNo"
          placeholder="请输入账单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="所属计划" prop="planNo">
        <el-select v-model="queryParams.planNo" placeholder="请选择所属计划" clearable size="small">
          <el-option v-for="dict in planOptions"
            :key="dict.planNo"
            :label="dict.planName"
            :value="dict.planNo"/>
        </el-select>
      </el-form-item>
      <el-form-item label="账单类型" prop="billType">
        <el-select v-model="queryParams.billType" placeholder="请选择账单类型" clearable size="small">
          <el-option v-for="dict in billTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式" prop="payType">
        <el-select v-model="queryParams.payType" placeholder="请选择支付方式" clearable size="small">
          <el-option v-for="dict in payTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="账单时间" prop="beginTime">
        <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="请选择开始时间" v-model="queryParams.beginTime" style="width: 195px" size="small" ></el-date-picker>
      </el-form-item>
      <el-form-item label="" prop="endTime">
        <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="请选择结束时间" v-model="queryParams.endTime" style="width: 195px" size="small" ></el-date-picker>
      </el-form-item><br/>

      <el-form-item label="保障人姓名" prop="guarantorName">
        <el-input
          v-model="queryParams.guarantorName"
          placeholder="请输入保障人姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="保障人身份证" prop="guarantorIdCard">
        <el-input
          v-model="queryParams.guarantorIdCard"
          placeholder="请输入保障人身份证"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="电子凭证编号" prop="documentNo">
        <el-input
          v-model="queryParams.documentNo"
          placeholder="请输入电子凭证编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="用户账号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入用户手机账号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="账单金额(元)" prop="beginAmount1">
        <el-input type="number"
          v-model="queryParams.beginAmount1"
          placeholder="请输入最小金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="endAmount1">
        <el-input type="number"
          v-model="queryParams.endAmount1"
          placeholder="请输入最大金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['qzhz:BillDetails:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['qzhz:BillDetails:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['qzhz:BillDetails:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['qzhz:BillDetails:export']"
        >导出</el-button>
      </el-col> -->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="BillDetailsList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="账单编号" align="center" prop="billNo" />
      <el-table-column label="所属计划名称" align="center" prop="planName" /> 
      <el-table-column label="账单金额" align="center" prop="billAmount" >
        <template slot-scope="scope">
          <span v-if="scope.row.billType==1||scope.row.billType==2||scope.row.billType==3||scope.row.billType==6">+{{memberCostFormat(scope.row)}}</span>
          <span v-else-if="scope.row.billType==5">-{{memberCostFormat(scope.row)}}</span>
          <span v-else>{{memberCostFormat(scope.row)}}</span>
        </template>
      </el-table-column>

      <el-table-column label="账单类型" align="center" prop="billType" :formatter="billTypeFormat" />
      <el-table-column label="支付方式" align="center" prop="payType" :formatter="payTypeFormat" />
      <el-table-column label="保障人姓名" align="center" prop="guarantorName" />
      <el-table-column label="保障人身份证" align="center" prop="guarantorIdCard" />
      <el-table-column label="用户手机账号" align="center" prop="phone" />
      <el-table-column label="账单时间" align="center" prop="createTime" />
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="用户id" align="center" prop="userId" /> -->
      <!-- <el-table-column label="所属计划" align="center" prop="planNo" /> -->
      <!-- <el-table-column label="电子凭证编号" align="center" prop="documentNo" /> -->
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['qzhz:BillDetails:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['qzhz:BillDetails:remove']"
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

    <!-- 添加或修改账单信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="主键id" prop="id">
          <el-input v-model="form.id" placeholder="请输入主键id" />
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="账单编号" prop="billNo">
          <el-input v-model="form.billNo" placeholder="请输入账单编号" />
        </el-form-item>
        <el-form-item label="所属计划" prop="planNo">
          <el-input v-model="form.planNo" placeholder="请输入所属计划" />
        </el-form-item>
        <el-form-item label="所属计划名称" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入所属计划名称" />
        </el-form-item>
        <el-form-item label="保障人姓名" prop="guarantorName">
          <el-input v-model="form.guarantorName" placeholder="请输入保障人姓名" />
        </el-form-item>
        <el-form-item label="保障人身份证" prop="guarantorIdCard">
          <el-input v-model="form.guarantorIdCard" placeholder="请输入保障人身份证" />
        </el-form-item>
        <el-form-item label="电子凭证编号" prop="documentNo">
          <el-input v-model="form.documentNo" placeholder="请输入电子凭证编号" />
        </el-form-item>
        <el-form-item label="用户手机账号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入用户手机账号" />
        </el-form-item>
        <el-form-item label="账单金额" prop="billAmount">
          <el-input v-model="form.billAmount" placeholder="请输入账单金额" />
        </el-form-item>
        <el-form-item label="账单类型" prop="billType">
          <el-select v-model="form.billType" placeholder="请选择账单类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="payType">
          <el-select v-model="form.payType" placeholder="请选择支付方式">
            <el-option label="请选择字典生成" value="" />
          </el-select>
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
import PanelGroup from '../../dashboard/PanelGroupMoney'
import { listBillDetails, getBillDetails, delBillDetails, addBillDetails, updateBillDetails, exportBillDetails } from "@/api/qzhz/BillDetails";
import { planList } from "@/api/qzhz/Blacklist";
export default {
  components: {
    PanelGroup
  },
  name: "BillDetails",
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
      // 账单信息表格数据
      BillDetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        billNo: null,
        planNo: null,
        planName: null,
        guarantorName: null,
        guarantorIdCard: null,
        documentNo: null,
        phone: null,
        billAmount: null,
        billType: null,
        payType: null,
        beginTime: null,
        endTime: null,
        beginAmount1: null,
        endAmount1: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      planOptions: [],  // 计划列表
      billTypeOptions: [], // 账单类型
      payTypeOptions: [],  // 支付方式
    };
  },
  created() {
    this.getList();
    planList({}).then(response => {
      this.planOptions = response.data;
    });
    this.getDicts("QZHZ_BillType").then(response => {
      this.billTypeOptions = response.data;
    });
    this.getDicts("QZHZ_PayType").then(response => {
      this.payTypeOptions = response.data;
    });
  },
  methods: {
    memberCostFormat(row, column) {
      return `${(row.billAmount/100).toFixed(2)}`;
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
    billTypeFormat(row, column) {
      return this.selectDictLabel(this.billTypeOptions, row.billType);
    },
    payTypeFormat(row, column) {
      return this.selectDictLabel(this.payTypeOptions, row.payType);
    },
    /** 查询账单信息列表 */
    getList() {
      this.loading = true;
      listBillDetails(this.queryParams).then(response => {
        this.BillDetailsList = response.rows;
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
        billNo: null,
        planNo: null,
        planName: null,
        guarantorName: null,
        guarantorIdCard: null,
        documentNo: null,
        phone: null,
        createTime: null,
        updateTime: null,
        billAmount: null,
        billType: null,
        payType: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.endAmount = this.queryParams.endAmount1 * 100;
      this.queryParams.beginAmount = this.queryParams.beginAmount1 * 100;
      
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
      this.title = "添加账单信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBillDetails(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改账单信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBillDetails(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBillDetails(this.form).then(response => {
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
      this.$confirm('是否确认删除账单信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBillDetails(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有账单信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportBillDetails(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>

<template>
  <div class="app-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="公示期数" prop="publicPeriods">
        <!-- <el-date-picker type="date" placeholder="请选择公示期数" v-model="queryParams.publicPeriods" style="width: 195px" size="small" ></el-date-picker> -->
        <el-date-picker v-model="value1" format="yyyy" value-format="yyyy" type="year" placeholder="选择年份" style="width: 140px; margin-right: 5px;"></el-date-picker>
        <el-select v-model="value2" placeholder="请选择月份" clearable size="small" style="width: 140px; margin-right: 5px;">
          <el-option label="1月" value="1"/>
          <el-option label="2月" value="2"/>
          <el-option label="3月" value="3"/>
          <el-option label="4月" value="4"/>
          <el-option label="5月" value="5"/>
          <el-option label="6月" value="6"/>
          <el-option label="7月" value="7"/>
          <el-option label="8月" value="8"/>
          <el-option label="9月" value="9"/>
          <el-option label="10月" value="10"/>
          <el-option label="11月" value="11"/>
          <el-option label="12月" value="12"/>
        </el-select>
        <el-select v-model="value3" placeholder="请选择期数" clearable size="small" style="width: 140px;">
          <el-option label="1期" value="1"/>
          <el-option label="2期" value="2"/>
          <el-option label="3期" value="3"/>
        </el-select>
    
      </el-form-item>
      <el-form-item label="所属计划" prop="planNo">
        <el-select v-model="queryParams.planNo" placeholder="请选择所属计划" clearable size="small">
          <el-option v-for="dict in planOptions"
            :key="dict.planNo"
            :label="dict.planName"
            :value="dict.planNo"/>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="互助金总额" prop="total">
        <el-input
          v-model="queryParams.total"
          placeholder="请输入互助金总额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="管理费" prop="managementCosts">
        <el-input
          v-model="queryParams.managementCosts"
          placeholder="请输入管理费"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预计分摊总金额" prop="expectFtTotal">
        <el-input
          v-model="queryParams.expectFtTotal"
          placeholder="请输入预计分摊总金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分摊未到账" prop="ftNotReceived">
        <el-input
          v-model="queryParams.ftNotReceived"
          placeholder="请输入分摊未到账"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="本期结余" prop="currentBalance">
        <el-input
          v-model="queryParams.currentBalance"
          placeholder="请输入本期结余"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前资金池" prop="currentFundPool">
        <el-input
          v-model="queryParams.currentFundPool"
          placeholder="请输入当前资金池"
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
          v-hasPermi="['qzhz:FundPool:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['qzhz:FundPool:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['qzhz:FundPool:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['qzhz:FundPool:export']"
        >导出</el-button>
      </el-col> -->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="FundPoolList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="公示期数" align="center" prop="publicPeriods" />
      <el-table-column label="所属计划" align="center" prop="planNo" :formatter="planFormat"/>
      <el-table-column label="互助金总额(元)" align="center" prop="total" :formatter="memberCostFormat"/>
      <el-table-column label="管理费(元)" align="center" prop="managementCosts" :formatter="memberCostFormat1" />
      <el-table-column label="预计分摊总金额(元)" align="center" prop="expectFtTotal" :formatter="memberCostFormat2" />
      <el-table-column label="分摊未到账(元)" align="center" prop="ftNotReceived" :formatter="memberCostFormat3"  />
      <el-table-column label="本期结余(元)" align="center" prop="currentBalance" :formatter="memberCostFormat4" />
      <el-table-column label="当前资金池(元)" align="center" prop="currentFundPool" :formatter="memberCostFormat5"  />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['qzhz:FundPool:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['qzhz:FundPool:remove']"
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

    <!-- 添加或修改资金池表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公示期数" prop="publicPeriods">
          <el-input v-model="form.publicPeriods" placeholder="请输入公示期数" />
        </el-form-item>
        <el-form-item label="所属计划" prop="planNo">
          <el-input v-model="form.planNo" placeholder="请输入所属计划" />
        </el-form-item>
        <el-form-item label="互助金总额" prop="total">
          <el-input v-model="form.total" placeholder="请输入互助金总额" />
        </el-form-item>
        <el-form-item label="管理费" prop="managementCosts">
          <el-input v-model="form.managementCosts" placeholder="请输入管理费" />
        </el-form-item>
        <el-form-item label="预计分摊总金额" prop="expectFtTotal">
          <el-input v-model="form.expectFtTotal" placeholder="请输入预计分摊总金额" />
        </el-form-item>
        <el-form-item label="分摊未到账" prop="ftNotReceived">
          <el-input v-model="form.ftNotReceived" placeholder="请输入分摊未到账" />
        </el-form-item>
        <el-form-item label="本期结余" prop="currentBalance">
          <el-input v-model="form.currentBalance" placeholder="请输入本期结余" />
        </el-form-item>
        <el-form-item label="当前资金池" prop="currentFundPool">
          <el-input v-model="form.currentFundPool" placeholder="请输入当前资金池" />
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
import PanelGroup from '../../dashboard/PanelGroupMoney2'
import { listFundPool, getFundPool, delFundPool, addFundPool, updateFundPool, exportFundPool } from "@/api/qzhz/FundPool";
import { planList } from "@/api/qzhz/Blacklist";
export default {
  components: {
    PanelGroup
  },
  name: "FundPool",
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
      // 资金池表表格数据
      FundPoolList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        publicPeriods: null,
        planNo: null,
        total: null,
        managementCosts: null,
        expectFtTotal: null,
        ftNotReceived: null,
        currentBalance: null,
        currentFundPool: null,
      },
      value1: '',
      value2: '',
      value3: '',
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      planOptions: [],  // 计划列表
    };
  },
  created() {
    this.getList();
    planList({}).then(response => {
      this.planOptions = response.data;
    })
  },
  methods: {
    memberCostFormat(row, column) {
      return `${(row.total/100).toFixed(2)}`;
    },
    memberCostFormat1(row, column) {
      return `${(row.managementCosts/100).toFixed(2)}`;
    },
    memberCostFormat2(row, column) {
      return `${(row.expectFtTotal/100).toFixed(2)}`;
    },
    memberCostFormat3(row, column) {
      return `${(row.ftNotReceived/100).toFixed(2)}`;
    },
    memberCostFormat4(row, column) {
      return `${(row.currentBalance/100).toFixed(2)}`;
    },
    memberCostFormat5(row, column) {
      return `${(row.currentFundPool/100).toFixed(2)}`;
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
    /** 查询资金池表列表 */
    getList() {
      this.loading = true;
      listFundPool(this.queryParams).then(response => {
        this.FundPoolList = response.rows;
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
        publicPeriods: null,
        planNo: null,
        total: null,
        managementCosts: null,
        expectFtTotal: null,
        ftNotReceived: null,
        currentBalance: null,
        currentFundPool: null,
        createTime: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;

      if(this.value1 !== '') {
        this.queryParams.publicPeriods = `${this.value1}年${this.value2}月第${this.value3}期`;
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.value1 = '';
      this.value2 = '';
      this.value3 = '';
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
      this.title = "添加资金池表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFundPool(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改资金池表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFundPool(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFundPool(this.form).then(response => {
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
      this.$confirm('是否确认删除资金池表编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFundPool(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有资金池表数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportFundPool(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>

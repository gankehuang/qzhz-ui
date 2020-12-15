<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >
      <el-form-item label="计划编号" prop="planNo">
        <el-input
          v-model="queryParams.planNo"
          placeholder="请输入计划编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划名称" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入计划名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="年费" prop="yearCosts">
        <el-input
          v-model="queryParams.yearCosts"
          placeholder="请输入年费"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="观察期" prop="watchCount">
        <el-input
          v-model="queryParams.watchCount"
          placeholder="请输入观察期"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="管理费" prop="managementCosts">
        <el-input
          v-model="queryParams.managementCosts"
          placeholder="请输入管理费"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      
      <el-form-item label="最高互助金" prop="highCosts">
        <el-input
          v-model="queryParams.highCosts"
          placeholder="请输入最高互助金"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          size="small"
        >
          <el-option label="有效" value="1" />
          <el-option label="无效" value="0" />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="加入人数" prop="joinCount">
        <el-input
          v-model="queryParams.joinCount"
          placeholder="请输入加入人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['qzhz:Plan:add']"
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
          v-hasPermi="['qzhz:Plan:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['qzhz:Plan:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['qzhz:Plan:export']"
        >导出</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-refresh"
          size="mini"
          @click="handleClearCache"
          v-hasPermi="['system:dict:remove']"
        >清理缓存</el-button>
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="PlanList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="计划编号" align="center" prop="planNo" />
      <el-table-column label="计划名称" align="center" prop="planName" />
      <el-table-column
        label="年费(元)"
        align="center"
        prop="yearCosts"
        :formatter="memberCostFormat"
      />
      <el-table-column label="观察期" align="center" prop="watchCount" />
      <el-table-column
        label="管理费(%)"
        align="center"
        prop="managementCosts"
      />
      <el-table-column label="宣传页" align="center" prop="flyer">
        <template slot-scope="scope">
          <img style="width: 100px" :src="scope.row.flyer" alt="" />
        </template>
      </el-table-column>
      <el-table-column
        label="最高互助金(元)"
        align="center"
        prop="highCosts"
        :formatter="memberCostFormat2"
      />
      <!-- <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status == '1'">有效</span>
          <span v-if="scope.row.status == '0'">无效</span>
        </template>
      </el-table-column> -->
      <el-table-column label="加入人数" align="center" prop="joinCount" />
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
            v-hasPermi="['qzhz:Plan:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="planEdit(scope.row)"
            icon="el-icon-edit"
            >会员费用修改</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['qzhz:Plan:remove']"
          >删除</el-button> -->
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

    <!-- 添加或修改计划信息对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
      width="880px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <!-- <el-form-item label="计划编号" prop="planNo">
          <el-input v-model="form.planNo" placeholder="请输入计划编号" />
        </el-form-item> -->
        <el-form-item label="计划名称" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入计划名称" />
        </el-form-item>
        <el-form-item label="年费(元)" prop="yearCosts">
          <el-input
            type="text"
            oninput="value=value.replace(/[^\d.]/g,'')"
            v-model="form.yearCosts"
            placeholder="请输入年费"
          />
        </el-form-item>
        <el-form-item label="观察期" prop="watchCount">
          <el-input
            type="text"
            oninput="value=value.replace(/[^\d.]/g,'')"
            v-model="form.watchCount"
            placeholder="请输入观察期"
          />
        </el-form-item>
        <el-form-item label="管理费(%)" prop="managementCosts">
          <el-input
            type="text"
            oninput="value=value.replace(/[^\d.]/g,'')"
            v-model="form.managementCosts"
            placeholder="请输入管理费"
          />
        </el-form-item>
        <el-form-item label="宣传页" prop="flyer">
          <el-input v-model="form.flyer" placeholder="请输入宣传页" />
        </el-form-item>
        <el-form-item label="最高互助金(元)" prop="highCosts">
          <el-input
            type="text"
            oninput="value=value.replace(/[^\d.]/g,'')"
            v-model="form.highCosts"
            placeholder="请输入最高互助金"
          />
        </el-form-item>
        <el-form-item label="计划详情页" prop="detailUrl">
          <el-input v-model="form.detailUrl" placeholder="请输入计划详情页" />
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">有效</el-radio>
            <el-radio label="0">无效</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <el-form-item
          v-for="(domain, index) in form.agreements"
          :label="'协议' + (index + 1)"
          :key="domain.key"
          :prop="'agreements.' + index + '.value'"
        >
          <el-input
            class="int"
            type="number"
            v-model="domain.sort"
            placeholder="排序"
          ></el-input
          >&nbsp;
          <el-input
            class="int"
            v-model="domain.icon"
            placeholder="图标"
          ></el-input
          >&nbsp;
          <el-input
            class="int"
            v-model="domain.name"
            placeholder="协议名称"
          ></el-input
          >&nbsp;<br />
          <el-input
            class="int"
            v-model="domain.url"
            placeholder="协议地址"
            style="margin-top: 5px"
          ></el-input
          >&nbsp;
          <el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDomain" size="small">新增</el-button>
        </el-form-item>
        <!-- <el-form-item label="加入人数" prop="joinCount">
          <el-input v-model="form.joinCount" placeholder="请输入加入人数" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="title"
      :visible.sync="openDetail"
      :close-on-click-modal="false"
      width="1200px"
      append-to-body
    >
      <planDetail
        ref="planDetail"
        :rowData="rowData"
        @changeOpen="changeOpen"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  listPlan,
  getPlan,
  delPlan,
  addPlan,
  updatePlan,
  exportPlan,
} from "@/api/qzhz/Plan";
import { clearCache } from "@/api/system/dict/type";
import planDetail from "./data";
export default {
  components: {
    planDetail,
  },
  name: "Plan",
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
      // 计划信息表格数据
      PlanList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openDetail: false,
      rowData: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planNo: null,
        planName: null,
        yearCosts: null,
        watchCount: null,
        managementCosts: null,
        flyer: null,
        highCosts: null,
        status: null,
        joinCount: null,
      },
      // 表单参数
      form: {
        agreements: [
          {
            sort: "",
            icon: "",
            name: "",
            url: "",
          },
        ],
      },
      // 表单校验
      rules: {
        watchCount: [
          { required: true, message: "观察期不能为空", trigger: "blur" },
        ],
        managementCosts: [
          { required: true, message: "管理费不能为空", trigger: "blur" },
        ],
        planNo: [
          { required: true, message: "计划编号不能为空", trigger: "blur" },
        ],
        planName: [
          { required: true, message: "计划名称不能为空", trigger: "blur" },
        ],
        yearCosts: [
          { required: true, message: "年费不能为空", trigger: "blur" },
        ],
        flyer: [{ required: true, message: "宣传页不能为空", trigger: "blur" }],
        highCosts: [
          { required: true, message: "最高互助金不能为空", trigger: "blur" },
        ],
        joinCount: [
          { required: true, message: "加入人数不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changeOpen() {
      this.openDetail = false;
    },
    memberCostFormat(row, column) {
      return `${(row.yearCosts / 100).toFixed(2)}`;
    },
    memberCostFormat1(row, column) {
      return `${(row.managementCosts / 100).toFixed(2)}`;
    },
    memberCostFormat2(row, column) {
      return `${(row.highCosts / 100).toFixed(2)}`;
    },
    removeDomain(item) {
      let index = this.form.agreements.indexOf(item);
      if (index !== -1) {
        this.form.agreements.splice(index, 1);
      }
    },
    addDomain() {
      this.form.agreements.push({
        aName: "",
        aUrl: "",
      });
    },

    planEdit(row) {
      this.rowData = row;
      this.openDetail = true;
      this.$refs.planDetail.getList();
    },
    /** 查询计划信息列表 */
    getList() {
      this.loading = true;
      listPlan(this.queryParams).then((response) => {
        this.PlanList = response.rows;
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
        planNo: null,
        planName: null,
        yearCosts: null,
        watchCount: null,
        managementCosts: null,
        flyer: null,
        createTime: null,
        highCosts: null,
        updateTime: null,
        status: "0",
        joinCount: null,
        agreements: [
          {
            name: "",
            url: "",
          },
        ],
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
      this.title = "添加计划信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const planNo = row.planNo || this.ids;
      getPlan(planNo).then((response) => {
        this.form = response.data;
        this.form.yearCosts = this.form.yearCosts / 100;
        this.form.highCosts = this.form.highCosts / 100;
        this.open = true;
        this.title = "修改计划信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.yearCosts = this.form.yearCosts * 100;
          this.form.highCosts = this.form.highCosts * 100;
          if (this.form.id != null) {
            updatePlan(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPlan(this.form).then((response) => {
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
      const ids = row.planNo || this.ids;
      const planName = row.planName || this.ids;
      this.$confirm(
        '是否确认删除计划名称为"' + planName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delPlan(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有计划信息数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportPlan(queryParams);
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
<style scoped>
.int {
  width: 200px;
}
</style>

<template>
  <div class="app-container">
    <el-button @click="back" style="float: right">返回</el-button>

    <el-form ref="form" :model="form" :inline="true" label-width="120px">
      <h2>
        保障人信息&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a style="font-size: 14px; color: blue" @click="edit">编辑保障人</a>
        <!-- <a v-if="isEdit" style="font-size: 14px; color: blue;" @click="cancelEdit">取消编辑保障人</a>
        <a v-if="isEdit" style="font-size: 14px; color: blue; margin-left: 15px;" @click="editRecord">编辑记录</a> -->
      </h2>
      <el-form-item label="电子凭证编号" prop="documentNo">
        <span>{{ form.documentNo }}</span>
      </el-form-item>
      <el-form-item label="保障人姓名" prop="guarantorName">
        <span>{{ form.guarantorName }}</span>
        <!-- <el-input v-if="isEdit" v-model="form.guarantorName" placeholder="请输入保障人姓名" /> -->
      </el-form-item>
      <el-form-item label="加入计划名称" prop="joinPlanNo">
        <span>{{ form.joinPlanName }}</span>
      </el-form-item>
      <el-form-item label="注册用户" prop="phone">
        <span>{{ form.phone }}</span>
      </el-form-item>
      <el-form-item label="凭证状态">
        <span>{{ voucherFormat(form) }}</span>
      </el-form-item>
      <el-form-item label="保障人身份证号" prop="guarantorIdCard">
        <span>{{ form.guarantorIdCard }}</span>
        <!-- <el-input v-if="isEdit" v-model="form.guarantorIdCard" placeholder="请输入保障人身份证号" /> --> </el-form-item
      ><br />
      <el-form-item label="观察期起止" prop="watchStart">
        <span>{{ form.watchStart }}-</span>
      </el-form-item>
      <el-form-item label="" prop="watchEnd">
        <span>{{ form.watchEnd }}</span>
      </el-form-item>
      <el-form-item label="与注册人关系" prop="relation">
        <span>{{ relationFormat(form) }}</span>
      </el-form-item>
      <el-form-item label="备注原因" prop="remark">
        <span>{{ form.remark }}</span>
        <!-- <el-input v-if="isEdit" type="textarea" v-model="form.remark"></el-input> -->
      </el-form-item>

      <h2>会员信息</h2>
      <el-form-item label="会员等级" prop="memberName">
        <span>{{ form.memberName }}</span>
      </el-form-item>
      <el-form-item label="会员免密续费" prop="payoff">
        <span>{{ payoffFormat(form) }}</span>
      </el-form-item>
      <el-form-item label="会员截止日期" prop="memberExpiryDate">
        <span>{{ form.memberExpiryDate }}</span>
      </el-form-item>
      <el-form-item label="是否理赔" prop="isSettlement">
        <span>{{ isSettlementFormat(form) }}</span>
      </el-form-item>

      <h2>账户余额</h2>
      <el-form-item label="账户余额(元)" prop="balance">
        <span>{{ (form.balance / 100).toFixed(2) }}</span>
      </el-form-item>
      <el-form-item label="年费免密续费" prop="payoff">
        <span>{{ payoffFormat(form) }}</span>
      </el-form-item>
      <el-form-item label="年费截止日期" prop="memberExpiryDate">
        <span>{{ form.memberExpiryDate }}</span>
      </el-form-item>

      <!-- <el-form-item label="加入日期" prop="joinDate">
        <el-input v-model="form.joinDate" />
      </el-form-item>
      <el-form-item label="用户id" prop="userId">
        <el-input v-model="form.userId" placeholder="请输入用户id" />
      </el-form-item>
      <el-form-item label="分摊次数" prop="shartNum">
        <el-input v-model="form.shartNum" placeholder="请输入分摊次数@@" />
      </el-form-item> -->
    </el-form>
    <el-button @click="addBlackList">加入黑名单</el-button>
    <el-button type="primary" @click="lookRecord">查看账单</el-button>

    <!-- 添加或修改会员费用对话框 -->
    <el-dialog
      title="编辑保障人"
      :visible.sync="open"
      width="800px"
      append-to-body
    >
      <p style="color: blue; text-align: right" @click="editRecord">编辑记录</p>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="保障人姓名" prop="guarantorName">
          <el-input
            v-model="form.guarantorName"
            placeholder="请输入保障人姓名"
          />
        </el-form-item>
        <el-form-item label="身份证号" prop="guarantorIdCard">
          <el-input
            v-model="form.guarantorIdCard"
            placeholder="请输入身份证号"
          />
        </el-form-item>
        <el-form-item label="备注原因" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <p style="color: red; margin-left: 120px">
        此操作存在法律风险，请谨慎操作！
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="编辑记录"
      :visible.sync="openEditRecord"
      width="1000px"
      append-to-body
    >
      <div class="block">
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in EditRecordList"
            :key="index"
            :timestamp="record.newEditRecord.createTime"
            placement="top"
          >
            <el-card>
              <p>操作人：{{ record.newEditRecord.createBy }}</p>
              <h4 style="color: red">
                编辑后：{{ record.newEditRecord.guarantorName }}&nbsp;&nbsp;{{
                  record.newEditRecord.guarantorIdCard
                }}
              </h4>
              <p v-if="record.oldEditRecord">
                编辑前：{{ record.oldEditRecord.guarantorName }}&nbsp;&nbsp;{{
                  record.oldEditRecord.guarantorIdCard
                }}
              </p>
              <p>备注原因：{{ record.newEditRecord.remark }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>

    <el-dialog
      title="账单详情"
      :visible.sync="openlLookRecord"
      width="1000px"
      append-to-body
    >
      <el-table
        v-loading="loading"
        :data="BillDetailsList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="账单编号" align="center" prop="billNo" />
        <el-table-column label="账单金额(元)" align="center" prop="billAmount">
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.billType == 1 ||
                scope.row.billType == 2 ||
                scope.row.billType == 3 ||
                scope.row.billType == 6
              "
              >+{{ scope.row }}</span
            >
            <span v-else-if="scope.row.billType == 5"
              >-{{ memberCostFormat2(scope.row) }}</span
            >
            <span v-else>{{ memberCostFormat2(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="账单类型"
          align="center"
          prop="billType"
          :formatter="billTypeFormat"
        />
        <el-table-column
          label="支付方式"
          align="center"
          prop="payType"
          :formatter="payTypeFormat"
        />
        <el-table-column label="账单时间" align="center" prop="createTime" />
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  listGuarantor,
  getGuarantor,
  delGuarantor,
  addGuarantor,
  updateGuarantor,
  exportGuarantor,
} from "@/api/qzhz/Guarantor";
import {
  listEditRecord,
  getEditRecord,
  delEditRecord,
  addEditRecord,
  updateEditRecord,
  exportEditRecord,
} from "@/api/qzhz/EditRecord";
import { addBlacklist, isBlack, updateBlacklist } from "@/api/qzhz/Blacklist";
import {
  listBillDetails,
  getBillDetails,
  delBillDetails,
  addBillDetails,
  updateBillDetails,
  exportBillDetails,
} from "@/api/qzhz/BillDetails";
export default {
  name: "Guarantor",
  data() {
    return {
      isEdit: false,
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: "",
      ids: [],
      // 是否显示弹出层
      open: false,
      openEditRecord: false,
      openlLookRecord: false,
      rules: {
        guarantorIdCard: [
          { validator: this.chinaIdentityValid, trigger: "blur" },
          { required: true, message: "身份证不能为空", trigger: "blur" },
        ],
        guarantorName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        balance: null,
        memberLevel: null,
        joinDate: null,
        memberExpiryDate: null,
        shartNum: null,
        payoff: null,
        guarantorName: null,
        guarantorIdCard: null,
        relation: null,
        watchStart: null,
        watchEnd: null,
        joinPlanNo: null,
        documentNo: null,
        phone: null,
        isSettlement: null,
        voucherStatus: null,
      },
      // 表单参数
      form: {},
      total: 0,
      // 编辑记录信息表格数据
      EditRecordList: [],
      voucherOptions: [], // 保障凭证状态
      isSettlementTrueOptions: [], // 是否理赔
      payoffOptions: [], // 免密支付
      memberLevelOptions: [], // 会员等级
      relationOptions: [], // 与注册人关系
      BillDetailsList: [],
      billTypeOptions: [], // 账单类型
      payTypeOptions: [], // 支付方式
    };
  },
  created() {
    const id = (this.$route.params && this.$route.params.id) || 91;
    getGuarantor(id).then((response) => {
      this.form = response.data;
    });

    this.getDicts("QZHZ_Voucher").then((response) => {
      this.voucherOptions = response.data;
    });
    this.getDicts("QZHZ_IS_SETTLEMENT_TRUE").then((response) => {
      this.isSettlementTrueOptions = response.data;
    });
    this.getDicts("QZHZ_IS_PAYOFF").then((response) => {
      this.payoffOptions = response.data;
    });
    this.getDicts("QZHZ_MEMBER_LEVEL").then((response) => {
      this.memberLevelOptions = response.data;
    });
    this.getDicts("QZHZ_Relation").then((response) => {
      this.relationOptions = response.data;
    });
    this.getDicts("QZHZ_BillType").then((response) => {
      this.billTypeOptions = response.data;
    });
    this.getDicts("QZHZ_PayType").then((response) => {
      this.payTypeOptions = response.data;
    });
  },
  methods: {
    back() {
      window.history.back(-1);
    },
    /** 查询账单信息列表 */
    getList() {
      this.loading = true;
      this.queryParams.userId = this.form.userId;
      listBillDetails(this.queryParams).then((response) => {
        this.BillDetailsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    lookRecord() {
      this.openlLookRecord = true;
      this.queryParams.mid = this.form.mid;
      this.getList();
    },
    memberCostFormat2(row, column) {
      return `${(row.billAmount / 100).toFixed(2)}`;
    },
    memberCostFormat(row, column) {
      return `¥${(row / 100).toFixed(2)}`;
    },
    voucherFormat(row, column) {
      return this.selectDictLabel(this.voucherOptions, row.voucherStatus);
    },
    isSettlementFormat(row, column) {
      return this.selectDictLabel(
        this.isSettlementTrueOptions,
        row.isSettlement
      );
    },
    payoffFormat(row, column) {
      return this.selectDictLabel(this.payoffOptions, row.payoff);
    },
    memberLevelFormat(row, column) {
      return this.selectDictLabel(this.memberLevelOptions, row.memberLevel);
    },
    relationFormat(row, column) {
      return this.selectDictLabel(this.relationOptions, row.relation);
    },
    billTypeFormat(row, column) {
      return this.selectDictLabel(this.billTypeOptions, row.billType);
    },
    payTypeFormat(row, column) {
      return this.selectDictLabel(this.payTypeOptions, row.payType);
    },
    edit() {
      this.open = true;
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateGuarantor(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
            });
          } else {
            addGuarantor(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
            });
          }
        }
      });
    },
    // 编辑记录
    editRecord() {
      /** 查询编辑记录信息列表 */
      this.loading = true;
      this.queryParams.documentNo = this.form.documentNo;
      this.queryParams.mid = this.form.mid;

      listEditRecord(this.queryParams).then((response) => {
        if (response.data.length === 0) {
          this.msgSuccess("暂无编辑记录！");
          return;
        }
        this.EditRecordList = response.data;
        this.total = response.total;
        this.loading = false;
        this.openEditRecord = true;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      // this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        balance: null,
        memberLevel: null,
        joinDate: null,
        memberExpiryDate: null,
        shartNum: null,
        payoff: null,
        guarantorName: null,
        guarantorIdCard: null,
        relation: null,
        watchStart: null,
        watchEnd: null,
        joinPlanNo: null,
        documentNo: null,
        phone: null,
        isSettlement: null,
        voucherStatus: "0",
        createTime: null,
        updateTime: null,
      };
      this.resetForm("form");
    },

    addBlackList() {
      const addData = {
        blackName: this.form.guarantorName,
        blackIdCard: this.form.guarantorIdCard,
        planNo: this.form.joinPlanNo,
      };

      isBlack({
        blackIdCard: this.form.guarantorIdCard,
        planNo: this.form.joinPlanNo,
      }).then((res) => {
        if (res.data.is_black) {
          this.$confirm(`该用户已在黑名单中，不能重复添加`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          });
        } else {
          const ids = this.form.id || this.ids;
          this.$confirm(
            `姓名：${this.form.guarantorName}，身份证号：${this.form.guarantorIdCard}，该保障人将被加入${this.form.joinPlanName}的黑名单，加入成功后将自动退出该计划，确定加入黑名单吗？`,
            "加入黑名单",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(function () {
              return addBlacklist(addData);
            })
            .then(() => {
              this.msgSuccess("加入黑名单成功");
            });
        }
        console.log(res);
      });
    },
  },
  watch: {},
};
</script>

<style scoped>
.tableTitle {
  font-size: 16px;
  font-weight: bold;
}
.ftgs div {
  display: inline-block;
  height: 80px;
  vertical-align: top;
}
</style>

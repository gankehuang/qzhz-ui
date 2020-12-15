<template>
  <div class="app-container">
    <el-radio-group
      v-model="tabPosition"
      style="margin-bottom: 30px"
      size="small"
    >
      <el-radio-button label="1">会员列表</el-radio-button>
      <el-radio-button label="2">余额不足提醒</el-radio-button>
      <el-radio-button label="3">会员到期提醒</el-radio-button>
    </el-radio-group>

    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="120px"
    >
      <el-form-item label="会员姓名" prop="guarantorName">
        <el-input
          v-model="queryParams.guarantorName"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="guarantorIdCard">
        <el-input
          v-model="queryParams.guarantorIdCard"
          placeholder="请输入身份证号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        v-show="tabPosition != 1"
        label="保障凭证状态"
        prop="voucherStatus"
      >
        <el-select
          v-model="queryParams.voucherStatus"
          placeholder="请选择保障凭证状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in voucherOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-show="tabPosition == 1"
        label="保障凭证状态"
        prop="voucherStatus"
      >
        <el-select
          v-model="queryParams.voucherStatus"
          placeholder="请选择保障凭证状态"
          clearable
          size="small"
        >
          <el-option label="观察期" value="1" />
          <el-option label="已加入" value="2" />
          <el-option label="已退出" value="3" />
          <el-option label="冻结中" value="4" />
        </el-select>
      </el-form-item>

      <div v-if="tabPosition == 1">
        <el-form-item label="会员截止日期" prop="joinDate">
          <el-date-picker
            type="date"
            placeholder="请选择开始日期"
            value-format="yyyy-MM-dd"
            v-model="queryParams.beginTime"
            style="width: 195px"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="memberExpiryDate">
          <el-date-picker
            type="date"
            placeholder="请选择开始日期"
            value-format="yyyy-MM-dd"
            v-model="queryParams.endTime"
            style="width: 195px"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="是否理赔" prop="isSettlement">
          <el-select
            v-model="queryParams.isSettlement"
            placeholder="是否理赔"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in isSettlementTrueOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="免密支付" prop="payoff">
        <el-select
          v-model="queryParams.payoff"
          placeholder="免密支付"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in payoffOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入用户手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <!-- <el-form-item label="账户余额" prop="balance" v-if="tabPosition == 1">
        <el-input
          type="number"
          v-model="queryParams.balance"
          placeholder="请输入账户余额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> --><br />
      <el-form-item
        label="账单金额(元)"
        prop="beginAmount1"
        v-if="tabPosition == 1"
      >
        <el-input
          type="number"
          v-model="queryParams.beginAmount1"
          placeholder="请输入最小金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="endAmount1" v-if="tabPosition == 1">
        <el-input
          type="number"
          v-model="queryParams.endAmount1"
          placeholder="请输入最大金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <!-- <el-form-item label="会员等级" prop="memberLevel">
        <el-select v-model="queryParams.memberLevel" placeholder="会员等级" clearable size="small">
          <el-option v-for="dict in memberLevelOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="分摊次数" prop="shartNum">
        <el-input
          v-model="queryParams.shartNum"
          placeholder="请输入分摊次数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="与注册人关系" prop="relation">
        <el-select v-model="queryParams.relation" placeholder="与注册人关系" clearable size="small">
          <el-option label="本人" value="1" />
          <el-option label="爱人" value="2" />
          <el-option label="子女" value="3" />
          <el-option label="父母" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="观察期开始" prop="watchStart">
        <el-input
          v-model="queryParams.watchStart"
          placeholder="请输入观察期开始"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="观察期结束" prop="watchEnd">
        <el-input
          v-model="queryParams.watchEnd"
          placeholder="请输入观察期结束"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="加入计划名称" prop="joinPlanNo">
        <el-input
          v-model="queryParams.joinPlanNo"
          placeholder="请输入加入计划名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电子凭证编号" prop="documentNo">
        <el-input
          v-model="queryParams.documentNo"
          placeholder="请输入电子凭证编号"
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
          v-if="tabPosition == 2"
          type="primary"
          size="mini"
          @click="aKeyRemind('4')"
          >一键提醒</el-button
        >
        <el-button
          v-if="tabPosition == 3"
          type="primary"
          size="mini"
          @click="aKeyRemind('5')"
          >一键提醒</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['qzhz:Guarantor:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['qzhz:Guarantor:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['qzhz:Guarantor:export']"
        >导出</el-button>
      </el-col> -->
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table
      v-if="tabPosition == 1"
      v-loading="loading"
      :data="GuarantorList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="保障人姓名" align="center" prop="guarantorName" />
      <el-table-column label="身份证号" align="center" prop="guarantorIdCard" />
      <el-table-column label="加入日期" align="center" prop="joinDate" />
      <!-- <el-table-column label="账户余额" align="center" prop="balance" /> -->
      <el-table-column label="账户余额(元)" align="center" prop="balance">
        <template slot-scope="scope">
          <span v-if="scope.row.balance < 8" style="color: red">{{
            memberCostFormat(scope.row)
          }}</span>
          <span v-else>{{ memberCostFormat(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员等级" align="center" prop="memberName" />
      <el-table-column
        label="会员截止日期"
        align="center"
        prop="memberExpiryDate"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.memberExpiryDate">
            <span
              v-if="getDays(scope.row.memberExpiryDate) < 30"
              style="color: red"
              >{{ scope.row.memberExpiryDate }}</span
            >
            <span
              v-else-if="getDays(scope.row.memberExpiryDate) == 30"
              style="color: orange"
              >{{ scope.row.memberExpiryDate }}</span
            >
            <span v-else>{{ scope.row.memberExpiryDate }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="保障凭证状态"
        align="center"
        prop="voucherStatus"
        :formatter="voucherFormat"
      />
      <el-table-column label="分摊次数" align="center" prop="shartNum" />
      <el-table-column label="免密支付" align="center" prop="payoff">
        <template slot-scope="scope">
          <span v-if="scope.row.payoff == 0" style="color: red">{{
            payoffFormat(scope.row)
          }}</span>
          <span v-else>{{ payoffFormat(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否已理赔"
        align="center"
        prop="isSettlement"
        :formatter="isSettlementFormat"
      />
      <el-table-column label="用户手机号" align="center" prop="phone">
        <template slot-scope="scope">
          <span>{{ scope.row.phone != "null" ? scope.row.phone : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['qzhz:Guarantor:edit']"
            >查看</el-button> -->

          <router-link
            :to="'/Guarantor/type/data/' + scope.row.id"
            class="link-type"
          >
            <span>查看</span>
          </router-link>
          &nbsp;
          <el-button size="mini" type="text" @click="addBlackList(scope.row)"
            >加入黑名单</el-button
          >
        </template>
      </el-table-column>

      <!-- <el-table-column label="用户id" align="center" prop="userId" /> -->
      <!-- <el-table-column label="会员截止日期" align="center" prop="memberExpiryDate" />
      <el-table-column label="与注册人关系" align="center" prop="relation">
        <template slot-scope="scope">
          <span v-if="scope.row.relation == '1'">本人</span>
          <span v-if="scope.row.relation == '2'">爱人</span>
          <span v-if="scope.row.relation == '3'">子女</span>
          <span v-if="scope.row.relation == '4'">父母</span>
        </template>
      </el-table-column>
      <el-table-column label="观察期开始" align="center" prop="watchStart" />
      <el-table-column label="观察期结束" align="center" prop="watchEnd" />
      <el-table-column label="加入计划名称" align="center" prop="joinPlanNo" />
      <el-table-column label="电子凭证编号" align="center" prop="documentNo" /> -->
    </el-table>

    <el-table
      v-if="tabPosition == 2"
      v-loading="loading"
      :data="GuarantorList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="保障人姓名" align="center" prop="guarantorName" />
      <el-table-column label="身份证号" align="center" prop="guarantorIdCard" />
      <!-- <el-table-column label="账户余额" align="center" prop="balance" /> -->
      <el-table-column label="会员等级" align="center" prop="memberName" />
      <el-table-column label="账户余额(元)" align="center" prop="balance">
        <template slot-scope="scope">
          <span v-if="scope.row.balance < 8" style="color: red">{{
            memberCostFormat(scope.row)
          }}</span>
          <span v-else>{{ memberCostFormat(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="会员截止日期"
        align="center"
        prop="memberExpiryDate"
      >
        <template slot-scope="scope">
          <span
            v-if="getDays(scope.row.memberExpiryDate) < 30"
            style="color: red"
            >{{ scope.row.memberExpiryDate }}</span
          >
          <span
            v-else-if="getDays(scope.row.memberExpiryDate) == 30"
            style="color: orange"
            >{{ scope.row.memberExpiryDate }}</span
          >
          <span v-else>{{ scope.row.memberExpiryDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="免密支付" align="center" prop="payoff">
        <template slot-scope="scope">
          <span v-if="scope.row.payoff == 0" style="color: red">{{
            payoffFormat(scope.row)
          }}</span>
          <span v-else>{{ payoffFormat(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="保障凭证状态"
        align="center"
        prop="voucherStatus"
        :formatter="voucherFormat"
      />
      <el-table-column label="用户手机号" align="center" prop="phone">
        <template slot-scope="scope">
          <span>{{ scope.row.phone != "null" ? scope.row.phone : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div>
            <el-button size="mini" type="text" @click="phoneRemind1(scope.row)"
              >充值提醒</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-if="tabPosition == 3"
      v-loading="loading"
      :data="GuarantorList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="保障人姓名" align="center" prop="guarantorName" />
      <el-table-column label="身份证号" align="center" prop="guarantorIdCard" />
      <el-table-column label="会员等级" align="center" prop="memberName" />
      <el-table-column label="账户余额(元)" align="center" prop="balance">
        <template slot-scope="scope">
          <span v-if="scope.row.balance < 8" style="color: red">{{
            memberCostFormat(scope.row)
          }}</span>
          <span v-else>{{ memberCostFormat(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="会员截止日期"
        align="center"
        prop="memberExpiryDate"
      >
        <template slot-scope="scope">
          <span
            v-if="getDays(scope.row.memberExpiryDate) < 30"
            style="color: red"
            >{{ scope.row.memberExpiryDate }}</span
          >
          <span
            v-else-if="getDays(scope.row.memberExpiryDate) == 30"
            style="color: orange"
            >{{ scope.row.memberExpiryDate }}</span
          >
          <span v-else>{{ scope.row.memberExpiryDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="免密支付" align="center" prop="payoff">
        <template slot-scope="scope">
          <span v-if="scope.row.payoff == 0" style="color: red">{{
            payoffFormat(scope.row)
          }}</span>
          <span v-else>{{ payoffFormat(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="保障凭证状态"
        align="center"
        prop="voucherStatus"
        :formatter="voucherFormat"
      />
      <el-table-column label="用户手机号" align="center" prop="phone">
        <template slot-scope="scope">
          <span>{{ scope.row.phone != "null" ? scope.row.phone : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div v-if="tabPosition == 3">
            <el-button size="mini" type="text" @click="phoneRemind2(scope.row)"
              >充值提醒</el-button
            >
          </div>
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

    <!-- 添加或修改保障成员表对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :inline="true"
        label-width="120px"
      >
        <h2>
          保障人信息&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a v-if="!isEdit" style="font-size: 14px; color: blue" @click="edit"
            >编辑保障人</a
          >
          <a
            v-if="isEdit"
            style="font-size: 14px; color: blue"
            @click="cancelEdit"
            >取消编辑保障人</a
          >
          <a
            v-if="isEdit"
            style="font-size: 14px; color: blue; margin-left: 15px"
            @click="editRecord"
            >编辑记录</a
          >
        </h2>
        <el-form-item label="电子凭证编号" prop="documentNo">
          <span>{{ form.documentNo }}</span>
        </el-form-item>
        <el-form-item label="保障人姓名" prop="guarantorName">
          <span v-if="!isEdit">{{ form.guarantorName }}</span>
          <el-input
            v-if="isEdit"
            v-model="form.guarantorName"
            placeholder="请输入保障人姓名"
          />
        </el-form-item>
        <el-form-item label="加入计划名称" prop="joinPlanNo">
          <span>{{ form.joinPlanNo }}</span>
        </el-form-item>
        <el-form-item label="注册用户" prop="phone">
          <span>{{ form.phone }}</span>
        </el-form-item>
        <el-form-item label="凭证状态">
          <span>{{ voucherFormat(form) }}</span>
        </el-form-item>
        <el-form-item label="保障人身份证号" prop="guarantorIdCard">
          <span v-if="!isEdit">{{ form.guarantorIdCard }}</span>
          <el-input
            v-if="isEdit"
            v-model="form.guarantorIdCard"
            placeholder="请输入保障人身份证号"
          /> </el-form-item
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
          <span v-if="!isEdit">{{ form.remark }}</span>
          <el-input
            v-if="isEdit"
            type="textarea"
            v-model="form.remark"
          ></el-input>
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
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
  phoneRemind,
  aKeyRemind,
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
export default {
  name: "Guarantor",
  data() {
    return {
      isEdit: false,
      tabPosition: 1,
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
      // 保障成员表表格数据
      GuarantorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openEditRecord: false,
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
        selectType: 1,
        beginAmount1: null,
        endAmount1: null,
        beginTime: null,
        endTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
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
      // 编辑记录信息表格数据
      EditRecordList: [],
      voucherOptions: [], // 保障凭证状态
      isSettlementTrueOptions: [], // 是否理赔
      payoffOptions: [], // 免密支付
      memberLevelOptions: [], // 会员等级
      relationOptions: [], // 与注册人关系
      currentRow: {},
    };
  },
  created() {
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
    this.getList();
  },
  methods: {
    aKeyRemind(type) {
      const _this = this;
      let tip = "确定批量给账户低于8元的用户发送余额充值提醒？";
      if (type === "5") {
        tip = "确定批量给距离截止日期小于30天的用户发送会员充值提醒？";
      }
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        aKeyRemind(type).then((response) => {
          _this.msgSuccess("已发送充值提醒");
        });
      });
    },
    phoneRemind1(row) {
      phoneRemind({
        userId: row.userId,
        mid: row.mid,
        phone: row.phone,
        type: 4,
      }).then((response) => {
        this.msgSuccess("已发送充值提醒");
      });
    },
    phoneRemind2(row) {
      phoneRemind({
        userId: row.userId,
        mid: row.mid,
        phone: row.phone,
        type: 5,
      }).then((response) => {
        this.msgSuccess("已发送充值提醒");
      });
    },

    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    getDays(strDateEnd) {
      if (!strDateEnd) {
        return "";
      }
      var strDateStart = this.getNowFormatDate();
      var strSeparator = "-"; //日期分隔符
      var oDate1;
      var oDate2;
      var iDays;
      oDate1 = strDateStart.split(strSeparator);
      oDate2 = strDateEnd.split(strSeparator);
      var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
      var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
      iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
      return iDays;
    },
    // 一键提醒
    healthAlert() {},

    memberCostFormat(row, column) {
      return `${(row.balance / 100).toFixed(2)}`;
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
    /** 查询保障成员表列表 */
    getList() {
      this.loading = true;
      listGuarantor(this.queryParams).then((response) => {
        this.GuarantorList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    edit() {
      this.isEdit = true;
    },
    cancelEdit() {
      this.isEdit = false;
    },
    // 编辑记录
    editRecord() {
      /** 查询编辑记录信息列表 */
      this.loading = true;
      this.openEditRecord = true;
      this.queryParams.documentNo = this.currentRow.documentNo;
      this.queryParams.userId = this.currentRow.userId;

      listEditRecord(this.queryParams).then((response) => {
        this.EditRecordList = response.data;
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.endAmount = this.queryParams.endAmount1 * 100;
      this.queryParams.beginAmount = this.queryParams.beginAmount1 * 100;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.beginTime = null;
      this.queryParams.endTime = null;

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
      this.title = "添加保障成员表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.currentRow = row;
      const id = row.id || this.ids;
      getGuarantor(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "会员详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateGuarantor(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGuarantor(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    addBlackList(row) {
      const addData = {
        blackName: row.guarantorName,
        blackIdCard: row.guarantorIdCard,
        planNo: row.joinPlanNo,
      };

      isBlack({ blackIdCard: row.guarantorIdCard, planNo: row.joinPlanNo }).then((res) => {
        if (res.data.is_black) {
          this.$confirm(`该用户已在黑名单中，不能重复添加`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          });
        } else {
          const ids = row.id || this.ids;
          this.$confirm(
            `姓名：${row.guarantorName}，身份证号：${row.guarantorIdCard}，该保障人将被加入${row.joinPlanName}的黑名单，加入成功后将自动退出该计划，确定加入黑名单吗？`,
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
              this.getList();
              this.msgSuccess("加入黑名单成功");
            });
        }
        console.log(res);
      });
    },
    /** 删除按钮操作 */
    // handleDelete(row) {
    //   const ids = row.id || this.ids;
    //   this.$confirm('是否确认删除保障成员表编号为"' + ids + '"的数据项?', "警告", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }).then(function() {
    //       return delGuarantor(ids);
    //     }).then(() => {
    //       this.getList();
    //       this.msgSuccess("删除成功");
    //     })
    // },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有保障成员表数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportGuarantor(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },

    chinaIdentityValid: (rule, value, callback) => {
      if (!value) {
        return callback();
      }
      let city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外",
      };
      if (
        !value ||
        !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(
          value
        )
      ) {
        callback(new Error("身份证号格式错误"));
      } else if (!city[value.substr(0, 2)]) {
        callback(new Error("身份证号格式错误"));
      } else {
        // 18位身份证需要验证最后一位校验位
        if (value.length === 18) {
          const code = value.split("");
          // ∑(ai×Wi)(mod 11)
          // 加权因子
          const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
          // 校验位
          const parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
          let sum = 0;
          let ai = 0;
          let wi = 0;
          for (let i = 0; i < 17; i++) {
            ai = code[i];
            wi = factor[i];
            sum += ai * wi;
          }
          if (parity[sum % 11].toString() !== code[17]) {
            callback(new Error());
          }
        }
      }
      callback();
    },
  },
  watch: {
    tabPosition(val) {
      this.queryParams.beginTime = null;
      this.queryParams.endTime = null;
      this.resetForm("queryForm");

      this.queryParams.selectType = val;

      this.getList();
    },
  },
};
</script>

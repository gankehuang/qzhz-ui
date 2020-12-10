<template>
  <div class="app-container">
    
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!isEdit">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="handleUpdate"
          v-hasPermi="['qzhz:Membership:edit']"
        >编辑</el-button>
      </el-col>

      <div v-if="isEdit">
        <el-col :span="1.5">
          <el-button
            type="primary"
            size="mini"
            @click="submitForm"
            v-hasPermi="['qzhz:Membership:add']"
          >保存</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            size="mini"
            @click="handleCancel"
            v-hasPermi="['qzhz:Membership:add']"
          >取消</el-button>
        </el-col>
      </div>
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['qzhz:Membership:add']"
        >新增</el-button>
      </el-col>

      
     
      
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>
    <p class="tableTitle">计划年费</p>
    <p v-if="!isEdit">年费：90元/年</p>
    <p v-if="isEdit">年费：<el-input style="width: 150px;" placeholder="请输入会员费用" clearable size="small" />元/年</p>

    <p class="tableTitle">会员费用</p>
    <el-table v-loading="loading" :data="MembershipList" @selection-change="handleSelectionChange">
      <el-table-column label="会员等级名称" align="center" prop="memberName" />
      <el-table-column label="会员费用" align="center" prop="memberCost">
        <template slot-scope="scope">
          <span v-if="!isEdit">{{ memberCostFormat(scope.row.memberCost) }}</span>
          <el-input  v-if="isEdit"
          v-model="scope.row.memberCost"
          placeholder="请输入会员费用"
          clearable
          size="small"
          />
        </template>
      </el-table-column>
    </el-table>
    
    <div>
      <p class="tableTitle">互助范围</p>
      <el-table v-loading="loading" :data="hzList">
        <el-table-column label="年龄" align="center" prop="name1" />
        <el-table-column label="普通会员" align="center" prop="name2" />
        <el-table-column label="银卡会员" align="center" prop="name3" />
        <el-table-column label="金卡会员" align="center" prop="name4" />
      </el-table>
    </div>
      

    <p class="tableTitle">观察期</p>
    <p v-if="!isEdit">观察期天数180天</p>
    <p v-if="isEdit">观察期天数：<el-input style="width: 150px;" placeholder="请输入会员费用" clearable size="small" />天</p>
    <div class="ftgs">
      <div style="padding-top: 30px;">分摊公式：本期每人分摊金额&nbsp;=&nbsp;</div>
      <div style="height: 100px;">
        <p>本期互助总额*（1+管理费率）</p>
        <p style="border-top: 1px solid black;">本期参与会员人数</p>
      </div>
    </div>
   
    <!-- 添加或修改会员费用对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="计划id" prop="planNo">
          <el-input v-model="form.planNo" placeholder="请输入计划id" />
        </el-form-item>
        <el-form-item label="会员等级编号" prop="memberNo">
          <el-input v-model="form.memberNo" placeholder="请输入会员等级编号" />
        </el-form-item>
        <el-form-item label="会员等级名称" prop="memberName">
          <el-input v-model="form.memberName" placeholder="请输入会员等级名称" />
        </el-form-item>
        <el-form-item label="会员费用" prop="memberCost">
          <el-input v-model="form.memberCost" placeholder="请输入会员费用" />
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
import { listMembership, batUpdateMembership,listMemberships, getMembership, delMembership, addMembership, updateMembership, exportMembership } from "@/api/qzhz/Membership";

export default {
  name: "Membership",
  data() {
    return {
      isEdit: false,
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
      // 会员费用表格数据
      MembershipList: [],
      hzList: [
        {name1: '30天 ~ 40岁', name2: '互助金最高30万', name3: '互助金最高30万', name4: '互助金最高50万'},
        {name1: '41天 ~ 50岁', name2: '互助金最高20万', name3: '互助金最高20万', name4: '互助金最高30万'},
        {name1: '50天 ~ 65岁', name2: '互助金最高10万', name3: '互助金最高10万', name4: '互助金最高15万'}
      ],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        planNo: 'PLAN_1603724831104'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        planNo: [
          { required: true, message: "计划id不能为空", trigger: "blur" }
        ],
        memberNo: [
          { required: true, message: "会员等级编号不能为空", trigger: "blur" }
        ],
        memberName: [
          { required: true, message: "会员等级名称不能为空", trigger: "blur" }
        ],
        memberCost: [
          { required: true, message: "会员费用不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    memberCostFormat(row, column) {
      return `¥${(row/100).toFixed(2)}`;
    },
    /** 查询会员费用列表 */
    getList() {
      this.loading = true;
      listMemberships(this.queryParams).then(response => {
        this.MembershipList = response.data;
        this.total = response.total;
        this.loading = false;
      });
    },

    handleCancel() {
      this.isEdit = false;
    },
    
    
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.isEdit = true;
      
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.MembershipList);
      
      batUpdateMembership(this.MembershipList).then(response => {
        this.msgSuccess("修改成功");
        this.open = false;
        this.getList();
      });
          
    },
    
  }
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

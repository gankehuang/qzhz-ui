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
      <el-form-item label="黑名单姓名" prop="blackName">
        <el-input
          v-model="queryParams.blackName"
          placeholder="请输入黑名单姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="黑名单身份证" prop="blackIdCard">
        <el-input
          v-model="queryParams.blackIdCard"
          placeholder="请输入黑名单身份证"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="所属计划" prop="planNo"> 
        <el-select v-model="queryParams.planNo" placeholder="请选择所属计划" clearable size="small">
          <el-option v-for="dict in planOptions"
            :key="dict.planNo"
            :label="dict.planName"
            :value="dict.planNo"/>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['qzhz:Blacklist:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['qzhz:Blacklist:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['qzhz:Blacklist:remove']"
        >移除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['qzhz:Blacklist:export']"
        >导出</el-button>
      </el-col> -->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="BlacklistList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="黑名单姓名" align="center" prop="blackName" />
      <el-table-column label="黑名单身份证" align="center" prop="blackIdCard" />
      <el-table-column label="所属计划" align="center" prop="planNo" :formatter="planFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['qzhz:Blacklist:edit']"
          >修改</el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['qzhz:Blacklist:remove']"
          >移除</el-button>
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

    <!-- 添加或修改黑名单对话框 -->
    <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="黑名单姓名" prop="blackName">
          <el-input v-model="form.blackName" placeholder="请输入黑名单姓名" />
        </el-form-item>
        <el-form-item label="黑名单身份证" prop="blackIdCard">
          <el-input v-model="form.blackIdCard" placeholder="请输入黑名单身份证" />
        </el-form-item>
        <el-form-item label="所属计划" prop="planNo">
          <el-select v-model="form.planNo" placeholder="请选择所属计划" clearable size="small">
            <el-option v-for="dict in planOptions"
              :key="dict.planNo"
              :label="dict.planName"
              :value="dict.planNo"/>
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
import { listBlacklist, getBlacklist, delBlacklist, addBlacklist, updateBlacklist, exportBlacklist, planList } from "@/api/qzhz/Blacklist";

export default {
  name: "Blacklist",
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
      // 黑名单表格数据
      BlacklistList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        blackName: null,
        blackIdCard: null,
        planNo: null,
        phone: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        blackIdCard: [
          { validator: this.chinaIdentityValid, trigger: 'blur' },
          { required: true, message: "身份证不能为空", trigger: "blur" },
        ],
        blackName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        planNo: [
          { required: true, message: "计划不能为空", trigger: "blur" },
        ],
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
    planFormat(row, column) {
      let list = this.planOptions;
      for(let i=0; i<list.length; i++) {
        if (list[i].planNo == row.planNo) {
          return list[i].planName;
          break;
        }
      }
    },
    /** 查询黑名单列表 */
    getList() {
      this.loading = true;
      listBlacklist(this.queryParams).then(response => {
        this.BlacklistList = response.rows;
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
        blackName: null,
        blackIdCard: null,
        planNo: null,
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
      this.title = "添加黑名单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBlacklist(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改黑名单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBlacklist(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBlacklist(this.form).then(response => {
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
      this.$confirm(`移除后，身份证号为${row.blackIdCard}的用户可正常加入${this.planFormat(row)}，确认要移除黑名单吗?`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBlacklist(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有黑名单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportBlacklist(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
    chinaIdentityValid: (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      let city = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江 ',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北 ',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏 ',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: '新疆',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外'
      }
      if (!value || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)) {
        callback(new Error('身份证号格式错误'))
      } else if (!city[value.substr(0, 2)]) {
        callback(new Error('身份证号格式错误'))
      } else {
        // 18位身份证需要验证最后一位校验位
        if (value.length === 18) {
          const code = value.split('')
          // ∑(ai×Wi)(mod 11)
          // 加权因子
          const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
          // 校验位
          const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
          let sum = 0
          let ai = 0
          let wi = 0
          for (let i = 0; i < 17; i++) {
            ai = code[i]
            wi = factor[i]
            sum += ai * wi
          }
          if (parity[sum % 11].toString() !== code[17]) {
            callback(new Error())
          }
        }
      }
      callback()
    }
  }
};
</script>

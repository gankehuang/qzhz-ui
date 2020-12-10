<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="跳转类型" prop="jumpType">
        <el-select v-model="queryParams.jumpType" placeholder="请选择跳转类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
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
          v-hasPermi="['qzhz:Banner:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['qzhz:Banner:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['qzhz:Banner:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['qzhz:Banner:export']"
        >导出</el-button>
      </el-col> -->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="BannerList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="描述" align="center" prop="remark" />
      <el-table-column label="图片" align="center" prop="img">
        <template slot-scope="scope">
          <img style="width: 100px" :src="scope.row.img" alt="">
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="bannerType">
        <template slot-scope="scope">
          <span>{{ scope.row.bannerType == 0 ? '广告页' : scope.row.bannerType == 1 ? '个人中心页' : '了解计划' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"/>
      <!-- <el-table-column label="跳转类型" align="center" prop="jumpType" /> -->
      <!-- <el-table-column label="跳转路径" align="center" prop="jumpUrl" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['qzhz:Banner:edit']"
          >修改</el-button>

          <el-button v-if="scope.row.status == 0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateStatus(scope.row)"
          >上架</el-button>
          <el-button v-if="scope.row.status == 1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdateStatus(scope.row)"
          >下架</el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['qzhz:Banner:remove']"
          >删除</el-button>
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

    <!-- 添加或修改广告位管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="广告描述" prop="remark">
          <el-input v-model="form.remark" maxlength="50" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        
        <el-form-item label="广告图片" prop="img">
          <!-- <userAvatar :user="form" /> -->
          <el-upload
            class="avatar-uploader"
            :action="url"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.img" :src="form.img" style="width:100px;" class="avatar">
            <i v-else class=" avatar-uploader-icon">点击上传图片</i>
          </el-upload>

        </el-form-item>
        
        <el-form-item label="跳转" prop="jumpType">
          <el-select v-model="form.jumpType" placeholder="请选择跳转类型">
            <!-- <el-option label="请选择字典生成" value="" /> -->
            <el-option v-for="dict in jumpTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转路径" prop="jumpUrl">
          <el-input v-if="form.jumpType==1" v-model="form.jumpUrl" placeholder="请输入跳转路径" />
          <el-select v-if="form.jumpType==2" v-model="form.jumpUrl" placeholder="请选择所属计划" clearable size="small">
            <el-option v-for="dict in planOptions"
              :key="dict.planNo"
              :label="dict.planName"
              :value="dict.planNo"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否立即上架">
          <el-radio-group v-model="form.status">
            <el-radio 
            v-for="dict in statusOptions" 
            :key="dict.dictValue"
            :label="dict.dictValue">{{dict.dictValue == 1 ? '上架':'下架'}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.bannerType">
            <el-radio label="0">广告页</el-radio>
            <el-radio label="1">个人中心页</el-radio>
            <el-radio label="2">了解计划</el-radio>
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
import { listBanner, getBanner, delBanner, addBanner, updateBanner, exportBanner } from "@/api/qzhz/Banner";
import { uploadAvatar, uploadAvatarImg } from "@/api/system/user";
import { planList } from "@/api/qzhz/Blacklist";
export default {
  name: "Banner",
  data() {
    return {
      url: '',
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
      // 广告位管理表格数据
      BannerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sort: null,
        img: null,
        status: null,
        jumpType: null,
        jumpUrl: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "描述不能为空", trigger: "blur" },
        ],
        img: [
          { required: true, message: "图片不能为空", trigger: "blur" },
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" },
        ],
        jumpType: [
          { required: true, message: "跳转类型不能为空", trigger: "blur" },
        ]
      },
      statusOptions: [],   // 状态
      jumpTypeOptions: [], // 跳转类型
      planOptions: [],  // 计划列表

    };
  },
  created() {
    this.url = `${process.env.VUE_APP_BASE_API}/common/upload`
    this.getList();
    this.getDicts("QZHZ_BANNER_STATUS").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("QZHZ_JUMP_TYPE").then(response => {
      this.jumpTypeOptions = response.data;
    });
    planList({}).then(response => {
      this.planOptions = response.data;
    });
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.form.img = file.response.url;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },


    // 上传预处理
    beforeUpload(file) {
      if (file.type.indexOf("image/") == -1) {
        this.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.form.img = reader.result;
          this.uploadImg();
        };
      }
    },
    // 上传图片
    uploadImg() {
      //this.$refs.cropper.getCropBlob(data => {
        let formData = new FormData();
        formData.append("avatarfile", this.form.img);
        uploadAvatar(formData).then(response => {
          this.open = false;
          this.form.img = process.env.VUE_APP_BASE_API + response.imgUrl;
          this.msgSuccess("上传成功");
          this.visible = false;
        });
      //});
    },
    // 覆盖默认的上传行为
    requestUpload() {
    },
    
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 查询广告位管理列表 */
    getList() {
      this.loading = true;
      listBanner(this.queryParams).then(response => {
        this.BannerList = response.rows;
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
        sort: null,
        remark: null,
        img: null,
        status: "0",
        bannerType: "0",
        jumpType: null,
        jumpUrl: null,
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
      this.form.status = '1';
      this.form.bannerType = "0";
      this.title = "添加轮播广告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBanner(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改轮播广告";
      });
    },

    handleUpdateStatus(row) {
      const _this = this
      let tip;
      if (row.status == 0) {
        tip = '上架后，移动端将恢复展示该广告图，确认要上架该广告图吗？'
      } else {
        tip = '下架后，移动端将不展示该广告图，可以通过上架恢复移动端展示，确认要下架该广告图吗?';
      }
      
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        _this.handleUpdateStatus1(row);
      })
    },

    // 上架，下架
    handleUpdateStatus1(row) {
      console.log(row);
      let obj = {id: row.id, status: row.status}
      obj.status = row.status === '1' ? '0' : '1';
      updateBanner(obj).then(response => {
        this.msgSuccess("操作成功");
        this.getList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBanner(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBanner(this.form).then(response => {
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
      this.$confirm('删除后，移动端将不展示该广告图，确认要删除轮播图吗？', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBanner(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有广告位管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportBanner(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>

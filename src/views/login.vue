<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">全总互助管理端</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="codeStatus">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <!-- <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox> -->
      <span class="forgetPsd" @click="forgetPsd" style="margin-bottom: 10px;">忘记密码</span>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 忘记密码弹出框 -->
    <el-dialog title="忘记密码" :visible.sync="editVisible_forgetPsd" width="40%">
        <el-steps :active="activeType" align-center>
            <el-step title="手机号验证"></el-step>
            <el-step title="设置新密码"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>
        <el-form v-if="activeType == 1" ref="form_edit" :rules="rules_forgetPsd" :model="form_forgetPsd" style="width: 80%; margin: auto; margin-top: 15px;">
            <el-form-item prop="phoneNumber">
                <el-input v-model="form_forgetPsd.phoneNumber" placeholder="请输入登录手机号">
                    <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>
            <el-form-item prop="phoneCode" class="pr">
                <el-input placeholder="短信验证码"  v-model="form_forgetPsd.phoneCode"></el-input>
                <button @click.prevent="getCode2()"  class="code-btn" :disabled="!show">
                    <span v-show="show">获取验证码</span>
                    <span v-show="!show" class="count">{{count}} s</span>
                </button>
            </el-form-item>
            <div class="login-btn">
                <el-button style="width: 45%" @click="editVisible_forgetPsd = false">取 消</el-button>
                <el-button style="width: 45%" type="primary" @click="next1()">下一步</el-button>
            </div>
        </el-form>

        <el-form v-if="activeType == 2" ref="form_edit" :rules="rules_edit" :model="form_edit">
            <el-form-item prop="password" style="width: 70%; margin: 10px auto;">
                <el-input type="password" v-model="form_edit.password" placeholder="请设置新的登录密码">
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>
            <el-form-item prop="rpassword" style="width: 70%; margin: 10px auto;">
                <el-input type="password" placeholder="请再次输入新的登录密码" v-model="form_edit.rpassword" @keyup.enter.native="submitForm_edit('rule_edit')">
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>
            <div class="login-btn">
                <el-button style="width: 30%" @click="pre">上一步</el-button>
                <el-button style="width: 30%" type="primary"  @click="next2()">下一步</el-button>
            </div>
        </el-form>

        <div v-if="activeType == 3" style="text-align: center;">
            <img style="width: 60px;" src="../assets/image/lendmoneyresult.png" alt="">
            <p>密码重置成功，请返回登录页重新登录！</p>
            <div class="login-btn" style="margin-top: 10px;">
                <el-button style="width: 20%" type="primary" @click="finsh">确定</el-button>
            </div>
        </div>
    </el-dialog>

    <!-- 修改密码弹出框 -->
    <el-dialog title="修改密码" :visible.sync="editVisible" width="30%" style="padding: 0 30px">
        <el-form ref="form_edit" :rules="rules_edit" :model="form_edit">
            <el-form-item prop="password">
                <el-input type="password" v-model="form_edit.password" placeholder="请设置新的登录密码">
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>
            <el-form-item prop="rpassword">
                <el-input type="password" placeholder="请再次输入新的登录密码" v-model="form_edit.rpassword" @keyup.enter.native="submitForm_edit('rule_edit')">
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                </el-input>
            </el-form-item>
            <div class="login-btn">
                <el-button type="primary" @click="submitForm_edit('form_edit')">确认修改</el-button>
            </div>
        </el-form>
    </el-dialog>
    
  </div>
</template>

<script>
import { getCodeImg, getPhoneCode, getPhoneCodeNext, resetPwd, isFirstLogin, editPwd } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      codeStatus: false,
      handlerNum: 0,
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined,
      // 忘记密码
      show: true,
      count: '',
      timer: '',
      activeType: 1,
      form_forgetPsd: {
          phoneNumber: '',
          phoneCode: ''
      },
      rules_forgetPsd: {
          phoneNumber: [
              { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          phoneCode: [
              { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
      },
      editVisible_forgetPsd: false,
      // 修改密码
      form_edit: {
          password: '',
          rpassword: ''
      },
      rules_edit: {
          password: [
              { required: true, message: '密码由6-26位英文字母和数字组成', trigger: 'blur' }
          ],
          rpassword: [
              { required: true, message: '请再次输入密码', trigger: 'blur' }
          ]
      },
      editVisible: false,
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    
    // 忘记密码
    forgetPsd() {
        this.editVisible_forgetPsd = true;
        this.activeType = 1;
    },
    // 获取短信验证码
    getCode2() {       //axios请求
      getPhoneCode(this.form_forgetPsd.phoneNumber)
      .then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          // 验证码倒计时
          if (!this.timer) {
              this.count = 120;
              this.show = false;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= 120) {
                    this.count--;
                } else {
                    this.show = true;
                    clearInterval(this.timer);
                    this.timer = null;
                }
              }, 1000);
          }
        }
        
      })
      
    },
    pre() {
        this.activeType = 1;
    },
    next1() {
      getPhoneCodeNext(this.form_forgetPsd.phoneNumber, this.form_forgetPsd.phoneCode)
      .then((res) => {
        this.activeType = 2;
      })
        
    },
    next2() {
      if (this.form_edit.password !== this.form_edit.rpassword) {
        this.$message.error('两次密码输入不一致');
        return;
      }
      resetPwd(this.form_edit.password, this.form_edit.rpassword, this.form_forgetPsd.phoneNumber)
      .then((res) => {
        this.activeType = 3;
      })
    },
    finsh() {
        this.editVisible_forgetPsd = false;
        this.activeType = 1;
    },
    submitForm_edit() {
      editPwd(this.loginForm.username, this.form_edit.password, this.form_edit.rpassword, 'qz')
      .then(res => {
        if (res.code === 200) {
          this.editVisible = false;
          this.loading = false;
          this.$message.success('密码修改成功！');
        }
      })
    },

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          isFirstLogin(this.loginForm.username)
              .then((res) => {
                if (res.data.is_first_login) {
                  this.editVisible = true;
                } else {
                  this.$store
                    .dispatch("Login", this.loginForm)
                    .then(() => {
                          if (this.loginForm.rememberMe) {
                            Cookies.set("username", this.loginForm.username, { expires: 30 });
                            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
                            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
                          } else {
                            Cookies.remove("username");
                            Cookies.remove("password");
                            Cookies.remove('rememberMe');
                          }
                          this.$router.push({ path: this.redirect || "/" });
                    })
                    .catch(() => {
                      this.handlerNum++
                      this.loading = false;
                      this.getCode();
                    });
                }
              })

          // this.$store
          //   .dispatch("Login", this.loginForm)
          //   .then(() => {
          //     isFirstLogin(this.loginForm.username)
          //     .then((res) => {
          //       if (res.data.is_first_login) {
          //         this.editVisible = true;
          //       } else {
          //         if (this.loginForm.rememberMe) {
          //           Cookies.set("username", this.loginForm.username, { expires: 30 });
          //           Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
          //           Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          //         } else {
          //           Cookies.remove("username");
          //           Cookies.remove("password");
          //           Cookies.remove('rememberMe');
          //         }
          //         this.$router.push({ path: this.redirect || "/" });
          //       }
          //     })
          //   })
          //   .catch(() => {
          //     this.handlerNum++
          //     this.loading = false;
          //     this.getCode();
          //   });
        }
      });
    }
  },
  watch: {
    handlerNum(val) {
      if (val == 2) {
        this.codeStatus = true;
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/image/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
  .forgetPsd {
    position: relative;
    z-index: 30;
    right: 10px;
    float: right; 
    font-size: 14px; 
    color: blue; 
    cursor: pointer;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}

.pr {
    position: relative;
}
.code-btn {
    width: 100px;
    height: 20px;
    position: absolute;
    top: 6px;
    right: 5px;
    z-index: 222;
    color: #ef8466;
    font-size: 14px;
    border: none;
    border-left: 1px solid #bababa;
    padding-left: 10px;
    background-color: #fff;
    cursor: pointer;
}
.login-btn{
    text-align: center;
}
.login-btn button{
    width:100%;
    height:36px;
    margin-bottom: 10px;
}
</style>

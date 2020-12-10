import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get'
  })
}

// 获取手机验证码
export function getPhoneCode(phone) {
  const data = {
    phone
  }
  return request({
    url: '/system/user/sendSms',
    method: 'post',
    data: data
  })
}

// 手机验证码下一步
export function getPhoneCodeNext(phone, code) {
  const data = {
    phone,
    code
  }
  return request({
    url: '/system/user/checkSendSms',
    method: 'post',
    data: data
  })
}

// 重置密码下一步
export function resetPwd(pwd1, pwd2, phone) {
  const data = {
    pwd1,
    pwd2,
    phone
  }
  return request({
    url: '/system/user/loginResetPwd',
    method: 'post',
    data: data
  })
}

// 首次登陆重置密码
export function isFirstLogin(phone) {
  const data = {
    phone
  }
  return request({
    url: '/system/user/isFirstLogin',
    method: 'post',
    data: data
  })
}

// 首次登陆重置密码
export function editPwd(phone, pwd1, pwd2, type) {
  const data = {
    phone,
    pwd1,
    pwd2,
    type
  }
  return request({
    url: '/system/user/loginResetPwd',
    method: 'post',
    data: data
  })
}

import request from '@/utils/request'

// 查询用户信息表列表
export function listUserInfo(query) {
  return request({
    url: '/qzhz/UserInfo/list',
    method: 'get',
    params: query
  })
}

// 查询用户信息表详细
export function getUserInfo(id) {
  return request({
    url: '/qzhz/UserInfo/' + id,
    method: 'get'
  })
}

// 新增用户信息表
export function addUserInfo(data) {
  return request({
    url: '/qzhz/UserInfo',
    method: 'post',
    data: data
  })
}

// 修改用户信息表
export function updateUserInfo(data) {
  return request({
    url: '/qzhz/UserInfo',
    method: 'put',
    data: data
  })
}

// 删除用户信息表
export function delUserInfo(id) {
  return request({
    url: '/qzhz/UserInfo/' + id,
    method: 'delete'
  })
}

// 导出用户信息表
export function exportUserInfo(query) {
  return request({
    url: '/qzhz/UserInfo/export',
    method: 'get',
    params: query
  })
}
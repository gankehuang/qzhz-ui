import request from '@/utils/request'

// 查询黑名单列表
export function listBlacklist(query) {
  return request({
    url: '/qzhz/Blacklist/list',
    method: 'get',
    params: query
  })
}

export function planList(data) {
  return request({
    url: '/qzhz-web/getPlan',
    method: 'post',
    data: data
  })
}

// 查询黑名单详细
export function getBlacklist(id) {
  return request({
    url: '/qzhz/Blacklist/' + id,
    method: 'get'
  })
}

// 新增黑名单
export function addBlacklist(data) {
  return request({
    url: '/qzhz/Blacklist',
    method: 'post',
    data: data
  })
}
// 是否黑名单
export function isBlack(data) {
  return request({
    url: '/qzhz-app/isBlackUser',
    method: 'post',
    data: data
  })
}

// 修改黑名单
export function updateBlacklist(data) {
  return request({
    url: '/qzhz/Blacklist',
    method: 'put',
    data: data
  })
}

// 删除黑名单
export function delBlacklist(id) {
  return request({
    url: '/qzhz/Blacklist/' + id,
    method: 'delete'
  })
}

// 导出黑名单
export function exportBlacklist(query) {
  return request({
    url: '/qzhz/Blacklist/export',
    method: 'get',
    params: query
  })
}
import request from '@/utils/request'

// 查询计划信息列表
export function listPlan(query) {
  return request({
    url: '/qzhz/Plan/list',
    method: 'get',
    params: query
  })
}

// 查询计划信息详细
export function getPlan(id) {
  return request({
    url: '/qzhz/Plan/' + id,
    method: 'get'
  })
}

// 新增计划信息
export function addPlan(data) {
  return request({
    url: '/qzhz/Plan',
    method: 'post',
    data: data
  })
}

// 修改计划信息
export function updatePlan(data) {
  return request({
    url: '/qzhz/Plan',
    method: 'put',
    data: data
  })
}

// 删除计划信息
export function delPlan(id) {
  return request({
    url: '/qzhz/Plan/' + id,
    method: 'delete'
  })
}

// 导出计划信息
export function exportPlan(query) {
  return request({
    url: '/qzhz/Plan/export',
    method: 'get',
    params: query
  })
}
import request from '@/utils/request'

// 查询争议记录管理列表
export function listDispute(query) {
  return request({
    url: '/qzhz/Dispute/list',
    method: 'get',
    params: query
  })
}

// 查询争议记录管理详细
export function getDispute(id) {
  return request({
    url: '/qzhz/Dispute/' + id,
    method: 'get'
  })
}

// 新增争议记录管理
export function addDispute(data) {
  return request({
    url: '/qzhz/Dispute',
    method: 'post',
    data: data
  })
}

// 修改争议记录管理
export function updateDispute(data) {
  return request({
    url: '/qzhz/Dispute',
    method: 'put',
    data: data
  })
}

// 删除争议记录管理
export function delDispute(id) {
  return request({
    url: '/qzhz/Dispute/' + id,
    method: 'delete'
  })
}

// 导出争议记录管理
export function exportDispute(query) {
  return request({
    url: '/qzhz/Dispute/export',
    method: 'get',
    params: query
  })
}
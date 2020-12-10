import request from '@/utils/request'

// 查询编辑记录信息列表
export function listEditRecord(query) {
  return request({
    url: '/qzhz/EditRecord/list',
    method: 'get',
    params: query
  })
}

// 查询编辑记录信息详细
export function getEditRecord(id) {
  return request({
    url: '/qzhz/EditRecord/' + id,
    method: 'get'
  })
}

// 新增编辑记录信息
export function addEditRecord(data) {
  return request({
    url: '/qzhz/EditRecord',
    method: 'post',
    data: data
  })
}

// 修改编辑记录信息
export function updateEditRecord(data) {
  return request({
    url: '/qzhz/EditRecord',
    method: 'put',
    data: data
  })
}

// 删除编辑记录信息
export function delEditRecord(id) {
  return request({
    url: '/qzhz/EditRecord/' + id,
    method: 'delete'
  })
}

// 导出编辑记录信息
export function exportEditRecord(query) {
  return request({
    url: '/qzhz/EditRecord/export',
    method: 'get',
    params: query
  })
}
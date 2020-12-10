import request from '@/utils/request'

// 查询支付流水记录表列表
export function listPayRecord(query) {
  return request({
    url: '/qzhz/PayRecord/list',
    method: 'get',
    params: query
  })
}

// 查询支付流水记录表详细
export function getPayRecord(id) {
  return request({
    url: '/qzhz/PayRecord/' + id,
    method: 'get'
  })
}

// 新增支付流水记录表
export function addPayRecord(data) {
  return request({
    url: '/qzhz/PayRecord',
    method: 'post',
    data: data
  })
}

// 修改支付流水记录表
export function updatePayRecord(data) {
  return request({
    url: '/qzhz/PayRecord',
    method: 'put',
    data: data
  })
}

// 删除支付流水记录表
export function delPayRecord(id) {
  return request({
    url: '/qzhz/PayRecord/' + id,
    method: 'delete'
  })
}

// 导出支付流水记录表
export function exportPayRecord(query) {
  return request({
    url: '/qzhz/PayRecord/export',
    method: 'get',
    params: query
  })
}
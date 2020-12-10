import request from '@/utils/request'

// 查询支付代扣协议表列表
export function listPayProtocol(query) {
  return request({
    url: '/qzhz/PayProtocol/list',
    method: 'get',
    params: query
  })
}

// 查询支付代扣协议表详细
export function getPayProtocol(id) {
  return request({
    url: '/qzhz/PayProtocol/' + id,
    method: 'get'
  })
}

// 新增支付代扣协议表
export function addPayProtocol(data) {
  return request({
    url: '/qzhz/PayProtocol',
    method: 'post',
    data: data
  })
}

// 修改支付代扣协议表
export function updatePayProtocol(data) {
  return request({
    url: '/qzhz/PayProtocol',
    method: 'put',
    data: data
  })
}

// 删除支付代扣协议表
export function delPayProtocol(id) {
  return request({
    url: '/qzhz/PayProtocol/' + id,
    method: 'delete'
  })
}

// 导出支付代扣协议表
export function exportPayProtocol(query) {
  return request({
    url: '/qzhz/PayProtocol/export',
    method: 'get',
    params: query
  })
}
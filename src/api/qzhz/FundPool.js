import request from '@/utils/request'

// 查询资金池表列表
export function listFundPool(query) {
  return request({
    url: '/qzhz/FundPool/list',
    method: 'get',
    params: query
  })
}

export function totalList(query) {
  return request({
    url: '/qzhz/CapitalStatistics/listOne',
    method: 'get',
    params: query
  })
}

// 查询资金池表详细
export function getFundPool(id) {
  return request({
    url: '/qzhz/FundPool/' + id,
    method: 'get'
  })
}

// 新增资金池表
export function addFundPool(data) {
  return request({
    url: '/qzhz/FundPool',
    method: 'post',
    data: data
  })
}

// 修改资金池表
export function updateFundPool(data) {
  return request({
    url: '/qzhz/FundPool',
    method: 'put',
    data: data
  })
}

// 删除资金池表
export function delFundPool(id) {
  return request({
    url: '/qzhz/FundPool/' + id,
    method: 'delete'
  })
}

// 导出资金池表
export function exportFundPool(query) {
  return request({
    url: '/qzhz/FundPool/export',
    method: 'get',
    params: query
  })
}
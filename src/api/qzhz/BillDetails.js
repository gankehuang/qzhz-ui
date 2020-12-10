import request from '@/utils/request'

// 查询账单信息列表
export function listBillDetails(query) {
  return request({
    url: '/qzhz/BillDetails/list',
    method: 'get',
    params: query
  })
}

// 查询账单信息详细
export function getBillDetails(id) {
  return request({
    url: '/qzhz/BillDetails/' + id,
    method: 'get'
  })
}

// 新增账单信息
export function addBillDetails(data) {
  return request({
    url: '/qzhz/BillDetails',
    method: 'post',
    data: data
  })
}

// 修改账单信息
export function updateBillDetails(data) {
  return request({
    url: '/qzhz/BillDetails',
    method: 'put',
    data: data
  })
}

// 删除账单信息
export function delBillDetails(id) {
  return request({
    url: '/qzhz/BillDetails/' + id,
    method: 'delete'
  })
}

// 导出账单信息
export function exportBillDetails(query) {
  return request({
    url: '/qzhz/BillDetails/export',
    method: 'get',
    params: query
  })
}
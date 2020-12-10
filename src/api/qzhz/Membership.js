import request from '@/utils/request'

// 查询会员费用列表
export function listMembership(query) {
  return request({
    url: '/qzhz/Membership/list',
    method: 'get',
    params: query
  })
}

export function listMemberships(data) {
  return request({
    url: '/qzhz/Membership/getMembershipFees',
    method: 'post',
    data: data
  })
}

// 查询会员费用详细
export function getMembership(id) {
  return request({
    url: '/qzhz/Membership/' + id,
    method: 'get'
  })
}

// 新增会员费用
export function addMembership(data) {
  return request({
    url: '/qzhz/Membership',
    method: 'post',
    data: data
  })
}

// 修改会员费用
export function updateMembership(data) {
  return request({
    url: '/qzhz/Membership',
    method: 'put',
    data: data
  })
}

export function batUpdateMembership(data) {
  return request({
    url: '/qzhz/Membership/batUpdateMembership',
    method: 'post',
    data: data
  })
}


// 删除会员费用
export function delMembership(id) {
  return request({
    url: '/qzhz/Membership/' + id,
    method: 'delete'
  })
}

// 导出会员费用
export function exportMembership(query) {
  return request({
    url: '/qzhz/Membership/export',
    method: 'get',
    params: query
  })
}
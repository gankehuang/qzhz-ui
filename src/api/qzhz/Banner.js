import request from '@/utils/request'

// 查询广告位管理列表
export function listBanner(query) {
  return request({
    url: '/qzhz/Banner/list',
    method: 'get',
    params: query
  })
}

// 查询广告位管理详细
export function getBanner(id) {
  return request({
    url: '/qzhz/Banner/' + id,
    method: 'get'
  })
}

// 新增广告位管理
export function addBanner(data) {
  return request({
    url: '/qzhz/Banner',
    method: 'post',
    data: data
  })
}

// 修改广告位管理
export function updateBanner(data) {
  return request({
    url: '/qzhz/Banner',
    method: 'put',
    data: data
  })
}

// 删除广告位管理
export function delBanner(id) {
  return request({
    url: '/qzhz/Banner/' + id,
    method: 'delete'
  })
}

// 导出广告位管理
export function exportBanner(query) {
  return request({
    url: '/qzhz/Banner/export',
    method: 'get',
    params: query
  })
}
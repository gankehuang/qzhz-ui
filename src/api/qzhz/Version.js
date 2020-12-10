import request from '@/utils/request'

// 查询版本信息表列表
export function listVersion(query) {
  return request({
    url: '/qzhz/Version/list',
    method: 'get',
    params: query
  })
}

// 查询版本信息表详细
export function getVersion(id) {
  return request({
    url: '/qzhz/Version/' + id,
    method: 'get'
  })
}

// 新增版本信息表
export function addVersion(data) {
  return request({
    url: '/qzhz/Version',
    method: 'post',
    data: data
  })
}

// 修改版本信息表
export function updateVersion(data) {
  return request({
    url: '/qzhz/Version',
    method: 'put',
    data: data
  })
}

// 删除版本信息表
export function delVersion(id) {
  return request({
    url: '/qzhz/Version/' + id,
    method: 'delete'
  })
}

// 导出版本信息表
export function exportVersion(query) {
  return request({
    url: '/qzhz/Version/export',
    method: 'get',
    params: query
  })
}
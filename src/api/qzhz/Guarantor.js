import request from '@/utils/request'

// 查询保障成员表列表
export function listGuarantor(query) {
  return request({
    url: '/qzhz/Guarantor/list',
    method: 'get',
    params: query
  })
}

// 查询保障成员表详细
export function getGuarantor(id) {
  return request({
    url: '/qzhz/Guarantor/' + id,
    method: 'get'
  })
}

export function getGuarantor1(id) {
  return request({
    url: '/qzhz/Guarantor/getInfoMy/' + id,
    method: 'get'
  })
}


// 新增保障成员表
export function addGuarantor(data) {
  return request({
    url: '/qzhz/Guarantor',
    method: 'post',
    data: data
  })
}

// 充值提醒
export function phoneRemind(data) {
  return request({
    url: '/qzhz/SmsLog/sendSms',
    method: 'post',
    data: data
  })
}
// 一键提醒
export function aKeyRemind(data) {
  return request({
    url: '/qzhz/SmsLog/batchRemind?type='+ data,
    method: 'post',
  })
}



// 修改保障成员表
export function updateGuarantor(data) {
  return request({
    url: '/qzhz/Guarantor',
    method: 'put',
    data: data
  })
}

// 删除保障成员表
export function delGuarantor(id) {
  return request({
    url: '/qzhz/Guarantor/' + id,
    method: 'delete'
  })
}

// 导出保障成员表
export function exportGuarantor(query) {
  return request({
    url: '/qzhz/Guarantor/export',
    method: 'get',
    params: query
  })
}
import request from '@/utils/request'

export function getTestList(data) {
  return request({
    url: '/v1/examinee/page_list',
    method: 'get',
    params:data
  })
}


export function createTest(data) {
  return request({
    url: '/v1/examinee/save',
    method: 'post',
    data
  })
}

export function updateTest(data) {
  return request({
    url: '/v1/examinee/update',
    method: 'put',
    data
  })
}

export function deleteTest(data) {
  return request({
    url: '/v1/examinee/delete',
    method: 'put',
    data
  })
}
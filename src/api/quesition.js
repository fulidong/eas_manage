import request from '@/utils/request'

export function getQuesitionList(data) {
  return request({
    url: '/v1/sales_pager_dimension_question/list',
    method: 'get',
    params: data
  })
}

export function quesitionSave(data) {
  return request({
    url: '/v1/sales_pager_dimension_question/save',
    method: 'post',
    data
  })
}

export function quesitionDelete(data) {
  return request({
    url: '/v1/sales_pager_dimension_question/delete',
    method: 'put',
    data
  })
}

export function getQuesitionPreview(data) {
  return request({
    url: '/v1/sales_pager_dimension_question/preview',
    method: 'get',
    params: data
  })
}

export function getQuesitionDetail(data) {
  return request({
    url: '/v1/sales_pager_dimension_question/detail',
    method: 'get',
    params: data
  })
}
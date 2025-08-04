import request from '@/utils/request'

export function getDimensionList(data) {
  return request({
    url: '/v1/sales_paper_dimension/page_list',
    method: 'get',
    params: data
  })
}

export function dimensionCreate(data) {
  return request({
    url: '/v1/sales_paper_dimension/create',
    method: 'post',
    data
  })
}

export function dimensionDelete(data) {
  return request({
    url: '/v1/sales_paper_dimension/delete',
    method: 'put',
    data
  })
}

export function dimensionUpdate(data) {
  return request({
    url: '/v1/sales_paper_dimension/update',
    method: 'put',
    data
  })
}

export function getDimensionUsableList(data) {
  return request({
    url: '/v1/sales_pager/usable_page_list',
    method: 'get',
    params: data
  })
}

export function getDemistionCommentList(data) {
  return request({
    url: '/v1/sales_pager_dimension_comment/list',
    method: 'get',
    params: data
  })
}

export function saveDemistioComment(data) {
  return request({
    url: '/v1/sales_pager_dimension_comment/save',
    method: 'post',
    data
  })
}

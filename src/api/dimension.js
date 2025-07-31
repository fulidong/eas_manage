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
    url: '/v1/sales_pager_dimension/create',
    method: 'post',
    data
  })
}

export function dimensionDelete(data) {
  return request({
    url: '/v1/sales_pager_dimension/delete',
    method: 'put',
    data
  })
}

export function dimensionUpdate(data) {
  return request({
    url: '/v1/sales_pager_dimension/update',
    method: 'put',
    data
  })
}

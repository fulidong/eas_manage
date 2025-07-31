import request from '@/utils/request'

export function getSalesList(data) {
  return request({
    url: '/v1/sales_pager/page_list',
    method: 'get',
    params: data
  })
}

export function salesCreate(data) {
  return request({
    url: '/v1/sales_pager/create',
    method: 'post',
    data
  })
}

export function salesDelete(data) {
  return request({
    url: '/v1/sales_pager/delete',
    method: 'put',
    data
  })
}

export function salesStatus(data) {
  return request({
    url: '/v1/sales_pager/set_status',
    method: 'put',
    data
  })
}

export function salesUpdate(data) {
  return request({
    url: '/v1/sales_pager/update',
    method: 'put',
    data
  })
}
export function getSalesCommentList(data) {
  return request({
    url: '/v1/sales_pager_comment/list',
    method: 'get',
    params: data
  })
}

export function saveSalesComment(data) {
  return request({
    url: '/v1/sales_pager_comment/save',
    method: 'post',
    data
  })
}

export function getSalesUsableList(data) {
  return request({
    url: '/v1/sales_pager/usable_page_list',
    method: 'get',
    data
  })
}

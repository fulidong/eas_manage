import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/v1/eas/login',
    method: 'post',
    data
  })
}
export function getUserList(data) {
  return request({
    url: '/v1/user/page_list',
    method: 'get',
    params:data
  })
}
export function setUserStatus(data) {
  return request({
    url: '/v1/user/set_status',
    method: 'put',
    data
  })
}

export function createUser(data) {
  return request({
    url: '/v1/user/create',
    method: 'post',
    data
  })
}

export function upDateUser(data) {
  return request({
    url: '/v1/user/update',
    method: 'put',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/v1/user/delete',
    method: 'put',
    data
  })
}
export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

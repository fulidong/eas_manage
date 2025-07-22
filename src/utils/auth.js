import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const UserTypeKey = 'vue_admin_template_user_type'
const UserNameKey = 'vue_admin_template_user_name'
export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserType() {
  return Cookies.get(UserTypeKey)
}
export function setUserType(type) {
  return Cookies.set(UserTypeKey, type)
}
export function removeUserType() {
  return Cookies.remove(UserTypeKey)
}

export function getUserName() {
  return Cookies.get(UserNameKey)
}
export function setUserName(name) {
  return Cookies.set(UserNameKey, name)
}
export function removeUserName() {
  return Cookies.remove(UserNameKey)
}

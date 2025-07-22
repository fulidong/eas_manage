import { login, getInfo } from '@/api/user'
import { getToken, setToken, getUserName, setUserName, removeUserName, setUserType, removeUserType, getUserType, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: getUserName(),
    type: getUserType(),
    avatar: 'https://img.fx696.com/avatar/8886496002/8886496002_59811.jpg_wiki200'
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_TYPE: (state, type) => {
    state.type = type
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { login_account, pass_word } = userInfo
    return new Promise((resolve, reject) => {
      login({ login_account: login_account.trim(), pass_word }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.user_name)
        commit('SET_TYPE', data.user_type)
        setToken(data.token)
        setUserName(data.user_name)
        setUserType(data.user_type)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name } = data

        commit('SET_NAME', name)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    removeToken() // must remove  token  first
    resetRouter()
    removeUserName()
    removeUserType()
    commit('RESET_STATE')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


// store/permission.js
import { asyncRouterMap, constantRouterMap } from '@/router'

// function hasPermission(roles, route) {
//   if (route.meta && route.meta.role) {
//     return roles.some(role => route.meta.role.indexOf(role) >= 0)
//   } else {
//     return true
//   }
// }

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    INIT_ROUTERS: (state) => {
      state.routers = constantRouterMap
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      console.log('方法进来了')
      return new Promise(resolve => {
        const { roles } = data
        const accessedRouters = asyncRouterMap
        if (roles === 'admin') {
          commit('SET_ROUTERS', accessedRouters)
          resolve(accessedRouters)
        } else {
          commit('SET_ROUTERS', [])
          resolve([])
        }
      })
    }
  }
}

export default permission

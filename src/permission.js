import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      try {
        const hasGetUserInfo = store.getters.name
        const hasGetUserType = store.getters.type
        if (hasGetUserInfo) {
          if (!store.getters.routesAdded && hasGetUserType === 'admin') {
            // console.log(hasGetUserType, asyncRouterMap, router, 'gfffffffffffffffff')
            const allRoutes = await store.dispatch('GenerateRoutes', { roles: hasGetUserType })
            router.addRoutes([...allRoutes, { path: '*', redirect: '/404', hidden: true }])
            store.commit('user/SET_ROUTES_ADDED', true) // 标记已添加
            // 确保addRoutes已完成
            setTimeout(() => {
              next({ ...to, replace: true })
            }, 100)
          } else {
            console.log(router, '路由参数')
            next()
          }
        } else {
          await store.dispatch('user/resetToken')
          Message.error('登录过期，请重新登录')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } catch (error) {
        console.log(error, '拦截器出错')
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

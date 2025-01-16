import router from '@/router'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

// 是否为首次获取登录用户
let isFirstGetLoginUser = true

/**
 * 路由全局检验权限
 */
router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser
  //确保页面刷新，首次加载时能够等后端返回用户信息后再检验权限
  if (isFirstGetLoginUser) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    isFirstGetLoginUser = false
  }
  const toUrl = to.fullPath
  if (toUrl.startsWith('/admin')) {
    if (!loginUser || loginUser.userRole !== 'admin') {
      message.error('没有权限访问该页面')
      next(`/user/login?redirect=${toUrl}`)
      return
    }
  }
  next()
})

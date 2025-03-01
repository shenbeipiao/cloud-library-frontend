<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="300px">
        <router-link to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.png" alt="logo" />
            <div class="title">北漂云图库</div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        />
      </a-col>
      <a-col flex="120px">

        <div v-if='loginUserStore.loginUser.id' class="user-info" >
          <a-dropdown>
            <a-space>
              <a-avatar :size="36" :src="loginUserStore.loginUser.userAvatar" />
                {{ loginUserStore.loginUser.userName ?? '未登录'}}
            </a-space>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1" @click="doLogout"><LogoutOutlined /> 个人信息</a-menu-item>
                <a-menu-item key="2" @click="doLogout"><LogoutOutlined /> 设置</a-menu-item>
                <a-menu-item key="3" @click="doLogout"><LogoutOutlined /> 退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <a-button v-else type="primary" href="/user/login">注册/登录</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import {
  HomeOutlined,
  ImportOutlined,
  TeamOutlined,
  PictureOutlined,
  InboxOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { userLogoutUsingPost } from '@/api/userController'

const loginUserStore = useLoginUserStore()
const originItems = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/add_picture',
    icon: () => h(ImportOutlined),
    label: '创建图片',
    title: '创建图片',
  },
  {
    key: '/admin/userManage',
    icon: () => h(TeamOutlined),
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/admin/pictureManage',
    icon: () => h(PictureOutlined),
    label: '图片管理',
    title: '图片管理',
  },
  {
    key: '/admin/spaceManage',
    icon: () => h(InboxOutlined),
    label: '空间管理',
    title: '空间管理',
  },
])

// 根据权限过滤菜单项
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus.filter((menu) => {
    // 管理员才能看到 /admin 开头的菜单
    if (menu?.key?.startsWith('/admin')) {
      const loginUser = loginUserStore.loginUser
      if (!loginUser || loginUser.userRole !== 'admin') {
        return false
      }
    }
    return true
  })
}

// 展示在菜单的路由数组
const items = computed<MenuProps['items']>(() => filterMenus(originItems.value))

const router = useRouter()
const current = ref<string[]>()
// 路由跳转
const doMenuClick = ({ key }) => {
  router.push({
    path: key,
  })
}

// 退出登录
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    console.log(loginUserStore.loginUser)
    message.success('退出登录成功')
    await router.push('/user/login')
  } else {
    message.error('退出登录失败，' + res.data.message)
  }
}
</script>

<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
  padding-left: 30px;
}

.title {
  font-size: 18px;
  color: black;
  margin-left: 16px;
}

.logo {
  height: 64px;
}
</style>

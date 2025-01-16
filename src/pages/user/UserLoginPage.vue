<template>
  <div id="userLoginPage">
    <h2 class="title">北漂云图库 - 用户登录</h2>
    <div class="login-container">企业级智能协同云图库</div>
    <a-form
      :model="formState"
      name="normal_login"
      class="login-form"
      @finish="handleSubmit"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="用户账号"
        name="userAccount"
        :rules="[
          { required: true, message: '请输入账号！' },
          { min: 4, message: '账号长度不能小于4位！' },
          ]"
      >
        <a-input v-model:value="formState.userAccount">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="账号密码"
        name="password"
        :rules="[
          { required: true, message: '请输入密码！' },
          { min: 8, message: '密码长度不能小于8位！' },
          ]"
      >
        <a-input-password v-model:value="formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
<!--        <a-form-item name="remember" no-style>-->
<!--&lt;!&ndash;          <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>&ndash;&gt;-->
<!--        </a-form-item>-->
        <a class="login-form-forgot" href="">忘记密码</a>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" class="login-form-button"> 登录 </a-button>
        <div class="tips">
          没有账号？
          <RouterLink to="/user/register">去注册</RouterLink>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { userLoginUsingPost } from '@/api/userController'
import { message } from 'ant-design-vue'
import router from '@/router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

//表单数据
const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  password: '',
})
// 登录状态
const loginUserStore = useLoginUserStore()
// 登录
const handleSubmit = async (values: any) => {
  const res = await userLoginUsingPost(values)
  // 登录成功，把登录态保存到全局状态中
  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser()
    message.success('登录成功')
    router.push({
      path: '/',
      replace: true,
    })
  } else {
    message.error('登录失败，' + res.data.message)
  }
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const disabled = computed(() => {
  return !(formState.username && formState.password)
})
</script>
<style scoped>
#userLoginPage {
  max-width: 360px;
  margin: 100px auto;
}
.title {
  text-align: center;
  margin-bottom: 16px;
}
.login-container {
  text-align: center;
  margin-bottom: 16px;
  color: gray;
}
.login-form {
  max-width: 360px;
}
.login-form-forgot {
  float: right;
}
.login-form-button {
  width: 100%;
}
.tips {
  text-align: right;
  font-size: 0.8rem;
}
</style>

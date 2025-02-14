<template>
  <div id='addPictureBatchPage'>
    <h2 style='margin: 16px 0'>批量创建图片</h2>
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item label="关键词" name="searchText">
        <a-input v-model:value='formData.searchText' placeholder='请输入关键词'></a-input>
      </a-form-item>
      <a-form-item label="抓取数量" name="fetchCount">
        <a-input-number v-model:value="formData.fetchCount" placeholder="请输入数量"
          style='min-width: 180px' :min='1' :max='30' allow-clear></a-input-number>
      </a-form-item>
      <a-form-item label="名称前缀" name="namePrefix">
        <a-input v-model:value='formData.namePrefix' placeholder='请输入名称前缀，会自动补充序号'></a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading" style='width: 100%'>执行任务</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue'
import { uploadPictureByBatchUsingPost } from '@/api/pictureController'
import { message } from 'ant-design-vue'
import router from '@/router'

const formData = reactive<API.PictureUploadByBatchRequest>({
  fetchCount: 10,
})

const loading = ref(false)

//提交表单
const handleSubmit = async (values:any) => {
  loading.value = true
  const res = await uploadPictureByBatchUsingPost({
    ...formData,
  })

  if (res.data.code === 0 && res.data.data) {
    message.success("创建成功，共 ${res.data.data} 张图片")
    router.push({
      path: '/'
    })
  } else {
    message.error(res.data.message)
  }
  loading.value = false
}
</script>

<style scoped>
#addPictureBatchPage {
  max-width: 720px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}
</style>

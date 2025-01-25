<template>
  <div id='homePage'>
    <!-- 搜索框 -->
    <div class="search-bar">
      <a-input-search
        placeholder="从海量图片中搜索"
        v-model:value="searchParams.searchText"
        enter-button="搜索"
        size="large"
        @search="doSearch"
      />
    </div>
    <!-- 标签栏 -->
    <div class="category-bar">
      <!-- 分类 + 标签 -->
      <a-tabs v-model:activeKey="selectedCategory" @change="doSearch">
        <a-tab-pane key="all" tab="全部" />
        <a-tab-pane v-for="category in categoryList" :key="category" :tab="category" />
      </a-tabs>
      <div class="tag-bar">
        <span style="margin-right: 8px">标签：</span>
        <a-space :size="[0, 8]" wrap>
          <a-checkable-tag
            v-for="(tag, index) in tagsList"
            :key="tag"
            v-model:checked="selectedTagList[index]"
            @change="doSearch"
          >
            {{ tag }}
          </a-checkable-tag>
        </a-space>
      </div>

    </div>
    <!-- 图片列表 -->
    <div class="image-list">
      <a-list
        :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
        :data-source="dataList"
        :pagination="pagination"
        :loading="loading"
        style='padding: 0'
      >
        <template #renderItem="{ item: picture }">
          <a-list-item>
            <!-- 单张图片 -->
            <a-card hoverable @click="doClickPicture(picture)">
              <template #cover>
                <img
                  :alt="picture.name"
                  :src='picture.url'
                  style="height: 180px; object-fit: cover;"
                />
              </template>
              <a-card-meta :title="picture.name">
                <template #description>
                  <a-flex>
                    <a-tag color="green">
                      {{ picture.category ?? '默认' }}
                    </a-tag>
                    <a-tag v-for="tag in picture.tags" :key="tag">
                      {{ tag }}
                    </a-tag>
                  </a-flex>
                </template>
              </a-card-meta>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { listPictureTagCategoryUsingGet, listPictureVoByPageUsingPost } from '@/api/pictureController'
import { message } from 'ant-design-vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const dataList = ref([])
const total = ref(0)
const loading = ref(true)

const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagsList = ref<string[]>([])
const selectedTagList = ref<string[]>([])

//搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,

    // 表格变化之后，重新获取数据
    onChange:(page, pageSize) => {
      searchParams.current = page
      searchParams.pageSize = pageSize
      fetchData()
    },
  }
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 搜索参数
  const params = {
    ...searchParams,
    tags:[]
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  selectedTagList.value.forEach((tag, index) => {
    if (tag) {
      params.tags.push(tagsList.value[index])
    }
  })
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

// 获取标签以及分类
const fetchTagsAndCategories = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    categoryList.value = res.data.data.categoryList ?? []
    tagsList.value = res.data.data.tagList ?? []
  } else {
    message.error('加载分类以及标签失败，' + res.data.data.message)
  }
}

// 搜索数据
const doSearch = () => {
  // 重置搜索条件
  searchParams.current = 1
  fetchData()
}

const doClickPicture = (picture)=> {
  router.push({
    path: `/picture/${picture.id}`,
  })
}

onMounted(() => {
  fetchTagsAndCategories()
  fetchData()
})
</script>

<style scoped>
#homePage {
  margin-bottom: 16px;
}
#homePage .search-bar {
  max-width: 600px;
  margin: 10px auto 16px;
}
.category-bar {
  max-width: 1200px;
  margin: 10px 32px 16px;
}
:deep(.ant-list .ant-list-item) {
  padding: 0 !important;
}
:deep(.ant-row) {
  margin:0 !important;
}

</style>

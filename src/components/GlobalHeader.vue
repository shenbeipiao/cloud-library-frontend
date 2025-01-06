<template>
  <div id="globalHeader">
    <a-row :wrap='false'>
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.svg" alt="logo" width='16px' height='16px'/>
            <div class="title">鱼皮云图库</div>
          </div>
        </router-link>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'GlobalHeader',
}
</script>

<style scoped></style>

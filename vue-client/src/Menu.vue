<template>
  <div class="contail">
    <!-- 左侧导航栏 -->
    <div class="layout">
      <div class="menu-left" style="height:100%">
        <sidear />
      </div>
    </div>
  </div>
</template>

<script>
import sidear from '@/components/sidear'
export default {
  components: {
    sidear
  }
}
</script>

<style lang="scss">
.contail {
  height: 100vh;
  display: flex;
  flex-direction: column;
  // .header{
  //   height:300px;
  // }
  .layout {
    flex: 1;
  }
}
</style>

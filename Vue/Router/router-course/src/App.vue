<template>
  <div class="container">
    <!-- 非路由组件和路由组件结合 -->
    <Home1></Home1>

    <!-- 命名视图 -->
    <!-- <NamedView></NamedView> -->
  </div>
</template>
<script setup lang="ts">
import NamedView from "./usage/basicUsage/components/NamedView.vue";
import Home1 from "./usage/basicUsage/components/Home1.vue";
import Sidebar from "./usage/basicUsage/components/Sidebar.vue";
</script>
<style scoped></style>

<template>
  <div class="container">
    <!-- 非路由组件和路由组件结合 -->
    <!-- <Home1></Home1> -->

    <!-- 命名视图 -->
    <!-- <NamedView></NamedView> -->

    <!-- 路由导航守卫 -->
    <RouteGuards></RouteGuards>
  </div>
</template>
<script setup lang="ts">
import NamedView from "./usage/basicUsage/views/NamedView.vue";
import Home1 from "./usage/basicUsage/views//Home1.vue";
import RouteGuards from "./usage/basicUsage/views/routeGuards.vue";

</script>
<style scoped></style>

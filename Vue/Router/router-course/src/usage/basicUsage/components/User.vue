<template>
  <div class="container">
    <h3>User</h3>
    <!-- <p>username : {{ $route.params.name }}</p> -->
    <!-- 或者 -->
    <p>username : {{ route.params.name }}</p>
  </div>
</template>
<script setup lang="ts">
import { useRoute, beforeRouteUpdate } from "vue-router";
import { watch } from "vue";
const route = useRoute();

watch(
  () => route.params,
  (oldParams, newParams) => {
    console.log("路径参数变化...");
    console.log("oldParams : ", oldParams);
    console.log("newParams : ", newParams);
  }
);
</script>
<style scoped></style>

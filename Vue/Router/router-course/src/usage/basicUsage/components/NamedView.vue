<template>
  <div class="container">
    <h2>命名视图</h2>
    <div class="controllers">
      <router-link to="/">Home</router-link>
      <router-link to="/another">another</router-link>
    </div>
    <div class="showPages">
      <!-- 命名视图 -->
      <router-view name="first"></router-view>
      <router-view name="second"></router-view>
      <router-view name="third"></router-view>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped></style>

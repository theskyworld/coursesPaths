<template>
  <div class="container">
    <h3>侧边栏</h3>
    <div class="controller">
      <!-- 动态路径参数 -->
      <!-- 给路径参数传值 -->

      <div><router-link to="/user/Alice">User-Alice</router-link></div>
      |
      <div><router-link to="/user/Alice2">User-Alice2</router-link></div>
      |

      <!-- 给:pathMatch(.*)*路径参数传值 -->
      <div><router-link to="/notfound/desedwe">notfound</router-link></div>
      |
      <!-- 给user-:afterUser(.*)路径参数传值 -->
      <div><router-link to="/notfound/user-Alice">notfound</router-link></div>
      |
      <!-- 错误传值，不会跳转 -->
      <!-- <div><router-link to="/notfound/test-Alice">notfound</router-link></div> -->
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped></style>

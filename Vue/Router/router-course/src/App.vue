<script setup lang="ts"></script>

<template>
  <div class="container">
    <div class="controller">
      <div><router-link to="/">Home</router-link></div>
      <div><router-link to="/about">About</router-link></div>

      <!-- 动态路径参数 -->
      <!-- 给路径参数传值 -->
      <div><router-link to="/user/Alice">User-Alice</router-link></div>
      <div><router-link to="/user/Alice2">User-Alice2</router-link></div>

      <!-- 给:pathMatch(.*)*路径参数传值 -->
      <div><router-link to="/notfound/desedwe">notfound</router-link></div>
      <!-- 给user-:afterUser(.*)路径参数传值 -->
      <div><router-link to="/notfound/user-Alice">notfound</router-link></div>
      <!-- 错误传值，不会跳转 -->
      <!-- <div><router-link to="/notfound/test-Alice">notfound</router-link></div> -->

      <!-- 匹配多个参数 -->
      <div><router-link to="/detail/12">Detail</router-link></div>

      <!-- senetive和strict -->
      <div><router-link to="/Product/12">Product</router-link></div>

      <!-- 命名路由 -->
      <!-- 给to传递一个对象值 -->
      <div>
        <router-link :to="{ name: 'person', query: { name: 'Alice', age: 12 } }"
          >Person</router-link
        >
      </div>

      <!-- 嵌套路由 -->
      <div><router-link to="/Cart">Cart</router-link></div>
      <div><router-link to="/cart/CartItem">CartItem</router-link></div>
      <div>
        <router-link :to="{ name: 'cartAmount' }">CartAmount</router-link>
      </div>
    </div>
    <div class="showPages">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped></style>

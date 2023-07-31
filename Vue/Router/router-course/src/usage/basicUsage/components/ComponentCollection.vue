<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const name = "Alice1";
function toUser() {
  // router.push()

  // router.push("/user/Alice")
  // router.push('/user/Alice1');
  // router.push(`/user/${name}`);
  router.push({
    //   // path: '/user/Alice1',
    //   // 或者
    //   // 对应路径为"/user/:name"
    name: "user",
    params: {
      name: "Alice3",
    },

    //   // 或者
    //   // 对应路径为"/user"
    // path: "/user",
    // query: {
    //   name: "Alice1",
    // },

    hash: "#hash",
  });

  // router.replace()
  // router.replace({
  //   path: "user",
  //   query: {
  //     name: "Alice1",
  //   },
  // });
  // 等价于
  // router.push({
  //   path: 'user',
  //   query: {
  //     name: 'Alice1',
  //   },
  //   replace: true,
  // });

  // router.go()
  // router.go(1);
  // 等价于router.forward()

  // router.go(-1);
  // 等价于
  // router.back();
}

function toCity() {
  router.push({
    path: "/city",
  });
}
</script>

<template>
  <div class="container">
    <div class="controller">
      <span>
        <router-link to="/">Home</router-link> </span
      >| <span><router-link to="/about">About</router-link></span
      >|

      <!-- 动态路径参数 -->
      <!-- 给路径参数传值 -->
      <span><button @click="toUser">toUser</button></span>|
      <span><router-link to="/user/Alice">User-Alice</router-link></span
      >| <span><router-link to="/user/Alice2">User-Alice2</router-link></span
      >|

      <!-- 给:pathMatch(.*)*路径参数传值 -->
      <span><router-link to="/notfound/desedwe">notfound</router-link></span
      >|
      <!-- 给user-:afterUser(.*)路径参数传值 -->
      <span><router-link to="/notfound/user-Alice">notfound</router-link></span
      >|
      <!-- 错误传值，不会跳转 -->
      <!-- <div><router-link to="/notfound/test-Alice">notfound</router-link></div> -->

      <!-- 匹配多个参数 -->
      <span><router-link to="/detail/12">Detail</router-link></span
      >|

      <!-- senetive和strict -->
      <span><router-link to="/Product/12">Product</router-link></span
      >|

      <!-- 命名路由 -->
      <!-- 给to传递一个对象值 -->
      <span>
        <router-link :to="{ name: 'person', query: { name: 'Alice', age: 12 } }"
          >Person</router-link
        > </span
      >|

      <!-- 嵌套路由 -->
      <span><router-link to="/Cart">Cart</router-link></span
      >| <span><router-link to="/cart/CartItem">CartItem</router-link></span
      >|
      <span>
        <router-link :to="{ name: 'cartAmount' }"
          >CartAmount</router-link
        > </span
      >|

      <!-- 重定向 -->
      <span><button @click="toCity">toCity</button></span>|
    </div>
  </div>
  <div class="showPages">
    <router-view></router-view>
  </div>
</template>

<style scoped></style>

<template>
  <div class="container">
    <h2>路由导航守卫</h2>
    <div class="controllers">
      <button @click="toFruits">toFruits</button>
      <button @click="toCars">toCars</button>
      <button @click="toGithubUsers">toGithubUsers</button>
    </div>
    <div class="showPages">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
function toFruits() {
  router.push({
    path: "/fruits",
  });
}

function toCars() {
  router.push({
    // path: "/cars",
    name: "cars",
    params: {
      carid: 3,
    },
  });
}

// 模拟组件内params的更新，触发beforeRouteUpdate或者onBeforeRouteUpdate
// setTimeout(() => {

//   router.push({
//     name: "cars",
//     params: {
//       carid: 1,
//     },
//   });
// }, 3000);

function toGithubUsers() {
  router.push({
    // path: "/githubusers",

    name: "githubUsers",
    params: {
      // ["mojombo", "defunkt", "pjhyett", "wycats", "ezmobius"]
      loginName: "ezmobius",
    },
  });
}

// 监听params/query，模拟值的改变
// setInterval(() => {
//   const loginNames = ["mojombo", "defunkt", "pjhyett", "wycats", "ezmobius"];
//   router.push({
//     name: "githubUsers",
//     params: {
//       loginName: loginNames[Math.ceil(Math.random() * 5)],
//     },
//   });
// }, 5000);
</script>
<style scoped></style>

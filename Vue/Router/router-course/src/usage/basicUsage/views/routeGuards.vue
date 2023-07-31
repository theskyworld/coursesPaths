<template>
  <div class="container">
    <h2>路由导航守卫</h2>
    <div class="controllers">
      <button @click="toFruits">toFruits</button>
      <button @click="toCars">toCars</button>
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

setTimeout(() => {
  
  router.push({
    name: "cars",
    params: {
      carid: 1,
    },
  });
}, 3000);
</script>
<style scoped></style>

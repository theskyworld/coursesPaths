<template>
  <div class="container">
    <div class="sideBar">
      <Sidebar></Sidebar>
    </div>
    <div class="main">
      <ComponentCollection></ComponentCollection>
    </div>
  </div>
</template>
<script setup lang="ts">
import ComponentCollection from "./ComponentCollection.vue";
import Sidebar from "./Sidebar.vue";
</script>
<style scoped>
.container {
  width: 1300px;
  display: flex;
  flex-direction: row;
  /* border: solid 1px red; */
}
.sideBar {
  width: 200px;
  height: 700px;
  border: solid 1px green;
  margin-right: 30px;
}
</style>

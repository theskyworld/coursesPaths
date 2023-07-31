<template>
  <div class="container">
    <h3>Cars</h3>
    <p>{{ $route.params.carid }}</p>
    <div>
      <ul>
        <li>Car1</li>
        <li>Car2</li>
        <li>Car3</li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";

onBeforeRouteUpdate((to, from) => {
  console.log("onBeforeRouteUpdate...");
});

onBeforeRouteLeave((to, from) => {
  const answer = window.confirm(
    "Do you really want to leave? you have unsaved changes!"
  );
  if (!answer) return false;
  console.log("onBeforeRouteLeave...");
});

// export default {
//   beforeRouteEnter(to, from, next) {
//     console.log("beforeRouteEnter");
//     // 通过next访问组件内的this
//     next((vm) => {
//       console.log(vm);
//     });
//   },
//   beforeRouteUpdate(to, from) {
//     console.log("beforeRouteUpdate");
//     console.log(this);
//   },
//   beforeRouteLeave(to, from) {
//     const answer = window.confirm(
//       "Do you really want to leave? you have unsaved changes!"
//     );
//     if (!answer) return false;
//     console.log("beforeRouteLeave");
//     console.log(this);
//   },
// };
</script>
<style scoped></style>

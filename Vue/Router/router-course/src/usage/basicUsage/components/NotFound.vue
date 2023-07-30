<template>
  <div class="container">
    <h3>NotFound</h3>
    <!-- path: "/notfound/:pathMatch(.*)*", -->
    <p>{{ $route.params.pathMatch }}</p>
    <!-- path: "/notfound/user-:afterUser(.*)", -->
    <p>{{ $route.params.afterUser }}</p>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped></style>

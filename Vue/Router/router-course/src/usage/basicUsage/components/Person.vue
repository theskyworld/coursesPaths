<template>
  <div class="container">
    <h3>Person</h3>
    <p>personName : {{ $route.query.name }}</p>
    <p>personAge : {{ $route.query.age }}</p>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped></style>

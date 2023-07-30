<template>
  <div class="container">
    <p>{{ name }}</p>
    <p>{{ age }}</p>
  </div>
</template>
<script lang="ts">
import { mapWritableState } from "pinia";
import useMainStore from "../store";

export default {
  computed: {
    ...mapWritableState(useMainStore, {
      name: "name",
      age: "age",
    }),
  },
};
</script>
<style scoped></style>

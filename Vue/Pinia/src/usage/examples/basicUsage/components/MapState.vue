<template>
  <div class="container">
    <p>{{ count }}</p>
    <p>{{ doubleCount }}</p>
    <button @click="clickFn">+</button>
  </div>
</template>
<script lang="ts">
import { mapState } from "pinia";
import useMainStore from "../store";
export default {
  computed: {
    // pinia中的mapState支持同时获取state和getters中的值
    ...mapState(useMainStore, {
      // state
      count: "count",
      // getters
      doubleCount: "doubleCount",
    }),
  },
  methods: {
    clickFn() {
      useMainStore().count++;
    },
  },
};
</script>
<style scoped></style>

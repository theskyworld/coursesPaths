<template>
  <div class="container">
    <p>{{ datas }}</p>
    <button @click="clickFn">click</button>
  </div>
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia";
import useMainStore from "../store";

export default {
  computed: {
    ...mapState(useMainStore, {
      datas: "datas",
    }),
  },
  methods: {
    // ...mapActions(useMainStore, ["increaseCount", "getGithubUsers"]),
    // 或者
    ...mapActions(useMainStore, {
      increaseCount: "increaseCount",
      getGithubUsers: "getGithubUsers",
    }),
    clickFn() {
      this.increaseCount();
      this.getGithubUsers();
    },
  },
};
</script>
<style scoped></style>

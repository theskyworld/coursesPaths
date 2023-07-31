<template>
  <div class="container">
    <h3>githubusers</h3>
    <div>
      <ul v-for="user in users">
        <li>{{ user.login }}</li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import axios from "axios";
interface User {
  login: string;
  [key: string]: any;
}

export default {
  data: (): { users: User[] } => {
    return {
      users: [],
    };
  },
  async beforeRouteEnter(to, from, next) {
    let datas: User[] = [];
    await axios.get("https://api.github.com/users").then((val) => {
      datas = val.data.slice(0, 5);
    });
    next((vm) => {
      vm.users = datas;
    });
  },
};
</script>
<style scoped></style>

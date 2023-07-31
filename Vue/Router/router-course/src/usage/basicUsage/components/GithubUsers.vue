<template>
  <div class="container">
    <h3>githubusers</h3>
    <div>
      <ul v-for="user in users">
        <li>{{ user.login }}</li>
      </ul>
    </div>
    <h4>userInfo</h4>
    <div class="userInfo">
      <p>id : {{ user?.id }}</p>
      <p>login : {{ user?.login }}</p>
      <img :src="user?.avatar_url" alt="" />
    </div>
  </div>
</template>
<script lang="ts">
import axios from "axios";
import { ref } from "vue";

interface User {
  login: string;
  id: number;
  avatar_url: string;
  [key: string]: any;
}

export default {
  data: (): { users: User[]; user: any } => {
    return {
      users: [],
      user: null,
    };
  },
  // 获取数据，初始化users
  async beforeRouteEnter(to, from, next) {
    let datas: User[] = [];
    await axios.get("https://api.github.com/users").then((val) => {
      datas = val.data.slice(0, 5);
    });
    next((vm) => {
      vm.users = datas;
      vm.user = datas.find((user) => user.login === "ezmobius");
    });
  },

  // 每次params.loginName更新时，this.user跟着变化
  beforeRouteUpdate(to, from) {
    console.log("beforeRouteUpdate");

    this.user = this.users?.find((user) => user.login === to.params.loginName);
  },
};
</script>
<style scoped></style>

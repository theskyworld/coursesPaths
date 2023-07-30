<template>
  <div>
    <p>{{ name }}</p>
    <p>{{ gender }}</p>
    <p>{{ count }}</p>
    <p>{{ strs }}</p>
    <p>{{ nums }}</p>
    <p>{{ doubleCount }}</p>
    <p>{{ lovesPlusAge }}</p>
    <p>{{ agePlusOne }}</p>
    <button @click="clickFn()">+</button>
  </div>
</template>
<script>
import { computed } from "vue";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import store from "../store/index.ts";

import {
  Module1MutationTypes,
  Module1ActionTypes,
} from "../store/modules/module1.ts";
import {
  Module2MutationTypes,
  Module2ActionTypes,
} from "../store/modules/module2.ts";
export default {
  setup() {
    // 获取子模块state
    // const name = computed(() => store.state.module2Store.name);
    // const gender = computed(() => store.state.module1Store.gender);
    return {
      // name,
      // gender,
    };
  },
  computed: {
    // 使用mapState和mapGetters获取子模块state和getters
    // ...mapState({
    //   gender: (state) => state.module1Store.gender,
    //   count: (state) => state.module1Store.count,
    //   strs: (state) => state.module1Store.strs,
    //   nums: (state) => state.module2Store.nums,
    //   name: (state) => state.module2Store.name,
    // }),

    // 简写形式：
    // 子模块module1Store
    ...mapState("module1Store", {
      gender: (state) => state.gender,
      count: (state) => state.count,
      // 或者
      strs: "strs",
    }),
    // 子模块module2Store
    ...mapState("module2Store", {
      nums: (state) => state.nums,
      name: (state) => state.name,
    }),

    // ...mapGetters({
    //   // 子模块module1Store
    //   doubleCount: "module1Store/doubleCount",
    //   lovesPlusAge: "module1Store/lovesPlusAge",

    //   // 子模块module2Store
    //   agePlusOne: "module2Store/agePlusOne",
    // }),

    // 简写形式：
    // 子模块module1Store
    ...mapGetters("module1Store", {
      doubleCount: "doubleCount",
      lovesPlusAge: "lovesPlusAge",
    }),
    // 子模块module2Store
    ...mapGetters("module2Store", {
      agePlusOne: "agePlusOne",
    }),
  },
  methods: {
    // 使用mapMutations访问子模块mutations
    // mapMutations
    // ...mapMutations({
    //   // 子模块module1Store
    //   reviseCount: "module1Store/reviseCount",

    //   // 子模块module2Store
    //   reviseName: "module2Store/reviseName",
    // }),

    // 简写形式：
    // 子模块module1Store
    ...mapMutations("module1Store", {
      // reviseCount: "reviseCount",
      // 使用Symbol
      reviseCount: Module1MutationTypes.REVISECOUNT,
    }),
    // 子模块module2Store
    ...mapMutations("module2Store", {
      // reviseName: "reviseName",
      // 使用Symbol
      reviseName: Module2MutationTypes.REVISENAME,
    }),

    // mapActions
    // 使用mapActions访问子模块actions
    // ...mapActions({
    //   // 子模块module1Store
    //   syncReviseStrs: "module1Store/syncReviseStrs",

    //   // 子模块module2Store
    //   syncReviseNums: "module2Store/syncReviseNums",
    // }),

    // 简写形式：
    // 子模块module1Store
    ...mapActions("module1Store", {
      // syncReviseStrs: "syncReviseStrs",
      syncReviseStrs: Module1ActionTypes.SYNCREVISESTRS,
    }),
    // 子模块module2Store
    ...mapActions("module2Store", {
      // syncReviseNums: "syncReviseNums",
      syncReviseNums: Module2ActionTypes.SYNCREVISENUMS,
    }),
    clickFn() {
      this.reviseCount({
        newCount: 100,
      });
      this.reviseName({
        newName: "newAlice",
      });
      this.syncReviseNums({
        newNums: [7, 8],
        timeout: 1000,
      });
      this.syncReviseStrs({
        newStrs: ["newStr", "new"],
        timeout: 3000,
      });
    },
  },
};
</script>
<style scoped></style>

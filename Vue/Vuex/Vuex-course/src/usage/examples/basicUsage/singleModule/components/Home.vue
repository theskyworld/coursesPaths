<template>
  <div>
    <p>{{ name }}</p>
    <p>{{ count }}</p>
    <p>{{ heightPlusCount }}</p>
    <p>{{ heightPlusDoubleCount }}</p>
    <!-- <p>{{ nums }}</p> -->
    <p>{{ numsArray }}</p>
    <!-- <p>{{ data }}</p> -->
    <p>{{ dataArray }}</p>
    <p>{{ dataLength }}</p>
    <p>{{ githubUserNames }}</p>
    <p>{{ doubleHeight }}</p>
    <p>{{ tripleWidthPlusDoubleHeight }}</p>
    <button @click="clickFn()">+</button>
  </div>
</template>
<script>
import { computed } from "vue";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import store from "../store/index.ts";
import { MutationTypes, ActionTypes } from "../store/index.ts";
export default {
  setup() {
    // 非响应式的值
    const doubleHeight = store.getters.doubleHeight;
    const tripleWidthPlusDoubleHeight =
      store.getters.tripleWidthPlusDoubleHeight;
    const heightPlusCount = store.getters.heightPlusDoubleCount;
    const localCount = 3;
    return {
      doubleHeight,
      tripleWidthPlusDoubleHeight,
      // heightPlusCount,
      localCount,
    };
  },
  // computed: {
  //   // 使以下属性具备响应式
  //   name: () => store.state.name,
  //   count: () => store.state.count,
  //   heightPlusCount: () => store.getters.heightPlusCount,
  //   heightPlusDoubleCount: () => store.getters.heightPlusDoubleCount,
  //   nums: () => store.state.nums,
  //   data: () => store.state.data,
  //   dataLength: () => store.getters.getDataLength,
  //   githubUserNames: () => {
  //     return store.getters.getGithubUserNames;
  //   },
  // },

  // 同时使用mapState()和mapGetters()
  // computed: Object.assign(
  //   mapState({
  //     // 箭头函数写法
  //     name: (state) => state.name,
  //     count: (state) => state.count,
  //     // 简便写法，"nums" 等价于 (state) => state.nums
  //     numsArray: "nums",
  //     dataArray: "data",
  //     countPlusLocalCount: (state) => state.count + this.localCount,
  //   }),
  //   mapGetters({
  //     heightPlusCount: "heightPlusCount",
  //     heightPlusDoubleCount: "heightPlusDoubleCount",
  //     dataLength: "getDataLength",
  //     githubUserNames: "getGithubUserNames",
  //   })
  // ),

  // 或者使用对象的解构语法
  computed: {
    ...mapState({
      // 箭头函数写法
      name: (state) => state.name,
      count: (state) => state.count,
      // 简便写法，"nums" 等价于 (state) => state.nums
      numsArray: "nums",
      dataArray: "data",
      countPlusLocalCount: (state) => state.count + this.localCount,
    }),
    ...mapGetters({
      heightPlusCount: "heightPlusCount",
      heightPlusDoubleCount: "heightPlusDoubleCount",
      dataLength: "getDataLength",
      githubUserNames: "getGithubUserNames",
    }),
  },
  methods: {
    // clickFn() {
    //   // commit : commit(type : string | payloadWithTypeObj : Object, payload? : any, options? : CommitOptions) : void
    //   store.commit(MutationTypes.INCRESECOUNT);
    //   // store.commit("pushNums", {
    //   //   newNums: [7, 8, 9],
    //   // });

    //   // store.commit("plusNumsElements", {
    //   //   plusedValue: 3,
    //   // });
    //   store.commit({
    //     type: MutationTypes.PLUSNUMSELEMENTS,
    //     plusedValue: 3,
    //   });

    //   // dispatch : dispatch(type : string | payloadWithTypeObj : Object, payload? : any, options? : DispatchOptions) : Promise<any>
    //   const dispatchRes = store.dispatch(ActionTypes.SYNCREVISEDATA, {
    // timeout: 1000,
    // datas: [
    //   {
    //     name: "Alice1",
    //     age: 12,
    //   },
    //   {
    //     name: "Alice2",
    //     age: 13,
    //   },
    //   {
    //     name: "Alice3",
    //     age: 14,
    //   },
    // ],
    //   });
    //   // dispatch()返回一个promise
    //   dispatchRes.then((val) => console.log(val));
    //   // [
    //   //     {
    //   //       name: "Alice1",
    //   //       age: 12,
    //   //     },
    //   //     {
    //   //       name: "Alice2",
    //   //       age: 13,
    //   //     },
    //   //     {
    //   //       name: "Alice3",
    //   //       age: 14,
    //   //     },
    //   // ]

    //   store.dispatch(ActionTypes.SYNCREVISEGITHUBUSERS);
    // },

    // 使用mapMutations()和mapActions()
    ...mapMutations({
      increaseCount: MutationTypes.INCRESECOUNT,
      pushNums: MutationTypes.PUSHNUMS,
      plusNumsElements: MutationTypes.PLUSNUMSELEMENTS,
    }),
    ...mapActions({
      syncReviseData: ActionTypes.SYNCREVISEDATA,
      syncReviseGithubUsers: ActionTypes.SYNCREVISEGITHUBUSERS,
    }),
    clickFn() {
      // commit mutation
      this.increaseCount();
      this.plusNumsElements({
        plusedValue: 3,
      });

      // dispatch action
      this.syncReviseData({
        timeout: 1000,
        datas: [
          {
            name: "Alice1",
            age: 12,
          },
          {
            name: "Alice2",
            age: 13,
          },
          {
            name: "Alice3",
            age: 14,
          },
        ],
      });
      this.syncReviseGithubUsers();
    },
  },
};
</script>
<style scoped></style>

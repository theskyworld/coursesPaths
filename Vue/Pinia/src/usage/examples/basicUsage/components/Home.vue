<template>
  <div class="homeContainer">
    <p>{{ name }}</p>
    <p>{{ count }}</p>
    <p>{{ datas }}</p>
    <p>{{ hasError }}</p>
    <p>{{ doubleCount }}</p>
    <p>{{ doubleCountPlusAge }}</p>
    <p>{{ countPlusDoubleLoves }}</p>
    <!-- 传递参数的getter -->
    <p>{{ countPlusValue(10000) }}</p>
    <p>{{ age }}</p>
    <p>{{ items }}</p>
    <button @click="clickFn">+</button>
    <button @click="reset">reset</button>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import useMainStore from "../store/index";
import { computed } from "vue";
const mainStore = useMainStore();

// 使用插件
console.log(mainStore.newProperty); // "newPropertyText"

console.log(mainStore.hasError); // false
console.log(mainStore.$state.hasError); // false

// 获取state和getters
// 使用computed使获取到的值具有响应式
// state
// const count = computed(() => mainStore.count);
// const age = computed(() => mainStore.age);
// // getters
// const doubleCount = computed(() => mainStore.doubleCount);

// 或者直接使用storeToRefs()的简便写法
const {
  name,
  count,
  age,
  hasError,
  items,
  datas,
  doubleCount,
  doubleCountPlusAge,
  countPlusValue,
  countPlusDoubleLoves,
} = storeToRefs(mainStore);

// 订阅state
const unSubscribe = mainStore.$subscribe((mutations, state) => {
  // console.log("🚀 ~ file: Home.vue:31 ~ unSubscribe ~ mutations:", mutations);
  console.log("state被修改了...");
  console.log(state.age);
});
// 手动取消订阅
// unSubscribe();

// 获取actions
const { increaseCount, getGithubUsers, pushItems, reviseHasError } = mainStore;

function clickFn() {
  // 修改state存在以下两种方式

  // 通过actions修改state
  increaseCount();

  // 通过$patch修改state
  // mainStore.$patch({
  //   count: mainStore.count + 10,
  //   name: "Alice2",
  // });
  // // 或者传入一个函数进行修改，例如push一个数组时的耗时操作
  // mainStore.$patch((mainStore) => {
  //   mainStore.items.push({ sort: "shoes", quantity: 1 });
  // });

  // getGithubUsers();
  // pushItems(["newItem", "text"]);
  // reviseHasError(true);
}

// 订阅action
const downAction = mainStore.$onAction(
  // 回调函数
  // 接收一个配置对象作为参数
  ({
    name, // 侦听的action的名称 如果每指定具体的action方法名，则对每个action进行侦听
    store, // 对应的store mainStore
    args, // 调用action时传递给action的参数
    after, // 该回调函数在action执行之后执行的钩子函数
    onError, // action执行出错时的钩子函数
  }) => {
    // 在after()函数之外的代码都在action执行之前执行
    const startTime = Date.now();
    console.log(`Start "${name}" with params [${args.join(", ")}].`);

    // after()函数中的代码在action之后执行
    // res为action函数执行完毕之后的返回值
    after((res) => {
      console.log(
        `Finished "${name}" after ${Date.now() - startTime}ms.\nResult: ${res}.`
      );
      // 手动取消订阅
      // downAction()
    });

    // action执行出错时
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      );
    });
  }
);

function reset() {
  mainStore.$reset();
}
</script>
<style scoped></style>

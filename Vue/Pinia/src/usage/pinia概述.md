## pinia

### 简介

官网上介绍 vuex5 的版本以 pinia 的形式出现。pinia 的诞生是为了让 vuex 在 vue 中能够更好地以组合式 API 的形式来被使用

pinia 官网文档上的内容，除 SSR 和安装之外，其余内容均能在 vue2 和 vue3 中被支持

#### 对比 vuex(>=4)

pinia 相较于 vuex(>=4)的版本，新增了以下的功能

- devtools 的支持
  - 能够通过 devtools 插件的功能来追踪 actions 和 mutations 的时间线
  - 能够在组件中展示当前组件所使用到的 store
  - 新增的时间线功能，让调试更容易

#### 基本使用

##### 安装 pinia

```shell
yarn add pinia
# 或者使用 npm
npm install pinia
```

相关包或者插件支持

- 对于 vue(<=2.7)的版本，需要安装组合式 API 包，以便支持组合式 API 的写法:`npm insall @vue/composition-api`\
- 使用 vue 脚手架时，可以使用该 pinia 插件：`vue add vue-cli-plugin-pinia` ([vue-cli-plugin-pinia](https://github.com/wobsoriano/vue-cli-plugin-pinia))

#### 创建和使用

### 核心概念

#### store

##### 获取 `useStore`

在 pinia 中，通过`defineStore()`的方式来创建一个 store

`defineStore()`会在底层创建一个返回一个 store 的`useStore()`函数以及该 store 的 id（附加在 useStore 函数上，useStore.$id = id），然后将该函数进行返回

id 用于连接 store 和 devtools

类型 :

```ts
// 包含id和options参数的情况
// Omit<DefineStoreOptions<Id, S, G, A>, 'id'>)从DefineStoreOptions<Id, S, G, A>中省略id属性，不必传递id属性
declare function defineStore<Id extends string, S extends StateTree = {}, G extends _GettersTree<S> = {}, A = {}>(id: Id, options: Omit<DefineStoreOptions<Id, S, G, A>, 'id'>): StoreDefinition<Id, S, G, A>;
// 仅包含options参数的情况
declare function defineStore<Id extends string, S extends StateTree = {}, G extends _GettersTree<S> = {}, A = {}>(options: DefineStoreOptions<Id, S, G, A>): StoreDefinition<Id, S, G, A>;
// 包含id、storeSetup和options参数(可选)的情况
// 用于内部使用
// storeSetup： 一个用于创建并返回store的setup函数
declare function defineStore<Id extends string, SS>(id: Id, storeSetup: () => SS, options?: DefineSetupStoreOptions<Id, _ExtractStateFromSetupStore<SS>, _ExtractGettersFromSetupStore<SS>, _ExtractActionsFromSetupStore<SS>>): StoreDefinition<Id, _ExtractStateFromSetupStore<SS>, _ExtractGettersFromSetupStore<SS>, _ExtractActionsFromSetupStore<SS>>;


// StateTree 泛型S state的类型
type StateTree = Record<string | number | symbol, any>;

// _GettersTree 泛型G  getters的类型
type _GettersTree<S extends StateTree> = Record<string, ((state: UnwrapRef<S> & UnwrapRef<PiniaCustomStateProperties<S>>) => any) | (() => any)>;

// 泛型A  actions的类型

// options
// Omit
// 用于从T泛型中省略指定的属性
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
// Pick
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

// DefineStoreOptions
// defineStore()中store配置对象options的类型
export declare interface DefineStoreOptions<Id extends string, S extends StateTree, G, A> extends DefineStoreOptionsBase<S, Store<Id, S, G, A>> {
    // 当前store的唯一标识值
    id: Id;
    // 可选的state，其中的每个属性的值都为初始值（state的初始状态）
    // 必须使用箭头函数形式
    state?: () => S;
    // 可选的getters对象
    getters?: G & ThisType<UnwrapRef<S> & _StoreWithGetters<G> & PiniaCustomProperties> & _GettersTree<S>;
    // 可选的actions对象
    actions?: A & ThisType<A & UnwrapRef<S> & _StoreWithState<Id, S, G, A> & _StoreWithGetters<G> & PiniaCustomProperties>;

    // 将修改前(初始状态的)和修改后的state进行合并
     *
     * @param storeState - 当前state(修改后的)
     * @param initialState - 修改前的state
     */
    hydrate?(storeState: UnwrapRef<S>, initialState: UnwrapRef<S>): void;
}


// StoreDefinition
// defineStore()的返回值类型，一个对象
declare interface StoreDefinition<Id extends string = string, S extends StateTree = StateTree, G = _GettersTree<S>, A = _ActionsTree> {
    // 包含用于返回一个store对象的方法和当前store的id两个属性
    /**
     * 返回一个store
     * 先尝试依据store的id从pinia中获取store，获取到直接返回，否则新建后返回
     *
     * @param pinia - Pinia instance to retrieve the store
     * @param hot - dev only hot module replacement
     */
    (pinia?: Pinia | null | undefined, hot?: StoreGeneric): Store<Id, S, G, A>;
    // store的id
    $id: Id;
}
```

创建

```ts
import { defineStore } from "pinia";
import { computed, ref } from "vue";

// 最后返回一个对象，对象中包含useStore()方法和store的id两个属性
// 通过调用useStore（即useMainStore()）来获取store对象

// 通过该方式可以创建多个store对象，相较于vuex4中整个应用中只创建一个store对象
// pinia中存在多个store对象，整合时是将多个子store对象整合到根store对象中
// vuex4中只存在一个store对象，拆分时将该store对象拆分为多个模块，整合时将模块进行整合

// state getters actions的类型
interface MainState {
  name: string;
  age: number;
  count: number;
}
type MainGetters<S> = Record<string, (stae: S) => any>;
interface MainActions {}

// option store
// 传递id和opstions参数
// const useMainStore = defineStore<
//   string,
//   MainState,
//   MainGetters<MainState>,
//   MainActions
// >("mainStore", {
//   state: () => ({
//     name: "Alice",
//     age: 12,
//     count: 1,
//   }),
//   getters: {},
//   actions: {},
// });

// 传递options参数
// const useMainStore = defineStore<
//   string,
//   MainState,
//   MainGetters<MainState>,
//   MainActions
// >({
//   id: "mainStore",
//   state: () => ({
//     name: "Alice",
//     age: 12,
//     count: 1,
//   }),
//   getters: {},
//   actions: {},
// });

// setup store
// 传递id setupStore（一个setup函数） options?参数
const useMainStore = defineStore("mainStore", () => {
  // state
  const name = ref<string>("Alice");
  const age = ref<number>(12);
  const count = ref<number>(1);

  // getters
  const doubleCount = computed(() => age.value * 2);

  // actions
  function increaseCount() {
    count.value++;
  }
  return {
    name,
    age,
    count,
  };
});

export default useMainStore;
```

##### 获取 store 并使用

通过调用上述获取到的`useStore`函数来返回一个 store 对象，store 是一个使用`reactive()`封装的对象

类型:

```ts
declare type Store<
  Id extends string = string,
  S extends StateTree = {},
  G = {},
  A = {}
> = _StoreWithState<Id, S, G, A> &
  UnwrapRef<S> &
  _StoreWithGetters<G> &
  (_ActionsTree extends A ? {} : A) &
  PiniaCustomProperties<Id, S, G, A> &
  PiniaCustomStateProperties<S>;

// _StoreWithState
declare interface _StoreWithState<Id extends string, S extends StateTree, G, A>
  extends StoreProperties<Id> {
  /**
   * State of the Store. Setting it will internally call `$patch()` to update the state.
   */
  // state 更新时底层会调用$patch来进行state值的更新
  // 由于是UnwrapRef类型，不需要添加.value
  $state: UnwrapRef<S> & PiniaCustomStateProperties<S>;

  /**
   *
   * 传入一个对象作为参数的情况
   * @param partialState - patch to apply to the state
   */
  $patch(partialState: _DeepPartial<UnwrapRef<S>>): void;
  /**
   * 传入一个回调函数作为参数
   * 将多个修改state的操作定义在该函数内
   * 回调函数必须是同步的
   * 在对例如set或者array进行修改时非常有效
   * @param stateMutator - 同步的回调函数
   */
  $patch<F extends (state: UnwrapRef<S>) => any>(
    stateMutator: ReturnType<F> extends Promise<any> ? never : F
  ): void;
  /**
   * 通过新建一个state对象，来重置state
   */
  $reset(): void;
  /**
   * 订阅state，对state的修改进行侦听
   * 支持添加一个回调函数和配置对象作为参数
   * 返回一个函数，用于取消订阅
   * 在vue被卸载时，也会自动取消订阅，除非设置了detached:true
   *
   * @param callback - 回调函数
   * @param options - 配置对象，包含detached immediate和deep属性
   * @returns 返回用于取消订阅的函数
   */
  $subscribe(
    callback: SubscriptionCallback<S>,
    options?: {
      detached?: boolean;
    } & WatchOptions
  ): () => void;
  /**
   * 订阅action，对action的调用进行侦听
   * 支持添加一个回调函数和detached作为参数，函数参数为一个配置对象
   * 返回一个函数，用于取消订阅
   * 在vue被卸载时，也会自动取消订阅，除非设置了detached:true
   * @param callback - 回调函数
   * @param detached -
   * @returns 返回用于取消订阅的函数
   */
  $onAction(
    callback: StoreOnActionListener<Id, S, G, A>,
    detached?: boolean
  ): () => void;
  /**
   * Stops the associated effect scope of the store and remove it from the store
   * registry. Plugins can override this method to cleanup any added effects.
   * e.g. devtools plugin stops displaying disposed stores from devtools.
   * Note this doesn't delete the state of the store, you have to do it manually with
   * `delete pinia.state.value[store.$id]` if you want to. If you don't and the
   * store is used again, it will reuse the previous state.
   */
  $dispose(): void;
  /* Excluded from this release type: _r */
}

// _ActionsTree
declare type _ActionsTree = Record<string, (...args: any[]) => any>;
```

获取 store

```ts
import useMainStore from "../store/index";
// store
const mainStore = useMainStore();
```

获取 store 中的 state getters 和 actions

```vue
<script setup lang="ts">
import { storeToRefs } from "pinia";
import useMainStore from "../store/index";
import { computed } from "vue";
const mainStore = useMainStore();

// 获取state和getters
// 使用computed使获取到的值具有响应式
// state
// const count = computed(() => mainStore.count);
// const age = computed(() => mainStore.age);
// // getters
// const doubleCount = computed(() => mainStore.doubleCount);

// 或者直接使用storeToRefs()的简便写法
const { count, age, doubleCount } = storeToRefs(mainStore);

// 获取actions
const { increaseCount } = mainStore;

function clickFn() {
  increaseCount();
}
</script>
```

#### `state`

作为一个 store 的核心，里面存储了当前应用的组件中数据

将其定义为一个返回初始状态对象的函数，以便同时支持服务端（方便 SSR）和客户端

类型: `() => S`

其中`S`为自定义 state 对象泛型

##### 定义 state

```ts
const useMainStore = defineStore<
>("mainStore", {
    // 使用箭头函数，方便类型的推断
  state: () => ({
    name: "Alice",
    age: 12,
    count: 1,
    isAdminn: true,
    items: [],
    hasChanged: false,
  }),
```

兼容 TS 时的帮助其进行类型转化:

```ts
const useStore = defineStore("mainStore", {
  state: () => {
    return {
      // 用于初始化空列表
      userList: [] as UserInfo[],
      // 用于尚未加载的数据
      user: null as UserInfo | null,
    };
  },
});

interface UserInfo {
  name: string;
  age: number;
}
```

或者单独为 state 定义一个接口类型:

```ts
interface MainState {
  userList: UserInfo[];
  user: UserInfo | null;
}
interface UserInfo {
  name: string;
  age: number;
}

const useMainStore = defineStore("mainStore", {
  state: (): MainState => ({
    userList: [],
    user: null,
  }),
});
```

##### 获取 state

```ts
import useMainStore from "../store/index";
import { computed } from "vue";
import { storeToRefs } from "pinia";
const mainStore = useMainStore();
// 获取state
// 使用computed使获取到的值具有响应式
// const count = computed(() => mainStore.count);
// const age = computed(() => mainStore.age);

// 或者直接使用storeToRefs()的简便写法
const { count, age } = storeToRefs(mainStore);
```

##### 重置 state

将 state 重置为其的初始状态

```ts
import useMainStore from "../store/index";
const mainStore = useMainStore();
function reset() {
  mainStore.$reset();
}
```

##### 映射可修改的 state

```vue
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
```

##### 修改 state

```ts
function clickFn() {
  // 修改state存在以下两种方式

  // 通过actions修改state
  // increaseCount();

  // 通过$patch修改state
  // mainStore.$patch({
  //   count: mainStore.count + 10,
  //   name : 'Alice2',
  // })
  // 或者传入一个函数进行修改，例如push一个数组时的耗时操作
  mainStore.$patch((mainStore) => {
    mainStore.items.push({ sort: "shoes", quantity: 1 });
  });
}
```

##### 订阅 state

通过 store 的`$subscribe()`来对其 state 进行侦听

在每次 state 中的值被修改时，其中的回调函数会被调用

会返回一个函数用于取消订阅，调用该函数时将取消订阅

同时在当前 vue 实例被 unmounted 之后，订阅也会被自动取消，除非设置了`detached : true`

其类型为:

```ts
    $subscribe(callback: SubscriptionCallback<S>, options?: {
        detached?: boolean;
    } & WatchOptions): () => void;

    // SubscriptionCallback
    declare type SubscriptionCallback<S> = (
      mutation: SubscriptionCallbackMutation<S>,
      state: UnwrapRef<S> // 修改后的state
      ) => void;

    // WatchOptions
    interface WatchOptions<Immediate = boolean> extends WatchOptionsBase {
    immediate?: Immediate;
    deep?: boolean;
}
```

订阅 state：

```ts
const unSubscribe = mainStore.$subscribe((mutations, state) => {
  console.log("🚀 ~ file: Home.vue:31 ~ unSubscribe ~ mutations:", mutations);
  console.log("state被修改了...");
  console.log(state.age);
});
// 手动取消订阅
// unSubscribe();
```

#### `getters`

可以认为一个 getter 就是 state 中一个属性值的计算属性

一个 getter 可以仅依赖于 state，也可以同时依赖于其它的 getter

类型:

```ts
// 其中G为自定义的getters泛型 ThisType定义函数内的this对象的类型，通过this来访问当前store中的其它getter
getters: G &
  ThisType<UnwrapRef<S> & _StoreWithGetters<G> & PiniaCustomProperties> &
  _GettersTree<S>;

// _StoreWithGetters
export declare type _StoreWithGetters<G> = {
  readonly [k in keyof G]: G[k] extends (...args: any[]) => infer R
    ? R
    : UnwrapRef<G[k]>;
};

// _GettersTree
declare type _GettersTree<S extends StateTree> = Record<
  string,
  | ((state: UnwrapRef<S> & UnwrapRef<PiniaCustomStateProperties<S>>) => any)
  | (() => any)
>;
```

##### 定义`getters`

```ts
const useMainStore = defineStore<
  string,
  MainState,
  MainGetters<MainState>,
  MainActions
>("mainStore", {
  state: (): MainState => ({
    name: "Alice",
    age: 12,
    count: 1,
    isAdminn: true,
    items: [],
    hasChanged: false,
  }),
  getters: {
    // 仅依赖于state
    doubleCount: (state: MainState) => state.count * 2,

    // 同时依赖于state和其它getter
    // 使用普通函数，以便使用this
    doubleCountPlusAge(): number {
      return this.doubleCount + this.age;
    },
  },
});
```

传递参数:

```ts
getters: {
    // 传递参数
    // 每个getter本身不能接收除state之外的其它参数
    // 但是可以通过返回一个函数来传递其它的参数
    countPlusValue: (state: MainState) => (value: number) =>
      state.count + value,
  },
```

##### 使用 getters

```vue
<template>
  <div class="homeContainer">
    <p>{{ doubleCount }}</p>
    <p>{{ doubleCountPlusAge }}</p>
    <!-- 传递参数的getter -->
    <p>{{ countPlusValue(10000) }}</p>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import useMainStore from "../store/index";
const mainStore = useMainStore();

const {
  doubleCount,
  doubleCountPlusAge,
  countPlusValue /*支持传递参数的getter*/,
} = storeToRefs(mainStore);
</script>
```

在选项式 API 中使用：

```ts
<script>
import useMainStore from "../store/index";

export default defineComponent({
  setup() {
    const mainStore = useMainStore()

    return { mainStore }
  },
  computed: {
    doubleCount() {
      return this.mainStore.doubleCount;
    },
  },
})
</script>
```

或者在选项式 API 中使用`mapState()`

```vue
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
```

##### 访问其它 store 的 getter

```ts
getters: {
    // 访问其它store中的getter
    countPlusDoubleLoves: (state: MainState) => {
      const otherStore = useOtherStore();
      return state.count + otherStore.doubelLoves;
    },
  },
```

#### `actions`

对 store 中的 state 进行修改的方式

里面可以添加任意同步或异步的方法

类型 : `actions?: A & ThisType<A & UnwrapRef<S> & _StoreWithState<Id, S, G, A> & _StoreWithGetters<G> & PiniaCustomProperties>;`

##### 定义 actions

```ts
const useMainStore = defineStore("mainStore", {
  state: () => ({
    name: "Alice",
    age: 12,
    count: 1,
    isAdminn: true,
    items: [],
    hasChanged: false,
  }),
  // ...
  actions: {
    increaseCount() {
      // 通过this(store)来获取state
      // 区别于vuex4中的传入参数state
      this.count++;
      // 调用其它store中的action
      useOtherStore().increaseLoves();
    },

    // 添加异步方法
    async getGithubUsers() {
      try {
        await axios.get("https://api.github.com/users").then((value) => {
          // console.log(value);
          const datas: Array<object> = value.data;
          datas.slice(0, 5).forEach((data) => this.datas.push(data.login));
        });
      } catch (err) {
        console.error(err);
      }
    },
  },
});
```

##### 使用 actions

```ts
import useMainStore from "../store/index";
const mainStore = useMainStore();
const { increaseCount, getGithubUsers } = mainStore;
function clickFn() {
  increaseCount();
  getGithubUsers();
}
```

在选项式 API 中的用法

```vue
<script>
import useMainStore from "../store/index";
export default defineComponent({
  setup() {
    const mainStore = useMainStore();
    return { mainStore };
  },
  methods: {
    clickFn() {
      this.mainStore.increaseCount();
      console.log("New Count:", this.mainStore.count);
      this.mainStore.getGithubUsers();
    },
  },
});
</script>
```

在选项式 API 中使用`mapActions`

```vue
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
```

##### 订阅 action

使用`store.$onAction()`来订阅一个 action

类似于通过`store.$subscribe()`来订阅一个 state，传入一个回调函数，返回一个函数用于取消订阅

传入的回调函数会在 action 执行之前执行，如果需要在之后执行，可以在回调函数的参数配置对象中添加`after`属性

同时`onError`钩子会在 action 执行出错时执行

```ts
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
```

#### 插件

通过插件的底层 API，store 支持扩展以下的功能

- 为 store 添加新属性
- 为 store 添加新的方法
- 定义 store 时增加新的配置选项
- 包装现有的 store 中的方法
- 改变、取消 action
- 实现例如本地存储等的副作用
- 将指定的插件应用于指定的 store

每个定义的插件都是通过`pinia.use()`来将其添加到 pinia 实例上的

如果在一个插件中添加一个新的 state 或者修改已有的 state，都是发生在 store 被激活之前，不会触发任何订阅函数

类型 :

```ts
plugin: PiniaPlugin;
declare interface PiniaPlugin {
  /**
   * 返回一个用于扩展store的对象
   * @param context - Context
   */
  (context: PiniaPluginContext): Partial<
    PiniaCustomProperties & PiniaCustomStateProperties
  > | void;
}

// PiniaPluginContext
declare interface PiniaPluginContext<
  Id extends string = string,
  S extends StateTree = StateTree,
  G = _GettersTree<S>,
  A = _ActionsTree
> {
  /**
   * pinia 实例.
   */
  pinia: Pinia;
  /**
   * 使用createApp()创建的当前app
   */
  app: App;
  /**
   * 当前被扩展的store
   */
  store: Store<Id, S, G, A>;
  /**
   * 使用defineStore()定义的当前store时传入的初始配置对象
   */
  options: DefineStoreOptionsInPlugin<Id, S, G, A>;
}
```

##### 添加 store 的新属性

定义一个插件用于为所有的 store 添加新属性，并将该插件添加到 pinia 实例上

```ts
// store/plugins/index.ts
// 定义插件
function addNewPropertyToStore() {
  // 为store添加新属性
  return {
    newProperty: "newPropertyText",
  };
}
export { addNewPropertyToStore };
```

```ts
// main.ts
// 添加到pinia实例上
import { createPinia } from "pinia";
import { addNewPropertyToStore } from "./usage/examples/basicUsage/store/plugins";

const pinia = createPinia();
pinia.use(addNewPropertyToStore);
// 类型为
use(plugin: PiniaPlugin): Pinia;
```

```ts
// App.vue
//  新属性添加成功
import useMainStore from "../store/index";
const mainStore = useMainStore();
console.log(mainStore.newProperty); // "newPropertyText"
```

devtools 支持:为了方便被添加的新属性在调试控制台中被使用，在 dev 模式下，将该属性添加到`store._customProperties`中

```ts
function addNewPropertyToStore({ store }: PiniaPluginContext) {
  store.newProperty = "newPropertyText";
  if (process.env.NODE_ENV === "development") {
    // 添加你在 store 中设置的键值
    store._customProperties.add("newProperty");
  }
  // 或者
  //   return {
  //     newProperty: "newPropertyText",
  //   };

  // 添加路由属性
  // 对于第三方库的类实例或非响应式的简单值使用markRaw进行包装
  store.router = markRaw(router);
}
```

##### 添加新 state

定义插件并添加到 pinia 实例中

```ts
function addNewState({ store }: PiniaPluginContext) {
  // 为store添加新的state(hasError)，如果已存在同名state，则不覆盖添加
  if (!store.$state.hasOwnProperty("hasError")) {
    // 每个store的hasError state的初始值为false
    const hasError = ref(false);
    // 先将hasError添加到$state上，允许在SSR期间被序列化
    // 在组件中通过store.$state.hasError访问
    store.$state.hasError = hasError;
  }

  // 同时在store上添加hasError属性
  // 方便在组件中通过store.hasError进行访问
  store.hasError = toRef(store.$state, "hasError");
}
```

```ts
import {
  addNewPropertyToStore,
  logPluginParams,
  addNewState,
} from "./usage/examples/basicUsage/store/plugins";

const pinia = createPinia();
pinia.use(addNewPropertyToStore).use(logPluginParams).use(addNewState);
```

使用新的 state

```ts
import useMainStore from "../store/index";
const mainStore = useMainStore();

// 使用插件
// 读取hasError
console.log(mainStore.hasError); // false
console.log(mainStore.$state.hasError); // false
```

```ts
// 修改hasError
  actions: {
    // 修改通过插件新增的state
    reviseHasError(hasError) {
      this.hasError = hasError;
    },
  },
```

插件中也可以添加对state或者action的订阅
```ts
function logPluginParams(context: PiniaPluginContext) {
  // 插件中也可以添加对state或者action的订阅
  context.store.$subscribe(() => {});
  context.store.$onAction(() => {});
}
```
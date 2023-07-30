## Vuex4 概述

使用 Vue 进行开发的一种状态管理模式，采用

- 集中式
- 存储

来管理应用的所有组件状态

其核心原理为将多个组件的共享状态抽取出来，然后通过一个全局的单例模式来进行管理。无论哪个组件（无论在任何位置、嵌套多深）都能够访问到共享的状态并进行操作

其核心对象为 store，一个全局唯一的组件数据状态的提供和管理者，同时提供了组件数据状态改变的方法

<img src="C:\Users\ycx\AppData\Roaming\Typora\typora-user-images\image-20230722010102495.png" alt="image-20230722010102495" style="zoom:67%;" />

### store 对象

每一个 Vuex 的核心为 store，其中包含了共享状态 state 和各种对 state 进行操作的方法

- 其中的状态存储是响应式的
- 不能直接对状态进行修改，只能通过 commit mutation，以便跟踪每个状态的变化

一个最基本的 store，以及对其的操作：

```js
import { createStore } from "vuex";

// 传入一个storeOptions配置对象来创建一个store对象
const store = createStore({
  // state状态
  // 可以使用对象或者函数（返回一个对象）形式
  //   state: {
  //     count: 0,
  //   },
  state() {
    return {
      count: 0,
    };
  },
  // mutations
  // 包含多个对state中的状态进行修改的方法
  // 外部通过commit来对其中的方法进行调用
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});

// 访问count
console.log("count:", store.state.count); // 0
// 在组件内使用该方法获取的count将不具备响应式

// 修改count
store.commit("increment");
console.log("count:", store.state.count); // 1
```

在组件中可以通过`this.$store`对 store 对象进行访问：

```js
methods: {
  increment() {
    this.$store.commit('increment')
    console.log(this.$store.state.count)
  }
}
```

或者，也可以通过`useStore()`函数的快捷方式

```js
const store = useStore();
// 或者导入后直接使用
import { store } from "vuex";
console.log(store);
```

以上对 store 中 state 状态的修改都是通过 commit mutation 的方式来实现的，而并非直接进行修改。这样，可以对每次的修改操作进行追踪

### 组成部分

#### `state`

一个包含全部应用层级状态的对象。Vuex 使用单一状态树，使得 state 成为唯一的数据源，每个应用中只包含一个 store 对象

在组件中访问 state 中的状态：

```js
import { store } from "./store/index";
//或者
import { useStore } from "vuex";
const store = useStore();
// 创建一个 Counter 组件
const Counter = {
  template: `<div>{{ count }}</div>`,
  // 通过使用计算属性，使得count是响应式的，当store.state.count发生改变时，count跟着改变
  computed: {
    count() {
      return store.state.count;
    },
  },
};
```

为了避免在每个组件中单独为 store 进行导入，现在将 store 添加到 vue 的实例上，通过`this.$store`进行访问

```js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count() {
      return this.$store.state.count;
    },
  },
};
```

使用 `mapState` 来获取 state 中的多个状态值，避免多次使用 `computed`

```js
import { mapState } from "vuex";
import { ref } from "vue";
export default {
  setup() {
    const localCount = ref(1);
    return {
      localCount,
    };
  },

  // 使用mapState来获取state中的多个状态
  // 同时使用computed使其都具有响应式
  computed: mapState({
    // 以下三个变量获取的都是state中的count值
    // 使用箭头函数获取state中的count值，将其赋值给count变量
    count: (state) => state.count,

    // 更简洁的写法
    // 'count' 等同于 `state => state.count`
    countAlias: "count",

    // 与当前组件中的值结合使用
    countPlusLocalState(state) {
      return state.count + this.localCount;
    },

    // 获取age值
    // age : 'age',
    // 等价于
    'age',
    ageCom: "age",
    // 获取name值
    nameCom: "name",
  }),

  // 或者使用数组的写法
  // 分别获取count age name值
  computed: mapState(["count", "age", "name"]),
};
```

#### `getters`

类似于 vue 中的 computed 计算属性，将 state 中的状态进行例如过滤等操作后进行返回（或者直接返回），然后供组件中进行读取

##### 定义`getters`:

```js
import { createStore } from "vuex";

export const store = createStore({
  state() {
    return {
      todos: [
        { id: 1, text: "text1", done: false },
        { id: 2, text: "text2", done: true },
      ],
    };
  },
  // 创建getters
  getters: {
    doneTodos(state) {
      return state.todos.filter((todo) => todo.done);
    },
    // 在getters内部访问getter
    doneTodosLength(state, getters) {
      return getters.doneTodos.length;
    },
    // 返回一个函数，在组件中调用
    // 实现通过传入id来返回对应的todo
    getTodoById(state) {
      return (id: number) => {
        return state.todos.find((todo) => todo.id === id);
      };
    },
  },
});
```

##### 访问`getters`:

- 通过`getters`属性进行访问
  ```js
  export default {
    setup() {
      const store = useStore();
      const doneTodos = store.getters.doneTodos;
      const doneTodosLength = store.getters.doneTodosLength;
      const firstTodo = store.getters.getTodoById(1);
      return {
        doneTodos,
        // doneTodosLength,
        firstTodo,
      };
    },
    // 使用计算属性
    computed: {
      doneTodosLength() {
        return this.$store.getters.doneTodosLength;
      },
    },
  };
  ```

* 通过`mapGetters()`访问

  ```js
  computed: mapGetters({
      doneTodos: "doneTodos",
      doneTodosLength: "doneTodosLength",
    }),
  ```

#### `mutations`

更改 store 中状态对唯一方法为通过 commit mutation

一个`mutations`对象中包含多个 mutation 方法，每个 mutation 由事件类型（type）和回调函数（handler）组成

**每个 mutation 中的回调函数必须为同步函数**

通过回调函数来对状态进行修改，并且每个回调函数都接收`state`作为其第一个参数

##### 定义`mutations`

```js
const store = createStore({
  state: {
    count: 1,
  },
  mutations: {
    increment(state) {
      // 变更状态
      state.count++;
    },
  },
});
```

##### 触发 mutation 中的回调函数

```js
// 传入mutation中的type值作为参数
store.commit("increment");
```

##### 传递参数 payload

回调函数还接收 payload 作为其第二个参数，一般为一个对象，以便包含多个参数字段

```js
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```

调用`increment()`，传入参数`10`

```js
store.commit("increment", 10);
```

或者

```js
mutations: {
  increment (state, payload) {
    state.count += payload.n
  }
}
```

```js
store.commit("increment", {
  n: 10,
});
// 或者将'increment'和n放在一个对象中
store.commit({
  type: "increment",
  n: 10,
});
```

mutation 的 type 值一般都是固定不变且唯一的，故传递时使用常量或者 symbol 来进行代替:

```js
// mutation-types.js
export enum MutationsTypes {
  INCREMENT = 'increment',
}
```

```js
 mutations: {
    [MutationsTypes.INCREMENT](state, payload) {
      state.count += payload.n
    }
  }
```

```js
store.commit({
  type: MutationsTypes.INCREMENT,
  n: 10,
});
```

##### 使用`mapMutations()`

```js
methods: {
    // 使用对象
    // ...mapMutations({
    //   // 将mutations中的increment()方法映射为add属性，在此处进行使用
    //   add : MutationsTypes.INCREMENT,
    // }),
    // 使用数组
    // 获取mutations中的increment()方法
    ...mapMutations(["increment"]),
    clickFn() {
      this.add({ n: 10 });
      this.increment({ n: 10 });
    },
  },
```

#### `actions`

通过`actions`中定义的方法来 commit mutation，解决`mutations`中无异步操作的问题，将异步操作定义在`actions`中

`actions`中的函数接收一个`context`对象作为其第一个参数，该对象与`store`对象具有相同的属性和方法

通过`context.commit()`来 commit 一个 mutation，类似于在组件中使用`store.commit()`来 commit 一个 mutation

还可以通过`contexty.state`和`context.getters`来访问当前`store`对象中的`state`和`getters`

##### 定义`actions`

```js
export const store = createStore({
  state() {
    return {
      count: 1,
    };
  },
  // 创建getters
  getters: {
    countGetter(state) {
      return state.count * 10;
    },
  },
  mutations: {
    [StoreTypes.INCREMENT](state, payload) {
      state.count += payload.n;
    },
  },
  actions: {
    [StoreTypes.INCREMENT](context) {
      // 获取state和getters
      console.log(context.state.count);
      console.log(context.getters.countGetter);
      // commit mutation
      context.commit(StoreTypes.INCREMENT);
    },
    // 也可以使用对象的解构语法
    [StoreTypes.INCREMENT]({ commit }) {
      commit(StoreTypes.INCREMENT);
    },
    // 传递参数给mutation
    [StoreTypes.INCREMENT]({ commit }, payload) {
      commit(StoreTypes.INCREMENT, payload);
    },
  },
});
```

##### 触发`actions`中的方法

通过 dispatch action 实现：

```js
store.dispatch(StoreTypes.INCREMENT);
//传递参数
store.dispatch(StoreTypes.INCREMENT, {
  n: 10,
});
// 或者
commit({
  type: StoreTypes.INCREMENT,
  n: 10,
});
```

##### 异步操作

```js
actions: {
    [StoreTypes.INCREMENTASYNC]({ commit }, payload) {
      // 模拟异步操作
      setTimeout(() => {
        commit(StoreTypes.INCREMENT, payload);
      }, payload.timeout);
    },
},

// dispatch
store.dispatch(StoreTypes.INCREMENTASYNC, {
        n: 10,
        timeout: 3000,
});
```

##### 使用`mapActions()`

```js
methods: {
    ...mapActions(['incrementAsync']),
    clickFn() {
      this.incrementAsync({
        n: 10,
        timeout : 1000,
      })
    },
```

##### 对 promise 的处理

`store.dispatch`可以对那个被触发的 action 返回的 promise 进行处理，并且仍旧返回一个 promise:

```js
actions: {
    [StoreTypes.INCREMENTASYNC]({ commit }, payload) {
      // 返回一个promise
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit(StoreTypes.INCREMENT, payload);
          // 成功，则传递success value
          resolve("success value");
        }, payload.timeout);
      });
    },
  },
```

进行 dispatch

```js
methods: {
    ...mapActions(["incrementAsync"]),
    clickFn() {
      this.incrementAsync({
        n: 10,
        timeout: 1000,
      }).then((value) => {
        console.log("value : ", value); // 'value :  success value'
      });
    },
  },
```

`store.dispatch`的结果返回一个 promise：

```js
actions: {
    [StoreTypes.INCREMENTASYNC]({ commit }, payload) {
      // 返回一个promise
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit(StoreTypes.INCREMENT, payload);
          // 成功，则传递success value
          resolve("success value");
        }, payload.timeout);
      });
    },

    anotherAction({ dispatch, commit }, payload) {
      return dispatch(StoreTypes.INCREMENTASYNC, payload).then((value) => {
        commit("");
        console.log(value); // 'success value'
      })
    }
  },
```

使用 async/await

```js
actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

配合过程：用户在页面上发出请求；组件通过`store.dispatch()`调用 `actons` 中的异步方法，访问后端的 API 进行数据的获取；`actions` 中获取到数据之后通过`store.commit()`commit 给 `mutations` 对象中对应的方法，`mutations` 对象再把该数据传递给`state`,对`state`中的对应状态进行修改；state 通知组件，进行页面的响应式更新

### 拆分 store

由于所有组件的状态都会集中到一个`store`对象中进行管理，如果该对象过于庞大，则可以选择对其进行拆分处理

将`state`对象拆分为多个模块，每个模块拥有自己的`state`、`getters`、`mutations`和`actions`

```js
// module1
const state = () => {
  return {
    strs: ["hello", "text"],
    age: 12,
  };
};
const getters = {};
const mutations = {
  increment(state) {
    state.age++;
  },
};
const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
```

```js
// module2

const state = () => {
  return {
    name: "Alice",
    age: 12,
    nums: [1, 2, 3],
    count: 1,
  };
};
const getters = {};
const mutations = {};
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
```

```js
// index.ts
// 根模块
import { createStore } from "vuex";
import module1Store from "./module1";
import module2Store from "./module2";

export const store = createStore({
  modules: {
    module1Store,
    module2Store,
  },
});
```

访问`state`：

```js
export default {
  setup() {
    const name = computed(() => store.state.module2.name);
    const age1 = computed(() => store.state.module1.age);
    const age2 = computed(() => store.state.module2.age);
    return {
      name,
      age1,
      age2,
    };
  },
};
```

##### 局部状态

对于拆分出来的不同的子模块，每个子模块中的状态都是局部的

模块内部的 mutation 和 getter 中接收的第一个参数`state`为当前模块中的局部状态

```js
export default {
  state: () => {
    return {
      count: 0,
    };
  },
  getters: {
    doubleCount(state) {
      console.log(state.count); // 0
      return state.count * 2;
    },
  },
  mutations: {
    increment(state) {
      console.log(state.count); // 0
      state.count++;
    },
  },
};
```

但是，也可以通过`rootState`属性来获取根模块中的状态:

```js
export default {
  // ...
  getters: {
    sumWithRootCount(state, getters, rootState) {
      return state.count + rootState.count;
    },
  },
  actions: {
    incrementIfOddOnRootSum({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit("increment");
      }
    },
  },
};
```

##### 命名空间

通过不同子模块的命名空间，来对该模块中的局部`getters`、`mutations`和`actions`进行访问
当一个子模块中设置了`namespaced:true`属性时，表示可以通过命名空间来对该子模块进行访问

### 目录结构

对于分割的多模块 store，推荐使用以下的目录结构:
|- store
|- index.ts 用于组装根 store，并导出
|- getters.ts 根 getters
|- mutations.ts 根 mutations
|- actions.ts 根 actions
|- modules  
 |- module1.ts 子模块 1
|- module2.ts 子模块 2
|- ......

### 组合式 API 写法

获取 store、访问 state、commit mutation、dispatch action 等代码都书写在`setup()`函数中

```js
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();

    // 访问state和getters
    const count = computed(() => store.state.count);
    const doubleCount = computed(() => store.getters.doubleCount);

    // commit mutation
    function increment() {
      store.commit("increment");
    }

    // dispatch action
    function asyncIncrement() {
      store.dispatch("asyncIncrement");
    }

    return {
      count,
      doubleCount,
    };
  },
};
```

### 使用插件

vuex 中的插件就是一个函数

##### 创建一个插件

```js
// 接收store作为唯一的参数
const myPlugin = (store) => {
  // 在store初始化时调用
  store.subscribe((mutation, state) => {
    // 每次commit mutation时调用
    // mutation为一个{type, payload}对象
    console.log(mutation.type);
    console.log(mutation.payload);
  });
};
```

或者创建一个插件工厂函数:

```js
export default function createWebSocketPlugin(socket) {
  // 返回一个插件函数
  return (store) => {
    socket.on('data', data => {
      store.commit('receiveData', data);
    });
    store.subscribe(mutation => {
      if(mutation.type === 'UPDATE_DATA) {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
```

##### 注册插件

```js
const webSocketPlugin = createWebSocketPlugin(socket);
const store = createStore({
  state,
  mutations,
  getters,
  actions,
  plugins: [myPlugin, webSocketPlugin],
});
```

##### 案例

生成 state 快照的插件

```js
const myPluginWithSnapshot = (store) => {
  // 保存之前的state
  // 使用深拷贝
  let prevState = _.cloneDeep(store.state);
  store.subscribe((mutation, state) => {
    // 保存之后的state
    let nextState = _.cloneDeep(state);

    // 进行例如比较之前和之后state等的操作
    // ...

    // 更新prevState，用于下次比较
    prevState = nextState;
  });
};

// 结合 process.env.NODE_ENV  让该插件只在开发阶段被使用
const store = createStore({
  // ...
  plugins: process.env.NODE_ENV !== "production" ? [myPluginWithSnapshot] : [],
});
```

vuex 自带的日志插件

```js
// 通过createLogger()函数生成日志插件
// 支持传入以下配置项
import { createLogger } from 'vuex'
const logger = createLogger({
  collapsed : false, // 打印输出日志记录时是否自动展开，默认值为true。如果logger为console，底层分别调用console.groupCollapsed(为true)或者console.group(为false)
  filter (mutation, stateBefore, stateAfter){
    // 例如返回所有type的值不为aBlocklistedMutation的mutation
    return mutation.type !== "aBlocklistedMutation"
  }, // 对mutation进行过滤
  actionFilter (action, state){}, // 对action进行过滤
  transformer （state) {}, // 对state的日志记录进行格式化，默认对state的日志记录进行原格式返回
  mutationTransformer (mutation){}, // 对mutation的日志记录进行格式化，默认对mutation的日志记录进行原格式返回。mutation为{type, payload}对象
  actionTransformer (action) {}, // // 对action的日志记录进行格式化，默认对action的日志记录进行原格式返回。action为{type, payload}对象
  logActions : true, // 是否记录actions日志,默认值为true
  logMutations : true, // 是否记录mutations日志，默认值为true
  logger : console // 自定义打印输出日志记录的实现方式，默认使用console，则打印输出为console.log()
})

// 注册插件
import { createLogger } from 'vuex'

const store = createStore({
  plugins: [logger]
  // plugins: [createLogger()]
})

// 由于该插件在底层使用了生成状态快照插件，故仅在开发环境下使用
```

### 严格模式

```js
// 开启严格模式
const store = createStore({
  strict: true,
  // ...
});
```

##### 仅在开发环境下使用严格模式

严格模式会深度监测状态树来检测不合规的状态变更,确保在发布环境下关闭严格模式，以避免性能损失

```js
const store = createStore({
  strict: process.env.NODE_ENV !== "production",
  // ...
});
```

##### 处理严格模式下表单报错的情况

如果使用了严格模式，那么如果以下的 obj 对象来自于 store 中的`state`，那么当例如通过在输入框中输入内容对`obj.message`进行修改时将报错，由于这个修改不是在 mutation 函数中执行的

```html
<input v-model="obj.message" />
```

使用双向绑定的计算属性解决：

```html
<input v-model="message" />
```

```js
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```

### 测试

#### 测试 getter

```ts
// getters.ts
export const getters = {
  filteredProducts(state: any, { filterCategory }) {
    return state.products.filter((product: any) => {
      return product.category === filterCategory;
    });
  },
};
```

```ts
// getters.spec.ts
import { getters } from "../store/module1";

const { filteredProducts } = getters;
describe("getters", () => {
  it("filteredProducts", () => {
    // 模拟state
    const state = {
      products: [
        { id: 1, title: "Apple", category: "fruit" },
        { id: 2, title: "Orange", category: "fruit" },
        { id: 3, title: "Carrot", category: "vegetable" },
      ],
    };
    const filterCategory = "fruit";

    // 测试结果
    const result = filteredProducts(state, { filterCategory });

    // 断言结果
    expect(result).toEqual([
      { id: 1, title: "Apple", category: "fruit" },
      { id: 2, title: "Orange", category: "fruit" },
    ]);
  });
});
```

#### 测试 mutation

```ts
// mutations.ts
export const mutations = {
  increment(state: any) {
    state.count++;
  },
};
```

```ts
// mutations.spec.ts
import { mutations } from "../store/module1";

const { increment } = mutations;
describe("mutations", () => {
  it("increment", () => {
    const state = { count: 0 };
    increment(state);
    expect(state.count).toBe(1);
  });
});
```

#### 测试action

### TS类型
添加自定义的类型声明文件
```ts
// vuex.d.ts
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // 自定义的state类型
  interface State {
    count : number,
    name : string,
    age : number,
    // ...
  }
  // ...

  // 为this.$store提供类型声明
  interface ComponentCustomProperties {
    $store : Store<State>,
  }
}
```
`useStore()`函数的类型声明
```ts
// store/index.ts
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

// 定义state类型
export interface State {
  count : number,
}

// 定义injection key 用于useStore()
export const key : InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    count: 0
  }
})
```
将store和key注册到vue应用：
```ts
// main.ts
// main.ts
import { createApp } from 'vue'
import { store, key } from './store'

const app = createApp({ ... })

// 传入 injection key
app.use(store, key)

app.mount('#app')
```
组件中使用:
```ts
import { useStore } from 'vuex'
import { key } from './store'

export default {
  setup () {
    const store = useStore(key)

    store.state.count // 类型为 number
  }
}
```

### 源码架构

##### Store 类

属性

- modules：收集子模块的对象
- modulesNamespaceMap : 子模块和命名空间的映射
- dispatch : 访问 actions 中的异步方法，值为一个函数，调用 Store 类中的 `dispatch` 方法
- commit : 访问 mutations 中的方法，值为一个函数，调用 `Store` 类中的 `commit` 方法
- state : 一个提供所有组件数据的对象或函数

方法

- install : 将 store 中间件挂载到 app 上
- commit :
- dispatch
- reactiveState : 将根模块中的 state 变为响应式 state

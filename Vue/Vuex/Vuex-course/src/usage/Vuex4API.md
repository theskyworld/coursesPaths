## API

### `createStore`

接收一个`StoreOptions<S>`类型的`options`对象作为参数，返回一个实例 store 对象

`options`对象中包含`state`、`getters`、`mutations`、`actions`属性，其中上述的`S`为`state`对象的泛型

```ts
import { createStore } from "vuex";

interface State {
  count: number;
  name: string;
  age: number;
  activated: boolean;
}

const store = createStore<State>({
  state() {
    return {
      count: 0,
      name: "Alice",
      age: 12,
      activated: false,
    };
  },
  getters: {},
  mutations: {},
  actions: {},
});
```

##### `state`

类型 : `S | (() => S)`

##### `getters`

类型 : `{[type | key : string] : (state: S, getters: any) => any}`

当在一个子模块中定义时的类型 : `{[type | key : string] : (state: S, getters: any, rootState: R, rootGetters: any) => any}`

##### `mutations`

类型 : `{[type | key : string] : (state : S, payload? :any) => any}`

##### `actions`

类型 : `{[type | key : string] : (context: ActionContext<S, R>, payload?: any) => any`

```ts
// ActionContext
interface ActionContext<S, R> {
  dispatch: Dispatch; // store.dispatch
  commit: Commit; // store.commit
  state: S; // store.state
  getters: any; // store.getters
  rootState: R; // store.state 针对于子模块中的getter
  rootGetters: any; // store.getters 针对于子模块中的getter
}
```

```ts
import { createStore } from "vuex";

interface State {
  count: number;
  name: string;
  age: number;
  activated: boolean;
}

export const store = createStore<State>({
  state() {
    return {
      count: 0,
      name: "Alice",
      age: 12,
      activated: false,
    };
  },
  getters: {
    duobleCount: (state) => state.count * 2,
    doubleAgePlusDoubleCount: (state, getters) =>
      state.age * 2 + getters.duobleCount,
  },
  mutations: {
    increment(state, payload) {
      state.count += payload.num;
    },
  },
  actions: {
    action1(context, payload) {
      setTimeout(() => {
        context.commit("increment", payload);
      }, payload.timeout);
    },
  },
});
```

##### `modules`

类型 : `Object`

根模块，用于包含子模块对象

```ts
{
  // 子模块对象的键名key
  // 子模块对象所包含以下属性
  key : {
    namespaced?,
    state,
    getters?,
    mutations?,
    actions?,
    modules?,
  }
}
```

```ts
import { createStore } from "vuex";
import module1 from "./module1";
import module2 from "./module2";
export const store = createStore({
  // 包含两个子模块
  modules: {
    module1,
    module2,
  },
});
```

##### `plugins`

类型 : `Array<Function>`

一个包含一个或多个应用在 store 上插件函数的数组

每个插件都接收`store`作为其唯一的参数，其类型为`(store: Store<S>) => any`

每个插件内部都可以监听或者 commit mutation

```ts
const webSocketPlugin = createWebSocketPlugin(socket);
const store = createStore({
  state,
  mutations,
  getters,
  actions,
  plugins: [myPlugin, webSocketPlugin],
});
```

##### `strict`

类型 : `boolean`

是否让 store 进入严格模式，进入之后任何在 mutation 函数以外的修改 state 行为都会报错，默认值为`false`

##### `devtools`

类型 : `boolean`

是否为当前 vuex 实例打开 devtools，默认值为`false`

```ts
const webSocketPlugin = createWebSocketPlugin(socket);
const store = createStore({
  state,
  mutations,
  getters,
  actions,
  plugins: [myPlugin, webSocketPlugin],
  strict: false,
  devtools: false,
});
```

### Store 实例属性

##### `state`

只读

##### `getters`

只读

### Store 实例方法

##### `commit()`

commit mutation，执行 mutation 中的回调函数
无返回值

类型 :

```ts
// type : mutation的type值
// payload : 传递给mutation回调函数的参数payload
// options : 配置对象。例如里面配置root : true表示允许commit根模块中的mutation
// payloadWithTypeObj : 同时包含type和payload的对象
commit(type : string, payload? : any, options? : CommitOptions) : void
commit(payloadWithTypeObj : Object, options? : CommitOptions) : void
```

##### `dispatch()`

dispatch action，执行 action 中的回调函数

最后返回一个 promise

类型:

```ts
commit(type : string, payload? : any, options? : DispatchOptions) : Promise<any>
commit(payloadWithTypeObj : Object, options? : DispatchOptions) : Promise<any>
```

##### `replaceState()`

替换根模块中的 state
类型: `replaceState(state: S): void;`

##### `watch()`

响应式地侦听其中`getter`函数的返回值，当值发生改变时调用回调函数`cb`

最终返回一个函数，通过调用该函数可以停止侦听

类型 : `watch<T>(getter: (state: S, getters: any) => T, cb: (newValue: T, oldValue: T) => void, options?: WatchOptions): () => void;`

##### `subscribe()`

订阅 store 中的 mutation

最终返回一个函数，可以通过调用该函数来停止订阅

类型 :

```ts
// fn : 在每个mutation的回调函数执行完毕之后自动调用
// state : mutation中的回调函数执行完毕之后的state
// options : 包含一个可选的prepend属性，类型为boolean，表示是否将fn函数添加到链的最开始
subscribe<P extends MutationPayload>(fn: (mutation: P, state: S) => any, options?: SubscribeOptions): () => void;
```

##### `subscribeAction()`

订阅 store 中的 action
，其它的类似于`subscribe()`

类型 :

```ts
subscribeAction<P extends ActionPayload>(fn: (action: P, state: S) => any | ActionSubscribersObject, options?: SubscribeOptions): () => void;
// ActionSubscribersObject是指
interface ActionSubscribersObject<P, S> {
  // 在dispatch action之前调用的函数
  before?: (action: P, state: S) => any;
  // 在dispatch action之后调用的函数
  after?: (action: P, state: S) => any;
  // 在dispatch action出错时调用的函数
  error?: (action: P, state: S, error: Error) => any;
}
```

##### `registerModule()`

动态注册子模块

类型 :

```ts
// path 子模块的路径名
  registerModule<T>(path: string, module: Module<T, S>, options?: ModuleOptions): void;
  // path 嵌套子模块的路径名
  registerModule<T>(path: string[], module: Module<T, S>, options?: ModuleOptions): void;

  // ModuleOptions
  interface ModuleOptions {
    // 是否允许保留之前的state 用于服务端渲染
  preserveState?: boolean;
}
```

##### `unregisterModule()`

动态卸载一个已注册的子模块

类型 :

```ts
// path 子模块的路径名
  unregisterModule(path: string): void;
  // path 嵌套子模块的路径名
  unregisterModule(path: string[]): void;
```

##### `hasModule()`

检查指定的子模块是否已被注册

类型 :

```ts
// path 子模块的路径名
  hasModule(path: string): boolean;
  // path 嵌套子模块的路径名
  hasModule(path: string[]): boolean;
```

##### `hotUpdate()`

热重载

类型：

```ts
  hotUpdate(options: {
    actions?: ActionTree<S, S>;
    mutations?: MutationTree<S>;
    getters?: GetterTree<S, S>;
    modules?: ModuleTree<S>;
  }): void;
```

### 辅助函数

##### `mapState`

为组件创建计算属性并返回 store 中的指定 state 值
类型 :

```ts
mapState: MapperForState;
interface MapperForState {
  // S for state
  // Map for map
  // Map 约束于 Record<string, Function> = {}
  // Function : (this, state, getters) => any
  <
    S,
    Map extends Record<string, (this: CustomVue, state: S, getters: any) => any>
  >(
    // 可选的命名空间
    // namespace: string,
    map: Map
  ): {
    // 取Map中的每个key
    [K in keyof Map]: InlineComputed<Map[K]>; // () => R
  };
}
// 要求传入的T（Map[K]）为函数类型，且可接收或不接收参数
type InlineComputed<T extends Function> = T extends (...args: any[]) => infer R
  ? () => R
  : never;

// mapState为一个函数
// 接收的唯一参数为map，类型为一个对象
// 对象的键为string类型，值为(this: CustomVue, state: S, getters: any) => any类型
// 一个函数，第一个参数为state、第二个参数为getters，this值为自定义的vue

// 返回值为一个对象
// 对象的键来自于map，值为一个InlineComputed<Map[K]>类型，以便作为computed的值进行使用，也即() => R

interface Test {
  (uname: string): {
    age: number;
  };
}

const test: Test = (uname: string) => {
  return {
    age: 12,
  };
};
```

##### `mapGetters()`

为组件创建计算属性并返回指定的 getter 值

类型:

```ts
mapGetters: Mapper<Computed>;
type Computed = () => any;

interface Mapper<R> {
  <Key extends string>(map: Key[]): { [K in Key]: R };
  <Map extends Record<string, string>>(map: Map): { [K in keyof Map]: R };
}

// mapGetters的类型为一个函数
// 接收map作为唯一的参数，类型为一个字符串类型的Key值组成的数组或者对象类型
// 对象的键和值均为string类型

// 返回一个对象类型，对象的键来自于Key值数组或者Map，值为() => any类型
```

##### `mapMutations()`

为组件 commit 指定的 mutation

类型 :

```ts
mapMutations: MapperForMutation;
// 每个mutation的类型
type MutationMethod = (...args: any[]) => void;

// mapMutations的类型
interface MapperForMutation {
  <
    Map extends Record<
      string,
      (this: CustomVue, commit: Commit, ...args: any[]) => any
    >
  >(
    map: Map
  ): { [K in keyof Map]: InlineMethod<Map[K]> };
}
type InlineMethod<T extends (fn: any, ...args: any[]) => any> = T extends (
  fn: any,
  ...args: infer Args
) => infer R
  ? (...args: Args) => R
  : never;
```

##### `mapActions()`

为组件 dispatch 指定的 action

类型:

```ts
mapActions: MapperForAction;
// 每个action回调函数的类型
type ActionMethod = (...args: any[]) => Promise<any>;

// mapActions类型
interface MapperForAction {
  <
    Map extends Record<
      string,
      (this: CustomVue, dispatch: Dispatch, ...args: any[]) => any
    >
  >(
    // 可选的命名空间
    // namespaced : string,
    map: Map
  ): { [K in keyof Map]: InlineMethod<Map[K]> };
}
type InlineMethod<T extends (fn: any, ...args: any[]) => any> = T extends (
  fn: any,
  ...args: infer Args
) => infer R
  ? (...args: Args) => R
  : never;
```

##### `createNamespacedHelpers()`

创建一个基于命名空间组件的辅助函数
类型:

```ts
// 接收namespace作为其唯一的参数
// 返回一个包含mapState、mapMutations、mapActions和mapGetters的对象，对以上的方法进行映射使用
declare function createNamespacedHelpers(namespace: string): NamespacedMappers;

interface NamespacedMappers {
  mapState: Mapper<Computed> & MapperForState;
  mapMutations: Mapper<MutationMethod> & MapperForMutation;
  mapGetters: Mapper<Computed>;
  mapActions: Mapper<ActionMethod> & MapperForAction;
}
```

### `useStore()`

组合式 API 中用于获取 store 的方式

类型:

```ts
// S用于指定state的类型
// 其中InjectionKey为Symbol类型
export function useStore<S = any>(
  injectKey?: InjectionKey<Store<S>> | string
): Store<S>;
```

在 `setup` 钩子函数中调用该方法可以获取注入的 store

```ts
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
  },
};
```

使用`useStore()`时可以提供 key 参数（自定义）或者不提供（默认值）

以下为使用自定义 key 的方式:

```ts
// 在store/index.ts中创建自定义的key
// store.ts
import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

export interface State {
  count: number;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    count: 0,
  },
});
```

```ts
// 在main.ts中将该key注册到vue实例上
// main.ts
import { createApp } from "vue";
import { store, key } from "./store";

const app = createApp();

app.use(store, key);

app.mount("#app");
```

```ts
// 在组件中进行使用
// 在 vue 组件内
import { useStore } from "vuex";
import { key } from "./store";

export default {
  setup() {
    const store = useStore(key);

    console.log(store.state.count); // 0
  },
};
```

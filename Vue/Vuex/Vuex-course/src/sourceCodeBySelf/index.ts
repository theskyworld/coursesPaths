// 实现Store
import { App, inject } from "vue";

/* ************types****************start */
interface StoreOptions<S> {
  state?: S;
  getters?: GetterTree<S, S>;
  mutations?: MutationTree<S>;
  actions?: ActionTree<S, S>;
  // 收集子模块
  modules?: ModuleTree<S>;
}
// ModuleTree
interface ModuleTree<R> {
  [key: string]: Module<any, R>;
}
// Module：子模块的类型
export interface Module<S, R> {
  namespaced?: boolean;
  state?: S;
  getters?: GetterTree<S, R>;
  mutations?: MutationTree<S>;
  actions?: ActionTree<S, R>;
  // 子模块的嵌套
  modules?: ModuleTree<R>;
}

// ActionTree
interface ActionTree<S, R> {
  [key: string]: Action<S, R>;
}
// payload 负载，传递的数据
type Action<S, R> = (context: ActionContext<S, R>, payload?: any) => any;
// export interface ActionContext<S, R> {
//   dispatch: Dispatch;
//   commit: Commit;
//   state: S;
// }
export interface ActionContext<S, R> {
  commit: Commit;
}
// type : actions中的方法名
type Dispatch = (type: string, payload?: any) => any;
// type : mutations中的方法名
type Commit = (type: string, payload?: any) => any;

// MutationTree
interface MutationTree<S> {
  [key: string]: Mutation<S>;
}
type Mutation<S> = (state: S, payload?: any) => void;

// GetterTree
// S为当前Store的泛型，R为根Store的泛型
interface GetterTree<S, R> {
  [key: string]: Getter<S, R>;
}
// type Getter<S, R> = (
//   state: S,
//   getters: any,
//   rootState: R,
//   rootGetters: any
// ) => any;
type Getter<S, R> = (state: S) => any;

// for register state、getters、mutations、actions
type TraverseChildFn<R> = (
  moduleWrapper: ModuleWrapper<any, R>,
  key: string
) => void;
type TraverseGettersFn<R> = (getter: Getter<any, R>, key: string) => any;
type TraverseMutationsFn<S> = (getter: Mutation<S>, key: string) => any;
type TraverseActionsFn<S, R> = (action: Action<S, R>, key: string) => any;

/* ************types****************end */




const injectKey = "store";
class Store<S = any> {
  moduleCollection: ModuleCollection<S>;
  mutations: Record<string, any> = {};
  actions: Record<string, any> = {};
  getters: GetterTree<any, S> = {};
  // 同时添加_commit和_dispatch属性
  // 实现既可以通过属性又可以通过方法本身来调用方法
  _commit: Commit;
  _dispatch: Dispatch;
  constructor(options: StoreOptions<S>) {
    // console.log(options);
    this.moduleCollection = new ModuleCollection<S>(options);

    const store = this;
    this._commit = function boundCommit(type: string, payload: any) {
      this.commit.call(store, type, payload);
    };
    this._dispatch = function boundDispatch(type: string, payload: any) {
      this.dispatch.call(store, type, payload);
    };

    const rootState = this.moduleCollection.root.state;
    console.log("注册模块...,rootState : ", rootState);
    // 调用installModule()初始化根模块
    // 并在该函数内部递归注册其所有子模块
    installModule(store, rootState, [], this.moduleCollection.root);
    console.log("注册模块之后, rootState : ", rootState);
  }
  // 将store挂载到app上，以便通过app.use()来进行使用
  install(app: App) {
    app.provide(injectKey, this);
  }
  test() {
    return "hello";
  }

  /**
   * 根据方法名调用mutations中对应的方法，传递payload作为方法的参数
   * @param type 方法名
   * @param payload
   */
  commit(type: string, payload: any) {
    if (!this.mutations[type]) {
      console.error("[vuex] unknown mutations type : ", type);
    }
    this.mutations[type](payload);
    console.log("🚀 ~ file: index.ts:117 ~ Store<S ~ commit ~ type:", type)
  }

  dispatch(type: string, payload: any) {
    if (!this.actions[type]) {
      console.error("[vuex] unknown actions type : ", type);
    }
    this.actions[type](payload);
  }
}

/**
 * 注册模块，将所有的子模块注册到根模块中
 * 将每个模块中的state, getters,mutations等都集中添加到store中进行管理
 * @param store
 * @param rootState 根模块的state
 * @param path 多个命名空间名形成的数组
 * @param module 当前模块
 */
function installModule<R>(
  store: Store<R>,
  rootState: R,
  path: string[],
  module: ModuleWrapper<any, R>
) {
  let isRoot = !path.length;
  // console.log("🚀 ~ file: index.ts:134 ~ path:", path);
  const namespace = store.moduleCollection.getFormattedNamespace(path);
  console.log("🚀 ~ file: index.ts:136 ~ namespace:", namespace);
  const actionContext: ActionContext<any, R> = getLocalContext(
    store,
    namespace
  );
  if (!isRoot) {
    // 获取父模块的state对象
    const parentState: any = getParentState(rootState, path.slice(0, -1));
    // 将当前模块的state添加到父模块的state对象上
    parentState[path[path.length - 1]] = module.state;
  }

  // 遍历当前模块子模块的命名空间名和子模块，用于注册嵌套的子模块
  module.traverseChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child);
  });

  // 注册getters
  module.traverseGetters(function (getter, key) {
    const namespaceKey = namespace + key;
    // 添加对应的getter函数到getters对象上
    // store.getters[namespaceKey] = getter;

    // 添加getter函数执行之后的结果到getters对象上
    Object.defineProperty(store.getters, namespaceKey, {
      get: () => {
        return getter(module.state);
      },
    });
  });

  // 注册mutations
  module.traverseMutations(function (mutation, key) {
    const namespaceKey = namespace + key;
    store.mutations[namespaceKey] = function (payload: any) {
      // mutation(module.state, payload);
      mutation.call(store, module.state, payload);
    };
  });

  // 注册actions
  module.traverseActions(function (action, key) {
    const namespaceKey = namespace + key;
    store.actions[namespaceKey] = function (payload: any) {
      // action({commit : store.commit}, payload);
      // action.call(store, { commit: store.commit }, payload);
      action.call(store, { commit: actionContext.commit }, payload);
    };
  });
}

function getLocalContext<R>(store: Store<R>, namespace: string) {
  // 如果为根模块，则没有命名空间
  const withoutNamespace = namespace === "";
  const actionContext: ActionContext<any, R> = {
    // 如果为根组件，则没有namespace，对于其commit不需要处理，直接返回store.commit即可
    // 反之，则需要返回一个新的commit函数，对其中的type在前面添加namespace
    commit: withoutNamespace
      ? store.commit
      : function (type: string, payload: any) {
          type = namespace + type;
          store.commit(type, payload);
        },
  };
  return actionContext;
}

// 获取指定模块父模块的state
function getParentState<R>(rootState: R, path: string[]) {
  // 依据path，从根state向下进行获取
  return path.reduce((state, key) => {
    return (state as any)[key];
  }, rootState);
}

// 创建Store类的实例并返回
export function createStore<S>(options: StoreOptions<S>) {
  return new Store<S>(options);
}

// 在组件中使用，将store注入到组件中
export function useStore<S>(): Store<S> {
  return inject(injectKey) as any;
}

class ModuleWrapper<S, R> {
  // 当前模块的子模块
  children: Record<string, ModuleWrapper<any, R>> = {};
  // 当前模块
  _rawModule: Module<any, R>;
  // 当前模块的state
  state: S;
  // 当前模块是否需要通过命名空间属性来搜索子模块
  namespaced: boolean;
  constructor(rawModule: Module<any, R>) {
    this._rawModule = rawModule;
    this.state = rawModule.state || Object.create(null);
    this.namespaced = rawModule.namespaced || false;
  }

  // 添加子模块
  // 使用namespace命名空间名作为children对象属性的key值
  addChild(namespace: string, moduleWrapper: ModuleWrapper<any, R>) {
    this.children[namespace] = moduleWrapper;
  }
  // 获取子模块
  getChild(namespace: string) {
    return this.children[namespace];
  }
  traverseChild(fn: TraverseChildFn<R>) {
    Object.keys(this.children).forEach((key) => {
      fn(this.children[key], key);
    });
  }

  traverseGetters(fn: TraverseGettersFn<R>) {
    if (this._rawModule.getters) {
      Object.keys(this._rawModule.getters).forEach((key) => {
        fn((this._rawModule.getters as any)[key], key);
      });
    }
  }

  traverseMutations(fn: TraverseMutationsFn<S>) {
    if (this._rawModule.mutations) {
      Object.keys(this._rawModule.mutations).forEach((key) => {
        fn((this._rawModule.mutations as any)[key], key);
      });
    }
  }

  traverseActions(fn: TraverseActionsFn<S, R>) {
    if (this._rawModule.actions) {
      Object.keys(this._rawModule.actions).forEach((key) => {
        fn((this._rawModule.actions as any)[key], key);
      });
    }
  }
}

// 管理所有的模块
class ModuleCollection<R> {
  root!: ModuleWrapper<any, R>;
  constructor(rawRootModule: Module<any, R>) {
    this.register([], rawRootModule);
  }

  /**
   * 添加模块
   * @param path 子模块namespace组成的数组
   * @param rawModule 当前被添加的模块
   */
  register(path: string[], rawModule: Module<any, R>) {
    // 当前要被添加的模块
    const newModuleToAdd = new ModuleWrapper<any, R>(rawModule);
    // path长度为0，当前添加的为根模块
    if (path.length === 0) {
      this.root = newModuleToAdd;
    } else {
      // 添加子模块到其父模块
      // 获取当前子模块的父模块
      const parentModule = this.getModule(path.slice(0, -1));
      // 将当前子模块添加到其父模块
      parentModule.addChild(path[path.length - 1], newModuleToAdd);
    }
    // 递归添加嵌套的子模块
    // modules不为空代表还存在子模块
    if (rawModule.modules) {
      const sonModules = rawModule.modules;
      Object.keys(sonModules).forEach((namespace) => {
        this.register(path.concat(namespace), sonModules[namespace]);
      });
    }
  }

  getModule(path: string[]) {
    const rootModule = this.root;
    return path.reduce(
      (moduleWrapper: ModuleWrapper<any, R>, namespace: string) => {
        // 每次获取根模块的子模块
        // 等价于得到指定子模块的父模块
        return rootModule.getChild(namespace);
      },
      rootModule
    );
  }

  // 从根节点开始，依次向下来获取各个模块的命名空间名
  // 然后将'/'符号将每个不同层级的namespace进行连接
  getFormattedNamespace(path: string[]) {
    let moduleWrapper = this.root;
    return path.reduce((namespace, key) => {
      moduleWrapper = moduleWrapper.getChild(key);
      return namespace + (moduleWrapper.namespaced ? key + "/" : "");
    }, "");
  }
}

import {
  CommitOptions,
  StoreOptions,
  SubscribeActionOptions,
  SubscribeFn,
  SubscribeOptions,
  WatchCb,
  WatchGetter,
} from "./types/store";
import { App, watch, InjectionKey, inject, WatchOptions } from "vue";
import { isObject } from "@vue/shared";

// 实现Store的实例化并向外导出
export function createStore<S>(options: StoreOptions<S>) {
  // 整个应用中store只有一个
  // 实例化Store（调用createStore()时）表示当前创建的store为唯一的根store
  return new Store<S>(options);
}

const storeKey = "store";
export function useStore(key = null) {
  return inject(key !== null ? key : storeKey);
}

class Store<S> {
  // 属性字段的索引签名
  // 可以包含任意个任意的属性
  [key: string]: any;
  constructor(options: StoreOptions<S> = {}) {
    // 从options中取出以下值
    const { plugins = [], strict = false, devtools } = options;

    // Strore内部属性，只能在Store内部被访问
    this._committig = false; // 是否正在执行store.commit()

    // actions
    this._actions = Object.create(null);

    this._actionSubscribes = []; // action订阅器
    this._subscribes = []; // mutation订阅器

    // mutations
    this._mutations = Object.create(null);

    this._wrappedGetters = Object.create(null);
    this._makeLocalGettersCache = Object.create(null);

    this._modules = new ModuleCollection(options); // store子模块
    this._moduleNamespaceMap = Object.create(null); // 用于在根模块中存储子模块，通过namespace和模块进行映射

    this._scope = null;

    this._devtools = devtools;

    const store = this;
    const { dispatch, commit } = this;
    // 重写dispatch和commit方法，将两个方法内的this绑定为store

    /**
     * type- actions中的方法名
     * payload-传递给actions中方法的参数（一般为对象）
     */
    this.dispatch = function bindStoreToDispatch(type: string, paylaod: any) {
      return dispatch.call(store, type, paylaod);
    };
    /**
     * type-mutations中的方法名
     * payload-传递给mutations中方法的参数（一般为对象）
     * options-mutations中方法的配置对象
     * {
        silent?: boolean;
        root?: boolean;
        }
     */
    this.commit = function bindStoreToCommit(
      type: string,
      payload: any,
      options: CommitOptions
    ) {
      return commit.call(store, type, payload, options);
    };

    this.strict = strict;

    const state = this._modueles.root.state;
    installModule(this, state, [], this._modules.root);

    resetStoreState();

    plugins.forEach((plugin) => plugin(this));
  }

  /**
   * state的getter
   */
  get state() {
    return this._state.data; // ? _state在哪里声明并进行了初始化
  }
  /**
   * 通过store.commit()来调用mutations中的方法，从而对store中的state进行修改
   * 修改state的唯一方式
   * @param _type -_type可能为一个字符串或者包含type和payload的对象，非实际的type
   * @param _payload -非实际的payload
   * @param _options -非实际的options
   *
   * @example
   * store.commit("increaseCount", { countAdded : 3 })
   */
  commit(_type: string, _payload: any, _options: CommitOptions) {
    // 取转换后实际的type payload和options
    const { type, payload, options } = unifyObjectStyle(
      _type,
      _payload,
      _options
    );

    // 从mutations中取出对应的mutation函数
    const mutationHandler = this._mutations[type];
    // 没取到值时开发环境下的报错
    if (!mutationHandler) {
      if (__DEV__) {
        console.error(`[vuex] unknown mutation type: ${type}`);
      }
      return;
    }

    // 执行mutationHandler
    this._executorCommit(() => {
      mutationHandler.forEach((handler) => {
        handler(payload);
      });
    });

    // 执行mutation订阅器
    // 实现每次通过store.commit()调用mutation时，订阅器中的回调函数的自动执行
    // 但是,通过例如store._mutations["increaseCount"]的方式(非推荐/官方方式)调用mutation时,不会触发订阅器中回调函数的执行
    const mutation = { type, payload };
    this._subscribes
      .slice() // 浅拷贝_subscribes,避免订阅器在异步取消订阅时失效
      .forEach((sub) => sub(mutation, this.state));
  }

  dispatch(_type: string, _payload: any) {
    const { type, payload } = unifyObjectStyle(_type, _payload);
    const actionHandler = this._actions[type];
    if (!actionHandler) {
      if (__DEV__) {
        console.error(`[vuex] unknown action type: ${type}`);
      }
      return;
    }

    // 执行action订阅器
    const action = { type, payload };
    this._actionSubscribes
      .slice()
      .filter((sub) => sub.before) // 执行action订阅器中在action执行前执行的部分
      .forEach((sub) => sub.before(action, this.state));

    // 执行actionHandler,并取执行后的结果
    const result =
      actionHandler.length > 1
        ? Promise.all(actionHandler.map((handler) => handler(payload)))
        : actionHandler[0](payload);

    //  store.dispatch()最后返回一个promise
    return new Promise((resolve, reject) => {
      result.then(
        (value) => {
          // 执行action订阅器中在action执行之后执行的部分
          this._actionSubscribes
            .filter((sub) => sub.after)
            .forEach((sub) => sub.after(action, this.state));

          resolve(value);
        },
        (reason) => {
          // 无论resove()还是reject()都执行
          this._actionSubscribes
            .filter((sub) => sub.after)
            .forEach((sub) => sub.after(action, this.state));

          reject(reason);
        }
      );
    });
  }

  /**
   * 订阅mutation
   * 将定义的订阅器添加到this._subscribes中，将来在commit()中进行执行
   * @param fn - mutation被调用时触发的回调函数，在store.commit()函数内被触发
   * @param options - 配置对象
   * 类型为
   * interface SubscribeOptions {
      prepend?: boolean  是否将当前fn作为第一个执行
    }
   * @returns 最后返回一个函数，用于取消订阅
   */
  subscribe(fn: SubscribeFn, options: SubscribeOptions) {
    return storeSubscribes(fn, this._subscribes, options);
  }

  /**
   * 订阅action'
   * 将定义的订阅器添加到this._actionSubscribers中，将来在dispatch()中执行
   * @param fn - 回调函数或者包含回调函数的对象，在store.dispatch()中触发
   *             回调函数对象中包含before after 和 error属性，
   *             用于指定在action执行前、执行后和执行出错时的回调函数
   *             如果fn为一个函数，则默认在执行前执行（{before : fn}）
   *
   * @param options -配置对象
   * @returns 最后返回一个函数，用于取消订阅
   */
  subscribeAction(fn: SubscribeActionOptions, options: SubscribeOptions) {
    const subs = typeof fn === "function" ? { before: fn } : fn;

    return storeSubscribes(subs, this._actionSubscribers, options);
  }

  /**
   * 侦听state或者getters中指定的属性
   * @param getter 用于返回那个要侦听的state或者getters中的属性
   * @param cb 回调函数
   * @param options 
   * @returns 
   */
  watch(getter: WatchGetter, cb: WatchCb, options: WatchOptions) {
    // watch : 使用vue中的watch()进行侦听
    return watch(
      () => getter(this.state, this.getters),
      cb,
      Object.assign({}, options)
    );
  }

  /**
   * 替换掉整个state
   * @param state 
   */
  replaceState<S>(state : S) {
    this._executorCommit(() => {
      this._state.data = state;
    })
  }


  registerModule(path, rawModule, options = {}) {
    // 最终处理的path都是数组形式的
    if (typeof path === 'string') path = [path];

    this._modules.register(path, rawModue);

    installModule(
      this,
      this.state,
      path,
      this._modules.get(path),
      options.preserveState
    );

    resetStoreState(this, this.state);
  }

















  /**
   * 将store添加到vue实例app上以及依赖的注入（provide）
   * 实现能够通过在vue组件中this.$store进行访问
   * @param app -vue实例
   * @param injectKey -依赖注入时依赖的key
   */
  install(app: App, injectKey?: InjectionKey<Store<any>> | string) {
    app.provide(injectKey || storeKey, this);
    app.config.globalProperties.$store = this;
  }

  /**
   * 执行commit中的mutationHandler()，同时修改this._committing的状态
   * @param fn
   */
  _executorCommit(fn : any) {
    const committing = this._committing;
    this._committing = true;
    fn();
    this._committing = committing;
  }
}

/**
 * 实现以下情况中的处理
 * 此时第一个参数为type和payload,第二个参数为options，如果传入第三个参数无意义
 * store.commit({
 *  type : 'increaseCount'
 *  num : 1
 * }, {
 *  slient : false
 * })
 * 或者
 * 此时第一、二、三个参数依次为type payload和options
 *  store.commit('increaseCount', { num : 1 },{
 *  slient : false
 * })
 * @param type -一个字符串或者包含type和payload的对象
 * @param payload -实际的options
 * @param options -无意义的值
 * @returns
 */
function unifyObjectStyle(type: any, payload: any, options?: any) {
  // type为一个对象
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }
  // type为一个字符串

  return { type, payload, options };
}
function isObject(obj: any) {
  return obj !== null && typeof obj === "object";
}

function storeSubscribes(fn: any, subs: any, options: SubscribeOptions) {
  // 之前subs中不存在fn，则进行添加
  if (subs.indexOf(fn) < 0) {
    // 依据prepend添加到首位或者末位，将来执行
    options && options.prepend ? subs.unshift(fn) : subs.push(fn);
  }

  // 返回一个函数
  // 用于将来取消订阅
  return () => {
    const i = subs.indexOf(fn);
    if (i > -1) {
      // 将当前订阅器从this._subscribes中移除
      subs.splice(i, 1);
    }
  };
}

/**
 * 将子模块添加到父模块（根模块）中
 * @param store 
 * @param rootState 
 * @param path 如果为根模块,[];如果为子模块,["module1Store"];如果为嵌套子模块,["module1Store", "module1SonStore"]
 * @param module 子模块
 * @param hot 
 */
function installModule(store, rootState, path, module, hot) {
  // 根模块不需要通过path进行访问（[]）
  const isRoot = !path.length;
  // 将path拼接成命名空间
  // ["module1Store"] → "module1Store"
  // ["module1Store", "module1SonStore"] → "module1Store"/"module1SonStore"
  // 通过命名空间来作为key值从根模块中访问指定的子模块
  const namespace = store._modules.getNamespace(path);

  if (module.namespaced) {
    // 通过namespace将子模块存储至this._modulesNamespaceMap中
    store._modulesNamespaceMap[namespace] = module;
  }

  // 添加子模块的state至父模块的state
  // 对于嵌套的子模块，将子模块中的state存储至其父模块的state上
  if (!isRoot && !hot) {
    // 获取父模块的state
    const parentState = getNestedState(rootState, path.slice(0, -1));
    // 子模块名
    const moduleName = path[path.length - 1];
    // 存储state至其父模块的state上
    store._executorCommit(() => {
      parentState[moduleName] = module.state;
    });
  }

  // 添加子模块的mutations至父模块的mutations

  // 添加子模块的actions至父模块的actions

  // 添加子模块的getters至父模块的getters
}
export default createStore;

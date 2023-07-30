import { PiniaPluginContext } from "pinia";
import { markRaw, ref, toRef } from "vue";
import debounce from "lodash/debounce";
function addNewPropertyToStore({ store }: PiniaPluginContext) {
  //   store.newProperty = "newPropertyText";
  //   if (process.env.NODE_ENV === "development") {
  //     // 添加你在 store 中设置的键值
  //     store._customProperties.add("newProperty");
  //   }
  // 或者
  return {
    newProperty: "newPropertyText",
  };

  // 添加路由属性
  //   store.router = markRaw(router);
}

function logPluginParams(context: PiniaPluginContext) {
  //   console.log("app:", context.app);
  //   console.log("pinia:", context.pinia);
  //   console.log("store:", context.store);
  //   console.log("options:", context.options);

  // 插件中也可以添加对state或者action的订阅
  context.store.$subscribe(() => {});
  context.store.$onAction(() => {});
}

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

function addNewOptionToStore({ options, store }: PiniaPluginContext) {
  Object.defineProperty(options, "debounce", {
    writable: true,
  });
  (options as any).debounce = {
    increaseCount: 1000,
  };
}

function wrapActions({ options, store }: PiniaPluginContext) {
  console.dir(options);
  if ((options as any).debounce) {
    // 我们正在用新的 action 来覆盖这些 action
    return Object.keys((options as any).debounce).reduce(
      (debouncedActions, action) => {
        if (store[action]) {
          (debouncedActions as any).action = debounce(
            store[action],
            (options as any).debounce[action]
          );
        }
        return debouncedActions;
      },
      {}
    );
  }
}
export {
  addNewPropertyToStore,
  logPluginParams,
  addNewState,
  addNewOptionToStore,
  wrapActions,
};

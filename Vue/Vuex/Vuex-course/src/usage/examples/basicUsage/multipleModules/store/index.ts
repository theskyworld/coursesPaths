import { createStore } from "vuex";
import module1Store, { Module1State } from "./modules/module1";
import module2Store, { Module2State } from "./modules/module2";
export interface RootState {
  module1Store: Module1State;
  module2Store: Module2State;
}

const store = createStore<RootState>({
  // 注册子模块
  modules: {
    module1Store,
    module2Store,
  },
});

export default store;

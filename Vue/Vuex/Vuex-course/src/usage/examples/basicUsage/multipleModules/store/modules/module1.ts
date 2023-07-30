import { RootState } from "./../index";
import { ActionContext } from "vuex";
// 子模块 module1

export interface Module1State {
  id: number;
  gender: string;
  count: number;
  strs: Array<string>;
  loves: number;
}
const REVISESTRS = Symbol("reviseStrs");
const REVISECOUNT = Symbol("reviseCount");
const SYNCREVISESTRS = Symbol("syncReviseStrs");
export const enum Module1MutationTypes {
  REVISESTRS = "reviseStrs",
  REVISECOUNT = "reviseCount",
}
export const enum Module1ActionTypes {
  SYNCREVISESTRS = "syncReviseStrs",
}
const state: Module1State = {
  id: 1,
  gender: "female",
  count: 1,
  strs: ["hello", "test"],
  loves: 3,
};

// 子模块中的getters : {[type | key : string] : (state: S, getters: any, rootState: R, rootGetters: any) => any}
const getters = {
  doubleCount: (state: Module1State) => state.count * 2,
  lovesPlusAge: (
    state: Module1State,
    getters: any,
    rootState: RootState,
    rootGetters: any
  ) => {
    return state.loves + rootState.module2Store.age;
  },
};
const mutations = {
  reviseCount: (state: Module1State, payload: any) => {
    state.count = payload.newCount;
  },
  reviseStrs: (state: Module1State, payload: any) => {
    state.strs = payload.newStrs;
  },
};

// 子模块中的actions的ActionContext
// interface ActionContext<S, R> {
//   dispatch: Dispatch; // store.dispatch
//   commit: Commit; // store.commit
//   state: S; // store.state
//   getters: any; // store.getters
//   rootState: R; // store.state 针对于子模块中的action
//   rootGetters: any; // store.getters 针对于子模块中的action
// }

const actions = {
  syncReviseStrs: (
    context: ActionContext<Module1State, RootState>,
    payload: any
  ) => {
    setTimeout(() => {
      context.commit(Module1MutationTypes.REVISESTRS, payload);
    }, payload.timeout);
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

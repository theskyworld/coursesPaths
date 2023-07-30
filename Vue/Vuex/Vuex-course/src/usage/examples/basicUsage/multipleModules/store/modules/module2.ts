import { RootState } from "./../index";
import { ActionContext } from "vuex";

// 子模块 moduel2

export interface Module2State {
  id: number;
  name: string;
  age: number;
  nums: Array<number>;
}
const REVISENUMS = Symbol("reviseNums");
const REVISENAME = Symbol("reviseName");
const SYNCREVISENUMS = Symbol("syncReviseNums");
export enum Module2MutationTypes {
  REVISENUMS = "reviseNums",
  REVISENAME = "reviseName",
}
export enum Module2ActionTypes {
  SYNCREVISENUMS = "syncReviseNums",
}

const state: Module2State = {
  id: 2,
  name: "alice",
  age: 12,
  nums: [1, 2, 3],
};

const getters = {
  agePlusOne: (state: Module2State) => state.age + 1,
};
const mutations = {
  reviseName: (state: Module2State, payload: any) => {
    state.name = payload.newName;
  },
  reviseNums: (state: Module2State, payload: any) => {
    state.nums = payload.newNums;
  },
};
const actions = {
  syncReviseNums: (
    context: ActionContext<Module2State, RootState>,
    payload: any
  ) => {
    setTimeout(() => {
      context.commit(Module2MutationTypes.REVISENUMS, payload);
    }, payload.timeout);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

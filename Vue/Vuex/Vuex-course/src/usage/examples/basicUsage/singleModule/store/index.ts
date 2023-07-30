import axios from "axios";
import { createStore } from "vuex";

interface State {
  count: number;
  height: number;
  width: number;
  nums: Array<number>;
  data: Array<any>;
  name: string;
  githubUsers: Array<any>;
}
const INCRESECOUNT = Symbol("increseCount");
const PUSHNUMS = Symbol("pushNums");
const PLUSNUMSELEMENTS = Symbol("plusNumsElements");
const REVISEDATA = Symbol("reviseData");
const SYNCREVISEDATA = Symbol("syncReviseData");
const REVISEGITHUBUSERS = Symbol("reviseGitHubUsers");
const SYNCREVISEGITHUBUSERS = Symbol("syncReviseGithubUsers");

export enum MutationTypes {
  INCRESECOUNT = "increseCount",
  PUSHNUMS = "pushNums",
  PLUSNUMSELEMENTS = "plusNumsElements",
  REVISEDATA = "reviseData",
  REVISEGITHUBUSERS = "reviseGitHubUsers",
}

export enum ActionTypes {
  SYNCREVISEDATA = "syncReviseData",
  SYNCREVISEGITHUBUSERS = "syncReviseGithubUsers",
}
/**
 * 
接收一个StoreOptions类型的对象作为唯一参数
interface StoreOptions<S> {
  state?: S | (() => S);
  getters?: GetterTree<S, S>;
  actions?: ActionTree<S, S>;
  mutations?: MutationTree<S>;
  modules?: ModuleTree<S>;
  plugins?: Plugin<S>[];
  strict?: boolean;
  devtools?: boolean;
}
  *
返回一个Store实例对象

 */

const store = createStore<State>({
  // state : S | (() => S)
  // state的类型可以为一个对象或者一个返回对象的函数
  // 如果使用函数，则表示为根store的state
  state: {
    count: 0,
    height: 12,
    width: 6,
    nums: [1, 2, 3],
    name: "Alice",
    data: [],
    githubUsers: [],
  },

  // getters : {[type | key : string] : (state: S, getters: any) => any}
  // 获取state的计算属性值
  // 但是不具备响应式，当state中的值发生改变时，getters中的计算属性值并不会随着改变
  // 可以通过将获取到的以下属性的值添加到computed属性中之后，使其具备响应式
  getters: {
    doubleHeight: (state) => {
      return state.height * 2;
    },
    doubleCount: (state) => {
      return state.count * 2;
    },
    heightPlusDoubleCount: (state, getters) => {
      return state.height + getters.doubleCount;
    },
    heightPlusCount: (state) => {
      return state.height + state.count;
    },
    tripleWidthPlusDoubleHeight: (state, getters) => {
      return state.width * 3 + getters.doubleHeight;
    },
    getDataLength: (state) => {
      console.log("getDataLength");
      return state.data.length;
    },
    getGithubUserNames: (state) => {
      const res: Array<string> = [];
      if (state.githubUsers.length > 0) {
        state.githubUsers.forEach((val) => res.push(val.login));
      }
      return res;
    },
  },

  // mutations : {[type | key : string] : (state : S, payload? :any) => any}
  // 修改state的唯一方式，通过store.commit来对一个mutation的回调函数进行调用
  // 里面的操作都为同步操作
  mutations: {
    increseCount: (state) => {
      state.count++;
    },
    pushNums(state, payload) {
      state.nums.push(...payload.newNums);
    },
    plusNumsElements(state, payload) {
      state.nums = state.nums.map((val) => (val += payload.plusedValue));
    },
    reviseData(state, payload) {
      state.data.push(...payload.datas);
    },
    reviseGitHubUsers(state, payload) {
      state.githubUsers = payload.githubUserDatas;
    },
  },

  // actions : {[type | key : string] : (context: ActionContext<S, R>, payload?: any) => any
  // 对mutation进行异步commit
  actions: {
    syncReviseData(context, payload) {
      return new Promise((resolve, reject) => {
        try {
          setTimeout(() => {
            if (payload.datas.length > 0)
              context.commit(MutationTypes.REVISEDATA, payload);
          }, payload.timeout);
          resolve(payload.datas);
        } catch (err) {
          reject(err);
        }
      });
    },
    async syncReviseGithubUsers(context) {
      try {
        await axios.get("https://api.github.com/users").then((val) => {
          const responseData: Array<any> = val.data;
          context.commit(MutationTypes.REVISEGITHUBUSERS, {
            githubUserDatas: responseData.slice(0, 5),
          });
        });
      } catch (err) {}
    },
  },
});

export default store;

import axios from "axios";
import { defineStore } from "pinia";

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
  isAdminn: boolean;
  items: Array<any>;
  hasChanged: boolean;
  datas: Array<any>;
  [key: string]: any;
}

type A = () => void;
interface MainActions<A> {
  increaseCount: A;
  getGithubUsers: A;
  pushItems: (args: string[]) => void;
  reviseHasError: (arg: boolean) => void;
}
type MainGetters<S> = Record<string, (stae: S) => any>;

// option store
// 传递id和opstions参数
const useMainStore = defineStore<
  string,
  MainState,
  MainGetters<MainState>,
  MainActions<A>
>("mainStore", {
  state: (): MainState => ({
    name: "Alice",
    age: 12,
    count: 1,
    isAdminn: true,
    items: [],
    hasChanged: false,
    datas: [],
  }),
  getters: {
    // 仅依赖于state
    doubleCount: (state: MainState) => state.count * 2,

    // 同时依赖于state和其它getter
    doubleCountPlusAge(): number {
      // 通过this(store)来获取getter
      // 区别于vuex4中的传入参数getters
      return this.doubleCount + this.age;
    },

    // 传递参数
    // 每个getter本身不能接收除state之外的其它参数
    // 但是可以通过返回一个函数来传递其它的参数
    countPlusValue: (state: MainState) => (value: number) =>
      state.count + value,

    // 访问其它store中的getter
    countPlusDoubleLoves: (state: MainState) => {
      const otherStore = useOtherStore();
      return state.count + otherStore.doubelLoves;
    },
  },
  actions: {
    increaseCount() {
      // 通过this(store)来获取state
      // 区别于vuex4中的传入参数state
      this.count++;
      // 调用其它store中的action
      useOtherStore().increaseLoves();
    },

    // 传递参数
    pushItems(item) {
      this.items.push(...item);
    },

    // 修改通过插件新增的state
    reviseHasError(hasError) {
      this.hasError = hasError;
    },

    // 添加异步方法
    async getGithubUsers() {
      try {
        await axios.get("https://api.github.com/users").then((value) => {
          // console.log(value);
          const datas: Array<object> = value.data;
          datas
            .slice(0, 5)
            .forEach((data) => this.datas.push((data as any).login));
        });
      } catch (err) {
        console.error(err);
      }
    },
  },
});

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
// const useMainStore = defineStore("mainStore", () => {
//   // state
//   const name = ref<string>("Alice");
//   const age = ref<number>(12);
//   const count = ref<number>(1);

//   // getters
//   const doubleCount = computed(() => age.value * 2);

//   // actions
//   function increaseCount() {
//     count.value++;
//   }
//   return {
//     name,
//     age,
//     count,
//   };
// });

const useOtherStore = defineStore("otherStore", {
  state: () => ({
    loves: 100000,
  }),
  getters: {
    doubelLoves: (state) => state.loves * 2,
  },
  actions: {
    increaseLoves() {
      this.loves++;
    },
  },
});

export default useMainStore;

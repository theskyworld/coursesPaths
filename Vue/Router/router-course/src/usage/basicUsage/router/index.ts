import Home from "../components/Home.vue";
import About from "../components/About.vue";
import User from "../components/User.vue";
import Detail from "../components/Detail.vue";
import NotFound from "../components/NotFound.vue";
import Product from "../components/Product.vue";
import Cart from "../components/Cart.vue";
import CartItem from "../components/CartItem.vue";
import CartAmount from "../components/CartAmount.vue";
import Person from "../components/Person.vue";
import { createRouter, createWebHashHistory } from "vue-router";

// 定义路由
// 每个路由映射一个对应的组件
const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/about",
    component: About,
  },

  // 动态路径参数
  {
    // 定义路径参数，以":"开头，参数名为name
    path: "/user/:name",
    component: User,
  },

  // 使用正则表达式进行路径参数匹配
  {
    // 匹配任意的字符，传入任意的路径参数都将跳转到NotFound组件
    // 组件中通过$route.params.patchMatch进行访问(一个数组)
    path: "/notfound/:pathMatch(.*)*",

    // 匹配任意以user-开头的字符，传入任意以user-开头的字符串的路径参数都将跳转到NotFound组件，否则不跳转
    // 组件中通过$route.params.afterUser进行访问
    // path: "/notfound/user-:afterUser(.*)",
    component: NotFound,
  },

  // 匹配多个参数
  {
    // 匹配1-多个参数
    // 例如"/detail/Alice/"、"/detail/Alice/12/"
    // 参数名为chapters，一个数组
    // path: "/detail/:chapters+",

    // 匹配0-多个参数
    // 例如"/detail"、"/detail/Alice/"、"/detail/Alice/12/"
    // 参数名为chapters，一个数组
    path: "/detail/:chapters*",

    // 添加约束条件
    // 仅匹配数字，0-多个
    // 例如"/detail"、"/detail/11/"、"/detail/11/12/"
    // path: "/detail/:chapters(\\d+)*",
    // 仅匹配数字，1-多个
    // path: "/detail/:chapters(\\d+)+",

    component: Detail,
  },

  // senetive和strict
  {
    path: "/product/:pid?", //其中?表示可选参数 将匹配'/product'、'/product/1'或者'/Product'、'/Product/1'
    senstive: true, // 不区分大小写
    component: Product,
  },

  // 命名路由
  {
    path: "/person",
    name: "person",
    component: Person,
  },

  // 嵌套路由
  {
    path: "/cart",
    component: Cart,
    children: [
      {
        path: "/cart/cartItem",
        component: CartItem,
      },
      {
        path: "/cartAmount",
        component: CartAmount,
        name: "cartAmount",
      },
    ],
  },
];

const router = createRouter({
  // hash模式
  history: createWebHashHistory(),
  routes,
  // strict: true, // 区分大小写 应用于所有的route
});

export default router;

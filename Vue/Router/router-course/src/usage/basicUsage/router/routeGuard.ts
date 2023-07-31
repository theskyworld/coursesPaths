// 路由导航守卫

import { createRouter, createWebHistory } from "vue-router";
import Fruits from "../components/Fruits.vue";
import Cars from "../components/Cars.vue";

const routes = [
  {
    path: "/fruits",
    component: Fruits,
    meta: {
      // 需要进行身份验证后才可以访问目标组件
      // requiresAuth: true,
    },
  },
  {
    path: "/cars/:carid",
    component: Cars,
    name: "cars",
    meta: {
      title: "cars",
      author: "Alice",
    },
    // beforeEnter: (to, from) => {
    //   console.log("beforeEnter");
    // },
    // 或者
    beforeEnter: [
      (to, from) => {
        console.log("beforeEnter1...");
      },
      (to, from) => {
        console.log("beforeEnter2...");
      },
      (to, from) => {
        console.log("beforeEnter3...");
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

let isAuthenticated = true;
// 全局前置导航守卫
router.beforeEach((to, from, next) => {
  // to表示将要进入的路由组件
  // from表示将要离开的路由组件

  // 返回false表示取消跳转到指定的组件，路由会自动重置到from对应的路由路径
  // return false;

  // 返回一个路由或路由地址，表示将要跳转到该路径对应的组件

  // if (
  //   !isAuthenticated && // 用户未注册
  //   to.name !== "login" // 避免无限重定向到login路由
  // ) {
  //   return {
  //     name: "login",
  //   };
  // }

  // 如果返回undefined或者true，表示调用下一个导航守卫，继续进行路由的跳转

  // next表示继续调用下一个导航守卫或者继续进行跳转到指定的路由
  // 并且next()应当只被调用一次
  // if (!isAuthenticated && to.name !== "login") {
  //   next({
  //     name: "login",
  //   });
  // } else {
  //   next();
  // }

  // if (isAuthenticated) {
  //   next();
  // }

  // 需要进行验证，且未登录
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    // 跳转到登录页面
    return {
      path: "/login",
      query: {
        // 保存目标路径，方便登录后直接重定向
        redirect: to.fullPath,
      },
    };
  } else {
    next();
  }
});

// 全局解析导航守卫
router.beforeResolve((to, from, next) => {
  console.log(to.meta.author);
  console.log(to.meta.title);

  next();
});

// 全局后置守卫
router.afterEach((to, from, failure) => {
  console.log(to.meta.title); // "fruit"
  to.meta.title = "newFruit";
  console.log(to.meta.title); // "newFruit"
});

export default router;

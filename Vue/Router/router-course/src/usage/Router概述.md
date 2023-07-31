## router

通过 Vue Router 将组件映射到路由上

其功能包括

- 嵌套式地实现路由映射
- 动态地进行路由选择
- 模块化以及基于组件的路由配置
- 路由参数、查询和通配符
- 页面跳转时的过渡效果
- 路由导航控制
- 自动激活对 CSS 类的链接
- html5 中的路由 history 模式和 hash 模式
- 可定制化的滚动行为
- URL 的正确编码

### 简介

#### 安装

npm

```bash
npm install vue-router@4
```

unpkg

https://unpkg.com/vue-router@4

#### 基本使用

创建路由

```ts
// router/index.ts
import Home from "../components/Home.vue";
import About from "../components/About.vue";
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
];

const router = createRouter({
  // hash模式
  history: createWebHashHistory(),
  routes,
});

export default router;
```

将路由添加到 vue 上

```ts
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import router from "./usage/basicUsage/router";

createApp(App).use(router).mount("#app");
```

添加之后，会自动进行第一个的路由跳转（自动跳转到'/'），以及可以在任意组件中

- 选项式 API：通过`this.$router`访问`router`和通过`this.$route`访问当前路由
- 组合式 API:通过`useRouter()`访问`router`，通过`useRoute()`访问`route`（当前路由）

进行路由的跳转

```vue
<template>
  <div class="container">
    <div class="controller">
      <div><router-link to="/">Home</router-link></div>
      <div><router-link to="/about">About</router-link></div>
    </div>
    <div class="showPages">
      <router-view></router-view>
    </div>
  </div>
</template>
```

##### `<router-link></router-link>`

一个 vue 组件，底层使用的是常规的`<a>`标签，添加了能够在不重新加载页面的情况下修改 URL、处理 URL 的生成以及编码的功能

##### `<router-view></router-view>`

一个 vue 组件，显示与 url 对应的目标组件

可以把它放在任何地方，以适应布局

例如，定义以下路径参数:

| 定义参数                         | 传递参数                   | 使用参数                                        |
| -------------------------------- | -------------------------- | ----------------------------------------------- |
| `/users/:username`               | `/users/eduardo`           | `$route.params.username`                        |
| `/users/:username/posts/:postId` | `/users/eduardo/posts/123` | `$route.params.username` `$route.params.postId` |

### 路径参数

通过 url 来给跳转的目标路径传递参数

除此之外，还有例如(使用`props`属性)[https://router.vuejs.org/zh/guide/essentials/passing-props.html]的方式也能够来实现为组件传递参数

#### 动态路由匹配

通过在路径中使用一个动态的字段（路径参数）来给同一个组件进行动态路由匹配

##### 定义路径参数

```ts
// router/index.ts
const routes = [
  // ...
  {
    // 添加路径参数，以":"开头，参数名为name
    path: "/user/:name",
    component: User,
  },
];
```

##### 给路径参数传值

```vue
<script setup lang="ts"></script>

<template>
  <div class="container">
    <div class="controller">
      <!-- 给路径参数传值 -->
      <div><router-link to="/user/Alice">User</router-link></div>
    </div>
    <div class="showPages">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped></style>
```

##### 使用路径参数

```ts
<template>
  <div class="container">
    <h3>User</h3>
    <p>username : {{ $route.params.name }}</p>
    <!-- 或者 -->
    <p>username : {{ route.params.name }}</p>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
</script>
<style scoped></style>
```

##### 侦听路由参数的变化

在路由的路径中传递路径参数时，虽然参数不同但是访问的都是同一个组件。因此为了性能的考虑，当从例如 /users/johnny 导航到 /users/jolyne （只是路径参数的变化）时，不会进行组件的销毁和再创建，而是对同一个组件进行复用。但是，这也意味着组件的生命周期钩子将不会被再次调用

如果希望，在路径参数发生改变时作出一些响应，可以监听`$route.params`

```vue
<template>
  <div class="container">
    <h3>User</h3>
    <p>username : {{ route.params.name }}</p>
  </div>
</template>
<script setup lang="ts">
import { useRoute, beforeRouteUpdate } from "vue-router";
import { watch } from "vue";
const route = useRoute();

watch(
  // 侦听route.params
  () => route.params,
  (oldParams, newParams) => {
    console.log("路径参数变化...");
    console.log("oldParams : ", oldParams);
    console.log("newParams : ", newParams);
  }
);
</script>
<style scoped></style>
```

#### 使用正则表达式匹配路径参数

##### 基本使用

```ts
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
```

```html
<!-- 给:pathMatch(.*)*路径参数传值 -->
<div><router-link to="/notfound/desedwe">notfound</router-link></div>
<!-- 给user-:afterUser(.*)路径参数传值 -->
<div><router-link to="/notfound/user-Alice">notfound</router-link></div>
<!-- 错误传值，不会跳转 -->
<!-- <div><router-link to="/notfound/test-Alice">notfound</router-link></div> -->
```

```vue
<template>
  <div class="container">
    <h3>NotFound</h3>
    <!-- path: "/notfound/:pathMatch(.*)*", -->
    <p>{{ $route.params.pathMatch }}</p>
    <!-- path: "/notfound/user-:afterUser(.*)", -->
    <p>{{ $route.params.afterUser }}</p>
  </div>
</template>
```

##### 匹配多个参数

```ts
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
```

```html
<!-- 匹配多个参数 -->
<div><router-link to="/detail/Alice/12">Detail</router-link></div>
```

```vue
<template>
  <div class="container">
    <h3>Detail</h3>
    <p>{{ $route.params.chapters }}</p>
    <!-- [ "Alice", "12" ] -->
  </div>
</template>
<script setup lang="ts"></script>
<style scoped></style>
```

##### `strict`和`senstive`

`senstive`: 不区分大小写

`strict` : 区分大小写

```ts
// senetive和strict
  {
    path: "/product/:pid?", //其中?表示可选参数 将匹配'/product'、'/product/1'或者'/Product'、'/Product/1'
    senstive: true, // 不区分大小写
    component: Product,
  },
  const router = createRouter({
  // hash模式
  history: createWebHashHistory(),
  routes,
  // strict: true, // 区分大小写 应用于所有的route
});
```

```html
<!-- senetive和strict -->
<div><router-link to="/Product/12">Product</router-link></div>
```

```vue
<template>
  <div class="container">
    <h3>Product</h3>
    <p>{{ $route.params.pid }}</p>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped></style>
```

### 命名路由

使用命名路由具有以下优点:

- 没有硬编码的 URL
- params 的自动编码/解码。
- 防止你在 url 中出现打字错误。
- 绕过路径排序（如显示一个）

```ts
// 命名路由
  {
    path: '/person',
    name: 'person',
    component : Person,
  },
```

```html
<!-- 命名路由 -->
<!-- 给to传递一个对象值 -->
<div>
  <router-link :to="{ name: 'person', query: { name: 'Alice', age: 12 } }"
    >Person</router-link
  >
</div>
```

```vue
<template>
  <div class="container">
    <h3>Person</h3>
    <p>personName : {{ $route.query.name }}</p>
    <p>personAge : {{ $route.query.age }}</p>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped></style>
```

### 嵌套路由

```ts
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
      },
    ],
  },
```

```html
<!-- 嵌套路由 -->
<div><router-link to="/Cart">Cart</router-link></div>
<div><router-link to="/cart/CartItem">CartItem</router-link></div>
<div><router-link to="/CartAmount">CartAmount</router-link></div>
```

```vue
<!-- Cart.vue -->
<template>
  <div class="container">
    <h3>Cart</h3>
    <div class="sonComponent">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped></style>

<!-- CartItem.vue -->
<template>
  <div class="container">
    <h4>CartItem</h4>
    <p>香蕉 : 12个 : 300元</p>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped></style>

<!-- CartAmount.vue -->
<template>
  <div class="container">
    <h4>CartAmount</h4>
    <p>总价 : 300</p>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped></style>
```

### 编程式导航

借助`router`的实例方法来进行路由的跳转，功能同 `<router-link>`

##### `router.push()`

调用该方法时，会向 history 栈中添加一个新的路由记录

当用户点击后退按钮时，能够回到之前的 url

并且点击`<router-link>`，其底层就是调用了`router.push()`

| 声明式                    | 编程式             |
| :------------------------ | :----------------- |
| `<router-link :to="...">` | `router.push(...)` |

类型 :

```ts
push(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>

// RouteLocationRaw
export declare type RouteLocationRaw = string | RouteLocationPathRaw | RouteLocationNamedRaw;

// RouteLocationPathRaw
interface RouteLocationPathRaw {
  path: string;
  query?: LocationQueryRaw;
  hash?: string;
  replace?: boolean;
  force?: boolean;
  state?: HistoryState;
  [key : string] : any;
}

// RouteLocationNamedRaw
interface RouteLocationNamedRaw {
  name?: RouteRecordName;
  params?: RouteParamsRaw;
  query?: LocationQueryRaw;
  hash?: string;
  replace?: boolean;
  force?: boolean;
  state?: HistoryState;
  [key : string] : any;
}
```

使用`router.push()`

```vue
<!-- App.vue -->
<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const name = 'Alice1'
function toUser() {
  // router.push("/user/Alice")
  // router.push('/user/Alice1');

  router.push(`/user/${name}`);

  // router.push({
  //   // path: '/user/Alice1',
  //   // 或者
  //   // 对应路径为"/user/:name"
  //   // name : 'user',
  //   // params: {
  //   //   name : 'Alice3',
  //   // }

  //   // 或者
  //   // 对应路径为"/user"
  //   path: "/user",
  //   query: {
  //     name: "Alice1",
  //   },

  //   hash: "#hash",
  // });
}
</script>

<template>
  <div class="container">
    <div class="controller">
      <div><button @click="toUser">toUser</button></div>
</template>

<style scoped></style>

```

```ts
{
    // 定义路径参数，以":"开头，参数名为name
    path: "/user/:name", // 使用params或者路径传参
    // path : '/user', // 使用query传参
    component: User,
    name: "user",
  },
```

##### `router.replace()`

替换掉当前的路由，实现路由跳转

| 声明式                            | 编程式                |
| :-------------------------------- | :-------------------- |
| `<router-link :to="..." replace>` | `router.replace(...)` |

类型 :

```ts
// 跟push具有一样的参数类型
replace(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>;
```

```ts
router.push({ path: "/user", replace: true });
// 相当于
router.replace({ path: "/user" });
```

##### `router.go()`

在路由历史堆栈中前进或后退指定的步数，类似于`window.history.go(n)`

类型 : `go(delta: number): void;`

```ts
// 向前移动一条记录，与 router.forward() 相同
router.go(1);

// 返回一条记录，与 router.back() 相同
router.go(-1);

// 前进 3 条记录
router.go(3);

// 如果没有那么多记录，静默失败
router.go(-100);
router.go(100);
```

### 重定向和别名

#### 重定向`redirect`

将当前路由重新指向其它得到路由，最终跳转到其它路由

类型 :

```ts
redirect?: RouteRecordRedirectOption;

// RouteRecordRedirectOption
type RouteRecordRedirectOption =
  | RouteLocationRaw
  | ((to: RouteLocation) => RouteLocationRaw);

// RouteLocationRaw
type RouteLocationRaw = string | RouteLocationPathRaw | RouteLocationNamedRaw;
```

```ts
// 重定向
  {
    path: "/city",
    // 最终实际跳转到'/detail'路由
    // redirect: "/detail",

    // 使用命名路由
    // redirect: {
    //   name: "detail",
    // },

    // 或者使用一个函数
    redirect: (to: RouteLocation) => {
      return {
        name: "detail",
        params: {
          chapters: [1, 2, 3],
        },
      };
    },
  },
```

相对重定向

```ts
 // 嵌套路由
  {
    path: "/cart",
    component: Cart,
    redirect: (to: RouteLocation) => {
      return {
        // 相对重定向，当对于当前展示的组件对应的路由
        // 例如最终跳转到'/cart/cartItem'、'/product/cartItem'...
        // 避免使用
        // path: "cartItem",
        path: "/cart/cartItem",
        senstive: true,
      };
    },
    children: [
      {
        // path: "/cart/cartItem", // 以/开头的为绝对路径，反之为相对路径
        // 等价于
        path: "cartItem", // 相对路径，相对于"/cart"
        component: CartItem,
      },
      {
        // path: "/cartAmount",
        path: "cartAmount",
        component: CartAmount,
        name: "cartAmount",
      },
    ],
  },
```

#### 别名`alias`

将当前路由的路径别名为其它的路径，当访问这个其它路径时将最终跳转到当前路径

类型 : `alias?: string | string[];`

```ts
const routes = [
  // 访问'/'和"/home"都将跳转至"/"对应的组件
  {
    path: "/",
    component: Homepage,
    alias: "/home",
  },
  {
    path: "/users",
    component: UsersLayout,
    children: [
      // 以下三个url都将最终跳转到'/users'对应的组件-UserList
      // - /users
      // - /users/list
      // - /people
      {
        path: "",
        component: UserList,
        alias: ["/people", "list"/**相对于/users/],
      },
    ],
  },
];
```

在别名中包含参数；

```ts
const routes = [
  {
    path: "/users/:id",
    component: UsersByIdLayout,
    children: [
      // 以下三个url都将最终跳转到"/users/:id/profile"对应的组件-UserDetails
      // - /users/24           ("")
      // - /users/24/profile   ("profile")
      // - /24                 ("/:id")
      {
        path: "profile",
        component: UserDetails,
        alias: [
          "/:id",
          /*绝对路径，等价于"/:id":*/ "" /*相对路径，等价于"/users/:id"*/,
        ],
      },
    ],
  },
];
```

### 命名视图

在同一级的路由（同一个页面）中展示多个视图，每个视图都有着各自的名字

即存在多个路由出口，此时每个路由将对应一个或多个组件，使用`components`属性

```vue
<template>
  <div class="container">
    <h2>命名视图</h2>
    <div class="controllers">
      <router-link to="/">Home</router-link>
      <router-link to="/another">another</router-link>
    </div>
    <div class="showPages">
      <!-- 命名视图 -->
      <!-- 如果未添加name属性，则默认值为default -->
      <router-view name="first"></router-view>
      <router-view name="second"></router-view>
      <router-view name="third"></router-view>
    </div>
  </div>
</template>
```

```ts
import { createRouter, createWebHashHistory } from "vue-router";
import FirstView from "../components/FirstView.vue";
import SecondView from "../components/SecondView.vue";
import ThirdView from "../components/ThirdView.vue";

const routes = [
  {
    path: "/",
    // 命名视图
    components: {
      first: FirstView,
      second: SecondView,
      third: ThirdView,
    },
  },
  {
    path: "/another",
    components: {
      first: ThirdView,
      second: SecondView,
      third: FirstView,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
```

### 历史模式

##### html5 模式

通过使用`createWebHistory()`进行创建

```ts
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //...
  ],
});
```

需要(配置后端服务器)[https://router.vuejs.org/zh/guide/essentials/history-mode.html]，避免出现直接访问例如`https://example.com/user/id`出现 404 的错误

##### hash 模式

通过使用`createWebHashHistory()`进行创建

在路径中会存在`#`的哈希字符

```ts
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //...
  ],
});
```

### 路由导航守卫

导航守卫的作用主要是通过跳转到指定的路由或者取消当前路由的方式来守卫路由

添加导航守卫的方式存在全局、单个路由独享和组件级守卫三种

添加多个导航守卫时，会按照添加的顺序依次执行

#### 全局导航守卫

##### 全局前置导航守卫

主要是进行目标路由的是否跳转判断或者改为跳转到其它指定的路由控制

通过 `router.beforeEach()`来添加一个全局的前置导航守卫

该函数接收一个回调函数作为唯一的参数，返回一个回调函数用于调用后移除当前导航守卫

类型 :

```ts
beforeEach(guard: NavigationGuardWithThis<undefined>): () => void;

//
interface NavigationGuardWithThis<T> {
    (this: T, to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): NavigationGuardReturn | Promise<NavigationGuardReturn>;
}
```

全局前置导航守卫

```ts
// 全局前置导航守卫
router.beforeEach((to, from, next) => {
  // to表示将要进入的路由组件
  // from表示将要离开的路由组件

  // 返回false表示取消跳转到指定的组件，路由会自动重置到from对应的路由路径
  // return false;

  // 返回一个路由或路由地址，表示将要跳转到该路径对应的组件

  if (
    !isAuthenticated && // 用户未注册
    to.name !== "login" // 避免无限重定向到login路由
  ) {
    return {
      name: "login",
    };
  }

  // 如果返回undefined或者true，表示调用下一个导航守卫，继续进行路由的跳转

  // next表示继续调用下一个导航守卫或者继续进行跳转到指定的路由
  // 并且next()应当只被调用一次
  if (!isAuthenticated && to.name !== "login") {
    next({
      name: "login",
    });
  } else {
    next();
  }
});
```

##### 全局解析守卫

主要是在路由跳转之前，解析路由中所携带的属性（例如`meta`）并进行相应的操作

以便在路由跳转之前完成这些操作

通过 `router.beforeResolve()`来添加一个全局的前置解析守卫

类型：

```ts
beforeResolve(guard: NavigationGuardWithThis<undefined>): () => void;
```

```ts
router.beforeResolve(async (to, from, next) => {
  // 要跳转的目标路由中包含请求摄像头的属性
  // 解析之后进行相应操作，在路由跳转之前完成
  if (to.meta.requiresCamera) {
    try {
      // 请求摄像头
      await askForCameraPermission();
      next();
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... 处理错误，然后取消导航
        return false;
      } else {
        // 意料之外的错误，取消导航并把错误传给全局处理器
        throw error;
      }
    }
  }

  // 不允许跳转
  // if (to.meta.requiresAuth && !isAuthenticated) return false
});
```

##### 全局后置钩子

不会对路由的跳转进行改变

而是进行路由跳转之后的辅助功能，例如分析、更改页面标题，声明页面

第三个参数为`failure`，而不是`next`
类型 :

```ts
afterEach(guard: NavigationHookAfter): () => void;

// NavigationHookAfter
interface NavigationHookAfter {
    (to: RouteLocationNormalized, from: RouteLocationNormalized, failure?: NavigationFailure | void): any;
}

```

```ts
// 全局后置守卫
router.afterEach((to, from, failure) => {
  console.log(to.meta.title); // "fruit"
  to.meta.title = "newFruit";
  console.log(to.meta.title); // "newFruit"
});
```

#### 路由独享守卫

直接在当前的路由配置上通过`beforeEnter()`来定义一个导航守卫，并只作用于当前的路由

可以为当前路由定义一个导航守卫（一个回调函数），或者多个导航守卫（多个回调函数组成的数组）

需要注意的是这些回调函数在设置了`redirect`属性之后都不会被调用

类型 :

```ts
beforeEnter?: NavigationGuardWithThis<undefined> | NavigationGuardWithThis<undefined>[];
```

在当前路由上添加

```ts
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
```

`beforeEnter`守卫只在进入路由时触发，不会在`params`、`query` 或`hash`改变时触发

可以将一个函数数组传递给 `beforeEnter`

```ts
// 移除query
function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash };
}

// 移除hash
function removeHash(to) {
  if (to.hash) return { path: to.path, query: to.query, hash: "" };
}

const routes = [
  {
    path: "/users/:id",
    component: UserDetails,
    beforeEnter: [removeQueryParams, removeHash],
  },
  {
    path: "/about",
    component: UserDetails,
    beforeEnter: [removeQueryParams],
  },
];
```

#### 组件内守卫

将守卫定义在一个组件内，可以通过以下方式进行定义:

##### 选项式 API 中

`beforeRouteEnter`

- 在进入组件之前调用
- 因为在组件挂载之前触发，所以不能访问组件内的`this`(组件实例)。但是可以通过给其传递一个`next`函数，在`next`函数内访问组件实例
- 类型 :

  ```ts
  beforeRouteEnter?: TypesConfig extends Record<'beforeRouteEnter', infer T> ? T : NavigationGuardWithThis

  // NavigationGuardWithThis
  interface NavigationGuardWithThis<T> {
    (this: T, to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): NavigationGuardReturn | Promise<NavigationGuardReturn>;
  }
  ```

`beforeRouteUpdate`

- 在组件的`params`、`query`、`hash`等值发变化时调用
- 类型 :

  ```ts
  beforeRouteUpdate?: TypesConfig extends Record<'beforeRouteUpdate', infer T> ? T : NavigationGuard

  // NavigationGuard
  interface NavigationGuard {
    (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): NavigationGuardReturn | Promise<NavigationGuardReturn>;
  }
  ```

`beforeRouteLeave`

- 在离开组件前调用
- 类型 : `beforeRouteLeave?: TypesConfig extends Record<'beforeRouteLeave', infer T> ? T : NavigationGuard`

```ts
<script lang="ts">
export default {
  beforeRouteEnter(to, from, next) {
    console.log("beforeRouteEnter");
    // 通过next访问组件内的this
    next((vm) => {
      console.log(vm);
    });
  },
  beforeRouteUpdate(to, from) {
    console.log("beforeRouteUpdate");
    console.log(this);
  },
  beforeRouteLeave(to, from) {
    console.log("beforeRouteLeave");
    console.log(this);
  },
};
</script>
```

##### 组合式 API 或者`setup`函数中

`onBeforeRouteUpdate`

- 同`beforeRouteUpdate`
- 类型 : `declare function onBeforeRouteUpdate(updateGuard: NavigationGuard): void;`

`onBeforeRouteLeave`

- 同`beforeRouteLeave`
- 类型 : `declare function onBeforeRouteLeave(leaveGuard: NavigationGuard): void;`

```ts
<script setup lang="ts">
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";

onBeforeRouteUpdate((to, from) => {
  console.log("onBeforeRouteUpdate...");
});

onBeforeRouteLeave((to, from) => {
  console.log("onBeforeRouteLeave...");
});
</script>
```

#### 导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫(2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫(2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入

### 路由元信息

通过在定义路由时添加一个`meta`属性来为路由添加元信息

其中可以包含例如所使用的过渡的名称、谁可以对路由进行访问等信息

并且这些内容可以在路由地址和导航守卫上被访问

##### 定义路由元信息

```ts
const routes = [
  {
    path: "/fruits",
    component: Fruits,
    meta: {
      // 需要进行身份验证后才可以访问目标组件
      requiresAuth: true,
    },
  },
];
```

##### 访问路由元信息

在组件中可以通过`$route.meta`的方式进行访问，或者从`$route.matched`数组中进行遍历访问（`matched.some(record => record.meta)`）

对应地，在导航守卫中，可以通过`to`或者`from`进行访问

```ts
// 全局前置导航守卫
router.beforeEach((to, from, next) => {
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
```

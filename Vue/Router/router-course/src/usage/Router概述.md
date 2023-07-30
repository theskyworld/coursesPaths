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

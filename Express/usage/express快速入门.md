## express 快速入门

### 一个最基本的 Hello 案例

```js
const express = require("express");

const app = express();
const port = 5008;

// 每get请求一次"/"路径，对应的回调函数将被调用一次
// 例如在浏览器中每次访问localhost:5008路径时，或者每次使用axios发起axios.get("/")请求时
// 请求其它路径，则返回404错误
app.get("/", (req, res) => {
  // 终端中打印输出"hello"
  console.log("hello");
  // 服务器向页面中发送"hello!"
  // res.send需要添加在最后的回调函数中，表示该次请求的结束
  // 如果未添加，则一直会进行请求-响应的循环，该次请求将被搁置
  res.send("hello!");
});

// 启动服务器
app.listen(port, () => {
  console.log(`Example app listening on port '${port}'`);
});
```

### express 应用生成器

使用`express-generator`快速生成一个简单的页面骨架

- 创建并进入指定的目录(如 myApp)后，安装并运行`express-generator`

```bash
npx express-generator
```

对于 Node.js 8.2.0 以下的版本

```bash
npm install -g express-generator
express
```

- 安装依赖包

```bash
npm install
```

- 启动服务器(PowerShell 中)

```bash
$env:DEBUG='myapp:*'; npm start
```

- 在'http://localhost:3000/'中进行查看

### 路由

一个路由是一个 express 实例(app)对请求的路径进行匹配和响应的集合

当用户请求的方法以及路径与当前路由中的方法和路径相匹配时，将调用对应的回调函数来进行响应

其统一的结构为:`app.requestMethod(path, handler)`

- `app` : express 的实例，通过`express()`获得
- `requestMethod`:GET、POST、PUT、DELETE 等请求的小写
- `path`: 请求路径
- `handler` : 当请求路径匹配时进行调用的回调函数

例如

```js
// 当使用GET请求"/"路径时，调用后面的回调函数
app.get("/", (req, res) => {
  // 将以下内容渲染到服务器搭建的页面上
  res.send("Hello World!");
});

app.post("/", function (req, res) {
  res.send("Got a POST request");
});

app.put("/user", function (req, res) {
  res.send("Got a PUT request at /user");
});

app.delete("/user", function (req, res) {
  res.send("Got a DELETE request at /user");
});
```

同时也支持使用`app.use`来为一个路径指定一个或多个匹配时的回调函数

#### 路由请求方法

路由请求方法(`app.requestMethod`)可以是以下[列表中请求方法](https://expressjs.com/en/4x/api.html#app.METHOD)中任意一个

当然，也包含一个`app.all`能够对所有的请求方法进行处理

#### 路由路径

一个路由路径可以是字符串、字符串模式或者正则表达式，代表了本次请求的请求端点

express 中使用[`path-to-regexp`](https://www.npmjs.com/package/path-to-regexp)来判断路径的是否匹配

```js
// 字符串
// 匹配"/",GET请求
app.get("/", function (req, res) {
  res.send("root");
});

// 匹配"/about",GET请求
app.get("/about", function (req, res) {
  res.send("about");
});

// 匹配'/random.text',GET请求
app.get("/random.text", function (req, res) {
  res.send("random.text");
});

// 字符串模式
// 匹配'/acd'或者'/abcd',GET请求
app.get("/ab?cd", function (req, res) {
  res.send("ab?cd");
});

// 匹配'/abcd'、'/abbcd'、'/abbbcd'...,GET请求
app.get("/ab+cd", function (req, res) {
  res.send("/ab+cd");
});
```

##### 带参数的路由路径

对于带参数的路由路径(例如'/users/:userId/books/:bookId')，会将请求路径中的参数名作为键名以及对应的请求参数中传入的参数的值作为键值来将其添加到`req.params`对象中

例如

```js
// 路由路径
"/users/:userId/books/:bookId";
// 匹配的请求路径
"http://localhost:3000/users/34/books/8989"
// 可得出的参数及其值为,userId : 34; bookId : 8989
// 将其添加到req.params对象中
// req.params:
{
  userId : "34",
  bookId : "8989",
}

// 在路由中使用带参数的路由路径
app.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params)
})
```

带"-"或者"."的路由路径参数

```js
// -
// 路由路径
"/flights/:from-:to";
// 匹配的请求路径
"http://localhost:3000/flights/LAX-SFO"
// req.params:
{
  from : "LAX",
  to : "SFO",
}


// .
// 路由路径
"/plantae/:genus.:species";
// 匹配的请求路径
"http://localhost:3000/plantae/Prunus.persica"
// req.params:
{
  genus : "Prunus",
  species : "persica",
}
```

或者使用一个正则表达式（添加在`()`内）对一个路径参数进行更精确的规定

```js
// 路由路径
// \d+表示传入的userId的参数需为0-9之间的任意个数值
"/user/:userId(\d+)";
// 匹配的请求路径
"http://localhost:3000/user/42"
// req.params:
{
  userId : "42",
}
```

#### 路由回调函数

为一个路由路径可以添加一个或多个回调函数，如果是多个回调函数则需要确保在回调函数内添加`next()`对后续的回调函数进行调用

添加单个回调函数

```js
// 匹配"/example"
app.get("/example", function (req, res) {
  res.send("hello from example");
});
```

添加多个回调函数

```js
// 添加多个回调函数
app.get(
  "/multiply",
  function (req, res, next) {
    console.log("callback1");
    next();
  },
  function (req, res) {
    console.log("callback2");
    // 在最后一个回调函数中才进行res.send
    res.send("Hello2");
  }
);

// 或者
const callback1 = (req, res, next) => {
  console.log("callback1");
  next();
};
const callback2 = (req, res, next) => {
  console.log("callback2");
  next();
};
const callback3 = (req, res, next) => {
  console.log("callback3");
  // 在最后一个回调函数中才进行res.send
  res.send("hello from callback3");
};

// 或者也可以以上的函数跟数组进行结合使用
```

#### `app.route`

使用`app.route`可以添加对一个路由路径的链式处理

```js
// 链式处理，app.route
app
  .route("/book")
  // 处理GET"/book"
  .get(function (req, res) {
    res.send("Get a book");
  })
  // 处理POST"/book"
  .post(function (req, res) {
    res.send("Add a book");
  })
  // 处理PUT"/book"
  .put(function (req, res) {
    res.send("Update a book");
  });
```

#### `express.Router`

可以使用 `express.Router`为一个指定的路由及其子路由封装一个中间件函数，然后在`app.use`中进行使用

使用`express.Router`封装中间件函数

```js
// bird.js
// 封装一个"/bird"路径及其子路径的中间件函数
const express = require("express");
const router = express.Router();

// 一个记录请求时间的中间件函数
router.use(function timeLog(req, res, next) {
  console.log("request Time : ", Date.now());
  next();
});

// 适用于"/bird"路径本身
router.get("/", function (req, res) {
  res.send("hello from /bird");
});

// 适用于其子路径"/bird/about"
router.get("/about", function (req, res) {
  res.send("hello from /bird/about");
});

module.exports = router;
```

进行使用

```js
const bird = require("./bird");
// 使用express.Router封装的中间件函数
app.use("/bird", bird);

// 访问"/bird"或者"/bird/about"路径时将调用timeLog中间件函数
```

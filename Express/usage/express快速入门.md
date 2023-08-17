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

- 在'http://localhost:5008/'中进行查看

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
"http://localhost:5008/users/34/books/8989"
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
"http://localhost:5008/flights/LAX-SFO"
// req.params:
{
  from : "LAX",
  to : "SFO",
}


// .
// 路由路径
"/plantae/:genus.:species";
// 匹配的请求路径
"http://localhost:5008/plantae/Prunus.persica"
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
"http://localhost:5008/user/42"
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

### 静态文件

express 中通过`express.static`（一个内置中间件函数）来对外暴露本地的静态文件

其语法为:`express.static(root, [options])`

- `root` : 存放静态文件的根目录
- `options` : 可选的配置选项

#### 暴露`'./public'`目录下的所有文件

例如，通过对以下中间件函数的使用能够将本地`public`目录下的所有静态文件进行暴露

```js
app.use(express.static("public"));
```

现在，可以对以下的路径进行请求，然后访问 public 目录下任意的对应静态文件

```js
// app在508端口监听
// 对public目录下的所有静态文件进行了暴露
// public与app.js为同级目录，故在书写路径时可以不书写public/，直接对目录下的文件或目录进行访问即可
"http://localhost:5008/imgs/lion.png";
"http://localhost:5008/css/index.css";
"http://localhost:5008/js/index.js";
"http://localhost:5008/index.html";
```

#### 同时暴露多个静态文件目录

```js
// 同时暴露"./public"和"./files"目录下的所有静态文件
app.use(express.static("public"));
app.use(express.static("files"));
```

#### 指定访问时要添加的路径前缀

```js
// 访问任意public目录下的文件或目录时都需要添加"/static"前缀
app.use("/static", express.static("public"));
```

访问方式为

```js
// 尽管"/static"和public目录无实际的目录关系，但是要添加"/static"前缀
"http://localhost:5008/static/imgs/lion.png";
"http://localhost:5008/static/css/index.css";
"http://localhost:5008/static/js/index.js";
"http://localhost:5008/static/index.html";
```

#### 指定绝对路径

默认情况下，`express.static(root, [options])`中的`root`都是相对于运行的`app.js`文件所在的相对路径，如果要暴露的静态文件目录在另外一个文件夹内，则应该使用绝对路径

```js
const path = require("path");
// 进行绝对路径的拼接
app.use("/static", express.static(path.join(__dirname, "public")));
```

### 中间件函数

中间件函数是可以访问请求对象（req）、响应对象（res）和应用程序请求-响应循环中下一个中间件函数的函数。下一个中间件函数通常由名为 next 的变量表示

Express 是一个路由和中间件网络框架，自身功能极少，Express 应用程序本质上是一系列中间件功能的调用

通过路由能够对指定路径的请求进行响应处理，进行响应时其调用的回调函数就是一个中间件函数

因为中间件函数能够接收`req`、`res`和`next`作为参数，所以在一个中间件函数内能够进行以下的操作:

- 访问或修改 HTTP 请求中的 request(req)和 response(res)对象
- 通过调用`next`来调用当前请求中的其它中间件函数
- 通过调用`res.send`结束本次请求

如果存在多个中间件函数，那么先被加载的先被调用

自 express5 开始，如果一个中间件函数返回一个 promise，那么当该 promise 在被 reject 或者 resolve 之后都会调用`next`函数

#### 自定义中间件函数

创建以下中间件函数

```js
// appMiddlewares/index.js
// 用于打印登录日志信息
const myLogger = (req, res, next) => {
  console.log("Logged");
  next();
};

// 用于为对应的req对象添加requestTime属性
const requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

// 用于验证请求时传递的cookie
const validateCookies = async (req, res, next) => {
  await cookieValidator(req.cookies);
  next();
};
const cookieValidator = async (cookies) => {
  try {
    await externallyValidateCookie(cookies.testCookie);
  } catch {
    throw new Error("Invalid cookies");
  }
};

module.exports = {
  myLogger,
  requestTime,
  validateCookies,
};
```

#### 注册使用中间件函数

一个中间件函数定义好之后，可以直接添加在路由中作为回调函数使用，也可以通过`app.use`来进行注册使用

需要注意的是，`app.use()`的调用需在对应的路由前，否则如果路由的回调函数中存在`res.send()`，会导致本次请求结束，后面的中间件函数不被调用、

所以一般在路由中添加那个最后一个被调用的中间函数，调用`res.send()`结束本次请求。其它中间件函数则通过`app.use`注册使用，添加`next()`来调用下一个中间件函数

```js
const express = require("express");
const {
  myLogger,
  validateCookies,
  requestTime,
} = require("./appMiddlewares/index");
const cookieParser = require("cookie-parser");

const app = express();
const port = 5008;

// 对所有的请求和请求路径使用myLogger中间件
// 对该app上所有的请求和请求路径都会调用该中间件函数
app.use(myLogger);
// 对所有的请求和请求路径使用requestTime中间件
app.use(requestTime);
// 对所有的请求和请求路径使用第三方中间件cookieParser，解析cookie
// app.use(cookieParser());
// 对所有的请求和请求路径使用validateCookies中间件
// app.use(validateCookies);

// 对GET"/example"请求使用中间件函数
app.get("/example", (req, res) => {
  let responseText = "Hello World!<br>";
  responseText += "<small>Requested at: " + req.requestTime + "</small>";
  res.send(responseText);
});

// 启动服务器
app.listen(port, () => {
  console.log(`Example app listening on port '${port}'`);
});
```

在 express 中，能够对以下类型的中间件函数进行注册使用

- 应用级中间件(Application-level middleware)
- 路由级中间件(Router-level middleware)
- 错误处理中间件(Error-handling middleware)
- 内置中间件(Built-in middleware)
- 第三方中间件(Third-party middleware)

##### 使用应用级中间件

对所有的请求和请求路径绑定中间件函数

```js
app.use(function (req, res, next) {
  console.log("Time:", Date.now());
  next();
});
```

对指定的请求路径绑定中间件函数

```js
app.use("/user/:id", function (req, res, next) {
  console.log("Request Type:", req.method);
  next();
});
```

对指定的请求方法和请求路径绑定中间件函数

```js
app.get("/user/:id", function (req, res, next) {
  res.send("USER");
});
```

对指定的请求方法和请求路径绑定多个中间件函数

```js
app.use(
  "/user/:id",
  function (req, res, next) {
    console.log("Request URL:", req.originalUrl);
    next();
  },
  function (req, res, next) {
    console.log("Request Type:", req.method);
    next();
  }
);
```

对于同一请求方法和请求路径，结束当次请求后，后续的中间件函数不会被调用

```js
app.get(
  "/user/:id",
  function (req, res, next) {
    console.log("ID:", req.params.id);
    next();
  },
  // 对于同一请求方法和请求路径，结束当次请求后，后续的中间件函数不会被调用
  function (req, res, next) {
    res.send("User Info");
  }
);

// 该中间件函数不会被调用
app.get("/user/:id", function (req, res, next) {
  console.log("userIe");
  res.send(req.params.id);
});
```
但是可以通过使用`next('route')`来进行对后续路由中回调函数的调用
```js
app.get(
  "/user/:id",
  function (req, res, next) {
    // 如果id的值为0.则跳过当前路由中回调函数的调用
    // 转而调用后续的下一个路由中回调函数的调用(res.send("special");)
    if (req.params.id === "0") next("route");
    // 调用当前路由中的下一个中间件函数
    else next();
  },
  function (req, res, next) {
    // send a regular response
    res.send("regular");
  }
);

// 当上述路由中调用了next("route")，该路由才会生效
app.get("/user/:id", function (req, res, next) {
  res.send("special");
});
```

可以将多个中间件函数放置于一个数组中，同时结合路由中的回调函数使用
```js
function logOriginalUrl (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
}

function logMethod (req, res, next) {
  console.log('Request Type:', req.method)
  next()
}

var logStuff = [logOriginalUrl, logMethod]
app.get('/user/:id', logStuff, function (req, res, next) {
  res.send('User Info')
})

```

##### 路由级中间件函数
路由级中间件函数的执行逻辑类似于应用级中间件函数，但是使用时通过`router.use`而不是`app.use`进行使用
















#### 配置中间件函数

如果需要对一个已有的中间件函数进行配置后使用，可以将已有的中间件函数进行导出之后进行配置

在已有的中间件函数文件内部导出中间件函数

```js
// my-middleware.js
// 接收options参数，对函数进行配置
module.exports = function (options) {
  return function (req, res, next) {
    // 实现基于options的中间件函数逻辑
    next();
  };
};
```

```js
// app.js
var mw = require("./my-middleware.js");

// 使用配置后的中间件函数
app.use(mw({ option1: "1", option2: "2" }));
```

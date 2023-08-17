const express = require("express");
const bird = require("./bird");
const {
  myLogger,
  validateCookies,
  requestTime,
} = require("./appMiddlewares/index");
const cookieParser = require("cookie-parser");

const app = express();
const port = 5008;

// // 每请求一次"/"路径，对应的回调函数将被调用一次
// // 例如在浏览器中每次访问localhost:5008路径时，或者每次使用axios发起axios.get("/")请求时
// // 请求其它路径，则返回404错误
// app.get("/", (req, res) => {
//   // 终端中打印输出"hello"
//   console.log("hello");
//   // 服务器向页面中发送"hello!"
//   res.send("hello!");
// });

// // 匹配"/example"
// app.get("/example", function (req, res) {
//   res.send("hello from example");
// });

// // 添加多个回调函数
// app.get(
//   "/multiply",
//   function (req, res, next) {
//     console.log("callback1");
//     next();
//   },
//   function (req, res) {
//     console.log("callback2");
//     // 在最后一个回调函数中才进行res.send
//     res.send("Hello2");
//   }
// );
// // 或者
// const callback1 = (req, res, next) => {
//   console.log("callback1");
//   next();
// };
// const callback2 = (req, res, next) => {
//   console.log("callback2");
//   next();
// };
// const callback3 = (req, res, next) => {
//   console.log("callback3");
//   // 在最后一个回调函数中才进行res.send
//   res.send("hello from callback3");
// };
// app.get("/multiply/a", [callback1, callback2, callback3]);


// *************************************************************

// // 链式处理，app.route
// app
//   .route("/book")
//   // 处理GET"/book"
//   .get(function (req, res) {
//     res.send("Get a book");
//   })
//   // 处理POST"/book"
//   .post(function (req, res) {
//     res.send("Add a book");
//   })
//   // 处理PUT"/book"
//   .put(function (req, res) {
//     res.send("Update a book");
//   });


// *************************************************************

// // 使用express.Router封装的中间件函数
// app.use("/bird", bird);


// *************************************************************

// // 暴露静态文件
// // app.use(express.static("public"));
// // 指定多个目录下静态文件的暴露
// app.use(express.static('files'));

// // 添加前缀
// app.use("/static", express.static("public"));


// *************************************************************
// // 对所有的请求和请求路径使用myLogger中间件
// // 对该app上所有的请求和请求路径都会调用该中间件函数
// app.use(myLogger);
// // 对所有的请求和请求路径使用requestTime中间件
// app.use(requestTime);
// // 对所有的请求和请求路径使用第三方中间件cookieParser，解析cookie
// // app.use(cookieParser());
// // 对所有的请求和请求路径使用validateCookies中间件
// // app.use(validateCookies);

// // 对GET"/example"请求使用中间件函数
// app.get("/example", (req, res) => {
//   let responseText = "Hello World!<br>";
//   responseText += "<small>Requested at: " + req.requestTime + "</small>";
//   res.send(responseText);
// });




// *************************************************************
// app.get(
//   "/user/:id",
//   function (req, res, next) {
//     console.log("ID:", req.params.id);
//     next();
//   },
//   // 对于同一请求方法和请求路径，结束当次请求后，后续的中间件函数不会被调用
//   function (req, res, next) {
//     res.send("User Info");
//   }
// );

// // 该中间件函数不会被调用
// app.get("/user/:id", function (req, res, next) {
//   console.log("userIe")
//   res.send(req.params.id);
// });

// *************************************************************

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


// 启动服务器
app.listen(port, () => {
  console.log(`Example app listening on port '${port}'`);
});

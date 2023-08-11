const express = require("express");
const bird = require("./bird");

const app = express();
const port = 5008;

// 每请求一次"/"路径，对应的回调函数将被调用一次
// 例如在浏览器中每次访问localhost:5008路径时，或者每次使用axios发起axios.get("/")请求时
// 请求其它路径，则返回404错误
app.get("/", (req, res) => {
  // 终端中打印输出"hello"
  console.log("hello");
  // 服务器向页面中发送"hello!"
  res.send("hello!");
});

// 匹配"/example"
app.get("/example", function (req, res) {
  res.send("hello from example");
});

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
app.get("/multiply/a", [callback1, callback2, callback3]);

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




// 使用express.Router封装的中间件函数
app.use("/bird", bird);

// 启动服务器
app.listen(port, () => {
  console.log(`Example app listening on port '${port}'`);
});

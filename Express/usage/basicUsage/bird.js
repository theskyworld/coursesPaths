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

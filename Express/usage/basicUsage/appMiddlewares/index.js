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

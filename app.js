var http = require("http");
var createError = require("http-errors");
var express = require("express");
var app = express();
var server = http.createServer(app);
server.listen(5000);
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var userRouter = require("./routes/user");
const { connectDB } = require("./db");

//Connect to db
connectDB()
  .then((r) => console.log("Mongo connection established", r))
  .catch((e) => console.log(e));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Socket code --> will be moved into seperate files
const io = require("socket.io")(server, {
  cors: { origin: ["http://localhost:8080"] },
});
const { sendMessage, joinRoom } = require("./socket/socketHandler")(io);
const onConnection = (socket) => {
  socket.on("room:join", joinRoom);
  socket.on("message:send", sendMessage);
};

io.on("connection", onConnection);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

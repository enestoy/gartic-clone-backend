const { joinRoom, leaveRoom } = require("./roomHandler");
const { startGame, startTurn } = require("./gameHandler");
var events = require("events");
var socket_io = require("socket.io");
const { EventEmitter } = require("stream");
var io = socket_io();
var socketApi = {};

socketApi.io = io;

io.on("connection", function (socket) {
    //console.log("io.sockets", io.sockets.sockets.get);
    socket.on("room:join", (data) => joinRoom(socket, io, data));
    socket.on("game:start", (data) => startGame(socket, io, data));

    // socket.on("game:startTurn", startTurn);
    // socket.on("canvas:draw", (data) => {
    //     socket.broadcast.to(data.roomId).emit("canvas:drawing", data);
    // });
    socket.on("disconnecting", leaveRoom);
    socket.on("disconnect", (data) => {
        console.log("Disconnected socket rooms ", socket.rooms);
    });
});

socketApi.sendNotification = function () {
    io.sockets.emit("hello", { msg: "Hello World!" });
};

var eventEmmiter = new events.EventEmitter();
eventEmmiter.on("turn:change", () => {});
eventEmmiter.on("score:add", () => {});
eventEmmiter.on("time:start", () => {});

module.exports = socketApi;

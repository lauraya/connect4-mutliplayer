const http = require("http");
const path = require("path");
const express = require("express");
const { Server } = require("socket.io");
const app = express();
let rooms = 0;
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "/../front")));

io.on("connection", (socket) => {
  console.log("A user just connected.");

  socket.on("disconnect", () => {
    console.log("A user has disconnected.");
  });

  socket.on("create-game", (data) => {
    socket.join("yubiyubi-" + ++rooms);
    socket.emit("newGame", { name: data.name, room: "yubiyubi-" + rooms });
    io.emit("player1-name", { name: data.name });
    console.log("yubiyubi-" + rooms);
  });

  socket.on("join-game", (data) => {
    var room = io.sockets.adapter.rooms.get(data.room); //To get room size
    io.emit("player2-name", { namep2: data.namep2, namep1: data.namep1 });
    if (room && room.size == 1) {
      socket.join(data.room);
      socket.broadcast.to(data.room).emit("player1-start");

      socket.emit("player2-start", { name: data.namep2, room: data.room });
      socket.broadcast.to(data.room).emit("2playerIn");
    } else {
      console.log("room full");
      socket.emit("err", { message: "Sorry, The room is full!" });
    }
  });

  socket.on("playTurn", (data) => {
    socket.broadcast.to(data.room).emit("turnPlayed", {
      row: data.row,
      cell: data.cell,
      room: data.room,
    });
  });
});

server.listen(8080, () => {
  console.log("server started");
});

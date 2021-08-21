const http = require("http");
const path = require("path");
var PORT = process.env.PORT || 8080;
const express = require("express");
var users = []; //List of users
const { Server } = require("socket.io");
const { on } = require("events");
const app = express();
var rooms = 0;
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "/../front")));

io.on("connection", (socket) => {
  console.log("A user just connected.");

  socket.on("disconnect", () => {
    console.log("A user has disconnected.");
  });

  //Event to emit event to opponent before current user disconnects
  socket.on("disconnecting", () => {
    console.log("disconnecting..");
    console.log(socket.rooms);
    let currentRoom = [...socket.rooms][1];
    io.to(currentRoom).emit("opponent-left");
  });

  socket.on("create-game", (data) => {
    socket.join("yubiyubi-" + ++rooms);
    socket.emit("newGame", { name: data.name, room: "yubiyubi-" + rooms });
    users[socket.id] = data.name; //We add name of user
    io.to("yubiyubi-" + rooms).emit("player1name");
    //console.log(socket.rooms);
  });

  socket.on("join-game", (data) => {
    var room = io.sockets.adapter.rooms.get(data.room); //To get room size

    if (room && room.size == 1) {
      let playername = [];
      socket.join(data.room);
      users[socket.id] = data.namep2; //Adding player 2's name to the array
      for (var clientID of room) {
        const clientSocket = io.sockets.sockets.get(clientID); // gets the sockets of all the users in the room
        //console.log(users[clientSocket.id]);
        playername.push(users[clientSocket.id]); //gets corresponding username of the client socket and pushes to playername
      }
      socket.broadcast.to(data.room).emit("player1-start", {
        namep1: playername[0],
        namep2: playername[1],
      });

      socket.emit("player2-start", {
        namep1: playername[0],
        namep2: playername[1],
        room: data.room,
      });
      socket.broadcast.to(data.room).emit("2playerIn");
    } else {
      console.log("room full");
      socket.emit("err");
    }
  });

  socket.on("winner-here", (data) => {
    console.log("winner here");
    socket.broadcast
      .to(data.room)
      .emit("winner-popup", { winnerName: data.winnerName });
  });

  socket.on("tie", (data) => {
    io.to(data.room).emit("game-tied");
  });
  socket.on("playTurn", (data) => {
    socket.broadcast.to(data.room).emit("turnPlayed", {
      row: data.row,
      cell: data.cell,
      room: data.room,
    });
  });

  socket.on("restart-game", (data) => {
    io.in(data.room).emit("restart");
  });
});

server.listen(PORT, () => {
  console.log("server started");
});

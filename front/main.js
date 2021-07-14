const socket = io();
let player;
let game;
var player1name;
var player2name;
const number1 = 1;
const number2 = 2;
const color1 = "rgb(41, 158, 179)";
const color2 = "pink";

var audio = new Audio("audio/bounce.mp3"); //boing

class Player {
  constructor(name, number, color) {
    this.name = name;
    this.number = number;
    this.color = color;
    this.turn = true;
  }

  setTurn(turn) {
    console.log(player1name);
    console.log(player2name);
    this.turn = turn;
    let message;

    if (player2name == null) {
      message = turn ? "Your turn" : "Opponent's turn";
    } else {
      message = turn
        ? "Your turn"
        : this.number == 1 //if the current is player is player1
        ? player2name + "'s turn" //we tell player1 to wait for player 2
        : player1name + "'s turn"; //else if it's player 2  we tell player2 to wait for player1
    }
    $(".message1").html(message);
  }
  getTurn() {
    return this.turn;
  }
  getPlayerName() {
    return this.name;
  }

  getPlayerNumber() {
    return this.number;
  }

  getColor() {
    return this.color;
  }
}

class Grid {
  constructor(roomid) {
    this.roomid = roomid;
    this.gameGrid = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
    this.numberMoves = 0;
    this.numberOfPlayer = 1;
  }

  getroomid() {
    return this.roomid;
  }
  createGrid() {
    var col = document.getElementsByTagName("tr");
    for (let cellindex = 0; cellindex < col.length; cellindex++) {
      col[cellindex].addEventListener("click", (e) => {
        console.log(this.numberOfPlayer);
        let cell = e.target.cellIndex;
        if (!player.getTurn() || !game) {
          alert("It's not your turn!");
          return;
        }
        if (this.numberOfPlayer <= 1) {
          //the first player cannot play as long as there is only himself TT
          alert("Wait for the other player!"); //Gotta have friends
          return;
        }

        for (let row = 5; row > 1; row--) {
          if (game.gameGrid[row][cell] == 0) {
            game.turnPlayed(row, cell);
            game.updateGrid(
              row,
              cell,
              player.getPlayerNumber(),
              player.getColor()
            );
            player.setTurn(false);
            game.checkWinner();
            socket.emit("playTurn", {
              row: row,
              cell: cell,
              room: this.getroomid(),
            });
            break;
          }
        }
      });
      break;
    }
  }

  setnumberOfPlayer(number) {
    this.numberOfPlayer = number;
  }
  turnPlayed(row, cell) {
    socket.emit("playTurn", {
      row: row,
      cell: cell,
      room: this.getroomid(),
    });
  }
  updateGrid(row, cell, number, color) {
    console.log("row", row);
    console.log("cell", cell);
    var table = document.getElementById("game");
    this.gameGrid[row][cell] = number;
    table.rows[row].cells[cell].style.backgroundColor = color;
    audio.play();
  }

  resetGrid() {}

  displayGrid(message) {
    $(".menu").css("display", "none");
    $(".grid").css("display", "flex");
    $("#hello").html(message);
    this.createGrid();
    console.log("game created");
  }
  checkWinner() {
    if (
      this.checkDiagonalRight() ||
      this.checkDiagonalLeft() ||
      this.checkHorizontal() ||
      this.checkVertical()
    ) {
      game.winnerPopup();
    }

    if (this.checkTie()) {
      game.tiePopup();
    }
  }

  winnerPopup() {
    $(".msg-container").css("display", "flex");
    $("#win-msg").text(player.name + " won!");
  }

  tiePopup() {
    $(".msg-container").css("display", "flex");
    $("#win-msg").text("It's a tie!");
  }

  check4(one, two, three, four) {
    return (
      one === two &&
      one === three &&
      one === four &&
      one !== 0 &&
      one !== undefined
    );
  }
  checkDiagonalRight() {
    for (let col = 0; col < 4; col++) {
      for (let row = 5; row > 2; row--) {
        if (
          this.check4(
            this.gameGrid[row][col],
            this.gameGrid[row - 1][col + 1],
            this.gameGrid[row - 2][col + 2],
            this.gameGrid[row - 3][col + 3]
          )
        ) {
          console.log("diag right check");
          return true;
        }
      }
    }
  }
  checkTie() {
    if (this.numberMoves >= 42) {
      return true;
    }
  }
  checkVertical() {
    for (let cell = 0; cell < 7; cell++) {
      for (let row = 0; row < 3; row++) {
        if (
          this.check4(
            this.gameGrid[row][cell],
            this.gameGrid[row + 1][cell],
            this.gameGrid[row + 2][cell],
            this.gameGrid[row + 3][cell]
          )
        ) {
          console.log("vertical check");
          return true;
        }
      }
    }
  }
  checkHorizontal() {
    for (let row = 0; row < this.gameGrid.length; row++) {
      for (let i = 0; i < 4; i++) {
        if (
          this.check4(
            this.gameGrid[row][i],
            this.gameGrid[row][i + 1],
            this.gameGrid[row][i + 2],
            this.gameGrid[row][i + 3]
          )
        ) {
          console.log("horizontal check");
          return true;
        }
      }
    }
  }

  checkDiagonalLeft() {
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (
          this.check4(
            this.gameGrid[row][col],
            this.gameGrid[row + 1][col + 1],
            this.gameGrid[row + 2][col + 2],
            this.gameGrid[row + 3][col + 3]
          )
        ) {
          return true;
        }
      }
    }
  }
}
//create new Game (only player 1 at first)
socket.on("newGame", (data) => {
  const msg =
    "Hello, " +
    data.name +
    ". Please ask your friend to enter this game ID: " +
    data.room;
  game = new Grid(data.room);
  game.displayGrid(msg);
});

//When two players join game, msg of welcome
socket.on("player1-start", (data) => {
  const message = "Hello " + player.getPlayerName();
  player.setTurn(true);
  $("#hello").html(message);
});

//Player 2 joins the game, gameGrid reavealed and msg of welcome
socket.on("player2-start", (data) => {
  console.log("player2 entry");
  const message = `Hello, ${data.name}`;
  game = new Grid(data.room);
  game.displayGrid(message);
  game.setnumberOfPlayer(2);
  socket.emit("2players", { room: data.room });
  player.setTurn(false);
});

$("#new").on("click", () => {
  var name = $("#Newname").val();
  if (!name) {
    alert("Please enter your name.");
    return;
  }
  socket.emit("create-game", { name: name });
  player = new Player(name, number1, color1);
  //player1name = name;
  //console.log("player: ", player1name);

  console.log(player);
});

$("#join").on("click", () => {
  console.log("player: ", player);
  var name = $("#nameJoin").val();
  var roomid = $("#room").val();
  console.log(name);
  console.log(roomid);
  if (!name || !roomid) {
    alert("please enter your name and a game ID");
    return;
  }
  socket.emit("join-game", { name: name, room: roomid });

  player = new Player(name, number2, color2);

  console.log(player);
});

socket.on("player1-name", (data) => {
  player1name = data.name;
});

socket.on("player2-name", (data) => {
  player2name = data.name;
});

socket.on("turnPlayed", (data) => {
  console.log(data.row);
  console.log(player);
  let opponent = player.getPlayerNumber() === 1 ? 2 : 1;
  let color = player.getColor() === color1 ? color2 : color1;
  game.updateGrid(data.row, data.cell, opponent, color);
  player.setTurn(true);
});

socket.on("2playerIn", () => {
  console.log("2 players");
  game.setnumberOfPlayer(2); //Allow player 1 to play, if we did not do that he would be stuck
});

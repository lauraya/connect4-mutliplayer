var popup = document.querySelector(".msg-container");
var popup_msg = document.getElementById("win-msg");
var col = document.getElementsByTagName("tr");
var draw = false;
var message = document.querySelector(".message1");
var reset = document.querySelector(".reset");
var audio = new Audio("audio/bounce.mp3");
var color1 = "rgb(41, 158, 179)";
var color2 = "pink";
var newName = document.getElementById("newName");

var gameGrid = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];
var gameCell = document.querySelector(".cell");
var player = 1;

message.textContent = player1 + "'s turn!";

socket.on("player2-msg-turn", (play2) => {
  messageTurn(play2);
});

socket.on("player1-msg-turn", (play1) => {
  messageTurn(play1);
});

/*socket.on("win-popup-msg"),
  (playname) => {
    winPopup(playname);
  };*/

socket.on("changeColor", (row, column, playerNumber, color) => {
  colorChange(row, column, playerNumber, color);
});

for (i = 0; i < col.length; i++) {
  col[i].addEventListener("click", (e) => {
    let cell = e.target.cellIndex;
    let playerName;
    console.log(e.target.cellIndex);
    console.log(gameGrid);
    let colorplayer;
    if (player == 1) {
      colorplayer = color1;
      playerName = player1;
    } else {
      colorplayer = color2;
      playerName = player2;
    }
    for (let i = 5; i >= 0; i--) {
      if (gameGrid[i][cell] != 0) {
        console.log("if condition");
      } else {
        console.log("else condition");
        audio.play();
        socket.emit("change", i, cell, player, colorplayer);
        if (checkDraw()) {
        }
        if (
          checkHorizontal(i) ||
          checkVertical(cell) ||
          checkDiagonalRight() ||
          checkDiagonalLeft()
        ) {
          console.log("the player have won");
          console.log(playerName);
          //socket.emit("win-popup", playerName);

          (popup.style.display = "flex"),
            (popup_msg.textContent = playerName + " won!");
          break;
        }
        if (player == 1) {
          player = 2;
          socket.emit("player2-turn", player2);
          // message.textContent = player2 + "'s turn!";
        } else {
          player = 1;
          socket.emit("player1-turn", player1);
          //message.textContent = player1 + "'s turn!";
        }
        break;
      }
    }
  });
}

function messageTurn(player) {
  message.textContent = player + "'s turn!";
}

function colorChange(row, column, playerNumber, color) {
  gameGrid[row][column] = playerNumber;
  table.rows[row].cells[column].style.backgroundColor = color;
}
/*function winPopup(playername) {
  popup.style.display = "flex";
  popup_msg.textContent = playername + " won!";
}*/

function checkHorizontal(row) {
  for (let i = 0; i < 4; i++) {
    if (
      check4(
        gameGrid[row][i],
        gameGrid[row][i + 1],
        gameGrid[row][i + 2],
        gameGrid[row][i + 3]
      )
    ) {
      console.log("horizontal check");
      return true;
    }
  }
}

function checkVertical() {
  for (let column = 0; colum < 7; column++) {
    for (let i = 0; i < 3; i++) {
      if (
        check4(
          gameGrid[column][cell],
          gameGrid[column + 1][cell],
          gameGrid[column + 2][cell],
          gameGrid[column + 3][cell]
        )
      ) {
        console.log("vertical check");
        return true;
      }
    }
  }
}

function checkDiagonalRight() {
  for (let col = 0; col < 4; col++) {
    for (let row = 5; row > 2; row--) {
      if (
        check4(
          gameGrid[row][col],
          gameGrid[row - 1][col + 1],
          gameGrid[row - 2][col + 2],
          gameGrid[row - 3][col + 3]
        )
      ) {
        console.log("diag right check");
        return true;
      }
    }
  }
}

function checkDiagonalLeft() {
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 3; row++) {
      if (
        check4(
          gameGrid[row][col],
          gameGrid[row + 1][col + 1],
          gameGrid[row + 2][col + 2],
          gameGrid[row + 3][col + 3]
        )
      ) {
        console.log("diag left check");
        return true;
      }
    }
  }
}

function check4(one, two, three, four) {
  return (
    one === two &&
    one === three &&
    one === four &&
    one !== 0 &&
    one !== undefined
  );
}

const countOccurrences = (arr, val) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

function checkDraw() {
  count = 0;
  for (let i = 0; i < 6; i++) {}
}

function restart() {
  gameGrid = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  popup.style.display = "none";
  player = 1;
  message.textContent = player1 + "'s turn!";
  for (let row1 of table.rows) {
    for (let cell1 of row1.cells) {
      cell1.style.backgroundColor = "blanchedalmond";
    }
  }
}

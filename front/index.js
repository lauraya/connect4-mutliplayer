var table = document.getElementById("game");
var popup = document.querySelector(".msg-container");
var popup_msg = document.getElementById("win-msg");
var col = document.getElementsByTagName("tr");

var message = document.querySelector(".message1");
var reset = document.querySelector(".reset");
var audio = new Audio("audio/bounce.mp3");
var color1 = "rgb(41, 158, 179)";
var color2 = "pink";

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

while (!player1) {
  var player1 = prompt("player 1 please enter your name");
}

while (!player2) {
  var player2 = prompt("player 2 please enter your name");
}
message.textContent = player1 + "'s turn!";

for (i = 0; i < col.length; i++) {
  col[i].addEventListener("click", play);
}

function play(e) {
  let cell = e.target.cellIndex;
  let playerName;
  console.log(e.target.cellIndex);
  console.log(gameGrid);
  let colorChange;
  if (player == 1) {
    colorChange = color1;
    playerName = player1;
  } else {
    colorChange = color2;
    playerName = player2;
  }
  for (let i = 5; i >= 0; i--) {
    if (gameGrid[i][cell] != 0) {
      console.log("if condition");
    } else {
      console.log("else condition");
      gameGrid[i][cell] = player;
      audio.play();
      table.rows[i].cells[cell].style.backgroundColor = colorChange;
      if (
        checkHorizontal(i) ||
        checkVertical(cell) ||
        checkDiagonalRight() ||
        checkDiagonalLeft()
      ) {
        console.log("the player have won");

        popup.style.display = "flex";
        popup_msg.textContent = playerName + " won!";
        break;
      }
      if (player == 1) {
        player = 2;
        message.textContent = player2 + "'s turn!";
      } else {
        player = 1;
        message.textContent = player1 + "'s turn!";
      }
      break;
    }
  }
}

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

function checkVertical(cell) {
  for (let i = 0; i < 3; i++) {
    if (
      check4(
        gameGrid[i][cell],
        gameGrid[i + 1][cell],
        gameGrid[i + 2][cell],
        gameGrid[i + 3][cell]
      )
    ) {
      console.log("vertical check");
      return true;
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

function checkDraw() {}

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
  for (let row1 of table.rows) {
    for (let cell1 of row1.cells) {
      cell1.style.backgroundColor = "blanchedalmond";
    }
  }
}

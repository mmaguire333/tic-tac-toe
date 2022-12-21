let playerFactory = function(name, marker) {
    return {name: name, marker: marker};
}

const gameBoard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];
    let cellOne = document.querySelector(".one");
    let cellTwo = document.querySelector(".two");
    let cellThree = document.querySelector(".three");
    let cellFour = document.querySelector(".four");
    let cellFive = document.querySelector(".five");
    let cellSix = document.querySelector(".six");
    let cellSeven = document.querySelector(".seven");
    let cellEight = document.querySelector(".eight");
    let cellNine = document.querySelector(".nine");
    let cells = [cellOne, cellTwo, cellThree, cellFour, cellFive, cellSix, cellSeven, cellEight, cellNine];

    let renderBoard = function() {
        for(let i = 0; i < cells.length; i++) {
            cells[i].textContent = board[i];
        }
    }

    return {board, cells, renderBoard};
})();

const displayController = (function() {
    // get form elements and initialize player variables
    let pageTitle = document.querySelector(".page-title");
    let startBtn = document.querySelector(".start-button");
    let form = document.querySelector(".player-form");
    let submitBtn = document.getElementById("submit-button");
    let boardContainer = document.querySelector(".board-container");
    let winnerMessage = document.createElement("div");
    let boardDisplay = document.querySelector(".gameboard");
    let resetBtn = document.querySelector(".reset");

    winnerMessage.classList.add("winner-message");
    boardContainer.insertAdjacentElement("beforebegin", winnerMessage);

    let body = document.querySelector("body");

    let playerOneDisplay = document.createElement("div");
    playerOneDisplay.classList.add("player-one-display");
    playerOneDisplay.style.display = "none"

    let playerTwoDisplay = document.createElement("div");
    playerTwoDisplay.classList.add("player-two-display");
    playerTwoDisplay.style.display = "none";
    
    let playerOneTitle = document.createElement("h2");
    let playerTwoTitle = document.createElement("h2");
    let playerOneMark = document.createElement("h3");
    let playerTwoMark = document.createElement("h3");

    playerOneDisplay.appendChild(playerOneTitle);
    playerOneDisplay.appendChild(playerOneMark);
    playerTwoDisplay.appendChild(playerTwoTitle);
    playerTwoDisplay.appendChild(playerTwoMark);

    boardDisplay.insertAdjacentElement("beforebegin", playerOneDisplay);
    boardDisplay.insertAdjacentElement("afterend", playerTwoDisplay);

    let playerOneName = "";
    let playerOneMarker = "";
    let playerTwoName = "";
    let playerTwoMarker = "";
    let playerOne = {};
    let playerTwo = {};
    let currentPlayer = 1;

    // turn on form when start is pressed
    startBtn.addEventListener("click", () => {
        form.style.display = "flex";
    });

    // makes playerOne and playerTwo variable from form input
    submitBtn.addEventListener("click", (event) => {
        event.preventDefault();
        playerOneName = document.getElementById("player-one-name").value;
        playerOneMarker = document.getElementById("player-one-marker").value;
        playerTwoName = document.getElementById("player-two-name").value;
        playerTwoMarker = document.getElementById("player-two-marker").value;

        playerOne = playerFactory(playerOneName, playerOneMarker);
        playerTwo = playerFactory(playerTwoName, playerTwoMarker);

        let isValid = form.checkValidity();

        if(!isValid) {
            alert("Please fill out all fields in form");
            return;
        }

        if(playerOne.marker === playerTwo.marker) {
            alert("Players cannot choose the same marker");
            return;
        }

        form.reset();
        pageTitle.style.display = "none";
        form.style.display = "none";
        boardDisplay.style.display = "grid";
        resetBtn.style.display = "block";
        startBtn.style.display = "none";

        playerOneTitle.textContent = "Player 1: " + playerOne.name;
        playerOneMark.textContent = playerOne.marker;
        playerOneDisplay.style.display = "flex";
        playerTwoTitle.textContent = "Player 2: " + playerTwo.name;
        playerTwoMark.textContent = playerTwo.marker;
        playerTwoDisplay.style.display = "flex";
        body.style.display = "block";
    });


    playerOneDisplay.style.border = "3px solid darkred";
    // add event listeners to grid squares that add current players mark to grid square if it is empty.
    for(let i = 0; i < gameBoard.cells.length; i++) {
        gameBoard.cells[i].addEventListener("click", () => {
            if(gameBoard.board[i] === "") {
                if(currentPlayer === 1) {
                    gameBoard.board[i] = playerOne.marker;
                    gameBoard.renderBoard();
                    playerOneDisplay.style.border = "3px solid aliceblue";
                    playerTwoDisplay.style.border = "3px solid darkred";
                    if(checkWin(playerOne.marker)) {
                        winnerMessage.textContent = playerOne.name + " wins!";
                        playerOneDisplay.style.border = "15px solid green";
                        playerTwoDisplay.style.border = "3px solid aliceblue";
                        for(let i = 0; i < gameBoard.cells.length; i++) {
                            if(gameBoard.board[i] === "") {
                                gameBoard.board[i] = " ";
                            }
                        }
                    } else if(checkDraw()) {
                        winnerMessage.textContent = "Its a draw!";
                        playerOneDisplay.style.border = "3px solid aliceblue";
                        playerTwoDisplay.style.border = "3px solid aliceblue";
                    } else {
                        currentPlayer = 2;
                        return;
                    }
                }

                if(currentPlayer === 2) {
                    gameBoard.board[i] = playerTwo.marker;
                    gameBoard.renderBoard();
                    playerTwoDisplay.style.border = "3px solid aliceblue";
                    playerOneDisplay.style.border = "3px solid darkred";
                    if(checkWin(playerTwo.marker)) {
                        winnerMessage.textContent = playerTwo.name + " wins!";
                        playerOneDisplay.style.border = "3px solid aliceblue";
                        playerTwoDisplay.style.border = "15px solid green";
                        for(let i = 0; i < gameBoard.cells.length; i++) {
                            if(gameBoard.board[i] === "") {
                                gameBoard.board[i] = " ";
                            }
                        }
                    } else if(checkDraw()) {
                        winnerMessage.textContent = "Its a draw!";
                        playerOneDisplay.style.border = "3px solid aliceblue";
                        playerTwoDisplay.style.border = "3px solid aliceblue";
                    } else {
                        currentPlayer = 1;
                        return;
                    }
                }
            }
        });
    }

    resetBtn.addEventListener("click", () => {
        playerOneName = "";
        playerOneMarker = "";
        playerTwoName = "";
        playerTwoMarker = "";
        playerOne = {};
        playerTwo = {};
        currentPlayer = 1;
        for(let i = 0; i < gameBoard.board.length; i++) {
            gameBoard.board[i] = "";
        }
        gameBoard.renderBoard();
        winnerMessage.textContent = "";
        boardDisplay.style.display = "none";
        resetBtn.style.display = "none";
        pageTitle.style.display = "block";
        startBtn.style.display = "block";
        playerOneDisplay.style.display = "none";
        playerTwoDisplay.style.display = "none";
        body.style.display = "flex";
    });

    function checkWin(playerMarker) {
        if(gameBoard.cells[0].textContent === playerMarker && gameBoard.cells[1].textContent === playerMarker && gameBoard.cells[2].textContent === playerMarker) {
            return true;
        }

        if(gameBoard.cells[3].textContent === playerMarker && gameBoard.cells[4].textContent === playerMarker && gameBoard.cells[5].textContent === playerMarker) {
            return true;
        }

        if(gameBoard.cells[6].textContent === playerMarker && gameBoard.cells[7].textContent === playerMarker && gameBoard.cells[8].textContent === playerMarker) {
            return true;
        }
        
        if(gameBoard.cells[0].textContent === playerMarker && gameBoard.cells[3].textContent === playerMarker && gameBoard.cells[6].textContent === playerMarker) {
            return true;
        }

        if(gameBoard.cells[1].textContent === playerMarker && gameBoard.cells[4].textContent === playerMarker && gameBoard.cells[7].textContent === playerMarker) {
            return true;
        }

        if(gameBoard.cells[2].textContent === playerMarker && gameBoard.cells[5].textContent === playerMarker && gameBoard.cells[8].textContent === playerMarker) {
            return true;
        }

        if(gameBoard.cells[0].textContent === playerMarker && gameBoard.cells[4].textContent === playerMarker && gameBoard.cells[8].textContent === playerMarker) {
            return true;
        }

        if(gameBoard.cells[2].textContent === playerMarker && gameBoard.cells[4].textContent === playerMarker && gameBoard.cells[6].textContent === playerMarker) {
            return true;
        }
    }

    function checkDraw() {
        for(let i = 0; i < gameBoard.cells.length; i++) {
            if(gameBoard.cells[i].textContent === "") {
                return false;
            }
        }

        return true;
    }

    function getPlayerOne() {
        return playerOne;
    }

    function getPlayerTwo() {
        return playerTwo;
    }

    return {getPlayerOne, getPlayerTwo};

})();


let playerFactory = function(name, marker) {
    return {name: name, marker: marker};
}

let computerFactory = function(marker, difficulty) {
    return {marker: marker, difficulty: difficulty};
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
    let computerBtn = document.querySelector(".play-computer-button");
    let form = document.querySelector(".player-form");
    let computerForm = document.querySelector(".computer-form");
    let submitBtn = document.getElementById("submit-button");
    let computerSubmitBtn = document.getElementById("computer-form-submit");
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

    // PvP variables
    let playerOneName = "";
    let playerOneMarker = "";
    let playerTwoName = "";
    let playerTwoMarker = "";
    let playerOne = {};
    let playerTwo = {};
    let currentPlayer = 1;

    // PvC variables
    let playerVCName = "";
    let playerVCMarker = "";
    let computerMarker = "";
    let computerDifficulty = "";
    let player = {};
    let computer = {};
    let againstComputer  = false;

    // turn on form when start is pressed
    startBtn.addEventListener("click", () => {
        form.style.display = "flex";
    });

    // turn on computer form on button click
    computerBtn.addEventListener('click', () => {
        computerForm.style.display = "flex";
    })

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
        computerBtn.style.display = "none";

        playerOneTitle.textContent = "Player 1: " + playerOne.name;
        playerOneMark.textContent = playerOne.marker;
        playerOneDisplay.style.display = "flex";
        playerTwoTitle.textContent = "Player 2: " + playerTwo.name;
        playerTwoMark.textContent = playerTwo.marker;
        playerTwoDisplay.style.display = "flex";
        body.style.display = "block";
    });

    // makes player and computer variables from form input
    computerSubmitBtn.addEventListener('click', (event) => {
        event.preventDefault();
        againstComputer = true;
        playerVCName = document.getElementById("player-name").value;
        playerVCMarker = document.getElementById("player-marker").value;
        computerMarker = document.getElementById("computer-marker").value;
        computerDifficulty = document.getElementById("computer-difficulty").value;
        
        player = playerFactory(playerVCName, playerVCMarker);
        computer = computerFactory(computerMarker, computerDifficulty);

        let validity = computerForm.checkValidity();

        if(!validity) {
            alert("Please fill out all fields in form");
            return;
        }

        if(playerVCMarker === computerMarker) {
            alert("Player and computer cannot choose same marker");
            return;
        }

        computerForm.reset();
        pageTitle.style.display = "none";
        computerForm.style.display = "none";
        boardDisplay.style.display = "grid";
        resetBtn.style.display = "block";
        startBtn.style.display = "none";
        computerBtn.style.display = "none";

        playerOneTitle.textContent = "Player 1: " + player.name;
        playerOneMark.textContent = player.marker;
        playerOneDisplay.style.display = "flex";
        playerTwoTitle.textContent = "Computer";
        playerTwoMark.textContent = computer.marker;
        playerTwoDisplay.style.display = "flex";
        body.style.display = "block";
    });


    playerOneDisplay.style.border = "3px solid darkred";
    // add event listeners to grid squares that add current players mark to grid square if it is empty.
    for(let i = 0; i < gameBoard.cells.length; i++) {
        gameBoard.cells[i].addEventListener("click", () => {
            if(gameBoard.board[i] === "") {
                if(againstComputer === false) {
                    if(currentPlayer === 1) {
                        gameBoard.board[i] = playerOne.marker;
                        gameBoard.renderBoard();
                        playerOneDisplay.style.border = "3px solid aliceblue";
                        playerTwoDisplay.style.border = "3px solid darkred";
                        if(checkWin(playerOne.marker, gameBoard.board)) {
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
                        if(checkWin(playerTwo.marker, gameBoard.board)) {
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
                

                if(againstComputer === true) {
                    // add player move to array and render the board
                    gameBoard.board[i] = player.marker;
                    gameBoard.renderBoard();

                    // check if player wins or draws and display message
                    if(checkWin(player.marker, gameBoard.board)) {
                        winnerMessage.textContent = player.name + " wins!";
                        playerOneDisplay.style.border = "15px solid green";
                        playerTwoDisplay.style.border = "3px solid aliceblue";
                        return;
                    } else if (checkDraw()) {
                        winnerMessage.textContent = "It's a draw!";
                        playerOneDisplay.style.border = "3px solid aliceblue";
                        playerTwoDisplay.style.border = "3px solid aliceblue";
                        return;
                    }
                    
                    if(computer.difficulty === 'easy') {
                        // make computer move and render board after 1.5 seconds
                        let computerMoveIndex = getComputerMoveEasy(gameBoard.board);
                        gameBoard.board[computerMoveIndex] = computer.marker;
                        playerOneDisplay.style.border = '3px solid aliceblue';
                        playerTwoDisplay.style.border = '3px solid darkred';
                        setTimeout(() => {
                            gameBoard.renderBoard();
                            playerOneDisplay.style.border = '3px solid darkred';
                            playerTwoDisplay.style.border = '3px solid aliceblue';
                        }, 1500);
                        
                        //check if computer wins and display winner message
                        if(checkWin(computer.marker, gameBoard.board)) {
                            setTimeout(() => {
                                winnerMessage.textContent = "Computer wins!";
                                playerOneDisplay.style.border = "3px solid aliceblue";
                                playerTwoDisplay.style.border = "15px solid green";
                            }, 1500);
                        }
                    } else if(computer.difficulty === 'medium') {
                        // make computer move and render board after 1.5 seconds
                        let computerMoveIndex = getComputerMoveMedium(gameBoard.board, player.marker);
                        gameBoard.board[computerMoveIndex] = computer.marker;
                        playerOneDisplay.style.border = '3px solid aliceblue';
                        playerTwoDisplay.style.border = '3px solid darkred';
                        setTimeout(() => {
                            gameBoard.renderBoard();
                            playerOneDisplay.style.border = '3px solid darkred';
                            playerTwoDisplay.style.border = '3px solid aliceblue';
                        }, 1500);

                        //check if computer wins and display winner message
                        if(checkWin(computer.marker, gameBoard.board)) {
                            setTimeout(() => {
                                winnerMessage.textContent = "Computer wins!";
                                playerOneDisplay.style.border = "3px solid aliceblue";
                                playerTwoDisplay.style.border = "15px solid green";
                            }, 1500);
                        }
                    } else if(computer.difficulty === 'hard') {
                        // make computer move and render board after 1.5 seconds
                        let computerMoveIndex = getComputerMoveHard(gameBoard.board);
                        gameBoard.board[computerMoveIndex] = computer.marker;
                        playerOneDisplay.style.border = '3px solid aliceblue';
                        playerTwoDisplay.style.border = '3px solid darkred';
                        setTimeout(() => {
                            gameBoard.renderBoard();
                            playerOneDisplay.style.border = '3px solid darkred';
                            playerTwoDisplay.style.border = '3px solid aliceblue';
                        }, 1500);

                        //check if computer wins and display winner message
                        if(checkWin(computer.marker, gameBoard.board)) {
                            setTimeout(() => {
                                winnerMessage.textContent = "Computer wins!";
                                playerOneDisplay.style.border = "3px solid aliceblue";
                                playerTwoDisplay.style.border = "15px solid green";
                            }, 1500);
                        }
                    }
                }
            }
        });
    }

    function getComputerMoveEasy(boardState) {
        let index = -1;
        let openSquares = [];
        for(let i = 0; i < boardState.length; i++) {
            if(boardState[i] === "") {
                openSquares.push(i);
            }
        }

        let random = Math.floor(Math.random() * openSquares.length);
        index = openSquares[random];
        return index;
    }

    function getComputerMoveMedium(boardState, opponentMarker) {
        let index = -1;
        for(let i = 0; i <= 6; i = i + 3) {
            if(boardState[i] === opponentMarker && boardState[i + 1] === opponentMarker && boardState[i + 2] === "") {
                index = i + 2;
            } else if(boardState[i] === opponentMarker && boardState[i + 2] === opponentMarker && boardState[i + 1] === "") {
                index = i + 1;
            } else if(boardState[i + 1] === opponentMarker && boardState[i + 2] === opponentMarker && boardState[i] === "") {
                index = i;
            }
        }

        for(let i = 0; i < 3; i++) {
            if(boardState[i] === opponentMarker && boardState[i + 3] === opponentMarker && boardState[i + 6] === "") {
                index = i + 2;
            } else if(boardState[i] === opponentMarker && boardState[i + 6] === opponentMarker && boardState[i + 3] === "") {
                index = i + 1;
            } else if(boardState[i + 3] === opponentMarker && boardState[i + 6] === opponentMarker && boardState[i] === "") {
                index = i;
            }
        }

        if(index === -1) {
            index = getComputerMoveEasy(boardState);
        }

        return index;
    }

    function getComputerMoveHard(boardState) {
        let optimalMove = minimax(boardState, computer);
        return optimalMove.index;
    }

    function minimax(boardState, currentPlayer) {
        // get a set of indices corresponding to open squares on board and store them in array
        let openSquareIndices = [];
        for(let i = 0; i < boardState.length; i++) {
            if(boardState[i] === "") {
                openSquareIndices.push(i);
            }
        }

        // check for win loss or draw
        if(checkWin(player.marker, boardState)) {
            return {score: -10};
        } else if(checkWin(computer.marker, boardState)) {
            return {score: 10};
        } else if(openSquareIndices.length === 0) {
            return {score: 0};
        }

        
        let moves = [];

        for(let i = 0; i < openSquareIndices.length; i++) {
            let move = {};
            move.index = openSquareIndices[i];
            boardState[openSquareIndices[i]] = currentPlayer.marker;

            if(currentPlayer.marker === computer.marker) {
                let result = minimax(boardState, player);
                move.score = result.score;
            } else if(currentPlayer.marker === player.marker) {
                let result  = minimax(boardState, computer);
                move.score = result.score;
            }

            boardState[openSquareIndices[i]] = "";
            moves.push(move);
        }

        let bestMove;
        if(currentPlayer.marker === computer.marker) {
            let bestScore = -100000;
            for(let i = 0; i < moves.length; i++) {
                if(moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 100000;
            for(let i = 0; i < moves.length; i++) {
                if(moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    resetBtn.addEventListener("click", () => {
        playerOneName = "";
        playerOneMarker = "";
        playerTwoName = "";
        playerTwoMarker = "";
        playerOne = {};
        playerTwo = {};
        currentPlayer = 1;

        playerVCName = "";
        playerVCMarker = "";
        computerMarker = "";
        computerDifficulty = "";
        player = {};
        computer = {};
        againstComputer = false;
        
        for(let i = 0; i < gameBoard.board.length; i++) {
            gameBoard.board[i] = "";
        }
        gameBoard.renderBoard();
        winnerMessage.textContent = "";
        boardDisplay.style.display = "none";
        resetBtn.style.display = "none";
        pageTitle.style.display = "block";
        startBtn.style.display = "block";
        computerBtn.style.display = "block";
        playerOneDisplay.style.display = "none";
        playerTwoDisplay.style.display = "none";
        body.style.display = "flex";
    });

    function checkWin(playerMarker, board) {
        if(board[0] === playerMarker && board[1] === playerMarker && board[2] === playerMarker) {
            return true;
        }

        if(board[3] === playerMarker && board[4] === playerMarker && board[5] === playerMarker) {
            return true;
        }

        if(board[6] === playerMarker && board[7] === playerMarker && board[8] === playerMarker) {
            return true;
        }
        
        if(board[0] === playerMarker && board[3] === playerMarker && board[6] === playerMarker) {
            return true;
        }

        if(board[1] === playerMarker && board[4] === playerMarker && board[7] === playerMarker) {
            return true;
        }

        if(board[2] === playerMarker && board[5] === playerMarker && board[8] === playerMarker) {
            return true;
        }

        if(board[0] === playerMarker && board[4] === playerMarker && board[8] === playerMarker) {
            return true;
        }

        if(board[2] === playerMarker && board[4] === playerMarker && board[6] === playerMarker) {
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


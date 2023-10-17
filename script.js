//Gameboard Setup
let gameboard = {
    board: [],

    init: function() {
        this.cacheDom();
        players.addPlayerNames();
        players.createPlayer(players.playerNames[0], "x");
        players.createPlayer(players.playerNames[1], "o");
        this.addBoardTiles();
        this.render();
        players.showPlayerNames();
        this.resetBtn.addEventListener('click', gameplay.restartGame);
    },

    addBoardTiles: function () {
        for (let i = 0; i < 9; i++) {
            let tile = {
                clicked: false,
                text: '',
                boardRef: null,
            };
            this.board.push(tile);
        }
        return this.board;
    },
    
    cacheDom: function() {
        this.gameboardContainer = document.getElementById('gameboardContainer');
        this.ul = this.gameboardContainer.querySelector('#gameboardTiles');
        this.tileList = this.ul.querySelectorAll('.tile');
        this.player1 = document.getElementById('playerOne');
        this.player2 = document.getElementById('playerTwo');
        this.gameText = document.getElementById('gameInfo');
        this.resetBtn = this.gameboardContainer.querySelector('#resetBtn');
    },

    render: function() {
        const player = gameplay.playerSelection(); 

        while (this.ul.firstChild) {
            this.ul.removeChild(this.ul.firstChild);
        }

        this.board.forEach(tile => {
            const newListItem = document.createElement('li');
            newListItem.classList.add('tile');
            newListItem.textContent = tile.text;
            this.ul.appendChild(newListItem);

            if (newListItem.textContent === 'x') {
                newListItem.classList.add('redMarker');
            } else if (newListItem.textContent === 'o') {
                newListItem.classList.add('blueMarker');
            }

            tile.boardRef = newListItem;
            
            if (gameplay.isWinningMove) {
                console.log("Winner");
            } else if (!tile.clicked) {
                console.log("is not winner");
                gameplay.bindEvents(newListItem);
            }

        });
    },

    
}

//Player Creation
let players = {
    playerList: [],
    
    createPlayer: function(name, markerType) {
        const player = {
            name: name, 
            markerType: markerType,
        }
        this.playerList.push(player);
    },

    playerNames: [],

    addPlayerNames: function() {
        const player1 = prompt("Player 1, what is your name?");
        const player2 = prompt("Player 2, what is your name?");
        this.playerNames = [player1, player2];
    },

    showPlayerNames: function() {
        gameboard.player1.textContent = players.playerList[0].name;
        gameboard.player2.textContent = players.playerList[1].name;
    },
}

//Gameplay
let gameplay = {
    clicks: 0,
    isWinningMove: false,
    
    displayController: function(event) {
        const hoveredTile = event.target;
        const tile = gameboard.board.find(tile => tile.boardRef === hoveredTile);
        const player = this.playerSelection(); 
        const markerClass = player.markerType === 'x' ? 'redMarker' : 'blueMarker';
        
        tile.text = player.markerType;
        hoveredTile.classList.add(markerClass);
        hoveredTile.textContent = tile.text;
        
        hoveredTile.addEventListener('mouseout', function() {
            tile.text = '';
            hoveredTile.textContent = tile.text;
        });
    },
    
    markTile: function(event) {
        const clickedTile = event.target;
        const tile = gameboard.board.find(tile => tile.boardRef === clickedTile);
        const player = this.playerSelection();
        const markerClass = player.markerType === 'x' ? 'redMarker' : 'blueMarker';
        
        tile.text = player.markerType;
        clickedTile.classList.add(markerClass);
        clickedTile.textContent = tile.text;
        tile.clicked = true;
        
        const isWinningMove = gameplay.winningMove();
        this.clicks++;
        
        if (isWinningMove) {
            gameplay.isWinningMove = true;
            gameboard.gameText.textContent = `${player.name} Wins!`;
        } else if (this.clicks === 9 && !isWinningMove) {
            console.log("tie");
            gameboard.gameText.textContent = "It's a Tie!";
        }
        gameboard.render();
    },
    
    playerSelection: function() {
        if (this.clicks % 2 === 0) {
            return players.playerList[0];
        } else {
            return players.playerList[1];
        }
    },
    
    winningMove: function() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], 
            [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6],
        ];
        const player = gameplay.playerSelection();
        
        for (const condition of winConditions) {
            const [a, b, c] = condition;
            const board = gameboard.board;
            if (board[a].text === player.markerType &&
                board[b].text === player.markerType &&
                board[c].text === player.markerType) {
                    return true;
                }
            }
            return false; 
        },
        
        restartGame: function() {
            gameplay.clicks = 0;
            gameboard.cacheDom();
            gameboard.board = [];
            players.playerList = [];
            gameplay.isWinningMove = false;
            gameboard.gameText.textContent = '';
            gameboard.player1.textContent = '';
            gameboard.player2.textContent = '';
            gameboard.init();
        },
        
        bindEvents: function(emptyTile) {
            this.clickHandler = this.markTile.bind(this);
            this.mouseenterHandler = this.displayController.bind(this);

            emptyTile.addEventListener('click', this.clickHandler);
            emptyTile.addEventListener('mouseenter', this.mouseenterHandler);
        },
    }
    
    gameboard.init();
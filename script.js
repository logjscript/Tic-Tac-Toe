//Gameboard Setup
let gameboard = {
    board: [],

    init: async function() {
        this.cacheDom();
        this.addBoardTiles();
        this.render();
        this.newGameBtn.addEventListener('click', gameplay.restartGame);
        this.changePlayersBtn.addEventListener('click', players.changePlayers.bind(players));

        if (!players.playerNames[0] || !players.playerNames[1]) {
            await players.addPlayerNames();
            players.createPlayer(players.playerNames[0], "x");
            players.createPlayer(players.playerNames[1], "o");
            players.showPlayerNames();
        }
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
        this.container = document.querySelector('.container');
        this.ul = this.container.querySelector('.gameboardTiles');
        this.tileList = this.ul.querySelectorAll('.tile');
        this.player1 = document.querySelector('.player_one');
        this.player2 = document.querySelector('.player_two');
        this.gameText = document.querySelector('.game_info');
        this.newGameBtn = this.container.querySelector('.new_game_btn');
        this.changePlayersBtn = this.container.querySelector('.change_players_btn');
        this.customPrompt = document.querySelector('.custom_prompt_container');
        this.playersContainer = this.container.querySelector('.players_container');
    },

    render: function() {
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

    customPrompt: async function(data) {
        document.querySelector('.prompt_input').value = '';
        document.querySelector('.prompt_data').textContent = data;
        gameboard.customPrompt.classList.remove('hidden');
        gameboard.customPrompt.classList.add('flex');

        if (!gameboard.playersContainer.classList.contains('hidden')) {
            gameboard.playersContainer.classList.add('hidden');
        }

        return new Promise((resolve, reject) => {
            document.querySelector('.prompt_button').onclick = () => {
                resolve(document.querySelector('.prompt_input').value);
                gameboard.customPrompt.classList.remove('flex');
                gameboard.customPrompt.classList.add('hidden');
            }
        });
    },
    
    createPlayer: function(name, markerType) {
        const player = {
            name: name, 
            markerType: markerType,
        }
        this.playerList.push(player);
    },

    playerNames: [],

    addPlayerNames: async function() {
        try {
            let player1 = await this.customPrompt("Player 1, What is your name?");
            let player2 = await this.customPrompt("Player 2, What is your name?");

            let trimmedPlayer1 = player1.replace(/\s/g, '');
            let trimmedPlayer2 = player2.replace(/\s/g, '');

            if (!trimmedPlayer1) {
                if (!trimmedPlayer2) {
                    player2 = 'Player 2';
                }
                
                player1 = 'Player 1';
            }
    
            this.playerNames = [player1, player2];
        } catch (error) {
            console.log(error);
        }
    },

    changePlayers: async function () {

        this.playerNames = [];
        this.playerList = [];
        gameboard.player1.textContent = '';
        gameboard.player2.textContent = '';
        await players.addPlayerNames();
        players.createPlayer(players.playerNames[0], "x");
        players.createPlayer(players.playerNames[1], "o");
        players.showPlayerNames();
        gameplay.restartGame();
    },

    showPlayerNames: function() {
        gameboard.player1.textContent = players.playerList[0].name;
        gameboard.player2.textContent = players.playerList[1].name;

        if (gameboard.player1.textContent && gameboard.player2.textContent) {
            gameboard.playersContainer.classList.remove('hidden');
        }
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
            gameplay.isWinningMove = false;
            gameboard.gameText.textContent = '';
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
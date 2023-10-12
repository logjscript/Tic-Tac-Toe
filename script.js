//Gameboard Setup
let gameboard = {
    board: [],

    init: function() {
        this.cacheDom();
        players.createPlayer("Logan", "X");
        players.createPlayer("Bethany", "O");
        this.addBoardTiles();
        this.render();
        console.log(gameplay.clicks)
        gameplay.playerSelection();
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

            tile.boardRef = newListItem;

            if (tile.clicked !== true) {
                this.bindEvents(newListItem);
            }
        });
    },

    bindEvents: function(emptyTile) {
        emptyTile.addEventListener('click', gameplay.markTile.bind(gameplay));
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

}


//Gameplay
let gameplay = {
    clicks: 0,

    markTile: function(event) {
        const clickedTile = event.target;
        const tile = gameboard.board.find(tile => tile.boardRef === clickedTile);
        const player = this.playerSelection(); 

        tile.text = player.markerType;
        clickedTile.textContent = tile.text;
        tile.clicked = true;
        this.clicks++;
    },

    playerSelection: function() {
        if (this.clicks % 2 === 0) {
            return players.playerList[0];
        } else {
            return players.playerList[1];
        }
    },

    playTurn: function() {
        
        gameboard.render();
    },
}

gameboard.init();
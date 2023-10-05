let gameboard = {
    board: [],
    boardTiles: function () {
        for (let i = 0; i < 9; i++) {
            const newListItem = document.createElement('li');
            newListItem.classList.add('tile');
            newListItem.id = 'tileNumber' + [i];
            newListItem.textContent = '';

            let tile = {
                clicked: false,
                tileRef: newListItem,
            };
            this.ul.appendChild(newListItem);
            this.board.push(tile);
        }
        this.cacheDom();
        return this.board;
    },
    cacheDom: function() {
        this.gameboardContainer = document.getElementById('gameboardContainer');
        this.ul = this.gameboardContainer.querySelector('#gameboardTiles');
        this.tileList = this.ul.querySelectorAll('.tile');
    },
}

gameboard.cacheDom();
gameboard.boardTiles();
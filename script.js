document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    const pairSound = document.getElementById('pairSound');
    const winSound = document.getElementById('winSound');
    const restartText = document.getElementById('restart-text'); // Updated ID for the restart text

    const images = [];
    for (let i = 1; i <= 18; i++) {
        images.push({src: `.imgs/${i}A.png`, id: i});
        images.push({src: `.imgs/${i}B.png`, id: i});
    }

    let score = 0;
    let firstTile = null;
    let secondTile = null;
    let isChecking = false;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createBoard() {
        grid.innerHTML = ''; // Clear the existing grid
        shuffle(images);
        images.forEach(image => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.id = image.id;
            tile.innerHTML = `<img src="${image.src}" alt="Image ${image.id}">`;
            tile.addEventListener('click', flipTile);
            grid.appendChild(tile);
        });
        score = 0;
        scoreDisplay.textContent = score;
        firstTile = null;
        secondTile = null;
        isChecking = false;
    }

    function flipTile() {
        if (isChecking || this === firstTile || this.classList.contains('hidden')) return;
        
        this.querySelector('img').style.display = 'block';

        if (!firstTile) {
            firstTile = this;
        } else if (!secondTile) {
            secondTile = this;
            checkForMatch();
        }
    }

    function checkForMatch() {
        isChecking = true;
        const isMatch = firstTile.dataset.id === secondTile.dataset.id;
        if (isMatch) {
            score++;
            scoreDisplay.textContent = score;
            pairSound.play();
            setTimeout(() => {
                firstTile.classList.add('hidden');
                secondTile.classList.add('hidden');
                resetTiles();
                if (score === 18) {
                    setTimeout(() => winSound.play(), 500);
                }
            }, 500);
        } else {
            setTimeout(() => {
                firstTile.querySelector('img').style.display = 'none';
                secondTile.querySelector('img').style.display = 'none';
                resetTiles();
            }, 1000);
        }
    }

    function resetTiles() {
        firstTile = null;
        secondTile = null;
        isChecking = false;
    }

    restartText.addEventListener('click', createBoard); // Correctly add event listener to the restart text

    createBoard(); // Call function to create/recreate the game board when the page loads
});

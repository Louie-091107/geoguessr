document.addEventListener('DOMContentLoaded', function () {
    const flagImg = document.getElementById('flag-img');
    const guessInput = document.getElementById('guess-input');
    const submitBtn = document.getElementById('submit-btn');
    const resultMsg = document.getElementById('result');
    const timerDisplay = document.getElementById('time-left');
    const questionCounter = document.getElementById('question-counter');
    const leaderboard = document.getElementById('leaderboard');
    const scoreList = document.getElementById('score-list');
    const restartBtn = document.getElementById('restart-btn');
    const modeSelection = document.getElementById('mode-selection');
    const gameContainer = document.getElementById('game-container');

    let correctCountry = "";
    let score = 0;
    let questionNumber = 1;
    let timer;
    let timeLeft = 10;
    let modeTime = 10; // Default medium

    document.querySelectorAll('.mode-btn').forEach(button => {
        button.addEventListener('click', function () {
            const mode = this.dataset.mode;
            if (mode === 'easy') modeTime = 15;
            if (mode === 'medium') modeTime = 10;
            if (mode === 'hard') modeTime = 5;

            modeSelection.style.display = 'none';
            gameContainer.style.display = 'block';
            startGame();
        });
    });

    function startGame() {
        score = 0;
        questionNumber = 1;
        timeLeft = modeTime;
        leaderboard.style.display = 'none';
        fetchRandomFlag();
        startTimer();
    }

    function fetchRandomFlag() {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const randomIndex = Math.floor(Math.random() * data.length);
                flagImg.src = data[randomIndex].flags.png;
                correctCountry = data[randomIndex].name.common.toLowerCase();
            })
            .catch(error => console.log('Error fetching data:', error));
    }

    function startTimer() {
        timeLeft = modeTime;
        timerDisplay.textContent = timeLeft;
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                checkGuess(true);
            }
        }, 1000);
    }

    function checkGuess(timeOut = false) {
        const userGuess = guessInput.value.trim().toLowerCase();
        if (!timeOut && userGuess === correctCountry) {
            resultMsg.textContent = "Correct!";
            resultMsg.style.color = "green";
            score++;
        } else {
            resultMsg.textContent = `Incorrect! The answer was ${correctCountry}`;
            resultMsg.style.color = "red";
        }

        questionNumber++;
        if (questionNumber > 10) {
            endGame();
        } else {
            questionCounter.textContent = `Question ${questionNumber}/10`;
            guessInput.value = "";
            fetchRandomFlag();
            startTimer();
        }
    }

    function endGame() {
        clearInterval(timer);
        gameContainer.style.display = "none";
        leaderboard.style.display = "block";

        const listItem = document.createElement("li");
        listItem.textContent = `Score: ${score}/10`;
        scoreList.appendChild(listItem);
    }

    submitBtn.addEventListener('click', () => checkGuess(false));
    restartBtn.addEventListener('click', () => {
        modeSelection.style.display = "block";
        leaderboard.style.display = "none";
        scoreList.innerHTML = "";
    });
});

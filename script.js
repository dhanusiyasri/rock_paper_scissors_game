document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        playerScore: document.getElementById('player-score'),
        computerScore: document.getElementById('computer-score'),
        playerSelection: document.getElementById('player-selection').querySelector('.selection-icon'),
        computerSelection: document.getElementById('computer-selection').querySelector('.selection-icon'),
        resultDisplay: document.getElementById('result-display'),
        roundNumber: document.getElementById('round-number'),
        choiceBtns: document.querySelectorAll('.choice-btn'),
        resetBtn: document.getElementById('reset-btn'),
        howToPlayBtn: document.getElementById('how-to-play-btn'),
        resultModal: document.getElementById('result-modal'),
        howToPlayModal: document.getElementById('how-to-play-modal'),
        modalCloseBtn: document.getElementById('modal-close'),
        howToPlayCloseBtn: document.getElementById('how-to-play-close'),
        modalTitle: document.getElementById('modal-title'),
        modalMessage: document.getElementById('modal-message'),
        modalPlayerScore: document.getElementById('modal-player-score'),
        modalComputerScore: document.getElementById('modal-computer-score'),
        modalRoundsPlayed: document.getElementById('modal-rounds-played'),
        resultIcon: document.getElementById('result-icon'),
        confettiCanvas: document.getElementById('confetti-canvas')
    };

    // Audio elements (using HTML5 Audio)
    const sounds = {
        win: new Audio('win.mp3'),
        lose: new Audio('lose.mp3'),
        tie: new Audio('tie.wav'),
        click: new Audio('click.mp3')
    };

    // Game state
    const state = {
        playerScore: 0,
        computerScore: 0,
        roundNumber: 1,
        totalRounds: 10,
        maxWins: 5,
        gameActive: true,
        confetti: null
    };

    // Play sound
    function playSound(type) {
        try {
            sounds[type].currentTime = 0; // Rewind to start
            sounds[type].play().catch(e => console.log("Audio play failed:", e));
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    }

    // Initialize game
    function initGame() {
        state.playerScore = 0;
        state.computerScore = 0;
        state.roundNumber = 1;
        state.gameActive = true;
        
        updateScores();
        updateRound();
        clearSelections();
        elements.resultDisplay.textContent = 'Choose your weapon!';
        elements.resultDisplay.className = 'result-display';
        closeModal();
        
        // Clear confetti
        if (state.confetti) {
            state.confetti.clear();
            state.confetti = null;
        }
        
        // Reset background effects
        document.body.classList.remove('victory-effect', 'defeat-effect');
    }

    // Update score display
    function updateScores() {
        elements.playerScore.textContent = state.playerScore;
        elements.computerScore.textContent = state.computerScore;
    }

    // Update round display
    function updateRound() {
        elements.roundNumber.textContent = state.roundNumber;
    }

    // Clear selection displays
    function clearSelections() {
        elements.playerSelection.textContent = '?';
        elements.computerSelection.textContent = '?';
        elements.playerSelection.className = 'selection-icon';
        elements.computerSelection.className = 'selection-icon';
    }

    // Play a round
    function playRound(playerChoice) {
        if (!state.gameActive) return;
        
        playSound('click');
        
        // Computer makes random choice
        const choices = ['rock', 'paper', 'scissors'];
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        
        // Display choices with animation
        displayChoices(playerChoice, computerChoice);
        
        // Determine result after a delay to allow animations to play
        setTimeout(() => {
            determineWinner(playerChoice, computerChoice);
        }, 1000);
    }

    // Display player and computer choices
    function displayChoices(playerChoice, computerChoice) {
        // Player choice
        elements.playerSelection.textContent = getChoiceIcon(playerChoice);
        elements.playerSelection.classList.add(getChoiceClass(playerChoice), 'animate__bounceIn');
        
        // Computer choice (with slight delay)
        setTimeout(() => {
            elements.computerSelection.textContent = getChoiceIcon(computerChoice);
            elements.computerSelection.classList.add(getChoiceClass(computerChoice), 'animate__bounceIn');
        }, 300);
    }

    // Get icon for choice
    function getChoiceIcon(choice) {
        const icons = {
            rock: '✊',
            paper: '✋',
            scissors: '✌'
        };
        return icons[choice] || '?';
    }

    // Get CSS class for choice
    function getChoiceClass(choice) {
        return choice;
    }

    // Determine the winner
    function determineWinner(playerChoice, computerChoice) {
        let result;
        
        if (playerChoice === computerChoice) {
            result = 'tie';
        } else if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            result = 'win';
        } else {
            result = 'lose';
        }
        
        // Update game state
        updateGameState(result);
        
        // Display result
        displayResult(result, playerChoice, computerChoice);
        
        // Play appropriate sound
        playSound(result);
        
        // Check if game is over
        if (state.playerScore >= state.maxWins || 
            state.computerScore >= state.maxWins || 
            state.roundNumber >= state.totalRounds) {
            endGame();
        } else {
            state.roundNumber++;
            updateRound();
        }
    }

    // Update game state based on result
    function updateGameState(result) {
        if (result === 'win') {
            state.playerScore++;
        } else if (result === 'lose') {
            state.computerScore++;
        }
        updateScores();
    }

    // Display the result
    function displayResult(result, playerChoice, computerChoice) {
        const messages = {
            win: `You win! ${capitalizeFirstLetter(playerChoice)} beats ${computerChoice}`,
            lose: `You lose! ${capitalizeFirstLetter(computerChoice)} beats ${playerChoice}`,
            tie: "It's a tie!"
        };
        
        const resultClasses = {
            win: 'win',
            lose: 'lose',
            tie: 'tie'
        };
        
        elements.resultDisplay.textContent = messages[result];
        elements.resultDisplay.className = `result-display animate__animated animate__bounceIn ${resultClasses[result]}`;
    }

    // End the game
    function endGame() {
        state.gameActive = false;
        
        const outcomes = {
            win: {
                title: "Victory! 🏆",
                message: `You crushed the computer ${state.playerScore}-${state.computerScore}!`,
                icon: "🎉",
                animation: "animate__tada",
                sound: 'win',
                effect: 'victory-effect'
            },
            lose: {
                title: "Defeat! 💀",
                message: `The computer beat you ${state.playerScore}-${state.computerScore}...`,
                icon: "😢",
                animation: "animate__headShake",
                sound: 'lose',
                effect: 'defeat-effect'
            },
            tie: {
                title: "Draw! 🤝",
                message: `The battle ended in a tie ${state.playerScore}-${state.computerScore}`,
                icon: "🔄",
                animation: "animate__pulse",
                sound: 'tie'
            }
        };
        
        // Determine outcome
        let outcomeKey;
        if (state.playerScore > state.computerScore) {
            outcomeKey = 'win';
        } else if (state.computerScore > state.playerScore) {
            outcomeKey = 'lose';
        } else {
            outcomeKey = 'tie';
        }
        
        const outcome = outcomes[outcomeKey];
        
        // Update modal with results
        elements.resultIcon.textContent = outcome.icon;
        elements.resultIcon.className = `result-icon ${outcome.animation} animate__animated`;
        
        elements.modalTitle.textContent = outcome.title;
        elements.modalMessage.textContent = outcome.message;
        
        // Show detailed stats
        elements.modalPlayerScore.textContent = state.playerScore;
        elements.modalComputerScore.textContent = state.computerScore;
        elements.modalRoundsPlayed.textContent = state.roundNumber;
        
        // Show effects
        if (outcome.effect) {
            document.body.classList.add(outcome.effect);
        }
        
        // Play sound
        playSound(outcome.sound);
        
        // Show confetti for victory
        if (outcomeKey === 'win') {
            showConfetti();
        }
        
        // Open the modal with delay for better UX
        setTimeout(() => {
            openModal(elements.resultModal);
        }, 1000);
    }

    // Confetti effect for victories
    function showConfetti() {
        // Clear existing confetti if any
        if (state.confetti) {
            state.confetti.clear();
        }
        
        const confettiSettings = {
            target: 'confetti-canvas',
            max: 150,
            size: 1.5,
            animate: true,
            props: ['circle', 'square', 'triangle'],
            colors: [[255,0,0], [0,255,0], [0,0,255]],
            clock: 25,
            rotate: true,
            start_from_edge: true,
            respawn: true
        };
        
        state.confetti = new ConfettiGenerator(confettiSettings);
        state.confetti.render();
        
        // Clear confetti after 5 seconds
        setTimeout(() => {
            if (state.confetti) {
                state.confetti.clear();
                state.confetti = null;
            }
        }, 5000);
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Modal functions
    function openModal(modal) {
        modal.classList.add('active');
    }

    function closeModal() {
        elements.resultModal.classList.remove('active');
        elements.howToPlayModal.classList.remove('active');
    }

    // Event listeners
    elements.choiceBtns.forEach(button => {
        button.addEventListener('click', () => {
            if (state.gameActive) {
                const playerChoice = button.id;
                playRound(playerChoice);
            }
        });
    });

    elements.resetBtn.addEventListener('click', initGame);
    elements.howToPlayBtn.addEventListener('click', () => openModal(elements.howToPlayModal));
    elements.modalCloseBtn.addEventListener('click', initGame);
    elements.howToPlayCloseBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === elements.resultModal || e.target === elements.howToPlayModal) {
            closeModal();
        }
    });

    // Initialize game and audio
        initGame();
});

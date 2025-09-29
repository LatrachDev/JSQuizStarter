import { getInputType, handleAnswerChange, isCorrectAnswer } from "./multiselect.js";
import { loadQuestions, questions } from './loadQuestion.js';
import { renderUserStatsChart } from "./chart.js";

// Menu toggle functionality
const menu = document.getElementById("menu-toggle");
const nav = document.getElementById("nav-menu");
const closeBtn = document.getElementById("close-menu");

menu.addEventListener("click", () => {
  nav.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  nav.classList.remove("active");
});

const hero = document.getElementById("hero");
const welcome = document.getElementById("welcome");
const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");
const dashboardScreen = document.getElementById("dashboard-screen");

const dashboardBtn = document.getElementById("dashboard-btn");
let dashboardChart = null;

dashboardBtn.addEventListener("click", () => {
  showScreen("dashboard-screen");

  // Add delay to ensure screen is visible before rendering chart
  setTimeout(() => {
    const quizData = JSON.parse(localStorage.getItem("quizResults")) || [];
    const ctx = document.getElementById("userStatsChart").getContext("2d");

    // Destroy old chart instance to avoid duplicates
    if (dashboardChart) {
      dashboardChart.destroy();
    }

    dashboardChart = renderUserStatsChart(ctx, quizData);
  }, 100);
});

// buttons
const startBtn = document.getElementById("start");
const startQuizBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const checkBtn = document.getElementById("check-answer");

// Quiz elements
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const progressFill = document.getElementById("progress");
const userName = document.getElementById("userName");

const errorDiv = document.getElementById("name-error");

let gameStorage = {
  results: [],
  saveResult: function(playerName, score, totalQuestions, percentage, timestamp) {
    const result = {
      name: playerName,
      score: score,
      total: totalQuestions,
      percentage: percentage,
      date: timestamp
    };
    this.results.push(result);
    localStorage.setItem("quizResults", JSON.stringify(this.results)); 
  },
  getResults: function() {
    const stored = localStorage.getItem("quizResults");
    this.results = stored ? JSON.parse(stored) : [];
    return this.results;
  }
};

gameStorage.getResults();

startBtn.addEventListener("click", () => {
    hero.style.display = "none";
    welcome.style.display = "flex";
});

// username validation 
function validateName() {
    const name = userName.value.trim();
    const errorDiv = document.getElementById('name-error') || createErrorDiv();
    
    userName.classList.remove('error');
    errorDiv.style.display = 'none';
    
    if (name === '') {
        showNameError('Please enter your name to start the quiz!');
        return false;
    }
    
    if (name.length < 2) {
        showNameError('Name must be at least 2 characters long!');
        return false;
    }
    
    if (name.length > 30) {
        showNameError('Name must be less than 30 characters!');
        return false;
    }
    
    const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
    if (!nameRegex.test(name)) {
        showNameError('Name can only contain letters, spaces, hyphens, and apostrophes!');
        return false;
    }
    
    return true;
}

function showNameError(message) {
    const errorDiv = document.getElementById('name-error') || createErrorDiv();
    userName.classList.add('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    userName.focus();
}

// real-time validation.. clear fach ykon user typing
userName.addEventListener('input', () => {
    if (errorDiv && errorDiv.style.display !== 'none') {
        userName.classList.remove('error');
        errorDiv.style.display = 'none';
    }
});

startQuizBtn.addEventListener("click", () => {
    if (!validateName()) return; 
    
    const playerName = userName.value.trim();
    const categorySelected = document.getElementById("category");
    const category = categorySelected.value;

    if (!category) {
        showNameError('Category is required !')
        return;
    }
    
    welcome.style.display = "none";
    quizScreen.style.display = "block";
    loadQuestions(category);
});

userName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startQuizBtn.click();
    }
});

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let answerChecked = false;
let startTime;
let questionTimer = null;
let timeLeft = 5;

let reviewData = [];

function saveAnswer(questionText, correctAnswer, userAnswer) {
  reviewData.push({
    question: questionText,
    correct: correctAnswer,
    user: userAnswer
  });
}

document.getElementById("review-btn").addEventListener("click", () => {
  showScreen("review-screen");
  renderReview();
});

document.getElementById("back-to-results").addEventListener("click", () => {
  showScreen("results-screen");
});

export function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    startTime = Date.now(); 
    totalQuestionsSpan.textContent = questions.length;

    reviewData = []; // reset

    displayQuestion();
}

let selectedAnswerRef = { value: [] };

function displayQuestion() {
    const question = questions[currentQuestionIndex];
    selectedAnswerRef = { value: [] };
    
    // update question number and progress
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressFill.style.width = progressPercentage + '%';
    
    // display question text
    questionText.textContent = question.question;
    
    // clear previous answers
    answersContainer.innerHTML = '';
    selectedAnswer = [];
    answerChecked = false;
    nextBtn.disabled = true;
    checkBtn.disabled = true;

    // choose input type
    const inputType = getInputType(question);

    // create answer options
    question.options.forEach((option, index) => {
        const label = document.createElement("label");
        label.className = "answer-option";

        const input = document.createElement("input");
        input.type = inputType;
        input.name = "answer";
        input.value = index;
        
        input.addEventListener("change", () => {
          handleAnswerChange(answersContainer, input, question, checkBtn, selectedAnswerRef);
        });

        label.appendChild(input);
        label.append(" " + option);
        answersContainer.appendChild(label);
    });
    
    startQuestionTimer();
}

function selectAnswer(selectedElement, answerIndex) {
    // only allow selection if answer not checked
    if (answerChecked) return;

    // Stop the timer when user selects an answer
    clearInterval(questionTimer);
    updateTimerDisplay(0);

    // remove previous selection
    const allAnswers = document.querySelectorAll('.answer-option');
    allAnswers.forEach(answer => answer.classList.remove('selected'));
    
    selectedElement.classList.add('selected');
    selectedAnswer = answerIndex;

    nextBtn.disabled = true;
    checkBtn.disabled = false;
}

function checkAnswer() {
    if (answerChecked) return;

    clearInterval(questionTimer);
    updateTimerDisplay(0);

    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswers = currentQuestion.answer; 

    const allInputs = answersContainer.querySelectorAll("input");

    answerChecked = true;

    allInputs.forEach((input, i) => {
        const label = input.parentElement;
        if (correctAnswers.includes(i)) {
            label.classList.add("correct");
        }
        if (selectedAnswerRef.value.includes(i) && !correctAnswers.includes(i)) {
            label.classList.add("incorrect");
        }
        input.disabled = true;
    });

    const isCorrect = isCorrectAnswer(selectedAnswerRef.value, correctAnswers);

    if (isCorrect) {
        score++;
        document.getElementById("score").textContent = score;
    }

    const userAnswerText =
        selectedAnswerRef.value.length > 0
            ? selectedAnswerRef.value.map(i => currentQuestion.options[i]).join(", ")
            : "No answer";

    const correctAnswerText =
        correctAnswers.map(i => currentQuestion.options[i]).join(", ");

    saveAnswer(currentQuestion.question, correctAnswerText, userAnswerText);

    checkBtn.disabled = true;
    nextBtn.disabled = false;
}

checkBtn.addEventListener("click", checkAnswer);

function nextQuestion() {
    // clear any remaining timer
    clearInterval(questionTimer);
    
    currentQuestionIndex++;
    
    // check if quiz is finished
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

// Timer functions
function startQuestionTimer() {
    timeLeft = 5;
    updateTimerDisplay(timeLeft);
    
    questionTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(questionTimer);
            handleTimeUp();
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    let timerElement = document.getElementById('question-timer');
    if (!timerElement) {
        timerElement = document.createElement('div');
        timerElement.id = 'question-timer';
        timerElement.className = 'timer-display';
        
        const questionContainer = questionText.parentNode;
        questionContainer.insertBefore(timerElement, questionText.nextSibling);
    }
    
    if (seconds > 0) {
        timerElement.textContent = `Time left: ${seconds}s`;
        timerElement.className = 'timer-display' + (seconds <= 2 ? ' timer-warning' : '');
    } else {
        timerElement.textContent = 'Time\'s up!';
        timerElement.className = 'timer-display timer-expired';
    }
}

function handleTimeUp() {
    if (answerChecked) return;

    clearInterval(questionTimer);
    updateTimerDisplay(0);

    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswers = currentQuestion.answer;
    const allInputs = answersContainer.querySelectorAll("input");

    answerChecked = true;

    allInputs.forEach((input, i) => {
        const label = input.parentElement;
        if (correctAnswers.includes(i)) {
            label.classList.add("correct");
        } else {
            label.classList.add("incorrect");
        }
        input.disabled = true; 
    });

    // save as "No answer"
    const correctAnswerText =
      correctAnswers.map(i => currentQuestion.options[i]).join(", ");
    saveAnswer(currentQuestion.question, correctAnswerText, "No answer");

    // allow going to next question
    checkBtn.disabled = true;
    nextBtn.disabled = false;

    const timerElement = document.getElementById('question-timer');
    if (timerElement) {
        timerElement.textContent = 'Time\'s up! Correct answer highlighted.';
        timerElement.className = 'timer-display timer-expired';
    }
}

function showResults() {
    quizScreen.style.display = "none";
    resultsScreen.style.display = "block";
    
    const finalScoreElement = document.getElementById("final-score");
    finalScoreElement.textContent = score;
    
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const percentage = Math.round((score / questions.length) * 100);
    const playerName = userName.value.trim();
    
    // time taken
    const finalTimeElement = document.getElementById("final-time");
    if (finalTimeElement) {
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        finalTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    gameStorage.saveResult(playerName, score, questions.length, percentage, new Date().toISOString());
    
    // Show dashboard button after first quiz completion
    document.getElementById("dashboard-btn").classList.add("show");
    
    const feedbackElement = document.getElementById("feedback-message");
    let feedbackMessage = "";
    
    if (percentage >= 80) {
        feedbackMessage = `Excellent work, ${playerName}! You have a great understanding of the material.`;
    } else if (percentage >= 60) {
        feedbackMessage = `Good job, ${playerName}! You have a solid grasp of the concepts.`;
    } else if (percentage >= 40) {
        feedbackMessage = `Not bad, ${playerName}! Keep studying to improve your knowledge.`;
    } else {
        feedbackMessage = `Keep practicing, ${playerName}! Review the material and try again.`;
    }
    
    feedbackElement.textContent = feedbackMessage;
    
    console.log('Quiz Results:', {
        player: playerName,
        score: score,
        total: questions.length,
        percentage: percentage + '%',
        timeTaken: timeTaken + ' seconds'
    });
    
    const allResults = gameStorage.getResults();
    console.log('All stored results:', allResults);
}

nextBtn.addEventListener("click", nextQuestion);

const restartBtn = document.getElementById("restart-btn");
if (restartBtn) {
    restartBtn.addEventListener("click", () => {
        showScreen("welcome-screen");
        resultsScreen.style.display = "none";
        welcome.style.display = "block";

        const errorDiv = document.getElementById('name-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        userName.classList.remove('error');
    });
}

function displayStoredResults() {
    const results = gameStorage.getResults();
    console.log('=== Stored Quiz Results ===');
    results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.name}: ${result.score}/${result.total} (${result.percentage}%) - ${new Date(result.date).toLocaleDateString()}`);
    });
}

function renderReview() {
  const container = document.getElementById("review-container");
  container.innerHTML = "";

  reviewData.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("review-item");

    div.innerHTML = `
      <div class="review-question">Q${index + 1}: ${item.question}</div>
      <div class="review-answers">
        <div class="review-answer ${item.user === item.correct ? "user-answer" : "user-incorrect"}">
          Your answer: ${item.user}
        </div>
        <div class="review-answer correct-answer">
          Correct answer: ${item.correct}
        </div>
      </div>
    `;

    container.appendChild(div);
  });
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}


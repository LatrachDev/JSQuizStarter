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

let game = {
  results: [],
  saveResult: function(playerName, score, totalQuestions, percentage, timestamp) {
    const result = {
      name: playerName,
      score: score,
      toatl: totalQuestions,
      percentage: percentage,
      date: timestamp
    };
    this.results.push(result);

    localStorage.setItem('quizResults', JSON.stringify(this.results));
  },
  getResults: function() {
    return this.results;
  }
}

startBtn.addEventListener("click", () => {
    hero.style.display = "none";
    welcome.style.display = "flex";

    const savedName = localStorage.getItem('playerName');
    if (savedName) {
        userName.value = savedName;
    }
    console.log(savedName);
    
});

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

startQuizBtn.addEventListener("click", () => {
    welcome.style.display = "none";
    quizScreen.style.display = "block";
    startQuiz();
});

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let answerChecked = false;
let startTime;

const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hyper Tool Multi Language"
    ],
    answer: 0
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Colorful Style Sheets"
    ],
    answer: 1
  },
  // {
  //   question: "Which JavaScript method is used to write into an alert box?",
  //   options: [
  //     "alert()",
  //     "prompt()",
  //     "confirm()",
  //     "message()"
  //   ],
  //   answer: 0
  // },
  // {
  //   question: "What is the correct way to create a function in JavaScript?",
  //   options: [
  //     "function = myFunction() {}",
  //     "function myFunction() {}",
  //     "create myFunction() {}",
  //     "def myFunction() {}"
  //   ],
  //   answer: 1
  // },
  // {
  //   question: "How do you write 'Hello World' in an alert box?",
  //   options: [
  //     "alertBox('Hello World');",
  //     "alert('Hello World');",
  //     "msg('Hello World');",
  //     "popup('Hello World');"
  //   ],
  //   answer: 1
  // },
  // {
  //   question: "Which event occurs when the user clicks on an HTML element?",
  //   options: [
  //     "onchange",
  //     "onclick",
  //     "onmouseclick",
  //     "onmouseover"
  //   ],
  //   answer: 1
  // },
  // {
  //   question: "How do you declare a JavaScript variable?",
  //   options: [
  //     "variable carName;",
  //     "v carName;",
  //     "var carName;",
  //     "declare carName;"
  //   ],
  //   answer: 2
  // },
  // {
  //   question: "Which operator is used to assign a value to a variable?",
  //   options: [
  //     "*",
  //     "=",
  //     "x",
  //     "-"
  //   ],
  //   answer: 1
  // },
  // {
  //   question: "What will the following code return: Boolean(10 > 9)",
  //   options: [
  //     "true",
  //     "false",
  //     "NaN",
  //     "undefined"
  //   ],
  //   answer: 0
  // },
  // {
  //   question: "How can you add a comment in JavaScript?",
  //   options: [
  //     "'This is a comment",
  //     "<!--This is a comment-->",
  //     "//This is a comment",
  //     "/*This is a comment*/"
  //   ],
  //   answer: 2
  // },
  // {
  //   question: "What is the correct way to write a JavaScript array?",
  //   options: [
  //     "var colors = 'red', 'green', 'blue'",
  //     "var colors = (1:'red', 2:'green', 3:'blue')",
  //     "var colors = ['red', 'green', 'blue']",
  //     "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')"
  //   ],
  //   answer: 2
  // },
  // {
  //   question: "How do you round the number 7.25 to the nearest integer?",
  //   options: [
  //     "Math.round(7.25)",
  //     "round(7.25)",
  //     "Math.rnd(7.25)",
  //     "rnd(7.25)"
  //   ],
  //   answer: 0
  // }
];

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    startTime = Date.now();
    totalQuestionsSpan.textContent = questions.length;
    displayQuestion();
}

function displayQuestion() {


    const question = questions[currentQuestionIndex];
    
    // update question number and progress
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressFill.style.width = progressPercentage + '%';
    
    // display question text
    questionText.textContent = question.question;
    
    // clear previous answers
    answersContainer.innerHTML = '';
    selectedAnswer = null;
    answerChecked = false;
    nextBtn.disabled = true;
    checkBtn.disabled = true;
    
    // create answer options
    question.options.forEach((option, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        answerDiv.textContent = option;
        answerDiv.setAttribute('data-index', index);
        
        answerDiv.addEventListener('click', () => selectAnswer(answerDiv, index));
        
        answersContainer.appendChild(answerDiv);
    });

}

// handle answer selection
function selectAnswer(selectedElement, answerIndex) {

    // only allow selection ila kan answer not checked
    if (answerChecked) return;

    // Remove previous selection
    const allAnswers = document.querySelectorAll('.answer-option');
    allAnswers.forEach(answer => answer.classList.remove('selected'));
    
    selectedElement.classList.add('selected');
    selectedAnswer = answerIndex;

    nextBtn.disabled = true;
    checkBtn.disabled = false;
}


   
function checkAnswer() {
    if (selectedAnswer === null || answerChecked) return;

    const currentQuestion = questions[currentQuestionIndex];
    const allAnswers = document.querySelectorAll('.answer-option');

    answerChecked = true; // to prevent further selection

    // green for correct
    allAnswers[currentQuestion.answer].classList.add('correct');

    if (selectedAnswer !== currentQuestion.answer) {
        allAnswers[selectedAnswer].classList.add('incorrect');
    } else {
        score++;
    }

    allAnswers.forEach(answer => {
        answer.style.pointerEvents = "none";
    });

    checkBtn.disabled = true;
    nextBtn.disabled = false;
}

checkBtn.addEventListener("click", checkAnswer);
  


function nextQuestion() {

    currentQuestionIndex++;

    // setInterval (()=> 
    // {
    //   currentQuestionIndex++;
    // },3000);

    // check if quiz is finished
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showResults();
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
    
    // update time display
    const finalTimeElement = document.getElementById("final-time");
    if (finalTimeElement) {
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        finalTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    game.saveResult(playerName, score, questions.length, percentage, new Date().toISOString());
    
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
    
    const allResults = game.getResults();
    console.log('All stored results:', allResults);
}

nextBtn.addEventListener("click", nextQuestion);

const restartBtn = document.getElementById("restart-btn");
if (restartBtn) {
    restartBtn.addEventListener("click", () => {
        resultsScreen.style.display = "none";
        hero.style.display = "flex";
    });
}
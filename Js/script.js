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

// Quiz elements
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const progressFill = document.getElementById("progress");

startBtn.addEventListener("click", () => {
    hero.style.display = "none";
    welcome.style.display = "flex";
});

startQuizBtn.addEventListener("click", () => {
    welcome.style.display = "none";
    quizScreen.style.display = "block";
    startQuiz();
});

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

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
  {
    question: "Which JavaScript method is used to write into an alert box?",
    options: [
      "alert()",
      "prompt()",
      "confirm()",
      "message()"
    ],
    answer: 0
  },
  {
    question: "What is the correct way to create a function in JavaScript?",
    options: [
      "function = myFunction() {}",
      "function myFunction() {}",
      "create myFunction() {}",
      "def myFunction() {}"
    ],
    answer: 1
  },
  {
    question: "How do you write 'Hello World' in an alert box?",
    options: [
      "alertBox('Hello World');",
      "alert('Hello World');",
      "msg('Hello World');",
      "popup('Hello World');"
    ],
    answer: 1
  },
  {
    question: "Which event occurs when the user clicks on an HTML element?",
    options: [
      "onchange",
      "onclick",
      "onmouseclick",
      "onmouseover"
    ],
    answer: 1
  },
  {
    question: "How do you declare a JavaScript variable?",
    options: [
      "variable carName;",
      "v carName;",
      "var carName;",
      "declare carName;"
    ],
    answer: 2
  },
  {
    question: "Which operator is used to assign a value to a variable?",
    options: [
      "*",
      "=",
      "x",
      "-"
    ],
    answer: 1
  },
  {
    question: "What will the following code return: Boolean(10 > 9)",
    options: [
      "true",
      "false",
      "NaN",
      "undefined"
    ],
    answer: 0
  },
  {
    question: "How can you add a comment in JavaScript?",
    options: [
      "'This is a comment",
      "<!--This is a comment-->",
      "//This is a comment",
      "/*This is a comment*/"
    ],
    answer: 2
  },
  {
    question: "What is the correct way to write a JavaScript array?",
    options: [
      "var colors = 'red', 'green', 'blue'",
      "var colors = (1:'red', 2:'green', 3:'blue')",
      "var colors = ['red', 'green', 'blue']",
      "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')"
    ],
    answer: 2
  },
  {
    question: "How do you round the number 7.25 to the nearest integer?",
    options: [
      "Math.round(7.25)",
      "round(7.25)",
      "Math.rnd(7.25)",
      "rnd(7.25)"
    ],
    answer: 0
  }
];

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
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
    nextBtn.disabled = true;
    
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
    // Remove previous selection
    const allAnswers = document.querySelectorAll('.answer-option');
    allAnswers.forEach(answer => answer.classList.remove('selected'));
    
    selectedElement.classList.add('selected');
    selectedAnswer = answerIndex;

    nextBtn.disabled = false;
}

function nextQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    
    // check if answer is correct
    if (selectedAnswer === currentQuestion.answer) {
        score++;
        // console.log(score);
    }
    
    currentQuestionIndex++;
    
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
    
    // display feedback message
    const feedbackElement = document.getElementById("feedback-message");
    const percentage = (score / questions.length) * 100;
    
    if (percentage >= 80) {
        feedbackElement.textContent = "Excellent! You have a great understanding of the material.";
    } else if (percentage >= 60) {
        feedbackElement.textContent = "Good job! You have a solid grasp of the concepts.";
    } else if (percentage >= 40) {
        feedbackElement.textContent = "Not bad! Keep studying to improve your knowledge.";
    } else {
        feedbackElement.textContent = "Keep practicing! Review the material and try again.";
    }
}

nextBtn.addEventListener("click", nextQuestion);

const restartBtn = document.getElementById("restart-btn");
if (restartBtn) {
    restartBtn.addEventListener("click", () => {
        resultsScreen.style.display = "none";
        hero.style.display = "flex";
    });
}
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

// Buttons
const startBtn = document.getElementById("start"); 
const startQuizBtn = document.getElementById("start-btn"); 
const nextBtn = document.getElementById("next-btn");

startBtn.addEventListener("click", () => {
    hero.style.display = "none";
    welcome.style.display = "flex";
})

startQuizBtn.addEventListener("click", () => {
    welcome.style.display = "none";
    quizScreen.style.display = "block";
})

// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

// Define questions array
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
      "**This is a comment**"
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


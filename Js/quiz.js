let questions = [];
let categorySelected = "";

async function loadQuestions(category) {
    console.log('dkhlna hna');
    
    const result = await fetch('./Js/questions.json');
    console.log('drna fetch');
    console.log('result : ', result);
    const data = await result.json();
    console.log('bghina nchofo data');
    questions = data[category];
    console.log('data : ', data);
    
    startQuiz();
}
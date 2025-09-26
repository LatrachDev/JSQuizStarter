export function getInputType(question) {
  return question.multiSelect ? "checkbox" : "radio";
}

export function handleAnswerChange(answersContainer, input, question, checkBtn, selectedAnswerRef) {
  if (question.multiSelect) {
    selectedAnswerRef.value = Array.from(
      answersContainer.querySelectorAll("input:checked")
    ).map(el => parseInt(el.value));
  } else {
    selectedAnswerRef.value = [parseInt(input.value)];
  }
  checkBtn.disabled = selectedAnswerRef.value.length === 0;
}

export function isCorrectAnswer(selectedAnswer, correctAnswers) {
  return (
    selectedAnswer.length === correctAnswers.length &&
    selectedAnswer.every(idx => correctAnswers.includes(idx))
  );
}
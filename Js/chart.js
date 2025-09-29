export function renderUserStatsChart(ctx, quizData) {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js not loaded');
    return null;
  }

  if (!quizData || quizData.length === 0) {
    return new Chart(ctx, {
      type: "bar",
      data: {
        labels: ['No Data'],
        datasets: [{ label: "No Data", data: [0], backgroundColor: "#ccc" }]
      },
      options: { responsive: true }
    });
  }

  // show each quiz attempt separately
  const labels = quizData.map((entry, index) => `${entry.name} #${index + 1}`);
  const scores = quizData.map(entry => entry.score);

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { 
          label: "Total Score", 
          data: scores, 
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}
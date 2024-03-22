const name = document.getElementById("name");
const goal = document.getElementById("goal");
const addGoalButton = document.getElementById("add-goal");
const progressBars = document.getElementById("progress-bars");
const amount = document.getElementById("amount-earned");

const goalsList = [];
let totalGoal = 0;

amount.addEventListener("input", () => {
  if (amount.value < 0) {
    amount.value = 0;
  }
  refreshProgressBars();
});

addGoalButton.addEventListener("click", () => {
  const goalValue = goal.value;
  const nameValue = name.value;
  if (!goalValue || !nameValue) {
    return;
  }
  addProgressBar(nameValue, goalValue);
  goal.value = "";
  name.value = "";
});

const getProgressBarTemplate = ({ name, goal }) => {
  const index = progressBars.childElementCount;
  const progressBarString = `
    <div class="progress-bar" id="progress-${index}">
        <span class="title">${name} <button onclick="removeGoal(
    ${index}
  )">Remove goal</button></span>
        <div class="bar">
          <div class="progress"></div>
          <span>0</span>
          <span class="percent">0.00%</span>
          <span class="goal">${goal}</span>
        </div>
      </div>
    `;

  return progressBarString;
};

const addProgressBar = (name, goal) => {
  totalGoal += parseInt(goal);
  goalsList.push({ name, goal, progress: 0 });
  updateProgressBars();
};

const updateProgressBars = () => {
  goalsList.sort((a, b) => b.goal - a.goal);

  // don't delete the first progress bar
  const firstProgressBar = progressBars.children[0];
  firstProgressBar.getElementsByClassName("goal")[0].innerText = totalGoal;
  progressBars.innerHTML = "";
  progressBars.appendChild(firstProgressBar);
  for (const progressBar of goalsList) {
    const progressBarTemplate = getProgressBarTemplate(progressBar);
    progressBars.innerHTML += progressBarTemplate;
  }
  refreshProgressBars();
};

const removeGoal = (index) => {
  const goal = goalsList[index - 1];
  totalGoal -= parseInt(goal.goal);
  goalsList.splice(index - 1, 1);
  updateProgressBars();
};

const refreshProgressBars = () => {
  if (goalsList.length === 0) return;

  let remainingAmount = amount.value;

  [...goalsList].reverse().forEach((goal, index) => {
    if (remainingAmount >= 0) {
      const progress = (remainingAmount / goal.goal) * 100;
      remainingAmount -= goal.goal;

      setProgress(goalsList.length - index, Math.min(100, progress));
    }
  });
  //   set the total progress
  const totalProgress = (amount.value / totalGoal) * 100;
  setProgress("total", Math.min(100, totalProgress));
};

const setProgress = (index, progress) => {
  const progressBar = document.getElementById(`progress-${index}`);
  const bar = progressBar.getElementsByClassName("bar")[0];
  const progressElement = bar.getElementsByClassName("progress")[0];
  const percentElement = bar.getElementsByClassName("percent")[0];
  progressElement.style.width = `${progress.toFixed(2)}%`;
  progress === 100
    ? progressElement.classList.add("complete")
    : progressElement.classList.remove("complete");
  percentElement.innerText = `${progress.toFixed(2)}%`;
};

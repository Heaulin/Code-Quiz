let questions = [{
  title: "What does CSS stand for?",
  choices: ["Coloring Style Sheet", "Cascading Style Sheet", "Crazy Color Sheet", "Cheating Style Sheet"],
  answer: "Cascading Style Sheet"
},
{
  title: "What does HTML stand for?",
  choices: ["HyperText Markup Language", "HypeText Markup Language", "HyperTest Markup Language", "HyperTest Makeup Language"],
  answer: "HyperText Markup Language"
},
{
  title: "What is 5*25?",
  choices: ["135", "145", "165", "125"],
  answer: "125"
},
{
  title: "Is Javascript a case-sensitive language?",
  choices: ["Yes", "No"],
  answer: "Yes"
},
]

let score = 0
let currentQuestion = -1;
let timeLeft = ''
let timer = ''
let startQuizBtn = document.getElementById("startBtn")
let viewScoresNavBtn = document.getElementById('viewScoresNavBtn')
let quizTimer = document.getElementById("timeLeft")
let quizBody = document.getElementById('quizBody')


function startQuiz() {

  timeLeft = 60;
  quizTimer.innerHTML = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    quizTimer.innerHTML = `${timeLeft}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
  nextQuestion()
}

function endQuiz() {

  clearInterval(timer);
  let questionsLength = questions.length

  let quizContentResults = `
  <form>
    <div class="form-group">
      <h2>Quiz Finished!</h2>
      <p> You answered ${score} correctly out of a total of ${questionsLength} questions</p>
      <input type="text" class="form-control" id="initials" placeholder="Initials here...">
      <button type="button" class="btn submitScoreBtn">Submit your score!</button>
    </div>
  </form>
 `;
  quizBody.innerHTML = quizContentResults;
}

function submitScore() {


  if (document.getElementById('initials').value === '') {
    alert("Enter initials to submit score")
    return false;
  } else {
    let savedHighScores = JSON.parse(localStorage.getItem('savedHighScores')) || [];
    let userInitials = document.getElementById('initials').value
    let currentHighScore = {
      name: userInitials,
      score: score
    };
    savedHighScores.push(currentHighScore);
    localStorage.setItem("savedHighScores", JSON.stringify(savedHighScores))


    localStorage.setItem('quizscore', score)
    localStorage.setItem('quizscoreInitials', document.getElementById('initials').value)
  }

  viewScoreBoard();
}


function resetQuiz() {

  clearInterval(timer);
  score = 0;
  currentQuestion = -1;
  timeLeft = 0;
  timer = null;

  document.getElementById("timeLeft").innerHTML = timeLeft;

  let quizBodyStart = `
  <div id="quizBody">
   <h1>
    Welcome to the Quiz!
   </h1>
   <button type="button" class="btn startBtnReplay">Start</button>
  </div>
  `
  quizBody.innerHTML = quizBodyStart
}

function viewScoreBoard() {

  let scorecontent = `
  <div class="container highScoreContainer">
    <div class= "row">
      <div class="col-sm">
        <strong>Initials</strong>
        <div id="highScoreInitialsDisplay"></div>
      </div>
      <div class="col-sm">
        <strong>Score</strong>
        <div id="highScoreScoreDisplay"></div>
      </div>
    </div>
  </div>
  <hr>
  <button type="button" class="btn clearScoreBtn">Clear Scores!</button>
  <button type="button" class="btn resetQuizBtn">Retake Quiz!</button>
  <hr>
  `

  quizBody.innerHTML = scorecontent

  highScoreInitialsDisplay = document.getElementById('highScoreInitialsDisplay')
  highScoreScoreDisplay = document.getElementById('highScoreScoreDisplay')

  highScoreInitialsDisplay.innerHTML = '';
  highScoreScoreDisplay.innerHTML = '';

  let scoreBoard = JSON.parse(localStorage.getItem("savedHighScores")) || []
  for (let i = 0; i < scoreBoard.length; i++) {
    let nameSpan = document.createElement('li')
    let newScore = document.createElement('li')

    nameSpan.textContent = scoreBoard[i].name;
    newScore.textContent = scoreBoard[i].score;

    highScoreInitialsDisplay.appendChild(nameSpan);
    highScoreScoreDisplay.appendChild(newScore)
  }
}

function clearScoreBoard() {
  window.localStorage.clear()
  viewScoreBoard();
  localStorage.setItem('quizscoreInitials', '')
  localStorage.setItem('quizscore', '')
}

function incorrect() {
  timeLeft -= 10;
  alert("Minus 10 secs")
  nextQuestion();
}

function correct() {
  score += 1;
  alert("Correct!")
  nextQuestion();
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion > questions.length - 1) {
    endQuiz();
    return;
  }

  let quizContentQuestions = `<h2>` + questions[currentQuestion].title + `</h2>`

  for (let i = 0; i < questions[currentQuestion].choices.length; i++) {
    let buttonCycle = "<button onclick=\"[ANSWER]\">[QUESTION_CHOICE]</button>";
    buttonCycle = buttonCycle.replace("[QUESTION_CHOICE]", questions[currentQuestion].choices[i]);

    if (questions[currentQuestion].choices[i] === questions[currentQuestion].answer) {
      buttonCycle = buttonCycle.replace("[ANSWER]", "correct()")
    } else {
      buttonCycle = buttonCycle.replace("[ANSWER]", "incorrect()");
    }
    quizContentQuestions += buttonCycle
  }

  quizBody.innerHTML = quizContentQuestions
}

startQuizBtn.addEventListener('click', event => {
  event.preventDefault()
  startQuiz();
})

viewScoresNavBtn.addEventListener('click', event => {
  event.preventDefault()
  viewScoreBoard();
})

document.addEventListener('click', event => {

  if (event.target.classList.contains('submitScoreBtn')) {
    submitScore();
  } else if (event.target.classList.contains('clearScoreBtn')) {
    clearScoreBoard();
  } else if (event.target.classList.contains('resetQuizBtn')) {
    resetQuiz();
  } else if (event.target.classList.contains('startBtnReplay')) {
    startQuiz();
  }
})
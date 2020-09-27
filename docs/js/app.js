// let leaderboardPage = document.getElementById('leaderboardPage')
// let firstPage;
// let openCards = []
// let openedCards = []
// let card = document.getElementsByClassName("card");
// let cards = [...card];
// let matchedCard = document.getElementsByClassName("match");
let scoreData = [];
let game = document.getElementById("game");
let moves = 0;
let map = {};
let p = {};
let iv;
let k;
let ft;
let mmo = 0;
let ms = 0;
let mmi = 0;
let mh = 0;
var email = sessionStorage.getItem("email");
var name = sessionStorage.getItem("name");
var score;
let instructions, deck, movesCounter;
// // @description game timer
let second = 0,
  minute = 0;
hour = 0;
var timer;
let interval;

let brands = [
  "artengo",
  "domyos",
  "geologic",
  "kalenji",
  "kipsta",
  "nabaiji",
  "oxelo",
  "perfly",
  "pongori",
  "quechua",
  "subea",
  "tarmak"
];
// let brands = ['artengo', 'domyos', 'kalenji']
const QUESTIONS = [
  "Decathlon creates, designs, and manufactures his own products and has 40 brands each dedicated to one sport.",
  "You can enjoy free shipping if you buy online at decathlon.my",
  "Created in 1976 in the northern part of France, Decathlon is now established in 57 countries, including Malaysia since 2016 with 5 stores."
];
let keys = {
  artengo: [6, 4, 2],
  domyos: [2, 3, 6],
  geologic: [3, 5, 1],
  kalenji: [3, 5, 6],
  kipsta: [1, 6, 4],
  nabaiji: [1, 5, 2],
  oxelo: [2, 4, 6],
  perfly: [5, 4, 2],
  pongori: [6, 1, 3],
  quechua: [3, 2, 6],
  subea: [6, 5, 3],
  tarmak: [1, 5, 3]
};

let questionGame,
  matchGame,
  brandLogo,
  instruction,
  selectedBrand,
  matchNextButton,
  questionNextButton;
let gameCompleted = false;
let correctAnswer = []; // array to hold correct answer selected by user in matching game
let questionLeft = 3; // indicator how many question left for matching game
let questionAnswer = ""; // hold answer for yes/no question
function startTimer() {
  interval = setInterval(async function () {
    timer.innerHTML = minute + "mins " + second + "secs";
    second++;
    ms = cryptoEncrypt(parseInt(cryptoDecrypt(ms), 10) + 1);

    if (second == 60) {
      minute++;
      mmi = cryptoEncrypt(parseInt(cryptoDecrypt(mmi), 10) + 1);
      ms = cryptoEncrypt(0);
      second = 0;
    }
    if (minute == 60) {
      mh = cryptoEncrypt(parseInt(cryptoDecrypt(mh), 10) + 1);
      mmi = cryptoEncrypt(0);
      hour++;
      minute = 0;
    }
  }, 1000);
}
function cryptoEncrypt(string) {
  return CryptoJS.AES.encrypt(
    string.toString(),
    "7c3f7400993e1c1e6ef80f0906c0966f"
  ).toString();
}

function cryptoDecrypt(string) {
  return CryptoJS.AES.decrypt(
    string,
    "7c3f7400993e1c1e6ef80f0906c0966f"
  ).toString(CryptoJS.enc.Utf8);
}

function getBrand() {
  if (questionLeft > 0) {
    const index = Math.floor(Math.random() * brands.length);
    return brands.splice(index, 1)[0];
  } else {
    return false;
  }
}

document.body.onload = async function () {
  // SET RESPONSIVE
  let max700 = window.matchMedia("(max-width: 700px)");
  let max1000 = window.matchMedia("(max-width: 1000px)");
  if (max700.matches || max1000.matches) {
    let content = document.getElementById("content");
    let dropdownFooter = document.getElementById("dropdownFooter");
    let footer = document.getElementById("bottomFooter");
    footer.style.visibility = "hidden";
    content.style.height = `${window.innerHeight - 196}px`;
    dropdownFooter.style.textAlign = "center";
    dropdownFooter.style.color = "white";
    dropdownFooter.style.height = "150px";
    dropdownFooter.style.visibility = "visible";
  }

  matchGame = document.getElementById("matchGame");
  questionGame = document.getElementById("questionGame");
  brandLogo = document.getElementById("brandLogo");
  instruction = document.getElementById("instruction");
  matchNextButton = document.getElementById("matchGameNext");
  questionNextButton = document.getElementById("questionGameNext");

  initGame();
  resetGame();
};

async function initGame() {
  // encrypt moves and timer data
  mmo = await cryptoEncrypt(mmo.toString());
  ms = await cryptoEncrypt(ms.toString());
  mmi = await cryptoEncrypt(mmi.toString());
  mh = await cryptoEncrypt(mh.toString());

  // reset moves
  moves = 0;

  //reset timer
  second = 0;
  minute = 0;
  hour = 0;
  timer = document.querySelector(".timer");
  timer.innerHTML = "0 mins 0 secs";
  clearInterval(interval);
}

function resetGame() {
  correctAnswer = [];
  selectedBrand = getBrand();
  matchNextButton.style.opacity = 0.2;
  questionNextButton.style.opacity = 0.2;

  if (selectedBrand) {
    brandLogo.src = `./raw/${selectedBrand}/brand-logo.png`;
    instruction.innerHTML = `MATCH THREE (3) IMAGES WITH THE BRAND ${selectedBrand.toUpperCase()}`;
    for (let i = 1; i < 7; i++) {
      const div = document.getElementById(`image${i}`);
      if (div.childNodes.length > 1) {
        div.removeChild(div.childNodes[1]);
      }
      let img = document.createElement("img");
      img.src = `./raw/${selectedBrand}/${i}.png`;
      img.classList.add("img-fluid");
      img.classList.add("gameImg");
      img.setAttribute("type", i.toString());
      img.addEventListener("click", imageSelected);
      div.appendChild(img);
    }
  } else {
    const selectedQuestion =
      QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    let questionElement = document.getElementById("question");
    questionElement.innerHTML = selectedQuestion;
    brandLogo.src = `./raw/guess-logo.png`;
    brandLogo.style.height = "150px";
    questionGame.style.visibility = "visible";
    matchGame.style.visibility = "hidden";
  }
}
function next() {
  if (gameCompleted) {
    congratulations();
  } else {
    if (correctAnswer.length === 3) {
      resetGame();
    }
  }
}

function questionButtonClick(t, bool) {
  // console.log(t)
  if (bool === true) {
    t.style.borderColor = "blue";

    if (questionAnswer === "") {
      questionAnswer = "true";
    }
  } else {
    t.style.borderColor = "orange";
    if (questionAnswer === "") {
      questionAnswer = "false";
    }
  }
  questionNextButton.style.opacity = 1;
  gameCompleted = true;
}
function imageSelected() {
  if (moves === 0) {
    second = 0;
    minute = 0;
    hour = 0;
    startTimer();
  }
  moves++;
  if (
    correctAnswer.length != 3 &&
    !correctAnswer.includes(parseInt(this.getAttribute("type"), 10))
  ) {
    if (keys[selectedBrand].includes(parseInt(this.getAttribute("type"), 10))) {
      this.style.borderColor = "blue";
      correctAnswer.push(parseInt(this.getAttribute("type"), 10));
      if (correctAnswer.length === 3) {
        matchNextButton.style.opacity = 1;
        questionLeft--;
      }
    } else {
      this.style.borderColor = "orange";
    }
  }
}

function congratulations() {
  if (gameCompleted) {
    clearInterval(interval);
    ft = timer.innerHTML;
    // score = moves * ((hour * 3600) + (minute * 60) + second)
    saveScore();
    // window.location.href = `congratulations.html?timer=${ft}`;
  }
}

async function saveScore() {
  var xhttp = new XMLHttpRequest();
  xhttp.open(
    "POST",
    "https://broonie.ematicsolutions.com/api/elixus/deca",
    true
  );
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(
    JSON.stringify({
      z: mh,
      y: mmi,
      x: ms,
      w: mmo,
      name,
      email,
      answer: questionAnswer
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      window.location.href = `congratulations.html?timer=${ft}`;
    }
  };
}

//////////////////////////////////////////////////////////////////////////////////////

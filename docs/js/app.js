// let leaderboardPage = document.getElementById('leaderboardPage')
// let firstPage;
// let openCards = []
// let openedCards = []
// let card = document.getElementsByClassName("card");
// let cards = [...card];
// let matchedCard = document.getElementsByClassName("match");
let scoreData = [];
let game = document.getElementById('game');
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
var email = sessionStorage.getItem('email');
var name = sessionStorage.getItem('name');
var score;
let instructions, deck, movesCounter;
// // @description game timer
let second = 0,
  minute = 0;
hour = 0;
var timer;
let interval;

let brands = [
  'FITNESS CARDIO',
  'CYCLING',
  'HIKING',
  'BADMINTON',
  'BODY BUILDING',
  'PILATES',
  'SKATE',
  'SWIMMING',
  'YOGA',
  'RUNNING',
  'CROSS TRAINING',
  'SCOOTER'
];
// let brands = ['artengo', 'domyos', 'kalenji']
const QUESTIONS = [
//  'Decathlon Petaling Jaya is the latest Decathlon Store that was opened in late December 2020.',
  'The new Fresh & Black innovation for Quechua tents is made to ensure campers are able to enjoy their good night sleep with a cooler temperature and excellent ventilation system.',
  "Easybreath is the world's first full-face snorkeling mask, innovated by Decathlon where you can enjoy the panoramic field of vision and breathe underwater just like on dry land."
];
let keys = {
  'FITNESS CARDIO': [2, 3, 4],
  'CYCLING': [2, 4, 5],
  'HIKING': [3, 4, 6],
  'BADMINTON': [1, 2, 5],
  'BODY BUILDING': [1, 4, 5],
  'PILATES': [1, 3, 6],
  'SKATE': [2, 4, 6],
  'SWIMMING': [3, 4, 6],
   'YOGA': [1, 2, 5],
  'RUNNING': [2, 4, 5],
  'CROSS TRAINING': [3, 4, 6],
  'SCOOTER': [1, 3, 6]
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
let questionAnswer = ''; // hold answer for yes/no question
function startTimer() {
  interval = setInterval(async function () {
    timer.innerHTML = minute + 'mins ' + second + 'secs';
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
    '7c3f7400993e1c1e6ef80f0906c0966f'
  ).toString();
}

function cryptoDecrypt(string) {
  return CryptoJS.AES.decrypt(
    string,
    '7c3f7400993e1c1e6ef80f0906c0966f'
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

window.onload = async function () {
  // SET RESPONSIVE
  let max700 = window.matchMedia('(max-width: 700px)');
  let max1000 = window.matchMedia('(max-width: 1000px)');
  if (max700.matches || max1000.matches) {
    // let dropdownFooter = document.getElementById('dropdownFooter');
    // let footer = document.getElementById('bottomFooter');
    // footer.style.visibility = 'hidden';
    // dropdownFooter.style.textAlign = 'center';
    // dropdownFooter.style.color = 'white';
    // dropdownFooter.style.height = '150px';
    // dropdownFooter.style.visibility = 'visible';
  }

  matchGame = document.getElementById('matchGame');
  questionGame = document.getElementById('questionGame');
  covers = document.getElementById('covers');
  brandLogo = document.getElementById('brandLogo');
  instruction = document.getElementById('instruction');
  matchNextButton = document.getElementById('matchGameNext');
  questionNextButton = document.getElementById('questionGameNext');

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
  timer = document.querySelector('.timer');
  timer.innerHTML = '0 mins 0 secs';
  clearInterval(interval);
}

function resetGame() {
  correctAnswer = [];
  selectedBrand = getBrand();
  matchNextButton.style.opacity = 0.2;
  questionNextButton.style.opacity = 0.2;

  if (selectedBrand) {
    instruction.innerHTML = `WHAT ARE THREE (3) ESSENTIELS FOR`;
    brandLogo.innerHTML = `${selectedBrand.toUpperCase()}`;
    for (let i = 1; i < 7; i++) {
      const div = document.getElementById(`image${i}`);
      if (div.childNodes.length > 1) {
        div.removeChild(div.childNodes[1]);
      }
      let img = document.getElementById(`image${i}`);
      img.src = `./raw/new-site/${selectedBrand}/${i}.png`;
      img.setAttribute('type', i.toString());
            img.setAttribute('style', "background: " +`url('./raw/new-site/${selectedBrand}/${i}.jpg') no-repeat padding-box;`+"background-size: cover;background-position-x: center;height: 139px; margin: 30px");

      img.addEventListener('click', imageSelected);
      
    }
  } else {
    const selectedQuestion =
      QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    let questionElement = document.getElementById('question');
    questionElement.innerHTML = selectedQuestion;
    brandLogo.style.height = '150px';
    questionGame.style.visibility = 'visible';
    matchGame.style.visibility = 'hidden';
    instruction.style.visibility = 'hidden';
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
  if (bool === true) {
    t.style.background ="linear-gradient( rgba(35, 169, 66, 0.48), rgba(35, 169, 66, 0.48) ), url('./raw/new-site/true.png";
    
    t.style.border= 'none';
    
    if (questionAnswer === '') {
      questionAnswer = 'true';
    }
  } else {
    t.style.background ="linear-gradient( rgba(227, 44, 38, 0.48), rgba(227, 44, 38, 0.48) ), url('./raw/new-site/false.png";
      t.style.height= '135px';
    t.style.width= '159px';
    t.style.border= 'none';
    t.style.backgroundSize= '159px 135px';


    if (questionAnswer === '') {
      questionAnswer = 'false';
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
    !correctAnswer.includes(parseInt(this.getAttribute('type'), 10))
  ) {
    if (keys[selectedBrand].includes(parseInt(this.getAttribute('type'), 10))) {

      
      this.style.background ="no-repeat linear-gradient( rgba(35, 169, 66, 0.48), rgba(35, 169, 66, 0.48) ), url('./raw/new-site/"+selectedBrand+"/"+this.getAttribute('type')+'.jpg';
      this.style.height= '139px';

    this.style.border= 'none';
    this.style.backgroundSize= 'cover';
    this.style.backgroundPositionX= 'center';
    
      correctAnswer.push(parseInt(this.getAttribute('type'), 10));
      if (correctAnswer.length === 3) {
        matchNextButton.style.opacity = 1;
        questionLeft--;
      }
    } else {
      this.style.opacity = '0.8';
      this.style.background ="linear-gradient( rgba(227, 44, 38, 0.48), rgba(227, 44, 38, 0.48) ), url('./raw/new-site/"+selectedBrand+"/"+this.getAttribute('type')+'.jpg';
            this.style.height= '139px';

    this.style.border= 'none';
    this.style.backgroundSize= 'cover';
    this.style.backgroundPositionX= 'center';

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
  if (name && email) {
    var xhttp = new XMLHttpRequest();
    xhttp.open(
      'POST',
      'https://broonie.ematicsolutions.com/api/elixus/deca',
      true
    );
    xhttp.setRequestHeader('Content-Type', 'application/json');
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
}

//////////////////////////////////////////////////////////////////////////////////////

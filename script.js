const gameContainer = document.getElementById("game");

let bestTime = document.getElementById("bestTime");
let saveTime= 0;

const buttonContainer = document.getElementById("restartButton");
const savedBest = JSON.parse(localStorage.getItem('bestTime')) || [];
bestTime.innerText = savedBest;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add('card');
    newDiv.setAttribute('data-color', color);
    newDiv.setAttribute('data-revealed', 'false');

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);

  }
}

function createRestartButton(){ 
  const newButton = document.createElement("button");
 
  newButton.setAttribute('id','restartGame');
  newButton.setAttribute('class', 'item item-7');
  newButton.textContent= "Play again?";


  newButton.addEventListener("click", function(){
    location.reload();
  });
  buttonContainer.append(newButton);

}


let revealedCount = 0;
let activeCard = null;
let awaitingEndofMove = false;
let cardCount = COLORS.length;

//retrieve button
const startGame =document.getElementById("startGame");

let time = document.getElementById("currentTime");
let count = 1;

function myTimer() {
  if(revealedCount === cardCount){
    clearInterval;
} else{
  time.innerText = count;
  count++
}};
  
//event listener for button
startGame.addEventListener('click', function(){
  console.log("Start Button clicked!");
  createDivsForColors(shuffledColors);
  var button = document.getElementById('startGame');
  button.parentNode.removeChild(button);
  let timer = setInterval(myTimer, 1000);
}
);

// TODO: Implement this function!
function handleCardClick(event) {
  let currentCard = event;
  const revealed = event.target.getAttribute('data-revealed');
// if your turn is started you click the same card, nothing happens
  if(awaitingEndofMove || revealed === "true"|| currentCard === activeCard){
    return;
  }
  // otherwise, set card Color to data-color
  let flipColor = currentCard.target.getAttribute('data-color');
  
  currentCard.target.style.background = flipColor;
  //if the active card has not been set, set it to current target, return
  if (!activeCard) {
    activeCard = event.target;
    return;
  }
  const colorToMatch = activeCard.getAttribute('data-color');
//if your color to match is the same as current color, set reveal status to true, clear active card, add to count, end turn
  if(colorToMatch === flipColor){
    activeCard.setAttribute("data-revealed", 'true')
    currentCard.target.setAttribute('data-revealed', 'true');
    awaitingEndOfMove = false;
    activeCard = null;
    revealedCount += 2;
//if the number of revealed cards = all cards, you win!
    if(revealedCount === cardCount){
      alert("You win!");
      createRestartButton();
      console.log("current time", currentTime);
      console.log("best time", bestTime);
      if(bestTime.innerText === ''){
        bestTime = currentTime;
        console.log("fresh time!");
        let saveTime = bestTime.innerText;
        localStorage.setItem('bestTime', JSON.stringify(saveTime));
      }
      if(currentTime.innerText >= bestTime.innerText){
        console.log("current time is worse or same");
        return;
      } 
      else if(currentTime.innerText < bestTime.innerText){
        bestTime.innerText = currentTime.innerText;
        console.log('besttime 2', bestTime);
        let saveTime = bestTime.innerText;
        localStorage.setItem('bestTime', JSON.stringify(saveTime));
      }
    }
    return;
  } //if your card colors DONT match,
  //if you've clicked and it isnt the same card, your turn is "open"
  awaitingEndofMove = true;
  //AND if waiting for end of move, wait a second reset colors, reset waiting status
  setTimeout(() => {
    currentCard.target.style.background = null;
    activeCard.style.background = null;
    awaitingEndofMove = false;
    activeCard = null;
  }, 1000);
  return currentCard;
};

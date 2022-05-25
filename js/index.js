//start button
document.getElementById('start-button').addEventListener('click', () => {
  startGame();
});

//canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let timeCountDown = null;

//Level 1 map array set up 1 =>boundry 2=>box 3=> target 4=> player
const map = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 4, 0, 0, 1],
  [1, 2, 0, 1, 1, 1, 1],
  [1, 0, 0, 1, 0, 0, 1],
  [1, 3, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
];
const mapLevel2 = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 2, 3, 1],
  [1, 3, 2, 4, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 1],
  [1, 0, 0, 3, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

let player = null;
// initial an boundries(walls) array
const boundries = [];
// initial an boxes array
const boxes = [];
// initial an targets array
const targets = [];

function startGame() {
  // function to create map

  createMap(map);
  // function to draw game pieces on the map
  drawMap();
  timeCount();
  // function to play the sound
  play();
}
class Boundry {
  //object literal
  constructor({ position }) {
    this.position = position;
    this.width = 50;
    this.height = 50;
    this.woodLogImage = new Image();
    this.woodLogImage.src = 'images/log.png';
  }
  //draw boundries (woodlogs) on canvas
  draw() {
    ctx.drawImage(
      this.woodLogImage,
      this.position.x * 70,
      this.position.y * 70,
      this.woodLogImage.width,
      this.woodLogImage.height
    );
  }
}
//function to check if there any gamepices on the new positions
const isGamePieceAt = (gamePiece, newX, newY) => {
  if (gamePiece.position.x === newX && gamePiece.position.y === newY) {
    return true;
  }

  return false;
};

//create a player & the movements
class Player {
  //object literal
  constructor({ position, speed }) {
    this.position = position;
    this.speed = speed;
    this.monoImage = new Image();
    this.monoImage.src = 'images/cat.png';
  }
  draw() {
    ctx.drawImage(
      this.monoImage,
      this.position.x * 70,
      this.position.y * 70,
      this.monoImage.width,
      this.monoImage.height
    );
  }

  canMoveRight() {
    // check if there is a boundry which is at the new position

    const newX = player.position.x + 1;
    const newY = player.position.y;
    // check whether any boundry position matches newX, newY
    let collide = boundries.some((boundry) =>
      isGamePieceAt(boundry, newX, newY)
    );

    if (collide) {
      return false;
    }
    // check if there is a box
    // if there is a box, can that box move?
    let collidingBox = boxes.find((box) => isGamePieceAt(box, newX, newY));
    if (collidingBox) {
      collidingBox.moveRight();
      return collidingBox.canBoxMove();
    }
    //if there is no walls & boxes
    return true;
  }

  moveRight() {
    if (!this.canMoveRight()) {
      return;
    } else {
      this.position.x += this.speed.x;
    }
  }
  canMoveLeft() {
    // check if there is a boundry which is at the new position
    const newX = player.position.x - 1;
    const newY = player.position.y;
    let collide = boundries.some((boundry) =>
      isGamePieceAt(boundry, newX, newY)
    );

    if (collide) {
      return false;
    }
    // check if there is a box
    // if there is a box, can that box move?
    let collidingBox = boxes.find((box) => isGamePieceAt(box, newX, newY));
    if (collidingBox) {
      collidingBox.moveLeft();
      return collidingBox.canBoxMove();
    }

    return true;
  }

  moveLeft() {
    if (!this.canMoveLeft()) {
      return;
    } else {
      this.position.x -= this.speed.x;
    }
  }
  canMoveUp() {
    // check if there is a boundry which is at the new position
    const newX = player.position.x;
    const newY = player.position.y - 1;
    let collide = boundries.some((boundry) =>
      isGamePieceAt(boundry, newX, newY)
    );

    if (collide) {
      return false;
    }
    // check if there is a box
    // if there is a box, can that box move?
    let collidingBox = boxes.find((box) => isGamePieceAt(box, newX, newY));
    if (collidingBox) {
      collidingBox.moveUp();
      return collidingBox.canBoxMove();
    }

    return true;
  }

  moveUp() {
    if (!this.canMoveUp()) {
      return;
    } else {
      this.position.y -= this.speed.y;
    }
  }
  canMoveDown() {
    // check if there is a boundry which is at the new position
    const newX = player.position.x;
    const newY = player.position.y + 1;

    let collide = boundries.some((boundry) =>
      isGamePieceAt(boundry, newX, newY)
    );

    if (collide) {
      return false;
    }
    // check if there is a box
    // if there is a box, can that box move?
    let collidingBox = boxes.find((box) => isGamePieceAt(box, newX, newY));
    if (collidingBox) {
      collidingBox.moveDown();
      return collidingBox.canBoxMove();
    }

    return true;
  }

  moveDown() {
    if (!this.canMoveDown()) {
      return;
    } else {
      this.position.y += this.speed.y;
    }
  }
  move(direction) {
    switch (direction) {
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      case 'ArrowUp':
        this.moveUp();
        break;
    }
  }
}

class Boxes {
  //object literal
  constructor({ position, speed }) {
    this.position = position;
    this.speed = speed;
    this.ballImage = new Image();
    this.ballImage.src = 'images/laine.png';
    this.isOnTarget = false;
  }
  draw() {
    ctx.drawImage(
      this.ballImage,
      this.position.x * 70,
      this.position.y * 70,
      this.ballImage.width,
      this.ballImage.height
    );
  }

  //function to check if the box is collided with boundry
  canBoxMove(newX, newY) {
    // check if there is a boundry which is at the new position

    let collide = false;
    // check whether any boundry position matches newX, newY
    boundries.forEach((boundry) => {
      if (boundry.position.x === newX && boundry.position.y === newY) {
        console.log('bump', newX, newY);
        collide = true;
      }
    });
    return collide;
  }
  //function to check if the box is on the target
  isBoxOnTarget() {
    const newX = this.position.x;
    const newY = this.position.y;
    let win = false;

    targets.forEach((target) => {
      if (target.position.x === newX && target.position.y === newY) {
        // this.count++;
        this.isOnTarget = true;
        win = true;
      }
    });

    return win;
  }

  moveRight() {
    const newX = this.position.x + 1;
    const newY = this.position.y;
    if (this.canBoxMove(newX, newY)) {
      return;
    } else {
      this.position.x = newX;
    }

    this.isAllBoxOnTarget();
  }

  moveLeft() {
    const newX = this.position.x - 1;
    const newY = this.position.y;
    if (this.canBoxMove(newX, newY)) {
      return;
    } else {
      this.position.x = newX;
    }

    this.isAllBoxOnTarget();
  }

  moveUp() {
    const newX = this.position.x;
    const newY = this.position.y - 1;
    if (this.canBoxMove(newX, newY)) {
      return;
    } else {
      this.position.y = newY;
    }

    this.isAllBoxOnTarget();
  }

  moveDown() {
    const newX = this.position.x;
    const newY = this.position.y + 1;
    if (this.canBoxMove(newX, newY)) {
      return;
    } else {
      this.position.y = newY;
    }
    this.isAllBoxOnTarget();
  }

  isAllBoxOnTarget() {
    this.isBoxOnTarget();
    //check win condition: if all the boxes in the map is on the targets
    const win = boxes.every((box) => box.isOnTarget);
    // if ture, pop up windows & stop the timer
    if (win) {
      toggleModal();

      closeModal();
      clearInterval(timeCountDown);
      removeEventListner();
    }
  }
}

class Target {
  //object literal
  constructor({ position }) {
    this.radius = 20;
    this.position = position;
    this.targetImage = new Image();
    this.targetImage.src = '../images/target.png';
  }
  draw() {
    ctx.beginPath();

    ctx.drawImage(
      this.targetImage,
      this.position.x * 70,
      this.position.y * 70,
      this.targetImage.width,
      this.targetImage.height
    );
  }
}

// function to create map
function createMap(map) {
  boxes.splice(0, boxes.length);
  boundries.splice(0, boundries.length);
  targets.splice(0, targets.length);
  player = null;

  // loop map arrray to add boundry by numbers
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      if (map[i][j] === 1) {
        boundries.push(
          new Boundry({
            position: {
              x: j,
              y: i,
            },
          })
        );
      } else if (map[i][j] === 2) {
        // push box to array
        boxes.push(
          new Boxes({
            position: {
              x: j,
              y: i,
            },
            speed: {
              x: 1,
              y: 1,
            },
          })
        );
      } else if (map[i][j] === 3) {
        // push target to array
        targets.push(
          new Target({
            position: {
              x: j,
              y: i,
            },
          })
        );
      } else if (map[i][j] === 4) {
        //draw player
        player = new Player({
          position: {
            x: j,
            y: i,
          },
          speed: {
            x: 1,
            y: 1,
          },
        });
      }
    }
  }
}
// function to draw game pieces on the map
function drawMap() {
  boundries.forEach((boundry) => {
    boundry.woodLogImage.addEventListener('load', () => {
      boundry.draw();
    });
  });
  targets.forEach((target) => {
    target.targetImage.addEventListener('load', () => {
      target.draw();
    });
  });
  boxes.forEach((box) => {
    box.ballImage.addEventListener('load', () => {
      box.draw();
    });
  });
  player.monoImage.addEventListener('load', () => {
    player.draw();
  });
}

function removeEventListner() {
  document.removeEventListener('keydown', addListner, true);
}
// function to re-draw game pieces on the map once player moves
function reDrawMap() {
  document.addEventListener('keydown', addListner, true);
}
function addListner(event) {
  console.log('code', event);

  player.move(event.code);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.draw();
  targets.forEach((target) => {
    target.draw();
  });

  boxes.forEach((box) => {
    box.draw();
  });

  boundries.forEach((boundry) => {
    boundry.draw();
  });
}
reDrawMap();

//function to restart the game
function restart() {
  console.log('function', ctx.clearRect);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  clearInterval(timeCountDown);
  startGame();
  //   toggleModal();
}

//AddEventListener for restart button
document.getElementById('restart-button').addEventListener('click', () => {
  restart();
  toggleloseModal();
});
//function to go to the next level
function goNextLevel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  toggleModal();
  clearInterval(timeCountDown);
  createMap(mapLevel2);
  drawMap();
  timeCount();
}
document.getElementById('nextlevel-button').addEventListener('click', () => {
  //   toggleloseModal();

  reDrawMap();
  goNextLevel();
  play();
});

// function playGameSound() {
//   const audio = new Audio('../sound/gamesound.mp3');
//   let sound = false;
//   if (sound) {
//     audio.play();
//     sound = true;
//   } else {
//     audio.pause();
//     sound = false;
//   }
// }
// document.getElementById('music-button').addEventListener('click', () => {
//   playGameSound();
// });

//function to play or stop the sound
const audio = document.getElementById('audio');
let sound = false;

function play() {
  if (sound === false) {
    audio.play();
    sound = true;
  } else {
    audio.pause();
    sound = false;
  }
}
//function for the countdown timer

const timerGame = document.querySelector('h1');
function timeCount() {
  let timeSecond = 10;
  timerGame.innerHTML = `00:${timeSecond}`;
  timeCountDown = setInterval(() => {
    timeSecond--;
    displayTimeTwoDigit(timeSecond);
    if (timeSecond <= 0 || timeSecond < 1) {
      clearInterval(timeCountDown);
      toggleloseModal();
    }
  }, 1000);
}
function displayTimeTwoDigit(second) {
  const min = Math.floor(second / 60);
  const sec = Math.floor(second % 60);
  timerGame.innerHTML = `${min < 10 ? '0' : ''}${min}:${
    sec < 10 ? '0' : ''
  }${sec}`;
}

function toggleModal() {
  const modal = document.querySelector('.modal');
  //   const myCanvas = document.querySelector('#canvas');
  modal.classList.toggle('hidden');
}
function toggleloseModal() {
  const modalLose = document.querySelector('.modal-lose');

  modalLose.classList.toggle('hidden');
}

function closeModal() {
  const close = document.querySelector('.close-button');
  close.addEventListener('click', () => {
    toggleModal();
  });
}
function closeloseModal() {
  const closeLose = document.querySelector('.close-lose-button');
  closeLose.addEventListener('click', () => {
    toggleloseModal();
  });
}
//Pop up for information button
const modalInfo = document.querySelector('.modal-info');
const information = document.querySelector('#information-button');
information.addEventListener('click', () => {
  modalInfo.classList.toggle('hidden');
});
//change between first page to game
const myFirstPage = document.querySelector('.containerFirstPage');
const myGamePage = document.querySelector('.containerGame');
const myCat = document.querySelector('#cat');
myCat.addEventListener('click', () => {
  myFirstPage.classList.toggle('hidden');
  myGamePage.classList.toggle('hidden');
});

document.getElementById('start-button').addEventListener('click', () => {
  startGame();
});
//canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let player = null;
//Level 1 map array set up 1 =>boundry 2=>box 3=> target 4=> player
const map = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 4, 0, 0, 1],
  [1, 2, 0, 1, 1, 1, 1],
  [1, 0, 0, 1, 0, 0, 0],
  [1, 3, 0, 1, 0, 0, 0],
  [1, 0, 0, 1, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0],
];
console.log(map);

// initial an boundries(walls) array
const boundries = [];
// initial an boxes array
const boxes = [];
// initial an targets array
const targets = [];
// initial an player array
// const player = [];

function startGame() {
  // control player by keyboard

  boundries.forEach((boundry) => {
    boundry.woodLogImage.addEventListener('load', () => {
      boundry.draw();
    });
  });
  boxes.forEach((box) => {
    box.ballImage.addEventListener('load', () => {
      box.draw();
    });
    player.draw();
  });
  document.addEventListener('keydown', (event) => {
    console.log('code', event.code);

    player.move(event.code);
  });
  //clear the canvas and redraw the items
  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.draw();

    boxes.forEach((box) => {
      box.draw();
    });

    targets.forEach((target) => {
      target.draw();
    });
    //draw all the walls
    boundries.forEach((boundry) => {
      boundry.draw();
    });
  }, 100 / 60);
}
class Boundry {
  //object literal??
  constructor({ position }) {
    this.position = position;
    this.width = 50;
    this.height = 50;
    this.woodLogImage = new Image();
    this.woodLogImage.src = 'images/log.png';
  }
  //draw boundries (woodlogs) on canvas
  draw() {
    // ctx.fillStyle = 'grey';
    // ctx.fillRect(
    //   this.position.x * 50,
    //   this.position.y * 50,
    //   this.width,
    //   this.height
    // );

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
  //object literal??
  constructor({ position, speed }) {
    this.position = position;
    this.speed = speed;

    this.radius = 25;
    this.monoImage = new Image();
    this.monoImage.src = 'images/cat.png';
  }
  draw() {
    // ctx.fillStyle = 'orange';
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    // ctx.beginPath();
    // ctx.fillStyle = 'orange';
    // ctx.arc(
    //   this.position.x * 50 + 25,
    //   this.position.y * 50 + 25,
    //   this.radius,
    //   0,
    //   2 * Math.PI
    // );
    // ctx.fill();
    // ctx.closePath();
    ctx.drawImage(
      this.monoImage,
      this.position.x * 70,
      this.position.y * 70,
      this.monoImage.width,
      this.monoImage.height
    );
  }

  canMoveRight() {
    // check boundries doesn't have a boundry which is at the new position
    //(1,4)
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

    return true;
  }
  //   isBoxRight() {
  //     // check if box is collided with the new position
  //     const newX = player.position.x + 1;
  //     const newY = player.position.y;
  //     let isBox = false;
  //     boxes.forEach((box) => {
  //       if (box.position.x === newX && box.position.y === newY) {
  //         console.log('bump', box.position.x, box.position.y, newX, newY);
  //         isBox = true;
  //         box.moveRight();
  //       }
  //       console.log('Collided box?', isBox);
  //     });
  //     // return a boolean
  //     return isBox;
  //   }

  moveRight() {
    if (!this.canMoveRight()) {
      return;

      // } else if (this.isBoxRight()) {
      //   this.position.x += this.speed.x;
      // }
    } else {
      this.position.x += this.speed.x;
    }
  }
  canMoveLeft() {
    // check boundries doesn't have a boundry which is at the new position
    //(1,2)
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
      collidingBox.moveDown();
      return collidingBox.canBoxMove();
    }

    return true;
  }
  // if (collidingBox) {
  //   if (collidingBox.canBoxMove(newX - 1, newY)) {
  //     collidingBox.moveLeft();
  //     return true;
  //   }
  //   return false;
  // }

  // // no box, no wall => can move
  // return true;
  //   }
  //   isBoxLeft() {
  //     // check if box is collided with the new position
  //     const newX = player.position.x - 1;
  //     const newY = player.position.y;
  //     let isBox = false;
  //     boxes.forEach((box) => {
  //       if (box.position.x === newX && box.position.y === newY) {
  //         console.log('bump', box.position.x, box.position.y, newX, newY);
  //         isBox = true;
  //         box.moveLeft();
  //       }
  //       console.log('Collided box?', isBox);
  //     });
  //     // return a boolean
  //     return isBox;
  //   }
  moveLeft() {
    if (!this.canMoveLeft()) {
      return;

      // } else if (this.isBoxLeft()) {
      //   this.position.x -= this.speed.x;
    } else {
      this.position.x -= this.speed.x;
    }
  }
  canMoveUp() {
    // check boundries doesn't have a boundry which is at the new position
    //(0,3)
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
  //   isBoxUp() {
  //     // check if box is collided with the new position
  //     const newX = player.position.x;
  //     const newY = player.position.y - 1;
  //     let isBox = false;
  //     boxes.forEach((box) => {
  //       if (box.position.x === newX && box.position.y === newY) {
  //         console.log('bump', box.position.x, box.position.y, newX, newY);
  //         isBox = true;
  //         box.moveUp();
  //       }
  //       console.log('Collided box?', isBox);
  //     });
  //     // return a boolean
  //     return isBox;
  //   }
  moveUp() {
    if (!this.canMoveUp()) {
      return;

      // } else if (this.isBoxUp()) {
      //   this.position.y -= this.speed.y;
    } else {
      this.position.y -= this.speed.y;
    }
  }
  canMoveDown() {
    // check boundries doesn't have a boundry which is at the new position
    //(2,3)
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
  //   isBoxDown() {
  //     // check if box is collided with the new position
  //     const newX = player.position.x;
  //     const newY = player.position.y + 1;
  //     let isBox = false;
  //     boxes.forEach((box) => {
  //       if (box.position.x === newX && box.position.y === newY) {
  //         console.log('bump', box.position.x, box.position.y, newX, newY);
  //         isBox = true;
  //         box.moveDown();
  //       }
  //       console.log('Collided box?', isBox);
  //     });
  //     // return a boolean
  //     return isBox;
  //   }
  moveDown() {
    if (!this.canMoveDown()) {
      return;
    }
    // } else if (this.isBoxDown()) {
    //   box.moveDown();
    //   this.position.y += this.speed.y;
    else {
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
  //object literal??
  constructor({ position, speed }) {
    // this.position.x = x;
    // this.position.y = y;
    // this.speed.x = x;
    // this.speed.y = y
    // this.height = 50;
    // this.width = 50;
    this.position = position;
    this.speed = speed;
    this.ballImage = new Image();
    this.ballImage.src = 'images/laine.png';
    // this.draw();
  }
  draw() {
    // ctx.fillStyle = 'brown';
    // ctx.fillRect(
    //   this.position.x * 50,
    //   this.position.y * 50,
    //   this.width,
    //   this.height
    // );
    ctx.drawImage(
      this.ballImage,
      this.position.x * 70,
      this.position.y * 70,
      this.ballImage.width,
      this.ballImage.height
    );
  }
  //   canBoxMoveRight() {
  //     // check boundries doesn't have a boundry which is at the new position
  //     //(1,4)
  //     const newX = this.position.x + 1;
  //     const newY = this.position.y;
  //     let collide = false;
  //     // check whether any boundry position matches newX, newY
  //     boundries.forEach((boundry) => {
  //       if (boundry.position.x === newX && boundry.position.y === newY) {
  //         console.log('bump', newX, newY);
  //         collide = true;
  //         // player.moveRight();
  //       }
  //       console.log('Box Collided?', collide);
  //     });
  //     return collide;
  //   }
  //Win the game
  //   isBoxOnTargetRight() {
  //     // check boundries doesn't have a boundry which is at the new position
  //     //(1,4)
  //     const newX = this.position.x + 1;
  //     const newY = this.position.y;
  //     let win = false;
  //     // check whether any boundry position matches newX, newY
  //     targets.forEach((target) => {
  //       if (target.position.x === newX && target.position.y === newY) {
  //         win = true;
  //       }
  //     });
  //     return win;
  //   }
  toggleModal() {
    const modal = document.querySelector('.modal');
    const close = document.querySelector('.close-buttton');
    modal.classList.toggle('hidden');
  }
  closeModal() {
    const close = document.querySelector('.close-buttton');
    close.addEventListener('click', toggleModal);
  }

  moveRight() {
    const newX = this.position.x + 1;
    const newY = this.position.y;
    if (this.canBoxMove(newX, newY)) {
      return;
    } else {
      this.position.x = newY;
    }
    if (this.isBoxOnTarget()) {
      console.log('You Win');
      this.toggleModal();
    }
  }
  //   canBoxMoveLeft() {
  //     // check boundries doesn't have a boundry which is at the new position
  //     //(1,4)
  //     const newX = this.position.x - 1;
  //     const newY = this.position.y;
  //     let collide = false;
  //     // check whether any boundry position matches newX, newY
  //     boundries.forEach((boundry) => {
  //       if (boundry.position.x === newX && boundry.position.y === newY) {
  //         console.log('bump', newX, newY);
  //         collide = true;
  //         // player.moveLeft();
  //       }
  //       console.log('Box Collided?', collide);
  //     });
  //     return collide;
  //   }
  //   isBoxOnTargetLeft() {
  //     // check boundries doesn't have a boundry which is at the new position
  //     //(1,4)
  //     const newX = this.position.x - 1;
  //     const newY = this.position.y;
  //     let win = false;
  //     // check whether any boundry position matches newX, newY
  //     targets.forEach((target) => {
  //       if (target.position.x === newX && target.position.y === newY) {
  //         win = true;
  //       }
  //     });
  //     return win;
  //   }
  moveLeft() {
    const newX = this.position.x - 1;
    const newY = this.position.y;
    if (this.canBoxMove(newX, newY)) {
      return;
    } else {
      this.position.x = newY;
    }
    if (this.isBoxOnTarget()) {
      console.log('You Win');
      this.toggleModal();
    }
  }
  //function to check if the box is collided with boundry
  canBoxMove(newX, newY) {
    // check boundries doesn't have a boundry which is at the new position
    //(1,4)
    let collide = false;
    // check whether any boundry position matches newX, newY
    boundries.forEach((boundry) => {
      if (boundry.position.x === newX && boundry.position.y === newY) {
        console.log('bump', newX, newY);
        collide = true;
      }
      console.log('Box Collided?', collide);
    });
    return collide;
  }
  //function to check if the box is on the target
  isBoxOnTarget() {
    // check boundries doesn't have a boundry which is at the new position
    //(1,4)
    const newX = this.position.x;
    const newY = this.position.y;
    let win = false;
    // check whether any boundry position matches newX, newY
    targets.forEach((target) => {
      if (target.position.x === newX && target.position.y === newY) {
        win = true;
      }
    });
    return win;
  }
  moveUp() {
    const newX = this.position.x;
    const newY = this.position.y - 1;
    if (this.canBoxMove(newX, newY)) {
      return;
    } else {
      this.position.y = newY;
    }
    if (this.isBoxOnTarget()) {
      console.log('You Win');
      this.toggleModal();
    }
  }
  //   canBoxMoveDown() {
  //     // check boundries doesn't have a boundry which is at the new position
  //     //(1,4)
  //     const newX = this.position.x;
  //     const newY = this.position.y + 1;
  //     let collide = false;
  //     // check whether any boundry position matches newX, newY
  //     boundries.forEach((boundry) => {
  //       if (boundry.position.x === newX && boundry.position.y === newY) {
  //         console.log('bump', newX, newY);
  //         collide = true;
  //       }
  //       console.log('Box Collided?', collide);
  //     });

  //     return collide;
  //   }
  //   isBoxOnTargetDown() {
  //     // check boundries doesn't have a boundry which is at the new position
  //     //(1,4)
  //     const newX = this.position.x;
  //     const newY = this.position.y + 1;
  //     let win = false;
  //     // check whether any boundry position matches newX, newY
  //     targets.forEach((target) => {
  //       if (target.position.x === newX && target.position.y === newY) {
  //         win = true;
  //       }
  //     });
  //     return win;
  //   }
  moveDown() {
    const newX = this.position.x;
    const newY = this.position.y + 1;
    if (this.canBoxMove(newX, newY)) {
      return;
    } else {
      this.position.y = newY;
    }
    if (this.isBoxOnTarget()) {
      console.log('You Win');
      this.toggleModal();
    }
  }

  winGame() {
    if (this.isBoxOnTarget()) {
      this.toggleModal();
    }
  }
}

class Target {
  //object literal??
  constructor({ position }) {
    // this.position.x = x;
    // this.position.y = y;
    // this.speed.x = x;
    // this.speed.y = y
    this.radius = 20;
    this.position = position;
    // this.draw();
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = 'orange';
    ctx.arc(
      this.position.x * 70 + 32,
      this.position.y * 70 + 23,
      this.radius,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.closePath();
  }
}

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

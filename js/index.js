document.getElementById('start-button').addEventListener('click', () => {
  startGame();
});
//canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function startGame() {
  //   const myPlayer = new Player({
  //     position: {
  //       x: 50,
  //       y: 50,
  //     },
  //     speed: {
  //       x: 50,
  //       y: 50,
  //     },
  //   });
  // control player by keyboard
  document.addEventListener('keydown', (event) => {
    console.log('code', event.code);

    switch (event.code) {
      case 'ArrowLeft':
        player.forEach((player) => {
          player.move('left');
          player.draw();
        });
        break;
      case 'ArrowRight':
        player.forEach((player) => {
          player.move('right');
          player.draw();
        });
        break;
      case 'ArrowDown':
        player.forEach((player) => {
          player.move('down');
          player.draw();
        });
        break;
      case 'ArrowUp':
        player.forEach((player) => {
          player.move('up');
          player.draw();
        });
        break;
    }
  });
  //clear the canvas and redraw the items
  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.forEach((player) => {
      player.draw();
    });

    boxes.forEach((box) => {
      box.draw();
    });

    targets.forEach((target) => {
      target.draw();
    });
    //draw all the walls
    boundries.forEach((boundry) => {
      boundry.draw();
      player.forEach((player) => {
        // if (player.position.y < 50 || player.position.x < 50) {
        //   console.log('bump');
        //   player.speed.y = 0;
        //   player.speed.x = 0;
        // }
        if (player.position.y + player.speed.y < 50) {
          console.log('bump');
          player.speed.y = 0;
          player.speed.x = 0;
        }
      });
    });
  });
}
class Boundry {
  constructor({ position }) {
    this.position = position;
    this.width = 50;
    this.height = 50;
  }
  draw() {
    ctx.fillStyle = 'grey';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

//create a player & the movements
class Player {
  constructor({ position, speed }) {
    this.height = 50;
    this.width = 50;
    this.position = position;
    this.speed = speed;
  }
  draw() {
    ctx.fillStyle = 'orange';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  moveRight() {
    this.position.x += this.speed.x;
  }
  moveLeft() {
    this.position.x -= this.speed.x;
  }
  moveUp() {
    this.position.y -= this.speed.y;
  }
  moveDown() {
    this.position.y += this.speed.y;
  }
  move(direction) {
    switch (direction) {
      case 'right':
        this.moveRight();
        break;
      case 'left':
        this.moveLeft();
        break;
      case 'down':
        this.moveDown();
        break;
      case 'up':
        this.moveUp();
        break;
    }
  }
}

class Boxes {
  constructor({ position, speed }) {
    this.height = 50;
    this.width = 50;
    this.position = position;
    this.speed = speed;
    // this.draw();
  }
  draw() {
    ctx.fillStyle = 'brown';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Target {
  constructor({ position }) {
    this.radius = 10;
    this.position = position;
    // this.draw();
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = 'pink';
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}

//Level 1 map array set up
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
// initial an player array ---is other way than array to initial the player (one player only)
const player = [];

// loop map arrray to add boundry by numbers
for (let i = 0; i < 7; i++) {
  for (let j = 0; j < 7; j++) {
    if (map[i][j] === 1) {
      boundries.push(
        new Boundry({
          position: {
            x: 50 * j,
            y: 50 * i,
          },
        })
      );
    } else if (map[i][j] === 2) {
      boxes.push(
        new Boxes({
          position: {
            x: 50 * j,
            y: 50 * i,
          },
        })
      );
    } else if (map[i][j] === 3) {
      // push target to array
      targets.push(
        new Target({
          position: {
            x: 75 * j,
            y: 56 * i,
          },
        })
      );
    } else if (map[i][j] === 4) {
      //push player to array
      player.push(
        new Player({
          position: {
            x: 50 * j,
            y: 50 * i,
          },
          speed: {
            x: 25,
            y: 25,
          },
        })
      );
    }
  }
}
//-----------------------------
//function :find the boxes location (x, y) on map
function findBoxes() {
  let count = 0;
  for (let i = 0; i < map.length; i++) {
    let tmp = map[i];
    for (let j = 0; j < tmp.length; j++) {
      if (map[i][j] === '2') {
        boxes[count].x = i;
        boxes[count].y = j;
        count++;
      }
    }
  }
  return boxes;
}

console.log(findBoxes());

// function findPlayer() {
//   for (let i = 0; i < map.length; i++) {
//     let tmp = map[i];
//     for (let j = 0; j < tmp.length; j++) {
//       if (map[i][j] === '4') {
//         return { i, j };
//       }
//     }
//   }
// }

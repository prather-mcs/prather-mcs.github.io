/**
 * Engine contains an immediately-invoked function expression which never
 * reaches a stopping point. The IIFE does create some global variables, but for
 * the most part it uses scoped variables and functions. The functions transfer
 * control back and forth and all around for gameplay animation and decision
 * control flow.
 */
var Engine = (function(globalThis) {

  var lastTime, now, rowImages,
      doc = globalThis.document,
      win = globalThis.window,
      canvas = doc.querySelector('canvas'),
      ctx = canvas.getContext('2d');

  /**
   * rowImages is an array of strings. Each string is a relative URL/filepath
   * of the images used as background tiles; these strings are also the
   * property names of Images cached in the global Resources object. Resources
   * was created by resources.js.
   */
  rowImages = [
    'images/water-block.png',
    'images/stone-block.png',
    'images/stone-block.png',
    'images/stone-block.png',
    'images/grass-block.png',
    'images/grass-block.png'
  ];

  /**
   * This function defines the loop that runs every time the browser is able to
   * draw another Canvas frame. It is **the main loop.**
   */
  function main() {

    /**
     * The variables now and lastTime are used to measure a "time delta"
     * (dt) which is used to provide consistent movement speeds regardless of
     * hardware and platform. We update them here.
     */
    now = Date.now();
    dt = (now - lastTime) / 1000;


    /**
     * update is the function responsible for updating the properties of
     * Sprites; render is responsible for drawing them according to their
     * current properties.
     */
    update(dt);
    render();

    lastTime = now;

    if (!player.paused) {
      win.requestAnimationFrame(main);
    }
  }


  /**
   * This is where all Sprites get their properties updated for each cycle
   * through the main loop. The collision detection routine runs after the
   * update function runs.
   * @param dt {number} How much time has passed since the last update (this is
   *    a very small increment of time under all typical conditions).
   */
  function update(dt) {

    updateSprites(dt);
    checkCollisions();
  }

  /**
   * This function draws every pixel of every "animation frame" for the canvas.
   * Any pixel drawn can be over-written by pixels drawn later during the same
   * draw of the frame. The background tiles are always the first things to be
   * drawn. Sprites are drawn next, via a call to renderSprites(), and they
   * over-write the background tiles.
   */
  function render() {
    var row, numRows = 6, col, numCols = 5;

    // The background tiles are drawn by iteration through a nested loop.
    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    // The Sprites are drawn last to guarantee nothing writes over them.
    renderSprites();

    /**
     * renderSprites() was the final call of the render function, and render is
     * the final call of the main loop function. The main loop will repeat every
     * time the browser is able to draw another frame.
     *
     * Therefore this is the end of the update/render cycle, and it will be
     * followed by the beginning of a new loop, during normal game play.
     *
     * Function definitions below this point are code that is called within
     * functions already defined above.
     */
  }


  // This simply calls each Sprite's update function.
  function updateSprites(dt) {

    allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });

    player.update();
  }

  // This simply calls the render method of each Sprite.
  function renderSprites() {

    allEnemies.forEach(function(enemy) {
      enemy.render();
    });

    player.render();
  }


  /**
   * Takes all necessary actions to initiate a new game. `init` executes all of
   * the actions of `reset` and then more, which are necessary for a totally new
   * game, as opposed to a reset, which is simpler.
   */
  function init() {

    reset();

    Resources.onReady(function() {
      lastTime = Date.now();
      main();
    });
  }

  /**
   * The reset function creates new Enemy and Player Sprites, and then writes or
   * over-writes the allEnemies and player variables to contain them.
   */
  function reset() {
    allEnemies = [
      new Enemy('ladybug', 'images/enemy-bug.png'),
      new Enemy('ladybug', 'images/enemy-bug.png'),
      new Enemy('ladybug', 'images/enemy-bug.png'),
      new Enemy('ladybug', 'images/enemy-bug.png')
    ];

    player = new Player('boy', 'images/char-boy.png');
  }


  /**
   * Helper function for checkCollisions. It returns an array with every
   * possible pair of elements that can be found in the input array -- so for
   * input [1,2,3], this function would return [[1,2], [2,3], [1,3]].
   * @param {Array} inputArray
   * @return {Array}
   */
  function pairsInArray(inputArray) {
    var index, left, right, inputCopy, outputArray = [];

    inputCopy = inputArray.slice();

    while (inputCopy.length) {
      left = inputCopy.pop();

      for (index in inputCopy) {
        right = inputCopy[index];
        outputArray.push([left, right]);
      }
    }

    return outputArray;
  }


  /**
   * Helper function for checkCollisions. It returns whether two Sprites are in
   * collision or not. All "magic numbers" below are derived from the
   * pixel-width of the Sprites first, subsequently modified by trial-and-error
   * to make collisions or near-misses feel realistic to the game player.
   * @param {app.Sprite} sprite1 No description.
   * @param {app.Sprite} sprite2 No description.
   * @return {boolean} Whether sprite1 and sprite2 are in collision.
   */
  function inSameSpace(sprite1, sprite2) {
    if (sprite2.constructor === Player) {
      if (sprite1.yPosition -10 === sprite2.yPosition) {
        if (sprite1.xPosition + 99 >= sprite2.xPosition + 28 &&
            sprite1.xPosition + 2 <= sprite2.xPosition + 64) {
          return true;
        }
      }
    }

    if (sprite2.constructor === Enemy) {
      if (sprite1.yPosition === sprite2.yPosition) {
        if (sprite1.xPosition + 99 >= sprite2.xPosition + 2 &&
            sprite1.xPosition + 2 <= sprite2.xPosition + 99) {
          return true;
        }
      }
    }

    return false;
  }


  /**
   * First, this function checks if a Player Sprite is in collision with an
   * Enemy Sprite. If so, the game resets by going to the init function. That's
   * equivalent to starting the game fresh.
   *
   * Provided the Player is not in collision, the collision of Enemies will be
   * detected and dealt with. The detection of collision of Enemies with Enemies
   * is an improved gameplay feature.
   */
  function checkCollisions() {
    var playerCollision = false,
    bugsInSameRow = [],
    stuckBugs = [];

    // Check if the Player is in collison.
    allEnemies.forEach(function(enemy) {
      enemy.wait = false;

      playerCollision = inSameSpace(enemy, player);

      if (playerCollision) {
        init();
      }
    });

    // Player not in collision; check if Enemies are in collsion.
    pairsInArray(allEnemies).forEach(function(pair) {
      if (inSameSpace(pair[0], pair[1])) {
        pair[0].wait = true;
        stuckBugs.push(pair[0]);

        pair[1].wait = true;
        stuckBugs.push(pair[1]);
      }
    });

    /**
     * Every Enemy in collision is now in the "stuckBugs" Array, and has its
     * "wait" boolean value set to `true`.
     *
     * The following block runs when stuckBugs is not empty. It uses the
     * following algorithm to change an Enemy's `wait` boolean back to `false`:
     *
     * -Let the bug with the right-most xPosition be un-stuck (ie: change its
     *  "wait" value to `false`) and return out of the checkCollisions routine;
     *
     * -But if every bug which is stuck has the same xPosition, then let the bug
     *  with the highest xVelocity be un-stuck and return out of the routine.
     *  Bugs frequently are stuck and have the same xPosition after init runs
     *  (i.e. a new game starts), but almost never are stuck and have the same
     *  xPosition after that.
     */
    if (stuckBugs.length) {
      var rightMost, leftMost, fastest;

      rightMost = stuckBugs.reduce(
        function(previous, current) {
          return previous.xPosition >= current.xPosition ? previous : current;
        }
      );

      leftMost = stuckBugs.reduce(
        function(previous, current) {
          return previous.xPosition <= current.xPosition ? previous : current;
        }
      );

      if (rightMost !== leftMost) {
        rightMost.wait = false;
        return;
      } else {
        fastest = stuckBugs[0];
        stuckBugs.forEach(function(enemy) {
          if (enemy.xVelocity > fastest.xVelocity) {
            fastest = enemy;
          }
        });
        fastest.wait = false;
      }
    }
  }

  /**
   * Note: all functions definitions are complete. Code which follows are
   * instructions to run when the Engine IIFE is first invoked.
   */


  // Load the background tile images.
  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png'
  ]);

  /**
   * Give init to the Resources.onReady method. This means init is "queued"
   * inside the readyCallbacks array inside the Resources closure. This actually
   * means that init will run very soon (after the last Image load event),
   * because the readyCallbacks will have no other functions in it, under
   * present game design. Since init calls main, this all means that the main
   * loop will start running soon as well.
   */
  Resources.onReady(init);

  /**
   * Assign the canvas' context object to a global variable of the same name,
   * for convenience.
   */
  globalThis.ctx = ctx;


  // Create a listener that will detect keydown on "P", for pause functionality.
  globalThis.addEventListener('keydown', function(event) {
    if (event.keyCode === 80) {
      player.paused = !player.paused;

      if (!player.paused) {
        lastTime = Date.now();
        main();
      }
    }
  });
})(this);

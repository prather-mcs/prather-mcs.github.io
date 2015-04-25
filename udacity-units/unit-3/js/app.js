/**
 * Helper function for certain functions in certain constructors. Returns a
 * floating-point number in the range [a, b).
 * @param a {number} The lower limit of the range. Included in possible returns.
 * @param b {number} The upper limit of the range. Excluded.
 * @return {number}
 */
function randomInRange(a, b) {
  return Math.random() * (b - a) + a;
}


/**
 * Helper function for certain functions in certain constructors. Returns one
 * member of the input array, randomly.
 * @param array {Array}
 * @return {number} A member of the input array.
 */
function randomInArray(array) {
  var randomFloat, randomIndex;

  randomFloat = Math.random() * array.length;
  randomIndex = Math.floor(randomFloat);

  return array[randomIndex];
}


/**
 * This is the parent class of anything that will be drawn on the canvas which
 * is not a background tile. Background tiles get drawn without using any
 * object-oriented class, but everything else is under the Sprite class.
 * @constructor
 */
function Sprite() {

  /**
   * Sprite is a super-class which sets properties and methods common to all
   * Sprites in the game, and Sprite.create is the function which we use to
   * actually set said properties.
   * @param {string} name This property contains a string used to name a Sprite.
   *     This property will be commonly used in other places in the code to
   *     refer to the Sprite Object.
   * @param {string} imageURL This property contains a string used to locate the
   *     Sprite's image.
   * @param {number} xPosition This is simply the x-position for the Canvas API.
   * @param {number} yPosition This is simply the y-position for the Canvas API.
   * @this {Sprite}
   */
  this.create = function(name, imageURL, xPosition, yPosition) {

    this.name = name;
    this.image = imageURL;
    this.xPosition = xPosition;
    this.yPosition = yPosition;

    /**
     * Sprites may be solid or not. Only solid objects may collide. This
     * property stores a Sprite as being "solid" by default. Not currently used
     * by any other function in the code, but future enhancement will use this
     * property.
     * @type {boolean} Whether "solid".
     */
    this.solid = true;
  };
}


/**
 * Draws the Sprite on the canvas. Wraps a Canvas API function.
 */
Sprite.prototype.render = function() {
  ctx.drawImage(Resources.get(this.image), this.xPosition, this.yPosition);
};


/**
 * Class for Sprites which are enemy to the game player. (Usually "ladybugs".)
 * @constructor
 * @extends {Sprite}
 * @param {string} name A string to refer to this Enemy.
 * @param {string} imageURL The URL of this Enemy's image file.
 */
function Enemy(name, imageURL) {
  var randomYPosition = randomInArray([63, 146, 229]);

  // Using .call is part of the prototypal inheritance pattern.
  Sprite.call(this);

  this.create(name, imageURL, -100, randomYPosition);

  /**
   * Enemies traverse the road with a speed that is randomly generated. This
   * property contains that speed. Only Enemies uses this property.
   * @type {number} Enemy velocity.
  */
  this.xVelocity = randomInRange(200, 300);

  /**
   * To improve gameplay, a "wait" property was added for enemies. It prevents
   * Enemies from unrealistically overlapping each other on the road. It does so
   * by making the Enemy stop moving. The checkCollisions function in engine.js
   * uses the wait property extensively.
   * @type {boolean} Whether this Enemy has temporarily halted movement.
   */
  this.wait = false;


  // A Sprite's image must go to the Resources.load function when it is created.
  Resources.load(this.image);
}


// The following two lines are part of the prototypal inheritance pattern.
Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;


/**
 * All changes to an Enemy's properties during each time interval are handled
 * here.
 */
Enemy.prototype.update = function(dt) {
  if (!this.wait) {
    this.xPosition += (dt * this.xVelocity);
  }

  /**
   * This block is responsible for looping Enemies on the road from right to
   * left, giving them a new lane and speed at the same time.
   */
  if (this.xPosition > 504) {
    this.xPosition = -100;
    this.xVelocity = randomInRange(200, 300);
    this.yPosition = randomInArray([63, 146, 229]);
  }
};


/**
 * Class defining the one Sprite which is controlled by the player.
 * @constructor
 * @extends {Sprite}
 * @param name {string} A string to name the Sprite.
 * @param imageURL {string} The URL of this Sprites's image file.
 */
function Player(name, imageURL) {

  // Using Sprite.call is part of the prototypal inheritance pattern.
  Sprite.call(this);
  this.create(name, imageURL, 202, 385);

  /**
   * To improve gameplay, a "pause" function has been added. Whether or not the
   * whole game is paused is not strictly a property of the player Sprite, but
   * we are storing the whole-game "paused" boolean in the Player object,
   * because it still makes sense in other ways, and it is convenient.
   * @type {boolean} Whether the game is paused.
   */
  this.paused = false;

  // A Sprite's image must go to the Resources.load function when it is created.
  Resources.load(this.image);
}

// The following two lines are part of the prototypal inheritance pattern.
Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;


/**
 * All changes to a Player's properties during each time interval are handled
 * here.
 */
Player.prototype.update = function() {
  if (this.xPosition < 0) {
    this.xPosition = 0;
  }

  if (this.xPosition > 404) {
    this.xPosition = 404;
  }

  if (this.yPosition <= -30) {
    this.yPosition = 385;
  }

  if (this.yPosition > 385) {
    this.yPosition = 385;
  }
};


/**
 * Receives notification of keyboard inputs and updates a Player Object
 * accordingly.
 * @param input {string} Will be a simple string like "up" received from another
 *     function that listens for keyboard events.
 */
Player.prototype.handleInput = function(input) {
  if (!input || this.paused) {
    return;
  }

  switch (input) {
    case 'left':
      this.xPosition -= 101;
      break;
    case 'up':
      this.yPosition -= 83;
      break;
    case 'right':
      this.xPosition += 101;
      break;
    case 'down':
      this.yPosition += 83;
      break;
  }
};


/**
 * Add an EventListener to identify keypresses and send them to the appropriate
 * functions.
 */
document.addEventListener('keyup', function(evnt) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    80: 'pause'
  };

  player.handleInput(allowedKeys[evnt.keyCode]);

});

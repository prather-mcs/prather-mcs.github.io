var pizzeriaMenuApp = {

  createPizzaMenu: function() {
    var menuResults;
    var menuDiv;
    var nextPizza;
    var i;

    window.performance.mark('mark_start_generating');

    menuDiv = document.getElementById('randomPizzas');

    for (i = 2; i < 100; i++) {
      nextPizza = pizzaElementGenerator(i);
      menuDiv.appendChild(nextPizza);
    }

    window.performance.mark('mark_end_generating');


    window.performance.measure(
      'pizza_menu_generation', 'mark_start_generating', 'mark_end_generating'
    );


    menuResults = window.performance.getEntriesByName('pizza_menu_generation');

    console.log(
      'Time to generate pizzas on load: ' + menuResults[0].duration + 'ms'
    );


    function pizzaElementGenerator(idNum) {
    // Returns a modular `div` element for containing one pizza on the menu.

      var pizzaContainer;
      var pizzaImageContainer;
      var pizzaDescriptionContainer;

      pizzaContainer = document.createElement('div');
      pizzaContainer.classList.add('randomPizzaContainer');
      pizzaContainer.style.width = '33.33%';
      pizzaContainer.style.height = '325px';
      pizzaContainer.id = 'pizza' + idNum;

      pizzaImageContainer = buildImageContainer();
      pizzaDescriptionContainer = buildDescriptionContainer();

      pizzaContainer.appendChild(pizzaImageContainer);
      pizzaContainer.appendChild(pizzaDescriptionContainer);

      return pizzaContainer;


      function buildImageContainer() {
        var output;
        var pizzaImage;

        output = document.createElement('div');

        // output.classList.add('col-md-6');
        output.style['max-width'] = '35%';

        pizzaImage = document.createElement('img');
        pizzaImage.src = 'images/pizza.png';
        pizzaImage.classList.add('img-responsive');

        output.appendChild(pizzaImage);

        return output;
      }


      function buildDescriptionContainer() {
        var output;
        var pizzaNameElement;
        var ul;

        output = document.createElement('div');
        // output.classList.add('col-md-6');
        output.style['max-width'] = '65%';

        pizzaNameElement = document.createElement('h4');
        pizzaNameElement.innerHTML = randomName();

        output.appendChild(pizzaNameElement);

        ul = document.createElement('ul');
        ul.innerHTML = makeRandomPizza();

        output.appendChild(ul);

        return output;
      }


      function randomName() {
        var adjectives;
        var nouns;
        var randomNumberAdj;
        var randomNumberNoun;

        adjectives = [
          'dark', 'color', 'whimsical', 'shiny', 'noisy', 'apocalyptic',
          'insulting', 'praise', 'scientific'
        ];

        nouns = [
          'animals', 'everyday', 'fantasy', 'gross', 'horror', 'jewelry',
          'places', 'scifi'
        ];

        randomNumberAdj = parseInt(Math.random() * adjectives.length);
        randomNumberNoun = parseInt(Math.random() * nouns.length);

        return generator(adjectives[randomNumberAdj], nouns[randomNumberNoun]);
      }


      function generator(adjNumber, nounNumber) {
      // Gets arrays of adjectives and nouns with the getAdj and getNoun functions,
      // then randomly picks a member of each array, and then returns a concatenation
      // of the two.

        var adjectives;
        var nouns;
        var randomNum;
        var randomAdjective;
        var randomNoun;

        adjectives = getAdj(adjNumber);
        randomNum = parseInt(Math.random() * adjectives.length);
        randomAdjective = adjectives[randomNum];
        randomAdjective = capitalize(randomAdjective);

        nouns = getNoun(nounNumber);
        randomNum = parseInt(Math.random() * nouns.length);
        randomNoun = nouns[randomNum];
        randomNoun = capitalize(randomNoun);

        return 'The ' + randomAdjective + ' ' + randomNoun;


        function capitalize(str) {
          return str.charAt(0).toUpperCase() + str.slice(1);
        }
      }


      function makeRandomPizza() {
      // Returns a string with random pizza ingredients nested inside <li> tags

        var pizza;
        var numberOfMeats;
        var numberOfNonMeats;
        var numberOfCheeses;
        var ingredients;
        var random;
        var j;


        ingredients = {
          meats: [
            'Pepperoni', 'Sausage', 'Fennel Sausage', 'Spicy Sausage',
            'Chicken', 'BBQ Chicken', 'Chorizo', 'Chicken Andouille',
            'Salami', 'Tofu', 'Bacon', 'Canadian Bacon', 'Proscuitto',
            'Italian Sausage', 'Ground Beef', 'Anchovies', 'Turkey', 'Ham',
            'Venison', 'Lamb', 'Duck', 'Soylent Green', 'Carne Asada',
            'Soppressata Picante', 'Coppa', 'Pancetta', 'Bresola', 'Lox',
            'Guanciale', 'Chili', 'Beef Jerky', 'Pastrami', 'Kielbasa',
            'Scallops', 'Filet Mignon'
          ],

          nonMeats: [
            'White Onions', 'Red Onions', 'Sauteed Onions', 'Green Peppers',
            'Red Peppers', 'Banana Peppers', 'Ghost Peppers',
            'Habanero Peppers', 'Jalapeno Peppers', 'Stuffed Peppers',
            'Spinach', 'Tomatoes', 'Pineapple', 'Pear Slices',
            'Apple Slices', 'Mushrooms', 'Arugula', 'Basil', 'Fennel',
            'Rosemary', 'Cilantro', 'Avocado', 'Guacamole', 'Salsa',
            'Swiss Chard', 'Kale', 'Sun Dried Tomatoes', 'Walnuts',
            'Artichoke', 'Asparagus', 'Caramelized Onions', 'Mango',
            'Garlic', 'Olives', 'Cauliflower', 'Polenta', 'Fried Egg',
            'Zucchini', 'Hummus'
          ],

          cheeses: [
            'American Cheese', 'Swiss Cheese', 'Goat Cheese',
            'Mozzarella Cheese', 'Parmesean Cheese', 'Velveeta Cheese',
            'Gouda Cheese', 'Muenster Cheese', 'Applewood Cheese',
            'Asiago Cheese', 'Bleu Cheese', 'Boursin Cheese', 'Brie Cheese',
            'Cheddar Cheese', 'Chevre Cheese', 'Havarti Cheese',
            'Jack Cheese', 'Pepper Jack Cheese', 'Gruyere Cheese',
            'Limberger Cheese', 'Manchego Cheese', 'Marscapone Cheese',
            'Pecorino Cheese', 'Provolone Cheese', 'Queso Cheese',
            'Roquefort Cheese', 'Romano Cheese', 'Ricotta Cheese',
            'Smoked Gouda'
          ],

          sauces: [
            'Red Sauce', 'Marinara', 'BBQ Sauce', 'No Sauce', 'Hot Sauce'
          ],

          crusts: [
            'White Crust', 'Whole Wheat Crust', 'Flatbread Crust',
            'Stuffed Crust'
          ]
        };

        numberOfMeats = Math.floor((Math.random() * 4));
        numberOfNonMeats = Math.floor((Math.random() * 3));
        numberOfCheeses = Math.floor((Math.random() * 2));

        pizza = '';

        for (j = 0; j < numberOfMeats; j++) {
          pizza = pizza + ingredientItemizer(selectRandomMeat());
        }

        for (j = 0; j < numberOfNonMeats; j++) {
          pizza = pizza + ingredientItemizer(selectRandomNonMeat());
        }

        for (j = 0; j < numberOfCheeses; j++) {
          pizza = pizza + ingredientItemizer(selectRandomCheese());
        }

        pizza = pizza + ingredientItemizer(selectRandomSauce());
        pizza = pizza + ingredientItemizer(selectRandomCrust());

        return pizza;


        function ingredientItemizer(string) {
            return '<li>' + string + '</li>';
        }


        function selectRandomMeat() {
          random = Math.floor((Math.random() * ingredients.meats.length));

          return ingredients.meats[random];
        }


        function selectRandomNonMeat() {
          random = Math.floor((Math.random() * ingredients.nonMeats.length));

          return ingredients.nonMeats[random];
        }


        function selectRandomCheese() {
          random = Math.floor((Math.random() * ingredients.cheeses.length));

          return ingredients.cheeses[random];
        }


        function selectRandomSauce() {
          random = Math.floor((Math.random() * ingredients.sauces.length));

          return ingredients.sauces[random];
        }


        function selectRandomCrust() {
          random = Math.floor((Math.random() * ingredients.crusts.length));

          return ingredients.crusts[random];
        }
      }
    }


    function getAdj(type) {
    // Return an array of adjectives all of a certain type.

      switch(type) {
        case 'dark':
          return [
            'dark', 'morbid', 'scary', 'spooky', 'gothic', 'deviant',
            'creepy', 'sadistic', 'black', 'dangerous', 'dejected',
            'haunted', 'morose', 'tragic', 'shattered', 'broken', 'sad',
            'melancholy', 'somber', 'dark', 'gloomy', 'homicidal',
            'murderous', 'shady', 'misty', 'dusky', 'ghostly', 'shadowy',
            'demented', 'cursed', 'insane', 'possessed', 'grotesque',
            'obsessed'
          ];

        case 'color':
          return [
            'blue', 'green', 'purple', 'grey', 'scarlet', 'NeonGreen',
            'NeonBlue', 'NeonPink', 'HotPink', 'pink', 'black', 'red',
            'maroon', 'silver', 'golden', 'yellow', 'orange', 'mustard',
            'plum', 'violet', 'cerulean', 'brown', 'lavender', 'violet',
            'magenta', 'chestnut', 'rosy', 'copper', 'crimson', 'teal',
            'indigo', 'navy', 'azure', 'periwinkle', 'brassy', 'verdigris',
            'veridian', 'tan', 'raspberry', 'beige', 'sandy', 'ElectricBlue',
            'white', 'champagne', 'coral', 'cyan'
          ];

        case 'whimsical':
          return [
            'whimsical', 'silly', 'drunken', 'goofy', 'funny', 'weird',
            'strange', 'odd', 'playful', 'clever', 'boastful',
            'breakdancing', 'hilarious', 'conceited', 'happy', 'comical',
            'curious', 'peculiar', 'quaint', 'quirky', 'fancy', 'wayward',
            'fickle', 'yawning', 'sleepy', 'cockeyed', 'dizzy', 'dancing',
            'absurd', 'laughing', 'hairy', 'smiling', 'perplexed', 'baffled',
            'cockamamie', 'vulgar', 'hoodwinked', 'brainwashed'
          ];

        case 'shiny':
          return [
            'sapphire', 'opal', 'silver', 'gold', 'platinum', 'ruby',
            'emerald', 'topaz', 'diamond', 'amethyst', 'turquoise',
            'starlit', 'moonlit', 'bronze', 'metal', 'jade', 'amber',
            'garnet', 'obsidian', 'onyx', 'pearl', 'copper', 'sunlit',
            'brass', 'brassy', 'metallic'
          ];

        case 'noisy':
          return [
            'untuned', 'loud', 'soft', 'shrieking', 'melodious', 'musical',
            'operatic', 'symphonic', 'dancing', 'lyrical', 'harmonic',
            'orchestral', 'noisy', 'dissonant', 'rhythmic', 'hissing',
            'singing', 'crooning', 'shouting', 'screaming', 'wailing',
            'crying', 'howling', 'yelling', 'hollering', 'caterwauling',
            'bawling', 'bellowing', 'roaring', 'squealing', 'beeping',
            'knocking', 'tapping', 'rapping', 'humming', 'scatting',
            'whispered', 'whispering', 'rasping', 'buzzing', 'whirring',
            'whistling', 'whistled'
          ];

        case 'apocalyptic':
          return [
            'nuclear', 'apocalyptic', 'desolate', 'atomic', 'zombie',
            'collapsed', 'grim', 'fallen', 'collapsed', 'cannibalistic',
            'radioactive', 'toxic', 'poisonous', 'venomous', 'disastrous',
            'grimy', 'dirty', 'undead', 'bloodshot', 'rusty', 'glowing',
            'decaying', 'rotten', 'deadly', 'plagued', 'decimated',
            'rotting', 'putrid', 'decayed', 'deserted', 'acidic'
          ];

        case 'insulting':
          return [
            'stupid', 'idiotic', 'fat', 'ugly', 'hideous', 'grotesque',
            'dull', 'dumb', 'lazy', 'sluggish', 'brainless', 'slow',
            'gullible', 'obtuse', 'dense', 'dim', 'dazed', 'ridiculous',
            'witless', 'daft', 'crazy', 'vapid', 'inane', 'mundane',
            'hollow', 'vacuous', 'boring', 'insipid', 'tedious',
            'monotonous', 'weird', 'bizarre', 'backward', 'moronic',
            'ignorant', 'scatterbrained', 'forgetful', 'careless',
            'lethargic', 'insolent', 'indolent', 'loitering', 'gross',
            'disgusting', 'bland', 'horrid', 'unseemly', 'revolting',
            'homely', 'deformed', 'disfigured', 'offensive', 'cowardly',
            'weak', 'villainous', 'fearful', 'monstrous', 'unattractive',
            'unpleasant', 'nasty', 'beastly', 'snide', 'horrible',
            'sycophantic', 'unhelpful', 'bootlicking'
          ];

        case 'praise':
          return [
            'beautiful', 'intelligent', 'smart', 'genius', 'ingenious',
            'gorgeous', 'pretty', 'witty', 'angelic', 'handsome', 'graceful',
            'talented', 'exquisite', 'enchanting', 'fascinating',
            'interesting', 'divine', 'alluring', 'ravishing', 'wonderful',
            'magnificient', 'marvelous', 'dazzling', 'cute', 'charming',
            'attractive', 'nifty', 'delightful', 'superior', 'amiable',
            'gentle', 'heroic', 'courageous', 'valiant', 'brave', 'noble',
            'daring', 'fearless', 'gallant', 'adventurous', 'cool',
            'enthusiastic', 'fierce', 'awesome', 'radical', 'tubular',
            'fearsome', 'majestic', 'grand', 'stunning'
          ];

        case 'scientific':
          return [
            'scientific', 'technical', 'digital', 'programming',
            'calculating', 'formulating', 'cyberpunk', 'mechanical',
            'technological', 'innovative', 'brainy', 'chemical', 'quantum',
            'astro', 'space', 'theoretical', 'atomic', 'electronic',
            'gaseous', 'investigative', 'solar', 'extinct', 'galactic'
          ];
      }
    }


    function getNoun(type) {
    // Return an array of nouns all of a given type.

      switch(type) {
        case 'animals':
          return [
            'flamingo', 'hedgehog', 'owl', 'elephant', 'pussycat',
            'alligator', 'dachsund', 'poodle', 'beagle', 'crocodile',
            'kangaroo', 'wallaby', 'woodpecker', 'eagle', 'falcon', 'canary',
            'parrot', 'parakeet', 'hamster', 'gerbil', 'squirrel', 'rat',
            'dove', 'toucan', 'raccoon', 'vulture', 'peacock', 'goldfish',
            'rook', 'koala', 'skunk', 'goat', 'rooster', 'fox', 'porcupine',
            'llama', 'grasshopper', 'gorilla', 'monkey', 'seahorse',
            'wombat', 'wolf', 'giraffe', 'badger', 'lion', 'mouse', 'beetle',
            'cricket', 'nightingale', 'hawk', 'trout', 'squid', 'octopus',
            'sloth', 'snail', 'locust', 'baboon', 'lemur', 'meerkat',
            'oyster', 'frog', 'toad', 'jellyfish', 'butterfly',
            'caterpillar', 'tiger', 'hyena', 'zebra', 'snail', 'pig',
            'weasel', 'donkey', 'penguin', 'crane', 'buzzard', 'vulture',
            'rhino', 'hippopotamus', 'dolphin', 'sparrow', 'beaver', 'moose',
            'minnow', 'otter', 'bat', 'mongoose', 'swan', 'firefly',
            'platypus'
          ];

        case 'profession':
          return [
            'doctor', 'lawyer', 'ninja', 'writer', 'samurai', 'surgeon',
            'clerk', 'artist', 'actor', 'engineer', 'mechanic', 'comedian',
            'fireman', 'nurse', 'RockStar', 'musician', 'carpenter',
            'plumber', 'cashier', 'electrician', 'waiter', 'president',
            'governor', 'senator', 'scientist', 'programmer', 'singer',
            'dancer', 'director', 'mayor', 'merchant', 'detective',
            'investigator', 'navigator', 'pilot', 'priest', 'cowboy',
            'stagehand', 'soldier', 'ambassador', 'pirate', 'miner', 'police'
          ];

        case 'fantasy':
          return [
            'centaur', 'wizard', 'gnome', 'orc', 'troll', 'sword', 'fairy',
            'pegasus', 'halfling', 'elf', 'changeling', 'ghost', 'knight',
            'squire', 'magician', 'witch', 'warlock', 'unicorn', 'dragon',
            'wyvern', 'princess', 'prince', 'king', 'queen', 'jester',
            'tower', 'castle', 'kraken', 'seamonster', 'mermaid', 'psychic',
            'seer', 'oracle'
          ];

        case 'music':
          return [
            'violin', 'flute', 'bagpipe', 'guitar', 'symphony', 'orchestra',
            'piano', 'trombone', 'tuba', 'opera', 'drums', 'harpsichord',
            'harp', 'harmonica', 'accordion', 'tenor', 'soprano', 'baritone',
            'cello', 'viola', 'piccolo', 'ukelele', 'woodwind', 'saxophone',
            'bugle', 'trumpet', 'sousaphone', 'cornet', 'stradivarius',
            'marimbas', 'bells', 'timpani', 'bongos', 'clarinet', 'recorder',
            'oboe', 'conductor', 'singer'
          ];

        case 'horror':
          return [
            'murderer', 'chainsaw', 'knife', 'sword', 'murder', 'devil',
            'killer', 'psycho', 'ghost', 'monster', 'godzilla', 'werewolf',
            'vampire', 'demon', 'graveyard', 'zombie', 'mummy', 'curse',
            'death', 'grave', 'tomb', 'beast', 'nightmare', 'frankenstein',
            'specter', 'poltergeist', 'wraith', 'corpse', 'scream',
            'massacre', 'cannibal', 'skull', 'bones', 'undertaker',
            'zombie', 'creature', 'mask', 'psychopath', 'fiend', 'satanist',
            'moon', 'fullMoon'
          ];

        case 'gross':
          return [
            'slime', 'bug', 'roach', 'fluid', 'pus', 'booger', 'spit',
            'boil', 'blister', 'orifice', 'secretion', 'mucus', 'phlegm',
            'centipede', 'beetle', 'fart', 'snot', 'crevice', 'flatulence',
            'juice', 'mold', 'mildew', 'germs', 'discharge', 'toilet',
            'udder', 'odor', 'substance', 'fluid', 'moisture', 'garbage',
            'trash', 'bug'
          ];

        case 'everyday':
          return [
            'mirror', 'knife', 'fork', 'spork', 'spoon', 'tupperware',
            'minivan', 'suburb', 'lamp', 'desk', 'stereo', 'television',
            'TV', 'book', 'car', 'truck', 'soda', 'door', 'video', 'game',
            'computer', 'calender', 'tree', 'plant', 'flower', 'chimney',
            'attic', 'kitchen', 'garden', 'school', 'wallet', 'bottle'
          ];

        case 'jewelry':
          return [
            'earrings', 'ring', 'necklace', 'pendant', 'choker', 'brooch',
            'bracelet', 'cameo', 'charm', 'bauble', 'trinket', 'jewelry',
            'anklet', 'bangle', 'locket', 'finery', 'crown', 'tiara',
            'blingBling', 'chain', 'rosary', 'jewel', 'gemstone', 'beads',
            'armband', 'pin', 'costume', 'ornament', 'treasure'
          ];

        case 'places':
          return [
            'swamp', 'graveyard', 'cemetery', 'park', 'building', 'house',
            'river', 'ocean', 'sea', 'field', 'forest', 'woods',
            'neighborhood', 'city', 'town', 'suburb', 'country', 'meadow',
            'cliffs', 'lake', 'stream', 'creek', 'school', 'college',
            'university', 'library', 'bakery', 'shop', 'store', 'theater',
            'garden', 'canyon', 'highway', 'restaurant', 'cafe', 'diner',
            'street', 'road', 'freeway', 'alley'
          ];

        case 'scifi': {
          return [
            'robot', 'alien', 'raygun', 'spaceship', 'UFO', 'rocket',
            'phaser', 'astronaut', 'spaceman', 'planet', 'star', 'galaxy',
            'computer', 'future', 'timeMachine', 'wormHole', 'timeTraveler',
            'scientist', 'invention', 'martian', 'pluto', 'jupiter',
            'saturn', 'mars', 'quasar', 'blackHole', 'warpDrive', 'laser',
            'orbit', 'gears', 'molecule', 'electron', 'neutrino', 'proton',
            'experiment', 'photon', 'apparatus', 'universe', 'gravity',
            'darkMatter', 'constellation', 'circuit', 'asteroid'
          ];
        }
      }
    }
  },


  createResizerControl: function() {

    window.resizePizzas = function(size) {
    // resizePizzas is called when the slider in the 'Our Pizzas' section of the
    // website moves.

      var timeToResize;

      window.performance.mark('mark_start_resize');

      changeSliderLabel(size);

      changePizzaSizes(size);

      window.performance.mark('mark_end_resize');

      window.performance.measure('measure_pizza_resize', 'mark_start_resize', 'mark_end_resize');

      timeToResize = window.performance.getEntriesByName('measure_pizza_resize');

      console.log('Time to resize pizzas: ' + timeToResize[timeToResize.length - 1].duration + 'ms');
    };


    function changeSliderLabel(size) {
    // Changes the slider label to the correct size of pizza.

      switch(size) {
        case '1':
          document.getElementById('pizzaSize').innerHTML = 'Small';
          return;
        case '2':
          document.getElementById('pizzaSize').innerHTML = 'Medium';
          return;
        case '3':
          document.getElementById('pizzaSize').innerHTML = 'Large';
          return;
        default:
          console.log('bug in changeSliderLabel');
      }
    }


    function changePizzaSizes(size) {
    // Iterates through pizza elements on the page and changes their widths.

      var pizzaContainerElements, numPizzas, dx, newWidth, i;

      pizzaContainerElements = document.getElementsByClassName('randomPizzaContainer');

      numPizzas = pizzaContainerElements.length;

      dx = determineDx(pizzaContainerElements[0], size);

      newWidth = (pizzaContainerElements[0].offsetWidth + dx) + 'px';

      for (i = 0; i < numPizzas; i++) {
        pizzaContainerElements[i].style.width = newWidth;
      }
    }


    function determineDx (elem, size) {
    // Returns the size difference to change a pizza element from one size to
    // another. Called by changePizzaSlices.

      var oldWidth, windowWidth, oldSize, newSize, dx;

      function sizeSwitcher(sizeValue) {
      // Changes the slider value to a percent width.

        switch(sizeValue) {
          case '1':
            return 0.25;
          case '2':
            return 0.3333;
          case '3':
            return 0.5;
          default:
            console.log('bug in sizeSwitcher');
        }
      }

      oldWidth = elem.offsetWidth;
      console.log(oldWidth);
      windowWidth = document.getElementById('randomPizzas').offsetWidth;

      oldSize = oldWidth / windowWidth;

      newSize = sizeSwitcher(size);

      dx = (newSize - oldSize) * windowWidth;

      return dx;
    }
  },


  setScrollHandler: function() {
    window.animating = false;

    // frame is an iterator for the number of times the pizzas in the background
    // have scrolled; it is watched by updatePositions() to decide when to log the
    // average time per frame.
    window.frame = 0;

    window.addEventListener('scroll', animationReadyCheck);


    function animationReadyCheck() {
      if (!window.animating) {
        window.requestAnimationFrame(pizzeriaMenuApp.updatePositions);
        window.animating = true;
      }
    }
  },


  createBackgroundPizzas: function() {
    document.addEventListener('DOMContentLoaded', function() {
    // When all DOM Content has loaded, this function runs. It places the moving
    // pizzas in the background.

      var cols, s, windowInnerHeight, i, elem, elemTop;

      cols = 8;
      s = 256;
      windowInnerHeight = window.innerHeight;

      for (i = 0; i < 200; i++) {
      // 200 `.mover` pizzas is much more than enough for most user viewport sizes.
      // 40 `.mover` pizzas is enough to fill viewports with less than 1024px of
      // vertical height, which should be most-to-all of this site's visitors.

        elemTop = Math.floor(i / cols) * s;

        if (elemTop > windowInnerHeight) {
        // This stops creating `.mover` pizzas when they would be drawn below the
        // bottom of the client browser's window.
        // At the moment, it is not a perfect solution, because it doesn't account
        // for the possibility that a user may have had a small window open for the
        // browser on first visit, and then re-sized to a larger window -- in that
        // case, not enough `.mover` pizzas would exist, and we make no attempt to
        // create more. Using 40 `.mover` pizzas may be preferable.

          break;
        }

        elem = document.createElement('img');
        elem.className = 'mover';
        elem.src = 'images/background-pizza.png';
        elem.style.height = '94px';      // used to be 100px
        elem.style.width = '73px';       // used to be 73.333px
        // elem.basicLeft = (i % cols) * s;
        elem.style.left = (i % cols) * s + 'px';
        elem.style.top = elemTop + 'px';

        document.getElementById('movingPizzas1').appendChild(elem);
      }

      // This variable is needed by the updatePositions function, and its value is
      // constant, so we create it now at the global scope.
      window.items = document.getElementsByClassName('mover');

      pizzeriaMenuApp.updatePositions();
    });
  },


  updatePositions: function() {
  // This is the function which moves the background pizzas while the user is scrolling

    var top, constArray, numPizzas, i, phase;

    window.frame++;

    window.performance.mark('mark_start_frame');

    top = (document.body.scrollTop / 1250);
    constArray = [];
    for (i = 0; i < 5; i++) {
      constArray.push(Math.sin(top + i));
    }

    numPizzas = window.items.length;

    for (i = 0; i < numPizzas; i++) {
      phase = constArray[i % 5];
      // phase = Math.sin((document.body.scrollTop / 1250) + (i % 5));
      // items[i].style.left = items[i].basicLeft + 100 * phase + 'px';
      // items[i].style.transform = 'translateX(' + (100 * phase) + 'px)';
      window.items[i].style.transform = 'translate3d(' + (100 * phase) + 'px, 0, 0)';
    }

    window.animating = false;

    window.performance.mark('mark_end_frame');

    window.performance.measure('measure_frame_duration', 'mark_start_frame', 'mark_end_frame');

    if (window.frame % 10 === 0) {
      var timesToUpdatePosition = window.performance.getEntriesByName('measure_frame_duration');
      logAverageFrame(timesToUpdatePosition);
    }


    function logAverageFrame(times) {
    // Logs the average amount of time per 10 frames needed to move the sliding
    // background pizzas on scroll. Parameter times will be an array of User Timing
    // measurements passed in by updatePositions.

      var numberOfEntries, sum;

      numberOfEntries = times.length;
      sum = 0;

      for (i = numberOfEntries - 1; i > numberOfEntries - 11; i--) {
        sum = sum + times[i].duration;
      }
      console.log('Average scripting time to generate last 10 frames: ' + sum / 10 + 'ms');
    }
  }
};


console.log("creating the menu");
pizzeriaMenuApp.createPizzaMenu();

console.log("creating resize control");
pizzeriaMenuApp.createResizerControl();

console.log("setting the scroll handler");
pizzeriaMenuApp.setScrollHandler();

console.log("creating background pizzas");
pizzeriaMenuApp.createBackgroundPizzas();

document.addEventListener('DOMContentLoaded', main);



function main() {
  var model, view, controller;


  controller = {
    currentViewCat: undefined,

    init: function() {
    // Initialize model, initialize view, add click listeners on the name divs,
    // and finally add click listener on central image.

      var index, length, catNameDivs, catImageElem;

      model.init();
      view.init();

      catNameDivs = view.getCatNameDivs();
      length = catNameDivs.length;
      for (index = 0; index < length; index++) {
        catNameDivs[index].addEventListener(
          'click', controller.changeViewCat
        );
      }

      catImageElem = view.getCatImageElem();
      catImageElem.addEventListener('click', controller.updateClickCount);
    },

    changeViewCat: function() {
    // This is the handler for clicking on a Cat Name Div. It will change the
    // central cat image to the correct image corresponding to the div that was
    // clicked.

      var newViewCatName, newViewCat;

      newViewCatName = this.id;
      newViewCat = model.getCat(newViewCatName);

      controller.currentViewCat = newViewCatName;

      view.renderViewCat(newViewCat);
    },

    updateClickCount: function() {
    // This is the handler for clicking on the Central Cat Image. It will tell
    // the model the cat has another click, then it will tell the view to re-
    // render the text on the page with the correct number of clicks.

      var currentCat, updatedCat;

      currentCat = controller.currentViewCat;

      model.clickCat(currentCat);
      updatedCat = model.getCat(currentCat);

      view.updateViewCatClicks(updatedCat.name, updatedCat.clicks);
    }
  };


  view = {

    init: function() {
    // Creates all the references view will ever need, stores them in the "view"
    // object, and sets the Central Cat Image ("view cat") to the first cat.

      this.leftPanel = document.getElementById('left-panel');
      this.rightPanel = document.getElementById('right-panel');
      this.catImageElem = view.leftPanel.getElementsByClassName('cat-image')[0];
      this.catNameElem = view.leftPanel.getElementsByClassName('cat-name')[0];
      this.counterElem = view.leftPanel.getElementsByClassName('click-counter')[0];
      this.catNameDivs = view.rightPanel.getElementsByClassName('cat-selector');

      controller.changeViewCat.call(view.catNameDivs[0]);
    },

    renderViewCat: function(newViewCat) {
    // Sets the view cat with the correct name, image, and click text. Used when
    // a new cat is selected for viewing.

      view.catNameElem.textContent = 'This is ' + newViewCat.name + '.';
      view.catImageElem.src = './' + newViewCat.imageFile;
      view.counterElem.textContent = 'You have clicked on ' + newViewCat.name +
        ' ' + newViewCat.clicks + ' times.';
    },

    updateViewCatClicks: function(catName, newClicks) {
    // Updates the click text. Used when the current view cat is clicked.

      view.counterElem.textContent = 'You have clicked on ' + catName + ' ' +
        newClicks + ' times.';
    },

    getCatNameDivs: function() {
      return view.catNameDivs;
    },

    getCatImageElem: function() {
      return view.catImageElem;
    }

  };


  model = {
    init: function() {
      var data;

      if (!localStorage.catClickerData) {
        data = {
          cats: {
            timmy: {
              name: 'Timmy',
              imageFile: './img/cat1.jpg',
              clicks: 0
            },

            tommy: {
              name: 'Tommy',
              imageFile: './img/cat2.jpg',
              clicks: 0
            },

            joey: {
              name: 'Joey',
              imageFile: './img/cat3.jpg',
              clicks: 0
            },

            robby: {
              name: 'Robby',
              imageFile: './img/cat4.jpg',
              clicks: 0
            },

            johnny: {
              name: 'Johnny',
              imageFile: './img/cat5.jpg',
              clicks: 0
            }
          }
        };

        window.localStorage.catClickerData = JSON.stringify(data);
      }
    },

    getCat: function(name) {
      return JSON.parse(window.localStorage.catClickerData).cats[name];
    },

    clickCat: function(catName) {
      var allData, thisCat;

      allData = JSON.parse(window.localStorage.catClickerData);
      thisCat = allData.cats[catName];
      thisCat.clicks += 1;
      allData.cats[catName] = thisCat;

      window.localStorage.catClickerData = JSON.stringify(allData);
    }

  };

  controller.init();
}

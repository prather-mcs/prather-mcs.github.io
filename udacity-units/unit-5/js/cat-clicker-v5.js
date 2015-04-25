document.addEventListener('DOMContentLoaded', main);



function main() {
  var model, view, controller;


  controller = {
    currentViewCatName: undefined,
    adminMode: false,

    init: function() {
      // Initialize model, initialize view, add click listeners on the name divs,
      // then add a click listener on central image, and finally add click
      // on the admin buttons.

      var index, length, catNameDivs, catImageElem, adminToggleButton,
      adminSaveButton, adminCancelButton;

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

      adminToggleButton = view.getAdminModeButton();
      adminToggleButton.addEventListener('click', controller.adminModeToggle);

      adminSaveButton = view.getSaveButton();
      adminSaveButton.addEventListener('click', controller.adminUpdate);

      adminCancelButton = view.getCancelButton();
      adminCancelButton.addEventListener('click', controller.adminModeToggle);
    },

    changeViewCat: function() {
      // This is the handler for clicking on a Cat Name Div. It will change the
      // central cat image to the correct image corresponding to the div that was
      // clicked.

      var newViewCatName, newViewCat;

      newViewCatName = this.id;
      newViewCat = model.getCat(newViewCatName);

      controller.currentViewCatName = newViewCatName;

      view.renderViewCat(newViewCat);
    },

    updateClickCount: function() {
      // This is the handler for clicking on the Central Cat Image. It will tell
      // the model the cat has another click, then it will tell the view to re-
      // render the text on the page with the correct number of clicks.

      var currentCatName, updatedCat;

      currentCatName = controller.currentViewCatName;

      model.updateDataOnClick(currentCatName);
      updatedCat = model.getCat(currentCatName);

      view.updateViewCatClicks(updatedCat.name, updatedCat.clicks);
    },

    adminModeToggle: function() {
      // This is the handler for clicking on the "Admin Mode" div/button. It will
      // hide the div/button and show the Admin Panel, or vice versa.

      if (controller.adminMode) {
        view.adminModeOff();
      } else {
        view.adminModeOn();
      }

      controller.adminMode = !controller.adminMode;
    },

    adminUpdate: function() {
      var currentCatName, updatedCat, nameData, imageURLData, clicksData;

      currentCatName = controller.currentViewCatName;
      nameData = view.getInputName().value;
      imageURLData = view.getInputImageURL().value;
      clicksData = view.getInputClicks().value;

      model.updateDataOnAdminSave(currentCatName, nameData, imageURLData, clicksData);
      updatedCat = model.getCat(currentCatName);

      view.renderViewCat(updatedCat);
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
      this.adminModeButton = document.getElementById('admin-button');
      this.adminPanel = document.getElementById('admin-div');
      this.adminSave = document.getElementById('save-button');
      this.adminCancel = document.getElementById('cancel-button');
      this.nameInput = document.getElementById('input-name');
      this.imageURLInput = document.getElementById('input-image');
      this.clicksInput = document.getElementById('input-clicks');

      controller.changeViewCat.call(view.catNameDivs[0]);
    },

    renderViewCat: function(viewCat) {
      // Sets the view cat with the correct name, image, and click text. Used when
      // a new cat is selected for viewing.

      var name, imageURL,clicks;

      name = viewCat.name;
      imageURL = viewCat.imageURL;
      clicks = viewCat.clicks;

      view.catNameElem.textContent = 'This is ' + viewCat.name + '.';
      view.catImageElem.src = viewCat.imageURL;
      view.counterElem.textContent = 'You have clicked on ' + viewCat.name +
      ' ' + viewCat.clicks + ' times.';

      view.nameInput.value = name;
      view.imageURLInput.value = imageURL;
      view.clicksInput.value = clicks;
    },

    updateViewCatClicks: function(catName, newClicks) {
      // Updates the click text. Used when the current view cat is clicked.

      view.counterElem.textContent = 'You have clicked on ' + catName + ' ' +
      newClicks + ' times.';

      view.clicksInput.value = newClicks;
    },

    adminModeOn: function() {
      view.adminModeButton.style.display = 'none';
      view.adminPanel.style.display = 'block';
      // view.adminPanel.style = "display: block";
      // view.adminModeButton.style = "display: none";
    },

    adminModeOff: function() {
      view.adminModeButton.style.display = 'block';
      view.adminPanel.style.display = 'none';
      // view.adminModeButton.style = 'display: block';
      // view.adminPanel.style = "display: none";
    },

    getCatNameDivs: function() {
      return view.catNameDivs;
    },

    getCatImageElem: function() {
      return view.catImageElem;
    },

    getAdminModeButton: function() {
      return view.adminModeButton;
    },

    getAdminPanel: function() {
      return view.adminPanel;
    },

    getSaveButton: function() {
      return view.adminSave;
    },

    getCancelButton: function() {
      return view.adminCancel;
    },

    getInputName: function() {
      return view.nameInput;
    },

    getInputImageURL: function() {
      return view.imageURLInput;
    },

    getInputClicks: function() {
      return view.clicksInput;
    }
  };


  model = {
    init: function() {
      var data;

      if (!localStorage.catClickerData) {
        data = {
          cats: {
            Timmy: {
              name: 'Timmy',
              imageURL: './img/cat1.jpg',
              clicks: 0
            },

            Tommy: {
              name: 'Tommy',
              imageURL: './img/cat2.jpg',
              clicks: 0
            },

            Joey: {
              name: 'Joey',
              imageURL: './img/cat3.jpg',
              clicks: 0
            },

            Robby: {
              name: 'Robby',
              imageURL: './img/cat4.jpg',
              clicks: 0
            },

            Johnny: {
              name: 'Johnny',
              imageURL: './img/cat5.jpg',
              clicks: 0
            }
          }
        };

        window.localStorage.catClickerData = JSON.stringify(data);
      }
    },

    updateDataOnClick: function(catName) {
      var allData, thisCat;

      allData = JSON.parse(window.localStorage.catClickerData);

      thisCat = allData.cats[catName];
      thisCat.clicks += 1;
      allData.cats[catName] = thisCat;

      window.localStorage.catClickerData = JSON.stringify(allData);
    },

    updateDataOnAdminSave: function(catName, catName, catImageURL, catClicks) {
      var allData, thisCat;

      allData = JSON.parse(window.localStorage.catClickerData);
      thisCat = allData.cats[catName];

      thisCat.name = catName;
      thisCat.imageURL = catImageURL;
      thisCat.clicks = parseInt(catClicks, 10);

      allData.cats[catName] = thisCat;
      window.localStorage.catClickerData = JSON.stringify(allData);
    },

    getCat: function(name) {
      return JSON.parse(window.localStorage.catClickerData).cats[name];
    }
  };

  controller.init();
}

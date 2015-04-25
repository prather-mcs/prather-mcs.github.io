document.addEventListener('DOMContentLoaded', catClicker);

var functionReferences = [];

function catClicker() {
  var leftPanel = document.getElementById('left-panel'),
      rightPanel = document.getElementById('right-panel'),
      catNameElem = leftPanel.getElementsByClassName('cat-name')[0],
      catImageElem = leftPanel.getElementsByClassName('cat-image')[0],
      counterElem = leftPanel.getElementsByClassName('click-counter')[0],
      catSelectorDivs = rightPanel.getElementsByClassName('cat-selector'),
      index, length;


  length = catSelectorDivs.length;
  for (index = 0; index < length; index++) {
    addClickListenersRight(catSelectorDivs[index], index);
  }

  catSelectorDivs[0].dispatchEvent(new Event('click', {}));


  function addClickListenersRight(div, index) {
    var catName = div.id,
        catImageFile = 'cat' + (index + 1) + '.jpg',
        catClicks = 0;


    div.addEventListener('click', changeCatContext);

    function changeCatContext() {
      functionReferences.forEach(function(ref) {
        catImageElem.removeEventListener('click', ref);
      });
      functionReferences = [];


      catNameElem.textContent = 'This is ' + catName + '.';
      catImageElem.src = './img/' + catImageFile;
      counterElem.textContent = 'You have clicked on ' + catName + ' ' + catClicks + ' times.';
      catImageElem.addEventListener('click', updateClickCount);
      functionReferences.push(updateClickCount);
    }

    function updateClickCount() {
      catClicks += 1;
      counterElem.textContent = 'You have clicked on ' + catName + ' ' + catClicks + ' times.';
    }
  }
}

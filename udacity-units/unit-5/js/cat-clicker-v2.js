document.addEventListener('DOMContentLoaded', catClicker);


function catClicker() {
  var leftCatDiv = document.getElementById('left-cat'),
      rightCatDiv = document.getElementById('right-cat');

  function addClickListener(div) {
    var catImage = div.getElementsByClassName('cat')[0],
    counterBox = div.getElementsByClassName('counter-p')[0],
    catClicks = 0;

    counterBox.innerHTML = 'You have clicked on this cat ' + catClicks + ' times.';

    catImage.addEventListener('click', function() {
      catClicks++;
      counterBox.innerHTML = 'You have clicked on this cat ' + catClicks + ' times.';

    });
  }

  addClickListener(leftCatDiv);
  addClickListener(rightCatDiv);
}

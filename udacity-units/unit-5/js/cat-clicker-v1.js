document.addEventListener('DOMContentLoaded', catClicker);


function catClicker() {
  var catContainer = document.getElementById('main'),
      catImage = document.getElementById('cat'),
      counterBox = document.getElementById('counter-p'),
      catClicks = 0;

  counterBox.innerHTML = 'You have clicked on this cat ' + catClicks + ' times.';

  catImage.addEventListener('click', function() {
    catClicks++;
    counterBox.innerHTML = 'You have clicked on this cat ' + catClicks + ' times.';
  });

}

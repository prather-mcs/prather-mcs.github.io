/**
 * app.js
 *
 * This is the main JavaScript logic for our RSS feed reader application. It
 * uses the Google Feed Reader API to grab RSS feeds as a JSON object. It also
 * uses the Handlebars templating library, and jQuery.
 */


// Define foundational data object for this app. It defines the sources for the
// RSS feeds.
window.allFeeds = [
  {
    name: 'Udacity Blog',
    url: 'http://blog.udacity.com/feeds/posts/default?alt=rss'
  },

  {
    name: 'CSS Tricks',
    url: 'http://css-tricks.com/feed'
  },

  {
    name: 'HTML5 Rocks',
    url: 'http://feeds.feedburner.com/html5rocks'
  },

  {
    name: 'Linear Digressions',
    url: 'http://feeds.feedburner.com/udacity-linear-digressions'
  }
];


// Load the Feed Reader API.
google.load('feeds', '1');

// Call getInitialFeed after Feed Reader library loads.
google.setOnLoadCallback(getInitialFeed);

// Call initializeApp after browser ready event.
$(initializeApp);





/* Below this point, only function definitions exist. (No more invoked code.) */



function getInitialFeed() {
// This function starts up our application. The Google Feed Reader API is loaded
// asynchonously and will then call this function when the API is loaded.

  // Load the first feed found in the allFeeds data array.
  loadFeed(0);
}


function loadFeed(id, cb) {
// This function performs everything necessary to load a feed using the Google
// Feed Reader API. It will then perform all of the DOM operations required to
// display feed entries on the page. Feeds are referenced by their index
// position within the allFeeds array.
//
// This function all supports a callback as the second parameter which will be
// called after everything has run successfully. The Jasmine spec runner will
// utilize this callback parameter.

  var feedUrl = window.allFeeds[id].url,
    feedName = window.allFeeds[id].name,
    feed = new google.feeds.Feed(feedUrl);

  // Load the feed using the Google Feed Reader API.
  // Once the feed has been loaded, the callback function is executed.
  feed.load(feedLoadHandler);

  function feedLoadHandler(result) {
    if (result.error) {
      // Record presence of error within the Feed data Object.
      window.allFeeds[id].urlLoadError = true;
    }

    else {
      var $feed = $('.feed'),
        $headerTitle = $('.header-title'),
        entries = result.feed.entries,
        entryTemplate = Handlebars.compile($('.tpl-entry').html());

      // The app's headline will be the name of the feed.
      $headerTitle.html(feedName);

      // Clear old feed news items from the app's body.
      $feed.empty();

      // Populate the news items part of the app.
      entries.forEach(function(entry) {
        $feed.append(entryTemplate(entry));
      });
    }

    if (cb) {
      cb();
    }
  }
}


function initializeApp() {
  var $feedList = $('.feed-list'),
    feedItemTemplate = Handlebars.compile($('.tpl-feed-list-item').html()),
    feedId = 0,
    $menuIconLink = $('.menu-icon-link');

  window.allFeeds.forEach(function(feed) {
    // Assign incrementally-increasing integer id property to each feed object.
    feed.id = feedId;

    // Then pass object to Handlebars template and append result to feed list.
    $feedList.append(feedItemTemplate(feed));

    feedId++;
  });


  // When any <a> in the Feed List <ul> element is clicked, hide the whole
  // menu, and load the feed of the item in the <ul> that was clicked.
  $feedList.on('click', 'a', function() {
    var item = $(this);

    $('body').addClass('menu-hidden');
    loadFeed(item.data('id'));

    // Prevent default action for click event.
    return false;
  });


  // Toggle Feed List menu open/closed if its icon is clicked.
  $menuIconLink.on('click', function() {
    $('body').toggleClass('menu-hidden');
  });

}

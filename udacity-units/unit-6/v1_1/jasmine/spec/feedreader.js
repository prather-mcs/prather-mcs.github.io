/**
 * feedreader.js
 *
 * This is the specification file that Jasmine uses to test app.js.
 */


 // Use jQuery to execute feedReaderTests only after browser ready event.
 $(feedReaderTests);





/* Below this point, only function definitions exist. (No more invoked code.) */



function feedReaderTests() {

  describe('RSS Feeds:', function() {
    var feeds = window.allFeeds;


    // The allFeeds array should be defined, and should not be empty.
    it('-are defined within one Feed data Array', function() {
      expect(feeds).toBeDefined();
      expect(feeds.length).not.toBe(0);
    });


    // Each Feed data Object should have a valid and non-empty name property.
    it('-each have names', function() {
      feeds.forEach(function(feed) {
        expect(feed.name).toBeDefined();
        expect(typeof feed.name).toBe('string');
        expect(feed.name.length).not.toBe(0);
      });
    });


    // Each Feed data Object should have a valid and non-empty URL property.
    it('-each have non-empty strings for a URL', function() {
     feeds.forEach(function(feed) {
       expect(feed.url).toBeDefined();
       expect(typeof feed.url).toBe('string');
       expect(feed.url.length).not.toBe(0);
     });
    });


    // All URL strings should successfully resolve with the Google Feed API.
    it('-each source URL produces a valid HTTP response', function(done) {
      var numberOfFeeds = feeds.length,
        numberOfFeedsLoaded = 0,
        noBadUrls = true;

      feeds.forEach(function(feed) {
        window.loadFeed(feed.id, readyCheckUrlsValid);
      });

      function readyCheckUrlsValid() {
        numberOfFeedsLoaded++;

        if (numberOfFeedsLoaded < numberOfFeeds) {
          return;
        }

        else {
          feeds.forEach(function(feed) {
            // A `urlLoadError` value was saved for any feed with an error in
            // its response object from the Feed API.
            if (feed.urlLoadError) {
              noBadUrls = false;
            }
          });

          expect(noBadUrls).toBe(true);

          done();
        }
      }
    });


    afterAll(function() {
      window.loadFeed(0);
    });


  });


  describe('The Menu:', function() {
    var $body = $('body'),
      $menuIconLink = $('.menu-icon-link'),
      $menu = $('.menu');


    // The menu must be initially hidden.
    it('-is hidden by default', function() {
     expect($body.hasClass('menu-hidden')).toBe(true);
    });


    // The .menu-hidden class must be toggled when the menu icon is clicked.
    it('-toggles "hidden" class when clicked', function() {
     $menuIconLink.trigger('click');
     expect($body.hasClass('menu-hidden')).toBe(false);

     $menuIconLink.trigger('click');
     expect($body.hasClass('menu-hidden')).toBe(true);
    });


    // The menu must actually move when clicked.
    it('-truly moves on and off the screen when clicked', function(done) {
      $menuIconLink.trigger('click');

      window.setTimeout(measureFirstPosition, 500);

      function measureFirstPosition() {
        var menuLeftPosition = $menu.offset().left;

        expect(menuLeftPosition).not.toBeLessThan(0);

        $menuIconLink.trigger('click');

        window.setTimeout(measureSecondPosition, 500);
      }

      function measureSecondPosition() {
        var menuLeftPosition = $menu.offset().left;

        expect(menuLeftPosition).toBeLessThan(0);

        done();
      }
    });


  });


  describe('Initial Entries:', function() {


    beforeEach(function(done) {
      window.loadFeed(0, done);
    });


    // After the loadFeed function completes its work, there must be at least a
    // single .entry element within the .feed container.
    it('-are produced on first run', function() {
      expect($('.feed .entry').length).not.toBe(0);
    });


  });


  describe('New Feed Selection:', function() {
    var previousFeedTitle, newFeedTitle,
      previousFeedLink, newFeedLink,
      previousContent, newContent;

    var feeds = window.allFeeds,
      numberOfFeeds = feeds.length,
      numberOfFeedsLoaded = 0,
      contentAlwaysChanges = true;


    it('-produces new entries for every feed source', function(done) {
      feeds.forEach(function(feed) {
        window.loadFeed(feed.id, readyCheckNewContent);
      });

      function readyCheckNewContent() {
        numberOfFeedsLoaded++;

        if (!previousContent) {

          // This should resolve to a string containing the entire html content
          // of the feed section:
          previousContent = $('.feed').html();

          // Should resolve to something like "Udacity Blog":
          previousFeedTitle = $('.header-title').text();

          // Should resolve to something like "http://blog.udacity.com/abcdefg":
          previousFeedLink = $('.feed .entry-link')[0].href;

        }

        else {
          previousContent = newContent;
          previousFeedTitle = newFeedTitle;
          previousFeedLink = newFeedLink;

          newContent = $('.feed').html();
          newFeedTitle = $('.header-title').text();
          newFeedLink = $('.feed .entry-link')[0].href;

          // Comparing just one of any pair of these following values can be
          // considered "enough" of a check. Thus this is overkill. However,
          // there may be unusual cases where the comparison either gives a
          // false-positive or false-negative result. I.e.: different blogs may
          // report a story with the same title, so the current and new titles
          // will match, which will create a false-positive in the following
          // test. Blogs almost always link to their own domain in the RSS feed,
          // even when they report a story with the same title, so comparing
          // current and new feed links should be more robust than comparing
          // titles. However, even this is not a certain test, and it is
          // conceivable that comparing previous and new links could create a
          // false-positive. Comparing the html content of the entire $('.feed')
          // should work for most cases, however there may be a case where it
          // results in a false-negative, and allows virtually the same content
          // to pass, with `contentAlwaysChanges === true` due to some
          // insignficant change. There is no easy and perfect test we can run
          // to determine if the content has truly changed as a Feed Reader App
          // ought to change it, I'm using three pairs of comparisons. Therefore
          // this test spec will be likely to hit a false-positive some day.
          // However, we can deal with that situation when it arises.
          if (previousContent === newContent ||
            previousFeedTitle === newFeedTitle ||
            previousFeedLink === newFeedLink) {
            contentAlwaysChanges = false;
          }
        }

        if (numberOfFeedsLoaded >= numberOfFeeds) {
          expect(contentAlwaysChanges).toBe(true);
          done();
        }
      }
    });


    afterAll(function() {
      window.loadFeed(0);
    });


  });

}

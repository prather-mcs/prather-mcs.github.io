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
      $menu = $('.slide-menu');


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
          newContent = $('.feed').html();

          // Should resolve to something like "Udacity Blog":
          newFeedTitle = $('.header-title').text();

          // Should resolve to something like "http://blog.udacity.com/abcdefg":
          newFeedLink = $('.feed .entry-link')[0].href;

          previousContent = true;
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
          //
          // Another potential fault of this implementation of the spec is that
          // if identical feed URLs ever get placed in the allFeeds Array, this
          // spec should (but might not!) fail. It might not fail if the
          // asynchronous results of loadFeed for the identical URLs come back
          // at far-enough intervals that a different feed has loaded in
          // between. But even if this test merely compares "current" and "new"
          // loadFeed() results, when it could more robustly compare new results
          // against every previous result in a cache of all previous results, I
          // say it is good enough for the purpose of checking that loadFeed
          // does get new results for each feed loaded. In any case, the app is
          // not in error if it gets identical results for identical URLs.
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


  describe('Add New Feed Interface:', function() {
    // These variables based on DOM queries will need to exist to test whether
    // the Feed Reader App has a properly-functioning "Add New Feed" feature.
    var $addFeedButton = $('button.add-feed-button'),
      $addFeedForm = $('form.add-feed'),
      $saveNewFeedButton = $('button.save-new-feed'),
      previousNumberOfFeeds = window.allFeeds.length;


    it('-exists', function() {
      expect($addFeedButton.length).not.toBe(0);
      expect($addFeedForm.length).not.toBe(0);
    });


    // This spec works in a similar way to the "The Menu truly moves on and off
    // the screen when clicked" spec. It can only succed if a form queried by
    // $('form.add-feed') exists and exists somewhere visible in the document
    // body.
    it('-opens the "Add Feed" form window when clicked', function(done) {
      $addFeedButton.trigger('click');
      window.setTimeout(addFeedButtonTester, 500);

      function addFeedButtonTester() {
        var formLeftPosition, formTopPosition;
        var formInRightPlace = false;

        if ($addFeedForm.offset()) {
          formLeftPosition = $addFeedForm.offset().left;
          formTopPosition = $addFeedForm.offset().top;

          if (formLeftPosition >= 0 && formTopPosition >= 0) {
            formInRightPlace = true;
          }
        }

        expect(formInRightPlace).toBe(true);

        done();
      }
    });


    it('-closes the "Add Feed" form window when save button is clicked', function(done) {
      $saveNewFeedButton.trigger('click');

      // These following commented-out lines would make the next spec ("Add New
      // Feed Interface adds new feed data object to allFeeds array") pass if
      // they executed, however it's not appropriate for Jasmine to invoke them,
      // because it should be the job of the app to update its own data:

      // var newFeedName = $('form .new-name-field').val() || 'default name';
      // var newFeedUrl = $('form .new-url-field').val() || 'default url';
      // window.allFeeds.push({name: newFeedName, url: newFeedUrl});

      window.setTimeout(saveNewFeedButtonTester, 500);

      function saveNewFeedButtonTester() {
        var formLeftPosition, formTopPosition;
        var formInRightPlace = false;

        if ($addFeedForm.offset()) {
          formLeftPosition = $addFeedForm.offset().left;
          formTopPosition = $addFeedForm.offset().top;

          if (formLeftPosition < 0 && formTopPosition < 0) {
            formInRightPlace = true;
          }
        }

        expect(formInRightPlace).toBe(true);

        done();
      }
    });


    it('-adds new feed data object to allFeeds Array when save button is clicked', function() {
      expect(window.allFeeds.length).toBe(previousNumberOfFeeds + 1);
    });


  });

}

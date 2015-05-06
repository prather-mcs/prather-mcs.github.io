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
    it('-are defined within one Feed Data Array', function() {
      expect(feeds).toBeDefined();
      expect(feeds.length).not.toEqual(0);
    });

    // Each Feed data Object should have a valid and non-empty URL property.
    it('-each have non-empty strings for a URL', function() {
     feeds.forEach(function(feed) {
       expect(feed.url).toBeDefined();
       expect(typeof feed.url).toEqual('string');
       expect(feed.url.length).not.toEqual(0);
     });
    });


    // Each Feed data Object should have a valid and non-empty name property.
    it('-each have names', function() {
      feeds.forEach(function(feed) {
        expect(feed.name).toBeDefined();
        expect(typeof feed.name).toEqual('string');
        expect(feed.name.length).not.toEqual(0);
      });
    });

  });


  describe('The Menu:', function() {
    var $body = $('body'),
      $menuIconLink = $('.menu-icon-link');

    // The menu must be initially hidden.
    it('-is hidden by default', function() {
     expect($body.hasClass('menu-hidden')).toEqual(true);
    });

    // The .menu-hidden class must be toggled when the menu icon is clicked.
    it('-toggles "hidden" class when clicked', function() {
     $menuIconLink.trigger('click');
     expect($body.hasClass('menu-hidden')).toEqual(false);

     $menuIconLink.trigger('click');
     expect($body.hasClass('menu-hidden')).toEqual(true);
    });
  });


  describe('Initial Entries:', function() {
    beforeEach(function(done) {
      window.loadFeed(0, done);
    });

    // After the loadFeed function completes its work, there must be at least a
    // single .entry element within the .feed container.
    it('-are produced on first run', function() {
      expect($('.feed .entry').length).not.toEqual(0);
    });
  });


  // Write a new test suite named "New Feed Selection"
  describe('New Feed Selection:', function() {
    var contentBefore, contentAfter;

    beforeEach(function(done) {
      window.loadFeed(0, done);
    });

    it('-updates content when a new feed is loaded', function(done) {
      contentBefore = $('.feed').html();

      window.loadFeed(1, function() {
        contentAfter = $('.feed').html();

        expect(contentBefore).not.toEqual(contentAfter);

        done();
      });
    });

    afterAll(function() {
      window.loadFeed(0);
    });
  });
}

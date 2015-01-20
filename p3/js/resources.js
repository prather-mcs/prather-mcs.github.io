/**
 * This anonymous function is immediately invoked, following its definition, in
 * an expression. It will create a global variable "Resources" that will
 * provide access to four "public" methods which are themsleves able to access
 * all of this anonymous function's variables and functions, through
 * JavaScript's "closure" scoping capacity.
 */
(function() {
  var resourceCache = {},
      loading = [],
      readyCallbacks = [];

  /**
   * Uses the private load_ function to prepare Images for the Canvas.
   * @param {string|Array.<string>} urlOrArr One or more URL paths to image
   *     files, which are to be loaded as new Image objects.
   */
  function load(urlOrArr) {

    if(urlOrArr instanceof Array) {
      // the input was an Array; call load_ on every member of it
      urlOrArr.forEach(function(url) {
        load_(url);
      });
    } else {
      // else just load_ the single URL input
      load_(urlOrArr);
    }
  }

  /**
   * This will usually return an Image object from the resourceCache Object.
   * If the Image object has never been loaded before, then this function will
   * create it and take some further necessary actions.
   * @private
   * @param url {string} This string will serve double duty, first as the URL /
   *     filepath of an Image to be loaded, and then as the name used to refer
   *     to that Image in the resourceCache Object.
   * @return {(Image|undefined)} Either returns an Image Object or takes other
         actions and returns nothing.
   */
  function load_(url) {
    var img;

    if (resourceCache[url]) {
      // This is the simple case where the Image has been loaded before.
      return resourceCache[url];
    }
    else {
      // This is the case where the Image has not been loaded before.
      img = new Image();

      img.src = url;

      resourceCache[url] = false;

      /**
       * When the Image is loaded, this function will fun. First, it will change
       * the value of the new Image's name/URL in the cache Object from `false`
       * to the Image Object which has just loaded. Then it will run the isReady
       * function, which checks every Object in the cache to see if every one is
       * ready. This works because Objects are placed in the cache with the
       * name-property value `false` by default, then the property `false` is
       * changed to the Image Object after the Image's "load" event fires.
       *
       * If isReady() returns `true`, then we invoke every function in the
       * readyCallbacks array.
       */
      img.onload = function() {
        resourceCache[url] = img;

        if(isReady()) {
          readyCallbacks.forEach(function(func) { func(); });
        }
      };
    }
  }


  /**
   * Gets an Image Object from the cache Object.
   * @param url {string} The name of the Image.
   * @return {Image}
   */
  function get(url) {
    return resourceCache[url];
  }


  /**
   * There is a significant gap in time between the time when an Image is
   * ordered to be created and when it finishes loading. Many Images may be
   * ordered to be created and placed in the cache, but they will all be
   * finished only at some later time. This function checks whether they have
   * all loaded.
   * @return {boolean} Whether every Image in the cache Object has been loaded.
   */
  function isReady() {
    var ready = true;

    for (var k in resourceCache) {
      if(resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
          ready = false;
      }
    }

    return ready;
  }

  /**
   * This function will add its argument (another function) to a array meant for
   * holding functions that need all Images to be loaded before they run.
   */
  function onReady(func) {
    readyCallbacks.push(func);
  }

  /**
   * This global object will provide access to the private, closed variables
   * defined here in the top-level anonymous immediately-invoked function
   * expression. It provides such access only through the four functions below.
   */
  window.Resources = {
    load: load,
    get: get,
    onReady: onReady,
    isReady: isReady
  };
})();

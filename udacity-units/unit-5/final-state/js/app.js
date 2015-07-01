if (typeof(google) === 'undefined'
  || typeof($) === 'undefined'
  || typeof(ko) === 'undefined') {
  alert('We\'re sorry, but an error has occurred, which is temporarily ' +
  'preventing any usage of this app. Try again later!');
} else {
  document.addEventListener('DOMContentLoaded', boot);
}


function boot() {
  fourSquareAjax('search', initializePage, null);


  function initializePage(result) {
    var fourSquareVenueData = result.response.venues;

    ko.applyBindings(new KoViewModel(fourSquareVenueData));
  }
}


function fourSquareAjax(apiName, cb, venueIdNum) {
  var fourSquareId = 'CBRIQGYSOPL2UPKGRR5TICNEHQXTCR4KBNOKQ11XCSW5YPK0';
  var fourSquareSecret = 'O2WZ5YMWRAJB2DUDXOG3FQRUYCIKS3SHIYX3MQKL2FYZSHOV';

  var apiUrl;

  switch (apiName) {
    case 'search':
      apiUrl = 'https://api.foursquare.com/v2/venues/search' + '?m=foursquare' +
        '&v=20150601' + '&ll=33.834,-117.914' + '&limit=50' + '&client_id=' +
        fourSquareId + '&client_secret=' + fourSquareSecret;

      $.ajax({
        url: apiUrl,
        error: function() {
          alert('We\'re sorry, but an error has occurred, which is ' +
          'temporarily preventing any usage of this app. Try again later!');
        },
        success: function(response) {
          cb(response);
        }
      });

      break;

    case 'venue':
      apiUrl = 'https://api.foursquare.com/v2/venues/' + venueIdNum +
        '?m=foursquare' + '&v=20140806' + '&client_id=' + fourSquareId +
        '&client_secret=' + fourSquareSecret;

        $.ajax({
          url: apiUrl,
          error: function() {
            alert('We\'re sorry, but an error has occurred, which is ' +
            'temporarily preventing full usage of this app. Try again later!');
          },
          success: function(response) {
            cb(response);
          }
        });

        break;

    default:
      cb();
      break;
  }
}


function KoViewModel(venuesJSON) {
  // The reference `koVmInstance` will be needed where `this` no longer refers
  // to the same instance object:
  var koVmInstance = this;

  this.googleMapObject = generateMap();

  this.allVenues = generateVenues(venuesJSON);

  this.visibleMarkers = ko.observableArray();

  generateMarkers();

  this.infoWindowObject = generateInfoWindow();

  this.showMenu = ko.observable(false);

  this.userSearchInput = ko.observable('');

  this.selectedVenue = ko.observable();

  this.venueImgIndex = ko.observable(0);


  this.toggleMenu = function() {
  // This function is responsible for allowing the "All Places" menu to open and
  // close as the user desires.

    koVmInstance.showMenu(!koVmInstance.showMenu());
    $('#venue-list-toggle-button').toggleClass('open');
  };


  this.cycleInfoWindowPic = function() {
  // This function ensures that the images in an InfoWindow will continuously
  // cycle through all available images.

    var oldIndex = koVmInstance.venueImgIndex();

    var numOfImagesThisVenueHas = koVmInstance.selectedVenue().numberOfImages;

    var newIndex = (oldIndex + 1) % numOfImagesThisVenueHas;

    koVmInstance.venueImgIndex(newIndex);
  };


  this.search = function() {
  // This function is responsible for filtering the places / venues which are
  // displayed, limited by matching keywords with the user's search terms.

    if (!koVmInstance.showMenu()) {
      koVmInstance.toggleMenu();
    }

    koVmInstance.infoWindowObject.close();

    var searchKeyword = koVmInstance.userSearchInput().toLowerCase();

    koVmInstance.visibleMarkers.removeAll();

    koVmInstance.allVenues.forEach(function(venue) {
      venue.marker.setMap(null);

      var i = 0;
      var n = venue.keywords.length;

      // must use regular for-loop, because `forEach` has no "break" statement
      for (; i < n; i++) {
        if (venue.keywords[i].indexOf(searchKeyword) !== -1) {
          koVmInstance.visibleMarkers.push(venue);
          venue.marker.setMap(koVmInstance.googleMapObject);
          break;
        }
      }
    });
  };


  function generateMap() {
  // This function uses Goole Maps JavaScript API functions to initialize the
  // interactive map at the heart of this web app.

    var mapOptions, mapContainerElement;

    mapContainerElement = document.getElementById('map-canvas');

    mapOptions = {
      center: new google.maps.LatLng(33.834, -117.914),
      disableDefaultUI: true,
      draggable: true,
      disableDoubleClickZoom: true,
      minZoom: 5,
      scrollwheel: false,
      streetViewControl: false,
      zoom: 17,
      panControl: false,
      panControlOptions: {
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
        style: google.maps.ZoomControlStyle.LARGE
      },
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
      },
      overviewMapControl: true,
      scaleControl: false
    };

    return new google.maps.Map(mapContainerElement, mapOptions);
  }


  function generateInfoWindow() {
  // An InfoWindow is the dialog that pops up when a place / venue is clicked.

    var infoWindowOptions = {
        content: '',
        maxWidth: 200
    }

    return new google.maps.InfoWindow(infoWindowOptions);
  }


  function generateVenues(fourSquareVenueData) {
  // This function is responsible for generating JavaScript objects which
  // implement all the functionality the web app needs from the place / venues
  // in the neighborhood.

    var Venue = function(obj) {
      var venueInstance = this;

      this.idNumber = obj.id;
      this.venueName = obj.name;
      this.lat = obj.location.lat;
      this.lng = obj.location.lng;

      // The following values will be set when a user clicks on the venue:
      this.fourSquareVenueResponse = undefined;
      this.fourSquareUrl = undefined;
      this.ownUrl = undefined;
      this.imageUrls = [];
      this.numberOfImages = undefined;
      this.infoWindowHtml = undefined;

      // The following value will be set when the `generateMarkers` function
      // runs.
      this.marker = null;

      // The keywords variable is important: it will be an array of all the
      // keywords which should match a venue when the search function is used.
      this.keywords = this.venueName.toLowerCase().split(' ');

      if (obj.categories.length !== 0) {
        obj.categories[0].name.split(' ').forEach(function(keyword) {
          venueInstance.keywords.push(keyword.toLowerCase());
        });
      }
    };


    Venue.prototype.openInfoWindow = function() {
    // This function takes all of the responsibility for generating and
    // displaying the content of the InfoWindow after a place / venue is clicked
    // on.

      // This reference will be needed where `this` no longer refers to the same
      // instance object:
      var venueInstance = this;

      if (!koVmInstance.showMenu()) {
        koVmInstance.toggleMenu();
      }

      koVmInstance.selectedVenue(this);

      koVmInstance.venueImgIndex(0);

      if (this.fourSquareVenueResponse) {
        koVmInstance.infoWindowObject.open(
          koVmInstance.googleMapObject, venueInstance.marker
        );

        koVmInstance.googleMapObject.setCenter(
          venueInstance.marker.getPosition()
        );

        koVmInstance.infoWindowObject.setContent(this.infoWindowHtml);

        ko.applyBindings(koVmInstance, document.getElementById('infoWindow'));
      } else {
        fourSquareAjax('venue', saveVenueInfo, this.idNumber);
      }


      function saveVenueInfo(result) {
      // This function will after when a place / venue is clicked for the first
      // time, and after an Ajax call to FourSquare is made, which queries for
      // information about the venue.

        var resultVenue = result.response.venue;

        venueInstance.fourSquareVenueResponse = result;
        venueInstance.fourSquareUrl = resultVenue.canonicalUrl;
        venueInstance.ownUrl = resultVenue.url;

        var resultPhotos = resultVenue.photos;

        venueInstance.imageUrls = generateImageUrlArray();
        venueInstance.numberOfImages = venueInstance.imageUrls.length;

        var infoWindowHtml = '<div id="infoWindow">' +
          '<div class="venue-name" data-bind="text: $root.selectedVenue().venueName"></div>' +
          '<!-- ko if: $root.selectedVenue().imageUrls.length === 0 -->' +
          '<img class=venue-image src="./img/not-available.jpg">' +
          '<!-- /ko -->' +
          '<!-- ko if: $root.selectedVenue().imageUrls.length === 1 -->' +
          '<img id="infoWindowImg" class="venue-image" data-bind="click: cycleInfoWindowPic, attr: {src: $root.selectedVenue().imageUrls[0]}">' +
          '<!-- /ko -->' +
          '<!-- ko if: $root.selectedVenue().imageUrls.length > 1 -->' +
          '<img id="infoWindowImg" class="venue-image" data-bind="click: cycleInfoWindowPic, attr: {src: $root.selectedVenue().imageUrls[$root.venueImgIndex()]}">' +
          '<div>click on image to see more images</div>' +
          '<!-- /ko -->' +
          '<div class="foursquare-link"><a target="_blank" data-bind="attr: {href: $root.selectedVenue().fourSquareUrl}">more information</a></div>' +
          '</div>';

        venueInstance.infoWindowHtml = infoWindowHtml;

        koVmInstance.infoWindowObject.setContent(venueInstance.infoWindowHtml);

        koVmInstance.infoWindowObject.open(
          koVmInstance.googleMapObject, venueInstance.marker
        );

        ko.applyBindings(koVmInstance, document.getElementById('infoWindow'));

        koVmInstance.googleMapObject.setCenter(
          venueInstance.marker.getPosition()
        );


        function generateImageUrlArray() {
          var output = [];

          var nextPhotoUrl;

          if (resultPhotos.count > 0) {
            resultPhotos.groups.forEach(function(group) {
              group.items.forEach(function(photoObj) {
                nextPhotoUrl = '';

                nextPhotoUrl += photoObj.prefix;
                nextPhotoUrl += '200';
                nextPhotoUrl += photoObj.suffix;

                output.push(nextPhotoUrl);
              });
            });
          }

          return output;
        }
      }
    };

    // The above was necessary to define what a Venue contains and can do. The
    // below is what steps the `generateVenues` function actually does when it
    // is invoked.

    var output = [];

    fourSquareVenueData.forEach(function(venue) {
      output.push(new Venue(venue));
    });

    return output;
  }


  function generateMarkers() {
  // This function uses the Google Maps JavaScript API to place map markers for
  // every place / venue in this neighborhood.

    koVmInstance.allVenues.forEach(function(venue) {
      var markerOptions = {
        map: koVmInstance.googleMapObject,
        position: {lat: venue.lat, lng: venue.lng}
      };

      venue.marker = new google.maps.Marker(markerOptions);

      google.maps.event.addListener(venue.marker, 'click', function() {
        venue.openInfoWindow();
      });

      /*
      you would think this should do the same as the above but it doesn't:
      google.maps.event.addListener(venue.marker, 'click', venue.openInfoWindow);
      */

      koVmInstance.allVenues.forEach(function(venue) {
        koVmInstance.visibleMarkers.push(venue);
      });
    });
  }
}

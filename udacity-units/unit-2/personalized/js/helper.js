/* global google */
/* eslint-env: browser */
/* eslint strict: 0, quotes: 0, no-use-before-define: [2, "nofunc"],
   no-unused-vars: 0, no-undef: 0 */


var HTMLheaderName = '<h1 id="name">%data%</h1>',
  HTMLheaderRole = '<span>%data%</span><hr/>',

  HTMLcontactGeneric = '<li class="flex-item"><span class="orange-text">%contact%</span><span class="white-text">%data%</span></li>',
  HTMLmobile = '<li class="flex-item"><span class="orange-text">mobile</span><span class="white-text">%data%</span></li>',
  HTMLemail = '<li class="flex-item"><span class="orange-text">email</span><span class="white-text">%data%</span></li>',
  HTMLtwitter = '<li class="flex-item"><span class="orange-text">twitter</span><span class="white-text"><a href="https://twitter.com/%data%">%data%</a></span></li>',
  HTMLgithub = '<li class="flex-item"><span class="orange-text">github</span><span class="white-text"><a href="https://github.com/%data%">%data%</a></span></li>',
  HTMLblog = '<li class="flex-item"><span class="orange-text">blog</span><span class="white-text">%data%</span></li>',
  HTMLlocation = '<li class="flex-item"><span class="orange-text">location</span><span class="white-text">%data%</span></li>',

  HTMLbioPic = '<img src="%data%" class="biopic">',
  HTMLWelcomeMsg = '<span class="welcome-message">%data%</span>',

  HTMLskillsStart = '<h3 id="skillsH3">My Skills:</h3><ul id="skills" class="flex-box"></ul>',
  HTMLskills = '<li class="flex-item"><span class="white-text">%data%</span></li>',

  HTMLworkStart = '<div class="work-entry"></div>',
  HTMLworkEmployer = '<a href="#">%data%',
  HTMLworkTitle = ' - %data%</a>',
  HTMLworkDates = '<div class="date-text">%data%</div>',
  HTMLworkLocation = '<div class="location-text">%data%</div>',
  HTMLworkDescription = '<p><br>%data%</p>',

  HTMLprojectStart = '<div class="project-entry"></div>',
  HTMLprojectTitle = '<a href="#">%data%</a>',
  HTMLprojectDates = '<div class="date-text">%data%</div>',
  HTMLprojectDescription = '<p><br>%data%</p>',
  HTMLprojectImage = '<img src="%data%">',

  HTMLschoolStart = '<div class="education-entry"></div>',
  HTMLschoolName = '<a href="#">%data%',
  HTMLschoolDegree = ' &mdash; %data%</a>',
  HTMLschoolDates = '<div class="date-text">%data%</div>',
  HTMLschoolLocation = '<div class="location-text">%data%</div>',
  HTMLschoolMajor = '<em><br>Major: %data%</em>',

  // HTMLonlineClasses = '<h3>Online Education</h3>',
  HTMLonlineTitle = '<a href="#">%data%',
  HTMLonlineSchool = ' - %data%</a>',
  HTMLonlineDates = '<div class="date-text">%data%</div>',
  HTMLonlineURL = '<br><a href="#">%data%</a>',
  HTMLonlineCredential = '<em><br>Credential Earned: %data%</em>',

  internationalizeButton = '<button>Internationalize</button>',
  googleMap = '<div id="map"></div>';


/*
// the following code was used for some practice lessons,
// but it is not really useful after those lessons

var clickLocations = [];

function logClicks(x,y) {
  clickLocations.push({x: x, y: y});
  console.log('x location: ' + x + '; y location: ' + y);
}

$(document).click(function(loc) {
  // console.log(loc);
  logClicks(loc['pageX'], loc['pageY']);
});
*/


/* for the 'Internationalize Button' feature
$(document).ready(function() {
  $('button').click(function() {
    var iName, name;

    name = $('#name').html();
    iName = inName(name) || function(){};

    $('#name').html(iName);
  });
})
*/


var map;

function initializeMap() {
// this function does a lot of work to put a Google Map on the page,
// personalized with the resume information

  var locations, mapOptions;

  mapOptions = {
    disableDefaultUI: true,
    scrollwheel: false,
    zoomControl: true
  };

  map = new google.maps.Map(document.getElementById('map'), mapOptions);


  function locationFinder() {
  // returns an array of locations picked from resume data

    var prop, outputArray;

    outputArray = [];

    outputArray.push(bioData.contacts.location);

    for (prop in educationData['formal']) {
      outputArray.push(educationData['formal'][prop].location);
    }

    for (prop in workData) {
      outputArray.push(workData[prop].location);
    }

    return outputArray;
  }


  function createMapMarker(placeData) {
  // Reads Google Places search results to create map pins. `placeData` is the
  // object returned from search results containing information about a single
  // location.

    var lat, lon, name, bounds, marker;

    // The next lines save location data from the search result object to local variables
    lat = placeData.geometry.location.k;  // latitude from the place service
    lon = placeData.geometry.location.D;  // longitude from the place service
    name = placeData.formatted_address;   // name of the place from the place service
    bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });

    var infoWindow = new google.maps.InfoWindow({
    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.

      content: name
      // pixelOffset:
      // position:
      // maxWidth:
    });

    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(map, marker);
    });

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());
  }


  function callback(results, status) {
  // Makes sure the search returned results for a location. If so, it creates a
  // new map marker for that location.

    if (status === google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0]);
    }
  }


  function pinPoster(locArray) {
  // pinPoster(locations) takes in the array of locations created by
  // `locationFinder` and fires off Google place searches for each location

    var service;

    // Creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    service = new google.maps.places.PlacesService(map);

    // Iterates through the array of locations, creates a search object for each location
    locArray.forEach(function(place) {
      var request = {
        query: place
      };

      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      service.textSearch(request, callback);
    });
  }

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // locations is an array of location strings returned from locationFinder()
  locations = locationFinder();

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
  pinPoster(locations);

}


// Calls the initializeMap() function when the page loads
window.addEventListener('load', initializeMap);

// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
window.addEventListener('resize', function(e) {
  // Make sure the map bounds get updated on page resize
  map.fitBounds(mapBounds);
});

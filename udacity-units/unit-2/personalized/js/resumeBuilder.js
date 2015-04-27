/* global */
/* eslint-env: browser */
/* eslint strict: 0, quotes: 0, no-use-before-define: [2, "nofunc"],
   no-unused-vars: 0, no-undef: 0, dot-notation: 0, curly: 0 */

var bioData, workData, projectsData, educationData;

bioData = {
  name: 'Matt Prather',
  role: 'Front-End Web Application Developer',

  contacts: {
    mobile: 'available by email',
    email: 'prather.mcs (at GMail!)',
    github: 'prather-mcs',
    twitter: '@prather_mcs',
    location: 'Los Angeles'
  },

  picture: './img/fry.jpg',
  welcomeMessage: 'A natural-born programmer, specializing in front-end coding for web applications.',

  skills: [
    'HTML5+',
    'CSS3+',
    'JavaScript'
  ]
};


workData = {
  current: {
    employer: 'Planet Express',
    title: 'Delivery Boy',
    dates: 'January 3000 &ndash; Future',
    location: 'Brooklyn, NY',
    description: 'Who moved my cheese cheesy feet cauliflower cheese. Queso taleggio when the cheese comes out everybody\'s happy airedale ricotta cheese and wine paneer camembert de normandie. Swiss mozzarella cheese slices feta fromage frais airedale swiss cheesecake. Hard cheese blue castello halloumi parmesan say cheese stinking bishop jarlsberg.'
  },

  previous: {
    employer: 'Panucci\'s Pizza',
    title: 'Delivery Boy',
    dates: '1998 &ndash; December 31, 1999',
    location: 'Manhattan, NY',
    description: 'Who moved my cheese cheesy feet cauliflower cheese. Queso taleggio when the cheese comes out everybody\'s happy airedale ricotta cheese and wine paneer camembert de normandie. Swiss mozzarella cheese slices feta fromage frais airedale swiss cheesecake. Hard cheese blue castello halloumi parmesan say cheese stinking bishop jarlsberg.'
  }
};


projectsData = {
  project1: {
    title: 'Sample Project 1',
    dates: '2014',
    description: 'Who moved my cheese cheesy feet cauliflower cheese. Queso taleggio when the cheese comes out everybody\'s happy airedale ricotta cheese and wine paneer camembert de normandie. Swiss mozzarella cheese slices feta fromage frais airedale swiss cheesecake. Hard cheese blue castello halloumi parmesan say cheese stinking bishop jarlsberg.',
    picture: './img/proj1.jpg'
  }
};


educationData = {
  formal: [
    {
      name: 'University of California, Irvine',
      degree: 'B.A.',
      dates: '2001 &ndash; 2005',
      location: 'Irvine, Orange County, California',
      major: 'Economics'
    }
  ],

  online: [
    {
      title: 'Nanodegree',
      school: 'Udacity',
      dates: '2015',
      url: 'https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001',
      credential: 'Front-End Web Development'
    }
  ]

  /*{'name': 'Udacity','courses': ['CS253: Web Development','CS262: Programming Languages','CS101: Intro to Computer Science','UD359: Intro To Data Science','ST101: Introduction To Statistics','ST095: Statistics']}{'name': 'Coursera','courses': ['fuck-all']}{'name': 'MIT OpenCourseWare','courses': ['fuck-ola']}*/
};


function displayBio(bio) {
  var name = HTMLheaderName.replace('%data%', bio['name']),
    role = HTMLheaderRole.replace('%data%', bio['role']),
    picture = HTMLbioPic.replace('%data%', bio['picture']),
    message = HTMLWelcomeMsg.replace('%data%', bio['welcomeMessage']),
    contacts = bio['contacts'],
    mobile = HTMLmobile.replace('%data%', contacts['mobile']),
    email = HTMLemail.replace('%data%', contacts['email']),
    github = HTMLgithub.replace(/%data%/g, contacts['github']),
    twitter = HTMLtwitter.replace(/%data%/g, contacts['twitter']),
    location = HTMLlocation.replace('%data%', contacts['location']),
    index;

  if (bio.name) {
    if (bio.role) {
      $('#header').prepend(role);
    }

    $('#header').prepend(name);
  }

  if (bio.picture) $('#header').append(picture);

  if (bio.welcomeMessage) $('#header').append(message);

  if (bio.skills.length > 0) {
    $('#header').append(HTMLskillsStart);
    for (index in bio.skills) {
      $('#skills').append(HTMLskills.replace('%data%', bio['skills'][index]));
    }
  }

  if (contacts) {

    if (mobile) {
      $('#topContacts').append(mobile);
      $('#footerContacts').append(mobile);
    }

    if (email) {
      $('#topContacts').append(email);
      $('#footerContacts').append(email);
    }

    if (github) {
      $('#topContacts').append(github);
      $('#footerContacts').append(github);
    }

    if (twitter) {
      $('#topContacts').append(twitter);
      $('#footerContacts').append(twitter);
    }

    if (location) {
      $('#topContacts').append(location);
      $('#footerContacts').append(location);
    }
  }
}


function displayWork(work) {
  var job, name,
      employer, title, dates, location, description;

  if (Object.keys(work).length > 0) {
    for (name in work) {
      job = work[name];
      employer = HTMLworkEmployer.replace('%data%', job['employer']);
      title = HTMLworkTitle.replace('%data%', job['title']);
      dates = HTMLworkDates.replace('%data%', job['dates']);
      location = HTMLworkLocation.replace('%data%', job['location']);
      description = HTMLworkDescription.replace('%data%', job['description']);

      $('#workExperience').append(HTMLworkStart);

      if (employer) {
        if (!title) {
          $('.work-entry:last').append(employer);
        } else {
          $('.work-entry:last').append(employer + title);
        }
      }

      if (dates) $('.work-entry:last').append(dates);

      if (location) $('.work-entry:last').append(location);

      if (description) $('.work-entry:last').append(description);
    }
  }
}


function displayProjects(projects) {
  var name, proj,
      title, dates, description, picture;

  if (Object.keys(projects).length > 0) {
    for (name in projects) {
      proj = projects[name];

      title = HTMLprojectTitle.replace('%data%', proj['title']);
      dates = HTMLprojectDates.replace('%data%', proj['dates']);
      descrip = HTMLprojectDescription.replace('%data%', proj['description']);
      picture = HTMLprojectImage.replace('%data%', proj['picture']);

      $('#projects').append(HTMLprojectStart);

      if (title) $('.project-entry:last').append(title);

      if (dates) $('.project-entry:last').append(dates);

      if (description) $('.project-entry:last').append(descrip);

      if (picture) $('.project-entry:last').append(picture);

      if (picture) $('.project-entry:last').append(picture);
      // to be like the example, the picture is repeated
    }
  }
}


function displayEducation(education) {
  var formals = education['formal'],
      onlines = education['online'],
      name, degree, dates, location, major, title, school, url, credential,
      index;

  if (formals.length > 0) {
    for (index in formals) {
      name = HTMLschoolName.replace('%data%', formals[index]['name']);
      degree = HTMLschoolDegree.replace('%data%', formals[index]['degree']);
      dates = HTMLschoolDates.replace('%data%', formals[index]['dates']);
      location = HTMLschoolLocation.replace('%data%', formals[index]['location']);
      major = HTMLschoolMajor.replace('%data%', formals[index]['major']);

      $('#education').append(HTMLschoolStart);

      if (name && degree) $('.education-entry:last').append(name + degree);

      if (dates) $('.education-entry:last').append(dates);

      if (location) $('.education-entry:last').append(location);

      if (major) $('.education-entry:last').append(major);
    }
  }

  if (onlines.length > 0) {
    // $('#education').append(HTMLonlineClasses);

    for (index in onlines) {
      title = HTMLonlineTitle.replace('%data%', onlines[index]['title']);
      school = HTMLonlineSchool.replace('%data%', onlines[index]['school']);
      dates = HTMLonlineDates.replace('%data%', onlines[index]['dates']);
      url = HTMLonlineURL.replace('%data%', onlines[index]['url']);
      credential = HTMLonlineCredential.replace('%data%', onlines[index]['credential']);

      $('#education').append(HTMLschoolStart);

      if (title && school) $('.education-entry:last').append(title + school);

      if (dates) $('.education-entry:last').append(dates);

      if (url) $('.education-entry:last').append(url);

      if (credential) $('.education-entry:last').append(credential);
    }
  }
}


displayBio(bioData);
displayWork(workData);
displayProjects(projectsData);
displayEducation(educationData);


$('#mapDiv').append(googleMap);


/* for the "Internationalize Button" feature
$('#main').append(internationalizeButton);

function inName(name) {
  name_array = name.split(' ');

  if (name_array.length === 2) {
    return name_array[0] + ' ' + name_array[1].toUpperCase();
  }

  return name
};
*/

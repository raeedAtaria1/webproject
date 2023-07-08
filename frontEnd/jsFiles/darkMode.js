$(document).ready(function() {
  // Check if the user has previously enabled dark mode
  if (getCookie('darkModeEnabled') === 'true') {
    enableDarkMode();
    $('#darkModeToggle').prop('checked', true);
  }

  // Handle the dark mode toggle
  $('#darkModeToggle').change(function() {
    if ($(this).is(':checked')) {
      enableDarkMode();
      setCookie('darkModeEnabled', 'true', 365); // Set cookie to expire in 365 days
    } else {
      disableDarkMode();
      setCookie('darkModeEnabled', 'false', 365);
    }
  });

  // Enable dark mode
  function enableDarkMode() {
    $('body').addClass('dark-mode');
    $('.invert-color').addClass('invert');
  }

  // Disable dark mode
  function disableDarkMode() {
    $('body').removeClass('dark-mode');
    $('.invert-color').removeClass('invert');
  }

  // Set a cookie
  function setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  // Get a cookie value
  function getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }
});

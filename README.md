# DOMContentLoaded
Cross-Browser DOMContentLoaded, with no dependencies.

Tested via BrowserStack with helpful documentation from MDN and various other sites.

Works as soon as the DOM is ready in IE6+, Edge, Chrome 1+, Firefox 1+, Opera 9+, Safari 3.1+, Safari iOS, Samsung Internet, with a fallback to window.onload that works everywhere.

You can use it out of the box like:

DOMContentLoaded(function(e) { 
  // code to execute as soon as the DOM is loaded.
}); 

jQuery Equivalent: $(document).ready(function() { });




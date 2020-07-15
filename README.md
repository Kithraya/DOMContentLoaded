# DOMContentLoaded
Cross-Browser DOMContentLoaded, with no dependencies.

Tested via BrowserStack with helpful documentation from MDN and various other sites.

Works as soon as the DOM is ready in IE6+, Edge, Chrome 1+, Firefox 1+, Opera 9+, Safari 3.1+, Safari iOS, Samsung Internet, with a fallback to window.onload that works everywhere.

Works better than the jQuery equivalent, as jQuery tests for 'onreadystatechange' in browsers that don't report it correctly.

You can use it out of the box like:

```DOMContentLoaded(function(e) { 
  console.log(e.readyDOMTime, e.funcExecuteTime); // 1594793362957, 1594793362958
  // if the DOM has already loaded by the time this function runs, e.readyDOMTime will be null
  
  // code to execute as soon as the DOM is loaded
}); ```

jQuery Equivalent: ``$(document).ready(function() { });``






# DOMContentLoaded
Executes JS as soon as the DOM loads.
Cross-Browser DOMContentLoaded polyfill, with no dependencies.

Tested via BrowserStack with helpful documentation from MDN and various other sites.

Works as soon as the DOM is ready in IE6+, Edge, Chrome 1+, Firefox 1+, Opera 4+, Safari 3.2+, Safari iOS, Samsung Internet, with a fallback to window.onload that works everywhere. And it likely works, although as yet untested, in IE5.5, Safari 1+.

Works better than the jQuery equivalent, as the jQuery fallback tests for 'onreadystatechange' in browsers that will not always report it correctly. jQuery also does not return a time parameter for when the DOM loads.

You can use it out of the box like:

```javascript

DOMContentLoaded(function(e) { 

  // code to execute as soon as the DOM is loaded / accessible
  // if the DOM has already loaded by the time this function runs, e.readyTime will be null
  
  console.log(this, e.readyTime, e.funcExecuteTime); // #document, 1594793362957, 1594793362958
  
  
}, function(e) {
  // separate execution context


}, [....]);

```


jQuery Equivalent: ``1javascript $(document).ready(function() { });``

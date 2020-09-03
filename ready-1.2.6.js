/*! https://github.com/Kithraya/DOMContentLoaded v1.2.6 | MIT License */

DOMContentLoaded.version = "1.2.6";

function DOMContentLoaded() { "use strict";
	
	var ael = 'addEventListener', rel = 'removeEventListener', aev = 'attachEvent', dev = 'detachEvent';
	var alreadyRun = false, // for use in the idempotent function ready()
	    funcs = arguments;
	
	// old versions of JS return '[object Object]' for null.
	function type(obj) { return (obj === null) ? 'null' : Object.prototype.toString.call(obj).slice(8,-1).toLowerCase() }
	function microtime() { return + new Date() } 
	
	 /* document.readyState === 'complete' reports correctly in every browser I have tested, including IE.
		But IE6 to 10 don't return the correct readyState values as per the spec:
		readyState is sometimes 'interactive', even when the DOM isn't accessible in IE6/7 so checking for the onreadystatechange event like jQuery does is not optimal
		readyState is complete at basically the same time as 'window.onload' (they're functionally equivalent, within a few tenths of a second)
		Accessing undefined properties of a defined object (document) will not throw an error (in case readyState is undefined).
	 */
	
	// Check for IE < 11 via conditional compilation
	/// values: 5?: IE5, 5.5?: IE5.5, 5.6/5.7: IE6/7, 5.8: IE8, 9: IE9, 10: IE10, 11*: (IE11 older doc mode), undefined: IE11 / NOT IE
	var jscript_version = Number( new Function("/*@cc_on return @_jscript_version; @*\/")() ) || NaN;
	
	// check if the DOM has already loaded
	if (document.readyState === 'complete') { ready(null); return; }  // here we send null as the readyTime, since we don't know when the DOM became ready.
	
	if (jscript_version < 9) { doIEScrollCheck(); return; } // For IE<9 poll document.documentElement.doScroll(), no further actions are needed.
	
	 /* 
		Chrome, Edge, Firefox, IE9+, Opera 9+, Safari 3.1+, Android Webview, Chrome for Android, Edge Mobile, 
		Firefox for Android 4+, Opera for Android, iOS Safari, Samsung Internet, etc, support addEventListener
		And IE9+ supports 'DOMContentLoaded' 
	 */
		
	if (document[ael]) {
	    document[ael]("DOMContentLoaded", ready, false); 
	    window[ael]("load", ready, false); // fallback to the load event in case addEventListener is supported, but not DOMContentLoaded
	} else 
	if (aev in window) { window[aev]('onload', ready);
	    /* Old Opera has a default of window.attachEvent being falsy, so we use the in operator instead
		   https://dev.opera.com/blog/window-event-attachevent-detachevent-script-onreadystatechange/

		   Honestly if somebody is using a browser so outdated AND obscure (like Opera 7 where neither addEventListener 
	       nor "DOMContLoaded" is supported, they deserve to wait for the full page).
	       I CBA testing whether readyState === 'interactive' is truly interactive in browsers designed in 2003. I just assume it isn't (like in IE6-8). 
		*/
	} else { // fallback to queue window.onload that will always work
	   addOnload(ready);
	}
	
	
	// This function allows us to preserve any original window.onload handlers (in super old browsers where this is even necessary), 
	// while keeping the option to chain onloads, and dequeue them.
	
	function addOnload(fn) { var prev = window.onload; // old window.onload, which could be set by this function, or elsewhere
		
		// we add a function queue list to allow for dequeueing 
		// addOnload.queue is the queue of functions that we will run when when the DOM is ready
		if ( type( addOnload.queue ) !== 'array') { addOnload.queue = [];
			if ( type(prev) === 'function') { addOnload.queue.push( prev ); } // add the previously defined event handler
		}
		
		if (typeof fn === 'function') { addOnload.queue.push(fn) }

		window.onload = function() { // iterate through the queued functions
			for (var i = 0; i < addOnload.queue.length; i++) { addOnload.queue[i]() } 
		};
	}	

	// remove a queued window.onload function from the chain (simplified); 
	
	function dequeueOnload(fn) { var q = addOnload.queue, i = 0;
	
		// sort through the queued functions in addOnload.queue until we find `fn`
		if (type( q ) === 'array') {		// if found, remove from the queue
			for (; i < q.length; i++) { ;;(fn === q[i]) ? q.splice(i, 1) : 0; } // void( (fn === q[i]) ? q.splice(i, 1) : 0 ) 
		}
	}
	
	function ready(ev) { // idempotent event handler function
	    if (alreadyRun) {return} alreadyRun = true; 
		
		// this time is when the DOM has loaded (or if all else fails, when it was actually possible to inference the DOM has loaded via a 'load' event)
		// perhaps this should be `null` if we have to inference readyTime via a 'load' event, but this functionality is better.
		var readyTime = microtime(); 
		
		detach(); // detach any event handlers
						
		// run the functions
		for (var i=0; i < funcs.length; i++) {	var func = funcs[i];
			
			if (type(func) === 'function') {
				func.call(document, { 'readyTime': (ev === null ? null : readyTime), 'funcExecuteTime': microtime() }, func); 
				// jquery calls 'ready' with `this` being set to document, so we'll do the same. 
			}		
		}
	}

	function detach() {
	    if (document[rel]) { 
			document[rel]("DOMContentLoaded", ready); window[rel]("load", ready);
	    } else
		if (dev in window) { window[dev]("onload", ready); } 
	    else {
			dequeueOnload(ready);
	    }																
	}
	
	function doIEScrollCheck() { // for use in IE < 9 only.
	    if ( window.frameElement ) { 
			// we're in an <iframe> or similar
			// the document.documentElemeent.doScroll technique does not work if we're not at the top-level (parent document)

			try { window.attachEvent("onload", ready); } catch (e) { } // attach to onload if were in an <iframe> in IE as there's no way to tell otherwise
			
			return;
		} 
		try {
		    document.documentElement.doScroll('left');	// when this statement no longer throws, the DOM is accessible in old IE
		} catch(error) {
		    setTimeout(function() {
				(document.readyState === 'complete') ? ready() : doIEScrollCheck();
		    }, 50);
		    return;
		}
		ready();
	}
}

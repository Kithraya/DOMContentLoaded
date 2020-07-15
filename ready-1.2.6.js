/*! Released under the MIT License | © 2019, Kithraya | https://github.com/Kithraya/DOMContentLoaded */

function DOMContentLoaded(func) {
	
	var ael = 'addEventListener', rel = 'removeEventListener', aev = 'attachEvent', dev = 'detachEvent';
	var alreadyRun = false, // for use in the idempotent function ready()
	    funcs = arguments, _undef;
	    DOMContentLoaded.version = "1.2.6";
		
	// old versions of JS return '[object Object]' for null.
	function type(obj) { return (obj === null) ? 'null' : Object.prototype.toString.call(obj).slice(8,-1).toLowerCase() }
	function microtime() { return + new Date() } 
	
	 /* IE6 to 10 don't return the correct readyState values as per the spec, except for readyState === 'complete'.
		readyState is 'interactive' from the beginning in IE6 so checking for the onreadystatechange event like jQuery does is kind of irrelevant
		unless we're checking specifically for "readyState === 'complete'" which is basically the same as 'window.onload' 
		(they're functionally equivalent, within a few tenths of a second)
		But IE9+ supports 'DOMContentLoaded' and 'addEventListener' anyway so it's fine (sorta).
		readyState will be undefined in browsers that don't support it, but accessing undefined properties of 
		a defined object (document) does not throw Reference Errors
	 */
	
	// Check for IE < 11 via conditional compilation
	var jscript_version = Number( new Function("/*@cc_on return @_jscript_version; @*/")() ) || _undef; // unalterable undefined; void(0) isn't supported until Safari 3.2.
	
	// values: 5?: IE5, 5.5?: IE5.5, 5.6/5.7: IE6/7, 5.8: IE8, 9: IE9, 10: IE10, 11*: (IE11 older doc mode), undefined: IE11 / NOT IE

	// check if the DOM has already loaded (for instance, if DOMContentLoaded was called within a setTimeout(), or after a window.onload();
	// Not sure why anyone would want to do that, but hey 
	if (document.readyState === 'complete') { setTimeout(ready(null), 1); return; }  // document.readyState === 'complete' reports correctly in every browser I have tested, including IE.
	// we send null as the readyTime as we don't know when the DOM became ready	
	
	// (undefined > 9, undefined < 9, undefined === 9): false
	if (jscript_version < 9) { doIEScrollCheck(); return; } // For IE<9 poll document.documentElement.doScroll(), no further actions are needed.

	// if somehow readyState doesn't exist and we're not in old IE, use window.onload
	if (!('readyState' in document)) { setTimeout( addOnload(ready), 1); return; } // queue window.onload within a function so we dont overwrite any original event handlers
	
	// IE9+ supports 'DOMContentLoaded' and 'addEventListener'.
	 
	// Script such as <script>...<\/script> or <script src="..."><\/script> not with attribute 'async' or 'defer' block 
	// DOMContentLoaded, the browser waits for them to execute. When the browser processes an HTML-document 
	// and comes across a <script> tag, it needs to execute before continuing building the DOM. 
	// That’s a precaution, as scripts may want to modify DOM, and even document.write into it, so DOMContentLoaded has to wait.

	// Chrome, Edge, Firefox, IE9+, Opera 9+, Safari 3.1+, Android Webview, Chrome for Android, Edge Mobile, 
	// Firefox for Android 4+, Opera for Android, iOS Safari, Samsung Internet, etc, support addEventListener
		
	if (document[ael]) {
	    document[ael]("DOMContentLoaded", ready, false); 
	    window[ael]("load", ready, false); // fallback to the load event in case addEventListener is supported, but not DOMContentLoaded
	} else 
	if (aev in document) { window[aev]('onload', ready);
	    // old Opera has a default of document.attachEvent being falsy, so we use the in operator instead
	    // readystate === 'complete' is functionally equivalent to window.onload, within a few tenths of a second
	    // Honestly if somebody is using a browser so outdated AND obscure (like Opera 7 where neither addEventListener 
	    // nor "DOMContLoaded" is supported, they deserve to wait for the full page).
	    // I CBA testing whether readyState === 'interactive' is truly interactive in browsers designed in 2003. I just assume it isn't (like in IE6-8).
	} else {
	   // fallback to window.onload that will always work
	   addOnload(ready); // queue window.onload
	}
	
	// This function allows us to preserve any original window.onload handlers (in super old browsers where this is necessary), 
	// while keeping the option to chain onloads, and dequeue them 
	// for completeness' sake
	function addOnload(fn) { 

		var prev = window.onload; // old window.onload, which could be set by this function, or elsewhere
		
		// we add a function queue list to allow for dequeueing 
		if ( type( addOnload.queue ) !== 'array') { addOnload.queue = [];
			if (typeof(prev) === 'function') { addOnload.queue.push( prev ); } // add the previous event handler
		}
		
		addOnload.queue.push(fn);
		
		window.onload = function() { // iterate through the queued functions
			for (var i = 0; i < addOnload.queue.length; i++) { var queuedFunc = addOnload.queue[i];
				if (typeof(queuedFunc) === 'function') { queuedFunc(); }
			}
		};
		
		if (fn === null) { window.onload = null; } // optional: reset window.onload, overwriting all previous events.
	}
	
	// remove a queued window.onload function from the chain	
	function dequeueOnload(fn) { var q = addOnload.queue;
		if ( type(q) !== 'array') { return } 
		
		if (!arguments.length) { q.pop(); } else {
			if (type(fn) === 'number') { q.splice(fn, 1); return; }
			// otherwise, iterate for the function
			for (var i=0; i < q.length; i++) { if (fn === q[i]) { q.splice(i, 1); } } // if we find the function, remove it from the queue
		}
	}
		
	function ready(ev) { // idempotent event handler function
	    if (alreadyRun) {return} alreadyRun = true; 
		
		var readyDOMTime = microtime(); // this time is when the DOM has loaded (or if all else fails, when it was actually possible to inference the DOM has loaded via a 'load' event)
		// perhaps this should be `null` if we inference via a 'load' event, but I feel this functionality is better.
										
		detach(); // detach any event handlers
						
		// run the functions
		for (var i=0; i < funcs.length; i++) {	var func = funcs[i];
			
			if (typeof(func) === 'function') {
				func.call(document, { 'readyDOMTime': (ev === null ? null : readyDOMTime), 'funcExecuteTime': microtime() }, func); 
				// jquery calls 'ready' with `this` being set to document, so we'll do the same. 
			}		
		}
	}

	function detach() {
	    if (document[rel]) { 
			document[rel]("DOMContentLoaded", ready); window[rel]("load", ready);
	    } else
		if (dev in document) { window[dev]("onload", ready); } 
	    else {
		dequeueOnload(ready);
	    }																
	}
	
	function doIEScrollCheck() { /// for use in IE < 9 only.
	    if ( window.frameElement ) { 
		    // we're in an iframe or similar
		    // document.documentElement.doScroll does not work if we're not executing at the top level (parent document); meaning if we're in an iframe, we return.
			// revisit
		try { window.attachEvent("onload", ready); } catch (e) { } // attach to onload if were in an <iframe> in IE as there's no way to tell otherwise
		// try { if (aev in document) { window[aev]("onload", ready);} else { addOnload(ready) } } catch (e) { }
		return;
		    
	    } 
	    try {
		document.documentElement.doScroll('left');	// when this statement no longer throws errors, the DOM is accessible in old IE
	    } catch(error) {
		setTimeout(function() {
			(document.readyState === 'complete') ? ready() : doIEScrollCheck();
		}, 50);
		return;
	    }
	    ready();
	}
}
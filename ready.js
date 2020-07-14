/*!	
 * Released under the MIT License
 * © 2019, Kithraya
 * https://github.com/Kithraya/DOMContentLoaded
 */

function DOMContentLoaded(func) {
	
	var ael = 'addEventListener', rel = 'removeEventListener', aev = 'attachEvent', dev = 'detachEvent';
	var alreadyRun = false,
	    funcs = arguments;
	    DOMContentLoaded.version = "1.2.6";
		
	// old versions of JS return '[object Object]' for null.
	function type(obj) { return (obj === null) ? 'null' : Object.prototype.toString.call(obj).slice(8,-1).toLowerCase() }
	function microtime() { return + new Date() } 
	
	
	 /* IE6 to 10 don't return the correct readyState values as per the spec, except for readyState === 'complete'.
		readyState is 'interactive' from the beginning in IE6 so checking for the onreadystatechange event is kind of irrelevant
		unless we're checking specifically for "readyState === 'complete'" which is basically the same as 'window.onload'
		But IE9+ supports 'DOMContentLoaded' and 'addEventListener' anyway so it's fine (sorta).
		readyState will be undefined in browsers that don't support it, but accessing undefined properties of 
		a defined object (document) does not throw Reference Errors
	 */
	
	// Check for IE < 11 via conditional compilation
	
	var jscript_version = Number( new Function("/*@cc_on return @_jscript_version; @*/")() ) || undefined;
	
	// values: 5.6, 5.7, 5.8, 9, 10,(11), undefined. 
	
	 // check if the DOM has already loaded (for instance, if DOMContentLoaded was called within a setTimeout(). 
	 // Not sure why anyone would want to do that, but hey 
	
	if (document.readyState === 'complete') { setTimeout(ready(null), 1); return; }  // document.readyState === 'complete' reports correctly in every browser I have tested, including IE.
	
	//(undefined > 9, undefined < 9, undefined === 9): false
	if (jscript_version < 9) { doIEScrollCheck(); return; } // For IE<9 poll document.documentElement.doScroll(), no further actions are needed. // what about iframes?
	
	 // IE9+ supports 'DOMContentLoaded' and 'addEventListener'.
	 
	 // Script such as <script>...<\/script> or <script src="..."><\/script> not with attribute 'async' or 'defer' block 
	 // DOMContentLoaded, the browser waits for them to execute. When the browser processes an HTML-document 
	 // and comes across a <script> tag, it needs to execute before continuing building the DOM. 
	 // That’s a precaution, as scripts may want to modify DOM, and even document.write into it, so DOMContentLoaded has to wait.

	 // Chrome, Edge, Firefox, IE9+, Opera 9+, Safari 3.1+, Android Webview, Chrome for Android, Edge Mobile, 
	 // Firefox for Android 4+, Opera for Android, iOS Safari, Samsung Internet, etc, support addEventListener
		
	if (document[ael]) {
	    document[ael]("DOMContentLoaded", ready, false); 
	    window[ael]("load", ready, false); // fallback to window.onload that will always work. 
	} else 
	if (aev in document) { window[aev]('onload', ready);
	    // old Opera has a default of document.attachEvent being falsy, so we use the in operator instead
		// readystate === 'complete' executes at basically the same time as window.onload
	    // Honestly if somebody is using a browser so outdated AND obscure (like Opera 7 where neither addEventListener 
	    // nor "DOMContLoaded" is supported, they deserve to wait for the full page. 
	    // I CBA testing whether readyState === 'interactive' is truly interactive in browsers designed in 2003. I just assume it isn't (like in IE6-8).
	} else {
	   addOnload(ready); // queue window.onload within a function so we dont overwrite any original event handlers
	}
	
	// this function allows us to preserve any original window.onload handlers, while keeping the option to chain onloads, and dequeue them
	function addOnload(fn) { 

		var prev = window.onload; // old window.onload, could be set by this function, or elsewhere
		
		// we add a function queue list to allow for dequeueing 
		if ( type( addOnload.queue ) !== 'array') { addOnload.queue = [];
			if (typeof(prev) === 'function') { addOnload.queue.push( prev ); }
			
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
			for (var i=0; i < q.length; i++) { if (fn === q[i]) { q.splice(i, 1); } }
		}
	}
		
	function ready(ev) {
	    if (alreadyRun) {return} alreadyRun = true; 
		
		var readyDOMTime = microtime();
		detach();
						
		// run the functions
		for (var i=0; i < funcs.length; i++) {	var func = funcs[i];
			
			if (typeof(func) === 'function') {
				//console.log(func);
				func.call(document, (ev === null ? ev : readyDOMTime), microtime(), func); // run the function with parameters of when the DOM loaded
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
	
	function doIEScrollCheck() { // for use in IE only.
	    if ( window.frameElement != null ) { // revisit this
			try { window.attachEvent("onload", ready); } catch (e) { } // attach to onload if were in an <iframe> in IE as there's no way to tell otherwise
			return;
		} 
		try {
		    document.documentElement.doScroll('left');	
		} catch(error) {
		    setTimeout(function() {
				(document.readyState === 'complete') ? ready() : doIEScrollCheck();
		    }, 50);
		    return;
		}
		ready();
	}
}

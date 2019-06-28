
/*!	
 * Released under the MIT License, for the moment.
 * © 2019, Kithraya
 * https://github.com/Kithraya/DOMContentLoaded
 */

function DOMContentLoaded(func) { // Tested in IE6+ 
	
	var version = "1.1", ael = 'addEventListener', rel = 'removeEventListener', aev = 'attachEvent', dev = 'detachEvent';
	var alreadyRun = false;
    
	// IE6 to 10 don't return the correct readystate values as per the spec, except for readyState === 'complete'.
	// Readystate is 'interactive' from the minute the page loads in IE6 so adding the onreadystatechange event is kind of irrelevant unless we're checking specifically for "readyState === 'complete' "
	// But IE9 and 10 support 'DOMContentLoaded' and 'addEventListener' anyway so it's fine.
	// readyState will be undefined in browsers that don't support it, but accessing undefined properties of a defined object (document) does not throw Reference Errors
		
	// is IE < 9
	var isOldIE = (function() { 
		var version = new Function("/*@cc_on return @_jscript_version; @*/")(); // returns 5.6/7 for IE6, 5.7 for IE7, 5.8: IE8, 9: IE9, 10: IE10, 11: IE11 in IE10 mode. (Browser modes do not seem to affect JSCript engine);
		return !!(version && parseInt( version, 10 ) < 9);
	})();
	
	// check if the DOM has already loaded (for instance, if DOMContentLoaded was called within setTimeout(). Not sure why anyone would want to do that, but hey).
	
	if (document.readyState === 'complete') { ready.call(document, {}); return; }  // readyState === 'complete' reports correctly in IE6+, tested.
	
	if (isOldIE) { doScrollCheck(); return; } // For IE<9 poll document.documentElement.doScroll(), no further actions are needed
	 
	 // Script such as <script>...<\/script> or <script src="..."><\/script> not with attribute 'async' or 'defer' block DOMContentLoaded, the browser waits for them to execute.
	 // When the browser processes an HTML-document and comes across a <script> tag, it needs to execute before continuing building the DOM. 
	 // That’s a precaution, as scripts may want to modify DOM, and even document.write into it, so DOMContentLoaded has to wait.

	 // Chrome, Edge, Firefox, IE9+, Opera 9+, Safari 3.1+, Android Webview, Chrome for Android, Edge Mobile, Firefox for Android 4+, Opera for Android, iOS Safari, Samsung Internet, etc, support addEventListener
		
	if (document[ael]) {
	    document[ael]("DOMContentLoaded", ready, false); 
		window[ael]("load", ready, false); // fallback to window.onload that will always work. 
	} else 
	if (document[aev]) { window[aev]('onload', ready);
		// old Opera (and technically old IE but IE is covered)
		// Honestly if somebody is using a browser so outdated and obscure (like Opera 7 where neither addEventListener nor "DOMContLoaded" is supported, they deserve to wait for the full page. 
		// I CBA testing whether readyState === 'interactive' on browsers designed in 2003. IE6+ is covered so I'm happy
	} else {
	window.onload = ready; //
	}
	
	function detach() { // if addEventListener is defined, removeEventListener will literally always be defined and vice versa, same for attachEvent / detachEvent
		if (document[ael]) { 
		    document[rel]("DOMContentLoaded", ready, false); window[rel]("load", ready, false);
		} else
		if (document[aev]) { window[dev]("onload", ready); } else {
		    window.onload = null;
		}			
	}
	
	function ready(ev) {
		if (alreadyRun) {return} alreadyRun = true;
		detach();
		func.call(this, ev); // force a call of document? func.call(document, ev);
	}
	
	function doScrollCheck() { // for use in IE only.
		if ( !(window.frameElement === null) ) { return; }
		try {
			document.documentElement.doScroll('left');	
		} catch(error) {
			setTimeout(function() {
				(document.readyState === 'complete') ? ready.call(document, {}) : doScrollCheck();
			}, 50);
			return;
		}
		ready.call(document, {});
	}

}

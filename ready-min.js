/*! Released under the MIT License | © 2019, Kithraya | https://github.com/Kithraya/DOMContentLoaded */

function DOMContentLoaded() { 
	var ael = 'addEventListener', rel = 'removeEventListener', aev = 'attachEvent', dev = 'detachEvent', alreadyRun = false, funcs = arguments, undef;
	DOMContentLoaded.version = "1.2.6";

	function type(obj) { return (obj === null) ? 'null' : Object.prototype.toString.call(obj).slice(8,-1).toLowerCase() }
	function microtime() { return + new Date() } 

	var jscript_version = Number( new Function("/*@cc_on return @_jscript_version; @*/")() ) || undef; 
	
	if (document.readyState === 'complete') { setTimeout(ready(null), 1); return; }  
	if (jscript_version < 9) { doIEScrollCheck(); return; } 
	if (!('readyState' in document)) { setTimeout( addOnload(ready), 1); return; }
	
	if (document[ael]) { document[ael]("DOMContentLoaded", ready, false); window[ael]("load", ready, false); } else 
	if (aev in document) {window[aev]('onload', ready);} else { addOnload(ready); }
	
	function addOnload(fn) { var prev = window.onload; 
		if ( type( addOnload.queue ) !== 'array') { addOnload.queue = []; if (typeof(prev) === 'function') { addOnload.queue.push( prev ); }}
		addOnload.queue.push(fn);
		window.onload = function() { 
			for (var i = 0; i < addOnload.queue.length; i++) { var queuedFunc = addOnload.queue[i]; if (typeof(queuedFunc) === 'function') { queuedFunc(); }}
		};
	}		
	function dequeueOnload(fn) { var q = addOnload.queue; if ( type(q) !== 'array') { return } if (!arguments.length) { q.pop(); } else {
		if (type(fn) === 'number') { q.splice(fn, 1); return; } for (var i=0; i < q.length; i++) { if (fn === q[i]) { q.splice(i, 1); } } }
	}
		
	function ready(ev) {if (alreadyRun) {return} alreadyRun = true; var readyDOMTime = microtime(); detach();
		for (var i=0; i < funcs.length; i++) {	var func = funcs[i];
		    if (typeof(func) === 'function') {func.call(document, { 'readyDOMTime': (ev === null ? null : readyDOMTime), 'funcExecuteTime': microtime() }, func); }		
		}
	}

	function detach() { if (document[rel]) { document[rel]("DOMContentLoaded", ready); window[rel]("load", ready); } else
		if (dev in document) { window[dev]("onload", ready); } else { dequeueOnload(ready); }																
	}

	function doIEScrollCheck() {
	    if ( window.frameElement ) { try { window.attachEvent("onload", ready); } catch (e) { } return } 
		try { document.documentElement.doScroll('left');} catch(error) {
		    setTimeout(function() { (document.readyState === 'complete') ? ready() : doIEScrollCheck() }, 50); return;
		} ready();
	}
}

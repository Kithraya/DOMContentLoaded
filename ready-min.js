/*!	Released under the MIT License, for the moment. © 2019 Kithraya, https://github.com/Kithraya/DOMContentLoaded */

function DOMContentLoaded(func) {
	
	var version = "1.1", ael = 'addEventListener', rel = 'removeEventListener', aev = 'attachEvent', dev = 'detachEvent';
	var alreadyRun = false;
	
	var isOldIE = (function() { 		
	    var version = new Function("/*@cc_on return @_jscript_version; @*/")(); return !!(version && parseInt( version, 10 ) < 9);
	})();
	
	if (document.readyState === 'complete') { ready.call(document, {}); return; }  	
	if (isOldIE) { doIEScrollCheck(); return; }		
	if (document[ael]) { document[ael]("DOMContentLoaded", ready, false);  window[ael]("load", ready, false);} else 
	if (document[aev]) { window[aev]('onload', ready);} else {window.onload = ready;}
	
	function ready(ev) {if (alreadyRun) {return} alreadyRun = true; detach(); func.call(this, ev); }
	function detach() { if (document[ael]) { document[rel]("DOMContentLoaded", ready, false); window[rel]("load", ready, false);} else
		if (document[aev]) { window[dev]("onload", ready); } else {window.onload = null;}	
  	}
	
	function doIEScrollCheck() { if ( !(window.frameElement === null) ) { return; }
	    try {document.documentElement.doScroll('left'); } catch(error) {
		setTimeout(function() {(document.readyState === 'complete') ? ready.call(document, {}) : doIEScrollCheck();}, 50); return;
	    } ready.call(document, {});
	}
}

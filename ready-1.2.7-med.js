/*! https://github.com/Kithraya/DOMContentLoaded v1.2.7 | MIT License
    If you happen to be using the version on MDN, attribution is not necessary, but appreciated <3
 */

DOMContentLoaded.version = "1.2.7";

function DOMContentLoaded() { "use strict";

    var ael = 'addEventListener', rel = 'removeEventListener', aev = 'attachEvent', dev = 'detachEvent';
    var alreadyRun, funcs = arguments;
	
    var jscript_version = Number( new Function("/*@cc_on return @_jscript_version; @*\/")() );

    if (document.readyState === 'complete') { ready(null); return; }

    if (jscript_version < 9) { doIEScrollCheck(); return; }

    if (document[ael]) { document[ael]("DOMContentLoaded", ready, false); window[ael]("load", ready, false); } else
    if (aev in window) { window[aev]('onload', ready); }
    else { addOnload(ready); }

    function addOnload(fn) { var prev = window.onload;

        if (typeof addOnload.queue !== 'object') { 
	    addOnload.queue = [];
            if (typeof prev === 'function') { addOnload.queue.push( prev ); }
        }
        if (typeof fn === 'function') { addOnload.queue.push(fn) }

        window.onload = function() { for (var i=0; i < addOnload.queue.length; i++) { addOnload.queue[i]() } };
    }

    function dequeueOnload(fn, all) {
        if (typeof addOnload.queue === 'object') {
            for (var i = addOnload.queue.length-1; i >= 0; i--) {
                if (fn === addOnload.queue[i]) {
                    addOnload.queue.splice(i,1); if (!all) {break}
                }
            }
        }
    }

    function ready(time) {
        if (alreadyRun) {return} alreadyRun = true;
		
        var readyTime = +new Date();
		
	detach();

        for (var i=0; i < funcs.length; i++) { var func = funcs[i];

            if (typeof func === 'function') {
                func.call(document, {
                  'readyTime': (time === null ? null : readyTime),
                  'funcExecuteTime': +new Date(),
                  'currentFunction': func
                });
            }
        }
    }

    function detach() {
        if (document[rel]) { document[rel]("DOMContentLoaded", ready); window[rel]("load", ready); } else
        if (dev in window) { window[dev]("onload", ready); }
        else { dequeueOnload(ready) }
    }

    function doIEScrollCheck() { // for use in IE < 9 only.
        if ( window.frameElement ) { try { window.attachEvent("onload", ready); } catch (e) { } return; }
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

// Tested via BrowserStack.

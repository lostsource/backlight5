/**
* This work is licensed under the 
* Creative Commons Attribution-ShareAlike 3.0 Unported License. 
* To view a copy of this license, visit 
* http://creativecommons.org/licenses/by-sa/3.0/
*
* joseph@lostsource.com
*
**/

function Backlight5(elem,options) {
	if(!elem) {
		throw Error("Source element is required");
	}

	/// TODO implement IMG and CANVAS support
	// element must be video
	if(['VIDEO'].indexOf(elem.nodeName) == -1) {
		throw Error("Expecting <video> or <img> tag");
	}

	// normalize requestAnimationFrame
	(function() {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	  window.requestAnimationFrame = requestAnimationFrame;
	})();

	options = options || {};

	var horizLedCount = options.resX || 10;
	var vertLedCount =  options.resY || 10;
	var debugMode = options.debug || false;

	var outerframe,ledGrid,ledMatrix;

	// canvas context cache
	// multiple contexts may exist if led resolution is changed at runtime
	var ctxCache = {}; // 

	// detect element width / height 
	// FIXME these properties are VIDEO tag specific
	var srcWidth,srcHeight;
	srcWidth = elem.videoWidth;
	srcHeight = elem.videoHeight;

	// if videoWidth / height are available initialize,
	// else we wait until meta data is loaded
	if((srcWidth != 0) && (srcHeight != 0)) {
		initialize();
	}
	else {
		// this is usually required in IE10
		elem.addEventListener('loadedmetadata',function(){
			srcWidth = this.videoWidth;
			srcHeight = this.videoHeight;

			initialize();
		},false);
	}


	
	function initialize() {
		// create outerframe which will contain source element and ledframe
 		outerframe = document.createElement('div');
 		outerframe.style.width = elem.offsetWidth+"px";
 		outerframe.style.height = elem.offsetHeight+"px";

 		/// TODO check, this might cause flow problems with existing elements
 		outerframe.style.position = 'relative';

 		if(debugMode) {
 			outerframe.style.border = "4px solid #00aa00";
 		}
 		else {
 			outerframe.style.border = "12px solid black";	
 			outerframe.style.borderRadius = "10px";
 		}

 		elem.parentNode.insertBefore(outerframe,elem);
 		outerframe.appendChild(elem);

 		ledMatrix = createLedMatrix(horizLedCount,vertLedCount);

		// start the 'animation loop'
		requestAnimationFrame.call(window,function(){
			updateLeds();
		});
	}

	function createLedMatrix(w,h) {
		var tbl = ledGrid || document.createElement('table');
		tbl.innerHTML = "";
		tbl.style.width = "100%";
		tbl.style.height = "100%";
		tbl.style.position = 'absolute';
		tbl.style.top = "0px";
		tbl.style.left = "0px";
		ledGrid = tbl;

		if(debugMode) {
			tbl.style.opacity = .5;
		}
		else {
			tbl.style.zIndex = -1;
		}

		if(debugMode) {
			tbl.style.border = "4px solid maroon";
			tbl.style.backgroundColor = "#777777";
		}

		var ledMap = {};

		for(var y = 0; y < h; y++) {
			var row = tbl.insertRow(y);

			for(var x = 0; x < w; x++) {
				var cell = row.insertCell(x);
				if(debugMode) {
					cell.style.backgroundColor = "black";
				}
				
				// only cells touching the edge are required for map
				if((y != 0) && (y != (h-1))) {
					// not in upper / lower row
					// only relevant if we're in first / last column
					if((x != 0) && (x != (h-1))) {
						continue;
					}
				}


				if(debugMode) {
					cell.style.backgroundColor = "#999999";
				}

		 		cell.style.transitionTimingFunction = "linear";
		 		cell.style.transitionProperty = "box-shadow";
		 		cell.style.transitionDuration = ".5s";

		 		cell.style.MozTransitionTimingFunction = "linear";
		 		cell.style.MozTransitionProperty = "box-shadow";
		 		cell.style.MozTransitionDuration = ".5s";

		 		cell.style.webkitTransitionTimingFunction = "linear";
		 		cell.style.webkitTransitionProperty = "box-shadow";
		 		cell.style.webkitTransitionDuration = ".5s";

		 		// ledId has same value of imagedata index used in updateLeds method
		 		var ledId = (x*4)+((horizLedCount*4)*y);
				ledMap[ledId] = cell;
			}
		}


		// prevent re-append grid to frame if it was already appended
		// this can happen if led resolution is changed at runtime
		if(tbl.parentNode !== outerframe) {
			outerframe.insertBefore(tbl,elem);
		}

		return ledMap;
	}

	function updateLeds() {
		requestAnimationFrame.call(window,function(){
			updateLeds();
		});

		var ctx = getCanvasContext(horizLedCount,vertLedCount);
		ctx.drawImage(
			elem,0,0,srcWidth,srcHeight // source
			,0,0,horizLedCount,vertLedCount  // destination
		);

		var imagedata = ctx.getImageData(0,0,horizLedCount,vertLedCount);
		var i,r,g,b;
		for(i in ledMatrix) {
			i = i >>> 0; // convert to integer
		
			var ledCell = ledMatrix[i];
			r = imagedata.data[i];
			g = imagedata.data[i+1];
			b = imagedata.data[i+2];

			/// NOTE firefox is teribly slow here
			ledCell.style.boxShadow = "1px 1px 70px 20px rgb("+r+","+g+","+b+")";
		}
	}


	function getCanvasContext(w,h) {
		var cacheId = w+":"+h;
		if(ctxCache[cacheId]) {
			return ctxCache[w+":"+h];
		}

		var canvas = document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;

		if(debugMode) {
			canvas.style.border = '4px solid blue';
			document.body.appendChild(canvas);
		}

		ctxCache[cacheId] = canvas.getContext("2d");
		return ctxCache[cacheId];
	}

	return {
		updateResolution: function(w,h) {
			horizLedCount = parseInt(w,10);
			vertLedCount = parseInt(h,10);
		}
	}
}
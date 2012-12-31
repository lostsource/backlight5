Experimental backlight for HTML5 video using canvas and CSS3 transitions 

**Live Demo**

<http://lostsource.com/2012/12/30/backlight-html5-video.html>

**Usage**

Assuming this is your markup:

	<video id="someMovie" width="480" height="264">
		<source src="movie.ogv" type='video/ogg'/>
		<source src="movie.webm" type='video/webm'/>
		<source src="movie.mp4" type='video/mp4'/>
	</video>

Include `backlight5.js` in your page and add the following line

    var backlight = Backlight5(document.getElementById('someMovie'));

Settings can be modified at runtime

    // ammount of 'leds' (different colors) to be used
    // the higher the more CPU intensive (defaults to 5)
	backlight.setSeparation(5); 

	// blurriness of backlight (defaults to 50)
	backlight.setBlur(50);

	// spread (length) of backlight (defaults to 20)
	backlight.setSpread(20);

	// speed of led updates in seconds
	// 0 is instant, defaults to 0.5
	backlight.setResponse(0.5);

Settings can also be specified on initialization

    var backlight = Backlight5(document.getElementById('someMovie'),{
    	sepration: 5
    	blur: 50,
    	spread: 20,
    	response: 0.5
    });
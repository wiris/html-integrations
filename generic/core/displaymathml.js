function generateEntities(s) {
	d = "";
	for (i=0;i<s.length;i++) {
		c = s.charCodeAt(i);
		if (c>=128) {
			d+="&"+c+";";
		} else {
			d+=s.charAt(i);
		}
	}
	return d;
}

function mathmlFunction() {

	var maths = document.getElementsByTagName('math');
	
	for (i = 0; i < maths.length; i++) {
		var mathNode = maths[i];
		var container = document.createElement('span');
		container.className = 'wrs_viewer';
		mathNode.parentNode.replaceChild(container, mathNode);
		container.appendChild(mathNode);
		
		var mathml = container.innerHTML;
		if (mathml.indexOf("<?XML")==0) {
			j=mathml.indexOf("/>");
			if (j>=0)
				mathml=mathml.substring(j+2);
		}
		var img = document.createElement('img');
		mathml = generateEntities(mathml);
		img.src = 'http://localhost:8080/demo/editor/render?mml='+encodeURIComponent(mathml);
		img.align = 'middle';
		container.parentNode.replaceChild(img, container);
	}
}

if (window.attachEvent) {
	window.attachEvent('onload', mathmlFunction);
}

window.addEventListener('load',mathmlFunction,false);

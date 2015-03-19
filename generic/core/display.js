function isInAContentEditableElement(element) {
	if (element == null) {
		return false;
	}
	
	if (element.contentEditable && element.contentEditable !== 'inherit') {
		return true;
	}
	
	return isInAContentEditableElement(element.parentNode);
}

function displayFunction() {	
	var images = document.getElementsByTagName('img');
	
	for (var i = images.length - 1; i >= 0; --i) {
		if (images[i].className == 'Wirisformula' && !isInAContentEditableElement(images[i])) {
			images[i].align = '';
			images[i].style.verticalAlign = (-images[i].height / 2) + 'px';
		}
	}
}

if (window.addEventListener && navigator.userAgent.indexOf("Trident") > 0) { // I.E 11
	window.addEventListener('load', displayFunction, false);
} else if (window.attachEvent) {
	window.attachEvent('onload', displayFunction);
} 
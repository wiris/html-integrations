if (window.attachEvent) {
	window.attachEvent('onload', function () {
		var images = document.getElementsByTagName('img');
		
		for (var i = images.length - 1; i >= 0; --i) {
			if (images[i].className == 'Wirisformula') {
				images[i].align = '';
				images[i].style.verticalAlign = (-images[i].height / 2) + 'px';
			}
		}
	});
}

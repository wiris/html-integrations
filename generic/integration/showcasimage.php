<?php
include('libwiris.php');

if (empty($_GET['formula'])) {
	echo 'Error: no image name has been sended.';
}
else {
	$formula = basename($_GET['formula']);
	$filePath = $cacheDirectory . '/' . $formula;
	
	if (is_file($filePath)) {
		header('Content-Type: image/png');
		echo file_get_contents($filePath);
	}
	else {
		header('Content-Type: image/gif');
		echo file_get_contents('../core/cas.gif');
	}
}

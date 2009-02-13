<?php
include('libwiris.php');

if (isset($_POST['image'])) {
	$fileName = md5($_POST['image']);
	$formulaPath = $formulaDirectory . '/' . $fileName . '.xml';
	
	if (isset($_POST['mml']) && !is_file($formulaPath)) {
		file_put_contents($formulaPath, $_POST['mml']);
	}
	
	$URL = dirname($_SERVER['PHP_SELF']) . '/showcasimage.php?formula=' . $fileName . '.png';
	$imagePath = $cacheDirectory . '/' . $fileName . '.png';
	
	if (!is_file($imagePath)) {
		if (file_put_contents($imagePath, base64_decode($_POST['image'])) !== false) {
			echo $URL;
		}
		else {
			echo dirname($_SERVER['PHP_SELF']) . '../core/cas.gif';
		}
	}
	else {
		echo $URL;
	}
}
else {
	echo dirname($_SERVER['PHP_SELF']) . '../core/cas.gif';
}
?>
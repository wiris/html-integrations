<?php
include('libwiris.php');

function calculateImageMD5($mathml, $config) {
	$string = 'mml=' . rawurlencode($mathml);
	$string .= '&bgColor=' . rawurlencode($config['wirisimagebgcolor']);
	$string .= '&symbolColor=' . rawurlencode($config['wirisimagesymbolcolor']);
	$string .= '&fontSize=' . rawurlencode($config['wirisimagefontsize']);
	$string .= '&transparency=' . rawurlencode($config['wiristransparency']);
	
	return md5($string);
}

if (!empty($_POST['mml'])) {
	$config = loadConfig($configFile);
	$fileName = calculateImageMD5($_POST['mml'], $config);
	
	$URL = dirname($_SERVER['PHP_SELF']) . '/showimage.php?formula=' . $fileName . '.png';
	$filePath = $formulaDirectory . '/' . $fileName . '.xml';
	
	if (!is_file($filePath)) {
		if (file_put_contents($filePath, $_POST['mml']) !== false) {
			echo $URL;
		}
		else {
			echo 'Error: can\'t create the image. Check your file privileges.';
		}
	}
	else {
		echo $URL;
	}
}
else {
	echo 'Error: no mathml has been sended.';
}
?>
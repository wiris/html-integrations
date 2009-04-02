<?php
include('libwiris.php');

if (!empty($_POST['mml'])) {
	$config = loadConfig($configFile);
	
	if (isset($_POST['bgColor'])) {
		$config['wirisimagebgcolor'] = $_POST['bgColor'];
	}
	
	if (isset($_POST['symbolColor'])) {
		$config['wirisimagesymbolcolor'] = $_POST['symbolColor'];
	}
	
	if (isset($_POST['numberColor'])) {
		$config['wirisimagenumbercolor'] = $_POST['numberColor'];
	}
	
	if (isset($_POST['identColor'])) {
		$config['wirisimageidentcolor'] = $_POST['identColor'];
	}
	
	if (isset($_POST['transparency'])) {
		$config['wiristransparency'] = $_POST['transparency'];
	}
	
	if (isset($_POST['fontSize'])) {
		$config['wirisimagefontsize'] = $_POST['fontSize'];
	}
	
	$toSave = $_POST['mml'] . "\n";
	$toSave .= $config['wirisimagebgcolor'] . "\n";
	$toSave .= $config['wirisimagesymbolcolor'] . "\n";
	$toSave .= $config['wiristransparency'] . "\n";
	$toSave .= $config['wirisimagefontsize'] . "\n";
	$toSave .= $config['wirisimagenumbercolor'] . "\n";
	$toSave .= $config['wirisimageidentcolor'] . "\n";
	
	$fileName = md5($toSave);
	$URL = dirname($_SERVER['PHP_SELF']) . '/showimage.php?formula=' . $fileName . '.png';
	$filePath = $formulaDirectory . '/' . $fileName . '.xml';
	
	if (!is_file($filePath)) {
		if (file_put_contents($filePath, $toSave) !== false) {
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
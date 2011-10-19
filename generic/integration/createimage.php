<?php
include 'libwiris.php';

if (!empty($_POST['mml'])) {
	global $wrs_xmlFileAttributes;
	$properties = array('mml' => $_POST['mml']);
	
	foreach ($_POST as $key => $value) {
		if (in_array($key, $wrs_xmlFileAttributes) || substr($key, 0, 4) == 'font') {
			$properties[$key] = $value;
		}
	}
	
	$toSave = wrs_createIni($properties);
	$fileName = md5($toSave);
	$url = dirname($_SERVER['PHP_SELF']) . '/showimage.php?formula=' . $fileName . '.png';
	$filePath = WRS_FORMULA_DIRECTORY . '/' . $fileName . '.ini';
	
	if (!is_file($filePath)) {
		if (file_put_contents($filePath, $toSave) !== false) {
			echo (isset($_POST['returnDigest']) && $_POST['returnDigest'] != 'false') ? $fileName . ':' . $url : $url;
		}
		else {
			echo 'Error: can not create the image. Check your file privileges.';
		}
	}
	else {
		echo (isset($_POST['returnDigest']) && $_POST['returnDigest'] != 'false') ? $fileName . ':' . $url : $url;
	}
}
else {
	echo 'Error: no mathml has been sended.';
}
?>
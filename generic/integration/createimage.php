<?php
include 'libwiris.php';

if (!empty($_POST['mml'])) {
	static $postData = array(
		'bgColor' => 'wirisimagebgcolor',
		'transparency' => 'wiristransparency',
		'fontSize' => 'wirisimagefontsize',
		'numberColor' => 'wirisimagenumbercolor',
		'identColor' => 'wirisimageidentcolor',
		'symbolColor' => 'wirisimagesymbolcolor',
		'identMathvariant' => 'wirisimageidentmathvariant',
		'numberMathvariant' => 'wirisimagenumbermathvariant',
		'fontIdent' => 'wirisimagefontident',
		'fontNumber' => 'wirisimagefontnumber'
	);
	
	$config = parse_ini_file(WRS_CONFIG_FILE);
	
	foreach ($postData as $key => $value) {
		if (isset($_POST[$key])) {
			$config[$value] = $_POST[$key];
		}
	}
	
	if ($config['wiristransparency'] != 'true') {
		$config['wiristransparency'] = 'false';
	}
	
	$toSave = $_POST['mml'] . "\n";
	global $wrs_configProperties;
	
	foreach ($wrs_configProperties as $property) {
		if (isset($config[$property])) {
			$toSave .= $config[$property] . "\n";
		}
	}
	
	$fileName = md5($toSave);
	$url = dirname($_SERVER['PHP_SELF']) . '/showimage.php?formula=' . $fileName . '.png';
	$filePath = WRS_FORMULA_DIRECTORY . '/' . $fileName . '.xml';
	
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
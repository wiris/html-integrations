<?php
include 'libwiris.php';
$digest = NULL;

if (isset($_POST['md5']) && mb_strlen($_POST['md5']) == 32) {		// Support for "generic simple" integration.
	$digest = $_POST['md5'];
}
else if (isset($_POST['digest'])) {		// Support for future integrations (where maybe they aren't using md5 sums).
	$digest = $_POST['digest'];
}

if (!is_null($digest)) {
	$filePath = WRS_FORMULA_DIRECTORY . '/' . basename($digest);

	if (is_file($filePath . '.ini')) {
		$formula = wrs_parseIni($filePath . '.ini');
		
		if ($formula !== false) {
			if (isset($formula['mml'])) {
				echo $formula['mml'];
			}
		}
		else {
			echo 'Error: could not read the formula. Check your file permissions.';
		}
	}
	else if (is_file($filePath . '.xml')) {
		if (($handle = fopen($filePath, 'r')) !== false) {
			if (($line = fgets($handle)) !== false) {
				echo $line;
			}
			
			fclose($handle);
		}
		else {
			echo 'Error: could not read the formula. Check your file permissions.';
		}
	}
	else {
		echo 'Error: formula does not exists.';
	}
}
else if (isset($_POST['latex'])) {
	$config = wrs_loadConfig(WRS_CONFIG_FILE);
	
	if (isset($config['wirislatextomathmlurl'])) {
		$url = $config['wirislatextomathmlurl'];
	}
	else {
		$protocol = (isset($config['wirisimageserviceprotocol'])) ? $config['wirisimageserviceprotocol'] : 'http';
		$path = dirname($config['wirisimageservicepath']) . '/latex2mathml';
		$url = $protocol . '://' . $config['wirisimageservicehost'] . ':' . $config['wirisimageserviceport'] . $path;
	}
	
	$data = array(
		'latex' => $_POST['latex']
	);
	
	if (isset($_POST['saveLatex'])) {
		$data['saveLatex'] = '';
	}
	
	$response = wrs_getContents($url, $data);

	if ($response !== false) {
		echo $response;
	}
	else {
		echo 'Error: could not connect to the latex translator service.';
	}
}
else {
	echo 'Error: no digest or latex has been sent.';
}
?>
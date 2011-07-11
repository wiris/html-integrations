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
	$filePath = WRS_FORMULA_DIRECTORY . '/' . basename($digest) . '.xml';
	
	if (is_file($filePath)) {
		if (($handle = fopen($filePath, 'r')) !== false) {
			if (($line = fgets($handle)) !== false) {
				echo $line;
			}
			
			fclose($handle);
		}
		else {
			echo 'Error: can not read the formula. Check your file privileges.';
		}
	}
	else {
		echo 'Error: formula does not exists.';
	}
}
else if (isset($_POST['latex'])) {
	echo '<math><mrow><mi>2</mi></mrow><semantics><annotation encoding="TeX">' . $_POST['latex'] . '</annotation></semantics></math>';
	exit;
	$config = wrs_loadConfig(WRS_CONFIG_FILE);
	$protocol = (isset($config['wirisimageserviceprotocol'])) ? $config['wirisimageserviceprotocol'] : 'http';
	$path = substr($config['wirisimageservicepath'], 0, strrpos($config['wirisimageservicepath'], '/')) . '/mathml';
	$response = wrs_getContents($protocol . '://' . $config['wirisimageservicehost'] . ':' . $config['wirisimageserviceport'] . $path, array('latex' => $_POST['latex']));

	if ($response !== false) {
		echo $response;
	}
	else {
		echo 'Error connecting to the latex translator service.';
	}
}
else {
	echo 'Error: no digest or latex has been sended.';
}
?>
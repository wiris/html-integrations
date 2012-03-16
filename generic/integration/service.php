<?php
include 'libwiris.php';

if (isset($_POST['service'])) {
	global $config;
	
	$config = wrs_loadConfig(WRS_CONFIG_FILE);
	$url = wrs_getImageServiceURL($config, $_POST['service']);
	$data = array();
	
	foreach ($_POST as $key => $value) {
		if ($key != 'service') {
			$data[$key] = $value;
		}
	}

	$response = wrs_getContents($config, $url, $data);

	if ($response !== false) {
		echo $response;
	}
	else {
		echo 'Error: the service is unavailable.';
	}
}
else {
	echo 'Error: undefined service.';
}
?>
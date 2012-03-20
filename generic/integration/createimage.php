<?php
include 'api.php';

if (!empty($_POST['mml'])) {
	try {
		$api = new com_wiris_plugin_PluginAPI();
		echo $api->mathml2img($_POST['mml'], dirname($_SERVER['PHP_SELF']), $_POST);
	}
	catch (Exception $e) {
		echo $e->getMessage();
	}
}
else {
	echo 'Error: no mathml has been sent.';
}
?>
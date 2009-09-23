<?php
define('WRS_CONFIG_FILE', '../configuration.ini');
define('WRS_CACHE_DIRECTORY', '../cache');
define('WRS_FORMULA_DIRECTORY', '../formulas');

function secure_stripslashes($element) {
	if (is_array($element)) {
		return array_map('secure_stripslashes', $element);
	}

	return stripslashes($element);
}

set_magic_quotes_runtime(0);

if (get_magic_quotes_gpc() == 1) {
	$_REQUEST = array_map('secure_stripslashes', $_REQUEST);
	$_GET = array_map('secure_stripslashes', $_GET);
	$_POST = array_map('secure_stripslashes', $_POST);
}
?>
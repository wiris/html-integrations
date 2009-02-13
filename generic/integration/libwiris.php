<?php
$configFile = '../configuration.ini';
$cacheDirectory = '../cache';
$formulaDirectory = '../formulas';

function stripSlashesInRequestVariables() {
	$_REQUEST = array_map('secure_stripslashes', $_REQUEST);
	$_GET = array_map('secure_stripslashes', $_GET);
	$_POST = array_map('secure_stripslashes', $_POST);
}

function secure_stripslashes($element) {
	if (is_array($element)) {
		return array_map('secure_stripslashes', $element);
	}

	return stripslashes($element);
}

set_magic_quotes_runtime(0);
if (get_magic_quotes_gpc() == 1) {
	stripSlashesInRequestVariables();
}

function loadConfig($file) {
	$toReturn = array();

	$content = file_get_contents($file);
	$content = str_replace("\r", '', $content);
	$content_lines = explode("\n", $content);
	$content_lines_length = count($content_lines);
	
	for ($i = 0; $i < $content_lines_length; ++$i) {
		$line_words = explode('=', $content_lines[$i], 2);
		
		if (count($line_words) == 2) {
			$key = trim($line_words[0]);
			$value = trim($line_words[1]);
			$toReturn[$key] = $value;
		}
	}
	
	return $toReturn;
}
?>
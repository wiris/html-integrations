<?php
define('WRS_CONFIG_FILE', '../configuration.ini');
define('WRS_CACHE_DIRECTORY', '../cache');
define('WRS_FORMULA_DIRECTORY', '../formulas');

global $wrs_imageConfigProperties;

$wrs_imageConfigProperties = array(
	'bgColor' => 'wirisimagebgcolor',
	'symbolColor' => 'wirisimagesymbolcolor',
	'transparency' => 'wiristransparency',
	'fontSize' => 'wirisimagefontsize',
	'numberColor' => 'wirisimagenumbercolor',
	'identColor' => 'wirisimageidentcolor',
	'identMathvariant' => 'wirisimageidentmathvariant',
	'numberMathvariant' => 'wirisimagenumbermathvariant',
	'fontIdent' => 'wirisimagefontident',
	'fontNumber' => 'wirisimagefontnumber'
);

function wrs_replaceVariable($value, $variableName, $variableValue) {	
	return str_replace('%' . $variableName, $variableValue, $value);
}

function wrs_getAvailableCASLanguages($languageString) {
	$availableLanguages = explode(',', $languageString);
		
	for ($i = count($availableLanguages) - 1; $i >= 0; --$i) {
		$availableLanguages[$i] = trim($availableLanguages[$i]);
	}

	// At least we should accept an empty language.
	
	if (!isset($availableLanguages[0])) {
		$availableLanguages[] = '';
	}
	
	return $availableLanguages;
}

function wrs_secureStripslashes($element) {
	if (is_array($element)) {
		return array_map('wrs_secureStripslashes', $element);
	}

	return stripslashes($element);
}

set_magic_quotes_runtime(0);

if (get_magic_quotes_gpc() == 1) {
	$_REQUEST = array_map('wrs_secureStripslashes', $_REQUEST);
	$_GET = array_map('wrs_secureStripslashes', $_GET);
	$_POST = array_map('wrs_secureStripslashes', $_POST);
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<?php
// ${license.statement}

require_once 'pluginbuilder.php';

$PARAMS = array_merge($_GET, $_POST);

// Adding - if necessary - CORS headers
$origin = isset($_SERVER['HTTP_ORIGIN'])? $_SERVER['HTTP_ORIGIN'] : "";
$res = new com_wiris_system_service_HttpResponse();
$pluginBuilder->addCorsHeaders($res, $origin);

$cas = $pluginBuilder->newCas();
$lang = isset($PARAMS['lang']) ? $PARAMS['lang']:null;
$mode = isset($PARAMS['mode']) ? $PARAMS['mode']:null;
echo $cas->cas($mode,$lang);

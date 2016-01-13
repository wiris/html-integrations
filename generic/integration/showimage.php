<?php

// ${license.statement}

require_once 'pluginbuilder.php';
$PARAMS = array_merge($_GET, $_POST);
$digest = isset($PARAMS['formula'])?$PARAMS['formula']:null;
$mml = isset($PARAMS['mml'])?$PARAMS['mml']:null;
$render = $pluginBuilder->newRender();

// Backwards compatibility
// showimage.php?formula.png --> showimage.php?formula
// because formula is md5 string, remove all extensions.
if (!is_null($digest)) {
	$a = explode(".", $digest);
	$digest = array_shift($a);
}

// Adding - if necessary - CORS headers
$origin = isset($_SERVER['HTTP_ORIGIN'])? $_SERVER['HTTP_ORIGIN'] : "";
$res = new com_wiris_system_service_HttpResponse();
$pluginBuilder->addCorsHeaders($res, $origin);

$r = $render->showImage($digest, $mml, $PARAMS);
if ($pluginBuilder->getConfiguration()->getProperty("wirisimageformat", "png") == "svg") {
	header('Content-Type: image/svg+xml');		
} else {
	header('Content-Type: image/png');	
}
echo $r;
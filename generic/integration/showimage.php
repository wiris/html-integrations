<?php

// ${license.statement}

require_once 'pluginbuilder.php';
$PARAMS = array_merge($_GET, $_POST);
$digest = isset($PARAMS['formula'])?$PARAMS['formula']:null;
$mml = isset($PARAMS['mml'])?$PARAMS['mml']:null;
$render = $pluginBuilder->newRender();
$jsonformat = isset($PARAMS['jsonformat'])?$PARAMS['jsonformat']:false;

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


if ($pluginBuilder->getConfiguration()->getProperty("wirispluginperformance", "false") == "true") {
   header("Content-type: application/json");
   $secondsToCache = 3600;
   $ts = gmdate("D, d M Y H:i:s", time() + $secondsToCache) . " GMT";
   header("Expires: $ts");
   header("Cache-Control: max-age=$secondsToCache");
   $lang = isset($PARAMS['lang'])?$PARAMS['lang']:'en';
	// If digest == null formula is not in cache.
	if (is_null($digest)) {
		$render->showImage(null, $mml, $PARAMS);
	    $digest = $render->computeDigest($mml, $PARAMS);
	}
   $r = $render->showImageJson($digest, $lang);
} else {
	$contentType = $pluginBuilder->getImageFormatController()->getContentType();
	header('Content-Type: ' . $contentType);
	$r = $render->showImage($digest, $mml, $PARAMS);
}
echo $r;
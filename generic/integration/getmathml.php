<?php

// ${license.statement}

require_once 'pluginbuilder.php';
$PARAMS = array_merge($_GET, $_POST);

$digest = isset($PARAMS['digest'])?$PARAMS['digest']:null;
if ($digest==null) {
    $digest = isset($PARAMS['md5'])?$PARAMS['md5']:null;
}
$latex = isset($PARAMS['latex'])?$PARAMS['latex']:null;

// Adding - if necessary - CORS headers
$origin = isset($_SERVER['HTTP_ORIGIN'])? $_SERVER['HTTP_ORIGIN'] : "";
$res = new com_wiris_system_service_HttpResponse();
$pluginBuilder->addCorsHeaders($res, $origin);

$render = $pluginBuilder->newTextService();
echo $render->getMathML($digest, $latex);

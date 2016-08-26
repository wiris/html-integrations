<?php

// Loaded from configuration
require_once 'pluginbuilder.php';

// Adding - if necessary - CORS headers
$origin = isset($_SERVER['HTTP_ORIGIN'])? $_SERVER['HTTP_ORIGIN'] : "";
$res = new com_wiris_system_service_HttpResponse();
$pluginBuilder->addCorsHeaders($res, $origin);
$PARAMS = array_merge($_GET, $_POST);

header('Content-Type: application/json');

echo $pluginBuilder->getConfiguration()->getJsonConfiguration($PARAMS['variableKeys']);
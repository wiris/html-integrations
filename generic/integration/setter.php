<?php
session_start();
$_SESSION["pluginbuilder"] = NULL;
$_SESSION["issetter"] = true;
// Loaded from configuration
require_once 'pluginbuilder.php';

$provider = $pluginBuilder->getCustomParamsProvider();
$variableKeys = $provider->getRequiredParameter('variablekeys');
$keyValues = $provider->getRequiredParameter('value');
$pluginBuilder->getConfiguration()->setConfigurations($variableKeys, $keyValues);

$_SESSION["pluginbuilder"] = $pluginBuilder;

// Adding - if necessary - CORS headers
$origin = isset($_SERVER['HTTP_ORIGIN'])? $_SERVER['HTTP_ORIGIN'] : "";
$res = new com_wiris_system_service_HttpResponse();
$pluginBuilder->addCorsHeaders($res, $origin);

header('Content-Type: application/json');

echo $pluginBuilder->getConfiguration()->getJsonConfiguration($variableKeys);

<?php

// ${license.statement}

header('Content-Type: application/x-javascript');
$NL = "\r\n";

// Loaded from configuration
require_once 'pluginbuilder.php';

// Adding - if necessary - CORS headers
$origin = isset($_SERVER['HTTP_ORIGIN'])? $_SERVER['HTTP_ORIGIN'] : "";
$res = new com_wiris_system_service_HttpResponse();
$pluginBuilder->addCorsHeaders($res, $origin);


// Scripts
echo   "// Scripts".$NL;
echo   "var _wrs_conf_createimagePath = _wrs_int_path + '/createimage.php';".$NL;
echo   "var _wrs_conf_editorPath = _wrs_int_path + '/editor.php';       // Specifies where is the editor HTML code (for popup window)".$NL;
echo   "var _wrs_conf_CASPath = _wrs_int_path + '/cas.php';             // Specifies where is the WIRIS cas HTML code (for popup window)".$NL;
echo   "var _wrs_conf_createimagePath = _wrs_int_path + '/createimage.php';        // Specifies where is createimage script".$NL;
echo   "var _wrs_conf_createcasimagePath = _wrs_int_path + '/createcasimage.php';	// Specifies where is createcasimage script".$NL;
echo   "var _wrs_conf_getmathmlPath = _wrs_int_path + '/getmathml.php'; // Specifies where is the getmathml script.".$NL;
echo   "var _wrs_conf_servicePath = _wrs_int_path + '/service.php'; // Specifies where is the service script.".$NL;

$conf = $pluginBuilder->getConfiguration();
echo $conf->getJavaScriptConfiguration();

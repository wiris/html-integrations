<?php

// ${license.statement}

header('Content-Type: application/x-javascript');
$NL = "\r\n";

// Scripts
echo   "// Scripts".$NL;
echo   "var _wrs_conf_createimagePath = _wrs_conf_path + '/integration/createimage.php';".$NL;
echo   "var _wrs_conf_editorPath = _wrs_conf_path + '/integration/editor.php';       // Specifies where is the editor HTML code (for popup window)".$NL;
echo   "var _wrs_conf_CASPath = _wrs_conf_path + '/integration/cas.php';             // Specifies where is the WIRIS cas HTML code (for popup window)".$NL;
echo   "var _wrs_conf_createimagePath = _wrs_conf_path + '/integration/createimage.php';        // Specifies where is createimage script".$NL;
echo   "var _wrs_conf_createcasimagePath = _wrs_conf_path + '/integration/createcasimage.php';	// Specifies where is createcasimage script".$NL;
echo   "var _wrs_conf_getmathmlPath = _wrs_conf_path + '/integration/getmathml.php'; // Specifies where is the getmathml script.".$NL;
echo   "var _wrs_conf_servicePath = _wrs_conf_path + '/integration/service.php'; // Specifies where is the service script.".$NL;

// Loaded from configuration
require_once 'pluginbuilder.php';
$conf = $pluginBuilder->getConfiguration();
echo $conf->getJavaScriptConfiguration();

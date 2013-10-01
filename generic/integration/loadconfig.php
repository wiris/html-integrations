<?php

//
//  Copyright (c) 2011, Maths for More S.L. http://www.wiris.com
//  This file is part of WIRIS Plugin.
//
//  WIRIS Plugin is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  any later version.
//
//  WIRIS Plugin is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with WIRIS Plugin. If not, see <http://www.gnu.org/licenses/>.
//

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
?>
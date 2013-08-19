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

require_once 'lib/php/Boot.class.php';
$PARAMS = array_merge($_GET, $_POST);
$service = $PARAMS['service'];
$pb = com_wiris_plugin_api_PluginBuilder::getInstance();
$pb->addConfigurationUpdater(new com_wiris_plugin_web_PhpConfigurationUpdater());
$render = $pb->newTextService();
$r = $render->service($service, $PARAMS);
header('Content-Type: text/plain; charset=utf-8');
echo $r;
?>
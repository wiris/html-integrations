<?php

// ${license.statement}

require_once 'lib/php/Boot.class.php';
$PARAMS = array_merge($_GET, $_POST);
$service = $PARAMS['service'];
$pb = com_wiris_plugin_api_PluginBuilder::getInstance();
$pb->addConfigurationUpdater(new com_wiris_plugin_web_PhpConfigurationUpdater());
$render = $pb->newTextService();
$r = $render->service($service, $PARAMS);
header('Content-Type: text/plain; charset=utf-8');
echo $r;

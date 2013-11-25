<?php

// ${license.statement}

require_once 'lib/php/Boot.class.php';
$PARAMS = array_merge($_GET, $_POST);

$digest = isset($PARAMS['digest'])?$PARAMS['digest']:null;
if ($digest==null) {
    $digest = isset($PARAMS['md5'])?$PARAMS['md5']:null;
}
$latex = isset($PARAMS['latex'])?$PARAMS['latex']:null;
$pb = com_wiris_plugin_api_PluginBuilder::getInstance();
$pb->addConfigurationUpdater(new com_wiris_plugin_web_PhpConfigurationUpdater());
$render = $pb->newTextService();
echo $render->getMathML($digest, $latex);

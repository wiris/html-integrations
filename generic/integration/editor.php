<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<?php
// ${license.statement}

require_once 'lib/php/Boot.class.php';

$PARAMS = array_merge($_GET, $_POST);
$pb = com_wiris_plugin_api_PluginBuilder::getInstance();
$pb->addConfigurationUpdater(new com_wiris_plugin_web_PhpConfigurationUpdater());
$render = $pb->newEditor();
$lang = isset($PARAMS['lang']) ? $PARAMS['lang']:null;
echo $render->editor($lang, $PARAMS);

<?php

// ${license.statement}
require_once 'plugin.php';

$wrap = com_wiris_system_CallWrapper::getInstance();
$wrap->start();
$pluginBuilder = com_wiris_plugin_api_PluginBuilder::getInstance();
$wrap->stop();

$moodle = file_exists(".." . DIRECTORY_SEPARATOR . "version.php");

if ($moodle) {
    $wirisFilter = '../MoodleConfigurationUpdater.php';
    $config = '../../../' . 'config.php';

    define('NO_MOODLE_COOKIES', true); // Because it interferes with caching
     $scriptName = explode('/', $_SERVER["SCRIPT_FILENAME"]);
        $scriptName = array_pop($scriptName);

        if ($scriptName == 'showimage.php') {
            define('ABORT_AFTER_CONFIG', true);
            define('MOODLE_INTERNAL', true); // Moodle 2.2 - 2.5 min config doesn't define 'MOODLE_INTERNAL'.
        }

    $wrap->stop();
    include_once $config;
    include_once $wirisFilter;
    $wrap->start();
    $pluginBuilder->addConfigurationUpdater(new com_wiris_plugin_configuration_MoodleConfigurationUpdater());
    $wrap->stop();
}
$wrap->start();
$pluginBuilder->addConfigurationUpdater(new com_wiris_plugin_web_PhpConfigurationUpdater());

<?php

// ${license.statement}
require_once 'plugin.php';

$wrap = com_wiris_system_CallWrapper::getInstance();
$wrap->start();
$pluginBuilder = com_wiris_plugin_api_PluginBuilder::getInstance();
$wrap->stop();

$moodle = file_exists(".." . DIRECTORY_SEPARATOR . "version.php");

if ($moodle) {
    require_once 'moodletreestorageandcache.php';
    $wirisFilter = '../MoodleConfigurationUpdater.php';
    $config = '../../../' . 'config.php';

   // define('NO_MOODLE_COOKIES', true); // Because it interferes with caching
     $scriptName = explode('/', $_SERVER["SCRIPT_FILENAME"]);
        $scriptName = array_pop($scriptName);

        if ($scriptName == 'showimage.php') {
            define('ABORT_AFTER_CONFIG', true);
            if (!defined('MOODLE_INTERNAL')) {
                define('MOODLE_INTERNAL', true); // Moodle 2.2 - 2.5 min config doesn't define 'MOODLE_INTERNAL'.
            }
        }

    $wrap->stop();
    if (!defined('MOODLE_INTERNAL')) {
        require_once $config;
    }
    require_once $wirisFilter;
    $wrap->start();
    $pluginBuilder->addConfigurationUpdater(new com_wiris_plugin_configuration_MoodleConfigurationUpdater());
    require_once('moodleparamsprovider.php');
    $pluginBuilder->setCustomParamsProvider(new MoodleParamsProvider());
    $pluginBuilder->addConfigurationUpdater(new com_wiris_plugin_web_PhpConfigurationUpdater());
    $pluginBuilder->getConfiguration()->getFullConfiguration();
    $storage = new MoodleStorageAndCache();
    $storage->init(null, $pluginBuilder->getConfiguration()->getFullConfiguration());
    $pluginBuilder->setStorageAndCache($storage);
} else {
    $wrap->start();
    require_once('phpparamsprovider.php');
    $pluginBuilder->setCustomParamsProvider(new PhpParamsProvider());
    $pluginBuilder->addConfigurationUpdater(new com_wiris_plugin_web_PhpConfigurationUpdater());
}


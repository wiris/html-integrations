<?php

// ${license.statement}
require_once 'plugin.php';

$wrap = com_wiris_system_CallWrapper::getInstance();
$wrap->start();
$pluginBuilder = com_wiris_plugin_api_PluginBuilder::getInstance();
$wrap->stop();

$moodle = file_exists(".." . DIRECTORY_SEPARATOR . "version.php");

if ($moodle) {
    require_once('../../../' . 'config.php');
    require_once('../lib.php');
    // Automatic class loading not avaliable for Moodle 2.4 and 2.5.
    wrs_loadclasses();
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
    $test = new filter_wiris_storageandcache();
    $wrap->start();
    $pluginBuilder->addConfigurationUpdater(new filter_wiris_configurationupdater());
    $pluginBuilder->setCustomParamsProvider(new filter_wiris_paramsprovider());
    $pluginBuilder->addConfigurationUpdater(new com_wiris_plugin_web_PhpConfigurationUpdater());
    $pluginBuilder->getConfiguration()->getFullConfiguration();
    $storage = new filter_wiris_storageandcache();
    $storage->init(null, $pluginBuilder->getConfiguration()->getFullConfiguration());
    $pluginBuilder->setStorageAndCache($storage);
} else {
    $wrap->start();
    require_once('phpparamsprovider.php');
    $pluginBuilder->setCustomParamsProvider(new PhpParamsProvider());
    $pluginBuilder->addConfigurationUpdater(new com_wiris_plugin_web_PhpConfigurationUpdater());
}


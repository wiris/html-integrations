<?php
// ${license.statement}
require_once 'plugin.php';

$wrap = com_wiris_system_CallWrapper::getInstance();
$wrap->start();
if(!isset($_SESSION)) session_start();
if (isset($_SESSION["pluginbuilder"])) {
    $pluginBuilder = $_SESSION["pluginbuilder"];
}
else {
    if (!isset($_SESSION["issetter"])) {
        session_destroy();
        // It's required to set time in the past in order to delete the current
        // session cookie.
        setcookie('PHPSESSID', '', time() - 3600, '/');
    }
    $_SESSION["issetter"] = NULL;
    $pluginBuilder = com_wiris_plugin_api_PluginBuilder::getInstance();
}
$wrap->stop();

$moodle = file_exists(".." . DIRECTORY_SEPARATOR . "version.php");

if ($moodle) {
    require_once('../../../' . 'config.php');
    require_once('../lib.php');
    if (!class_exists('moodlefilecache')) {
        require_once('../classes/moodlefilecache.php');
    }
    if (!class_exists('moodledbcache')) {
        require_once('../classes/moodledbcache.php');
    }
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
    $wrap->start();
    $pluginBuilder->addConfigurationUpdater(new filter_wiris_configurationupdater());
    $pluginBuilder->setCustomParamsProvider(new filter_wiris_paramsprovider());
    $pluginBuilder->addConfigurationUpdater(new com_wiris_plugin_web_PhpConfigurationUpdater());
    $pluginBuilder->getConfiguration()->getFullConfiguration();
    // Class to manage file cache.
    $cachefile = new moodlefilecache('filter_wiris', 'images');
    $pluginBuilder->setStorageAndCacheCacheObject($cachefile);
    // Class to manage formulas (i.e plain text) cache.
    $cachedb = new moodledbcache('filter_wiris_formulas', 'md5', 'content');
    $pluginBuilder->setStorageAndCacheCacheFormulaObject($cachedb);

} else {
    $wrap->start();
    require_once('phpparamsprovider.php');
    $pluginBuilder->setCustomParamsProvider(new PhpParamsProvider());
    $pluginBuilder->addConfigurationUpdater(new com_wiris_plugin_web_PhpConfigurationUpdater());
    $pluginBuilder->setStorageAndCacheCacheObject(new com_wiris_plugin_impl_CacheImpl($pluginBuilder->getConfiguration()->getFullConfiguration()));
    $pluginBuilder->setStorageAndCacheCacheFormulaObject(new com_wiris_plugin_impl_CacheFormulaImpl($pluginBuilder->getConfiguration()->getFullConfiguration()));
}

<?php
// ${license.statement}
require_once ('plugin.php');

$wrap = com_wiris_system_CallWrapper::getInstance();
$wrap->start();
$pluginBuilder = com_wiris_plugin_api_PluginBuilder::getInstance();
$wrap->stop();

$moodle = file_exists('..' . DIRECTORY_SEPARATOR . 'version.php');

if ($moodle) {
    require_once('../../../' . 'config.php');
    require_once($CFG->dirroot . '/filter/wiris/lib.php');
    if (!class_exists('moodlefilecache')) {
        require_once($CFG->dirroot . '/filter/wiris/classes/moodlefilecache.php');
    }
    if (!class_exists('moodledbcache')) {
        require_once($CFG->dirroot . '/filter/wiris/classes/moodledbcache.php');
    }
    if (!class_exists('moodledbjsoncache')) {
        require_once($CFG->dirroot . '/filter/wiris/classes/moodledbjsoncache.php');
    }
    // Automatic class loading not avaliable for Moodle 2.4 and 2.5.
    wrs_loadclasses();
    // define('NO_MOODLE_COOKIES', true); // Because it interferes with caching
    $scriptName = explode('/', $_SERVER['SCRIPT_FILENAME']);
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
    if ($pluginBuilder->getConfiguration()->getProperty('wirispluginperformance', 'false') == 'false' || 
            $pluginBuilder->getConfiguration()->getProperty('wirisimageformat', 'png') == 'png') {
        $cachefile = new moodlefilecache('filter_wiris', 'images');
    }
    else {
        $cachefile = new moodledbjsoncache('filter_wiris_formulas', 'md5', 'jsoncontent');
    }
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

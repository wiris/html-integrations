<?php

// ${license.statement}
require_once 'plugin.php';

$wrap = com_wiris_system_CallWrapper::getInstance();
$wrap->start();
$pluginBuilder = com_wiris_plugin_api_PluginBuilder::getInstance();
$wrap->stop();

// Moodle base dir is 6 or 7 folders up, depending on the text editor.
// If open_basedir is defined, we only check moodlelib.php inside open_basedir environment
//
$moodle_dirrot = '../../../../../..';
$moodle = false;
// $deep = 10 allow to check all cases.
$deep = 10;

if ($openbasedir = get_cfg_var("open_basedir")) {
    $openbasedirarray = explode(DIRECTORY_SEPARATOR, $openbasedir);
    $currentscriptarray = explode(DIRECTORY_SEPARATOR, dirname(__FILE__));
    $deep = count(array_diff($currentscriptarray, $openbasedirarray));
}

if ($deep >= 6) {
    if (file_exists($moodle_dirrot . '/lib/moodlelib.php')) {
        $moodle = true;
    } else {
        if ($deep >= 7) {
            if (file_exists($moodle_dirrot . '/../lib/moodlelib.php')) {
                $moodle_dirrot .= '/..';
                $moodle = true;
            } else {
                if ($deep >= 8) {
                    if (file_exists($moodle_dirrot . '/../../lib/moodlelib.php')) {
                        $moodle_dirrot .= '/../..';
                        $moodle = true;
                    }
                }
            }
        }
    }
}

if ($moodle) {
    $wirisFilter = $moodle_dirrot . '/filter/wiris/MoodleConfigurationUpdater.php';
    $config = $moodle_dirrot . '/config.php';

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

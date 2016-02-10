<?php

// ${license.statement}
require_once 'plugin.php';

$wrap = com_wiris_system_CallWrapper::getInstance();
$wrap->start();
$pluginBuilder = com_wiris_plugin_api_PluginBuilder::getInstance();
$wrap->stop();


$moodle = false;

// Check if platform is Moodle.
if (file_exists(".." . DIRECTORY_SEPARATOR . "version.php")) { // Atto
    $moodle=true;
    $moodle_dirrot= $moodle_dirrot = "../../../../../.."; // Moodle 2.7 and upwards.
}

if (strrpos(getcwd(),"lib".DIRECTORY_SEPARATOR."editor".DIRECTORY_SEPARATOR."tinymce")) { // TinyMCE.
    if (file_exists(".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "version.php")) { // Tinymce on Moodle 2.4 and upwards         .
        $moodle=true;
        $moodle_dirrot= "../../../../../../.."; // Moodle 2.4 and upwards.
    } else {
        $moodle = true;
        $moodle_dirrot = "../../../../../../../.."; // Moodle 2.2 & 2.3.
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

<?php

// ${license.statement}

require_once 'lib/php/Boot.class.php';

$pluginBuilder = com_wiris_plugin_api_PluginBuilder::getInstance();

// Moodle base dir is 6 or 7 folders up, depending on the text editor.
$moodle_dirrot = '../../../../../..';
$moodle = false;
if (file_exists($moodle_dirrot . '/lib/moodlelib.php')) {
    $moodle = true;
} elseif (file_exists($moodle_dirrot . '/../lib/moodlelib.php')) {
    $moodle_dirrot .= '/..';
    $moodle = true;
}
if ($moodle) {
    $wirisFilter = $moodle_dirrot . '/filter/wiris/MoodleConfigurationUpdater.php';
    $config = $moodle_dirrot . '/config.php';	
    define('NO_MOODLE_COOKIES', true); // Because it interferes with caching
    include_once $config;
    include_once $wirisFilter;
    $pluginBuilder->addConfigurationUpdater(new com_wiris_plugin_configuration_MoodleConfigurationUpdater());
}

$pluginBuilder->addConfigurationUpdater(new com_wiris_plugin_web_PhpConfigurationUpdater());

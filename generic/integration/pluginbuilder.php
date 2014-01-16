<?php

// ${license.statement}

require_once 'lib/php/Boot.class.php';

$pluginBuilder = com_wiris_plugin_api_PluginBuilder::getInstance();

$moodle2_4 = '../../../../../../moodlelib.php';
if (file_exists($moodle2_4)) {
	$wirisFilter = '../../../../../../../filter/wiris/MoodleConfigurationUpdater.php';
	$config = '../../../../../../../config.php';
	//if (file_exists($wirisFilter)) {
		define('NO_MOODLE_COOKIES', true); // Because it interferes with caching
		include_once $config;
		include_once $wirisFilter;
		$pluginBuilder->addConfigurationUpdater(new com_wiris_plugin_configuration_MoodleConfigurationUpdater());
	//}
}

$pluginBuilder->addConfigurationUpdater(new com_wiris_plugin_web_PhpConfigurationUpdater());

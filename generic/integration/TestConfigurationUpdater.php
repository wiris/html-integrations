<?php
require_once 'ConfigurationUpdater.php';

class com_wiris_plugin_configuration_TestConfigurationUpdater implements com_wiris_plugin_configuration_ConfigurationUpdater {
	public function com_wiris_plugin_configuration_TestConfigurationUpdater() {
    }
    
    public function init() {
    }
    
    public function updateConfiguration(&$configuration) {
        $configuration['wirisimageserviceversion'] = '1.0';
        $configuration['wiristransparency'] = 'false';
        $configuration['wirisimagebgcolor'] = '#ff0000';
		$configuration['wiriscachedirectory'] = 'c:/temp/cache';
		$configuration['wirisformuladirectory'] = 'c:/temp/formulas';
    }
}
?>
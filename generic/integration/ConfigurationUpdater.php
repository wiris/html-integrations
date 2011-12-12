<?php
interface com_wiris_plugin_configuration_ConfigurationUpdater {
    /**
     * Initializes the configuration udpater system. This method is called before any call to other methods.
     */
    public function init();
    
    /**
     * Updates the configuration table with the desired values. It is expected to
     * set the values of the associative array to change the value of any property.
     * 
     * @param array configuration The configuration table.
     */
    public function updateConfiguration(&$configuration);
}
?>
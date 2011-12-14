<?php
require_once dirname(__FILE__) . '/libwiris.php';

class com_wiris_plugin_PluginAPI {
	private $formulaDirectory;
	
	public function com_wiris_plugin_PluginAPI() {
		$this->formulaDirectory = wrs_getFormulaDirectory(wrs_loadConfig(WRS_CONFIG_FILE));
	}

	public function mathml2img($mathml, $baseURL, $properties = array()) {
		$parsedProperties = array();
		global $wrs_xmlFileAttributes;
		
		foreach ($properties as $key => $value) {
			if (in_array($key, $wrs_xmlFileAttributes) || substr($key, 0, 4) == 'font') {
				$parsedProperties[$key] = $value;
			}
		}
		
		$parsedProperties['mml'] = $mathml;
		$toSave = wrs_createIni($parsedProperties);
		$fileName = md5($toSave);
		$url = $baseURL . '/showimage.php?formula=' . $fileName . '.png';
		$filePath = $this->formulaDirectory . '/' . $fileName . '.ini';
		
		if (!is_file($filePath) && file_put_contents($filePath, $toSave) === false) {
			throw new Exception('Unable to create formula file.');
		}
		
		return $url;
	}
}
?>
<?php

//
//  Copyright (c) 2011, Maths for More S.L. http://www.wiris.com
//  This file is part of WIRIS Plugin.
//
//  WIRIS Plugin is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  any later version.
//
//  WIRIS Plugin is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with WIRIS Plugin. If not, see <http://www.gnu.org/licenses/>.
//

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
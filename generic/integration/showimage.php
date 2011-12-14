<?php
include 'libwiris.php';

// Retrocompatibility: there was a time that the files had another format.

function getConfigurationAndFonts($config, $formulaPath) {
	if (is_file($formulaPath) && ($handle = fopen($formulaPath, 'r')) !== false) {
		$fonts = array();
		
		if (($line = fgets($handle)) !== false) {
			$mathml = trim($line);

			global $wrs_imageConfigProperties, $wrs_xmlFileAttributes;
			$i = 0;
			$wrs_xmlFileAttributesCount = count($wrs_xmlFileAttributes);
			
			while (($line = fgets($handle)) !== false && $i < $wrs_xmlFileAttributesCount) {
				$config[$wrs_imageConfigProperties[$wrs_xmlFileAttributes[$i]]] = trim($line);
				++$i;
			}
			
			$i = 0;
			
			while (($line = fgets($handle)) !== false) {
				$line = trim($line);
				
				if (isset($line[0])) {
					$fonts['font' . $i] = $line;
					++$i;
				}
			}
		}
		else {
			$mathml = '';
		}
		
		fclose($handle);
		
		return array(
			'mathml' => $mathml,
			'config' => $config,
			'fonts' => $fonts
		);
	}
	
	return false;
}

function getConfigurationAndFontsFromIni($config, $formulaPath) {
	$formulaConfig = wrs_parseIni($formulaPath);

	if ($formulaConfig === false) {
		return false;
	}
	
	$fonts = array();
	global $wrs_imageConfigProperties;
	
	foreach ($formulaConfig as $key => $value) {
		if ($key != 'mml') {
			if (substr($key, 0, 4) == 'font') {
				$fonts[$key] = trim($value);
			}
			else {
				$config[$wrs_imageConfigProperties[$key]] = trim($value);
			}
		}
	}
	
	return array(
		'mathml' => trim($formulaConfig['mml']),
		'config' => $config,
		'fonts' => $fonts
	);
}

function createImage($config, $formulaPath, $formulaPathExtension, $imagePath) {
	$configAndFonts = ($formulaPathExtension == 'ini') ? getConfigurationAndFontsFromIni($config, $formulaPath . '.ini') : getConfigurationAndFonts($config, $formulaPath . '.xml');
	
	if ($configAndFonts !== false) {
		$config = $configAndFonts['config'];
		
		// Retrocompatibility: when wirisimagenumbercolor is not defined
		
		if (!isset($config['wirisimagenumbercolor']) && isset($config['wirisimagesymbolcolor'])) {
			$config['wirisimagenumbercolor'] = $config['wirisimagesymbolcolor'];
		}
		
		// Retrocompatibility: when wirisimageidentcolor is not defined
		
		if (!isset($config['wirisimageidentcolor']) && isset($config['wirisimagesymbolcolor'])) {
			$config['wirisimageidentcolor'] = $config['wirisimagesymbolcolor'];
		}
		
		// Converting configuration to parameters.
		global $wrs_imageConfigProperties;
		$properties = array('mml' => $configAndFonts['mathml']);
		
		foreach ($wrs_imageConfigProperties as $serverParam => $configKey) {
			if (isset($config[$configKey])) {
				$properties[$serverParam] = trim($config[$configKey]);
			}
		}
		
		// Converting fonts to parameters.
		
		if (isset($config['wirisimagefontranges'])) {
			$carry = count($configAndFonts['fonts']);
			$fontRanges = explode(',', $config['wirisimagefontranges']);
			$fontRangesCount = count($fontRanges);
			$j = 0;
			
			for ($i = 0; $i < $fontRangesCount; ++$i) {
				$rangeName = trim($fontRanges[$i]);
				
				if (isset($config[$rangeName])) {
					$configAndFonts['fonts']['font' . ($carry + $j)] = trim($config[$rangeName]);
					++$j;
				}
			}
		}

		// Query.
		$response = wrs_getContents(wrs_getImageServiceURL($config, NULL), array_merge($configAndFonts['fonts'], $properties));
		
		if ($response === false) {
			return false;
		}

		file_put_contents($imagePath, $response);
		return true;
	}
	
	return false;
}

if (empty($_GET['formula'])) {
	echo 'Error: no image name has been sended.';
}
else {
	$config = wrs_loadConfig(WRS_CONFIG_FILE);
	$formula = rtrim(basename($_GET['formula']), '.png');
	$formulaPath = wrs_getFormulaDirectory($config) . '/' . $formula;
	$extension = (is_file($formulaPath . '.ini')) ? 'ini' : 'xml';
	$imagePath = wrs_getCacheDirectory($config) . '/' . $formula . '.png';
	
	if (is_file($imagePath) || createImage($config, $formulaPath, $extension, $imagePath)) {
		header('Content-Type: image/png');
		readfile($imagePath);
	}
	else {
		echo 'Error creating the image.';
	}
}
?>
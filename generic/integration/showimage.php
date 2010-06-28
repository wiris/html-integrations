<?php
include 'libwiris.php';

function createImage($config, $formulaPath, $imagePath) {
	if (is_file($formulaPath) && ($handle = fopen($formulaPath, 'r')) !== false) {
		$fonts = array();
		
		if (($line = fgets($handle)) !== false) {
			$mathml = trim($line);
			global $wrs_imageConfigProperties;
			$current = reset($wrs_imageConfigProperties);
			
			while (($line = fgets($handle)) !== false && $current !== false) {
				$config[$current] = trim($line);
				$current = next($wrs_imageConfigProperties);
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
		
		// Retrocompatibility: when wirisimagenumbercolor is not defined
		
		if (!isset($config['wirisimagenumbercolor'])) {
			$config['wirisimagenumbercolor'] = $config['wirisimagesymbolcolor'];
		}
		
		// Retrocompatibility: when wirisimageidentcolor is not defined
		
		if (!isset($config['wirisimageidentcolor'])) {
			$config['wirisimageidentcolor'] = $config['wirisimagesymbolcolor'];
		}
		
		$properties = array('mml' => $mathml);
		
		foreach ($wrs_imageConfigProperties as $serverParam => $configKey) {
			if (isset($config[$configKey])) {
				$properties[$serverParam] = $config[$configKey];
			}
		}

		$postdata = http_build_query(array_merge($fonts, $properties));
		
		$contextArray = array('http' =>
			array(
				'method'  => 'POST',
				'header'  => 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
				'content' => $postdata
			)
		);

		if (isset($config['wirisproxy']) && $config['wirisproxy'] == 'true') {
			$contextArray['http']['proxy'] = 'tcp://' . $config['wirisproxy_host'] . ':' . $config['wirisproxy_port'];
			$contextArray['http']['request_fulluri'] = true;
		}

		$context = stream_context_create($contextArray);

		if (($response = file_get_contents('http://' . $config['wirisimageservicehost'] . ':' . $config['wirisimageserviceport'] . $config['wirisimageservicepath'], false, $context)) === false) {
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
	$formula = rtrim(basename($_GET['formula']), '.png');
	$imagePath = WRS_CACHE_DIRECTORY . '/' . $formula . '.png';
	$config = parse_ini_file(WRS_CONFIG_FILE);
	
	if (is_file($imagePath) || createImage($config, WRS_FORMULA_DIRECTORY . '/' . $formula . '.xml', $imagePath)) {
		header('Content-Type: image/png');
		readfile($imagePath);
	}
	else {
		echo 'Error creating the image.';
	}
}

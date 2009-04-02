<?php
include('libwiris.php');

function createImage($config, $formulaFile, $imageFile) {
	if (is_file($formulaFile) && ($content = file_get_contents($formulaFile)) !== false) {
		$properties = explode("\n", $content);
		$mathml = $properties[0];
		
		if (isset($properties[1])) {
			$config['wirisimagebgcolor'] = $properties[1];
			
			if (isset($properties[2])) {
				$config['wirisimagesymbolcolor'] = $properties[2];
				
				if (isset($properties[3])) {
					$config['wiristransparency'] = $properties[3];
					
					if (isset($properties[4])) {
						$config['wirisimagefontsize'] = $properties[4];
						
						if (isset($properties[5])) {
							$config['wirisimagenumbercolor'] = $properties[5];
							
							if (isset($properties[6])) {
								$config['wirisimageidentcolor'] = $properties[6];
							}
						}
					}
				}
			}
		}
		
		// Retrocompatibility: when wirisimagenumbercolor isn't defined
		if (!isset($config['wirisimagenumbercolor'])) {
			$config['wirisimagenumbercolor'] = $config['wirisimagesymbolcolor'];
		}
		
		// Retrocompatibility: when wirisimageidentcolor isn't defined
		if (!isset($config['wirisimageidentcolor'])) {
			$config['wirisimageidentcolor'] = $config['wirisimagesymbolcolor'];
		}

		$postdata = http_build_query(
			array(
				'mml' => $mathml,
				'bgColor' => $config['wirisimagebgcolor'],
				'symbolColor' => $config['wirisimagesymbolcolor'],
				'numberColor' => $config['wirisimagenumbercolor'],
				'identColor' => $config['wirisimageidentcolor'],
				'transparency' => $config['wiristransparency'],
				'fontSize' => $config['wirisimagefontsize']
			)
		);
		
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

		file_put_contents($imageFile, $response);
		return true;
	}
	
	return false;
}

if (empty($_GET['formula'])) {
	echo 'Error: no image name has been sended.';
}
else {
	$formula = rtrim(basename($_GET['formula']), '.png');
	$imagePath = $cacheDirectory . '/' . $formula . '.png';
	$config = loadConfig($configFile);
	
	if (is_file($imagePath) || createImage($config, $formulaDirectory . '/' . $formula . '.xml', $imagePath)) {
		header('Content-Type: image/png');
		echo file_get_contents($imagePath);
	}
	else {
		echo 'Error creating the image.';
	}
}

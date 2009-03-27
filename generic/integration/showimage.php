<?php
include('libwiris.php');

function isMathml($input) {
	return (mb_substr($input, 0, 12) == '<math xmlns=');
}

function createImage($config, $formulaFile, $imageFile) {
	if (is_file($formulaFile) and ($content = file_get_contents($formulaFile)) !== false) {
		if (isMathml($content)) {
			$mathml = $content;
		}
		else {
			$properties;
			mb_parse_str($content, $properties);
			$mathml = (isset($properties['mml'])) ? $properties['mml'] : '';
			$config['wirisimagebgcolor'] = $properties['wirisimagebgcolor'];
			$config['wirisimagesymbolcolor'] = $properties['wirisimagesymbolcolor'];
			$config['wiristransparency'] = $properties['wiristransparency'];
			$config['wirisimagefontsize'] = $properties['wirisimagefontsize'];
		}
		
		$postdata = http_build_query(
			array(
				'mml' => $mathml,
				'bgColor' => $config['wirisimagebgcolor'],
				'symbolColor' => $config['wirisimagesymbolcolor'],
				'numberColor' => $config['wirisimagesymbolcolor'],
				'identColor' => $config['wirisimagesymbolcolor'],
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

		if (isset($config['wirisproxy']) and $config['wirisproxy'] == 'true') {
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
	$fileExists = false;
	
	if (!is_file($imagePath)) {
		$config = loadConfig($configFile);
		$fileExists = createImage($config, $formulaDirectory . '/' . $formula . '.xml', $imagePath);
	}
	
	if ($fileExists) {
		header('Content-Type: image/png');
		echo file_get_contents($imagePath);
	}
	else {
		echo 'Error creating the image.';
	}
}

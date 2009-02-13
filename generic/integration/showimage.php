<?php
include('libwiris.php');

function createImage($config, $formulaFile, $imageFile) {
	if (is_file($formulaFile) and ($mathml = file_get_contents($formulaFile)) !== false) {
		$postdata = http_build_query(
			array(
				'mml' => $mathml,
				'bgColor' => $config['wirisimagebgcolor'],
				'symbolColor' => $config['wirisimagesymbolcolor'],
				'fontSize' => $config['wirisimagefontsize'],
				'transparency' => $config['wiristransparency']
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
	$config = loadConfig($configFile);
	$imagePath = $cacheDirectory . '/' . $formula . '.png';
	
	if (is_file($imagePath) || createImage($config, $formulaDirectory . '/' . $formula . '.xml', $imagePath)) {
		header('Content-Type: image/png');
		echo file_get_contents($imagePath);
	}
	else {
		echo 'Error creating the image.';
	}
}

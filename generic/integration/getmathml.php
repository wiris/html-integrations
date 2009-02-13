<?php
include('libwiris.php');

if (isset($_POST['md5']) && mb_strlen($_POST['md5']) == 32) {
	$filePath = $formulaDirectory . '/' . basename($_POST['md5']) . '.xml';
	
	if (is_file($filePath)) {
		if (($content = file_get_contents($filePath)) !== false) {
			echo $content;
		}
		else {
			echo 'Error: can\'t read the formula. Check your file privileges.';
		}
	}
}
else {
	echo 'Error: no md5 has been sended.';
}
?>
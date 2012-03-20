<?php
include 'libwiris.php';
$config = wrs_loadConfig(WRS_CONFIG_FILE);
/*
$accessibleParameters = array('wirisimageservicehost', 'wirisimageserviceport', 'wirisimageservicepath', 'wirisimageserviceprotocol', 
'wirisimageserviceversion', 'wiristransparency', 'wirisimagebgcolor', 'wirisimagefontsize', 'wirisimageidentcolor', 'wirisimagenumbercolor',
 'wirisimagesymbolcolor', 'wirisimageidentmathvariant', 'wirisimagenumbermathvariant', 'wirisimagefontident', 'wirisimagefontnumber', 'wirisimagefontranges',
 'wirisformulaeditorcodebase', 'wirisformulaeditorarchive', 'wirisformulaeditorcode', 'wirisformulaeditorlang', 'wiriscascodebase', 
 'wiriscasarchive', 'wiriscasclass', 'wiriscaslanguages', 'CAS_width', 'CAS_height', 'wirisconfigurationclass', 'wirisconfigurationrefreshtime');
*/
echo json_encode($config);
?>
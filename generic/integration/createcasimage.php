<?php
// ${license.statement}

require_once 'pluginbuilder.php';
$PARAMS = array_merge($_GET, $_POST);
$cas = $pluginBuilder->newCas();
$outp = array();
echo $cas->createCasImage($PARAMS['image']);

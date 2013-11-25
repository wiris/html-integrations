<?php

// ${license.statement}

require_once 'pluginbuilder.php';
$PARAMS = array_merge($_GET, $_POST);
$cas = $pluginBuilder->newCas();
$r = $cas->showCasImage($PARAMS['formula'], $PARAMS);
header('Content-Type: image/png');
echo $r;

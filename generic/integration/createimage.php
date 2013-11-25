<?php
// ${license.statement}

require_once 'pluginbuilder.php';
$PARAMS = array_merge($_GET, $_POST);
$render = $pluginBuilder->newRender();
$outp = null;
echo $render->createImage($PARAMS['mml'], $PARAMS, $outp);

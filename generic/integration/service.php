<?php

// ${license.statement}

require_once 'pluginbuilder.php';
$PARAMS = array_merge($_GET, $_POST);
$service = $PARAMS['service'];
$render = $pluginBuilder->newTextService();
$r = $render->service($service, $PARAMS);
header('Content-Type: text/plain; charset=utf-8');
echo $r;

<?php

// ${license.statement}

require_once 'pluginbuilder.php';

$PARAMS = array_merge($_GET, $_POST);
$resourceLoader = $pluginBuilder->newResourceLoader();
$resource = $PARAMS['resourcefile'];
header('Content-Type:' . $resourceLoader->getContentType($resource));
echo $resourceLoader->getcontent($resource);

<?php

// ${license.statement}

require_once 'pluginbuilder.php';
$PARAMS = array_merge($_GET, $_POST);

$digest = isset($PARAMS['digest'])?$PARAMS['digest']:null;
if ($digest==null) {
    $digest = isset($PARAMS['md5'])?$PARAMS['md5']:null;
}
$latex = isset($PARAMS['latex'])?$PARAMS['latex']:null;
$render = $pluginBuilder->newTextService();
echo $render->getMathML($digest, $latex);

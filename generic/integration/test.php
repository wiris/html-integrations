<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<?php

// ${license.statement}

require_once 'pluginbuilder.php';
$render = $pluginBuilder->newTest();
echo $render->getTestPage();

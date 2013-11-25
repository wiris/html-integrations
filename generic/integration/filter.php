<?php
// ${license.statement}


// Please, set if called from the command line
// $_SERVER['SCRIPT_NAME'] = "/generic/integration/convert.php";

require_once 'pluginbuilder.php';
$text = $pluginBuilder->newTextService();
$input = "<html><body>Fraction <math><mfrac><mn>1</mn><mi>x</mi></mfrac></math></body>";
$params = null;
$output = $text->filter($input, $params);

header('Content-Type: text/html;charset=UTF-8');
echo $output;

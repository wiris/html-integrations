<?php
//
//  Copyright (c) 2011, Maths for More S.L. http://www.wiris.com
//  This file is part of WIRIS Plugin.
//
//  WIRIS Plugin is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  any later version.
//
//  WIRIS Plugin is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with WIRIS Plugin. If not, see <http://www.gnu.org/licenses/>.
//


// Please, set if called from the command line
// $_SERVER['SCRIPT_NAME'] = "/generic/integration/convert.php";

require_once 'pluginbuilder.php';
$text = $pluginBuilder->newTextService();
$input = "<html><body>Fraction <math><mfrac><mn>1</mn><mi>x</mi></mfrac></math></body>";
$params = null;
$output = $text->filter($input, $params);

header('Content-Type: text/html;charset=UTF-8');
echo $output;

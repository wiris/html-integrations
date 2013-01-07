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

/*function moodleCookiePresent($cookies){
    foreach($cookies as $key => $value){
        if(strpos(strtolower($key), 'moodle') !== false){
            return true;
        }
    }
    return false;
}

$cookie = $GLOBALS['_COOKIE'];
$isMoodle = moodleCookiePresent($GLOBALS['_COOKIE']);*/

$moodleLib   = dirname(__FILE__) . '/../../../../../../../../lib/moodlelib.php';
$moodle24Lib = dirname(__FILE__) . '/../../../../../../lib/moodlelib.php';

$moodleConfig   = dirname(__FILE__) . '/../../../../../../../../config.php';
$moodle24Config = dirname(__FILE__) . '/../../../../../../config.php';

if (is_file($moodleLib) || is_file($moodle24Lib)){
    if (is_file($moodleConfig)){
        require_once $moodleConfig;
        global $wirisconfigurationclass;
        $wirisconfigurationclass = '../../../../../../../../filter/wiris/MoodleConfigurationUpdater.php;com_wiris_plugin_configuration_MoodleConfigurationUpdater';
    }else if (is_file($moodle24Config)){
        require_once $moodle24Config;
        global $wirisconfigurationclass;
        $wirisconfigurationclass = '../../../../../../filter/wiris/MoodleConfigurationUpdater.php;com_wiris_plugin_configuration_MoodleConfigurationUpdater';
    }
}

?>

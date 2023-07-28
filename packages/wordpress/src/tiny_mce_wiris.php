<?php
/*
Plugin Name: MathType for WordPress
Plugin URI: https://docs.wiris.com/mathtype/en/mathtype-integrations/mathtype-for-cms/mathtype-for-wordpress.html
Description: Integrates maths engine with tinyMCE editor.
Author: Maths for More
Version: 1.0
Author URI: https://www.wiris.com
*/

add_filter('mce_external_plugins', 'wrs_addPlugin');
add_filter('mce_buttons', 'wrs_addButtons');

function wrs_addPlugin($plugins) {
	$plugins['tiny_mce_wiris'] = get_option('home') . '/wp-includes/js/tinymce/plugins/tiny_mce_wiris/plugin.min.js';
	return $plugins;
}

function wrs_addButtons($buttons) {
	array_push($buttons, 'separator', 'tiny_mce_wiris_formulaEditor', 'tiny_mce_wiris_formulaEditorChemistry');
	return $buttons;
}
?>
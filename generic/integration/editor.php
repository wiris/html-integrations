<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<?php
include 'libwiris.php';
$config = wrs_loadConfig(WRS_CONFIG_FILE);
?>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
		<script type="text/javascript" src="<?php echo wrs_getImageServiceURL($config, 'editor'); ?>"></script>
		<script type="text/javascript" src="../core/editor.js"></script>
		<title>WIRIS editor</title>
		
		<style type="text/css">
			/*<!--*/
			
			html,
			body,
			#container {
				height: 100%;
			}
			
			body {
				margin: 0;
			}
			
			#links {
				text-align: right;
				margin-right: 20px;
			}
			
			#controls {
				float: left;
			}
			
			/*-->*/
		</style>
	</head>
	<body topmargin="0" leftmargin="0" marginwidth="0" marginheight="0">
		<div id="container">
			<div id="editorContainer"></div>
			
			<div id="controls">
			</div>
			
			<div id="links">
				<a href="#" onclick="window.open('../latex.html', 'LaTeX', 'left=100, top=100, width=500, height=280, scroll=no, resizable=no');">LaTeX</a> | 
				<a href="http://www.wiris.com/portal/docs/editor-manual" target="_blank">Manual</a>
			</div>
		</div>
	</body>
</html>
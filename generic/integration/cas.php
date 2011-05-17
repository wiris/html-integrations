<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<?php
include 'libwiris.php';
$config = wrs_loadConfig(WRS_CONFIG_FILE);
$availableLanguages = wrs_getAvailableCASLanguages($config['wiriscaslanguages']);

if (isset($_GET['mode']) && $_GET['mode'] == 'applet') {
	if (isset($_GET['lang']) && in_array($_GET['lang'], $availableLanguages)) {
		$language = $_GET['lang'];
	}
	else {
		$language = $availableLanguages[0];
	}
	
	$codebase = wrs_replaceVariable($config['wiriscascodebase'], 'LANG', $language);
	$archive = wrs_replaceVariable($config['wiriscasarchive'], 'LANG', $language);
	$className = wrs_replaceVariable($config['wiriscasclass'], 'LANG', $language);
	
	?>
	<html>
		<head>
			<style type="text/css">
				/*<!--*/
				html,
				body {
					height: 100%;
				}
				
				body {
					overflow: hidden;
					margin: 0;
				}
				
				applet {
					height: 100%;
					width: 100%;
				}
				/*-->*/
			</style>
		</head>
		<body>
			<applet id="applet" alt="WIRIS CAS" codebase="<?php echo htmlentities($codebase, ENT_QUOTES, 'UTF-8'); ?>" archive="<?php echo htmlentities($archive, ENT_QUOTES, 'UTF-8'); ?>" code="<?php echo htmlentities($className, ENT_QUOTES, 'UTF-8'); ?>">
				<p>You need JAVA&reg; to use WIRIS tools.<br />FREE download from <a target="_blank" href="http://www.java.com">www.java.com</a></p>
			</applet>
		</body>
	</html>
	<?php
}
else {
	?>
	<html>
		<head>
			<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
			<script type="text/javascript" src="../core/cas.js"></script>
			<title>WIRIS CAS</title>
			
			<style type="text/css">
				/*<!--*/
				html,
				body,
				#optionForm {
					height: 100%;
				}
				
				body {
					overflow: hidden;
					margin: 0;
				}
				
				#controls {
					width: 100%;
				}
				/*-->*/
			</style>
		</head>
		<body>
			<form id="optionForm">
				<div id="appletContainer"></div>
				
				<table id="controls">
					<tr>
						<td>Width</td>
						<td><input name="width" type="text" value="<?php echo $config['CAS_width']; ?>"/></td>					
						<td><input name="executeonload" type="checkbox"/> Calculate on load</td>
						<td><input name="toolbar" type="checkbox" checked /> Show toolbar</td>
						
						<td>
							Language
							
							<select id="languageList">
								<?php
								foreach ($availableLanguages as $language) {
									$language = htmlentities($language, ENT_QUOTES, 'UTF-8');
									echo '<option value="', $language, '">', $language, '</option>';
								}
								?>
							</select>
						</td>
					</tr>
					<tr>
						<td>Height</td>
						<td><input name="height" type="text" value="<?php echo $config['CAS_height']; ?>"/></td>
						<td><input name="focusonload" type="checkbox"/> Focus on load</td>
						<td><input name="level" type="checkbox"/> Elementary mode</td>
						<td></td>
					</tr>
					<tr>
						<td colspan="5"><input id="submit" value="Accept" type="button"/> <input id="cancel" value="Cancel" type="button"/></td>
					</tr>
				</table>
			</form>
		</body>
	</html>
	<?php
}
?>
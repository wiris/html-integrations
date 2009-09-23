<?php
include 'libwiris.php';
$config = parse_ini_file(WRS_CONFIG_FILE);
?>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
		<script type="text/javascript" src="../core/cas.js"></script>
		<title>WIRIS CAS</title>
		
		<style type="text/css">
			<!--
			body {
				overflow: hidden;		// Hide scrollbars
			}
			-->
		</style>
	</head>
	<body topmargin="0" leftmargin="0" marginwidth="0" marginheight="0">
		<form id="optionForm">
			<table height="100%" width="100%">
				<tr>
					<td colspan="5">
						<applet id="applet" alt="WIRIS CAS" codebase="<?php echo $config['wiriscascodebase']; ?>" archive="<?php echo $config['wiriscasarchive']; ?>" code="<?php echo $config['wiriscasclass']; ?>" width="100%" height="100%"></applet>
					</td>
				</tr>
				<tr height="1px">
					<td>Width</td>
					<td><input name="width" type="text" value="<?php echo $config['CAS_width']; ?>"/></td>					
					<td><input name="executeonload" type="checkbox"/> Calculate on load</td>
					<td><input name="toolbar" type="checkbox" checked /> Show toolbar</td>
				</tr>
				<tr height="1px">
					<td>Height</td>
					<td><input name="height" type="text" value="<?php echo $config['CAS_height']; ?>"/></td>
					<td><input name="focusonload" type="checkbox"/> Focus on load</td>
					<td><input name="level" type="checkbox"/> Elementary mode</td>
				</tr>
				<tr height="1px">
					<td colspan="5"><input id="submit" value="Accept" type="button"/> <input id="cancel" value="Cancel" type="button"/></td>
				</tr>
			</table>
		</form>
	</body>
</html>

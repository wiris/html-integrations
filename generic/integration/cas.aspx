<%@ Page language="c#" Codebehind="cas.aspx.cs" AutoEventWireup="false" Inherits="pluginwiris.cas" %>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
		<script type="text/javascript" src="../core/cas.js"></script>
		<title>WIRIS CAS</title>
	</head>
	<body topmargin="0" leftmargin="0" marginwidth="0" marginheight="0">
		<form id="optionForm">
			<table height="100%" width="100%">
				<tr>
					<td colspan="5">
						<applet id="applet" alt="WIRIS CAS" codebase="<% this.Response.Write((string)config["wiriscascodebase"]); %>" archive="<% this.Response.Write((string)config["wiriscasarchive"]); %>" code="<% this.Response.Write((string)config["wiriscasclass"]); %>" height="100%" width="100%" VIEWASTEXT></applet>
					</td>
				</tr>
				<tr height="1px">
					<td>Width</td>
					<td><input name="width" type="text" value="<% this.Response.Write((string)config["CAS_width"]); %>"/></td>
					<td><input name="executeonload" type="checkbox"/> Calculate on load</td>
					<td><input name="toolbar" type="checkbox" checked/> Show toolbar</td>
				</tr>
				<tr height="1px">
					<td>Height</td>
					<td><input name="height" type="text" value="<% this.Response.Write((string)config["CAS_height"]); %>"/></td>
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
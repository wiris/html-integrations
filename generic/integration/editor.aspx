<%@ Page language="c#" Codebehind="editor.aspx.cs" AutoEventWireup="false" Inherits="pluginwiris.editor" %>
<%@ Import Namespace="pluginwiris" %>
<%@ Import Namespace="System.IO" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%
Hashtable config = Libwiris.loadConfig(this.MapPath(Libwiris.configFile));
string wirisformulaeditorlang = "en";
if (this.Request.QueryString["lang"] != null){
	wirisformulaeditorlang = this.Request.QueryString["lang"];
}

wirisformulaeditorlang = wirisformulaeditorlang.ToLower();
wirisformulaeditorlang = wirisformulaeditorlang.Replace("-", "_");

if (File.Exists(this.MapPath("../lang/" + wirisformulaeditorlang + "/strings.js"))){
	config["wirisformulaeditorlang"] = wirisformulaeditorlang;
}else if(File.Exists(this.MapPath("../lang/" + wirisformulaeditorlang.Substring(0, 2) + "/strings.js"))){
	wirisformulaeditorlang = wirisformulaeditorlang.Substring(0, 2);
	config["wirisformulaeditorlang"] = wirisformulaeditorlang;
}else{
	config["wirisformulaeditorlang"] = "en";
}
%>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
		<script type="text/javascript" src="<% this.Response.Write(Libwiris.getImageServiceURL(this.config, "editor") + "?lang=" + Server.UrlEncode(wirisformulaeditorlang));%>"></script>
		<script type="text/javascript" src="../core/editor.js"></script>
		<script type="text/javascript" src="<%= "../lang/" + config["wirisformulaeditorlang"] + "/strings.js" %>"></script>
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
				<a href="#" id="a_latex" onclick="window.open('../latex.html', 'LaTeX', 'left=100, top=100, width=500, height=280, scroll=no, resizable=no');">LaTeX</a> | 
				<a href="http://www.wiris.com/editor3/docs/manual" target="_blank" id="a_manual">Manual</a>
			</div>
		</div>
	</body>
</html>
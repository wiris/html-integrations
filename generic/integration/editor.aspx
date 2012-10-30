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
		<%
			int i = 0;
			string attr = "";
			string confVal = "";			
			foreach (DictionaryEntry entry in Libwiris.imageConfigProperties){
				if (config[entry.Value] != null){
					if(i != 0){
						attr += ",";
					}else{
						i++;
					}

					confVal = (string)config[entry.Value];
					confVal = confVal.Replace("\\", "\\\\");
					confVal = confVal.Replace("\'", "\\\'");
					
					attr += "'" + entry.Key + "' : '" + confVal + "'";
				}
			}
			if (i > 0){%>
		<script type="text/javascript"><% this.Response.Write("window.wrs_attributes = {" + attr + "};"); %></script>
			<%
			}
			%>		
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

			#links_rtl {
				text-align: left;
				margin-left: 20px;
			}
			
			#controls {
				float: left;
			}

			#controls_rtl {
				float: right;
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
				<a href="http://www.wiris.com/editor3/docs/manual/latex-support" target="_blank" id="a_latex" >LaTeX</a> | 
				<a href="http://www.wiris.com/editor3/docs/manual" target="_blank" id="a_manual">Manual</a>
			</div>
		</div>
	</body>
</html>
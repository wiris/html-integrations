<%@ Page language="c#" Codebehind="test.aspx.cs" AutoEventWireup="false" Inherits="pluginwiris.test" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html>
	<head>
		<title>WIRIS plugin test page</title>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<style type="text/css">
			body{font-family: Arial;}
			span{font-weight: bold;}
			span.ok {color: #009900;}
			span.error {color: #dd0000;}
			table, th, td, tr {
				border: solid 1px #000000;
				border-collapse:collapse;
				padding: 5px;
			}
			th{background-color: #eeeeee;}
			img{border:none;}
		</style>		
	</head>
	
	<body>
		<h1>WIRIS plugin test page</h1>
		
		<table>
				<tr>
					<th>Test</th>
					<th>Report</th>
					<th>Status</th>
				</tr>
				<tr>
					<%
						string testName = "Loading configuration";
						string reportText = "Loading " + this.MapPath(pluginwiris.Libwiris.configFile) + "... ";
						string solutionLink = "";
						Hashtable config = pluginwiris.Libwiris.loadConfig(this.MapPath(pluginwiris.Libwiris.configFile));
						this.wrs_createTableRow(testName, reportText, solutionLink, config.Count > 0);
					%>
				</tr>
				<tr>
					<%
						testName = "Connecting to WIRIS image server";
						string port;
						if (config["wirisimageserviceport"] != null){
							port = (string)config["wirisimageserviceport"];
						}else{
							port = "80";
						}
						reportText = "Connecting to " + config["wirisimageservicehost"] + " on port " + port + "... ";
						try	{
							System.Net.Sockets.TcpClient socket = new System.Net.Sockets.TcpClient((string)config["wirisimageservicehost"], Convert.ToInt32((string)port));
							this.wrs_createTableRow(testName, reportText, solutionLink, true);
							socket.Close();
						}
						catch{
							this.wrs_createTableRow(testName, reportText, solutionLink, false);
						}						
					%>
				</tr>
				<tr>
					<%
						testName = "Writing a formula file";
						string file = (pluginwiris.Libwiris.getFormulaDirectory(config) != null) ? pluginwiris.Libwiris.getFormulaDirectory(config) : this.MapPath(pluginwiris.Libwiris.FormulaDirectory);
						file += "/test.xml";						
						reportText = "Writing file " + file + "... ";
						try{
							System.IO.TextWriter fileWriter = new System.IO.StreamWriter(file);
							fileWriter.Close();
							this.wrs_createTableRow(testName, reportText, solutionLink, true);
						}
						catch{
							this.wrs_createTableRow(testName, reportText, solutionLink, false);
						}
					%>
				</tr>
				<tr>
					<%
						testName = "Reading a formula file";
						reportText = "Reading file " + file + "... ";
						try{
							System.IO.TextReader fileReader = new System.IO.StreamReader(file);
							fileReader.Close();
							this.wrs_createTableRow(testName, reportText, solutionLink, true);
						}
						catch{
							this.wrs_createTableRow(testName, reportText, solutionLink, false);
						}						
					%>
				</tr>
				<tr>
					<%
						testName = "Writing an image file";
						file = (pluginwiris.Libwiris.getCacheDirectory(config) != null) ? pluginwiris.Libwiris.getCacheDirectory(config) : this.MapPath(pluginwiris.Libwiris.CacheDirectory);
						file += "/test.png";						
						reportText = "Writing file " + file + "... ";
						try	{
							System.IO.TextWriter fileWriter = new System.IO.StreamWriter(file);
							fileWriter.Close();
							this.wrs_createTableRow(testName, reportText, solutionLink, true);
						}
						catch{
							this.wrs_createTableRow(testName, reportText, solutionLink, false);
						}						
					%>
				</tr>
				<tr>
					<%
						testName = "Reading an image file";
						reportText = "Reading file " + file + "... ";
						try{
							System.IO.TextReader fileReader = new System.IO.StreamReader(file);
							fileReader.Close();
							this.wrs_createTableRow(testName, reportText, solutionLink, true);
						}
						catch{
							this.wrs_createTableRow(testName, reportText, solutionLink, false);
						} 						
					%>
				</tr>
		</table>

		<br/>
		<h1>ASP.NET tests</h1>
		<h2>Checking ASP.NET security filters</h2>
		
		<table>
			<tr>
				<th>Function</th>
				<th>Report</th>
				<th>Status</th>
			</tr>
			<tr>
				<%
				if (this.Request.QueryString["html"] == null || this.Request.QueryString["sql"] == null)
				{
					this.Response.Redirect(this.Page.ResolveUrl("test.aspx") + "?html=" + HttpUtility.UrlEncodeUnicode(HTML_STRING) + "&sql=" + HttpUtility.UrlEncodeUnicode(SQL_STRING));
				}
				else
				{
					testName = "Checking for HTML filter";
					reportText = "should be disabled";					
					this.wrs_createTableRow(testName, reportText, solutionLink, this.Request.QueryString["html"] == HTML_STRING);

					testName = "Checking for SQL filter";
					reportText = "should be disabled";					
					this.wrs_createTableRow(testName, reportText, solutionLink, this.Request.QueryString["sql"] == SQL_STRING);
				}				
				%>
			</tr>
			
		</table>

	</body>
</html>

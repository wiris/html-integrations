<%@ Page language="c#" Codebehind="editor.aspx.cs" AutoEventWireup="false" Inherits="pluginwiris.editor" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html>
	<head>
		<title>Plugin WIRIS test page</title>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		
		<style type="text/css">
			/*<!--*/
			
			html {
				font-family: sans-serif;
			}
			
			h2 {
				margin-left: 1em;
			}
			
			h3 {
				margin-left: 2em;
			}
			
			p {
				margin-left: 3em;
			}
			
			p.concrete {
				margin-left: 4em;
			}
			
			.ok {
				font-weight: bold;
				color: #0c0;
			}
			
			.error {
				font-weight: bold;
				color: #f00;
			}
			
			/*-->*/
		</style>
	</head>
	
	<body>
		<h1>Plugin WIRIS test page</h1>
		
		<h2>Loading configuration</h2>
		
		<p>
                        <%
                                this.Response.Write("Loading " + this.MapPath(Libwiris.configFile) + "... ");
                                Hashtable config = Libwiris.loadConfig(this.MapPath(Libwiris.configFile));
                                this.wrs_assert(config.Count > 0);
			%>
		</p>
		
		<h2>Connecting to WIRIS image server</h2>
		
		<p>
		        <%
                                this.Response.Write("Connecting to " + config["wirisimageservicehost"] + " on port " + config["wirisimageserviceport"] + "... ");

                                try
                                {
                                        TcpClient socket = new TcpClient(config["wirisimageservicehost"], (int)config["wirisimageserviceport"]);
                                        this.wrs_assert(true);
                                        socket.Close();
                                }
                                catch
                                {
                                        this.wrs_assert(false);
                                }
                        %>
		</p>
		
		<h2>Writing a formula file</h2>
		
		<p>
		        <%
                                String file = this.MapPath(Libwiris.FormulaDirectory);
                                this.Response.Write("Writing file " + file + "... ");

                                try
                                {
                                        TextWriter fileWriter = new StreamWriter(file);
                                        fileWriter.Close();
                                        this.wrs_assert(true);
                                }
                                catch
                                {
                                        this.wrs_assert(false);
                                }
		        %>
		</p>
		
		<h2>Reading a formula file</h2>
		
		<p>
		        <%
                                this.Response.Write("Reading file " + file + "... ");

                                try
                                {
                                        TextReader fileReader = new StreamReader(file);
                                        fileReader.Close();
                                        this.wrs_assert(true);
                                }
                                catch
                                {
                                        this.wrs_assert(false);
                                }                        
		        %>
		</p>
		
		<h2>Writing an image file</h2>
		
		<p>
		        <%
                                file = this.MapPath(Libwiris.CacheDirectory + "/test.png");
                                this.Response.Write("Writing file " + file + "... ");

                                try
                                {
                                        TextWriter fileWriter = new StreamWriter(file);
                                        fileWriter.Close();
                                        this.wrs_assert(true);
                                }
                                catch
                                {
                                        this.wrs_assert(false);
                                }
		        %>
		</p>
		
		<h2>Reading an image file</h2>
		
		<p>
			<%
                                this.Response.Write("Reading file " + file + "... ");

                                try
                                {
                                        TextReader fileReader = new StreamReader(file);
                                        fileReader.Close();
                                        this.wrs_assert(true);
                                }
                                catch
                                {
                                        this.wrs_assert(false);
                                }                        
		        %>
		</p>
		
		<h2>ASP.NET tests</h2>
		
		<h3>Checking ASP.NET security filters</h3>
		
		<p class="concrete">
		        <%
                                // Redirect if it hasn't done the filter test.

                                if (this.Request.QueryString["html"] == null || this.Request.QueryString["sql"] == null)
                                {
                                        this.Response.Redirect(his.Page.ResolveUrl("test.aspx") + "?html=" + HttpUtility.UrlEncodeUnicode(test.HTML_STRING) + "&sql=" + HttpUtility.UrlEncodeUnicode(test.SQL_STRING));
                                }
                                else
                                {
                                        this.Response.Write("Checking for HTML filter (should be disabled)... ");
                                        this.wrs_assert(this.Request.QueryString["html"] == test.HTML_STRING);

                                        this.Response.Write("<br/>Checking for SQL filter (should be disabled)... ");
                                        this.wrs_assert(this.Request.QueryString["sql"] == test.SQL_STRING);
                                }
		        %>
		</p>
	</body>
</html>

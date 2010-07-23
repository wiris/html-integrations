<%@ Page language="c#" Codebehind="cas.aspx.cs" AutoEventWireup="false" Inherits="pluginwiris.cas" %>
<%
        if (this.Request.QueryString["mode"] == "applet")
        {
                %>
                <html>
			<head>
				<style type="text/css">
					/*<!--*/ 
					
					body {
					        overflow: hidden;		// Hide scrollbars
					}
					
					/*-->*/
				</style>
			</head>
			
			<body topmargin="0" leftmargin="0" marginwidth="0" marginheight="0">
                            <applet id="applet" alt="WIRIS CAS" codebase=<% this.Response.Write(Libwiris.htmlentities(this.codebase, true)); %>" archive=<% this.Response.Write(Libwiris.htmlentities(this.archive, true)); %>" code=<% this.Response.Write(Libwiris.htmlentities(this.className, true)); %>" width="100%" height="100%">
                                <p>You need JAVA&reg; to use WIRIS tools.<br />FREE download from <a target="_blank" href="http://www.java.com">www.java.com</a></p>
                            </applet>
			</body>
		</html>
                <%
        }
        else
        {
                %>
                <html>
                        <head>
                                <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
                                <script type="text/javascript" src="../core/cas.js"></script>
                                <title>WIRIS CAS</title>
                                
                                <style type="text/css">
                                        /*<!--*/ 
                                        
                                        body {
                                                overflow: hidden;               // Hide scrollbars\n
                                        }
                                        
                                        /*-->*/
                                </style>
                        </head>
                        
                        <body topmargin="0" leftmargin="0" marginwidth="0" marginheight="0">
                                <form id="optionForm">
                                        <table height="100%" width="100%">
                                                <tr>
                                                        <td id="appletContainer" colspan="5"></td>
                                                </tr>
                                                
                                                <tr height="1px">
                                                        <td>Width</td>
                                                        <td><input name="width" type="text" value=" this.config["CAS_width"] + ""/></td>
                                                        <td><input name="executeonload" type="checkbox"/> Calculate on load</td>
                                                        <td><input name="toolbar" type="checkbox" checked /> Show toolbar</td>
                                                        
                                                        <td>
                                                            Language

                                                            <select id="languageList">
                <%
                
                        for (int i = 0; i < availableLanguages.Length; ++i)
                        {
                                string language = Libwiris.htmlentities(availableLanguages[i], true);
                                this.Response.Write("<option value=\"" + language + "\">" + language + "</option>");
                        }
                
                %>
                                                            </select>
                                                        </td>
                                                </tr>
                                                
                                                <tr height="1px">
                                                        <td>Height</td>
                                                        <td><input name="height" type="text" value=" this.config["CAS_height"] + ""/></td>
                                                        <td><input name="focusonload" type="checkbox"/> Focus on load</td>
                                                        <td><input name="level" type="checkbox"/> Elementary mode</td>
                                                        <td></td>
                                                </tr>
                                                
                                                <tr height="1px">
                                                        <td colspan="5"><input id="submit" value="Accept" type="button"/> <input id="cancel" value="Cancel" type="button"/></td>
                                                </tr>
                                        </table>
                                </form>
                        </body>
                </html>
                <%
        }
%>
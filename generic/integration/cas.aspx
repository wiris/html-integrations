<%@ Page language="c#" Codebehind="cas.aspx.cs" AutoEventWireup="false" Inherits="pluginwiris.cas" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%
        if (this.Request.QueryString["mode"] == "applet")
        {
                %>
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
                            <applet id="applet" alt="WIRIS CAS" codebase=<% this.Response.Write(Libwiris.htmlentities(this.codebase, true)); %>" archive=<% this.Response.Write(Libwiris.htmlentities(this.archive, true)); %>" code=<% this.Response.Write(Libwiris.htmlentities(this.className, true)); %>">
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
									
                                        <table>
                                                <tr>
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
                                                
                                                <tr>
                                                        <td>Height</td>
                                                        <td><input name="height" type="text" value=" this.config["CAS_height"] + ""/></td>
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
                <%
        }
%>
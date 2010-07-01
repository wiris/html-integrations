using System;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;

namespace pluginwiris
{
    public class cas : System.Web.UI.Page
    {
        public Hashtable config;
        public string content;

        private void Page_Load(object sender, System.EventArgs e)
        {
            this.config = Libwiris.loadConfig(this.MapPath(Libwiris.configFile));
            string[] availableLanguages = Libwiris.getAvailableCASLanguages((string)this.config["wiriscaslanguages"]);

            if (this.Request.QueryString["mode"] == "applet")
            {
                string language = availableLanguages[0];

                if (Libwiris.inArray(this.Request.QueryString["lang"], availableLanguages))
                {
                    language = this.Request.QueryString["lang"];
                }

                string codebase = Libwiris.replaceVariable((string)this.config["wiriscascodebase"], "LANG", language);
                string archive = Libwiris.replaceVariable((string)this.config["wiriscasarchive"], "LANG", language);
                string className = Libwiris.replaceVariable((string)this.config["wiriscasclass"], "LANG", language);

                this.printCAS(codebase, archive, className);
            }
            else
            {
                this.printCASContainer(availableLanguages);
            }
        }

        private void printCAS(string codebase, string archive, string className)
        {
            this.content = "<html>" +
				"<head>" +
					"<style type=\"text/css\">" +
						"<!--" +
						"body {" +
						"overflow: hidden;		// Hide scrollbars\n" +
						"}" +
						"-->" +
					"</style>" +
				"</head>" +
				"<body topmargin=\"0\" leftmargin=\"0\" marginwidth=\"0\" marginheight=\"0\">" +
                    "<applet id=\"applet\" alt=\"WIRIS CAS\" codebase=\"" + Libwiris.htmlentities(codebase, true) + "\" archive=\"" + Libwiris.htmlentities(archive, true) + "\" code=\"" + Libwiris.htmlentities(className, true) + "\" width=\"100%\" height=\"100%\"></applet>" +
				"</body>" +
			"</html>";
        }

        private void printCASContainer(string[] availableLanguages)
        {
            this.content = "<html>" +
                "<head>" +
                        "<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\"/>" +
                        "<script type=\"text/javascript\" src=\"../core/cas.js\"></script>" +
                        "<title>WIRIS CAS</title>" +
                        "<style type=\"text/css\">" +
                                "<!-- " +
                                "body {" +
                                        "overflow: hidden;               // Hide scrollbars\n" +
                                "}" +
                                "-->" +
                        "</style>" +
                "</head>" +
                "<body topmargin=\"0\" leftmargin=\"0\" marginwidth=\"0\" marginheight=\"0\">" +
                        "<form id=\"optionForm\">" +
                                "<table height=\"100%\" width=\"100%\">" +
                                        "<tr>" +
                                                "<td id=\"appletContainer\" colspan=\"5\"></td>" +
                                        "</tr>" +
                                        "<tr height=\"1px\">" +
                                                "<td>Width</td>" +
                                                "<td><input name=\"width\" type=\"text\" value=\"" + this.config["CAS_width"] + "\"/></td>" +
                                                "<td><input name=\"executeonload\" type=\"checkbox\"/> Calculate on load</td>" +
                                                "<td><input name=\"toolbar\" type=\"checkbox\" checked /> Show toolbar</td>" +
                                                "<td>" +
                                                    "Language" +

                                                    "<select id=\"languageList\">";

            for (int i = 0; i < availableLanguages.Length; ++i)
            {
                string language = Libwiris.htmlentities(availableLanguages[i], true);
                this.content += "<option value=\"" + language + "\">" + language + "</option>";
            }

            this.content +=                         "</select>" +
                                                 "</td>" +
                                            "</tr>" +
                                            "<tr height=\"1px\">" +
                                                    "<td>Height</td>" +
                                                    "<td><input name=\"height\" type=\"text\" value=\"" + this.config["CAS_height"] + "\"/></td>" +
                                                    "<td><input name=\"focusonload\" type=\"checkbox\"/> Focus on load</td>" +
                                                    "<td><input name=\"level\" type=\"checkbox\"/> Elementary mode</td>" +
                                                "<td></td>" +
                                            "</tr>" +
                                            "<tr height=\"1px\">" +
                                                    "<td colspan=\"5\"><input id=\"submit\" value=\"Accept\" type=\"button\"/> <input id=\"cancel\" value=\"Cancel\" type=\"button\"/></td>" +
                                            "</tr>" +
                                    "</table>" +
                            "</form>" +
                    "</body>" +
            "</html>";
        }

        #region Web Form Designer generated code
        override protected void OnInit(EventArgs e)
        {
            //
            // CODEGEN: This call is required by the ASP.NET Web Form Designer.
            //
            InitializeComponent();
            base.OnInit(e);
        }

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.Load += new System.EventHandler(this.Page_Load);
        }
        #endregion
    }
}

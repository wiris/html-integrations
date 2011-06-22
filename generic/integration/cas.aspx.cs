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
		public string availableLanguagesString;
	    public string archive;
        public string className;
        public string codebase;
        public Hashtable config;
        public string language;

        private void Page_Load(object sender, System.EventArgs e)
        {
            this.config = Libwiris.loadConfig(this.MapPath(Libwiris.configFile));
            string[] availableLanguages = Libwiris.getAvailableCASLanguages((string)this.config["wiriscaslanguages"]);

            if (this.Request.QueryString["mode"] == "applet")
            {
                this.language = availableLanguages[0];

                if (Libwiris.inArray(this.Request.QueryString["lang"], availableLanguages))
                {
                    this.language = this.Request.QueryString["lang"];
                }

                this.codebase = Libwiris.replaceVariable((string)this.config["wiriscascodebase"], "LANG", language);
                this.archive = Libwiris.replaceVariable((string)this.config["wiriscasarchive"], "LANG", language);
                this.className = Libwiris.replaceVariable((string)this.config["wiriscasclass"], "LANG", language);
				
				// Sanitize.
				this.codebase = Libwiris.htmlentities(this.codebase, true);
				this.archive = Libwiris.htmlentities(this.archive, true);
				this.className = Libwiris.htmlentities(this.className, true);
            }
			else {
				this.availableLanguagesString = "";
				
				for (int i = 0; i < availableLanguages.Length; ++i)
				{
						string language = Libwiris.htmlentities(availableLanguages[i], true);
						this.availableLanguagesString += "<option value=\"" + language + "\">" + language + "</option>";
				}
			}
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

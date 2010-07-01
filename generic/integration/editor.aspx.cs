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
    /// <summary>
    /// Summary description for editor.
    /// </summary>
    public class editor : System.Web.UI.Page
    {
        public string appletParams;
        public Hashtable config;

        private void Page_Load(object sender, System.EventArgs e)
        {
            this.appletParams = "";
            this.config = Libwiris.loadConfig(this.MapPath(Libwiris.configFile));

            Hashtable parameters = new Hashtable();
            parameters["lang"] = "wirisformulaeditorlang";
            parameters["identMathvariant"] = "wirisimageidentmathvariant";
            parameters["numberMathvariant"] = "wirisimagenumbermathvariant";
            parameters["fontIdent"] = "wirisimagefontident";
            parameters["fontNumber"] = "wirisimagefontnumber";

            foreach (DictionaryEntry entry in parameters)
            {
                string value = (string)entry.Value;

                if (this.config[value] != null)
                {
                    this.appletParams += "<param name=\"" + (string)entry.Key + "\" value=\"" + (string)this.config[value] + "\" />";
                }
            }

            if (this.config["wirisimagefontranges"] != null)
            {
                string[] fontRanges = ((string)this.config["wirisimagefontranges"]).Split(',');

                for (int i = 0; i < fontRanges.Length; ++i)
                {
                    string fontRangeName = fontRanges[i].Trim();

                    if (this.config[fontRangeName] != null)
                    {
                        this.appletParams += "<param name=\"font" + i + "\" value=\"" + (string)this.config[fontRangeName] + "\" />";
                    }
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

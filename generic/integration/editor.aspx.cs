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
		public Hashtable config;
        public string appletParams;

		private void Page_Load(object sender, System.EventArgs e)
		{
			this.config = Libwiris.loadConfig(this.MapPath(Libwiris.configFile));
            this.appletParams = "";

            Hashtable parameters = new Hashtable();
            parameters["lang"] = "wirisformulaeditorlang";
			parameters["identMathvariant"] = "wirisimageidentmathvariant";
			parameters["numberMathvariant"] = "wirisimagenumbermathvariant";
			parameters["fontIdent"] = "wirisimagefontident";
            parameters["fontNumber"] = "wirisimagefontnumber";

            foreach (string key in parameters)
            {
                if (config[parameters[key]] != null)
                {
                    this.appletParams += "<param name=\"" + key + "\" value=\"" + config[parameters[key]].ToString() + "\" />";
                }
            }

            if (config["wirisimagefontranges"] != null)
            {
                string[] fontRanges = config["wirisimagefontranges"].ToString().Split(',');

                for (int i = 0; i < fontRanges.Length; ++i)
                {
                    string fontRangeName = fontRanges[i].Trim();

                    if (config[fontRangeName] != null)
                    {
                        this.appletParams += "<param name=\"font" + i + "\" value=\"" + config[fontRangeName].ToString() + "\" />";
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

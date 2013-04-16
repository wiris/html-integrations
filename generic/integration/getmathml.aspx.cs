using System;
using System.IO;
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
    /// Summary description for getmathml.
    /// </summary>
    public partial class getmathml : System.Web.UI.Page
    {
        private void Page_Load(object sender, System.EventArgs e)
        {
			Hashtable config = Libwiris.loadConfig(this.MapPath(Libwiris.configFile));
			
            if (this.Request.Form["md5"] != null)
            {
				string filePath = (Libwiris.getFormulaDirectory(config) != null) ? Libwiris.getFormulaDirectory(config) : this.MapPath(Libwiris.FormulaDirectory);
				filePath += "/" + Path.GetFileName(this.Request.Form["md5"]);

				if (File.Exists(filePath + ".ini"))
				{
					Hashtable formula = Libwiris.parseIni(filePath + ".ini");
					
					if (formula["mml"] != null)
					{
						this.Response.Write(formula["mml"]);
					}
				}
                else if (File.Exists(filePath + ".xml"))
                {
                    StreamReader file = File.OpenText(filePath);
                    this.Response.Write(file.ReadLine());
                    file.Close();
                }
            }
			else if (this.Request.Form["latex"] != null) {
				string url;
				
				if (config["wirislatextomathmlurl"] != null) {
					url = (string)config["wirislatextomathmlurl"];
				}
				else {
					url = Libwiris.getImageServiceURL(config, "latex2mathml");
				}
				
				Hashtable data = new Hashtable();
				data["latex"] = this.Request.Form["latex"];
				
				if (this.Request.Form["saveLatex"] != null) {
					data["saveLatex"] = "";
				}
			
				Stream response = Libwiris.getContents(url, data, Libwiris.getReferer(this.Request));
				StreamReader responseReader = new StreamReader(response);
				this.Response.Write(responseReader.ReadToEnd());
			}
            else
            {
                this.Response.Write("Error: no digest or latex has been sent.");
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

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
    public class service : System.Web.UI.Page
    {
        private void Page_Load(object sender, System.EventArgs e)
        {
            if (this.Request.Form["service"] != null)
            {
                Hashtable config = Libwiris.loadConfig(this.MapPath(Libwiris.configFile));
                string url = Libwiris.getImageServiceURL(config, this.Request.Form["service"]);
                Hashtable data = new Hashtable();

                foreach (string key in this.Request.Form.AllKeys)
                {
                    if (key != null && key != "service")
                    {
                        data[key] = this.Request.Form[key];
                    }
                }

                Stream responseStream = Libwiris.getContents(url, data, Libwiris.getReferer(this.Request));
                StreamReader reader = new StreamReader(responseStream);
                this.Response.Write(reader.ReadToEnd());
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

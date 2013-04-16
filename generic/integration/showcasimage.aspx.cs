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
	/// Summary description for showcasimage.
	/// </summary>
    public partial class showcasimage : System.Web.UI.Page
	{
		private void Page_Load(object sender, System.EventArgs e)
		{
			if (this.Request.QueryString["formula"] == null || this.Request.QueryString["formula"].Length == 0) 
			{
				this.Response.Write("Error: no image name has been sended.");
			}
			else
			{
				Hashtable config = Libwiris.loadConfig(this.MapPath(Libwiris.configFile));
				
				string formula = Path.GetFileName(this.Request.QueryString["formula"]);
				string filePath = (Libwiris.getCacheDirectory(config) != null) ? Libwiris.getCacheDirectory(config) : this.MapPath(Libwiris.CacheDirectory);
				filePath += "/" + formula;

				if (File.Exists(filePath)) 
				{
					this.Response.ContentType = "image/png";
					this.Response.WriteFile(filePath);
				}
				else 
				{
					this.Response.ContentType = "image/gif";
					this.Response.WriteFile(this.MapPath("../core/cas.gif"));
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

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
	public class getmathml : System.Web.UI.Page
	{
		private void Page_Load(object sender, System.EventArgs e)
		{
			if (this.Request.Form["md5"] != null && this.Request.Form["md5"].Length == 32) 
			{
				string filePath = this.MapPath(Libwiris.FormulaDirectory + "/" + Path.GetFileName(this.Request.Form["md5"]) + ".xml");

				if (File.Exists(filePath)) 
				{
					StreamReader file = File.OpenText(filePath);
					this.Response.Write(file.ReadLine());
					file.Close();
				}
			}
			else 
			{
				this.Response.Write("Error: no md5 has been sended");
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

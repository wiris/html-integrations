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
using System.IO;

namespace pluginwiris
{
	public class createimage : System.Web.UI.Page
	{
		private void Page_Load(object sender, System.EventArgs e)
		{
			if (this.Request.Form["mml"] != null && this.Request.Form["mml"].Length > 0) 
			{
				Hashtable config = Libwiris.loadConfig(this.MapPath(Libwiris.configFile));

				if (this.Request.Form["bgColor"] != null) 
				{
					config["wirisimagebgcolor"] = this.Request.Form["bgColor"];
				}

				if (this.Request.Form["symbolColor"] != null) 
				{
					config["wirisimagesymbolcolor"] = this.Request.Form["symbolColor"];
				}

				if (this.Request.Form["transparency"] != null) 
				{
					config["wiristransparency"] = this.Request.Form["transparency"];
				}

				if (this.Request.Form["fontSize"] != null) 
				{
					config["wirisimagefontsize"] = this.Request.Form["fontSize"];
				}

				string toSave = this.Request.Form["mml"] + "\n";
				toSave += (string)config["wirisimagebgcolor"] + "\n";
				toSave += (string)config["wirisimagesymbolcolor"] + "\n";
				toSave += (string)config["wiristransparency"] + "\n";
				toSave += (string)config["wirisimagefontsize"] + "\n";

				string fileName = Libwiris.md5(toSave);
				string URL =  this.Page.ResolveUrl("showimage.aspx") + "?formula=" + fileName + ".png";
				string filePath = this.MapPath(Libwiris.FormulaDirectory + "/" + fileName + ".xml");

				if (!File.Exists(filePath)) 
				{
					TextWriter file = new StreamWriter(filePath);
					file.Write(toSave);
					file.Close();
				}
				
				this.Response.Write(URL);
			}
			else 
			{
				this.Response.Write("Error: no mathml has been sended");
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

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
		private string calculateImageMD5(string mathml, Hashtable config)
		{
			string query = "mml=" + HttpUtility.UrlEncodeUnicode(mathml);
			query += "&bgColor=" + HttpUtility.UrlEncodeUnicode((string)config["wirisimagebgcolor"]);
			query += "&symbolColor=" + HttpUtility.UrlEncodeUnicode((string)config["wirisimagesymbolcolor"]);
			query += "&fontSize=" + HttpUtility.UrlEncodeUnicode((string)config["wirisimagefontsize"]);
			query += "&transparency=" + HttpUtility.UrlEncodeUnicode((string)config["wiristransparency"]);

			return Libwiris.md5(query);
		}

		private void Page_Load(object sender, System.EventArgs e)
		{
			if (this.Request.Form["mml"] != null && this.Request.Form["mml"].Length > 0) 
			{
				Hashtable config = Libwiris.loadConfig(this.MapPath(Libwiris.configFile));
				string fileName = this.calculateImageMD5(this.Request.Form["mml"], config);
				string URL =  this.Page.ResolveUrl("showimage.aspx") + "?formula=" + fileName + ".png";
				string filePath = this.MapPath(Libwiris.FormulaDirectory + "/" + fileName + ".xml");

				if (!File.Exists(filePath)) 
				{
					TextWriter file = new StreamWriter(filePath);
					file.Write(this.Request.Form["mml"]);
					file.Close();

					this.Response.Write(URL);
				}
				else 
				{
					this.Response.Write(URL);
				}
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

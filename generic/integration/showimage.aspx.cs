using System;
using System.Text;
using System.Net;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Web;
using System.IO;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;

namespace pluginwiris
{
	/// <summary>
	/// Summary description for showimage.
	/// </summary>
	public class showimage : System.Web.UI.Page
	{
		private void Page_Load(object sender, System.EventArgs e)
		{
			if (this.Request.QueryString["formula"] == null || this.Request.QueryString["formula"].Length == 0) 
			{
				this.Response.Write("Error: no image name has been sended");
			}
			else 
			{
				string formula = Path.GetFileNameWithoutExtension(this.Request.QueryString["formula"]);
				string imagePath = this.MapPath(Libwiris.CacheDirectory + "/" + formula + ".png");
				Hashtable config = Libwiris.loadConfig(this.MapPath(Libwiris.configFile));

				if (File.Exists(imagePath) || this.createImage(config, this.MapPath(Libwiris.FormulaDirectory + "/" + formula + ".xml"), imagePath)) 
				{
					this.Response.ContentType = "image/png";
					this.Response.WriteFile(imagePath);
				}
				else 
				{
					this.Response.Write("Error creating the image.");
				}
			}
		}

		private bool createImage(Hashtable config, string formulaFile, string imageFile) 
		{
			if (File.Exists(formulaFile)) 
			{
				// HTTP Request
				TextReader file = new StreamReader(formulaFile);
				string content = file.ReadToEnd();
				file.Close();

				string[] properties = content.Split('\n');
				string mathml = properties[0];

				if (properties.Length >= 2) 
				{
					config["wirisimagebgcolor"] = properties[1];

					if (properties.Length >= 3) 
					{
						config["wirisimagesymbolcolor"] = properties[2];

						if (properties.Length >= 4) 
						{
							config["wiristransparency"] = properties[3];

							if (properties.Length >= 5) 
							{
								config["wirisimagefontsize"] = properties[4];

								if (properties.Length >= 6) 
								{
									config["wirisimagenumbercolor"] = properties[5];

									if (properties.Length >= 7) 
									{
										config["wirisimageidentcolor"] = properties[6];
									}
								}
							}
						}
					}
				}

				// Retrocompatibility: when wirisimagenumbercolor isn't defined
				if (config["wirisimagenumbercolor"] == null) 
				{
					config["wirisimagenumbercolor"] = config["wirisimagesymbolcolor"];
				}

				// Retrocompatibility: when wirisimageidentcolor isn't defined
				if (config["wirisimageidentcolor"] == null) 
				{
					config["wirisimageidentcolor"] = config["wirisimagesymbolcolor"];
				}

				string postdata = "mml=" + HttpUtility.UrlEncodeUnicode(mathml);
				postdata += "&bgColor=" + HttpUtility.UrlEncodeUnicode((string)config["wirisimagebgcolor"]);
				postdata += "&symbolColor=" + HttpUtility.UrlEncodeUnicode((string)config["wirisimagesymbolcolor"]);
				postdata += "&numberColor=" + HttpUtility.UrlEncodeUnicode((string)config["wirisimagesnumbercolor"]);
				postdata += "&identColor=" + HttpUtility.UrlEncodeUnicode((string)config["wirisimageidentcolor"]);
				postdata += "&fontSize=" + HttpUtility.UrlEncodeUnicode((string)config["wirisimagefontsize"]);
				postdata += "&transparency=" + HttpUtility.UrlEncodeUnicode((string)config["wiristransparency"]);

				ASCIIEncoding encode = new ASCIIEncoding();
				byte[] data = encode.GetBytes(postdata);

				HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://" + (string)config["wirisimageservicehost"] + ":" + (string)config["wirisimageserviceport"] + (string)config["wirisimageservicepath"]);
				request.Method = "POST";
				request.ContentType = "application/x-www-form-urlencoded; charset=UTF-8";
				
				Stream requestStream = request.GetRequestStream();
				requestStream.Write(data, 0, data.Length);
				requestStream.Close();

				// Saving the image
				WebResponse response = request.GetResponse();
				Stream responseStream = response.GetResponseStream();
				BinaryReader responseReader = new BinaryReader(responseStream);
				FileStream image = new FileStream(imageFile, FileMode.Create, FileAccess.Write);
				BinaryWriter writer = new BinaryWriter(image);

				writer.Write(responseReader.ReadBytes((int)response.ContentLength));

				writer.Close();
				image.Close();
				responseReader.Close();
				responseStream.Close();
				response.Close();

				return true;
			}

			return false;
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

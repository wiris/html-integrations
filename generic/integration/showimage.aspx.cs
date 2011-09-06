using System;
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
                Hashtable fonts = new Hashtable();
				TextReader file = new StreamReader(formulaFile);
				string content = file.ReadToEnd();
				file.Close();
                string[] lines = content.Split("\n".ToCharArray(0, 1));
                String mathml = "";

                if (lines.Length > 0)
                {
                    mathml = lines[0].Trim();
                    int i = 1;
                    int j = 0;

                    while (i < lines.Length && j < Libwiris.xmlFileAttributes.Length)
                    {
                        config[Libwiris.imageConfigProperties[Libwiris.xmlFileAttributes[j]]] = lines[i].Trim();
                        ++i;
                        ++j;
                    }

                    j = 0;

                    while (i < lines.Length)
                    {
                        string line = lines[i].Trim();

                        if (line.Length > 0)
                        {
                            fonts["font" + j] = line;
                            ++j;
                        }

                        ++i;
                    }
                }

				// Retrocompatibility: when wirisimagenumbercolor isn't defined

				if (config["wirisimagenumbercolor"] == null && config["wirisimagesymbolcolor"] != null) 
				{
					config["wirisimagenumbercolor"] = (string)config["wirisimagesymbolcolor"];
				}

				// Retrocompatibility: when wirisimageidentcolor isn't defined

				if (config["wirisimageidentcolor"] == null && config["wirisimagesymbolcolor"] != null) 
				{
					config["wirisimageidentcolor"] = (string)config["wirisimagesymbolcolor"];
				}

                Hashtable properties = new Hashtable();
                properties["mml"] = mathml;

                foreach (DictionaryEntry entry in Libwiris.imageConfigProperties)
                {
                    string serverParam = (string)entry.Key;
                    string configKey = (string)entry.Value;

                    if (config[configKey] != null)
                    {
                        properties[serverParam] = (string)config[configKey];
                    }
                }

				string protocol = (string)config["wirisimageserviceprotocol"];
				
				if (protocol == null)
				{
					protocol = "http";
				}

				Stream responseStream = Libwiris.getContents(protocol + "://" + (string)config["wirisimageservicehost"] + ":" + (string)config["wirisimageserviceport"] + (string)config["wirisimageservicepath"], properties);
				
				// Saving the image
				BinaryReader responseReader = new BinaryReader(responseStream);
				FileStream image = new FileStream(imageFile, FileMode.Create, FileAccess.Write);
				BinaryWriter writer = new BinaryWriter(image);

				writer.Write(responseReader.ReadBytes((int)responseStream.Length));

				writer.Close();
				image.Close();
				responseReader.Close();
				responseStream.Close();
				
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

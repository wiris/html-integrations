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
			bool error = false;
			
			if (this.Request.QueryString["mml"] == null && this.Request.QueryString["formula"] == null) 
			{
				this.Response.Write("Error: no digest or mathml has been sended");
			}
			else
			{
				string formula = Path.GetFileNameWithoutExtension(this.Request.QueryString["formula"]);
				string imagePath = this.MapPath(Libwiris.CacheDirectory + "/" + formula + ".png");

				if (!File.Exists(imagePath))
				{
					Hashtable config = Libwiris.loadConfig(this.MapPath(Libwiris.configFile));
					string formulaPath = this.MapPath(Libwiris.FormulaDirectory + "/" + formula);
					string extension = (File.Exists(formulaPath + ".ini")) ? "ini" : "xml";
					this.createImage(config, formulaPath, extension, imagePath, this.Request.QueryString["mml"]);
				}
				
				this.Response.ContentType = "image/png";
				this.Response.WriteFile(imagePath);
			}
		}
		
		// Retrocompatibility: there was a time that the files had another format.
		
		private Hashtable getConfigurationAndFonts(Hashtable config, string formulaFile)
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
			
			Hashtable toReturn = new Hashtable();
			toReturn["mathml"] = mathml;
			toReturn["config"] = config;
			toReturn["fonts"] = fonts;
			return toReturn;
		}
		
		private Hashtable getConfigurationAndFontsFromIni(Hashtable config, string formulaFile)
		{
			Hashtable formulaConfig = Libwiris.parseIni(formulaFile);
			Hashtable fonts = new Hashtable();
			
			foreach (DictionaryEntry entry in formulaConfig)
			{
				string key = (string)entry.Key;
				
				if (key != "mml")
				{
					string value = ((string)entry.Value).Trim();
					
					if (key.Length >= 4 && key.Substring(0, 4) == "font")
					{
						fonts[key] = value;
					}
					else
					{
						config[Libwiris.imageConfigProperties[key]] = value;
					}
				}
			}
			
			Hashtable toReturn = new Hashtable();
			toReturn["mathml"] = ((string)formulaConfig["mml"]).Trim();
			toReturn["config"] = config;
			toReturn["fonts"] = fonts;
			return toReturn;
		}

		private void createImage(Hashtable config, string formulaPath, string formulaPathExtension, string imageFile, string mathml) 
		{
			Hashtable configAndFonts = (formulaPathExtension == "ini") ? this.getConfigurationAndFontsFromIni(config, formulaPath + ".ini") : this.getConfigurationAndFonts(config, formulaPath + ".xml");
			config = (Hashtable)configAndFonts["config"];
			
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
			
			// Converting configuration to parameters.
			Hashtable properties = new Hashtable();
			
			if (mathml != null)
			{
				properties["mml"] = mathml;
			}
			else
			{
				properties["mml"] = configAndFonts["mathml"];
			}

			foreach (DictionaryEntry entry in Libwiris.imageConfigProperties)
			{
				string serverParam = (string)entry.Key;
				string configKey = (string)entry.Value;

				if (config[configKey] != null)
				{
					properties[serverParam] = ((string)config[configKey]).Trim();
				}
			}
			
			// Converting fonts to parameters.
			Hashtable fonts = (Hashtable)configAndFonts["fonts"];
			
			if (config["wirisimagefontranges"] != null)
			{
				int carry = ((Hashtable)configAndFonts["fonts"]).Count;
				string[] fontRanges = ((string)config["wirisimagefontranges"]).Split(',');
				int i = 0;
				
				foreach (string fontRangeName in fontRanges)
				{
					string fontRangeNameTrimmed = fontRangeName.Trim();
					
					if (config[fontRangeNameTrimmed] != null)
					{
						fonts["font" + (carry + i)] = ((string)config[fontRangeNameTrimmed]).Trim();
						++i;
					}
				}
			}
			
			foreach (DictionaryEntry entry in fonts)
			{
				properties[(string)entry.Key] = fonts[(string)entry.Key];
			}
			
			// Query.
			Stream responseStream = Libwiris.getContents(Libwiris.getImageServiceURL(config, null), properties);
			
			// Saving the image
			BinaryReader responseReader = new BinaryReader(responseStream);
			FileStream image = new FileStream(imageFile, FileMode.Create, FileAccess.Write);
			BinaryWriter writer = new BinaryWriter(image);

			byte[] buffer = new byte[8192];
			int bytesRead = responseReader.Read(buffer, 0, buffer.Length);
			
			while (bytesRead > 0) {
				writer.Write(buffer, 0, bytesRead);
				bytesRead = responseReader.Read(buffer, 0, buffer.Length);
			}

			writer.Close();
			image.Close();
			responseReader.Close();
			responseStream.Close();
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

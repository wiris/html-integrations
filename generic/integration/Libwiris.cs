using System;
using System.ComponentModel;
using System.Collections;
using System.Diagnostics;
using System.IO;

namespace pluginwiris
{
	/// <summary>
	/// Summary description for libwiris.
	/// </summary>
	public class Libwiris : System.ComponentModel.Component
	{
		/// <summary>
		/// Required designer variable.
		/// </summary>
		private System.ComponentModel.Container components = null;

		static public string FormulaDirectory = "../formulas";
		static public string CacheDirectory = "../cache";
		static public string configFile = "../configuration.ini";

		static public string base64Decode(string data) 
		{
			System.Text.UTF8Encoding encoder = new System.Text.UTF8Encoding();
			System.Text.Decoder utf8Decode = encoder.GetDecoder();

			byte[] toDecode_byte = Convert.FromBase64String(data);
			int charCount = utf8Decode.GetCharCount(toDecode_byte, 0, toDecode_byte.Length);
			char[] decoded_char = new char[charCount];
			utf8Decode.GetChars(toDecode_byte, 0, toDecode_byte.Length, decoded_char, 0);

			return new String(decoded_char);
		}

		static public string md5(string input) 
		{
			System.Security.Cryptography.MD5CryptoServiceProvider md5Provider = new System.Security.Cryptography.MD5CryptoServiceProvider();
			byte[] stream = System.Text.Encoding.UTF8.GetBytes(input);
			stream = md5Provider.ComputeHash(stream);
			System.Text.StringBuilder stringBuilder = new System.Text.StringBuilder();

			foreach (byte currentByte in stream) 
			{
				stringBuilder.Append(currentByte.ToString("x2").ToLower());
			}

			return stringBuilder.ToString();
		}

		static public Hashtable loadConfig(string file) 
		{
			Hashtable toReturn = new Hashtable();

			StreamReader reader = File.OpenText(file);
			string content = reader.ReadToEnd();
			reader.Close();

			content = content.Replace("\r", "");
			string[] content_lines = content.Split("\n".ToCharArray(0, 1));
			
			for (int i = 0; i < content_lines.Length; ++i) 
			{
				string[] line_words = content_lines[i].Split("=".ToCharArray(0, 1), 2);
				
				if (line_words.Length == 2) 
				{
					string key = line_words[0].Trim();
					string values = line_words[1].Trim();
					toReturn.Add(key, values);
				}
			}

			return toReturn;
		}

		public Libwiris(System.ComponentModel.IContainer container)
		{
			///
			/// Required for Windows.Forms Class Composition Designer support
			///
			container.Add(this);
			InitializeComponent();

			//
			// TODO: Add any constructor code after InitializeComponent call
			//
		}

		public Libwiris()
		{
			///
			/// Required for Windows.Forms Class Composition Designer support
			///
			InitializeComponent();

			//
			// TODO: Add any constructor code after InitializeComponent call
			//
		}

		/// <summary> 
		/// Clean up any resources being used.
		/// </summary>
		protected override void Dispose( bool disposing )
		{
			if( disposing )
			{
				if(components != null)
				{
					components.Dispose();
				}
			}
			base.Dispose( disposing );
		}


		#region Component Designer generated code
		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			components = new System.ComponentModel.Container();
		}
		#endregion
	}
}

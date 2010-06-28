using System;
using System.ComponentModel;
using System.Collections;
using System.Diagnostics;
using System.IO;
using System.Web;

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

        static public Hashtable imageConfigProperties = new Hashtable();

        static Libwiris() {
            Libwiris.imageConfigProperties.Add("bgColor", "wirisimagebgcolor");
	        Libwiris.imageConfigProperties.Add("symbolColor", "wirisimagesymbolcolor");
	        Libwiris.imageConfigProperties.Add("transparency", "wiristransparency");
	        Libwiris.imageConfigProperties.Add("fontSize", "wirisimagefontsize");
	        Libwiris.imageConfigProperties.Add("numberColor", "wirisimagenumbercolor");
	        Libwiris.imageConfigProperties.Add("identColor", "wirisimageidentcolor");
	        Libwiris.imageConfigProperties.Add("identMathvariant", "wirisimageidentmathvariant");
	        Libwiris.imageConfigProperties.Add("numberMathvariant", "wirisimagenumbermathvariant");
	        Libwiris.imageConfigProperties.Add("fontIdent", "wirisimagefontident");
	        Libwiris.imageConfigProperties.Add("fontNumber", "wirisimagefontnumber");
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

        /// <summary> 
        /// Clean up any resources being used.
        /// </summary>
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (components != null)
                {
                    components.Dispose();
                }
            }
            base.Dispose(disposing);
        }

		static public Hashtable loadConfig(string file) 
		{
			Hashtable toReturn = new Hashtable();

			StreamReader reader = File.OpenText(file);
			string content = reader.ReadToEnd();
			reader.Close();

			content = content.Replace("\r", "");
			string[] contentLines = content.Split('\n');

            for (int i = 0; i < contentLines.Length; ++i) 
			{
                string[] lineWords = contentLines[i].Split("\n".ToCharArray(0, 1), 2);

                if (lineWords.Length == 2) 
				{
                    string key = lineWords[0].Trim();
                    string values = lineWords[1].Trim();
					toReturn.Add(key, values);
				}
			}

			return toReturn;
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

        static public string httpBuildQuery(Hashtable properties)
        {
            string returnValue = "";

            foreach (string key in properties)
            {
                returnValue += HttpUtility.UrlEncodeUnicode(key) + "=" + HttpUtility.UrlEncodeUnicode(properties[key].ToString()) + "&";
            }

            return returnValue;
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

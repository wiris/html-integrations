using System;
using System.ComponentModel;
using System.Collections;
using System.Diagnostics;
using System.IO;
using System.Web;
using System.Text;
using System.Net;

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

        static public string[] xmlFileAttributes = {
            "bgColor",
            "symbolColor",
            "transparency",
            "fontSize",
            "numberColor",
            "identColor",
            "identMathvariant",
            "numberMathvariant",
            "fontIdent",
            "fontNumber",
            "zoom",
            "dpi",
			"color",
			"backgroundColor",
			"fontFamily"
        };
	
        static Libwiris()
        {
            Libwiris.imageConfigProperties["bgColor"] = "wirisimagebgcolor";
			Libwiris.imageConfigProperties["backgroundColor"] = "wirisimagebackgroundcolor";
            Libwiris.imageConfigProperties["symbolColor"] = "wirisimagesymbolcolor";
            Libwiris.imageConfigProperties["transparency"] = "wiristransparency";
            Libwiris.imageConfigProperties["fontSize"] = "wirisimagefontsize";
            Libwiris.imageConfigProperties["numberColor"] = "wirisimagenumbercolor";
            Libwiris.imageConfigProperties["identColor"] = "wirisimageidentcolor";
            Libwiris.imageConfigProperties["identMathvariant"] = "wirisimageidentmathvariant";
            Libwiris.imageConfigProperties["numberMathvariant"] = "wirisimagenumbermathvariant";
            Libwiris.imageConfigProperties["fontIdent"] = "wirisimagefontident";
            Libwiris.imageConfigProperties["fontNumber"] = "wirisimagefontnumber";
			Libwiris.imageConfigProperties["version"] = "wirisimageserviceversion";
			Libwiris.imageConfigProperties["color"] = "wirisimagecolor";
			Libwiris.imageConfigProperties["dpi"] = "wirisdpi";
			Libwiris.imageConfigProperties["fontFamily"] = "wirisfontfamily";
			Libwiris.imageConfigProperties["rtlLanguages"] = "wirisrtllanguages";
			Libwiris.imageConfigProperties["ltrLanguages"] = "wirisltrlanguages";
			Libwiris.imageConfigProperties["arabicIndicLanguages"] = "wirisarabicindiclanguages";
			Libwiris.imageConfigProperties["easternArabicIndicLanguages"] = "wiriseasternarabicindiclanguages";
			Libwiris.imageConfigProperties["europeanLanguages"] = "wiriseuropeanlanguages";
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
		
		static public string createIni(Hashtable properties)
		{
			string toReturn = "";
			
			foreach (DictionaryEntry entry in properties)
			{
				toReturn += (string)entry.Key + " = " + (string)entry.Value + "\r\n";
			}
			
			return toReturn;
		}
		
		static public string dirName(string path)
		{
			return path.Substring(0, path.LastIndexOf('/'));
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

        static public string[] getAvailableCASLanguages(string languageString)
        {
            string[] availableLanguages = languageString.Split(",".ToCharArray(0, 1));

            for (int i = availableLanguages.Length - 1; i >= 0; --i)
            {
                availableLanguages[i] = availableLanguages[i].Trim();
            }

            // At least we should accept an empty language.

            if (availableLanguages.Length == 0)
            {
                string[] returnValue = { "" };
                return returnValue;
            }

            return availableLanguages;
        }

		static public string getCacheDirectory(Hashtable config)
		{
			string cacheDirectory = (config["wiriscachedirectory"] != null) ? (string)config["wiriscachedirectory"] : null;
			if (cacheDirectory != null && !Directory.Exists(cacheDirectory)){
				Directory.CreateDirectory(cacheDirectory);
			}
			return cacheDirectory;
		}
		
		static public Stream getContents(string url, Hashtable postVariables, string referer)
		{
			string postdata = Libwiris.httpBuildQuery(postVariables);

			ASCIIEncoding encode = new ASCIIEncoding();
			byte[] data = encode.GetBytes(postdata);
			
			HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Referer = referer;
			
			if (postVariables == null)
			{
				request.Method = "GET";
			}
			else
			{
				request.Method = "POST";
				request.ContentType = "application/x-www-form-urlencoded; charset=UTF-8";
			}
			
			Stream requestStream = request.GetRequestStream();
			requestStream.Write(data, 0, data.Length);
			requestStream.Close();
			WebResponse response = request.GetResponse();
			return response.GetResponseStream();
		}
		
		static public string getFormulaDirectory(Hashtable config)
		{
			string formulaDirectory = (config["wirisformuladirectory"] != null) ? (string)config["wirisformuladirectory"] : null;
			if (formulaDirectory != null && !Directory.Exists(formulaDirectory)){
				Directory.CreateDirectory(formulaDirectory);
			}			
			return formulaDirectory;
		}
		
		static public string getImageServiceURL(Hashtable config, string service)
		{
			// Protocol
			string protocol = "";
			
			if (config["wirisimageserviceprotocol"] != null){
				protocol = (string)config["wirisimageserviceprotocol"];
			}else{
				string str_url = HttpContext.Current.Request.Url.AbsoluteUri;
				Uri url = new Uri(str_url);
				if (url.Scheme == "https"){
					protocol = "https";
				}else{
					protocol = "http";
				}
			}

			// Port
			string port = "";
			if (config["wirisimageserviceport"] != null){
				port = ":" + (string)config["wirisimageserviceport"];
			}else{
				port = "";
			}
			
			// Domain.
			string domain = (string)config["wirisimageservicehost"];

			// Path.
			string path = (string)config["wirisimageservicepath"];

			if (service != null) {
				path = Libwiris.dirName(path) + "/" + service;
			}

			return protocol + "://" + domain + port + path;
		}
		
		static public string getReferer(HttpRequest request)
		{
            return request.Url.Scheme + "://" + request.Url.Host + ":" + request.Url.Port + request.Url.PathAndQuery;
		}
		
        static public string httpBuildQuery(Hashtable properties)
        {
            string returnValue = "";

            foreach (DictionaryEntry entry in properties)
            {
                string key = (string)entry.Key;
                string value = (string)entry.Value;
                returnValue += HttpUtility.UrlEncodeUnicode(key) + "=" + HttpUtility.UrlEncodeUnicode(value) + "&";
            }

            return returnValue;
        }

        static public string htmlentities(string input, bool entQuotes)
        {
            string returnValue = input.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "gt;");

            if (entQuotes)
            {
                return returnValue.Replace("\"", "&quot;");
            }

            return returnValue;
        }

        static public bool inArray(string needle, string[] stack)
        {
            for (int i = stack.Length - 1; i >= 0; --i)
            {
                if (stack[i] == needle)
                {
                    return true;
                }
            }

            return false;
        }

        static public Hashtable loadConfig(string file)
        {
            return Libwiris.parseIni(file);
        }
		
		static public Hashtable parseIni(string file)
		{
			Hashtable toReturn = new Hashtable();

            StreamReader reader = File.OpenText(file);
            string content = reader.ReadToEnd();
            reader.Close();

            content = content.Replace("\r", "");
            string[] contentLines = content.Split("\n".ToCharArray(0, 1));

            for (int i = 0; i < contentLines.Length; ++i)
            {
                string[] lineWords = contentLines[i].Split("=".ToCharArray(0, 1), 2);

                if (lineWords.Length == 2)
                {
                    
                    string key = lineWords[0].Trim();
                    if (!key.StartsWith("#"))
                    {
                        string value = lineWords[1].Trim();
                        toReturn.Add(key, value);
                    }
                }
            }

            return toReturn;
		}

        static public string replaceVariable(string value, string variableName, string variableValue)
        {
            return value.Replace("%" + variableName, variableValue);
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

        static public void copyStream(Stream input, Stream output)
        {
            byte[] buffer = new byte[32768];
            int read;

            while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
            {
                output.Write(buffer, 0, read);
            }
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

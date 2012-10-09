using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using System.Net.Sockets;

namespace pluginwiris
{
    public class test : System.Web.UI.Page
    {
        public const string HTML_STRING = "<test></test>";
        public const string SQL_STRING = "SELECT `test` FROM `test` WHERE 'test' AND \"test\"";

        private void Page_Load(object sender, System.EventArgs e)
        {
        }

        protected void wrs_assert(bool condition)
        {
            if (condition)
            {
                this.Response.Write("<span class=\"ok\">OK</span>");
            }
            else
            {
                this.Response.Write("<span class=\"error\">ERROR</span>");
            }
        }

		protected void wrs_createTableRow(string testName, string reportText, string solutionLink, bool condition){
			this.Response.Write("<tr>");
			this.Response.Write("<td>" + testName + "</td>");
			this.Response.Write("<td>" + reportText + "</td>");
			this.Response.Write("<td>");
			if (condition) {
				this.Response.Write("<span class=\"ok\">OK</span><br/>");
			} else {
				this.Response.Write("<span class=\"error\">ERROR</span><br/>");
			}
			this.Response.Write("</td>");
			this.Response.Write("</tr>");			
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

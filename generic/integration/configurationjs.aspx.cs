using System;
using System.Web.UI;
using com.wiris.plugin.factory;
using System.Collections.Generic;
using com.wiris.plugin.api;
using System.Web;

namespace plugin_web
{
    public partial class configurationjs : System.Web.UI.Page
    {
        private void outVar(HttpResponse output, string key, string script) {
            output.Write("var _wrs_conf_");
            output.Write(key);
            output.Write(" = _wrs_conf_path+'/integration/");
            output.Write(script);
            output.Write(".aspx';\r\n");
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            Dictionary<string, string> param = PluginBuilderFactory.getProperties(Request);
            PluginBuilder pb = PluginBuilderFactory.newPluginBuilder(Request);
            string r = pb.getConfiguration().getJavaScriptConfiguration();
            outVar(Response,"createimagePath","createimage");
            outVar(Response,"editorPath","editor");
            outVar(Response,"CASPath","cas");
            outVar(Response,"createimagePath","createimage");
            outVar(Response,"createcasimagePath","createcasimage");
            outVar(Response,"getmathmlPath","getmathml");
            outVar(Response,"servicePath", "service");
            this.Response.Write(r);
        }

        override protected void OnInit(EventArgs e)
        {
            this.Load += new System.EventHandler(this.Page_Load);
            base.OnInit(e);
        }

    }
}

using System;
using System.Web.UI;
using com.wiris.plugin.factory;
using System.Collections.Generic;
using com.wiris.plugin.api;

namespace plugin_web
{
    public partial class test : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            PluginBuilder pb = PluginBuilderFactory.newPluginBuilder(Request);
            string test = pb.newTest().getTestPage();
            Response.ContentType = "text/html; charset=utf-8";
            Response.Write(test);
        }

        override protected void OnInit(EventArgs e)
        {
            this.Load += new System.EventHandler(this.Page_Load);
            base.OnInit(e);
        }

    }
}

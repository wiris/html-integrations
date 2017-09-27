using System;
using System.Web.UI;
using System.Collections.Generic;
using com.wiris.plugin.factory;
using com.wiris.plugin.api;
using com.wiris.system.service;

namespace plugin_web
{
    public partial class testfilter : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            PluginBuilder pb = PluginBuilderFactory.newPluginBuilder(Request, Response);

            // Adding - if necessary - CORS headers
            HttpResponse res = new HttpResponse(this.Response);
            String origin = this.Request.Headers.Get("origin");
            pb.addCorsHeaders(res, origin);

            // If called from another spot, please set the Request (can be null), "pluginFolder" and "pluginUrl" (can be relative)
            //PluginBuilder pb = PluginBuilderFactory.newPluginBuilder(Request, "E:\\develop\\PLUGINS\\editors\\generic", "http://localhost:50026");

            TextService text = pb.newTextService();
            Dictionary<string,string> p = new Dictionary<string,string>();

            string s = "<html><body><b>Formula: </b><math><mfrac><mi>x</mi><mn>1000</mn></mfrac></math></body></html>";
            String output = pb.newTextService().filter(s, p);

            // Sent the output
            Response.ContentType = "text/html; charset=utf-8";
            Response.Write(output);
        }

        override protected void OnInit(EventArgs e)
        {
            this.Load += new System.EventHandler(this.Page_Load);
            base.OnInit(e);
        }

    }
}

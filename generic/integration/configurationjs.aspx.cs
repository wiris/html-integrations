using System;
using System.Web.UI;
using com.wiris.plugin.factory;
using System.Collections.Generic;
using com.wiris.plugin.api;
using System.Web;
using com.wiris.system.service;
using com.wiris.util.sys;

namespace plugin_web
{
    public partial class configurationjs : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Dictionary<string, string> param = PluginBuilderFactory.getProperties(Request);
            PluginBuilder pb = PluginBuilderFactory.newPluginBuilder(Request, Response);
            AccessProvider accessProvider = pb.getAccessProvider();
            if (accessProvider != null && !accessProvider.requireAccess())
            {
                return;
            }

            // Adding - if necessary - CORS headers
            com.wiris.system.service.HttpResponse res = new com.wiris.system.service.HttpResponse(this.Response);
            String origin = this.Request.Headers.Get("origin");
            pb.addCorsHeaders(res, origin);

            Response.ContentType = "application/json";

            string r = pb.getConfiguration().getJavaScriptConfigurationJson();
            this.Response.Write(r);
        }

        override protected void OnInit(EventArgs e)
        {
            this.Load += new System.EventHandler(this.Page_Load);
            base.OnInit(e);
        }

    }
}

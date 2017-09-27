using System;
using System.Web.UI;
using com.wiris.plugin.factory;
using System.Collections.Generic;
using com.wiris.plugin.api;
using System.Web;
using com.wiris.system.service;
using com.wiris.plugin.configuration;

namespace plugin_web
{
    public partial class configurationjson : System.Web.UI.Page
    {

        protected void Page_Load(object sender, EventArgs e)
        {            
            PluginBuilder pb = PluginBuilderFactory.newPluginBuilder(Request, Response);
            ParamsProvider provider = pb.getCustomParamsProvider();

            // Adding - if necessary - CORS headers
            com.wiris.system.service.HttpResponse res = new com.wiris.system.service.HttpResponse(this.Response);
            String origin = this.Request.Headers.Get("origin");
            pb.addCorsHeaders(res, origin);

            Response.ContentType = "application/json";
            String variableKeys = provider.getRequiredParameter("variablekeys");
            String r = pb.getConfiguration().getJsonConfiguration(variableKeys);
            this.Response.Write(r);
        }

        override protected void OnInit(EventArgs e)
        {
            this.Load += new System.EventHandler(this.Page_Load);
            base.OnInit(e);
        }

    }
}

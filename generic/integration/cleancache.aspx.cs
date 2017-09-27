using System;
using System.Web.UI;
using com.wiris.plugin.factory;
using System.Collections.Generic;
using com.wiris.plugin.api;
using com.wiris.system.service;
using com.wiris.plugin.configuration;

namespace plugin_web
{
    public partial class cleancache : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            PluginBuilder pb = PluginBuilderFactory.newPluginBuilder(Request, Response);
            ParamsProvider provider = pb.getCustomParamsProvider();
            Dictionary<string, string> param = PluginBuilderFactory.getProperties(Request);

            // Adding - if necessary - CORS headers
            HttpResponse res = new HttpResponse(this.Response);
            String origin = this.Request.Headers.Get("origin");
            pb.addCorsHeaders(res, origin);

            CleanCache cleanCache = pb.newCleanCache();
            cleanCache.init(provider);
            string output = cleanCache.getCacheOutput();
            Response.ContentType = cleanCache.getContentType();
            Response.Write(output);
        }

        override protected void OnInit(EventArgs e)
        {
            this.Load += new System.EventHandler(this.Page_Load);
            base.OnInit(e);
        }

    }
}

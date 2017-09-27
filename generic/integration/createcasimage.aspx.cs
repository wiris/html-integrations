using System;
using System.Web.UI;
using com.wiris.plugin.factory;
using System.Collections.Generic;
using com.wiris.plugin.api;
using com.wiris.system.service;

namespace plugin_web
{
    public partial class createcasimage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Dictionary<string, string> param = PluginBuilderFactory.getProperties(Request);
            PluginBuilder pb = PluginBuilderFactory.newPluginBuilder(Request, Response);

            // Adding - if necessary - CORS headers
            HttpResponse res = new HttpResponse(this.Response);
            String origin = this.Request.Headers.Get("origin");
            pb.addCorsHeaders(res, origin);
            
            string r = pb.newCas().createCasImage(param["image"]);
            this.Response.Write(r);
        }

        override protected void OnInit(EventArgs e)
        {
            this.Load += new System.EventHandler(this.Page_Load);
            base.OnInit(e);
        }

    }
}

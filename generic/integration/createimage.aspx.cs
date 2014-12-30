using System;
using System.Web.UI;
using com.wiris.plugin.factory;
using System.Collections.Generic;
using com.wiris.plugin.api;
using com.wiris.system.service;
using com.wiris.system.service;

namespace plugin_web
{
    public partial class createimage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string mml = this.Request.Params["mml"];
            if (mml==null) {
                throw new Exception("Missing parameter 'mml'.");
            }
            Dictionary<string, string> param = PluginBuilderFactory.getProperties(Request);
            PluginBuilder pb = PluginBuilderFactory.newPluginBuilder(Request);
            
            // Adding - if necessary - CORS headers
            HttpResponse res = new HttpResponse(this.Response);
            String origin = this.Request.Headers.Get("origin");
            pb.addCorsHeaders(res, origin);

            string r = pb.newRender().createImage(mml, param, null);
            this.Response.Write(r);
        }

        override protected void OnInit(EventArgs e)
        {
            this.Load += new System.EventHandler(this.Page_Load);
            base.OnInit(e);
        }

    }
}

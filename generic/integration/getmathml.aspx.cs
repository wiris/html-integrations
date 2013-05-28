using System;
using System.Web.UI;
using com.wiris.plugin.web;
using System.Collections.Generic;
using com.wiris.plugin.api;

namespace plugin_web
{
    public partial class getmathml : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            PluginBuilder pb = DispatcherUtils.getPluginBuilder(Request);
            String latex = Request.Params["latex"];
            String digest = Request.Params["digest"];
            if (digest == null || digest.Length == 0)
            {
                digest = Request.Params["md5"];
            }
            String r = pb.newTextService().getMathML(digest, latex);
            Response.ContentType = "text/plain; charset=utf-8";
            Response.Write(r);
        }

        override protected void OnInit(EventArgs e)
        {
            this.Load += new System.EventHandler(this.Page_Load);
            base.OnInit(e);
        }

    }
}

using System;
using System.Web.UI;
using com.wiris.plugin.web;
using System.Collections.Generic;
using com.wiris.plugin.api;

namespace plugin_web
{
    public partial class showcasimage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Dictionary<string, string> param = DispatcherUtils.getParameterMap(Request.Params);
            PluginBuilder pb = DispatcherUtils.getPluginBuilder(Request);
            byte[] bs = pb.newCas().showCasImage(param["formula"],param);
            Response.ContentType = "image/png";
            Response.OutputStream.Write(bs, 0, bs.Length);
        }

        override protected void OnInit(EventArgs e)
        {
            this.Load += new System.EventHandler(this.Page_Load);
            base.OnInit(e);
        }

    }
}

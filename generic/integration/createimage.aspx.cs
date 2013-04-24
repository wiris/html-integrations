using System;
using System.Web.UI;
using com.wiris.plugin.web;
using System.Collections.Generic;
using com.wiris.plugin.api;

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
            Dictionary<string, string> param = DispatcherUtils.getParameterMap(Request.Params);
            PluginBuilder pb = DispatcherUtils.getPluginBuilder(Request);
            string r = pb.newRender().createImage(mml, param);
            this.Response.Write(r);
        }

        override protected void OnInit(EventArgs e)
        {
            this.Load += new System.EventHandler(this.Page_Load);
            base.OnInit(e);
        }

    }
}

using System;
using System.Web.UI;
using com.wiris.plugin.factory;
using System.Collections.Generic;
using com.wiris.plugin.api;
using com.wiris.system.service;
using com.wiris.plugin.configuration;

namespace plugin_web
{
    public partial class showimage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            PluginBuilder pb = PluginBuilderFactory.newPluginBuilder(Request, Response);
            ParamsProvider provider = pb.getCustomParamsProvider();
            String digest = provider.getParameter("formula", null);
            String mml = provider.getParameter("mml", null);

            if (digest==null && mml==null) {
                throw new Exception("Missing parameters 'formula' or 'mml'.");
            }
            // Backwards compatibility
            // showimage.php?formula.png --> showimage.php?formula
            // because formula is md5 string, remove all extensions.
            if (digest != null && digest.LastIndexOf(".") >= 0) {
                digest = digest.Substring(0, digest.LastIndexOf("."));
            }
            Dictionary<string, string> param = PluginBuilderFactory.getProperties(Request);
            // Adding - if necessary - CORS headers
            HttpResponse res = new HttpResponse(this.Response);
            String origin = this.Request.Headers.Get("origin");
            pb.addCorsHeaders(res, origin);
            if (pb.getConfiguration().getProperty("wirispluginperformance","xml").IndexOf("true") != -1) {

                String useragent = provider.getParameter("useragent", "");
                if (useragent.IndexOf("IE") != -1) {
                    pb.getConfiguration().setProperty("wirisimageformat", "png");
                }
                else {
                    pb.getConfiguration().setProperty("wirisimageformat", "svg");
                }

                Response.ContentType = "application/json";
                Response.AddHeader("Cache-Control", "public, max-age=3600");
                if (digest == null) {
                    pb.newRender().showImage(digest,mml,provider);
                    digest = pb.newRender().computeDigest(mml, provider.getParameters());
                }
                string r = pb.newRender().showImageJson(digest, "en");
                if (r.IndexOf("warning") != -1)
                {
                    Response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                }
                Response.Write(r);
            } else {
                byte [] bs = pb.newRender().showImage(digest,mml,provider);
                Response.ContentType = pb.getImageFormatController().getContentType();
                Response.OutputStream.Write(bs,0,bs.Length);
            }
        }

        override protected void OnInit(EventArgs e)
        {
            this.Load += new System.EventHandler(this.Page_Load);
            base.OnInit(e);
        }

    }
}

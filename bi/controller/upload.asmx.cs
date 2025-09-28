using System;
using System.IO;
using System.Web;
using System.Web.Services;

namespace Web_Services.controller
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    public class upload : WebService
    {
        // ✅ Standard [WebMethod] for basic test
        [WebMethod]
        public string HelloWorld()
        {
            return "Hello World";
        }

        // ❌ DO NOT decorate with [WebMethod]
        // ✅ Raw handler for file upload (dxFileUploader-friendly)
        public void uploadProformaFile()
        {
            HttpContext context = HttpContext.Current;

            if (context.Request.Files.Count > 0)
            {
                HttpPostedFile file = context.Request.Files["file"];

                string uploadFolder = context.Server.MapPath("~/uploads/pi");
                if (!Directory.Exists(uploadFolder))
                    Directory.CreateDirectory(uploadFolder);

                string fileName = Path.GetFileName(file.FileName);
                string fullPath = Path.Combine(uploadFolder, fileName);
                file.SaveAs(fullPath);

                context.Response.ContentType = "application/json";
                context.Response.Write("{\"fileName\":\"" + fileName + "\"}");
            }
            else
            {
                context.Response.StatusCode = 400;
                context.Response.Write("{\"error\":\"No file received\"}");
            }

            context.Response.End();
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

namespace HitcoForm.api
{
    /// <summary>
    /// Summary description for apiLogin
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class apiLogin : System.Web.Services.WebService
    {

        [WebMethod(EnableSession = true)]
        public string apiRequest(dynamic data)
        {
            string username = Session["userName"]?.ToString();
            string tkn = "tyunbvpo";

            using (var client = new System.Net.WebClient())
            {
                client.Headers.Add("Content-Type", "application/json");

                var payload = new
                {
                    username = username,
                    tkn = tkn
                };

                string jsonPayload = new JavaScriptSerializer().Serialize(new { payload });

                string response = client.UploadString("http://dev-srv:8080/controller/userLogin.asmx/receiveUserData", "POST", jsonPayload);

                // Parse the response
                var outer = new JavaScriptSerializer().Deserialize<Dictionary<string, string>>(response);
                var inner = new JavaScriptSerializer().Deserialize<Dictionary<string, string>>(outer["d"]);

                string receivedUsername = inner["username"];
                string receivedToken = inner["tkn"];

                // ✅ Build proper redirect URL
                string redirectUrl = $"https://dev-srv/controller/authRedirect.aspx" +
                                     $"?username={HttpUtility.UrlEncode(receivedUsername)}" +
                                    $"&tkn={HttpUtility.UrlEncode(receivedToken)}";

                // ✅ Return redirect URL to the frontend so browser can follow it
                return redirectUrl;
            }
        }

    }
}

using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using Web_Services.dataAccess;
using Web_Services.DataAccess;

namespace Web_Services.controller
{
    /// <summary>
    /// Summary description for userLogin
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]
    public class userLogin : System.Web.Services.WebService
    {
        public class UserPayload
        {
            public string username { get; set; }
            public string tkn { get; set; }
        }

        [WebMethod(EnableSession = true)]
        public string login(string username, string password)
        {
            return loginRepository.Login(username, password);
        }

        [WebMethod(EnableSession = true)]        
        public string receiveUserData(UserPayload payload)
        {

            //return $"User: {payload.username}, Token: {payload.tkn}";
            // Check if token is correct
            if (payload.tkn != "tyunbvpo")  // <-- Your expected token
            {
                return "Invalid token";
            }
            else
            {

                string newToken = GenerateToken(16);

                // ✅ 3. Save token in database (you should implement this)
                JObject data= loginRepository.apiLogin(payload.username, newToken); // Make sure this method exists


                // ✅ 4. Return both username and new token
                return new JavaScriptSerializer().Serialize(new
                {
                    username = payload.username,
                    tkn = newToken
                });
            }
        }


        private string GenerateToken(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new System.Security.Cryptography.RNGCryptoServiceProvider();
            var result = new char[length];
            var buffer = new byte[1];

            for (int i = 0; i < length; i++)
            {
                random.GetBytes(buffer);
                int rnd = buffer[0] % chars.Length;
                result[i] = chars[rnd];
            }

            return new string(result);
        }
    }

}

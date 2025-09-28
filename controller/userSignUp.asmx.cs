using HitcoForm.conn;
using System.Web.Services;

namespace HitcoForm.controller
{
    /// <summary>
    /// Summary description for userSignUp
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class userSignUp : System.Web.Services.WebService
    {

        [WebMethod(EnableSession = true)]
        public string SignUp(dynamic data)
        {
            return signUpRepository.SignUp(data);
        }
    }
}

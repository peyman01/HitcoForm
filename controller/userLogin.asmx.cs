using HitcoForm.conn;
using System.Web.Services;

namespace HitcoForm.controller
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

        [WebMethod(EnableSession = true)]
        public string login(string username, string password)
        {
            var a = Session["userName"];
            return loginRepository.Login(username, password);
        }
    }
}

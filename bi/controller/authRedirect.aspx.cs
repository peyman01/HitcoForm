using Newtonsoft.Json.Linq;
using System;
using System.Data;
using System.Web;
using Web_Services.dataAccess;

namespace Web_Services.controller
{
    public partial class authRedirect : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string username = Request.QueryString["username"];
            string tkn = Request.QueryString["tkn"];

            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(tkn))
            {
                // ✅ Call the single method that validates + returns user data
                JObject userRow = loginRepository.ValidateUserAndToken(username, tkn);

                if (userRow != null)
                {
                    // ✅ Set session variables using user info
                    Session["infoUid"] = userRow["result"][0]["infoUid"];
                    //Session["infoUid"] = Convert.ToInt32(userRow["userId"]);
                    //Session["fullName"] = userRow["fullName"].ToString(); // Optional

                    // ✅ Redirect to the actual page
                    Response.Redirect("https://dev-srv/serviceAdmin.aspx");
                    return;
                }
            }

            // ❌ If anything fails, redirect to login
            Response.Redirect("http://dev-srv/login.aspx?error=invalid_token");
        }
    }
}

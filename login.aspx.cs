using System;

namespace HitcoForm
{
    public partial class login1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["infoUid"] != null)
            {
                Response.Redirect("mainDashboard.aspx");
            }


        }
    }
}
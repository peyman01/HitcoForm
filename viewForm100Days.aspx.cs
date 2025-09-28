using System;

namespace HitcoForm
{
    public partial class viewForm100Days : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["infoUid"] == null)
            {
                Response.Redirect("login.aspx");
                return;
            }
        }
    }
}
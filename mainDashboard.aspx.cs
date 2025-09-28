using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace HitcoForm
{
    public partial class mainDashboard : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["infoUid"] == null)
            {
                Response.Redirect("login.aspx");
            }
        }
    }
}
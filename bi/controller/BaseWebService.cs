using System.Web.Services;
using System.Web;
using Newtonsoft.Json;
using System;

public class BaseWebService : WebService
{
    protected dynamic ValidateSession()
    {
        if (Session["infoUid"] == null || Session["infoUid"].ToString() == "0")
        {
            return new    
            {
                Status = false,
                Msg = "SessionExpiredHitco_@#!ht"
            };
        }
        else {
            return new 
            {
                Status = true,
                Msg = "it is ok"
            };
        }
    }
}

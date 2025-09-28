using System;
using System.Web;
using System.Web.Services.Protocols;
using Newtonsoft.Json;

public class SessionValidationSoapExtension : SoapExtension
{
    public override object GetInitializer(Type serviceType)
    {
        return null;
    }

    public override object GetInitializer(LogicalMethodInfo methodInfo, SoapExtensionAttribute attribute)
    {
        return null;
    }

    public override void Initialize(object initializer)
    {
    }

    public override void ProcessMessage(SoapMessage message)
    {
        if (message.Stage == SoapMessageStage.BeforeDeserialize)
        {
            HttpContext context = HttpContext.Current;

            // Session validation logic
            if (context.Session["infoUid"] == null || context.Session["infoUid"].ToString() == "0")
            {
                context.Response.ContentType = "application/json";
                context.Response.Write(JsonConvert.SerializeObject(new
                {
                    error = true,
                    message = "sessionExpired"
                }));

                context.ApplicationInstance.CompleteRequest();
            }
            
        }
    }
}

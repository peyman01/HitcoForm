using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace HitcoForm.controlProject
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class cApiService : System.Web.Services.WebService
    {
        [WebMethod]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string GetUserInfo(string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("getUserName", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = session;
                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    var result = new
                    {
                        userData = dataSet.Tables[0]
                    };

                    return Newtonsoft.Json.JsonConvert.SerializeObject(result);
                }
            }
            catch (Exception ex)
            {
                var error = new { error = ex.Message };
                return Newtonsoft.Json.JsonConvert.SerializeObject(error);
            }
        }
    }
}
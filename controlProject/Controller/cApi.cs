using System;
using System.Web;
using System.Web.Services;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using Newtonsoft.Json.Linq;

namespace HitcoForm
{
    public class cApi : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json; charset=utf-8";
            context.Response.AddHeader("Access-Control-Allow-Origin", "*");

            string action = context.Request.QueryString["action"] ?? "test";
            JObject result;

            switch (action.ToLower())
            {
                case "test":
                    result = TestConnection();
                    break;
                case "getforms":
                    result = GetForms();
                    break;
                case "getuser":
                    string session = context.Request.QueryString["session"];
                    result = GetUser(session);
                    break;
                case "getformdata":
                    int year = Convert.ToInt32(context.Request.QueryString["year"] ?? "2024");
                    string formName = context.Request.QueryString["formName"] ?? "";
                    int infoUid = Convert.ToInt32(context.Request.QueryString["infoUid"] ?? "0");
                    int? month = string.IsNullOrEmpty(context.Request.QueryString["month"]) ? 
                        (int?)null : Convert.ToInt32(context.Request.QueryString["month"]);
                    int? season = string.IsNullOrEmpty(context.Request.QueryString["season"]) ? 
                        (int?)null : Convert.ToInt32(context.Request.QueryString["season"]);
                    result = GetFormData(year, month, season, formName, infoUid);
                    break;
                default:
                    result = new JObject
                    {
                        ["success"] = false,
                        ["error"] = "عمل نامعتبر"
                    };
                    break;
            }

            context.Response.Write(result.ToString());
        }

        public bool IsReusable => false;

        private static JObject TestConnection()
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand("SELECT GETDATE() as CurrentDateTime, 'اتصال موفق!' as Message", connection);
                    
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    return new JObject
                    {
                        ["success"] = true,
                        ["message"] = "اتصال به دیتابیس موفق بود",
                        ["data"] = JArray.FromObject(dataSet.Tables[0]),
                        ["timestamp"] = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss")
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject
                {
                    ["success"] = false,
                    ["error"] = ex.Message,
                    ["timestamp"] = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss")
                };
            }
        }

        private static JObject GetUser(string session)
        {
            if (string.IsNullOrEmpty(session))
                return new JObject { ["success"] = false, ["error"] = "پارامتر session الزامی است" };

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

                    return new JObject
                    {
                        ["success"] = true,
                        ["userData"] = JArray.FromObject(dataSet.Tables[0]),
                        ["timestamp"] = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss")
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject
                {
                    ["success"] = false,
                    ["error"] = ex.Message,
                    ["timestamp"] = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss")
                };
            }
        }

        private static JObject GetForms()
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("SELECT formId, formName, formAbb FROM tForm", connection);
                    connection.Open();
                    
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    return new JObject
                    {
                        ["success"] = true,
                        ["forms"] = JArray.FromObject(dataSet.Tables[0]),
                        ["count"] = dataSet.Tables[0].Rows.Count,
                        ["timestamp"] = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss")
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject
                {
                    ["success"] = false,
                    ["error"] = ex.Message,
                    ["timestamp"] = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss")
                };
            }
        }

        private static JObject GetFormData(int year, int? month, int? season, string formName, int infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("getFormData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    
                    command.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = year;
                    command.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value = month.HasValue ? (object)month.Value : DBNull.Value;
                    command.Parameters.Add(new SqlParameter("@season", SqlDbType.Int)).Value = season.HasValue ? (object)season.Value : DBNull.Value;
                    command.Parameters.Add(new SqlParameter("@formName", SqlDbType.NVarChar, 20)).Value = formName;
                    command.Parameters.Add(new SqlParameter("@formDataID", SqlDbType.Int)).Value = 0;
                    command.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = infoUid;
                    
                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    return new JObject
                    {
                        ["success"] = true,
                        ["formData"] = dataSet.Tables.Count > 0 ? JArray.FromObject(dataSet.Tables[0]) : new JArray(),
                        ["permissions"] = dataSet.Tables.Count > 1 ? JArray.FromObject(dataSet.Tables[1]) : new JArray(),
                        ["recordCount"] = dataSet.Tables.Count > 0 ? dataSet.Tables[0].Rows.Count : 0,
                        ["timestamp"] = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss")
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject
                {
                    ["success"] = false,
                    ["error"] = ex.Message,
                    ["timestamp"] = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss")
                };
            }
        }
    }
}
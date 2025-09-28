using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;

namespace Web_Services.dataAccess
{
    public class loginRepository
    {
        public static string Login(string username, string password)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable users = new DataTable();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("AuthenticateUser", connection);
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.Add(new SqlParameter("@username", SqlDbType.NVarChar)).Value = username;
                    command.Parameters.Add(new SqlParameter("@password", SqlDbType.NVarChar)).Value = password;

                    // پارامتر خروجی برای پیام
                    SqlParameter messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 100)
                    {
                        Direction = ParameterDirection.Output
                    };
                    command.Parameters.Add(messageParam);

                    connection.Open();

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(users);

                    // خواندن پیام خروجی
                    string message = messageParam.Value.ToString();

                    if (users.Rows.Count > 0)
                    {
                        // استخراج اطلاعات کاربر
                        string userId = users.Rows[0]["uid"].ToString();
                        string firstName = users.Rows[0]["fn"].ToString();
                        string lastName = users.Rows[0]["ln"].ToString();
                        string companyId = users.Rows[0]["cId"].ToString();
                        string companyName = users.Rows[0]["cName"].ToString();
                        string unitId = users.Rows[0]["uId"].ToString();
                        string unitName = users.Rows[0]["uName"].ToString();
                        string roleId = users.Rows[0]["rId"].ToString();
                        string roleName = users.Rows[0]["rName"].ToString();
                        string infoUid = users.Rows[0]["infoUid"].ToString();

                        if (userId != "0")
                        {
                            // ست کردن اطلاعات در Session
                            HttpContext.Current.Session["userId"] = userId;
                            HttpContext.Current.Session["firstName"] = firstName;
                            HttpContext.Current.Session["lastName"] = lastName;
                            HttpContext.Current.Session["cId"] = companyId;
                            HttpContext.Current.Session["companyName"] = companyName;
                            HttpContext.Current.Session["uId"] = unitId;
                            HttpContext.Current.Session["unitName"] = unitName;
                            HttpContext.Current.Session["rId"] = roleId;
                            HttpContext.Current.Session["roleName"] = roleName;
                            HttpContext.Current.Session["infoUid"] = infoUid;

                            // بازگرداندن نتیجه موفقیت به صورت JSON
                            return JsonConvert.SerializeObject(new
                            {
                                success = true,
                                message,
                                fullName = firstName + " " + lastName
                            });
                        }
                    }

                    // در صورت نبود اطلاعات معتبر
                    return JsonConvert.SerializeObject(new { success = false, message });
                }
            }
            catch (Exception ex)
            {
                // مدیریت خطا و بازگرداندن پیام خطا
                return JsonConvert.SerializeObject(new { success = false, error = ex.Message });
            }
        }        
        public static JObject apiLogin(string username, string token)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("getApiUserData", connection);
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.Add(new SqlParameter("@Username", SqlDbType.NVarChar)).Value = username;
                    command.Parameters.Add(new SqlParameter("@token", SqlDbType.NVarChar)).Value = token;

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    return new JObject
                    {
                        ["result"] = JArray.FromObject(dataSet.Tables[0])
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject ValidateUserAndToken(string username, string token)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand("getApiUserData", connection);
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add(new SqlParameter("@Username", SqlDbType.NVarChar)).Value = username;
                command.Parameters.Add(new SqlParameter("@Token", SqlDbType.NVarChar)).Value = token;

                connection.Open();
                DataSet dataSet = new DataSet();
                SqlDataAdapter adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

                return new JObject
                {
                    ["result"] = JArray.FromObject(dataSet.Tables[0])
                };
            }
            
        }


    }
}
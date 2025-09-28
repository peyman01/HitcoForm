using Newtonsoft.Json;
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;

namespace HitcoForm.conn
{
    public class signUpRepository
    {
        public static dynamic SignUp(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable users = new DataTable();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("signUp", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@firstName", SqlDbType.NVarChar)).Value = data["firstName"];
                    command.Parameters.Add(new SqlParameter("@lastName", SqlDbType.NVarChar)).Value = data["lastName"];
                    command.Parameters.Add(new SqlParameter("@username", SqlDbType.NVarChar)).Value = data["username"];
                    command.Parameters.Add(new SqlParameter("@email", SqlDbType.NVarChar)).Value = data["email"];
                    command.Parameters.Add(new SqlParameter("@pass", SqlDbType.NVarChar)).Value = data["pass"];

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
                        DataRow userRow = users.Rows[0];

                        HttpContext.Current.Session["username"] = userRow["username"].ToString();
                        HttpContext.Current.Session["firstName"] = userRow["firstName"].ToString();
                        HttpContext.Current.Session["lastName"] = userRow["lastName"].ToString();
                        HttpContext.Current.Session["email"] = userRow["email"].ToString();

                        return JsonConvert.SerializeObject(new
                        {
                            success = true,
                            message,
                            userData = new
                            {
                                username = userRow["username"],
                                firstName = userRow["firstName"],
                                lastName = userRow["lastName"],
                                email = userRow["email"]
                            }
                        });
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
    }
}
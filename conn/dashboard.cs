using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Services.Description;

namespace HitcoForm.conn
{
    public class dashboard
    {

        public static string Actions(string RI)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;


            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetAction", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@RI", SqlDbType.Int)).Value = RI;

                    connection.Open();

                    DataSet actions = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(actions);
                    JArray actionData = JArray.FromObject(actions.Tables[0]);
                    JArray userData = JArray.FromObject(actions.Tables[1]);
                    var data = new JObject
                    {
                        ["success"] = true,
                        ["actionData"] = actionData,
                        ["userData"] = userData
                    };
                    return JsonConvert.SerializeObject(data);
                }
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { success = false, error = ex.Message });
            }
        }

        public static dynamic getDate(string groupName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("getDate", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@groupName", SqlDbType.NVarChar)).Value = groupName;
                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic getStatus(string groupName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("getStatus", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic getForms(string groupName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("getForms", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic getCompanies(string groupName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("getCompanies", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic getUnits(string groupName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    var sp = groupName == "unitC" ? "getUnitsCascade" : "getUnits";
                    SqlCommand cmd = new SqlCommand(sp, conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic getRoles(string groupName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    var sp = groupName == "roleC" ? "getRolesCascade" : "getRoles";
                    SqlCommand cmd = new SqlCommand(sp, conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic getUsers(string company)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("getUsers", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@CompanyId", SqlDbType.NVarChar)).Value = company;
                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic saveFormData(dynamic data, string formName, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {

                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("saveFormData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value =
                         data.ContainsKey("month") ? Convert.ToInt32(data["month"]) : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@season", SqlDbType.Int)).Value =
                        data.ContainsKey("season") ? Convert.ToInt32(data["season"]) : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = Convert.ToInt32(data["year"]);
                    cmd.Parameters.Add(new SqlParameter("@activityDesc", SqlDbType.NVarChar)).Value = data["activityDesc"];
                    cmd.Parameters.Add(new SqlParameter("@urge", SqlDbType.Int)).Value = Convert.ToInt32(data["urgeId"]);

                    cmd.Parameters.Add(new SqlParameter("@userR", SqlDbType.Int)).Value =
                   data.ContainsKey("userRId") && !string.IsNullOrEmpty(data["userRId"]?.ToString())
                   ? Convert.ToInt32(data["userRId"])
                   : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@userA", SqlDbType.Int)).Value =
                     data.ContainsKey("userAId") && !string.IsNullOrEmpty(data["userAId"]?.ToString())
                     ? Convert.ToInt32(data["userAId"])
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@userAd", SqlDbType.NVarChar, 100)).Value =
                      data.ContainsKey("userAdId") && !string.IsNullOrEmpty(data["userAdId"]?.ToString())
                      ? data["userAdId"].ToString()
                      : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@userAw", SqlDbType.NVarChar, 100)).Value =
                   data.ContainsKey("userAwId") && !string.IsNullOrEmpty(data["userAwId"]?.ToString())
                   ? data["userAwId"].ToString()
                   : (object)DBNull.Value;


                    cmd.Parameters.Add(new SqlParameter("@status", SqlDbType.Int)).Value =
                       data.ContainsKey("statusId") && !string.IsNullOrEmpty(data["statusId"]?.ToString())
                       ? Convert.ToInt32(data["statusId"])
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@dayFrom", SqlDbType.Int)).Value = Convert.ToInt32(data["dayFrom"]);
                    cmd.Parameters.Add(new SqlParameter("@dayTo", SqlDbType.Int)).Value = Convert.ToInt32(data["dayTo"]);
                    cmd.Parameters.Add(new SqlParameter("@formName", SqlDbType.NVarChar)).Value = formName;
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = Convert.ToInt32(infoUid);

                    cmd.Parameters.Add(new SqlParameter("@comment", SqlDbType.NVarChar, -1)).Value =
                     data.ContainsKey("comment") && !string.IsNullOrEmpty(data["comment"]?.ToString())
                     ? data["comment"].ToString()
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@parentId", SqlDbType.Int)).Value =
                     data.ContainsKey("parentId") && !string.IsNullOrEmpty(data["parentId"]?.ToString())
                     ? Convert.ToInt32(data["parentId"])
                     : (object)DBNull.Value;
                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic getFormData(dynamic data, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            var response = new JObject { };
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("getFormData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value =
                         data.ContainsKey("month") && !string.IsNullOrEmpty(data["month"]?.ToString())
                            ? Convert.ToInt32(data["month"])
                            : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@season", SqlDbType.Int)).Value =
                         data.ContainsKey("season") && !string.IsNullOrEmpty(data["season"]?.ToString())
                             ? Convert.ToInt32(data["season"])
                             : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = Convert.ToInt32(data["year"]);
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = Convert.ToInt32(infoUid);
                    cmd.Parameters.Add(new SqlParameter("@formName", SqlDbType.NVarChar)).Value = data["formName"];
                    cmd.Parameters.Add(new SqlParameter("@formDataID", SqlDbType.Int)).Value = Convert.ToInt32(data["formDataId"]);


                    conn.Open();
                    DataSet result = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(result);
                    JArray formData = JArray.FromObject(result.Tables[0]);
                    JArray actionData = JArray.FromObject(result.Tables[1]);
                    response = new JObject
                    {
                        ["formData"] = formData,
                        ["actionData"] = actionData
                    };

                }
                return response;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }

        public static dynamic getRowFormData(dynamic data, string formName, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {

                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("editRowFormData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value =
                        data.ContainsKey("month") && !string.IsNullOrEmpty(data["month"]?.ToString())
                           ? Convert.ToInt32(data["month"])
                           : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@season", SqlDbType.Int)).Value =
                         data.ContainsKey("season") && !string.IsNullOrEmpty(data["season"]?.ToString())
                             ? Convert.ToInt32(data["season"])
                             : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = Convert.ToInt32(data["year"]);
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = Convert.ToInt32(infoUid);
                    cmd.Parameters.Add(new SqlParameter("@formName", SqlDbType.NVarChar)).Value = formName;
                    cmd.Parameters.Add(new SqlParameter("@formDataID", SqlDbType.NVarChar)).Value = Convert.ToInt32(data["formDataId"]);

                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static string deleteRowFormData(int formDataId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("deleteRowFormData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@formDataId", SqlDbType.Int)).Value = formDataId;

                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery(); // بررسی تعداد ردیف‌های حذف‌شده

                    if (rowsAffected > 0)
                        return "success";
                    else
                        return "رکوردی برای حذف یافت نشد.";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        public static dynamic UpdateRowFormData(dynamic data, string formName, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {

                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("UpdateRowFormData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@formDataId", SqlDbType.Int)).Value = Convert.ToInt32(data["formDataId"]);
                    cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value =
                         data.ContainsKey("month") ? Convert.ToInt32(data["month"]) : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@season", SqlDbType.Int)).Value =
                        data.ContainsKey("season") ? Convert.ToInt32(data["season"]) : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = Convert.ToInt32(data["year"]);
                    cmd.Parameters.Add(new SqlParameter("@activityDesc", SqlDbType.NVarChar)).Value = data["activityDesc"];
                    cmd.Parameters.Add(new SqlParameter("@urge", SqlDbType.Int)).Value = Convert.ToInt32(data["urgeId"]);

                    cmd.Parameters.Add(new SqlParameter("@userR", SqlDbType.Int)).Value =
                   data.ContainsKey("userRId") && !string.IsNullOrEmpty(data["userRId"]?.ToString())
                   ? Convert.ToInt32(data["userRId"])
                   : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@userA", SqlDbType.Int)).Value =
                     data.ContainsKey("userAId") && !string.IsNullOrEmpty(data["userAId"]?.ToString())
                     ? Convert.ToInt32(data["userAId"])
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@userAd", SqlDbType.NVarChar, 100)).Value =
                     data.ContainsKey("userAdId") && !string.IsNullOrEmpty(data["userAdId"]?.ToString())
                     ? data["userAdId"].ToString()
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@userAw", SqlDbType.NVarChar, 100)).Value =
                     data.ContainsKey("userAwId") && !string.IsNullOrEmpty(data["userAwId"]?.ToString())
                     ? data["userAwId"].ToString()
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@status", SqlDbType.Int)).Value =
                       data.ContainsKey("statusId") && !string.IsNullOrEmpty(data["statusId"]?.ToString())
                       ? Convert.ToInt32(data["statusId"])
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@dayFrom", SqlDbType.Int)).Value = Convert.ToInt32(data["dayFrom"]);
                    cmd.Parameters.Add(new SqlParameter("@dayTo", SqlDbType.Int)).Value = Convert.ToInt32(data["dayTo"]);
                    cmd.Parameters.Add(new SqlParameter("@formName", SqlDbType.NVarChar)).Value = formName;
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = Convert.ToInt32(infoUid);

                    cmd.Parameters.Add(new SqlParameter("@comment", SqlDbType.NVarChar, -1)).Value =
                    data.ContainsKey("comment") && !string.IsNullOrEmpty(data["comment"]?.ToString())
                    ? data["comment"].ToString()
                    : (object)DBNull.Value;


                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic deleteForm25Days(dynamic data, string formName, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            string message = string.Empty;

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("deleteFormData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value = Convert.ToInt32(data["month"]);
                    cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = Convert.ToInt32(data["year"]);
                    cmd.Parameters.Add(new SqlParameter("@formName", SqlDbType.NVarChar)).Value = formName;
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = Convert.ToInt32(infoUid);

                    SqlParameter messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 100)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(messageParam);

                    conn.Open();


                    cmd.ExecuteNonQuery();

                    message = messageParam.Value != DBNull.Value ? messageParam.Value.ToString() : "No message returned";
                }

                return JsonConvert.SerializeObject(new
                {
                    success = true,
                    message = message
                });
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic submitForm(dynamic data, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("submitFormData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value =
                         data.ContainsKey("month") ? Convert.ToInt32(data["month"]) : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@season", SqlDbType.Int)).Value =
                        data.ContainsKey("season") ? Convert.ToInt32(data["season"]) : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = Convert.ToInt32(data["year"]);
                    cmd.Parameters.Add(new SqlParameter("@formName", SqlDbType.NVarChar)).Value = data["formName"];
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = Convert.ToInt32(infoUid);
                    
                    conn.Open();
                    DataSet ds = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(ds);
                    JArray reponse = JArray.FromObject(ds.Tables[0]);
                    return reponse;

                }
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic returnForm(dynamic data, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("returnFormData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value =
                         data.ContainsKey("month") ? Convert.ToInt32(data["month"]) : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@season", SqlDbType.Int)).Value =
                        data.ContainsKey("season") ? Convert.ToInt32(data["season"]) : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = Convert.ToInt32(data["year"]);
                    cmd.Parameters.Add(new SqlParameter("@formName", SqlDbType.NVarChar)).Value = data["formName"];
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = Convert.ToInt32(infoUid);
                    
                    conn.Open();
                    DataSet ds = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(ds);
                    JArray reponse = JArray.FromObject(ds.Tables[0]);
                    return reponse;

                }
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic finalSubmitForm(dynamic data, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("finallSubmitForm", conn);
                    cmd.CommandType = CommandType.StoredProcedure;


                    cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value =
                         data.ContainsKey("month") ? Convert.ToInt32(data["month"]) : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@season", SqlDbType.Int)).Value =
                        data.ContainsKey("season") ? Convert.ToInt32(data["season"]) : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = Convert.ToInt32(data["year"]);
                    cmd.Parameters.Add(new SqlParameter("@formName", SqlDbType.NVarChar)).Value = data["formName"];
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = Convert.ToInt32(infoUid);
                    cmd.Parameters.Add(new SqlParameter("@formDataIds", SqlDbType.NVarChar)).Value = data["formDataIds"];

                    conn.Open();
                    DataSet actions = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(actions);
                    JArray reponse = JArray.FromObject(actions.Tables[0]);
                    return reponse;

                }

            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static string formNotif(string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;


            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("notificationDashboard", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = infoUid;

                    connection.Open();

                    DataSet actions = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(actions);
                    JArray notCompeleteFrom = JArray.FromObject(actions.Tables[0]);
                    JArray latFormCompeleted = JArray.FromObject(actions.Tables[1]);
                    JArray subUserCompleteForm = JArray.FromObject(actions.Tables[2]);
                    var data = new JObject
                    {
                        ["success"] = true,
                        ["notCompeleteFrom"] = notCompeleteFrom,
                        ["latFormCompeleted"] = latFormCompeleted,
                        ["subUserCompleteForm"] = subUserCompleteForm
                    };
                    return JsonConvert.SerializeObject(data);
                }
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { success = false, error = ex.Message });
            }
        }
        public static string SaveProfileImage(int userId, HttpPostedFile postedFile)
        {

            try
            {

                string baseFolderPath = HttpContext.Current.Server.MapPath("~/image/profileImage/");
                string userFolderPath = Path.Combine(baseFolderPath, userId.ToString());


                if (!Directory.Exists(userFolderPath))
                {
                    Directory.CreateDirectory(userFolderPath);
                }


                string originalFileName = Path.GetFileName(postedFile.FileName);

                string filePath = Path.Combine(userFolderPath, originalFileName);


                postedFile.SaveAs(filePath);


                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString))
                {
                    SqlCommand cmd = new SqlCommand("SaveProfileImage", conn);
                    cmd.CommandType = CommandType.StoredProcedure;


                    cmd.Parameters.Add(new SqlParameter("@UserId", SqlDbType.Int)).Value = userId;
                    cmd.Parameters.Add(new SqlParameter("@ImageName", SqlDbType.NVarChar)).Value = originalFileName;

                    conn.Open();
                    cmd.ExecuteNonQuery();
                }

                return JsonConvert.SerializeObject(new { success = true, message = "تصویر پروفایل با موفقیت ذخیره شد." });
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { success = false, message = "خطا در ذخیره تصویر: " + ex.Message });
            }
        }
        public static dynamic getProfile(string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("getProfileData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = infoUid;
                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }


        public static dynamic changeProfile(dynamic data, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            //DataTable date = new DataTable();
            string message = string.Empty;
            try
            {

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("changeProfile", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@email", SqlDbType.NVarChar)).Value =
                        data.ContainsKey("email") && !string.IsNullOrEmpty(data["email"]?.ToString())
                        ? data["email"].ToString()
                        : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@phone", SqlDbType.NVarChar)).Value =
                        data.ContainsKey("phone") && !string.IsNullOrEmpty(data["phone"]?.ToString())
                            ? data["phone"].ToString()
                            : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@lastPass", SqlDbType.NVarChar)).Value =
                        data.ContainsKey("lastPass") && !string.IsNullOrEmpty(data["lastPass"]?.ToString())
                            ? data["lastPass"].ToString()
                            : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@newPass", SqlDbType.NVarChar)).Value =
                        data.ContainsKey("newPass") && !string.IsNullOrEmpty(data["newPass"]?.ToString())
                            ? data["newPass"].ToString()
                            : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = Convert.ToInt32(infoUid);

                    SqlParameter messageParam = new SqlParameter("@result", SqlDbType.NVarChar, 100)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(messageParam);

                    conn.Open();
                    cmd.ExecuteNonQuery();

                    message = messageParam.Value != DBNull.Value ? messageParam.Value.ToString() : "No message returned";

                    //SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    //adapter.Fill(date);
                }

                return JsonConvert.SerializeObject(new
                {
                    success = true,
                    message = message
                });
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }


        public static dynamic getAllFormData(string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("allFormsData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = infoUid;
                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }

        public static dynamic showTblForms(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("getAllDetailsFormData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@formId", SqlDbType.Int)).Value = Convert.ToInt32(data["formId"]);
                    cmd.Parameters.Add(new SqlParameter("@companyId", SqlDbType.Int)).Value = Convert.ToInt32(data["companyId"]);
                    //cmd.Parameters.Add(new SqlParameter("@unitId", SqlDbType.Int)).Value = Convert.ToInt32(data["unitId"]);
                    cmd.Parameters.Add(new SqlParameter("@unitId", SqlDbType.Int)).Value =
                    data.ContainsKey("unitId") && !string.IsNullOrEmpty(data["unitId"]?.ToString())
                        ? Convert.ToInt32(data["unitId"])
                        : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value =
                       data.ContainsKey("month") && !string.IsNullOrEmpty(data["month"]?.ToString())
                          ? Convert.ToInt32(data["month"])
                          : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@season", SqlDbType.Int)).Value =
                         data.ContainsKey("season") && !string.IsNullOrEmpty(data["season"]?.ToString())
                             ? Convert.ToInt32(data["season"])
                             : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = Convert.ToInt32(data["year"]);

                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic changeFormStatus(dynamic data, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("changeFormStatus", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@statusFrom", SqlDbType.NVarChar, 100)).Value = data["statusFrom"];
                    cmd.Parameters.Add(new SqlParameter("@statusTo", SqlDbType.NVarChar, 100)).Value = data["statusTo"];
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = infoUid;
                    cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value =
                       data.ContainsKey("month") && !string.IsNullOrEmpty(data["month"]?.ToString())
                          ? Convert.ToInt32(data["month"])
                          : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@season", SqlDbType.Int)).Value =
                         data.ContainsKey("season") && !string.IsNullOrEmpty(data["season"]?.ToString())
                             ? Convert.ToInt32(data["season"])
                             : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = Convert.ToInt32(data["year"]);



                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic getUserData()
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            //DataTable date = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("getUserData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    //cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = infoUid;

                    conn.Open();
                    DataSet actions = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);

                    adapter.Fill(actions);

                    JArray getUserData = JArray.FromObject(actions.Tables[0]);

                    JArray actionData = JArray.FromObject(actions.Tables[1]);

                    var data = new JObject
                    {
                        ["getUserData"] = getUserData,
                        ["actionData"] = actionData,
                    };
                    return JsonConvert.SerializeObject(data);
                }
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }

        public static dynamic saveUserData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {

                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("saveUserData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@fName", SqlDbType.NVarChar, 100)).Value = data["fName"];
                    cmd.Parameters.Add(new SqlParameter("@lName", SqlDbType.NVarChar, 100)).Value = data["lName"];
                    cmd.Parameters.Add(new SqlParameter("@uName", SqlDbType.NVarChar, 100)).Value = data["uName"];
                    cmd.Parameters.Add(new SqlParameter("@password", SqlDbType.NVarChar, 100)).Value = data["password"];

                    cmd.Parameters.Add(new SqlParameter("@label", SqlDbType.NVarChar, 50)).Value =
                     data.ContainsKey("label") && !string.IsNullOrEmpty(data["label"]?.ToString())
                     ? data["label"].ToString()
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@gender", SqlDbType.NVarChar, 50)).Value =
                         data.ContainsKey("gender") && !string.IsNullOrEmpty(data["gender"]?.ToString())
                         ? data["gender"].ToString()
                         : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@email", SqlDbType.NVarChar, 50)).Value =
                         data.ContainsKey("Email") && !string.IsNullOrEmpty(data["Email"]?.ToString())
                         ? data["Email"].ToString()
                         : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@phone", SqlDbType.NVarChar, 50)).Value =
                         data.ContainsKey("phone") && !string.IsNullOrEmpty(data["phone"]?.ToString())
                         ? data["phone"].ToString()
                         : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@rId", SqlDbType.Int)).Value =
                     data.ContainsKey("rId") && !string.IsNullOrEmpty(data["rId"]?.ToString())
                     ? Convert.ToInt32(data["rId"])
                     : (object)DBNull.Value;


                    cmd.Parameters.Add(new SqlParameter("@uId", SqlDbType.Int)).Value =
                       data.ContainsKey("uId") && !string.IsNullOrEmpty(data["uId"]?.ToString())
                       ? Convert.ToInt32(data["uId"])
                       : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@coId", SqlDbType.Int)).Value =
                       data.ContainsKey("coId") && !string.IsNullOrEmpty(data["coId"]?.ToString())
                       ? Convert.ToInt32(data["coId"])
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@isActived", SqlDbType.Bit)).Value =
                        data.ContainsKey("isActived") && data["isActived"] != null
                         ? Convert.ToBoolean(data["isActived"])
                         : (object)DBNull.Value;

                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }

        public static dynamic updateUserData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable date = new DataTable();
            try
            {

                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("updateUserData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@fName", SqlDbType.NVarChar, 100)).Value = data["fName"];
                    cmd.Parameters.Add(new SqlParameter("@lName", SqlDbType.NVarChar, 100)).Value = data["lName"];
                    cmd.Parameters.Add(new SqlParameter("@uName", SqlDbType.NVarChar, 100)).Value = data["uName"];
                    cmd.Parameters.Add(new SqlParameter("@password", SqlDbType.NVarChar, 100)).Value = data["password"];

                    cmd.Parameters.Add(new SqlParameter("@infoUserId", SqlDbType.Int)).Value = Convert.ToInt32(data["infoUserId"]);

                    cmd.Parameters.Add(new SqlParameter("@label", SqlDbType.NVarChar, 50)).Value =
                         data.ContainsKey("label") && !string.IsNullOrEmpty(data["label"]?.ToString())
                         ? data["label"].ToString()
                         : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@gender", SqlDbType.NVarChar, 50)).Value =
                         data.ContainsKey("gender") && !string.IsNullOrEmpty(data["gender"]?.ToString())
                         ? data["gender"].ToString()
                         : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@email", SqlDbType.NVarChar, 50)).Value =
                         data.ContainsKey("Email") && !string.IsNullOrEmpty(data["Email"]?.ToString())
                         ? data["Email"].ToString()
                         : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@phone", SqlDbType.NVarChar, 50)).Value =
                         data.ContainsKey("phone") && !string.IsNullOrEmpty(data["phone"]?.ToString())
                         ? data["phone"].ToString()
                         : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@rId", SqlDbType.Int)).Value =
                     data.ContainsKey("rId") && !string.IsNullOrEmpty(data["rId"]?.ToString())
                     ? Convert.ToInt32(data["rId"])
                     : (object)DBNull.Value;


                    cmd.Parameters.Add(new SqlParameter("@uId", SqlDbType.Int)).Value =
                       data.ContainsKey("uId") && !string.IsNullOrEmpty(data["uId"]?.ToString())
                       ? Convert.ToInt32(data["uId"])
                       : (object)DBNull.Value;
                    cmd.Parameters.Add(new SqlParameter("@coId", SqlDbType.Int)).Value =
                       data.ContainsKey("coId") && !string.IsNullOrEmpty(data["coId"]?.ToString())
                       ? Convert.ToInt32(data["coId"])
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@isActived", SqlDbType.Bit)).Value =
                        data.ContainsKey("isActived") && data["isActived"] != null
                         ? Convert.ToBoolean(data["isActived"])
                         : (object)DBNull.Value;

                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(date);
                }

                return date;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }

        public static string deleteUserData(int infoUserId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("deleteUserData", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@infoUserId", SqlDbType.Int)).Value = infoUserId;

                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery(); // بررسی تعداد ردیف‌های حذف‌شده

                    if (rowsAffected > 0)
                        return "success";
                    else
                        return "رکوردی برای حذف یافت نشد.";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
       
        public static dynamic getDataAccessBi(string data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            //DataTable date = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("getDataAccessBi", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@userId", SqlDbType.Int)).Value = Convert.ToInt32(data);

                    conn.Open();
                    DataSet actions = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);

                    adapter.Fill(actions);

                    JArray getUserData = JArray.FromObject(actions.Tables[0]);

                    JArray actionData = JArray.FromObject(actions.Tables[1]);

                    var dt = new JObject
                    {
                        ["userSheet"] = getUserData,
                        ["userCompany"] = actionData,
                    };
                    return JsonConvert.SerializeObject(dt);
                }
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
    }

}


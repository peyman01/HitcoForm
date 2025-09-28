using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.Design;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Net.NetworkInformation;
using System.Security.AccessControl;
using System.Threading;
using System.Web.DynamicData;
using System.Web.Http.Results;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.Services.Description;
using System.Web.UI.WebControls;
using System.Xml.Linq;
using Web_Services.controller;
using static System.Collections.Specialized.BitVector32;


namespace Web_Services.DataAccess
{
    public class repository
    {
        public static string updatesIsSeen(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("updatesIsSeen", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@infoUserId", SqlDbType.Int)).Value = data["session"];
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static string saveUserSetting(dynamic data, string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("saveUserSetting", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@infoUserId", SqlDbType.Int)).Value = session;
                    command.Parameters.Add(new SqlParameter("@usersetting", SqlDbType.NVarChar, -1)).Value = JsonConvert.SerializeObject(data);
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static JObject GetReport(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetReport", connection);
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@companyId", data["companyId"]);
                    command.Parameters.AddWithValue("@distId", data["distId"]);
                    command.Parameters.AddWithValue("@brandId", data["brandId"]);
                    command.Parameters.Add("@financePrdtId", data["financePrdtId"]);
                    command.Parameters.AddWithValue("@dateFrom", data["dateFrom"]);
                    command.Parameters.AddWithValue("@dateTo", data["dateTo"]);
                    command.Parameters.AddWithValue("@srcIsDist", data["srcIsDist"]);
                    command.Parameters.AddWithValue("@pageSize", data["pageSize"]);
                    command.Parameters.AddWithValue("@pageNumber", data["pageNumber"]);
                    command.Parameters.AddWithValue("@sortColumn", data["sortColumn"] ?? "itemDate");
                    command.Parameters.AddWithValue("@sortOrder", data["sortOrder"] ?? "DESC");
                    command.Parameters.AddWithValue("@filterCustomerNames", data["filterCustomerNames"] ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@filterProductIds", data["filterProductIds"] ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@filterCompanyIds", data["filterCompanyIds"] ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@filterDistributorIds", data["filterDistributorIds"] ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@filterBrands", data["filterBrands"] ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@filterStateId", data["filterStateId"] ?? (object)DBNull.Value);
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    return new JObject
                    {
                        ["services"] = JArray.FromObject(dataSet.Tables[0]), // Paginated data
                        ["totalRecords"] = JArray.FromObject(dataSet.Tables[1])
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }

        public static string GetDistinctValues(string column)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string query = GetDistinctQuery(column);
                    if (string.IsNullOrEmpty(query)) throw new Exception("Invalid column name");

                    SqlCommand command = new SqlCommand(query, connection);
                    connection.Open();

                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable); // ✅ Fill the DataTable directly
                }

                return JsonConvert.SerializeObject(dataTable); // ✅ Return the full DataTable as JSON
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }


        // ✅ Securely return SQL query based on column request
        private static string GetDistinctQuery(string columnName)
        {
            switch (columnName)
            {
                case "CustomerName":
                    //return "SELECT DISTINCT  s.CustomerName AS CustomerName FROM sales s WHERE s.srcIsDist=1 and s.CustomerName IS NOT NULL ORDER BY s.CustomerName";
                    return "select COALESCE(p.Name,s.CustomerName) As CustomerName  from Sales s left join pharmacies p on s.CustomerGln=p.Gln where  srcIsDist=1 group by COALESCE(p.Name,s.CustomerName)";
                case "CustomerGroupFinance":
                    return "select Name as CustomerGroup from salesOffice sf group by name";
                case "CustomerNameFinance":
                    return "SELECT DISTINCT  s.fullName AS CustomerName FROM customerFinance s  ORDER BY CustomerName";
                case "ProductFinanceName":
                    return "SELECT DISTINCT pf.productId AS value, pf.Name AS name FROM productFinance pf INNER JOIN productMap pm ON pf.financePrdtId = pm.financePrdtId INNER JOIN products p ON pm.distPrdtId = p.productID ORDER BY pf.Name";

                case "companyName_en":
                    return "SELECT DISTINCT c.companyId AS cId, c.companyName_fa AS cName_FA FROM companies c ORDER BY c.companyName_fa";

                case "distributorName":
                    return "SELECT DISTINCT d.distributorId AS id, d.distributorName AS distName_FA FROM distributors d ORDER BY d.distributorName";

                default:
                    return null;
            }
        }

        /// ////////////////////////////////////////////////////////////////////////////////
        public static JObject GetReportFinance(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetReportFinance", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@companyId", data["companyId"]);
                    //command.Parameters.AddWithValue("@distId", data["distId"]);
                    command.Parameters.AddWithValue("@brandId", data["brandId"]);
                    command.Parameters.Add("@financePrdtId", data["financePrdtId"]);
                    command.Parameters.AddWithValue("@dateFrom", data["dateFrom"]);
                    command.Parameters.AddWithValue("@dateTo", data["dateTo"]);
                    command.Parameters.AddWithValue("@srcIsDist", data["srcIsDist"]);
                    command.Parameters.AddWithValue("@pageSize", data["pageSize"]);
                    command.Parameters.AddWithValue("@pageNumber", data["pageNumber"]);
                    command.Parameters.AddWithValue("@sortColumn", data["sortColumn"] ?? "itemDate");
                    command.Parameters.AddWithValue("@sortOrder", data["sortOrder"] ?? "DESC");
                    command.Parameters.AddWithValue("@filterCustomerNames", data["filterCustomerNames"] ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@filterCustomerGroup", data["filterCustomerGroup"] ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@filterProductIds", data["filterProductIds"] ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@filterCompanyIds", data["filterCompanyIds"] ?? (object)DBNull.Value);
                    //command.Parameters.AddWithValue("@filterDistributorIds", data["filterDistributorIds"] ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@filterBrands", data["filterBrands"] ?? (object)DBNull.Value);
                    //command.Parameters.AddWithValue("@filterStateId", data["filterStateId"] ?? (object)DBNull.Value);
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];


                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    return new JObject
                    {
                        ["services"] = JArray.FromObject(dataSet.Tables[0]), // Paginated data
                        ["totalRecords"] = JArray.FromObject(dataSet.Tables[1])
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetReportFull(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetReportFull", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.Int)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];


                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray services = JArray.FromObject(dataSet.Tables[0]);
                    return new JObject
                    {
                        ["services"] = services,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetReportFullFinance(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetReportFullFinance", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    //command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.Int)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];


                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray services = JArray.FromObject(dataSet.Tables[0]);
                    return new JObject
                    {
                        ["services"] = services,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static string GetCustomers(string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetCustomers", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    //command.Parameters.Add(new SqlParameter("@partyId", SqlDbType.Int)).Value = id;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = session;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static string GetBrands(int id, string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetBrands", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.Int)).Value = id;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = session;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }

        public static string GetNotifs()
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetNotifs", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static string GetCitites()
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetCitites", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static string GetUserSettings(string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetUserSettings", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@infoUserId", SqlDbType.Int)).Value = session;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }

        }

        public static string GetCompanies(int id, string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetCompanies", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.Int)).Value = id;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = session;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static string GetDistributors(int id, string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetDistributors", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@distributorId", SqlDbType.Int)).Value = id;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = session;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static string GetCompanyProductFinanace(int companyId, string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetCompanyProductFinanace", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = session;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.Int)).Value = companyId;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static string GetServiceLog(dynamic data, string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetServiceLog", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = session;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static string GetServiceLogDetail(dynamic data, string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetServiceLogDetail", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = session;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.Int)).Value = data["cId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.Int)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@logId", SqlDbType.Int)).Value = data["logId"];
                    command.Parameters.Add(new SqlParameter("@serviceType", SqlDbType.Int)).Value = data["serviceType"];
                    command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.Int)).Value = data["srcIsDist"];
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static string GetLinkedProductFinanace(dynamic data, string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetLinkedProductFinanace", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = session;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static string updateProductFinancePrice(dynamic data, string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("updateProductFinancePrice", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = session;
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.Int)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@p1", SqlDbType.Int)).Value = data["p1"];
                    command.Parameters.Add(new SqlParameter("@p2", SqlDbType.Int)).Value = data["p2"];
                    command.Parameters.Add(new SqlParameter("@p3", SqlDbType.Int)).Value = data["p3"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.Int)).Value = data["brandId"];

                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static string getProductFinancePriceLog(dynamic data, string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("getProductFinancePriceLog", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = session;
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.Int)).Value = data["financePrdtId"];
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static JObject GetProformaProductTemp(dynamic data, string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("getProductTemp", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = session;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray tempProducts = JArray.FromObject(dataSet.Tables[0]);
                    JArray fncProducts = JArray.FromObject(dataSet.Tables[1]);

                    return new JObject
                    {
                        ["tempProducts"] = tempProducts,
                        ["fncProducts"] = fncProducts,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetCompanyProductDist(dynamic data, string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetCompanyProductDist", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = session;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray distProducts = JArray.FromObject(dataSet.Tables[0]);
                    JArray fncProducts = JArray.FromObject(dataSet.Tables[1]);

                    return new JObject
                    {
                        ["distProducts"] = distProducts,
                        ["fncProducts"] = fncProducts,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        //check access
        public static string updateProductBrand(int brandId, int productId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("updateProductBrand", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.Int)).Value = brandId;
                    command.Parameters.Add(new SqlParameter("@productId", SqlDbType.Int)).Value = productId;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static string updateProductFinanceDist(int fprId, int dprId, decimal ratio)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("UpdateProductMap", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.Int)).Value = fprId;
                    command.Parameters.Add(new SqlParameter("@distPrdtId", SqlDbType.Int)).Value = dprId;
                    command.Parameters.Add(new SqlParameter("@ratio", SqlDbType.Decimal)).Value = ratio;
                    //var param = new SqlParameter("@ratio", SqlDbType.Decimal)
                    //{
                    //    Precision = 10,  // چند رقم کل
                    //    Scale = 3,       // چند رقم اعشار
                    //    Value = ratio
                    //};
                    //command.Parameters.Add(param);

                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static string updateProductTemp(int fprId, int pfPrdId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("[updateProformaProductMap]", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.Int)).Value = fprId;
                    command.Parameters.Add(new SqlParameter("@pFncProductId", SqlDbType.Int)).Value = pfPrdId;
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        //cjheck access

        public static string GetProducts(string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetProducts", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = session;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static JObject GetUserTabsAndSheets(string session)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("getUserTabsAndSheets", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = session;
                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray tabs = JArray.FromObject(dataSet.Tables[0]);
                    JArray sheets = JArray.FromObject(dataSet.Tables[1]);

                    return new JObject
                    {
                        ["tabs"] = tabs,
                        ["sheets"] = sheets
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }

        }
        public static string GetMonths(int id)
        {

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select monthNo value,monthName name from months order by monthNo";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static JObject GetMonthlySalesByDistributor(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetMonthlySalesByDistributor", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray monthlySalesByDistributor = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["monthlySalesByDistributor"] = monthlySalesByDistributor,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetMonthlySalesByCompany(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetMonthlySalesByCompany", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];
                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray monthlySalesByDistributor = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["monthlySalesByCompany"] = monthlySalesByDistributor,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static List<Dictionary<string, object>> DataTableToList(DataTable dt)
        {
            var list = new List<Dictionary<string, object>>();
            foreach (DataRow row in dt.Rows)
            {
                var dict = new Dictionary<string, object>();
                foreach (DataColumn col in dt.Columns)
                {
                    dict[col.ColumnName] = row[col];
                }
                list.Add(dict);
            }
            return list;
        }


        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static JObject rateSaleStock(dynamic data)
        {

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("CalculateSalesStockRate", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = (string)data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@today", SqlDbType.NVarChar, 8)).Value = (string)data["today"];
                    command.Parameters.Add(new SqlParameter("@date_limit", SqlDbType.NVarChar, 8)).Value = (string)data["date_limit"];
                    //command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.Int)).Value = Convert.ToInt32(data["financePrdtId"]);

                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];


                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = (string)data["dateFrom"];
                    //command.Parameters.Add(new SqlParameter("@CurrentStockDate", SqlDbType.NVarChar, 8)).Value = (string)data["currentStockDate"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = Convert.ToInt32(data["session"]);
                    command.Parameters.Add(new SqlParameter("@cityCode", SqlDbType.Int)).Value = Convert.ToInt32(data["branchCode"]);
                    command.Parameters.Add(new SqlParameter("@interval", SqlDbType.Int)).Value = Convert.ToInt32(data["interval"]);
                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray SalesStockRate = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["SalesStockRate"] = SalesStockRate,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }



        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static JObject getExpiryDateStock(dynamic data)
        {

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetExpiredProductsByDate", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@date_limit", SqlDbType.NVarChar, 8)).Value = (string)data["date_limit"];
                    command.Parameters.Add(new SqlParameter("@today", SqlDbType.NVarChar, 8)).Value = (string)data["today"];
                    command.Parameters.Add(new SqlParameter("@max_expiry_date", SqlDbType.NVarChar, 8)).Value = (string)data["max_expiry_date"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];


                    //command.Parameters.Add(new SqlParameter("@CurrentStockDate", SqlDbType.NVarChar, 8)).Value = (string)data["currentStockDate"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = Convert.ToInt32(data["session"]);
                    command.Parameters.Add(new SqlParameter("@cityCode", SqlDbType.Int)).Value = Convert.ToInt32(data["branchCode"]);

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray ExpiryDateStock = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["ExpiryDateStock"] = ExpiryDateStock,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }


        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static JObject GetCustomerStateMap(dynamic data)
        {

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetCustomerStateMap1", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.Int)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.Int)).Value = data["distId"];

                    command.Parameters.Add(new SqlParameter("@breakdownType", SqlDbType.Int)).Value = data["breakdownType"];
                    command.Parameters.Add(new SqlParameter("@reportType", SqlDbType.Int)).Value = data["reportType"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.Int)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@month", SqlDbType.NVarChar, 200)).Value = string.Join(",", data["month"]);
                    command.Parameters.Add(new SqlParameter("@year", SqlDbType.NVarChar, 200)).Value = string.Join(",", data["year"]);

                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.Int)).Value = Convert.ToInt32(data["financePrdtId"]);
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = Convert.ToInt32(data["session"]);

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray customerState = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["customerState"] = customerState,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }


        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static JObject GetTrendingProducts(dynamic data)
        {

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetTrendingProducts", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.Int)).Value = data["companyId"];

                    command.Parameters.Add(new SqlParameter("@FilterType", SqlDbType.Int)).Value = data["filterType"];


                    command.Parameters.Add(new SqlParameter("@month", SqlDbType.NVarChar, 8)).Value = data["month"];
                    command.Parameters.Add(new SqlParameter("@year", SqlDbType.NVarChar, 8)).Value = data["year"];

                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = Convert.ToInt32(data["session"]);

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray trendingProducts = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["trendingProducts"] = trendingProducts,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject usp_InsertOrUpdate_TargetHeader(dynamic data)
        {

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("usp_InsertOrUpdate_TargetHeader", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@TotalTargetValue", SqlDbType.BigInt)).Value = Convert.ToInt64(data["totalTargetValue"]);

                    // command.Parameters.Add(new SqlParameter("@TargetID", SqlDbType.Int)).Value = data["targetID"];
                    // command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.Int)).Value = Convert.ToInt32(data["cid"]);
                    //command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.Int)).Value = Convert.ToInt32(data["bId"]);

                    command.Parameters.Add(new SqlParameter("@fprdtId", SqlDbType.Int)).Value = Convert.ToInt32(data["pid"]);
                    command.Parameters.Add(new SqlParameter("@TargetYear", SqlDbType.Int)).Value = Convert.ToInt32(data["targetYear"]);

                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = Convert.ToInt32(data["session"]);

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray InsertOrUpdate_TargetHeader = JArray.FromObject(dataSet.Tables[0]);


                    return new JObject
                    {
                        ["InsertOrUpdate_TargetHeader"] = InsertOrUpdate_TargetHeader,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }

        public static string usp_Save_TargetProvinceDistribution(dynamic data, string session)
        {
            var success = "1";
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            // Serialize the data into a JSON string
            string jsonString = JsonConvert.SerializeObject(data);

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("usp_Save_TargetProvinceDistribution1", connection);
                    command.CommandType = CommandType.StoredProcedure;

                    // Add the JSON string as a parameter
                    command.Parameters.Add(new SqlParameter("@JsonData", SqlDbType.NVarChar)).Value = jsonString;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = Convert.ToInt32(session);
                    command.CommandTimeout = 0;
                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                success = "0";
            }

            return success;
        }

        public static string usp_Save_TargetDistributorDistribution(dynamic data, string session)
        {
            var success = "1";
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            string jsonString = JsonConvert.SerializeObject(data);
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("usp_Save_TargetDistributorDistribution", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@JsonData", SqlDbType.NVarChar)).Value = jsonString;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = Convert.ToInt32(session);
                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    //JArray InsertOrUpdate_TargetDistributor = JArray.FromObject(dataSet.Tables[0]);



                }
            }
            catch (Exception ex)
            {
                success = "0";
            }

            return success;
        }
        public static string usp_Save_TargetMonthDistribution(dynamic data, string session)
        {

            var success = "1";
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            string jsonString = JsonConvert.SerializeObject(data);
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("usp_Save_TargetMonthDistribution", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@JsonData", SqlDbType.NVarChar)).Value = jsonString;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = Convert.ToInt32(session);
                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                }
            }
            catch (Exception ex)
            {
                success = "0";
            }

            return success;
            //////////////////////////////////////

        }
        public static JObject usp_Save_TargetProductDistribution(dynamic data)
        {

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("usp_Save_TargetProductDistribution", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Percentage", SqlDbType.Float)).Value = Math.Round(Convert.ToDouble(data["percentage"]), 1);

                    command.Parameters.Add(new SqlParameter("@TargetID", SqlDbType.Int)).Value = data["targetID"];
                    command.Parameters.Add(new SqlParameter("@fprdId", SqlDbType.Int)).Value = Convert.ToInt32(data["fprdId"]);


                    // command.Parameters.Add(new SqlParameter("@TargetYear", SqlDbType.Int)).Value = Convert.ToInt32(data["targetYear"]);

                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = Convert.ToInt32(data["session"]);

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray InsertOrUpdate_TargetProduct = JArray.FromObject(dataSet.Tables[0]);


                    return new JObject
                    {
                        ["InsertOrUpdate_TargetProduct"] = InsertOrUpdate_TargetProduct,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject getTargetData(dynamic data)
        {

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("getTargetData", connection);
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.Int)).Value = Convert.ToInt32(data["cid"]);
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.Int)).Value = Convert.ToInt32(data["bId"]);
                    command.Parameters.Add(new SqlParameter("@TargetYear", SqlDbType.Int)).Value = Convert.ToInt32(data["curYear"]);

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray targetHeaderData = JArray.FromObject(dataSet.Tables[0]);
                    JArray targetMonthData = JArray.FromObject(dataSet.Tables[1]);
                    JArray targetDistData = JArray.FromObject(dataSet.Tables[2]);
                    JArray targetProvinceData = JArray.FromObject(dataSet.Tables[3]);
                    JArray targetPrdData = JArray.FromObject(dataSet.Tables[4]);


                    return new JObject
                    {
                        ["targetHeaderData"] = targetHeaderData,
                        ["targetMonthData"] = targetMonthData,
                        ["targetDistData"] = targetDistData,
                        ["targetProvinceData"] = targetProvinceData,
                        ["targetPrdData"] = targetPrdData
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        /*  public static JObject getTargetGridData(dynamic data)
         {

              string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

             try
            {
                  using (SqlConnection connection = new SqlConnection(connectionString))
                  {
                      SqlCommand command = new SqlCommand("getTargetGridData", connection);
                      command.CommandType = CommandType.StoredProcedure;

                      //command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.Int)).Value = Convert.ToInt32(data["companyId"]);
                      //command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.Int)).Value = Convert.ToInt32(data["brandId"]);
                      command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = Convert.ToInt32(data["session"]);

                      connection.Open();
                      DataSet dataSet = new DataSet();
                      SqlDataAdapter adapter = new SqlDataAdapter(command);
                      adapter.Fill(dataSet);
                      JArray targetGridData = JArray.FromObject(dataSet.Tables[0]);



                      return new JObject
                      {
                          ["targetGridData"] = targetGridData
                      };
                  }
              }
              catch (Exception ex)
              {
                  return new JObject { ["error"] = ex.Message };
              }
          }*/

        public static JObject getTargetGridInitialData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("getTargetGridInitialData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];
                    command.Parameters.Add(new SqlParameter("@targetYear", SqlDbType.Int)).Value = data["curTargetYear"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray getTargetGridInitialData = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["getTargetGridInitialData"] = getTargetGridInitialData
                    };


                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject targetBrandLevelData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("targetBrandLevelData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@targetYear", SqlDbType.Int)).Value = data["targetYear"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray targetBrandLevelData = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["targetBrandLevelData"] = targetBrandLevelData
                    };


                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject targetBrandDistLevelData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("targetBrandDistLevelData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@targetYear", SqlDbType.Int)).Value = data["targetYear"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray targetBrandDistLevelData = JArray.FromObject(dataSet.Tables[0]);
                    JArray targetBrandDistLevelDataAmount = JArray.FromObject(dataSet.Tables[1]);

                    return new JObject
                    {
                        ["targetBrandDistLevelData"] = targetBrandDistLevelData,
                        ["targetBrandDistLevelDataAmount"] = targetBrandDistLevelDataAmount
                    };


                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject targetBrandMonthLevelData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("targetBrandMonthLevelData", connection);
                    // SqlCommand command = new SqlCommand("targetBrandMonthLevelData2", connection); bakhshi
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@targetYear", SqlDbType.Int)).Value = data["targetYear"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray targetBrandMonthLevelData = JArray.FromObject(dataSet.Tables[0]);
                    JArray targetBrandMonthLevelDataAmount = JArray.FromObject(dataSet.Tables[1]);

                    return new JObject
                    {
                        ["targetBrandMonthLevelData"] = targetBrandMonthLevelData,
                        ["targetBrandMonthLevelDataAmount"] = targetBrandMonthLevelDataAmount
                    };

                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject targetBrandMonthLevelDataUserView(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("targetBrandMonthLevelData2", connection);
                    // SqlCommand command = new SqlCommand("targetBrandMonthLevelData2", connection); bakhshi
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@targetYear", SqlDbType.Int)).Value = data["targetYear"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray targetBrandMonthLevelData = JArray.FromObject(dataSet.Tables[0]);
                    JArray targetBrandMonthLevelDataAmount = JArray.FromObject(dataSet.Tables[1]);

                    return new JObject
                    {
                        ["targetBrandMonthLevelData"] = targetBrandMonthLevelData,
                        ["targetBrandMonthLevelDataAmount"] = targetBrandMonthLevelDataAmount
                    };

                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject targetBrandStateLevelData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("targetBrandStateLevelData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@targetYear", SqlDbType.Int)).Value = data["targetYear"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray targetBrandStateLevelData = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["targetBrandStateLevelData"] = targetBrandStateLevelData
                    };

                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject targetBrandProductLevelData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("targetBrandProductLevelData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@targetYear", SqlDbType.Int)).Value = data["targetYear"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray targetBrandProductLevelData = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["targetBrandProductLevelData"] = targetBrandProductLevelData
                    };


                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject targetBrandDistProductLevelData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("targetBrandDistProductLevelData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@targetYear", SqlDbType.Int)).Value = data["targetYear"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray targetBrandDistProductLevelData = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["targetBrandDistProductLevelData"] = targetBrandDistProductLevelData
                    };


                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject targetBrandMonthProductLevelData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("targetBrandMonthProductLevelData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@targetYear", SqlDbType.Int)).Value = data["targetYear"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray targetBrandMonthProductLevelData = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["targetBrandMonthProductLevelData"] = targetBrandMonthProductLevelData
                    };


                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject targetBrandStateProductLevelData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("targetBrandStateProductLevelData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@targetYear", SqlDbType.Int)).Value = data["targetYear"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray targetBrandStateProductLevelData = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["targetBrandStateProductLevelData"] = targetBrandStateProductLevelData
                    };


                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }


        public static JObject GetMonthlySalesByCompanyFinance(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetMonthlySalesByCompanyFinance", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.Int)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];
                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray monthlySalesByDistributorFinance = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["monthlySalesByCompanyFinance"] = monthlySalesByDistributorFinance,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetMonthlySalesByBrand(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetMonthlySalesByBrand", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray monthlySalesByDistributor = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["monthlySalesByBrand"] = monthlySalesByDistributor,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetMonthlySalesByBrandFinance(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetMonthlySalesByBrandFinance", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.Int)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray monthlySalesByDistributorFinance = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["monthlySalesByBrandFinance"] = monthlySalesByDistributorFinance,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetCustomerAnalyzeData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetCustomerAnalyzeData1", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 10)).Value = ConvertShamsiToMiladi(Convert.ToString(data["dateTo"]));
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 10)).Value = ConvertShamsiToMiladi(Convert.ToString(data["dateFrom"]));
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];
                    command.Parameters.Add(new SqlParameter("@partyId", SqlDbType.NVarChar, 500)).Value = data["partyId"];

                    //command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    ////command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.Int)).Value = data["srcIsDist"];
                    //command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    //command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray invoiceData = JArray.FromObject(dataSet.Tables[0]);
                    JArray paymentData = JArray.FromObject(dataSet.Tables[1]);
                    JArray receivableNote = JArray.FromObject(dataSet.Tables[2]);
                    JArray ChequeTimeBreakdown = JArray.FromObject(dataSet.Tables[3]);
                    //JArray distTargetSummary = JArray.FromObject(dataSet.Tables[2]);

                    return new JObject
                    {
                        ["invoiceData"] = invoiceData,
                        ["paymentData"] = paymentData,
                        ["receivableNote"] = receivableNote,
                        ["ChequeTimeBreakdown"] = ChequeTimeBreakdown
                        //["distTargetSummary"] = distTargetSummary
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetInvoiceBreakDownData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetInvoiceBreakDownData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 10)).Value = ConvertShamsiToMiladi(Convert.ToString(data["dateTo"]));
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 10)).Value = ConvertShamsiToMiladi(Convert.ToString(data["dateFrom"]));
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];
                    command.Parameters.Add(new SqlParameter("@partyId", SqlDbType.NVarChar, 500)).Value = data["partyId"];


                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray InvoiceBreakDownData = JArray.FromObject(dataSet.Tables[0]);



                    return new JObject
                    {
                        ["InvoiceBreakDownData"] = InvoiceBreakDownData

                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetPaymentTimeBreakDownData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetPaymentTimeBreakDownData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 10)).Value = ConvertShamsiToMiladi(Convert.ToString(data["dateTo"]));
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 10)).Value = ConvertShamsiToMiladi(Convert.ToString(data["dateFrom"]));
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];
                    command.Parameters.Add(new SqlParameter("@partyId", SqlDbType.NVarChar, 500)).Value = data["partyId"];


                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray PaymentTimeBreakDownData = JArray.FromObject(dataSet.Tables[0]);



                    return new JObject
                    {
                        ["PaymentTimeBreakDownData"] = PaymentTimeBreakDownData

                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetPayableGridData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetPayableGridData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 10)).Value = ConvertShamsiToMiladi(Convert.ToString(data["dateTo"]));
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 10)).Value = ConvertShamsiToMiladi(Convert.ToString(data["dateFrom"]));
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];
                    command.Parameters.Add(new SqlParameter("@partyId", SqlDbType.NVarChar, 500)).Value = data["partyId"];

                    //command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    ////command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.Int)).Value = data["srcIsDist"];
                    //command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    //command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray payableNote = JArray.FromObject(dataSet.Tables[0]);
                    JArray paymentVoucher = JArray.FromObject(dataSet.Tables[1]);

                    //JArray distTargetSummary = JArray.FromObject(dataSet.Tables[2]);

                    return new JObject
                    {
                        ["payableNote"] = payableNote,
                        ["paymentVoucher"] = paymentVoucher

                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject getInvoiceItems(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetInvoiceItems", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];
                    command.Parameters.Add(new SqlParameter("@isReturned", SqlDbType.NVarChar, 500)).Value = data["isReturned"];
                    command.Parameters.Add(new SqlParameter("@invoiceId", SqlDbType.NVarChar, 500)).Value = data["invoiceId"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray invoiceItemData = JArray.FromObject(dataSet.Tables[0]);


                    return new JObject
                    {
                        ["invoiceItemData"] = invoiceItemData

                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetChequeTimeBreakdownDetails(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetChequeTimeBreakdownDetails", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];
                    command.Parameters.Add(new SqlParameter("@partyId", SqlDbType.NVarChar, 500)).Value = data["partyId"];
                    command.Parameters.Add(new SqlParameter("@timeLabel", SqlDbType.NVarChar, 500)).Value = data["timeLabel"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray ChequeTimeBreakdownDetails = JArray.FromObject(dataSet.Tables[0]);


                    return new JObject
                    {
                        ["ChequeTimeBreakdownDetails"] = ChequeTimeBreakdownDetails

                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetPaymentTimeBreakdownDetails(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetPaymentTimeBreakdownDetails", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];
                    command.Parameters.Add(new SqlParameter("@partyId", SqlDbType.NVarChar, 500)).Value = data["partyId"];
                    command.Parameters.Add(new SqlParameter("@timeLabel", SqlDbType.NVarChar, 500)).Value = data["timeLabel"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray PaymentTimeBreakdownDetails = JArray.FromObject(dataSet.Tables[0]);


                    return new JObject
                    {
                        ["PaymentTimeBreakdownDetails"] = PaymentTimeBreakdownDetails

                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetInvoiceBreakdownDetails(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetInvoiceBreakdownDetails", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];
                    command.Parameters.Add(new SqlParameter("@partyId", SqlDbType.NVarChar, 500)).Value = data["partyId"];
                    command.Parameters.Add(new SqlParameter("@timeLabel", SqlDbType.NVarChar, 500)).Value = data["timeLabel"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray InvoiceBreakdownDetails = JArray.FromObject(dataSet.Tables[0]);


                    return new JObject
                    {
                        ["InvoiceBreakdownDetails"] = InvoiceBreakdownDetails

                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetReceivableDetailsByType(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetReceivableDetailsByType", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];
                    command.Parameters.Add(new SqlParameter("@partyId", SqlDbType.NVarChar, 500)).Value = data["partyId"];
                    command.Parameters.Add(new SqlParameter("@detailType", SqlDbType.NVarChar, 500)).Value = data["timeLabel"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray ReceivableDetailsByType = JArray.FromObject(dataSet.Tables[0]);


                    return new JObject
                    {
                        ["ReceivableDetailsByType"] = ReceivableDetailsByType

                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetDistSaleSummary(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetDistSaleSummary", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];

                    //command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.Int)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray distSalesSummary = JArray.FromObject(dataSet.Tables[0]);
                    JArray distStockSummary = JArray.FromObject(dataSet.Tables[1]);
                    JArray distTargetSummary = JArray.FromObject(dataSet.Tables[2]);

                    return new JObject
                    {
                        ["distSalesSummary"] = distSalesSummary,
                        ["distStockSummary"] = distStockSummary,
                        ["distTargetSummary"] = distTargetSummary
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetBrandSalesSummary(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetBrandSalesSummary", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distID", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray brandSalesSummary = JArray.FromObject(dataSet.Tables[0]);
                    JArray brandStockSummary = JArray.FromObject(dataSet.Tables[1]);
                    JArray brandTargetSummary = JArray.FromObject(dataSet.Tables[2]);

                    return new JObject
                    {
                        ["brandSalesSummary"] = brandSalesSummary,
                        ["brandStockSummary"] = brandStockSummary,
                        ["brandTargetSummary"] = brandTargetSummary
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetDebitDashboardData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetDebitDashboardData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];


                    //command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    //command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    //command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    //command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    //command.Parameters.Add(new SqlParameter("@SalesOfficeID", SqlDbType.Int)).Value = data["SalesOfficeID"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray debitDashboardData = JArray.FromObject(dataSet.Tables[0]);
                    JArray ChequeStatusData = JArray.FromObject(dataSet.Tables[1]);

                    return new JObject
                    {
                        ["debitDashboardData"] = debitDashboardData,
                        ["ChequeStatusData"] = ChequeStatusData
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetDebitData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetDebitData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];


                    //command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    //command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    //command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    //command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    //command.Parameters.Add(new SqlParameter("@SalesOfficeID", SqlDbType.Int)).Value = data["SalesOfficeID"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray debitData = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["debitData"] = debitData,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetBrandSalesSummaryFinance(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetBrandSalesSummaryFinance", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    //command.Parameters.Add(new SqlParameter("@distID", SqlDbType.Int)).Value = data["distId"];
                    //command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.Int)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];
                    command.Parameters.Add(new SqlParameter("@SalesOfficeID", SqlDbType.Int)).Value = data["SalesOfficeID"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray brandSalesSummary = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["brandSalesSummary"] = brandSalesSummary,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetOfficeSalesSummaryFinance(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetOfficeSalesSummaryFinance", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    //command.Parameters.Add(new SqlParameter("@distID", SqlDbType.Int)).Value = data["distId"];
                    //command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.Int)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray officeSalesSummary = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["officeSalesSummary"] = officeSalesSummary,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetProductSalesSummary(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetProductSalesSummary", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    //command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.Int)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray productSalesSummary = JArray.FromObject(dataSet.Tables[0]);
                    JArray productStockSummary = JArray.FromObject(dataSet.Tables[1]);
                    JArray productTargetSummary = JArray.FromObject(dataSet.Tables[2]);

                    return new JObject
                    {
                        ["productSalesSummary"] = productSalesSummary,
                        ["productStockSummary"] = productStockSummary,
                        ["productTargetSummary"] = productTargetSummary
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetStateSalesSummary(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetStateSalesSummary", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distID", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    //command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.Int)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray stateSalesSummary = JArray.FromObject(dataSet.Tables[0]);
                    JArray stateStockSummary = JArray.FromObject(dataSet.Tables[1]);

                    return new JObject
                    {
                        ["stateSalesSummary"] = stateSalesSummary,
                        ["stateStockSummary"] = stateStockSummary
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetProductSalesSummaryFinance(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetProductSalesSummaryFinance", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];
                    command.Parameters.Add(new SqlParameter("@SalesOfficeID", SqlDbType.Int)).Value = data["SalesOfficeID"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray productSalesSummary = JArray.FromObject(dataSet.Tables[0]);
                    //JArray productStockSummary = JArray.FromObject(dataSet.Tables[1]);

                    return new JObject
                    {
                        ["productSalesSummary"] = productSalesSummary
                        //["productStockSummary"] = productStockSummary,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetStoreSaleSummaryFinance(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetStoreSaleSummaryFinance", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray storeSaleSummary = JArray.FromObject(dataSet.Tables[0]);
                    //JArray productStockSummary = JArray.FromObject(dataSet.Tables[1]);

                    return new JObject
                    {
                        ["storeSaleSummary "] = storeSaleSummary
                        //["productStockSummary"] = productStockSummary,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }


        public static JObject GetPivotData(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetPivotData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.NVarChar, 500)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray result = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["result"] = result,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetPivotDataStock(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetPivotDataStock", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];


                    command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.NVarChar, 500)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray result = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["result"] = result,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetPivotDataSaleStock(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetPivotDataSaleStock", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];

                    command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.NVarChar, 500)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray result = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["result"] = result,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetPivotDataFinance(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetPivotDataFinance", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.NVarChar, 500)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray result = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["result"] = result,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject GetPivotDataTarget(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("GetPivotDataTarget2", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.NVarChar, 500)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray result = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["result"] = result,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject DynamicPivot(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("DynamicPivot", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@distId", SqlDbType.NVarChar, 200)).Value = data["distId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@select", SqlDbType.NVarChar, 500)).Value = data["select"];
                    command.Parameters.Add(new SqlParameter("@group", SqlDbType.NVarChar, 500)).Value = data["group"];
                    command.Parameters.Add(new SqlParameter("@order", SqlDbType.NVarChar, 500)).Value = data["order"];
                    command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.NVarChar, 500)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray result = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["result"] = result,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }
        public static JObject DynamicPivotFinance(dynamic data)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("DynamicPivotFinance", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar, 200)).Value = data["companyId"];
                    command.Parameters.Add(new SqlParameter("@brandId", SqlDbType.NVarChar, 200)).Value = data["brandId"];
                    command.Parameters.Add(new SqlParameter("@financePrdtId", SqlDbType.NVarChar, 200)).Value = data["financePrdtId"];
                    command.Parameters.Add(new SqlParameter("@dateFrom", SqlDbType.NVarChar, 8)).Value = data["dateFrom"];
                    command.Parameters.Add(new SqlParameter("@dateTo", SqlDbType.NVarChar, 8)).Value = data["dateTo"];
                    command.Parameters.Add(new SqlParameter("@select", SqlDbType.NVarChar, 500)).Value = data["select"];
                    command.Parameters.Add(new SqlParameter("@group", SqlDbType.NVarChar, 500)).Value = data["group"];
                    command.Parameters.Add(new SqlParameter("@order", SqlDbType.NVarChar, 500)).Value = data["order"];
                    command.Parameters.Add(new SqlParameter("@srcIsDist", SqlDbType.NVarChar, 500)).Value = data["srcIsDist"];
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value = data["session"];

                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);
                    JArray result = JArray.FromObject(dataSet.Tables[0]);

                    return new JObject
                    {
                        ["result"] = result,
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }
        }


        /////////////////////////////////////////////////////////////////////  sale  //////////////////////////////////////
        public static void saveSale(dynamic dataArray, int distId, int companyId, int logId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            if (dataArray != null)
            {

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    var uniqueDates = ((IEnumerable<dynamic>)dataArray)
                                        .Select(item => item["year"]?.ToString() + item["month"]?.ToString() + item["day"]?.ToString())  // Concatenate date
                                        .Distinct()  // Ensure uniqueness
                                        .OrderBy(d => d)  // Sort the dates
                                        .ToArray();
                    var dateList = string.Join(",", uniqueDates);
                    //var uniqueDates = ((IEnumerable<dynamic>)dataArray)
                    //.Select(item => new
                    //{
                    //    Year = item["year"]?.ToString(),
                    //    Month = item["month"]?.ToString(),
                    //    Day = item["day"]?.ToString()
                    //})
                    //.Distinct().OrderBy(d => $"{d.Year}{d.Month}{d.Day}");
                    //var dateList = string.Join(",", uniqueDates
                    //.Select(d => $"{d.Year}{d.Month}{d.Day}"));
                    string updateQuery = $@"
                        UPDATE sales WITH (ROWLOCK, UPDLOCK)
                        SET beDeleted = 1 
                        WHERE distId = @DistId 
                        AND companyId = @CompanyId 
                        AND concat(year, month, day) IN ({dateList})";
                    if (uniqueDates.Length > 0)
                    {
                        using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
                        {
                            cmd.Parameters.AddWithValue("@DistId", distId);
                            cmd.Parameters.AddWithValue("@CompanyId", companyId);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    foreach (var item in dataArray)
                    {
                        using (SqlCommand cmd = new SqlCommand("InsertSalesData", conn))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@DistId", distId);
                            cmd.Parameters.AddWithValue("@CompanyId", companyId);

                            cmd.Parameters.AddWithValue("@BranchCode", item["BranchCode"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@BranchName", item["BranchName"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@CustomerCode", item["CustomerCode"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@CustomerName", item["CustomerName"]?.ToString() ?? "");

                            cmd.Parameters.AddWithValue("@SaleType", item["SaleType"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@BillNo", item["BillNo"]?.ToString() ?? "");

                            cmd.Parameters.AddWithValue("@GoodsCode", item["GoodsCode"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@GoodsName", item["GoodsName"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@SaleAmount", item["SaleAmount"] != null ? Convert.ToDecimal(item["SaleAmount"]) : 0);

                            cmd.Parameters.AddWithValue("@GoodsPrice", item["GoodsPrice"] != null ? Convert.ToDecimal(item["GoodsPrice"]) : 0);

                            cmd.Parameters.AddWithValue("@GoodsGeneric", item["GoodsGeneric"]?.ToString() ?? "");

                            cmd.Parameters.AddWithValue("@CustomerAddress", item["CustomerAddress"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@CustomerState", item["CustomerState"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@NationalCode", item["NationalCode"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@CustomerEconomic", item["CustomerEconomic"]?.ToString() ?? "");

                            cmd.Parameters.AddWithValue("@CustomerGln", item["CustomerGln"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@CustomerHIX", item["CustomerHIX"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@CustomerTel", item["CustomerTel"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@CustomerGroup", item["CustomerGroup"]?.ToString() ?? "");

                            cmd.Parameters.AddWithValue("@CustomerHospitalState", item["CustomerHospitalState"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@BatchNo", item["BatchNo"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@ExpireDate", item["ExpireDate"]?.ToString() ?? "");



                            cmd.Parameters.AddWithValue("@Lat", item["Lat"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@Long", item["Long"]?.ToString() ?? "");

                            cmd.Parameters.AddWithValue("@IsPrize", item["IsPrize"] != null ? Convert.ToInt32(item["IsPrize"]) : 0);
                            cmd.Parameters.AddWithValue("@CityID", item["CityID"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@RecordType", item["RecordType"]?.ToString() ?? "");

                            cmd.Parameters.AddWithValue("@EconomicCode", item["EconomicCode"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@StateId", item["StateId"]?.ToString() ?? "");


                            cmd.Parameters.AddWithValue("@visitorId", item["visitorId"] != null ? Convert.ToInt32(item["visitorId"]) : 0);
                            cmd.Parameters.AddWithValue("@visitorName", item["visitorName"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@InventoryCode", item["InventoryCode"] != null ? Convert.ToInt32(item["InventoryCode"]) : 0);

                            cmd.Parameters.AddWithValue("@InventoryName", item["InventoryName"]?.ToString() ?? "");

                            cmd.Parameters.AddWithValue("@CityName", item["CityName"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@p1", item["p1"] != null ? Convert.ToDecimal(item["p1"]) : 0);

                            cmd.Parameters.AddWithValue("@p2", item["p2"] != null ? Convert.ToDecimal(item["p2"]) : 0);
                            cmd.Parameters.AddWithValue("@p3", item["p3"] != null ? Convert.ToDecimal(item["p3"]) : 0);
                            cmd.Parameters.AddWithValue("@srcIsDist", item["srcIsDist"] != null ? Convert.ToInt32(item["srcIsDist"]) : 1);

                            cmd.Parameters.AddWithValue("@prizeQuantity", item["prizeQuantity"] != null ? Convert.ToInt32(item["prizeQuantity"]) : 0);
                            cmd.Parameters.AddWithValue("@prizeAmount", item["prizeAmount"] != null ? Convert.ToDecimal(item["prizeAmount"]) : 0);


                            cmd.Parameters.AddWithValue("@ghatiAmaniDesc", item["ghatiAmaniDesc"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@ghatiAmaniCode", item["ghatiAmaniCode"] != null ? Convert.ToInt32(item["ghatiAmaniCode"]) : 0);

                            cmd.Parameters.AddWithValue("@day", item["day"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@month", item["month"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@year", item["year"]?.ToString() ?? "");

                            cmd.ExecuteNonQuery();
                        }
                    }
                    string deleteQuery = $@"
                             DELETE FROM sales                             
                             WHERE distId = @DistId 
                             AND companyId = @CompanyId 
                             AND concat(year, month, day) IN ({dateList})
                             AND beDeleted = 1";
                    if (uniqueDates.Length > 0)
                    {
                        using (SqlCommand cmd = new SqlCommand(deleteQuery, conn))
                        {
                            cmd.Parameters.AddWithValue("@DistId", distId);
                            cmd.Parameters.AddWithValue("@CompanyId", companyId);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    var fromDate = (uniqueDates.Length > 0) ? uniqueDates[0] : "0";
                    var toDate = (uniqueDates.Length > 0) ? uniqueDates[uniqueDates.Length - 1] : "0";

                    repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, fromDate, toDate, 1, dataArray.Count, logId);
                    //updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", "فروش", dataArray.Count);
                }
            }
        }
        public static void saveSaleFinance(dynamic dataArray, int distId, int companyId, int logId, string curentDate, int saleType)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            if (dataArray != null)
            {
                string jsonData = JsonConvert.SerializeObject(dataArray);

                // گرفتن srcIsDist از اولین آیتم (فرض بر اینه که همه یکسان هستند)
                int srcIsDist = 0;

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("InsertSalesDataFinance", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@DistId", distId);
                        cmd.Parameters.AddWithValue("@CompanyId", companyId);
                        cmd.Parameters.AddWithValue("@srcIsDist", srcIsDist);
                        cmd.Parameters.AddWithValue("@saleType", saleType);
                        cmd.Parameters.AddWithValue("@JsonData", jsonData);

                        cmd.ExecuteNonQuery();
                    }

                    // بروزرسانی لاگ بعد از درج موفق
                    repository.updateServiceLog(distId, companyId, 0, "مالی", "سیستمی", 1, "14030101", curentDate, 1, dataArray.Count, logId);
                }
            }
        }

        public static void saveStock(dynamic dataArray, int distId, int companyId, int logId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            if (dataArray != null)
            {

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    var uniqueDates = ((IEnumerable<dynamic>)dataArray)
                                        .Select(item => item["year"]?.ToString() + item["month"]?.ToString() + item["day"]?.ToString())  // Concatenate date
                                        .Distinct()  // Ensure uniqueness
                                        .OrderBy(d => d)  // Sort the dates
                                        .ToArray();
                    var dateList = string.Join(",", uniqueDates);

                    string updateQuery = $@"
                    UPDATE stock WITH (ROWLOCK, UPDLOCK)
                    SET beDeleted = 1 
                    WHERE distId = @DistId 
                    AND companyId = @CompanyId 
                    AND concat(year, month, day) IN ({dateList})";
                    if (uniqueDates.Length > 0)
                    {
                        using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
                        {
                            cmd.Parameters.AddWithValue("@DistId", distId);
                            cmd.Parameters.AddWithValue("@CompanyId", companyId);
                            cmd.ExecuteNonQuery();
                        }
                    }

                    foreach (var item in dataArray)
                    {
                        using (SqlCommand cmd = new SqlCommand("InsertStockData", conn))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@DistId", distId);
                            cmd.Parameters.AddWithValue("@CompanyId", companyId);

                            cmd.CommandType = CommandType.StoredProcedure;

                            // Set all other parameters
                            cmd.Parameters.AddWithValue("@BranchCode", item["BranchCode"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@BranchName", item["BranchName"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@GoodsCode", item["GoodsCode"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@GoodsName", item["GoodsName"]?.ToString() ?? "");

                            cmd.Parameters.AddWithValue("@CountOfStock", item["CountOfStock"] != null ? Convert.ToInt32(item["CountOfStock"]) : 0);
                            cmd.Parameters.AddWithValue("@AmountOfStock", item["AmountOfStock"] != null ? Convert.ToDecimal(item["AmountOfStock"]) : 0);

                            cmd.Parameters.AddWithValue("@ExpireDate", item["ExpireDate"]?.ToString() ?? "");

                            cmd.Parameters.AddWithValue("@BatchNumber", item["BatchNumber"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@OnWayQty", item["OnWayQty"] != null ? Convert.ToDecimal(item["OnWayQty"]) : 0);
                            cmd.Parameters.AddWithValue("@DamagedQty", item["DamagedQty"] != null ? Convert.ToDecimal(item["DamagedQty"]) : 0);
                            cmd.Parameters.AddWithValue("@NotDistributedQty", item["NotDistributedQty"] != null ? Convert.ToDecimal(item["NotDistributedQty"]) : 0);
                            cmd.Parameters.AddWithValue("@BlockedQty", item["BlockedQty"] != null ? Convert.ToDecimal(item["BlockedQty"]) : 0);

                            cmd.Parameters.AddWithValue("@IRC", item["IRC"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@GTIN", item["GTIN"]?.ToString() ?? "");

                            cmd.Parameters.AddWithValue("@inventoryCode", item["inventoryCode"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@inventoryName", item["inventoryName"]?.ToString() ?? "");

                            cmd.Parameters.AddWithValue("@MarjoeeBeTaminKonandeh", item["MarjoeeBeTaminKonandeh"] != null ? Convert.ToInt32(item["MarjoeeBeTaminKonandeh"]) : 0);

                            cmd.Parameters.AddWithValue("@CodeNoeAnbar", item["CodeNoeAnbar"] != null ? Convert.ToInt32(item["CodeNoeAnbar"]) : 0);
                            cmd.Parameters.AddWithValue("@p1", item["p1"] != null ? Convert.ToDecimal(item["p1"]) : 0);

                            cmd.Parameters.AddWithValue("@BuyTypeCode", item["BuyTypeCode"] != null ? Convert.ToInt32(item["BuyTypeCode"]) : 0);
                            cmd.Parameters.AddWithValue("@BuyTypeName", item["BuyTypeName"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@DamagedAmount", item["DamagedAmount"] != null ? Convert.ToDecimal(item["DamagedAmount"]) : 0);

                            cmd.Parameters.AddWithValue("@day", item["day"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@month", item["month"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@year", item["year"]?.ToString() ?? "");

                            cmd.Parameters.AddWithValue("@expDay", item["expDay"]?.ToString() ?? "01");
                            cmd.Parameters.AddWithValue("@expMonth", item["expMonth"]?.ToString() ?? "");
                            cmd.Parameters.AddWithValue("@expYear", item["expYear"]?.ToString() ?? "");


                            cmd.ExecuteNonQuery();
                        }
                    }
                    string deleteQuery = $@"
                             DELETE FROM stock                             
                             WHERE distId = @DistId 
                             AND companyId = @CompanyId 
                             AND concat(year, month, day) IN ({dateList})
                             AND beDeleted = 1";
                    if (uniqueDates.Length > 0)
                    {
                        using (SqlCommand cmd = new SqlCommand(deleteQuery, conn))
                        {
                            cmd.Parameters.AddWithValue("@DistId", distId);
                            cmd.Parameters.AddWithValue("@CompanyId", companyId);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    var fromDate = (uniqueDates.Length > 0) ? uniqueDates[0] : "0";
                    var toDate = (uniqueDates.Length > 0) ? uniqueDates[uniqueDates.Length - 1] : "0";
                    repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, fromDate, toDate, 1, dataArray.Count, logId);

                }
            }
        }
        public static void saveStockFinance(dynamic dataArray, int companyId, string curentDate)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            if (dataArray != null)
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    using (SqlCommand cmd = new SqlCommand("InsertStockDataFinance", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@CompanyId", companyId);
                        cmd.Parameters.AddWithValue("@DistId ", 0);
                        cmd.Parameters.AddWithValue("@curentDate", curentDate); // مثل "14030201"
                        cmd.Parameters.AddWithValue("@stockJsonData", JsonConvert.SerializeObject(dataArray));
                        cmd.ExecuteNonQuery();
                    }
                    //updateServiceLog(0, companyId, 0, "مالی", "سیستمی", "فروش", dataArray.Count);
                    //repository.updateServiceLog(distId, companyId, 0, "مالی", "سیستمی", 1, "14030101", curentDate, 1, dataArray.Count, logId);
                }
            }
        }
        ///////////////////////////////////////////////////////////////////// rahkaran //////////////////////////////////////
        public static dynamic getSepidarSale(string companyName, string maxInvoiceItemId, string lastModificationDate)
        {

            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select
                                         ii.NetPrice
                                        ,ii.ItemRef ProductId                                   
                                        ,ii.Quantity
                                        ,CONVERT(VARCHAR(23), i.date, 121) AS date
                                        ,c.PartyId CustomerId
                                        ,ii.InvoiceItemID
                                        ,ii.InvoiceRef 
                                        ,ii.RowID RowNumber
                                        ,ii.fee PriceBaseFee
                                        ,ii.Price
                                        ,ii.Addition AdditionAmount 
                                        ,ii.Discount ReductionAmount   
										,ii.stockRef StoreRef
                                    FROM sls.InvoiceItem ii
                                    inner join SLS.Invoice i on i.InvoiceID=ii.InvoiceRef
                                    inner join gnr.party c on c.PartyId=i.CustomerPartyRef
									where i.State!=2
                                    ";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static dynamic getRahkaranSale(string companyName, string maxInvoiceItemId, string lastModificationDate)
        {

            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select
                                         ii.NetPrice
                                        ,ii.ProductRef ProductId                                   
                                        ,ii.Quantity
                                        ,CONVERT(VARCHAR(23), i.date, 121) AS date
                                        ,c.customerId CustomerId
                                        ,ii.InvoiceItemID
                                        ,ii.InvoiceRef 
                                        ,ii.RowNumber
                                        ,ii.PriceBaseFee
                                        ,ii.Price
                                        ,ii.AdditionAmount 
                                        ,ii.ReductionAmount
                                        ,i.InventoryRef StoreRef
                                        ,i.SalesOfficeRef
                                    FROM SLS3.InvoiceItem ii
                                    inner join SLS3.Invoice i on i.InvoiceID=ii.InvoiceRef
                                    inner join sls3.Customer c on c.CustomerID=i.CustomerRef
	where i.Status!=6";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static dynamic getSepidarSaleReturn(string companyName, string maxInvoiceItemId, string lastModificationDate)
        {

            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select
                                         ii.NetPrice
                                        ,ii.ItemRef ProductId                                   
                                        ,ii.Quantity
                                        ,CONVERT(VARCHAR(23), i.date, 121) AS date
                                        ,c.PartyId CustomerId
                                        ,ii.ReturnedInvoiceItemID InvoiceItemID
                                        ,ii.ReturnedInvoiceRef InvoiceRef 
                                        ,ii.RowID RowNumber
                                        ,ii.fee PriceBaseFee
                                        ,ii.Price
                                        ,ii.Addition AdditionAmount 
                                        ,ii.Discount ReductionAmount
										,ii.StockRef StoreRef
                                    FROM sls.ReturnedInvoiceItem ii
                                    inner join SLS.ReturnedInvoice i on i.ReturnedInvoiceId=ii.ReturnedInvoiceRef
                                    inner join gnr.party c on c.PartyId=i.CustomerPartyRef";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static dynamic getRahkaranSaleReturn(string companyName, string maxInvoiceItemId, string lastModificationDate)
        {

            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select
                                         ii.NetPrice
                                        ,ii.ProductRef ProductId                                   
                                        ,ii.Quantity
                                        ,CONVERT(VARCHAR(23), i.date, 121) AS date
                                        ,c.customerId CustomerId
                                        ,ii.ReturnInvoiceItemID InvoiceItemID
                                        ,ii.ReturnInvoiceRef InvoiceRef 
                                        ,ii.RowNumber
                                        ,ii.PriceBaseFee
                                        ,ii.Price
                                        ,ii.AdditionAmount 
                                        ,ii.ReductionAmount
                                        ,i.InventoryRef StoreRef
                                        ,i.SalesOfficeRef
                                    FROM SLS3.ReturnInvoiceItem ii
                                    inner join SLS3.ReturnInvoice i on i.ReturnInvoiceID=ii.ReturnInvoiceRef
                                    inner join sls3.Customer c on c.CustomerID=i.CustomerRef
	where i.Status!=6";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }

        public static dynamic getRahkaranStock(string companyName)
        {

            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"WITH cte AS (
                                    SELECT
                                    s.StoreID,
                                    p.PartID,
                                    LEFT(ivf.trackingfactor1,10) AS Batch,
                                    ivf.trackingfactor2 AS expDate,
                                    (CASE WHEN ss.Direction = 1 THEN ivf.MajorUnitQuantity ELSE -1 * ivf.MajorUnitQuantity END) AS Quantity
                                    FROM lgs3.inventoryvoucher i
                                    INNER JOIN lgs3.InventoryVoucherItem ii ON i.InventoryVoucherID = ii.InventoryVoucherRef AND i.State <> 3
                                    INNER JOIN lgs3.InventoryVoucherItemTrackingFactor ivf ON ii.InventoryVoucherItemID = ivf.InventoryVoucherItemRef
                                    INNER JOIN lgs3.InventoryVoucherSpecification ss ON i.InventoryVoucherSpecificationRef = ss.InventoryVoucherSpecificationID
                                    INNER JOIN lgs3.Store s ON s.StoreID = i.StoreRef
                                    left JOIN lgs3.store s2 ON i.CounterpartStoreRef = s2.StoreID
                                    INNER JOIN lgs3.part p ON p.PartID = ii.PartRef
                                    )
                                  SELECT storeId, PartID, batch, expDate, SUM(quantity) AS quantity
                                  FROM cte
                                  GROUP BY storeid, PartID, batch, expDate";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        public static dynamic getSepidarStock(string companyName)
        {

            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"SELECT [ItemStockSummaryID]
                          ,[StockRef] storeId

                          ,[ItemRef] PartID
    
                          ,i.BarCode as batch
	                      ,null expDate
                          ,[Quantity] quantity
     
                      FROM [INV].[ItemStockSummary] iss
                      inner join inv.item i on i.ItemID=iss.ItemRef
                     where  fiscalYearRef in(select max(FiscalYearId) from fmk.FiscalYear where Status=1) and [order]=1
                      order by Quantity desc

                    ";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }

        public static dynamic getSepidarProductList(string companyName, string maxProductId, string lastModificationDate)
        {

            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select  itemId productId,code Number,title Name,CreationDate,LastModificationDate,itemId PartRef from inv.Item where itemId>" + maxProductId + " or lastModificationDate>'" + lastModificationDate + "'";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static dynamic getRahkaranProductList(string companyName, string maxProductId, string lastModificationDate)
        {

            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select productId,Isnull(Number,p.code)Number,
                    p.Name,p.CreationDate,p.LastModificationDate,IsNull(pc.PartRef,p.partId)PartRef from lgs3.part p
                    left join sls3.product pc on pc.PartRef=p.PartID ";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        //public static void syncRahkaranProductList(dynamic dataArray, string companyId)
        //{
        //    string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

        //    if (dataArray != null)
        //    {

        //        using (SqlConnection conn = new SqlConnection(connectionString))
        //        {
        //            conn.Open();
        //            foreach (var item in dataArray)
        //            {
        //                using (SqlCommand cmd = new SqlCommand("InsertProductFinance", conn))
        //                {
        //                    cmd.CommandType = CommandType.StoredProcedure;
        //                    cmd.Parameters.AddWithValue("@companyId", Convert.ToInt32(companyId));
        //                    cmd.Parameters.AddWithValue("@productId", (int)(item["productId"]));
        //                    cmd.Parameters.AddWithValue("@Number", (long)item["Number"]);
        //                    cmd.Parameters.AddWithValue("@Name", (string)item["Name"]);
        //                    cmd.Parameters.AddWithValue("@PartRef", (string)item["PartRef"]);
        //                    cmd.Parameters.AddWithValue("@CreationDate", (DateTime)item["CreationDate"]);
        //                    cmd.Parameters.AddWithValue("@LastModificationDate", (DateTime)item["LastModificationDate"]);
        //                    cmd.ExecuteNonQuery();

        //                }
        //            }
        //        }
        //    }

        //}
        public static void syncRahkaranProductList(dynamic dataArray, string companyId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            if (dataArray != null)
            {
                string jsonData = JsonConvert.SerializeObject(dataArray); // استفاده از Newtonsoft.Json

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("InsertProductFinance", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@companyId", Convert.ToInt32(companyId));
                        cmd.Parameters.AddWithValue("@JsonData", jsonData);
                        cmd.ExecuteNonQuery();
                    }
                }
            }
        }


        public static dynamic getRahkaranStoreList(string companyName)
        {

            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select StoreID,Name,code from lgs3.Store";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static dynamic getSepidarStoreList(string companyName)
        {

            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"SELECT  [StockID] StoreID
      ,[Title] Name
	   ,[Code] code
  FROM [INV].[Stock]
  where IsActive=1";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static dynamic getRahkaranSaleOfficeList(string companyName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select SalesOfficeID,Name,Code from sls3.salesoffice";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static dynamic getRahkaranReceivableNote(string companyName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select ReceivableNoteID,r.BankRef,r.BankBranchCode,r.BankBranchName,r.AccountNumber,r.SerialNumber,r.Amount,r.OperationalCurrencyAmount,r.BaseCurrencyAmount,r.AgreementDate,r.Description,
                                    r.State,r.Series,case when d.DLTypeRef  in(1,2 ) then d.ReferenceID
									else null
									end
									as partyId,r.DueDate
                                    from rpa3.ReceivableNote r
                                    inner join fin3.DL d on r.CounterPartRef=d.DLID
                                    where r.NormalORGuarantee=1";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static dynamic getSepidarReceivableNote(string companyName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"declare @minDate as Date;
declare @maxDate as Date;
SELECT TOP 1 @minDate = StartDate FROM fmk.FiscalYear WHERE Status = 1 ORDER BY StartDate DESC;
SELECT TOP 1 @maxDate = endDate FROM fmk.FiscalYear WHERE Status = 1 ORDER BY StartDate DESC;
SELECT  
    min([AmountInBaseCurrency]) BaseCurrencyAmount,
	min([AmountInBaseCurrency]) OperationalCurrencyAmount,
	'' Series,
	min(partyId) partyId,
    min([ReceiptChequeId]) ReceivableNoteID,
    min([Number]) SerialNumber,
    min([Amount]) Amount,
    min([AccountNo]) AccountNumber,
    min([Date]) DueDate,
    min([HeaderDate]) AgreementDate,
    min([BankRef]) BankRef,
    min([BranchCode]) BankBranchCode,
    min([BranchTitle]) BankBranchName,
    
	(select top 1 state from Rpa.ReceiptCheque where Number=ReceiptCheque.Number order by HeaderDate desc) 'State',
    min([Description]) as [Description]
	
FROM (
    SELECT
		pr.partyId,
        ReceiptChq.Number,
        ReceiptChq.SecondNumber,
        ReceiptChq.SayadCode,
        ReceiptChq.AccountNo,
        ReceiptChq.Amount,
        ReceiptChq.Date,
        ReceiptChq.Description,
        ReceiptChq.Description_En,
        ReceiptChq.Version,
        ReceiptChq.State,
        ReceiptChq.CashRef,
        Cash.DlTitle AS CashTitle,
        ReceiptChq.ReceiptHeaderRef,
        ReceiptChq.BankRef,
        ReceiptChq.BranchCode,
        ReceiptChq.BranchTitle,
        ReceiptChq.LocationRef,
        GNR.Location.Title AS LocationTitle,
        RPA.Bank.Title AS BankTitle,
        GNR.Location.Title_En AS LocationTitle_En,
        Cash.DlTitle_En AS CashTitle_En,
        RPA.Bank.Title_En AS BankTitle_En,
        ReceiptChq.IsGuarantee,
        ReceiptChq.HeaderNumber,
        ReceiptChq.HeaderDate,
        ReceiptChq.CurrencyRef,
        ReceiptChq.Rate,
        GNR.Currency.Title AS CurrencyTitle,
        GNR.Currency.Title_En AS CurrencyTitle_En,
        ISNULL(ReceiptChq.BranchTitle, '') + ' ' + ISNULL(GNR.Location.Title, '') AS BranchCityTitle,
        ISNULL(ReceiptChq.BranchTitle, '') + ' ' + ISNULL(GNR.Location.Title, '') AS BankBranchCityTitle,
        ReceiptChq.ReceiptChequeId,
        ReceiptChq.AmountInBaseCurrency,
        ReceiptChq.BankBranchRef,
        ReceiptChq.DlRef,
        ACC.DL.Title AS DlTitle,
        ACC.DL.Code AS DlCode,
        ACC.DL.Title_En AS DlTitle_En,
        Submit.BankAccountRef AS SubmitBankAccountRef,
        Submit.HeaderBankAccountTitle AS SubmitBankAccountTitle,
        Submit.HeaderNumber AS SubmitNumber,
        Submit.HeaderDate AS SubmitDate,
        ReceiptChq.InitState,
        RPA.Bank.Title + ' ' + ISNULL(ReceiptChq.BranchTitle, '') + ' ' + ISNULL(GNR.Location.Title, '') + ' ' + ReceiptChq.AccountNo AS BankAccountTitle,
        RPA.Bank.Title_En + ' ' + CONVERT(VARCHAR, ReceiptChq.BranchCode) + ' ' + ISNULL(GNR.Location.Title_En, '') + ' ' + ReceiptChq.AccountNo AS BankAccountTitle_En,
        Submit.ReceiptChequeBankingRef,
        ReceiptChq.Type,
        ReceiptChq.ChequeOwner
    FROM RPA.ReceiptCheque AS ReceiptChq
	LEFT JOIN GNR.Party pr on pr.DLRef=ReceiptChq.DlRef
    LEFT OUTER JOIN RPA.vwCash AS Cash
        ON ReceiptChq.CashRef = Cash.CashId
    INNER JOIN GNR.Currency
        ON ReceiptChq.CurrencyRef = GNR.Currency.CurrencyID
    INNER JOIN RPA.Bank
        ON ReceiptChq.BankRef = RPA.Bank.BankId
    LEFT OUTER JOIN GNR.Location
        ON ReceiptChq.LocationRef = GNR.Location.LocationId
    INNER JOIN ACC.DL
        ON ReceiptChq.DlRef = ACC.DL.DLId
    LEFT OUTER JOIN (
        SELECT
            Submit2.*,
            History.STATE hState
        FROM RPA.vwReceiptChequeBankingItem AS Submit2
        INNER JOIN (
            SELECT
                ROW_NUMBER() OVER (PARTITION BY rh.ReceiptChequeref ORDER BY receiptChequeHistoryId DESC) RN,
                *
            FROM rpa.ReceiptChequeHistory RH
        ) History
            ON History.ReceiptChequeRef = Submit2.ReceiptChequeRef
           AND History.RN = 1
           AND History.ReceiptChequeBankingItemRef = Submit2.ReceiptChequeBankingItemId
    ) AS Submit
        ON Submit.ReceiptChequeRef = ReceiptChq.ReceiptChequeId
       AND Submit.hState = 2
	  where  ReceiptChq.IsGuarantee=0
) AS ReceiptCheque
WHERE (
    EXISTS (
        SELECT 1
        FROM Rpa.ReceiptHeader H
        WHERE H.ReceiptHeaderID = ReceiptHeaderRef
    )
    OR EXISTS (
        SELECT *
        FROM rpa.ReceiptChequeHistory HH
        WHERE Date >= @minDate
          AND Date <= @maxDate
          AND Type IN (33, 53, 54)
          AND EXISTS (
              SELECT *
              FROM rpa.ReceiptChequeHistory hhh
              WHERE Type IN (53, 54)
                AND hhh.ReceiptChequeHistoryID = (
                    SELECT TOP 1 ReceiptChequeHistoryID
                    FROM rpa.ReceiptChequeHistory HH2
                    WHERE Date >= @minDate
                      AND hh2.[ReceiptChequeRef] = hhh.[ReceiptChequeRef]
                    ORDER BY ReceiptChequeHistoryId
                )
                AND hh.ReceiptChequeRef = hhh.[ReceiptChequeRef]
          )
          AND [ReceiptChequeId] = hh.ReceiptChequeRef
		  
    )
)
group by Number

";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static dynamic getRahkaranPayableNote(string companyName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select PayableNoteID,p.BankRef,p.BankBranchCode,p.BankBranchName,p.AccountNumber,p.PayableChequeBookItemRef,p.SerialNumber,p.Amount,p.OperationalCurrencyAmount,p.BaseCurrencyAmount,p.AgreementDate,p.Description,
                                    p.State,p.Series,case when d.DLTypeRef  in(1,2 ) then d.ReferenceID
									else null
									end
									as partyId ,p.DueDate
                                    from rpa3.PayableNote p
                                    inner join fin3.DL d on p.CounterPartRef=d.DLID
                                    where p.NormalORGuarantee=1";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static dynamic getSepidarPayableNote(string companyName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"DECLARE 
                        @BankAccountId INT = -1,
                        @FromDate DATETIME ,
                        @ToDate DATETIME = getDate();
                    SELECT TOP 1 @FromDate = StartDate FROM fmk.FiscalYear  ORDER BY StartDate ;

                    SELECT 
                        min(Cheque.PaymentChequeId) PayableNoteID,
	                    min(Branch.BankRef) BankRef,
	                    min(BranchCode) BankBranchCode,
	                    min(BranchTitle) BankBranchName,
	                    min(AccountNo) AccountNumber,
	                    min(PaymentChequeBankingItemId) PayableChequeBookItemRef,
	                    min(Cheque.[Number]) SerialNumber,
						 min(Cheque.Amount) Amount,
	                    min(Cheque.AmountInBaseCurrency) OperationalCurrencyAmount,
	                    min(Cheque.AmountInBaseCurrency) BaseCurrencyAmount,
	                    min(Cheque.HeaderDate) AgreementDate,
	                    min(Cheque.Description) 'Description',
	                    (select top 1 state from Rpa.PaymentCheque where Number=Cheque.number order by HeaderDate desc) 'State',
	                    Null as Series,
	                    min(p.partyId) as partyId,
	                    min(Cheque.Date) as DueDate
                    FROM 
                        Rpa.PaymentCheque AS Cheque
                        INNER JOIN Rpa.PaymentHeader AS Header 
                            ON Header.PaymentHeaderId = Cheque.PaymentHeaderRef
                        INNER JOIN Acc.Dl AS Dl 
                            ON Cheque.DlRef = Dl.DlId
                        INNER JOIN Gnr.Currency AS Currency 
                            ON Currency.CurrencyID = Cheque.CurrencyRef
                        INNER JOIN Rpa.vwBankAccount AS Account 
                            ON Account.BankAccountID = Cheque.BankAccountRef
                        INNER JOIN Rpa.BankBranch AS Branch 
                            ON Branch.BankBranchId = Account.BankBranchRef
                        INNER JOIN Rpa.Bank AS Bank 
                            ON Bank.BankID = Branch.BankRef
                        LEFT OUTER JOIN Rpa.PaymentChequeBankingItem AS BankingItem 
                            ON BankingItem.PaymentChequeRef = Cheque.PaymentChequeId
	                    LEFT JOIN GNR.party p on p.DlRef = Cheque.DlRef
                    WHERE 
                        (
                            (
                                Account.BankAccountId = @BankAccountId 
                                AND Cheque.State = 1 
                                AND Cheque.DurationType = 1 
                                AND Cheque.IsGuarantee = 0 
                                AND @FromDate <= Cheque.HeaderDate 
                                AND Cheque.HeaderDate <= @ToDate
                            )
                            OR
                            (
                                @BankAccountId = -1 
                                AND Cheque.State <> 4 
                                AND @FromDate <= Cheque.HeaderDate 
                                AND Cheque.HeaderDate <= @ToDate
                            )
		                    OR
                            (
                                @BankAccountId = -1 
                                AND Cheque.State <> 4 
                                AND Header.State = 4 
                               AND EXISTS 
                               (
                                   SELECT 1
                                   FROM Fmk.FiscalYear
                                    WHERE FiscalYearID = Header.FiscalYearRef 
                                     AND @FromDate <= Fmk.FiscalYear.StartDate 
                                     AND Fmk.FiscalYear.EndDate <= @ToDate
                                )
                            )
		
                        ) 
	                    group by Cheque.Number;";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static dynamic getRahkaranVoucherItem(string companyName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"SELECT 
                                        ISNULL(vi.FollowUpNumber, altNum.FollowUpNumber) AS FollowUpNumber,
                                        ISNULL(vi.FollowUpDate, altDate.FollowUpDate) AS FollowUpDate,
                                        v.VoucherID,
                                        v.Description,
                                        vi.VoucherItemID,
                                        v.FiscalYearRef, 
                                        v.VoucherTypeRef,
                                        --v.Creator,
                                        v.CreationDate,
                                        --v.LastModifier,
                                        --v.LastModifier,
                                        vi.RowNumber,
                                        vi.GLRef,
                                        vi.SLRef,
                                        vi.Credit,
                                        vi.Debit,
                                        vi.Description ItemDescription,
                                        vi.DLLevel4,
		
									
                                    case when d.DLTypeRef  in(1,2 ) then d.ReferenceID
									else null
									end
									as ReferenceID
                                    FROM fin3.voucher v 
                                    INNER JOIN fin3.voucheritem vi ON vi.VoucherRef = v.VoucherID
                                   INNER JOIN FIN3.dl d ON d.code = vi.DLLevel4
                                    INNER JOIN FIN3.sl s ON s.SLID = vi.SLRef
                                    INNER JOIN FIN3.gl g ON g.GLID = vi.GLRef
                                    INNER JOIN FIN3.VoucherType vt ON v.VoucherTypeRef = vt.VoucherTypeID
                                    
                                    -- برای FollowUpNumber فقط
                                    LEFT JOIN (
                                        SELECT VoucherRef, MAX(FollowUpNumber) AS FollowUpNumber
                                        FROM fin3.voucheritem
                                        WHERE FollowUpNumber IS NOT NULL
                                        GROUP BY VoucherRef
                                    ) AS altNum ON altNum.VoucherRef = vi.VoucherRef
                                    
                                    -- برای FollowUpDate فقط
                                    LEFT JOIN (
                                        SELECT VoucherRef, MAX(FollowUpDate) AS FollowUpDate
                                        FROM fin3.voucheritem
                                        WHERE FollowUpDate IS NOT NULL
                                        GROUP BY VoucherRef
                                    ) AS altDate ON altDate.VoucherRef = vi.VoucherRef
                                    
                                    WHERE  
                                        (
                                            (
                                                v.VoucherTypeRef IN (1, 2, 3, 4, 8, 10, 12, 13, /*14, 15,*/ 16, 17, 18,19,20,21,22,23,24,25,26,27,28,29) AND 
                                                v.FiscalYearRef IN (    SELECT FiscalYearRef
    FROM [GNR3].[LedgerFiscalYear]
    WHERE ClosingState IN (4, 0))
                                            ) 
                                            OR 
                                            (
                                                v.VoucherTypeRef IN (6, 11) AND 
                                                v.FiscalYearRef =( SELECT max(FiscalYearRef ) 
  FROM [GNR3].[LedgerFiscalYear]   
  where ClosingState=4
                                          )  )
                                        )
                                        AND v.LedgerRef IN (1)
                                        AND ISNULL(v.IsTemporary, 0) <> 1
                                        AND v.State <> 2
                                        AND vi.GLRef in (7,22,23)
                                                           	
                                    	 order by v.VoucherID, v.VoucherTypeRef 


									                                   
                                    	--invoice 14 / returnInvoice 15 / Receipt and payment  12/ General 4/ Opening voucher 6 /سند حقوق و دستمزد 18";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static dynamic getSepidarVoucherItem(string companyName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"DECLARE @CLRef int = -1
DECLARE @GLRef int = -1
declare @DLRef int=-1
DECLARE @SLRef1 int = 117  -- حسابهای دریافتنی
DECLARE @SLRef2 int=193  -- حسابهای پرداختنی
DECLARE @CurrencyRef int = -1
DECLARE @TrackingNumber nvarchar(2) = '-1'
DECLARE @FromDate datetime 
select @fromDate =min(StartDate) from fmk.FiscalYear where Status=1 
DECLARE @ToDate datetime  
select @ToDate =max(endDate) from fmk.FiscalYear where Status=1
DECLARE @FromNumber int = -1
DECLARE @ToNumber int = -1
DECLARE @FromSecNumber int = -1
DECLARE @ToSecNumber int = -1
DECLARE @OpeningType nvarchar(1) = '10' -- فرضی
DECLARE @ClosingType nvarchar(2) = '7' -- فرضی
DECLARE @CloseAccountsType nvarchar(2) = '5' -- فرضی
DECLARE @LastDayOfFirstYear datetime 
select @LastDayOfFirstYear =endDate from fmk.FiscalYear where Status=1 and StartDate in(select min(StartDate) from fmk.FiscalYear where Status=1  )
DECLARE @FirstDayOfLastYear datetime
select @FirstDayOfLastYear =StartDate from fmk.FiscalYear where Status=1 and StartDate in(select max(StartDate) from fmk.FiscalYear where Status=1  )
SELECT
  [RowNumber]
 ,[GLRef]
 

 ,[VoucherItemId] VoucherItemID
 ,''  FollowUpDate
 ,'' FollowUpNumber
 --,GLVoucher.Number GLVoucherNumber
 ,vi.[VoucherRef] VoucherID
 ,p.partyId ReferenceID
 --,[VoucherSecondaryNumber]
 ,[AccountSLRef] SLRef
 ,[VoucherDate] CreationDate
 ,[DLCode] DLLevel4
 ,[Description] ItemDescription
,[Description_En] [Description]
 ,[Debit]
 ,[Credit]
 ,FiscalYearRef
 
 
 --,[CurrencyRef]
 --,[TrackingNumber]
 --,[TrackingDate]
 --,[CurrencyDebit]
 --,[CurrencyCredit]
 --,[CurrencyTitle]
-- ,[IssuerEntityName]
-- ,[CurrencyTitle_En]
-- ,[CurrencyRate]
-- ,[IssuerEntityRef]
 --,vi.[Version]
 ,[VoucherType] VoucherTypeRef
-- ,[SLCode]
-- ,[SLTitle]
-- ,[SLTitle_En]
-- ,[SLHasDL]
 --,[SLHasCurrency]
 --,[SLHasCurrencyConversion]
 --,[SLHasTracking]
 --,[SLHasTrackingCheck]
 --,[CurrencyPrecisionCount]
 --,[DLTitle]
 --,[DLTitle_En]
 --,[DLType]
 --,[DLCode]
 --,[VoucherState]
 --,[IssuerSystem]
 --,[MergedIssuerSystem]
 --,[IsMerged]
 --,[CurrencyAmount]
 FROM ACC.[vwVoucherItem] vi
LEFT JOIN (SELECT
    g.VoucherRef
   ,g1.Number
   ,g1.FromVoucherNumber
   ,g1.ToVoucherNumber
  FROM ACC.vwGLVoucher g1
  INNER JOIN ACC.vwGLVoucherItem g
    ON g1.GLVoucherId = g.GLVoucherRef) GLVoucher
  ON GLVoucher.VoucherRef = vi.VoucherRef
  left join gnr.party p on p.DLRef=vi.DLRef
WHERE 
 (VoucherDate >= @FromDate
OR -1 = @FromDate)
AND (VoucherDate <= @ToDate
OR -1 = @ToDate)
AND (VoucherNumber >= @FromNumber
OR -1 = @FromNumber)
AND (VoucherNumber <= @ToNumber
OR -1 = @ToNumber)
AND (VoucherSecondaryNumber >= @FromSecNumber
OR -1 = @FromSecNumber)
AND (VoucherSecondaryNumber <= @ToSecNumber
OR -1 = @ToSecNumber)
AND ((VoucherType IN (1, 2, 6)) --General, OtherSystems, CurrencyConversion
AND (IssuerSystem IN (2,3))
OR (VoucherType = @OpeningType
AND VoucherDate <= @LastDayOfFirstYear)
OR (VoucherType = @ClosingType
AND VoucherDate >= @FirstDayOfLastYear)
OR (VoucherType = @CloseAccountsType)
--OR (vi.VoucherNumber BETWEEN GLVoucher.FromVoucherNumber AND GLVoucher.ToVoucherNumber)
)
AND (CLRef = @CLRef
OR -1 = @CLRef)
AND (GLRef = @GLRef
OR -1 = @GLRef)
AND ((AccountSLRef = @SLRef1 )OR (AccountSLRef = @SLRef2)
OR (-1 = @SLRef1)OR (-1 = @SLRef2))
AND (vi.DLRef = @DLRef
OR -1 = @DLRef)
AND (CurrencyRef = @CurrencyRef
OR -1 = @CurrencyRef)
AND (TrackingNumber = @TrackingNumber
OR '-1' = @TrackingNumber)
order by ReferenceID







";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static dynamic getRahkaranFinanceBalanceList(string companyName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"SELECT 
                        R_N AS RowNumber,
                        --MIN([ID]) AS [ID],
                        MIN([Code]) AS [Code],
                        --MIN([ReferenceId]) AS [ReferenceId],
                        MIN([Title]) AS [Title],
                        --MIN([Title_En]) AS [Title_En],
                        SUM([Debit]) AS [Debit],
                        SUM([Credit]) AS [Credit],
                        SUM([DebitBalance]) AS [DebitBalance],
                        SUM([CreditBalance]) AS [CreditBalance],
                        --MIN([CurrencyDebit]) AS [CurrencyDebit],
                        --MIN([CurrencyCredit]) AS [CurrencyCredit],
                        --SUM([CurrencyBalance]) AS [CurrencyBalance],
                        --MIN([CurrencyDebitBalance]) AS [CurrencyDebitBalance],
                        --MIN([CurrencyCreditBalance]) AS [CurrencyCreditBalance],
                        --MIN([ClassificationNumber]) AS [ClassificationNumber],
                    	min(t100.CustomerID) as CustomerID
                    FROM (
                        SELECT 
                            CASE WHEN RN BETWEEN 1 AND 1000 THEN RN ELSE -1 END AS [R_N],
                            x.* 
                        FROM (
                            SELECT 
                                ROW_NUMBER() OVER (ORDER BY Code) AS [RN],
                                ID,
                                Code,
                    			ReferenceId,
                                Title,
                                Title_En,
                                Debit,
                                Credit,
                                DebitBalance,
                                CreditBalance,
                                CurrencyDebit,
                                CurrencyCredit,
                                CurrencyBalance,
                                CurrencyDebitBalance,
                                CurrencyCreditBalance,
                                ClassificationNumber 
                            FROM (
                                SELECT 
                                    [t33].[value22] AS [ID],
                                    [t33].[Code],
                    				[t33].[ReferenceId],
                                    [t33].[value] AS [Title],
                                    [t33].[Title_En],
                                    [t33].[value2] AS [Debit],
                                    [t33].[value3] AS [Credit],
                                    [t33].[value4] AS [DebitBalance],
                                    [t33].[value5] AS [CreditBalance],
                                    [t33].[value52] AS [CurrencyDebit],
                                    [t33].[value6] AS [CurrencyCredit],
                                    [t33].[value7] AS [CurrencyBalance],
                                    [t33].[value8] AS [CurrencyDebitBalance],
                                    [t33].[value9] AS [CurrencyCreditBalance],
                                    [t33].[ClassificationNumber] 
                                FROM ( --t33 table
                                    SELECT 
                                        [t31].[value22],
                                        [t32].[Code],
                                        [t32].[ReferenceId],
                                        (CASE WHEN 0 = 1 THEN [t32].[Title_En] ELSE [t32].[Title] END) AS [value],
                                        [t32].[Title_En],
                                        [t31].[value] AS [value2],
                                        [t31].[value2] AS [value3],
                                        (CASE WHEN [t31].[value3] > 0 THEN [t31].[value3] ELSE CONVERT(Decimal(31,6),0) END) AS [value4],
                                        (CASE WHEN [t31].[value3] < 0 THEN -[t31].[value3] ELSE CONVERT(Decimal(31,6),0) END) AS [value5],
                                        [t31].[value5] AS [value52], 
                                        [t31].[value6], 
                                        COALESCE([t31].[value4],0) AS [value7], 
                                        (CASE WHEN [t31].[value4] > 0 THEN [t31].[value4] ELSE CONVERT(Decimal(31,6),0) END) AS [value8],
                                        (CASE WHEN [t31].[value4] < 0 THEN -[t31].[value4] ELSE CONVERT(Decimal(31,6),0) END) AS [value9],
                                        [t32].[ClassificationNumber] 
                                    FROM (
                                        SELECT 
                                            [t30].[value22],
                                            [t30].[value],
                                            [t30].[value2],
                                            [t30].[value3] AS [value3],
                                            [t30].[value4] AS [value4], 
                                            [t30].[value5] AS [value5], 
                                            [t30].[value6] AS [value6] 
                                        FROM (
                                            SELECT 
                                                SUM([t29].[value3]) AS [value], 
                                                SUM([t29].[value4]) AS [value2], 
                                                SUM([t29].[value5]) AS [value3], 
                                                SUM([t29].[value6]) AS [value4], 
                                                SUM([t29].[value7]) AS [value5], 
                                                SUM([t29].[value]) AS [value6], 
                                                [t29].[value2] AS [value22] 
                                            FROM (
                                                SELECT 
                                                    COALESCE([t28].[TargetCurrencyCredit],0) AS [value], 
                                                    [t28].[value2], 
                                                    [t28].[value3], 
                                                    [t28].[value4], 
                                                    [t28].[value5], 
                                                    [t28].[value6], 
                                                    [t28].[value] AS [value7] 
                                                FROM (
                                                    SELECT 
                                                        COALESCE([t27].[TargetCurrencyDebit],0) AS [value], 
                                                        [t27].[TargetCurrencyCredit], 
                                                        [t27].[value2], 
                                                        [t27].[value3], 
                                                        [t27].[value4], 
                                                        [t27].[value5], 
                                                        [t27].[value] AS [value6] 
                                                    FROM (
                                                        SELECT 
                                                            COALESCE([t26].[TargetCurrencyDebit],COALESCE(0 - [t26].[TargetCurrencyCredit],0)) AS [value], 
                                                            [t26].[TargetCurrencyDebit], 
                                                            [t26].[TargetCurrencyCredit], 
                                                            [t26].[value2], 
                                                            [t26].[value3], 
                                                            [t26].[value4], 
                                                            [t26].[value] AS [value5] 
                                                        FROM (
                                                            SELECT 
                                                                (COALESCE([t25].[Debit],0)) - (COALESCE([t25].[Credit],0)) AS [value], 
                                                                [t25].[TargetCurrencyDebit], 
                                                                [t25].[TargetCurrencyCredit], 
                                                                [t25].[value2], 
                                                                [t25].[value3], 
                                                                [t25].[value] AS [value4] 
                                                            FROM (
                                                                SELECT 
                                                                    COALESCE([t24].[Credit],0) AS [value], 
                                                                    [t24].[Debit], 
                                                                    [t24].[Credit], 
                                                                    [t24].[TargetCurrencyDebit], 
                                                                    [t24].[TargetCurrencyCredit], 
                                                                    [t24].[value2], 
                                                                    [t24].[value] AS [value3] 
                                                                FROM (
                                                                    SELECT 
                                                                        COALESCE([t23].[Debit],0) AS [value], 
                                                                        [t23].[Credit], 
                                                                        [t23].[Debit], 
                                                                        [t23].[TargetCurrencyDebit], 
                                                                        [t23].[TargetCurrencyCredit], 
                                                                        [t23].[value] AS [value2] 
                                                                    FROM (
                                                                        SELECT 
                                                                            [t22].[value], 
                                                                            [t22].[Debit], 
                                                                            [t22].[Credit], 
                                                                            [t22].[TargetCurrencyDebit], 
                                                                            [t22].[TargetCurrencyCredit] 
                                                                        FROM (
                                                                            SELECT 
                                                                                [t14].[value], 
                                                                                [t14].[VoucherItemID], 
                                                                                [t14].[VoucherRef], 
                                                                                [t14].[BranchRef], 
                                                                                [t14].[RowNumber], 
                                                                                [t14].[AccountGroupRef], 
                                                                                [t14].[GLRef], 
                                                                                [t14].[SLRef], 
                                                                                [t14].[SLCode], 
                                                                                [t14].[Debit], 
                                                                                [t14].[Credit], 
                                                                                [t14].[CurrencyRef], 
                                                                                [t14].[BaseCurrencyRef], 
                                                                                [t14].[OperationalCurrencyExchangeRateRef], 
                                                                                [t14].[TargetCurrencyRef], 
                                                                                [t14].[TargetCurrencyDebit], 
                                                                                [t14].[TargetCurrencyCredit], 
                                                                                [t14].[OperationalCurrencyExchangeRate], 
                                                                                [t14].[BaseCurrencyExchangeRateRef], 
                                                                                [t14].[BaseCurrencyExchangeRate], 
                                                                                [t14].[CurrencyDebit], 
                                                                                [t14].[CurrencyCredit], 
                                                                                [t14].[Description], 
                                                                                [t14].[Description_En], 
                                                                                [t14].[FollowUpNumber], 
                                                                                [t14].[FollowUpDate], 
                                                                                [t14].[DLLevel4], 
                                                                                [t14].[DLLevel5], 
                                                                                [t14].[DLLevel6], 
                                                                                [t14].[DLLevel7], 
                                                                                [t14].[DLLevel8], 
                                                                                [t14].[DLLevel9], 
                                                                                [t14].[DLLevel10], 
                                                                                [t14].[DLLevel11], 
                                                                                [t14].[DLLevel12], 
                                                                                [t14].[DLLevel13], 
                                                                                [t14].[DLLevel14], 
                                                                                [t14].[DLLevel15], 
                                                                                [t14].[DLLevel16], 
                                                                                [t14].[DLLevel17], 
                                                                                [t14].[DLLevel18], 
                                                                                [t14].[DLLevel19], 
                                                                                [t14].[DLLevel20], 
                                                                                [t14].[DLTypeRef4], 
                                                                                [t14].[DLTypeRef5], 
                                                                                [t14].[DLTypeRef6], 
                                                                                [t14].[DLTypeRef7], 
                                                                                [t14].[DLTypeRef8], 
                                                                                [t14].[DLTypeRef9], 
                                                                                [t14].[DLTypeRef10], 
                                                                                [t14].[DLTypeRef11], 
                                                                                [t14].[DLTypeRef12], 
                                                                                [t14].[DLTypeRef13], 
                                                                                [t14].[DLTypeRef14], 
                                                                                [t14].[DLTypeRef15], 
                                                                                [t14].[DLTypeRef16], 
                                                                                [t14].[DLTypeRef17], 
                                                                                [t14].[DLTypeRef18], 
                                                                                [t14].[DLTypeRef19], 
                                                                                [t14].[DLTypeRef20], 
                                                                                [t14].[TaxAccountType], 
                                                                                [t14].[TaxStateType], 
                                                                                [t14].[TransactionType], 
                                                                                [t14].[PurchaseOrSale], 
                                                                                [t14].[ItemOrService], 
                                                                                [t14].[Version], 
                                                                                [t14].[IsCurrencyBased], 
                                                                                [t14].[Quantity], 
                                                                                [t14].[PartyRef], 
                                                                                [t14].[TaxAmount], 
                                                                                [t14].[TollAmount], 
                                                                                [t14].[PeriodNature], 
                                                                                [t14].[IsTaxPrepaymentUnrefundable], 
                                                                                [t14].[IsTollPrepaymentUnrefundable] 
                                                                            FROM (
                                                                                SELECT 
                                                                                    COALESCE([t0].[DLLevel4],N'') AS [value], 
                                                                                    [t0].[VoucherItemID], 
                                                                                    [t0].[VoucherRef], 
                                                                                    [t0].[BranchRef], 
                                                                                    [t0].[RowNumber], 
                                                                                    [t0].[AccountGroupRef], 
                                                                                    [t0].[GLRef], 
                                                                                    [t0].[SLRef], 
                                                                                    [t0].[SLCode], 
                                                                                    [t0].[Debit], 
                                                                                    [t0].[Credit], 
                                                                                    [t0].[CurrencyRef], 
                                                                                    [t0].[BaseCurrencyRef], 
                                                                                    [t0].[OperationalCurrencyExchangeRateRef], 
                                                                                    [t0].[TargetCurrencyRef], 
                                                                                    [t0].[TargetCurrencyDebit], 
                                                                                    [t0].[TargetCurrencyCredit], 
                                                                                    [t0].[OperationalCurrencyExchangeRate], 
                                                                                    [t0].[BaseCurrencyExchangeRateRef], 
                                                                                    [t0].[BaseCurrencyExchangeRate], 
                                                                                    [t0].[CurrencyDebit], 
                                                                                    [t0].[CurrencyCredit], 
                                                                                    [t0].[Description], 
                                                                                    [t0].[Description_En], 
                                                                                    [t0].[FollowUpNumber], 
                                                                                    [t0].[FollowUpDate], 
                                                                                    [t0].[DLLevel4], 
                                                                                    [t0].[DLLevel5], 
                                                                                    [t0].[DLLevel6], 
                                                                                    [t0].[DLLevel7], 
                                                                                    [t0].[DLLevel8], 
                                                                                    [t0].[DLLevel9], 
                                                                                    [t0].[DLLevel10], 
                                                                                    [t0].[DLLevel11], 
                                                                                    [t0].[DLLevel12], 
                                                                                    [t0].[DLLevel13], 
                                                                                    [t0].[DLLevel14], 
                                                                                    [t0].[DLLevel15], 
                                                                                    [t0].[DLLevel16], 
                                                                                    [t0].[DLLevel17], 
                                                                                    [t0].[DLLevel18], 
                                                                                    [t0].[DLLevel19], 
                                                                                    [t0].[DLLevel20], 
                                                                                    [t0].[DLTypeRef4], 
                                                                                    [t0].[DLTypeRef5], 
                                                                                    [t0].[DLTypeRef6], 
                                                                                    [t0].[DLTypeRef7], 
                                                                                    [t0].[DLTypeRef8], 
                                                                                    [t0].[DLTypeRef9], 
                                                                                    [t0].[DLTypeRef10], 
                                                                                    [t0].[DLTypeRef11], 
                                                                                    [t0].[DLTypeRef12], 
                                                                                    [t0].[DLTypeRef13], 
                                                                                    [t0].[DLTypeRef14], 
                                                                                    [t0].[DLTypeRef15], 
                                                                                    [t0].[DLTypeRef16], 
                                                                                    [t0].[DLTypeRef17], 
                                                                                    [t0].[DLTypeRef18], 
                                                                                    [t0].[DLTypeRef19], 
                                                                                    [t0].[DLTypeRef20], 
                                                                                    [t0].[TaxAccountType], 
                                                                                    [t0].[TaxStateType], 
                                                                                    [t0].[TransactionType], 
                                                                                    [t0].[PurchaseOrSale], 
                                                                                    [t0].[ItemOrService], 
                                                                                    [t0].[Version], 
                                                                                    [t0].[IsCurrencyBased], 
                                                                                    [t0].[Quantity], 
                                                                                    [t0].[PartyRef], 
                                                                                    [t0].[TaxAmount], 
                                                                                    [t0].[TollAmount], 
                                                                                    [t0].[PeriodNature], 
                                                                                    [t0].[IsTaxPrepaymentUnrefundable], 
                                                                                    [t0].[IsTollPrepaymentUnrefundable] 
                                                                                FROM [FIN3].[VoucherItem] AS [t0] 
                                                                                INNER JOIN [FIN3].[Voucher] AS [t1] ON [t0].[VoucherRef] = [t1].[VoucherID] 
                                                                                CROSS APPLY (( SELECT NULL AS [EMPTY] ) AS [t2] 
                                                                                OUTER APPLY ( 
                                                                                    SELECT NULL AS [EMPTY] 
                                                                                    FROM ( 
                                                                                        SELECT [t3].[VoucherRef] 
                                                                                        FROM [FIN3].[VoucherItem] AS [t3] 
                                                                                        WHERE 1 = 1 
                                                                                        GROUP BY [t3].[VoucherRef] 
                                                                                    ) AS [t4] 
                                                                                    WHERE [t1].[VoucherID] = [t4].[VoucherRef] 
                                                                                ) AS [t5]
                                                                                INNER JOIN [GNR3].[Branch] AS [t6] ON [t1].[BranchRef] = [t6].[BranchID] )
                                                                                WHERE ([t0].[DLLevel4] IS NOT NULL) /*---abbasi-*/ and [t0].GLRef in (7) /*---abbasi-*/  
                                                                                --AND (([t1].[Date]) >= '2024-03-20 00:00:00') 
                                                                                --AND (([t1].[Date]) <= '2025-06-21 00:00:00') 
                                                                                AND ((([t1].[VoucherTypeRef] IN (1, 2, 3, 4, 8, 10, 12, 13, 14, 15, 16, 17, 18)) AND ([t1].[FiscalYearRef] IN (4, 5))) 
                                                                                    OR ((([t1].[VoucherTypeRef] = 6) OR ([t1].[VoucherTypeRef] = 11)) AND ([t1].[FiscalYearRef] = 4))) 
                                                                                AND ([t1].[LedgerRef] IN (1)) 
                                                                                AND (NOT ([t1].[IsTemporary] = 1)) 
                                                                                AND ([t1].[State] <> 2) 
                                                                                AND (1 = 1) 
                                                                                
                                                                                UNION ALL 
                                                                                
                                                                                SELECT 
                                                                                    COALESCE([t7].[DLLevel5],N'') AS [value], 
                                                                                    [t7].[VoucherItemID], 
                                                                                    [t7].[VoucherRef], 
                                                                                    [t7].[BranchRef], 
                                                                                    [t7].[RowNumber], 
                                                                                    [t7].[AccountGroupRef], 
                                                                                    [t7].[GLRef], 
                                                                                    [t7].[SLRef], 
                                                                                    [t7].[SLCode], 
                                                                                    [t7].[Debit], 
                                                                                    [t7].[Credit], 
                                                                                    [t7].[CurrencyRef], 
                                                                                    [t7].[BaseCurrencyRef], 
                                                                                    [t7].[OperationalCurrencyExchangeRateRef], 
                                                                                    [t7].[TargetCurrencyRef], 
                                                                                    [t7].[TargetCurrencyDebit], 
                                                                                    [t7].[TargetCurrencyCredit], 
                                                                                    [t7].[OperationalCurrencyExchangeRate], 
                                                                                    [t7].[BaseCurrencyExchangeRateRef], 
                                                                                    [t7].[BaseCurrencyExchangeRate], 
                                                                                    [t7].[CurrencyDebit], 
                                                                                    [t7].[CurrencyCredit], 
                                                                                    [t7].[Description], 
                                                                                    [t7].[Description_En], 
                                                                                    [t7].[FollowUpNumber], 
                                                                                    [t7].[FollowUpDate], 
                                                                                    [t7].[DLLevel4], 
                                                                                    [t7].[DLLevel5], 
                                                                                    [t7].[DLLevel6], 
                                                                                    [t7].[DLLevel7], 
                                                                                    [t7].[DLLevel8], 
                                                                                    [t7].[DLLevel9], 
                                                                                    [t7].[DLLevel10], 
                                                                                    [t7].[DLLevel11], 
                                                                                    [t7].[DLLevel12], 
                                                                                    [t7].[DLLevel13], 
                                                                                    [t7].[DLLevel14], 
                                                                                    [t7].[DLLevel15], 
                                                                                    [t7].[DLLevel16], 
                                                                                    [t7].[DLLevel17], 
                                                                                    [t7].[DLLevel18], 
                                                                                    [t7].[DLLevel19], 
                                                                                    [t7].[DLLevel20], 
                                                                                    [t7].[DLTypeRef4], 
                                                                                    [t7].[DLTypeRef5], 
                                                                                    [t7].[DLTypeRef6], 
                                                                                    [t7].[DLTypeRef7], 
                                                                                    [t7].[DLTypeRef8], 
                                                                                    [t7].[DLTypeRef9], 
                                                                                    [t7].[DLTypeRef10], 
                                                                                    [t7].[DLTypeRef11], 
                                                                                    [t7].[DLTypeRef12], 
                                                                                    [t7].[DLTypeRef13], 
                                                                                    [t7].[DLTypeRef14], 
                                                                                    [t7].[DLTypeRef15], 
                                                                                    [t7].[DLTypeRef16], 
                                                                                    [t7].[DLTypeRef17], 
                                                                                    [t7].[DLTypeRef18], 
                                                                                    [t7].[DLTypeRef19], 
                                                                                    [t7].[DLTypeRef20], 
                                                                                    [t7].[TaxAccountType], 
                                                                                    [t7].[TaxStateType], 
                                                                                    [t7].[TransactionType], 
                                                                                    [t7].[PurchaseOrSale], 
                                                                                    [t7].[ItemOrService], 
                                                                                    [t7].[Version], 
                                                                                    [t7].[IsCurrencyBased], 
                                                                                    [t7].[Quantity], 
                                                                                    [t7].[PartyRef], 
                                                                                    [t7].[TaxAmount], 
                                                                                    [t7].[TollAmount], 
                                                                                    [t7].[PeriodNature], 
                                                                                    [t7].[IsTaxPrepaymentUnrefundable], 
                                                                                    [t7].[IsTollPrepaymentUnrefundable] 
                                                                                FROM [FIN3].[VoucherItem] AS [t7] 
                                                                                INNER JOIN [FIN3].[Voucher] AS [t8] ON [t7].[VoucherRef] = [t8].[VoucherID] 
                                                                                CROSS APPLY (( SELECT NULL AS [EMPTY] ) AS [t9] 
                                                                                OUTER APPLY ( 
                                                                                    SELECT NULL AS [EMPTY] 
                                                                                    FROM ( 
                                                                                        SELECT [t10].[VoucherRef] 
                                                                                        FROM [FIN3].[VoucherItem] AS [t10] 
                                                                                        WHERE 1 = 1 
                                                                                        GROUP BY [t10].[VoucherRef] 
                                                                                    ) AS [t11] 
                                                                                    WHERE [t8].[VoucherID] = [t11].[VoucherRef] 
                                                                                ) AS [t12]
                                                                                INNER JOIN [GNR3].[Branch] AS [t13] ON [t8].[BranchRef] = [t13].[BranchID] )
                                                                                WHERE ([t7].[DLLevel5] IS NOT NULL) /*---abbasi-*/ and [t7].GLRef in (7) /*---abbasi-*/ 
                                                                                --AND (([t8].[Date]) >= '2024-03-20 00:00:00') 
                                                                                --AND (([t8].[Date]) <= '2025-06-21 00:00:00') 
                                                                                AND ((([t8].[VoucherTypeRef] IN (1, 2, 3, 4, 8, 10, 12, 13, 14, 15, 16, 17, 18)) AND ([t8].[FiscalYearRef] IN (4, 5))) 
                                                                                    OR ((([t8].[VoucherTypeRef] = 6) OR ([t8].[VoucherTypeRef] = 11)) AND ([t8].[FiscalYearRef] = 4))) 
                                                                                AND ([t8].[LedgerRef] IN (1)) 
                                                                                AND (NOT ([t8].[IsTemporary] = 1)) 
                                                                                AND ([t8].[State] <> 2) 
                                                                                AND (1 = 1)
                                                                            ) AS [t14] 
                                                                            
                                                                            UNION ALL 
                                                                            
                                                                            SELECT 
                                                                                COALESCE([t15].[DLLevel6],N'') AS [value], 
                                                                                [t15].[VoucherItemID], 
                                                                                [t15].[VoucherRef], 
                                                                                [t15].[BranchRef], 
                                                                                [t15].[RowNumber], 
                                                                                [t15].[AccountGroupRef], 
                                                                                [t15].[GLRef], 
                                                                                [t15].[SLRef], 
                                                                                [t15].[SLCode], 
                                                                                [t15].[Debit], 
                                                                                [t15].[Credit], 
                                                                                [t15].[CurrencyRef], 
                                                                                [t15].[BaseCurrencyRef], 
                                                                                [t15].[OperationalCurrencyExchangeRateRef], 
                                                                                [t15].[TargetCurrencyRef], 
                                                                                [t15].[TargetCurrencyDebit], 
                                                                                [t15].[TargetCurrencyCredit], 
                                                                                [t15].[OperationalCurrencyExchangeRate], 
                                                                                [t15].[BaseCurrencyExchangeRateRef], 
                                                                                [t15].[BaseCurrencyExchangeRate], 
                                                                                [t15].[CurrencyDebit], 
                                                                                [t15].[CurrencyCredit], 
                                                                                [t15].[Description], 
                                                                                [t15].[Description_En], 
                                                                                [t15].[FollowUpNumber], 
                                                                                [t15].[FollowUpDate], 
                                                                                [t15].[DLLevel4], 
                                                                                [t15].[DLLevel5], 
                                                                                [t15].[DLLevel6], 
                                                                                [t15].[DLLevel7], 
                                                                                [t15].[DLLevel8], 
                                                                                [t15].[DLLevel9], 
                                                                                [t15].[DLLevel10], 
                                                                                [t15].[DLLevel11], 
                                                                                [t15].[DLLevel12], 
                                                                                [t15].[DLLevel13], 
                                                                                [t15].[DLLevel14], 
                                                                                [t15].[DLLevel15], 
                                                                                [t15].[DLLevel16], 
                                                                                [t15].[DLLevel17], 
                                                                                [t15].[DLLevel18], 
                                                                                [t15].[DLLevel19], 
                                                                                [t15].[DLLevel20], 
                                                                                [t15].[DLTypeRef4], 
                                                                                [t15].[DLTypeRef5], 
                                                                                [t15].[DLTypeRef6], 
                                                                                [t15].[DLTypeRef7], 
                                                                                [t15].[DLTypeRef8], 
                                                                                [t15].[DLTypeRef9], 
                                                                                [t15].[DLTypeRef10], 
                                                                                [t15].[DLTypeRef11], 
                                                                                [t15].[DLTypeRef12], 
                                                                                [t15].[DLTypeRef13], 
                                                                                [t15].[DLTypeRef14], 
                                                                                [t15].[DLTypeRef15], 
                                                                                [t15].[DLTypeRef16], 
                                                                                [t15].[DLTypeRef17], 
                                                                                [t15].[DLTypeRef18], 
                                                                                [t15].[DLTypeRef19], 
                                                                                [t15].[DLTypeRef20], 
                                                                                [t15].[TaxAccountType], 
                                                                                [t15].[TaxStateType], 
                                                                                [t15].[TransactionType], 
                                                                                [t15].[PurchaseOrSale], 
                                                                                [t15].[ItemOrService], 
                                                                                [t15].[Version], 
                                                                                [t15].[IsCurrencyBased], 
                                                                                [t15].[Quantity], 
                                                                                [t15].[PartyRef], 
                                                                                [t15].[TaxAmount], 
                                                                                [t15].[TollAmount], 
                                                                                [t15].[PeriodNature], 
                                                                                [t15].[IsTaxPrepaymentUnrefundable], 
                                                                                [t15].[IsTollPrepaymentUnrefundable] 
                                                                            FROM [FIN3].[VoucherItem] AS [t15] 
                                                                            INNER JOIN [FIN3].[Voucher] AS [t16] ON [t15].[VoucherRef] = [t16].[VoucherID] 
                                                                            CROSS APPLY (( SELECT NULL AS [EMPTY] ) AS [t17] 
                                                                            OUTER APPLY ( 
                                                                                SELECT NULL AS [EMPTY] 
                                                                                FROM ( 
                                                                                    SELECT [t18].[VoucherRef] 
                                                                                    FROM [FIN3].[VoucherItem] AS [t18] 
                                                                                    WHERE 1 = 1 
                                                                                    GROUP BY [t18].[VoucherRef] 
                                                                                ) AS [t19] 
                                                                                WHERE [t16].[VoucherID] = [t19].[VoucherRef] 
                                                                            ) AS [t20]
                                                                            INNER JOIN [GNR3].[Branch] AS [t21] ON [t16].[BranchRef] = [t21].[BranchID] )
                                                                            WHERE ([t15].[DLLevel6] IS NOT NULL) /*---abbasi-*/ and [t15].GLRef in (7) /*---abbasi-*/ 
                                                                            --AND (([t16].[Date]) >= '2024-03-20 00:00:00') 
                                                                            --AND (([t16].[Date]) <= '2025-06-21 00:00:00') 
                                                                            AND ((([t16].[VoucherTypeRef] IN (1, 2, 3, 4, 8, 10, 12, 13, 14, 15, 16, 17, 18)) AND ([t16].[FiscalYearRef] IN (4, 5))) 
                                                                                OR ((([t16].[VoucherTypeRef] = 6) OR ([t16].[VoucherTypeRef] = 11)) AND ([t16].[FiscalYearRef] = 4))) 
                                                                            AND ([t16].[LedgerRef] IN (1)) 
                                                                            AND (NOT ([t16].[IsTemporary] = 1)) 
                                                                            AND ([t16].[State] <> 2) 
                                                                            AND (1 = 1)
                                                                        ) AS [t22]
                                                                    ) AS [t23]
                                                                ) AS [t24]
                                                            ) AS [t25]
                                                        ) AS [t26]
                                                    ) AS [t27]
                                                ) AS [t28]
                                            ) AS [t29] 
                                            GROUP BY [t29].[value2]
                                        ) AS [t30]
                                    ) AS [t31] 
                                    INNER JOIN [FIN3].[DL] AS [t32] ON [t31].[value22] = [t32].[Code] and [t32].DLTypeRef in (1,2) 
                                ) AS [t33]                                 
                            ) xx
                        ) x
                    ) AS x2 
                    inner join sls3.Customer t100 on t100.PartyRef=ReferenceID
                    
                    GROUP BY R_N 
                    ORDER BY Title";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static dynamic getSepidarFinanceBalanceList(string companyName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"DECLARE @CLRef int = -1
DECLARE @GLRef int = -1
declare @PartyID int=null
DECLARE @SLRef int = 117  --حسابهای دریافتنی
DECLARE @CurrencyRef int = -1
DECLARE @TrackingNumber nvarchar(2) = '-1'
DECLARE @FromDate datetime 
select @fromDate =min(StartDate) from fmk.FiscalYear where Status=1 
DECLARE @ToDate datetime  
select @ToDate =max(endDate) from fmk.FiscalYear where Status=1
DECLARE @FromNumber int = -1
DECLARE @ToNumber int = -1
DECLARE @FromSecNumber int = -1
DECLARE @ToSecNumber int = -1
DECLARE @OpeningType nvarchar(1) = '10' -- فرضی
DECLARE @ClosingType nvarchar(2) = '7' -- فرضی
DECLARE @CloseAccountsType nvarchar(2) = '5' -- فرضی
DECLARE @LastDayOfFirstYear datetime 
select @LastDayOfFirstYear =endDate from fmk.FiscalYear where Status=1 and StartDate in(select min(StartDate) from fmk.FiscalYear where Status=1  )
DECLARE @FirstDayOfLastYear datetime
select @FirstDayOfLastYear =StartDate from fmk.FiscalYear where Status=1 and StartDate in(select max(StartDate) from fmk.FiscalYear where Status=1  )

SELECT
  
 p.PartyId CustomerID
 
 ,sum([Debit]) Debit
 ,sum([Credit])Credit
,
sum([Debit]) DebitBalance
 ,sum([Credit])CreditBalance
 ,[DLCode] Code
FROM ACC.[vwVoucherItem] vi
LEFT JOIN (SELECT
    g.VoucherRef
   ,g1.Number
   ,g1.FromVoucherNumber
   ,g1.ToVoucherNumber
  FROM ACC.vwGLVoucher g1
  INNER JOIN ACC.vwGLVoucherItem g
    ON g1.GLVoucherId = g.GLVoucherRef) GLVoucher
  ON GLVoucher.VoucherRef = vi.VoucherRef
  left join gnr.party p on p.DLRef=vi.DLRef
WHERE 
 (VoucherDate >= @FromDate
OR -1 = @FromDate)
AND (VoucherDate <= @ToDate
OR -1 = @ToDate)
AND (VoucherNumber >= @FromNumber
OR -1 = @FromNumber)
AND (VoucherNumber <= @ToNumber
OR -1 = @ToNumber)
AND (VoucherSecondaryNumber >= @FromSecNumber
OR -1 = @FromSecNumber)
AND (VoucherSecondaryNumber <= @ToSecNumber
OR -1 = @ToSecNumber)
AND ((VoucherType IN (1, 2, 6)) --General, OtherSystems, CurrencyConversion
OR (VoucherType = @OpeningType
AND VoucherDate <= @LastDayOfFirstYear)
OR (VoucherType = @ClosingType
AND VoucherDate >= @FirstDayOfLastYear)
OR (VoucherType = @CloseAccountsType)
--OR (vi.VoucherNumber BETWEEN GLVoucher.FromVoucherNumber AND GLVoucher.ToVoucherNumber)
)
AND (CLRef = @CLRef
OR -1 = @CLRef)
AND (GLRef = @GLRef
OR -1 = @GLRef)
AND (AccountSLRef = @SLRef
OR -1 = @SLRef)
AND (@PartyID is null or (p.PartyId = @PartyID
OR -1 = @PartyID))
AND (CurrencyRef = @CurrencyRef
OR -1 = @CurrencyRef)
AND (TrackingNumber = @TrackingNumber
OR '-1' = @TrackingNumber)
group by  p.PartyId

 ,[DLCode]
 order by  p.PartyId

";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static void syncRahkaranStoreList(dynamic dataArray, string companyId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            if (dataArray != null)
            {

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    foreach (var item in dataArray)
                    {
                        using (SqlCommand cmd = new SqlCommand("InsertStoreFinance", conn))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@companyId", Convert.ToInt32(companyId));
                            cmd.Parameters.AddWithValue("@StoreID", (int)(item["StoreID"]));
                            cmd.Parameters.AddWithValue("@Name", (string)item["Name"]);
                            cmd.Parameters.AddWithValue("@code", (string)item["code"]);
                            cmd.ExecuteNonQuery();

                        }
                    }
                }
            }

        }
        public static void syncRahkaranSaleOfficeList(string jsonArray, string companyId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("InsertSaleOfficeFinance", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@JsonData", jsonArray);
                    cmd.Parameters.AddWithValue("@companyId", Convert.ToInt32(companyId));

                    cmd.ExecuteNonQuery();
                }
            }
        }
        public static void syncRahkaranReceivableNote(string jsonArray, string companyId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("InsertRecievableNoteData", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@JsonData", jsonArray);
                    cmd.Parameters.AddWithValue("@companyId", Convert.ToInt32(companyId));

                    cmd.ExecuteNonQuery();
                }
            }
        }
        public static void syncRahkaranPayableNote(string jsonArray, string companyId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("InsertPayableNoteData", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@JsonData", jsonArray);
                    cmd.Parameters.AddWithValue("@companyId", Convert.ToInt32(companyId));

                    cmd.ExecuteNonQuery();
                }
            }
        }
        public static void syncRahkaranVoucherItem(string jsonArray, string companyId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("InsertVoucherItemData", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@JsonData", jsonArray);
                    cmd.Parameters.AddWithValue("@companyId", Convert.ToInt32(companyId));

                    cmd.ExecuteNonQuery();
                }
            }
        }
        public static void syncRahkaranBalanceList(string jsonArray, string companyId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("InsertBalanceData", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@JsonData", jsonArray);
                    cmd.Parameters.AddWithValue("@companyId", Convert.ToInt32(companyId));

                    cmd.ExecuteNonQuery();
                }
            }
        }


        public static dynamic getRahkaranPartList(string companyName, string maxPartId, string lastModificationDate)
        {

            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select PartID,code,Name,MajorUnitRef,CreationDate,LastModificationDate from LGS3.Part where PartID>" + maxPartId + " or lastModificationDate>'" + lastModificationDate + "'";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static void syncRahkaranPartList(dynamic dataArray, string companyId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            if (dataArray != null)
            {

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    foreach (var item in dataArray)
                    {
                        using (SqlCommand cmd = new SqlCommand("InsertPartFinance", conn))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@companyId", Convert.ToInt32(companyId));
                            cmd.Parameters.AddWithValue("@PartID", (int)(item["PartID"]));
                            cmd.Parameters.AddWithValue("@Name", (string)item["Name"]);
                            cmd.Parameters.AddWithValue("@MajorUnitRef", (string)item["MajorUnitRef"]);
                            cmd.Parameters.AddWithValue("@code", (string)item["code"]);
                            cmd.Parameters.AddWithValue("@CreationDate", (string)item["CreationDate"]);
                            cmd.Parameters.AddWithValue("@LastModificationDate", (string)item["LastModificationDate"]);
                            cmd.ExecuteNonQuery();

                        }
                    }
                }
            }

        }

        public static dynamic getSepidarCustomerList(string companyName, string maxPartyId, string lastModificationDate)
        {
            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select c.partyId customerId,c.partyId,
	                                (c.Name + ' ' + c.LastName) AS fullName,c.CreationDate ,c.LastModificationDate 
	                                from GNR.Party c ";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static dynamic getRahkaranCustomerList(string companyName, string maxPartyId, string lastModificationDate)
        {

            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select c.customerId,p.partyId,
	                                p.fullName,p.CreationDate ,p.LastModificationDate 
	                                from sls3.customer c
	                                right join gnr3.Party p on p.PartyID=c.PartyRef";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static void syncRahkaranCustomerList(dynamic dataArray, string companyId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            if (dataArray != null)
            {
                string jsonData = JsonConvert.SerializeObject(dataArray); // نیازمند Newtonsoft.Json

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("InsertCustomerFinance", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@companyId", Convert.ToInt32(companyId));
                        cmd.Parameters.AddWithValue("@JsonData", jsonData);
                        cmd.ExecuteNonQuery();
                    }
                }
            }
        }


        public static dynamic getSepidarInvoiceList(string companyName, string maxInvoiceId, string lastModificationDate)
        {
            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select
	                                c.PartyID
	                                ,c.PartyID CustomerID
	                                ,i.invoiceId
	                                ,i.Number
	                                ,i.date
	                                ,i.price
	                                ,i.Addition+i.Tax AdditionAmount
	                                ,i.Discount ReductionAmount
	                                ,i.NetPrice EffectiveNetPrice
	                                ,i.NetPrice
	                                ,i.CreationDate
	                                ,i.LastModificationDate
	                                ,i.Date
                                    ,i.state as StateId


	                                from sls.Invoice i
		                            left join gnr.party c on c.PartyId=i.CustomerPartyRef
									where i.state!=2";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static dynamic getRahkaranInvoiceList(string companyName, string maxInvoiceId, string lastModificationDate)
        {

            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select
		                            p.PartyID
		                            ,c.CustomerID
		                            ,i.invoiceId
		                            ,i.Number
                                    ,i.date
                                    ,i.price
                                    ,i.AdditionAmount
                                    ,i.ReductionAmount
                                    ,i.EffectiveNetPrice
                                    ,i.NetPrice
                                    ,i.CreationDate
                                    ,i.LastModificationDate
                                    ,i.Date
                                    ,i.SettlementRespite
									,i.SettlementDate
                                    ,i.Status as StateId
		                            from sls3.Invoice i
		                            inner join sls3.customer c on c.CustomerID=i.CustomerRef
		                            inner join gnr3.party p on p.PartyID=c.PartyRef

									where i.Status!=6";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static dynamic getSepidarInvoiceListReturn(string companyName, string maxInvoiceId, string lastModificationDate)
        {

            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select
	                                c.PartyID
	                                ,c.PartyID CustomerID
	                                ,i.returnedInvoiceId invoiceId
	                                ,i.Number
	                                ,i.date
	                                ,i.price
	                                ,i.Addition+i.Tax AdditionAmount
	                                ,i.Discount ReductionAmount
	                                ,i.NetPrice EffectiveNetPrice
	                                ,i.NetPrice
	                                ,i.CreationDate
	                                ,i.LastModificationDate
	                                ,i.Date
									, null as StateId
									
	                                from sls.ReturnedInvoice i
		                            inner join gnr.party c on c.PartyId=i.CustomerPartyRef
";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        public static dynamic getRahkaranInvoiceListReturn(string companyName, string maxInvoiceId, string lastModificationDate)
        {

            string connectionString = ConfigurationManager.ConnectionStrings[companyName].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string sql = @"select
		                            p.PartyID
		                            ,c.CustomerID
		                            ,i.returnInvoiceId invoiceId
		                            ,i.Number
                                    ,i.date
                                    ,i.price
                                    ,i.AdditionAmount
                                    ,i.ReductionAmount
                                    ,i.EffectiveNetPrice
                                    ,i.NetPrice
                                    ,i.CreationDate
                                    ,i.LastModificationDate
                                    ,i.Date
									,i.Status as StateId
		                            from sls3.ReturnInvoice i
		                            inner join sls3.customer c on c.CustomerID=i.CustomerRef
		                            inner join gnr3.party p on p.PartyID=c.PartyRef
									where i.Status!=6";
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    connection.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }


        }
        //public static void syncRahkaranInvoiceList(dynamic dataArray, string companyId, int isReturned)
        //{
        //    string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

        //    if (dataArray != null)
        //    {

        //        using (SqlConnection conn = new SqlConnection(connectionString))
        //        {
        //            conn.Open();
        //            foreach (var item in dataArray)
        //            {
        //                using (SqlCommand cmd = new SqlCommand("InsertInvoiceFinance", conn))
        //                {
        //                    cmd.CommandType = CommandType.StoredProcedure;
        //                    cmd.Parameters.AddWithValue("@isReturned", Convert.ToInt32(isReturned));
        //                    cmd.Parameters.AddWithValue("@companyId", Convert.ToInt32(companyId));
        //                    cmd.Parameters.AddWithValue("@PartyID", (int)item["PartyID"]);
        //                    cmd.Parameters.AddWithValue("@CustomerID", (int)item["CustomerID"]);
        //                    cmd.Parameters.AddWithValue("@invoiceId", (int)item["invoiceId"]);
        //                    cmd.Parameters.AddWithValue("@Number", (long)item["Number"]);
        //                    cmd.Parameters.AddWithValue("@date", (DateTime)item["date"]);
        //                    cmd.Parameters.AddWithValue("@price", (decimal)item["price"]);
        //                    cmd.Parameters.AddWithValue("@AdditionAmount", (decimal)item["AdditionAmount"]);
        //                    cmd.Parameters.AddWithValue("@ReductionAmount", (decimal)item["ReductionAmount"]);
        //                    cmd.Parameters.AddWithValue("@EffectiveNetPrice", (decimal)item["EffectiveNetPrice"]);
        //                    cmd.Parameters.AddWithValue("@NetPrice", (decimal)item["NetPrice"]);
        //                    cmd.Parameters.AddWithValue("@CreationDate", (DateTime)item["CreationDate"]);
        //                    cmd.Parameters.AddWithValue("@LastModificationDate", (DateTime)item["LastModificationDate"]);

        //                    cmd.ExecuteNonQuery();

        //                }
        //            }
        //        }
        //    }

        //}
        public static void syncRahkaranInvoiceList(dynamic dataArray, string companyId, int isReturned)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            if (dataArray != null)
            {
                string jsonData = JsonConvert.SerializeObject(dataArray);

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand("InsertInvoiceFinance1", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@isReturned", isReturned);
                        cmd.Parameters.AddWithValue("@companyId", Convert.ToInt32(companyId));
                        cmd.Parameters.AddWithValue("@JsonData", jsonData);
                        cmd.ExecuteNonQuery();
                    }
                }
            }
        }

        /// /////////////////////////////////////////////////////////////////////////////////////////////////////
        public static string GetCompanyInfo(string CompanyName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand("GetCompanyInfo", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@companyName", CompanyName);
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable); ;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return "-1";
            }

        }
        public static string GetMaxPartData(string CompanyName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand("GetMaxPartData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@companyName", CompanyName);
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return "-1";
            }

        }
        public static string GetMaxProductData(string CompanyName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand("GetMaxProductData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@companyName", CompanyName);
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return "-1";
            }

        }
        public static void updateTargetHeader()
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand("updateTargetHeader", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }

        }
        public static string GetMaxCustomerData(string CompanyName)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand("GetMaxCustomerData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@companyName", CompanyName);
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return "-1";
            }

        }
        public static string GetMaxInvoiceData(string CompanyName, int isReturned)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand("GetMaxInvoiceData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@companyName", CompanyName);
                    command.Parameters.AddWithValue("@isReturned", isReturned);
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return "-1";
            }

        }
        public static string GetMaxInvoiceItemData(string CompanyName, int isReturned, int saleType)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            try
            {

                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand command = new SqlCommand("GetMaxInvoiceItemData", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@companyName", CompanyName);
                    command.Parameters.AddWithValue("@isReturned", isReturned);
                    command.Parameters.AddWithValue("@saleType", saleType);
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataTable);
                }
                return JsonConvert.SerializeObject(dataTable);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return "-1";
            }

        }

        /// /////////////////////////////////////////////////////////////////////////////////////////////////////
        public static int updateServiceLog(int distId, int companyId, int srcIsDist, string srcDesc, string updateType, int serviceType, string dateFrom, string dateTo, int success, int cnt, int logId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable dataTable = new DataTable();
            int returnLogId = 0;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                SqlCommand command = new SqlCommand("InsertServiceLog", connection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@distId", distId);
                command.Parameters.AddWithValue("@companyId", companyId);
                command.Parameters.AddWithValue("@srcIsDist", srcIsDist);
                command.Parameters.AddWithValue("@srcDesc", srcDesc);
                command.Parameters.AddWithValue("@updateType", updateType);
                command.Parameters.AddWithValue("@serviceType", serviceType);
                command.Parameters.AddWithValue("@dateFrom", dateFrom);
                command.Parameters.AddWithValue("@dateTo", dateTo);
                command.Parameters.AddWithValue("@success", success);
                command.Parameters.AddWithValue("@cnt", cnt);
                command.Parameters.AddWithValue("@logId", logId);

                SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
                    returnLogId = Convert.ToInt32(reader["LogId"]); // Get the LogId from the result set
                }

                reader.Close();
            }
            return returnLogId;
        }

        public static string GetCurrentPersianDate()
        {
            // Get current date in Gregorian
            DateTime currentDate = DateTime.Now;

            // Create a Persian calendar instance
            PersianCalendar persianCalendar = new PersianCalendar();

            // Get the Persian year, month, and day
            int year = persianCalendar.GetYear(currentDate);
            int month = persianCalendar.GetMonth(currentDate);
            int day = persianCalendar.GetDayOfMonth(currentDate);

            // Format the Persian date as YYYYMMDD
            return $"{year:D4}{month:D2}{day:D2}";
        }

        public static dynamic getProforma(dynamic data, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable result = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("getProforma", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.NVarChar)).Value = infoUid;
                    cmd.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar)).Value = data["companyId"];
                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(result);
                }

                return result;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic GetProformaItems(dynamic data, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable result = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("GetProformaItems", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.NVarChar)).Value = infoUid;
                    cmd.Parameters.Add(new SqlParameter("@ProformaID", SqlDbType.NVarChar)).Value = data["proformaId"];
                    conn.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(dataSet);
                    JArray proformaItemData = JArray.FromObject(dataSet.Tables[0]);
                    JArray proformaItemProductData = JArray.FromObject(dataSet.Tables[1]);
                    return new JObject
                    {
                        ["proformaItemData"] = proformaItemData,
                        ["proformaItemProductData"] = proformaItemProductData
                    };
                }

            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic GetProformaItemProducts(dynamic data, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable result = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("GetProformaItemProducts", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.NVarChar)).Value = infoUid;
                    cmd.Parameters.Add(new SqlParameter("@proformaItemId", SqlDbType.NVarChar)).Value = data["proformaItemId"];
                    conn.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(dataSet);
                    JArray ProformaItemProducts = JArray.FromObject(dataSet.Tables[0]);
                    return new JObject
                    {
                        ["ProformaItemProducts"] = ProformaItemProducts,

                    };
                }

            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic GetProformaProducts(dynamic data, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable result = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("GetProformaProducts", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.NVarChar)).Value = infoUid;
                    cmd.Parameters.Add(new SqlParameter("@ProformaID", SqlDbType.NVarChar)).Value = data["proformaId"];
                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(result);
                }

                return result;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic GetTBaseByGroups(string data, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable result = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("GetTBaseByGroups", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    //cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.NVarChar)).Value = infoUid;
                    cmd.Parameters.Add(new SqlParameter("@baseGroup", SqlDbType.NVarChar)).Value = data;
                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(result);
                }

                return result;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic saveProformaTempProduct(dynamic data, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable result = new DataTable();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("saveProformaTempProduct", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Assuming stored procedure has parameters @name and @companyId
                    cmd.Parameters.Add(new SqlParameter("@name", SqlDbType.NVarChar)).Value = data["name"];
                    //cmd.Parameters.Add(new SqlParameter("@companyId", SqlDbType.Int)).Value = data["companyId"];
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = infoUid;

                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(result);
                }

                return result;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic saveProformaSeller(dynamic data, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable result = new DataTable();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("saveProformaSeller", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Assuming stored procedure has parameters @name and @companyId
                    cmd.Parameters.Add(new SqlParameter("@name", SqlDbType.NVarChar)).Value = data["name"];
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = infoUid;

                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(result);
                }

                return result;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }
        public static dynamic saveProformaData(dynamic proformaData, dynamic proformaItemData, dynamic proformaProductData, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable result = new DataTable();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("saveProformaData1", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Assuming stored procedure has parameters @name and @companyId
                    cmd.Parameters.Add(new SqlParameter("@JSonProformaData", SqlDbType.NVarChar)).Value = JsonConvert.SerializeObject(proformaData);
                    cmd.Parameters.Add(new SqlParameter("@JSonProformaItemData", SqlDbType.NVarChar)).Value = JsonConvert.SerializeObject(proformaItemData);
                    cmd.Parameters.Add(new SqlParameter("@JSonProformaProductData", SqlDbType.NVarChar)).Value = JsonConvert.SerializeObject(proformaProductData);
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.Int)).Value = infoUid;

                    conn.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(dataSet);
                    JArray upsertedProformaData = JArray.FromObject(dataSet.Tables[0]);
                    JArray upsertedProformaItemData = JArray.FromObject(dataSet.Tables[1]);
                    JArray upsertedProformaPoductData = JArray.FromObject(dataSet.Tables[2]);
                    return new JObject
                    {
                        ["upsertedProformaData"] = upsertedProformaData,
                        ["upsertedProformaItemData"] = upsertedProformaItemData,
                        ["upsertedProformaPoductData"] = upsertedProformaPoductData
                    };
                }
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }

        public static dynamic GetProformaSellers(string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable result = new DataTable();

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    string sql = "SELECT SellerName name, SellerId value FROM ProformaSeller";

                    SqlCommand cmd = new SqlCommand(sql, conn);

                    conn.Open();

                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(result);
                }

                return result;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }

        public static dynamic GetProformaProductTemp(string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable result = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    // Your simple query here
                    string sql = "SELECT pfPrdId value, name,'tmp' type FROM proformaProductTemp";

                    SqlCommand cmd = new SqlCommand(sql, conn);

                    conn.Open();

                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(result);
                }

                return result;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }

        public static dynamic saveShipment(dynamic data, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable result = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("saveShipment", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@companyId", SqlDbType.NVarChar)).Value = data["companyId"];
                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.NVarChar)).Value = infoUid;

                    //cmd.Parameters.Add(new SqlParameter("@prdId", SqlDbType.Int)).Value =
                    //   data.ContainsKey("prdId") && !string.IsNullOrEmpty(data["prdId"]?.ToString())
                    //     ? Convert.ToInt32(data["prdId"])
                    //     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@prdId", SqlDbType.NVarChar, 100)).Value =
                     data.ContainsKey("prdId") && !string.IsNullOrWhiteSpace(data["prdId"]?.ToString())
                     ? data["prdId"].ToString()
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@fA", SqlDbType.NVarChar, 100)).Value =
                     data.ContainsKey("fA") && !string.IsNullOrWhiteSpace(data["fA"]?.ToString())
                     ? data["fA"].ToString()
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@sName", SqlDbType.NVarChar, 100)).Value =
                    data.ContainsKey("sName") && !string.IsNullOrWhiteSpace(data["sName"]?.ToString())
                    ? data["sName"].ToString()
                    : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@Qty", SqlDbType.Int)).Value =
                     data.ContainsKey("Qty") && !string.IsNullOrEmpty(data["Qty"]?.ToString())
                     ? Convert.ToInt32(data["Qty"])
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@sTerm", SqlDbType.NVarChar, 100)).Value =
                     data.ContainsKey("sTerm") && !string.IsNullOrWhiteSpace(data["sTerm"]?.ToString())
                     ? data["sTerm"].ToString()
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@sPart", SqlDbType.NVarChar, 100)).Value =
                    data.ContainsKey("sPart") && !string.IsNullOrWhiteSpace(data["sPart"]?.ToString())
                    ? data["sPart"].ToString()
                    : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@rQty", SqlDbType.Int)).Value =
                        data.ContainsKey("rQty") && !string.IsNullOrEmpty(data["rQty"]?.ToString())
                        ? Convert.ToInt32(data["rQty"])
                        : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@reQty", SqlDbType.NVarChar, 100)).Value =
                   data.ContainsKey("reQty") && !string.IsNullOrWhiteSpace(data["reQty"]?.ToString())
                   ? data["reQty"].ToString()
                   : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@wh", SqlDbType.NVarChar, 100)).Value =
                   data.ContainsKey("wh") && !string.IsNullOrWhiteSpace(data["wh"]?.ToString())
                   ? data["wh"].ToString()
                   : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@PiNo", SqlDbType.NVarChar, 100)).Value =
                   data.ContainsKey("PiNo") && !string.IsNullOrWhiteSpace(data["PiNo"]?.ToString())
                   ? data["PiNo"].ToString()
                   : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@PiDate", SqlDbType.NVarChar, 100)).Value =
                        data.ContainsKey("PiDate") && !string.IsNullOrWhiteSpace(data["PiDate"]?.ToString())
                        ? data["PiDate"].ToString()
                        : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@pQty", SqlDbType.Int)).Value =
                        data.ContainsKey("pQty") && !string.IsNullOrEmpty(data["pQty"]?.ToString())
                        ? Convert.ToInt32(data["pQty"])
                        : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@fobU", SqlDbType.Decimal)).Value =
                      data.ContainsKey("fobU") && !string.IsNullOrWhiteSpace(data["fobU"]?.ToString())
                      ? Convert.ToDecimal(data["fobU"])
                      : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@cptU", SqlDbType.Decimal)).Value =
                      data.ContainsKey("cptU") && !string.IsNullOrWhiteSpace(data["cptU"]?.ToString())
                      ? Convert.ToDecimal(data["cptU"])
                      : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@tFobpi", SqlDbType.Decimal)).Value =
                      data.ContainsKey("tFobpi") && !string.IsNullOrWhiteSpace(data["tFobpi"]?.ToString())
                      ? Convert.ToDecimal(data["tFobpi"])
                      : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@tPi", SqlDbType.Decimal)).Value =
                      data.ContainsKey("tPi") && !string.IsNullOrWhiteSpace(data["tPi"]?.ToString())
                      ? Convert.ToDecimal(data["tPi"])
                      : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@iNo", SqlDbType.NVarChar, 100)).Value =
                        data.ContainsKey("iNo") && !string.IsNullOrWhiteSpace(data["iNo"]?.ToString())
                        ? data["iNo"].ToString()
                        : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@iDate", SqlDbType.NVarChar, 100)).Value =
                        data.ContainsKey("iDate") && !string.IsNullOrWhiteSpace(data["iDate"]?.ToString())
                        ? data["iDate"].ToString()
                        : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@iVal", SqlDbType.Decimal)).Value =
                     data.ContainsKey("iVal") && !string.IsNullOrWhiteSpace(data["iVal"]?.ToString())
                     ? Convert.ToDecimal(data["iVal"])
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@iQty", SqlDbType.NVarChar, 100)).Value =
                        data.ContainsKey("iQty") && !string.IsNullOrWhiteSpace(data["iQty"]?.ToString())
                        ? data["iQty"].ToString()
                        : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@seShDate", SqlDbType.NVarChar, 100)).Value =
                       data.ContainsKey("seShDate") && !string.IsNullOrWhiteSpace(data["seShDate"]?.ToString())
                       ? data["seShDate"].ToString()
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@aDate", SqlDbType.NVarChar, 100)).Value =
                       data.ContainsKey("aDate") && !string.IsNullOrWhiteSpace(data["aDate"]?.ToString())
                       ? data["aDate"].ToString()
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@cName", SqlDbType.NVarChar, 100)).Value =
                       data.ContainsKey("cName") && !string.IsNullOrWhiteSpace(data["cName"]?.ToString())
                       ? data["cName"].ToString()
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@cfrDate", SqlDbType.NVarChar, 100)).Value =
                       data.ContainsKey("cfrDate") && !string.IsNullOrWhiteSpace(data["cfrDate"]?.ToString())
                       ? data["cfrDate"].ToString()
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@carDate", SqlDbType.NVarChar, 100)).Value =
                       data.ContainsKey("carDate") && !string.IsNullOrWhiteSpace(data["carDate"]?.ToString())
                       ? data["carDate"].ToString()
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@rdfrDate", SqlDbType.Int)).Value =
                       data.ContainsKey("rdfrDate") && !string.IsNullOrEmpty(data["rdfrDate"]?.ToString())
                       ? Convert.ToInt32(data["rdfrDate"])
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@rdDays", SqlDbType.Int)).Value =
                       data.ContainsKey("rdDays") && !string.IsNullOrEmpty(data["rdDays"]?.ToString())
                       ? Convert.ToInt32(data["rdDays"])
                       : (object)DBNull.Value;

                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(result);
                }

                return result;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }

        public static dynamic updateShipmentRow(dynamic data, string infoUid)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            DataTable result = new DataTable();
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {

                    SqlCommand cmd = new SqlCommand("updateShipment", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@infoUid", SqlDbType.NVarChar)).Value = infoUid;

                    cmd.Parameters.Add(new SqlParameter("@sId", SqlDbType.Int)).Value =
                      data.ContainsKey("sId") && !string.IsNullOrEmpty(data["sId"]?.ToString())
                        ? Convert.ToInt32(data["sId"])
                        : (object)DBNull.Value;

                    //cmd.Parameters.Add(new SqlParameter("@prdId", SqlDbType.Int)).Value =
                    //   data.ContainsKey("prdId") && !string.IsNullOrEmpty(data["prdId"]?.ToString())
                    //     ? Convert.ToInt32(data["prdId"])
                    //     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@prdId", SqlDbType.NVarChar, 100)).Value =
                     data.ContainsKey("prdId") && !string.IsNullOrWhiteSpace(data["prdId"]?.ToString())
                     ? data["prdId"].ToString()
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@fA", SqlDbType.NVarChar, 100)).Value =
                     data.ContainsKey("fA") && !string.IsNullOrWhiteSpace(data["fA"]?.ToString())
                     ? data["fA"].ToString()
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@sName", SqlDbType.NVarChar, 100)).Value =
                    data.ContainsKey("sName") && !string.IsNullOrWhiteSpace(data["sName"]?.ToString())
                    ? data["sName"].ToString()
                    : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@Qty", SqlDbType.Int)).Value =
                     data.ContainsKey("Qty") && !string.IsNullOrEmpty(data["Qty"]?.ToString())
                     ? Convert.ToInt32(data["Qty"])
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@sTerm", SqlDbType.NVarChar, 100)).Value =
                     data.ContainsKey("sTerm") && !string.IsNullOrWhiteSpace(data["sTerm"]?.ToString())
                     ? data["sTerm"].ToString()
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@sPart", SqlDbType.NVarChar, 100)).Value =
                    data.ContainsKey("sPart") && !string.IsNullOrWhiteSpace(data["sPart"]?.ToString())
                    ? data["sPart"].ToString()
                    : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@rQty", SqlDbType.Int)).Value =
                        data.ContainsKey("rQty") && !string.IsNullOrEmpty(data["rQty"]?.ToString())
                        ? Convert.ToInt32(data["rQty"])
                        : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@reQty", SqlDbType.NVarChar, 100)).Value =
                   data.ContainsKey("reQty") && !string.IsNullOrWhiteSpace(data["reQty"]?.ToString())
                   ? data["reQty"].ToString()
                   : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@wh", SqlDbType.NVarChar, 100)).Value =
                   data.ContainsKey("wh") && !string.IsNullOrWhiteSpace(data["wh"]?.ToString())
                   ? data["wh"].ToString()
                   : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@PiNo", SqlDbType.NVarChar, 100)).Value =
                   data.ContainsKey("PiNo") && !string.IsNullOrWhiteSpace(data["PiNo"]?.ToString())
                   ? data["PiNo"].ToString()
                   : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@PiDate", SqlDbType.NVarChar, 100)).Value =
                        data.ContainsKey("PiDate") && !string.IsNullOrWhiteSpace(data["PiDate"]?.ToString())
                        ? data["PiDate"].ToString()
                        : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@pQty", SqlDbType.Int)).Value =
                        data.ContainsKey("pQty") && !string.IsNullOrEmpty(data["pQty"]?.ToString())
                        ? Convert.ToInt32(data["pQty"])
                        : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@fobU", SqlDbType.Decimal)).Value =
                      data.ContainsKey("fobU") && !string.IsNullOrWhiteSpace(data["fobU"]?.ToString())
                      ? Convert.ToDecimal(data["fobU"])
                      : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@cptU", SqlDbType.Decimal)).Value =
                      data.ContainsKey("cptU") && !string.IsNullOrWhiteSpace(data["cptU"]?.ToString())
                      ? Convert.ToDecimal(data["cptU"])
                      : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@tFobpi", SqlDbType.Decimal)).Value =
                      data.ContainsKey("tFobpi") && !string.IsNullOrWhiteSpace(data["tFobpi"]?.ToString())
                      ? Convert.ToDecimal(data["tFobpi"])
                      : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@tPi", SqlDbType.Decimal)).Value =
                      data.ContainsKey("tPi") && !string.IsNullOrWhiteSpace(data["tPi"]?.ToString())
                      ? Convert.ToDecimal(data["tPi"])
                      : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@iNo", SqlDbType.NVarChar, 100)).Value =
                        data.ContainsKey("iNo") && !string.IsNullOrWhiteSpace(data["iNo"]?.ToString())
                        ? data["iNo"].ToString()
                        : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@iDate", SqlDbType.NVarChar, 100)).Value =
                        data.ContainsKey("iDate") && !string.IsNullOrWhiteSpace(data["iDate"]?.ToString())
                        ? data["iDate"].ToString()
                        : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@iVal", SqlDbType.Decimal)).Value =
                     data.ContainsKey("iVal") && !string.IsNullOrWhiteSpace(data["iVal"]?.ToString())
                     ? Convert.ToDecimal(data["iVal"])
                     : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@iQty", SqlDbType.NVarChar, 100)).Value =
                        data.ContainsKey("iQty") && !string.IsNullOrWhiteSpace(data["iQty"]?.ToString())
                        ? data["iQty"].ToString()
                        : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@seShDate", SqlDbType.NVarChar, 100)).Value =
                       data.ContainsKey("seShDate") && !string.IsNullOrWhiteSpace(data["seShDate"]?.ToString())
                       ? data["seShDate"].ToString()
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@aDate", SqlDbType.NVarChar, 100)).Value =
                       data.ContainsKey("aDate") && !string.IsNullOrWhiteSpace(data["aDate"]?.ToString())
                       ? data["aDate"].ToString()
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@cName", SqlDbType.NVarChar, 100)).Value =
                       data.ContainsKey("cName") && !string.IsNullOrWhiteSpace(data["cName"]?.ToString())
                       ? data["cName"].ToString()
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@cfrDate", SqlDbType.NVarChar, 100)).Value =
                       data.ContainsKey("cfrDate") && !string.IsNullOrWhiteSpace(data["cfrDate"]?.ToString())
                       ? data["cfrDate"].ToString()
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@carDate", SqlDbType.NVarChar, 100)).Value =
                       data.ContainsKey("carDate") && !string.IsNullOrWhiteSpace(data["carDate"]?.ToString())
                       ? data["carDate"].ToString()
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@rdfrDate", SqlDbType.Int)).Value =
                       data.ContainsKey("rdfrDate") && !string.IsNullOrEmpty(data["rdfrDate"]?.ToString())
                       ? Convert.ToInt32(data["rdfrDate"])
                       : (object)DBNull.Value;

                    cmd.Parameters.Add(new SqlParameter("@rdDays", SqlDbType.Int)).Value =
                       data.ContainsKey("rdDays") && !string.IsNullOrEmpty(data["rdDays"]?.ToString())
                       ? Convert.ToInt32(data["rdDays"])
                       : (object)DBNull.Value;

                    conn.Open();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(result);
                }

                return result;
            }
            catch (Exception ex)
            {
                return new { error = ex.Message };
            }
        }

        private static string ConvertShamsiToMiladi(string shamsiDate)
        {
            try
            {
                PersianCalendar persianCalendar = new PersianCalendar();
                int year = int.Parse(shamsiDate.Substring(0, 4));
                int month = int.Parse(shamsiDate.Substring(4, 2));
                int day = int.Parse(shamsiDate.Substring(6, 2));

                DateTime miladiDate = persianCalendar.ToDateTime(year, month, day, 0, 0, 0, 0);
                return miladiDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
            }
            catch
            {
                throw new Exception("Invalid Shamsi start date format. Use YYYYMMDD.");
            }
        }
    }


}


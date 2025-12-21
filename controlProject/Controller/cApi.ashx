<%@ WebHandler Language="C#" Class="cApiHandler" %>

using System;
using System.Web;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using Newtonsoft.Json.Linq;

public class cApiHandler : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json; charset=utf-8";
        context.Response.AddHeader("Access-Control-Allow-Origin", "*");

        string action = context.Request.QueryString["action"] ?? "test";
        JObject result;

        switch (action.ToLower())
        {
            case "getcompanies":
                result = GetCompanies();
                break;
            case "getsheetcategories":
                int companyId;
                int.TryParse(context.Request.QueryString["companyId"], out companyId);
                result = GetSheetCategories(companyId);
                break;
            case "getsheet":
                int.TryParse(context.Request.QueryString["categoryId"], out int categoryIdd);
                result = GetSheet(categoryIdd);
                break;
            case "getitems":
                int.TryParse(context.Request.QueryString["categoryId"], out int categoryId);
                result = getItems(categoryId);
                break;
            case "gettimeperiods":
                int.TryParse(context.Request.QueryString["fiscalYear"], out int fiscalYear);
                result = getTimePeriods(fiscalYear);
                break;
            case "getbudgetdata":
                int.TryParse(context.Request.QueryString["fiscalYear"], out int budgetYear);
                int sheetId = 0, catId = 0;
                int.TryParse(context.Request.QueryString["sheetId"], out sheetId);
                int.TryParse(context.Request.QueryString["categoryId"], out catId);
                string periodType = context.Request.QueryString["periodType"] ?? "Monthly";
                result = getBudgetData(budgetYear, sheetId, catId, periodType);
                break;
            case "addstaticitem":
                string addItemData = "";
                using (var reader = new System.IO.StreamReader(context.Request.InputStream))
                {
                    addItemData = reader.ReadToEnd();
                }
                result = AddStaticItem(addItemData);
                break;
            case "updatestaticitem":
                string updateItemData = "";
                using (var reader = new System.IO.StreamReader(context.Request.InputStream))
                {
                    updateItemData = reader.ReadToEnd();
                }
                result = UpdateStaticItem(updateItemData);
                break;
            case "deletestaticitem":
                int.TryParse(context.Request.QueryString["itemId"], out int itemId);
                result = DeleteStaticItem(itemId);
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
    
    private static JObject GetCompanies()
    {      
        try
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                SqlCommand command = new SqlCommand("SELECT companyId, companyName FROM tcompanies where isActive=1 ORDER BY companyName", connection);

                DataSet dataSet = new DataSet();
                SqlDataAdapter adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

                return new JObject
                {
                    ["success"] = true,
                    ["data"] = JArray.FromObject(dataSet.Tables[0]),
                    ["count"] = dataSet.Tables[0].Rows.Count,
                    
                };
            }
        }
        catch (Exception ex)
        {
            return new JObject
            {
                ["success"] = false,
                ["error"] = ex.Message,
                
            };
        }
    }

    private static JObject GetSheet(int categoryId){
        try
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var sql = "SELECT * FROM [HitcoControl]..[Sheets]"
                 +" where CategoryId = @categoryId AND isActive = 1"
                 +" ORDER BY CategoryId";
                SqlCommand command = new SqlCommand(sql, connection);
                command.Parameters.Add(new SqlParameter("@categoryId", SqlDbType.Int)).Value = categoryId;
                DataSet dataSet = new DataSet();
                SqlDataAdapter adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

                return new JObject
                {
                    ["success"] = true,
                    ["data"] = JArray.FromObject(dataSet.Tables[0]),
                    ["count"] = dataSet.Tables[0].Rows.Count,
                    
                };
            }
        }
        catch (Exception ex)
        {
            return new JObject
            {
                ["success"] = false,
                ["error"] = ex.Message,
                
            };
        }
    }
    private static JObject getItems(int categoryId){
        try
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var sql = "select si.* from [HitcoControl]..[StaticItems] si "
                +" inner join [HitcoControl]..[Sheets] s on s.SheetID = si.SheetID "
                +" where s.CategoryID = @categoryId and si.IsActive = 1 order by si.SheetID,si.OrderIndex";
                SqlCommand command = new SqlCommand(sql, connection);
                command.Parameters.Add(new SqlParameter("@categoryId", SqlDbType.Int)).Value = categoryId;
                DataSet dataSet = new DataSet();
                SqlDataAdapter adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

                return new JObject
                {
                    ["success"] = true,
                    ["data"] = JArray.FromObject(dataSet.Tables[0]),
                    ["count"] = dataSet.Tables[0].Rows.Count,
                    
                };
            }
        }
        catch (Exception ex)
        {
            return new JObject
            {
                ["success"] = false,
                ["error"] = ex.Message,
                
            };
        }
    }
    private static JObject getTimePeriods(int fiscalYear){
        try
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var sql = "select * from [HitcoControl]..[TimePeriods] where fiscalYear = @fiscalYear";
                SqlCommand command = new SqlCommand(sql, connection);
                command.Parameters.Add(new SqlParameter("@fiscalYear", SqlDbType.Int)).Value = fiscalYear;
                DataSet dataSet = new DataSet();
                SqlDataAdapter adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

                return new JObject
                {
                    ["success"] = true,
                    ["data"] = JArray.FromObject(dataSet.Tables[0]),
                    ["count"] = dataSet.Tables[0].Rows.Count,
                    
                };
            }
        }
        catch (Exception ex)
        {
            return new JObject
            {
                ["success"] = false,
                ["error"] = ex.Message,
                
            };
        }
    }
    private static JObject GetSheetCategories(int companyId)
    {
        if (companyId <= 0)
            return new JObject { ["success"] = false, ["error"] = "شناسه شرکت الزامی است" };


        try
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                SqlCommand command = new SqlCommand("SELECT CategoryID, CategoryNameFa FROM HitcoControl..SheetCategories WHERE companyId = @companyId AND isActive = 1 ORDER BY CategoryNameFa", connection);
                command.Parameters.Add(new SqlParameter("@companyId", SqlDbType.Int)).Value = companyId;

                DataSet dataSet = new DataSet();
                SqlDataAdapter adapter = new SqlDataAdapter(command);
                adapter.Fill(dataSet);

                return new JObject
                {
                    ["success"] = true,
                    ["data"] = JArray.FromObject(dataSet.Tables[0]),
                    ["count"] = dataSet.Tables[0].Rows.Count,
                };
            }
        }
        catch (Exception ex)
        {
            return new JObject
            {
                ["success"] = false,
                ["error"] = ex.Message,
                
            };
        }
    }
    private static JObject AddStaticItem(string jsonData)
    {
        try
        {
            var itemData = JObject.Parse(jsonData);
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var sql = @"
                    INSERT INTO [HitcoControl]..[StaticItems] 
                    (SheetID, ItemCode, ItemName, ItemNameFa, ItemType, DataType, OrderIndex, IsActive)
                    VALUES (@SheetID, @ItemCode, @ItemName, @ItemNameFa, @ItemType, @DataType, @OrderIndex, @IsActive);
                    SELECT SCOPE_IDENTITY();";
                
                SqlCommand command = new SqlCommand(sql, connection);
                command.Parameters.Add(new SqlParameter("@SheetID", SqlDbType.Int)).Value = itemData["SheetID"];
                command.Parameters.Add(new SqlParameter("@ItemCode", SqlDbType.NVarChar, 50)).Value = (object)itemData["ItemCode"] ?? DBNull.Value;
                command.Parameters.Add(new SqlParameter("@ItemName", SqlDbType.NVarChar, 200)).Value = itemData["ItemName"];
                command.Parameters.Add(new SqlParameter("@ItemNameFa", SqlDbType.NVarChar, 200)).Value = itemData["ItemNameFa"];
                command.Parameters.Add(new SqlParameter("@ItemType", SqlDbType.NVarChar, 50)).Value = itemData["ItemType"];
                command.Parameters.Add(new SqlParameter("@DataType", SqlDbType.NVarChar, 50)).Value = itemData["DataType"];
                command.Parameters.Add(new SqlParameter("@OrderIndex", SqlDbType.Int)).Value = itemData["OrderIndex"];
                command.Parameters.Add(new SqlParameter("@IsActive", SqlDbType.Bit)).Value = itemData["IsActive"] ?? true;

                var newItemId = command.ExecuteScalar();
                //var newItemIds = Convert.ToInt32(newItemId);
                return new JObject
                {
                    ["success"] = true,
                    ["message"] = "آیتم با موفقیت اضافه شد",
                    ["itemId"] = Convert.ToInt32(newItemId)
                };
            }
        }
        catch (Exception ex)
        {
            return new JObject
            {
                ["success"] = false,
                ["error"] = ex.Message
            };
        }
    }

    private static JObject UpdateStaticItem(string jsonData)
    {
        try
        {
            var itemData = JObject.Parse(jsonData);
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var sql = @"
                    UPDATE [HitcoControl]..[StaticItems] 
                    SET ItemCode = @ItemCode,
                        ItemName = @ItemName,
                        ItemNameFa = @ItemNameFa,
                        ItemType = @ItemType,
                        DataType = @DataType,
                        OrderIndex = @OrderIndex,
                        IsActive = @IsActive
                    WHERE ItemID = @ItemID";
                
                SqlCommand command = new SqlCommand(sql, connection);
                command.Parameters.Add(new SqlParameter("@ItemID", SqlDbType.Int)).Value = itemData["ItemID"];
                command.Parameters.Add(new SqlParameter("@ItemCode", SqlDbType.NVarChar, 50)).Value = (object)itemData["ItemCode"] ?? DBNull.Value;
                command.Parameters.Add(new SqlParameter("@ItemName", SqlDbType.NVarChar, 200)).Value = itemData["ItemName"];
                command.Parameters.Add(new SqlParameter("@ItemNameFa", SqlDbType.NVarChar, 200)).Value = itemData["ItemNameFa"];
                command.Parameters.Add(new SqlParameter("@ItemType", SqlDbType.NVarChar, 50)).Value = itemData["ItemType"];
                command.Parameters.Add(new SqlParameter("@DataType", SqlDbType.NVarChar, 50)).Value = itemData["DataType"];
                command.Parameters.Add(new SqlParameter("@OrderIndex", SqlDbType.Int)).Value = itemData["OrderIndex"];
                command.Parameters.Add(new SqlParameter("@IsActive", SqlDbType.Bit)).Value = itemData["IsActive"];

                int rowsAffected = command.ExecuteNonQuery();

                return new JObject
                {
                    ["success"] = rowsAffected > 0,
                    ["message"] = rowsAffected > 0 ? "آیتم با موفقیت به‌روزرسانی شد" : "آیتم یافت نشد"
                };
            }
        }
        catch (Exception ex)
        {
            return new JObject
            {
                ["success"] = false,
                ["error"] = ex.Message
            };
        }
    }

    private static JObject DeleteStaticItem(int itemId)
    {
        if (itemId <= 0)
            return new JObject { ["success"] = false, ["error"] = "شناسه آیتم الزامی است" };

        try
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                
                // First check if item has related data
                var checkSql = @"
                    SELECT COUNT(*) FROM [HitcoControl]..[DynamicData] WHERE ItemID = @ItemID
                    UNION ALL
                    SELECT COUNT(*) FROM [HitcoControl]..[HistoricalData] WHERE ItemID = @ItemID";
                
                SqlCommand checkCommand = new SqlCommand(checkSql, connection);
                checkCommand.Parameters.Add(new SqlParameter("@ItemID", SqlDbType.Int)).Value = itemId;
                
                var reader = checkCommand.ExecuteReader();
                int relatedDataCount = 0;
                while (reader.Read())
                {
                    relatedDataCount += reader.GetInt32(0);
                }
                reader.Close();
                
                if (relatedDataCount > 0)
                {
                    // If has related data, just set IsActive to false
                    var updateSql = "UPDATE [HitcoControl]..[StaticItems] SET IsActive = 0 WHERE ItemID = @ItemID";
                    SqlCommand updateCommand = new SqlCommand(updateSql, connection);
                    updateCommand.Parameters.Add(new SqlParameter("@ItemID", SqlDbType.Int)).Value = itemId;
                    
                    int rowsAffected = updateCommand.ExecuteNonQuery();
                    
                    return new JObject
                    {
                        ["success"] = rowsAffected > 0,
                        ["message"] = "آیتم غیرفعال شد (به دلیل وجود داده‌های مرتبط)"
                    };
                }
                else
                {
                    // If no related data, delete permanently
                    var deleteSql = "DELETE FROM [HitcoControl]..[StaticItems] WHERE ItemID = @ItemID";
                    SqlCommand deleteCommand = new SqlCommand(deleteSql, connection);
                    deleteCommand.Parameters.Add(new SqlParameter("@ItemID", SqlDbType.Int)).Value = itemId;
                    
                    int rowsAffected = deleteCommand.ExecuteNonQuery();
                    
                    return new JObject
                    {
                        ["success"] = rowsAffected > 0,
                        ["message"] = rowsAffected > 0 ? "آیتم با موفقیت حذف شد" : "آیتم یافت نشد"
                    };
                }
            }
        }
        catch (Exception ex)
        {
            return new JObject
            {
                ["success"] = false,
                ["error"] = ex.Message
            };
        }
    }
    
    private static JObject getBudgetData(int fiscalYear, int sheetId, int categoryId, string periodType)
    {
        if (fiscalYear <= 0)
            return new JObject { ["success"] = false, ["error"] = "سال مالی الزامی است" };
            
        if (sheetId <= 0 && categoryId <= 0)
            return new JObject { ["success"] = false, ["error"] = "شناسه شیت یا دسته‌بندی الزامی است" };

        try
        {
            
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
            
                using (SqlCommand command = new SqlCommand("[HitcoControl]..[getBudgetData]", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
            
                    // Add parameters to the stored procedure
                    command.Parameters.Add(new SqlParameter("@FiscalYear", SqlDbType.Int)).Value = fiscalYear;
                    command.Parameters.Add(new SqlParameter("@SheetID", SqlDbType.Int)).Value = sheetId;
                    command.Parameters.Add(new SqlParameter("@CategoryID", SqlDbType.Int)).Value = categoryId;
                    command.Parameters.Add(new SqlParameter("@PeriodType", SqlDbType.NVarChar, 50)).Value = periodType ?? "Monthly";
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    return new JObject
                    {
                        ["success"] = true,
                        ["data"] = JArray.FromObject(dataSet.Tables[0]),
                        ["count"] = dataSet.Tables[0].Rows.Count,
                    };
                    // Execute the stored procedure and read the results
                    /*using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            // Process the results here
                        }
                    }*/
                }
            }
        }
        catch (Exception ex)
        {
            return new JObject
            {
                ["success"] = false,
                ["error"] = ex.Message
            };
        }
    }
}
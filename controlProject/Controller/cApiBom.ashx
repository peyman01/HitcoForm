<%@ WebHandler Language="C#" Class="cApiBom" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System.Configuration;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
public class cApiBom : IHttpHandler, IRequiresSessionState
{
    private string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json";
        context.Response.ContentEncoding = System.Text.Encoding.UTF8;

        // چک کردن session قبل از هر عملیات
        if (!IsSessionValid(context))
        {
            context.Response.Write(JsonConvert.SerializeObject(new {
                success = false,
                error = "Session expired",
                sessionExpired = true
            }));
            return;
        }

        string action = context.Request.QueryString["action"];

        try
        {
            switch (action)
            {
                case "getbomlist":
                    GetBomList(context);
                    break;
                case "getpartproformadata":
                    GetPartProformaData(context);
                    break;
                case "getbomdetail":
                    GetBomDetail(context);
                    break;
                case "getbomhistory":
                    GetBomHistory(context);
                    break;
                case "getbomcombo":
                    GetBomCombo(context);
                    break;
                case "getbomcategories":
                    GetBomCategories(context);
                    break;
                case "savebom":
                    SaveBom(context);
                    break;
                case "deletebom":
                    DeleteBom(context);
                    break;
                case "deletebomitem":
                    DeleteBomItem(context);
                    break;
                case "updatebomitem":
                    UpdateBomItem(context);
                    break;
                case "insertcategory":
                    InsertCategory(context);
                    break;
                case "updatecategory":
                    UpdateCategory(context);
                    break;
                case "deletecategory":
                    DeleteCategory(context);
                    break;
                case "getproductlist":
                    GetProductList(context);
                    break;
                case "gettempproducts":
                    GetTempProductList(context);
                    break;
                case "updateproductcategory":
                    UpdateProductCategory(context);
                    break;
                case "setdefaultbom":
                    SetDefaultBom(context);
                    break;
                case "getunits":
                    GetUnits(context);
                    break;
                case "getcompaniesbi":
                    GetCompaniesBi(context);
                    break;
                case "savetempproduct":
                    SaveTempProduct(context);
                    break;
                case "deletetempproduct":
                    DeleteTempProduct(context);
                    break;
                case "getbrands":
                    GetBrands(context);
                    break;
                case "getcurrencies":
                    GetCurrencies(context);
                    break;
                case "getcurrencybydate":
                    GetCurrencyByDate(context);
                    break;
                default:
                    context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = "Invalid action" }));
                    break;
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = ex.Message }));
        }
    }

    private void GetPartProformaData(HttpContext context)
    {
        string companyId = context.Request.QueryString["companyId"];

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand("HitcoControl..spProductPartProforma", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@companyId", companyId ?? (object)DBNull.Value);

                conn.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);

                context.Response.Write(JsonConvert.SerializeObject(new { success = true, data = dt }));
            }
        }
    }

    private void GetBomList(HttpContext context)
    {
        string companyId = context.Request.QueryString["companyId"];

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand("HitcoControl..spProductBomList", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@companyId", companyId ?? (object)DBNull.Value);

                conn.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);

                context.Response.Write(JsonConvert.SerializeObject(new { success = true, data = dt }));
            }
        }
    }

    private void GetBomHistory(HttpContext context){
        int productBomHeaderId = Convert.ToInt32(context.Request.QueryString["productBomHeaderId"]);

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand("HitcoControl..spBomHistory", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ProductBomHeaderId", productBomHeaderId);

                conn.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);

                context.Response.Write(JsonConvert.SerializeObject(new { success = true, data = dt }));
            }
        }
    }
    private void GetBomDetail(HttpContext context)
    {
        int productBomHeaderId = Convert.ToInt32(context.Request.QueryString["productBomHeaderId"]);

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand("HitcoControl..spBomDetail", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ProductBomHeaderId", productBomHeaderId);

                conn.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);

                context.Response.Write(JsonConvert.SerializeObject(new { success = true, data = dt }));
            }
        }
    }

    private void GetBomCombo(HttpContext context)
    {
        int companyId = Convert.ToInt32(context.Request.QueryString["companyId"]);

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand("HitcoControl..spProductBomCombo", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@companyId", companyId);

                conn.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);

                context.Response.Write(JsonConvert.SerializeObject(new { success = true, data = dt }));
            }
        }
    }

    private void GetBomCategories(HttpContext context)
    {
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand("SELECT * FROM HitcoBI..productBomCategory ORDER BY productBomCategoryId", conn))
            {
                conn.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);

                context.Response.Write(JsonConvert.SerializeObject(new { success = true, data = dt }));
            }
        }
    }
    private int? ToNullableInt(dynamic val)
    {
        if (val == null) return null;

        string s = val.ToString().Trim();
        if (s == "") return null;

        int parsed;
        if (int.TryParse(s, out parsed))
            return parsed;

        return null;
    }

    private decimal ToDecimalSafe(dynamic val)
    {
        if (val == null) return 0;

        string s = val.ToString().Trim();
        if (s == "") return 0;

        decimal parsed;
        if (decimal.TryParse(s, out parsed))
            return parsed;

        return 0;
    }

    private string ToStringSafe(dynamic val)
    {
        if (val == null) return null;

        string s = val.ToString().Trim();
        return s == "" ? null : s;
    }


    private void SaveBom(HttpContext context)
    {
        try
        {
            using (var reader = new System.IO.StreamReader(context.Request.InputStream))
            {
                string jsonData = reader.ReadToEnd();
                dynamic bomData = JsonConvert.DeserializeObject(jsonData);

                int companyId = Convert.ToInt32(bomData.companyId);
                string srcProduct = ToStringSafe(bomData.mainProduct.SrcProduct);
                int srcProductId = Convert.ToInt32(bomData.mainProduct.SrcProductId);
                int? mainUnitRef = ToNullableInt(bomData.mainProduct.partUnitRef);
                string actionMode = ToStringSafe(bomData.actionMode);

                int? productBomHeaderId = ToNullableInt(bomData.ProductBomHeaderId);

                // ساخت آیتم‌ها
                var bomItems = new List<object>();

                foreach (var item in bomData.items)
                {
                    var srcIngredients = ToStringSafe(item.SrcIngredients);

                    var srcIngredientsProductId = ToNullableInt(item.SrcIngredientsProductId);

                    var partUnitRef = ToNullableInt(item.partUnitRef);

                    var quantity = ToDecimalSafe(item.Quantity);

                    var productBomCategoryId = ToNullableInt(item.productBomCategoryId);

                    var recordType = ToStringSafe(item.RecordType);

                    bomItems.Add(new
                    {
                        SrcIngredients = srcIngredients,
                        SrcIngredientsProductId = srcIngredientsProductId,
                        partUnitRef = partUnitRef,
                        Quantity = quantity,
                        productBomCategoryId = productBomCategoryId,
                        RecordType = recordType
                    });
                }

                // JSON نهایی
                var jsonObject = new
                {
                    companyId = companyId,
                    SrcProduct = srcProduct,
                    SrcProductId = srcProductId,
                    mainUnitRef = mainUnitRef,
                    actionMode = actionMode,
                    ProductBomHeaderId = productBomHeaderId,
                    items = bomItems
                };

                string jsonForProc = JsonConvert.SerializeObject(jsonObject);

                using (SqlConnection conn = new SqlConnection(connectionString))
                using (SqlCommand cmd = new SqlCommand("HitcoControl..spBomCreate", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UserId", context.Session["userId"]);
                    cmd.Parameters.AddWithValue("@json", jsonForProc);

                    conn.Open();

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    if (dt.Rows.Count > 0)
                    {
                        bool success = Convert.ToBoolean(dt.Rows[0]["Success"]);
                        string message = dt.Rows[0]["Message"].ToString();

                        object returnedHeaderId = null;
                        if (dt.Columns.Contains("ProductBomHeaderId")
                            && dt.Rows[0]["ProductBomHeaderId"] != DBNull.Value)
                        {
                            returnedHeaderId = dt.Rows[0]["ProductBomHeaderId"];
                        }

                        if (success)
                        {
                            context.Response.Write(JsonConvert.SerializeObject(new
                            {
                                success = true,
                                message = message,
                                ProductBomHeaderId = returnedHeaderId
                            }));
                        }
                        else
                        {
                            context.Response.Write(JsonConvert.SerializeObject(new
                            {
                                success = false,
                                error = message
                            }));
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new
            {
                success = false,
                error = ex.Message
            }));
        }
    }



    private void DeleteBom(HttpContext context)
    {
        try
        {
            using (var reader = new System.IO.StreamReader(context.Request.InputStream))
            {
                string jsonData = reader.ReadToEnd();
                dynamic deleteData = JsonConvert.DeserializeObject(jsonData);

                int productBomHeaderId = Convert.ToInt32(deleteData.ProductBomHeaderId);

                // ساخت JSON ساده برای پروسیجر
                string jsonForProc = JsonConvert.SerializeObject(new { ProductBomHeaderId = productBomHeaderId });

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("HitcoControl..spBomDelete", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@json", jsonForProc);

                        conn.Open();
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        DataTable dt = new DataTable();
                        da.Fill(dt);

                        if (dt.Rows.Count > 0)
                        {
                            bool success = Convert.ToBoolean(dt.Rows[0]["Success"]);
                            string message = dt.Rows[0]["Message"].ToString();

                            if (success)
                            {
                                context.Response.Write(JsonConvert.SerializeObject(new { success = true, message = message }));
                            }
                            else
                            {
                                context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = message }));
                            }
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = ex.Message }));
        }
    }

    private void DeleteBomItem(HttpContext context)
    {
        try
        {
            using (var reader = new System.IO.StreamReader(context.Request.InputStream))
            {
                string jsonData = reader.ReadToEnd();
                dynamic itemData = JsonConvert.DeserializeObject(jsonData);

                int productBomDetailId = Convert.ToInt32(itemData.ProductBomDetailId);

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("DELETE FROM HitcoControl..tProductBomDetail WHERE ProductBomDetailId = @ProductBomDetailId", conn))
                    {
                        cmd.Parameters.AddWithValue("@ProductBomDetailId", productBomDetailId);

                        conn.Open();
                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            context.Response.Write(JsonConvert.SerializeObject(new { success = true, message = "آیتم با موفقیت حذف شد" }));
                        }
                        else
                        {
                            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = "آیتم یافت نشد" }));
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = ex.Message }));
        }
    }

    private void UpdateBomItem(HttpContext context)
    {
        try
        {
            using (var reader = new System.IO.StreamReader(context.Request.InputStream))
            {
                string jsonData = reader.ReadToEnd();
                dynamic itemData = JsonConvert.DeserializeObject(jsonData);

                int productBomDetailId = Convert.ToInt32(itemData.ProductBomDetailId);
                decimal quantity = Convert.ToDecimal(itemData.Quantity);

                string updateQuery = "UPDATE HitcoControl..tProductBomDetail SET Quantity = @Quantity";

                // اگر محصول تغییر کرده باشد (برای آیتم‌های غیر بسته‌بندی)
                if (itemData.SrcIngredients != null && itemData.SrcIngredientsProductId != null)
                {
                    string srcIngredients = Convert.ToString(itemData.SrcIngredients);
                    int srcIngredientsProductId = Convert.ToInt32(itemData.SrcIngredientsProductId);
                    updateQuery += ", SrcIngredients = @SrcIngredients, SrcIngredientsProductId = @SrcIngredientsProductId";

                    using (SqlConnection conn = new SqlConnection(connectionString))
                    {
                        using (SqlCommand cmd = new SqlCommand(updateQuery + " WHERE ProductBomDetailId = @ProductBomDetailId", conn))
                        {
                            cmd.Parameters.AddWithValue("@ProductBomDetailId", productBomDetailId);
                            cmd.Parameters.AddWithValue("@Quantity", quantity);
                            cmd.Parameters.AddWithValue("@SrcIngredients", srcIngredients);
                            cmd.Parameters.AddWithValue("@SrcIngredientsProductId", srcIngredientsProductId);

                            conn.Open();
                            int rowsAffected = cmd.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                context.Response.Write(JsonConvert.SerializeObject(new { success = true, message = "آیتم با موفقیت ویرایش شد" }));
                            }
                            else
                            {
                                context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = "آیتم یافت نشد" }));
                            }
                        }
                    }
                }
                else
                {
                    // فقط مقدار تغییر می‌کند (برای آیتم‌های بسته‌بندی)
                    using (SqlConnection conn = new SqlConnection(connectionString))
                    {
                        using (SqlCommand cmd = new SqlCommand(updateQuery + " WHERE ProductBomDetailId = @ProductBomDetailId", conn))
                        {
                            cmd.Parameters.AddWithValue("@ProductBomDetailId", productBomDetailId);
                            cmd.Parameters.AddWithValue("@Quantity", quantity);

                            conn.Open();
                            int rowsAffected = cmd.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                context.Response.Write(JsonConvert.SerializeObject(new { success = true, message = "آیتم با موفقیت ویرایش شد" }));
                            }
                            else
                            {
                                context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = "آیتم یافت نشد" }));
                            }
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = ex.Message }));
        }
    }

    private void InsertCategory(HttpContext context)
    {
        try
        {
            using (var reader = new System.IO.StreamReader(context.Request.InputStream))
            {
                string jsonData = reader.ReadToEnd();
                dynamic categoryData = JsonConvert.DeserializeObject(jsonData);

                string categoryEn = Convert.ToString(categoryData.CategoryEn);
                string categoryFa = Convert.ToString(categoryData.CategoryFa);

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("INSERT INTO HitcoBI..productBomCategory (CategoryEn, CategoryFa) VALUES (@CategoryEn, @CategoryFa)", conn))
                    {
                        cmd.Parameters.AddWithValue("@CategoryEn", categoryEn);
                        cmd.Parameters.AddWithValue("@CategoryFa", categoryFa);

                        conn.Open();
                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            context.Response.Write(JsonConvert.SerializeObject(new { success = true, message = "دسته‌بندی با موفقیت اضافه شد" }));
                        }
                        else
                        {
                            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = "خطا در افزودن دسته‌بندی" }));
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = ex.Message }));
        }
    }

    private void UpdateCategory(HttpContext context)
    {
        try
        {
            using (var reader = new System.IO.StreamReader(context.Request.InputStream))
            {
                string jsonData = reader.ReadToEnd();
                dynamic categoryData = JsonConvert.DeserializeObject(jsonData);

                int productBomCategoryId = Convert.ToInt32(categoryData.productBomCategoryId);
                string categoryEn = Convert.ToString(categoryData.CategoryEn);
                string categoryFa = Convert.ToString(categoryData.CategoryFa);

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("UPDATE HitcoBI..productBomCategory SET CategoryEn = @CategoryEn, CategoryFa = @CategoryFa WHERE productBomCategoryId = @productBomCategoryId", conn))
                    {
                        cmd.Parameters.AddWithValue("@productBomCategoryId", productBomCategoryId);
                        cmd.Parameters.AddWithValue("@CategoryEn", categoryEn);
                        cmd.Parameters.AddWithValue("@CategoryFa", categoryFa);

                        conn.Open();
                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            context.Response.Write(JsonConvert.SerializeObject(new { success = true, message = "دسته‌بندی با موفقیت ویرایش شد" }));
                        }
                        else
                        {
                            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = "دسته‌بندی یافت نشد" }));
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = ex.Message }));
        }
    }

    private void DeleteCategory(HttpContext context)
    {
        try
        {
            using (var reader = new System.IO.StreamReader(context.Request.InputStream))
            {
                string jsonData = reader.ReadToEnd();
                dynamic categoryData = JsonConvert.DeserializeObject(jsonData);

                int productBomCategoryId = Convert.ToInt32(categoryData.productBomCategoryId);

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("DELETE FROM HitcoBI..productBomCategory WHERE productBomCategoryId = @productBomCategoryId", conn))
                    {
                        cmd.Parameters.AddWithValue("@productBomCategoryId", productBomCategoryId);

                        conn.Open();
                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            context.Response.Write(JsonConvert.SerializeObject(new { success = true, message = "دسته‌بندی با موفقیت حذف شد" }));
                        }
                        else
                        {
                            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = "دسته‌بندی یافت نشد" }));
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = ex.Message }));
        }
    }

    private void GetProductList(HttpContext context)
    {
        string companyId = context.Request.QueryString["companyId"];

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand("HitcoControl..spAllProductList", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@companyId", companyId ?? (object)DBNull.Value);

                conn.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);

                context.Response.Write(JsonConvert.SerializeObject(new { success = true, data = dt }));
            }
        }
    }
    private void UpdateProductCategory(HttpContext context)
    {
        try
        {
            using (var reader = new System.IO.StreamReader(context.Request.InputStream))
            {
                string jsonData = reader.ReadToEnd();
                dynamic updateData = JsonConvert.DeserializeObject(jsonData);

                string srcProduct = Convert.ToString(updateData.SrcProduct);
                int srcProductId = Convert.ToInt32(updateData.SrcProductId);

                object companyId = null;
                try
                {
                    if (updateData.companyId != null && updateData.companyId.Value != null)
                        companyId = Convert.ToInt32(updateData.companyId.Value);
                }
                catch { }

                object productBomCategoryId = null;
                try
                {
                    if (updateData.productBomCategoryId != null && updateData.productBomCategoryId.Value != null)
                        productBomCategoryId = Convert.ToInt32(updateData.productBomCategoryId.Value);
                }
                catch { }

                string tableName = srcProduct == "Finance" ? "HitcoBI..productFinance" : "HitcoBI..proformaProductTemp";
                string idColumn = srcProduct == "Finance" ? "financePrdtId" : "pfPrdId";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    string query = $"UPDATE {tableName} SET productBomCategoryId = @productBomCategoryId WHERE {idColumn} = @productId";

                    // برای Finance باید companyId هم در شرط باشد
                    if (srcProduct == "Finance" && companyId != null)
                    {
                        query += " AND companyId = @companyId";
                    }

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@productBomCategoryId", productBomCategoryId ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@productId", srcProductId);

                        if (srcProduct == "Finance" && companyId != null)
                        {
                            cmd.Parameters.AddWithValue("@companyId", companyId);
                        }

                        conn.Open();
                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            context.Response.Write(JsonConvert.SerializeObject(new { success = true, message = "دسته‌بندی محصول با موفقیت ویرایش شد" }));
                        }
                        else
                        {
                            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = "محصول یافت نشد" }));
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = ex.Message }));
        }
    }

    private void SetDefaultBom(HttpContext context)
    {
        try
        {
            using (var reader = new System.IO.StreamReader(context.Request.InputStream))
            {
                string jsonData = reader.ReadToEnd();
                dynamic requestData = JsonConvert.DeserializeObject(jsonData);

                int productBomHeaderId = Convert.ToInt32(requestData.ProductBomHeaderId);

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("HitcoControl..spBomSetDefault", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ProductBomHeaderId", productBomHeaderId);

                        conn.Open();
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        DataTable dt = new DataTable();
                        da.Fill(dt);

                        if (dt.Rows.Count > 0)
                        {
                            bool success = Convert.ToBoolean(dt.Rows[0]["Success"]);
                            string message = dt.Rows[0]["Message"].ToString();

                            if (success)
                            {
                                context.Response.Write(JsonConvert.SerializeObject(new { success = true, message = message }));
                            }
                            else
                            {
                                context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = message }));
                            }
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = ex.Message }));
        }
    }

    private void GetUnits(HttpContext context)
    {
        int companyId = Convert.ToInt32(context.Request.QueryString["companyId"]);

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand("SELECT partUnitId, partUnitCode, partUnitName, companyId FROM HitcoBI..partUnit WHERE companyId = @companyId ORDER BY partUnitName", conn))
            {
                cmd.Parameters.AddWithValue("@companyId", companyId);

                conn.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);

                context.Response.Write(JsonConvert.SerializeObject(new { success = true, data = dt }));
            }
        }
    }
    private void GetCompaniesBi(HttpContext context)
    {
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand("SELECT companyId, companyName_FA as companyName FROM HitcoBI..companies ORDER BY companyName_FA", conn))
            {
                conn.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);

                context.Response.Write(JsonConvert.SerializeObject(new { success = true, data = dt }));
            }
        }
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private void GetTempProductList(HttpContext context)
    {
        try
        {
            var Sql = @"SELECT
                    replace(replace(ppt.name,N'ي',N'ی'),N'ك',N'ک') AS name
                    ,ppt.pfPrdId, ppt.partUnitRef, ppt.brandID, ppt.productBomCategoryId, ppt.src
                    ,ppt.iid, u.firstName + ' '+ u.lastName as Creator, bc.CategoryFa, br.brandName_FA
                FROM HitcoBI..proformaProductTemp ppt
                LEFT JOIN HitcoBI..tUsers u on u.userId = ppt.iid
                LEFT JOIN HitcoBI..productBomCategory bc on ppt.productBomCategoryId= bc.productBomCategoryId
                LEFT JOIN HitcoBI..brands br on ppt.brandID = br.brandID
                ORDER BY ppt.pfPrdId DESC";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(Sql, conn))
                {
                    conn.Open();
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);
                    context.Response.Write(JsonConvert.SerializeObject(new { success = true, data = dt }));
                }
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = ex.Message }));
        }
    }

    private void SaveTempProduct(HttpContext context)
    {
        try
        {
            using (var reader = new System.IO.StreamReader(context.Request.InputStream))
            {
                string jsonData = reader.ReadToEnd();
                dynamic productData = JsonConvert.DeserializeObject(jsonData);

                string name = productData.name;
                int? brandID = productData.brandID != null ? Convert.ToInt32(productData.brandID) : (int?)null;
                int productBomCategoryId = Convert.ToInt32(productData.productBomCategoryId);
                int partUnitRef = Convert.ToInt32(productData.partUnitRef);
                int? pfPrdId = productData.pfPrdId != null ? Convert.ToInt32(productData.pfPrdId) : (int?)null;

                string sql = "";

                if (pfPrdId.HasValue)
                {
                    // Update existing product
                    sql = @"UPDATE HitcoBI..proformaProductTemp
                            SET name = @name,
                                brandID = @brandID,
                                productBomCategoryId = @productBomCategoryId,
                                partUnitRef = @partUnitRef,
                                uid = @uid,
                                udt = GETDATE()
                            WHERE pfPrdId = @pfPrdId";
                }
                else
                {
                    // Check for duplicate name before insert
                    string checkDuplicateSql = @"SELECT COUNT(*) FROM HitcoBI..proformaProductTemp
                                                WHERE LOWER(LTRIM(RTRIM(name))) = LOWER(LTRIM(RTRIM(@name)))";

                    using (SqlConnection checkConn = new SqlConnection(connectionString))
                    {
                        using (SqlCommand checkCmd = new SqlCommand(checkDuplicateSql, checkConn))
                        {
                            checkCmd.Parameters.AddWithValue("@name", name);
                            checkConn.Open();
                            int count = Convert.ToInt32(checkCmd.ExecuteScalar());

                            if (count > 0)
                            {
                                context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = "محصولی با این نام قبلاً ثبت شده است" }));
                                return;
                            }
                        }
                    }

                    // Insert new product
                    sql = @"INSERT INTO HitcoBI..proformaProductTemp
                            (name, brandID, productBomCategoryId, partUnitRef, src, iid, idt)
                            VALUES (@name, @brandID, @productBomCategoryId, @partUnitRef, 'bom', @uid, GETDATE())";
                }
              
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@name", name);
                        cmd.Parameters.AddWithValue("@brandID", (object)brandID ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@productBomCategoryId", productBomCategoryId);
                        cmd.Parameters.AddWithValue("@partUnitRef", partUnitRef);
                        cmd.Parameters.AddWithValue("@uid", context.Session["userId"]);

                        if (pfPrdId.HasValue)
                        {
                            cmd.Parameters.AddWithValue("@pfPrdId", pfPrdId.Value);
                        }

                        conn.Open();
                        cmd.ExecuteNonQuery();
                        context.Response.Write(JsonConvert.SerializeObject(new { success = true }));
                    }
                }
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = ex.Message }));
        }
    }

    private void DeleteTempProduct(HttpContext context)
    {
        try
        {
            using (var reader = new System.IO.StreamReader(context.Request.InputStream))
            {
                string jsonData = reader.ReadToEnd();
                dynamic productData = JsonConvert.DeserializeObject(jsonData);

                int pfPrdId = Convert.ToInt32(productData.pfPrdId);

                string sql = @"DELETE FROM HitcoBI..proformaProductTemp WHERE pfPrdId = @pfPrdId";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@pfPrdId", pfPrdId);

                        conn.Open();
                        cmd.ExecuteNonQuery();
                        context.Response.Write(JsonConvert.SerializeObject(new { success = true }));
                    }
                }
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = ex.Message }));
        }
    }

    private void GetCurrencies(HttpContext context)
    {
        try
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                string sql1 = @"select * from HitcoBI..tBase where groupName = 'currency' and isActive = 1 order by orderNo";
                SqlDataAdapter da1 = new SqlDataAdapter(sql1, conn);
                DataTable dtCurrency = new DataTable();
                da1.Fill(dtCurrency);

                string sql2 = @"select * from HitcoBI..tBase where groupName = 'currencySrc' and isActive = 1 order by orderNo";
                SqlDataAdapter da2 = new SqlDataAdapter(sql2, conn);
                DataTable dtCurrencySrc = new DataTable();
                da2.Fill(dtCurrencySrc);

                string sql3 = @"select baseId,FreeRate,NimaRate,TarjihiRate,SanaRate,MobadeleRate,EffectiveDate,SolarDate from HitcoBI..CurrencyRates where isLatest=1";
                SqlDataAdapter da3 = new SqlDataAdapter(sql3, conn);
                DataTable dtCurrencyRates = new DataTable();
                da3.Fill(dtCurrencyRates);

                context.Response.Write(JsonConvert.SerializeObject(new
                {
                    success = true,
                    currency = dtCurrency,
                    currencySrc = dtCurrencySrc,
                    currencyRates = dtCurrencyRates
                }));
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = ex.Message }));
        }
    }

    private void GetBrands(HttpContext context)
    {
        try
        {
            var sql = @"SELECT brandID, brandName_EN, brandName_FA, colorCode, isActive
                        FROM HitcoBI..brands
                        WHERE isActive = 1
                        ORDER BY brandName_FA";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    conn.Open();
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);
                    context.Response.Write(JsonConvert.SerializeObject(new { success = true, data = dt }));
                }
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new { success = false, error = ex.Message }));
        }
    }
    private void GetCurrencyByDate(HttpContext context)
    {
        string Date = context.Request.QueryString["Date"]; //persian or gregorian date

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand("HitcoControl..GetNearestCurrencyRates", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@Date", SqlDbType.VarChar, 20).Value = Date;

                conn.Open();

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);

                context.Response.ContentType = "application/json";
                context.Response.Write(
                    JsonConvert.SerializeObject(new
                    {
                        success = true,
                        data = dt
                    })
                );
            }
        }
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private bool IsSessionValid(HttpContext context)
    {
        // چک کردن اینکه session وجود داره و userId داره
        if (context.Session == null || context.Session["userId"] == null || context.Session["infoUid"] == null)
        {
            return false;
        }
        return true;
    }

    public bool IsReusable
    {
        get { return false; }
    }
}

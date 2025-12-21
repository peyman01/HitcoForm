<%@ WebHandler Language="C#" Class="cApiCompanyHandler" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Linq;

public class cApiCompanyHandler : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json; charset=utf-8";
        context.Response.AddHeader("Access-Control-Allow-Origin", "*");

        // چک کردن session قبل از هر عملیات
        if (!IsSessionValid(context))
        {
            context.Response.Write(Newtonsoft.Json.JsonConvert.SerializeObject(new {
                success = false,
                error = "Session expired",
                sessionExpired = true
            }));
            return;
        }

        string action = context.Request.QueryString["action"] ?? "test";
        JObject result;

        switch (action.ToLower())
        {
            case "getcompanies":
                result = GetCompanies();
                break;
            case "getbaselookup":
                string groupName = context.Request.QueryString["groupName"] ?? "";
                result = GetBaseLookup(groupName);
                break;
            case "getcompanydetail":
                int detailCompanyId;
                int.TryParse(context.Request.QueryString["companyId"], out detailCompanyId);
                result = GetCompanyDetail(detailCompanyId);
                break;
            case "savecompanystep1":
                string step1Data = "";
                using (var reader = new StreamReader(context.Request.InputStream))
                {
                    step1Data = reader.ReadToEnd();
                }
                result = SaveCompanyStep1(step1Data);
                break;
            case "uploadattachment":
                result = UploadAttachment(context);
                break;
            case "getattachments":
                int attCompanyId;
                int.TryParse(context.Request.QueryString["companyId"], out attCompanyId);
                result = GetAttachments(attCompanyId);
                break;
            case "deleteattachment":
                int attachmentId;
                int.TryParse(context.Request.QueryString["attachmentId"], out attachmentId);
                result = DeleteAttachment(attachmentId);
                break;
            case "updateattachmentdate":
                string updateAttData = "";
                using (var reader = new StreamReader(context.Request.InputStream))
                {
                    updateAttData = reader.ReadToEnd();
                }
                result = UpdateAttachmentDate(updateAttData);
                break;
            case "addcompany":
                string addData = "";
                using (var reader = new StreamReader(context.Request.InputStream))
                {
                    addData = reader.ReadToEnd();
                }
                result = AddCompany(addData);
                break;
            case "updatecompany":
                string updateData = "";
                using (var reader = new StreamReader(context.Request.InputStream))
                {
                    updateData = reader.ReadToEnd();
                }
                result = UpdateCompany(updateData);
                break;
            case "deletecompany":
                int companyId;
                int.TryParse(context.Request.QueryString["companyId"], out companyId);
                result = DeleteCompany(companyId);
                break;
            case "getcompanydocuments":
                int docCompanyId;
                int.TryParse(context.Request.QueryString["companyId"], out docCompanyId);
                result = GetCompanyDocuments(docCompanyId);
                break;
            case "getboardmembers":
                int bmCompanyId;
                int.TryParse(context.Request.QueryString["companyId"], out bmCompanyId);
                result = GetBoardMembers(bmCompanyId);
                break;
            case "saveboardmember":
                string bmData = "";
                using (var reader = new StreamReader(context.Request.InputStream))
                {
                    bmData = reader.ReadToEnd();
                }
                result = SaveBoardMember(bmData, context);
                break;
            case "deleteboardmember":
                int boardMemberId;
                int.TryParse(context.Request.QueryString["boardMemberId"], out boardMemberId);
                result = DeleteBoardMember(boardMemberId);
                break;
            case "uploadboardmemberfile":
                result = UploadBoardMemberFile(context);
                break;
            case "getfounders":
                int fCompanyId;
                int.TryParse(context.Request.QueryString["companyId"], out fCompanyId);
                result = GetFounders(fCompanyId);
                break;
            case "savefounder":
                string fData = "";
                using (var reader = new StreamReader(context.Request.InputStream))
                {
                    fData = reader.ReadToEnd();
                }
                result = SaveFounder(fData, context);
                break;
            case "deletefounder":
                int founderId;
                int.TryParse(context.Request.QueryString["founderId"], out founderId);
                result = DeleteFounder(founderId);
                break;
            case "getshareholders":
                int shCompanyId;
                int.TryParse(context.Request.QueryString["companyId"], out shCompanyId);
                result = GetShareholders(shCompanyId);
                break;
            case "saveshareholder":
                string shData = "";
                using (var reader = new StreamReader(context.Request.InputStream))
                {
                    shData = reader.ReadToEnd();
                }
                result = SaveShareholder(shData);
                break;
            case "deleteshareholder":
                int shareholderId;
                int.TryParse(context.Request.QueryString["shareholderId"], out shareholderId);
                result = DeleteShareholder(shareholderId);
                break;
            case "getinspectors":
                int iCompanyId;
                int.TryParse(context.Request.QueryString["companyId"], out iCompanyId);
                result = GetInspectors(iCompanyId);
                break;
            case "saveinspector":
                string iData = "";
                using (var reader = new StreamReader(context.Request.InputStream))
                {
                    iData = reader.ReadToEnd();
                }
                result = SaveInspector(iData, context);
                break;
            case "deleteinspector":
                int inspectorId;
                int.TryParse(context.Request.QueryString["inspectorId"], out inspectorId);
                result = DeleteInspector(inspectorId);
                break;
            case "getsignatories":
                int sigCompanyId;
                int.TryParse(context.Request.QueryString["companyId"], out sigCompanyId);
                result = GetSignatories(sigCompanyId);
                break;
            case "savesignatory":
                string sigData = "";
                using (var reader = new StreamReader(context.Request.InputStream))
                {
                    sigData = reader.ReadToEnd();
                }
                result = SaveSignatory(sigData, context);
                break;
            case "deletesignatory":
                int signatoryId;
                int.TryParse(context.Request.QueryString["signatoryId"], out signatoryId);
                result = DeleteSignatory(signatoryId);
                break;
            case "getattachmenttypes":
                result = GetAttachmentTypes();
                break;
            case "saveattachmenttype":
                string attTypeData = "";
                using (var reader = new StreamReader(context.Request.InputStream))
                {
                    attTypeData = reader.ReadToEnd();
                }
                result = SaveAttachmentType(attTypeData);
                break;
            case "deleteattachmenttype":
                int baseId;
                int.TryParse(context.Request.QueryString["baseId"], out baseId);
                result = DeleteAttachmentType(baseId);
                break;
            default:
                result = new JObject { ["success"] = false, ["error"] = "Invalid action" };
                break;
        }

        context.Response.Write(result.ToString());
    }

    private static JObject GetBaseLookup(string groupName)
    {
        try
        {
            if (string.IsNullOrEmpty(groupName))
                return new JObject { ["success"] = false, ["error"] = "groupName الزامی است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    SELECT baseId, nameBase, value, groupName
                    FROM [HitcoForm]..[tbase]
                    WHERE groupName = @groupName AND isActive = 1
                    ORDER BY  TRY_CAST(urgeClass AS INT),value", connection))
                {
                    command.Parameters.AddWithValue("@groupName", groupName);

                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    return new JObject
                    {
                        ["success"] = true,
                        ["data"] = DataTableToJArray(dataSet.Tables[0])
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

    private static JObject GetCompanyDetail(int companyId)
    {
        try
        {
            if (companyId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه شرکت نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    SELECT *
                    FROM [HitcoForm]..[tCompanies]
                    WHERE companyId = @companyId", connection))
                {
                    command.Parameters.AddWithValue("@companyId", companyId);

                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    if (dataSet.Tables[0].Rows.Count == 0)
                        return new JObject { ["success"] = false, ["error"] = "شرکت یافت نشد" };

                    return new JObject
                    {
                        ["success"] = true,
                        ["data"] = DataRowToJObject(dataSet.Tables[0].Rows[0])
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

    private static JObject SaveCompanyStep1(string jsonData)
    {
        try
        {
            JObject data = JObject.Parse(jsonData);
            int companyId = data["companyId"]?.ToObject<int>() ?? 0;

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                if (companyId > 0)
                {
                    // Update existing company
                    using (SqlCommand command = new SqlCommand(@"
                        UPDATE [HitcoForm]..[tCompanies]
                        SET
                            companyName = @companyName,
                            companyNameEn = @companyNameEn,
                            abbCompanyName_EN = @abbCompanyName_EN,
                            companyTypeNo = @companyTypeNo,
                            companyTypeManual = @companyTypeManual,
                            businessActivity = @businessActivity,
                            registrationNumber = @registrationNumber,
                            establishmentDate = @establishmentDate,
                            economicNo = @economicNo,
                            nationalNo = @nationalNo,
                            workshopNo = @workshopNo,
                            taxCaseNumber = @taxCaseNumber,
                            companyStatus = @companyStatus,
                            sharesCount = @sharesCount,
                            address = @address,
                            postalCode = @postalCode,
                            updatedAt = GETDATE()
                        WHERE companyId = @companyId", connection))
                    {
                        command.Parameters.AddWithValue("@companyId", companyId);
                        AddCompanyParameters(command, data);

                        command.ExecuteNonQuery();

                        return new JObject
                        {
                            ["success"] = true,
                            ["companyId"] = companyId,
                            ["message"] = "اطلاعات شرکت با موفقیت ویرایش شد"
                        };
                    }
                }
                else
                {
                    // Insert new company
                    using (SqlCommand command = new SqlCommand(@"
                        INSERT INTO [HitcoForm]..[tCompanies]
                        (companyName, companyNameEn, abbCompanyName_EN, companyTypeNo, companyTypeManual,
                         businessActivity, registrationNumber, establishmentDate, economicNo, nationalNo,
                         workshopNo, taxCaseNumber, companyStatus, sharesCount, address, postalCode, isActive, createdAt, updatedAt)
                        VALUES
                        (@companyName, @companyNameEn, @abbCompanyName_EN, @companyTypeNo, @companyTypeManual,
                         @businessActivity, @registrationNumber, @establishmentDate, @economicNo, @nationalNo,
                         @workshopNo, @taxCaseNumber, @companyStatus, @sharesCount, @address, @postalCode, 1, GETDATE(), GETDATE())

                        SELECT CAST(SCOPE_IDENTITY() as int)", connection))
                    {
                        AddCompanyParameters(command, data);

                        int newId = (int)command.ExecuteScalar();

                        return new JObject
                        {
                            ["success"] = true,
                            ["companyId"] = newId,
                            ["message"] = "شرکت با موفقیت ایجاد شد"
                        };
                    }
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

    private static void AddCompanyParameters(SqlCommand command, JObject data)
    {
        command.Parameters.AddWithValue("@companyName", data["companyName"]?.ToString() ?? "");
        command.Parameters.AddWithValue("@companyNameEn", data["companyNameEn"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@abbCompanyName_EN", data["abbCompanyName_EN"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@companyTypeNo", data["companyTypeNo"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@companyTypeManual", data["companyTypeManual"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@businessActivity", data["businessActivity"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@registrationNumber", data["registrationNumber"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@establishmentDate", data["establishmentDate"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@economicNo", data["economicNo"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@nationalNo", data["nationalNo"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@workshopNo", data["workshopNo"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@taxCaseNumber", data["taxCaseNumber"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@companyStatus", data["companyStatus"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@sharesCount", data["sharesCount"]?.ToObject<decimal?>() ?? 0);
        command.Parameters.AddWithValue("@address", data["address"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@postalCode", data["postalCode"]?.ToString() ?? (object)DBNull.Value);
    }

    private static JObject UploadAttachment(HttpContext context)
    {
        try
        {
            if (context.Request.Files.Count == 0)
                return new JObject { ["success"] = false, ["error"] = "هیچ فایلی انتخاب نشده است" };

            int companyId = int.Parse(context.Request.Form["companyId"]);
            int baseId = int.Parse(context.Request.Form["baseId"]);
            string attachmentDate = context.Request.Form["attachmentDate"] ?? "";
            string attachmentTitle = context.Request.Form["attachmentTitle"] ?? "";

            HttpPostedFile file = context.Request.Files[0];
            string fileExt = Path.GetExtension(file.FileName);

            // Get value from tbase
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            string value = "";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("SELECT value FROM [HitcoForm]..[tbase] WHERE baseId = @baseId", conn))
                {
                    cmd.Parameters.AddWithValue("@baseId", baseId);
                    value = cmd.ExecuteScalar()?.ToString() ?? "000000";
                }
            }

            // Generate filename
            string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
            string randomStr = GenerateRandomString(8);
            string fileName = $"{value}_{companyId}_{timestamp}_{randomStr}{fileExt}";

            // Save file
            string uploadPath = context.Server.MapPath("~/Legal/uploads/companyAttachments/");
            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            string filePath = Path.Combine(uploadPath, fileName);
            file.SaveAs(filePath);

            // Save to database
            string relativeAddress = $"/Legal/uploads/companyAttachments/{fileName}";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                // First, set all other attachments with same companyId and baseId to isLatest = 0
                using (SqlCommand updateCommand = new SqlCommand(@"
                    UPDATE [HitcoForm]..[tCompanyAttachment]
                    SET isLatest = 0
                    WHERE companyId = @companyId AND baseId = @baseId", connection))
                {
                    updateCommand.Parameters.AddWithValue("@companyId", companyId);
                    updateCommand.Parameters.AddWithValue("@baseId", baseId);
                    updateCommand.ExecuteNonQuery();
                }

                // Then insert new attachment with isLatest = 1
                using (SqlCommand command = new SqlCommand(@"
                    INSERT INTO [HitcoForm]..[tCompanyAttachment]
                    (companyId, baseId, attachmentAddress, attachmentDate, attachmentTitle, cdt, isLatest, cid)
                    VALUES
                    (@companyId, @baseId, @attachmentAddress, @attachmentDate, @attachmentTitle, GETDATE(), 1, @cid)

                    SELECT CAST(SCOPE_IDENTITY() as int)", connection))
                {
                    command.Parameters.AddWithValue("@companyId", companyId);
                    command.Parameters.AddWithValue("@baseId", baseId);
                    command.Parameters.AddWithValue("@attachmentAddress", relativeAddress);
                    command.Parameters.AddWithValue("@attachmentDate", attachmentDate);
                    command.Parameters.AddWithValue("@attachmentTitle", attachmentTitle);
                    command.Parameters.AddWithValue("@cid", context.Session["userId"] ?? (object)DBNull.Value);

                    int newId = (int)command.ExecuteScalar();

                    return new JObject
                    {
                        ["success"] = true,
                        ["attachmentId"] = newId,
                        ["fileName"] = fileName,
                        ["message"] = "فایل با موفقیت آپلود شد"
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

    private static string GenerateRandomString(int length)
    {
        const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
    }

    private static JObject DataRowToJObject(DataRow row)
    {
        JObject obj = new JObject();
        foreach (DataColumn column in row.Table.Columns)
        {
            obj[column.ColumnName] = row[column] == DBNull.Value ? null : JToken.FromObject(row[column]);
        }
        return obj;
    }

    private static JArray DataTableToJArray(DataTable table)
    {
        JArray array = new JArray();
        foreach (DataRow row in table.Rows)
        {
            JObject obj = new JObject();
            foreach (DataColumn column in table.Columns)
            {
                obj[column.ColumnName] = row[column] == DBNull.Value ? null : JToken.FromObject(row[column]);
            }
            array.Add(obj);
        }
        return array;
    }

    private static JObject GetAttachments(int companyId)
    {
        try
        {
            if (companyId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه شرکت نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    SELECT
                        ca.companyAttachmentId,
                        ca.companyId,
                        ca.baseId,
                        ca.attachmentAddress,
                        ca.attachmentDate,
                        ca.attachmentTitle,
                        ca.isLatest,
                        tb.nameBase,
                        tb.value
                    FROM [HitcoForm]..[tCompanyAttachment] ca
                    LEFT JOIN [HitcoForm]..[tbase] tb ON ca.baseId = tb.baseId
                    WHERE ca.companyId = @companyId
                    ORDER BY ca.attachmentDate DESC", connection))
                {
                    command.Parameters.AddWithValue("@companyId", companyId);

                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    return new JObject
                    {
                        ["success"] = true,
                        ["data"] = DataTableToJArray(dataSet.Tables[0])
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

    private static JObject DeleteAttachment(int attachmentId)
    {
        try
        {
            if (attachmentId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه پیوست نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                // First, get the file path to delete the physical file
                string attachmentAddress = "";
                using (SqlCommand getFileCmd = new SqlCommand(@"
                    SELECT attachmentAddress
                    FROM [HitcoForm]..[tCompanyAttachment]
                    WHERE companyAttachmentId = @attachmentId", connection))
                {
                    getFileCmd.Parameters.AddWithValue("@attachmentId", attachmentId);
                    var result = getFileCmd.ExecuteScalar();
                    if (result != null)
                        attachmentAddress = result.ToString();
                }

                // Delete the record from database
                using (SqlCommand command = new SqlCommand(@"
                    DELETE FROM [HitcoForm]..[tCompanyAttachment]
                    WHERE companyAttachmentId = @attachmentId", connection))
                {
                    command.Parameters.AddWithValue("@attachmentId", attachmentId);
                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        // Delete the physical file if it exists
                        if (!string.IsNullOrEmpty(attachmentAddress))
                        {
                            try
                            {
                                string physicalPath = HttpContext.Current.Server.MapPath("~" + attachmentAddress);
                                if (File.Exists(physicalPath))
                                {
                                    File.Delete(physicalPath);
                                }
                            }
                            catch
                            {
                                // Continue even if file deletion fails
                            }
                        }

                        return new JObject
                        {
                            ["success"] = true,
                            ["message"] = "پیوست و فایل مربوطه با موفقیت حذف شد"
                        };
                    }
                    else
                    {
                        return new JObject
                        {
                            ["success"] = false,
                            ["message"] = "پیوست یافت نشد"
                        };
                    }
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

    private static JObject UpdateAttachmentDate(string jsonData)
    {
        try
        {
            JObject data = JObject.Parse(jsonData);
            int companyAttachmentId = data["companyAttachmentId"]?.ToObject<int>() ?? 0;
            string attachmentDate = data["attachmentDate"]?.ToString() ?? "";
            string attachmentTitle = data["attachmentTitle"]?.ToString() ?? "";

            if (companyAttachmentId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه پیوست نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    UPDATE [HitcoForm]..[tCompanyAttachment]
                    SET attachmentDate = @attachmentDate,
                        attachmentTitle = @attachmentTitle
                    WHERE companyAttachmentId = @companyAttachmentId", connection))
                {
                    command.Parameters.AddWithValue("@companyAttachmentId", companyAttachmentId);
                    command.Parameters.AddWithValue("@attachmentDate", attachmentDate);
                    command.Parameters.AddWithValue("@attachmentTitle", attachmentTitle);

                    int rowsAffected = command.ExecuteNonQuery();

                    return new JObject
                    {
                        ["success"] = rowsAffected > 0,
                        ["message"] = rowsAffected > 0 ? "تاریخ و عنوان با موفقیت بروزرسانی شد" : "پیوست یافت نشد"
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

    private static JObject GetCompanies()
    {
        try
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    SELECT
                        companyId,
                        companyName,
                        companyNameEn,
                        abbCompanyName_EN,
                        isActive,
                        businessActivity,
                        registrationNumber,
                        economicNo,
                        nationalNo,
                        address,
                        postalCode,
                        createdAt,
                        updatedAt,
                        sharesCount
                    FROM [HitcoForm]..[tCompanies]
                    ORDER BY companyName", connection))
                {
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    JArray companies = DataTableToJArray(dataSet.Tables[0]);

                    // Get shareholders and board members for each company
                    foreach (JObject company in companies)
                    {
                        int companyId = company["companyId"]?.ToObject<int>() ?? 0;

                        // Get shareholders
                        using (SqlCommand shareholdersCmd = new SqlCommand(@"
                            SELECT ISNULL(sh.fullName, bm.fullName) as fullName , ISNULL(sh.sharesCount, bm.sharesCount) as sharesCount
                            FROM [HitcoForm]..[tCompanyShareholders] sh
                            LEFT JOIN [HitcoForm]..[tCompanyBoardMembers] bm on bm.boardMemberId = sh.boardMemberId
                            WHERE sh.companyId = @companyId
                            ORDER BY sharesCount DESC", connection))
                        {
                            shareholdersCmd.Parameters.AddWithValue("@companyId", companyId);

                            DataSet shareholdersDataSet = new DataSet();
                            SqlDataAdapter shareholdersAdapter = new SqlDataAdapter(shareholdersCmd);
                            shareholdersAdapter.Fill(shareholdersDataSet);

                            company["shareholders"] = DataTableToJArray(shareholdersDataSet.Tables[0]);
                        }

                        // Get board members
                        using (SqlCommand boardMembersCmd = new SqlCommand(@"
                            SELECT boardMemberId, fullName
                            FROM [HitcoForm]..[tCompanyBoardMembers]
                            WHERE companyId = @companyId", connection))
                        {
                            boardMembersCmd.Parameters.AddWithValue("@companyId", companyId);

                            DataSet boardMembersDataSet = new DataSet();
                            SqlDataAdapter boardMembersAdapter = new SqlDataAdapter(boardMembersCmd);
                            boardMembersAdapter.Fill(boardMembersDataSet);

                            company["boardMembers"] = DataTableToJArray(boardMembersDataSet.Tables[0]);
                        }
                    }

                    return new JObject
                    {
                        ["success"] = true,
                        ["data"] = companies,
                        ["count"] = companies.Count,
                        //["Session"] = HttpContext.Current.Session["userId"]?.ToString() ?? "null"
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

    private static JObject AddCompany(string jsonData)
    {
        try
        {
            JObject data = JObject.Parse(jsonData);

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    INSERT INTO [HitcoForm]..[tCompanies]
                    (companyName, companyNameEn, abbCompanyName_EN, isActive, businessActivity,
                     registrationNumber, economicNo, nationalNo, address, postalCode, createdAt, updatedAt)
                    VALUES
                    (@companyName, @companyNameEn, @abbCompanyName_EN, @isActive, @businessActivity,
                     @registrationNumber, @economicNo, @nationalNo, @address, @postalCode, GETDATE(), GETDATE())

                    SELECT CAST(SCOPE_IDENTITY() as int)", connection))
                {
                    command.Parameters.AddWithValue("@companyName", data["companyName"]?.ToString() ?? "");
                    command.Parameters.AddWithValue("@companyNameEn", data["companyNameEn"]?.ToString() ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@abbCompanyName_EN", data["abbCompanyName_EN"]?.ToString() ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@isActive", data["isActive"]?.ToObject<bool>() ?? true);
                    command.Parameters.AddWithValue("@businessActivity", data["businessActivity"]?.ToString() ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@registrationNumber", data["registrationNumber"]?.ToString() ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@economicNo", data["economicNo"]?.ToString() ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@nationalNo", data["nationalNo"]?.ToString() ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@address", data["address"]?.ToString() ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@postalCode", data["postalCode"]?.ToString() ?? (object)DBNull.Value);

                    int newId = (int)command.ExecuteScalar();

                    return new JObject
                    {
                        ["success"] = true,
                        ["companyId"] = newId,
                        ["message"] = "شرکت با موفقیت اضافه شد"
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

    private static JObject UpdateCompany(string jsonData)
    {
        try
        {
            JObject data = JObject.Parse(jsonData);

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    UPDATE [HitcoForm]..[tCompanies]
                    SET
                        companyName = @companyName,
                        companyNameEn = @companyNameEn,
                        abbCompanyName_EN = @abbCompanyName_EN,
                        businessActivity = @businessActivity,
                        registrationNumber = @registrationNumber,
                        economicNo = @economicNo,
                        nationalNo = @nationalNo,
                        address = @address,
                        postalCode = @postalCode,
                        updatedAt = GETDATE()
                    WHERE companyId = @companyId", connection))
                {
                    command.Parameters.AddWithValue("@companyId", data["companyId"]?.ToObject<int>() ?? 0);
                    command.Parameters.AddWithValue("@companyName", data["companyName"]?.ToString() ?? "");
                    command.Parameters.AddWithValue("@companyNameEn", data["companyNameEn"]?.ToString() ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@abbCompanyName_EN", data["abbCompanyName_EN"]?.ToString() ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@businessActivity", data["businessActivity"]?.ToString() ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@registrationNumber", data["registrationNumber"]?.ToString() ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@economicNo", data["economicNo"]?.ToString() ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@nationalNo", data["nationalNo"]?.ToString() ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@address", data["address"]?.ToString() ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@postalCode", data["postalCode"]?.ToString() ?? (object)DBNull.Value);

                    int rowsAffected = command.ExecuteNonQuery();

                    return new JObject
                    {
                        ["success"] = rowsAffected > 0,
                        ["message"] = rowsAffected > 0 ? "شرکت با موفقیت ویرایش شد" : "شرکت یافت نشد"
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

    private static JObject DeleteCompany(int companyId)
    {
        try
        {
            if (companyId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه شرکت نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                // First, get all attachment file paths to delete physical files
                using (SqlCommand getAttachmentsCmd = new SqlCommand(@"
                    SELECT attachmentAddress
                    FROM [HitcoForm]..[tCompanyAttachment]
                    WHERE companyId = @companyId", connection))
                {
                    getAttachmentsCmd.Parameters.AddWithValue("@companyId", companyId);

                    using (SqlDataReader reader = getAttachmentsCmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string attachmentAddress = reader["attachmentAddress"]?.ToString();
                            if (!string.IsNullOrEmpty(attachmentAddress))
                            {
                                try
                                {
                                    string physicalPath = HttpContext.Current.Server.MapPath("~" + attachmentAddress);
                                    if (File.Exists(physicalPath))
                                    {
                                        File.Delete(physicalPath);
                                    }
                                }
                                catch
                                {
                                    // Continue even if file deletion fails
                                }
                            }
                        }
                    }
                }

                // Delete related records from child tables
                using (SqlCommand deleteRelatedCmd = new SqlCommand(@"
                    DELETE FROM [HitcoForm]..[tCompanyBoardMembers] WHERE companyId = @companyId;
                    DELETE FROM [HitcoForm]..[tCompanyFounders] WHERE companyId = @companyId;
                    DELETE FROM [HitcoForm]..[tCompanyShareholders] WHERE companyId = @companyId;
                    DELETE FROM [HitcoForm]..[tCompanyInspectors] WHERE companyId = @companyId;
                    DELETE FROM [HitcoForm]..[tCompanyAttachment] WHERE companyId = @companyId;", connection))
                {
                    deleteRelatedCmd.Parameters.AddWithValue("@companyId", companyId);
                    deleteRelatedCmd.ExecuteNonQuery();
                }

                // Finally, delete the company itself
                using (SqlCommand command = new SqlCommand(@"
                    DELETE FROM [HitcoForm]..[tCompanies]
                    WHERE companyId = @companyId", connection))
                {
                    command.Parameters.AddWithValue("@companyId", companyId);

                    int rowsAffected = command.ExecuteNonQuery();

                    return new JObject
                    {
                        ["success"] = rowsAffected > 0,
                        ["message"] = rowsAffected > 0 ? "شرکت و تمام اطلاعات مرتبط با موفقیت حذف شد" : "شرکت یافت نشد"
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

    private static JObject GetCompanyDocuments(int companyId)
    {
        try
        {
            if (companyId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه شرکت نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                // Get all documents
                using (SqlCommand command = new SqlCommand(@"
                    SELECT
                        ca.companyAttachmentId,
                        ca.companyId,
                        ca.baseId,
                        ca.boardMemberId,
                        ca.attachmentType,
                        tb.nameBase as documentName,
                        ca.attachmentTitle,
                        ca.attachmentAddress,
                        ca.attachmentDate,
                        ca.isLatest,
                        bm.fullName as boardMemberName
                    FROM [HitcoForm]..[tCompanyAttachment] ca
                    LEFT JOIN [HitcoForm]..[tbase] tb ON ca.baseId = tb.baseId
                    LEFT JOIN [HitcoForm]..[tCompanyBoardMembers] bm ON ca.boardMemberId = bm.boardMemberId
                    WHERE ca.companyId = @companyId
                        AND (
                            (ca.baseId IS NOT NULL AND ca.isLatest = 1)  -- Documents with baseId, only latest
                            OR ca.baseId IS NULL  -- Documents without baseId, all of them
                        )
                    ORDER BY ca.attachmentDate DESC", connection))
                {
                    command.Parameters.AddWithValue("@companyId", companyId);

                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    return new JObject
                    {
                        ["success"] = true,
                        ["data"] = DataTableToJArray(dataSet.Tables[0])
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

    // Board Members Methods
    private static JObject GetBoardMembers(int companyId)
    {
        try
        {
            if (companyId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه شرکت نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    SELECT
                        bm.*,
                        stf.attachmentAddress as shareTrusteeFile,
                        ccf.attachmentAddress as cooperationCommitmentFile
                    FROM [HitcoForm]..[tCompanyBoardMembers] bm
                    LEFT JOIN [HitcoForm]..[tCompanyAttachment] stf
                        ON bm.boardMemberId = stf.boardMemberId
                        AND stf.attachmentType = 'shareTrusteeFile'
                        AND stf.isLatest = 1
                    LEFT JOIN [HitcoForm]..[tCompanyAttachment] ccf
                        ON bm.boardMemberId = ccf.boardMemberId
                        AND ccf.attachmentType = 'cooperationCommitmentFile'
                        AND ccf.isLatest = 1
                    WHERE bm.companyId = @companyId
                    ORDER BY bm.boardMemberId", connection))
                {
                    command.Parameters.AddWithValue("@companyId", companyId);

                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    JArray boardMembers = DataTableToJArray(dataSet.Tables[0]);

                    // Get custom attachments for each board member
                    foreach (JObject boardMember in boardMembers)
                    {
                        int boardMemberId = boardMember["boardMemberId"]?.ToObject<int>() ?? 0;

                        using (SqlCommand customAttCmd = new SqlCommand(@"
                            SELECT companyAttachmentId, attachmentTitle, attachmentAddress
                            FROM [HitcoForm]..[tCompanyAttachment]
                            WHERE boardMemberId = @boardMemberId
                            AND attachmentType = 'custom'
                            AND isLatest = 1
                            ORDER BY companyAttachmentId", connection))
                        {
                            customAttCmd.Parameters.AddWithValue("@boardMemberId", boardMemberId);

                            DataSet customDataSet = new DataSet();
                            SqlDataAdapter customAdapter = new SqlDataAdapter(customAttCmd);
                            customAdapter.Fill(customDataSet);

                            boardMember["customAttachments"] = DataTableToJArray(customDataSet.Tables[0]);
                        }
                    }

                    return new JObject
                    {
                        ["success"] = true,
                        ["data"] = boardMembers
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

    private static JObject SaveBoardMember(string jsonData, HttpContext context)
    {
        try
        {
            JObject data = JObject.Parse(jsonData);
            int boardMemberId = data["boardMemberId"]?.ToObject<int>() ?? 0;
            int companyId = data["companyId"]?.ToObject<int>() ?? 0;

            if (companyId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه شرکت الزامی است" };

            // Validate based on person type
            bool isLegalPerson = data["isLegalPerson"]?.ToObject<bool>() ?? false;
            string nationalNo = data["nationalNo"]?.ToString();
            string economicNo = data["economicNo"]?.ToString();

            /*if (!isLegalPerson) // حقیقی (0)
            {
                if (string.IsNullOrWhiteSpace(nationalNo))
                {
                    return new JObject { ["success"] = false, ["error"] = "برای شخص حقیقی، کد ملی الزامی است" };
                }
            }
            else // حقوقی (1)
            {
                if (string.IsNullOrWhiteSpace(economicNo))
                {
                    return new JObject { ["success"] = false, ["error"] = "برای شخص حقوقی، شناسه اقتصادی الزامی است" };
                }
            }*/

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                // Get company's total shares count
                decimal companySharesCount = 0;
                using (SqlCommand getCompanyCmd = new SqlCommand(@"
                    SELECT ISNULL(sharesCount, 0)
                    FROM [HitcoForm]..[tCompanies]
                    WHERE companyId = @companyId", connection))
                {
                    getCompanyCmd.Parameters.AddWithValue("@companyId", companyId);
                    object result = getCompanyCmd.ExecuteScalar();
                    if (result != null && result != DBNull.Value)
                    {
                        companySharesCount = Convert.ToDecimal(result);
                    }
                }

                // Tier 1 Validation: Individual member shares <= company total
                decimal memberSharesCount = data["sharesCount"]?.ToObject<decimal?>() ?? 0;
                if (memberSharesCount > companySharesCount)
                {
                    return new JObject
                    {
                        ["success"] = false,
                        ["error"] = $"تعداد سهام عضو ({memberSharesCount}) نمی‌تواند بیشتر از کل سهام شرکت ({companySharesCount}) باشد"
                    };
                }

                // Tier 2 Validation: Sum of all members' shares (excluding current if update) <= company total
                decimal otherMembersSharesSum = 0;
                using (SqlCommand sumCmd = new SqlCommand(@"
                    SELECT ISNULL(SUM(sharesCount), 0)
                    FROM [HitcoForm]..[tCompanyBoardMembers]
                    WHERE companyId = @companyId
                    AND (@boardMemberId = 0 OR boardMemberId != @boardMemberId)", connection))
                {
                    sumCmd.Parameters.AddWithValue("@companyId", companyId);
                    sumCmd.Parameters.AddWithValue("@boardMemberId", boardMemberId);
                    object result = sumCmd.ExecuteScalar();
                    if (result != null && result != DBNull.Value)
                    {
                        otherMembersSharesSum = Convert.ToDecimal(result);
                    }
                }

                decimal totalSharesAfterSave = otherMembersSharesSum + memberSharesCount;
                if (totalSharesAfterSave > companySharesCount)
                {
                    return new JObject
                    {
                        ["success"] = false,
                        ["error"] = $"مجموع سهام اعضا ({totalSharesAfterSave}) نمی‌تواند بیشتر از کل سهام شرکت ({companySharesCount}) باشد"
                    };
                }

                if (boardMemberId > 0)
                {
                    // Update
                    using (SqlCommand command = new SqlCommand(@"
                        UPDATE [HitcoForm]..[tCompanyBoardMembers]
                        SET
                            isLegalPerson = @isLegalPerson,
                            fullName = @fullName,
                            nationalNo = @nationalNo,
                            economicNo = @economicNo,
                            isExecutive = @isExecutive,
                            boardPosition = @boardPosition,
                            organizationPosition = @organizationPosition,
                            signatureAuthorization = @signatureAuthorization,
                            activityStartDate = @activityStartDate,
                            activityEndDate = @activityEndDate,
                            sharesCount = @sharesCount,
                            isShareTrustee = @isShareTrustee,
                            hasCooperationCommitment = @hasCooperationCommitment
                        WHERE boardMemberId = @boardMemberId", connection))
                    {
                        command.Parameters.AddWithValue("@boardMemberId", boardMemberId);
                        AddBoardMemberParameters(command, data);
                        command.ExecuteNonQuery();

                        // Handle file attachments
                        string shareTrusteeFile = data["shareTrusteeFile"]?.ToString();
                        string cooperationCommitmentFile = data["cooperationCommitmentFile"]?.ToString();

                        // Update shareTrusteeFile attachment if provided
                        if (!string.IsNullOrEmpty(shareTrusteeFile))
                        {
                            // Set old attachments to not latest
                            using (SqlCommand updateOldCmd = new SqlCommand(@"
                                UPDATE [HitcoForm]..[tCompanyAttachment]
                                SET isLatest = 0
                                WHERE boardMemberId = @boardMemberId AND attachmentType = 'shareTrusteeFile'", connection))
                            {
                                updateOldCmd.Parameters.AddWithValue("@boardMemberId", boardMemberId);
                                updateOldCmd.ExecuteNonQuery();
                            }

                            // Insert new attachment
                            using (SqlCommand insertAttCmd = new SqlCommand(@"
                                INSERT INTO [HitcoForm]..[tCompanyAttachment]
                                (companyId, boardMemberId, attachmentType, attachmentTitle, attachmentAddress, isLatest, cid)
                                VALUES (@companyId, @boardMemberId, 'shareTrusteeFile', @attachmentTitle, @attachmentAddress, 1, @cid)", connection))
                            {
                                insertAttCmd.Parameters.AddWithValue("@companyId", companyId);
                                insertAttCmd.Parameters.AddWithValue("@boardMemberId", boardMemberId);
                                insertAttCmd.Parameters.AddWithValue("@attachmentAddress", shareTrusteeFile);
                                insertAttCmd.Parameters.AddWithValue("@attachmentTitle", "قرارداد امین السهم");
                                insertAttCmd.Parameters.AddWithValue("@cid", context.Session["userId"] ?? (object)DBNull.Value);
                                insertAttCmd.ExecuteNonQuery();
                            }
                        }

                        // Update cooperationCommitmentFile attachment if provided
                        if (!string.IsNullOrEmpty(cooperationCommitmentFile))
                        {
                            // Set old attachments to not latest
                            using (SqlCommand updateOldCmd = new SqlCommand(@"
                                UPDATE [HitcoForm]..[tCompanyAttachment]
                                SET isLatest = 0
                                WHERE boardMemberId = @boardMemberId AND attachmentType = 'cooperationCommitmentFile'", connection))
                            {
                                updateOldCmd.Parameters.AddWithValue("@boardMemberId", boardMemberId);
                                updateOldCmd.ExecuteNonQuery();
                            }

                            // Insert new attachment
                            using (SqlCommand insertAttCmd = new SqlCommand(@"
                                INSERT INTO [HitcoForm]..[tCompanyAttachment]
                                (companyId, boardMemberId, attachmentType, attachmentTitle, attachmentAddress, isLatest, cid)
                                VALUES (@companyId, @boardMemberId, 'cooperationCommitmentFile', @attachmentTitle, @attachmentAddress, 1, @cid)", connection))
                            {
                                insertAttCmd.Parameters.AddWithValue("@companyId", companyId);
                                insertAttCmd.Parameters.AddWithValue("@boardMemberId", boardMemberId);
                                insertAttCmd.Parameters.AddWithValue("@attachmentAddress", cooperationCommitmentFile);
                                insertAttCmd.Parameters.AddWithValue("@attachmentTitle", "قرارداد تعهد همکاری");
                                insertAttCmd.Parameters.AddWithValue("@cid", context.Session["userId"] ?? (object)DBNull.Value);
                                insertAttCmd.ExecuteNonQuery();
                            }
                        }

                        // Update or insert into tCompanyShareholders
                        using (SqlCommand shareholderCheckCmd = new SqlCommand(@"
                            SELECT shareholderId FROM [HitcoForm]..[tCompanyShareholders]
                            WHERE boardMemberId = @boardMemberId", connection))
                        {
                            shareholderCheckCmd.Parameters.AddWithValue("@boardMemberId", boardMemberId);
                            var shareholderIdObj = shareholderCheckCmd.ExecuteScalar();

                            if (shareholderIdObj != null)
                            {
                                // Update existing shareholder record
                                using (SqlCommand updateShareholderCmd = new SqlCommand(@"
                                    UPDATE [HitcoForm]..[tCompanyShareholders]
                                    SET sharesCount = @sharesCount
                                    WHERE boardMemberId = @boardMemberId", connection))
                                {
                                    updateShareholderCmd.Parameters.AddWithValue("@boardMemberId", boardMemberId);
                                    updateShareholderCmd.Parameters.AddWithValue("@sharesCount", memberSharesCount);
                                    updateShareholderCmd.ExecuteNonQuery();
                                }
                            }
                            else
                            {
                                // Insert new shareholder record
                                using (SqlCommand insertShareholderCmd = new SqlCommand(@"
                                    INSERT INTO [HitcoForm]..[tCompanyShareholders]
                                    (companyId, boardMemberId, sharesCount, cid)
                                    VALUES (@companyId, @boardMemberId, @sharesCount, @cid)", connection))
                                {
                                    insertShareholderCmd.Parameters.AddWithValue("@companyId", companyId);
                                    insertShareholderCmd.Parameters.AddWithValue("@boardMemberId", boardMemberId);
                                    insertShareholderCmd.Parameters.AddWithValue("@sharesCount", memberSharesCount);
                                    insertShareholderCmd.Parameters.AddWithValue("@cid", context.Session["userId"] ?? (object)DBNull.Value);
                                    insertShareholderCmd.ExecuteNonQuery();
                                }
                            }
                        }

                        // Handle deleted custom attachments
                        JArray deletedCustomAttachmentIds = data["deletedCustomAttachmentIds"] as JArray;
                        if (deletedCustomAttachmentIds != null && deletedCustomAttachmentIds.Count > 0)
                        {
                            foreach (int attachmentId in deletedCustomAttachmentIds)
                            {
                                using (SqlCommand deleteAttCmd = new SqlCommand(@"
                                    DELETE FROM [HitcoForm]..[tCompanyAttachment]
                                    WHERE companyAttachmentId = @attachmentId
                                    AND boardMemberId = @boardMemberId
                                    AND attachmentType = 'custom'", connection))
                                {
                                    deleteAttCmd.Parameters.AddWithValue("@attachmentId", attachmentId);
                                    deleteAttCmd.Parameters.AddWithValue("@boardMemberId", boardMemberId);
                                    deleteAttCmd.ExecuteNonQuery();
                                }
                            }
                        }

                        // Handle custom attachments
                        JArray customAttachments = data["customAttachments"] as JArray;
                        if (customAttachments != null && customAttachments.Count > 0)
                        {
                            foreach (JObject attachment in customAttachments)
                            {
                                string attachmentTitle = attachment["attachmentTitle"]?.ToString();
                                string uploadedPath = attachment["uploadedPath"]?.ToString();

                                // Only insert new custom attachments (ones with uploadedPath)
                                if (!string.IsNullOrEmpty(uploadedPath))
                                {
                                    using (SqlCommand insertCustomAttCmd = new SqlCommand(@"
                                        INSERT INTO [HitcoForm]..[tCompanyAttachment]
                                        (companyId, boardMemberId, attachmentType, attachmentTitle, attachmentAddress, isLatest, cid)
                                        VALUES (@companyId, @boardMemberId, 'custom', @attachmentTitle, @attachmentAddress, 1, @cid)", connection))
                                    {
                                        insertCustomAttCmd.Parameters.AddWithValue("@companyId", companyId);
                                        insertCustomAttCmd.Parameters.AddWithValue("@boardMemberId", boardMemberId);
                                        insertCustomAttCmd.Parameters.AddWithValue("@attachmentTitle", attachmentTitle);
                                        insertCustomAttCmd.Parameters.AddWithValue("@attachmentAddress", uploadedPath);
                                        insertCustomAttCmd.Parameters.AddWithValue("@cid", context.Session["userId"] ?? (object)DBNull.Value);
                                        insertCustomAttCmd.ExecuteNonQuery();
                                    }
                                }
                            }
                        }

                        return new JObject
                        {
                            ["success"] = true,
                            ["message"] = "عضو هیئت مدیره با موفقیت ویرایش شد"
                        };
                    }
                }
                else
                {
                    // Insert
                    using (SqlCommand command = new SqlCommand(@"
                        INSERT INTO [HitcoForm]..[tCompanyBoardMembers]
                        (companyId, isLegalPerson, fullName, nationalNo, economicNo, isExecutive,
                         boardPosition, organizationPosition, signatureAuthorization, activityStartDate, activityEndDate, sharesCount,
                         isShareTrustee, hasCooperationCommitment, cid)
                        VALUES
                        (@companyId, @isLegalPerson, @fullName, @nationalNo, @economicNo, @isExecutive,
                         @boardPosition, @organizationPosition, @signatureAuthorization, @activityStartDate, @activityEndDate, @sharesCount,
                         @isShareTrustee, @hasCooperationCommitment, @cid)

                        SELECT CAST(SCOPE_IDENTITY() as int)", connection))
                    {
                        command.Parameters.AddWithValue("@companyId", companyId);
                        AddBoardMemberParameters(command, data);
                        command.Parameters.AddWithValue("@cid", context.Session["userId"] ?? (object)DBNull.Value);
                        int newId = (int)command.ExecuteScalar();

                        // Handle file attachments
                        string shareTrusteeFile = data["shareTrusteeFile"]?.ToString();
                        string cooperationCommitmentFile = data["cooperationCommitmentFile"]?.ToString();

                        // Insert shareTrusteeFile attachment if provided
                        if (!string.IsNullOrEmpty(shareTrusteeFile))
                        {
                            using (SqlCommand insertAttCmd = new SqlCommand(@"
                                INSERT INTO [HitcoForm]..[tCompanyAttachment]
                                (companyId, boardMemberId, attachmentType, attachmentAddress, isLatest, cid)
                                VALUES (@companyId, @boardMemberId, 'shareTrusteeFile', @attachmentAddress, 1, @cid)", connection))
                            {
                                insertAttCmd.Parameters.AddWithValue("@companyId", companyId);
                                insertAttCmd.Parameters.AddWithValue("@boardMemberId", newId);
                                insertAttCmd.Parameters.AddWithValue("@attachmentAddress", shareTrusteeFile);
                                insertAttCmd.Parameters.AddWithValue("@cid", context.Session["userId"] ?? (object)DBNull.Value);
                                insertAttCmd.ExecuteNonQuery();
                            }
                        }

                        // Insert cooperationCommitmentFile attachment if provided
                        if (!string.IsNullOrEmpty(cooperationCommitmentFile))
                        {
                            using (SqlCommand insertAttCmd = new SqlCommand(@"
                                INSERT INTO [HitcoForm]..[tCompanyAttachment]
                                (companyId, boardMemberId, attachmentType, attachmentAddress, isLatest, cid)
                                VALUES (@companyId, @boardMemberId, 'cooperationCommitmentFile', @attachmentAddress, 1, @cid)", connection))
                            {
                                insertAttCmd.Parameters.AddWithValue("@companyId", companyId);
                                insertAttCmd.Parameters.AddWithValue("@boardMemberId", newId);
                                insertAttCmd.Parameters.AddWithValue("@attachmentAddress", cooperationCommitmentFile);
                                insertAttCmd.Parameters.AddWithValue("@cid", context.Session["userId"] ?? (object)DBNull.Value);
                                insertAttCmd.ExecuteNonQuery();
                            }
                        }

                        // Insert into tCompanyShareholders
                        using (SqlCommand insertShareholderCmd = new SqlCommand(@"
                            INSERT INTO [HitcoForm]..[tCompanyShareholders]
                            (companyId, boardMemberId, sharesCount, cid)
                            VALUES (@companyId, @boardMemberId, @sharesCount, @cid)", connection))
                        {
                            insertShareholderCmd.Parameters.AddWithValue("@companyId", companyId);
                            insertShareholderCmd.Parameters.AddWithValue("@boardMemberId", newId);
                            insertShareholderCmd.Parameters.AddWithValue("@sharesCount", memberSharesCount);
                            insertShareholderCmd.Parameters.AddWithValue("@cid", context.Session["userId"] ?? (object)DBNull.Value);
                            insertShareholderCmd.ExecuteNonQuery();
                        }

                        // Handle custom attachments
                        JArray customAttachments = data["customAttachments"] as JArray;
                        if (customAttachments != null && customAttachments.Count > 0)
                        {
                            foreach (JObject attachment in customAttachments)
                            {
                                string attachmentTitle = attachment["attachmentTitle"]?.ToString();
                                string uploadedPath = attachment["uploadedPath"]?.ToString();

                                // Only insert new custom attachments (ones with uploadedPath)
                                if (!string.IsNullOrEmpty(uploadedPath))
                                {
                                    using (SqlCommand insertCustomAttCmd = new SqlCommand(@"
                                        INSERT INTO [HitcoForm]..[tCompanyAttachment]
                                        (companyId, boardMemberId, attachmentType, attachmentTitle, attachmentAddress, isLatest, cid)
                                        VALUES (@companyId, @boardMemberId, 'custom', @attachmentTitle, @attachmentAddress, 1, @cid)", connection))
                                    {
                                        insertCustomAttCmd.Parameters.AddWithValue("@companyId", companyId);
                                        insertCustomAttCmd.Parameters.AddWithValue("@boardMemberId", newId);
                                        insertCustomAttCmd.Parameters.AddWithValue("@attachmentTitle", attachmentTitle);
                                        insertCustomAttCmd.Parameters.AddWithValue("@attachmentAddress", uploadedPath);
                                        insertCustomAttCmd.Parameters.AddWithValue("@cid", context.Session["userId"] ?? (object)DBNull.Value);
                                        insertCustomAttCmd.ExecuteNonQuery();
                                    }
                                }
                            }
                        }

                        return new JObject
                        {
                            ["success"] = true,
                            ["boardMemberId"] = newId,
                            ["message"] = "عضو هیئت مدیره با موفقیت اضافه شد"
                        };
                    }
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

    private static void AddBoardMemberParameters(SqlCommand command, JObject data)
    {
        command.Parameters.AddWithValue("@isLegalPerson", data["isLegalPerson"]?.ToObject<bool>() ?? false);
        command.Parameters.AddWithValue("@fullName", data["fullName"]?.ToString() ?? "");
        command.Parameters.AddWithValue("@nationalNo", data["nationalNo"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@economicNo", data["economicNo"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@isExecutive", data["isExecutive"]?.ToObject<bool>() ?? false);
        command.Parameters.AddWithValue("@boardPosition", data["boardPosition"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@organizationPosition", data["organizationPosition"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@signatureAuthorization", data["signatureAuthorization"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@activityStartDate", data["activityStartDate"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@activityEndDate", data["activityEndDate"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@sharesCount", data["sharesCount"]?.ToObject<float?>() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@isShareTrustee", data["isShareTrustee"]?.ToObject<bool>() ?? false);
        command.Parameters.AddWithValue("@hasCooperationCommitment", data["hasCooperationCommitment"]?.ToObject<bool>() ?? false);
    }

    private static JObject DeleteBoardMember(int boardMemberId)
    {
        try
        {
            if (boardMemberId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه عضو نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                // Check if board member is used in signatories
                using (SqlCommand checkCommand = new SqlCommand(@"
                    SELECT COUNT(*)
                    FROM [HitcoForm]..[tCompanySignatories]
                    WHERE boardMemberIds IS NOT NULL
                    AND ',' + boardMemberIds + ',' LIKE '%,' + CAST(@boardMemberId AS VARCHAR) + ',%'", connection))
                {
                    checkCommand.Parameters.AddWithValue("@boardMemberId", boardMemberId);
                    int usageCount = (int)checkCommand.ExecuteScalar();

                    if (usageCount > 0)
                    {
                        return new JObject
                        {
                            ["success"] = false,
                            ["error"] = "این عضو دارای حق امضا بوده و قابل حذف نیست"
                        };
                    }
                }

                // Delete related attachments from tCompanyAttachment
                using (SqlCommand deleteAttachmentsCmd = new SqlCommand(@"
                    DELETE FROM [HitcoForm]..[tCompanyAttachment]
                    WHERE boardMemberId = @boardMemberId", connection))
                {
                    deleteAttachmentsCmd.Parameters.AddWithValue("@boardMemberId", boardMemberId);
                    deleteAttachmentsCmd.ExecuteNonQuery();
                }

                // Delete from tCompanyShareholders
                using (SqlCommand deleteShareholderCmd = new SqlCommand(@"
                    DELETE FROM [HitcoForm]..[tCompanyShareholders]
                    WHERE boardMemberId = @boardMemberId", connection))
                {
                    deleteShareholderCmd.Parameters.AddWithValue("@boardMemberId", boardMemberId);
                    deleteShareholderCmd.ExecuteNonQuery();
                }

                // Delete from tCompanyBoardMembers
                using (SqlCommand command = new SqlCommand(@"
                    DELETE FROM [HitcoForm]..[tCompanyBoardMembers]
                    WHERE boardMemberId = @boardMemberId", connection))
                {
                    command.Parameters.AddWithValue("@boardMemberId", boardMemberId);
                    int rowsAffected = command.ExecuteNonQuery();

                    return new JObject
                    {
                        ["success"] = rowsAffected > 0,
                        ["message"] = rowsAffected > 0 ? "عضو با موفقیت حذف شد" : "عضو یافت نشد"
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

    private static JObject UploadBoardMemberFile(HttpContext context)
    {
        try
        {
            if (context.Request.Files.Count == 0)
                return new JObject { ["success"] = false, ["error"] = "فایلی انتخاب نشده است" };

            HttpPostedFile file = context.Request.Files[0];
            string companyIdStr = context.Request.Form["companyId"];
            string fileType = context.Request.Form["fileType"];

            if (string.IsNullOrEmpty(companyIdStr))
                return new JObject { ["success"] = false, ["error"] = "شناسه شرکت الزامی است" };

            if (string.IsNullOrEmpty(fileType))
                return new JObject { ["success"] = false, ["error"] = "نوع فایل الزامی است" };

            int companyId = int.Parse(companyIdStr);

            // Validate file extension
            string fileExt = Path.GetExtension(file.FileName).ToLower();
            /*string[] allowedExtensions = { ".pdf", ".jpg", ".jpeg", ".png" };
            if (!allowedExtensions.Contains(fileExt))
                return new JObject { ["success"] = false, ["error"] = "فرمت فایل مجاز نیست. فقط PDF, JPG, JPEG, PNG مجاز است" };
            */
            // Validate file size (max 10MB)
            if (file.ContentLength > 20 * 1024 * 1024)
                return new JObject { ["success"] = false, ["error"] = "حجم فایل نباید بیشتر از 20 مگابایت باشد" };

            // Generate filename
            string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
            string randomStr = GenerateRandomString(8);
            string fileName = $"{fileType}_{companyId}_{timestamp}_{randomStr}{fileExt}";

            // Save file
            string uploadPath = context.Server.MapPath("~/Legal/uploads/companyAttachments/");
            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            string filePath = Path.Combine(uploadPath, fileName);
            file.SaveAs(filePath);

            // Save to database
            string relativeAddress = $"/Legal/uploads/companyAttachments/{fileName}";

            return new JObject
            {
                ["success"] = true,
                ["filePath"] = relativeAddress,
                ["message"] = "فایل با موفقیت آپلود شد"
            };
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

    // Founders Methods
    private static JObject GetFounders(int companyId)
    {
        try
        {
            if (companyId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه شرکت نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    SELECT *
                    FROM [HitcoForm]..[tCompanyFounders]
                    WHERE companyId = @companyId
                    ORDER BY founderId", connection))
                {
                    command.Parameters.AddWithValue("@companyId", companyId);

                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    return new JObject
                    {
                        ["success"] = true,
                        ["data"] = DataTableToJArray(dataSet.Tables[0])
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

    private static JObject SaveFounder(string jsonData, HttpContext context)
    {
        try
        {
            JObject data = JObject.Parse(jsonData);
            int founderId = data["founderId"]?.ToObject<int>() ?? 0;
            int companyId = data["companyId"]?.ToObject<int>() ?? 0;

            if (companyId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه شرکت الزامی است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                if (founderId > 0)
                {
                    // Update
                    using (SqlCommand command = new SqlCommand(@"
                        UPDATE [HitcoForm]..[tCompanyFounders]
                        SET
                            isLegalPerson = @isLegalPerson,
                            fullName = @fullName,
                            nationalNo = @nationalNo,
                            economicNo = @economicNo
                        WHERE founderId = @founderId", connection))
                    {
                        command.Parameters.AddWithValue("@founderId", founderId);
                        AddFounderParameters(command, data);
                        command.ExecuteNonQuery();

                        return new JObject
                        {
                            ["success"] = true,
                            ["message"] = "مؤسس با موفقیت ویرایش شد"
                        };
                    }
                }
                else
                {
                    // Insert
                    using (SqlCommand command = new SqlCommand(@"
                        INSERT INTO [HitcoForm]..[tCompanyFounders]
                        (companyId, isLegalPerson, fullName, nationalNo, economicNo, cid)
                        VALUES
                        (@companyId, @isLegalPerson, @fullName, @nationalNo, @economicNo, @cid)

                        SELECT CAST(SCOPE_IDENTITY() as int)", connection))
                    {
                        command.Parameters.AddWithValue("@companyId", companyId);
                        AddFounderParameters(command, data);
                        command.Parameters.AddWithValue("@cid", context.Session["userId"] ?? (object)DBNull.Value);
                        int newId = (int)command.ExecuteScalar();

                        return new JObject
                        {
                            ["success"] = true,
                            ["founderId"] = newId,
                            ["message"] = "مؤسس با موفقیت اضافه شد"
                        };
                    }
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

    private static void AddFounderParameters(SqlCommand command, JObject data)
    {
        command.Parameters.AddWithValue("@isLegalPerson", data["isLegalPerson"]?.ToObject<bool>() ?? false);
        command.Parameters.AddWithValue("@fullName", data["fullName"]?.ToString() ?? "");
        command.Parameters.AddWithValue("@nationalNo", data["nationalNo"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@economicNo", data["economicNo"]?.ToString() ?? (object)DBNull.Value);
    }

    private static JObject DeleteFounder(int founderId)
    {
        try
        {
            if (founderId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه مؤسس نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    DELETE FROM [HitcoForm]..[tCompanyFounders]
                    WHERE founderId = @founderId", connection))
                {
                    command.Parameters.AddWithValue("@founderId", founderId);
                    int rowsAffected = command.ExecuteNonQuery();

                    return new JObject
                    {
                        ["success"] = rowsAffected > 0,
                        ["message"] = rowsAffected > 0 ? "مؤسس با موفقیت حذف شد" : "مؤسس یافت نشد"
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

    // Shareholders Methods
    private static JObject GetShareholders(int companyId)
    {
        try
        {
            if (companyId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه شرکت نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    SELECT
                        s.shareholderId,
                        s.companyId,
                        s.boardMemberId,
                        s.isLegalPerson,
                        s.fullName,
                        s.nationalNo,
                        s.economicNo,
                        s.sharesCount,
                        bm.fullName as boardMemberFullName,
                        bm.boardPosition as boardMemberPosition
                    FROM [HitcoForm]..[tCompanyShareholders] s
                    LEFT JOIN [HitcoForm]..[tCompanyBoardMembers] bm ON s.boardMemberId = bm.boardMemberId
                    WHERE s.companyId = @companyId
                    ORDER BY s.sharesCount desc", connection))
                {
                    command.Parameters.AddWithValue("@companyId", companyId);

                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    return new JObject
                    {
                        ["success"] = true,
                        ["data"] = DataTableToJArray(dataSet.Tables[0])
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

    private static JObject SaveShareholder(string jsonData)
    {
        try
        {
            JObject data = JObject.Parse(jsonData);
            int shareholderId = data["shareholderId"]?.ToObject<int>() ?? 0;
            int companyId = data["companyId"]?.ToObject<int>() ?? 0;

            if (companyId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه شرکت الزامی است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                if (shareholderId > 0)
                {
                    // Update
                    using (SqlCommand command = new SqlCommand(@"
                        UPDATE [HitcoForm]..[tCompanyShareholders]
                        SET
                            isLegalPerson = @isLegalPerson,
                            fullName = @fullName,
                            nationalNo = @nationalNo,
                            economicNo = @economicNo,
                            sharesCount = @sharesCount
                        WHERE shareholderId = @shareholderId", connection))
                    {
                        command.Parameters.AddWithValue("@shareholderId", shareholderId);
                        AddShareholderParameters(command, data);
                        command.ExecuteNonQuery();

                        return new JObject
                        {
                            ["success"] = true,
                            ["message"] = "سهامدار با موفقیت ویرایش شد"
                        };
                    }
                }
                else
                {
                    // Insert
                    using (SqlCommand command = new SqlCommand(@"
                        INSERT INTO [HitcoForm]..[tCompanyShareholders]
                        (companyId, isLegalPerson, fullName, nationalNo, economicNo, sharesCount)
                        VALUES
                        (@companyId, @isLegalPerson, @fullName, @nationalNo, @economicNo, @sharesCount)

                        SELECT CAST(SCOPE_IDENTITY() as int)", connection))
                    {
                        command.Parameters.AddWithValue("@companyId", companyId);
                        AddShareholderParameters(command, data);
                        int newId = (int)command.ExecuteScalar();

                        return new JObject
                        {
                            ["success"] = true,
                            ["shareholderId"] = newId,
                            ["message"] = "سهامدار با موفقیت اضافه شد"
                        };
                    }
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

    private static void AddShareholderParameters(SqlCommand command, JObject data)
    {
        command.Parameters.AddWithValue("@isLegalPerson", data["isLegalPerson"]?.ToObject<bool>() ?? false);
        command.Parameters.AddWithValue("@fullName", data["fullName"]?.ToString() ?? "");
        command.Parameters.AddWithValue("@nationalNo", data["nationalNo"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@economicNo", data["economicNo"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@sharesCount", data["sharesCount"]?.ToObject<float?>() ?? (object)DBNull.Value);
    }

    private static JObject DeleteShareholder(int shareholderId)
    {
        try
        {
            if (shareholderId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه سهامدار نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    DELETE FROM [HitcoForm]..[tCompanyShareholders]
                    WHERE shareholderId = @shareholderId", connection))
                {
                    command.Parameters.AddWithValue("@shareholderId", shareholderId);
                    int rowsAffected = command.ExecuteNonQuery();

                    return new JObject
                    {
                        ["success"] = rowsAffected > 0,
                        ["message"] = rowsAffected > 0 ? "سهامدار با موفقیت حذف شد" : "سهامدار یافت نشد"
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

    // Inspectors Methods
    private static JObject GetInspectors(int companyId)
    {
        try
        {
            if (companyId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه شرکت نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    SELECT *
                    FROM [HitcoForm]..[tCompanyInspectors]
                    WHERE companyId = @companyId
                    ORDER BY inspectorId", connection))
                {
                    command.Parameters.AddWithValue("@companyId", companyId);

                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    return new JObject
                    {
                        ["success"] = true,
                        ["data"] = DataTableToJArray(dataSet.Tables[0])
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

    private static JObject SaveInspector(string jsonData, HttpContext context)
    {
        try
        {
            JObject data = JObject.Parse(jsonData);
            int inspectorId = data["inspectorId"]?.ToObject<int>() ?? 0;
            int companyId = data["companyId"]?.ToObject<int>() ?? 0;

            if (companyId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه شرکت الزامی است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                if (inspectorId > 0)
                {
                    // Update
                    using (SqlCommand command = new SqlCommand(@"
                        UPDATE [HitcoForm]..[tCompanyInspectors]
                        SET
                            isLegalPerson = @isLegalPerson,
                            fullName = @fullName,
                            nationalNo = @nationalNo,
                            economicNo = @economicNo,
                            startDate = @startDate,
                            endDate = @endDate,
                            isMainInspector = @isMainInspector
                        WHERE inspectorId = @inspectorId", connection))
                    {
                        command.Parameters.AddWithValue("@inspectorId", inspectorId);
                        AddInspectorParameters(command, data);
                        command.ExecuteNonQuery();

                        return new JObject
                        {
                            ["success"] = true,
                            ["message"] = "بازرس با موفقیت ویرایش شد"
                        };
                    }
                }
                else
                {
                    // Insert
                    using (SqlCommand command = new SqlCommand(@"
                        INSERT INTO [HitcoForm]..[tCompanyInspectors]
                        (companyId, isLegalPerson, fullName, nationalNo, economicNo, startDate, endDate, isMainInspector, cid)
                        VALUES
                        (@companyId, @isLegalPerson, @fullName, @nationalNo, @economicNo, @startDate, @endDate, @isMainInspector, @cid)

                        SELECT CAST(SCOPE_IDENTITY() as int)", connection))
                    {
                        command.Parameters.AddWithValue("@companyId", companyId);
                        AddInspectorParameters(command, data);
                        command.Parameters.AddWithValue("@cid", context.Session["userId"] ?? (object)DBNull.Value);
                        int newId = (int)command.ExecuteScalar();

                        return new JObject
                        {
                            ["success"] = true,
                            ["inspectorId"] = newId,
                            ["message"] = "بازرس با موفقیت اضافه شد"
                        };
                    }
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

    private static void AddInspectorParameters(SqlCommand command, JObject data)
    {
        command.Parameters.AddWithValue("@isLegalPerson", data["isLegalPerson"]?.ToObject<bool>() ?? false);
        command.Parameters.AddWithValue("@fullName", data["fullName"]?.ToString() ?? "");
        command.Parameters.AddWithValue("@nationalNo", data["nationalNo"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@economicNo", data["economicNo"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@startDate", data["startDate"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@endDate", data["endDate"]?.ToString() ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("@isMainInspector", data["isMainInspector"]?.ToObject<bool>() ?? false);
    }

    private static JObject DeleteInspector(int inspectorId)
    {
        try
        {
            if (inspectorId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه بازرس نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    DELETE FROM [HitcoForm]..[tCompanyInspectors]
                    WHERE inspectorId = @inspectorId", connection))
                {
                    command.Parameters.AddWithValue("@inspectorId", inspectorId);
                    int rowsAffected = command.ExecuteNonQuery();

                    return new JObject
                    {
                        ["success"] = rowsAffected > 0,
                        ["message"] = rowsAffected > 0 ? "بازرس با موفقیت حذف شد" : "بازرس یافت نشد"
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

    // Attachment Types Methods
    private static JObject GetAttachmentTypes()
    {
        try
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    SELECT baseId, value, nameBase, groupName, isActive, TRIM(urgeClass)urgeClass
                    FROM [HitcoForm]..[tbase]
                    WHERE groupName = 'companyAttachments'
                    ORDER BY TRY_CAST(urgeClass AS INT),value", connection))
                {
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        DataTable dt = new DataTable();
                        adapter.Fill(dt);

                        JArray dataArray = new JArray();
                        foreach (DataRow row in dt.Rows)
                        {
                            JObject obj = new JObject();
                            obj["baseId"] = JToken.FromObject(row["baseId"]);
                            obj["value"] = JToken.FromObject(row["value"]);
                            obj["nameBase"] = row["nameBase"]?.ToString();
                            obj["groupName"] = row["groupName"]?.ToString();
                            obj["urgeClass"] = row["urgeClass"]?.ToString();
                            obj["isActive"] = row["isActive"] != DBNull.Value ? Convert.ToBoolean(row["isActive"]) : false;
                            dataArray.Add(obj);
                        }

                        return new JObject
                        {
                            ["success"] = true,
                            ["data"] = dataArray
                        };
                    }
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

    private static JObject SaveAttachmentType(string jsonData)
    {
        try
        {
            if (string.IsNullOrEmpty(jsonData))
                return new JObject { ["success"] = false, ["error"] = "داده‌های ورودی خالی است" };

            JObject requestData = JObject.Parse(jsonData);
            JObject data = (JObject)requestData["data"];
            bool isNew = (bool)requestData["isNew"];

            string nameBase = data["nameBase"]?.ToString();
            string urgeClass = data["urgeClass"]?.ToString();
            bool isActive = data["isActive"] != null ? (bool)data["isActive"] : true;

            if (string.IsNullOrEmpty(nameBase))
                return new JObject { ["success"] = false, ["error"] = "نام نوع پیوست الزامی است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                if (isNew)
                {
                    // Check if nameBase already exists
                    using (SqlCommand checkCmd = new SqlCommand(@"
                        SELECT COUNT(*) FROM [HitcoForm]..[tbase]
                        WHERE groupName = 'companyAttachments' AND nameBase = @nameBase", connection))
                    {
                        checkCmd.Parameters.AddWithValue("@nameBase", nameBase);
                        checkCmd.Parameters.AddWithValue("@urgeClass", urgeClass);
                        int count = (int)checkCmd.ExecuteScalar();

                        if (count > 0)
                            return new JObject { ["success"] = false, ["error"] = "این نام قبلاً ثبت شده است" };
                    }

                    // Get max value for companyAttachments group
                    int newValue = 500100; // Default value
                    using (SqlCommand maxCmd = new SqlCommand(@"
                        SELECT MAX(value) FROM [HitcoForm]..[tbase]
                        WHERE groupName = 'companyAttachments'", connection))
                    {
                        var maxResult = maxCmd.ExecuteScalar();
                        if (maxResult != DBNull.Value && maxResult != null)
                        {
                            int maxValue = Convert.ToInt32(maxResult);
                            newValue = maxValue + 10;
                        }
                    }

                    // Insert new record
                    using (SqlCommand insertCmd = new SqlCommand(@"
                        INSERT INTO [HitcoForm]..[tbase] (value, nameBase, groupName, isActive, urgeClass)
                        VALUES (@value, @nameBase, 'companyAttachments', 1, @urgeClass)", connection))
                    {
                        insertCmd.Parameters.AddWithValue("@value", newValue);
                        insertCmd.Parameters.AddWithValue("@nameBase", nameBase);
                        insertCmd.Parameters.AddWithValue("@urgeClass", urgeClass);

                        int rowsAffected = insertCmd.ExecuteNonQuery();

                        return new JObject
                        {
                            ["success"] = rowsAffected > 0,
                            ["message"] = rowsAffected > 0 ? "نوع پیوست با موفقیت افزوده شد" : "خطا در افزودن نوع پیوست"
                        };
                    }
                }
                else
                {
                    // Update existing record
                    int baseId = (int)data["baseId"];

                    // Check if nameBase already exists (excluding current record)
                    using (SqlCommand checkCmd = new SqlCommand(@"
                        SELECT COUNT(*) FROM [HitcoForm]..[tbase]
                        WHERE groupName = 'companyAttachments' AND nameBase = @nameBase AND baseId != @baseId", connection))
                    {
                        checkCmd.Parameters.AddWithValue("@nameBase", nameBase);
                        checkCmd.Parameters.AddWithValue("@urgeClass", urgeClass);
                        checkCmd.Parameters.AddWithValue("@baseId", baseId);
                        int count = (int)checkCmd.ExecuteScalar();

                        if (count > 0)
                            return new JObject { ["success"] = false, ["error"] = "این نام قبلاً ثبت شده است" };
                    }

                    using (SqlCommand updateCmd = new SqlCommand(@"
                        UPDATE [HitcoForm]..[tbase]
                        SET nameBase = @nameBase, isActive = @isActive, urgeClass = @urgeClass
                        WHERE baseId = @baseId", connection))
                    {
                        updateCmd.Parameters.AddWithValue("@nameBase", nameBase);
                        updateCmd.Parameters.AddWithValue("@isActive", isActive);
                        updateCmd.Parameters.AddWithValue("@urgeClass", urgeClass);
                        updateCmd.Parameters.AddWithValue("@baseId", baseId);

                        int rowsAffected = updateCmd.ExecuteNonQuery();

                        return new JObject
                        {
                            ["success"] = rowsAffected > 0,
                            ["message"] = rowsAffected > 0 ? "نوع پیوست با موفقیت ویرایش شد" : "نوع پیوست یافت نشد"
                        };
                    }
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

    private static JObject DeleteAttachmentType(int baseId)
    {
        try
        {
            if (baseId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    DELETE FROM [HitcoForm]..[tbase]
                    WHERE baseId = @baseId AND groupName = 'companyAttachments'", connection))
                {
                    command.Parameters.AddWithValue("@baseId", baseId);

                    int rowsAffected = command.ExecuteNonQuery();

                    return new JObject
                    {
                        ["success"] = rowsAffected > 0,
                        ["message"] = rowsAffected > 0 ? "نوع پیوست با موفقیت حذف شد" : "نوع پیوست یافت نشد"
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

    // Signatories Methods
    private static JObject GetSignatories(int companyId)
    {
        try
        {
            if (companyId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه شرکت نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    SELECT *
                    FROM [HitcoForm]..[tCompanySignatories]
                    WHERE companyId = @companyId
                    ORDER BY signatoryId", connection))
                {
                    command.Parameters.AddWithValue("@companyId", companyId);

                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    return new JObject
                    {
                        ["success"] = true,
                        ["data"] = DataTableToJArray(dataSet.Tables[0])
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

    private static JObject SaveSignatory(string jsonData, HttpContext context)
    {
        try
        {
            JObject data = JObject.Parse(jsonData);
            int signatoryId = data["signatoryId"]?.ToObject<int>() ?? 0;
            int companyId = data["companyId"]?.ToObject<int>() ?? 0;

            if (companyId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه شرکت الزامی است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                if (signatoryId > 0)
                {
                    // Update
                    using (SqlCommand command = new SqlCommand(@"
                        UPDATE [HitcoForm]..[tCompanySignatories]
                        SET
                            boardMemberIds = @boardMemberIds,
                            signatureType = @signatureType,
                            signatureTypeDesc = @signatureTypeDesc,
                            customDesc = @customDesc,
                            WithOfficialStamp = @WithOfficialStamp,
                            rightType = @rightType,
                            rightTypeDesc = @rightTypeDesc
                        WHERE signatoryId = @signatoryId", connection))
                    {
                        command.Parameters.AddWithValue("@signatoryId", signatoryId);
                        AddSignatoryParameters(command, data);
                        command.ExecuteNonQuery();

                        return new JObject
                        {
                            ["success"] = true,
                            ["message"] = "حق امضا با موفقیت ویرایش شد"
                        };
                    }
                }
                else
                {
                    // Insert
                    using (SqlCommand command = new SqlCommand(@"
                        INSERT INTO [HitcoForm]..[tCompanySignatories]
                        (boardMemberIds, companyId, signatureType, signatureTypeDesc, customDesc, WithOfficialStamp, rightType, rightTypeDesc, cdt, cid)
                        VALUES
                        (@boardMemberIds, @companyId, @signatureType, @signatureTypeDesc, @customDesc, @WithOfficialStamp, @rightType, @rightTypeDesc, GETDATE(), @cid)

                        SELECT CAST(SCOPE_IDENTITY() as int)", connection))
                    {
                        command.Parameters.AddWithValue("@companyId", companyId);
                        AddSignatoryParameters(command, data);
                        command.Parameters.AddWithValue("@cid", context.Session["userId"] ?? (object)DBNull.Value);
                        int newId = (int)command.ExecuteScalar();

                        return new JObject
                        {
                            ["success"] = true,
                            ["signatoryId"] = newId,
                            ["message"] = "حق امضا با موفقیت اضافه شد"
                        };
                    }
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

    private static void AddSignatoryParameters(SqlCommand command, JObject data)
    {
        // boardMemberIds (comma-separated string)
        var boardMemberIds = data["boardMemberIds"]?.ToString();
        if (!string.IsNullOrEmpty(boardMemberIds))
            command.Parameters.AddWithValue("@boardMemberIds", boardMemberIds);
        else
            command.Parameters.AddWithValue("@boardMemberIds", DBNull.Value);

        // signatureType
        var signatureType = data["signatureType"]?.ToObject<int?>();
        if (signatureType.HasValue)
            command.Parameters.AddWithValue("@signatureType", signatureType.Value);
        else
            command.Parameters.AddWithValue("@signatureType", DBNull.Value);

        // signatureTypeDesc
        var signatureTypeDesc = data["signatureTypeDesc"]?.ToString();
        if (!string.IsNullOrEmpty(signatureTypeDesc))
            command.Parameters.AddWithValue("@signatureTypeDesc", signatureTypeDesc);
        else
            command.Parameters.AddWithValue("@signatureTypeDesc", DBNull.Value);

        // customDesc
        var customDesc = data["customDesc"]?.ToString();
        if (!string.IsNullOrEmpty(customDesc))
            command.Parameters.AddWithValue("@customDesc", customDesc);
        else
            command.Parameters.AddWithValue("@customDesc", DBNull.Value);

        // WithOfficialStamp
        var withOfficialStamp = data["WithOfficialStamp"]?.ToObject<bool?>() ?? true;
        command.Parameters.AddWithValue("@WithOfficialStamp", withOfficialStamp);

        // rightType and rightTypeDesc
        command.Parameters.AddWithValue("@rightType", data["rightType"]?.ToObject<int>() ?? 1);
        command.Parameters.AddWithValue("@rightTypeDesc", data["rightTypeDesc"]?.ToString() ?? "اوراق بهادار و تعهدآور");
    }

    private static JObject DeleteSignatory(int signatoryId)
    {
        try
        {
            if (signatoryId <= 0)
                return new JObject { ["success"] = false, ["error"] = "شناسه حق امضا نامعتبر است" };

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(@"
                    DELETE FROM [HitcoForm]..[tCompanySignatories]
                    WHERE signatoryId = @signatoryId", connection))
                {
                    command.Parameters.AddWithValue("@signatoryId", signatoryId);
                    int rowsAffected = command.ExecuteNonQuery();

                    return new JObject
                    {
                        ["success"] = rowsAffected > 0,
                        ["message"] = rowsAffected > 0 ? "حق امضا با موفقیت حذف شد" : "حق امضا یافت نشد"
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

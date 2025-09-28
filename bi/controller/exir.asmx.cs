using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Web.Services;
using System.Xml;
using System.Xml.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Web_Services.DataAccess;
using System.Text.RegularExpressions;
using System.Diagnostics;
using System.Globalization;
using System.Collections.Generic;

namespace Web_Services.controller
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class Exir : System.Web.Services.WebService
    {
        // تعریف یک HttpClient مستقل برای این کلاس
        private readonly HttpClient client = new HttpClient();
        private int distId = 8;
        private string urlSale = "http://79.174.160.68:7005/OutServices/Service.asmx";
        private string urlStock = "http://79.174.160.68:7005/OutServices/Service.asmx";
        private static config configInstance = new config("");
        private string[] dates = configInstance.GetValue();

        [WebMethod]
        public void Sale_taminPharmed()
        {
            string username = "OutService_TaminPharmed";
            string password = "e123";
            int companyId = 2;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, username, password);
            var jsonResponse = xmlToJson(response);
            var dataArray = JArray.Parse(jsonResponse);

            if (dataArray != null)
            {
                dataArray = validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }
        [WebMethod]
        public void Sale_rastaImen()
        {
            string username = "rasta";
            string password = "e1403";
            int companyId = 1;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, username, password);
            var jsonResponse = xmlToJson(response);
            var dataArray = JArray.Parse(jsonResponse);

            if (dataArray != null)
            {
                dataArray = validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }
        [WebMethod]
        public void Sale_taminShafa()
        {
            string username = "t.shafapars";
            string password = "e1403";
            int companyId = 5;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, username, password);
            var jsonResponse = xmlToJson(response);
            var dataArray = JArray.Parse(jsonResponse);

            if (dataArray != null)
            {
                dataArray = validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }
        [WebMethod]
        public void Sale_taminDarou()
        {
            string username = "OutService_tamindarou";
            string password = "e123";
            int companyId = 4;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, username, password);
            var jsonResponse = xmlToJson(response);
            var dataArray = JArray.Parse(jsonResponse);

            if (dataArray != null)
            {
                dataArray = validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }
        [WebMethod]
        public void Sale_pakSalamat()
        {
            string username = "paksalamat";
            string password = "PAK1234";
            int companyId = 3;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, username, password);
            var jsonResponse = xmlToJson(response);
            var dataArray = JArray.Parse(jsonResponse);

            if (dataArray != null)
            {
                dataArray = validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }
        [WebMethod]
        public void Sale_ariaPharmed()
        {
            string username = "ARIYAPHARMED";
            string password = "e1403";
            int companyId = 11;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, username, password);
            var jsonResponse = xmlToJson(response);
            var dataArray = JArray.Parse(jsonResponse);

            if (dataArray != null)
            {
                dataArray = validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }

        ////////////////////////////////////////////////////////stock//////////////////////////////////////////////////////////////
        [WebMethod]
        public void Stock_taminPharmed()
        {
            string username = "OutService_TaminPharmed";
            string password = "e123";
            int companyId = 2;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date, date, 0, 0, 0);
                var response = GetDistributorStockData(urlStock, username, password, date);
                var jsonResponse = xmlToJsonStock(response);
                var dataArray = JArray.Parse(jsonResponse);
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId, date);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
            }
        }
        [WebMethod]
        public void Stock_rastaImen()
        {
            string username = "rasta";
            string password = "e1403";
            int companyId = 1;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date, date, 0, 0, 0);
                var response = GetDistributorStockData(urlStock, username, password, date);
                var jsonResponse = xmlToJsonStock(response);
                var dataArray = JArray.Parse(jsonResponse);
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId, date);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
            }
        }
        [WebMethod]
        public void Stock_taminShafa()
        {
            string username = "t.shafapars";
            string password = "e1403";
            int companyId = 5;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date, date, 0, 0, 0);
                var response = GetDistributorStockData(urlStock, username, password, date);
                var jsonResponse = xmlToJsonStock(response);
                var dataArray = JArray.Parse(jsonResponse);
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId, date);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
            }
        }
        [WebMethod]
        public void Stock_taminDarou()
        {
            string username = "OutService_tamindarou";
            string password = "e123";
            int companyId = 4;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date, date, 0, 0, 0);
                var response = GetDistributorStockData(urlStock, username, password, date);
                var jsonResponse = xmlToJsonStock(response);
                var dataArray = JArray.Parse(jsonResponse);
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId, date);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed------------------------------------------------taminDarou-------------------------------------------: {date}");
            }
        }
        [WebMethod]
        public void Stock_pakSalamat()
        {
            string username = "paksalamat";
            string password = "PAK1234";
            int companyId = 3;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date, date, 0, 0, 0);
                var response = GetDistributorStockData(urlStock, username, password, date);
                var jsonResponse = xmlToJsonStock(response);
                Debug.WriteLine($"Processing----------------------------------------------------------------------------------------------: {date}");
                var dataArray = JArray.Parse(jsonResponse);
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId, date);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed---------------------------------------------------paksalamat----------------------------------------: {date}");
            }
        }

        public string GetDistributorSaleData(string url, string username, string password)
        {
            string soapRequest = $@"<?xml version=""1.0"" encoding=""utf-8""?>
                                    <soap:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
                                      <soap:Body>
                                        <ForooshBazeyeZamaniNoeForm xmlns=""http://tempuri.org/"">
                                          <AzTarikh>{dates[dates.Length - 1]}</AzTarikh> <!-- Replace with actual start date -->
                                          <TaTarikh>{dates[0]}</TaTarikh> <!-- Replace with actual end date -->
                                          <username>{username}</username>
                                          <password>{password}</password>
                                        </ForooshBazeyeZamaniNoeForm>
                                      </soap:Body>
                                    </soap:Envelope>";

            var content = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("SOAPAction", "http://tempuri.org/ForooshBazeyeZamaniNoeForm");

            try
            {
                var response = client.PostAsync(url, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    var responseString = response.Content.ReadAsStringAsync().Result;
                    return responseString;
                }
                else
                {
                    return ($"{{\"error\":\"Unable to fetch data\", \"statusCode\":\"{response.StatusCode}\"}}");
                }
            }
            catch (Exception ex)
            {
                return ($"{{\"exception\":\"{ex.Message}\"}}");
            }
        }
        public string GetDistributorStockData(string url, string username, string password, string date)
        {
            string soapRequest = $@"<?xml version=""1.0"" encoding=""utf-8""?>
                                    <soap:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
                                      <soap:Body>
                                        <MojoodiTaminkonandehBatch xmlns=""http://tempuri.org/"">
                                          <AzTarikh>{date}</AzTarikh> 
                                          <TaTarikh>{date}</TaTarikh> 
                                          <username>{username}</username>
                                          <password>{password}</password>
                                        </MojoodiTaminkonandehBatch>
                                      </soap:Body>
                                    </soap:Envelope>";

            var content = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("SOAPAction", "http://tempuri.org/MojoodiTaminkonandehBatch");

            try
            {
                var response = client.PostAsync(url, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    var responseString = response.Content.ReadAsStringAsync().Result;
                    return responseString;
                }
                else
                {
                    return ($"{{\"error\":\"Unable to fetch data\", \"statusCode\":\"{response.StatusCode}\"}}");
                }
            }
            catch (Exception ex)
            {
                return ($"{{\"exception\":\"{ex.Message}\"}}");
            }
        }
        private dynamic validateSaleData(dynamic dataArray, int distId, int companyId)
        {
            var validItems = new List<dynamic>();
            foreach (var item in dataArray)
            {
                if (item["BillShamsiDate"] != null)
                {

                    string[] persianDateArray = ConvertToPersianDateArray(item["BillShamsiDate"]?.ToString());
                    item["day"] = persianDateArray[0];
                    item["month"] = persianDateArray[1];
                    item["year"] = persianDateArray[2];

                    item["SaleType"] = item["SaleType"];
                    if (item["SaleType"] == 1)
                    {
                        item["SaleAmount"] = item["SaleAmount"];
                        item["GoodsPrice"] = item["GoodsPrice"];
                        item["prizeAmount"] = 0;
                        item["prizeQuantity"] = 0;
                    }
                    if (item["SaleType"] == 2)
                    {
                        item["SaleAmount"] = -Convert.ToInt32(item["SaleAmount"]);
                        item["GoodsPrice"] = -Convert.ToDecimal(item["GoodsPrice"]);
                        item["prizeAmount"] = 0;
                        item["prizeQuantity"] = 0;
                    }
                    if (item["SaleType"] == 3)
                    {
                        item["prizeQuantity"] = item["SaleAmount"];
                        item["prizeAmount"] = Convert.ToDecimal( item["GoodsPrice"]);
                        item["SaleAmount"] = 0;
                        item["GoodsPrice"] = 0;
                    }
                    if (item["SaleType"] == 4)
                    {
                        item["prizeQuantity"] = -Convert.ToInt32(item["SaleAmount"]);
                        item["prizeAmount"] = -Convert.ToDecimal(item["GoodsPrice"]);
                        item["SaleAmount"] = 0;
                        item["GoodsPrice"] = 0;
                    }
                    item["RecordType"] = item["RecordType"];
                    item["BillShamsiDate"] = item["BillShamsiDate"];
                    item["BranchName"] = item["BranchName"];
                    item["BranchCode"] = item["BranchCode"];
                    item["StateId"] = item["StateId"];
                    item["CustomerState"] = item["CustomerState"];
                    item["CityID"] = item["CityID"];
                    item["CityName"] = item["CityName"];
                    item["CustomerCode"] = item["CustomerCode"];
                    item["CustomerName"] = item["CustomerName"];
                    item["CustomerAddress"] = item["CustomerAddress"];
                    item["CustomerTel"] = item["CustomerTel"];
                    item["GoodsCode"] = item["GoodsCode"];
                    item["GoodsName"] = item["GoodsName"];
                    item["BatchNo"] = item["BatchNo"];
                    item["ExpireDate"] = item["ExpireDate"];
                    item["NationalCode"] = item["NationalCode"];
                    item["CustomerEconomic"] = item["CustomerEconomic"];
                    item["GoodsGeneric"] = item["GoodsGeneric"];
                    item["SupplierCode"] = item["SupplierCode"];
                    item["SupplierName"] = item["SupplierName"];
                    item["p1"] = item["p1"];
                    item["p2"] = item["p2"];
                    item["p3"] = item["p3"];
                    item["CustomerGln"] = item["CustomerGln"];
                    item["CustomerHIX"] = item["CustomerHIX"];
                    item["CustomerGroup"] = item["CustomerGroup"];
                    validItems.Add(item);
                }

            }
            return JArray.FromObject(validItems);
        }
        private dynamic validateStockData(dynamic dataArray, int distId, int companyId, string date)
        {
            string[] persianDateArray = ConvertToPersianDateArray(date);
            foreach (var item in dataArray)
            {
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];


                item["GoodsCode"] = item["GoodsCode"];
                item["GoodsName"] = item["GoodsName"];
                item["BranchCode"] = item["BranchCode"];
                item["BranchName"] = item["BranchName"];
                item["BatchNumber"] = item["BatchNumber"];
                string[] expPersianDateArray = ConvertMiladiToPersianDateArray((string)item["ExpireDate"]);
                item["expDay"] = expPersianDateArray[2];
                item["expMonth"] = expPersianDateArray[1];
                item["expYear"] = expPersianDateArray[0];

                item["inventoryCode"] = item["inventoryCode"];
                item["inventoryName"] = item["inventoryName"];

                item["CountOfStock"] = item["CountOfStock"];
                item["AmountOfStock"] = item["AmountOfStock"];
            }
            return dataArray;
        }
        public string[] ConvertToPersianDateArray(string dateValue)
        {
            if (dateValue.Length == 8)
            {
                string year = dateValue.Substring(0, 4);
                string month = dateValue.Substring(4, 2);
                string day = dateValue.Substring(6, 2);
                return new string[] { day, month, year };
            }
            else
            {
                throw new ArgumentException("Invalid date format.");
            }
        }
        public string[] ConvertMiladiToPersianDateArray(string dateValue)
        {
            DateTime miladiDate = DateTime.ParseExact(dateValue, "yyyyMMdd", CultureInfo.InvariantCulture);

            // Convert to Persian date using PersianCalendar
            PersianCalendar persianCalendar = new PersianCalendar();
            int persianYear = persianCalendar.GetYear(miladiDate);
            int persianMonth = persianCalendar.GetMonth(miladiDate);
            int persianDay = persianCalendar.GetDayOfMonth(miladiDate);
            string[] persianDateArray = new string[]
       {
            persianYear.ToString(),
            persianMonth.ToString("D2"), // Leading zero if necessary
            persianDay.ToString("D2")    // Leading zero if necessary
       };

            return persianDateArray;
        }
        public static string GenerateUniqueCodeSale(
            string distId,
            string companyId,
            string BillShamsiDate,
            string CustomerCode,
            string RecordType,
            string GoodsCode,
            string SaleAmount,
            string GoodsPrice,
            string BranchCode,
            string CustomerGln
            )
        {

            string data = $"{distId}|{companyId}|{BillShamsiDate}|{CustomerCode}|{RecordType}|{GoodsCode}|{SaleAmount}|{GoodsPrice}|{BranchCode}|{CustomerGln}";
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(data));
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }
        public static string GenerateUniqueCodeStock(
            string distId,
            string companyId,
            string date,
            string GoodsCode,
            string BranchCode,
            string inventoryCode,
            string CountOfStock
            )
        {

            string data = $"{distId}|{companyId}|{date}|{GoodsCode}|{BranchCode}|{inventoryCode}|{CountOfStock}";
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(data));
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }
        static string xmlToJson(string soapResponse)
        {
            try
            {
                // بارگذاری XML
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(soapResponse);

                // مدیریت NameSpaceها
                XmlNamespaceManager nsmgr = new XmlNamespaceManager(xmlDoc.NameTable);
                nsmgr.AddNamespace("soap", "http://schemas.xmlsoap.org/soap/envelope/");
                nsmgr.AddNamespace("tempuri", "http://tempuri.org/");

                // استخراج گره `ForooshResult`
                XmlNode resultNode = xmlDoc.SelectSingleNode("//tempuri:ForooshBazeyeZamaniNoeFormResult", nsmgr);

                if (resultNode == null)
                    throw new Exception("ForooshBazeyeZamaniNoeFormResult node not found!");

                // استخراج تمام گره‌های `string` (با Namespace)
                XmlNodeList stringNodes = resultNode.SelectNodes("tempuri:string", nsmgr);

                if (stringNodes == null || stringNodes.Count == 0)
                    throw new Exception("No data found in ForooshBazeyeZamaniNoeFormResult.");

                // تبدیل هر گره به JSON
                JArray jsonArray = new JArray();

                for (int i = 31; i < stringNodes.Count; i++) // شروع از اندیس 31
                {
                    XmlNode stringNode = stringNodes[i];
                    if (stringNode != null)
                    {
                        // جدا کردن مقادیر با |
                        var parts = stringNode.InnerText.Split('|');
                        JObject jsonObject = new JObject
                        {
                            ["SaleType"] = parts.Length > 1 ? parts[1].Trim() : null,
                            ["RecordType"] = parts.Length > 2 ? parts[2].Trim() : null,
                            ["BillShamsiDate"] = parts.Length > 3 ? parts[3].Trim() : null,
                            ["BranchName"] = parts.Length > 4 ? parts[4].Trim() : null,
                            ["BranchCode"] = parts.Length > 5 ? parts[5].Trim() : null,
                            ["StateId"] = parts.Length > 6 ? parts[6].Trim() : null,
                            ["CustomerState"] = parts.Length > 7 ? parts[7].Trim() : null,
                            ["CityID"] = parts.Length > 8 ? parts[8].Trim() : null,
                            ["CityName"] = parts.Length > 9 ? parts[9].Trim() : null,
                            ["CustomerCode"] = parts.Length > 10 ? parts[10].Trim() : null,
                            ["CustomerName"] = parts.Length > 11 ? parts[11].Trim() : null,
                            ["CustomerAddress"] = parts.Length > 12 ? parts[12].Trim() : null,
                            ["CustomerTel"] = parts.Length > 13 ? parts[13].Trim() : null,
                            ["GoodsCode"] = parts.Length > 14 ? parts[14].Trim() : null,
                            ["GoodsName"] = parts.Length > 15 ? parts[15].Trim() : null,
                            ["BatchNo"] = parts.Length > 16 ? parts[16].Trim() : null,
                            ["ExpireDate"] = parts.Length > 17 ? parts[17].Trim() : null,
                            ["NationalCode"] = parts.Length > 18 ? parts[18].Trim() : null,
                            ["CustomerEconomic"] = parts.Length > 19 ? parts[19].Trim() : null,
                            ["GoodsGeneric"] = parts.Length > 20 ? parts[20].Trim() : null,
                            ["SupplierCode"] = parts.Length > 21 ? parts[21].Trim() : null,
                            ["SupplierName"] = parts.Length > 22 ? parts[22].Trim() : null,
                            ["p1"] = parts.Length > 23 ? parts[23].Trim() : null,
                            ["p2"] = parts.Length > 24 ? parts[24].Trim() : null,
                            ["p3"] = parts.Length > 25 ? parts[25].Trim() : null,
                            ["SaleAmount"] = parts.Length > 26 ? parts[26].Trim() : null,
                            ["GoodsPrice"] = parts.Length > 27 ? parts[27].Trim() : null,
                            ["CustomerGln"] = parts.Length > 28 ? parts[28].Trim() : null,
                            ["CustomerHIX"] = parts.Length > 29 ? parts[29].Trim() : null,
                            ["CustomerGroup"] = parts.Length > 30 ? parts[30].Trim() : null
                        };

                        jsonArray.Add(jsonObject);
                    }
                }

                return jsonArray.ToString(Newtonsoft.Json.Formatting.Indented);
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }

        static string xmlToJsonStock(string soapResponse)
        {
            try
            {
                // بارگذاری XML
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(soapResponse);

                // مدیریت NameSpaceها
                XmlNamespaceManager nsmgr = new XmlNamespaceManager(xmlDoc.NameTable);
                nsmgr.AddNamespace("soap", "http://schemas.xmlsoap.org/soap/envelope/");
                nsmgr.AddNamespace("tempuri", "http://tempuri.org/");

                // استخراج گره `ForooshResult`
                XmlNode resultNode = xmlDoc.SelectSingleNode("//tempuri:MojoodiTaminkonandehBatchResult", nsmgr);

                if (resultNode == null)
                    throw new Exception("MojoodiTaminkonandehBatchResult node not found!");

                // استخراج تمام گره‌های `string` (با Namespace)
                XmlNodeList stringNodes = resultNode.SelectNodes("tempuri:string", nsmgr);

                if (stringNodes == null || stringNodes.Count == 0)
                    throw new Exception("No data found in MojoodiTaminkonandehBatchResult.");

                // تبدیل هر گره به JSON
                JArray jsonArray = new JArray();

                for (int i = 31; i < stringNodes.Count; i++) // شروع از اندیس 31
                {
                    XmlNode stringNode = stringNodes[i];
                    if (stringNode != null)
                    {
                        // جدا کردن مقادیر با |
                        var parts = stringNode.InnerText.Split('|');
                        JObject jsonObject = new JObject
                        {
                            ["GoodsCode"] = parts.Length > 2 ? parts[2].Trim() : null,
                            ["GoodsName"] = parts.Length > 3 ? parts[3].Trim() : null,
                            ["BatchNumber"] = parts.Length > 4 ? parts[4].Trim() : null,
                            ["ExpireDate"] = parts.Length > 5 ? parts[5].Trim() : null,
                            ["BranchCode"] = parts.Length > 6 ? parts[6].Trim() : null,
                            ["BranchName"] = parts.Length > 7 ? parts[7].Trim() : null,
                            ["inventoryCode"] = parts.Length > 8 ? parts[8].Trim() : null,
                            ["inventoryName"] = parts.Length > 9 ? parts[9].Trim() : null,
                            ["SuplierCode"] = parts.Length > 10 ? parts[10].Trim() : null,
                            ["SuplierName"] = parts.Length > 11 ? parts[11].Trim() : null,
                            ["CountOfStock"] = parts.Length > 12 ? parts[12].Trim() : null,
                            ["AmountOfStock"] = parts.Length > 13 ? parts[13].Trim() : null,
                        };

                        jsonArray.Add(jsonObject);
                    }
                }

                return jsonArray.ToString(Newtonsoft.Json.Formatting.Indented);
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }

    }
}

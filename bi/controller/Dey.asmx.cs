using System;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Web.Services;
using System.Web.UI;
using System.Xml;
using System.Xml.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Web_Services.DataAccess;

namespace Web_Services.controller
{

    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class Dey : System.Web.Services.WebService
    {
        // تعریف یک HttpClient مستقل برای این کلاس

        private readonly HttpClient clientSale = new HttpClient();
        private readonly HttpClient clientReturn = new HttpClient();
        private readonly HttpClient client = new HttpClient();

        private int distId = 12;
        private string urlSale = "http://supplier.daydarou.ir:8085/";
        private string urlStock = "http://supplier.daydarou.ir:8085/";
        private static config configInstance = new config("");
        private string[] dates = configInstance.GetValue();//قروش 30 روزه میدهد-31 روزه خالی برمیگرداند
        [WebMethod]
        public void Sale_pakSalamat()
        {
            string username = "Sply363";
            string password = "123d";
            int companyId = 3;
            var dataArray = new JArray();
            var dataArrayReturn = new JArray();
            var dataArrayAll = new JArray();
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, username, password, "WebAPI_Supplier_SelectSaleDetails_JSON", clientSale);
            var jsonResponse = xmlToJson(response, "WebAPI_Supplier_SelectSaleDetails_JSONResult");
            if (jsonResponse != "notValid")
            {
                dataArray = JArray.Parse(jsonResponse);
                if (dataArray != null && dataArray.Count > 0)
                {
                    validateSaleData(dataArray, distId, companyId, "1");
                }
            }

            var responseReturn = GetDistributorSaleData(urlSale, username, password, "WebAPI_Supplier_SelectReturnDetails_JSON", clientReturn);
            var jsonResponseReturn = xmlToJson(responseReturn, "WebAPI_Supplier_SelectReturnDetails_JSONResult");
            if (jsonResponseReturn != "notValid")
            {
                dataArrayReturn = JArray.Parse(jsonResponseReturn);
                if (dataArrayReturn != null)
                {
                    validateSaleData(dataArrayReturn, distId, companyId, "2");
                }
            }
            dataArray = dataArray ?? new JArray();
            dataArrayReturn = dataArrayReturn ?? new JArray();
            dataArrayAll = new JArray(dataArray.Concat(dataArrayReturn));
            if (dataArrayAll != null)
            {
                repository.saveSale(dataArrayAll, distId, companyId,logId);
            }
        }
        [WebMethod]
        public void Stock_pakSalamat()
        {
            string username = "Sply363";
            string password = "123d";
            int companyId = 3;            
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date, date, 0, 0, 0);
                var response = GetDistributorStockData(urlStock, username, password, "WebAPI_Supplier_SelectStockDetails_JSON", date);
                var jsonResponse = xmlToJson(response, "WebAPI_Supplier_SelectStockDetails_JSONResult");
                if (jsonResponse != "notValid")
                {
                    JArray dataArray;
                    try
                    {
                        dataArray = JArray.Parse(jsonResponse);
                    }
                    catch
                    {
                        response = GetDistributorStockData(urlStock, username, password, "WebAPI_Supplier_SelectStockDetails_JSON", date);
                        jsonResponse = xmlToJson(response, "WebAPI_Supplier_SelectStockDetails_JSONResult");
                        dataArray = JArray.Parse(jsonResponse);
                        Debug.WriteLine($"/////////////////////////////////////paksalamat(dey)///////////////////////: {date}");


                    }
                    if (dataArray != null && dataArray.Count > 0)
                    {
                        validateStockData(dataArray, distId, companyId);
                        repository.saveStock(dataArray, distId, companyId,logId);
                    }
                    Debug.WriteLine($"Processed----------- paksalamat(dey) -------: {date}");
                }
            }
        }

        public string GetDistributorSaleData(string url, string username, string password, string method, HttpClient client)
        {
            //ایجاد محتوای SOAP Request
            string soapRequest = $@"<?xml version=""1.0"" encoding=""utf-8""?>
                                    <soap:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
                                      <soap:Body>
                                        <{method} xmlns=""http://tempuri.org/"">
                                          <username>{username}</username>
                                          <password>{password}</password>
                                          <fdate>{dates[dates.Length - 1]}</fdate>
                                          <tdate>{dates[0]}</tdate>
                                        </{method}>
                                      </soap:Body>
                                    </soap:Envelope>";
            var content = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
            client.DefaultRequestHeaders.Add("SOAPAction", $@"http://tempuri.org/{method}");
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
        public string GetDistributorStockData(string url, string username, string password, string method, string date)
        {

            //ایجاد محتوای SOAP Request
            string soapRequest = $@"<?xml version=""1.0"" encoding=""utf-8""?>
                                    <soap:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
                                      <soap:Body>
                                        <{method} xmlns=""http://tempuri.org/"">
                                          <username>{username}</username>
                                          <password>{password}</password>
                                          <tdate>{date}</tdate>
                                          <type>0</type>
                                        </{method}>
                                      </soap:Body>
                                    </soap:Envelope>";
            var content = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("SOAPAction", $@"http://tempuri.org/{method}");
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

        private dynamic validateSaleData(dynamic dataArray, int distId, int companyId, string saleType)
        {
            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateArray(item["InvoiceDate"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];

                item["SaleType"] = saleType;

                if (saleType == "1")
                {

                    item["GoodsPrice"] = Convert.ToDecimal(item["AmountPrice"]);
                    item["SaleAmount"] = Convert.ToDecimal(item["Quantity"]);
                }
                if (saleType == "2")
                {
                    item["GoodsPrice"] = -Convert.ToDecimal(item["AmountPrice"]);
                    item["SaleAmount"] = -Convert.ToDecimal(item["Quantity"]);
                }
                item["GoodsName"] = item["ProductName"];

                item["CustomerId"] = item["CustomerCode"];
                item["RecordType"] = item["InvoiceTypeName"];

                item["BranchCode"] = item["CenterCode"];
                item["BranchName"] = item["CenterName"];
                item["GoodsCode"] = item["ProductCode"];
                item["p1"] = item["Cost"];
                item["visitorId"] = item["VisitorCode"];
                item["visitorName"] = item["VisitorName"];

                item["CustomerCode"] = item["CustomerCode"];
                item["CustomerName"] = item["CustomerName"];
                item["CustomerGln"] = item["CustomerGLN"];
                item["CityID"] = item["CustomerCityCode"];
                item["CityName"] = item["CustomerCityName"];
                item["BatchNo"] = item["BatchNumber"];
                item["ExpireDate"] = item["ExpirationDate"];

                item["CustomerAddress"] = item["CustomerAddress"];
                item["CustomerEconomic"] = item["CustomerEconomicCode"];
                item["NationalCode"] = item["CustomerNationalCode"];
                item["StateId"] = item["CustomerProvinceCode"];
                item["CustomerState"] = item["CustomerProvinceName"];
                item["CustomerTel"] = item["CustomerCallNumber"];
                item["GoodsGeneric"] = item["GenericCode"];
                item["p2"] = item["Price"];
                

                item["IRC"] = item["IRC"];
                item["GTIN"] = item["GTIN"];                
                item["CustomerPostalCode"] = item["CustomerPostalCode"];


            }
            return dataArray;
        }
        private dynamic validateStockData(dynamic dataArray, int distId, int companyId)
        {
            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateArray(item["TDate"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];

                item["BranchCode"] = item["CenterCode"];
                item["BranchName"] = item["CenterName"];
                item["GoodsCode"] = item["ProductCode"];
                item["GoodsName"] = item["ProductName"];
                item["BatchNumber"] = item["BatchNumber"];
                item["ExpireDate"] = item["ExpirationDate"];
                string[] expDateArray = ConvertMiladiToPersian(item["ExpireDate"]?.ToString());
                item["expYear"] = expDateArray[0];
                item["expMonth"] = expDateArray[1];
                item["expDay"] = expDateArray[2];
                Debug.WriteLine($"Expire Date: {item["ExpireDate"]}, Converted: {item["expYear"]}/{item["expMonth"]}/{item["expDay"]}");
                item["AmountOfStock"] = 0;
                item["CountOfStock"] = 0;
                if (item["InventoryTypeCode"] == 3)
                {
                    item["AmountOfStock"] = item["StockAmount"];
                    item["CountOfStock"] = item["StockQty"];
                }
                if (item["InventoryTypeCode"] == 4)
                {
                    item["DamagedQty"] = item["StockQty"];
                    item["DamagedAmount"] = item["StockAmount"];

                }
                item["GTIN"] = item["GTIN"];
                item["IRC"] = item["IRC"];

                item["BuyTypeCode"] = item["BuyTypeCode"];
                item["BuyTypeName"] = item["BuyTypeName"];
                item["p1"] = item["Cost"];
            }
            return dataArray;
        }
        public static string[] ConvertMiladiToPersian(string dateValue)
        {
            try
            {
                // تبدیل رشته به DateTime با فرمت MM/dd/yyyy HH:mm:ss
                DateTime miladiDate = DateTime.ParseExact(dateValue, "yyyyMMdd", CultureInfo.InvariantCulture);

                // تبدیل به تاریخ شمسی
                PersianCalendar persianCalendar = new PersianCalendar();
                int persianYear = persianCalendar.GetYear(miladiDate);
                int persianMonth = persianCalendar.GetMonth(miladiDate);
                int persianDay = persianCalendar.GetDayOfMonth(miladiDate);

                return new string[]
                {
         persianYear.ToString(),
         persianMonth.ToString("D2"), // تبدیل به دو رقمی (مثلاً ۰۱، ۰۲)
         persianDay.ToString("D2")
                };
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Error: " + ex.Message);
                return new string[] { "0000", "00", "00" }; // مقدار پیش‌فرض در صورت خطا
            }
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
        public static string xmlToJson(string soapResponse, string node)
        {
            try
            {
                // بارگذاری پاسخ در قالب XML
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(soapResponse);

                // استخراج محتوای تگ GetCustomerReportWithBachJsonOnLineResult
                XmlNamespaceManager nsmgr = new XmlNamespaceManager(xmlDoc.NameTable);
                nsmgr.AddNamespace("soap", "http://schemas.xmlsoap.org/soap/envelope/");
                nsmgr.AddNamespace("tempuri", "http://tempuri.org/");

                XmlNode jsonNode = xmlDoc.SelectSingleNode("//tempuri:" + node, nsmgr);

                if (jsonNode != null)
                {
                    string jsonString = jsonNode.InnerText;

                    // بررسی فرمت JSON (در صورت نیاز)
                    JArray jsonArray = JArray.Parse(jsonString); // بررسی معتبر بودن JSON
                    return jsonArray.ToString(); // بازگرداندن JSON به صورت قالب‌بندی‌شده
                }
                else
                {
                    throw new Exception("JSON node not found in SOAP response.");
                }
            }
            catch (Exception ex)
            {
                return "notValid";
            }
        }
    }
}

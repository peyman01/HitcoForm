using System;
using System.ComponentModel.Design;
using System.Diagnostics;
using System.Globalization;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.Remoting.Messaging;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using System.Web.Services;
using System.Web.UI.WebControls;
using System.Xml;
using System.Xml.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Web_Services.DataAccess;

namespace Web_Services.controller
{
    /// <summary>
    /// Summary description for Hejrat
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class Hejrat : System.Web.Services.WebService
    {
        // تعریف یک HttpClient مستقل برای این کلاس
        private readonly HttpClient client = new HttpClient();
        private int distId = 9;
        private static config configInstance = new config("/");
        private string[] dates = configInstance.GetValue();
        [WebMethod]
        public void Sale_rastaImen()
        {
            string password = "TEvj547#00Psa98";  // پسورد
            string url = "http://old.hejratco.com/RastaIMenWebService.asmx";
            string method = "RetrieveSaleByCustomer";
            int companyId = 1;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1].Replace("/", ""), dates[0].Replace("/", ""), 0, 0, 0);
            var response = getDistributorSaleData(url, password, method);
            var jsonResponse = xmlToJsonSale(response);
            if (jsonResponse != "notValid")
            {
                var dataArray = JArray.Parse(jsonResponse);
                if (dataArray != null)
                {
                    validateSaleData(dataArray, distId, companyId);
                    repository.saveSale(dataArray, distId, companyId, logId);
                }
            }
        }

        [WebMethod]
        public void Sale_pakSalamat()
        {
            string password = "Re$g5689Aa2006";
            string url = "http://old.hejratco.com/PakSalamatTaminWebService.asmx";
            string method = "RetrieveSaleByCustomer";
            int companyId = 3;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1].Replace("/", ""), dates[0].Replace("/", ""), 0, 0, 0);
            var response = getDistributorSaleData(url, password, method);
            var jsonResponse = xmlToJsonSale(response);
            if (jsonResponse != "notValid")
            {
                var dataArray = JArray.Parse(jsonResponse);
                if (dataArray != null)
                {
                    validateSaleData(dataArray, distId, companyId);
                    repository.saveSale(dataArray, distId, companyId, logId);
                }
            }
        }
        [WebMethod]
        public void Sale_taminShafa()
        {
            string password = "Tamin568122#12Apnd";
            string url = "http://old.hejratco.com/TaminShafaParsWebService.asmx";
            string method = "RetrieveSaleByCustomer";
            int companyId = 5;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1].Replace("/", ""), dates[0].Replace("/", ""), 0, 0, 0);
            var response = getDistributorSaleData(url, password, method);
            var jsonResponse = xmlToJsonSale(response);
            if (jsonResponse != "notValid")
            {
                var dataArray = JArray.Parse(jsonResponse);
                if (dataArray != null)
                {
                    validateSaleData(dataArray, distId, companyId);
                    repository.saveSale(dataArray, distId, companyId, logId);
                }
            }

        }
        [WebMethod]
        public void Sale_taminPharmed()
        {
            string password = "985HGPss12$ka2";
            string url = "http://old.hejratco.com/TaminFarmedWebService.asmx";
            string method = "RetrieveSaleByCustomer";
            int companyId = 2;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1].Replace("/", ""), dates[0].Replace("/", ""), 0, 0, 0);
            var response = getDistributorSaleData(url, password, method);
            var jsonResponse = xmlToJsonSale(response);
            if (jsonResponse != "notValid")
            {
                var dataArray = JArray.Parse(jsonResponse);
                if (dataArray != null)
                {
                    validateSaleData(dataArray, distId, companyId);
                    repository.saveSale(dataArray, distId, companyId, logId);
                }
            }
        }


        /// ////////////////////////////////////////////////// stock ////////////////////////////////////////////////

        [WebMethod]
        public void Stock_rastaImen()
        {
            string password = "TEvj547#00Psa98";  // پسورد
            string url = "http://old.hejratco.com/RastaIMenWebService.asmx";
            string method = "RetrieveSaleByProduct";
            int companyId = 1;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                var response = getDistributorStockData(url, password, method, date);
                var jsonResponse = xmlToJsonStock(response);
                if (jsonResponse != "notValid")
                {
                    var dataArray = JArray.Parse(jsonResponse);
                    if (dataArray != null)
                    {
                        validateStockData(dataArray, distId, companyId);
                        repository.saveStock(dataArray, distId, companyId, logId);
                    }
                }
            }

        }


        [WebMethod]
        public void Stock_pakSalamat()
        {
            string password = "Re$g5689Aa2006";
            string url = "http://old.hejratco.com/PakSalamatTaminWebService.asmx";
            string method = "RetrieveSaleByProduct";
            int companyId = 3;

            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                var response = getDistributorStockData(url, password, method, date);
                var jsonResponse = xmlToJsonStock(response);
                if (jsonResponse != "notValid")
                {
                    var dataArray = JArray.Parse(jsonResponse);
                    if (dataArray != null)
                    {
                        validateStockData(dataArray, distId, companyId);
                        repository.saveStock(dataArray, distId, companyId, logId);
                    }
                }
            }
        }
        [WebMethod]
        public void Stock_taminShafa()
        {
            string password = "Tamin568122#12Apnd";
            string url = "http://old.hejratco.com/TaminShafaParsWebService.asmx";
            string method = "RetrieveSaleByProduct";
            int companyId = 5;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                var response = getDistributorStockData(url, password, method, date);
                var jsonResponse = xmlToJsonStock(response);
                if (jsonResponse != "notValid")
                {
                    var dataArray = JArray.Parse(jsonResponse);
                    if (dataArray != null)
                    {
                        validateStockData(dataArray, distId, companyId);
                        repository.saveStock(dataArray, distId, companyId, logId);
                    }
                }
            }

        }
        [WebMethod]
        public void Stock_taminPharmed()
        {
            string password = "985HGPss12$ka2";
            string url = "http://old.hejratco.com/TaminFarmedWebService.asmx";
            string method = "RetrieveSaleByProduct";
            int companyId = 2;

            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                var response = getDistributorStockData(url, password, method, date);
                var jsonResponse = xmlToJsonStock(response);
                if (jsonResponse != "notValid")
                {
                    var dataArray = JArray.Parse(jsonResponse);
                    if (dataArray != null)
                    {
                        validateStockData(dataArray, distId, companyId);
                        repository.saveStock(dataArray, distId, companyId, logId);
                    }
                }
            }
        }


        /////////////////////////////////////////////////////////////////////////////////////////////////
        public string getDistributorSaleData(string url, string password, string method)
        {
            string soapRequest = $@"<?xml version=""1.0"" encoding=""utf-8""?>
                                    <soap:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
                                      <soap:Body>
                                        <{method} xmlns=""http://tempuri.org/"">
                                          <FromDate>{dates[dates.Length - 1]}</FromDate>
                                          <ToDate>{dates[0]}</ToDate>
                                          <PassWord>{password}</PassWord>
                                        </{method}>
                                      </soap:Body>
                                    </soap:Envelope>";

            var content = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
            content.Headers.Add("SOAPAction", $"http://tempuri.org/{method}");

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
                    return $"{{\"error\":\"Unable to fetch data\", \"statusCode\":\"{response.StatusCode}\"}}";
                }
            }
            catch (Exception ex)
            {
                return $"{{\"error\":\"{ex.Message}\"}}";
            }
        }
        public string getDistributorStockData(string url, string password, string method, string date)
        {

            string soapRequest = $@"<?xml version=""1.0"" encoding=""utf-8""?>
                                    <soap:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
                                      <soap:Body>
                                        <{method} xmlns=""http://tempuri.org/"">
                                          <FromDate>{date}</FromDate>
                                          <ToDate>{date}</ToDate>
                                          <PassWord>{password}</PassWord>
                                        </{method}>
                                      </soap:Body>
                                    </soap:Envelope>";

            var content = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
            content.Headers.Add("SOAPAction", $"http://tempuri.org/{method}");

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
                    return $"{{\"error\":\"Unable to fetch data\", \"statusCode\":\"{response.StatusCode}\"}}";
                }
            }
            catch (Exception ex)
            {
                return $"{{\"error\":\"{ex.Message}\"}}";
            }
        }

        private dynamic validateStockData(dynamic dataArray, int distId, int companyId)
        {
            foreach (var item in dataArray)
            {

                string[] persianDateArray = ConvertToPersianDateArray(item["ActionDate"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];

                item["GoodsCode"] = item["GoodsCode"];
                item["GoodsName"] = item["GoodsName"];
                item["CountOfStock"] = item["CountOfStock"];
                item["OnWayQty"] = item["OnWayQty"];
                item["p1"] = Convert.ToDecimal(item["BuyFee"]);
                item["AmountOfStock"] = (Convert.ToDecimal(item["OnWayQty"]) + Convert.ToDecimal(item["CountOfStock"])) * Convert.ToDecimal(item["BuyFee"]);

                string[] expPersianDateArray = ConvertMiladiToPersianDateArray((string)item["ExpireDate"]);
                item["expDay"] = expPersianDateArray[2];
                item["expMonth"] = expPersianDateArray[1];
                item["expYear"] = expPersianDateArray[0];


                item["BranchCode"] = item["CenterID"];
                item["BranchName"] = item["CenterName"];
                item["BatchNumber"] = item["BatchNumber"];





            }
            return dataArray;
        }
        private dynamic validateSaleData(dynamic dataArray, int distId, int companyId)
        {
            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateArray(item["BillShamsiDate"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];

                item["SaleType"] = "1";
                item["SaleAmount"] = item["SaleAmount"];
                item["GoodsPrice"] = item["GoodsPrice"];
                item["p1"] = item["LastBuyPrice"];
                item["p2"] = Convert.ToInt64(item["GoodsPrice"]) / Convert.ToInt64(item["SaleAmount"]);
                if (Convert.ToInt32(item["SaleAmount"]) < 0)
                {
                    item["SaleType"] = "2";
                }
                item["CustomerCode"] = item["CustomerCode"];
                item["CustomerName"] = item["CustomerName"];
                //item["BillShamsiDate"] = item["BillShamsiDate"];
                item["GoodsCode"] = item["GoodsCode"];
                item["GoodsName"] = item["GoodsName"];
                item["CustomerAddress"] = item["CustomerAddress"];
                item["CustomerState"] = item["CustomerState"];
                item["CustomerGln"] = item["CustomerGln"];
                item["NationalCode"] = item["NationalCode"];
                item["CustomerEconomic"] = item["CustomerEconomic"];
                item["CityName"] = item["CityName"];
                item["CityID"] = item["CityID"];
                item["StateId"] = item["StateId"];

                item["BranchCode"] = item["InventoryCode"];
                item["BranchName"] = item["InventoryName"];
                item["RecordType"] = item["RecordType"];
                item["ActiveStatus"] = item["ActiveStatus"];
                item["CustomerGroup"] = item["CustomerHospitalState"];





            }
            return dataArray;
        }
        public static string xmlToJsonStock(string soapResponse)
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
                nsmgr.AddNamespace("diffgr", "urn:schemas-microsoft-com:xml-diffgram-v1");

                // یافتن گره diffgram
                XmlNode diffgramNode = xmlDoc.SelectSingleNode("//diffgr:diffgram", nsmgr);
                if (diffgramNode == null)
                    throw new Exception("notValid");

                // یافتن تمام گره‌های Table
                XmlNodeList tableNodes = diffgramNode.SelectNodes("//Table");
                if (tableNodes == null || tableNodes.Count == 0)
                    throw new Exception("notValid");

                // تبدیل هر گره Table به JSON
                JArray jsonArray = new JArray();
                foreach (XmlNode tableNode in tableNodes)
                {
                    JObject jsonObject = new JObject();
                    jsonObject["CenterID"] = tableNode.SelectSingleNode("WarehouseCode")?.InnerText.Trim();
                    jsonObject["GoodsName"] = tableNode.SelectSingleNode("PersianDescription")?.InnerText.Trim();
                    jsonObject["CenterName"] = tableNode.SelectSingleNode("WarehouseDescription")?.InnerText.Trim();
                    jsonObject["GoodsCode"] = tableNode.SelectSingleNode("ProductCode")?.InnerText.Trim();
                    jsonObject["ActionDate"] = tableNode.SelectSingleNode("ActionDate")?.InnerText.Trim();
                    jsonObject["OnWayQty"] = tableNode.SelectSingleNode("ToDateOnTheWay")?.InnerText.Trim();
                    jsonObject["CountOfStock"] = tableNode.SelectSingleNode("ToDateInventory")?.InnerText.Trim();
                    jsonObject["BatchNumber"] = tableNode.SelectSingleNode("BatchNo")?.InnerText.Trim();
                    jsonObject["ExpireDate"] = tableNode.SelectSingleNode("ExpireDate")?.InnerText.Trim();
                    jsonObject["AmountOfStock"] = tableNode.SelectSingleNode("InventoryFee")?.InnerText.Trim();
                    jsonObject["BuyFee"] = tableNode.SelectSingleNode("BuyFee")?.InnerText.Trim();
                    jsonObject["LastBuyPrice"] = tableNode.SelectSingleNode("BuyFee")?.InnerText.Trim();
                    jsonArray.Add(jsonObject);
                }

                return jsonArray.ToString(Newtonsoft.Json.Formatting.Indented);
            }
            catch (Exception ex)
            {
                return ("notValid");
            }
        }
        static string xmlToJsonSale(string soapResponse)
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
                nsmgr.AddNamespace("diffgr", "urn:schemas-microsoft-com:xml-diffgram-v1");

                // یافتن گره diffgram
                XmlNode diffgramNode = xmlDoc.SelectSingleNode("//diffgr:diffgram", nsmgr);
                if (diffgramNode == null)
                    throw new Exception("notValid");

                // یافتن تمام گره‌های Table
                XmlNodeList tableNodes = diffgramNode.SelectNodes("//Table");
                if (tableNodes == null || tableNodes.Count == 0)
                    throw new Exception("notValid");

                // تبدیل هر گره Table به JSON
                JArray jsonArray = new JArray();
                foreach (XmlNode tableNode in tableNodes)
                {
                    JObject jsonObject = new JObject();

                    jsonObject["GoodsCode"] = tableNode.SelectSingleNode("ProductCode")?.InnerText.Trim();
                    jsonObject["GoodsName"] = tableNode.SelectSingleNode("PersianDescription")?.InnerText.Trim();
                    jsonObject["CustomerCode"] = tableNode.SelectSingleNode("CustomerCode")?.InnerText.Trim();
                    jsonObject["CustomerName"] = tableNode.SelectSingleNode("DrugstoreName")?.InnerText.Trim();
                    jsonObject["CityID"] = tableNode.SelectSingleNode("CityId")?.InnerText.Trim();
                    jsonObject["CityName"] = tableNode.SelectSingleNode("CityDescription")?.InnerText.Trim();
                    jsonObject["StateId"] = tableNode.SelectSingleNode("StateId")?.InnerText.Trim();
                    jsonObject["CustomerState"] = tableNode.SelectSingleNode("StateDescription")?.InnerText.Trim();
                    jsonObject["CustomerAddress"] = tableNode.SelectSingleNode("Address")?.InnerText.Trim();
                    jsonObject["BillShamsiDate"] = tableNode.SelectSingleNode("InvoiceDate")?.InnerText.Trim();
                    jsonObject["SaleAmount"] = tableNode.SelectSingleNode("SaleQuantity")?.InnerText.Trim();
                    jsonObject["RecordType"] = tableNode.SelectSingleNode("DocumentDescription")?.InnerText.Trim();
                    jsonObject["NationalCode"] = tableNode.SelectSingleNode("MeliCode")?.InnerText.Trim();
                    jsonObject["CustomerEconomic"] = tableNode.SelectSingleNode("EconomicCode")?.InnerText.Trim();
                    jsonObject["InventoryCode"] = tableNode.SelectSingleNode("WarehouseCode")?.InnerText.Trim();
                    jsonObject["InventoryName"] = tableNode.SelectSingleNode("WarehouseDescription")?.InnerText.Trim();
                    jsonObject["LastBuyPrice"] = tableNode.SelectSingleNode("BuyFee")?.InnerText.Trim();
                    jsonObject["GoodsPrice"] = tableNode.SelectSingleNode("TotalSaleFee")?.InnerText.Trim();
                    jsonObject["ActiveStatus"] = tableNode.SelectSingleNode("ActiveStatus")?.InnerText.Trim();
                    jsonObject["CustomerGln"] = tableNode.SelectSingleNode("gln")?.InnerText.Trim();
                    jsonObject["CustomerHospitalState"] = tableNode.SelectSingleNode("CustomerNatureName")?.InnerText.Trim();

                    jsonArray.Add(jsonObject);
                }

                return jsonArray.ToString(Newtonsoft.Json.Formatting.Indented);
            }
            catch (Exception ex)
            {
                return ("notValid");
            }
        }
        public string[] ConvertToPersianDateArray(string dateValue)
        {
            if (dateValue.Length == 10)
            {
                string year = dateValue.Substring(0, 4);
                string month = dateValue.Substring(5, 2);
                string day = dateValue.Substring(8, 2);
                return new string[] { day, month, year };
            }
            else
            {
                throw new ArgumentException("Invalid date format.");
            }
        }
        public string[] ConvertMiladiToPersianDateArray(string dateValue)
        {
            string[] persianDateArray;
            try
            {
                dateValue = dateValue + "/01";
                DateTime miladiDate = DateTime.ParseExact(dateValue, "yyyy/MM/dd", CultureInfo.InvariantCulture);
                // Convert to Persian date using PersianCalendar
                PersianCalendar persianCalendar = new PersianCalendar();
                int persianYear = persianCalendar.GetYear(miladiDate);
                int persianMonth = persianCalendar.GetMonth(miladiDate);
                int persianDay = persianCalendar.GetDayOfMonth(miladiDate);
                persianDateArray = new string[]
                {
                    persianYear.ToString(),
                    persianMonth.ToString("D2"), // Leading zero if necessary
                    persianDay.ToString("D2")    // Leading zero if necessary
                };

            }
            catch
            {
                persianDateArray = new string[]
                {
                    "0000",
                    "00",
                    "00"
                };

            }


            return persianDateArray;
        }
    }
}

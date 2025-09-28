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

namespace Web_Services.controller
{

    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class DarouPakhash : System.Web.Services.WebService
    {
        // تعریف یک HttpClient مستقل برای این کلاس
        private readonly HttpClient client = new HttpClient();
        private int distId = 7;
        private string urlSale = "http://tablet.ondpline.com/dpdc_Pharmacy_WS/SuppliersWS.asmx";
        private string urlStock = "http://tablet.ondpline.com/dpdc_Pharmacy_WS/SuppliersWS.asmx";
        private static config configInstance = new config("");
        private string[] dates = configInstance.GetValue();
        [WebMethod]
        public void Sale_taminPharmed()
        {
            string username = "pharmedtehran";
            string password = "Ph@rMeD!!TehR@NN!!985***";
            string supplierId = "568";
            int companyId = 2;

            int logId=repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0,0,0);

            var response = GetDistributorSaleData(urlSale, username, password, supplierId);
            var jsonResponse = xmlToJson(response, "GetCustomerReportWithBachJsonOnLineResult");
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
        public void Sale_rastaImen()
        {
            string username = "rastaimn";
            string password = "r@sta1m3NDr321";
            string supplierId = "371";
            int companyId = 1;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, username, password, supplierId);
            var jsonResponse = xmlToJson(response, "GetCustomerReportWithBachJsonOnLineResult");
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
            string username = "shafapars";
            string password = "T@min!P@@rS!545%%";
            string supplierId = "545";
            int companyId = 5;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, username, password, supplierId);
            var jsonResponse = xmlToJson(response, "GetCustomerReportWithBachJsonOnLineResult");
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

        ////////////////////////////////////////////////////////stock//////////////////////////////////////////////////////////////
        [WebMethod]
        public void Stock_taminPharmed()
        {
            string username = "pharmedtehran";
            string password = "Ph@rMeD!!TehR@NN!!985***";
            string supplierId = "568";
            int companyId = 2;
            // foreach (string date in dates)
            //{
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, dates[dates.Length - 1], dates[0], 0,0,0);
            var response = GetDistributorStockData(urlStock, username, password, supplierId);
            var jsonResponse = xmlToJson(response, "GetStockJsonResult");
            var dataArray = JArray.Parse(jsonResponse);

            if (dataArray != null)
            {
                validateStockData(dataArray, distId, companyId);
                repository.saveStock(dataArray, distId, companyId, logId);
            }
            //}
        }
        [WebMethod]
        public void Stock_rastaImen()
        {
            string username = "rastaimn";
            string password = "r@sta1m3NDr321";
            string supplierId = "371";
            int companyId = 1;
            //foreach (string date in dates)
            //{
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, dates[dates.Length - 1], dates[0], 0,0,0);
            var response = GetDistributorStockData(urlStock, username, password, supplierId);
            var jsonResponse = xmlToJson(response, "GetStockJsonResult");
            var dataArray = JArray.Parse(jsonResponse);

            if (dataArray != null)
            {
                validateStockData(dataArray, distId, companyId);
                repository.saveStock(dataArray, distId, companyId, logId);
            }
            //}
        }
        [WebMethod]
        public void Stock_taminShafa()
        {
            string username = "shafapars";
            string password = "T@min!P@@rS!545%%";
            string supplierId = "545";
            int companyId = 5;

            //foreach (string date in dates)
            //{
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, dates[dates.Length - 1], dates[0], 0,0,0);
            var response = GetDistributorStockData(urlStock, username, password, supplierId);
            var jsonResponse = xmlToJson(response, "GetStockJsonResult");
            var dataArray = JArray.Parse(jsonResponse);

            if (dataArray != null)
            {
                validateStockData(dataArray, distId, companyId);
                repository.saveStock(dataArray, distId, companyId, logId);
            }
            //}
        }
        public string GetDistributorSaleData(string url, string username, string password, string supplierId)
        {
            string soapRequest = $@"<?xml version=""1.0"" encoding=""utf-8""?>
                                    <soap:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
                                      <soap:Body>
                                        <GetCustomerReportWithBachJsonOnLine xmlns=""http://tempuri.org/"">
                                          <username>{username}</username>
                                          <password>{password}</password>
                                          <supplierId>{supplierId}</supplierId>
                                          <fromDate_Shamsi>{dates[dates.Length - 1]}</fromDate_Shamsi>
                                          <endDate_Shamsi>{dates[0]}</endDate_Shamsi>
                                        </GetCustomerReportWithBachJsonOnLine>
                                      </soap:Body>
                                    </soap:Envelope>";

            var content = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("SOAPAction", "http://tempuri.org/GetCustomerReportWithBachJsonOnLine");

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
        public string GetDistributorStockData(string url, string username, string password, string supplierId)
        {

            string soapRequest = $@"<?xml version=""1.0"" encoding=""utf-8""?>
                                    <soap:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
                                      <soap:Body>
                                        <GetStockJson xmlns=""http://tempuri.org/"">
                                          <username>{username}</username>
                                          <password>{password}</password>
                                          <supplierId>{supplierId}</supplierId>
                                          <fromDate_Shamsi>{dates[dates.Length - 1]}</fromDate_Shamsi>
                                          <endDate_Shamsi>{dates[0]}</endDate_Shamsi>
                                        </GetStockJson>
                                      </soap:Body>
                                    </soap:Envelope>";

            var content = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("SOAPAction", "http://tempuri.org/GetStockJson");

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
            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateArray(item["TarikhShamsi"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];


                item["p1"] = item["GheymatKharid"];
                item["p2"] = item["GheymatForosh"];
                item["SaleType"] = 1;
                item["SaleAmount"] = item["TedadForosh"];
                item["GoodsPrice"] = item["RialForosh"];

                if (item["TedadBargashtAzForosh"] > 0)
                {
                    item["SaleType"] = 2;
                    item["SaleAmount"] = -Convert.ToInt32(item["TedadBargashtAzForosh"]);
                    item["GoodsPrice"] = -Convert.ToDecimal(item["MarjoeeRialy"]);
                }

                item["prizeQuantity"] = item["TedadJayezeh"] + item["EshantionDasty"];
                item["prizeAmount"] = item["RialJayezeh"];

                if ((item["TedadBargashtAzJayezeh"] + item["MarjoeeEshantionDasty"]) > 0)
                {
                    item["prizeQuantity"] = -(Convert.ToInt32(item["TedadBargashtAzJayezeh"]) + Convert.ToInt32(item["MarjoeeEshantionDasty"]));
                }

                item["BillNo"] = item["ShomarehFaktor"];
                item["BranchName"] = item["NameMarkazPakhsh"];

                item["CustomerName"] = item["NameMoshtary"];
                item["CityName"] = item["NameShahr"];
                item["CityID"] = item["Id_Shahr"];
                item["CustomerState"] = item["NameOstan"];
                item["StateId"] = item["Id_Ostan"];

                item["CustomerTel"] = item["telephone"];

                item["GoodsName"] = item["NameKala"];
                item["BatchNo"] = item["ShomarehBach"];
                item["ExpireDate"] = item["TarikhEngheza"];
                item["GoodsCode"] = item["CodeKalaNew"];
                item["CustomerEconomic"] = item["CodeEghtesady"];

                item["NationalCode"] = item["ShenasehMeli_CodeMeli"];
                item["CustomerGln"] = item["GLNMoshtary"];

                item["inventoryName"] = item["Anbar"];

                item["CustomerGroup"] = item["VazeiatMoshtary"];

                item["GoodsGeneric"] = item["CodeJenerik"];
                item["BranchCode"] = item["CenterId"];

                item["CustomerAddress"] = item["AddressMoshtary"];

                item["CustomerCode"] = item["CustomerId"];

            }
            return dataArray;
        }
        private dynamic validateStockData(dynamic dataArray, int distId, int companyId)
        {
            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateArray(item["TarikhSh"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];

                item["GoodsCode"] = item["CodeKalaNew"];
                item["GoodsName"] = item["Namekala"];

                item["BranchCode"] = item["ccMarkazPakhsh"];
                item["BranchName"] = item["NameMarkazPakhsh"];
                item["CountOfStock"] = item["MojodyTedady"];
                item["OnWayQty"] = item["MojodyDarRah"];

                item["MarjoeeBeTaminKonandeh"] = item["MarjoeeBeTaminKonandeh"];

                item["CodeNoeAnbar"] = item["CodeNoeAnbar"];


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
        public static string GenerateUniqueCodeSale(
            string distId,
            string companyId,
            string BillNo,
            string BillShamsiDate,
            string FactorId,
            string CustomerId,
            string GoodsCode,
            string SaleAmount,
            string GoodsPrice,
            string BranchCode,
            string CustomerGln
            )
        {
            string data = $"{distId}|{companyId}|{BillNo}|{BillShamsiDate}|{FactorId}|{CustomerId}|{GoodsCode}|{SaleAmount}|{GoodsPrice}|{BranchCode}|{CustomerGln}";
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
            string TarikhShamsi,
            string CodeKalaNew,
            string ccMarkazPakhsh
            )
        {
            string data = $"{distId}|{companyId}|{TarikhShamsi}|{CodeKalaNew}|{ccMarkazPakhsh}";
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

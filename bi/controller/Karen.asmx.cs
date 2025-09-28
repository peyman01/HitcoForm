using System;
using System.ComponentModel.Design;
using System.Diagnostics;
using System.Globalization;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Web.Services;
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
    public class Karen : System.Web.Services.WebService
    {
        private readonly HttpClient client = new HttpClient();
        private int distId = 10;
        private string urlSale = "http://185.142.124.78:81/WebService/api/securedata_Sales/";
        private string urlStock = "http://185.142.124.78:81/WebService/api/securedata_MoJoodis/";
        private static config configInstance = new config("");
        private string[] dates = configInstance.GetValue();
        [WebMethod]
        public void Sale_rastaImen()
        {
            var companyId = 1;
            var Bearer = "28288E74-30FC-EC11-8AA1-005056BA59A9";
            var urlProvider = "/karen-rasta-eymens";
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = getDistributorSaleData(Bearer, urlProvider);
            var jsonObject = JObject.Parse(response);
            var message = jsonObject["Message"].ToString();
            var dataArray = JsonConvert.DeserializeObject(message) as JArray;
            if (dataArray != null)
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }


        }
        [WebMethod]
        public void Sale_pakSalamat()
        {
            var companyId = 3;
            var Bearer = "DAAFD9C7-3EFC-EC11-8AA1-005056BA59A9";
            var urlProvider = "/karen-salamat-tamin";
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = getDistributorSaleData(Bearer, urlProvider);
            var jsonObject = JObject.Parse(response);
            var message = jsonObject["Message"].ToString();
            var dataArray = JsonConvert.DeserializeObject(message) as JArray;
            if (dataArray != null)
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }
        [WebMethod]
        public void Sale_taminPharmed()
        {
            //تست شود
            var companyId = 2;
            var Bearer = "BA952731F97FB058035AA399B1CB3D5C";
            var urlProvider = "/karen-tamin-pharmed";
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = getDistributorSaleData(Bearer, urlProvider);
            var jsonObject = JObject.Parse(response);
            var message = jsonObject["Message"].ToString();
            var dataArray = JsonConvert.DeserializeObject(message) as JArray;
            if (dataArray != null)
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId,logId);
            }
        }
        ///////////////////////////////////////////////////////////////////////////////////// stock /////////////////////////////////////////////////////////////////////////        
        [WebMethod]
        public void Stock_rastaImen()
        {
            var companyId = 1;
            var Bearer = "28288E74-30FC-EC11-8AA1-005056BA59A9";
            var urlProvider = "/karen-rasta-eymens";
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date, date, 0, 0, 0);
                var response = getDistributorStockData(Bearer, urlProvider, date);  
                var jsonObject = JObject.Parse(response);
                var message = jsonObject["Message"].ToString();
                var dataArray = JsonConvert.DeserializeObject(message) as JArray;
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId, date);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }

            }
        }
        [WebMethod]
        public void Stock_pakSalamat()
        {
            var companyId = 3;
            var Bearer = "DAAFD9C7-3EFC-EC11-8AA1-005056BA59A9";
            var urlProvider = "/karen-salamat-tamin";
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date, date, 0, 0, 0);
                var response = getDistributorStockData(Bearer, urlProvider, date);
                var jsonObject = JObject.Parse(response);
                var message = jsonObject["Message"].ToString();
                var dataArray = JsonConvert.DeserializeObject(message) as JArray;
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId, date);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }

            }
        }
        [WebMethod]
        public void Stock_taminPharmed()
        {
            //تست شود
            var companyId = 2;
            var Bearer = "BA952731F97FB058035AA399B1CB3D5C";
            var urlProvider = "/karen-tamin-pharmed";
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date, date, 0, 0, 0);
                var response = getDistributorStockData(Bearer, urlProvider, date);
                var jsonObject = JObject.Parse(response);
                var message = jsonObject["Message"].ToString();
                var dataArray = JsonConvert.DeserializeObject(message) as JArray;
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId, date);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }

            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        
        public string getDistributorSaleData(string Bearer, string urlProvider)
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Bearer);
            var url = urlSale + dates[dates.Length - 1] + "/" + dates[0] + urlProvider;
            HttpResponseMessage response = client.GetAsync(url).Result;
            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                return data;
            }
            else
            {
                return $"Error: {response.StatusCode} - {response.ReasonPhrase}";
            }
        }
        public string getDistributorStockData(string Bearer, string urlProvider, string date)
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Bearer);
            var url = urlStock + date + "/" + date + urlProvider;
            HttpResponseMessage response = client.GetAsync(url).Result;
            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                return data;
            }
            else
            {
                return $"Error: {response.StatusCode} - {response.ReasonPhrase}";
            }
        }
        private dynamic validateSaleData(dynamic dataArray, int distId, int companyId)
        {
            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateArray(item["Docdate"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];

                item["SaleType"] = 1;
                item["SaleAmount"] = item["SaleQty"];
                item["GoodsPrice"] = item["SaleAmnt"];
                item["p2"] = 0;
                if (Convert.ToInt32(item["mrjQty"]) > 0)
                {
                    item["SaleType"] = 2;
                    item["SaleAmount"] = -Convert.ToInt32(item["mrjQty"]);
                    item["GoodsPrice"] = -Convert.ToDecimal(item["mrjAmnt"]);

                }
                if (item["SaleAmount"] > 0)
                {
                    item["p2"] = Convert.ToInt64(item["GoodsPrice"]) / Convert.ToInt64(item["SaleAmount"]);
                }
                if (Convert.ToInt32(item["PrizeQty"]) > 0)
                {
                    item["SaleType"] = 1;
                    item["prizeQuantity"] = Convert.ToInt32(item["PrizeQty"]);
                }
                if (Convert.ToInt32(item["MrjEshQty"]) > 0)
                {
                    item["SaleType"] = 2;
                    item["prizeQuantity"] = -Convert.ToInt32(item["MrjEshQty"]);
                }

                item["CustomerCode"] = item["Customercode"];
                item["CustomerName"] = item["CustomerName"];

                item["GoodsCode"] = item["ProductCode"];
                item["GoodsName"] = item["ProductName"];
                item["CustomerGln"] = item["GLN"];
                item["BatchNo"] = item["BatchNumber"];
                item["BranchCode"] = item["CenterCode"];
                item["BranchName"] = item["CenterName"];

            }
            return dataArray;
        }
        private dynamic validateStockData(dynamic dataArray, int distId, int companyId, string date)
        {
            string[] persianDateArray = ConvertToPersianDateArray(date);
            foreach (var item in dataArray)
            {
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];

                item["GoodsCode"] = item["PrdCode"];
                item["GoodsName"] = item["PrdName"];
                item["BatchNumber"] = item["BatchNo"];
                item["ExpireDate"] = item["ExpDate"];
                item["BranchCode"] = item["CntrCode"];
                item["BranchName"] = item["CntrName"];
                item["CountOfStock"] = item["MOJOODI"];
                string[] expPersianDateArray = ConvertMiladiToPersianDateArray((string)item["ExpDate"]);
                item["expDay"] = expPersianDateArray[2];
                item["expMonth"] = expPersianDateArray[1];
                item["expYear"] = expPersianDateArray[0];

            }
            return dataArray;
        }
        public string[] ConvertMiladiToPersianDateArray(string dateValue)
        {
            string[] persianDateArray;

            try
            {
                DateTime miladiDate = DateTime.ParseExact(dateValue, "yyyyMMdd", CultureInfo.InvariantCulture);
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

    }
}

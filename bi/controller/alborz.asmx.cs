using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.EnterpriseServices;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Security.AccessControl;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Web;
using System.Web.Services;
using System.Web.UI.WebControls;
using Web_Services.DataAccess;

namespace Web_Services.controller
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class alborz : System.Web.Services.WebService
    {

        private static readonly HttpClient client = new HttpClient();
        private int distId = 4;
        private string urlSale = "http://5.160.85.244:84/Supplier/Report/GetSaleofcustomer?apikey=";
        private string urlStock = "http://5.160.85.244:84/Supplier/Report/GetSaleAndStock?apikey=";
        private static config configInstance = new config("/");
        private string[] dates = configInstance.GetValue();

        [WebMethod]
        public void Sale_rastaImen()
        {
            var companyId = 1;
            string apiKey = "489dd0cde70442c6815c1ddb350d3227";
            dynamic response;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                response = GetDistributorSaleData(urlSale, apiKey, date);
                var jsonObject = JObject.Parse(response);
                var dataArray = jsonObject["result"] as JArray;
                if (jsonObject["rowCount"] == 0)
                {
                    repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, date.Replace("/", ""), date.Replace("/", ""), 1, 0, logId);
                }
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
            var companyId = 2;
            string apiKey = "4604c11453e34b3cbbf5f5e1a3c1414b";
            dynamic response;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                response = GetDistributorSaleData(urlSale, apiKey, date);
                var jsonObject = JObject.Parse(response);
                var dataArray = jsonObject["result"] as JArray;
                if (jsonObject["rowCount"] == 0)
                {
                    repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, date.Replace("/", ""), date.Replace("/", ""), 1, 0, logId);
                }
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
            var companyId = 5;
            string apiKey = "45934d34cf1e43b0a95e69b4fc7cb44c";

            dynamic response;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                response = GetDistributorSaleData(urlSale, apiKey, date);
                var jsonObject = JObject.Parse(response);
                var dataArray = jsonObject["result"] as JArray;
                if (jsonObject["rowCount"] == 0)
                {
                    repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, date.Replace("/", ""), date.Replace("/", ""), 1, 0, logId);
                }
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
            var companyId = 3;
            string apiKey = "4ff8eeed5ef64aa2bf07e8b83483f5bb";
            dynamic response;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                response = GetDistributorSaleData(urlSale, apiKey, date);
                var jsonObject = JObject.Parse(response);
                var dataArray = jsonObject["result"] as JArray;
                if (jsonObject["rowCount"] == 0) {
                    repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, date.Replace("/", ""), date.Replace("/", ""), 1, 0, logId);
                }
                if (dataArray != null)
                {
                    validateSaleData(dataArray, distId, companyId);
                    repository.saveSale(dataArray, distId, companyId, logId);
                }
            }
        }

        /// /////////////////////////////////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////
        [WebMethod]
        public void Stock_rastaImen()
        {
            var companyId = 1;
            string apiKey = "489dd0cde70442c6815c1ddb350d3227";
            dynamic response;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                response = GetDistributorStockData(urlStock, apiKey, date);
                JObject jsonObject;
                try
                {
                    jsonObject = JObject.Parse(response);
                }
                catch
                {
                    response = GetDistributorStockData(urlStock, apiKey, date);
                    jsonObject = JObject.Parse(response);
                    Debug.WriteLine($"/////////////////////////////////////rasta(alborz)///////////////////////: {date}");


                }
                var dataArray = jsonObject["result"] as JArray;

                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- rasta (alborz) -------: {date}");


            }


        }
        [WebMethod]
        public void Stock_taminPharmed()
        {

            var companyId = 2;
            string apiKey = "4604c11453e34b3cbbf5f5e1a3c1414b";
            dynamic response;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                response = GetDistributorStockData(urlStock, apiKey, date);
                JObject jsonObject;
                try
                {

                    jsonObject = JObject.Parse(response);
                }
                catch
                {
                    response = GetDistributorStockData(urlStock, apiKey, date);
                    jsonObject = JObject.Parse(response);
                    Debug.WriteLine($"/////////////////////////////////////pharmed(alborz)///////////////////////: {date}");


                }
                var dataArray = jsonObject["result"] as JArray;
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- pharmed (alborz) -------: {date}");
            }


        }
        [WebMethod]
        public void Stock_taminShafa()
        {

            var companyId = 5;
            string apiKey = "45934d34cf1e43b0a95e69b4fc7cb44c";
            dynamic response;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                response = GetDistributorStockData(urlStock, apiKey, date);
                JObject jsonObject;
                try
                {

                    jsonObject = JObject.Parse(response);
                }
                catch
                {
                    response = GetDistributorStockData(urlStock, apiKey, date);
                    jsonObject = JObject.Parse(response);
                    Debug.WriteLine($"/////////////////////////////////////shafa(alborz)///////////////////////: {date}");


                }
                var dataArray = jsonObject["result"] as JArray;
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- shafa (alborz) -------: {date}");
            }


        }
        [WebMethod]
        public void Stock_pakSalamat()
        {
            var companyId = 3;
            string apiKey = "4ff8eeed5ef64aa2bf07e8b83483f5bb";
            dynamic response;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                response = GetDistributorStockData(urlStock, apiKey, date);
                JObject jsonObject;
                try
                {

                    jsonObject = JObject.Parse(response);
                }
                catch
                {
                    response = GetDistributorStockData(urlStock, apiKey, date);
                    jsonObject = JObject.Parse(response);
                    Debug.WriteLine($"/////////////////////////////////////pak(alborz)///////////////////////: {date}");


                }
                var dataArray = jsonObject["result"] as JArray;
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }

                Debug.WriteLine($"Processed----------- pak (alborz) -------: {date}");

            }


        }

        /// ////////////////////////////////////////////////////////////////////////////////
        private dynamic validateStockData(dynamic dataArray, int distId, int companyId)
        {
            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateArray(item["BillShamsiDate"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];

                item["BranchName"] = item["BranchName"];
                item["BranchCode"] = item["BranchCode"];
                item["GoodsCode"] = item["GoodsCode"];
                item["GoodsName"] = item["GoodsName"];
                
                item["CountOfStock"] = item["CountOfStock"];
                item["AmountOfStock"] = item["AmountOfStock"];
                item["OnWayQty"] = item["BeinT"];
                
                item["p1"] = item["LastBuyPrice"];
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

                item["p2"] =Math.Abs(Convert.ToDecimal(item["GoodsPrice"]));
                item["SaleAmount"] = Convert.ToInt32(item["SaleAmount"]);
                item["GoodsPrice"] = Convert.ToDecimal(item["GoodsPrice"]) * Convert.ToInt32(item["SaleAmount"]);
                item["BranchCode"] = item["BranchCode"];
                item["BranchName"] = item["BranchName"];
                item["CustomerCode"] = item["CustomerCode"];
                item["CustomerName"] = item["CustomerCompany"]+" ("+item["CustomerName"]+")";

                item["SaleType"] = item["SaleType"];
                item["BillNo"] = item["BillNo"];
                item["GoodsCode"] = item["GoodsCode"];
                item["GoodsName"] = item["GoodsName"];
                item["CustomerAddress"] = item["CustomerAdress"];
                item["CustomerState"] = item["CustomerState"];
                item["CustomerGln"] = item["CustomerGln"];
                item["CustomerTel"] = item["CustomerTel"];
                item["BatchNo"] = item["BatchNo"];
                item["GoodsGeneric"] = item["GoodsGeneric"];

                item["CustomerHIX"] = item["CustomerHIX"];
                item["CustomerGroup"] = item["CustomerGroup"];
                item["CustomerHospitalState"] = item["CustomerHospitalState"];
                item["p1"] = item["LastBuyPrice"];

                item["ExpireDate"] = item["ExpireDate"];



            }
            return dataArray;
        }
        private string GetDistributorSaleData(string url, string apiKey, string fromDate)
        {
            object jsonData;
            jsonData = new
            {

            };
            var json = JsonConvert.SerializeObject(jsonData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            try
            {
                var response = client.PostAsync(url + apiKey + "&sDate=" + fromDate, content).Result;
                //var response = client.PostAsync(url+apiKey+"&sDate=1403/09/27", content).Result;
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
                return $"{{\"exception\":\"{ex.Message}\"}}";
            }
        }
        private string GetDistributorStockData(string url, string apiKey, string fromDate)
        {
            object jsonData;
            jsonData = new
            {

            };
            var json = JsonConvert.SerializeObject(jsonData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            try
            {
                var response = client.PostAsync(url + apiKey + "&sDate=" + fromDate, content).Result;

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
                return $"{{\"exception\":\"{ex.Message}\"}}";
            }
        }
        public string[] ConvertToPersianDateArray(string gregorianDate)
        {
            string[] parts = gregorianDate.Split('/');

            string year = parts[0];
            string month = parts[1];
            string day = parts[2];

            return new string[] { day, month, year };
        }
        public string[] ConvertToPersianDateString(string gregorianDate)
        {
            DateTime date = DateTime.ParseExact(gregorianDate, "MMM dd yyyy hh:mmtt", CultureInfo.InvariantCulture);
            PersianCalendar persianCalendar = new PersianCalendar();
            string year = persianCalendar.GetYear(date).ToString("0000");
            string month = persianCalendar.GetMonth(date).ToString("00");
            string day = persianCalendar.GetDayOfMonth(date).ToString("00");
            return new string[] { day, month, year };
        }
        

    }
}

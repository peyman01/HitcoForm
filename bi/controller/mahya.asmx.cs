using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Services;
using Web_Services.DataAccess;

namespace Web_Services.controller
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class mahya : System.Web.Services.WebService
    {
        private static readonly HttpClient client = new HttpClient();
        private int distId = 5;
        private string urlSale = "https://api.mahyadc.com/GetForoshMoshtarianByKalaBatchJson/";
        private string urlStock = "https://api.mahyadc.com/GetForoshMojodiByShobehJson/";
        private static config configInstance = new config("");
        private string[] dates = configInstance.GetValue();

        [WebMethod]
        public void Sale_pakSalamat()
        {
            var userName = "paksalamat";
            var passWord = "P@ksalamat";
            var companyId = 3;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, userName, passWord);
            var dataArray = JArray.Parse(response);
            if (dataArray != null)
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }
        [WebMethod]
        public void Sale_rastaImen()
        {
            var userName = "rastaimendarou";
            var passWord = "rasta852";
            var companyId = 1;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, userName, passWord);
            var dataArray = JArray.Parse(response);
            if (dataArray != null)
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }

        /// /////////////// /////////////// /////////////// /////////////// /////////////// ////////////
        [WebMethod]
        public void Stock_pakSalamat()
        {
            var userName = "paksalamat";
            var passWord = "P@ksalamat";
            var companyId = 3;

            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date, date, 0, 0, 0);
                var response = GetDistributorStockData(urlStock, userName, passWord, date);
                JArray dataArray;
                try
                {
                    dataArray = JArray.Parse(response);
                }
                catch
                {
                    response = GetDistributorStockData(urlStock, userName, passWord, date);
                    dataArray = JArray.Parse(response);
                    Debug.WriteLine($"/////////////////////////////////////paksalamat(mahya)///////////////////////: {date}");

                }

                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId, date);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- pak (mahya) -------: {date}");
            }
        }
        [WebMethod]
        public void Stock_rastaImen()
        {
            var userName = "rastaimendarou";
            var passWord = "rasta852";
            var companyId = 1;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date, date, 0, 0, 0);
                var response = GetDistributorStockData(urlStock, userName, passWord, date);
                JArray dataArray;
                try
                {
                    dataArray = JArray.Parse(response);
                }
                catch
                {
                    response = GetDistributorStockData(urlStock, userName, passWord, date);
                    dataArray = JArray.Parse(response);
                    Debug.WriteLine($"/////////////////////////////////////rasta(mayha)///////////////////////: {date}");

                }

                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId, date);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- rasta (mahya) -------: {date}");
            }
        }
        private dynamic validateSaleData(dynamic dataArray, int distId, int companyId)
        {


            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateArray(item["TarikhFaktorShamsi"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];

                item["SaleType"] = (item["NoeBargeh"] != "فروش") ? "2" : "1";

                item["BranchCode"] = item["ccMarkazPakhsh"];
                item["BranchName"] = item["NameMarkazPakhsh"];
                item["CustomerCode"] = item["CodeMoshtary"];
                item["CustomerName"] = item["NameMoshtary"];
                item["RecordType"] = item["NoeBargeh"];
                item["BillNo"] = item["ShomarehFaktor"];

                item["GoodsCode"] = item["CodeKala"];
                item["GoodsName"] = item["NameKala"];

                item["SaleAmount"] = Convert.ToInt32(item["ForoshKhales"]);
                if (item["SaleType"] == 1)
                {
                    item["GoodsPrice"] = Convert.ToDecimal(item["GheymatForosh"]);
                    item["prizeQuantity"] = Convert.ToInt32(item["TedadJayezehForosh"]);
                    //found records with zero saleAmount but value for prizeQuantity
                   // item["prizeAmount"] = Convert.ToDecimal(item["prizeQuantity"]) * (Convert.ToDecimal(item["GoodsPrice"])/ Convert.ToInt32(item["SaleAmount"]));
                }
                if (item["SaleType"] == 2)
                {
                    item["GoodsPrice"] = Convert.ToDecimal(item["GheymatForosh"]);
                    item["prizeQuantity"] = Convert.ToInt32(item["TedadJayezehMarjoee"]);
                    //item["SaleAmount"] = -Convert.ToInt32(item["TedadMarjoee"]) - Convert.ToInt32(item["prizeQuantity"]);
                    item["SaleAmount"] = Convert.ToInt32(item["ForoshKhales"]);
                   // item["prizeAmount"] = Convert.ToDecimal(item["prizeQuantity"]) * (Convert.ToDecimal(item["GoodsPrice"]) / Convert.ToInt32(item["SaleAmount"]));

                }
                item["p2"] = 0;
                if (Convert.ToDecimal(item["SaleAmount"]) != 0) { 
                    item["p2"] = item["GoodsPrice"] / item["SaleAmount"];                
                }
                item["CustomerAddress"] = item["Address"];
                item["CustomerGln"] = item["GLN"];
                item["CustomerHIX"] = item["HIX"];
                item["CustomerTel"] = item["Telephone"];
                item["BatchNo"] = item["ShomarehBatch"];
                item["ExpireDate"] = item["TarikhEnghezaMiladi"];
                item["CustomerState"] = item["NameOstan"];                
                                
                item["CityName"] = item["NameShahr"];
            }
            return dataArray;
        }
        private dynamic validateStockData(dynamic dataArray, int distId, int companyId, string date)
        {
            foreach (var item in dataArray)
            {
                item["DATE"] = date;
                string[] persianDateArray = ConvertToPersianDateArray(item["DATE"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];

                item["BranchCode"] = item["ccMarkazPakhsh"];
                item["BranchName"] = item["NameMarkazPakhsh"];
                item["GoodsCode"] = item["CodeKala"];
                item["GoodsName"] = item["NameKala"];
                item["CountOfStock"] = item["MojodiPayanDorehTedadi"];
                item["AmountOfStock"] = item["MojodiPayanDorehBaGheymatKharid"];
                item["p1"] = item["GheymatKharid"];
                item["OnWayQty"] = item["DarRahTedadi"];
                item["IRC"] = item["IRC"];
                item["GTIN"] = item["GTIN"];                
            }
            return dataArray;
        }
        private string GetDistributorSaleData(string url, string userName, string password)
        {
            //object jsonData;
            //jsonData = new
            //{
            //    UserName = userName,
            //    Password = password,
            //    FromDate = dates[dates.Length - 1],
            //    ToDate = dates[0]
            //};
            url = url + "?Username=" + userName + "&Password=" + password + "&FirstDate=" + dates[dates.Length - 1] + "&EndDate=" + dates[0];
            //jsonData = new
            //{
            //    UserName = userName,
            //    Password = password,
            //    FromDate = "14030701",
            //    ToDate = "14030927"
            //};            
            //url = url + "?Username=" + userName + "&Password=" + password + "&FirstDate=14030701"  + "&EndDate=14030927" ;
            //var json = JsonConvert.SerializeObject(jsonData);
            //            var content = new StringContent(json, Encoding.UTF8, "application/json");
            try
            {
                var response = client.GetAsync(url).Result;
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
        private string GetDistributorStockData(string url, string userName, string password, string toDate)
        {
            url = url + "?Username=" + userName + "&Password=" + password + "&FirstDate=" + toDate + "&EndDate=" + toDate;

            //            var content = new StringContent(json, Encoding.UTF8, "application/json");
            try
            {
                var response = client.GetAsync(url).Result;
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

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.ComponentModel.Design;
using System.Configuration;
using System.Configuration.Provider;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Globalization;
using System.Net.Http;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Web.Services;
using System.Xml.Linq;
using Web_Services.DataAccess;

namespace Web_Services.controller
{
    /// <summary>
    /// Summary description for Daya
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class Razi : System.Web.Services.WebService
    {
        private readonly HttpClient client = new HttpClient();
        private int distId = 11;
        private string urlSale = "http://46.209.199.137:46002/RazicoService/OnlineSales";
        private string urlStock = "http://46.209.199.137:46002/RazicoService/OnlineInventory";
        private static config configInstance = new config("/");
        private string[] dates = configInstance.GetValue();
        [WebMethod]
        public void Sale_taminPharmed()
        {
            var userName = "TaminPhT";
            var passWord = "5693251";
            var companyId = 2;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1].Replace("/", ""), dates[0].Replace("/", ""), 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, userName, passWord);
            var dataArray = JArray.Parse(response);
            if (dataArray != null)
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);

            }
        }
        [WebMethod]
        public void Sale_taminShafa()
        {
            var userName = "taminShafaPars";
            var passWord = "45823176";
            var companyId = 5;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1].Replace("/", ""), dates[0].Replace("/", ""), 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, userName, passWord);
            var dataArray = JArray.Parse(response);
            if (dataArray != null)
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);

            }
        }
        [WebMethod]
        public void Sale_pakSalamat()
        {
            var userName = "PakSalamat";
            var passWord = "65323*44";
            var companyId = 3;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1].Replace("/", ""), dates[0].Replace("/", ""), 0, 0, 0);
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
            var userName = "rastaimen";
            var passWord = "62574256";
            var companyId = 1;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1].Replace("/", ""), dates[0].Replace("/", ""), 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, userName, passWord);
            var dataArray = JArray.Parse(response);
            if (dataArray != null)
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);

            }
        }


        /// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        [WebMethod]
        public void Stock_taminPharmed()
        {
            var userName = "TaminPhT";
            var passWord = "5693251";
            var companyId = 2;            
            foreach (string date in dates)
            {
                JArray dataArray;
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی",  2, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                var response = GetDistributorStockData(urlStock, userName, passWord, date);
                try
                {
                    dataArray = JArray.Parse(response);
                }
                catch
                {
                    response = GetDistributorStockData(urlStock, userName, passWord, date);
                    dataArray = JArray.Parse(response);
                }
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
            var userName = "taminShafaPars";
            var passWord = "45823176";
            var companyId = 5;            
            foreach (string date in dates)
            {
                JArray dataArray;
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی",  2, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                var response = GetDistributorStockData(urlStock, userName, passWord, date);
                try
                {
                    dataArray = JArray.Parse(response);
                }
                catch
                {
                    response = GetDistributorStockData(urlStock, userName, passWord, date);
                    dataArray = JArray.Parse(response);
                }
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
            var userName = "PakSalamat";
            var passWord = "65323*44";
            var companyId = 3;
            foreach (string date in dates)
            {
                JArray dataArray;
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                var response = GetDistributorStockData(urlStock, userName, passWord, date);
                try
                {
                    dataArray = JArray.Parse(response);
                }
                catch
                {
                    response = GetDistributorStockData(urlStock, userName, passWord, date);
                    dataArray = JArray.Parse(response);
                }
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
            var userName = "rastaimen";
            var passWord = "62574256";
            var companyId = 1;
            foreach (string date in dates)
            {
                JArray dataArray;
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
                var response = GetDistributorStockData(urlStock, userName, passWord, date);
                try
                {
                    dataArray = JArray.Parse(response);
                }
                catch
                {
                    response = GetDistributorStockData(urlStock, userName, passWord, date);
                    dataArray = JArray.Parse(response);
                }


                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId, date);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }

            }
        }

        private dynamic validateStockData(dynamic dataArray, int distId, int companyId, string date)
        {
            foreach (var item in dataArray)
            {
                string[] persianDateArray = date.Split('/');
                item["day"] = persianDateArray[2];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[0];

                item["BranchCode"] = item["DSID"];
                item["BranchName"] = item["DSName"];
                item["GoodsCode"] = item["ProdID"];
                item["GoodsName"] = item["ProdName"];
                item["CountOfStock"] = item["tedadMojodi"];
                item["OnWayQty"] = item["tedadDarRah"];
                item["BlockedQty"] = item["tedadMamnooTozi"];
                item["BatchNumber"] = item["BatchNo"];
                item["DamagedQty"] = item["tedadZayeat"];
                item["ExpireDate"] = item["ExpDate"];

                string[] expPersianDateArray = ConvertToPersianDateArray((string)item["ExpDate"]);
                item["expDay"] = expPersianDateArray[0];
                item["expMonth"] = expPersianDateArray[1];
                item["expYear"] = expPersianDateArray[2];


            }
            return dataArray;
        }
        private dynamic validateSaleData(dynamic dataArray, int distId, int companyId)
        {
            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateArray(item["SalesDate"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];

                item["SaleAmount"] = item["SumProdQty"];
                item["GoodsPrice"] = item["SumProdPrice"];
                if (Convert.ToDecimal(item["GoodsPrice"]) > 0)
                {
                    item["SaleType"] = 1;
                }
                if (Convert.ToDecimal(item["SumProdPriceRet"]) < 0)
                {
                    item["SaleType"] = 2;
                    item["GoodsPrice"] = Convert.ToDecimal(item["SumProdPriceRet"]);
                }

                item["p2"] = 0;
                if (Convert.ToInt32(item["SaleAmount"]) != 0)
                {
                    item["p2"] = Math.Abs(Convert.ToDecimal(item["GoodsPrice"]) / Convert.ToDecimal(item["SumProdQty"]));
                }

                item["BranchCode"] = item["DSID"];
                item["BranchName"] = item["DSName"];
                item["GoodsCode"] = item["ProdID"];
                item["GoodsName"] = item["ProdName"];

                item["visitorId"] = item["VisitorID"];
                item["visitorName"] = item["VisitorName"];
                item["CustomerCode"] = item["CustID"];
                item["CustomerName"] = item["CustName"];
                item["CityID"] = item["CityID"];
                item["CityName"] = item["CityName"];
                item["CustomerAddress"] = item["CustAddress"];
                item["CustomerGln"] = item["GLN"];
                item["BatchNo"] = item["BatchNo"];
                item["ExpireDate"] = item["ExpDate"];

            }
            return dataArray;
        }
        private string GetDistributorSaleData(string url, string userName, string password)
        {
            object jsonData;
            jsonData = new
            {
                UserName = userName,
                Password = password,
                FromDate = dates[dates.Length - 1],
                ToDate = dates[0]
            };
            var json = JsonConvert.SerializeObject(jsonData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
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
                return $"{{\"exception\":\"{ex.Message}\"}}";
            }
        }
        private string GetDistributorStockData(string url, string userName, string password, string toDate)
        {
            object jsonData;
            jsonData = new
            {
                UserName = userName,
                Password = password,
                Date = toDate
            };
            var json = JsonConvert.SerializeObject(jsonData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
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
                return $"{{\"exception\":\"{ex.Message}\"}}";
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
        
    }
}

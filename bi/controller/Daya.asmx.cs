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
    public class Daya : System.Web.Services.WebService
    {
        private readonly HttpClient client = new HttpClient();
        private int distId = 1;
        private string urlSale = "https://dpsup.dayadarou.com/exusersfinal/api/v1/Sell/GetSupplierSellInfo_Abstract";
        private string urlStock = "https://dpsup.dayadarou.com/exusersfinal/api/v1/Stock/ProductStockOfBranches";
        private static config configInstance = new config("");
        private string[] dates = configInstance.GetValue();
        [WebMethod]
        public void Sale_taminDarou()
        {
            var userName = "tamindarou";
            var passWord = "gSa1t5";
            var companyId = 4;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, userName, passWord);
            var jsonObject = JObject.Parse(response);
            var dataArray = jsonObject["data"] as JArray;
            if (dataArray != null)
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }
        [WebMethod]
        public void Sale_taminPharmed()
        {
            var userName = "Tamin Pharmed";
            var passWord = "sDW12";
            var companyId = 2;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, userName, passWord);
            var jsonObject = JObject.Parse(response);
            var dataArray = jsonObject["data"] as JArray;
            if (dataArray != null)
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }
        [WebMethod]
        public void Sale_pakSalamat()
        {
            var userName = "Pak Salamat";
            var passWord = "SW24Z1";
            var companyId = 3;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, userName, passWord);
            var jsonObject = JObject.Parse(response);
            var dataArray = jsonObject["data"] as JArray;
            if (dataArray != null)
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }
        [WebMethod]
        public void Sale_rastaImen()
        {
            var userName = "Rasta Imen";
            var passWord = "dQ23A";
            var companyId = 1;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, dates[dates.Length - 1], dates[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, userName, passWord);
            var jsonObject = JObject.Parse(response);
            var dataArray = jsonObject["data"] as JArray;
            if (dataArray != null)
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }


        /// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        [WebMethod]
        public void Stock_taminDarou()
        {
            var userName = "tamindarou";
            var passWord = "gSa1t5";
            var companyId = 4;
            foreach (string date in dates)
            {

                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date, date, 0, 0, 0);
                var response = GetDistributorStockData(urlStock, userName, passWord, date);
                var jsonObject = JObject.Parse(response);
                var dataArray = jsonObject["data"] as JArray;
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- tamindarou -------: {date}");


            }

        }
        [WebMethod]
        public void Stock_pakSalamat()
        {
            var userName = "Pak Salamat";
            var passWord = "SW24Z1";
            var companyId = 3;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date, date, 0, 0, 0);
                var response = GetDistributorStockData(urlStock, userName, passWord, date);
                var jsonObject = JObject.Parse(response);
                var dataArray = jsonObject["data"] as JArray;
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- پاک سلامت -------: {date}");

            }
        }
        [WebMethod]
        public void Stock_taminPharmed()
        {
            var userName = "Tamin Pharmed";
            var passWord = "sDW12";
            var companyId = 2;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date, date, 0, 0, 0);
                var response = GetDistributorStockData(urlStock, userName, passWord, date);
                var jsonObject = JObject.Parse(response);
                var dataArray = jsonObject["data"] as JArray;
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- تامین فارمد -------: {date}");

            }
        }
        [WebMethod]
        public void Stock_rastaImen()
        {
            var userName = "Rasta Imen";
            var passWord = "dQ23A";
            var companyId = 1;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, date, date, 0, 0, 0);
                var response = GetDistributorStockData(urlStock, userName, passWord, date);
                var jsonObject = JObject.Parse(response);
                var dataArray = jsonObject["data"] as JArray;
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- رستا ایمن -------: {date}");

            }
        }

        private dynamic validateStockData(dynamic dataArray, int distId, int companyId)
        {
            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateArray(item["DATE"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];

                string[] expPersianDateArray = ConvertMiladiToPersianDateArray((string)item["ExpireDate"]);
                item["expDay"] = expPersianDateArray[2];
                item["expMonth"] = expPersianDateArray[1];
                item["expYear"] = expPersianDateArray[0];

                item["GoodsCode"] = item["ProductID"];
                item["GoodsName"] = item["ProductName"];
                item["BranchName"] = item["CenterName"];
                item["BranchCode"] = item["CenterID"];
                item["BatchNumber"] = item["BatchNumber"];
                item["CountOfStock"] = item["InventoryQty"];
                item["AmountOfStock"] = item["InventoryPrice"];
                item["InventoryPrice"] = item["InventoryPrice"];
                item["OnWayQty"] = item["OnWayQty"];
                item["DamagedQty"] = item["DamagedQty"];
                item["NotDistributedQty"] = item["NotDistributedQty"];
                item["BlockedQty"] = item["Blockedqty"];
                item["p1"] = item["CostUprc"];
            }
            return dataArray;
        }
        private dynamic validateSaleData(dynamic dataArray, int distId, int companyId)
        {
            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateArray(item["FactorDate"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];

                item["BranchCode"] = item["CenterID"];
                item["BranchName"] = item["CenterName"];
                item["CustomerName"] = item["CustomerName"];
                item["SaleType"] = item["RecordTypeID"];

                item["GoodsCode"] = item["ProductID"];
                item["GoodsName"] = item["ProductName"];
                item["CustomerState"] = item["CityName"];
                item["CustomerGln"] = item["GLN"];
                item["BatchNo"] = item["BatchNumber"];
                item["ExpireDate"] = item["ExpireDate"];

                item["IsPrize"] = item["IsPrize"];
                item["CityID"] = item["CityID"];
                item["RecordType"] = item["RecordType"];

                item["prizeAmount"] = 0;
                item["prizeQuantity"] = 0;
                item["SaleAmount"] = 0;
                item["GoodsPrice"] = 0;

                item["p1"] = Convert.ToDecimal(item["CostUprc"]);
                if (item["IsPrize"] == 3) {

                    item["IsPrize"] = 1;
                }
                //item["p2"] = Convert.ToDecimal(item["Price"]) / Convert.ToInt32(item["Quantity"]);

                item["p2"] = 0;
                if (Convert.ToInt32(item["SaleType"]) == 1)
                {
                    if (Convert.ToInt32(item["IsPrize"]) == 1)
                    {
                        item["prizeAmount"] = Convert.ToDecimal(item["Price"]);
                        item["prizeQuantity"] = Convert.ToDecimal(item["Quantity"]);
                        item["SaleAmount"] = 0;
                        item["GoodsPrice"] = 0;
                    }
                    else if (Convert.ToInt32(item["IsPrize"]) == 0)
                    {
                        item["prizeAmount"] = 0;
                        item["prizeQuantity"] = 0;
                        item["SaleAmount"] = Convert.ToDecimal(item["Quantity"]);
                        item["GoodsPrice"] = Convert.ToDecimal(item["Price"]);
                        item["p2"] = Math.Abs(Convert.ToInt64(item["GoodsPrice"]) / Convert.ToInt64(item["SaleAmount"]));

                    }
                }
                else if (Convert.ToInt32(item["SaleType"]) == 2)
                {
                    if (Convert.ToInt32(item["IsPrize"]) == 1)
                    {
                        item["prizeAmount"] = -Convert.ToDecimal(item["Price"]);
                        item["prizeQuantity"] = -Convert.ToDecimal(item["Quantity"]);
                        item["SaleAmount"] = 0;
                        item["GoodsPrice"] = 0;
                    }
                    else if (Convert.ToInt32(item["IsPrize"]) == 0)
                    {
                        item["prizeAmount"] = 0;
                        item["prizeQuantity"] = 0;
                        item["SaleAmount"] = -Convert.ToDecimal(item["Quantity"]);
                        item["GoodsPrice"] = -Convert.ToDecimal(item["Price"]);
                        item["p2"] = Math.Abs(Convert.ToInt64(item["GoodsPrice"]) / Convert.ToInt64(item["SaleAmount"]));
                    }
                }

            }
            return dataArray;
        }
        private string GetDistributorSaleData(string url, string userName, string password)
        {
            object jsonData;
            jsonData = new
            {
                authentication = new
                {
                    userName = userName,
                    password = password
                },
                fromDate = dates[dates.Length - 1],
                toDate = dates[0]
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
                authentication = new
                {
                    userName = userName,
                    password = password
                },
                toDate = toDate
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
    }
}

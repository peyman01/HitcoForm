using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Services;
using Web_Services.DataAccess;
using System.Security.Cryptography;
using System.Drawing;
using System.Diagnostics;
using System.Threading;

namespace Web_Services.controller
{
    /// <summary>
    /// Summary description for shafaArad
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class milan : System.Web.Services.WebService
    {
        private static readonly HttpClient client = new HttpClient();
        private int distId = 6;
        private string urlSale = "https://service.milanpars.com/Report/Sale";
        private string urlStock = "https://service.milanpars.com/Report/Stock";
        private static config configInstance = new config("-");
        private static config configInstanceShamsi = new config("");
        private string[] dates = configInstance.GetValue("miladi");
        private string[] datesShamsi = configInstanceShamsi.GetValue("miladi");
        [WebMethod]
        public void Sale_rastaImen()
        {
            var userName = "rastaimen";
            var passWord = "R@sta@1403imen!";
            var companyId = 1;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, datesShamsi[datesShamsi.Length - 1], datesShamsi[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, userName, passWord);
            var dataArray = JArray.Parse(response);
            if (dataArray != null )
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }
        [WebMethod]
        public void Sale_taminPharmed()
        {
            var userName = "taminpharmed";
            var passWord = "T@m!n1403PHarm";
            var companyId = 2;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, datesShamsi[datesShamsi.Length - 1], datesShamsi[0], 0, 0, 0);
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
            var userName = "paksalamat";
            var passWord = "P@kS@l@m@t";
            var companyId = 3;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, datesShamsi[datesShamsi.Length - 1], datesShamsi[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, userName, passWord);
            var dataArray = JArray.Parse(response);
            if (dataArray != null)
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }
        [WebMethod]
        public void Sale_taminDarou()
        {
            var userName = "tamindaroo";
            var passWord = "T@min1403Daroo";
            var companyId = 4;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, datesShamsi[datesShamsi.Length - 1], datesShamsi[0], 0, 0, 0);
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
            var userName = "taminshafa";
            var passWord = "Taminshafa@1234";
            var companyId = 5;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, datesShamsi[datesShamsi.Length - 1], datesShamsi[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, userName, passWord);
            var dataArray = JArray.Parse(response);
            if (dataArray != null && dataArray.Count > 0)
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }

        [WebMethod]
        public void Sale_aradCo()
        {
            var userName = "aradcopars";
            var passWord = "Ar@dco1403P@rs";
            var companyId = 9;
            int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 1, datesShamsi[datesShamsi.Length - 1], datesShamsi[0], 0, 0, 0);
            var response = GetDistributorSaleData(urlSale, userName, passWord);
            var dataArray = JArray.Parse(response);
            if (dataArray != null)
            {
                validateSaleData(dataArray, distId, companyId);
                repository.saveSale(dataArray, distId, companyId, logId);
            }
        }
        /// ////////////////////////////////////////////////////////////////////////////////
        [WebMethod]
        public void Stock_taminPharmed()
        {
            var userName = "taminpharmed";
            var passWord = "T@m!n1403PHarm";
            var companyId = 2;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, datesShamsi[Array.IndexOf(dates, date)], datesShamsi[Array.IndexOf(dates, date)], 0, 0, 0);
                var response = GetDistributorStockData(urlStock, userName, passWord, date);
                JArray dataArray;
                try
                {
                    dataArray = JArray.Parse(response);
                }
                catch
                {
                    Thread.Sleep(10000);
                    response = GetDistributorStockData(urlStock, userName, passWord, date);
                    dataArray = JArray.Parse(response);
                    Debug.WriteLine($"/////////////////////////////////////paksalamat(milan)///////////////////////: {date}");

                }
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- pak (milan) -------: {date}");

            }
        }
        [WebMethod]
        public void Stock_pakSalamat()
        {
            var userName = "paksalamat";
            var passWord = "P@kS@l@m@t";
            var companyId = 3;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, datesShamsi[Array.IndexOf(dates, date)], datesShamsi[Array.IndexOf(dates, date)], 0, 0, 0);
                var response = GetDistributorStockData(urlStock, userName, passWord, date);
                JArray dataArray;
                try
                {
                    dataArray = JArray.Parse(response);
                }
                catch
                {
                    Thread.Sleep(10000);
                    response = GetDistributorStockData(urlStock, userName, passWord, date);
                    dataArray = JArray.Parse(response);
                    Debug.WriteLine($"/////////////////////////////////////paksalamat(milan)///////////////////////: {date}");

                }
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- pak (milan) -------: {date}");

            }
        }
        [WebMethod]
        public void Stock_taminDarou()
        {
            var userName = "Tamindaroo";
            var passWord = "T@min1403Daroo";
            var companyId = 4;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, datesShamsi[Array.IndexOf(dates, date)], datesShamsi[Array.IndexOf(dates, date)], 0, 0, 0);
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
                    Debug.WriteLine($"/////////////////////////////////////taminDarou(milan)///////////////////////: {date}");

                }
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- taminDarou (milan) -------: {date}");
            }
        }

        [WebMethod]
        public void Stock_taminShafa()
        {
            var userName = "taminshafa";
            var passWord = "Taminshafa@1234";
            var companyId = 5;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, datesShamsi[Array.IndexOf(dates, date)], datesShamsi[Array.IndexOf(dates, date)], 0, 0, 0);
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
                    Debug.WriteLine($"/////////////////////////////////////taminDarou(milan)///////////////////////: {date}");

                }
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- taminDarou (milan) -------: {date}");
            }
        }
        [WebMethod]
        public void Stock_rastaImen()
        {
            var userName = "rastaimen";
            var passWord = "R@sta@1403imen!";
            var companyId = 1;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, datesShamsi[Array.IndexOf(dates, date)], datesShamsi[Array.IndexOf(dates, date)], 0, 0, 0);
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
                    Debug.WriteLine($"/////////////////////////////////////rasta(milan)///////////////////////: {date}");

                }
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- rasta (milan) -------: {date}");
            }
        }
        [WebMethod]
        public void Stock_aradCo()
        {
            var userName = "aradcopars";
            var passWord = "Ar@dco1403P@rs";
            var companyId = 9;
            foreach (string date in dates)
            {
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی", 2, datesShamsi[Array.IndexOf(dates, date)], datesShamsi[Array.IndexOf(dates, date)], 0, 0, 0);
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
                    Debug.WriteLine($"/////////////////////////////////////aradco(milan)///////////////////////: {date}");

                }
                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- aradco (milan) -------: {date}");
            }
        }
        /// ////////////////////////////////////////////////////////////////////////////////
        private dynamic validateStockData(dynamic dataArray, int distId, int companyId)
        {

            foreach (var item in dataArray)
            {
                string[] persianDateArray = IsoToPersianDateArray((String)item["date"]);
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];


                item["GoodsCode"] = item["productId"];
                item["GoodsName"] = item["productName"];
                item["CountOfStock"] = item["inventoryQty"];
                item["AmountOfStock"] = item["inventoryPrice"];

                string[] expPersianDateArray = IsoToPersianDateArray((string)item["expireDate"]);
                item["expDay"] = expPersianDateArray[0];
                item["expMonth"] = expPersianDateArray[1];
                item["expYear"] = expPersianDateArray[2];

                item["BranchCode"] = item["centerId"];
                item["BranchName"] = item["centerName"];
                item["BatchNumber"] = item["batchNumber"];
                item["OnWayQty"] = item["onWayQty"];
                item["DamagedQty"] = item["damageQty"];
                item["NotDistributedQty"] = item["notDistributedQty"];
                item["BlockedQty"] = item["blockedQty"];
                item["inventoryCode"] = item["inventoryCode"];
                item["inventoryName"] = item["inventoryName"];
                item["p1"] = 0;
                if (Convert.ToInt32(item["inventoryQty"]) != 0)
                {
                    item["p1"] = Convert.ToDecimal(item["inventoryPrice"]) / Convert.ToInt32(item["inventoryQty"]);

                }

            }
            return dataArray;
        }
        private dynamic validateSaleData(dynamic dataArray, int distId, int companyId)
        {
            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateArray(item["factorDate"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];
                item["p2"] = 0;

                if (item["recordTypeId"] == 101)
                {
                    item["SaleAmount"] = item["quantity"];
                    item["GoodsPrice"] = Convert.ToDecimal(item["price"]);
                    item["prizeAmount"] = 0;
                    item["prizeQuantity"] = 0;
                    item["SaleType"] = "1";
                    item["p2"] = Convert.ToInt64(item["price"]) / Convert.ToInt64(item["quantity"]);
                }
                if (item["recordTypeId"] == 102)
                {
                    item["SaleAmount"] = -Convert.ToInt32(item["quantity"]);
                    item["GoodsPrice"] = -Convert.ToDecimal(item["price"]);
                    item["prizeAmount"] = 0;
                    item["prizeQuantity"] = 0;
                    item["SaleType"] = "2";
                    item["p2"] =Math.Abs(Convert.ToInt64(item["price"]) / Convert.ToInt64(item["quantity"]));

                }
                if (item["recordTypeId"] == 48)
                {
                    item["prizeQuantity"] = item["quantity"];
                    item["prizeAmount"] = Convert.ToDecimal(item["price"]);
                    item["SaleAmount"] = 0;
                    item["GoodsPrice"] = 0;
                    item["SaleType"] = "1";
                }
                if (item["recordTypeId"] == 36)
                {
                    item["prizeQuantity"] = -Convert.ToInt32(item["quantity"]);
                    item["prizeAmount"] = -Convert.ToDecimal(item["price"]);
                    item["SaleAmount"] = 0;
                    item["GoodsPrice"] = 0;
                    item["SaleType"] = "2";
                }


                item["BranchCode"] = item["centerId"];
                item["BranchName"] = item["centerName"];
                item["CustomerCode"] = item["customerId"];
                item["CustomerName"] = item["customerName"];
                item["BillNo"] = item["factorId"];
                
                item["GoodsCode"] = item["productId"];
                item["GoodsName"] = item["productName"];
                
                item["CustomerAddress"] = item["address"];
                
                item["CustomerGln"] = item["gln"];
                item["CustomerTel"] = item["customerTel"];
                item["BatchNo"] = item["batchNumber"];
                item["ExpireDate"] = item["expireDate"];

                item["CityID"] = item["cityId"];
                item["CityName"] = item["cityName"];
                item["RecordType"] = item["recordType"];
                item["CustomerHIX"] = item["hix"];
                item["CustomerGroup"] = item["customerType"];
                item["Lat"] = item["lat"];
                item["Long"] = item["long"];
                item["RegionalMunicipality"] = item["regionalMunicipality"];
                item["IsPrize"] = item["isPrize"];
                
                
                item["visitorId"] = item["visitorId"];
                item["visitorName"] = item["visitorName"];
                item["inventoryCode"] = item["inventoryCode"];
                item["inventoryName"] = item["inventoryName"];                
            }
            return dataArray;
        }
        private string GetDistributorSaleData(string url, string userName, string password)
        {            

            try
            {
                // ایجاد فرم دیتا
                var formData = new MultipartFormDataContent();
                formData.Add(new StringContent(userName), "UserName");
                formData.Add(new StringContent(password), "Password");
                formData.Add(new StringContent(dates[dates.Length - 1]), "FromDate");
                //formData.Add(new StringContent("2024-03-20"), "FromDate");
                formData.Add(new StringContent(dates[0]), "ToDate");
                //formData.Add(new StringContent("2025-02-25"), "ToDate");

                // ارسال درخواست POST
                var response = client.PostAsync(url, formData).Result;

                // بررسی پاسخ
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
                // مدیریت خطا
                return $"{{\"exception\":\"{ex.Message}\"}}";
            }
        }
        private string GetDistributorStockData(string url, string userName, string password, string toDate)
        {

            try
            {
                // ایجاد فرم دیتا
                var formData = new MultipartFormDataContent();
                formData.Add(new StringContent(userName), "UserName");
                formData.Add(new StringContent(password), "Password");
                formData.Add(new StringContent(toDate), "reportDate");

                // ارسال درخواست POST
                var response = client.PostAsync(url, formData).Result;

                // بررسی پاسخ
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
                // مدیریت خطا
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
        //public string[] IsoToPersianDateArray(string dateValue) {           
        //        DateTime dateTime = DateTime.ParseExact(dateValue, "yyyy-MM-ddTHH:mm:ss", CultureInfo.InvariantCulture);
        //        PersianCalendar persianCalendar = new PersianCalendar();
        //        string year = persianCalendar.GetYear(dateTime).ToString("0000");
        //        string month = persianCalendar.GetMonth(dateTime).ToString("00");
        //        string day = persianCalendar.GetDayOfMonth(dateTime).ToString("00");
        //        return new string[] { day, month, year };

        //}
        public string[] IsoToPersianDateArray(string dateValue)
        {
            // Adjust the format string to match "1/9/2025 12:00:00 AM"
            DateTime dateTime = DateTime.ParseExact(dateValue, "MM/dd/yyyy hh:mm:ss", CultureInfo.InvariantCulture);

            PersianCalendar persianCalendar = new PersianCalendar();
            string year = persianCalendar.GetYear(dateTime).ToString("0000");
            string month = persianCalendar.GetMonth(dateTime).ToString("00");
            string day = persianCalendar.GetDayOfMonth(dateTime).ToString("00");

            return new string[] { day, month, year };
        }

        public static string GenerateUniqueCodeSale(
            string distId,
            string companyId,
            string factorDate,
            string factorId,
            string recordTypeId,
            string customerId,
            string productId,
            string price,
            string quantity,
            string gln
            )
        {
            string data = $"{distId}|{companyId}|{factorDate}|{factorId}|{recordTypeId}|{customerId}|{productId}|{price}|{quantity}|{gln}";
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
            string productId,
            string inventoryQty,
            string inventoryPrice,
            string centerId,
            string inventoryCode

            )
        {
            string data = $"{distId}|{companyId}|{date}|{productId}|{inventoryPrice}|{inventoryQty}|{centerId}|{inventoryCode}";
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

    }
}

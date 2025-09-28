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
using System.Text.RegularExpressions;
using System.Diagnostics;

namespace Web_Services.controller
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class shafaArad : System.Web.Services.WebService
    {
        private static readonly HttpClient client = new HttpClient();
        private int distId = 3;
        double taxRate = 1.10;
        //private string fromDate = "1403/07/01";
        //private string toDate = "1403/07/29";
        private string urlSale = "https://webservicessupplier.shafaarad.com:9090/api/NewService/ServicesGetSuppliersClubSaleData";
        private string urlStock = "https://webservicessupplier.shafaarad.com:9090/api/NewService/ServicesGetSuppliersClubReportRemain";
        private static config configInstance = new config("/");
        private string[] dates = configInstance.GetValue();
        [WebMethod]
        public void Sale_taminDarou()
        {
            var userName = "tamindarou";
            var passWord = "Tamindarou@2023";
            var companyId = 4;
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
            var userName = "paktamin";
            var passWord = "Pak@2023";
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
        public void Sale_taminPharmed()
        {
            var userName = "taminpharmed";
            var passWord = "Taminpharmed@2023";
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
        public void Sale_rastaImen()
        {
            var userName = "rastadarou";
            var passWord = "Rasta@2023";
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
        [WebMethod]
        public void Sale_taminShafa()
        {
            var userName = "shafapars";
            var passWord = "ShafaPars@2023";
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
        
        /// ////////////////////////////////////////////////////////////////////////////////
        [WebMethod]
        public void Stock_taminDarou()
        {
            var userName = "tamindarou";
            var passWord = "Tamindarou@2023";
            var companyId = 4;
            foreach (string date in dates)
            {
                JArray dataArray;
                int logId = repository.updateServiceLog(distId, companyId, 1, "پخش", "سیستمی",2, date.Replace("/", ""), date.Replace("/", ""), 0, 0, 0);
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
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- tamin darou(shafaArad) -------: {date}");
            }

        }
        [WebMethod]
        public void Stock_pakSalamat()
        {
            var userName = "paktamin";
            var passWord = "Pak@2023";
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
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- pak(shafaArad) -------: {date}");
            }
        }

        [WebMethod]
        public void Stock_taminPharmed()
        {
            var userName = "taminpharmed";
            var passWord = "Taminpharmed@2023";
            var companyId = 2;
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
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- pharmed(shafaArad) -------: {date}");
            }
        }

        [WebMethod]
        public void Stock_rastaImen()
        {
            var userName = "rastadarou";
            var passWord = "Rasta@2023";
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
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- rasta(shafaArad) -------: {date}");
            }
        }
        [WebMethod]
        public void Stock_taminShafa()
        {
            var userName = "shafapars";
            var passWord = "ShafaPars@2023";
            var companyId = 5;
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
                    validateStockData(dataArray, distId, companyId);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- tamin shafa(shafaArad) -------: {date}");
            }
        }
        /// ////////////////////////////////////////////////////////////////////////////////
        private dynamic validateStockData(dynamic dataArray, int distId, int companyId)
        {
            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateString(item["Date"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];
                //item["SuplierName"] = item["ProviderName"];
                //item["BillShamsiDate"] = item["Date"];
                item["GoodsCode"] = item["ProductCode"];
                item["GoodsName"] = item["ProductName"];
                item["CountOfStock"] = item["InventoryQty"];
                item["AmountOfStock"] = item["InventoryPrice"];
                Debug.WriteLine($"Expire Date: {item["ExpireDate"]}");
                //item["LastBuyPrice"] = item["BuyFee"];
                item["ExpireDate"] = (String)item["ExpireDate"];
                string[] expDateArray = ConvertMiladiToPersian(item["ExpireDate"]?.ToString());
                item["expYear"] = expDateArray[0];
                item["expMonth"] = expDateArray[1];
                item["expDay"] = expDateArray[2];
                Debug.WriteLine($"Expire Date: {item["ExpireDate"]}, Converted: {item["expYear"]}/{item["expMonth"]}/{item["expDay"]}");
                item["BranchCode"] = item["CenterId"];
                item["BranchName"] = item["CenterName"];
                //item["InventoryPrice"] = item["InventoryPrice"];
                item["BatchNumber"] = item["BatchNumber"];
                item["OnWayQty"] = item["OnWayQty"];
                item["ProductId"] = item["ProductId"];
                item["p1"] = item["BuyFee"];


            }
            return dataArray;
        }
        private dynamic validateSaleData(dynamic dataArray, int distId, int companyId)
        {


            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateArray(item["InvoiceDate"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];
             
                item["SaleAmount"] = item["quantity"];
                //item["GoodsPrice"] = Convert.ToDecimal(item["quantity"]) * Math.Abs(Convert.ToDecimal(item["PriceTax"]));
                item["GoodsPrice"] = Convert.ToDecimal(item["quantity"]) * Math.Abs(Convert.ToDecimal(item["PriceTax"]));


                item["BranchCode"] = item["CenterID"];
                item["BranchName"] = item["CenterName"];
                item["CustomerCode"] = item["CustomerCode"];
                item["CustomerName"] = item["CustomerName"];
                item["SaleType"] = item["RecordTypeID"];
                item["BillNo"] = item["InvoiceNumber"];

                item["GoodsCode"] = item["ProductCode"];
                item["GoodsName"] = item["ProductName"];
                item["CustomerAddress"] = item["Address"];
                item["CustomerState"] = item["CityName"];
                item["CustomerGln"] = item["GLN"];
                item["CustomerTel"] = item["CustomerTel"];
                item["BatchNo"] = item["BatchNumber"];
                item["ExpireDate"] = item["ExpireDate"];
                item["CityID"] = item["CityId"];
                item["RecordType"] = item["RecordType"];
                item["CustomerId"] = item["CustomerId"];

                item["p1"] = item["Price"];
                item["p2"] = Math.Abs(Convert.ToDecimal(item["PriceTax"]));
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
            //jsonData = new
            //{
            //    UserName = userName,
            //    Password = password,
            //    FromDate = "1403/10/01",
            //    ToDate = "1403/10/10"
            //};

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
                ActionDate = toDate
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
        public static string[] ConvertMiladiToPersian(string dateValue)
        {
            try
            {
                // تبدیل رشته به DateTime با فرمت MM/dd/yyyy HH:mm:ss
                DateTime miladiDate = DateTime.ParseExact(dateValue, "MM/dd/yyyy HH:mm:ss", CultureInfo.InvariantCulture);

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
  
    public string[] ConvertToPersianDateArray(string gregorianDate)
        {
            DateTime dateTime = DateTime.ParseExact(gregorianDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            PersianCalendar persianCalendar = new PersianCalendar();
            string year = persianCalendar.GetYear(dateTime).ToString("0000");
            string month = persianCalendar.GetMonth(dateTime).ToString("00");
            string day = persianCalendar.GetDayOfMonth(dateTime).ToString("00");
            return new string[] { day, month, year };
        }
        //public string[] ConvertToPersianDateString(string gregorianDate)
        //{
        //    DateTime date = DateTime.ParseExact(gregorianDate, "MMM dd yyyy hh:mmtt", CultureInfo.InvariantCulture);
        //    PersianCalendar persianCalendar = new PersianCalendar();
        //    string year = persianCalendar.GetYear(date).ToString("0000");
        //    string month = persianCalendar.GetMonth(date).ToString("00");
        //    string day = persianCalendar.GetDayOfMonth(date).ToString("00");            

        //    return new string[] { day, month, year };
        //}
        public string[] ConvertToPersianDateString(string gregorianDate)
        {
            // Normalize spaces in the input string
            gregorianDate = Regex.Replace(gregorianDate, @"\s+", " ");

            DateTime date = DateTime.ParseExact(gregorianDate, "MMM d yyyy hh:mmtt", CultureInfo.InvariantCulture);

            PersianCalendar persianCalendar = new PersianCalendar();
            string year = persianCalendar.GetYear(date).ToString("0000");
            string month = persianCalendar.GetMonth(date).ToString("00");
            string day = persianCalendar.GetDayOfMonth(date).ToString("00");

            return new string[] { day, month, year };
        }
        public static string GenerateUniqueCodeSale(
            string distId,
            string companyId,
            string BillNo,
            string SaleAmount,
            string GoodsPrice,
            string SaleType,
            string CustomerCode,
            string ProductId,
            string CustomerGln)
        {

            string data = $"{distId}|{companyId}|{BillNo}|{SaleAmount}|{GoodsPrice}|{SaleType}|{CustomerCode}|{ProductId}|{CustomerGln}";
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
            string Date,
            string CenterId,
            string ProductId,
            string ProductCode,
            string BatchNumber
            )
        {
            string data = $"{distId}|{companyId}|{Date}|{CenterId}|{ProductId}|{ProductCode}|{BatchNumber}";
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

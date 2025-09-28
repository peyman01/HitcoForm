using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Services;
using Web_Services.DataAccess;

namespace Web_Services.controller
{
    /// <summary>
    /// Summary description for Barij
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class Barij : System.Web.Services.WebService
    {

        private static readonly HttpClient client = new HttpClient();
        private int distId = 14;
        private string urlSale = "http://91.92.186.30:7070/api/TaminKonandeh/GetForoshFaktorTaminKonandeh";
        private string urlStock = "http://91.92.186.30:7070/api/TaminKonandeh/GetMojodiKalaTaminKonandeh";
        private static config configInstance = new config("");
        private string[] dates = configInstance.GetValue();

        [WebMethod]
        public void Sale_pakSalamat()
        {
            var userName = "paksalamattamin";
            var passWord = "123456";
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
            var userName = "rastaimendaru";
            var passWord = "123456";
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
        [WebMethod]
        public void Sale_taminPharmed()
        {
            var userName = "taminpharmedte";
            var passWord = "123456";
            var companyId = 2;
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
        public void Sale_taminShafa()
        {
            var userName = "taminshafapars";
            var passWord = "123456";
            var companyId = 5;
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
            var userName = "paksalamattamin";
            var passWord = "123456";
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
                    Debug.WriteLine($"/////////////////////////////////////paksalamat(barij)///////////////////////: {date}");

                }

                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId, date);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- pak (barij) -------: {date}");
            }
        }
        [WebMethod]
        public void Stock_rastaImen()
        {
            var userName = "rastaimendaru";
            var passWord = "123456";
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
                    Debug.WriteLine($"/////////////////////////////////////paksalamat(barij)///////////////////////: {date}");

                }

                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId, date);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- pak (barij) -------: {date}");
            }
        }
        [WebMethod]
        public void Stock_taminPharmed()
        {
            var userName = "taminpharmedte";
            var passWord = "123456";
            var companyId = 2;

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
                    Debug.WriteLine($"/////////////////////////////////////paksalamat(barij)///////////////////////: {date}");

                }

                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId, date);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- pak (barij) -------: {date}");
            }
        }
        [WebMethod]
        public void Stock_taminShafa()
        {
            var userName = "taminshafapars";
            var passWord = "123456";
            var companyId = 5;

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
                    Debug.WriteLine($"/////////////////////////////////////paksalamat(barij)///////////////////////: {date}");

                }

                if (dataArray != null)
                {
                    validateStockData(dataArray, distId, companyId, date);
                    repository.saveStock(dataArray, distId, companyId, logId);
                }
                Debug.WriteLine($"Processed----------- pak (barij) -------: {date}");
            }
        }
        
        private dynamic validateSaleData(dynamic dataArray, int distId, int companyId)
        {
            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateArray(item["TarikhFaktor"]?.ToString());
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];

                item["BranchCode"] = item["ccMarkazPakhsh"];
                item["BranchName"] = item["NameMarkazPakhsh"];
                item["CustomerCode"] = item["CodeMoshtaryOld"];
                item["CustomerName"] = item["NameMoshtary"];                
                item["GoodsCode"] = item["CodeKalaOld"];
                item["GoodsName"] = item["NameKala"];
                item["CustomerAddress"] = item["Address"];
                item["CustomerGln"] = item["GlnMoshtary"];                
                item["CustomerTel"] = item["TelephoneMoshtary"];

                item["CustomerState"] = item["NameOstan"];
                item["CustomerEconomic"] = item["CodeEghtesady"];
                item["NationalCode"] = item["ShenasehMeli"];
                item["Lat"] = item["X"];
                item["Long"] = item["y"];
                item["CityName"] = item["NameShahr"];
                item["CityID"] = item["ccShahr"];
                item["StateId"] = item["ccOstan"];
                item["GoodsGeneric"] = item["CodeJenerik"];
                item["CustomerGroup"] = item["GorohMoshtary"];
                item["visitorName"] = item["SharhForoshandeh"];
                item["visitorId"] = item["CodeForoshandeh"];
                item["p1"] = Convert.ToDecimal(item["GheymatKharid"]);
                item["p2"] = Convert.ToDecimal(item["GheymatForosh"]);
                item["p3"] = item["GheymatMasrafKonandeh"] != null? Convert.ToDecimal(item["GheymatMasrafKonandeh"]): 0;
                item["ghatiAmaniDesc"] = item["GhatiAmani"];
                if (item["GhatiAmani"] == "اماني") { 
                    item["ghatiAmaniCode"] = 1;                
                }


                if (Convert.ToInt32(item["TedadForosh"]) > 0) {                    
                    item["SaleType"] = 1;
                    item["SaleAmount"] = Convert.ToInt32(item["TedadForosh"]);
                    item["GoodsPrice"] = Convert.ToDecimal(item["MablaghForoshkhales"]);                    
                    if (Convert.ToInt32(item["MarjoeeTedadi"]) > 0) {                         
                        item["SaleType"] = 2;
                        item["SaleAmount"] = -Convert.ToInt32(item["TedadForosh"]);
                        item["GoodsPrice"] = -Convert.ToDecimal(item["MablaghForoshkhales"]);
                    }                                   
                }
                if (Convert.ToInt32(item["TedadJayezeh"]) > 0)
                {
                    item["SaleType"] = 3;
                    item["IsPrize"] = 1;
                    item["prizeAmount"] = Convert.ToInt32(item["RialJayezeh"]);
                    item["prizeQuantity"] = Convert.ToInt32(item["TedadJayezeh"]);
                }                   

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

                item["GoodsCode"] = item["CodeKalaOld"];
                item["GoodsName"] = item["NameKala"];

                item["CountOfStock"] = item["Mojody"];
                item["AmountOfStock"] = item["MojodyRial"];
                item["OnWayQty"] = item["BeyneRahiTedad"];
                item["IRC"] = item["IranCode"];
                item["GTIN"] = item["codegtin"];

                item["BatchNumber"] = item["ShomarehBach"];
                string[] expPersianDateArray = IsoToPersianDateArray((String)item["TarikhEngheza"]);
                item["expDay"] = expPersianDateArray[0];
                item["expMonth"] = expPersianDateArray[1];
                item["expYear"] = expPersianDateArray[2];


            }
            return dataArray;
        }
        private string GetDistributorSaleData(string url, string userName, string password)
        {            
            url = url + "?AzTarikh=" + dates[dates.Length - 1] + "&TaTarikh=" + dates[0] + "&MarkazId=0" + "&UserName=" + userName + "&Password=" + password;         
            
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
            url = url + "?Username=" + userName + "&Password=" + password + "&TaTarikh=" + toDate;
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

        public string[] IsoToPersianDateArray(string dateValue)
        {
            DateTime dateTime = DateTime.ParseExact(dateValue, "MM/dd/yyyy HH:mm:ss", CultureInfo.InvariantCulture);
            PersianCalendar persianCalendar = new PersianCalendar();
            string year = persianCalendar.GetYear(dateTime).ToString("0000");
            string month = persianCalendar.GetMonth(dateTime).ToString("00");
            string day = persianCalendar.GetDayOfMonth(dateTime).ToString("00");
            return new string[] { day, month, year };

        }

    }
}

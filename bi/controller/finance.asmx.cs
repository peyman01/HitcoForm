using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.ComponentModel.Design;
using System.Configuration;
using System.Configuration.Provider;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Web.Services;
using System.Xml.Linq;
using Web_Services.DataAccess;

namespace Web_Services.controller
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class Finance : System.Web.Services.WebService
    {
        private int distId = 0;
        private string curentDate = repository.GetCurrentPersianDate();
        [WebMethod]
        public void Sale_zhoubin()
        {
            var companyName = "ZHM";
            syncProductList(companyName, "sepidar");
            syncCustomerList(companyName, "sepidar");
            syncInvoiceList(companyName, 0, "sepidar");
            syncInvoiceList(companyName, 1, "sepidar");
            syncSaleList(companyName, 0, "sepidar");
            syncSaleList(companyName, 1, "sepidar");
            syncStoreList(companyName, "sepidar");
            syncStockList(companyName, "sepidar");
            syncFinanceBalanceList(companyName, "sepidar");
            syncFinanceReceivableNote(companyName, "sepidar");
            syncFinanceVoucherItem(companyName, "sepidar");
            syncFinancePayableNote(companyName, "sepidar");
            //  syncFinancePayableNote(companyName, "sepidar");
            //      syncFinanceBalanceList(companyName, "sepidar");
            //      syncFinanceVoucherItem(companyName, "sepidar");

        }
        [WebMethod]
        public void Sale_aradCo()
        {
            var companyName = "ACP";
            syncProductList(companyName, "sepidar");
            syncCustomerList(companyName, "sepidar");
            syncInvoiceList(companyName, 0, "sepidar");
            syncInvoiceList(companyName, 1, "sepidar");
            syncSaleList(companyName, 0, "sepidar");
            syncSaleList(companyName, 1, "sepidar");
            syncStoreList(companyName, "sepidar");
            syncStockList(companyName, "sepidar");
            syncFinanceBalanceList(companyName, "sepidar");
            syncFinanceReceivableNote(companyName, "sepidar");
            syncFinanceVoucherItem(companyName, "sepidar");
            syncFinancePayableNote(companyName, "sepidar");
            //  syncFinancePayableNote(companyName, "sepidar");
            //      syncFinanceBalanceList(companyName, "sepidar");
            //      syncFinanceVoucherItem(companyName, "sepidar");

        }
        [WebMethod]
        public void Sale_ariaPharmed()
        {
            var companyName = "APS";
            syncProductList(companyName, "sepidar");
            syncCustomerList(companyName, "sepidar");
            syncInvoiceList(companyName, 0, "sepidar");
            syncInvoiceList(companyName, 1, "sepidar");
            syncSaleList(companyName, 0, "sepidar");
            syncSaleList(companyName, 1, "sepidar");
            syncStoreList(companyName, "sepidar");
            syncStockList(companyName, "sepidar");
            syncFinanceBalanceList(companyName, "sepidar");
            syncFinanceReceivableNote(companyName, "sepidar");
            syncFinanceVoucherItem(companyName, "sepidar");
            syncFinancePayableNote(companyName, "sepidar");
            //      syncFinanceBalanceList(companyName, "sepidar");
            //      syncFinanceVoucherItem(companyName, "sepidar");

        }
        [WebMethod]
        public void testt()
        {
            //syncFinanceReceivableNote("TDT");
          //  syncFinanceReceivableNote("TPT");
//syncFinanceReceivableNote("PST");
           // syncFinanceReceivableNote("TSP");
           // syncFinanceReceivableNote("RID");
           // syncFinanceVoucherItem("TDT");
            //syncFinancePayableNote("TDT");

        }
        [WebMethod]
        public void Sale_taminDarou()
        {
            var companyName = "TDT";
            syncProductList(companyName);
            syncStoreList(companyName);
            syncPartList(companyName);
            syncCustomerList(companyName);
            syncInvoiceList(companyName, 0);
            syncInvoiceList(companyName, 1);
            syncSaleList(companyName, 0);
            syncSaleList(companyName, 1);
            syncStockList(companyName);
            syncSaleOfficeList(companyName);
            syncFinanceBalanceList(companyName);
            syncFinanceReceivableNote(companyName);
            syncFinanceVoucherItem(companyName);
            syncFinancePayableNote(companyName);


        }
        [WebMethod]
        public void Sale_taminShafa()
        {
            var companyName = "TSP";
            syncProductList(companyName);
            syncStoreList(companyName);
            syncPartList(companyName);
            syncCustomerList(companyName);
            syncInvoiceList(companyName, 0);
            syncInvoiceList(companyName, 1);
            syncSaleList(companyName, 0);
            syncSaleList(companyName, 1);
            syncStockList(companyName);
            syncSaleOfficeList(companyName);
            syncFinanceBalanceList(companyName);
            syncFinanceReceivableNote(companyName);
            syncFinanceVoucherItem(companyName);
            syncFinancePayableNote(companyName);
        }
        [WebMethod]
        public void Sale_pakSalamat()
        {
            var companyName = "PST";
            syncProductList(companyName);
            syncStoreList(companyName);
            syncPartList(companyName);
            syncCustomerList(companyName);
            syncInvoiceList(companyName, 0);
            syncInvoiceList(companyName, 1);
            syncSaleList(companyName, 0);
            syncSaleList(companyName, 1);
            syncStockList(companyName);
            syncSaleOfficeList(companyName);
            syncFinanceBalanceList(companyName);
            syncFinanceReceivableNote(companyName);
            syncFinanceVoucherItem(companyName);
            syncFinancePayableNote(companyName);
        }
        [WebMethod]
        public void Sale_taminPharmed()
        {
            var companyName = "TPT";
            syncProductList(companyName);
            syncStoreList(companyName);
            syncPartList(companyName);
            syncCustomerList(companyName);
            syncInvoiceList(companyName, 0);
            syncInvoiceList(companyName, 1);
            syncSaleList(companyName, 0);
            syncSaleList(companyName, 1);
            syncStockList(companyName);
            syncSaleOfficeList(companyName);
            syncFinanceBalanceList(companyName);
            syncFinanceReceivableNote(companyName);
            syncFinanceVoucherItem(companyName);
            syncFinancePayableNote(companyName);
        }
        [WebMethod]
        public void Sale_rastaImen()
        {
            var companyName = "RID";
            syncProductList(companyName);
            syncStoreList(companyName);
            syncPartList(companyName);
            syncCustomerList(companyName);
            syncInvoiceList(companyName, 0);
            syncInvoiceList(companyName, 1);
            syncSaleList(companyName, 0);
            syncSaleList(companyName, 1);
            syncStockList(companyName);
            syncSaleOfficeList(companyName);
            syncFinanceBalanceList(companyName);
            syncFinanceReceivableNote(companyName);
            syncFinanceVoucherItem(companyName);
            syncFinancePayableNote(companyName);
        }
        [WebMethod]
        public void Sale_hitco()
        {
            var companyName = "HIT";
            syncProductList(companyName);
            syncStoreList(companyName);
            syncPartList(companyName);
            syncCustomerList(companyName);
            syncInvoiceList(companyName, 0);
            syncInvoiceList(companyName, 1);
            syncSaleList(companyName, 0);
            syncSaleList(companyName, 1);
            syncStockList(companyName);
            syncSaleOfficeList(companyName);
            syncFinanceBalanceList(companyName);
            syncFinanceReceivableNote(companyName);
            syncFinanceVoucherItem(companyName);
            syncFinancePayableNote(companyName);
        }

        [WebMethod]
        public void syncProductList(string companyName, string system = "rahkaran")
        {
            dynamic companyInfo = JArray.Parse(repository.GetCompanyInfo(companyName));
            var companyId = companyInfo[0]["companyID"].ToString();
            var lastProduct = JArray.Parse(repository.GetMaxProductData(companyName));
            var maxProductId = lastProduct[0]["maxProductId"].ToString();
            var lastModificationDate = lastProduct[0]["lastModificationDate"].ToString();
            dynamic productData = new JArray();
            if (system == "sepidar")
            {
                string response = repository.getSepidarProductList(companyName, maxProductId, lastModificationDate);
                productData = JArray.Parse(response);

            }
            if (system == "rahkaran")
            {
                string response = repository.getRahkaranProductList(companyName, maxProductId, lastModificationDate);
                productData = JArray.Parse(response);
            }
            repository.syncRahkaranProductList(productData, companyId);
        }
        [WebMethod]
        public void syncStoreList(string companyName, string system = "rahkaran")
        {
            dynamic companyInfo = JArray.Parse(repository.GetCompanyInfo(companyName));
            var companyId = companyInfo[0]["companyID"].ToString();
            dynamic storeData = new JArray();
            if (system == "sepidar")
            {
                string response = repository.getSepidarStoreList(companyName);
                storeData = JArray.Parse(response);

            }
            if (system == "rahkaran")
            {
                string response = repository.getRahkaranStoreList(companyName);
                storeData = JArray.Parse(response);
            }
            repository.syncRahkaranStoreList(storeData, companyId);
        }
        [WebMethod]
        public void syncSaleOfficeList(string companyName, string system = "rahkaran")
        {
            dynamic companyInfo = JArray.Parse(repository.GetCompanyInfo(companyName));
            var companyId = companyInfo[0]["companyID"].ToString();
            dynamic storeData = new JArray();
            if (system == "sepidar")
            {
                //string response = repository.getSepidarProductList(companyName, maxProductId, lastModificationDate);
                //productData = JArray.Parse(response);

            }
            if (system == "rahkaran")
            {
                string response = repository.getRahkaranSaleOfficeList(companyName);
                storeData = response;
            }
            repository.syncRahkaranSaleOfficeList(storeData, companyId);
        }
        [WebMethod]
        public void syncFinanceReceivableNote(string companyName, string system = "rahkaran")
        {
            dynamic companyInfo = JArray.Parse(repository.GetCompanyInfo(companyName));
            var companyId = companyInfo[0]["companyID"].ToString();
            dynamic noteData = new JArray();
            if (system == "sepidar")
            {
                string response = repository.getSepidarReceivableNote(companyName);
                noteData = response;

            }
            if (system == "rahkaran")
            {
                //string response = repository.getRahkaranSaleOfficeList(companyName);
                string response = repository.getRahkaranReceivableNote(companyName);
                noteData = response;
            }
            //repository.syncRahkaranSaleOfficeList(storeData, companyId);
            repository.syncRahkaranReceivableNote(noteData, companyId);            
        }
        [WebMethod]
        public void syncFinancePayableNote(string companyName, string system = "rahkaran")
        {
            dynamic companyInfo = JArray.Parse(repository.GetCompanyInfo(companyName));
            var companyId = companyInfo[0]["companyID"].ToString();
            dynamic noteData = new JArray();
            if (system == "sepidar")
            {
                //string response = repository.getSepidarProductList(companyName, maxProductId, lastModificationDate);
                //productData = JArray.Parse(response);
                string response = repository.getSepidarPayableNote(companyName);
                noteData = response;
            }
            if (system == "rahkaran")
            {
                //string response = repository.getRahkaranSaleOfficeList(companyName);
                string response = repository.getRahkaranPayableNote(companyName);
                noteData = response;
            }
            //repository.syncRahkaranSaleOfficeList(storeData, companyId);
            repository.syncRahkaranPayableNote(noteData, companyId);            
        }
        [WebMethod]
        public void syncFinanceVoucherItem(string companyName, string system = "rahkaran")
        {
            dynamic companyInfo = JArray.Parse(repository.GetCompanyInfo(companyName));
            var companyId = companyInfo[0]["companyID"].ToString();
            dynamic balanceData = new JArray();
            if (system == "sepidar")
            {
                string response = repository.getSepidarVoucherItem(companyName);
                balanceData = response;

            }
            if (system == "rahkaran")
            {
                //string response = repository.getRahkaranSaleOfficeList(companyName);
                string response = repository.getRahkaranVoucherItem(companyName);
                balanceData = response;
            }
            //repository.syncRahkaranSaleOfficeList(storeData, companyId);
            repository.syncRahkaranVoucherItem(balanceData, companyId);            
        }
        [WebMethod]
        public void syncFinanceBalanceList(string companyName, string system = "rahkaran")
        {
            dynamic companyInfo = JArray.Parse(repository.GetCompanyInfo(companyName));
            var companyId = companyInfo[0]["companyID"].ToString();
            dynamic balanceData = new JArray();
            if (system == "sepidar")
            {
                string response = repository.getSepidarFinanceBalanceList(companyName);
                balanceData = response;

            }
            if (system == "rahkaran")
            {
                //string response = repository.getRahkaranSaleOfficeList(companyName);
                string response = repository.getRahkaranFinanceBalanceList(companyName);
                balanceData = response;
            }
            //repository.syncRahkaranSaleOfficeList(storeData, companyId);
            repository.syncRahkaranBalanceList(balanceData, companyId);
        }
        [WebMethod]
        public void syncPartList(string companyName, string system = "rahkaran")
        {
            dynamic companyInfo = JArray.Parse(repository.GetCompanyInfo(companyName));
            var companyId = companyInfo[0]["companyID"].ToString();
            var lastPart = JArray.Parse(repository.GetMaxPartData(companyName));
            var maxPartId = lastPart[0]["maxPartId"].ToString();
            var lastModificationDate = lastPart[0]["lastModificationDate"].ToString();
            dynamic partData = new JArray();
            if (system == "sepidar")
            {
                //string response = repository.getSepidarProductList(companyName, maxProductId, lastModificationDate);
                //productData = JArray.Parse(response);

            }
            if (system == "rahkaran")
            {
                string response = repository.getRahkaranPartList(companyName, maxPartId, lastModificationDate);
                partData = JArray.Parse(response);
            }
            repository.syncRahkaranPartList(partData, companyId);
        }
        [WebMethod]
        public void syncCustomerList(string companyName, string system = "rahkaran")
        {
            dynamic companyInfo = JArray.Parse(repository.GetCompanyInfo(companyName));
            var companyId = companyInfo[0]["companyID"].ToString();

            var lastCustomer = JArray.Parse(repository.GetMaxCustomerData(companyName));
            var maxPartyId = lastCustomer[0]["maxPartyId"].ToString();
            var lastModificationDate = lastCustomer[0]["lastModificationDate"].ToString();

            dynamic customerData = new JArray();
            if (system == "sepidar")
            {
                string response = repository.getSepidarCustomerList(companyName, maxPartyId, lastModificationDate);
                customerData = JArray.Parse(response);
            }
            if (system == "rahkaran")
            {
                string response = repository.getRahkaranCustomerList(companyName, maxPartyId, lastModificationDate);
                customerData = JArray.Parse(response);
            }
            repository.syncRahkaranCustomerList(customerData, companyId);
        }
        [WebMethod]
        public void syncInvoiceList(string companyName, int isReturned, string system = "rahkaran")
        {
            dynamic companyInfo = JArray.Parse(repository.GetCompanyInfo(companyName));
            var companyId = companyInfo[0]["companyID"].ToString();

            var lastInvoice = JArray.Parse(repository.GetMaxInvoiceData(companyName, isReturned));
            var maxInvoiceId = lastInvoice[0]["maxInvoiceId"].ToString();
            var lastModificationDate = lastInvoice[0]["lastModificationDate"].ToString();
            string response = "";
            if (isReturned == 0)
            {
                if (system == "rahkaran")
                {
                    response = repository.getRahkaranInvoiceList(companyName, maxInvoiceId, lastModificationDate);
                }
                if (system == "sepidar")
                {
                    response = repository.getSepidarInvoiceList(companyName, maxInvoiceId, lastModificationDate);
                }

            }
            if (isReturned == 1)
            {
                if (system == "rahkaran")
                {
                    response = repository.getRahkaranInvoiceListReturn(companyName, maxInvoiceId, lastModificationDate);
                }
                if (system == "sepidar")
                {
                    response = repository.getSepidarInvoiceListReturn(companyName, maxInvoiceId, lastModificationDate);
                }

            }

            dynamic invoiceData = JArray.Parse(response);
            repository.syncRahkaranInvoiceList(invoiceData, companyId, isReturned);
        }
        [WebMethod]
        public void syncSaleList(string companyName, int isReturned, string system = "rahkaran")
        {

            dynamic companyInfo = JArray.Parse(repository.GetCompanyInfo(companyName));
            var companyId = Convert.ToInt32(companyInfo[0]["companyID"]);
            var saleType = 0;
            if (isReturned == 0)
            {
                saleType = 1;
            }
            if (isReturned == 1)
            {
                saleType = 2;
            }
            var lastInvoiceItem = JArray.Parse(repository.GetMaxInvoiceItemData(companyName, isReturned, saleType));
            var maxInvoiceItemId = lastInvoiceItem[0]["maxInvoiceItemId"].ToString();
            var lastModificationDate = lastInvoiceItem[0]["lastModificationDate"].ToString();

            int logId = repository.updateServiceLog(distId, companyId, 0, "مالی", "سیستمی", 1, "14030101", curentDate, 0, 0, 0);
            dynamic invoiceData="";
            if (isReturned == 0)
            {
                dynamic invoiceItemData = new JArray();
                string response = "";
                if (system == "sepidar")
                {
                    response = repository.getSepidarSale(companyName, maxInvoiceItemId, lastModificationDate);

                }
                if (system == "rahkaran")
                {
                    response = repository.getRahkaranSale(companyName, maxInvoiceItemId, lastModificationDate);

                }
                invoiceItemData = JArray.Parse(response);
                invoiceData = validateSaleData(invoiceItemData, distId, companyId, saleType);
            }
            if (isReturned == 1)
            {
                dynamic invoiceItemDataReturn = new JArray();
                string responseReturn = "";
                if (system == "sepidar")
                {
                    responseReturn = repository.getSepidarSaleReturn(companyName, maxInvoiceItemId, lastModificationDate);

                }
                if (system == "rahkaran")
                {
                    responseReturn = repository.getRahkaranSaleReturn(companyName, maxInvoiceItemId, lastModificationDate);

                }
                invoiceItemDataReturn = JArray.Parse(responseReturn);
                invoiceData = validateSaleData(invoiceItemDataReturn, distId, companyId, saleType);

            }
                repository.saveSaleFinance(invoiceData, distId, companyId, logId, curentDate, saleType);

        }
        [WebMethod]
        public void syncStockList(string companyName, string system = "rahkaran")
        {

            dynamic companyInfo = JArray.Parse(repository.GetCompanyInfo(companyName));
            var companyId = Convert.ToInt32(companyInfo[0]["companyID"]);
            //int logId = repository.updateServiceLog(distId, companyId, 0, "مالی", "سیستمی", 1, "14030101", curentDate, 0, 0, 0);
            dynamic stockData = new JArray();
            string response = "";
            if (system == "sepidar")
            {
                response = repository.getSepidarStock(companyName);

            }
            if (system == "rahkaran")
            {
                response = repository.getRahkaranStock(companyName);

            }
            
            stockData = JArray.Parse(response);

            //dynamic invoiceItemDataValidated = validateSaleData(stockData, distId, companyId, 1);
            repository.saveStockFinance(stockData, companyId, curentDate);

        }

        private dynamic validateSaleData(dynamic dataArray, int distId, int companyId, int saleType)
        {

            foreach (var item in dataArray)
            {
                string[] persianDateArray = ConvertToPersianDateArray((string)item["date"]);
                //string[] persianDateArray = ConvertToPersianDateArray("2024-11-24T00:00:00");
                item["day"] = persianDateArray[0];
                item["month"] = persianDateArray[1];
                item["year"] = persianDateArray[2];


                item["SaleType"] = saleType;
                item["ProductId"] = item["ProductId"];
                item["InvoiceItemID"] = item["InvoiceItemID"];
                item["InvoiceRef"] = item["InvoiceRef"];
                item["RowNumber"] = item["RowNumber"];
                item["PriceBaseFee"] = item["PriceBaseFee"];
                item["Price"] = item["Price"];
                if (saleType == 1)
                {
                    item["SaleAmount"] = item["Quantity"];
                    item["GoodsPrice"] = item["NetPrice"];

                }
                if (saleType == 2)
                {
                    item["SaleAmount"] = -Convert.ToInt32(item["Quantity"]);
                    item["GoodsPrice"] = -Convert.ToDecimal(item["NetPrice"]);

                }
                item["AdditionAmount"] = item["AdditionAmount"];
                item["ReductionAmount"] = item["ReductionAmount"];
                item["CustomerId"] = item["CustomerId"];
                item["srcIsDist"] = 0;

                //item["hash"] = GenerateUniqueCodeSale(distId.ToString(), companyId.ToString(), item["InvoiceItemID"].ToString());

            }
            return dataArray;
        }
        public static string[] ConvertToPersianDateArray(string inputDate)
        {
            try
            {
                // Parse the input string into a DateTime object
                DateTime gregorianDate = DateTime.ParseExact(inputDate, "yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture);

                // Create an instance of the PersianCalendar
                PersianCalendar persianCalendar = new PersianCalendar();

                // Extract Persian date components
                string day = persianCalendar.GetDayOfMonth(gregorianDate).ToString("00");
                string month = persianCalendar.GetMonth(gregorianDate).ToString("00");
                string year = persianCalendar.GetYear(gregorianDate).ToString("00");

                // Return as an array
                return new string[] { day.ToString(), month.ToString(), year.ToString() };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error converting date: {ex.Message}");
                return null; // Return null if there is an error
            }
        }

        public static string GenerateUniqueCodeSale(
            string distId,
            string companyId
            , string InvoiceItemID)
        {
            string data = $"{distId}|{companyId}|{InvoiceItemID}";
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

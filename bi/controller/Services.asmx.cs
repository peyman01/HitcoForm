using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.EnterpriseServices;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Web.Services;
using Web_Services.DataAccess;
using System.Web;
using System.Globalization;
using System.Web.DynamicData;
using System.Web.Script.Services;
using System.Diagnostics;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using static System.Collections.Specialized.BitVector32;
using System.IO;

namespace Web_Services.controller
{

    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]


    public class Services : BaseWebService
    //public class Services : WebService
    {
        public string sesMsg = "{\"msg\":\"sessionExpir$%^&\"}";
        public dynamic checkAccess()
        {
            var validation = ValidateSession();

            // If session is invalid, return the error response immediately
            if (!validation.Status)
            {
                Context.Response.ContentType = "application/json";
                HttpContext.Current.ApplicationInstance.CompleteRequest();
                return false; // Return null to stop further processing
            }

            // Return a valid response or simple success flag if session is OK
            return true;
        }


        [WebMethod(EnableSession = true)]
        public string updatesIsSeen(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];            
            return repository.updatesIsSeen(data);
        }
        [WebMethod(EnableSession = true)]
        public string GetReport(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetReport(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }

            var obj = new
            {
                services = reportData["services"],
                totalRecords = reportData["totalRecords"]
            };

            return JsonConvert.SerializeObject(obj);
        }

        [WebMethod(EnableSession = true)]
        public string GetDistinctValues(dynamic column)
        {
            if (!checkAccess()) return sesMsg;

            string reportData = repository.GetDistinctValues(column.ToString());
            return reportData; // Return ID and Name pairs
        }
        /// ///////////////////////////////////////////////////////////
        [WebMethod(EnableSession = true)]
        public string GetReportFinance(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetReportFinance(data);
            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                services = reportData["services"],
                totalRecords = reportData["totalRecords"],
            };

            return JsonConvert.SerializeObject(obj);
        }

        [WebMethod(EnableSession = true)]
        public string GetReportFull(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetReportFull(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                services = reportData["services"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetReportFullFinance(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetReportFullFinance(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                services = reportData["services"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetMonthlySalesByDistributor(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetMonthlySalesByDistributor(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                monthlySalesByDistributor = reportData["monthlySalesByDistributor"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetMonthlySalesByCompany(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetMonthlySalesByCompany(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                monthlySalesByCompany = reportData["monthlySalesByCompany"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetMonthlySalesByCompanyFinance(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetMonthlySalesByCompanyFinance(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                monthlySalesByCompanyFinance = reportData["monthlySalesByCompanyFinance"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetPivotData(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetPivotData(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                result = reportData["result"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetPivotDataStock(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetPivotDataStock(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                result = reportData["result"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetPivotDataSaleStock(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetPivotDataSaleStock(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                result = reportData["result"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string getPivotDataFinance(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetPivotDataFinance(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                result = reportData["result"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string getPivotDataTarget(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetPivotDataTarget(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                result = reportData["result"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string DynamicPivot(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.DynamicPivot(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                result = reportData["result"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string DynamicPivotFinance(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.DynamicPivotFinance(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                result = reportData["result"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetMonthlySalesByBrand(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetMonthlySalesByBrand(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                monthlySalesByBrand = reportData["monthlySalesByBrand"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetMonthlySalesByBrandFinance(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetMonthlySalesByBrandFinance(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                monthlySalesByBrandFinance = reportData["monthlySalesByBrandFinance"],
            };

            return JsonConvert.SerializeObject(obj);
        }


        [WebMethod(EnableSession = true)]
        public string GetInitialData()
        {


            if (!checkAccess()) return sesMsg;

            DateTime now = DateTime.Now;
            PersianCalendar persianCalendar = new PersianCalendar();
            int persianYear = persianCalendar.GetYear(now);
            int persianMonth = persianCalendar.GetMonth(now);
            int persianDay = persianCalendar.GetDayOfMonth(now);
            string today = string.Format("{0:D4}/{1:D2}/{2:D2}", persianYear, persianMonth, persianDay);

            string startDate = "";
            string endDate = "";

            if (persianDay <= 5)
            {
                // Previous month
                int prevMonth = persianMonth - 1;
                int prevYear = persianYear;
                if (prevMonth == 0)
                {
                    prevMonth = 12;
                    prevYear -= 1;
                }

                // First day of previous month
                startDate = string.Format("{0:D4}/{1:D2}/01", prevYear, prevMonth);

                // Last day of previous month → find first day of current month -1 day
                DateTime firstDayCurrentMonth = persianCalendar.ToDateTime(persianYear, persianMonth, 1, 0, 0, 0, 0);
                DateTime lastDayPrevMonth = firstDayCurrentMonth.AddDays(-1);

                int lastYear = persianCalendar.GetYear(lastDayPrevMonth);
                int lastMonth = persianCalendar.GetMonth(lastDayPrevMonth);
                int lastDay = persianCalendar.GetDayOfMonth(lastDayPrevMonth);

                endDate = string.Format("{0:D4}/{1:D2}/{2:D2}", lastYear, lastMonth, lastDay);
            }
            else
            {
                // First day of current month
                startDate = string.Format("{0:D4}/{1:D2}/01", persianYear, persianMonth);
                endDate = today;
            }

            string shamsiFirstDay = string.Format("{0:D4}/{1:D2}/{2:D2}", persianYear, persianMonth, persianDay);

            var obj = new
            {
                companies = JArray.Parse(repository.GetCompanies(0, Session["infoUid"].ToString())),
                distributors = JArray.Parse(repository.GetDistributors(0, Session["infoUid"].ToString())),
                brands = JArray.Parse(repository.GetBrands(0, Session["infoUid"].ToString())),
                customers = JArray.Parse(repository.GetCustomers(Session["infoUid"].ToString())),
                products = JArray.Parse(repository.GetProducts(Session["infoUid"].ToString())),
                userUiElements = repository.GetUserTabsAndSheets(Session["infoUid"].ToString()),
                notifs = JArray.Parse(repository.GetNotifs()),
                cities = JArray.Parse(repository.GetCitites()),
                userSetting = JArray.Parse(repository.GetUserSettings(Session["infoUid"].ToString())),
                curDate = shamsiFirstDay,
                defaultExpDate = string.Format("{0:D4}/{1:D2}/{2:D2}", persianYear + 2, persianMonth, persianDay),
                months = JArray.Parse(repository.GetMonths(0)),
                today = today,
                startDate = startDate,
                endDate = endDate
            };

            return JsonConvert.SerializeObject(obj);
        }

        [WebMethod(EnableSession = true)]
        public string GetCompanies(int id)
        {
            if (!checkAccess()) return sesMsg;
            return repository.GetCompanies(id, Session["infoUid"].ToString());
        }
        [WebMethod(EnableSession = true)]
        public string logOut()
        {
            Session.Clear();
            Session.Abandon();
            return "";
        }
        [WebMethod(EnableSession = true)]
        public string saveUserSetting(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            return repository.saveUserSetting(data, Session["infoUid"].ToString());
        }
        [WebMethod(EnableSession = true)]
        public string GetDistributors(int id)
        {
            if (!checkAccess()) return sesMsg;
            return repository.GetDistributors(id, Session["infoUid"].ToString());
        }
        [WebMethod(EnableSession = true)]
        public string GetCompanyProductFinanace(int cId)
        {
            if (!checkAccess()) return sesMsg;
            return repository.GetCompanyProductFinanace(cId, Session["infoUid"].ToString());
        }
        [WebMethod(EnableSession = true)]
        public string GetServiceLog(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            return repository.GetServiceLog(data, Session["infoUid"].ToString());
        }
        [WebMethod(EnableSession = true)]
        public string GetServiceLogDetail(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            return repository.GetServiceLogDetail(data, Session["infoUid"].ToString());
        }

        [WebMethod(EnableSession = true)]
        public string GetLinkedProductFinanace(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            return repository.GetLinkedProductFinanace(data, Session["infoUid"].ToString());
        }
        [WebMethod(EnableSession = true)]
        public string updateProductFinancePrice(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            string response = repository.updateProductFinancePrice(data, Session["infoUid"].ToString());
            repository.updateTargetHeader();
            return response;
        }
        [WebMethod(EnableSession = true)]
        public string getProductFinancePriceLog(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            return repository.getProductFinancePriceLog(data, Session["infoUid"].ToString());
        }
        [WebMethod(EnableSession = true)]
        public string GetCompanyProductDist(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            JObject reportData = repository.GetCompanyProductDist(data, Session["infoUid"].ToString());
            var obj = new
            {
                distProducts = reportData["distProducts"],
                fncProducts = reportData["fncProducts"]
            };

            return JsonConvert.SerializeObject(obj);
        }

        [WebMethod(EnableSession = true)]
        public string GetProformaProductTemp(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            JObject reportData = repository.GetProformaProductTemp(data, Session["infoUid"].ToString());
            var obj = new
            {
                tempProducts = reportData["tempProducts"],
                fncProducts = reportData["fncProducts"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string updateProductBrand(int brandId, int productId)
        {
            if (!checkAccess()) return sesMsg;
            return repository.updateProductBrand(brandId, productId);
        }
        [WebMethod(EnableSession = true)]
        public string updateProductFinanceDist(int fprId, int dprId, decimal ratio)
        {
            if (!checkAccess()) return sesMsg;
            return repository.updateProductFinanceDist(fprId, dprId, ratio);
        }
        [WebMethod(EnableSession = true)]
        public string updateProductTemp(int fprId, int pfPrdId)
        {
            if (!checkAccess()) return sesMsg;
            return repository.updateProductTemp(fprId, pfPrdId);
        }
        [WebMethod(EnableSession = true)]
        public string GetCustomerAnalyzeData(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetCustomerAnalyzeData(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                invoiceData = reportData["invoiceData"],
                paymentData = reportData["paymentData"],
                receivableNote = reportData["receivableNote"],
                ChequeTimeBreakdown = reportData["ChequeTimeBreakdown"]

            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetInvoiceBreakDownData(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetInvoiceBreakDownData(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {


                InvoiceBreakDownData = reportData["InvoiceBreakDownData"]

            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetPaymentTimeBreakDownData(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetPaymentTimeBreakDownData(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {


                PaymentTimeBreakDownData = reportData["PaymentTimeBreakDownData"]

            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string getInvoiceItems(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.getInvoiceItems(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                invoiceItemData = reportData["invoiceItemData"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetPayableGridData(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetPayableGridData(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                payableNote = reportData["payableNote"],
                paymentVoucher = reportData["paymentVoucher"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetChequeTimeBreakdownDetails(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetChequeTimeBreakdownDetails(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                ChequeTimeBreakdownDetails = reportData["ChequeTimeBreakdownDetails"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetPaymentTimeBreakdownDetails(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetPaymentTimeBreakdownDetails(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                PaymentTimeBreakdownDetails = reportData["PaymentTimeBreakdownDetails"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetInvoiceBreakdownDetails(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetInvoiceBreakdownDetails(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                InvoiceBreakdownDetails = reportData["InvoiceBreakdownDetails"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetReceivableDetailsByType(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetReceivableDetailsByType(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                ReceivableDetailsByType = reportData["ReceivableDetailsByType"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetDistSaleSummary(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetDistSaleSummary(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                distSalesSummary = reportData["distSalesSummary"],
                distStockSummary = reportData["distStockSummary"],
                distTargetSummary = reportData["distTargetSummary"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetBrandSalesSummary(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetBrandSalesSummary(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                brandSalesSummary = reportData["brandSalesSummary"],
                brandStockSummary = reportData["brandStockSummary"],
                brandTargetSummary = reportData["brandTargetSummary"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetDebitDashboardData(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject debitDashboardData = repository.GetDebitDashboardData(data);

            if (debitDashboardData.ContainsKey("error"))
            {
                return debitDashboardData.ToString();
            }
            var obj = new
            {
                debitDashboardData = debitDashboardData["debitDashboardData"],
                ChequeStatusData = debitDashboardData["ChequeStatusData"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetDebitData(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetDebitData(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                debitData = reportData["debitData"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetBrandSalesSummaryFinance(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetBrandSalesSummaryFinance(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                brandSalesSummary = reportData["brandSalesSummary"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetOfficeSalesSummaryFinance(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetOfficeSalesSummaryFinance(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                officeSalesSummary = reportData["officeSalesSummary"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetProductSaleSummary(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetProductSalesSummary(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                productSalesSummary = reportData["productSalesSummary"],
                productStockSummary = reportData["productStockSummary"],
                productTargetSummary = reportData["productTargetSummary"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetStateSaleSummary(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetStateSalesSummary(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                stateSalesSummary = reportData["stateSalesSummary"],
                stateStockSummary = reportData["stateStockSummary"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetProductSaleSummaryFinance(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetProductSalesSummaryFinance(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                productSalesSummary = reportData["productSalesSummary"]
                //productStockSummary = reportData["productStockSummary"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetStoreSaleSummaryFinance(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];

            JObject reportData = repository.GetStoreSaleSummaryFinance(data);

            if (reportData.ContainsKey("error"))
            {
                return reportData.ToString();
            }
            var obj = new
            {
                storeSaleSummary = reportData["storeSaleSummary "]
                //productStockSummary = reportData["productStockSummary"]
            };

            return JsonConvert.SerializeObject(obj);
        }

        [WebMethod(EnableSession = true)]
        public string rateSaleStock(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.rateSaleStock(data);
            var obj = new
            {
                rateSaleStock = reportData["SalesStockRate"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string getExpiryDateStock(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.getExpiryDateStock(data);
            var obj = new
            {
                getExpiryDateStock = reportData["ExpiryDateStock"],
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetCustomerStateMap(dynamic data)
        {

            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetCustomerStateMap(data);
            var obj = new
            {
                GetCustomerStateMap = reportData["customerState"]

            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string GetTrendingProducts(dynamic data)
        {

            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.GetTrendingProducts(data);
            var obj = new
            {
                GetTrendingProducts = reportData["trendingProducts"]

            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]

        public string usp_InsertOrUpdate_TargetHeader(dynamic data)
        {
            if (!checkAccess()) return sesMsg;

            // اضافه کردن session به data
            data["session"] = Session["infoUid"];

            // فراخوانی متد repository
            JObject reportData = repository.usp_InsertOrUpdate_TargetHeader(data);

            // خروجی
            var obj = new
            {
                usp_InsertOrUpdate_TargetHeader = reportData["InsertOrUpdate_TargetHeader"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]

        public string usp_Save_TargetMonthDistribution(dynamic data)
        {

            if (!checkAccess()) return sesMsg;
            string success = repository.usp_Save_TargetMonthDistribution(data, Session["infoUid"].ToString());
            return success;


        }
        [WebMethod(EnableSession = true)]

        public string usp_Save_TargetProvinceDistribution(dynamic data)
        {

            if (!checkAccess()) return sesMsg;
            string success = repository.usp_Save_TargetProvinceDistribution(data, Session["infoUid"].ToString());
            return success;


        }

        [WebMethod(EnableSession = true)]
        public string usp_Save_TargetDistributorDistribution(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            string success = repository.usp_Save_TargetDistributorDistribution(data, Session["infoUid"].ToString());
            return success;
        }
        [WebMethod(EnableSession = true)]
        public string usp_Save_TargetProductDistribution(dynamic data)
        {
            if (!checkAccess()) return sesMsg;

            // اضافه کردن session به data
            data["session"] = Session["infoUid"];

            // فراخوانی متد repository
            JObject reportData = repository.usp_Save_TargetProductDistribution(data);

            // خروجی
            var obj = new
            {
                usp_Save_TargetProductDistribution = reportData["InsertOrUpdate_TargetProduct"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string getTargetData(dynamic data)
        {
            if (!checkAccess()) return sesMsg;

            // اضافه کردن session به data
            data["session"] = Session["infoUid"];

            // فراخوانی متد repository
            JObject reportData = repository.getTargetData(data);

            // خروجی
            var obj = new
            {
                targetHeaderData = reportData["targetHeaderData"],
                targetMonthData = reportData["targetMonthData"],
                targetDistData = reportData["targetDistData"],
                targetProvinceData = reportData["targetProvinceData"],
                targetPrdData = reportData["targetPrdData"]
            };


            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string getTargetGridInitialData(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            // فراخوانی متد repository
            JObject getTargetGridInitialData = repository.getTargetGridInitialData(data);

            // خروجی
            var obj = new
            {
                getTargetGridInitialData = getTargetGridInitialData["getTargetGridInitialData"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string getTargetGridData(dynamic data)
        {
            if (!checkAccess()) return sesMsg;

            // اضافه کردن session به data
            data["session"] = Session["infoUid"];

            // فراخوانی متد repository
            JObject targetBrandLevelData = repository.targetBrandLevelData(data);
            JObject targetBrandDistLevelData = repository.targetBrandDistLevelData(data);
            JObject targetBrandMonthLevelData = repository.targetBrandMonthLevelData(data);
            JObject targetBrandStateLevelData = repository.targetBrandStateLevelData(data);
            // خروجی
            var obj = new
            {
                targetBrandLevelData = targetBrandLevelData["targetBrandLevelData"],

                targetBrandDistLevelData = targetBrandDistLevelData["targetBrandDistLevelData"],
                targetBrandDistLevelDataAmount = targetBrandDistLevelData["targetBrandDistLevelDataAmount"],

                targetBrandMonthLevelData = targetBrandMonthLevelData["targetBrandMonthLevelData"],
                targetBrandMonthLevelDataAmount = targetBrandMonthLevelData["targetBrandMonthLevelDataAmount"],

                targetBrandStateLevelData = targetBrandStateLevelData["targetBrandStateLevelData"]
            };

            return JsonConvert.SerializeObject(obj);
        }
        /*[WebMethod(EnableSession = true)]
        public string targetBrandMonthLevelDataUserView(dynamic data) // bakhshi
        {
            if (!checkAccess()) return sesMsg;

            // اضافه کردن session به data
            data["session"] = Session["infoUid"];

            // فراخوانی متد repository
           
          
            JObject targetBrandMonthLevelData = repository.targetBrandMonthLevelDataUserView(data);
       
            // خروجی
            var obj = new
            {
     

                targetBrandMonthLevelData = targetBrandMonthLevelData["targetBrandMonthLevelData"],
                targetBrandMonthLevelDataAmount = targetBrandMonthLevelData["targetBrandMonthLevelDataAmount"],

  
            };

            return JsonConvert.SerializeObject(obj);
        }*/
        [WebMethod(EnableSession = true)]
        public string targetBrandProductLevelData(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.targetBrandProductLevelData(data);
            var obj = new
            {
                targetBrandProductLevelData = reportData["targetBrandProductLevelData"]
            };
            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string targetBrandDistProductLevelData(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.targetBrandDistProductLevelData(data);
            var obj = new
            {
                targetBrandDistProductLevelData = reportData["targetBrandDistProductLevelData"]
            };
            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string targetBrandMonthProductLevelData(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.targetBrandMonthProductLevelData(data);
            var obj = new
            {
                targetBrandMonthProductLevelData = reportData["targetBrandMonthProductLevelData"]
            };
            return JsonConvert.SerializeObject(obj);
        }
        [WebMethod(EnableSession = true)]
        public string targetBrandStateProductLevelData(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            data["session"] = Session["infoUid"];
            JObject reportData = repository.targetBrandStateProductLevelData(data);
            var obj = new
            {
                targetBrandStateProductLevelData = reportData["targetBrandStateProductLevelData"]
            };
            return JsonConvert.SerializeObject(obj);
        }

        [WebMethod(EnableSession = true)]
        public string getProforma(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            //var allProducts = repository.getAllFinanceProducts(infoUid);
            var proforma = repository.getProforma(data, infoUid);
            return JsonConvert.SerializeObject(proforma);

        }
        [WebMethod(EnableSession = true)]
        public string GetProformaItems(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            //var allProducts = repository.getAllFinanceProducts(infoUid);
            var proformaItems = repository.GetProformaItems(data, infoUid);
            return JsonConvert.SerializeObject(proformaItems);

        }
        [WebMethod(EnableSession = true)]
        public string GetMasterProformaItem(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            //var allProducts = repository.getAllFinanceProducts(infoUid);
            var proformaItemProducts = repository.GetProformaItemProducts(data, infoUid);
            return JsonConvert.SerializeObject(proformaItemProducts);

        }
        [WebMethod(EnableSession = true)]
        public string GetProformaProducts(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            //var allProducts = repository.getAllFinanceProducts(infoUid);
            var proformaProducts = repository.GetProformaProducts(data, infoUid);
            return JsonConvert.SerializeObject(proformaProducts);

        }
        [WebMethod(EnableSession = true)]
        public string getProformaFieldDb(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            //var allProducts = repository.getAllFinanceProducts(infoUid);
            var baseData = repository.GetTBaseByGroups(data["baseFields"], infoUid);
            var sellers = repository.GetProformaSellers(infoUid);
            var productTemp = repository.GetProformaProductTemp(infoUid);
            var obj = new
            {
                baseData = baseData,
                sellers = sellers,
                productTemp = productTemp
            };
            return JsonConvert.SerializeObject(obj);

        }
        [WebMethod(EnableSession = true)]
        public string saveProformaTempProduct(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var response = repository.saveProformaTempProduct(data, infoUid);
            return JsonConvert.SerializeObject(response);

        }
        [WebMethod(EnableSession = true)]
        public string saveProformaSeller(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var response = repository.saveProformaSeller(data, infoUid);
            return JsonConvert.SerializeObject(response);

        }
        [WebMethod(EnableSession = true)]
        public string saveProformaData(dynamic proformaData, dynamic proformaItemData,dynamic proformaProductData)
        {
            if (!checkAccess()) return sesMsg;

            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var response = repository.saveProformaData(proformaData, proformaItemData, proformaProductData,infoUid);

            try
            {
                int proformaId = Convert.ToInt32(response["upsertedProformaData"][0]["ProformaId"]);

                // 1️⃣ جابجایی فایل‌های پروفورما
                string proformaTempPath = proformaData["tempFilePath"]?.ToString();
                if (!string.IsNullOrEmpty(proformaTempPath))
                {
                    string tempPath = HttpContext.Current.Server.MapPath($"~/uploads/temp/{proformaTempPath}/");
                    string destPath = HttpContext.Current.Server.MapPath($"~/uploads/pi/pi-{proformaId}/");
                    MoveFiles(tempPath, destPath);
                }

                // 2️⃣ جابجایی فایل‌های آیتم‌ها
                var items = response["upsertedProformaItemData"];
                foreach (var item in items)
                {
                    int proformaItemId = Convert.ToInt32(item["ProformaItemId"]);
                    string itemTempPath = item["TempFilePath"]?.ToString();

                    if (!string.IsNullOrEmpty(itemTempPath))
                    {
                        string tempPath = HttpContext.Current.Server.MapPath($"~/uploads/temp/{itemTempPath}/");
                        string destPath = HttpContext.Current.Server.MapPath($"~/uploads/pi/pi-{proformaId}/item-{proformaItemId}/");
                        MoveFiles(tempPath, destPath);
                    }
                }
                var products = response["upsertedProformaPoductData"];
                foreach (var item in products)
                {
                    int proformaProductId = Convert.ToInt32(item["ProformaProductId"]);
                    string productTempPath = item["TempFilePath"]?.ToString();

                    if (!string.IsNullOrEmpty(productTempPath))
                    {
                        string tempPath = HttpContext.Current.Server.MapPath($"~/uploads/temp/{productTempPath}/");
                        string destPath = HttpContext.Current.Server.MapPath($"~/uploads/pi/pi-{proformaId}/product-{proformaProductId}/");
                        MoveFiles(tempPath, destPath);
                    }
                }

                return JsonConvert.SerializeObject(response);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }

        private void MoveFiles(string tempPath, string destPath)
        {
            if (Directory.Exists(tempPath))
            {
                if (!Directory.Exists(destPath))
                    Directory.CreateDirectory(destPath);

                foreach (var file in Directory.GetFiles(tempPath))
                {
                    string fileName = Path.GetFileName(file);
                    string destFile = Path.Combine(destPath, fileName);

                    if (System.IO.File.Exists(destFile))
                    {
                        // اگر فایل با همین نام وجود داشت، یک کد یکتا اضافه کن
                        string uniqueName = $"{Path.GetFileNameWithoutExtension(fileName)}-{Guid.NewGuid().ToString("N").Substring(6)}{Path.GetExtension(fileName)}";
                        destFile = Path.Combine(destPath, uniqueName);
                    }

                    System.IO.File.Move(file, destFile);
                }

                Directory.Delete(tempPath, true);
            }
        }
        [WebMethod(EnableSession = true)]
        public string GetFilesList(string relPath)
        {
            if (!checkAccess()) return sesMsg;

            try
            {
                string absPath = HttpContext.Current.Server.MapPath(relPath);
                var files = new List<object>();

                if (Directory.Exists(absPath))
                {
                    // 🟢 فایل‌های خود فولدر اصلی (pi-{proformaId})
                    foreach (var file in Directory.GetFiles(absPath))
                    {
                        var fi = new FileInfo(file);
                        files.Add(new
                        {
                            path = relPath + "/", // تضمین اسلش پایانی
                            fileName = fi.Name,
                            //extension = fi.Extension,
                           // sizeKB = (int)(fi.Length / 1024)
                        });
                    }

                    // 🟢 فایل‌های داخل هر فولدر آیتم (item-{id})
                    //foreach (var dir in Directory.GetDirectories(absPath, "item-*"))
                    //{
                    //    string dirName = Path.GetFileName(dir);
                    //    string dirRelPath = relPath + "/" + dirName + "/";

                    //    foreach (var file in Directory.GetFiles(dir))
                    //    {
                    //        var fi = new FileInfo(file);
                    //        files.Add(new
                    //        {
                    //            path = dirRelPath,
                    //            fileName = fi.Name,
                    //            //extension = fi.Extension,
                    //            //sizeKB = (int)(fi.Length / 1024)
                    //        });
                    //    }
                    //}
                }

                return JsonConvert.SerializeObject(files);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        [WebMethod(EnableSession = true)]
        public string DeleteFileByPath(string relPath)
        {
            if (!checkAccess())
                return JsonConvert.SerializeObject(new { error = "Access denied" });

            if (string.IsNullOrEmpty(relPath))
                return JsonConvert.SerializeObject(new { error = "Missing path" });

            try
            {
                string fullPath = HttpContext.Current.Server.MapPath(relPath);

                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    return JsonConvert.SerializeObject(new { success = true });
                }
                else
                {
                    return JsonConvert.SerializeObject(new { error = "File not found" });
                }
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { error = ex.Message });
            }
        }
        [WebMethod(EnableSession = true)]
        public string saveShipment(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = repository.saveShipment(data, infoUid);

            return JsonConvert.SerializeObject(a);

        }
        [WebMethod(EnableSession = true)]
        public string updateShipmentRow(dynamic data)
        {
            if (!checkAccess()) return sesMsg;
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = repository.updateShipmentRow(data, infoUid);

            return JsonConvert.SerializeObject(a);

        }

    }

}

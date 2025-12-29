<%@ WebHandler Language="C#" Class="ExchangeRate" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.Net;
using System.IO;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Configuration;
public class ExchangeRate : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json";
        context.Response.ContentEncoding = System.Text.Encoding.UTF8;

        context.Server.ScriptTimeout = 36000; // 10 Hours

        try
        {
            // Check for saveCurrency action
            string action = context.Request.QueryString["action"];
            if(action != null) action = action.ToLower();
            /*if (action == "savecurrency")
            {
                SaveCurrencyRates(context);
                return;
            }*/
            if (context.Request.QueryString["test"] != null)
            {
                if (context.Session != null && context.Session["infoUid"] != null)
                {
                    context.Response.Write(context.Session["infoUid"].ToString());
                }
                else
                {
                    context.Response.Write("Session is null or infoUid not found");
                }
                return;
            }
            if (action == "SaveAllCurrencies".ToLower())
            {
                SaveAllCurrencyRates(context);
                return;
            }

            // Show help if no currency or help parameter is present
            if (context.Request.QueryString["help"] != null || context.Request.QueryString["h"] != null)
            {
                ShowHelp(context);
                return;
            }

            if (action == "getRate".ToLower())
            {
                string from = context.Request.QueryString["from"] ?? "";
                string to = context.Request.QueryString["to"] ?? "";
                string currency = (context.Request.QueryString["currency"] ?? "usd").ToLower();
                string type = (context.Request.QueryString["type"] ?? "free").ToLower();
                string date = context.Request.QueryString["date"] ?? "";
                string sellBuy = (context.Request.QueryString["sellBuy"] ?? "sell").ToLower();
                context.Response.Write(JsonConvert.SerializeObject(GetExchangeRate(currency, type, sellBuy, from, to, date)));
                return;
            }
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new
            {
                success = false,
                error = ex.Message
            }));
        }
    }
    private object GetExchangeRate(string? currency, string? type, string? sellBuy, string? from, string? to, string? date)
    {
        try
        {
            if(sellBuy == null || sellBuy == "") sellBuy = "sell";
            if(type == null || type == "") type = "price";
            if (type == "free") type = "price";
            if (!string.IsNullOrEmpty(date))
            {
                from = to = date;
            }

            string baseUrl = "https://api.tgju.org/v1/market/indicator/summary-table-data/";
            string urlExt = BuildUrlExtension(type, sellBuy, currency);
            string url = baseUrl + urlExt;

            if (!string.IsNullOrEmpty(from))
            {
                url += "?from=" + from;
            }
            if (!string.IsNullOrEmpty(to))
            {
                string separator = string.IsNullOrEmpty(from) ? "?" : "&";
                url += separator + "to=" + to;
            }
            // Make HTTP request
            string response = MakeHttpRequest(url);

            if (string.IsNullOrEmpty(response))
            {
                return(new
                {
                    success = false,
                    error = "Invalid Params"
                });
            }

            var responseData = JsonConvert.DeserializeObject<JObject>(response);

            if (responseData == null || responseData["data"] == null)
            {
                return(new
                {
                    success = false,
                    error = "Invalid JSON response"
                });
            }

            var result = new List<Dictionary<string, string>>();
            var data = responseData["data"] as JArray;

            if (data != null)
            {
                foreach (var item in data)
                {
                    var itemArray = item as JArray;
                    if (itemArray != null)
                    {
                        result.Add(new Dictionary<string, string>
                        {
                            { "opening", RemoveCommas(itemArray[0]?.ToString() ?? "") },
                            { "min", RemoveCommas(itemArray[1]?.ToString() ?? "") },
                            { "max", RemoveCommas(itemArray[2]?.ToString() ?? "") },
                            { "last", RemoveCommas(itemArray[3]?.ToString() ?? "") },
                            { "gre", itemArray[6]?.ToString() ?? "" },
                            { "solar", itemArray[7]?.ToString() ?? "" }
                        });
                    }
                }
            }

            string description = CreateDescription(currency, type, sellBuy);

            return(new
            {
                success = true,
                description = description,
                data = result
            });
        }
        catch (Exception ex)
        {
            return(new
            {
                success = false,
                error = ex.Message
            });
        }
    }

    private void ShowHelp(HttpContext context)
    {
        var helpData = new
        {
            help = "Exchange Rate API Documentation",
            endpoints = new[]
            {
                new
                {
                    description = "Get exchange rates",
                    method = "GET",
                    parameters = new
                    {
                        currency = "optional - Currency code (usd: دلار | eur: یورو | aed: درهم | inr:روپیه | try:لیر | rub:روبل | cny:یوان | aud:دلار استرالیا | cad:دلار کانادا | gbp:پوند | jpy:صد ین ژاپن | krw:وون کره جنوبی)  (default: usd)",
                        type = "optional - free: آزاد | bank: مبادله ای | sana: سنا | nima: نیما (default: free)",
                        sellBuy = "optional - sell: نرخ فروش | buy: نرخ خرید (default: sell)",
                        date = "optional - Date (Solar date format: yyyy/mm/dd) (default: yesterday)",
                        from = "optional - From date (Solar date format: yyyy/mm/dd)",
                        to = "optional - To date (Solar date format: yyyy/mm/dd)"
                    },
                    example = "http://dev-srv/controlProject/controller/ExchangeRate.ashx?currency=usd&type=sana&sellBuy=sell&from=1404/08/01&to=1404/08/05"
                }
            },
            response_format = new
            {
                success = "boolean",
                data = new[]
                { 
                    new
                    {
                        opening = "string - Opening price",
                        min = "string - Minimum price",
                        max = "string - Maximum price",
                        last = "string - Last price",
                        gre = "string - Gregorian date",
                        solar = "string - Solar date"
                    }
                }
            }
        };

        context.Response.Write(JsonConvert.SerializeObject(helpData, Formatting.Indented));
    }

    private string BuildUrlExtension(string type, string sellBuy, string currency)
    {
        
        string urlExt = type + "_" + sellBuy + "_" + currency;

        if (type == "price")
        {
            sellBuy = "";
            if (currency == "usd")
                urlExt = "price_dollar_rl";
            else
                urlExt = type + "_" + currency;
        }

        if (type == "bank")
        {
            sellBuy = "";
            urlExt = type + "_" + currency;
        }

        return urlExt;
    }

    private string MakeHttpRequest(string url)
    {
        try
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            request.Timeout = 30000;
            request.UserAgent = "Mozilla/5.0";

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                if (response.StatusCode != HttpStatusCode.OK)
                {
                    return null;
                }

                using (Stream stream = response.GetResponseStream())
                using (StreamReader reader = new StreamReader(stream, System.Text.Encoding.UTF8))
                {
                    return reader.ReadToEnd();
                }
            }
        }
        catch
        {
            return null;
        }
    }

    private string RemoveCommas(string value)
    {
        return value.Replace(",", "");
    }

    private string CreateDescription(string currency, string type, string sellBuy)
    {
        var currencyFa = new Dictionary<string, string>
        {
            { "usd", "دلار" },
            { "eur", "یورو" },
            { "aed", "درهم" },
            { "inr", "روپیه" },
            { "try", "لیر" },
            { "rub", "روبل" },
            { "cny", "یوان" },
            { "aud", "دلار استرالیا" },
            { "cad", "دلار کانادا" },
            { "gbp", "پوند" },
            { "jpy", "100 ین ژاپن" },
            { "krw", "1000 وون کره جنوبی" },
        };

        var typeFa = new Dictionary<string, string>
        {
            { "price", "آزاد" },
            { "bank", "مبادله ای" },
            { "sana", "سنا" },
            { "nima", "نیما" }
        };

        var sellBuyFa = new Dictionary<string, string>
        {
            { "sell", "فروش" },
            { "buy", "خرید" }
        };

        string currencyText = currencyFa.ContainsKey(currency) ? currencyFa[currency] : currency;
        string typeText = typeFa.ContainsKey(type) ? typeFa[type] : type;
        string sellBuyText = sellBuyFa.ContainsKey(sellBuy) ? sellBuyFa[sellBuy] : sellBuy;

        return $"نرخ {sellBuyText} {currencyText} {typeText}";
    }

    /*private void SaveCurrencyRates(HttpContext context)
    {
        try
        {
            string currency = (context.Request.QueryString["currency"] ?? "usd").ToLower();
            string date = context.Request.QueryString["date"] ?? "";
            string from = context.Request.QueryString["from"] ?? "";
            string to = context.Request.QueryString["to"] ?? "";

            if (!string.IsNullOrEmpty(date))
            {
                from = to = date;
            }

            // Get Free rate (آزاد)
            var freeData = GetExchangeRateData(currency, "free", "", from, to);

            // Get Nima rate
            var nimaData = GetExchangeRateData(currency, "nima", "", from, to);

            // Get Sana rate
            var sanaData = GetExchangeRateData(currency, "sana", "", from, to);

            // Get Mobadele rate (bank)
            var mobadeleData = GetExchangeRateData(currency, "bank", "", from, to);

            if (freeData == null || freeData["data"] == null)
            {
                context.Response.Write(JsonConvert.SerializeObject(new
                {
                    success = false,
                    error = "Failed to fetch exchange rate data"
                }));
                return;
            }

            // Combine data
            var freeArray = freeData["data"] as JArray;
            var nimaArray = nimaData?["data"] as JArray;
            var sanaArray = sanaData?["data"] as JArray;
            var mobadeleArray = mobadeleData?["data"] as JArray;

            var results = new List<object>();

            if (freeArray != null)
            {
                for (int i = 0; i < freeArray.Count; i++)
                {
                    var freeItem = freeArray[i] as JArray;
                    var nimaItem = nimaArray != null && i < nimaArray.Count ? nimaArray[i] as JArray : null;
                    var sanaItem = sanaArray != null && i < sanaArray.Count ? sanaArray[i] as JArray : null;
                    var mobadeleItem = mobadeleArray != null && i < mobadeleArray.Count ? mobadeleArray[i] as JArray : null;

                    if (freeItem != null)
                    {
                        var combinedData = new
                        {
                            action = "insert",
                            session = context.Session["userId"],
                            CurrencyCode = 72, // ثابت برای دلار
                            FreeRate = RemoveCommas(freeItem[3]?.ToString() ?? ""), // last price
                            CustomsRate = "", // خالی
                            NimaRate = nimaItem != null ? RemoveCommas(nimaItem[3]?.ToString() ?? "") : "",
                            TarjihiRate = "285000", // ثابت
                            SanaRate = sanaItem != null ? RemoveCommas(sanaItem[3]?.ToString() ?? "") : "",
                            MobadeleRate = mobadeleItem != null ? RemoveCommas(mobadeleItem[3]?.ToString() ?? "") : "",
                            EffectiveDate = freeItem[6]?.ToString() ?? "", // gre date
                            SolarDate = freeItem[7]?.ToString() ?? "" // solar date
                        };

                        results.Add(combinedData);
                    }
                }
            }

            context.Response.Write(JsonConvert.SerializeObject(new
            {
                success = true,
                count = results.Count,
                data = results
            }));
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new
            {
                success = false,
                error = ex.Message
            }));
        }
    }*/

    private void SaveAllCurrencyRates(HttpContext context)
    {
        int userId = 0;
        try{
            if (HttpContext.Current.Session != null && HttpContext.Current.Session["UserId"] != null)
                userId = Convert.ToInt32(HttpContext.Current.Session["UserId"]);}
        catch{
            userId = 0;
        }
        try
        {
            string date = context.Request.QueryString["date"] ?? "";
            if(date == "all") date = "";
            string from = context.Request.QueryString["from"] ?? "";
            string to = context.Request.QueryString["to"] ?? "";
            if(from == "" && to == "" && date == "") date = "yesterday";
            if(date == "yesterday" || date == "today") {
                System.Globalization.PersianCalendar pc = new System.Globalization.PersianCalendar();
                DateTime now = DateTime.Now;
                if(date == "yesterday") now = DateTime.Now.AddDays(-1);
                int year = pc.GetYear(now);
                int month = pc.GetMonth(now);
                int day = pc.GetDayOfMonth(now);
                date = string.Format("{0:0000}/{1:00}/{2:00}", year, month, day);
            }
            if (!string.IsNullOrEmpty(date))
            {
                from = to = date;
            }
            
            string connStr = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            var allResults = new List<object>();
            int totalProcessed = 0;
            int totalErrors = 0;

            using (System.Data.SqlClient.SqlConnection conn = new System.Data.SqlClient.SqlConnection(connStr))
            {
                conn.Open();

                string sql = "SELECT baseId, symbol FROM HitcoBI..tBase WHERE groupName='currency' AND symbol<>'irr' AND isActive=1 ";
                using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand(sql, conn))
                using (System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        
                        int currencyCode = Convert.ToInt32(reader["baseId"]);
                        string symbol = reader["symbol"].ToString().ToLower();

                        try
                        {
                            // Get Free rate
                            var freeResult = GetExchangeRate(symbol, "free", "", from, to, date);
                            var freeData = JObject.FromObject(freeResult);

                            // Get Nima rate
                            var nimaResult = GetExchangeRate(symbol, "nima", "", from, to, date);
                            var nimaData = JObject.FromObject(nimaResult);
                            // Get Sana rate
                            var sanaResult = GetExchangeRate(symbol, "sana", "", from, to, date);
                            var sanaData = JObject.FromObject(sanaResult);

                            // Get Mobadele rate (bank)
                            var mobadeleResult = GetExchangeRate(symbol, "bank", "", from, to, date);
                            var mobadeleData = JObject.FromObject(mobadeleResult);

                            if (freeData != null && freeData["success"]?.ToString() == "True" && freeData["data"] != null)
                            {                                
                                // Get data arrays
                                var freeArray = freeData["data"] as JArray;
                                var nimaArray = nimaData != null && nimaData["success"]?.ToString() == "True" ? nimaData["data"] as JArray : null;
                                var sanaArray = sanaData != null && sanaData["success"]?.ToString() == "True" ? sanaData["data"] as JArray : null;
                                var mobadeleArray = mobadeleData != null && mobadeleData["success"]?.ToString() == "True" ? mobadeleData["data"] as JArray : null;

                                if (freeArray != null)
                                {
                                    for (int i = 0; i < freeArray.Count; i++)
                                    {
                                        var freeItem = freeArray[i] as JObject;
                                        var nimaItem = nimaArray != null && i < nimaArray.Count ? nimaArray[i] as JObject : null;
                                        var sanaItem = sanaArray != null && i < sanaArray.Count ? sanaArray[i] as JObject : null;
                                        var mobadeleItem = mobadeleArray != null && i < mobadeleArray.Count ? mobadeleArray[i] as JObject : null;
 
                                        if (freeItem != null)
                                        {
                                            
                                            string solarDate = freeItem["solar"]?.ToString() ?? "";

                                            // Helper function to convert empty string to null
                                            string GetRateValue(string value)
                                            {
                                                return string.IsNullOrEmpty(value) ? null : value;
                                            }

                                            var combinedData = new
                                            {
                                                action = "insert",
                                                session = userId,
                                                CurrencyCode = currencyCode,
                                                CurrencySymbol = symbol,
                                                FreeRate = GetRateValue(freeItem["last"]?.ToString()),
                                                CustomsRate = (string)null,
                                                NimaRate = GetRateValue(nimaItem?["last"]?.ToString()),
                                                TarjihiRate = GetTarjihiRate(currencyCode, solarDate),
                                                SanaRate = GetRateValue(sanaItem?["last"]?.ToString()),
                                                MobadeleRate = GetRateValue(mobadeleItem?["last"]?.ToString()),
                                                EffectiveDate = freeItem["gre"]?.ToString() ?? "",
                                                SolarDate = freeItem["solar"]?.ToString() ?? ""
                                            };

                                            // Call saveCurrency stored procedure with separate connection
                                            try
                                            {
                                                string jsonData = JsonConvert.SerializeObject(combinedData);
                                                using (System.Data.SqlClient.SqlConnection spConn = new System.Data.SqlClient.SqlConnection(connStr))
                                                {
                                                    spConn.Open();
                                                    using (System.Data.SqlClient.SqlCommand spCmd = new System.Data.SqlClient.SqlCommand("HitcoBI..SaveCurrency", spConn))
                                                    {
                                                        spCmd.CommandType = System.Data.CommandType.StoredProcedure;
                                                        spCmd.CommandTimeout = 3600; // 1 ساعت (به ثانیه)
                                                        spCmd.Parameters.AddWithValue("@JsonData", jsonData);
                                                        spCmd.ExecuteNonQuery();
                                                    }
                                                }

                                                allResults.Add(combinedData);
                                                totalProcessed++;
                                            }
                                            catch (Exception spEx)
                                            {
                                                allResults.Add(new
                                                {
                                                    combinedData.CurrencyCode,
                                                    combinedData.CurrencySymbol,
                                                    combinedData.EffectiveDate,
                                                    error = spEx.Message
                                                });
                                                totalErrors++;
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                totalErrors++;
                            }
                        }
                        catch (Exception ex)
                        {
                            totalErrors++;
                            allResults.Add(new
                            {
                                CurrencyCode = currencyCode,
                                CurrencySymbol = symbol,
                                error = ex.Message,
                                stackTrace = ex.StackTrace
                            });
                        }

                    }
                }
            }

            context.Response.Write(JsonConvert.SerializeObject(new
            {
                success = true,
                totalProcessed = totalProcessed,
                totalErrors = totalErrors,
                data = allResults
            }));
        }
        catch (Exception ex)
        {
            context.Response.Write(JsonConvert.SerializeObject(new
            {
                success = false,
                error = ex.Message,
                stackTrace = ex.StackTrace
            }));
        }

    }

    private string GetTarjihiRate(int baseId, string solarDate)
    {
        try
        {
            int solarYear;

            if (string.IsNullOrEmpty(solarDate))
            {
                System.Globalization.PersianCalendar pc = new System.Globalization.PersianCalendar();
                solarYear = pc.GetYear(DateTime.Now);
            }
            else
            {
                string[] dateParts = solarDate.Split('/');
                if (dateParts.Length > 0 && int.TryParse(dateParts[0], out int year))
                {
                    solarYear = year;
                }
                else
                {
                    System.Globalization.PersianCalendar pc = new System.Globalization.PersianCalendar();
                    solarYear = pc.GetYear(DateTime.Now);
                }
            }

            string connStr = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;
            using (System.Data.SqlClient.SqlConnection conn = new System.Data.SqlClient.SqlConnection(connStr))
            {
                conn.Open();
                string sql = "SELECT Rate FROM HitcoBI..TarjihiRates WHERE baseId = @baseId AND SolarYear = @solarYear";
                using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@baseId", baseId);
                    cmd.Parameters.AddWithValue("@solarYear", solarYear);

                    object result = cmd.ExecuteScalar();
                    if (result != null && result != DBNull.Value)
                    {
                        return result.ToString();
                    }
                }
            }

            return "0";
        }
        catch
        {
            return "0";
        }
    }

        public bool IsReusable
    {
        get { return false; }
    }
}
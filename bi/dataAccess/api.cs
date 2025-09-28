using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using Web_Services.controller;
using Newtonsoft.Json.Linq;

namespace Web_Services.dataAccess
{
    public class api
    {
        public static JObject apiRequest(string session)
        {

            string connectionString = ConfigurationManager.ConnectionStrings["DBCnn"].ConnectionString;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("getUserName", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@userInfo", SqlDbType.Int)).Value =session;
                    connection.Open();
                    DataSet dataSet = new DataSet();
                    SqlDataAdapter adapter = new SqlDataAdapter(command);
                    adapter.Fill(dataSet);

                    return new JObject
                    {
                        ["userData"] = JArray.FromObject(dataSet.Tables[0])
                    };
                }
            }
            catch (Exception ex)
            {
                return new JObject { ["error"] = ex.Message };
            }


        }
    }
}
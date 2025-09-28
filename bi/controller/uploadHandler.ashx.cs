
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace Web_Services.controller
{
    /// <summary>
    /// Summary description for uploadHandler
    /// </summary>
    public class uploadHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            string delete = context.Request["delete"];
            string fileName = context.Request["fileName"];

            if (!string.IsNullOrEmpty(delete) && delete == "1" && !string.IsNullOrEmpty(fileName))
            {
                DeleteFile(context, fileName);
                return;
            }

            if (context.Request.Files.Count > 0)
            {
                SaveFile(context);
            }
            else
            {
                context.Response.StatusCode = 400;
                context.Response.ContentType = "application/json";
                context.Response.Write("{\"error\":\"No file received\"}");
            }
        }

        private void SaveFile(HttpContext context)
        {
            HttpPostedFile file = context.Request.Files["file"];

            var queryParams = HttpUtility.ParseQueryString(context.Request.Url.Query);
            string tempFilePath = queryParams["tempFilePath"];
            string fileType = queryParams["fileType"];

            string ext = Path.GetExtension(file.FileName);
            string uniqueCode = Guid.NewGuid().ToString("N").Substring(0,8);
            string newFileName = $"{fileType}-{uniqueCode}{ext}";

            string folderPath = context.Server.MapPath($"~/uploads/temp/{tempFilePath}/");
            if (!Directory.Exists(folderPath)) { 
                Directory.CreateDirectory(folderPath);            
            }

            string fullPath = Path.Combine(folderPath, newFileName);
            file.SaveAs(fullPath);

            context.Response.ContentType = "application/json";
            context.Response.Write("{\"fileName\":\"" + newFileName + "\"}");
        }

        private void DeleteFile(HttpContext context, string fileName)
        {
            string infoUserId = context.Request["infoUserId"];
            if (string.IsNullOrEmpty(infoUserId))
            {
                context.Response.StatusCode = 400;
                context.Response.ContentType = "application/json";
                context.Response.Write("{\"error\":\"Missing infoUserId\"}");
                return;
            }

            string folderPath = context.Server.MapPath($"~/uploads/temp/{infoUserId}/");
            string fullPath = Path.Combine(folderPath, fileName);

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                context.Response.ContentType = "application/json";
                context.Response.Write("{\"success\":true}");
            }
            else
            {
                context.Response.StatusCode = 404;
                context.Response.ContentType = "application/json";
                context.Response.Write("{\"error\":\"File not found\"}");
            }
        }
        private string GenerateRandomCode(int length)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }


        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}
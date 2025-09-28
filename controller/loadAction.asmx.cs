using HitcoForm.conn;
using Newtonsoft.Json;
using System;
using System.Web;
using System.Web.Services;

namespace HitcoForm.controller
{
    /// <summary>
    /// Summary description for loadAction
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class loadAction : System.Web.Services.WebService
    {

        [WebMethod(EnableSession = true)]
        public string Actions()
        {
            if (Session["rId"] != null)
            {
                string RI = (string)Session["rId"]; // دریافت مقدار UId از Session

                return dashboard.Actions(RI);
            }
            else
            {
                // بازگرداندن خطا در صورت عدم وجود UId در Session
                return Newtonsoft.Json.JsonConvert.SerializeObject(new { success = false, error = "کاربر لاگین نکرده است." });
            }
        }
        [WebMethod]
        public string getDate(string groupName)
        {
            return dashboard.getDate(groupName);
        }
        [WebMethod(EnableSession = true)]
        public string getFormInitialInfo()
        {
            var year = dashboard.getDate("year");
            var month = dashboard.getDate("month");
            var season = dashboard.getDate("season");
            var urge = dashboard.getDate("urge");
            var status = dashboard.getStatus("status");
            var users = dashboard.getUsers(Session["cId"] != null ? Session["cId"].ToString() : "0");
            var roles = dashboard.getRoles("role");
            var rolesC = dashboard.getRoles("roleC");
            var companies = dashboard.getCompanies("company");
            var units = dashboard.getUnits("unit");
            var unitsC = dashboard.getUnits("unitC");
            
            var forms = dashboard.getForms("form");
            var result = new
            {
                year = year,
                month = month,
                season = season,
                urge = urge,
                users = users,
                status = status,
                companies = companies,
                units = units,
                roles = roles,
                forms = forms,
                unitsC = unitsC,
                rolesC = rolesC

            };
            return JsonConvert.SerializeObject(result);
        }

        [WebMethod(EnableSession = true)]
        public string saveForm25Data(object data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.saveFormData(data, "f25", infoUid);
            return JsonConvert.SerializeObject(a);
        }
        [WebMethod(EnableSession = true)]
        public string saveForm100Data(object data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.saveFormData(data, "f100", infoUid);
            return JsonConvert.SerializeObject(a);
        }
        [WebMethod(EnableSession = true)]
        public string saveForm400Data(object data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.saveFormData(data, "f400", infoUid);
            return JsonConvert.SerializeObject(a);
        }
        [WebMethod(EnableSession = true)]
        public string getFormData(object data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            //var roleId = Session["rId"] != null ? Convert.ToInt32(Session["rId"]) : 0;
            //var roleName_En = Session["roleName_En"] != null ? Session["roleName_En"] : 0;

            var items = dashboard.getFormData(data, infoUid);
            //var month = dashboard.getDate("month");

            var response = new
            {
                data = items["formData"],
                actions = items["actionData"]
                //month = month,
               // roleId = roleId,
                //roleName_En = roleName_En
            };

            return JsonConvert.SerializeObject(response);
        }
        [WebMethod(EnableSession = true)]
        public string getRowFormData(object data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            return JsonConvert.SerializeObject(dashboard.getRowFormData(data, "f25", infoUid));

        }

        [WebMethod(EnableSession = true)]
        public string deleteRowFormData(int formDataId)
        {
            try
            {

                var result = dashboard.deleteRowFormData(formDataId);
                return JsonConvert.SerializeObject("success");
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(ex.Message);
            }
        }

        [WebMethod(EnableSession = true)]
        public string UpdateRowFormData25(object data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            return JsonConvert.SerializeObject(dashboard.UpdateRowFormData(data, "f25", infoUid));
        }
        [WebMethod(EnableSession = true)]
        public string UpdateRowFormData100(object data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            return JsonConvert.SerializeObject(dashboard.UpdateRowFormData(data, "f100", infoUid));
        }
        [WebMethod(EnableSession = true)]
        public string UpdateRowFormData400(object data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            return JsonConvert.SerializeObject(dashboard.UpdateRowFormData(data, "f400", infoUid));
        }

        [WebMethod(EnableSession = true)]
        public string deleteForm25Days(object data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.deleteForm25Days(data, "f25", infoUid);
            return JsonConvert.SerializeObject(a);
        }
        [WebMethod(EnableSession = true)]
        public string deleteForm100Days(object data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.deleteForm25Days(data, "f100", infoUid);
            return JsonConvert.SerializeObject(a);
        }
        [WebMethod(EnableSession = true)]
        public string deleteForm400Days(object data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.deleteForm25Days(data, "f400", infoUid);
            return JsonConvert.SerializeObject(a);
        }
        [WebMethod(EnableSession = true)]
        public string submitForm(object data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.submitForm(data, infoUid);
            return JsonConvert.SerializeObject(a);
        }
        [WebMethod(EnableSession = true)]
        public string returnForm(object data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.returnForm(data, infoUid);
            return JsonConvert.SerializeObject(a);
        }

        [WebMethod(EnableSession = true)]
        public string finalSubmitForm(object data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.finalSubmitForm(data, infoUid);
            return JsonConvert.SerializeObject(a);
        }

        [WebMethod(EnableSession = true)]
        public string formNotif()
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.formNotif(infoUid);
            return a;
        }


        [WebMethod(EnableSession = true)]
        public string SaveProfileImage()
        {
            try
            {
                // دریافت UserId از Session
                var userId = Session["userId"] != null ? Convert.ToInt32(Session["userId"]) : 0;

                if (userId == 0)
                {
                    return JsonConvert.SerializeObject(new { success = false, message = "کاربر نامعتبر است." });
                }

                // فایل ارسال‌شده را دریافت کنید
                HttpPostedFile postedFile = HttpContext.Current.Request.Files["profileImage"];
                if (postedFile != null)
                {
                    // فراخوانی متد ذخیره فایل
                    var result = dashboard.SaveProfileImage(userId, postedFile);

                    return result;
                }

                return JsonConvert.SerializeObject(new { success = false, message = "هیچ فایلی ارسال نشد." });
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { success = false, message = "خطا در ذخیره تصویر: " + ex.Message });
            }
        }
        [WebMethod(EnableSession = true)]
        public string getProfile()
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.getProfile(infoUid);
            return JsonConvert.SerializeObject(a);

        }
        [WebMethod(EnableSession = true)]
        public string changeProfile(object data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.changeProfile(data, infoUid);
            return JsonConvert.SerializeObject(a);

        }

        [WebMethod(EnableSession = true)]
        public string getAllFormData()
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.getAllFormData(infoUid);
            return JsonConvert.SerializeObject(a);

        }

        [WebMethod(EnableSession = true)]
        public string showTblForms(object data)
        {
            var a = dashboard.showTblForms(data);
            return JsonConvert.SerializeObject(a);

        }
        [WebMethod(EnableSession = true)]
        public string changeFormStatus(dynamic data)
        {
            var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.changeFormStatus(data, infoUid);
            return JsonConvert.SerializeObject(a);

        }   
        [WebMethod(EnableSession = true)]
       
        public string getUserData()
        {

            return dashboard.getUserData();
        }

        [WebMethod(EnableSession = true)]
        public string saveUserData(object data)
        {
            //var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.saveUserData(data);
            return JsonConvert.SerializeObject(a);
        }
        [WebMethod(EnableSession = true)]
        public string updateUserData(object data)
        {
            //var infoUid = Session["infoUid"] != null ? Session["infoUid"].ToString() : "0";
            var a = dashboard.updateUserData(data);
            return JsonConvert.SerializeObject(a);
        }  
        [WebMethod(EnableSession = true)]
        public string deleteUserData(int infoUserId)
        {
           
            var a = dashboard.deleteUserData(infoUserId);
            return JsonConvert.SerializeObject(a);
        }
        [WebMethod(EnableSession = true)]
        public string getDataAccessBi(string userId)
        {

            return dashboard.getDataAccessBi(userId);
        }


    }

}

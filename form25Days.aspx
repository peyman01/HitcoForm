<%@ Page Title="" Language="C#" MasterPageFile="~/MP.Master" AutoEventWireup="true" CodeBehind="form25Days.aspx.cs" Inherits="HitcoForm.form25Days" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <main class="main-content form25Create">
        <header>
            <div class="headerTitle">
                <div class="dashDate" id="currentDate"></div>
                <div class="dashTitle">
                    <p class="subTop">سامانه ثبت فرم ها</p>
                    <p class="subEnd">هلدینگ تامین سرمایه سلامت</p>
                </div>
            </div>
            <div class="infoSection">
                <div class="userInfoTbl">
                    <div class="infoRight">
                        <div class="userCo" id="userCo"><%= Session["companyName"].ToString() %></div>
                        <div class="userinfo">
                            <div class="client">
                                <p>نام و نام خانوادگی :</p>
                                <small class="clientName"><%= Session["firstName"] != null ? Session["firstName"].ToString()+' '+Session["lastName"].ToString(): "کاربر مهمان" %></small>
                            </div>
                            <div class="roleSection">
                                <p>سمت سازمانی :</p>
                                <small class="roleName"><%= Session["roleName"].ToString() %></small>
                            </div>
                        </div>
                    </div>
                    <div class="vertical-line"></div>
                    <div class="dateSubmite">
                        <div class="choseDate">
                            <p>تاریخ مورد نظر را انتخاب نمایید :</p>
                            <div class="date">
                                <div id="myMonth"></div>
                                <div id="myYear"></div>
                            </div>
                        </div>
                        <div class="introDate" id="introDate">
                        </div>
                    </div>
                </div>
                <div class="intro">
                 
                    <div class="import">
                        <p>اولویت هر فعالیت با رنگ‌های زیر قابل نمایش است:</p>
                        <div class="colorImport">
                            <div class="red">مهم - فـوری</div>
                            <div class="blue">غیر مهم - فـوری</div>
                            <div class="yellow">مهم - غیر فـوری</div>
                            <div class="green">غیر مهم - غیر فـوری</div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <div id="toast" class="toast"></div>
        <div class="fillForm" id="fillForm25Days">
            <div class="" id="headerForm25Days"></div>
            <div class="" id="form25Days"></div>
            <div class="formActionBtn" id="footerForm25Days"><div class="btnActionTbl" id="btnActionTbl"></div><div id="btnActionTblStatus"></div></div>
        </div>
        <div class="dialog-overlay" id="dialogOverlay">
            <div class="dialog-box" id="dialog-box">
            </div>
        </div>
    </main>

    <script>
        $(document).ready(function () {

            
            //const action = getUrlParam('action')
            //debugger

            //if (action && typeof window[action] === "function") {
            //    window[action]();
            //} else {
            //    console.warn(`Action "${action}" is not defined or not a function.`);
            //}

            //formDate();
            document.getElementById("currentDate").innerText = `امروز: ${displayCurrentJalaliDate()}`;

            window.sessionData = {
                firstName: '<%= Session["firstName"] %>',
            lastName: '<%= Session["lastName"] %>'
        };
        });
       
    </script>
</asp:Content>

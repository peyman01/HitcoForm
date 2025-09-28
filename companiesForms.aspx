<%@ Page Title="" Language="C#" MasterPageFile="~/MP.Master" AutoEventWireup="true" CodeBehind="companiesForms.aspx.cs" Inherits="HitcoForm.companiesForms" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <main class="main-content">
        <header>
            <div class="headerTitle">
                <div class="dashDate" id="currentDate"></div>
                <div class="dashTitle">
                    <p class="subTop">سامانه ثبت فرم ها</p>
                    <p class="subEnd">هلدینگ تامین سرمایه سلامت</p>
                </div>
            </div>
            <div class="infoSection">
                <div class="userInfoTblCeo">
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
                    <div class="combos">
                        <div class="choseDate">
                            <div id="month"></div>
                            <div id="season"></div>
                            <div id="year"></div>
                            <div id="companies"></div>
                            <div id="form"></div>
                            <div id="clearFilter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-funnel" viewBox="0 0 16 16">
                                     <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="introDate" id="introDate">
                        </div>
                    </div>
                </div>
            </div>
        </header>


        <div class="fillForms" id="forms">
            
            <div class="fFT" id="fFT">
                <div class="FormTitleDetails"  id="formsDetailsHeader"></div>
                <div class="iconBack" onclick="showAllFormsOfCompanies()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#3a7b9b" class="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                    </svg>
                </div>
            </div>
            <div class="fillFormTitle" id="formsHeader">مشاهده لیست فرم های کلیه شرکت های هلدینگ</div>
            <div class="" id="companyForms"></div>
            <div class="" id="companyFormsDetails"></div>
            <div class="" id="footerViewForm25Days"></div>
        </div>
        <div id="toast" class="toast"></div>
    <div class="dialog-overlay" id="dialogOverlay">
        <div class="dialog-box" id="dialog-box"></div>
    </div>
    </main>

    <script>
        $(document).ready(function () {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);

            const action = urlParams.get('action');

            if (action && typeof window[action] === "function") {
                window[action]();
            } else {
                console.warn(`Action "${action}" is not defined or not a function.`);
            }

            formDate();
        });
        displayCurrentJalaliDate()
        showAllFormsOfCompanies()

    </script>
</asp:Content>

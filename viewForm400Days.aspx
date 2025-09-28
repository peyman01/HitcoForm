<%@ Page Title="" Language="C#" MasterPageFile="~/MP.Master" AutoEventWireup="true" CodeBehind="viewForm400Days.aspx.cs" Inherits="HitcoForm.viewForm400Days" %>

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
                                <div id="myYear"></div>
                            </div>
                        </div>
                        <div class="introDate" id="introDate">
                        </div>
                    </div>
                </div>
                <div class="intro">
                    <div class="guideline">
                        <p class="guidTitle">با رعایت این مراحل، می‌توانید فرم خود را به‌سادگی تکمیل کنید.</p>
                        <ol>
                            <li>ابتدا ماه مورد نظر خود را انتخاب کنید.</li>
                            <li>اطلاعات مربوط به هر ردیف فعالیت را در فیلدهای مشخص‌شده وارد نمایید.</li>
                            <li>اگر فرم شما نیاز به ویرایش بیشتری دارد و هنوز نهایی نشده است، می‌توانید با استفاده از
                        دکمه
                        «ذخیره فرم» اطلاعات خود را ذخیره کرده و در زمان دیگری ویرایش کنید.</li>
                            <li>توجه داشته باشید که تنها با کلیک بر روی دکمه «ارسال و ثبت نهایی»، فرم شما به صورت قطعی
                        ثبت و
                        ارسال خواهد شد.</li>
                        </ol>
                    </div>
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


        <div class="viewForm25days" id="viewForm400DaysMain">
            <div class="" id="headerViewForm400Days"></div>
            <div class="" id="viewForm400Days"></div>
            <%-- <div class="" id="footerViewForm25Days"></div>--%>
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
        document.getElementById("currentDate").innerText = `امروز: ${displayCurrentJalaliDate()}`;

    </script>
</asp:Content>

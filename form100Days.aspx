<%@ Page Title="" Language="C#" MasterPageFile="~/MP.Master" AutoEventWireup="true" CodeBehind="form100Days.aspx.cs" Inherits="HitcoForm.form100Days" %>

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
                                <div id="mySeason"></div>
                                <div id="myYear"></div>
                            </div>
                        </div>
                        <div class="introDate" id="introDate"></div>
                    </div>
                </div>
                <div class="intro">
                    <div class="guideline">
                        <p class="guidTitle">
                            با رعایت این مراحل، می&zwnj;توانید فرم خود را به&zwnj;سادگی تکمیل کنید.
                        </p>
                        <ol>
                            <li>ابتدا ماه مورد نظر خود را انتخاب کنید.</li>
                            <li>اطلاعات مربوط به هر ردیف فعالیت را در فیلدهای مشخص&zwnj;شده وارد نمایید.</li>
                            <li>اگر فرم شما نیاز به ویرایش بیشتری دارد و هنوز نهایی نشده است، می&zwnj;توانید با
                                    استفاده از
                                    دکمه
                                    «ذخیره فرم» اطلاعات خود را ذخیره کرده و در زمان دیگری ویرایش کنید.</li>
                            <li>توجه داشته باشید که تنها با کلیک بر روی دکمه «ارسال و ثبت نهایی»، فرم شما به صورت
                                    قطعی
                                    ثبت و
                                    ارسال خواهد شد.</li>
                        </ol>
                    </div>
                    <div class="import">
                        <p>اولویت هر فعالیت با رنگ&zwnj;های زیر قابل نمایش است:</p>
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
        <div class="fillForm" id="fillForm100Days">
            <div class="" id="headerForm100Days"></div>
            <div class="" id="form100Days"></div>
            <div class="" id="footerForm100Days"></div>
        </div>
        
        <div class="dialog-overlay" id="dialogOverlay">
            <div class="dialog-box" id="dialog-box">
            </div>
        </div>
        <div id="toast" class="toast"></div>
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

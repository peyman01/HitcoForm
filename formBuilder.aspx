<%@ Page Title="" Language="C#" MasterPageFile="~/MP.Master" AutoEventWireup="true" CodeBehind="formBuilder.aspx.cs" Inherits="HitcoForm.formBuilder" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <link href="css/formBuilder.css" rel="stylesheet" />
    <script src="js/formBuilder.js"></script>
    <main class="main-content">
        <header>
            <div class="topbar">
                <div class="dashDate" id="currentDate"></div>
                <div class="dashTitle">
                    <p class="subTop">سامانه ثبت فرم ها</p>
                    <p class="subEnd">هلدینگ تامین سرمایه سلامت</p>
                </div>
            </div>
            <div class="bottombar">
                <div class="profile">
                    <%--<input type="file" id="profileImage" value="" style="display: none" />--%>
                    <div class="profileSetting">
                        <div class="profileLogo" id="profileLogo">
                            <img class="proLogo" src="#" alt="">
                            <%--<img class="editeIcnImg" src="image/imageEdite.png" alt="">--%>
                        </div>
                        <a class="EditeProfile" href="userProfile.aspx">
                            <img class="editeIcon" src="image/editprofile.png" />
                            <p>ویرایش پروفایل</p>
                        </a>
                    </div>
                    <div class="profileTitle">
                        <div class="username" id="fullname"><%= Session["firstName"] != null ? Session["firstName"].ToString()+' '+Session["lastName"].ToString(): "کاربر مهمان" %></div>
                        <div class="Co-Role"><%= Session["roleName"].ToString() %> | <%= Session["companyName"].ToString() %></div>
                    </div>
                </div>
                <%--<div class="lastSeen">آخرین بازدید : 1403/09/03</div>--%>
            </div>
        </header>


        <h2>فرم ساز</h2>

        <div class="wrapper">
            <div id="toolbox">
                <label>افزودن ردیف با تعداد ستون:</label>
                <div class="sections">
                    <div class="secBtn" onclick="addRow(1)">1 ستون</div>
                    <div class="secBtn" onclick="addRow(2)">2 ستون</div>
                    <div class="secBtn" onclick="addRow(3)">3 ستون</div>
                    <div class="secBtn" onclick="addRow(4)">4 ستون</div>
                    <div class="secBtn" onclick="addRow(5)">5 ستون</div>
                    <div class="secBtn" onclick="addRow(6)">6 ستون</div>
                </div>
                <div class="widget" data-type="text">
                    <div class="widgetText">Input</div>
                    <div class="widgetIcon">
                        <img src="image/inputs.png" alt="" />
                    </div>
                </div>
                <div class="widget" data-type="button">
                    <div class="widgetText">Button</div>
                    <div class="widgetIcon">
                        <img src="image/press-button.png" alt="" />
                    </div>
                </div>
                <div class="widget" data-type="select">
                    <div class="widgetText">Select Box</div>
                    <div class="widgetIcon">
                        <img src="image/dr-Down.png" alt="" />
                    </div>
                </div>
            </div>
            <div id="canvas">
                <div class="formHeader">
                    <input type="text" placeholder="اسم فرم را وارد نمایید" value="" />
                    <div class="submitForm" id="submitForm">ذخیره فرم</div>
                </div>

                <div id="formBuild"></div>
            </div>
        </div>

        <div id="widgetSettingsPanel">
            <div class="closeSettingPanel">
                <svg id="closeBtn" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-x-square" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
            </div>
            <h4>تنظیمات ویجت</h4>
            <div id="settingsContent"></div>
            <button id="applySettingsBtn">اعمال تغییرات</button>
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

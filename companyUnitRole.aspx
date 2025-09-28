<%@ Page Title="" Language="C#" MasterPageFile="~/MP.Master" AutoEventWireup="true" CodeBehind="companyUnitRole.aspx.cs" Inherits="HitcoForm.companyUnitRole" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
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
                            <p>پنل مدیریت کاربران</p>
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

        <section class="content-area">
            <div class="menuName">افزودن و ویرایش شرکت/واحد/سمت سازمانی</div>
            <div id="panelCompanyUnitRole">
                <div class="rowOne">
                    <div class="tCompanies" id="tCompanies">1</div>
                    <div class="tUnits" id="tUnits">2</div>
                </div>
                <div class="rowOne">
                    <div class="tRoles" id="tRoles">3</div>
                    <div class="empty"></div>
                </div>
            </div>
        </section>
        <div id="toast" class="toast"></div>
    </main>

    <script>
        $(document).ready(function () {
            displayCurrentJalaliDate();

        });
    </script>
</asp:Content>

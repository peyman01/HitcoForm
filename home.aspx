<%@ Page Title="" Language="C#" MasterPageFile="~/MP.Master" AutoEventWireup="true" CodeBehind="home.aspx.cs" Inherits="HitcoForm.home" %>

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

        <section class="content-area">
            <div class="menuName">داشبورد</div>
            <div class="boxes" id="notifboard">
                <div class="leftbox" id="leftBox"></div>
                <div id="rightBox"></div>

                <%-- <div class="activities">
                        <div class="rightactivities">
                            <p class="topra">تعداد فعالیت های ثبت شده در ماه اخیر</p>
                            <p class="bottonra">13 فعالیت</p>
                        </div>
                        <div class="leftactivities">
                            <img src="image/1.png" alt="">
                        </div>
                    </div> --%>
            </div>
            <div id="toast" class="toast"></div>
        </section>

    </main>

    <script>
        $(document).ready(function () {
            formNotification()
            displayCurrentJalaliDate()
            openProfileImage()
        });
    </script>
</asp:Content>

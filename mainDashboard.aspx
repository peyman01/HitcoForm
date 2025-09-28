<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="mainDashboard.aspx.cs" Inherits="HitcoForm.mainDashboard" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
     <link rel="icon" type="image/png" href="image/fav.png">
    <link href="css/mainDashboard.css" rel="stylesheet" />
    <link rel="stylesheet" href="css/dx.light.css" />

    <title></title>
</head>
<body>
    <div class="mainContainer">
        <div id="contentArea">

            <div class="topBack">
                <div class="colRight">
                    <a href="#" class="siteUrl" target="_blank" rel="noopener noreferrer">سامانه آنلاین هیتکو</a>
                </div>

                <div class="colMiddle">داشبورد</div>
                <div class="colLeft">
                    <a class="profile"  href="profile.aspx">
                        <span class="userN" id="profileLogo"><%=Session["firstName"].ToString()+' '+Session["lastName"].ToString()%></span>
                        <span class="userP profileLogo">
                            <img class="proLogo" src="#" alt="" />
                        </span>
                    </a>
                    <div class="env" style="display:none">
                        <img src="image/env.png" alt="" />
                    </div>
                    <div class="notif" style="display:none">
                        <img src="image/notif.png" alt="" />
                    </div>
                </div>

            </div>
            <div class="mainContent page" id="mainContent">

                <div class="mCRight">
                    <div class="showBox">
                        <div class="showBoxRight" onclick="apiRequest('bi')">
                            <div class="icnShowSite">
                                <img src="image/Bi.png" alt="" />
                            </div>
                            <a class="titleShowSite">سامانه فروش</a>
                        </div>
                        <div class="showBoxRight" onclick="window.location.href='home.aspx'">
                            <div class="icnShowSite">
                                <img src="image/formsIcon.png" alt="" />
                            </div>
                            <a class="titleShowSite">فرم ها</a>
                        </div>
                        <div class="showBoxRight" onclick="" style="background: darkgray;cursor: no-drop;">
                            <div class="icnShowSite">
                                <img src="image/site.png" alt="" />
                            </div>
                            <a class="titleShowSite">پنل وب سایت</a>
                        </div>
                    </div>
                    <div class="menuBox" id="menuBox"></div>
                </div>
            </div>
        </div>
    </div>
    <script src="js/jquery.min.js"></script>
     <script src="js/dx.all.js"></script>
    <script src="js/mainDashboard.js"></script>
    <script src="js/main.js"></script>
</body>
</html>

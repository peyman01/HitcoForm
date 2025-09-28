<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="login.aspx.cs" Inherits="HitcoForm.login1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="icon" type="image/png" href="image/fav.png" />
    <link rel="stylesheet" href="css/login.css" />
    <link rel="stylesheet" href="css/dx.light.css"/>
    <script src="js/jquery.min.js"></script>
    <script src="js/login.js"></script>
    <script src="js/dx.all.js"></script>
</head>
<body>
    <form id="form1" runat="server">
        <div class="container">
            <div class="headerLogin">
                <div class="headerLogo">
                    <img class="hitcoLogo" src="image/logos.png" alt="" />
                </div>
                <div class="headerTitle">
                    <div class="topHeaderTitle">
                        <div class="topTitle">سامانه هوش کسب و کار</div>
                        <div class="endTitle">هلدینگ تامین سرمایه سلامت</div>
                    </div>
                    <div class="bottonHeaderTitle">ورود به سامانه </div>
                </div>
                <div class="headerDate" id="currentDate"></div>
            </div>
            <div class="login-form">
                <h3 class="wellcome">خوش آمدید!</h3>
                <p class="wellDesc">جهت ورود به سامانه، نام کاربری و گذرواژه خود را وارد نمایید.</p>
                <div class="form">
                    <label for="username">نام کاربری</label>
                    <input type="text" id="user" value="" placeholder="نام کاربری " />

                    <label for="password">گذرواژه</label>
                    <input type="password" id="password" value="" placeholder="گذرواژه" />
                    <div class="passToggle" onclick="passwordType()">
                        <img id="passHide" src="image/eyeHide.png" alt="" />
                        <img id="passShow" src="image/eye.png" alt="" style="display: none;" />
                    </div>

                    <%--<div class="remember-me">
                        <!-- <input type="checkbox" id="remember" checked> -->
                        <div class="toggle-switch">
                            <input type="checkbox" id="remember" class="toggle-input" />
                            <label for="remember" class="slider"></label>
                            <span class="toggle-label">من را به خاطر بسپار!</span>
                        </div>
                    </div>--%>

                    <button type="button" id="loginBtn">ورود</button>
                    <%--<div class="bottonForm">
                        <div class="extraServices">
                            <div class="changPassword" onclick="popupPass()">کلمه عبور</div> خود را فراموش کرده اید!
                        </div>
                        <p class="extraServices">
                            اکانت ندارم! <a href="signUp.aspx">عضویت</a>
                        </p>
                    </div>--%>
                </div>
            </div>
        </div>

        <div id="toast" class="toast"></div>
        <div id="passPopup"></div>
    </form>

    <script>
        displayCurrentJalaliDate();
    </script>
</body>
</html>

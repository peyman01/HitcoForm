<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="login.aspx.cs" Inherits="Web_Services.login" %>


<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="icon" type="image/png" href="image/fav.png" />
    <link rel="stylesheet" href="css/login.css" />
    <script src="jquery-3.7.1.min.js"></script>
    <script src="scripts/login.js"></script>
</head>
<body>
    <form id="form1" runat="server">
        <div class="container">
            <div class="headerLogin">
                <div class="headerLogo">
                    <img class="hitcoLogo" src="image/logos.png" alt=""/>
                </div>
                <div class="headerTitle">
                    <div class="topHeaderTitle">
                        <div class="topTitle"></div>
                        <div class="endTitle">هلدینگ تامین سرمایه سلامت(test)</div>
                    </div>
                    <div class="bottonHeaderTitle">ورود به سامانه </div>
                </div>
                <div class="headerDate" id="currentDate"></div>
            </div>
            <div class="login-form">
                <h3 class="wellcome">خوش آمدید!</h3>
                <p class="wellDesc">جهت ورود به سامانه، نام کاربری و رمز عبور خود را وارد نمایید.</p>
                <div class="form">
                    <label for="username">نام کاربری</label>
                    <input type="text" id="user" value="" placeholder="نام کاربری "/>

                    <label for="password">کلمه عبور</label>
                    <input type="password" id="password" value="" placeholder="کلمه عبور"/>
                    <div class="passToggle" onclick="passwordType()">
                        <img id="passHide" src="image/eyeHide.png" alt="" />
                        <img id="passShow" src="image/eye.png" alt="" style="display: none;" />
                    </div>

                    <div class="remember-me">
                        <!-- <input type="checkbox" id="remember" checked> -->
                        <div class="toggle-switch">
                            <input type="checkbox" id="remember" class="toggle-input"/>
                            <label for="remember" class="slider"></label>
                            <span class="toggle-label">من را به خاطر بسپار!</span>
                        </div>
                    </div>

                    <button type="button"  id="loginBtn">ورود</button>
                    <a href="#" class="forgot-password">برای تغییر رمز با واحد پشتیبانی تماس بگیرید.</a>
                </div>
            </div>
        </div>

        <div id="toast" class="toast"></div>
    </form>

    <script>
        displayCurrentJalaliDate();
    </script>
</body>
</html>

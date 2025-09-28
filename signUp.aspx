<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="signUp.aspx.cs" Inherits="HitcoForm.signUp" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">

<head runat="server">
    <title></title>
    <link rel="icon" type="image/png" href="image/fav.png" />
    <link rel="stylesheet" href="css/signUp.css" />
    <link rel="stylesheet" href="css/dx.light.css" />
    <script src="js/jquery.min.js"></script>
    <script src="js/signUp.js"></script>
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
                        <div class="topTitle">سامانه ثبت فرم ها</div>
                        <div class="endTitle">هلدینک تامین سرمایه سلامت</div>
                    </div>
                    <div class="bottonHeaderTitle">ورود به سامانه </div>
                </div>
                <div class="headerDate" id="currentDate"></div>
            </div>
            <div class="login-form" id="signUp">
                <h3 class="wellcome">ایجاد اکانت جدید</h3>
                <p class="wellDesc">
                    از قبل حساب کاربری دارید؟ <a href="login.aspx">وارد شوید</a>
                </p>
                <div class="form">
                    <div class="fullName">
                        <div class="firstName">
                            <label for="name">نام</label>
                            <input type="text" id="firstName" value="" placeholder="نام " />
                        </div>
                        <div class="lastName">
                            <label for="lastName">نام خانوادگی</label>
                            <input type="text" id="lastName" value="" placeholder="نام خانوادگی" />
                        </div>
                    </div>

                    <label for="email">ایمیل</label>
                    <input type="email" id="email" value="" placeholder="ایمیل" />
                    <label for="email">نام کاربری</label>
                    <input type="text" id="username" value="" placeholder="نام کاربری" />

                    <div class="password">
                        <div class="pass">
                            <label for="pass">رمز عبور</label>
                            <input type="text" id="pass" value="" placeholder="رمز عبور" />
                        </div>
                        <div class="passRep">
                            <label for="passRep">تکرار رمز عبور</label>
                            <input type="text" id="passRep" value="" placeholder="تکرار رمز عبور" />
                        </div>
                    </div>

                    <div class="passToggle" onclick="passwordType()">
                        <img id="passHide" src="image/eyeHide.png" alt="" />
                        <img id="passShow" src="image/eye.png" alt="" style="display: none;" />
                    </div>
                    <div class="passToggleRe" onclick="passwordType()">
                        <img id="passHideTow" src="image/eyeHide.png" alt="" />
                        <img id="passShowTow" src="image/eye.png" alt="" style="display: none;" />
                    </div>

                    <div class="signUpBtn">
                        <button type="button" id="signInBtn">ایجاد اکانت</button>
                        <p class="wellDesc">
                            از قبل حساب کاربری دارید؟ <a href="login.aspx">وارد شوید</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div id="toast" class="toast"></div>
        <div id="notification"></div>
    </form>

    <script>
        displayCurrentJalaliDate();
    </script>
</body>

</html>

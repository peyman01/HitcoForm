<%@ Page Title="" Language="C#" MasterPageFile="~/MP.Master" AutoEventWireup="true" CodeBehind="userProfile.aspx.cs" Inherits="HitcoForm.userProfile" %>

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
            <div class="botBar">
                <div class="profile">
                    <input type="file" id="profileImage" value="" style="display: none" />
                    <div class="profileSetting">
                        <div class="profileLogo" id="profileLogo">
                            <img class="proLogo" src="" alt="">
                            <img class="editeIcnImg" src="image/imageEdite.png" alt="">
                        </div>
                        <a class="EditeProfile" href="userProfile.aspx">
                            <img class="editeIcon" src="image/editprofile.png" />
                            <p>تغییر عکس پروفایل</p>
                        </a>
                    </div>
                    <div class="profileTitle">
                        <div class="username" id="fullname"><%= Session["firstName"] != null ? Session["firstName"].ToString()+' '+Session["lastName"].ToString(): "کاربر مهمان" %></div>
                        <div class="Co-Role"><%= Session["roleName"].ToString() %> | <%= Session["companyName"].ToString() %></div>
                    </div>
                </div>
                <p class="profileTitle">ویرایش پروفایل</p>
                <div class="editeProfileInfo">
                    <div class="columPro">
                        <label class="label" for="profileFirsName">نام</label>
                        <input id="firstName" class="profileFirsName" type="text" name="name" value="" placeholder="نام" disabled/>
                    </div>
                    <div class="columPro">
                        <label class="label" for="profileFirsName">نام خانوادگی</label>
                        <input id="lastName" class="profileLastName" type="text" name="name" value="" placeholder="نام خانوادگی" disabled/>
                    </div>
                    <div class="columPro">
                        <label for="profileFirsName">نام کاربری</label>
                        <input id="username" class="profileUsername" type="text" name="name" value="" placeholder="نام کاربری" disabled/>
                    </div>
                    <div class="columPro">
                        <label class="label" for="profileFirsName">نام شرکت</label>
                        <input id="company" class="profileFirsName" type="text" name="name" value="" placeholder="نام شرکت" disabled/>
                    </div>
                    <div class="columPro">
                        <label class="label" for="profileFirsName">نام واحد</label>
                        <input id="units" class="profileFirsName" type="text" name="name" value="" placeholder="نام واحد" disabled/>
                    </div>
                    <div class="columPro">
                        <label class="label" for="profileFirsName">سمت سازمانی </label>
                        <input id="roles" class="profileFirsName" type="text" name="name" value="" placeholder="سمت سازمانی" disabled/>
                    </div>
                    <div class="columProS">
                        <label class="label" for="profileFirsName">ایمیل</label>
                        <input id="email" class="profileEmail" type="email" name="name" value="" placeholder="ایمیل" />
                    </div>
                    <div class="columProS">
                        <label class="label" for="profileFirsName">شماره همراه</label>
                        <input id="phone" class="profileTel" type="tel" name="name" value="" placeholder="شماره همراه" />
                    </div>
                </div>
                <p class="profilePass">تغییر گذرواژه</p>
                <div class="passSection">
                    <div class="changePass">
                        <div class="columPass">
                            <label class="label" for="lastPass">گذرواژه قبلی</label>
                            <input id="lastPass" class="lastPass" type="text" name="name" value="" placeholder="گذرواژه قبلی" />
                        </div>
                    </div>
                    <div class="changePass">
                        <div class="columPass">
                            <label class="label" for="newPass">گذرواژه جدید </label>
                            <input id="passwordTwo" class="newPass" type="password" name="name" value="" placeholder="گذرواژه جدید" />
                            <div class="passToggleRe" onclick="passwordTypeTwo()">
                                <img id="passHideTow" src="image/eyeHide.png" alt="" />
                                <img id="passShowTow" src="image/eye.png" alt="" style="display: none;" />
                            </div>
                        </div>
                        <div class="columPass">
                            <label class="label" for="repeatPass">تکرار گذرواژه </label>
                            <input id="passwordOne" class="repeatPass" type="password" name="name" value="" placeholder="تکرار گذرواژه" />
                            <div class="passToggle" onclick="passwordTypeOne()">
                                <img id="passHide" src="image/eyeHide.png" alt="" />
                                <img id="passShow" src="image/eye.png" alt="" style="display: none;" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="submitChange">
                    <div class="btnSub"  onclick="changeProfile()">ذخیره تغییرات</div>
                </div>
            </div>
        </header>
        <div id="toast" class="toast"></div>
    </main>
    <script>
        document.getElementById("currentDate").innerText = `امروز: ${displayCurrentJalaliDate()}`;
        openProfileImage()
        profile();
    </script>
</asp:Content>

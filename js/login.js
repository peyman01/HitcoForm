$(document).ready(function () {
    $("#loginBtn").on("click", function () {
        valLoginInput();
    });
    $("#user, #password").keydown(function (event) {
        if (event.key === "Enter") {
            valLoginInput();
        }
    });
})


//toast

function validateInput() {
    const input = document.getElementById("userInput").value;
    
    // Simple validation example: check if input is empty or contains only numbers
    if (input === "" || !isNaN(input)) {
        showToast("Invalid input. Please enter a valid text.");
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message; 
    toast.classList.add("show"); 

    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
    }, 5000);
}

function passwordType() {
    let pass = $("#password");
    let passShow = $("#passShow");
    let passHide = $("#passHide");
    
    if (pass.attr("type") === "password") {
        pass.attr("type", "text");
        passShow.show(); 
        passHide.hide(); 
    } else {
        pass.attr("type", "password");
        passHide.show();
        passShow.hide(); 
    }
}

function valLoginInput(){
    let user=$("#user").val().trim();
    let pass=$("#password").val().trim();

    if(user=="" || pass==""){
        showToast("لطفا فیلد های خالی را پر کنید")
        return
    }


    let userLogin={
        username:user,
        password:pass
    }

    $.ajax({
        url: '../controller/userlogin.asmx/Login',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(userLogin),
        success: function (response) {
            var result = JSON.parse(response.d);
            if (result.success) {
                $("#toast").css("background", "#48bb782b")
                $("#toast").css("border", "2px solid #48BB78")
                showToast(result.message)
                
                //window.location.href = "home.aspx";
                const params = new URLSearchParams(window.location.search);
                const returnUrl = params.get('returnUrl');

                if (returnUrl) {
                    window.location.href = decodeURIComponent(returnUrl);
                } else {
                    window.location.href = "mainDashboard.aspx";
                }
                
            } else (
                showToast(result.message)
            )
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });

}

function popupPass() {
    const popup = $('#passPopup')
        .dxPopup({
            width: 500,
            height: 500,
            visible: false,
            title: 'تغییر گذرواژه',
            hideOnOutsideClick: true,
            rtlEnabled: true,
            showCloseButton: true,
            toolbarItems: [
                {
                    widget: 'dxButton',
                    toolbar: 'bottom',
                    location: 'center',
                    options: {
                        width: 300,
                        text: 'ذخیره',
                        type: 'default',
                        stylingMode: 'contained',
                        elementAttr: {
                            class: 'popup-button'
                        },
                        onClick() {
                            let lastPass = $("#lastPass").val()
                            let newPass = $("#passwordOne").val()
                            let repeatPass = $("#passwordTwo").val()

                            var data = {
                                lastPass: lastPass,
                                newPass: newPass
                            }

                            if (newPass = !repeatPass || lastPass.length == "") {
                                showToast("گذرواژه جدید و تکرار گذرواژه یکی نمی باشد یا گذرواژه قدیمی اشتباه می باشد.")
                            }
                            $.ajax({
                                url: 'controller/loadAction.asmx/changepass',
                                type: 'POST',
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                data: JSON.stringify({ data: data }),
                                success: function (response) {
                                    var result = JSON.parse(JSON.parse(response.d));
                                    var message = result.message
                                    $("#toast").css("background", "#48bb782b")
                                    $("#toast").css("border", "2px solid #48BB78")
                                    showToast(message)
                                },
                                error: function (xhr, status, error) {

                                }
                            });
                            popup.hide();
                        },
                    },
                },
            ],
            contentTemplate() {
                const htmlPopup =`<div class="passSection">
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
                </div>`

                return htmlPopup;
            },
        })
        .dxPopup('instance');

    popup.show();
}

function passwordTypeTwo() {
    let passTwo = $("#passwordTwo");

    let passShowTwo = $("#passShowTow");
    let passHideTwo = $("#passHideTow");


    if (passTwo.attr("type") === "password") {
        passTwo.attr("type", "text");
        passShowTwo.show();
        passHideTwo.hide();
    } else {
        passTwo.attr("type", "password");
        passHideTwo.show();
        passShowTwo.hide();
    }
}
function passwordTypeOne() {
    let passOne = $("#passwordOne");

    let passShowOne = $("#passShow");
    let passHideOne = $("#passHide");

    if (passOne.attr("type") === "password") {
        passOne.attr("type", "text");
        passShowOne.show();
        passHideOne.hide();
    } else {
        passOne.attr("type", "password");
        passHideOne.show();
        passShowOne.hide();
    }

}

///// get current time
function gregorianToJalali(gy, gm, gd) {
    const g_days_in_month = [31, (gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    let jy = (gy > 1600) ? 979 : 0;
    gy -= (gy > 1600) ? 1600 : 621;
    let gy_day_no = 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400);
    for (let i = 0; i < gm - 1; ++i) gy_day_no += g_days_in_month[i];
    gy_day_no += gd - 1;

    let j_day_no = gy_day_no - 79;
    let j_np = Math.floor(j_day_no / 12053);
    j_day_no %= 12053;

    jy += 33 * j_np + 4 * Math.floor(j_day_no / 1461);
    j_day_no %= 1461;

    if (j_day_no >= 366) {
        jy += Math.floor((j_day_no - 1) / 365);
        j_day_no = (j_day_no - 1) % 365;
    }

    let jm, jd;
    for (let i = 0; i < 11 && j_day_no >= j_days_in_month[i]; ++i) {
        j_day_no -= j_days_in_month[i];
        jm = i + 2; // ماه‌ها از 1 شروع می‌شوند
    }
    jd = j_day_no + 1;
    return [jy, jm, jd];
}

function displayCurrentJalaliDate() {
    const today = new Date();
    const gy = today.getFullYear();
    const gm = today.getMonth() + 1; // ماه‌ها در جاوااسکریپت از 0 شروع می‌شوند
    const gd = today.getDate();

    // تبدیل به شمسی
    const [jy, jm, jd] = gregorianToJalali(gy, gm, gd);

    // نمایش تاریخ به صورت فرمت صحیح
    const jalaliDate = `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
    document.getElementById("currentDate").innerText = `امروز: ${jalaliDate}`;
}
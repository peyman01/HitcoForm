var popup;
$(document).ready(function () {
    $("#signInBtn").on("click", function () {
        signUp();
    });
    $("#name, #lastName, #email,#username,#pass,#passRep").keydown(function (event) {
        if (event.key === "Enter") {
            signUp();
        }
    });

    popup = $("#notification").dxPopup({
        width: 350,
         height:"auto",
        title: "کاربر گرامی",
        contentTemplate: function (contentElement) {
            contentElement.append("<p style='text-align:justify; line-height: 2;'>ثبت نام با موفقیت انجام گردید. در چند روز آینده دسترسی های لازم برای شما اعمال می شود و از طریق واحد بیزینس ساپورت چارگون زده خواهد شد. با تشکر از صبوری شما.</p>");
            contentElement.append("<a href='login.aspx' class='btn-backToLogin'>بازگشت به صفحه ورد به سامانه</a>");
        },
        showCloseButton: true,
        dragEnabled: false,
        closeOnOutsideClick: false,
        visible: false, 
        rtlEnabled: true, // فعال کردن حالت راست‌چین
        position: {
            my: "center",
            at: "center",
            of: window
        },
        onContentReady: function (e) {
            $(e.component.$content()).addClass("custom-popup"); // ✅ کلاس اضافه می‌شود
        }
        
    }).dxPopup("instance"); // Store the instance

    // Close button inside the popup
    $(document).on("click", "#closeNotification", function () {
        $("#notification").fadeOut(300, function () {
            popup.hide();
        });
    })
})



function signUp(res) {
  
    let firstName = $("#firstName").val();
    let lastName =$("#lastName").val();
    let email =$("#email").val();
    let username =$("#username").val();
    let pass =$("#pass").val();
    let passRep = $("#passRep").val();

    let data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        pass: pass
    }


    if (pass !== passRep) {
        showToast(".رمز و تکرار رمز یکی نمی باشد","error")
        return
    }

   
    $.ajax({
        url: '../controller/userSignUp.asmx/SignUp',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({ data: data }),
        success: function (response) {
            var result = JSON.parse(response.d);
            var res=result.userData
                $("#signUp").slideUp()
            $("#notification").fadeOut(500, function () {
                popup.option("title", `کاربر عزیز ${res.firstName} ${res.lastName}`);
                popup.option("visible", true);
            });

        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });

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
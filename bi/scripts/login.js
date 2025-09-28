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

function valLoginInput() {
    let user = $("#user").val().trim();
    let pass = $("#password").val().trim();

    if (user == "" || pass == "") {
        showToast("لطفا فیلد های خالی را پر کنید")
        return
    }


    let userLogin = {
        username: user,
        password: pass
    }

    $.ajax({
        url: 'controller/userlogin.asmx/Login',
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
                window.location.href = "serviceAdmin.aspx";
                
            } else (
                showToast(result.message)
            )
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });

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
    console.log([jy, jm, jd]);

    // نمایش تاریخ به صورت فرمت صحیح
    const jalaliDate = `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
    const currentStockDate = `${jy}${String(jm).padStart(2, '0')}${String(jd).padStart(2, '0')}`;
    document.getElementById("currentDate").innerText = `امروز: ${jalaliDate}`;
   
}
$(document).ready(function () {
    
})


function apiRequest(apiName) {
    var data = { apiName: apiName }
    $.ajax({
        url: 'api/apiLogin.asmx/apiRequest',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            console.log(response)
            const redirectUrl = response.d;
            window.location.href = redirectUrl; // ✅ Actual browser redirect

        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    })
}
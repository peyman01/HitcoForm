function getDataJson() {

    $.ajax({
        url: 'controller/Daya.asmx/GetDataJson',
        type: 'POST',
        //data: JSON.stringify(jsonData),
        //contentType: 'application/json; charset=utf-8',
        //dataType: 'json',
        success: function (response) {
            if (response.succeeded) {
                console.log(response)
            } else {
                console.log("Error: Unable to fetch data");
            }
            
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}

function getDataXml() {
    
    $.ajax({
        url: 'controller/Hejrat.asmx/GetDataXml', // Web service URL
        type: 'POST',
        //dataType: 'xml', // Expect XML response
        //data: soapRequest,
        //contentType: 'text/xml; charset=utf-8', // Content type
        //headers: {
        //    'SOAPAction': 'http://tempuri.org/RetrieveSaleByProduct' // SOAP Action header
        //},
        success: function (response) {

            console.log(response);
            
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}

//function getDataDirectJson() {
//    return
//    var jsonData = {
//        "authentication":
//        {
//            "userName": "Rasta Imen",
//            "password": "dQ23A"
//        },
//        "fromDate": 14030601,
//        "toDate": 14030630
//    }

//    $.ajax({
//        url: 'https://dpsup.dayadarou.com/exusersfinal/api/v1/Sell/GetSupplierSellInfo_Abstract',
//        type: 'POST',
//        data: JSON.stringify(jsonData),
//        contentType: 'application/json; charset=utf-8',
//        dataType: 'json',
//        success: function (response) {
//            //if (response.succeeded) {
//            //    //console.log(response.data);
//            //    //$("#json").html(JSON.stringify(response))
//            //} else {
//            //    console.log("Error: Unable to fetch data");
//            //}
//            console.log(response)
//        },
//        error: function (xhr, status, error) {
//            console.error("Error: " + error);
//        }
//    });
//}
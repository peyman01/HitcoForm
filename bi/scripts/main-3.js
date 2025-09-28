function gencmbProducts(data) {
    $("#comboPrd").dxTagBox({
        dataSource: data,
        valueExpr: "value",
        displayExpr: "name",
        rtlEnabled: true,
        searchEnabled: true,
        width: 150,
        placeholder: "همه محصولات",
        showSelectionControls: true,
        showSelectAll: false,
        maxDisplayedTags: 0,
        dropDownOptions: {
            width: 700 // ✅ Width of the dropdown list
        },
        showDropDownButton: true,
        applyValueMode: "useButtons",
        // Called when TagBox is about to show the multi-tag
        onMultiTagPreparing: function (e) {
            // Customize the multi-tag text
            e.text = e.selectedItems.length + " محصول";
            e.cancel = false; // ensure the multi-tag is displayed
        },
        onContentReady: function (e) {
            // This selector targets the "Select All" item in the dropdown
            $(e.element).find(".dx-list-select-all").hide();
        },
        onValueChanged: function (e) {
            var selectedValues = e.value;
            var allItems = e.component.option("dataSource");
            if (selectedValues.length === allItems.length) {
                e.component.option("value", []);
            }
            manageUrlParams("combo");
        },
        itemTemplate: function (itemData) {
            return `<div style="display:flex;justify-content:space-between">
                    <span>${itemData.name}</span>
                </div>`;
        }
    });
}
function threeDigit(e) {
    if (e == null || isNaN(e)) return ""; // بررسی اینکه آیا ورودی عددی است یا خیر
    let num = parseFloat(e); // اطمینان از اینکه داده به عدد تبدیل شود
    if (isNaN(num)) return ""; // اگر تبدیل به عدد ممکن نباشد، مقدار خالی برگردانده شود
    num = num.toFixed(0); // گرد کردن به عدد صحیح
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // اضافه کردن جداکننده هزارگان
}
function getSaleFullData() {
    var data = getcomboValues()
    loader('show')
    $.ajax({
        url: '../controller/services.asmx/GetReportFull',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            checkAccess(response)
            response = JSON.parse(response.d)
            loader('hide');
            if (!response.services.length) {
                alert('ردیفی یافت نشد')
                return;
            }
            var exportDate = response.services.map(item => ({
                "ردیف": item.RowNumber,
                "پخش": allData.distributors.find(o => { return o.id == item.DistId })?.distName_FA ?? "نامعلوم",
                "تامین کننده": allData.companies.find(o => { return o.cId == item.companyId })?.cName_FA ?? "نامعلوم",
                "نام مشتری": item.CustomerName,
                "نام محصول در سیستم مالی": allData.products.find(o => { return o.value == item.ProductFinanceId })?.name ?? "نامعلوم",
                "فروش تعدادی": item.saleAmount,
                "فروش ریالی": item.goodsPrice,
                "جایزه تعدادی": item.prizeQuantity,
                "جایزه ریالی": item.prizeAmount,
                "برند": allData.brands.find(o => { return o.bId == item.brandId })?.bName_FA ?? "نامعلوم",
                "تاریخ": item.itemDate,
                "روز": item.itemDate.split("/")[2],
                "ماه": item.itemDate.split("/")[1],
                "سال": item.itemDate.split("/")[0],
                "نام ماه": allData.months.find(o => { return o.value == item.itemDate.split("/")[1] })?.name ?? "نامعلوم",
                "کد محصول در سیستم مالی": item.Number,
                "کد محصول در سیستم پخش": item.goodsCode,
                "آدرس مشتری": item.CustomerAddress,
                "استان": provinces.find(o => { return o.Id == item.stateId })?.StateName ?? "نامعلوم",
                "نوع رکورد": item.saleType == 1 ? "فروش" :
                    item.saleType == 2 ? "مرجوعی" :
                        item.saleType == 3 ? "جایزه" :
                            item.saleType == 4 ? "مرجوعی جایزه" : "نامشخص"
            }));
            arrayToExcel(exportDate, `گزارش پخش از تاریخ ${data.dateFrom} تا ${data.dateTo}`);
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function getSaleFullDataFinance() {
    var data = getcomboValues()
    loader('show')
    $.ajax({
        url: '../controller/services.asmx/GetReportFullFinance',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            checkAccess(response)
            response = JSON.parse(response.d)
            loader('hide');
            if (!response.services.length) {
                alert('ردیفی یافت نشد')
                return;
            }
            var exportDate = response.services.map(item => ({
                "ردیف": Number(item.RowNum),
                "تامین کننده": item.companyName_FA,
                "گروه مشتری": item.CustomerGroup,
                "نام مشتری": item.FullName,
                "نام محصول": item.Name,
                "کد محصول": item.Number,
                "فروش تعدادی ": item.SaleAmount,
                "فروش ریالی": item.GoodsPrice,
                "برند": item.brandName_EN || '-',
                "تاریخ": item.year + '/' + item.month + '/' + item.day,
                "روز": item.day,
                "ماه": item.month,
                "سال": item.year,
                "نام ماه": item.monthName,
                "شماره فاکتور": item.invoiceNo
            }));
            arrayToExcel(exportDate, 'گزارش پخش');
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function handleCmb(data) {
    (data.dateFrom != 0) ? $("#cmbDateFrom").addClass("cmbValue") : $("#cmbDateFrom").removeClass("cmbValue");
    (data.max_expiry_date != 0) ? $("#persian-date").addClass("cmbValue") : $("#persian-date").removeClass("cmbValue");
    (data.dateTo != 0) ? $("#cmbDateTo").addClass("cmbValue") : $("#cmbDateTo").removeClass("cmbValue");
    if (data.dateTo != 0 || data.dateFrom != 0 || data.distId != 0 || data.companyId != 0 || data.brandId != 0) {
        $("#filterBtn").removeClass("d-none");
    }
    else {
        $("#filterBtn").addClass("d-none");
    }
}
function inventoryForcast() {
    updateUrlParameter('sheet', '1-7');
    $("#tab1").find(".active").removeClass("active");
    $("#tab1").find('[data-target="#sheet-1-7"]').addClass("active");
    $("#tab1").find('[id^="sheet-"]').hide();
    $("#tab1").find("#sheet-1-7").show();
    var data = getcomboValues();
    $.ajax({
        url: '../controller/services.asmx/inventoryForcast',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            checkAccess(response)
            response = JSON.parse(response.d)
            initChartMonthlySalesByBrand(response.monthlySalesByBrand, 'chartMonthSaleBrand')
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function inventoryTurnover() {
    updateUrlParameter('sheet', '1-8');
    $("#tab1").find(".active").removeClass("active");
    $("#tab1").find('[data-target="#sheet-1-8"]').addClass("active");
    $("#tab1").find('[id^="sheet-"]').hide();
    $("#tab1").find("#sheet-1-8").show();
    var data = getcomboValues();
    $.ajax({
        url: '../controller/services.asmx/inventoryTurnover',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            checkAccess(response)
            response = JSON.parse(response.d)
            initChartMonthlySalesByBrand(response.monthlySalesByBrand, 'chartMonthSaleBrand')
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function showToast(message, type, time = 3000) {
    DevExpress.ui.notify({
        message: message,
        type: type,
        rtlEnabled: true,
        displayTime: time,
        width: "auto",
        minWidth: 500,  // حداقل عرض ۲۰۰ پیکسل
        maxWidth: 800,  // حداکثر عرض ۴۰۰ پیکسل
        position: {
            my: "center bottom",
            at: "center bottom",
            offset: '0 -50'  // فاصله 50 پیکسل از پایین
        }
    });
}
var map
var legend
function createSaleStateMap(SalebyState) {
    $("#maps").show()
    map?.eachLayer(function (layer) {
        if (layer instanceof L.Circle) {
            map.removeLayer(layer);
        }
    });
    if (!SalebyState || !Array.isArray(SalebyState) || SalebyState.length === 0) {
        showToast("با فیلدهای انتخابی دیتایی برای نمایش وجود ندارد. لطفا مقادیر معتبر انتخاب کنید.", "warning");
        $("#maps").hide();
        return;
    }
    showToast("گزارش با موفقیت بارگذاری شد  ", "success");
    if (!map) {
        map = L.map('maps').setView([32.0, 54.0], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
        }).addTo(map);
    }
    let values = SalebyState.map(s => s.TotalQuantity ?? s.TotalRiali).filter(v => v > 0);
    if (values.length === 0) {
        console.error("هیچ مقدار معتبری برای رسم دایره‌ها یافت نشد.");
        return;
    }
    // محاسبه حداقل، حداکثر و مقدار میانه
    let maxValue = Math.max(...values);
    let minValue = Math.min(...values);
    let medianValue = values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
    // ** تنظیم مقیاس براساس سطح زوم و اندازه نقشه **
    let zoomLevel = map.getZoom();
    let minRadius = 5000; // حداقل اندازه دایره (کوچک‌ترین مقدار)
    let maxRadius = 1000000 / (18 - zoomLevel); // بسته به زوم تغییر می‌کند
    // مقیاس جدید: استفاده از لگاریتم برای تعدیل اختلاف‌ها
    let scaleFactor;
    if (minValue === maxValue) {
        scaleFactor = 1;  // مقدار پیش‌فرض برای جلوگیری از NaN
    } else {
        scaleFactor = (maxRadius - minRadius) / (Math.log10(maxValue) - Math.log10(minValue));
    }
    SalebyState.forEach(function (stateData) {
        var province = provinces.find(p => p.Id == stateData.primaryStateCode);
        if (province) {
            var value = stateData.TotalQuantity ?? stateData.TotalRiali;
            // اگر مقدار منفی باشد، هشدار می‌دهیم ولی در محاسبات از مقدار مطلق استفاده می‌کنیم
            if (value <= 0) {
                console.warn(`${province.StateName} مقدار نامعتبر دارد: ${value}`);
            }
            // محاسبه شعاع بر اساس مقدار مطلق برای جلوگیری از شعاع منفی
            let radius = (minValue === maxValue) ? (maxRadius / 2) : minRadius + (Math.log10(Math.abs(value)) - Math.log10(minValue)) * scaleFactor;
            // ایجاد دایره روی نقشه
            let circle = L.circle([province.Latitude, province.Longitude], {
                color: value < 0 ? '#c0392b' : '#16a085',  // قرمز برای مقادیر منفی و سبز برای مثبت
                fillColor: value < 0 ? '#e67e22' : '#2ecc71',  // نارنجی برای مقادیر منفی و سبز برای مثبت
                fillOpacity: 0.6,  // شفافیت پرشدگی
                radius: Math.abs(radius)  // اندازه دایره
            }).addTo(map);
            // مقدار `popup` را تنظیم می‌کنیم اما بلافاصله باز نمی‌کنیم
            let isRiali = stateData.TotalRiali !== undefined && stateData.TotalRiali !== null;
            let formattedValue;
            if (Math.abs(value) >= 1_000_000_000) {
                formattedValue = (value / 1_000_000_000).toLocaleString('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                formattedValue = formattedValue.replace('٫', '/') + ' میلیارد'
            } else if (Math.abs(value) >= 1_000_000) {
                formattedValue = (value / 1_000_000)
                    .toLocaleString('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                formattedValue = formattedValue.replace('٫', '/') + " میلیون";
            } else {
                formattedValue = value.toLocaleString('fa-IR');
            }
            // ✅ مقدار را درون `span` قرار بده و `dir="ltr"` تنظیم کن
            let valueLabel = isRiali ? "فروش ریالی" : "فروش تعدادی";
            // مقدار `popup` را تنظیم می‌کنیم با استایل بزرگ‌تر
            let popupContent = `
    <b style="font-size: 20px; display: block; text-align: center;">${province.StateName}</b><br>
    <span style="font-size: 18px; font-weight: bold; display: block; text-align: center;">${valueLabel}: ${formattedValue}</span>
`;
            let popup = L.popup().setContent(popupContent);
            // **نمایش Popup هنگام هاور**
            circle.on('mouseover', function (e) {
                popup.setLatLng(e.latlng).openOn(map);
            });
            // **مخفی کردن Popup هنگام خروج از محدوده**
            circle.on('mouseout', function () {
                map.closePopup();
            });
        }
    });
    // اضافه کردن Legend پیشرفته
    if (legend) {
        legend.remove();
    }
    legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        const isRiali = SalebyState.some(s => s.TotalRiali !== undefined);
        const unit = isRiali ? 'ریال' : 'تعداد';
        const div = L.DomUtil.create('div', 'advanced-legend');
        div.style.cssText = `
        background: rgba(255, 255, 255, 0.95);
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        min-width: 280px;
        font-family: 'Yekan', Tahoma, sans-serif;
        direction: rtl;
        backdrop-filter: blur(5px);
    `;
        // تابع محاسبه اندازه دایره‌های Legend
        const calculateLegendRadius = (value) => {
            const minLegendRadius = 15;
            const maxLegendRadius = 50;
            if (minValue === maxValue) return (maxLegendRadius + minLegendRadius) / 2;
            const scale = (maxLegendRadius - minLegendRadius) / (Math.log10(maxValue) - Math.log10(minValue));
            return minLegendRadius + (Math.log10(value) - Math.log10(minValue)) * scale;
        };
        div.innerHTML = `
        <div style="border-bottom: 2px solid #3498db; padding-bottom: 12px; margin-bottom: 15px;">
            <h3 style="margin:0; color: #2c3e50; font-size: 18px;">
                🗺️ راهنمای فروش استانی
                <span style="font-size:14px; color:#e67e22; display:block; margin-top:5px;">واحد: ${unit}</span>
            </h3>
        </div>
        <div style="margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                <div style="position:relative;">
                    <div style="width:${calculateLegendRadius(minValue)}px; 
                                height:${calculateLegendRadius(minValue)}px;
                                background: rgba(46, 204, 113, 0.3);
                                border: 2px solid #16a085;
                                border-radius: 50%;">
                    </div>
                    <span style="position:absolute; bottom:-25px; left:50%; transform:translateX(-50%);
                                font-size:12px; white-space:nowrap;">${formatValue(minValue)}</span>
                </div>
                <div style="flex-grow:1; text-align:center; color:#7f8c8d; font-size:14px;">
                    <span>اندازه دایره‌ها</span>
                    <div style="height:2px; background:linear-gradient(90deg, #16a085, #e67e22); margin:8px 0;"></div>
                    <span style="font-size:12px;">(مقیاس لگاریتمی)</span>
                </div>
                <div style="position:relative;">
                    <div style="width:${calculateLegendRadius(maxValue)}px; 
                                height:${calculateLegendRadius(maxValue)}px;
                                background: rgba(46, 204, 113, 0.3);
                                border: 2px solid #16a085;
                                border-radius: 50%;">
                    </div>
                    <span style="position:absolute; bottom:-25px; left:50%; transform:translateX(-50%);
                                font-size:12px; white-space:nowrap;">${formatValue(maxValue)}</span>
                </div>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width:20px; height:20px; background:#2ecc71; border-radius:4px;"></div>
                <span style="font-size:14px;">فروش مثبت</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width:20px; height:20px; background:#e67e22; border-radius:4px;"></div>
                <span style="font-size:14px;">فروش منفی</span>
            </div>
        </div>
        <div style="margin-top:15px; background:#f8f9fa; padding:10px; border-radius:8px;">
            <span style="font-size:12px; color:#7f8c8d; display:block; text-align:center;">
                ※ با نگه داشتن ماوس روی هر استان، جزئیات کامل نمایش داده می‌شود
            </span>
        </div>
    `;
        return div;
    };
    legend.addTo(map);
    // تابع کمکی برای فرمت‌دهی مقادیر
    function formatValue(value, isRiali) {
        if (Math.abs(value) >= 1_000_000_000) {
            return (value / 1_000_000_000).toLocaleString('fa-IR') + ' میلیارد';
        } else if (Math.abs(value) >= 1_000_000) {
            return (value / 1_000_000).toLocaleString('fa-IR') + ' میلیون';
        }
        return value.toLocaleString('fa-IR');
    }
}
function arrayToExcel(data, fileName) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'گزارش');
    XLSX.writeFile(wb, fileName + '.xlsx');
}
function loader(mode, id = "loader") {
    if (mode == 'hide') $("#" + id).addClass("d-none");
    if (mode == 'show') $("#" + id).removeClass("d-none");
}
function initPivotChk() {
    $("#chkSale").dxSwitch({
        value: (allData?.userSetting?.userSettings?.tab1?.sheet15?.chkSale === false) ? false : true,
        width: 100,
        isValid: (allData?.userSetting?.userSettings?.tab1?.sheet15?.chkSale === false) ? false : true,
        switchedOnText: "فروش",
        switchedOffText: "فروش",
        rtlEnabled: true,
        onValueChanged: function (e) {
            if (!favReport) {
                $("#chkSale").dxSwitch('option', 'isValid', e.value);
                setSetting("tab1.sheet15.chkSale", e.value)
                handlePivotChk()
            }
        }
    });
    $("#chkStock").dxSwitch({
        value: (allData?.userSetting?.userSettings?.tab1?.sheet15?.chkStock === false) ? false : true,
        width: 100,
        isValid: (allData?.userSetting?.userSettings?.tab1?.sheet15?.chkStock === false) ? false : true,
        switchedOnText: "موجودی",
        switchedOffText: "موجودی",
        rtlEnabled: true,
        onValueChanged: function (e) {
            if (!favReport) {
                $("#chkStock").dxSwitch('option', 'isValid', e.value);
                setSetting("tab1.sheet15.chkStock", e.value)
                handlePivotChk()
            }
        },
    });
    setTimeout(function () {
        if (!favReport) {
            handlePivotChk()
            renderFavoriteReports()
        }
    }, 100)
}
function handlePivotChk(userData) {
    $("#sheet-1-15").find(".sale").fadeOut()
    $("#sheet-1-15").find(".stock").fadeOut()
    $("#sheet-1-15").find(".saleStock").fadeOut()
    var report = ""
    var gridId = ""
    var chkStock = $("#chkStock").dxSwitch('option', 'value')
    var chkSale = $("#chkSale").dxSwitch('option', 'value')
    if (chkSale) {
        report = "sale"
    }
    if (chkStock) {
        report = "stock"
    }
    if (chkSale && chkStock) {
        report = "saleStock"
    }
    if (!chkSale && !chkStock) {
        report = "none"
    }
    switch (report) {
        case "sale":
            loader('show')
            var data = getcomboValues()
            $.ajax({
                type: "POST",
                url: "../controller/services.asmx/GetPivotData",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ data }),
                success: function (response) {
                    loader('hide')
                    var pivotData = JSON.parse(response.d)
                    pivotData = pivotData.result
                    var total = 0
                    var qty = 0
                    pivotData.forEach(function (o) {
                        qty += o.qty
                        total += o.total
                    })
                    pivotData.forEach(function (o) {
                        o.percentageQty = (o.qty / qty) * 100
                        o.percentageTotal = (o.total / total) * 100
                    })
                    pivotData.forEach(function (item) {
                        item.yearMonth = item.year + "-" + item.month
                    })
                    initiatePivotDist(pivotData, userData)

                    gridId = "#pivotGrid";
                },
                error: function (xhr, status, error) {
                    console.error("Error loading dropdown data:", error);
                }
            });
            break;
        case "stock":
            loader('show')
            var data = getcomboValues()
            $.ajax({
                type: "POST",
                url: "../controller/services.asmx/GetPivotDataStock",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ data }),
                success: function (response) {
                    loader('hide')
                    var pivotData = JSON.parse(response.d)
                    pivotData = pivotData.result
                    initiatePivotDistStock(pivotData, userData)
                    gridId = "#pivotGridStock";
                },
                error: function (xhr, status, error) {
                    console.error("Error loading dropdown data:", error);
                }
            });
            break;
        case "saleStock":
            loader('show')
            var data = getcomboValues()
            $.ajax({
                type: "POST",
                url: "../controller/services.asmx/GetPivotDataSaleStock",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ data }),
                success: function (response) {
                    loader('hide')
                    var pivotData = JSON.parse(response.d)
                    pivotData = pivotData.result
                    initiatePivotDistSaleStock(pivotData, userData)
                    gridId = "#pivotGridsaleStock";
                },
                error: function (xhr, status, error) {
                    console.error("Error loading dropdown data:", error);
                }
            });
            break;
        case "none":
            showToast('هیچ یک از مقادیر فروش و یا موجودی انتخاب نشده است', 'warning')
            gridId = false
            break;
    }
    $("#UserReportFavoritePivot").off().on('click', function () {
        if (!gridId) {
            showToast('هیچ یک از مقادیر فروش و یا موجودی انتخاب نشده است', 'warning');
            return;
        }
        var pivotDb = $(gridId).dxPivotGrid('instance').getDataSource()._fields;
        var fields = pivotDb.map(item => ({ dataField: item.dataField, areaIndex: item.areaIndex, area: item.area }));
        if (!(allData?.userSetting?.userSettings?.tab1?.sheet15?.userReports?.length)) {
            setSetting("tab1.sheet15.userReports", []);
        }
        var reportData = {
            chkStock: chkStock,
            chkSale: chkSale,
            fields: JSON.parse(JSON.stringify(fields))
        };
        function isSameFieldSet(a, b) {
            if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (a[i].dataField !== b[i].dataField || a[i].areaIndex !== b[i].areaIndex || a[i].area !== b[i].area) return false;
            }
            return true;
        }
        var existing = allData.userSetting.userSettings.tab1.sheet15.userReports.some(function (r) {
            return r.chkStock === reportData.chkStock &&
                r.chkSale === reportData.chkSale &&
                isSameFieldSet(r.fields, reportData.fields)
        });
        if (existing) {
            showToast('این گزارش قبلاً ذخیره شده است', 'info');
        } else {
            showReportNamePopup(function (reportName, reportColor) {
                var pivotDbNew = $(gridId).dxPivotGrid('instance').getDataSource()._fields;
                var fieldsN = pivotDbNew.map(item => ({ dataField: item.dataField, areaIndex: item.areaIndex, area: item.area }));
                var chkStockN = $("#chkStock").dxSwitch('option', 'value')
                var chkSaleN = $("#chkSale").dxSwitch('option', 'value')
                var reportDataN = {
                    chkStock: chkStockN,
                    chkSale: chkSaleN,
                    fields: JSON.parse(JSON.stringify(fieldsN)),
                    reportName: reportName,
                    reportColor: reportColor // Save selected color
                };
                allData.userSetting.userSettings.tab1.sheet15.userReports.unshift(JSON.parse(JSON.stringify(reportDataN)));
                saveUserSettings();
                renderFavoriteReports(gridId)
            });
        }
    });
}
function renderFavoriteReports(gridId) {
    const container = $("#pivotFavReportContainer");
    container.empty(); // Clear previous content
    const reports = allData?.userSetting?.userSettings?.tab1?.sheet15?.userReports || [];
    reports.forEach((report, index) => {
        const color = report.reportColor || "#187275"; // fallback to gray if no color
        const name = report.reportName || "بدون نام";
        const wrapper = $(`<div class="report-wrapper position-relative d-inline-block me-3 mb-2"></div>`);
        const btn = $(`
            <button type="button" class="btn btn-sm">
                ${name}
            </button>
        `).css({
            backgroundColor: color,
            color: "#fff",
            borderColor: color,
        });
        const editIcon = $(`<div class="reportEditIcon" style="cursor:pointer;display:none;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg></div>`)
        wrapper.hover(
            () => editIcon.fadeIn(500),
            () => editIcon.fadeOut(300)
        );
        btn.on("click", function () {
            var tkn = "ww"
            if (report.chkSale) {
                if (report.chkStock) {
                    tkn = "pivotGridSaleStock"
                }
                else {
                    tkn = "pivotGridSale"
                }
            }
            else {
                if (report.chkStock) {
                    tkn = "pivotGridStock"
                }
            }
            // console.log(tkn)
            localStorage.removeItem(tkn);

            favReport = true
            $("#chkSale").dxSwitch('option', 'isValid', report.chkSale);
            $("#chkSale").dxSwitch('option', 'value', report.chkSale);
            $("#chkStock").dxSwitch('option', 'isValid', report.chkStock);
            $("#chkStock").dxSwitch('option', 'value', report.chkStock);
            allData.userSetting.userSettings.tab1.sheet15.chkSale = report.chkSale
            allData.userSetting.userSettings.tab1.sheet15.chkStock = report.chkStock
            handlePivotChk(report)
            favReport = false
        });
        // On edit icon click — open popup
        editIcon.on("click", function (e) {
            e.stopPropagation();
            showReportNamePopup(function (reportName, reportColor, action) {
                if (action == "delete") {
                    allData?.userSetting?.userSettings?.tab1?.sheet15?.userReports
                    reports.splice(index, 1);
                }
                else {
                    report.reportName = reportName
                    report.reportColor = reportColor
                }
                saveUserSettings();
                renderFavoriteReports(gridId)
            }, report, true);
        });
        wrapper.append(btn, editIcon);
        container.append(wrapper);
    });
}
var favReport = false
function showReportNamePopup(onConfirm, report, isEdit = false) {
    var reportNamePopup = $("#reportNamePopup").dxPopup({
        title: (isEdit) ? "ویرایش گزارش " + report.reportName : "ذخیره گزارش",
        width: 600,
        height: 300,
        visible: false,
        rtlEnabled: true,
        showCloseButton: true,
        dragEnabled: true,
        onShowing: function () {
            popUpCss(); // Your custom CSS adjustments
        },
        contentTemplate: function (contentElement) {
            const textBoxContainer = $("<div>").appendTo(contentElement);
            textBoxContainer.dxTextBox({
                placeholder: "نام گزارش را وارد کنید",
                valueChangeEvent: "input",
                value: (isEdit) ? report.reportName : "",
                onInitialized: function (e) {
                    reportNamePopup.reportNameInput = e.component;
                }
            });
            // Color picker container
            const colorBoxContainer = $("<div class='my-3'>").appendTo(contentElement);
            colorBoxContainer.dxColorBox({
                placeholder: "رنگ گزارش(اختیاری)",
                value: (isEdit) ? report.reportColor : "",
                showAlphaChannel: true,
                rtlEnabled: true,
                onInitialized: function (e) {
                    setTimeout(function () { $($(e.element[0]).find(".dx-placeholder")[0]).css("left", "0") }, 100)
                    reportNamePopup.reportColorInput = e.component;
                }
            });
        },
        toolbarItems: [
            {
                widget: "dxButton",
                toolbar: "bottom",
                location: "after",
                options: {
                    text: (isEdit) ? "ویراش و ذخیره" : "ذخیره",
                    type: "success",
                    onClick: function () {
                        const reportName = reportNamePopup.reportNameInput.option("value").trim();
                        const reportColor = reportNamePopup.reportColorInput.option("value").trim(); // Get selected color
                        if (!reportName) {
                            showToast("لطفاً نام گزارش را وارد کنید", "warning", 2000);
                            return;
                        }
                        var nameExists = allData.userSetting.userSettings.tab1.sheet15.userReports.some(function (r) {
                            return r.reportName === reportName;
                        });
                        if (nameExists) {
                            if (isEdit && reportName == report.reportName && reportColor == report.reportColor) {
                                showToast('تغییری اعمال نشد', 'warning');
                                reportNamePopup.hide();
                                return;
                            }
                            else if (!isEdit) {
                                showToast('نام گزارش قبلاً استفاده شده است', 'warning');
                                return;
                            }
                        }
                        reportNamePopup.hide();
                        onConfirm(reportName, reportColor);
                        showToast('تغییرات ذخیره شد', 'success');
                    }
                }
            },
            {
                widget: "dxButton",
                toolbar: "bottom",
                location: "before",
                visible: isEdit,
                options: {
                    type: "danger",
                    text: "حذف این گزارش",
                    onClick: function () {
                        onConfirm("", "", "delete");
                        reportNamePopup.hide();
                    }
                }
            },
            {
                widget: "dxButton",
                toolbar: "bottom",
                location: "after",
                options: {
                    text: "انصراف",
                    onClick: function () {
                        reportNamePopup.hide();
                    }
                }
            }
        ]
    }).dxPopup("instance");
    reportNamePopup.show();
}
const chartTypes = [
    // مقایسه‌ی لحظه‌ای بین گروه‌ها (فروش یا موجودی در یک بازه/فیلتر)
    {
        value: 'bar', text: '📊 ستونی',
        desc: 'مقایسه‌ی مقدار گروه‌ها در یک نگاه؛ مثل «فروش ریالی شرکت‌ها در یک ماه» یا «موجودی فعلی برندها/محصولات در شرکت»'
    },

    {
        value: 'stackedBar', text: '🗂️ ستونی انباشته',
        desc: 'هم کل را می‌بینید هم ترکیب داخلش؛ مثل «فروش هر شرکت با تفکیک برندها» یا «موجودی فعلی انبار با تفکیک محصول»'
    },

    {
        value: 'fullStackedBar', text: '🧱 ستونی ۱۰۰٪ انباشته',
        desc: 'تمرکز روی درصد سهم‌ها (قد مطلق مهم نیست)؛ مثل «درصد سهم برندها در فروش هر شرکت» یا «درصد سهم محصولات از موجودی فعلی شرکت»'
    },

    // فقط برای «روند فروش» در زمان (سال/ماه/روز)
    {
        value: 'line', text: '📈 خطی',
        desc: 'روند فروش در گذر زمان؛ مثل «فروش ماهانه‌ی یک برند/شرکت در سال» یا «فروش روزانه در یک ماه»'
    },

    {
        value: 'spline', text: '〰️ منحنی نرم (Spline)',
        desc: 'همان روند فروش، نرم و خواناتر؛ مناسب «فروش ماهانه‌ی برند/محصول»'
    },

    {
        value: 'stepLine', text: '📉 خطی پلکانی',
        desc: 'وقتی تغییرات فروش پله‌ای/جهشی است؛ مثل «فروش روزانه همزمان با شروع/پایان کمپین»'
    },

    {
        value: 'area', text: '🟦 سطحی',
        desc: 'روند فروش با تاکید روی حجم کل؛ مثل «جمع فروش ماهانه‌ی شرکت در سال»'
    },

    {
        value: 'splineArea', text: '🌊 سطحی منحنی نرم',
        desc: 'نسخه‌ی نرم‌ترِ سطحی برای «فروش ماهانه‌ی برند/محصول» با نوسان زیاد'
    },

    {
        value: 'stepArea', text: '📐 سطحی پلکانی',
        desc: 'وقتی تغییرات فروش پله‌ای است ولی می‌خواهید حجم کل هم پررنگ باشد'
    },

    {
        value: 'fullStackedArea', text: '🧩 سطحی ۱۰۰٪ انباشته',
        desc: 'درصد سهم برند/محصول/پخش از «فروش ماهانه‌ی شرکت» در طول سال (هر مقطع=۱۰۰٪)'
    },

    // مقایسه‌ی دو عدد در یک نقطه‌ی زمانی (بدون روند)
    {
        value: 'scatter', text: '🔵 نقطه‌ای (Scatter)',
        desc: 'دیدن رابطه‌ی بین دو شاخص؛ مثل «برای هر مشتری: فروش ریالی در برابر فروش تعدادی» یا «برای هر برند: فروش ریالی در برابر درصد فروش»'
    },

    // نسخه‌های درصدی/انباشته برای روند فروش
    {
        value: 'fullStackedLine', text: '🧩📈 خطی ۱۰۰٪ انباشته',
        desc: 'سهم درصدی برند/محصول از «فروش ماهانه» در طول سال؛ تمرکز روی ترکیب نه مقدار'
    },

    {
        value: 'fullStackedSpline', text: '🧩〰️ منحنی نرم ۱۰۰٪ انباشته',
        desc: 'همان درصدی در زمان با خط نرم‌تر؛ برای «ترکیب برندها در ماه‌های سال»'
    },

    {
        value: 'stackedArea', text: '🗂️ سطحی انباشته',
        desc: 'نمایش مجموع فروش و سهم برندها/محصولات روی هم در طول ماه‌های سال'
    },

    {
        value: 'stackedLine', text: '🗂️ خطی انباشته',
        desc: 'روند تجمیعی فروش چند برند/محصول در زمان (خطوط روی هم)'
    },

    {
        value: 'stackedSplineArea', text: '🗂️🌊 سطحی منحنی نرم انباشته',
        desc: 'انباشته + نرم؛ برای «چند برند/محصول» در ماه‌های سال با تاکید بر حجم فروش'
    },

    {
        value: 'stackedSpline', text: '🗂️〰️ منحنی نرم انباشته',
        desc: 'روند تجمیعی فروش با منحنی نرم؛ مناسب مقایسه‌ی برندها/پخش‌ها در زمان'
    },
];


function initiatePivotDist(pivotData, userData) {
    $("#sheet-1-15").find(".sale").fadeIn()

    const pivotGridChart = $('#pivotgrid-chart').dxChart({
        commonSeriesSettings: {
            type: 'bar', // initial type (will be overridden by the selector)
            label: {
                visible: false,
                position: 'top',
                font: { size: 10, weight: 100 },
                format: 'fixedPoint',
                precision: 0,
                textOverflow: 'ellipsis',
                customizeText(args) {
                    return `<span style="color:black !important;">${args.seriesName}</span><span style="color:black !important;">(${args.valueText})`;
                }
            }
        },
        tooltip: {
            enabled: true,
            customizeTooltip(args) {
                return {
                    html: `${args.seriesName}<div class='currency' style="font-family:'IRANSansWeb'">${threeDigit(args.valueText)}</div>`
                };
            }
        },
        size: { height: "auto" },
        adaptiveLayout: { width: 450, keepLabels: true },
        theme: 'generic.softblue',
        zoomAndPan: {
            argumentAxis: "both",
            valueAxis: "x",
            enableMouseWheel: true,
            allowMouseWheel: true,
            dragToZoom: true
        }
    }).dxChart('instance');


    $('#chartTypeSelectorSale').dxSelectBox({
        dataSource: chartTypes,
        valueExpr: 'value',       // the actual chart type used in dxChart
        displayExpr: 'text',      // what the user sees (Persian)
        value: 'bar',         // initial selection
        placeholder: 'نوع نمودار...',
        width: '100%',
        dropDownOptions: {
            width: 500,                      // widen popup           
        },
        onValueChanged(e) {
            pivotGridChart.option('commonSeriesSettings.type', e.value);

            const series = pivotGridChart.option('series') || [];
            if (series.length) {
                pivotGridChart.option('series', series.map(s => ({ ...s, type: e.value })));
            }
        },
        itemTemplate: function (itemData) {
            return `
              <div style="white-space: normal; line-height: 1.4;">
                <div>${itemData.text}</div>
                <div style="font-size:12px;color:gray;white-space:normal;word-break:break-word;">
                  ${itemData.desc}
                </div>
              </div>
            `;
        },
    });

    const pivotGrid = $('#pivotGrid').dxPivotGrid({
        rtlEnabled: true,
        allowExpandAll: true,
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        allowSearching: true,
        showBorders: true,
        showRowGrandTotals: true,
        showColumnGrandTotals: true,
        showRowTotals: true,
        showColumnTotals: true,
        showTotalsPrior: 'both',
        height: "auto",
        fieldChooser: {
            enabled: true,
            height: 700,
            width: 900,
            searchMode: 'contains',
            searchEnabled: true,
        },
        fieldPanel: {
            showColumnFields: true,
            showDataFields: true,
            showFilterFields: true,
            showRowFields: true,
            allowFieldDragging: true,
            visible: true,
        },
        texts: {
            grandTotal: "جمع کل"
        },
        export: {
            enabled: true,
            fileName: "pivot_data",
            excelFilterEnabled: true
        },
        headerFilter: {
            allowSearch: true,
            height: 450,
            searchTimeout: 300,
            showRelevantValues: false,
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'pivotGridSale',
        },
        scrolling: { mode: 'virtual' },
        onExporting: function (e) {
            const pivotGrid = e.component;
            pivotGrid.option({
                showRowGrandTotals: false,
                showColumnGrandTotals: false,
                showRowTotals: false,
                showColumnTotals: false
            });

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Pivot Data");
            const repeatedValues = {};

            DevExpress.excelExporter.exportPivotGrid({
                component: pivotGrid,
                worksheet: worksheet,
                mergeRowFieldValues: false,
                mergeColumnFieldValues: false,
                customizeCell: function ({ excelCell, pivotCell }) {
                    // 🔹 کنترل فیلدهای ردیفی
                    if (pivotCell && pivotCell.area === "row") {
                        const key = `${pivotCell.rowIndex}-${pivotCell.columnIndex}`;
                        if (pivotCell.text) {
                            repeatedValues[pivotCell.columnIndex] = pivotCell.text;
                        } else {
                            excelCell.value = repeatedValues[pivotCell.columnIndex];
                        }
                    }

                    // 🔹 کنترل سلول‌های عددی (Data area)
                    if (pivotCell && pivotCell.area === "data" && typeof pivotCell.value === "number") {
                        excelCell.value = pivotCell.value; // 👈 عدد واقعی
                        excelCell.numFmt = '#,##0;[Red]-#,##0'; // 👈 فرمت اکسل: مثبت عادی، منفی قرمز
                        excelCell.alignment = { horizontal: 'right', readingOrder: 1 }; // 👈 تراز راست
                    }
                }
            }).then(() => {
                return workbook.xlsx.writeBuffer();
            }).then((buffer) => {
                saveAs(new Blob([buffer], { type: "application/octet-stream" }), "pivot_no_merged.xlsx");
            }).finally(() => {
                pivotGrid.option({
                    showRowGrandTotals: true,
                    showColumnGrandTotals: true,
                    showRowTotals: true,
                    showColumnTotals: true
                });
            });

            e.cancel = true;
        },

        onCellPrepared: function (e) {
            if (typeof e.cell.value === "number") {
                let formattedValue = DevExpress.localization.formatNumber(e.cell.value, { type: 'fixedPoint', precision: 0 });

                if (e.cell.value < 0) {
                    // Negative → red text + light red background
                    e.cellElement.css({
                        "color": "red",
                        "background-color": "#fff0f0" // very light red
                    });
                    e.cellElement.html("\u200E" + formattedValue);
                } else {
                    // Positive or zero → black text + light blue background
                    e.cellElement.css({
                        "color": "black",
                        "background-color": "#f0f8ff" // very light blue
                    });
                    e.cellElement.html("\u200E" + formattedValue);
                }
            }
        },
        dataSource: {
            fields: [{
                caption: 'شرکت',
                allowColumnResizing: true,
                dataField: 'cid',
                width: "auto",
                area: userData?.fields.find(o => { return o.dataField == "cid" })?.area || "column",
                areaIndex: userData?.fields.find(o => { return o.dataField == "cid" })?.areaIndex || 0,
                allowSorting: true,
                sortOrder: 'desc',
                customizeText: function (cellInfo) {
                    const found = allData.companies.find((item) => item.cId == cellInfo.value);
                    return found ? found.cName_FA : cellInfo.value;
                },
            },
            {
                caption: 'ماه',
                allowSorting: true,
                dataField: 'month',
                area: userData?.fields.find(o => { return o.dataField == "month" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "month" })?.areaIndex || 1,
                width: "auto",
                customizeText: function (cellInfo) {
                    const found = allData.months.find((item) => item.value == cellInfo.value);
                    return found ? found.name : cellInfo.value;
                },
            },
            {
                caption: 'سال',
                allowSorting: true,
                dataField: 'year',
                area: userData?.fields.find(o => { return o.dataField == "year" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "year" })?.areaIndex || 2,
                width: "auto",
                customizeText: function (cellInfo) {
                    return cellInfo.value;
                },
            },
            {
                caption: 'سال - ماه',
                allowSorting: true,
                dataField: 'yearMonth',
                area: userData?.fields.find(o => { return o.dataField == "yearMonth" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "yearMonth" })?.areaIndex,
                width: "auto",
                customizeText: function (cellInfo) {
                    return cellInfo.value;
                },
            },
            {
                caption: 'روز',
                allowSorting: true,
                dataField: 'day',
                area: userData?.fields.find(o => { return o.dataField == "day" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "day" })?.areaIndex,
                width: "auto",
                customizeText: function (cellInfo) {
                    return cellInfo.value;
                },
            },
            {
                caption: 'پخش',
                dataField: 'did',
                area: userData?.fields.find(o => { return o.dataField == "did" })?.area || "row",
                areaIndex: userData?.fields.find(o => { return o.dataField == "did" })?.areaIndex || 3,
                width: "auto",
                allowSorting: true,
                sortOrder: 'desc',
                customizeText: function (cellInfo) {
                    const found = allData.distributors.find((item) => item.id == cellInfo.value);
                    return found ? found.distName_FA : cellInfo.value;
                },
            },
            {
                caption: 'برند',
                dataField: 'bid',
                width: "auto",
                allowSorting: true,
                sortOrder: 'desc',
                area: userData?.fields.find(o => { return o.dataField == "bid" })?.area || "row",
                areaIndex: userData?.fields.find(o => { return o.dataField == "bid" })?.areaIndex || 4,
                customizeText: function (cellInfo) {
                    const found = allData.brands.find((item) => item.bId == cellInfo.value);
                    return found ? found.bName_FA : cellInfo.value;
                },
            },
            {
                caption: 'محصول',
                dataField: 'pid',
                width: "auto",
                allowSorting: true,
                sortOrder: 'desc',
                area: userData?.fields.find(o => { return o.dataField == "pid" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "pid" })?.areaIndex || 5,
                customizeText: function (cellInfo) {
                    const found = allData.products.find((item) => item.value == cellInfo.value);
                    return found ? found.name : cellInfo.value;
                },
            },
            {
                caption: 'استان محل فروش',
                dataField: 'st',
                width: "auto",
                allowSorting: true,
                sortOrder: 'desc',
                area: userData?.fields.find(o => { return o.dataField == "st" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "st" })?.areaIndex || 6,
                customizeText: function (cellInfo) {
                    const found = provinces.find((item) => item.Id == cellInfo.value);
                    return found ? found.StateName : cellInfo.value;
                },
            },
            {
                caption: 'فروش از مرکز توزیع',
                dataField: 'ct',
                width: "auto",
                allowSorting: true,
                sortOrder: 'desc',
                area: userData?.fields.find(o => { return o.dataField == "ct" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "ct" })?.areaIndex || 7,
                customizeText: function (cellInfo) {
                    const found = allData.cities.find((item) => item.cityId == cellInfo.value);
                    return found ? found.cityName : cellInfo.value;
                },
            },
            {
                caption: 'مشتری',
                dataField: 'ctn',
                width: "auto",
                allowSorting: true,
                allowSearch: true,
                sortOrder: 'desc',
                area: userData?.fields.find(o => { return o.dataField == "ctn" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "ctn" })?.areaIndex || 8,
                customizeText: function (cellInfo) {
                    const found = (allData.customerDist || getDistinctValues("CustomerName")).find((item) => item.CustomerName == cellInfo.value);
                    return found ? found.CustomerName : cellInfo.value;
                },
            },
            {
                caption: 'فروش ریالی',
                dataField: 'total',
                dataType: 'number',
                width: "auto",
                summaryType: 'sum',
                allowSorting: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                    thousandsSeparator: true,
                },
                customizeText: function (cellInfo) {
                    if (cellInfo.value === null || cellInfo.value === undefined) return "";
                    let formatted = DevExpress.localization.formatNumber(cellInfo.value, { type: 'fixedPoint', precision: 0 });
                    // Inject \u200E so minus sign stays at left in RTL
                    return "\u200E" + formatted;
                },
                area: userData?.fields.find(o => { return o.dataField == "total" })?.area || "data",
                areaIndex: userData?.fields.find(o => { return o.dataField == "total" })?.areaIndex || 9,
            },
            {
                caption: 'درصد تعدادی',
                dataField: 'percentageQty',
                dataType: 'number',
                width: "auto",
                summaryType: 'sum',
                allowSorting: true,
                format: {
                    type: 'fixedPoint',
                    precision: 3,
                    thousandsSeparator: true,
                },
                area: userData?.fields.find(o => { return o.dataField == "percentageQty" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "percentageQty" })?.areaIndex || 10,
            },
            {
                caption: 'فروش تعدادی',
                dataField: 'qty',
                width: "auto",
                dataType: 'number',
                summaryType: 'sum',
                allowSorting: true,
                area: userData?.fields.find(o => { return o.dataField == "qty" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "qty" })?.areaIndex || 11,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                    thousandsSeparator: true,
                },
                customizeText: function (cellInfo) {
                    if (cellInfo.value === null || cellInfo.value === undefined) return "";
                    let formatted = DevExpress.localization.formatNumber(cellInfo.value, { type: 'fixedPoint', precision: 0 });
                    // Inject \u200E so minus sign stays at left in RTL
                    return "\u200E" + formatted;
                },
            },
            {
                caption: 'درصد ریالی',
                dataField: 'percentageTotal',
                dataType: 'number',
                width: "auto",
                area: userData?.fields.find(o => { return o.dataField == "percentageTotal" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "percentageTotal" })?.areaIndex || 12,
                summaryType: 'sum',
                allowSorting: true,
                format: {
                    type: 'fixedPoint',
                    precision: 3,
                    thousandsSeparator: true,
                },
            }
            ],
            store: pivotData,
        },
        onContextMenuPreparing: contextMenuPreparing,
    }).dxPivotGrid('instance');
    pivotGrid.bindChart(pivotGridChart, {
        dataFieldsDisplayMode: 'singleAxis',   // 👈 همه داده‌ها روی یک محور نشون داده بشن
        alternateDataFields: false,            // 👈 داده‌ها در یک سری مجزا بیان، نه در پنل جدا
    });
    //}
}
function initiatePivotDistStock(pivotData, userData) {
    $("#sheet-1-15").find(".stock").fadeIn()
    const pivotGridChart = $('#pivotgridStock-chart').dxChart({
        commonSeriesSettings: {
            type: 'bar', // initial type (will be overridden by the selector)
            label: {
                visible: false,
                position: 'top',
                font: { size: 10, weight: 100 },
                format: 'fixedPoint',
                precision: 0,
                textOverflow: 'ellipsis',
                customizeText(args) {
                    return `<span style="color:black !important;">${args.seriesName}</span><span style="color:black !important;">(${args.valueText})`;
                }
            }
        },
        tooltip: {
            enabled: true,
            customizeTooltip(args) {
                return {
                    html: `${args.seriesName}<div class='currency' style="font-family:'IRANSansWeb'">${threeDigit(args.valueText)}</div>`
                };
            }
        },
        size: { height: "auto" },
        adaptiveLayout: { width: 450, keepLabels: true },
        theme: 'generic.softblue',
        zoomAndPan: {
            argumentAxis: "both",
            valueAxis: "x",
            enableMouseWheel: true,
            allowMouseWheel: true,
            dragToZoom: true
        }
    }).dxChart('instance');

    $('#chartTypeSelectorStock').dxSelectBox({
        dataSource: chartTypes,
        valueExpr: 'value',       // the actual chart type used in dxChart
        displayExpr: 'text',      // what the user sees (Persian)
        value: 'bar',         // initial selection
        placeholder: 'نوع نمودار...',
        width: '100%',
        dropDownOptions: {
            width: 500,                      // widen popup           
        },
        onValueChanged(e) {
            pivotGridChart.option('commonSeriesSettings.type', e.value);

            const series = pivotGridChart.option('series') || [];
            if (series.length) {
                pivotGridChart.option('series', series.map(s => ({ ...s, type: e.value })));
            }
        },
        itemTemplate: function (itemData) {
            return `
              <div style="white-space: normal; line-height: 1.4;">
                <div>${itemData.text}</div>
                <div style="font-size:12px;color:gray;white-space:normal;word-break:break-word;">
                  ${itemData.desc}
                </div>
              </div>
            `;
        },
    });
    const pivotGrid = $('#pivotGridStock').dxPivotGrid({
        rtlEnabled: true,
        allowExpandAll: true,
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        allowSearching: true,
        showBorders: true,
        showRowGrandTotals: true,
        showColumnGrandTotals: true,
        showRowTotals: true,
        showColumnTotals: true,
        showTotalsPrior: 'both',
        height: "auto",
        fieldChooser: {
            enabled: true,
            height: 700,
            width: 900,
            searchMode: 'contains',
            searchEnabled: true,
        },
        fieldPanel: {
            showColumnFields: true,
            showDataFields: true,
            showFilterFields: true,
            showRowFields: true,
            allowFieldDragging: true,
            visible: true,
        },
        texts: {
            grandTotal: "جمع کل"
        },
        export: {
            enabled: true,
            fileName: "pivot_data_stock",
            excelFilterEnabled: true
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'pivotGridStock',
        },
        onExporting: function (e) {
            const pivotGrid = e.component;
            // Temporarily disable totals
            pivotGrid.option({
                showRowGrandTotals: false,
                showColumnGrandTotals: false,
                showRowTotals: false,
                showColumnTotals: false
            });
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Pivot Data");
            // Keep track of last values for repeated filling
            const repeatedValues = {};
            DevExpress.excelExporter.exportPivotGrid({
                component: pivotGrid,
                worksheet: worksheet,
                mergeRowFieldValues: false,   // ✅ prevent row field merging
                mergeColumnFieldValues: false, // ✅ prevent column field merging
                customizeCell: function ({ excelCell, pivotCell }) {
                    if (pivotCell && pivotCell.area === "row") {
                        const key = `${pivotCell.rowIndex}-${pivotCell.columnIndex}`;
                        if (pivotCell.text) {
                            repeatedValues[pivotCell.columnIndex] = pivotCell.text;
                        } else {
                            // Repeat the last known value
                            excelCell.value = repeatedValues[pivotCell.columnIndex];
                        }
                    }
                }
            }).then(() => {
                return workbook.xlsx.writeBuffer();
            }).then((buffer) => {
                saveAs(new Blob([buffer], { type: "application/octet-stream" }), "pivot_no_merged.xlsx");
            }).finally(() => {
                pivotGrid.option({
                    showRowGrandTotals: true,
                    showColumnGrandTotals: true,
                    showRowTotals: true,
                    showColumnTotals: true
                });
            });
            e.cancel = true;
        },
        headerFilter: {
            allowSearch: true,
            height: 450,
            searchTimeout: 300,
            showRelevantValues: false,
        },
        onCellPrepared: function (e) {
            if (e.cell.rowType == "GT") {
                $(e.cellElement).css('position', 'sticky')
                $(e.cellElement).css('top', '0px')
            }
            if (e.cell.columnType == "GT") {
                $(e.cellElement).css('position', 'sticky')
                $(e.cellElement).css('right', '0px')
            }
            // Check if this is a grand total row (either row or column grand totals)
            if (e.rowType === 'total' && e.columnType === 'total') {
                // Apply custom background color for the grand total row
                e.cellElement.css('background-color', '#f8f8f8'); // Change the color to your preference
                e.cellElement.css('font-weight', 'bold');  // Make the text bold for grand total
            }
        },
        dataSource: {
            fields: [{
                caption: 'شرکت',
                allowColumnResizing: true,
                dataField: 'cid',
                width: "auto",
                area: userData?.fields.find(o => { return o.dataField == "cid" })?.area || "column",
                areaIndex: userData?.fields.find(o => { return o.dataField == "cid" })?.areaIndex || 0,
                allowSorting: true,
                sortOrder: 'desc',
                customizeText: function (cellInfo) {
                    const found = allData.companies.find((item) => item.cId == cellInfo.value);
                    return found ? found.cName_FA : cellInfo.value;
                },
            },
            {
                caption: 'پخش',
                dataField: 'did',
                area: userData?.fields.find(o => { return o.dataField == "did" })?.area || "row",
                areaIndex: userData?.fields.find(o => { return o.dataField == "did" })?.areaIndex || 1,
                width: "auto",
                allowSorting: true,
                sortOrder: 'desc',
                customizeText: function (cellInfo) {
                    const found = allData.distributors.find((item) => item.id == cellInfo.value);
                    return found ? found.distName_FA : cellInfo.value;
                },
            },
            {
                caption: 'برند',
                dataField: 'bid',
                width: "auto",
                allowSorting: true,
                sortOrder: 'desc',
                area: userData?.fields.find(o => { return o.dataField == "bid" })?.area || "row",
                areaIndex: userData?.fields.find(o => { return o.dataField == "bid" })?.areaIndex || 2,
                customizeText: function (cellInfo) {
                    const found = allData.brands.find((item) => item.bId == cellInfo.value);
                    return found ? found.bName_FA : cellInfo.value;
                },
            },
            {
                caption: 'محصول',
                dataField: 'pid',
                width: "auto",
                allowSorting: true,
                sortOrder: 'desc',
                area: userData?.fields.find(o => { return o.dataField == "pid" })?.area || "row",
                areaIndex: userData?.fields.find(o => { return o.dataField == "pid" })?.areaIndex || 3,
                customizeText: function (cellInfo) {
                    const found = allData.products.find((item) => item.value == cellInfo.value);
                    return found ? found.name : cellInfo.value;
                },
            },
            {
                caption: 'شماره بچ',
                dataField: 'batchNo',
                width: "auto",
                allowSorting: true,
                sortOrder: 'desc',
                area: userData?.fields.find(o => { return o.dataField == "batchNo" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "batchNo" })?.areaIndex || 15,
                //customizeText: function (cellInfo) {
                //    const found = allData.cities.find((item) => item.cityId == cellInfo.value);
                //    return found ? found.cityName : cellInfo.value;
                //},
            }, {
                caption: 'سال - ماه (تاریخ انقضا)',
                dataField: 'expYearMonth',
                width: "auto",
                allowSorting: true,
                sortOrder: 'asc',
                area: userData?.fields.find(o => { return o.dataField == "expYearMonth" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "expYearMonth" })?.areaIndex || 16,
                //customizeText: function (cellInfo) {
                //    const found = allData.cities.find((item) => item.cityId == cellInfo.value);
                //    return found ? found.cityName : cellInfo.value;
                //},
            },
            {
                caption: 'روز(تاریخ انقضا)',
                dataField: 'expDay',
                width: "auto",
                allowSorting: true,
                sortOrder: 'asc',
                area: userData?.fields.find(o => { return o.dataField == "expDay" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "expDay" })?.areaIndex || 17,
                //customizeText: function (cellInfo) {
                //    const found = allData.cities.find((item) => item.cityId == cellInfo.value);
                //    return found ? found.cityName : cellInfo.value;
                //},
            },
            {
                caption: 'مرکز توزیع',
                dataField: 'cityId',
                width: "auto",
                allowSorting: true,
                sortOrder: 'desc',
                area: userData?.fields.find(o => { return o.dataField == "cityId" })?.area || "row",
                areaIndex: userData?.fields.find(o => { return o.dataField == "cityId" })?.areaIndex || 4,
                customizeText: function (cellInfo) {
                    const found = allData.cities.find((item) => item.cityId == cellInfo.value);
                    return found ? found.cityName : cellInfo.value;
                },
            },
            {
                caption: 'موجودی ریالی',
                dataField: 'total',
                dataType: 'number',
                width: "auto",
                summaryType: 'sum',
                allowSorting: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                    thousandsSeparator: true,
                },
                area: userData?.fields.find(o => { return o.dataField == "total" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "total" })?.areaIndex || 5,
            },
            {
                caption: 'موجودی تعدادی',
                dataField: 'qty',
                width: "auto",
                dataType: 'number',
                summaryType: 'sum',
                allowSorting: true,
                area: userData?.fields.find(o => { return o.dataField == "qty" })?.area || "data",
                areaIndex: userData?.fields.find(o => { return o.dataField == "qty" })?.areaIndex || 6,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                    thousandsSeparator: true,
                }
            },
            ],
            store: pivotData,
        },
        onContextMenuPreparing: contextMenuPreparing,
    }).dxPivotGrid('instance');
    pivotGrid.bindChart(pivotGridChart, {
        dataFieldsDisplayMode: 'singleAxis',   // 👈 همه داده‌ها روی یک محور نشون داده بشن
        alternateDataFields: false,            // 👈 داده‌ها در یک سری مجزا بیان، نه در پنل جدا
    });
}
function initiatePivotDistSaleStock(pivotData, userData) {
    $("#sheet-1-15").find(".saleStock").fadeIn()
    const pivotGridChart = $('#pivotgridsaleStock-chart').dxChart({
        commonSeriesSettings: {
            type: 'bar', // initial type (will be overridden by the selector)
            label: {
                visible: false,
                position: 'top',
                font: { size: 10, weight: 100 },
                format: 'fixedPoint',
                precision: 0,
                textOverflow: 'ellipsis',
                customizeText(args) {
                    return `<span style="color:black !important;">${args.seriesName}</span><span style="color:black !important;">(${args.valueText})`;
                }
            }
        },
        tooltip: {
            enabled: true,
            customizeTooltip(args) {
                return {
                    html: `${args.seriesName}<div class='currency' style="font-family:'IRANSansWeb'">${threeDigit(args.valueText)}</div>`
                };
            }
        },
        size: { height: "auto" },
        theme: 'generic.softblue',
        adaptiveLayout: { width: 450, keepLabels: true },
        zoomAndPan: {
            argumentAxis: "both",
            valueAxis: "x",
            enableMouseWheel: true,
            allowMouseWheel: true,
            dragToZoom: true
        }
    }).dxChart('instance');


    $('#chartTypeSelectorSaleStock').dxSelectBox({
        dataSource: chartTypes,
        valueExpr: 'value',       // the actual chart type used in dxChart
        displayExpr: 'text',      // what the user sees (Persian)
        value: 'bar',         // initial selection
        placeholder: 'نوع نمودار...',
        width: '100%',
        dropDownOptions: {
            width: 500,                      // widen popup           
        },
        onValueChanged(e) {
            pivotGridChart.option('commonSeriesSettings.type', e.value);

            const series = pivotGridChart.option('series') || [];
            if (series.length) {
                pivotGridChart.option('series', series.map(s => ({ ...s, type: e.value })));
            }
        },
        itemTemplate: function (itemData) {
            return `
              <div style="white-space: normal; line-height: 1.4;">
                <div>${itemData.text}</div>
                <div style="font-size:12px;color:gray;white-space:normal;word-break:break-word;">
                  ${itemData.desc}
                </div>
              </div>
            `;
        },
    });
    const pivotGrid = $('#pivotGridsaleStock').dxPivotGrid({
        rtlEnabled: true,
        allowExpandAll: true,
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        allowSearching: true,
        showBorders: true,
        showRowGrandTotals: true,
        showColumnGrandTotals: true,
        showRowTotals: true,
        showColumnTotals: true,
        showTotalsPrior: 'both',
        height: "auto",
        fieldChooser: {
            enabled: true,
            height: 700,
            width: 900,
            searchMode: 'contains',
            searchEnabled: true,
        },
        fieldPanel: {
            showColumnFields: true,
            showDataFields: true,
            showFilterFields: true,
            showRowFields: true,
            allowFieldDragging: true,
            visible: true,
        },
        texts: {
            grandTotal: "جمع کل"
        },
        export: {
            enabled: true,
            fileName: "pivot_data",
            excelFilterEnabled: true
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'pivotGridSaleStock',
        },
        onExporting: function (e) {
            const pivotGrid = e.component;
            pivotGrid.option({
                showRowGrandTotals: false,
                showColumnGrandTotals: false,
                showRowTotals: false,
                showColumnTotals: false
            });

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Pivot Data");
            const repeatedValues = {};

            DevExpress.excelExporter.exportPivotGrid({
                component: pivotGrid,
                worksheet: worksheet,
                mergeRowFieldValues: false,
                mergeColumnFieldValues: false,
                customizeCell: function ({ excelCell, pivotCell }) {
                    // 🔹 کنترل فیلدهای ردیفی
                    if (pivotCell && pivotCell.area === "row") {
                        const key = `${pivotCell.rowIndex}-${pivotCell.columnIndex}`;
                        if (pivotCell.text) {
                            repeatedValues[pivotCell.columnIndex] = pivotCell.text;
                        } else {
                            excelCell.value = repeatedValues[pivotCell.columnIndex];
                        }
                    }

                    // 🔹 کنترل سلول‌های عددی (Data area)
                    if (pivotCell && pivotCell.area === "data" && typeof pivotCell.value === "number") {
                        excelCell.value = pivotCell.value; // 👈 عدد واقعی
                        excelCell.numFmt = '#,##0;[Red]-#,##0'; // 👈 فرمت اکسل: مثبت عادی، منفی قرمز
                        excelCell.alignment = { horizontal: 'right', readingOrder: 1 }; // 👈 تراز راست
                    }
                }
            }).then(() => {
                return workbook.xlsx.writeBuffer();
            }).then((buffer) => {
                saveAs(new Blob([buffer], { type: "application/octet-stream" }), "pivot_no_merged.xlsx");
            }).finally(() => {
                pivotGrid.option({
                    showRowGrandTotals: true,
                    showColumnGrandTotals: true,
                    showRowTotals: true,
                    showColumnTotals: true
                });
            });

            e.cancel = true;
        },
        headerFilter: {
            allowSearch: true,
            height: 450,
            searchTimeout: 300,
            showRelevantValues: false,
        },
        onCellPrepared: function (e) {
            if (e.cell.rowType == "GT") {
                $(e.cellElement).css('position', 'sticky')
                $(e.cellElement).css('top', '0px')
            }
            if (e.cell.columnType == "GT") {
                $(e.cellElement).css('position', 'sticky')
                $(e.cellElement).css('right', '0px')
            }
            if (e.rowType === 'total' && e.columnType === 'total') {
                // Apply custom background color for the grand total row
                e.cellElement.css('background-color', '#f8f8f8'); // Change the color to your preference
                e.cellElement.css('font-weight', 'bold');  // Make the text bold for grand total
            }
        },
        dataSource: {
            fields: [{
                caption: 'شرکت',
                allowColumnResizing: true,
                dataField: 'cid',
                width: "auto",
                area: userData?.fields.find(o => { return o.dataField == "cid" })?.area || "column",
                areaIndex: userData?.fields.find(o => { return o.dataField == "cid" })?.areaIndex || 0,
                allowSorting: true,
                sortOrder: 'desc',
                customizeText: function (cellInfo) {
                    const found = allData.companies.find((item) => item.cId == cellInfo.value);
                    return found ? found.cName_FA : cellInfo.value;
                },
            },
            {
                caption: 'پخش',
                dataField: 'did',
                area: userData?.fields.find(o => { return o.dataField == "did" })?.area || "row",
                areaIndex: userData?.fields.find(o => { return o.dataField == "did" })?.areaIndex || 1,
                width: "auto",
                allowSorting: true,
                sortOrder: 'desc',
                customizeText: function (cellInfo) {
                    const found = allData.distributors.find((item) => item.id == cellInfo.value);
                    return found ? found.distName_FA : cellInfo.value;
                },
            },
            {
                caption: 'برند',
                dataField: 'bid',
                width: "auto",
                allowSorting: true,
                sortOrder: 'desc',
                area: userData?.fields.find(o => { return o.dataField == "bid" })?.area || "row",
                areaIndex: userData?.fields.find(o => { return o.dataField == "bid" })?.areaIndex || 2,
                customizeText: function (cellInfo) {
                    const found = allData.brands.find((item) => item.bId == cellInfo.value);
                    return found ? found.bName_FA : cellInfo.value;
                },
            },
            {
                caption: 'محصول',
                dataField: 'pid',
                width: 300,
                allowSorting: true,
                sortOrder: 'desc',
                area: userData?.fields.find(o => { return o.dataField == "pid" })?.area || "row",
                areaIndex: userData?.fields.find(o => { return o.dataField == "pid" })?.areaIndex || 3,
                customizeText: function (cellInfo) {
                    const found = allData.products.find((item) => item.value == cellInfo.value);
                    return found ? found.name : cellInfo.value;
                },
            },
            {
                caption: 'مرکز توزیع',
                dataField: 'ct',
                width: "auto",
                allowSorting: true,
                sortOrder: 'desc',
                area: userData?.fields.find(o => { return o.dataField == "ct" })?.area || "row",
                areaIndex: userData?.fields.find(o => { return o.dataField == "ct" })?.areaIndex || 4,
                customizeText: function (cellInfo) {
                    const found = allData.cities.find((item) => item.cityId == cellInfo.value);
                    return found ? found.cityName : cellInfo.value;
                },
            },
            {
                caption: 'فروش ریالی',
                dataField: 'totalSale',
                dataType: 'number',
                width: "auto",
                summaryType: 'sum',
                allowSorting: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                    thousandsSeparator: true,
                },
                customizeText: function (cellInfo) {
                    if (cellInfo.value === null || cellInfo.value === undefined) return "";
                    let formatted = DevExpress.localization.formatNumber(cellInfo.value, { type: 'fixedPoint', precision: 0 });
                    // Inject \u200E so minus sign stays at left in RTL
                    return "\u200E" + formatted;
                },
                customizeText: function (cellInfo) {
                    if (cellInfo.value === null || cellInfo.value === undefined) return "";
                    let formatted = DevExpress.localization.formatNumber(cellInfo.value, { type: 'fixedPoint', precision: 0 });
                    // Inject \u200E so minus sign stays at left in RTL
                    return "\u200E" + formatted;
                },
                area: userData?.fields.find(o => { return o.dataField == "totalSale" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "totalSale" })?.areaIndex || 5,
            },
            {
                caption: 'فروش تعدادی',
                dataField: 'qtySale',
                width: "auto",
                dataType: 'number',
                summaryType: 'sum',
                allowSorting: true,
                area: userData?.fields.find(o => { return o.dataField == "qtySale" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "atySale" })?.areaIndex || 6,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                    thousandsSeparator: true,
                }
            },
            {
                caption: 'موجودی ریالی',
                dataField: 'totalStock',
                dataType: 'number',
                width: "auto",
                summaryType: 'sum',
                allowSorting: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                    thousandsSeparator: true,
                },
                area: userData?.fields.find(o => { return o.dataField == "totalStock" })?.area || "data",
                areaIndex: userData?.fields.find(o => { return o.dataField == "totalStock" })?.areaIndex || 7,
            },
            {
                caption: 'موجودی تعدادی',
                dataField: 'qtyStock',
                width: "auto",
                dataType: 'number',
                summaryType: 'sum',
                allowSorting: true,
                area: userData?.fields.find(o => { return o.dataField == "qtyStock" })?.area || "filter",
                areaIndex: userData?.fields.find(o => { return o.dataField == "qtyStock" })?.areaIndex || 8,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                    thousandsSeparator: true,
                }
            },
            ],
            store: pivotData,
        },
        onContextMenuPreparing: contextMenuPreparing,
    }).dxPivotGrid('instance');
    pivotGrid.bindChart(pivotGridChart, {
        dataFieldsDisplayMode: 'singleAxis',   // 👈 همه داده‌ها روی یک محور نشون داده بشن
        alternateDataFields: false,            // 👈 داده‌ها در یک سری مجزا بیان، نه در پنل جدا
    });

}
function contextMenuPreparing(e) {
    const dataSource = e.component.getDataSource();
    const sourceField = e.field;
    if (sourceField) {
        if (!sourceField.groupName || sourceField.groupIndex === 0) {
            e.items.push({
                text: 'مخفی کردن این فیلد',
                onItemClick() {
                    let fieldIndex;
                    if (sourceField.groupName) {
                        fieldIndex = dataSource
                            .getAreaFields(sourceField.area, true)[sourceField.areaIndex]
                            .index;
                    } else {
                        fieldIndex = sourceField.index;
                    }
                    dataSource.field(fieldIndex, {
                        area: null,
                    });
                    dataSource.load();
                },
            });
        }
        if (sourceField.dataType === 'number') {
            const setSummaryType = function (args) {
                dataSource.field(sourceField.index, {
                    summaryType: args.itemData.value,
                });
                dataSource.load();
            };
            const menuItems = [];
            e.items.push({ text: 'نوع نمایش داده', items: menuItems });
            $.each(['مجموع', 'میانگین', 'کمترین', 'بیشترین'], (_, summaryType) => {
                const summaryTypeValue = summaryType.toLowerCase();
                menuItems.push({
                    text: summaryType,
                    value: summaryType.toLowerCase(),
                    onItemClick: setSummaryType,
                    selected: e.field.summaryType == summaryTypeValue,
                });
            });
        }
    }
}
function getPivotDataFinance() {
    loader('show')
    var data = getcomboValues()
    $.ajax({
        type: "POST",
        url: "../controller/services.asmx/getPivotDataFinance",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data }),
        success: function (response) {
            loader('hide')
            var pivotData = JSON.parse(response.d)
            pivotData = pivotData.result
            //allData.getPivotDataFinance = pivotData
            initiatePivotFinance(pivotData)
        },
        error: function (xhr, status, error) {
            console.error("Error loading dropdown data:", error);
        }
    });
}
//let minPositive = null;
//let maxPositive = null;
function initiatePivotFinance(pivotData) {
    const pivotGridChart = $('#pivotgridFinance-chart').dxChart({
        commonSeriesSettings: {
            type: 'bar',
            label: {
                visible: false,
                position: 'top',
                font: {
                    size: 10,
                    weight: 100,
                },
                format: 'fixedPoint',
                precision: 0,
                textOverflow: 'ellipsis',
                customizeText: function (args) {
                    return `<span style="color:black !important;">(${args.seriesName})`;
                }
            },
        },
        tooltip: {
            enabled: true,
            customizeTooltip(args) {
                return {
                    html: `${args.seriesName}<div  class='currency' style="font-family:'IRANSansWeb'">${threeDigit(args.valueText)}</div >`,
                };
            },
        },
        size: {
            height: "auto",
        },
        adaptiveLayout: {
            width: 450,
            keepLabels: true
        },
        zoomAndPan: {
            argumentAxis: "both", // Enable zooming on both X and Y axes
            valueAxis: "x",    // Enable zooming on both X and Y axes
            enableMouseWheel: true, // Enable zooming with the mouse wheel
            allowMouseWheel: true,  // Allow mouse wheel zooming
        },
    }).dxChart('instance');
    $('#chartTypeSelectorFinance').dxSelectBox({
        dataSource: chartTypes,
        valueExpr: 'value',       // the actual chart type used in dxChart
        displayExpr: 'text',      // what the user sees (Persian)
        value: 'bar',         // initial selection
        placeholder: 'نوع نمودار...',
        width: '100%',
        dropDownOptions: {
            width: 500,                      // widen popup           
        },
        onValueChanged(e) {
            pivotGridChart.option('commonSeriesSettings.type', e.value);

            const series = pivotGridChart.option('series') || [];
            if (series.length) {
                pivotGridChart.option('series', series.map(s => ({ ...s, type: e.value })));
            }
        },
        itemTemplate: function (itemData) {
            return `
              <div style="white-space: normal; line-height: 1.4;">
                <div>${itemData.text}</div>
                <div style="font-size:12px;color:gray;white-space:normal;word-break:break-word;">
                  ${itemData.desc}
                </div>
              </div>
            `;
        },
    });
    const pivotGrid = $('#pivotGridFinance').dxPivotGrid({
        rtlEnabled: true,
        allowExpandAll: true,
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        allowSearching: true,
        showBorders: true,
        showRowGrandTotals: true,
        showColumnGrandTotals: true,
        showRowTotals: true,
        showColumnTotals: true,
        showTotalsPrior: 'both',
        height: "82vh",
        fieldChooser: {
            enabled: true,
            height: 700,
            width: 900,
            searchMode: 'contains',
            searchEnabled: true,
        },
        fieldPanel: {
            showColumnFields: true,
            showDataFields: true,
            showFilterFields: true,
            showRowFields: true,
            allowFieldDragging: true,
            visible: true,
        },
        texts: {
            grandTotal: "جمع کل"
        },
        export: {
            enabled: true,
            fileName: "pivot_data_finance",
            excelFilterEnabled: true
        },
        headerFilter: {
            allowSearch: true,
            height: 450,
            searchTimeout: 300,
            showRelevantValues: false,
        },
        onCellPrepared: function (e) {
            if (typeof e.cell.value === "number") {
                let formattedValue = DevExpress.localization.formatNumber(e.cell.value, { type: 'fixedPoint', precision: 0 });

                if (e.cell.value < 0) {
                    // Negative → red text + light red background
                    e.cellElement.css({
                        "color": "red",
                        "background-color": "#fff0f0" // very light red
                    });
                    e.cellElement.html("\u200E" + formattedValue);
                } else {
                    // Positive or zero → black text + light blue background
                    e.cellElement.css({
                        "color": "black",
                        "background-color": "#f0f8ff" // very light blue
                    });
                    e.cellElement.html("\u200E" + formattedValue);
                }
            }
        },
        onExporting: function (e) {
            const pivotGrid = e.component;
            pivotGrid.option({
                showRowGrandTotals: false,
                showColumnGrandTotals: false,
                showRowTotals: false,
                showColumnTotals: false
            });

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Pivot Data");
            const repeatedValues = {};

            DevExpress.excelExporter.exportPivotGrid({
                component: pivotGrid,
                worksheet: worksheet,
                mergeRowFieldValues: false,
                mergeColumnFieldValues: false,
                customizeCell: function ({ excelCell, pivotCell }) {
                    // 🔹 کنترل فیلدهای ردیفی
                    if (pivotCell && pivotCell.area === "row") {
                        const key = `${pivotCell.rowIndex}-${pivotCell.columnIndex}`;
                        if (pivotCell.text) {
                            repeatedValues[pivotCell.columnIndex] = pivotCell.text;
                        } else {
                            excelCell.value = repeatedValues[pivotCell.columnIndex];
                        }
                    }

                    // 🔹 کنترل سلول‌های عددی (Data area)
                    if (pivotCell && pivotCell.area === "data" && typeof pivotCell.value === "number") {
                        excelCell.value = pivotCell.value; // 👈 عدد واقعی
                        excelCell.numFmt = '#,##0;[Red]-#,##0'; // 👈 فرمت اکسل: مثبت عادی، منفی قرمز
                        excelCell.alignment = { horizontal: 'right', readingOrder: 1 }; // 👈 تراز راست
                    }
                }
            }).then(() => {
                return workbook.xlsx.writeBuffer();
            }).then((buffer) => {
                saveAs(new Blob([buffer], { type: "application/octet-stream" }), "pivot_no_merged.xlsx");
            }).finally(() => {
                pivotGrid.option({
                    showRowGrandTotals: true,
                    showColumnGrandTotals: true,
                    showRowTotals: true,
                    showColumnTotals: true
                });
            });

            e.cancel = true;
        },
        dataSource: {
            fields: [{
                caption: 'شرکت',
                dataField: 'cid',
                width: 180,
                area: "column",
                allowSorting: true,
                sortBySummaryField: 'total',
                sortOrder: 'desc',
                customizeText: function (cellInfo) {
                    const found = allData.companies.find((item) => item.cId == cellInfo.value);
                    return found ? found.cName_FA : cellInfo.value;
                },
            },
            {
                caption: 'برند',
                dataField: 'bid',
                width: 200,
                allowSorting: true,
                sortBySummaryField: 'total',
                area: "row",
                sortOrder: 'desc',
                customizeText: function (cellInfo) {
                    const found = allData.brands.find((item) => item.bId == cellInfo.value);
                    return found ? found.bName_FA : cellInfo.value;
                },
            },
            {
                caption: 'ماه',
                allowSorting: true,
                dataField: 'month',
                width: 200,
                area: "filter",
                customizeText: function (cellInfo) {
                    const found = allData.months.find((item) => item.value == cellInfo.value);
                    return found ? found.name : cellInfo.value;
                },
            },
            {
                caption: 'سال',
                allowSorting: true,
                dataField: 'year',
                width: 200,
                area: "filter",
                customizeText: function (cellInfo) {
                    return cellInfo.value;
                },
            },
            {
                caption: 'محصول',
                dataField: 'pid',
                width: 600,
                allowSorting: true,
                sortBySummaryField: 'total',
                sortOrder: 'desc',
                area: "filter",
                customizeText: function (cellInfo) {
                    const found = allData.products.find((item) => item.value == cellInfo.value);
                    return found ? found.name : cellInfo.value;
                },
            },
            {
                caption: 'مشتری',
                dataField: 'ctn',
                width: 200,
                allowSorting: true,
                allowSearch: true,
                sortBySummaryField: 'total',
                sortOrder: 'desc',
                area: "filter",
                customizeText: function (cellInfo) {
                    const found = (allData.customerFinance || getDistinctValues("CustomerNameFinance")).find((item) => item.CustomerName == cellInfo.value);
                    return found ? found.CustomerName : cellInfo.value;
                },
            },
            {
                caption: 'فروش ریالی',
                dataField: 'total',
                dataType: 'number',
                summaryType: 'sum',
                allowSorting: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                    thousandsSeparator: true,
                },
                area: 'data'
            },
            {
                caption: 'فروش تعدادی',
                dataField: 'qty',
                dataType: 'number',
                summaryType: 'sum',
                allowSorting: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                    thousandsSeparator: true,
                },
                area: 'data'
            }
            ],
            store: pivotData,
        },
        onContextMenuPreparing: contextMenuPreparing,
    }).dxPivotGrid('instance');
    pivotGrid.bindChart(pivotGridChart, {
        dataFieldsDisplayMode: 'singleAxis',   // 👈 همه داده‌ها روی یک محور نشون داده بشن
        alternateDataFields: false,            // 👈 داده‌ها در یک سری مجزا بیان، نه در پنل جدا
    });
}

function getPivotDataTarget() {
    loader('show')
    var data = getcomboValues()
    $.ajax({
        type: "POST",
        url: "../controller/services.asmx/getPivotDataTarget",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data }),
        success: function (response) {
            loader('hide')
            var pivotData = JSON.parse(response.d)
            pivotData = pivotData.result
            initiatePivotTarget(pivotData)
        },
        error: function (xhr, status, error) {
            console.error("Error loading dropdown data:", error);
        }
    });
}

function initiatePivotTarget(pivotData) {
    const pivotGridChart = $('#pivotgridTarget-chart').dxChart({
        commonSeriesSettings: {
            type: 'bar', // initial type (will be overridden by the selector)
            label: {
                visible: false,
                position: 'top',
                font: { size: 10, weight: 100 },
                format: 'fixedPoint',
                precision: 0,
                textOverflow: 'ellipsis',
                customizeText(args) {
                    return `<span style="color:black !important;">${args.seriesName}</span><span style="color:black !important;">(${args.valueText})`;
                }
            }
        },
        tooltip: {
            enabled: true,
            customizeTooltip(args) {
                return {
                    html: `${args.seriesName}<div class='currency' style="font-family:'IRANSansWeb'">${threeDigit(args.valueText)}</div>`
                };
            }
        },
        size: { height: "auto" },
        adaptiveLayout: { width: 450, keepLabels: true },
        theme: 'generic.softblue',
        zoomAndPan: {
            argumentAxis: "both",
            valueAxis: "x",
            enableMouseWheel: true,
            allowMouseWheel: true,
            dragToZoom: true
        }
    }).dxChart('instance');
    $('#chartTypeSelectorTarget').dxSelectBox({
        dataSource: chartTypes,
        valueExpr: 'value',       // the actual chart type used in dxChart
        displayExpr: 'text',      // what the user sees (Persian)
        value: 'bar',         // initial selection
        placeholder: 'نوع نمودار...',
        width: '100%',
        dropDownOptions: {
            width: 500,                      // widen popup           
        },
        onValueChanged(e) {
            pivotGridChart.option('commonSeriesSettings.type', e.value);

            const series = pivotGridChart.option('series') || [];
            if (series.length) {
                pivotGridChart.option('series', series.map(s => ({ ...s, type: e.value })));
            }
        },
        itemTemplate: function (itemData) {
            return `
              <div style="white-space: normal; line-height: 1.4;">
                <div>${itemData.text}</div>
                <div style="font-size:12px;color:gray;white-space:normal;word-break:break-word;">
                  ${itemData.desc}
                </div>
              </div>
            `;
        },
    });

    pivotData.forEach(row => {
        row.percentageTotal = 0;
        row.finalTargetQty = 0;
    });

    const pivotGrid = $('#pivotGridTarget').dxPivotGrid({
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'pivotGridTarget',
        },
        rtlEnabled: true,
        allowExpandAll: true,
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        allowSearching: true,
        showBorders: true,
        showRowGrandTotals: true,
        showColumnGrandTotals: true,
        showRowTotals: true,
        showColumnTotals: true,
        showTotalsPrior: 'both',
        height: "auto",
        fieldChooser: {
            enabled: true,
            height: 700,
            width: 900,
            searchMode: 'contains',
            searchEnabled: true,
        },
        fieldPanel: {
            showColumnFields: true,
            showDataFields: true,
            showFilterFields: true,
            showRowFields: true,
            allowFieldDragging: true,
            visible: true,
        },
        texts: {
            grandTotal: "جمع کل"
        },
        export: {
            enabled: true,
            fileName: "pivot_data_target",
            excelFilterEnabled: true
        },
        headerFilter: {
            allowSearch: true,
            height: 450,
            searchTimeout: 300,
            showRelevantValues: false,
        },
        onCellPrepared: function (e) {
            if (typeof e.cell.value === "number") {
                let formattedValue = DevExpress.localization.formatNumber(e.cell.value, { type: 'fixedPoint', precision: 0 });

                if (e.cell.value < 0) {
                    // Negative → red text + light red background
                    e.cellElement.css({
                        "color": "red",
                        "background-color": "#fff0f0" // very light red
                    });
                    e.cellElement.html("\u200E" + formattedValue);
                } else {
                    // Positive or zero → black text + light blue background
                    e.cellElement.css({
                        "color": "black",
                        "background-color": "#f0f8ff" // very light blue
                    });
                    e.cellElement.html("\u200E" + formattedValue);
                }
            }
        },
        onExpandValueChanging: function (e) {
            // مسیر سطر
            const path = e.path;

            // فیلتر کردن داده‌های واقعی بر اساس مسیر
            let filteredData = pivotData;
            path.forEach(node => {
                if (node.field && node.value != null) {
                    const dataField = node.field.dataField;
                    filteredData = filteredData.filter(d => d[dataField] === node.value);
                }
            });

            // حالا filteredData شامل همه ردیف‌هایی هست که متعلق به این سطر هستند
            const totalSale = filteredData.reduce((sum, r) => sum + (r.TotalSale || 0), 0);
            const totalTarget = filteredData.reduce((sum, r) => sum + (r.TotalTargetValue || 0), 0);

            //   console.log("Filtered data for this row:", filteredData);
            //console.log("Total Sale:", totalSale, "Total Target:", totalTarget);
        },
        onExporting: function (e) {
            const pivotGrid = e.component;
            pivotGrid.option({
                showRowGrandTotals: false,
                showColumnGrandTotals: false,
                showRowTotals: false,
                showColumnTotals: false
            });
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Pivot Data Target");
            const repeatedValues = {};
            DevExpress.excelExporter.exportPivotGrid({
                component: pivotGrid,
                worksheet: worksheet,
                mergeRowFieldValues: false,   // ✅ prevent row field merging
                mergeColumnFieldValues: false, // ✅ prevent column field merging
                customizeCell: function ({ excelCell, pivotCell }) {
                
                    if (pivotCell && pivotCell.area === "row") {
                        const key = `${pivotCell.rowIndex}-${pivotCell.columnIndex}`;
                        if (pivotCell.text) {
                            repeatedValues[pivotCell.columnIndex] = pivotCell.text;
                        } else {
                            // Repeat the last known value
                            excelCell.value = repeatedValues[pivotCell.columnIndex];
                        }
                    }
                    if (pivotCell && pivotCell.format?.type == "percent") {


                        excelCell.value = excelCell.value / 100; // ✅ اصلاح برای اکسل
                         excelCell.numFmt = "0.0%";  
                    }
             
                }
            }).then(() => {
                return workbook.xlsx.writeBuffer();
            }).then((buffer) => {
                saveAs(new Blob([buffer], { type: "application/octet-stream" }), "pivot_no_merged.xlsx");
            }).finally(() => {
                pivotGrid.option({
                    showRowGrandTotals: true,
                    showColumnGrandTotals: true,
                    showRowTotals: true,
                    showColumnTotals: true
                });
            });
            e.cancel = true;
        },
        dataSource: {
            fields: [
                {
                    caption: 'شرکت',
                    dataField: 'cid',
                    width: 180,
                    area: "column",
                    allowSorting: true,
                    sortBySummaryField: 'total',
                    sortOrder: 'desc',
                    customizeText: function (cellInfo) {
                        const found = allData.companies.find((item) => item.cId == cellInfo.value);
                        return found ? found.cName_FA : cellInfo.value;
                    },
                },
                {
                    caption: 'پخش',
                    dataField: 'did',
                    width: 180,
                    area: "column",
                    allowSorting: true,
                    sortBySummaryField: 'total',
                    sortOrder: 'desc',
                    customizeText: function (cellInfo) {
                        const found = allData.distributors.concat({ id: 0, distName_FA: 'فروش مستقیم(مالی)', colorCode: '#BD11C7', orderNo: 10 }).find((item) => item.id == cellInfo.value);
                        return found ? found.distName_FA : cellInfo.value;
                    },
                },
                {
                    caption: 'برند',
                    dataField: 'bid',
                    width: 200,
                    allowSorting: true,
                    sortBySummaryField: 'total',
                    area: "row",
                    sortOrder: 'desc',
                    customizeText: function (cellInfo) {
                        const found = allData.brands.find((item) => item.bId == cellInfo.value);
                        return found ? found.bName_FA : cellInfo.value;
                    },
                },
                {
                    caption: 'ماه',
                    allowSorting: true,
                    dataField: 'month',
                    width: 200,
                    area: "filter",
                    customizeText: function (cellInfo) {
                        const found = allData.months.find((item) => item.value == cellInfo.value);
                        return found ? found.name : cellInfo.value;
                    },
                },
                {
                    caption: 'سال - ماه',
                    allowSorting: true,
                    dataField: 'yearMonth',
                    width: 200,
                    area: "filter",
                    customizeText: function (cellInfo) {
                        return cellInfo.value;
                    },
                },
                {
                    caption: 'سال',
                    allowSorting: true,
                    dataField: 'year',
                    width: 200,
                    area: "filter",
                    customizeText: function (cellInfo) {
                        return cellInfo.value;
                    },
                },
                {
                    caption: 'محصول',
                    dataField: 'pid',
                    width: 600,
                    allowSorting: true,
                    sortBySummaryField: 'total',
                    sortOrder: 'desc',
                    area: "filter",
                    customizeText: function (cellInfo) {
                        const found = allData.products.find((item) => item.value == cellInfo.value);
                        return found ? found.name : cellInfo.value;
                    },
                },

                {
                    caption: 'فروش ریالی',
                    dataField: 'TotalSale',
                    dataType: 'number',
                    summaryType: 'sum',
                    allowSorting: true,
                    format: {
                        type: 'fixedPoint',
                        precision: 0,
                        thousandsSeparator: true,
                    },
                    area: 'data'
                },
                {
                    caption: 'فروش تعدادی',
                    dataField: 'SaleValue',
                    dataType: 'number',
                    summaryType: 'sum',
                    allowSorting: true,
                    format: {
                        type: 'fixedPoint',
                        precision: 0,
                        thousandsSeparator: true,
                    },
                    area: 'data'
                },
                {
                    caption: 'تارگت ریالی',
                    dataField: 'TotalTargetValue',
                    dataType: 'number',
                    summaryType: 'sum',
                    allowSorting: true,
                    format: {
                        type: 'fixedPoint',
                        precision: 0,
                        thousandsSeparator: true,
                    },
                    area: 'data'
                },
                {
                    caption: 'تارگت تعدادی',
                    dataField: 'TargetValue',
                    dataType: 'number',
                    summaryType: 'sum',
                    allowSorting: true,
                    format: {
                        type: 'fixedPoint',
                        precision: 0,
                        thousandsSeparator: true,
                    },
                    area: 'data'
                },

                {
                    caption: 'درصد تحقق ریالی',
                    dataType: 'number',
                    summaryType: 'custom',
                    calculateCustomSummary: function (options) {
                        if (options.summaryProcess === 'start') {
                            options.totalSales = 0;
                            options.totalTarget = 0;
                        }

                        if (options.summaryProcess === 'calculate') {
                            if (options.value) {
                                options.totalSales += options.value.TotalSale || 0;
                                options.totalTarget += options.value.TotalTargetValue || 0;
                            }
                        }

                        if (options.summaryProcess === 'finalize') {
                            options.totalValue = options.totalTarget !== 0
                                ? (options.totalSales / options.totalTarget) * 100
                                : 0;
                        }
                    },
                    format: {
                        type: 'percent',
                        precision: 2
                    },
                    area: 'data'
                },
                {
                    caption: 'درصد تحقق تعدادی',
                    dataType: 'number',
                    summaryType: 'custom',
                    calculateCustomSummary: function (options) {
                        if (options.summaryProcess === 'start') {
                            options.totalSales = 0;
                            options.totalTarget = 0;
                        }

                        if (options.summaryProcess === 'calculate') {
                            if (options.value) {
                                options.totalSales += options.value.SaleValue || 0;
                                options.totalTarget += options.value.TargetValue || 0;
                            }
                        }

                        if (options.summaryProcess === 'finalize') {
                            options.totalValue = options.totalTarget !== 0
                                ? (options.totalSales / options.totalTarget) * 100
                                : 0;
                        }
                    },
                    format: {
                        type: 'percent',
                        precision: 2
                    },
                    area: 'data'
                }, {
                    caption: 'وضعیت تارگت',
                    dataField: 'SaleTargetstate',
                    dataType: 'string',
                    area: 'row',
                    summaryType: 'max',   
                    customizeText: function (cellInfo) {
                        switch (cellInfo.value) {
                            case 0: return "✔ (فروش و تارگت دارد)";
                            case 1: return "✔ (هیچکدام ندارد)";
                            case 2: return "⚠ (فروش دارد، تارگت ندارد)";
                            case 3: return "⚠ (تارگت دارد، فروش ندارد)";
                            case 4: return "⚠ (تارگت دارد، در هیچ پخشی تعریف نشده)";
                            default: return "";
                        }
                    }
                }
            ], 
            store: pivotData,
      
        
        },
        onContextMenuPreparing: contextMenuPreparing,
    }).dxPivotGrid('instance');
    pivotGrid.bindChart(pivotGridChart, {
        dataFieldsDisplayMode: 'singleAxis',   // 👈 همه داده‌ها روی یک محور نشون داده بشن
        alternateDataFields: false,            // 👈 داده‌ها در یک سری مجزا بیان، نه در پنل جدا
    });
}

function genReporTable(data, columns, rows, values, targetId) {
    $(targetId).find(".lblSum").find(".lblTotalQuantity").addClass('d-none')
    $(targetId).find(".lblSum").find(".lblTotalPrice").addClass('d-none')
    var sumQty = 0;
    var sumPrice = 0;
    data.filter(function (d) {
        sumQty += d?.goodsPrice;
        sumPrice += d?.saleAmount;
    })
    if (!isNaN(sumQty) || !isNaN(sumPrice)) {
        if (!isNaN(sumQty)) {
            $(targetId).find(".lblSum").find(".lblTotalPrice").removeClass('d-none').find(".lblTotalQuantityValue").text(threeDigit(sumQty))
        }
        if (!isNaN(sumPrice)) {
            $(targetId).find(".lblSum").find(".lblTotalQuantity").removeClass('d-none').find(".lblTotalPriceValue").text(threeDigit(sumPrice))
        }
    }
    const headerHtml = createDynamicHeaders(data, columns, rows.length, values);
    $(targetId).find("#pivotHeadTbl").html(headerHtml);
    const bodyHtml = createPivotBody(data, columns, rows, values);
    $(targetId).find("#pivotBodyTbl").html(bodyHtml);
    handlePivotTblUi();
}
function createDynamicHeaders(data, columns, rowCount, values) {
    const headerStructure = buildHeaderStructure(data, columns, values);
    const headerRows = Array.from({ length: columns.length }, () => []);
    headerRows.forEach(row => {
        for (let i = 0; i < rowCount; i++) {
            row.push('<th></th>');
        }
    });
    generateMultiRowHeaders(headerStructure, columns, 0, headerRows, data, values);
    return headerRows.map(row => `<tr>${row.join('')}</tr>`).join('');
}
function buildHeaderStructure(data, columns, values) {
    const structure = {};
    data.forEach(row => {
        let currentLevel = structure;
        columns.forEach((col, level) => {
            const value = row[col.target];
            // Initialize the current level if not present
            if (!currentLevel[value]) {
                currentLevel[value] = {
                    _children: {},
                    _data: { name: col.alias },
                    _parent: currentLevel._data || null, // Track parent data
                    _level: level, // Track the level for easy debugging or sorting
                };
            }
            // Move to the next level in the hierarchy
            currentLevel = currentLevel[value]._children;
        });
    });
    return structure;
}
function generateMultiRowHeaders(structure, columns, level, headerRows, data, values) {
    const totalSums = values.map(valueField =>
        data.reduce((sum, row) => sum + (row[valueField.target] || 0), 0)
    );
    Object.keys(structure).forEach(key => {
        const children = structure[key]._children;
        const colSpan = calculateColspan(children);
        const rowSpan = children && Object.keys(children).length > 0 ? 1 : columns.length - level;
        // Current header's display value and parent trail
        const displayKey = key === null || key === 'null' ? 'نامعلوم' : key;
        // Filter data for this header level
        const filteredData = data.filter(row => {
            const value = row[columns[level].target];
            return (value === key) || (key === null && (value === null || value === undefined));
        });
        // Calculate sums and percentages for this header
        const sums = values.map(valueField =>
            filteredData.reduce((sum, row) => sum + (row[valueField.target] || 0), 0)
        );
        const percentages = sums.map((sum, index) => {
            const total = totalSums[index];
            return total > 0 ? ((sum / total) * 100).toFixed(0) : 0;
        });
        let sumHtml = '';
        sums.forEach((sum, index) => {
            sumHtml += `<p class="m-0 lblTotal">${threeDigit(sum)} (${percentages[index]}%)</p>`;
        });
        // Add header with breadcrumb trail for sorting
        headerRows[level].push(
            `<th class="bg-light tblH m-2" colspan="${colSpan}" rowspan="${rowSpan}"
                onclick="pivotSort(this, 'column')">
                <p class="m-0 lblTotalCol"><span>${displayKey}</span><span class="sort-icon"></span></p>${sumHtml}
            </th>`
        );
        // Recursively generate child headers
        if (children && Object.keys(children).length > 0) {
            generateMultiRowHeaders(children, columns, level + 1, headerRows, filteredData, values);
        }
    });
}
function pivotSort(element, mode) {
    const clickedTh = $(element);
    const tbody = $('#pivotBodyTbl');
    // Retrieve or set the current sort order for the clicked <th>
    let sortOrder = clickedTh.data('sortOrder') || 'asc'; // Default to descending
    sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'; // Toggle sort order
    clickedTh.data('sortOrder', sortOrder); // Store the new sort order
    // Clear sort icons from all headers
    $('th .sort-icon').empty(); // Clear all icons
    $('th').removeData('sortOrder'); // Reset sortOrder data for all headers 
    clickedTh.data('sortOrder', sortOrder); // Preserve clicked header's sort order
    // Update sort icon for the clicked header
    const sortIconContainer = clickedTh.find('.sort-icon');
    if (sortOrder === 'desc') {
        sortIconContainer.html(`
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="18" fill="green" class="bi bi-sort-down" viewBox="0 0 16 16">
                <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
            </svg>
        `);
    } else {
        sortIconContainer.html(`
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="18" fill="red" class="bi bi-sort-up-alt" viewBox="0 0 16 16">
                <path d="M3.5 13.5a.5.5 0 0 1-1 0V4.707L1.354 5.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 4.707zm4-9.5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5"/>
            </svg>
        `);
    }
    // Get the column range for the clicked header
    const { startIndex, endIndex } = calculateColumnRange(clickedTh);
    const rows = [];
    // Iterate through rows and calculate aggregate values
    tbody.find('tr').each(function () {
        const row = $(this);
        for (let i = startIndex; i <= endIndex; i++) {
            const td = row.find('td').eq(i);
        }
        let aggregateValue = 0;
        // Calculate aggregate value for the column range
        for (let i = startIndex; i <= endIndex; i++) {
            const td = row.find('td').eq(i);
            if (td.length) {
                const pTag = td.find('p');
                const value = parseFloat(pTag.data('value')) || 0;
                aggregateValue += value;
            }
        }
        rows.push({ aggregateValue, row });
    });
    rows.sort((a, b) => {
        return sortOrder === 'desc'
            ? b.aggregateValue - a.aggregateValue // Descending order
            : a.aggregateValue - b.aggregateValue; // Ascending order
    });
    tbody.empty();
    rows.forEach(({ row }) => tbody.append(row));
}
function calculateColumnRange(clickedTh) {
    const parentRow = clickedTh.closest('tr'); // Get the parent <tr> of the clicked <th>
    const allThs = parentRow.find('th'); // Get all <th> elements in the row
    const clickedIndex = clickedTh.index(); // Get the index of the clicked <th>
    let startIndex = 0;
    // Calculate the starting index by summing up the colspan of preceding <th> elements
    allThs.each(function (index) {
        if (index < clickedIndex) {
            startIndex += parseInt($(this).attr('colspan')) || 1;
        }
    });
    // Calculate the ending index
    const colspan = parseInt(clickedTh.attr('colspan')) || 1;
    const endIndex = startIndex + colspan - 1;
    return { startIndex, endIndex };
}
function calculateColspan(structure) {
    if (!structure || Object.keys(structure).length === 0) return 1;
    let colspan = 0;
    Object.values(structure).forEach(child => {
        colspan += calculateColspan(child._children);
    });
    return colspan;
}
function createPivotBody(data, columns, rows, values) {
    let bodyHtml = '';
    // Generate unique combinations for rows and columns
    const uniqueRowCombinations = rows.length
        ? Array.from(new Set(data.map(row => rows.map(r => row[r.target] || '').join('|'))))
        : [''];
    const uniqueColumnCombinations = Array.from(new Set(data.map(row => columns.map(c => row[c.target] || '').join('|'))));
    // Group data by rows and columns
    const groupedData = {};
    uniqueRowCombinations.forEach(rowKey => {
        groupedData[rowKey] = {};
        uniqueColumnCombinations.forEach(colKey => {
            groupedData[rowKey][colKey] = {}; // Initialize empty value for all combinations
        });
    });
    // Fill groupedData with actual values from `data`
    data.forEach(row => {
        const rowKey = rows.map(r => row[r.target] || '').join('|');
        const colKey = columns.map(c => row[c.target] || '').join('|');
        if (groupedData[rowKey] && groupedData[rowKey][colKey]) {
            groupedData[rowKey][colKey] = row;
        }
    });
    // Calculate sums for each row
    const rowSums = {};
    uniqueRowCombinations.forEach(rowKey => {
        rowSums[rowKey] = values.map(valueField => {
            return data
                .filter(row => rows.map(r => row[r.target] || '').join('|') === rowKey)
                .reduce((sum, row) => sum + (row[valueField.target] || 0), 0);
        });
    });
    // Calculate total sums for all data
    const totalSums = values.map(valueField => {
        return data.reduce((sum, row) => sum + (row[valueField.target] || 0), 0);
    });
    // Calculate the maximum value for each value field
    const maxValues = values.map(valueField => {
        return Math.max(...data.map(row => row[valueField.target] || 0));
    });
    // Generate the HTML
    Object.keys(groupedData).forEach(rowKey => {
        bodyHtml += '<tr>';
        // Add row headers
        if (rows.length) {
            rowKey.split('|').forEach((rowValue, rowIndex) => {
                if (rowIndex === 0) {
                    // Show the row label (e.g., Brand) with the sum and percentage for each value field
                    const rowSumsHtml = values
                        .map((valueField, valueIndex) => {
                            const rowTotal = rowSums[rowKey][valueIndex] || 0;
                            const totalSum = totalSums[valueIndex];
                            const percentage = totalSum > 0
                                ? ((rowTotal / totalSum) * 100).toFixed(0)
                                : 0;
                            return `
                                <p class="m-0 lblTotalRow p-0 pb-1">
                                    ${threeDigit(rowTotal)} (${percentage}%)
                                </p>`;
                        })
                        .join('');
                    bodyHtml += `
                        <td class="bg-light border pvRow">
                            ${rowValue || 'نامعلوم'}
                            ${rowSumsHtml}
                        </td>`;
                } else {
                    // Only show the label for subsequent levels (e.g., Month)
                    bodyHtml += `
                        <td class="bg-light border pvRow">
                            ${rowValue || 'نامعلوم'}
                        </td>`;
                }
            });
        }
        // Display values for each column combination
        uniqueColumnCombinations.forEach(colKey => {
            const rowData = groupedData[rowKey][colKey];
            bodyHtml += `<td class="border cellHover pvCell">`;
            values.forEach((valueField, valueIndex) => {
                const cellValue = rowData[valueField.target] || 0;
                const maxValue = maxValues[valueIndex];
                const percentage = maxValue > 0
                    ? (cellValue / maxValue) * 100
                    : 0;
                var margin = "singleValue"
                if (valueIndex > 0) {
                    margin = "multiValue"
                }
                // Determine the background color based on the percentage of the maximum value
                const bgColor = `rgba(0, 0, 255, ${percentage / 100})`;
                // Determine text color based on the percentage threshold
                const textColor = percentage >= 40 ? 'white' : 'black';
                bodyHtml += `
                    <p class="${margin}" style="background-color: ${bgColor}; color: ${textColor}; padding: 5px; border-radius: 3px;" data-value="${cellValue || 0}">
                        ${threeDigit(cellValue) || "—"}
                    </p>`;
            });
            bodyHtml += `</td>`;
        });
        bodyHtml += '</tr>';
    });
    return bodyHtml;
}
function getAllCombinations(fields, data) {
    if (fields.length === 0) return [[]];
    const [firstField, ...restFields] = fields;
    const uniqueValues = Array.from(new Set(data.map(row => row[firstField.target] || '')));
    const combinations = [];
    const restCombinations = getAllCombinations(restFields, data);
    uniqueValues.forEach(value => {
        restCombinations.forEach(combination => {
            combinations.push([value, ...combination]);
        });
    });
    return combinations;
}
function handlePivotTblUi() {
    document.querySelectorAll('#pivotBodyTbl td').forEach(cell => {
        cell.addEventListener('mouseenter', (e) => {
            // هایلایت کردن ستون
            const colIndex = Array.from(cell.parentNode.children).indexOf(cell);
            document.querySelectorAll(`#pivotBodyTbl tr td:nth-child(${colIndex + 1})`).forEach(td => {
                td.classList.add('tableCrossHover');
                td.classList.add('text-primary');
            });
            // هایلایت کردن ردیف
            cell.parentNode.querySelectorAll('td').forEach(td => {
                td.classList.add('tableCrossHover');
                td.classList.add('text-primary');
            });
        });
        cell.addEventListener('mouseleave', (e) => {
            // حذف هایلایت از ستون
            const colIndex = Array.from(cell.parentNode.children).indexOf(cell);
            document.querySelectorAll(`#pivotBodyTbl tr td:nth-child(${colIndex + 1})`).forEach(td => {
                td.classList.remove('tableCrossHover');
                td.classList.remove('text-primary');
            });
            // حذف هایلایت از ردیف
            cell.parentNode.querySelectorAll('td').forEach(td => {
                td.classList.remove('tableCrossHover');
                td.classList.remove('text-primary');
            });
        });
    });
}
function loadDropdownData() {
    updateUrlParameter('sheet', '1-7');
    $("#tab1").find(".active").removeClass("active");
    $("#tab1").find('[data-target="#sheet-1-7"]').addClass("active");
    $("#tab1").find('[id^="sheet-"]').hide();
    $("#tab1").find("#sheet-1-7").show();
    $.ajax({
        type: "POST",
        url: "../controller/services.asmx/GetDropdownData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{}",
        success: function (response) {
            try {
                var result = response.d ? JSON.parse(response.d) : response;
                var companies = result.Companies || [];
                var distributors = result.Distributors || [];
                var goods = result.Goods || [];
                var branches = result.Branches || "0";
                fillDropdown("#companyId", companies, "companyID", "companyName_FA");
                fillDropdown("#distId", distributors, "distributorId", "distributorName");
                fillDropdown("#goodsCodes", goods, "GoodsCode", "GoodsName");
                fillDropdown("#branchCodes", branches, "branchCode", "branchName");
            } catch (e) {
                console.error("JSON Parsing Error:", e);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error loading dropdown data:", error);
        }
    });
}
function fillDropdown(dropdownId, data, valueField, textField) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = "<option value=''>انتخاب کنید</option>";
    data.forEach(item => {
        let option = document.createElement("option");
        option.value = item[valueField];
        option.textContent = item[textField];
        dropdown.appendChild(option);
    });
}
function setStartAndEndDate() {
    updateUrlParameter('sheet', '1-7')
    $("#tab1").find(".active").removeClass("active");
    $("#tab1").find('[data-target="#sheet-1-7"]').addClass("active");
    $("#tab1").find('[id^="sheet-"]').hide();
    $("#tab1").find("#sheet-1-7").show();
    loadDropdownData()
}
function initDragAndDrop(containerId, action) {
    // Ensure `containerId` is properly formatted for jQuery (e.g., starts with `#` or `.`)
    if (!containerId.startsWith("#") && !containerId.startsWith(".")) {
        containerId = `#${containerId}`;
    }
    // Find all elements within the container
    var $container = $(containerId);
    var dropTargets = $container.find(".drag-box"); // Only drop targets within the container
    var draggables = $container.find(".drag-task"); // Only draggable elements within the container
    // Drag start
    draggables.each(function () {
        $(this).off("dragstart").on("dragstart", function (ev) {
            ev.originalEvent.dataTransfer.setData("srcId", $(this).attr("id")); // Scoped ID
        });
    });
    // Drag over
    dropTargets.each(function () {
        $(this).off("dragover").on("dragover", function (ev) {
            ev.preventDefault(); // Allow dropping
        });
    });
    // Drop logic
    dropTargets.each(function () {
        $(this).off("drop").on("drop", function (ev) {
            ev.preventDefault();
            let srcId = ev.originalEvent.dataTransfer.getData("srcId"); // Scoped ID
            let $draggedElement = $container.find("#" + srcId); // Find only within the container
            let isValueSection = $(this).attr("id") === "values-drop-area";
            let isColumnSection = $(this).attr("id") === "columns-drop-area";
            let isRowsSection = $(this).attr("id") === "rows-drop-area";
            // Restrict drop for value section
            if (isValueSection && !["saleAmount", "goodsPrice"].includes(srcId)) {
                alert("فقط مقادیر عددی (فروش تعدادی ریالی و ... ) را می توانید به این بخش اضافه کنید");
                return;
            }
            // Restrict drop for column/rows sections
            if ((isColumnSection || isRowsSection) && ["saleAmount", "goodsPrice"].includes(srcId)) {
                alert("مقادیر عددی (فروش تعدادی ریالی و ... ) را نمی توانید به این بخش اضافه کنید");
                return;
            }
            // Append item if allowed (Scoped to the current container)
            $(this).append($draggedElement);
            // Dynamically call the `action` function if provided
            if (action && typeof window[action] === "function") {
                window[action](srcId, $(this).attr("id")); // Pass `srcId` and `target.id` for custom logic
            }
        });
    });
}
function checkAccess(response) {
    response = JSON.parse(response.d)
    if (response.hasOwnProperty('msg') && response.msg == 'sessionExpir$%^&') {
        window.location.href = 'http://dev-srv/';
    }
}
function updateUrlParameter(param, value) {
    let currentUrl = new URL(window.location.href); // Get the current URL
    currentUrl.searchParams.set(param, value); // Add or update the 'report' parameter
    window.history.pushState({}, '', currentUrl); // Update the browser's URL without reloading
    if (param == "sheet") {
        displayGroupMessages(value, allData.notifs);
    }
}
function getUrlParam(paramName) {
    const url = new URL(window.location.href); // Get the current URL
    return url.searchParams.get(paramName); // Retrieve the parameter value
}
function displayGroupMessages(groupIdentifier, items) {
    items.sort((a, b) => {
        if (a.groupId === "0-0" && b.groupId !== "0-0") {
            return 1; // a should be placed after b
        } else if (b.groupId === "0-0" && a.groupId !== "0-0") {
            return -1; // a should be placed before b
        }
        return 0; // leave the order unchanged if both have the same groupId status
    });
    const groupItems = items.filter(function (item) {
        return (item.groupId == groupIdentifier || item.groupId == "0-0");
    });
    if (!groupItems.length) return;
    $("#captionContainer").unbind().off('click').on('click', function () {
        $("#messagePopup").dxPopup({
            title: "راهنمای این شیت",
            visible: true,
            showCloseButton: true,
            width: "50vw",
            rtlEnabled: true,
            height: "auto",
            dragEnabled: true,
            contentTemplate: function (contentElement) {
                // 1. Create dxScrollView inside the popup
                const $scrollView = $("<div>")
                    .appendTo(contentElement)
                    .dxScrollView({
                        height: "55vh", // You can adjust this as needed
                        direction: "vertical",
                        showScrollbar: "onHover"
                    });
                // 2. Get the content area of dxScrollView
                const $scrollContent = $scrollView.dxScrollView("instance").content();
                const list = $("<ul>").css({
                    margin: 0
                });
                groupItems.forEach(item => {
                    $("<li>")
                        .text(item.message)
                        .css({ marginBottom: "8px", listStyleType: "disc" })
                        .appendTo(list);
                });
                $scrollContent.append(list);
            },
            onShowing: function (e) {
                popUpCss()
            },
        });
    })
    const displayElement = document.getElementById("caption");
    const displayElement2 = document.getElementById("captionIcon");
    if (!displayElement) {
        console.error("Display element with id 'caption' not found.");
        return;
    }
    if (displayElement._messageTickerInterval) {
        clearInterval(displayElement._messageTickerInterval);
    }
    if (displayElement._mouseEnterListener) {
        displayElement.removeEventListener("mouseenter", displayElement._mouseEnterListener);
    }
    if (displayElement._mouseLeaveListener) {
        displayElement.removeEventListener("mouseleave", displayElement._mouseLeaveListener);
    }
    let index = 0;
    let intervalId;
    function updateMessage() {
        $(displayElement2).fadeOut(500)
        $(displayElement).fadeOut(500, function () {
            $(this).text(groupItems[index].message).fadeIn(500);
            $(displayElement2).fadeIn(500)
            index = (index + 1) % groupItems.length;
        });
    }
    $(displayElement).text(groupItems[index].message);
    index = (index + 1) % groupItems.length;
    function startInterval() {
        intervalId = setInterval(updateMessage, 5000);
        displayElement._messageTickerInterval = intervalId;
    }
    startInterval();
    function onMouseEnter() {
        clearInterval(intervalId);
    }
    displayElement.addEventListener("mouseenter", onMouseEnter);
    displayElement._mouseEnterListener = onMouseEnter;
    function onMouseLeave() {
        startInterval();
    }
    displayElement.addEventListener("mouseleave", onMouseLeave);
    displayElement._mouseLeaveListener = onMouseLeave;
}
function groupByBrand(targetRows, productsData, brandData) {
    const grouped = {};
    const brandMap = Object.fromEntries(brandData.map(b => [b.bId, b.bName_FA]));
    const targetMap = {};
    targetRows.forEach(row => {
        targetMap[`${row.bId}_${row.pid}`] = row.qty;
    });
    productsData.forEach(p => {
        if (!grouped[p.bId]) {
            grouped[p.bId] = {
                brandId: p.bId,
                brandName: brandMap[p.bId] || `برند ${p.bId}`,
                targetSum: 0,
                products: []
            };
        }
        const qty = targetMap[`${p.bId}_${p.value}`] || 0;
        grouped[p.bId].products.push({
            productId: p.value,
            productName: p.name,
            target: qty
        });
        grouped[p.bId].targetSum += qty;
    });

    return Object.values(grouped);
}
function targetOperations() {
    var data = getcomboValues();
    data.targetYear = "1404"
    loader('show')
    $.ajax({
        url: '../controller/services.asmx/getTargetGridData',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            checkAccess(response)
            response = JSON.parse(response.d)
            loader('hide')
            var targetGridData = { ...response, curTargetYear: data.targetYear }
            generateKeys(targetGridData)
            initTargetGrids(targetGridData);
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function generateKeys(targetGridData) {
    targetGridData.targetBrandLevelData.forEach(o => {
        o.keyExpr = o.bId + "-" + o.cid
    })
    targetGridData.targetBrandDistLevelData.forEach(o => {
        o.keyExpr = o.bId + "-" + o.cid
    })
    targetGridData.targetBrandMonthLevelData.forEach(o => {
        o.keyExpr = o.bId + "-" + o.cid
    })
    targetGridData.targetBrandStateLevelData.forEach(o => {
        o.keyExpr = o.bId + "-" + o.cid
    })
}
function initTargetGrids(targetGridData) {
    var data = getcomboValues()
    data.curTargetYear = targetGridData.curTargetYear
    if (!targetInitialData) {
        $.ajax({
            url: '../controller/services.asmx/getTargetGridInitialData',
            type: 'POST',
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ data: data }),
            success: function (response) {
                checkAccess(response)
                targetGridData.targetSaleStock = JSON.parse(response.d).getTargetGridInitialData
                targetInitialData = true
            },
            error: function (xhr, status, error) {
                console.error("Error: " + error);
            }
        });
    }
    initBrandProductTargetGrid(targetGridData)
    initMonthProductTargetGrid(targetGridData)
    initDistProductTargetGrid(targetGridData)
    initStateProductTargetGrid(targetGridData)
}
var targetInitialData = false
function toBillion(value) {
    if (typeof value !== 'number') return NaN;
    return +(value / 1_000_000_000).toFixed(2);
}
function initBrandProductTargetGrid(targetGridData) {
    var brandGridData = targetGridData.targetBrandLevelData
    $("#targetBrandProduct").dxDataGrid({
        dataSource: brandGridData,
        rtlEnabled: true,
        keyExpr: "keyExpr",
        editing: {
            refreshMode: "repaint",
            repaintChangesOnly: true
        },
        export: {
            enabled: false,
            fileName: "تارگت تعدادی به تفکیک برند",
            excelFilterEnabled: true
        },
        columns: [
            {
                dataField: "bId",
                caption: "برند",
                width: "300px",
                allowExporting: false,
                cellTemplate: function (container, options) {
                    var brandName = allData.brands.find(o => { return o.bId == options.data.bId })?.bName_FA || "نامشخص"
                    var companyName = allData.companies.find(o => { return o.cId == options.data.cid })?.cName_FA || "نامشخص"
                    var html = `<div style="align-items:center;display:flex;justify-content: space-between;"><div>${brandName}</div>&nbsp;<div style="color: #9b9b9b;font-size: 10px;">(${companyName})</div></div>`
                    container.append(html);
                }
            },
            {
                dataField: "tQty",
                caption: "📦 مجموع تارگت تعدادی محصولات",
                cellTemplate: function (container, options) {
                    var html = `<div>\u200E${threeDigit(parseInt(options.data.tQty || 0))}</div>`
                    container.append(html);
                }
            },
            {
                dataField: "tAmount",
                caption: "💵 مجموع تارگت ریالی محصولات(P2)",
                cellTemplate: function (container, options) {
                    var html = `<div>\u200E${threeDigit(parseInt((options.data.tAmount) || 0))}</div>`
                    container.append(html);
                }
            },
            {
                caption: "برند/شرکت",
                dataField: "brandExport",
                allowExporting: true,
                width: "0px",
                calculateCellValue: function (rowData) {
                    const company = allData.companies.find(c => c.cId == rowData.cid)?.cName_FA || "نامشخص";
                    return company;
                }
            },
            {
                caption: "نام برند ",
                dataField: "brandNameExport",
                cssClass: "export-only-col",
                allowExporting: true,
                width: "0px",
                calculateCellValue: function (rowData) {
                    const brand = allData.brands.find(b => b.bId == rowData.bId);
                    return brand ? brand.bName_FA : "نامشخص";
                }
            },
        ],
        onRowPrepared: function (e) {
            masterChildStyling(e, 'brand')
        },
        showBorders: true,
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: false, allowSearch: false },
        scrolling: { mode: "virtual" },
        summary: {
            totalItems: [
                {
                    column: `bId`,
                    displayFormat: "جمع",
                },
                {
                    column: `tQty`,
                    summaryType: "sum",
                    valueFormat: "#,##0.##", // optional: format for numbers
                    displayFormat: "{0}",
                    valueFormat: {
                        type: "fixedPoint",
                        precision: 0
                    }
                }
                ,
                {
                    column: `tAmount`,
                    summaryType: "sum",
                    valueFormat: "#,##0.##", // optional: format for numbers
                    displayFormat: "{0}",
                    valueFormat: {
                        type: "fixedPoint",
                        precision: 0
                    }
                }
            ],
        },
        masterDetail: {
            enabled: true,
            template: function (container, options) {
                const products = options.data;
                const currentFilters = getcomboValues()
                currentFilters.targetYear = targetGridData.curTargetYear;
                currentFilters.brandId = products.bId;
                currentFilters.companyId = products.cid;
                let productData = [];
                $.ajax({
                    url: "controller/services.asmx/targetBrandProductLevelData",
                    method: "POST",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ data: currentFilters }),
                    success: function (response) {
                        productData = JSON.parse(response.d).targetBrandProductLevelData;


                    },
                    error: function () {
                        DevExpress.ui.notify("خطا در بارگذاری اطلاعات سطح محصول", "error", 3000);
                    }
                });
                $(`<div id="prBr-${products.bId}-${products.cid}">`).appendTo(container).dxDataGrid({
                    dataSource: productData,
                    rtlEnabled: true,
                    columns: [
                        {
                            dataField: "pid",
                            caption: "نام محصول",
                            allowEditing: false,
                            width: "325px",
                            lookup: {
                                dataSource: allData.products,
                                valueExpr: "value",
                                displayExpr: "name"
                            },
                            cellTemplate: function (container, options) {
                                const productName = options.text; // This gets the display name
                                container.append(
                                    $("<div>").text(productName).css({
                                        "font-size": "12px", // or whatever you want
                                        "font-weight": "bold" // optional
                                    })
                                );
                            }
                        },
                        {
                            dataField: "tQty",
                            caption: "تارگت تعدادی",
                            allowEditing: products.canEdit,
                            dataType: "number",
                            cellTemplate: function (container, options) {
                                var html = `<div id="brPr-tQty-${options.data.pid}">\u200E${threeDigit(options.data.tQty)}</div>`
                                container.append(html);
                            }
                        },
                        {
                            dataField: "tAmount",
                            caption: "تارگت ریالی",
                            allowEditing: false,
                            cellTemplate: function (container, options) {
                                var html = `<div id="brPr-tAmount-${options.data.pid}">\u200E${threeDigit(options.data.tQty * options.data.p2)}</div>`
                                container.append(html);
                            }
                        },
                        {
                            dataField: "slQtyDist",
                            caption: "فروش تعدادی پخش سال " + (parseInt(targetGridData.curTargetYear) - 1).toString(),
                            allowEditing: false,
                            width: "auto",
                            cellTemplate: function (container, options) {
                                var saleStock = targetGridData.targetSaleStock || [];

                                // پیدا کردن مقدار فروش
                                var saleQty = saleStock.find(p => p.pid == options.data.pid)?.qtySale;
                                //var saleQty = targetGridData.targetSaleStock.find(p => {
                                //    return p.pid == options.data.pid
                                //})?.qtySale
                                var html = `<div>\u200E${threeDigit(parseInt(saleQty || 0))}</div>`
                                container.append(html);
                            }
                        },
                        {
                            dataField: "slQtyFinance",
                            caption: "فروش تعدادی مالی سال " + (parseInt(targetGridData.curTargetYear) - 1).toString(),
                            allowEditing: false,
                            width: "auto",
                            cellTemplate: function (container, options) {
                                var saleStock = targetGridData.targetSaleStock || [];

                                // پیدا کردن مقدار فروش
                                var SaleFinanceqty = saleStock.find(p => p.pid == options.data.pid)?.qtySaleFinance;
                                //var qtySaleFinance = targetGridData.targetSaleStock.find(p => {
                                //    return p.pid == options.data.pid
                                //})?.qtySaleFinance
                                var html = `<div>\u200E${threeDigit(parseInt(SaleFinanceqty || 0))}</div>`
                                container.append(html);
                            }
                        },
                        {
                            dataField: "stQtyDist",
                            caption: "موجودی پخش",
                            allowEditing: false,
                            width: "auto",
                            cellTemplate: function (container, options) {
                                var saleStock = targetGridData.targetSaleStock || [];

                                // پیدا کردن مقدار فروش
                                var stockQty = saleStock.find(p => p.pid == options.data.pid)?.qtyStock;
                                //var stockQty = targetGridData.targetSaleStock.find(p => {
                                //    return p.pid == options.data.pid
                                //})?.qtyStock
                                var html = `<div>\u200E${threeDigit(parseInt(stockQty || 0))}</div>`
                                container.append(html);
                            }
                        },
                        {
                            dataField: "stQtyFinance",
                            caption: "موجودی مالی",
                            allowEditing: false,
                            width: "auto",
                            cellTemplate: function (container, options) {
                                var saleStock = targetGridData.targetSaleStock || [];

                                // پیدا کردن مقدار فروش
                                var stockQtyFinance = saleStock.find(p => p.pid == options.data.pid)?.qtyStockFinance;
                                //var stockQtyFinance = targetGridData.targetSaleStock.find(p => {
                                //    return p.pid == options.data.pid
                                //})?.qtyStockFinance
                                var html = `<div>\u200E${threeDigit(parseInt(stockQtyFinance || 0))}</div>`
                                container.append(html);
                            }
                        },
                        {
                            dataField: "",
                            caption: "موجودی تعدادی درحال تولید",
                            width: "auto",
                            allowEditing: false,
                        },
                        {
                            dataField: "",
                            caption: "موجودی تعدادی گمرک",
                            width: "auto",
                            allowEditing: false,
                        },
                        {
                            dataField: "",
                            caption: "ثبت سفارش ",
                            width: "auto",
                            allowEditing: false,
                        },
                        {
                            dataField: "",
                            caption: "سایر",
                            width: "auto",
                            allowEditing: false,
                        }
                    ],
                    onEditorPrepared(e) {
                        if (e.parentType !== "dataRow") return;
                        const rowIndex = e.row.rowIndex;
                        const rowData = e.row.data;
                        const p2 = parseFloat(rowData.p2) || 0;
                        const $input = e.editorElement.find("input");
                        if (e.dataField === "tQty") {
                            $input.off("keyup.liveCalcQty").on("keyup.liveCalcQty", function () {
                                const tQty = parseFloat(this.value) || 0;
                                const tAmount = tQty * p2;
                                $(`#brPr-tAmount-${rowData.pid}`).text(threeDigit(tAmount));
                            });
                        }
                        if (e.dataField === "tAmount") {
                            $input.off("input.liveCalcAmount").on("input.liveCalcAmount", function () {
                                $input.off("keyup.liveCalcQty").on("keyup.liveCalcQty", function () {
                                    const tAmount = parseFloat(this.value) || 0;
                                    const tQty = tAmount / p2;
                                    $(`#brPr-tQty-${rowData.pid}`).text(threeDigit(tQty));
                                });
                            });
                        }
                    },
                    onRowUpdating(e) {
                        if (e?.newData?.tQty) {
                            if (e?.newData?.tQty < 0) {
                                toast("مقدار نمی تواند منفی باشد", "error")
                                e.cancel = true
                            }
                        }
                    },
                    onRowUpdated: function (e) {
                        const year = currentFilters.targetYear;
                        const totalTarget = e.data.tQty;
                        var data = {
                            targetYear: year,
                            totalTargetValue: totalTarget,
                            pid: e.data.pid
                        };
                        loader('show');
                        $.ajax({
                            url: '../controller/services.asmx/usp_InsertOrUpdate_TargetHeader',
                            type: 'POST',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            data: JSON.stringify({ data: data }),
                            success: function (response) {
                                loader('hide');
                                checkAccess(response);
                                response = JSON.parse(response.d);
                                if (response?.usp_InsertOrUpdate_TargetHeader?.[0]?.success === 1) {
                                    toast(". تارگت ریالی با موفقیت ذخیره شد ");
                                    targetOperations()
                                }
                                else {
                                    toast(" خطا در ذخیره اطلاعات", "error");
                                }
                            },
                            error: function (xhr) {
                                console.error(xhr.responseText);
                                alert('خطا در ذخیره اطلاعات');
                            },
                            async: false
                        });
                    },
                    editing: {
                        mode: "cell",
                        allowUpdating: products.canEdit,
                        refreshMode: "repaint",
                        repaintChangesOnly: true,
                        useIcons: true,
                    },
                    onRowPrepared: function (e) {
                        masterChildStyling(e, 'product')
                    },
                    showBorders: true,
                    paging: { enabled: false },
                    showColumnLines: true,
                    showRowLines: true,
                    rowAlternationEnabled: false
                }).parent().addClass("p-0 pe-1").addClass("bg-success");;
            }
        }
    });
    $("#targetBrandProduct-excelBtn").unbind().off('click').on('click', function () {
        const grid = $("#targetBrandProduct").dxDataGrid("instance");
        grid.exportToExcel(false);
    })
}
function initMonthProductTargetGrid(targetGridData) {

    //try {
    //    $("#targetMonthProduct").dxDataGrid('beginUpdate');
    //    $("#targetMonthProduct").dxDataGrid('option', 'dataSource', targetGridData.targetBrandMonthLevelData)
    //    $("#targetMonthProduct").dxDataGrid('endUpdate');
    //    return
    //}
    //catch {
    //}
    const columns = [
        {
            dataField: "bId",
            caption: "برند",
            width: "300px",
            allowEditing: false,
            cellTemplate: function (container, options) {

                var html = ""
                var brandName = allData.brands.find(o => { return o.bId == options.data.bId }).bName_FA
                html += `<div class="d-flex justify-content-between">
                            <div>${brandName}</div>
                            <div>
                                <div title="تارگت تعدادی">📦</div>
                                <div title="تارگت ریالی بر حسب میلیارد ریال">💵</div>
                            </div>
                        </div>`
                container.append(html);
            }
            //lookup: {
            //    dataSource: allData.brands,
            //    valueExpr: "bId",
            //    displayExpr: "bName_FA"
            //}
        }
    ];
    var columnsMater = []
    allData.months.forEach(function (item) {
        columnsMater.push({
            dataField: "month-" + parseInt(item.value),
            caption: item.name,
            dataType: "number",
            cellTemplate: function (container, options) {
                const value = parseInt(options.data["month-" + parseInt(item.value)]);
                if (value > 0) {
                    const sum = targetGridData.targetBrandMonthLevelDataAmount.find((o) => {
                        return o.bId == options.data.bId
                    });

                    var html = `<div style="font-size: 12px;" title="تارگت تعدادی">\u200E${threeDigit(value)}</div>`;
                    html += `<div title="تارگت ریالی بر حسب میلیارد ریال" style="font-size: 12px;font-weight:bold;">\u200E${toBillion(sum["month-" + parseInt(item.value)])}</div>`;
                } else {

                    var html = `<div>&nbsp;</div>`;
                    html += `<div>&nbsp;</div>`;
                }
                container.append(html);
            }
        });
        columnsMater.push({
            dataField: "monthDp-" + parseInt(item.value),
            caption: item.name + "%",
            dataType: "number",
            visible: false,
            editCellTemplate: function (cellElement, cellInfo) {
                const currentField = cellInfo.column.dataField;
                const currentDid = parseInt(currentField.split("-")[1]); // استخراج did از dataField
                // ایجاد input
                const $input = $(`<input type="number" class="form-control"
                               step="0.1" 
                               min="0" 
                               max="100" 
                               class="dx-texteditor-input"
                               target-monthDp-input="${currentDid}" 
                               style="width: 100%; text-align: center;background-color: #f5f5f5;border: 2px solid orange;">`);
                $input.data("cellInfo", cellInfo);
                const $liveOutput = $(`<div class="live-calc" target-monthTotal="${currentDid}">`)
                    .html('')
                    .css({
                        "font-size": "12px",
                        "text-align": "center"
                    });
                cellElement.append($input).append($liveOutput);
                cellElement.parent().parent().addClass("border rounded m-1 pe-2 pb-1")
            }
        });
    });
    var editColumns = [{
        type: "buttons",
        width: 100,
        buttons: [
            {
                template: function (cellElement, options) {
                    if (!(options.data.canEdit)) return "";
                    const btn = $("<button>")
                        .html(`ویرایش گروهی`)
                        .addClass("btn btn-sm monthHeaderBg text-white")
                        .css({
                            "font-size": "10px",
                            "padding": "0px 3px",
                            "border-radius": "4px"
                        })
                        .on("click", function () {
                            options.component.editRow(options.row.rowIndex);
                        });
                    cellElement.append(btn);
                }
            }
        ]
    }]
    $("#targetMonthProduct").dxDataGrid({
        dataSource: targetGridData.targetBrandMonthLevelData,
        rtlEnabled: true,
        keyExpr: "keyExpr",
        columns: columns.concat(columnsMater, editColumns),
        showBorders: true,
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: false, allowSearch: false },
        scrolling: { mode: "virtual" },
        editing: {
            mode: "popup",
            allowUpdating: true,
            useIcons: false,
            popup: {
                title: "", // will be set dynamically via onEditingStart
                showTitle: true,
                height: "auto"
            },
            form: {
                colCount: 3,
                items: [
                    {
                        itemType: "group",
                        colSpan: 3,
                        template: function () {
                            return $("<div>")
                                .html(`<div id="monthTotalContainer" class="globalItem popupTotalTarget"></div>
                                        <div style="margin-bottom:5px;">
                                            در این پنجره می‌توانید برای تمام محصولات این برند، به‌صورت گروهی مقادیر ماهانه تعیین کنید.
                                        </div>
                                    `)
                        }
                    },
                    ...allData.months.map(m => ({
                        dataField: "monthDp-" + parseInt(m.value),
                        label: {
                            location: "top",
                            alignment: "center",
                            showColon: false
                        },
                        colSpan: 1
                    })),
                    {
                        itemType: "group",
                        colSpan: 3,
                        template: function () {
                            return $("<div class='py-3'>")
                                .html(`
                                    <div style="color:#d32f2f; font-weight:bold;">⚠️
                                        توجه داشته باشید که در صورت وجود مقادیر قبلی، تمام داده‌های قبلی با مقادیر جدید جایگزین خواهند شد.
                                    </div>
                                `)
                                .css({
                                    "text-align": "right",
                                    "margin-bottom": "10px",
                                    "line-height": "1.6"
                                });
                        }
                    }
                ]
            }
        },
        onEditingStart: function (e) {
            const grid = e.component;
            const popup = grid.option("editing.popup");
            const brandName = allData.brands.find(b => { return b.bId == e.data.bId })?.bName_FA || "نامشخص";
            const companyName = allData.companies.find(c => { return c.cId == e.data.cid })?.cName_FA || "نامشخص";
            popup.title = `ویرایش گروهی تارگت تمام محصولات برند: ${brandName} - شرکت: ${companyName} در سال ${targetGridData.curTargetYear}`;
            popup.onShowing = function () {
                popUpCss('month')
            }
            popup.onShown = function () {
                var monthTotal = $("#targetBrandProduct").dxDataGrid('option', 'dataSource').find(o => { return o.bId == e.data.bId && o.cid == e.data.cid })
                var monthQty = monthTotal?.tQty || 0
                var monthAmount = monthTotal?.tAmount || 0
                var html = ""
                html += `<div>مجموع تارگت تعدادی ثبت شده: ${threeDigit(monthQty)} عدد</div>`
                html += `<div>مجموع تارگت ریالی ثبت شده: ${threeDigit(monthAmount)} ریال</div>`
                $("#monthTotalContainer").html(html)
                const $popupContent = $(".dx-popup-content");
                const $inputs = $popupContent.find("input[target-monthDp-input]");
                updatePlaceholders($inputs);
                // Bind input events
                $inputs.each(function () {
                    const $input = $(this);
                    const cellInfo = $input.data("cellInfo");
                    $input.off("input").on("input", () => {
                        var targetData = $("#targetBrandProduct").dxDataGrid('option', 'dataSource').find(o => { return o.bId == e.data.bId && o.cid == e.data.cid })
                        var targetQty = targetData?.tQty || 0
                        var targetAmount = targetData?.tAmount || 0
                        var html = ""
                        html += `<div>${threeDigit(targetQty * $input.val() / 100)} عدد</div>`
                        html += `<div>${threeDigit(targetAmount * $input.val() / 100)} ریال</div>`
                        $input.parent().find("div[target-monthTotal]").html(html)
                        updatePlaceholders($inputs); // live placeholders
                    });
                    $input.off("change").on("change", () => {
                        const val = parseFloat($input.val());
                        cellInfo?.setValue(!isNaN(val) ? val : null); // ✅ Let grid track change
                    });
                });
            };
            grid.option("editing.popup", popup);
        },
        onRowUpdating: function (e) {
            let sum = 0;
            allData.months.forEach(month => {
                const field = "monthDp-" + parseInt(month.value);
                if (e.newData.hasOwnProperty(field)) {
                    sum += parseFloat(e.newData[field] || 0);
                }
                else if (e.oldData.hasOwnProperty(field)) {
                    sum += parseFloat(e.oldData[field] || 0);
                }
            });
            const tol = 0.01;
            if (Math.abs(sum - 100) > tol) {
                e.cancel = true;
                showToast(`مجموع درصدهای ماه باید ۱۰۰٪ باشد (فعلاً: ${sum.toFixed(1)}٪)`, "error", 5000);
            }
        },
        onRowUpdated: function (e) {
            const result = [];
            var data = e.data
            // Iterate over the keys of the object
            for (const key in data) {
                // Check if the key starts with 'dist-' and value is not null
                if (key.startsWith('monthDp-') && data[key] !== null) {
                    result.push({
                        bId: data.bId,         // Add pid
                        cid: data.cid, // Add targetId
                        percentage: data[key],// Add the value of dist-* as percentage
                        MonthNumber: parseInt(key.split("-")[1])
                    });
                }
            }
            loader('show');
            $.ajax({
                url: '../controller/services.asmx/usp_Save_TargetMonthDistribution',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ data: result }),
                success: function (response) {
                    loader('hide');
                    checkAccess(response)
                    response = JSON.parse(response.d);
                    if (response == "1") {
                        showToast(`تارگت با موفقیت ذخیره شد`, "success", 5000);
                        targetOperations()
                    }
                    else {
                        showToast(`خطای ذخیره تارگت`, "error", 5000);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error: " + error);
                }
            });
        },
        onRowPrepared: function (e) {
            masterChildStyling(e, 'month')
        },

        summary: {
            totalItems: [
                {
                    column: "bId",
                    displayFormat: "مجموع تارگت تعدادی"
                },
                {
                    column: "bId",
                    displayFormat: "مجموع تارگت ریالی"
                },
                // برای هر ستون دو ردیف (تعداد و مبلغ)
                ...allData.months.flatMap(item => [
                    {
                        column: `month-${parseInt(item.value)}`,
                        summaryType: "sum",
                        customizeText: function (data) {
                            return `${threeDigit(data.value)}`;
                        }
                    },
                    {
                        column: `month-${parseInt(item.value)}`,
                        summaryType: "sum",
                        displayFormat: function () {
                            const sum = targetGridData.targetBrandMonthLevelDataAmount.reduce((acc, row) => {
                                const val = parseFloat(row[`month-${parseInt(item.value)}`]) || 0;
                                return acc + val;
                            }, 0);
                            return `${threeDigit(sum)}`;
                        }
                    }
                ])
            ]
        },
        masterDetail: {
            enabled: true,
            template: function (container, options) {
                const distProducts = options.data;
                // Get shared filter values (these may come from UI dropdowns, etc.)
                const currentFilters = getcomboValues()
                currentFilters.targetYear = targetGridData.curTargetYear,
                    currentFilters.brandId = distProducts.bId;
                currentFilters.companyId = distProducts.cid;
                let monthProductData = [];
                $.ajax({
                    url: "controller/services.asmx/targetBrandMonthProductLevelData",
                    method: "POST",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ data: currentFilters }),
                    success: function (response) {
                        monthProductData = JSON.parse(response.d).targetBrandMonthProductLevelData;
                    },
                    error: function () {
                        DevExpress.ui.notify("خطا در بارگذاری اطلاعات سطح محصول", "error", 3000);
                    }
                });
                var columnsChild = []
                allData.months.forEach(function (item) {
                    columnsChild.push({
                        dataField: "month-" + parseInt(item.value),
                        caption: item.name,
                        dataType: "number",
                        cellTemplate: function (container, options) {
                            const value = parseInt(options.data["month-" + parseInt(item.value)]);
                            if (value > 0) {
                                const html = `<div>\u200E${threeDigit(value)}%</div>`;
                                container.append(html);
                            }
                        },
                        editCellTemplate: function (cellElement, cellInfo) {
                            const currentField = cellInfo.column.dataField;
                            const currentDid = parseInt(currentField.split("-")[1]); // استخراج did از dataField
                            // ایجاد input
                            const $input = $(`<input type="number" class="form-control"
                               step="0.1" 
                               min="0" 
                               max="100" 
                               class="dx-texteditor-input"
                               target-month-input="${currentDid}" 
                               style="width: 100%; text-align: center;background-color: #f5f5f5;border: 2px solid orange;">`);
                            $input.data("cellInfo", cellInfo);
                            $input.val(cellInfo.value);
                            cellElement.append($input);
                        }
                    });
                });
                $(`<div>`).appendTo(container).dxDataGrid({
                    dataSource: monthProductData,
                    rtlEnabled: true,
                    columns: [
                        {
                            dataField: "pid",
                            caption: "نام محصول",
                            width: "325px",
                            allowEditing: false,
                            lookup: {
                                dataSource: allData.products,
                                valueExpr: "value",
                                displayExpr: "name"
                            },
                            cellTemplate: function (container, options) {
                                const productName = options.text; // This gets the display name
                                container.append(
                                    $("<div>").text(productName).css({
                                        "font-size": "12px", // or whatever you want
                                        "font-weight": "bold" // optional
                                    })
                                );
                            }
                        },
                    ].concat(columnsChild),
                    showBorders: true,
                    paging: { enabled: false },
                    showColumnLines: true,
                    showRowLines: true,
                    rowAlternationEnabled: false,
                    editing: {
                        mode: "row",
                        allowUpdating: distProducts.canEdit,
                        useIcons: true
                    },
                    onRowPrepared: function (e) {
                        masterChildStyling(e, 'product')
                    },
                    onEditingStart: function (e) {
                        setTimeout(function () {
                            const $editRow = $(e.element).find(".dx-edit-row");
                            const $inputs = $editRow.find("input[target-month-input]");
                            updatePlaceholders($inputs);
                            $inputs.each(function () {
                                const $input = $(this);
                                const cellInfo = $input.data("cellInfo");
                                $input.off("input").on("input", () => {
                                    updatePlaceholders($inputs); // Live recalc
                                });
                                $input.off("change").on("change", () => {
                                    const val = parseFloat($input.val());
                                    cellInfo?.setValue(!isNaN(val) ? val : null); // ✅ Let grid detect
                                });
                            });
                        }, 50)
                    },
                    onRowUpdating: function (e) {
                        let sum = 0;
                        allData.months.forEach(month => {
                            const field = "month-" + parseInt(month.value);
                            if (e.newData.hasOwnProperty(field)) {
                                sum += parseFloat(e.newData[field] || 0);
                            }
                            else if (e.oldData.hasOwnProperty(field)) {
                                sum += parseFloat(e.oldData[field] || 0);
                            }
                        });
                        const tol = 0.01;
                        if (Math.abs(sum - 100) > tol) {
                            e.cancel = true;
                            showToast(`مجموع درصدهای ماه برای این محصول باید ۱۰۰٪ باشد (فعلاً: ${sum.toFixed(1)}٪)`, "error", 5000);
                        }
                    },
                    onRowUpdated: function (e) {
                        const result = [];
                        var data = e.data
                        // Iterate over the keys of the object
                        for (const key in data) {
                            // Check if the key starts with 'dist-' and value is not null
                            if (key.startsWith('month-') && data[key] !== null) {
                                result.push({
                                    pid: data.pid,         // Add pid
                                    TargetID: data.TargetID, // Add targetId
                                    percentage: data[key],// Add the value of dist-* as percentage
                                    MonthNumber: parseInt(key.split("-")[1])
                                });
                            }
                        }
                        loader('show');
                        $.ajax({
                            url: '../controller/services.asmx/usp_Save_TargetMonthDistribution',
                            type: 'POST',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            data: JSON.stringify({ data: result }),
                            success: function (response) {
                                loader('hide');
                                checkAccess(response)
                                response = JSON.parse(response.d);
                                if (response == "1") {
                                    showToast(`تارگت با موفقیت ذخیره شد`, "success", 5000);
                                    targetOperations()
                                }
                                else {
                                    showToast(`خطای ذخیره تارگت`, "error", 5000);
                                }
                            },
                            error: function (xhr, status, error) {
                                console.error("Error: " + error);
                            }
                        });
                    },
                }).parent().addClass("p-0 pe-1").addClass("monthHeaderBg");;
            }
        }
    });
}
function initDistProductTargetGrid(targetGridData) {

    //try {
    //    $("#targetDistProduct").dxDataGrid('beginUpdate');
    //    $("#targetDistProduct").dxDataGrid('option', 'dataSource', targetGridData.targetBrandDistLevelData)
    //    $("#targetDistProduct").dxDataGrid('option', 'amountData', targetGridData.targetBrandDistLevelDataAmount)
    //    $("#targetDistProduct").dxDataGrid('endUpdate');
    //    return
    //}
    //catch {
    //}
    const columns = [
        {
            dataField: "bId",
            caption: "برند",
            width: "300px",
            cellTemplate: function (container, options) {

                var html = ""
                var brandName = allData.brands.find(o => { return o.bId == options.data.bId }).bName_FA
                html += `<div class="d-flex justify-content-between">
                            <div>${brandName}</div>
                            <div>
                                <div title="تارگت تعدادی">📦</div>
                                <div title="تارگت ریالی بر حسب میلیارد ریال">💵</div>
                            </div>
                        </div>`
                container.append(html);
            }
        }
    ];
    var columnsMaster = []
    var columnSrc = [{ id: 0, distName_FA: 'فروش مستقیم', colorCode: '#C0392B' }].concat(allData.distributors)
    columnSrc.push({ id: 15, distName_FA: 'نخبگان', colorCode: '#C0392B' })
    columnSrc.forEach(function (item) {
        const distId = item.id;
        columnsMaster.push({
            dataField: "dist-" + item.id,
            caption: item.distName_FA,
            dataType: "number",
            cellTemplate: function (container, options) {
                const value = parseInt(options.data["dist-" + item.id]);
                //if (value > 0) {
                //    const html = `<div>\u200E${threeDigit(value)}</div>`;
                //    container.append(html);
                //}
                if (value > 0) {
                    const sum = targetGridData.targetBrandDistLevelDataAmount.find((o) => {
                        return o.bId == options.data.bId
                    });

                    var html = `<div style="font-size: 12px;" title="تارگت تعدادی">\u200E${threeDigit(value)}</div>`;
                    html += `<div title="تارگت ریالی بر حسب میلیارد ریال" style="font-size: 12px;font-weight:bold;">\u200E${toBillion(sum["dist-" + parseInt(item.id)])}</div>`;
                } else {

                    var html = `<div>&nbsp;</div>`;
                    html += `<div>&nbsp;</div>`;
                }
                container.append(html);
            }
        })
        columnsMaster.push({
            dataField: "distDp-" + item.id,
            caption: item.distName_FA + "%",
            dataType: "number",
            visible: false,
            editCellTemplate: function (cellElement, cellInfo) {
                const currentDid = parseInt(cellInfo.column.dataField.split("-")[1]);
                const $input = $(`<input type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          class="dx-texteditor-input"
                          target-distDp-input="${currentDid}"
                          style="width: 100%; text-align: center; background-color: #f5f5f5; border: 2px solid orange;">`);
                $input.data("cellInfo", cellInfo);
                const $liveOutput = $(`<div class="live-calc" target-distTotal="${currentDid}">`)
                    .html('')
                    .css({
                        "font-size": "12px",
                        "text-align": "center"
                    });
                cellElement.append($input).append($liveOutput);
                cellElement.parent().parent().addClass("border rounded m-1 pe-2 pb-1")
            }
        });
    });
    var editColumns = [{
        type: "buttons",
        width: 100,
        buttons: [
            {
                template: function (cellElement, options) {
                    if (!(options.data.canEdit)) return "";
                    const btn = $("<button>")
                        .html(`ویرایش گروهی`)
                        .addClass("btn btn-sm btn-primary")
                        .css({
                            "font-size": "10px",
                            "padding": "0px 3px",
                            "border-radius": "4px"
                        })
                        .on("click", function () {
                            options.component.editRow(options.row.rowIndex);
                        });
                    cellElement.append(btn);
                }
            }
        ]
    }]
    $("#targetDistProduct").dxDataGrid({
        dataSource: targetGridData.targetBrandDistLevelData,
        rtlEnabled: true,
        keyExpr: "keyExpr",
        columns: columns.concat(columnsMaster, editColumns),
        showBorders: true,
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: false, allowSearch: true },
        scrolling: { mode: "virtual" },
        editing: {
            mode: "popup",
            allowUpdating: true,
            useIcons: false,
            popup: {
                title: "", // will be set dynamically via onEditingStart
                showTitle: true,
                height: "auto"
            },
            form: {
                colCount: 4,
                items: [
                    {
                        itemType: "group",
                        colSpan: 4,
                        template: function () {
                            return $("<div>")
                                .html(`
                                        <div id="distTotalContainer" class="globalItem popupTotalTarget"></div>
                                        <div style="margin-bottom:5px;">
                                            در این پنجره می‌توانید برای تمام محصولات این برند، به‌صورت گروهی مقادیر وزنی پخش را به صورت درصد تعیین کنید.
                                        </div>
                                    `)
                        }
                    },
                    ...columnSrc.map(m => ({
                        dataField: "distDp-" + parseInt(m.id),
                        label: {
                            location: "top",
                            alignment: "center",
                            showColon: false
                        },
                        colSpan: 1
                    })).concat([{ itemType: "empty", colSpan: 1 }]).concat([{ itemType: "empty", colSpan: 1 }]),
                    {
                        itemType: "group",
                        colSpan: 4,
                        template: function () {
                            return $("<div class='py-3'>")
                                .html(`
                        <div style="color:#d32f2f; font-weight:bold;">⚠️
                            توجه داشته باشید که در صورت وجود مقادیر قبلی، تمام داده‌های قبلی با مقادیر جدید جایگزین خواهند شد.
                        </div>
                    `)
                                .css({
                                    "text-align": "right",
                                    "margin-bottom": "10px",
                                    "line-height": "1.6"
                                });
                        }
                    }
                ]
            }
        },
        onRowUpdating: function (e) {
            let sum = 0;
            columnSrc.forEach(dist => {
                const field = "distDp-" + dist.id;
                if (e.newData.hasOwnProperty(field)) {
                    sum += parseFloat(e.newData[field] || 0);
                }
                else if (e.oldData.hasOwnProperty(field)) {
                    sum += parseFloat(e.oldData[field] || 0);
                }
            });
            const tol = 0.01;
            if (Math.abs(sum - 100) > tol) {
                e.cancel = true;
                showToast(`مجموع درصدهای پخش برای این محصول باید ۱۰۰٪ باشد (فعلاً: ${sum.toFixed(1)}٪)`, "error", 5000);
            }
        },
        onRowUpdated: function (e) {
            const result = [];
            var data = e.data
            for (const key in data) {
                if (key.startsWith('distDp-') && data[key] !== null) {
                    result.push({
                        bId: data.bId,
                        cid: data.cid,
                        percentage: data[key],
                        DistributorID: parseInt(key.split("-")[1])
                    });
                }
            }
            loader('show');
            $.ajax({
                url: '../controller/services.asmx/usp_Save_TargetDistributorDistribution',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ data: result }),
                success: function (response) {
                    loader('hide');
                    checkAccess(response)
                    response = JSON.parse(response.d);
                    if (response == "1") {
                        showToast(`تارگت با موفقیت ذخیره شد`, "success", 5000);
                        targetOperations()
                    }
                    else {
                        showToast(`خطای ذخیره تارگت`, "error", 5000);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error: " + error);
                }
            });
        },
        onEditingStart: function (e) {
            const grid = e.component;
            const popup = grid.option("editing.popup");
            const brandName = allData.brands.find(b => { return b.bId == e.data.bId })?.bName_FA || "نامشخص";
            const companyName = allData.companies.find(c => { return c.cId == e.data.cid })?.cName_FA || "نامشخص";
            popup.title = `ویرایش گروهی تارگت تمام محصولات برند: ${brandName} - شرکت: ${companyName} در سال ${targetGridData.curTargetYear}`;
            popup.onShowing = function () {
                popUpCss('dist')
            }
            popup.onShown = function () {
                var distTotal = $("#targetBrandProduct").dxDataGrid('option', 'dataSource').find(o => { return o.bId == e.data.bId && o.cid == e.data.cid })
                var distQty = distTotal?.tQty || 0
                var distAmount = distTotal?.tAmount || 0
                var html = ""
                html += `<div>مجموع تارگت تعدادی ثبت شده: ${threeDigit(distQty)} عدد</div>`
                html += `<div>مجموع تارگت ریالی ثبت شده: ${threeDigit(distAmount)} ریال</div>`
                $("#distTotalContainer").html(html)
                const $popupContent = $(".dx-popup-content");
                const $inputs = $popupContent.find("input[target-distDp-input]");
                updatePlaceholders($inputs);
                // Bind input events
                $inputs.each(function () {
                    const $input = $(this);
                    const cellInfo = $input.data("cellInfo");
                    $input.off("input").on("input", () => {
                        var targetData = $("#targetBrandProduct").dxDataGrid('option', 'dataSource').find(o => { return o.bId == e.data.bId && o.cid == e.data.cid })
                        var targetQty = targetData?.tQty || 0
                        var targetAmount = targetData?.tAmount || 0
                        var html = ""
                        html += `<div>${threeDigit(targetQty * $input.val() / 100)} عدد</div>`
                        html += `<div>${threeDigit(targetAmount * $input.val() / 100)} ریال</div>`
                        $input.parent().find("div[target-distTotal]").html(html)
                        updatePlaceholders($inputs); // live placeholders
                    });
                    $input.off("change").on("change", () => {
                        const val = parseFloat($input.val());
                        cellInfo?.setValue(!isNaN(val) ? val : null); // ✅ Let grid track change
                    });
                });
            };
            grid.option("editing.popup", popup);
        },
        onRowPrepared: function (e) {
            masterChildStyling(e, 'dist')
        },
        summary: {
            totalItems: [
                {
                    column: "bId",
                    displayFormat: "مجموع تارگت تعدادی"
                },
                {
                    column: "bId",
                    displayFormat: "مجموع تارگت ریالی"
                },
                // برای هر ستون دو ردیف (تعداد و مبلغ)
                ...columnSrc.flatMap(item => [
                    {
                        column: `dist-${item.id}`,
                        summaryType: "sum",
                        customizeText: function (data) {
                            return `${threeDigit(data.value)}`;
                        }
                    },
                    {
                        column: `dist-${item.id}`,
                        summaryType: "sum",
                        displayFormat: function () {
                            const sum = targetGridData.targetBrandDistLevelDataAmount.reduce((acc, row) => {
                                const val = parseFloat(row[`dist-${item.id}`]) || 0;
                                return acc + val;
                            }, 0);
                            return `${threeDigit(sum)}`;
                        }
                    }
                ])
            ]
        }
        ,
        masterDetail: {
            enabled: true,
            template: function (container, options) {
                const distProducts = options.data;
                // Get shared filter values (these may come from UI dropdowns, etc.)
                const currentFilters = getcomboValues()
                currentFilters.targetYear = targetGridData.curTargetYear,
                    currentFilters.brandId = distProducts.bId;
                currentFilters.companyId = distProducts.cid;
                let distProductData = [];
                $.ajax({
                    url: "controller/services.asmx/targetBrandDistProductLevelData",
                    method: "POST",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ data: currentFilters }),
                    success: function (response) {
                        distProductData = JSON.parse(response.d).targetBrandDistProductLevelData;
                    },
                    error: function () {
                        DevExpress.ui.notify("خطا در بارگذاری اطلاعات سطح محصول", "error", 3000);
                    }
                });
                var columnsChild = []
                columnSrc.forEach(function (item) {
                    columnsChild.push({
                        dataField: "dist-" + item.id,
                        caption: item.distName_FA,
                        dataType: "number",
                        cellTemplate: function (container, options) {
                            const value = parseInt(options.data["dist-" + item.id]);
                            if (value > 0) {
                                const html = `<div>\u200E${threeDigit(value)}%</div>`;
                                container.append(html);
                            }
                        },
                        editCellTemplate: function (cellElement, cellInfo) {
                            const currentField = cellInfo.column.dataField;
                            const currentDid = parseInt(currentField.split("-")[1]); // استخراج did از dataField
                            // ایجاد input
                            const $input = $(`<input type="number" class="form-control"
                               step="0.1" 
                               min="0" 
                               max="100" 
                               class="dx-texteditor-input"
                               target-dist-input="${currentDid}" 
                               style="width: 100%; text-align: center;background-color: #f5f5f5;border: 2px solid orange;">`);
                            $input.val(cellInfo.value);
                            $input.data("cellInfo", cellInfo);
                            cellElement.append($input);
                        }
                    });
                })
                $(`<div>`).appendTo(container).dxDataGrid({
                    dataSource: distProductData,
                    rtlEnabled: true,
                    columns: [
                        {
                            dataField: "pid",
                            caption: "نام محصول",
                            width: "325px",
                            allowEditing: false,
                            lookup: {
                                dataSource: allData.products,
                                valueExpr: "value",
                                displayExpr: "name"
                            },
                            cellTemplate: function (container, options) {
                                const productName = options.text; // This gets the display name
                                container.append(
                                    $("<div>").text(productName).css({
                                        "font-size": "12px", // or whatever you want
                                        "font-weight": "bold" // optional
                                    })
                                );
                            }
                        },
                    ].concat(columnsChild),
                    showBorders: true,
                    paging: { enabled: false },
                    showColumnLines: true,
                    showRowLines: true,
                    rowAlternationEnabled: false,
                    editing: {
                        mode: "row",
                        allowUpdating: distProducts.canEdit,
                        useIcons: true
                    },
                    onRowPrepared: function (e) {
                        masterChildStyling(e, 'product')
                    },
                    onEditingStart: function (e) {
                        setTimeout(function () {
                            const $editRow = $(e.element).find(".dx-edit-row");
                            const $inputs = $editRow.find("input[target-dist-input]");
                            updatePlaceholders($inputs);
                            $inputs.each(function () {
                                const $input = $(this);
                                const cellInfo = $input.data("cellInfo");
                                $input.off("input").on("input", () => {
                                    updatePlaceholders($inputs); // Live recalc
                                });
                                $input.off("change").on("change", () => {
                                    const val = parseFloat($input.val());
                                    cellInfo?.setValue(!isNaN(val) ? val : null); // ✅ Let grid detect
                                });
                            });
                        }, 50)
                    },
                    onRowUpdating: function (e) {
                        let sum = 0;
                        columnSrc.forEach(dist => {
                            const field = "dist-" + dist.id;
                            if (e.newData.hasOwnProperty(field)) {
                                sum += parseFloat(e.newData[field] || 0);
                            }
                            else if (e.oldData.hasOwnProperty(field)) {
                                sum += parseFloat(e.oldData[field] || 0);
                            }
                        });
                        const tol = 0.01;
                        if (Math.abs(sum - 100) > tol) {
                            e.cancel = true;
                            showToast(`مجموع درصدهای پخش برای این محصول باید ۱۰۰٪ باشد (فعلاً: ${sum.toFixed(1)}٪)`, "error", 5000);
                        }
                    },
                    onRowUpdated: function (e) {
                        const result = [];
                        var data = e.data
                        // Iterate over the keys of the object
                        for (const key in data) {
                            // Check if the key starts with 'dist-' and value is not null
                            if (key.startsWith('dist-') && data[key] !== null) {
                                result.push({
                                    pid: data.pid,         // Add pid
                                    TargetID: data.TargetID, // Add targetId
                                    percentage: data[key],// Add the value of dist-* as percentage
                                    DistributorID: parseInt(key.split("-")[1])
                                });
                            }
                        }
                        loader('show');
                        $.ajax({
                            url: '../controller/services.asmx/usp_Save_TargetDistributorDistribution',
                            type: 'POST',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            data: JSON.stringify({ data: result }),
                            success: function (response) {
                                loader('hide');
                                checkAccess(response)
                                response = JSON.parse(response.d);
                                if (response == "1") {
                                    showToast(`تارگت با موفقیت ذخیره شد`, "success", 5000);
                                    targetOperations()
                                }
                                else {
                                    showToast(`خطای ذخیره تارگت`, "error", 5000);
                                }
                            },
                            error: function (xhr, status, error) {
                                console.error("Error: " + error);
                            }
                        });
                    },
                }).parent().addClass("p-0 pe-1").addClass("bg-primary");
            }
        }
    });
}
function initProformaGrid(gridResult) {
    var currentCid = $("#comboCo").dxTagBox('option', 'value')[0]
    var proformaType = 1; // مقدار پیشفرض
    var formItemsWithProforma = createFormItems([
       "proformaType-7", "empty-35", "sId-7", "IncotermId-7",
       "PINumber-7", "proformaDate-7", "proformaValidDate-7", "OrderRegCode-7", "MainBank-7", "IBAN-7", "SWIFT-7", "FXAssignDate-7",
       "FXAssignCode-7", "FXTypeSrc-7", "FXTypeId-7", "FXRate-7", "IRRTotal-7", "Deadline-7", "InsurerName-7", "InsuranceNo-7",
       "InsuranceFXTypeId-7", "TransportFXTypeId-7", "customOrigin-7", "customDestination-7", "ProformaStatusId-7", "empty-7",
       "Note-42", "PINumberFiles-6", "insuranceFiles-6", "certificateFiles-6", "reportFiles-6", "extraFiles-6", "empty-12",
       "proformaCostRows-42", "orderPlacementCost-7", "labCost-7", "bankCost-7", "standardCustomsCost-7", "customsStorageCost-7",
       "ministryRoadsCost-7", "customsDutyCost-7", "helalAhmarCost-7", "TTACCost-7", 
        "internalShippingCost-7", "labelCost-7", "clearingAgentCost-7", "InsuranceCost-7", "TransportCost-7", "extraCost-7",
        "empty-21","NoteCost-42", "proformaProductRows-42", "HasChangedItems-42"
    ]);
    //formItemsWithProforma.push();
    var formItemsWithoutProforma = createFormItems([
        "proformaType-7", "empty-35", "sId-7", "empty-35", "proformaProductRows-42",
    ]);
    var formItemsInitial = createFormItems([
        "proformaType-7"
    ]);
    gridResult.proformaData.forEach(function (item) {
        item.HasChangedItems = false
    })
    // console.log(gridResult.proformaData)
    $("#shipment").dxDataGrid({
        dataSource: gridResult.proformaData,
        //keyExpr: "ProformaId",
        height: "85vh",
        width: "auto",
        rtlEnabled: true,
        rowHoverEnabled: false,
        allowColumnResizing: true,
        columnHidingEnabled: false,
        paging: { enabled: false },
        showBorders: false,
        selection: { mode: "single" },
        //columnHidingEnabled: true, //for adaptive row
        filterRow: {
            visible: true,       // shows text boxes under headers
            applyFilter: "auto"  // apply instantly as user types
        },
        headerFilter: {
            visible: true        // adds dropdown filter per column
        },
        filterPanel: {
            visible: true        // shows active filters above the grid
        },
        //filterBuilder: {
        //    visible: true        // enables advanced filter builder popup
        //},

        onRowPrepared: function (e) {
            masterChildStyling(e, 'shipment')
        },
        columns: [
            {
                dataField: "PINumberFiles",
                caption: "تصویر Proforma Invoice",
                visible: false,
                editCellTemplate: function (cellElement, cellInfo) {
                    renderFileUploaderWithPreview(cellElement, cellInfo, "PINumberFiles")
                },
            },
            {
                dataField: "insuranceFiles",
                caption: "تصویر بیمه‌نامه",
                visible: false,
                editCellTemplate: function (cellElement, cellInfo) {
                    renderFileUploaderWithPreview(cellElement, cellInfo, "insuranceFiles")
                },
            },
            {
                dataField: "extraFiles",
                caption: "سایر فایل‌ها",
                visible: false,
                editCellTemplate: function (cellElement, cellInfo) {
                    renderFileUploaderWithPreview(cellElement, cellInfo, "extraFiles")
                },
            },
            {
                dataField: "certificateFiles",
                caption: "تصویر مجوزها",
                visible: false,
                editCellTemplate: function (cellElement, cellInfo) {
                    renderFileUploaderWithPreview(cellElement, cellInfo, "certificateFiles")
                },
            },
            {
                dataField: "reportFiles",
                caption: "تصویر گزارش‌های ثبت سفارش",
                visible: false,
                editCellTemplate: function (cellElement, cellInfo) {
                    renderFileUploaderWithPreview(cellElement, cellInfo, "reportFiles")
                },
            },
            {
                dataField: "HasChangedItems",  // چون فیلد خاصی نیست، مقدار دلخواه بگذار یا حذف کن اگر لازم نیست
                visible: false,
                caption: " ",
                editCellTemplate: function (itemElement, cellInfo) {

                    var proformaId = cellInfo.data.ProformaId
                    var proformaItemDb = []
                    if (proformaId) {
                        var proformaItemData = getProformaItems(proformaId)
                        //   console.log(proformaItemData)
                        proformaItemDb = proformaItemData.proformaItemData
                        proformaItemDb.forEach(function (item) {
                            var itemParts = proformaItemData.proformaItemProductData.filter(o => { return o.proformaItemId == item.ProformaItemId })
                            itemParts.forEach(function (pp) {
                                item["prdValue_" + pp.productType + "_" + pp.productId + "_" + pp.batchNo] = pp.Qty
                                item["partProductId_" + pp.productType + "_" + pp.productId + "_" + pp.batchNo] = pp.partPrdId
                            })
                        })

                        cellInfo.data.proformaParts = proformaItemDb
                    }
                    cellInfo.component.cellValue(cellInfo.rowIndex, "HasChangedItems", true);
                    $("<div class='shipmentPopupParts partInfo p-0'>").html(
                        "<div class='bg-proformaPart p-2 rounded'><span style='font-size: 15px'>🧩 اطلاعات مربوط به پارت‌ها </span><span style='font-size: 13px;'> (در صورتی که باربری این پروفورما در چند مرحله انجام می‌شود، برای هر مرحله یک پارت مجزا ثبت کنید.)</span></div>"
                    ).appendTo(itemElement);
                    var $container = $("<div id='proformaItemGrid'>").appendTo(itemElement);
                    $container.dxDataGrid({
                        dataSource: proformaItemDb,  // مقدار صحیح داده‌ها را اینجا بگذار
                        keyExpr: "ProformaItemId",
                        rtlEnabled: true,
                        width: "100%",
                        noDataText: 'هنوز اطلاعات پارت (ها) برای این سفارش ثبت نشده است',
                        editing: {
                            popup: {
                                title: "🧩 افزودن/ویرایش پارت",
                                showTitle: true,
                                height: "80vh",
                                width: "89vw",
                                onShowing: function () {
                                    popUpCss("proformaPart")
                                }
                            },
                            mode: "popup",
                            allowAdding: true,
                            allowUpdating: true,
                            allowDeleting: false,
                            useIcons: true,
                            form: {
                                colCount: 30,
                                items: createFormItems([

                                    "InvoiceNo-6",
                                    "BLNo-6", "BLDate-6", "carrier-6",
                                    "FreightForwarderId-6", "CustomsDeclarationNo-6", "ShipmentDateOrigin-6", "ArrivalDateIranForcast-6", "ArrivalDateIranReal-6",
                                    "clearanceDate-6", "clearer-6", "itemStatusId-6", "empty-18", "InspectionFiles-5", "PackingListFiles-5", "BLFiles-5", "WarehouseReceiptFiles-5", "declarationFiles-5",
                                    "ClearanceReceiptFiles-5", "partEPL-5", "PartCIFiles-5", "COOFiles-5", "COIFies-5", "partExtraFiles-5", "empty-5", "partProductDesc-30"
                                ])
                            }

                        },
                        columns: [
                            {
                                width: "6%",
                                dataField: "InvoiceNo",
                                caption: "شماره صورت حساب (Invoice No)",
                                validationRules: [
                                    {
                                        type: "required",
                                        message: "الزامی است"
                                    }
                                ]
                            },
                            {
                                width: "6%", dataField: "partProductDesc", caption: "",visible:false
                            },

                            {
                                width: "6%", dataField: "BLNo", caption: "شماره بارنامه (B/L No)", validationRules: [
                                    {
                                        type: "required",
                                        message: "الزامی است"
                                    }
                                ]
                            },
                            {
                                width: "6%",
                                dataField: "BLDate",
                                caption: "تاریخ بارنامه (B/L Date)",
                                dataType: "date",
                                editorType: "dxDateBox",
                                editorOptions: {
                                    pickerType: "calendar",
                                    displayFormat: "yyyy/MM/dd",
                                    placeholder: "انتخاب کنید",
                                },
                                validationRules: [
                                    {
                                        type: "required",
                                        message: "الزامی است"
                                    }
                                ]
                            },
                            {
                                width: "6%",
                                dataField: "carrier",
                                caption: "نام شرکت باربری (Carrier Name)",
                                validationRules: [
                                    {
                                        type: "required",
                                        message: "الزامی است"
                                    }
                                ]
                            },
                            {
                                width: "6%",
                                dataField: "FreightForwarderId",
                                dataType: "number",
                                caption: "شناسه شرکت فورواردری (Freight Forwarder Code)"
                            },
                            {
                                width: "6%",
                                dataField: "CustomsDeclarationNo",
                                caption: "شماره اظهارنامه گمرکی (Customs Declaration No)"
                            },
                            {
                                width: "6%",
                                dataField: "ShipmentDateOrigin",
                                caption: "تاریخ حمل از گمرک مبدا",
                                dataType: "date",
                                editorType: "dxDateBox",
                                editorOptions: {
                                    pickerType: "calendar",
                                    displayFormat: "yyyy/MM/dd",
                                    placeholder: "انتخاب کنید",
                                },
                                validationRules: [
                                    {
                                        type: "required",
                                        message: "الزامی است"
                                    }
                                ]
                            },
                            {
                                width: "6%",
                                dataField: "ArrivalDateIranForcast",
                                caption: "تاریخ رسیدن به گمرک ایران - پیش ‌بینی",
                                dataType: "date",
                                editorType: "dxDateBox",
                                editorOptions: {
                                    pickerType: "calendar",
                                    displayFormat: "yyyy/MM/dd",
                                    placeholder: "انتخاب کنید",
                                },
                                validationRules: [
                                    {
                                        type: "required",
                                        message: "الزامی است"
                                    }
                                ]
                            },
                            {
                                width: "6%",
                                dataField: "ArrivalDateIranReal",
                                caption: "تاریخ رسیدن به گمرک ایران - واقعی",
                                dataType: "date",
                                editorType: "dxDateBox",
                                editorOptions: {
                                    pickerType: "calendar",
                                    displayFormat: "yyyy/MM/dd",
                                    placeholder: "انتخاب کنید",
                                }
                            },
                            {
                                width: "6%",
                                dataField: "clearanceDate",
                                caption: "تاریخ ترخیص از گمرک (Customs Clearance Date)",
                                dataType: "date",
                                editorType: "dxDateBox",
                                editorOptions: {
                                    pickerType: "calendar",
                                    displayFormat: "yyyy/MM/dd",
                                    placeholder: "انتخاب کنید",
                                }
                            },
                            {
                                width: "6%",
                                dataField: "clearer",
                                caption: "نام ترخیص ‌کننده"
                            },
                            {
                                dataField: "PackingListFiles",
                                caption: "تصویر Packing List",
                                visible: false,
                                editCellTemplate: function (cellElement, cellInfoP) {
                                    renderFileUploaderWithPreview(cellElement, cellInfoP, "PackingListFiles")
                                },
                            },
                            {
                                dataField: "InspectionFiles",
                                caption: "تصویر گواهی بازرسی",
                                visible: false,
                                editCellTemplate: function (cellElement, cellInfoP) {
                                    renderFileUploaderWithPreview(cellElement, cellInfoP, "InspectionFiles")
                                },
                            },
                            {
                                dataField: "BLFiles",
                                caption: "تصویر بارنامه (B/L)",
                                visible: false,
                                editCellTemplate: function (cellElement, cellInfoP) {
                                    renderFileUploaderWithPreview(cellElement, cellInfoP, "BLFiles")
                                },
                            },
                            {
                                dataField: "WarehouseReceiptFiles",
                                caption: "تصویر قبض انبار",
                                visible: false,
                                editCellTemplate: function (cellElement, cellInfoP) {
                                    renderFileUploaderWithPreview(cellElement, cellInfoP, "WarehouseReceiptFiles")
                                },
                            },
                            {
                                dataField: "declarationFiles",
                                caption: "تصویر اظهارنامه گمرکی",
                                visible: false,
                                editCellTemplate: function (cellElement, cellInfoP) {
                                    renderFileUploaderWithPreview(cellElement, cellInfoP, "declarationFiles")
                                },
                            },
                            {
                                dataField: "ClearanceReceiptFiles",
                                caption: "تصویر رسید ترخیص",
                                visible: false,
                                editCellTemplate: function (cellElement, cellInfoP) {
                                    renderFileUploaderWithPreview(cellElement, cellInfoP, "ClearanceReceiptFiles")
                                },
                            },
                            {
                                dataField: "partEPL",
                                caption: "تصویر سامانه EPL",
                                visible: false,
                                editCellTemplate: function (cellElement, cellInfoP) {
                                    renderFileUploaderWithPreview(cellElement, cellInfoP, "partEPL")
                                },
                            },
                            {
                                dataField: "PartCIFiles",
                                caption: "تصویر CI",
                                visible: false,
                                editCellTemplate: function (cellElement, cellInfoP) {
                                    renderFileUploaderWithPreview(cellElement, cellInfoP, "PartCIFiles")
                                },
                            },
                            {
                                dataField: "COOFiles",
                                caption: "تصویر Certificate of Origin (COO)",
                                visible: false,
                                editCellTemplate: function (cellElement, cellInfoP) {
                                    renderFileUploaderWithPreview(cellElement, cellInfoP, "COOFiles")
                                },
                            },
                            {
                                dataField: "COIFies",
                                caption: "تصویر Certificate of Inspection (COI)",
                                visible: false,
                                editCellTemplate: function (cellElement, cellInfoP) {
                                    renderFileUploaderWithPreview(cellElement, cellInfoP, "COIFies")
                                },
                            },
                            {
                                dataField: "partExtraFiles",
                                caption: "سایر پیوست‌ها",
                                visible: false,
                                editCellTemplate: function (cellElement, cellInfoP) {
                                    renderFileUploaderWithPreview(cellElement, cellInfoP, "partExtraFiles")
                                },
                            },
                            {
                                dataField: "itemStatusId",
                                caption: "وضعیت پارت",
                                lookup: {
                                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "proformaPartStatus" }),
                                    valueExpr: "value",
                                    displayExpr: "name"
                                },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                    rtlEnabled: true,
                                    placeholder: "انتخاب وضعیت",
                                },
                                validationRules: [
                                    {
                                        type: "required",
                                        message: "الزامی است"
                                    }
                                ],
                                visible: true
                            },

                        ],
                        onEditingStart: function (e) {
                            var partProductEditFields = [];
                            var partProductFields = [];
                            var partProducts = [];
                            //partProducts = cellInfo.data.proformaProducts
                            (cellInfo.data?.proformaProducts || $("#proformaProductGrid").dxDataGrid('option', 'dataSource')).forEach(function (o) {
                                let batchList = [];
                                if (o.batchNo && typeof o.batchNo === "string") {
                                    let spll = o.batchNo.includes("،") ? "،" : ",";
                                    (o.batchNo || "").split(spll).forEach(function (ob) {
                                        ob = ob.trim();
                                        if (ob) batchList.push(ob);
                                    })
                                }

                                if (batchList.length > 0) {
                                    batchList.forEach(batch => {
                                        partProducts.push({
                                            Qty: o.Qty,
                                            UnitId: o.UnitId,
                                            bId: o.bId,
                                            pId: o.pId,
                                            productId: o.productId,
                                            productSrc: o.productSrc,
                                            proformaProductId: o.proformaProductId,
                                            pty: o.pty,
                                            tempFilePath: o.tempFilePath,
                                            batchNo: batch
                                        });
                                    });
                                } else {
                                    partProducts.push({
                                        Qty: o.Qty,
                                        UnitId: o.UnitId,
                                        bId: o.bId,
                                        pId: o.pId,
                                        productId: o.productId,
                                        productSrc: o.productSrc,
                                        proformaProductId: o.proformaProductId,
                                        pty: o.pty,
                                        tempFilePath: o.tempFilePath,
                                        batchNo: "" // یا null یا undefined برحسب نیاز شما
                                    });
                                }
                            });
                            partProducts.forEach(function (item, index) {
                                partProductFields.push(
                                    {
                                        visible: false,
                                        dataField: "prdName_" + item.productSrc + "_" + item.productId + "_" + item.batchNo,
                                        caption: "نام محصول",
                                        editCellTemplate: function (container, options) {
                                            var prdDb = gridResult.proformaLookup.productTemp.map(o => {
                                                return { value: "tmp_" + o.value, name: o.name, type: 'tmp' };
                                            }).concat(allData.products.map(o => {
                                                return { value: "fnce_" + o.value, name: o.name, type: 'fnce' };
                                            }))

                                            var txt = prdDb.find(o => { return o.value == options.item.dataField.split("_").slice(1, 3).join("_") })?.name;

                                            container.html(`<input value="${txt}" type="text" class="py-2 form-control" placeholder="${txt}" disabled>`);
                                        },
                                    },
                                    {
                                        visible: false,
                                        dataField: "prdValue_" + item.productSrc + "_" + item.productId + "_" + item.batchNo,
                                        caption: "مقدار",
                                        dataType: "number",
                                        format: {
                                            type: "fixedPoint",
                                            precision: 3
                                        },

                                    },

                                    {
                                        visible: false,
                                        dataField: "prdUnit_" + item.productSrc + "_" + item.productId + "_" + item.batchNo,
                                        caption: "واحد",
                                        editCellTemplate: function (container, options) {
                                            var pid = options.item.dataField.split("_")[1] + "-" + options.item.dataField.split("_")[2]
                                            var unitId = (cellInfo.data?.proformaProducts || $("#proformaProductGrid").dxDataGrid('option', 'dataSource').map(function (o) {
                                                return {
                                                    Qty: o.Qty,
                                                    UnitId: o.UnitId,
                                                    bId: o.bId,
                                                    pId: o.pId,
                                                    productId: o.productId,
                                                    productSrc: o.productSrc,
                                                    proformaProductId: o.proformaProductId,
                                                    pty: o.pty,
                                                    tempFilePath: o.tempFilePath
                                                }
                                            })).find(o => { return o.pId == pid }).UnitId

                                            var unitDb = gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "unit" })
                                            var txt = unitDb.find(o => { return o.value == unitId })?.name || ""
                                            container.html(`<input value="${txt}" type="text" class="py-2 form-control" placeholder="${txt}" disabled>`);
                                        },


                                    },
                                    {
                                        visible: false,
                                        dataField: "prdBatchNo_" + item.productSrc + "_" + item.productId + "_" + item.batchNo,
                                        caption: "بچ",
                                        editCellTemplate: function (container, options) {
                                            let btch = (options?.item?.dataField || "").split("_");
                                            let btchNo = btch[btch.length - 1]
                                            container.html(`<input value="${btchNo}" type="text" class="py-2 form-control" placeholder="${btchNo}" disabled>`);

                                        },
                                    },

                                )
                                partProductEditFields.push("prdName_" + item.productSrc + "_" + item.productId + "_" + item.batchNo + "-12")
                                partProductEditFields.push("prdValue_" + item.productSrc + "_" + item.productId + "_" + item.batchNo + "-3")
                                partProductEditFields.push("prdUnit_" + item.productSrc + "_" + item.productId + "_" + item.batchNo + "-3")
                                partProductEditFields.push("prdBatchNo_" + item.productSrc + "_" + item.productId + "_" + item.batchNo + "-3")

                                partProductEditFields.push("empty-9")

                                proformaItemDb.forEach(function (prf) {
                                    prf["prdName_" + item.productSrc + "_" + item.productId + "_" + item.batchNo] = item.productSrc + "_" + item.productId
                                    prf["prdUnit_" + item.productSrc + "_" + item.productId + "_" + item.batchNo] = item.UnitId
                                })

                            })
                            let grid = $("#proformaItemGrid").dxDataGrid("instance");

                            // مرحله 1: حذف ستون‌های مرتبط با محصولات از columns
                            let baseColumns = grid.option("columns").filter(c =>
                                !c.dataField || (
                                    !c.dataField.startsWith("prdName_") &&
                                    !c.dataField.startsWith("prdValue_") &&
                                    !c.dataField.startsWith("prdUnit_") &&
                                    !c.dataField.startsWith("prdBatchNo_")
                                )
                            );
                            grid.option("columns", baseColumns.concat(partProductFields));

                            // مرحله 2: گرفتن فرم فعلی
                            // مرحله 1: گرفتن فرم فعلی
                            let formItems = grid.option("editing.form.items");

                            // مرحله 2: حذف فیلدهای داینامیک قبلی (prdName_, prdValue_, prdUnit_)
                            formItems = formItems.filter(item => {
                                const df = item?.dataField;

                                // حذف فیلدهای محصولات داینامیک
                                const isProductField = df &&
                                    (df.startsWith("prdName_") || df.startsWith("prdValue_") || df.startsWith("prdUnit_") || df.startsWith("prdBatchNo_"));

                                // حذف فیلدهای empty-12
                                //const isEmpty12 = item?.itemType === "empty" && item?.colSpan === 12;

                                //return !isProductField && !isEmpty12;
                                return !isProductField;
                            });

                            // مرحله 3: پیدا کردن index فیلدی که dataField === "itemStatusId"
                            let targetIndex = formItems.findIndex(item => item?.dataField === "partProductDesc");

                            // مرحله 4: ساخت فیلدهای جدید داینامیک
                            let dynamicFormItems = createFormItems(partProductEditFields, partProducts); // ← خودت ساختی

                            // مرحله 5: درج درست بعد از itemStatusId
                            if (targetIndex !== -1) {
                                formItems.splice(targetIndex + 1, 0, ...dynamicFormItems);
                            } else {
                                formItems.push(...dynamicFormItems); // اگر پیدا نشد، بنداز آخر فرم
                            }

                            // مرحله 6: اعمال به گرید
                            grid.option("editing.form.items", formItems);


                            ////////////////////////////////////////



                            e.data.tempFilePath = generateRandomFolderName()
                            if (e.data.ProformaId) {
                                let path = `/uploads/pi/pi-${e.data.ProformaId}/item-${e.data.ProformaItemId}`;
                                getFilesList(path, function (files) {
                                    e.data.allFiles = files;  // هر چی خواستی ذخیره کن تو e.data
                                    // می‌تونی مثلا بگی: e.data.piFiles = files.filter(f => f.fileName.startsWith("PINumberFiles"));
                                }, function () {
                                    DevExpress.ui.notify("خطا در دریافت لیست فایل‌ها", "error");
                                });
                            }
                        },
                        onInitNewRow: function (e) {

                            var partProductEditFields = [];
                            var partProductFields = [];
                            var partProducts = [];
                            (cellInfo.data?.proformaProducts || $("#proformaProductGrid").dxDataGrid('option', 'dataSource')).forEach(function (o) {
                                let batchList = [];
                                if (o.batchNo && typeof o.batchNo === "string") {
                                    let spll = o.batchNo.includes("،") ? "،" : ",";
                                    (o.batchNo || "").split(spll).forEach(function (ob) {
                                        ob = ob.trim();
                                        if (ob) batchList.push(ob);
                                    })
                                }

                                if (batchList.length > 0) {
                                    batchList.forEach(batch => {
                                        partProducts.push({
                                            Qty: o.Qty,
                                            UnitId: o.UnitId,
                                            bId: o.bId,
                                            pId: o.pId,
                                            productId: o.productId,
                                            productSrc: o.productSrc,
                                            proformaProductId: o.proformaProductId,
                                            pty: o.pty,
                                            tempFilePath: o.tempFilePath,
                                            batchNo: batch
                                        });
                                    });
                                } else {
                                    partProducts.push({
                                        Qty: o.Qty,
                                        UnitId: o.UnitId,
                                        bId: o.bId,
                                        pId: o.pId,
                                        productId: o.productId,
                                        productSrc: o.productSrc,
                                        proformaProductId: o.proformaProductId,
                                        pty: o.pty,
                                        tempFilePath: o.tempFilePath,
                                        batchNo: "" // یا null یا undefined برحسب نیاز شما
                                    });
                                }
                            });

                            partProducts.forEach(function (item, index) {
                                partProductFields.push(
                                    {
                                        visible: false,
                                        dataField: "prdName_" + item.productSrc + "_" + item.productId + "_" + item.batchNo,
                                        caption: "نام محصول",
                                        editCellTemplate: function (container, options) {
                                            var prdDb = gridResult.proformaLookup.productTemp.map(o => {
                                                return { value: "tmp_" + o.value, name: o.name, type: 'tmp' };
                                            }).concat(allData.products.map(o => {
                                                return { value: "fnce_" + o.value, name: o.name, type: 'fnce' };
                                            }))

                                            var txt = prdDb.find(o => { return o.value == options.item.dataField.split("_").slice(1, 3).join("_") })?.name;

                                            container.html(`<input value="${txt}" type="text" class="py-2 form-control" placeholder="${txt}" disabled>`);
                                        },
                                    },
                                    {
                                        visible: false,
                                        dataField: "prdValue_" + item.productSrc + "_" + item.productId + "_" + item.batchNo,
                                        caption: "مقدار",
                                        dataType: "number",
                                        format: {
                                            type: "fixedPoint",
                                            precision: 3
                                        },

                                    },

                                    {
                                        visible: false,
                                        dataField: "prdUnit_" + item.productSrc + "_" + item.productId + "_" + item.batchNo,
                                        caption: "واحد",
                                        editCellTemplate: function (container, options) {
                                            var pid = options.item.dataField.split("_")[1] + "-" + options.item.dataField.split("_")[2]
                                            var unitId = (cellInfo.data?.proformaProducts || $("#proformaProductGrid").dxDataGrid('option', 'dataSource').map(function (o) {
                                                return {
                                                    Qty: o.Qty,
                                                    UnitId: o.UnitId,
                                                    bId: o.bId,
                                                    pId: o.pId,
                                                    productId: o.productId,
                                                    productSrc: o.productSrc,
                                                    proformaProductId: o.proformaProductId,
                                                    pty: o.pty,
                                                    tempFilePath: o.tempFilePath
                                                }
                                            })).find(o => { return o.pId == pid }).UnitId

                                            var unitDb = gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "unit" })
                                            var txt = unitDb.find(o => { return o.value == unitId })?.name || ""
                                            container.html(`<input value="${txt}" type="text" class="py-2 form-control" placeholder="${txt}" disabled>`);
                                        },


                                    },
                                    {
                                        visible: false,
                                        dataField: "prdBatchNo_" + item.productSrc + "_" + item.productId + "_" + item.batchNo,
                                        caption: "بچ",
                                        editCellTemplate: function (container, options) {
                                            let btch = (options?.item?.dataField || "").split("_");
                                            let btchNo = btch[btch.length - 1]
                                            container.html(`<input value="${btchNo}" type="text" class="py-2 form-control" placeholder="${btchNo}" disabled>`);

                                        },
                                    },

                                )
                                partProductEditFields.push("prdName_" + item.productSrc + "_" + item.productId + "_" + item.batchNo + "-12")
                                partProductEditFields.push("prdValue_" + item.productSrc + "_" + item.productId + "_" + item.batchNo + "-3")
                                partProductEditFields.push("prdUnit_" + item.productSrc + "_" + item.productId + "_" + item.batchNo + "-3")
                                partProductEditFields.push("prdBatchNo_" + item.productSrc + "_" + item.productId + "_" + item.batchNo + "-3")

                                partProductEditFields.push("empty-9")

                                proformaItemDb.forEach(function (prf) {
                                    prf["prdName_" + item.productSrc + "_" + item.productId + "_" + item.batchNo] = item.productSrc + "_" + item.productId
                                    prf["prdUnit_" + item.productSrc + "_" + item.productId + "_" + item.batchNo] = item.UnitId
                                })

                            })

                            let grid = $("#proformaItemGrid").dxDataGrid("instance");

                            // مرحله 1: حذف ستون‌های مرتبط با محصولات از columns
                            let baseColumns = grid.option("columns").filter(c =>
                                !c.dataField || (
                                    !c.dataField.startsWith("prdName_") &&
                                    !c.dataField.startsWith("prdValue_") &&
                                    !c.dataField.startsWith("prdUnit_") &&
                                    !c.dataField.startsWith("prdBatchNo_")
                                )
                            );
                            grid.option("columns", baseColumns.concat(partProductFields));

                            // مرحله 2: گرفتن فرم فعلی
                            // مرحله 1: گرفتن فرم فعلی
                            let formItems = grid.option("editing.form.items");

                            // مرحله 2: حذف فیلدهای داینامیک قبلی (prdName_, prdValue_, prdUnit_)
                            formItems = formItems.filter(item => {
                                const df = item?.dataField;

                                // حذف فیلدهای محصولات داینامیک
                                const isProductField = df &&
                                    (df.startsWith("prdName_") || df.startsWith("prdValue_") || df.startsWith("prdUnit_") || df.startsWith("prdBatchNo_"));

                                // حذف فیلدهای empty-12
                                //const isEmpty12 = item?.itemType === "empty" && item?.colSpan === 12;

                                //return !isProductField && !isEmpty12;
                                return !isProductField;
                            });

                            // مرحله 3: پیدا کردن index فیلدی که dataField === "itemStatusId"
                            let targetIndex = formItems.findIndex(item => item?.dataField === "partProductDesc");

                            // مرحله 4: ساخت فیلدهای جدید داینامیک
                            let dynamicFormItems = createFormItems(partProductEditFields, partProducts); // ← خودت ساختی

                            // مرحله 5: درج درست بعد از itemStatusId
                            if (targetIndex !== -1) {
                                formItems.splice(targetIndex + 1, 0, ...dynamicFormItems);
                            } else {
                                formItems.push(...dynamicFormItems); // اگر پیدا نشد، بنداز آخر فرم
                            }

                            // مرحله 6: اعمال به گرید
                            grid.option("editing.form.items", formItems);
                            e.data.tempFilePath = generateRandomFolderName()

                        },
                        function(e) {

                            cellInfo.setValue("HasChangedItems", true);
                        },
                        onContentReady: function (e) {

                            cellInfo.setValue("HasChangedItems", true);
                            e.element.find(".dx-header-row > td").css("font-size", "12px");
                        },
                        onToolbarPreparing: function (e) {
                            // Remove default Add button
                            e.toolbarOptions.items = e.toolbarOptions.items.filter(function (item) {
                                return item.name !== "addRowButton";
                            });

                            // Add your custom Add button
                            e.toolbarOptions.items.unshift({
                                widget: "dxButton",
                                options: {
                                    icon: "add",
                                    text: "",
                                    onClick: function () {
                                        if ($("#proformaProductGrid").dxDataGrid("option", 'dataSource').length > 0) {
                                            // If product(s) exist, add new row
                                            $("#proformaItemGrid").dxDataGrid("instance").addRow();
                                        } else {
                                            showToast("برای ثبت پارت ها می بایست حتما حداقل یک محصول تعریف نمایید.", "warning", 3000);
                                            blinkElement($(".shipmentPopupParts.productInfo"), times = 3, speed = 200)
                                        }
                                    }
                                },
                                location: "after"
                            });
                        }

                    });

                }
            },
            {
                dataField: "proformaType",
                caption: "نوع ثبت سفارش",
                width: "auto",
                lookup: {
                    dataSource: gridResult.proformaLookup.baseData.filter(o => o.groupName == 'proformaType'),
                    valueExpr: "value",
                    displayExpr: "name"
                },
                editCellTemplate: function (cellElement, cellInfo) {
                    var $selectBox = $("<div>").appendTo(cellElement);
                    $selectBox.dxSelectBox({
                        dataSource: gridResult.proformaLookup.baseData.filter(o => o.groupName == 'proformaType'),
                        displayExpr: "name",
                        valueExpr: "value",
                        searchEnabled: false,
                        placeholder: "انتخاب کنید",
                        value: cellInfo.value,
                        onValueChanged: function (e) {
                            proformaType = e.value;

                            cellInfo.setValue(e.value);
                            var form = cellElement.closest(".dx-form").dxForm("instance");
                            if (form) {
                                if (e.value === 2) {
                                    $("#shipment").dxDataGrid('option', 'editing.form.items', formItemsWithProforma);
                                } else if (e.value === 1) {
                                    $("#shipment").dxDataGrid('option', 'editing.form.items', formItemsWithoutProforma);
                                }
                            }
                        }
                    });
                },
                validationRules: [
                    {
                        type: "required",
                        message: "الزامی است"
                    }
                ]

            },
            {
                dataField: "cid",
                caption: "شرکت",
                width: "auto",
                lookup: {
                    dataSource: allData.companies,
                    valueExpr: "cId",
                    displayExpr: "cName_FA"
                }
            },
            {
                dataField: "sId",
                visible: false,
                caption: "نام فروشنده (Seller Name)",
                lookup: {
                    dataSource: gridResult.proformaLookup.sellers,
                    valueExpr: "value",
                    displayExpr: "name"
                },
                editorType: "dxSelectBox",
                editorOptions: {
                    dataSource: gridResult.proformaLookup.sellers,
                    displayExpr: "name",
                    rtlEnabled: true,
                    valueExpr: "value",
                    searchEnabled: true,
                    noDataText: "برای افزودن کلید اینتر را فشار دهید",
                    placeholder: "انتخاب کنید",
                    acceptCustomValue: true,
                    onCustomItemCreating: function (e) {
                        e.customItem = null;
                    },
                    onKeyDown: function (e) {
                        if (e.event.key === "Enter") {
                            e.event.preventDefault();
                            var editor = e.component;
                            var newValue = editor.option("text").trim();
                            var data = { name: newValue }
                            if (newValue) {
                                DevExpress.ui.dialog.confirm("آیا مطمئن هستید که این فروشنده را اضافه کنید؟", "افزودن فروشنده جدید").done(function (dialogResult) {
                                    if (dialogResult) {
                                        // Proceed with AJAX call to add the new product
                                        $.ajax({
                                            url: "controller/services.asmx/saveProformaSeller",
                                            type: "POST",
                                            contentType: "application/json; charset=utf-8",
                                            dataType: "json",
                                            data: JSON.stringify({ data: data }),
                                            success: function (response) {
                                                var addedSeller = JSON.parse(response.d);
                                                addedSeller = JSON.parse(addedSeller[0].response);
                                                toast(addedSeller.message, addedSeller.type)
                                                gridResult.proformaLookup.sellers.push(addedSeller);
                                                editor.option("dataSource", gridResult.proformaLookup.sellers);
                                                editor.option("value", addedSeller.value);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    }
                },
                validationRules: [
                    {
                        type: "required",
                        message: "الزامی است"
                    }
                ]
            },
            {
                dataField: "IncotermId",
                caption: "اینکوترمز (INCOTERMS)",
                visible: false,
                lookup: {
                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "incoterm" }).map(o => ({
                        name: o.name.split('-')[0].trim(),
                        value: o.value
                    })),
                    valueExpr: "value",
                    displayExpr: "name",
                },
                editorType: "dxSelectBox",
                editorOptions: {
                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "incoterm" }),
                    placeholder: "انتخاب کنید",
                    valueExpr: "value",
                    displayExpr: "name",
                    itemTemplate: function (itemData, itemIndex, element) {
                        // Create a span or div element
                        var text = itemData.name.split('-')[0].trim()
                        var hint = itemData.name.split('-')[1].trim()
                        var $item = $(`<div>`).attr("title", hint).html(text);
                        return $item;
                    },
                },
                validationRules: [
                    {
                        type: "required",
                        message: "الزامی است"
                    }
                ]
            },
            {
                dataField: "PINumber",
                caption: "شماره پروفورما (Proforma Invoice No)",
                width: "auto",
                editorOptions: {
                    rtlEnabled: true,
                },
                validationRules: [
                    {
                        type: "required",
                        message: "وارد کردن شماره PI الزامی است"
                    }
                ]
            },
            {
                dataField: "brands",   // this should be the comma-separated IDs or an array
                caption: "Brands",

                // Convert IDs → Names for display
                calculateCellValue: function (rowData) {
                    let ids = (rowData.brands || "").split(",");
                    let uniqueIds = [...new Set(ids)];
                    let names = uniqueIds.map(id => {
                        let brand = allData.brands.find(b => b.bId == id);
                        return brand ? brand.bName_FA : id;
                    });
                    return names;  // return array
                },

                cellTemplate: function (container, options) {
                    container.text(options.value.join(", "));
                },

                // Enable filtering by brand name
                headerFilter: {
                    dataSource: allData.brands.map(b => ({
                        text: b.bName_FA,
                        value: ["brands", "contains", b.bId.toString()] // custom filter
                    }))
                }
            },
            {
                dataField: "OrderRegCode",
                caption: "کد ثبت سفارش (سامانه جامع تجارت ایران)",
                visible: false,
                editorType: "dxTextBox",  // بهتر است از TextBox استفاده کنید با ماسک
                editorOptions: {
                    mask: "00000000",       // ماسک برای 8 رقم عددی دقیقاً
                    maskChar: "",
                    rtlEnabled: true,
                    placeholder: "کد هشت رقمی",
                    showClearButton: true
                },
                //validationRules: [
                //    {
                //        type: "required",
                //        message: "وارد کردن کد ثبت سفارش الزامی است"
                //    },
                //    {
                //        type: "pattern",
                //        pattern: /^[0-9]{8}$/,
                //        message: "کد ثبت سفارش باید دقیقا ۸ رقم عددی باشد"
                //    }
                //]
            },
            {
                dataField: "MainBank",
                caption: "بانک عامل",
                visible: false,
                //validationRules: [
                //    {
                //        type: "required",
                //        message: "وارد کردن بانک عامل الزامی است"
                //    }
                //]
                lookup: {
                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "bankName" }).map(o => ({
                        name: o.name,
                        value: o.value
                    })),
                    valueExpr: "value",
                    displayExpr: "name"
                },
                editorType: "dxSelectBox",
                editorOptions: {
                    dataSource: gridResult.proformaLookup.
                        baseData.filter(o => { return o.groupName == 'bankName' }),
                    displayExpr: "name",
                    valueExpr: "value",
                    searchEnabled: false,
                    rtlEnabled: true,
                    placeholder: "انتخاب کنید",
                },
            },
            {
                dataField: "IBAN",
                caption: "شماره حساب بانکی بین‌المللی (IBAN)",
                visible: false,
                editorOptions: {
                    rtlEnabled: true,
                },
                visible: false
            },
            {
                dataField: "SWIFT",
                caption: "کد SWIFT",
                visible: false,
                editorOptions: {
                    rtlEnabled: true,
                },
                visible: false
            },
            {
                dataField: "FXAssignDate",
                caption: "تاریخ تخصیص ارز",
                visible: false,
                dataType: "date",
                editorType: "dxDateBox",
                editorOptions: {
                    pickerType: "calendar",
                    displayFormat: "yyyy/MM/dd",
                    placeholder: "انتخاب کنید",
                }
            },
            {
                dataField: "FXAssignCode",
                caption: "کد تخصیص ارز",
                visible: false,
                editorOptions: {
                    rtlEnabled: true,
                },
                visible: false
            },

            //{
            //    dataField: "totalCostProducts",
            //    caption: "هزینه سفارش",
            //    cellTemplate: function (container, options) {
            //        var displayClass = ""
            //        if (options.data.TotalSaleAmount < 0) {
            //            displayClass = "text-danger"
            //        }
            //        const formattedValue = threeDigit(options.value?.toFixed(0));
            //        container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
            //    },
            //    editorOptions: {
            //        rtlEnabled: true,
            //    },
            //},
            {
                dataField: "FXTypeId",
                caption: "یکای ارز",
                lookup: {
                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "currency" }).map(o => ({
                        name: o.name,
                        value: o.value
                    })),
                    valueExpr: "value",
                    displayExpr: "name"
                },
                editorType: "dxSelectBox",
                editorOptions: {
                    dataSource: gridResult.proformaLookup.
                        baseData.filter(o => { return o.groupName == 'currency' }),
                    displayExpr: "name",
                    valueExpr: "value",
                    searchEnabled: false,
                    rtlEnabled: true,
                    placeholder: "انتخاب کنید",
                },
                //isRequired: true
            },
            {
                dataField: "FXTypeSrc",
                caption: "نوع ارز",
                lookup: {
                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "currencySrc" }).map(o => ({
                        name: o.name,
                        value: o.value
                    })),
                    valueExpr: "value",
                    displayExpr: "name"
                },
                editorType: "dxSelectBox",
                editorOptions: {
                    dataSource: gridResult.proformaLookup.
                        baseData.filter(o => { return o.groupName == 'currencySrc' }),
                    displayExpr: "name",
                    valueExpr: "value",
                    searchEnabled: false,
                    rtlEnabled: true,
                    placeholder: "انتخاب کنید",
                },
                //isRequired: true
            },
            {
                dataField: "FXRate",
                caption: "نرخ ارز (ریال)",
                dataType: "number",
                visible: false,
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },

            },
            {
                dataField: "IRRTotal",
                visible: false,
                caption: "Total Cost (ارزی)",
                dataType: "number",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorOptions: {
                    rtlEnabled: true,
                },
            },
            {
                dataField: "Deadline",
                visible: false,
                caption: "مهلت رفع تعهد ارزی",
                dataType: "date",
                editorType: "dxDateBox",
                editorOptions: {
                    pickerType: "calendar",
                    displayFormat: "yyyy/MM/dd",
                    placeholder: "انتخاب کنید",
                }
            },
            {
                dataField: "InsurerName",
                visible: false,
                caption: "نام بیمه‌گذار",
                lookup: {
                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "insurerName" }).map(o => ({
                        name: o.name,
                        value: o.value
                    })),
                    valueExpr: "value",
                    displayExpr: "name"
                },
                editorType: "dxSelectBox",
                editorOptions: {
                    dataSource: gridResult.proformaLookup.
                        baseData.filter(o => { return o.groupName == 'insurerName' }),
                    displayExpr: "name",
                    valueExpr: "value",
                    searchEnabled: false,
                    rtlEnabled: true,
                    placeholder: "انتخاب کنید"
                },

            },
            {
                dataField: "InsuranceNo",
                visible: false,
                caption: "شماره بیمه باربری",
                editorOptions: {
                    rtlEnabled: true,
                },
                visible: false
            },
            {
                dataField: "InsuranceCost",
                caption: "هزینه بیمه باربری (ریال)",
                dataType: "number",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorType: "dxNumberBox",
                editorOptions: {
                    format: "#,###",
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 1000
                },
            },
            {
                dataField: "InsuranceFXTypeId",
                caption: "یکای ارز بیمه باربری",
                lookup: {
                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "currency" }).map(o => ({
                        name: o.name,
                        value: o.value
                    })),
                    valueExpr: "value",
                    displayExpr: "name"
                },
                editorType: "dxSelectBox",
                editorOptions: {
                    dataSource: gridResult.proformaLookup.
                        baseData.filter(o => { return o.groupName == 'currency' }),
                    displayExpr: "name",
                    valueExpr: "value",
                    searchEnabled: false,
                    rtlEnabled: true,
                    placeholder: "انتخاب کنید",
                },
                //isRequired: true
            },
            {
                dataField: "TransportCost",
                caption: "هزینه باربری (ریال)",
                dataType: "number",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorType: "dxNumberBox",
                editorOptions: {
                    format: "#,###",
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 1000
                },
            },
            {
                dataField: "TransportFXTypeId",
                caption: "یکای ارز باربری ",
                lookup: {
                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "currency" }).map(o => ({
                        name: o.name,
                        value: o.value
                    })),
                    valueExpr: "value",
                    displayExpr: "name"
                },
                editorType: "dxSelectBox",
                editorOptions: {
                    dataSource: gridResult.proformaLookup.
                        baseData.filter(o => { return o.groupName == 'currency' }),
                    displayExpr: "name",
                    valueExpr: "value",
                    searchEnabled: false,
                    rtlEnabled: true,
                    placeholder: "انتخاب کنید",
                },
                //isRequired: true
            },
            {
                dataField: "customOrigin",
                visible: false,
                caption: " گمرک مبدا (Origin Customs)",
                lookup: {
                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "customOrigin" }).map(o => ({
                        name: o.name,
                        value: o.value
                    })),
                    valueExpr: "value",
                    displayExpr: "name"
                },
                editorType: "dxSelectBox",
                editorOptions: {
                    dataSource: gridResult.proformaLookup.
                        baseData.filter(o => { return o.groupName == 'customOrigin' }),
                    displayExpr: "name",
                    valueExpr: "value",
                    searchEnabled: false,
                    rtlEnabled: true,
                    placeholder: "انتخاب کنید",
                },
                //isRequired: true
            },
            {
                dataField: "customDestination",
                visible: false,
                caption: " گمرک مقصد (Destination Customs)",
                lookup: {
                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "customDestination" }).map(o => ({
                        name: o.name,
                        value: o.value
                    })),
                    valueExpr: "value",
                    displayExpr: "name"
                },
                editorType: "dxSelectBox",
                editorOptions: {
                    dataSource: gridResult.proformaLookup.
                        baseData.filter(o => { return o.groupName == 'customDestination' }),
                    displayExpr: "name",
                    valueExpr: "value",
                    searchEnabled: false,
                    rtlEnabled: true,
                    placeholder: "انتخاب کنید",
                },
                //isRequired: true
            },
            {
                dataField: "proformaDate",
                visible: false,
                caption: "تاریخ پروفورما (Proforma Invoice Date)",
                dataType: "date",
                editorType: "dxDateBox",
                editorOptions: {
                    pickerType: "calendar",
                    displayFormat: "yyyy/MM/dd",
                    placeholder: "انتخاب کنید",
                }
            },
            {
                dataField: "proformaValidDate",
                visible: false,
                caption: "تاریخ اعتبار پروفورما",
                dataType: "date",
                editorType: "dxDateBox",
                editorOptions: {
                    pickerType: "calendar",
                    displayFormat: "yyyy/MM/dd",
                    placeholder: "انتخاب کنید",
                }
            },
            {
                dataField: "TransactionMinuteAttach",
                caption: "TransactionMinuteAttach",
                visible: false
            },
            {
                dataField: "ProformaStatusId",
                caption: "وضعیت سفارش",
                width: "auto",
                lookup: {
                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "proformaStatus" }),
                    valueExpr: "value",
                    displayExpr: "name"
                },
                editorType: "dxSelectBox",
                editorOptions: {
                    rtlEnabled: true,
                    placeholder: "انتخاب وضعیت",
                },
                validationRules: [
                    {
                        type: "required",
                        message: "الزامی است"
                    }
                ],
                visible: true
            },
            {
                dataField: "proformaCostRows",  // چون فیلد خاصی نیست، مقدار دلخواه بگذار یا حذف کن اگر لازم نیست
                visible: false,
                caption: " ",
                editCellTemplate: function (itemElement, cellInfo) {
              
                    $("<div  class='proformaCostRows productInfo p-0'>").html(
                        "<div class='bg-proformaCostRows rounded p-2'><span style='font-size: 16px;'>💵 اطلاعات مربوط به هزینه‌های Proforma Invoice </span> <span style='font-size: 13px;'> (در این بخش، هزینه تمام  پروفورما وارد کنید.)</span></div>"
                    ).appendTo(itemElement);
                    }
            },
            {
                dataField: "bankCost",
                caption: "هزینه های بانکی (ریال)",
                dataType: "number",
                visible: false,
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorType: "dxNumberBox",
                editorOptions: {
                    format: "#,###",
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 1000
                },
            },
            {
                dataField: "labCost",
                caption: "هزینه آزمایشگاه و نمونه برداری (ریال) ",
                dataType: "number",
                visible: false,
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorType: "dxNumberBox",
                editorOptions: {
                    format: "#,###",
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 1000
                },
            },
            {
                dataField: "orderPlacementCost",
                caption: "هزینه ثبت سفارش (ریال)",
                visible: false,
                dataType: "number",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorType: "dxNumberBox",
                editorOptions: {
                    format: "#,###",
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 1000
                },
            },
            {
                dataField: "standardCustomsCost",
                caption: "هزینه استاندارد - گمرک (ریال)",
                visible: false,
                dataType: "number",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorType: "dxNumberBox",
                editorOptions: {
                    format: "#,###",
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 1000
                },
            },
            {
                dataField: "customsStorageCost",
                caption: "هزینه انبارداری گمرک (ریال)",
                dataType: "number",
                visible: false,
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorType: "dxNumberBox",
                editorOptions: {
                    format: "#,###",
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 1000
                },
            },
            {
                dataField: "ministryRoadsCost",
                caption: "هزینه وزارت راه (ریال)",
                dataType: "number",
                visible: false,
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorType: "dxNumberBox",
                editorOptions: {
                    format: "#,###",
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 1000
                },
            },
            {
                dataField: "customsDutyCost",
                caption: "هزینه حقوق گمرکی (ریال)",
                dataType: "number",
                visible: false,
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorType: "dxNumberBox",
                editorOptions: {
                    format: "#,###",
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 1000
                },
            },
            {
                dataField: "helalAhmarCost",
                caption: "هزینه هلال احمر (ریال)",
                dataType: "number",
                visible: false,
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorType: "dxNumberBox",
                editorOptions: {
                    format: "#,###",
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 1000
                },
            },
            {
                dataField: "TTACCost",
                caption: "هزینه مجوز ترخیص TTAC (ریال)",
                dataType: "number",
                visible: false,
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorType: "dxNumberBox",
                editorOptions: {
                    format: "#,###",
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 1000
                },
            },
            //{
            //    dataField: "internationalShippingCost",
            //    caption: "هزینه حمل خارجی",
            //    cellTemplate: function (container, options) {
            //        var displayClass = ""
            //        if (options.data.TotalSaleAmount < 0) {
            //            displayClass = "text-danger"
            //        }
            //        const formattedValue = threeDigit(options.data.TransportCost?.toFixed(0));
            //        container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
            //    },
            //    editorOptions: {
            //        rtlEnabled: true,
            //    },
            //},
            {
                dataField: "internalShippingCost",
                caption: "هزینه حمل داخلی (ریال)",
                dataType: "number",
                visible: false,
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorType: "dxNumberBox",
                editorOptions: {
                    format: "#,###",
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 1000
                },
            },
            {
                dataField: "labelCost",
                caption: "هزینه لیبل اصالت (ریال)",
                dataType: "number",
                visible:false,
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorType: "dxNumberBox",
                editorOptions: {
                    format: "#,###",
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 1000
                },
            },
            {
                dataField: "clearingAgentCost",
                caption: "هزینه ترخیص کار (ریال)",
                dataType: "number",
                visible: false,
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorType: "dxNumberBox",
                editorOptions: {
                    format: "#,###",
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 1000
                },
            },
            {
                dataField: "extraCost",
                caption: "سایر هزینه ها (ریال)",
                dataType: "number",
                visible: false,
                cellTemplate: function (container, options) {
                    
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.value?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                },
                editorType: "dxNumberBox",
                editorOptions: {
                    format: "#,###",
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 1000
                },
            },
            {
                dataField: "NoteCost",
                caption: "یادداشت هزینه ها",
                editorType: "dxTextArea",
                editorOptions: {
                    height: 60,  // adjust height as needed
                    maxLength: 3000,
                    placeholder: "چنانچه هزینه یادداشتی دارد لطفا یادداشت را وارد کنید"
                },
                visible: false  // If you want it hidden by default; remove or set to true to show,
            },
            {
                dataField: "proformaProductRows",  // چون فیلد خاصی نیست، مقدار دلخواه بگذار یا حذف کن اگر لازم نیست
                visible: false,
                caption: " ",
                editCellTemplate: function (itemElement, cellInfo) {
                    var proformaId = cellInfo.data.ProformaId
                    var proformaProductDb = []
                    if (proformaId) {
                        proformaProductDb = getProformaProducts(proformaId)
                        cellInfo.data.proformaProducts = proformaProductDb
                    }
                    cellInfo.component.cellValue(cellInfo.rowIndex, "HasChangedItems", true);
                    $("<div  class='shipmentPopupParts productInfo p-0'>").html(
                        "<div class='bg-proformaProduct rounded p-2'><span style='font-size: 15px;'>💊 اطلاعات مربوط به ردیف‌های Proforma Invoice </span> <span style='font-size: 13px;'> (در این بخش، مشخصات تمام محصولاتی که در این پروفورما فهرست شده‌اند را ردیف به ردیف وارد کنید.)</span></div>"
                    ).appendTo(itemElement);
                    var $container = $("<div id='proformaProductGrid'>").appendTo(itemElement);
                    $container.dxDataGrid({
                        dataSource: proformaProductDb,  // مقدار صحیح داده‌ها را اینجا بگذار
                        keyExpr: "proformaProductId",
                        rtlEnabled: true,
                        width: "100%",
                        noDataText: '',
                        editing: {
                            popup: {
                                title: "💊 افزودن/ویرایش محصول به پروفورما",
                                showTitle: true,
                                height: "80vh",
                                width: "89vw",
                                onShowing: function () {
                                    popUpCss("proformaProduct")
                                }
                            },
                            mode: "popup",
                            allowAdding: true,
                            allowUpdating: true,
                            allowDeleting: false,
                            useIcons: true,
                            form: {
                                colCount: 30,
                                items: createFormItems([
                                    "bId-6", "pId-6", "pty-6", "Qty-6", "UnitId-6", "netWeight-6", "grossWeight-6", "FXProductUnitPrice-6", "FXTotal-6", "CASNo-6", "batchNo-30", "productCAS-6", "SpecSheet-6", "COA-6", "productExtraFile-6"
                                ])
                            }

                        },
                        columns: [
                            {
                                dataField: "SpecSheet",
                                caption: "تصویر برگ ویژگی‌ها (SpecSheet)",
                                visible: false,
                                editCellTemplate: function (cellElement, cellInfoP) {
                                    renderFileUploaderWithPreview(cellElement, cellInfoP, "SpecSheetFiles")
                                },
                            },
                            {
                                dataField: "productCAS",
                                caption: "تصویر CAS",
                                visible: false,
                                editCellTemplate: function (cellElement, cellInfoP) {
                                    renderFileUploaderWithPreview(cellElement, cellInfoP, "productCASFiles")
                                },
                            },
                            {
                                dataField: "COA",
                                caption: "تصویر برگ آنالیز (COA)",
                                visible: false,
                                editCellTemplate: function (cellElement, cellInfoP) {
                                    renderFileUploaderWithPreview(cellElement, cellInfoP, "COAFiles")
                                },
                            },
                            {
                                dataField: "productExtraFile",
                                caption: "سایر فایل‌ها",
                                visible: false,
                                editCellTemplate: function (cellElement, cellInfoP) {
                                    renderFileUploaderWithPreview(cellElement, cellInfoP, "productExtraFile")
                                },
                            },
                            {
                                dataField: "bId",
                                caption: "گروه کالا",
                                lookup: {
                                    dataSource: allData.brands,
                                    valueExpr: "bId",
                                    displayExpr: "bName_FA"
                                },
                                editorOptions: {
                                    placeholder: "انتخاب کنید",
                                },
                                validationRules: [
                                    {
                                        type: "required",
                                        message: "الزامی است"
                                    }
                                ]
                            },
                            {
                                dataField: "proformaProductId",
                                visible: false
                            },
                            {
                                dataField: "pId",
                                caption: "کالا (Product)",
                                lookup: {
                                    dataSource: gridResult.proformaLookup.productTemp.map(o => {
                                        return { value: "tmp-" + o.value, name: o.name, type: 'tmp' };
                                    }).concat(allData.products.map(o => {
                                        return { value: "fnce-" + o.value, name: o.name, type: 'fnce' };
                                    })),
                                    valueExpr: "value",
                                    displayExpr: "name",

                                },

                                editorType: "dxSelectBox",
                                editorOptions: {
                                    dataSource: new DevExpress.data.DataSource({
                                        store: gridResult.proformaLookup.productTemp.map(o => {
                                            return { value: "tmp-" + o.value, name: o.name, type: 'tmp' };
                                        }).concat(allData.products.map(o => {
                                            return { value: "fnce-" + o.value, name: o.name, type: 'fnce' };
                                        })),
                                        paginate: true,
                                        pageSize: 20
                                    }),
                                    displayExpr: "name",
                                    rtlEnabled: true,
                                    valueExpr: "value",
                                    searchEnabled: true,
                                    noDataText: "برای افزودن این محصول کلید اینتر را فشار دهید",
                                    placeholder: "انتخاب کنید",
                                    acceptCustomValue: true,
                                    itemTemplate: function (itemData, itemIndex, element) {
                                        // Create a span or div element
                                        var text = ""
                                        var hint = ""
                                        // Check type and apply color
                                        if (itemData.type === "fnce") {
                                            hint = "موجود در سیستم مالی"
                                            text += `<svg  xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="green" class="bi bi-circle-fill" viewBox="0 0 16 16">
                                                    <circle cx="8" cy="8" r="8" />
                                                </svg>`
                                        } else if (itemData.type === "tmp") {
                                            hint = "هنوز به محصولی در سیستم مالی متصل نشده است"
                                            text += `<svg  xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="orange" class="bi bi-circle-fill" viewBox="0 0 16 16">
                                                     <circle cx="8" cy="8" r="8" />
                                                 </svg>`
                                        }
                                        var $item = $(`<div>`).attr("title", hint).html(text + "&nbsp;" + itemData.name);
                                        return $item;
                                    },
                                    onCustomItemCreating: function (e) {
                                        // We'll handle adding only after confirmation in onKeyDown
                                        e.customItem = null; // prevent default adding here
                                    },
                                    onKeyDown: function (e) {
                                        if (e.event.key === "Enter") {
                                            e.event.preventDefault(); // prevent default Enter behavior
                                            var editor = e.component;
                                            var newValue = editor.option("text").trim();
                                            var data = { name: newValue, companyId: 2 }
                                            if (newValue) {
                                                DevExpress.ui.dialog.confirm("آیا مطمئن هستید که این محصول را اضافه کنید؟", "افزودن محصول جدید").done(function (dialogResult) {
                                                    if (dialogResult) {
                                                        // Proceed with AJAX call to add the new product
                                                        $.ajax({
                                                            url: "controller/services.asmx/saveProformaTempProduct",
                                                            type: "POST",
                                                            contentType: "application/json; charset=utf-8",
                                                            dataType: "json",
                                                            data: JSON.stringify({ data: data }),
                                                            success: function (response) {
                                                                var addedTempProduct = JSON.parse(response.d);
                                                                addedTempProduct = JSON.parse(addedTempProduct[0].response);
                                                                toast(addedTempProduct.message, addedTempProduct.type)
                                                                gridResult.proformaLookup.productTemp.push(addedTempProduct);
                                                                editor.option("dataSource", gridResult.proformaLookup.productTemp.concat(allData.products.filter(o => { return o.cId == currentCid })));
                                                                editor.option("value", addedTempProduct.value);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                },
                                validationRules: [
                                    {
                                        type: "required",
                                        message: "الزامی است"
                                    }
                                ]
                            },
                            {
                                dataField: "pty",
                                caption: "نوع کالا (Product Type)",
                                lookup: {
                                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == 'proformaProductType' }),
                                    valueExpr: "value",
                                    displayExpr: "name"
                                },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == 'proformaProductType' }),
                                    displayExpr: "name",
                                    valueExpr: "value",
                                    searchEnabled: false,
                                    rtlEnabled: true,
                                    placeholder: "انتخاب کنید",
                                },
                                validationRules: [
                                    {
                                        type: "required",
                                        message: "الزامی است"
                                    }
                                ]
                            },
                            {
                                dataField: "Qty",
                                caption: "مقدار کل در این ثبت سفارش (Quantity)",
                                editorType: "dxNumberBox",
                                editorOptions: {
                                    format: "#,###",
                                    showSpinButtons: false,
                                    rtlEnabled: true,
                                    precision: 3,
                                    useMaskBehavior: true,
                                    min: 0,
                                    step: 1000
                                },
                                //setCellValue: function (newData, value) {
                                //    newData.Qty = value;
                                //    newData.FXTotal = value * (newData.FXProductUnitPrice || 0);
                                //}
                                setCellValue: function (newData, value, currentRowData) {
                                    newData.Qty = value;
                                    newData.FXTotal = (value || 0) * (currentRowData.FXProductUnitPrice || 0);
                                },
                                validationRules: [
                                    {
                                        type: "required",
                                        message: "وارد کردن مقدار الزامی است"
                                    }
                                ],
                            },
                            {
                                dataField: "netWeight",
                                caption: "وزن خالص (کیلوگرم)",
                                editorType: "dxNumberBox",
                                editorOptions: {
                                    format: "#,###",
                                    showSpinButtons: false,
                                    rtlEnabled: true,
                                    precision: 3,
                                    useMaskBehavior: true,
                                    min: 0,
                                    step: 1000
                                },
                            },
                            {
                                dataField: "grossWeight",
                                caption: "وزن ناخالص (کیلوگرم)",
                                editorType: "dxNumberBox",
                                editorOptions: {
                                    format: "#,###",
                                    showSpinButtons: false,
                                    rtlEnabled: true,
                                    precision: 3,
                                    useMaskBehavior: true,
                                    min: 0,
                                    step: 1000
                                },
                            },
                            {
                                dataField: "UnitId",
                                caption: "یکا (Unit)",
                                lookup: {
                                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "unit" }),
                                    valueExpr: "value",
                                    displayExpr: "name"
                                },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                    rtlEnabled: true,
                                    placeholder: "انتخاب کنید",
                                },
                                validationRules: [
                                    {
                                        type: "required",
                                        message: "الزامی است"
                                    }
                                ]
                            },
                            {
                                dataField: "FXProductUnitPrice",
                                caption: "ارزش قلم کالا (ارزی)",
                                editorOptions: {
                                    rtlEnabled: true,
                                },
                                editorType: "dxNumberBox",
                                editorOptions: {
                                    format: "#,##0.#",
                                    showSpinButtons: false,
                                    rtlEnabled: true,
                                    precision: 3,
                                    useMaskBehavior: true,
                                    min: 0,
                                    step: 0.1
                                },
                                setCellValue: function (newData, value, currentRowData) {
                                    newData.FXProductUnitPrice = value;
                                    newData.FXTotal = (currentRowData.Qty || 0) * (value || 0);
                                }
                                //setCellValue: function (newData, value) {
                                //    newData.FXProductUnitPrice = value;
                                //    newData.FXTotal = (newData.Qty || 0) * value;
                                //}
                            },
                            {
                                dataField: "FXTotal",
                                caption: "جمع کل ارز",
                                allowEditing: false,
                                //setCellValue: function (newData, value, currentRowData) {
                                //    // This is called when related fields trigger update
                                //    newData.FXTotal =8 (currentRowData.Qty || 0) * (currentRowData.FXProductUnitPrice || 0);
                                //},
                                editorOptions: {
                                    rtlEnabled: true,
                                }
                            },
                            {
                                dataField: "CASNo",
                                caption: "شماره ثبت (CAS)",

                                //setCellValue: function (newData, value, currentRowData) {
                                //    // This is called when related fields trigger update
                                //    newData.FXTotal =8 (currentRowData.Qty || 0) * (currentRowData.FXProductUnitPrice || 0);
                                //},
                                editorOptions: {
                                    rtlEnabled: true,
                                }
                            },
                            {
                                dataField: "batchNo",
                                caption: "شماره بچ های موجود از این کالا را در این قسمت وارد نمایید. چنانچه چندین بچ وجود دارد مقادیر بچ را با کاما جدا نمایید",

                                //setCellValue: function (newData, value, currentRowData) {
                                //    // This is called when related fields trigger update
                                //    newData.FXTotal =8 (currentRowData.Qty || 0) * (currentRowData.FXProductUnitPrice || 0);
                                //},
                                editorOptions: {
                                    rtlEnabled: true,
                                },
                                validationRules: [
                                    {
                                        type: "required",
                                        message: "وارد کردن شماره بچ الزامی است."
                                    },
                                    {
                                        type: "custom",
                                        validationCallback: function (e) {
                                            if (!e.value) return true;
                                            return !e.value.includes('-') && !e.value.includes('_')
                                        },
                                        message: "کاراکترهای - و _ مجاز نیستند."
                                    }
                                ]
                            },
                        ],
                        onRowInserting: function (e) {
                            e.data.productId = e.data.pId.split("-")[1]
                            e.data.productSrc = e.data.pId.split("-")[0]
                        },
                        onRowUpdating: function (e) {
                            if (e.newData.hasOwnProperty("pId")) {
                                e.newData.productId = e.newData.pId.split("-")[1]
                                e.newData.productSrc = e.newData.pId.split("-")[0]

                            }
                        },
                        onEditingStart: function (e) {

                            e.data.tempFilePath = generateRandomFolderName()
                            if (e.data.ProformaId) {
                                let path = `/uploads/pi/pi-${e.data.ProformaId}/product-${e.data.proformaProductId}`;
                                getFilesList(path, function (files) {
                                    e.data.allFiles = files;  // هر چی خواستی ذخیره کن تو e.data
                                    // می‌تونی مثلا بگی: e.data.piFiles = files.filter(f => f.fileName.startsWith("PINumberFiles"));
                                }, function () {
                                    DevExpress.ui.notify("خطا در دریافت لیست فایل‌ها", "error");
                                });
                            }
                        },
                        onInitNewRow: function (e) {
                            e.data.tempFilePath = generateRandomFolderName()
                        },
                        function(e) {
                            cellInfo.setValue("proformaProductRows", true);
                        },
                        onContentReady: function (e) {

                            cellInfo.setValue("proformaProductRows", true);
                            e.element.find(".dx-header-row > td").css("font-size", "12px");
                        },
                    });

                }
            },
            {
                dataField: "Note",
                caption: "یادداشت",
                editorType: "dxTextArea",
                editorOptions: {
                    height: 60,  // adjust height as needed
                    maxLength: 3000,
                    placeholder: "چنانچه سفارش یادداشتی دارد لطفا یادداشت را وارد کنید"
                },
                visible: false  // If you want it hidden by default; remove or set to true to show,
            }
        ],
        editing: {
            mode: "popup",
            allowAdding: false,
            allowUpdating: true,
            useIcons: true,
            popup: {
                title: "➕📋 عملیات ثبت سفارش برای شرکت " + allData.companies.find(o => { return o.cId == currentCid })?.cName_FA, // will be set dynamically via onEditingStart
                showTitle: true,
                height: "96vh",
                width: "90vw",
                onShowing: function () {
                    popUpCss("proforma")
                }
            },
            form: {
                colCount: 42,
                items: formItemsInitial
            }
        },
        masterDetail: {
            enabled: true,
            template: function (container, options) {
                var proformaMasterData = getProformaItems(options.data.ProformaId)
                console.log(proformaMasterData)
                $("<div class=''>").appendTo(container);
                var $container = $("<div>").appendTo(container);
                $container.dxDataGrid({
                    dataSource: proformaMasterData.proformaItemData,  // مقدار صحیح داده‌ها را اینجا بگذار
                    keyExpr: "ProformaItemId",
                    rtlEnabled: true,
                    width: "85%",
                    noDataText: 'هنوز اطلاعات پارت (ها) برای این سفارش ثبت نشده است',
                    elementAttr: {
                        class: "proItem"
                    },
                    columns: [
                        {
                            width: "6%",
                            dataField: "ShipmentDateOrigin",
                            caption: "تاریخ حمل از گمرک مبدا",
                            dataType: "date",
                            width: "auto",


                        },
                        {
                            width: "6%",
                            dataField: "ArrivalDateIranForcast",
                            caption: "تاریخ رسیدن به گمرک ایران - پیش ‌بینی",
                            dataType: "date",
                            width: "auto",

                        },
                        {
                            dataField: "itemStatusId",
                            caption: "وضعیت پارت",
                            width: "auto",
                            lookup: {
                                dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "proformaPartStatus" }),
                                valueExpr: "value",
                                displayExpr: "name"
                            },

                            visible: true
                        },

                    ],
                    onRowPrepared: function (e) {
                        masterChildStyling(e, 'shipmentPart')
                    },
                    masterDetail: {
                        enabled: true,
                        template: function (container2, options2) {
                            //console.log(proformaMasterData)
                            var proformaItemOpenedId = options2.data.ProformaItemId
                            //console.log(proformaItemOpenedId)
                            var data = { proformaItemId: proformaItemOpenedId }
                            $.ajax({
                                url: "controller/services.asmx/GetMasterProformaItem",
                                type: "POST",
                                async: false,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                data: JSON.stringify({ data: data }),
                                success: function (response) {
                                    var innerDb = JSON.parse(response.d)
                                    console.log(innerDb)

                                    $("<div class=''>").appendTo(container2);
                                    var $container2 = $("<div>").appendTo(container2);
                                    $container2.dxDataGrid({
                                        dataSource: innerDb.ProformaItemProducts,
                                        rtlEnabled: true,
                                        width: "85%",
                                        elementAttr: {
                                            class: "productItem"
                                        },
                                        columns: [
                                            {

                                                dataField: "brandId",
                                                caption: "گروه کالا",
                                                width: "auto",
                                                lookup: {
                                                    dataSource: allData.brands,
                                                    valueExpr: "bId",
                                                    displayExpr: "bName_FA"

                                                },
                                            },
                                            {
                                                dataField: "ProductKey",
                                                caption: "کالا",
                                                width: "auto",
                                                lookup: {
                                                    dataSource: gridResult.proformaLookup.productTemp.map(o => {
                                                        return { value: "tmp-" + o.value, name: o.name, type: 'tmp' };
                                                    }).concat(allData.products.map(o => {
                                                        return { value: "fnce-" + o.value, name: o.name, type: 'fnce' };
                                                    })),
                                                    valueExpr: "value",
                                                    displayExpr: "name",

                                                },

                                            },
                                            {
                                                dataField: "Qty",
                                                caption: "مقدار",
                                                width: "auto",

                                            },
                                            {
                                                dataField: "FXProductUnitPrice",
                                                caption: "ارزش قلم کالا",
                                                width: "auto",

                                            },
                                            {
                                                dataField: "unitId",
                                                caption: "واحد",
                                                width: "auto",
                                                lookup: {
                                                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "unit" }),
                                                    valueExpr: "value",
                                                    displayExpr: "name"
                                                },

                                            },
                                            {
                                                dataField: "FXTypeId",
                                                caption: "یکای ارز",
                                                width: "auto",
                                                lookup: {
                                                    dataSource: gridResult.proformaLookup.baseData.filter(o => { return o.groupName == "currency" }).map(o => ({
                                                        name: o.name,
                                                        value: o.value
                                                    })),
                                                    valueExpr: "value",
                                                    displayExpr: "name"
                                                },

                                                //isRequired: true
                                            },
                                            {
                                                dataField:"totalPrice",
                                                caption: "جمع ارزی",
                                                width: "auto",

                                            },


                                        ],
                                        onRowPrepared: function (e) {
                                            masterChildStyling(e, 'shipmentPartProduct')
                                        },
                                    })
                                },
                                error: function (xhr, status, error) {
                                    toast("خطا در ذخیره داده‌ها: " + error, "error");
                                }
                            });


                            //$container2.dxDataGrid({mPr
                            //    dataSource: proformaMasterData.proformaIteoductData.filter(o => {
                            //        return o.proformaItemId == proformaItemOpenedId
                            //    }),  // مقدار صحیح داده‌ها را اینجا بگذار
                            //    rtlEnabled: true,
                            //    width: "100%",
                            //    noDataText: '',


                            //});
                        }
                    }
                });

            }
        },
        onToolbarPreparing: function (e) {
            var dataGrid = e.component;
            e.toolbarOptions.items.unshift({
                location: "after",
                widget: "dxButton",
                options: {
                    icon: "add",
                    hint: "افزودن رکورد",
                    onClick: function () {
                        if ($("#comboCo").dxTagBox('option', 'value').length == 1) {
                            dataGrid.addRow()
                        }
                        else {
                            toast('لطفا از قسمت فیلتر شرکت ها فقط یک شرکت را انتخاب نمایید تا بتوانید برای آن شرکت سفارش خرید ثبت نمایید', 'warning')
                        }

                    }
                }
            });
        },

        onRowUpdating: function (e) {
            e.cancel = true;
            var ProformaData;
            var proformaItemData = [];
            var proformaItemProductData = [];
            var proformaProductData = [];
            ProformaData = JSON.parse(JSON.stringify({ ...e.oldData, ...e.newData }));


            ProformaData.companyId = ProformaData.cid;
            if (ProformaData.proformaType == 2) {
                var gridProformaItem = $("#proformaItemGrid").dxDataGrid("instance");
                var gridProformaProduct = $("#proformaProductGrid").dxDataGrid("instance");
                gridProformaItem.saveEditData().done(function () {
                    gridProformaProduct.saveEditData().done(function () {

                        // بعد از ذخیره ویرایش‌های باز، چک کن popup ویرایش باز هست یا نه
                        var editingControllerItem = gridProformaItem.getController('editing');
                        var editingControllerProduct = gridProformaProduct.getController('editing');
                        proformaItemData = gridProformaItem.option('dataSource');
                        proformaProductData = gridProformaProduct.option('dataSource');
                        var isValid = true
                        if (editingControllerProduct.isEditing()) {
                            toast('لطفا اطلاعات مربوط به ردیف ها PI را به درستی وارد نمایید', 'warning');
                            blinkElement($(".shipmentPopupParts.productInfo"), times = 3, speed = 200)
                            isValid = false

                        }
                        if (proformaProductData.length == 0) {
                            toast('هر پروفورما حداقل باید یک ردیف داشته باشد.', 'warning');
                            blinkElement($(".shipmentPopupParts.productInfo"), times = 3, speed = 200)
                            isValid = false
                        }
                        if (editingControllerItem.isEditing()) {
                            toast('مقادیر پارت ها به درستی وارد نشده است. لطفا بررسی بفرمایید', 'warning');
                            blinkElement($(".shipmentPopupParts.partInfo"), times = 3, speed = 200)
                            isValid = false
                        }
                        if (!isValid) {
                            return
                        }
                        proformaItemData.forEach(function (item) {

                            item.partProductArr = []
                            var products = Object.keys(item).filter(k => k.startsWith('prdValue_'))
                            var btchlist = []
                            proformaProductData.forEach(function (bt) {
                                btchlist = btchlist.concat(bt.batchNo.split(","))
                            })
                            products.forEach(function (pp) {
                                var obj = {
                                    productId: pp.split("_")[2],
                                    productType: pp.split("_")[1],
                                    proformaItemId: item.ProformaItemId,
                                    qty: item[pp],
                                    partProductId: item["partProductId_" + pp.split("_")[1] + "_" + pp.split("_")[2]],
                                    batchNo: pp.split("_")[3] || ""
                                }
                                if (("," + (btchlist.join() || "") + ",").includes("," + (obj?.batchNo || "") + ","))
                                    item.partProductArr.push(obj)

                            })

                        })


                        sendAjax(ProformaData, proformaItemData, proformaProductData)
                    }).fail(function () {
                        toast('خطا در ذخیره جدول پارت‌ها', 'error');
                        return;
                    });

                }).fail(function () {
                    toast('خطا در ذخیره جدول پارت‌ها', 'error');
                    return;
                });
            }
            if (ProformaData.proformaType == 1) {
                sendAjax(ProformaData, [])
            }
            function sendAjax(proforma, proformaItems, proformaProductData) {

                $.ajax({
                    url: "controller/services.asmx/saveProformaData",
                    type: "POST",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ proformaData: proforma, proformaItemData: proformaItems, proformaProductData: proformaProductData }),
                    success: function (response) {
                        e.cancel = false;
                        $("#shipment").dxDataGrid("instance").cancelEditData();
                        toast("ویرایش با موفقیت انجام شد")
                        initProformaReport()
                    },
                    error: function (xhr, status, error) {
                        toast("خطا در ذخیره داده‌ها: " + error, "error");
                    }
                });
            }
        },
        onInitNewRow: function (e) {

            e.data.tempFilePath = generateRandomFolderName()
            $("#shipment").dxDataGrid('option', 'editing.popup.title', "➕📋 عملیات ثبت سفارش برای شرکت " + allData.companies.find(o => { return o.cId == currentCid })?.cName_FA)
        },
        onRowInserting: function (e) {

            e.cancel = true;
            var ProformaData;
            var proformaItemData = [];
            var proformaProductData = [];
            ProformaData = JSON.parse(JSON.stringify(e.data));
            ProformaData.companyId = currentCid;
            if (e.data.proformaType == 2) {
                var gridProformaItem = $("#proformaItemGrid").dxDataGrid("instance");
                var gridProformaProduct = $("#proformaProductGrid").dxDataGrid("instance");
                gridProformaItem.saveEditData().done(function () {
                    gridProformaProduct.saveEditData().done(function () {
                        // بعد از ذخیره ویرایش‌های باز، چک کن popup ویرایش باز هست یا نه
                        var editingControllerItem = gridProformaItem.getController('editing');
                        var editingControllerProduct = gridProformaProduct.getController('editing');
                        proformaItemData = gridProformaItem.option('dataSource');
                        proformaProductData = gridProformaProduct.option('dataSource');
                        var isValid = true
                        if (editingControllerProduct.isEditing()) {
                            toast('لطفا اطلاعات مربوط به ردیف ها PI را به درستی وارد نمایید', 'warning');
                            blinkElement($(".shipmentPopupParts.productInfo"), times = 3, speed = 200)
                            isValid = false

                        }
                        if (proformaProductData.length == 0) {
                            toast('هر پروفورما حداقل باید یک ردیف داشته باشد.', 'warning');
                            blinkElement($(".shipmentPopupParts.productInfo"), times = 3, speed = 200)
                            isValid = false
                        }
                        if (editingControllerItem.isEditing()) {
                            toast('مقادیر پارت ها به درستی وارد نشده است. لطفا بررسی بفرمایید', 'warning');
                            blinkElement($(".shipmentPopupParts.partInfo"), times = 3, speed = 200)
                            isValid = false
                        }
                        if (!isValid) {
                            return
                        }
                        proformaItemData.forEach(function (item) {

                            item.partProductArr = []
                            var products = Object.keys(item).filter(k => k.startsWith('prdValue_'))
                            var btchlist = []
                            proformaProductData.forEach(function (bt) {
                                btchlist = btchlist.concat(bt.batchNo.split(","))
                            })
                            products.forEach(function (pp) {
                                var obj = {
                                    productId: pp.split("_")[2],
                                    productType: pp.split("_")[1],
                                    proformaItemId: item.ProformaItemId,
                                    qty: item[pp],
                                    partProductId: item["partProductId_" + pp.split("_")[1] + "_" + pp.split("_")[2]],
                                    batchNo: pp.split("_")[3] || ""
                                }
                                if (("," + (btchlist.join() || "") + ",").includes("," + (obj?.batchNo || "") + ","))
                                    item.partProductArr.push(obj)

                            })

                        })

                        sendAjax(ProformaData, proformaItemData, proformaProductData)
                    }).fail(function () {
                        toast('خطا در ذخیره جدول پارت‌ها', 'error');
                        return;
                    });

                }).fail(function () {
                    toast('خطا در ذخیره جدول پارت‌ها', 'error');
                    return;
                });
            }
            if (e.data.proformaType == 1) {
                sendAjax(ProformaData, [])

            }


            function sendAjax(proforma, proformaItems, proformaProductData) {

                $.ajax({
                    url: "controller/services.asmx/saveProformaData",
                    type: "POST",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ proformaData: proforma, proformaItemData: proformaItems, proformaProductData: proformaProductData }),
                    success: function (response) {
                        e.cancel = false;
                        $("#shipment").dxDataGrid("instance").cancelEditData();
                        toast("عملیات با موفقیت انجام شد")
                        initProformaReport()
                    },
                    error: function (xhr, status, error) {
                        toast("خطا در ذخیره داده‌ها: " + error, "error");
                    }
                });
            }
        },
        onEditingStart: function (e) {

            $("#shipment").dxDataGrid('option', 'editing.popup.title', "✏️📋 ویرایش سفارش شماره " + (e.data.PINumber || "نامعلوم") + " شرکت " + allData.companies.find(o => { return o.cId == e.data.cid })?.cName_FA)
            popUpCss()
            e.data.tempFilePath = generateRandomFolderName()
            var proformaItemDb = []
            if (e.data.ProformaId) {
                let path = `/uploads/pi/pi-${e.data.ProformaId}/`;
                getFilesList(path, function (files) {
                    e.data.allFiles = files;  // هر چی خواستی ذخیره کن تو e.data
                    // می‌تونی مثلا بگی: e.data.piFiles = files.filter(f => f.fileName.startsWith("PINumberFiles"));
                }, function () {
                    DevExpress.ui.notify("خطا در دریافت لیست فایل‌ها", "error");
                });
            }
            $("#shipment").dxDataGrid('option', 'myData', { ProformaId: e.data.ProformaId })
            if (e.data.proformaType == 1) {
                $("#shipment").dxDataGrid('option', 'editing.form.items', formItemsWithoutProforma);
            }
            if (e.data.proformaType == 2) {
                $("#shipment").dxDataGrid('option', 'editing.form.items', formItemsWithProforma);
            }
        },
        onEditCanceled: function (e) {
            $("#shipment").dxDataGrid('option', 'editing.form.items', formItemsInitial);
        }

    }).dxDataGrid("instance");
}



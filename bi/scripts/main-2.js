function initStateProductTargetGrid(targetGridData) {
    try {
        $("#targetStateProduct").dxDataGrid('beginUpdate');
        $("#targetStateProduct").dxDataGrid('option', 'dataSource', targetGridData.targetBrandStateLevelData)
        $("#targetStateProduct").dxDataGrid('endUpdate');
        return
    }
    catch {
    }
    const columns = [
        {
            dataField: "bId",
            caption: "برند",
            width: "300px",
            lookup: {
                dataSource: allData.brands,
                valueExpr: "bId",
                displayExpr: "bName_FA"
            }
        }
    ];
    var columnsMaster = []
    provinces.forEach(function (item) {
        columnsMaster.push({
            dataField: "state-" + item.Id,
            caption: item.StateName,
            dataType: "number",
            allowSorting: false,  // Disable sorting
            allowFiltering: false, // Disable filtering
            cellTemplate: function (container, options) {
                const value = parseInt(options.data["state-" + parseInt(item.Id)]);
                if (value > 0) {
                    const html = `<div>\u200E${threeDigit(value)}</div>`;
                    container.css("font-size", "10px").addClass("px-0 text-center");
                    container.append(html);
                }
            },
            headerCellTemplate: function (headerElement, headerInfo) {
                // Create the header content (caption text) manually
                const headerText = headerInfo.column.caption
                    .replace(/ و /g, " ")  // Remove "و" (empty space)
                // Set styles for the header cell
                headerElement.css("font-size", "10px"); // Set font size
                headerElement.css("white-space", "normal"); // Allow text wrapping
                headerElement.css("word-wrap", "break-word"); // Ensure long text wraps
                headerElement.css("padding", "0px") // Ensure long text wraps
                headerElement.css("text-align", "center"); // Ensure long text wraps
                // Add the text to the header
                headerElement.html(headerText);
                $(headerElement).parent().css('padding', '0px')
                $(headerElement).parent().css('text-align', 'center')
                $(headerElement).parent().css('vertical-align', 'middle')
            },
        })
        columnsMaster.push({
            dataField: "stateDp-" + item.Id,
            caption: item.StateName + "%",
            dataType: "number",
            visible: false,
            editCellTemplate: function (cellElement, cellInfo) {
                const currentField = cellInfo.column.dataField;
                const currentDid = parseInt(currentField.split("-")[1]);
                const $input = $(`<input type="number" class="form-control"
                               step="0.1" 
                               min="0" 
                               max="100" 
                               class="dx-texteditor-input"
                               target-stateDp-input="${currentDid}" 
                               style="width: 100%; text-align: center;background-color: #f5f5f5;border: 2px solid orange;">`);
                $input.data("cellInfo", cellInfo);
                const $liveOutput = $(`<div class="live-calc" target-stateTotal="${currentField}">`)
                    .html('')
                    .css({
                        "font-size": "12px",
                        "text-align": "center"
                    });
                cellElement.append($input).append($liveOutput);
                cellElement.parent().parent().addClass("border rounded m-1 pe-2 pb-1")
            }
        })
    })
    var editColumns = [{
        type: "buttons",
        width: 100,
        buttons: [
            {
                template: function (cellElement, options) {
                    if (!(options.data.canEdit)) return "";
                    const btn = $("<button>")
                        .html(`ویرایش گروهی`)
                        .addClass("btn btn-sm stateHeadBg text-white")
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
    $("#targetStateProduct").dxDataGrid({
        dataSource: targetGridData.targetBrandStateLevelData,
        rtlEnabled: true,
        keyExpr: "keyExpr",
        height: "auto",
        columns: columns.concat(columnsMaster, editColumns),
        showBorders: true,
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
                colCount: 8,
                items: [
                    {
                        itemType: "group",
                        colSpan: 8,
                        template: function () {
                            return $("<div>")
                                .html(` 
                                    <div id="stateTotalContainer" class="globalItem popupTotalTarget"></div>
                                    <div style="margin-bottom:5px;">
                                        در این پنجره می‌توانید برای تمام محصولات این برند، به‌صورت گروهی وزن تارگت در هر استان را بر اساس درصد تعیین کنید.
                                    </div>
                                `)
                        }
                    },
                    ...provinces.map(m => ({
                        dataField: "stateDp-" + parseInt(m.Id),
                        label: {
                            location: "top",
                            alignment: "center",
                            showColon: false
                        },
                        colSpan: 1
                    })).concat([{ itemType: "empty", colSpan: 1 }]),
                    {
                        itemType: "group",
                        colSpan: 8,
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
                popUpCss('state')
            }
            popup.onShown = function () {
                var stateTotal = $("#targetBrandProduct").dxDataGrid('option', 'dataSource').find(o => { return o.bId == e.data.bId && o.cid == e.data.cid })
                var stateQty = stateTotal?.tQty || 0
                var stateAmount = stateTotal?.tAmount || 0
                var html = ""
                html += `<div>مجموع تارگت تعدادی ثبت شده: ${threeDigit(stateQty)} عدد</div>`
                html += `<div>مجموع تارگت ریالی ثبت شده: ${threeDigit(stateAmount)} ریال</div>`
                $("#stateTotalContainer").html(html)
                const $popupContent = $(".dx-popup-content");
                const $inputs = $popupContent.find("input[target-stateDp-input]");
                updatePlaceholders($inputs);
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
                        $input.parent().find("div[target-stateTotal]").html(html)
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
            provinces.forEach(p => {
                const field = "stateDp-" + parseInt(p.Id);
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
                showToast(`مجموع درصدهای استان باید ۱۰۰٪ باشد (فعلاً: ${sum.toFixed(1)}٪)`, "error", 5000);
            }
        },
        onRowUpdated: function (e) {
            const result = [];
            var data = e.data
            // Iterate over the keys of the object
            for (const key in data) {
                // Check if the key starts with 'dist-' and value is not null
                if (key.startsWith('stateDp-') && data[key] !== null) {
                    result.push({
                        bId: data.bId,         // Add pid
                        cid: data.cid, // Add targetId
                        percentage: data[key],// Add the value of dist-* as percentage
                        ProvienceID: parseInt(key.split("-")[1])
                    });
                }
            }
            loader('show');
            $.ajax({
                url: '../controller/services.asmx/usp_Save_TargetProvinceDistribution',
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
            masterChildStyling(e, 'state')
        },
        summary: {
            totalItems: [{
                column: `bId`,
                displayFormat: "جمع",
            }].concat(provinces.map(item => ({
                column: `state-${item.Id}`,
                summaryType: "sum",
                valueFormat: "#,##0.##", // optional: format for numbers
                displayFormat: "{0}",
                valueFormat: {
                    type: "fixedPoint",
                    precision: 0
                }
            })))
        },
        masterDetail: {
            enabled: true,
            template: function (container, options) {
                const stateProducts = options.data;
                // Get shared filter values (these may come from UI dropdowns, etc.)
                const currentFilters = getcomboValues()
                currentFilters.targetYear = targetGridData.curTargetYear;
                currentFilters.brandId = stateProducts.bId;
                currentFilters.companyId = stateProducts.cid;
                let stateProductData = [];
                $.ajax({
                    url: "controller/services.asmx/targetBrandStateProductLevelData",
                    method: "POST",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ data: currentFilters }),
                    success: function (response) {
                        stateProductData = JSON.parse(response.d).targetBrandStateProductLevelData;
                    },
                    error: function () {
                        DevExpress.ui.notify("خطا در بارگذاری اطلاعات سطح محصول", "error", 3000);
                    }
                });
                var columnsChild = []
                provinces.forEach(function (item) {
                    columnsChild.push({
                        dataField: "state-" + item.Id,
                        caption: item.StateName,
                        dataType: "number",
                        allowSorting: false,  // Disable sorting
                        allowFiltering: false, // Disable filtering
                        cellTemplate: function (container, options) {
                            const value = parseInt(options.data["state-" + parseInt(item.Id)]);
                            if (value > 0) {
                                const html = `<div>\u200E${threeDigit(value)}%</div>`;
                                container.append(html);
                            }
                        },
                        editCellTemplate: function (cellElement, cellInfo) {
                            const currentField = cellInfo.column.dataField;
                            const currentDid = parseInt(currentField.split("-")[1]); // استخراج did از dataField
                            // ایجاد input
                            const $input = $(`<input type="number" class="form-control px-0 text-center"
                               step="0.1" 
                               min="0" 
                               max="100" 
                               class=""
                               target-state-input="${currentDid}" 
                               style="width: 100%; text-align: center;background-color: #f5f5f5;border: 2px solid orange;font-size:10px;">`);
                            $input.val(cellInfo.value);
                            $input.data("cellInfo", cellInfo);
                            cellElement.append($input);
                        },
                        headerCellTemplate: function (headerElement, headerInfo) {
                            // Create the header content (caption text) manually
                            const headerText = headerInfo.column.caption
                                .replace(/ و /g, " ")  // Remove "و" (empty space)
                            // Set styles for the header cell
                            headerElement.css("font-size", "10px"); // Set font size
                            headerElement.css("white-space", "normal"); // Allow text wrapping
                            headerElement.css("word-wrap", "break-word"); // Ensure long text wraps
                            headerElement.css("padding", "0px") // Ensure long text wraps
                            headerElement.css("text-align", "center"); // Ensure long text wraps
                            // Add the text to the header
                            headerElement.html(headerText);
                            $(headerElement).parent().css('padding', '0px')
                            $(headerElement).parent().css('text-align', 'center')
                            $(headerElement).parent().css('vertical-align', 'middle')
                        },
                    })
                })
                $(`<div>`).appendTo(container).dxDataGrid({
                    dataSource: stateProductData,
                    rtlEnabled: true,
                    columns: [
                        {
                            dataField: "pid",
                            caption: "نام محصول",
                            allowEditing: false,
                            width: "320px",
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
                        allowUpdating: stateProducts.canEdit,
                        useIcons: true
                    },
                    onRowPrepared: function (e) {
                        masterChildStyling(e, 'product')
                    },
                    onEditingStart(e) {
                        setTimeout(function () {
                            const $editRow = $(e.element).find(".dx-edit-row");
                            const $inputs = $editRow.find("input[target-state-input]");
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
                        provinces.forEach(p => {
                            const field = "state-" + p.Id;
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
                            showToast(`مجموع درصدهای استان برای این محصول باید ۱۰۰٪ باشد (فعلاً: ${sum.toFixed(1)}٪)`, "error", 5000);
                        }
                    },
                    onRowUpdated: function (e) {
                        const result = [];
                        var data = e.data
                        // Iterate over the keys of the object
                        for (const key in data) {
                            // Check if the key starts with 'dist-' and value is not null
                            if (key.startsWith('state-') && data[key] !== null) {
                                result.push({
                                    pid: data.pid,         // Add pid
                                    TargetID: data.TargetID, // Add targetId
                                    percentage: data[key],// Add the value of dist-* as percentage
                                    ProvienceID: parseInt(key.split("-")[1])
                                });
                            }
                        }
                        loader('show');
                        $.ajax({
                            url: '../controller/services.asmx/usp_Save_TargetProvinceDistribution',
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
                    }
                }).parent().addClass("p-0 pe-1").addClass("stateHeadBg");
            }
        }
    });
}
function updatePlaceholders($inputs) {
    let sum = 0;
    let emptyCount = 0;
    $inputs.each(function () {
        const val = parseFloat($(this).val());
        if (!isNaN(val)) {
            sum += val;
        } else {
            emptyCount++;
        }
    });
    const remaining = 100 - sum;
    const eachPlaceholder = emptyCount > 0 ? (remaining / emptyCount).toFixed(1) + "%" : "0.0%";
    $inputs.each(function () {
        const $input = $(this);
        const val = parseFloat($input.val());
        if (isNaN(val)) {
            $input.attr("placeholder", eachPlaceholder);
        }
    });
    var borderColor = ""
    if (remaining === 0) {
        borderColor = "#00b048";
        showToast(`مجموع درصدها ${sum} می باشد`, "success", 1000);
    }
    if (remaining < 0) {
        borderColor = "red"
    }
    if (remaining > 0) {
        borderColor = "orange"
    }
    $inputs.css("border", `2px solid ${borderColor}`);
}
function masterChildStyling(e, type) {
    var dataRowBackground = ""
    var headerBackground = ""
    var headerText = ""
    var totalBackground = ""
    var totalText = "text-white"
    if (type == "brand") {
        dataRowBackground = "#E8F5E9"
        headerBackground = "bg-success"
        headerText = "text-white"
        totalBackground = "bg-success"
    }
    if (type == "dist") {
        dataRowBackground = "#E3F2FD"
        headerBackground = "bg-primary"
        headerText = "text-white"
        totalBackground = "bg-primary"
    }
    if (type == "product") {
        dataRowBackground = "#FFF3E0"
        headerBackground = "prdHeadBg"
        headerText = "text-white"
        totalBackground = "prdHeadBg"
    }
    if (type == "month") {
        dataRowBackground = "#EFEBE9";         // Beige
        headerBackground = "monthHeaderBg";    // Custom: brown/tan class
        headerText = "text-white";
        totalBackground = "monthHeaderBg";
    }
    if (type == "state") {
        dataRowBackground = "#f8f0fe"
        headerBackground = "stateHeadBg"
        headerText = "text-white"
        totalBackground = "stateHeadBg"
    }
    if (type == "shipment") {
        dataRowBackground = "#656eff2b"
        headerBackground = "bg-proforma"
        headerText = "text-white"
        totalBackground = "ShipmentHeadBg"
    }
    if (type == "shipmentPart") {
        dataRowBackground = "#00bbff2e"
        headerBackground = "bg-proformaPart"
        headerText = "text-white"
        totalBackground = "ShipmentHeadBg"
    }
    if (type == "shipmentPartProduct") {
        dataRowBackground = "#009b5530"
        headerBackground = "bg-proformaProduct"
        headerText = "text-white"
        totalBackground = "ShipmentHeadBg"
    }
    if (type == "debit") {
        dataRowBackground = ""
        headerBackground = "debitGridHeadBg"
        headerText = "text-white"
        totalBackground = "debitGridHeadBg"
    }
    if (e.rowType === "data" && type != "debit") {
        e.rowElement.css("background-color", dataRowBackground);
    }
    if (e.rowType === "header") {
        e.rowElement.addClass(headerBackground).addClass(headerText);
    }
    if (e.rowType === "totalFooter") {
        e.rowElement.addClass(totalBackground)
        $(e.rowElement).find(".dx-datagrid-summary-item").addClass(totalText).css("font-weight", "normal")
    }
}
function initProformaReport() {

    //var selectedCompanies = $("#comboCo").dxTagBox('option', 'value')
    //if (selectedCompanies.length != 1) {
    //    showToast("لطفا فقط یک شرکت انتخاب نمایید", "warning")
    //    $("#shipment").hide()
    //    return
    //}
    $("#shipment").show()
    var dataAjax = getcomboValues();
    var result = {}
    var data = { baseFields: 'bankName,insurerName,unit,proformaProductType,currency,incoterm,proformaType,currencySrc,proformaPartStatus,customOrigin,customDestination,proformaStatus' }
    var proformaLookup = getProformaFieldDb(data)
    result.proformaLookup = proformaLookup
    loader('show')
    $.ajax({
        url: "controller/services.asmx/getProforma",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: dataAjax }),
        success: function (response) {
            result.proformaData = JSON.parse(response.d)
            loader('hide')
            initProformaGrid(result)
        },
        error: function (xhr, status, error) {
            console.error("❌ AJAX Error: " + error);
        }
    });
}
function getProformaFieldDb(data) {
    var baseData;
    $.ajax({
        url: "controller/services.asmx/getProformaFieldDb",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        data: JSON.stringify({ data: data }), // parameter name must match your webmethod's param
        success: function (response) {
            baseData = JSON.parse(response.d);
            loader('hide');
        },
        error: function (xhr, status, error) {
            console.error("❌ AJAX Error: " + error);
        }
    });
    return baseData;
}
function createFormItems(fields) {
    return fields.map(field => {
        if (field.startsWith("empty")) {
            const parts = field.split("-");
            return {
                itemType: "empty",
                colSpan: parts.length > 1 ? parseInt(parts[1], 10) : 1
            };
        }
        else if (field.startsWith("partProductDesc")) {
            const parts = field.split("-");
            return {
                dataField: "partProductDesc",
                itemType: "simple",
                colSpan: parts.length > 1 ? parseInt(parts[1], 10) : 1,
                template: function () {
                    return $("<div>").addClass("form-divider").html(`<div class="text-white"><div class="bg-proformaProduct rounded p-1"><span>💊</span> <span style="font-size: 13px;">در این قسمت مقدار محصولاتی که در این پارت قرار دارند را وارد کنید. (چنانچه محصولی در این پارت وجود ندارد مقدار آن را خالی بگذارید.)</span></div></div>`);
                },
                label: {                    
                    visible:false
                }
            };
        }
        const parts = field.split("-");
        return {
            dataField: parts[0],
            colSpan: parts.length > 1 ? parseInt(parts[1], 10) : 1,
            label: {
                location: "top",
                alignment: "right",
                showColon: false
            }
        };
    });
}
function generateRandomFolderName(length = 16) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let folderName = '';
    for (let i = 0; i < length; i++) {
        folderName += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return folderName;
}

function getProformaProducts(proformaId) {
    var data = { proformaId: proformaId }
    var ProformaProducts = []
    $.ajax({
        url: "controller/services.asmx/GetProformaProducts",
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            ProformaProducts = JSON.parse(response.d)
        },
        error: function (xhr, status, error) {
            toast("خطا در ذخیره داده‌ها: " + error, "error");
        }
    });
    return ProformaProducts;

}
function getProformaItems(proformaId) {
    var data = { proformaId: proformaId }
    var proformaItems = []
    $.ajax({
        url: "controller/services.asmx/GetProformaItems",
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            proformaItems = JSON.parse(response.d)
        },
        error: function (xhr, status, error) {
            toast("خطا در ذخیره داده‌ها: " + error, "error");
        }
    });
    return proformaItems;

}
function deleteFile(relPath, $element) {

    $.ajax({
        url: 'controller/services.asmx/DeleteFileByPath',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({ relPath: relPath }),
        success: function (res) {
            var result = JSON.parse(res.d);
            if (result.success) {
                $element.remove();
                toast('فایل حذف شد', 'success');
            } else {
                toast(result.error, 'error');
            }
        },
        error: function () {
            toast('خطا در حذف فایل', 'error');
        }
    });
}

function getFilesList(relPath, onSuccess, onError) {
    $.ajax({
        url: "controller/services.asmx/GetFilesList",
        method: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        data: JSON.stringify({ relPath: relPath }),
        success: function (response) {
            checkAccess(response);
            var files = JSON.parse(response.d);
            if (onSuccess) onSuccess(files);
        },
        error: function (xhr) {
            if (onError) onError(xhr);
        }
    });
}
function renderFileUploaderWithPreview(cellElement, cellInfo, fileType, group) {

    let htmlImg = "";
    if (cellInfo.data.allFiles) {
        cellInfo.data.allFiles
            .filter(o => o.fileName.startsWith(fileType + "-"))
            .forEach(function (item) {
                const ext = item.fileName.split('.').pop().toLowerCase();
                const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext);
                const imgSrc = isImage
                    ? (item.path + item.fileName)
                    : `/image/thumbnails/${ext}.png`;

                htmlImg += `
                    <div class="pi-file-item" style="position: relative; display: inline-block;">
                        <img src="${imgSrc}" style="object-fit: cover; border-radius: 5px; width: 35px; height: 35px; margin-top: 5px;">
                        <div data-path="${item.path + item.fileName}" class="pi-file-delete" 
                             style="position: absolute; top: -5px; left: -5px; cursor: pointer; padding: 3px;">
                            <i class="dx-icon dx-icon-close" 
                               style="padding:3px; font-size:8px; color:white; background:red; border-radius:10px;"></i>
                        </div>
                    </div>`;
            });
    }

    const html = `
        <div class="piFilesContainer" style="display:flex">
            <div class="piFilesUploader" ></div>
            <div class="piFilesPreview" style="display:flex; gap:5px; overflow:auto;">${htmlImg}</div>
        </div>`;

    cellElement.html(html);

    cellElement.find('.pi-file-delete').on('click', function () {
        const $btn = $(this);
        const $parent = $btn.closest('.pi-file-item');
        const filePath = $btn.data('path');
        DevExpress.ui.dialog.confirm("<div class='text-danger'>آیا مطمئن هستید که می‌خواهید این فایل حذف شود؟ پس از حذف امکان بازیابی وجود ندارد</div>", "").done(function (dialogResult) {
            if (dialogResult) {
                deleteFile(filePath, $parent);
            }
        });
    });
    cellElement.find(".pi-file-item img").on("click", function () {
        const filePath = $(this).siblings('.pi-file-delete').data('path');
        const ext = filePath.split('.').pop().toLowerCase();
        const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext);
        const isPdf = ext === "pdf";

        if (isImage || isPdf) {
            window.open(filePath, '_blank');
        } else {
            const a = document.createElement('a');
            a.href = filePath;
            a.download = filePath.split('/').pop();
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });

    cellElement.find(".piFilesUploader").dxFileUploader({
        selectButtonText: "",
        name: "file",
        labelText: "",
        multiple: true,
        rtlEnabled: true,
        showFileList: false,
        uploadMode: "instantly",
        uploadUrl: `controller/uploadHandler.ashx?tempFilePath=${cellInfo.data.tempFilePath}&fileType=${fileType}`,
        onUploaded: function (e) {

            const res = JSON.parse(e.request.response);
            const fileName = res.fileName;
            const ext = fileName.split('.').pop().toLowerCase();
            const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext);
            const imgSrc = isImage
                ? `/uploads/temp/${cellInfo.data.tempFilePath}/${fileName}`
                : `/image/thumbnails/${ext}.png`;

            const $item = $(`
                <div class="pi-file-item" style="position: relative; display: inline-block;">
                    <img src="${imgSrc}" style="object-fit: cover; border-radius: 5px; width: 35px; height: 35px; margin-top: 5px;">
                    <div data-path="/uploads/temp/${cellInfo.data.tempFilePath}/${fileName}" class="pi-file-delete" 
                         style="position: absolute; top: -5px; left: -5px; cursor: pointer; padding: 3px;">
                        <i class="dx-icon dx-icon-close" 
                           style="padding:3px; font-size:8px; color:white; background:red; border-radius:10px;"></i>
                    </div>
                </div>`);

            $item.find('.pi-file-delete').on('click', function () {
                const $btn = $(this);
                const $parent = $btn.closest('.pi-file-item');
                const filePath = $btn.data('path');
                DevExpress.ui.dialog.confirm("<div class='text-danger'>آیا مطمئن هستید که می‌خواهید این فایل حذف شود؟ پس از حذف امکان بازیابی وجود ندارد</div>", "").done(function (dialogResult) {
                    if (dialogResult) {
                        deleteFile(filePath, $parent);
                    }
                });
            });


            cellElement.find('.piFilesPreview').append($item);
        },
        onUploadError: function () {
            DevExpress.ui.notify("خطا در ارسال فایل", "error");
        },
        onContentReady: function (e) {
            //e.element.find('.dx-fileuploader-wrapper').addClass("p-0");
            e.element.find('.dx-button-content').html(`<i class="dx-icon dx-icon-add"></i>`);
            //e.element.find('.dx-button-has-text .dx-button-content').css('padding', '9px');
            //e.element.find('.dx-fileuploader-input-wrapper').css('border', 'none');
        }
    });
}

function blinkElement(selector, times = 3, speed = 200) {
    let i = 0;
    function blink() {
        if (i >= times) return;
        $(selector).fadeOut(speed).fadeIn(speed, function () {
            i++;
            blink();
        });
    }
    blink();
}
function updateCalculatedColumns(grid, rowIndex) {
    const aDate = grid.cellValue(rowIndex, "aDate");
    const carDate = grid.cellValue(rowIndex, "carDate");
    const cfrDate = grid.cellValue(rowIndex, "cfrDate");
    // فقط گرفتن روز از ماه
    const aDay = aDate ? new Date(aDate).getDate() : null;
    const carDay = carDate ? new Date(carDate).getDate() : null;
    const cfrDay = cfrDate ? new Date(cfrDate).getDate() : null;
    if (aDay !== null && carDay !== null) {
        grid.cellValue(rowIndex, "rdDays", carDay - aDay);
    }
    if (cfrDay !== null && carDay !== null) {
        grid.cellValue(rowIndex, "rdfrDate", cfrDay - carDay);
    }
}
function getDistSaleData() {
    var data = getcomboValues();
    $.ajax({
        url: '../controller/services.asmx/GetDistSaleSummary',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            checkAccess(response)
            response = JSON.parse(response.d)
            genDistSaleHtml(response)
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function showCompareReportPopup(data) {
    let reportType = "monthly";
    let compareReportGrid;

    $("#compareReportPopup").remove();
    $("body").append('<div id="compareReportPopup"></div>');

    $("#compareReportPopup").dxPopup({
        title: "گزارش مقایسه‌ای فروش",
        dragEnabled: true,
        visible: true,
        width: $(window).width() > 768 ? "60vw" : "85vw",
        height: "70vh",
        maxHeight: "90vh",
        resizeEnabled: true,
        showCloseButton: true,
        rtlEnabled: true,
        closeOnOutsideClick: true,
        contentTemplate: function (contentElement) {
            contentElement.append(`
                <div id="reportForm"></div>
                <div class="mt-3" id="reportGrid"></div>
            `);

            // تعریف فرم
            $("#reportForm").dxForm({
                colCount: 2,
                labelLocation: "top",
                formData: {}, // برای گرفتن دیتا بعداً
                items: [
                    {
                        dataField: "type",
                        label: { text: "نوع مقایسه" },
                        editorType: "dxSelectBox",
                        editorOptions: {
                            dataSource: [
                                { id: "monthly", name: "ماهانه" },
                                { id: "daily", name: "روزانه" }
                            ],
                            displayExpr: "name",
                            valueExpr: "id",
                           
                            onValueChanged: function (e) {
                                reportType = e.value;
                                updateDynamicInputs(reportType);
                            }
                        }
                    },
                    {
                        itemType: "button",
                        buttonOptions: {
                            text: "اجرای گزارش",
                            type: "success",
                            icon: "search",
                            onClick: function () {
                                runReport(reportType);
                            }
                        }
                    },
                    {
                        itemType: "group",
                        name: "dynamicInputs",
                        colSpan: 2,
                        items: []
                    }
                ]
            });

            updateDynamicInputs(reportType);

            // گرید نتایج
            
            // تابع اجرا
            function runReport(type) {
                $("#reportGrid").dxDataGrid({
                    height: 300,
                    showBorders: true,
                    columnsAutoWidth: true,
                    rtlEnabled: true,
                    noDataText: "داده‌ای برای نمایش وجود ندارد",
                    dataSource: [],
                    columns: []
                });

                compareReportGrid = $("#reportGrid").dxDataGrid("instance");

                const form = $("#reportForm").dxForm("instance");
                const formData = form.option("formData");

                let requestData = {};

                if (type === "monthly") {
                    if (!formData.selectedMonths || formData.selectedMonths.length === 0) {
                        DevExpress.ui.notify("حداقل یک ماه را انتخاب کنید", "warning", 2000);
                        return;
                    }

                    requestData = {
                        type: "monthly",
                        months: formData.selectedMonths,
                        fromDay: formData.dayRange?.start ?? 1,
                        toDay: formData.dayRange?.end ?? 31
                    };
                } else {
                    if (!formData.startDate || !formData.endDate) {
                        DevExpress.ui.notify("تاریخ شروع و پایان الزامی است", "warning", 2000);
                        return;
                    }

                    requestData = {
                        type: "daily",
                        startDate: formData.startDate,
                        endDate: formData.endDate
                    };
                }

                // Call API
                $.ajax({
                    url: "/api/compareReport",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(requestData),
                    success: function (res) {
                        compareReportGrid.option({
                            dataSource: res.data,
                            columns: res.columns
                        });
                    },
                    error: function () {
                        DevExpress.ui.notify("خطا در اجرای گزارش", "error", 2000);
                    }
                });
            }
        }
    });
}
function generateYearMonthList(baseMonths, startYear = 1402) {
    const result = [];
    const now = new Date();
    const thisYear = now.getFullYear() - 621;
    const thisMonth = (now.getMonth() + 1).toString().padStart(2, '0');

    for (let year = startYear; year <= thisYear; year++) {
        for (const m of baseMonths) {
            const id = `${year}${m.value}`;
            if (year < thisYear || m.value <= thisMonth) {
                result.push({
                    id: id,
                    text: `${id}`
                });
            }
        }
    }

    return result;
}

function updateDynamicInputs(type) {
    const form = $("#reportForm").dxForm("instance");

    // پاکسازی مقادیر قبلی + ست مقدار پیش‌فرض برای جلوگیری از خطا
    const newFormData = {
        type,
        dayFrom: 1,
        dayTo: 31
    };
    form.option("formData", newFormData);

    let newItems = [];

    if (type === "monthly") {
        const monthList = generateYearMonthList(allData.months);

        newItems = [
            {
                dataField: "selectedMonths",
                label: { text: "انتخاب ماه‌ها" },
                editorType: "dxTagBox",
                editorOptions: {
                    placeholder: "مثلاً 140301، 140302",
                    dataSource: monthList,
                    displayExpr: "text",
                    valueExpr: "id",
                    showSelectionControls: true,
                    applyValueMode: "useButtons"
                }
            },
            {
                itemType: "group",
                colCount: 2,
                items: [
                    {
                        dataField: "dayFrom",
                        label: { text: "از روز" },
                        editorType: "dxNumberBox",
                        editorOptions: {
                            min: 1,
                            max: 31,
                            showSpinButtons: true,
                            value: 1,
                            onValueChanged(e) {
                                const data = form.option("formData");
                                data.dayFrom = e.value;
                                form.option("formData", data);
                            }
                        }
                    },
                    {
                        dataField: "dayTo",
                        label: { text: "تا روز" },
                        editorType: "dxNumberBox",
                        editorOptions: {
                            min: 1,
                            max: 31,
                            showSpinButtons: true,
                            value: 31,
                            onValueChanged(e) {
                                const data = form.option("formData");
                                data.dayTo = e.value;
                                form.option("formData", data);
                            }
                        }
                    }
                ]
            }
        ];
    } else if (type === "daily") {
        newItems = [
            {
                dataField: "startDate",
                label: { text: "تاریخ شروع" },
                template: function (data, itemElement) {
                    const inputId = "startDateInput_" + Date.now();
                    const input = $("<input>", {
                        id: inputId,
                        class: "form-control",
                        type: "text"
                    }).appendTo(itemElement);

                    setTimeout(() => {
                        kamaDatepicker(inputId, {
                            nextButtonIcon: "fa fa-arrow-circle-right",
                            previousButtonIcon: "fa fa-arrow-circle-left",
                            forceFarsiDigits: true,
                            markHolidays: true,
                            highlightSelectedDay: true,
                            twodigit: true,
                            sync: true,
                            closeAfterSelect: true,
                            buttonsColor: "blue"
                        });

                        // ذخیره مقدار تاریخ انتخاب شده
                        $("#" + inputId).on("change", function () {
                            const data = form.option("formData");
                            data.startDate = this.value;
                            form.option("formData", data);
                        });
                    }, 100);
                }
            },
            {
                dataField: "endDate",
                label: { text: "تاریخ پایان" },
                template: function (data, itemElement) {
                    const inputId = "endDateInput_" + Date.now();
                    const input = $("<input>", {
                        id: inputId,
                        class: "form-control",
                        type: "text"
                    }).appendTo(itemElement);

                    setTimeout(() => {
                        kamaDatepicker(inputId, {
                            nextButtonIcon: "fa fa-arrow-circle-right",
                            previousButtonIcon: "fa fa-arrow-circle-left",
                            forceFarsiDigits: true,
                            markHolidays: true,
                            highlightSelectedDay: true,
                            twodigit: true,
                            sync: true,
                            closeAfterSelect: true,
                            buttonsColor: "blue"
                        });

                        $("#" + inputId).on("change", function () {
                            const data = form.option("formData");
                            data.endDate = this.value;
                            form.option("formData", data);
                        });
                    }, 100);
                }
            }
        ];
    }

    form.itemOption("dynamicInputs", "items", newItems);
    form.repaint();
}





function genDistSaleHtml(data) {
    data.distSalesSummary.forEach(function (sale) {
        var ss = data.distStockSummary.find(function (stock) {
            return stock.distributorId == sale.distributorId
        })
        sale.amountOfStock = ss?.amountOfStock
        sale.countOfStock = ss?.countOfStock
        var ta = data.distTargetSummary.find(function (target) {
            return target.distributorId == sale.distributorId
        })
        sale.totalTarget = ta?.TotalDistributorTarget
        sale.totalTargetAmount = ta?.TotalDistributorTargetPrice
    })
    data.distStockSummary.forEach(function (stock) {
        var ss = data.distSalesSummary.find(function (sale) {
            return stock.distributorId == sale.distributorId
        })
        var ta = data.distTargetSummary.find(function (target) {
            return target.distributorId == stock.distributorId
        })
        if (!ss) {
            data.distSalesSummary.push({
                TotalGoodsPrice: 0,
                TotalSaleAmount: 0,
                distributorName: stock.distributorName,
                countOfStock: stock.countOfStock,
                amountOfStock: stock.amountOfStock,
                distributorId: stock.distributorId,
                totalTarget: ta?.TotalDistributorTarget,
                totalTargetAmount: ta?.TotalDistributorTargetPrice
            })
        }
    })
    data.distTargetSummary.forEach(function (target) {
        var hasSale = data.distSalesSummary.some(function (sale) {
            return sale.distributorId == target.distributorId;
        });

        var hasStock = data.distStockSummary.some(function (stock) {
            return stock.distributorId == target.distributorId;
        });

        if (!hasSale && !hasStock) {
            data.distSalesSummary.push({
                TotalGoodsPrice: 0,
                TotalSaleAmount: 0,
                distributorName: target.distributorName, // ensure this exists
                countOfStock: 0,
                amountOfStock: 0,
                distributorId: target.distributorId,
                totalTarget: target.TotalDistributorTarget,
                totalTargetAmount: target.TotalDistributorTargetPrice
            });
        }
    });
    data.distSalesSummary = data.distSalesSummary.filter(o => {
        return ((o.TotalSaleAmount+o.countOfStock+o.totalTarget)!=0)
    })

    $("#tbl-dist-br-pr").dxDataGrid({
        dataSource: data.distSalesSummary,
        rtlEnabled: true,
        columns: [
            {
                dataField: "distributorName",
                caption: "🚚 پخش",
                width: "28%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    var displayClassTxt = options.data.distributorName
                    if (!displayClassTxt) {
                        displayClass = "text-danger"
                        displayClassTxt = "نامعلوم"
                    }
                    container.html(`<span class="${displayClass}">\u200E${displayClassTxt}</span>`);
                }
            },
            {
                dataField: "TotalSaleAmount",
                caption: "فروش تعدادی",
                width: "12%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.data.TotalSaleAmount?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "TotalGoodsPrice",
                caption: "فروش ریالی",
                width: "12%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalGoodsPrice < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.data.TotalGoodsPrice?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "countOfStock",
                caption: "موجودی تعدادی",
                width: "12%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.countOfStock < 0) {
                        displayClass = "text-danger"
                    }
                    const count = options.data.countOfStock != null ? parseFloat(options.data.countOfStock) : 0;
                    const formattedValue = threeDigit(count.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "amountOfStock",
                caption: "موجودی ریالی",
                width: "12%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.amountOfStock < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.data.amountOfStock?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "totalTarget",
                caption: "تارگت تعدادی",
                width: "12%",
                cellTemplate: function (container, options) {
                    const totalTarget = options.data.totalTarget ?? 0;
                    const totalSale = options.data.TotalSaleAmount ?? 0;

                    const ratio = totalTarget > 0 ? totalSale / totalTarget : 0;
                    const clampedRatio = Math.min(ratio, 1);

                    const percentText = (ratio * 100).toFixed(0) + '%';
                    const formattedValue = threeDigit(totalTarget.toFixed(0));

                    // Remove the yellow-like background by setting transparent
                    let bgColor = 'transparent';

                    const fillWidth = clampedRatio * 100;

                    const progressBar = `
                      <div style="position: relative; width: 100%; height: 100%; background-color: ${bgColor}; border-radius: 4px;">
                        <div style="
                          position: absolute;
                          top: 0; left: 0; bottom: 0;
                          width: ${fillWidth}%;
                          background-color: rgba(100, 149, 237, 0.3);
                          border-radius: 4px 0 0 4px;">
                        </div>
                        <div class="dashboardCellTaget">
                            <div>\u200E${formattedValue}</div>
                            <div class="dashboardCellTagetPercentage">(${percentText})</div>
                        </div>
                      </div>
                    `;

                    container.html(progressBar);
                }
            },
            {
                dataField: "totalTargetAmount",
                caption: "تارگت ریالی(p2)",
                width: "12%",
                cellTemplate: function (container, options) {
                    const totalTarget = options.data.totalTargetAmount ?? 0;
                    const totalSale = options.data.TotalGoodsPrice ?? 0;

                    const ratio = totalTarget > 0 ? totalSale / totalTarget : 0;
                    const clampedRatio = Math.min(ratio, 1);

                    const percentText = (ratio * 100).toFixed(0) + '%';
                    const formattedValue = threeDigit(totalTarget.toFixed(0));

                    // Remove the yellow-like background by setting transparent
                    let bgColor = 'transparent';

                    const fillWidth = clampedRatio * 100;

                    const progressBar = `
                      <div style="position: relative; width: 100%; height: 100%; background-color: ${bgColor}; border-radius: 4px;">
                        <div style="
                          position: absolute;
                          top: 0; left: 0; bottom: 0;
                          width: ${fillWidth}%;
                          background-color: rgba(100, 149, 237, 0.3);
                          border-radius: 4px 0 0 4px;">
                        </div>
                        <div class="dashboardCellTaget">
                            <div>\u200E${formattedValue}</div>
                            <div class="dashboardCellTagetPercentage">(${percentText})</div>
                        </div>
                      </div>
                    `;
                    container.html(progressBar);
                }
            },
            //{
            //    caption: "",
            //    width: 100,
            //    cellTemplate: function (container, options) {
                   

            //        $("<button>")
            //            .addClass("btn btn-sm btn-primary")
            //            .text("گزارش مقایسه ای")
            //            .css({
            //                "font-size": "10px",
            //                "padding": "0px 3px",
            //                "border-radius": "4px"
            //            })
            //            .on("click", function (e) {
            //                const rowData = options.data.distributorId; // ← این دیتا مربوط به همون سطره
            //                console.log("Row Data:", rowData);
            //                console.log("Data:", data.distSalesSummary);
                        
                           
            //                showCompareReportPopup();
            //            })
            //            .appendTo(container);
            //    }
            //}
        ],
        summary: {
            totalItems: [
                {
                    column: "brandName_EN",
                    displayFormat: "جمع",
                },
                {
                    column: "TotalSaleAmount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "TotalGoodsPrice",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "countOfStock",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "amountOfStock",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "totalTarget",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "totalTargetAmount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },

            ]
        },
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        export: {
            enabled: false,
            fileName: "گزارش فروش موجودی به تفکیک پخش",
            excelFilterEnabled: true
        },
        scrolling: {
            mode: "virtual" // Enables internal scrolling inside the DataGrid
        },
        onRowPrepared: function (e) {
            masterChildStyling(e, 'dist')
        },
        masterDetail: {
            enabled: true,
            template: function (container, options) {
                if (!options.key.distributorId) return;
                var data = getcomboValues();
                data.distId = options.key.distributorId
                $.ajax({
                    url: '../controller/services.asmx/GetBrandSalesSummary',
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ data: data }),
                    success: function (response) {
                        checkAccess(response)
                        response = JSON.parse(response.d)
                        response.brandSalesSummary.forEach(function (sale) {
                            var ss = response.brandStockSummary.find(function (stock) {
                                return stock.brandID == sale.brandID
                            })
                            sale.amountOfStock = ss?.amountOfStock
                            sale.countOfStock = ss?.countOfStock
                            var ta = response.brandTargetSummary.find(function (target) {
                                return target.brandID == sale.brandID
                            })
                            sale.totalTarget = ta?.TotalBrandTarget
                            sale.totalTargetAmount = ta?.TotalBrandTargetPrice
                        })
                        response.brandStockSummary.forEach(function (stock) {
                            var ss = response.brandSalesSummary.find(function (sale) {
                                return stock.brandID == sale.brandID
                            })
                            var ta = response.brandTargetSummary.find(function (target) {
                                return target.brandID == stock.brandID
                            })
                            if (!ss) {
                                response.brandSalesSummary.push({
                                    TotalGoodsPrice: 0,
                                    TotalSaleAmount: 0,
                                    brandName_EN: stock.brandName_EN,
                                    countOfStock: stock.countOfStock,
                                    amountOfStock: stock.amountOfStock,
                                    brandID: stock.brandID,
                                    totalTarget: ta?.TotalBrandTarget,
                                    totalTargetAmount: ta?.TotalBrandTargetPrice
                                })
                            }
                        })
                        response.brandTargetSummary.forEach(function (target) {
                            var hasSale = response.brandSalesSummary.some(function (sale) {
                                return sale.brandID == target.brandID;
                            });

                            var hasStock = response.brandStockSummary.some(function (stock) {
                                return stock.brandID == target.brandID;
                            });

                            if (!hasSale && !hasStock) {
                                response.brandSalesSummary.push({
                                    TotalGoodsPrice: 0,
                                    TotalSaleAmount: 0,
                                    brandName_EN: target.brandName_EN, // ensure this exists in the target object
                                    countOfStock: 0,
                                    amountOfStock: 0,
                                    brandID: target.brandID,
                                    totalTarget: target.TotalBrandTarget,
                                    totalTargetAmount: target.TotalBrandTargetPrice
                                });
                            }
                        });
                        response.brandSalesSummary = response.brandSalesSummary.filter(o => {
                            return ((o.TotalSaleAmount||0) + (o.countOfStock||0) + (o.totalTarget||0) != 0)
                        })
                        $(`<div id="dist-br-pr-${options.key.distributorId}">`)
                            .addClass("detail-container")
                            .appendTo(container)
                            .dxDataGrid({
                                dataSource: response.brandSalesSummary, // Assuming 'details' is an array in your data
                                showBorders: true,
                                columnAutoWidth: true,
                                rtlEnabled: true,
                                paging: { enabled: false },
                                columns: [
                                    {
                                        dataField: "brandName_EN",
                                        caption: "برند",
                                        width: "28%",
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            var displayClassTxt = options.data.brandName_EN
                                            if (!displayClassTxt) {
                                                displayClass = "text-danger"
                                                displayClassTxt = "نامعلوم"
                                            }
                                            container.html(`<span class="${displayClass}">\u200E${displayClassTxt}</span>`);
                                        }
                                    },
                                    {
                                        dataField: "TotalSaleAmount",
                                        caption: "فروش تعدادی",
                                        width: "12%",
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            if (options.data.TotalSaleAmount < 0) {
                                                displayClass = "text-danger"
                                            }
                                            const formattedValue = threeDigit(options.data.TotalSaleAmount?.toFixed(0));
                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                        }
                                    },
                                    {
                                        dataField: "TotalGoodsPrice",
                                        caption: "فروش ریالی",
                                        width: "12%",
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            if (options.data.TotalGoodsPrice < 0) {
                                                displayClass = "text-danger"
                                            }
                                            const formattedValue = threeDigit(options.data.TotalGoodsPrice?.toFixed(0));
                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                        }
                                    },
                                    {
                                        dataField: "countOfStock",
                                        caption: "موجودی تعدادی",
                                        width: "12%",
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            if (options.data.countOfStock < 0) {
                                                displayClass = "text-danger"
                                            }
                                            const formattedValue = threeDigit(options.data.countOfStock?.toFixed(0));
                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                        }
                                    },
                                    {
                                        dataField: "amountOfStock",
                                        caption: "موجودی ریالی",
                                        width: "12%",
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            if (options.data.amountOfStock < 0) {
                                                displayClass = "text-danger"
                                            }
                                            const formattedValue = threeDigit(options.data.amountOfStock?.toFixed(0));
                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                        },


                                    },
                                    {
                                        dataField: "totalTarget",
                                        caption: "تارگت تعدادی",
                                        width: "12%",
                                        cellTemplate: function (container, options) {
                                            const totalTarget = options.data.totalTarget ?? 0;
                                            const totalSale = options.data.TotalSaleAmount ?? 0;

                                            const ratio = totalTarget > 0 ? totalSale / totalTarget : 0;
                                            const clampedRatio = Math.min(ratio, 1);

                                            const percentText = (ratio * 100).toFixed(0) + '%';
                                            const formattedValue = threeDigit(totalTarget.toFixed(0));

                                            // Remove the yellow-like background by setting transparent
                                            let bgColor = 'transparent';

                                            const fillWidth = clampedRatio * 100;

                                            const progressBar = `
                                                                  <div style="position: relative; width: 100%; height: 100%; background-color: ${bgColor}; border-radius: 4px;">
                                                                    <div style="
                                                                      position: absolute;
                                                                      top: 0; left: 0; bottom: 0;
                                                                      width: ${fillWidth}%;
                                                                      background-color: #c1e3c3;
                                                                      border-radius: 4px 0 0 4px;">
                                                                    </div>
                                                                    <div class="dashboardCellTaget">
                                                                        <div>\u200E${formattedValue}</div>
                                                                        <div class="dashboardCellTagetPercentage">(${percentText})</div>
                                                                    </div>
                                                                   
                                                                  </div>
                                                                `;
                                            container.html(progressBar);
                                        }
                                    },
                                    {
                                        dataField: "totalTargetAmount",
                                        caption: "تارگت ریالی(p2)",
                                        width: "12%",
                                        cellTemplate: function (container, options) {
                                            const totalTarget = options.data.totalTargetAmount ?? 0;
                                            const totalSale = options.data.TotalGoodsPrice ?? 0;

                                            const ratio = totalTarget > 0 ? totalSale / totalTarget : 0;
                                            const clampedRatio = Math.min(ratio, 1);

                                            const percentText = (ratio * 100).toFixed(0) + '%';
                                            const formattedValue = threeDigit(totalTarget.toFixed(0));

                                            // Remove the yellow-like background by setting transparent
                                            let bgColor = 'transparent';

                                            const fillWidth = clampedRatio * 100;

                                            const progressBar = `
                                                              <div style="position: relative; width: 100%; height: 100%; background-color: ${bgColor}; border-radius: 4px;">
                                                                <div style="
                                                                  position: absolute;
                                                                  top: 0; left: 0; bottom: 0;
                                                                  width: ${fillWidth}%;
                                                                  background-color: #c1e3c3;
                                                                  border-radius: 4px 0 0 4px;">
                                                                </div>
                                                                <div class="dashboardCellTaget">
                                                                        <div>\u200E${formattedValue}</div>
                                                                        <div class="dashboardCellTagetPercentage">(${percentText})</div>
                                                                    </div>
                                                              </div>
                                                            `;
                                            container.html(progressBar);
                                        },
                                        headerCellTemplate: function (container) {
                                            container.css("display", "flex").css("align-items", "center").css("justify-content", "space-between");
                                            const title = $("<span>").text("تارگت ریالی");
                                            const icon = $("<i>")
                                                .append(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                                                        </svg>`)
                                                .css({ cursor: "pointer", marginRight: "5px" })
                                                .attr("title", `گزارش فروش-موجودی پخش ${options.key.distributorName} به تفکیک برند`)
                                                .on("click", function (e) {
                                                    e.stopPropagation(); // prevent sort or filter trigger
                                                    const grid = $(`#dist-br-pr-${options.key.distributorId}`).dxDataGrid("instance");
                                                    grid.exportToExcel(false);
                                                });
                                            container.append(title).append(icon);
                                        },
                                    }
                                ],
                                export: {
                                    enabled: false,
                                    fileName: `گزارش فروش-موجودی پخش ${options.key.distributorName} به تفکیک برند`,
                                    excelFilterEnabled: true
                                },
                                onRowPrepared: function (e) {
                                    masterChildStyling(e, 'brand')
                                },
                                masterDetail: {
                                    enabled: true,
                                    template: function (container1, options1) {
                                        if (!options1.data.brandID) return;
                                        var data1 = getcomboValues();
                                        data1.distId = options.data.distributorId;
                                        data1.brandId = options1.data.brandID
                                        $.ajax({
                                            url: '../controller/services.asmx/GetProductSaleSummary',
                                            type: 'POST',
                                            contentType: "application/json; charset=utf-8",
                                            dataType: "json",
                                            data: JSON.stringify({ data: data1 }),
                                            success: function (response) {
                                                checkAccess(response)
                                                response = JSON.parse(response.d)


                                                response.productSalesSummary.forEach(function (sale) {
                                                    var ss = response.productStockSummary.find(function (stock) {
                                                        return stock.financePrdtId == sale.financePrdtId
                                                    })
                                                    sale.amountOfStock = ss?.amountOfStock
                                                    sale.countOfStock = ss?.countOfStock
                                                    var ta = response.productTargetSummary.find(function (target) {
                                                        return target.financePrdtId == sale.financePrdtId
                                                    })
                                                    sale.totalTarget = ta?.TotalProductTarget
                                                    sale.totalTargetAmount = ta?.TotalProductTargetPrice
                                                })
                                                response.productStockSummary.forEach(function (stock) {
                                                    var ss = response.productSalesSummary.find(function (sale) {
                                                        return stock.financePrdtId == sale.financePrdtId
                                                    })
                                                    var ta = response.productTargetSummary.find(function (target) {
                                                        return target.financePrdtId == stock.financePrdtId
                                                    })

                                                    if (!ss) {
                                                        response.productSalesSummary.push({
                                                            TotalGoodsPrice: 0,
                                                            TotalSaleAmount: 0,
                                                            Name: stock.Name,
                                                            countOfStock: stock.countOfStock,
                                                            amountOfStock: stock.amountOfStock,
                                                            financePrdtId: stock.financePrdtId,
                                                            totalTarget: ta?.TotalProductTarget,
                                                            totalTargetAmount: ta?.TotalProductTargetPrice
                                                        })
                                                    }
                                                })
                                                response.productTargetSummary.forEach(function (target) {
                                                    const hasSale = response.productSalesSummary.some(function (sale) {
                                                        return sale.financePrdtId === target.financePrdtId;
                                                    });

                                                    const hasStock = response.productStockSummary.some(function (stock) {
                                                        return stock.financePrdtId === target.financePrdtId;
                                                    });

                                                    if (!hasSale && !hasStock) {
                                                        response.productSalesSummary.push({
                                                            TotalGoodsPrice: 0,
                                                            TotalSaleAmount: 0,
                                                            Name: target.Name || "",  // Fallback if Name isn't provided
                                                            countOfStock: 0,
                                                            amountOfStock: 0,
                                                            financePrdtId: target.financePrdtId,
                                                            totalTarget: target.TotalProductTarget,
                                                            totalTargetAmount: target.TotalProductTargetPrice
                                                        });
                                                    }
                                                });
                                                response.productSalesSummary = response.productSalesSummary.filter(o => {
                                                    return ((o.TotalSaleAmount || 0) + (o.countOfStock || 0) + (o.totalTarget || 0) != 0)
                                                })
                                                $(`<div id="dist-br-pr-${options.key.distributorId}-${options1.data.brandID}">`)
                                                    .addClass("detail-container")
                                                    .appendTo(container1)
                                                    .dxDataGrid({
                                                        dataSource: response.productSalesSummary, // Assuming 'details' is an array in your data
                                                        showBorders: true,
                                                        columnAutoWidth: true,
                                                        rtlEnabled: true,
                                                        paging: { enabled: false },
                                                        columns: [
                                                            {
                                                                dataField: "Name",
                                                                caption: "محصول",
                                                                width: "28%",
                                                                cellTemplate: function (container, options) {
                                                                    var displayClass = ""
                                                                    var displayClassTxt = options.data.Name
                                                                    if (!displayClassTxt) {
                                                                        displayClass = "text-danger"
                                                                        displayClassTxt = "نامعلوم"
                                                                    }
                                                                    container.html(`<span class="${displayClass}">\u200E${displayClassTxt}</span>`);
                                                                }
                                                            },
                                                            {
                                                                dataField: "TotalSaleAmount",
                                                                caption: "فروش تعدادی",
                                                                width: "12%",
                                                                cellTemplate: function (container, options) {
                                                                    var displayClass = ""
                                                                    if (options.data.TotalSaleAmount < 0) {
                                                                        displayClass = "text-danger"
                                                                    }
                                                                    const formattedValue = threeDigit(options.data.TotalSaleAmount?.toFixed(0));
                                                                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                }
                                                            },
                                                            {
                                                                dataField: "TotalGoodsPrice",
                                                                caption: "فروش ریالی",
                                                                width: "12%",
                                                                cellTemplate: function (container, options) {
                                                                    let warnIcon = "";
                                                                    if (options.data.isMoghayerat == 1) {
                                                                        warnIcon = `
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
     fill="darkorange" class="bi bi-info-circle" viewBox="0 0 16 16"
     style="cursor:pointer; margin-right:4px;"
     onclick="alert('قیمت فروش در پخش با قیمت وارد شده در تب عملیات محصولات مالی مطابقت ندارد و یا قیمت فروش در همه پخش ها یکسان نیست ')"
     title="قیمت فروش مغایرت دارد">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0
             1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469
             l-.738 3.468c-.194.897.105 1.319.808 1.319.545
             0 1.178-.252 1.465-.598l.088-.416c-.2.176
             -.492.246-.686.246-.275 0-.375-.193-.304-.533zM9
             4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
</svg>`;
                                                                    }
                                                                    var displayClass = ""
                                                                    if (options.data.TotalGoodsPrice < 0) {
                                                                        displayClass = "text-danger"
                                                                    }
                                                                    const formattedValue = threeDigit(options.data.TotalGoodsPrice?.toFixed(0));
                                                                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>${warnIcon}`);
                                                                }
                                                            },
                                                            {
                                                                dataField: "countOfStock",
                                                                caption: "موجودی تعدادی",
                                                                width: "12%",
                                                                cellTemplate: function (container, options) {
                                                                    var displayClass = ""
                                                                    if (options.data.countOfStock < 0) {
                                                                        displayClass = "text-danger"
                                                                    }
                                                                    const formattedValue = threeDigit(options.data.countOfStock?.toFixed(0));
                                                                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                }
                                                            },
                                                            {
                                                                dataField: "amountOfStock",
                                                                caption: "موجودی ریالی",
                                                                width: "12%",
                                                                cellTemplate: function (container, options) {
                                                                    var displayClass = ""
                                                                    if (options.data.amountOfStock < 0) {
                                                                        displayClass = "text-danger"
                                                                    }
                                                                    const formattedValue = threeDigit(options.data.amountOfStock?.toFixed(0));
                                                                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                },

                                                            },
                                                            {
                                                                dataField: "totalTarget",
                                                                caption: "تارگت تعدادی",
                                                                width: "12%",
                                                                cellTemplate: function (container, options) {
                                                                    const totalTarget = options.data.totalTarget ?? 0;
                                                                    const totalSale = options.data.TotalSaleAmount ?? 0;

                                                                    const ratio = totalTarget > 0 ? totalSale / totalTarget : 0;
                                                                    const clampedRatio = Math.min(ratio, 1);

                                                                    const percentText = (ratio * 100).toFixed(0) + '%';
                                                                    const formattedValue = threeDigit(totalTarget.toFixed(0));

                                                                    // Remove the yellow-like background by setting transparent
                                                                    let bgColor = 'transparent';

                                                                    const fillWidth = clampedRatio * 100;

                                                                    const progressBar = `
                                                                              <div style="position: relative; width: 100%; height: 100%; background-color: ${bgColor}; border-radius: 4px;">
                                                                                <div style="
                                                                                  position: absolute;
                                                                                  top: 0; left: 0; bottom: 0;
                                                                                  width: ${fillWidth}%;
                                                                                  background-color: #ffdba3c2;
                                                                                  border-radius: 4px 0 0 4px;">
                                                                                </div>
                                                                                <div class="dashboardCellTaget">
                                                                                    <div>\u200E${formattedValue}</div>
                                                                                    <div class="dashboardCellTagetPercentage">(${percentText})</div>
                                                                                </div>
                                                                              </div>
                                                                            `;
                                                                    container.html(progressBar);
                                                                }
                                                            },
                                                            {
                                                                dataField: "totalTargetAmount",
                                                                caption: "تارگت ریالی",
                                                                width: "12%",
                                                                cellTemplate: function (container, options) {
                                                                    const ratioCnt = options.data.totalTarget > 0 ? options.data.TotalSaleAmount / options.data.totalTarget : 0;
                                                                    const clampedRatioCnt = Math.min(ratioCnt, 1);
                                                                    const percentCnt = (ratioCnt * 100).toFixed(0);
                                                                    const totalTarget = options.data.totalTargetAmount ?? 0;
                                                                    const totalSale = options.data.TotalGoodsPrice ?? 0;

                                                                    const ratio = totalTarget > 0 ? totalSale / totalTarget : 0;
                                                                    const clampedRatio = Math.min(ratio, 1);

                                                                    const percentText = (ratio * 100).toFixed(0);
                                                                    const formattedValue = threeDigit(totalTarget.toFixed(0));
                                                                    var msg = ''
                                                                    if (percentText != percentCnt) {
                                                                        msg = `<div onclick="alert('قیمت فروش در پخش با قیمت وارد شده در تب عملیات محصولات مالی مطابقت ندارد')" title="قیمت فروش در پخش با قیمت وارد شده در تب عملیات محصولات مالی مطابقت ندارد">
                                                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="darkorange" class="bi bi-info-circle" viewBox="0 0 16 16" >
                                                                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                                                          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                                                        </svg>
                                                                        </div>`
                                                                    }

                                                                    // Remove the yellow-like background by setting transparent
                                                                    let bgColor = 'transparent';

                                                                    const fillWidth = clampedRatio * 100;

                                                                    const progressBar = `
                                                                          <div style="position: relative; width: 100%; height: 100%; background-color: ${bgColor}; border-radius: 4px;">
                                                                            <div style="
                                                                              position: absolute;
                                                                              top: 0; left: 0; bottom: 0;
                                                                              width: ${fillWidth}%;
                                                                              background-color: #ffdba3c2;
                                                                              border-radius: 4px 0 0 4px;">
                                                                            </div>
                                                                            <div class="dashboardCellTaget">
                                                                                    <div>\u200E${formattedValue}</div>
                                                                                    <div class="dashboardCellTagetPercentage">(${percentText}%)</div>
                                                                                    ${msg}
                                                                                </div>
                                                                          </div>
                                                                        `;
                                                                    container.html(progressBar);
                                                                },
                                                                headerCellTemplate: function (container) {
                                                                    container.css("display", "flex").css("align-items", "center").css("justify-content", "space-between");
                                                                    const title = $("<span>").text("تارگت ریالی");
                                                                    const icon = $("<i>")
                                                                        .append(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                                                                 <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                                                                            </svg>`)
                                                                        .css({ cursor: "pointer", marginRight: "5px" })
                                                                        .attr("title", `گزارش فروش-موجودی پخش ${options.key.distributorName}- برند ${options1.data.brandName_EN} به تفکیک محصول`)
                                                                        .on("click", function (e) {
                                                                            e.stopPropagation(); // prevent sort or filter trigger
                                                                            const grid = $(`#dist-br-pr-${options.key.distributorId}-${options1.data.brandID}`).dxDataGrid("instance");
                                                                            grid.exportToExcel(false);
                                                                        });
                                                                    container.append(title).append(icon);
                                                                }

                                                            },
                                                        ],
                                                        export: {
                                                            enabled: false,
                                                            fileName: `گزارش فروش-موجودی پخش ${options.key.distributorName}- برند ${options1.data.brandName_EN} به تفکیک محصول`,
                                                            excelFilterEnabled: true
                                                        },
                                                        onRowPrepared: function (e) {
                                                            masterChildStyling(e, 'product')
                                                        },
                                                        masterDetail: {
                                                            enabled: true,
                                                            template: function (container2, options2) {
                                                                var data2 = getcomboValues();
                                                                data2.distId = options.data.distributorId;
                                                                data2.brandId = options1.data.brandID
                                                                data2.financePrdtId = options2.data.financePrdtId
                                                                $.ajax({
                                                                    url: '../controller/services.asmx/GetStateSaleSummary',
                                                                    type: 'POST',
                                                                    contentType: "application/json; charset=utf-8",
                                                                    dataType: "json",
                                                                    data: JSON.stringify({ data: data2 }),
                                                                    success: function (response) {
                                                                        checkAccess(response)
                                                                        response = JSON.parse(response.d)
                                                                        response.stateSalesSummary.forEach(function (sale) {
                                                                            var ss = response.stateStockSummary.find(function (stock) {
                                                                                return stock.cityId == sale.cityId
                                                                            })
                                                                            sale.amountOfStock = ss?.amountOfStock
                                                                            sale.countOfStock = ss?.countOfStock
                                                                            sale.onTheWayStock = ss?.onTheWayStock
                                                                        })
                                                                        response.stateStockSummary.forEach(function (stock) {
                                                                            var ss = response.stateSalesSummary.find(function (sale) {
                                                                                return stock.cityId == sale.cityId
                                                                            })
                                                                            if (!ss) {
                                                                                response.stateSalesSummary.push({
                                                                                    TotalGoodsPrice: 0,
                                                                                    TotalSaleAmount: 0,
                                                                                    countOfStock: stock.countOfStock,
                                                                                    amountOfStock: stock.amountOfStock,
                                                                                    onTheWayStock: stock.onTheWayStock,
                                                                                    cityId: stock.cityId
                                                                                })
                                                                            }
                                                                        })
                                                                        $(`<div id="dist-br-pr-${options.key.distributorId}-${options1.data.brandID}-${options2.data.financePrdtId}">`)
                                                                            .addClass("detail-container")
                                                                            .appendTo(container2)
                                                                            .dxDataGrid({
                                                                                dataSource: response.stateSalesSummary, // Assuming 'details' is an array in your data
                                                                                showBorders: true,
                                                                                columnAutoWidth: true,
                                                                                rtlEnabled: true,
                                                                                paging: { enabled: false },
                                                                                columns: [
                                                                                    {
                                                                                        dataField: "cityId",
                                                                                        caption: "مرکز پخش",
                                                                                        width: "29%",
                                                                                        lookup: {
                                                                                            dataSource: allData.cities,
                                                                                            valueExpr: "cityId",
                                                                                            displayExpr: "cityName"
                                                                                        },
                                                                                    },
                                                                                    {
                                                                                        dataField: "TotalSaleAmount",
                                                                                        caption: "فروش تعدادی",
                                                                                        width: "12%",
                                                                                        cellTemplate: function (container, options) {
                                                                                            var displayClass = ""
                                                                                            if (options.data.TotalSaleAmount < 0) {
                                                                                                displayClass = "text-danger"
                                                                                            }
                                                                                            const formattedValue = threeDigit(options.data.TotalSaleAmount?.toFixed(0));
                                                                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        dataField: "TotalGoodsPrice",
                                                                                        caption: "فروش ریالی",
                                                                                        width: "12%",
                                                                                        cellTemplate: function (container, options) {
                                                                                            var displayClass = ""
                                                                                            if (options.data.TotalGoodsPrice < 0) {
                                                                                                displayClass = "text-danger"
                                                                                            }
                                                                                            const formattedValue = threeDigit(options.data.TotalGoodsPrice?.toFixed(0));
                                                                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        dataField: "countOfStock",
                                                                                        caption: "موجودی تعدادی",
                                                                                        width: "6%",
                                                                                        cellTemplate: function (container, options) {
                                                                                            var displayClass = ""
                                                                                            if (options.data.countOfStock < 0) {
                                                                                                displayClass = "text-danger"
                                                                                            }
                                                                                            const formattedValue = threeDigit(options.data.countOfStock?.toFixed(0));
                                                                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        dataField: "onTheWayStock",
                                                                                        caption: "موجودی در راه",
                                                                                        width: "6%",
                                                                                        cellTemplate: function (container, options) {
                                                                                            console.log(options.data)
                                                                                            console.log(options.data.onTheWayStock)
                                                                                            var displayClass = ""
                                                                                            if (options.data.onTheWayStock < 0) {
                                                                                                displayClass = "text-danger"
                                                                                            }
                                                                                            const formattedValue = threeDigit(options.data.onTheWayStock?.toFixed(0));
                                                                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        dataField: "amountOfStock",
                                                                                        caption: "موجودی ریالی",
                                                                                        cellTemplate: function (container, options) {
                                                                                            var displayClass = ""
                                                                                            if (options.data.amountOfStock < 0) {
                                                                                                displayClass = "text-danger"
                                                                                            }
                                                                                            const formattedValue = threeDigit(options.data.amountOfStock?.toFixed(0));
                                                                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                                        },
                                                                                        headerCellTemplate: function (container) {
                                                                                            container.css("display", "flex").css("align-items", "center").css("justify-content", "space-between");
                                                                                            const title = $("<span>").text("موجودی ریالی");
                                                                                            const icon = $("<i>")
                                                                                                .append(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                                                                                            <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                                                                                                        </svg>`)
                                                                                                .css({ cursor: "pointer", marginRight: "5px" })
                                                                                                .attr("title", `گزارش فروش-موجودی پخش ${options.key.distributorName}- برند ${options1.data.brandName_EN}- محصول ${options2.data.Name}  به تفکیک مرکز پخش`)
                                                                                                .on("click", function (e) {
                                                                                                    e.stopPropagation(); // prevent sort or filter trigger
                                                                                                    const grid = $(`#dist-br-pr-${options.key.distributorId}-${options1.data.brandID}-${options2.data.financePrdtId}`).dxDataGrid("instance");
                                                                                                    grid.exportToExcel(false);
                                                                                                });
                                                                                            container.append(title).append(icon);
                                                                                        }
                                                                                    }],
                                                                                export: {
                                                                                    enabled: false,
                                                                                    fileName: `گزارش فروش-موجودی پخش ${options.key.distributorName}- برند ${options1.data.brandName_EN}- محصول ${options2.data.Name}  به تفکیک مرکز پخش`,
                                                                                    excelFilterEnabled: true
                                                                                },
                                                                                onRowPrepared: function (e) {
                                                                                    masterChildStyling(e, 'state')
                                                                                },
                                                                            }).parent().addClass("p-1");
                                                                    },
                                                                    error: function (xhr, status, error) {
                                                                        console.error("Error: " + error);
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    }).parent().addClass("p-1");
                                            },
                                            error: function (xhr, status, error) {
                                                console.error("Error: " + error);
                                            }
                                        });
                                    }
                                }
                            }).parent().addClass("p-1");
                    },
                    error: function (xhr, status, error) {
                        console.error("Error: " + error);
                    }
                });
            }
        },
        onCellPrepared: function (e) {
            if (e.rowType === "totalFooter" && e.column.dataField === "totalTarget") {
                const $cell = $(e.cellElement);
                if ($cell && $cell.length) {
                    const saleAmount = e.component.getTotalSummaryValue("TotalSaleAmount");
                    const targetAmount = e.component.getTotalSummaryValue("totalTarget");

                    const percentage = targetAmount
                        ? Math.min(100, (saleAmount / targetAmount) * 100)
                        : 0;

                    const formattedTarget = threeDigit(targetAmount || 0);
                    const formattedPercentage = percentage.toFixed(0);

                    const progressHTML = `
                <div style="position: relative; width: 100%; height: 100%; background-color: transparent; border-radius: 4px;">
                    <div style="
                        position: absolute;
                        top: 0; left: 0; bottom: 0;
                        width: ${percentage}%;
                        background-color: #ffffff59;
                        border-radius: 4px 0 0 4px;">
                    </div>
                    <div class="dashboardCellTagetFooter">
                        <div>\u200E${formattedTarget}</div>
                        <div class="dashboardCellTagetPercentageFooter">(${formattedPercentage}%)</div>
                    </div>
                </div>
            `;

                    $cell.html(progressHTML); // Inject the full custom HTML
                }
            }
            if (e.rowType === "totalFooter" && e.column.dataField === "totalTargetAmount") {
                const $cell = $(e.cellElement);
                if ($cell && $cell.length) {
                    const goodsPrice = e.component.getTotalSummaryValue("TotalGoodsPrice");
                    const targetAmount = e.component.getTotalSummaryValue("totalTargetAmount");

                    const percentage = targetAmount
                        ? Math.min(100, (goodsPrice / targetAmount) * 100)
                        : 0;

                    const formattedTarget = threeDigit(targetAmount || 0);
                    const formattedPercentage = percentage.toFixed(0);

                    const progressHTML = `
                <div style="position: relative; width: 100%; height: 100%; background-color: transparent; border-radius: 4px;">
                    <div style="
                        position: absolute;
                        top: 0; left: 0; bottom: 0;
                        width: ${percentage}%;
                        background-color: #ffffff59;
                        border-radius: 4px 0 0 4px;">
                    </div>
                    <div class="dashboardCellTagetFooter">
                        <div>\u200E${formattedTarget}</div>
                        <div class="dashboardCellTagetPercentageFooter">(${formattedPercentage}%)</div>
                    </div>
                </div>
            `;

                    $cell.html(progressHTML);
                }
            }
        }

    });
    $("#dist-br-pr").unbind().off('click').on('click', function () {
        const grid = $("#tbl-dist-br-pr").dxDataGrid("instance");
        grid.exportToExcel(false);
    })
}
////////////////////////////////////////////////////////////////
function getBrandSaleData() {
    var data = getcomboValues();
    loader('show')
    $.ajax({
        url: '../controller/services.asmx/GetBrandSalesSummary',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            loader('hide');
            checkAccess(response)
            response = JSON.parse(response.d)
            genBrandSaleHtml(response)
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function genBrandSaleHtml(data) {
    data.brandSalesSummary.forEach(function (sale) {
        var ss = data.brandStockSummary.find(function (stock) {
            return stock.brandID == sale.brandID
        })
        sale.amountOfStock = ss?.amountOfStock
        sale.countOfStock = ss?.countOfStock
        var ta = data.brandTargetSummary.find(function (target) {
            return target.brandID == sale.brandID
        })
        sale.totalTarget = ta?.TotalBrandTarget
        sale.totalTargetAmount = ta?.TotalBrandTargetPrice

    })
    data.brandStockSummary.forEach(function (stock) {
        var ss = data.brandSalesSummary.find(function (sale) {
            return stock.brandID == sale.brandID
        })
        if (!ss) {
            var ta = data.brandTargetSummary.find(function (target) {
                return target.brandID == stock.brandID
            })
            data.brandSalesSummary.push({
                TotalGoodsPrice: 0,
                TotalSaleAmount: 0,
                brandName_EN: stock.brandName_EN,
                countOfStock: stock.countOfStock,
                amountOfStock: stock.amountOfStock,
                brandID: stock.brandID,
                totalTarget: ta?.TotalBrandTarget,
                totalTargetAmount: ta?.TotalBrandTargetPrice
            })
        }
    })
    data.brandTargetSummary.forEach(function (target) {
        const hasSale = data.brandSalesSummary.some(function (sale) {
            return sale.brandID === target.brandID;
        });

        const hasStock = data.brandStockSummary.some(function (stock) {
            return stock.brandID === target.brandID;
        });

        if (!hasSale && !hasStock) {
            data.brandSalesSummary.push({
                TotalGoodsPrice: 0,
                TotalSaleAmount: 0,
                brandName_EN: target.brandName_EN || "", // fallback if missing
                countOfStock: 0,
                amountOfStock: 0,
                brandID: target.brandID,
                totalTarget: target.TotalBrandTarget,
                totalTargetAmount: target.TotalBrandTargetPrice
            });
        }
    });
    data.brandSalesSummary = data.brandSalesSummary.filter(o => {
        return ((o.TotalSaleAmount || 0) + (o.countOfStock || 0) + (o.totalTarget || 0) != 0)
    })
    $("#tbl-br-pr-dist").dxDataGrid({
        dataSource: data.brandSalesSummary,
        rtlEnabled: true,
        columns: [
            {
                dataField: "brandName_EN",
                caption: "🏷️ برند",
                width: "28%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    var displayClassTxt = options.data.brandName_EN
                    if (!displayClassTxt) {
                        displayClass = "text-danger"
                        displayClassTxt = "نامعلوم"
                    }
                    container.html(`<span class="${displayClass}">\u200E${displayClassTxt}</span>`);
                }
            },
            {
                dataField: "TotalSaleAmount",
                caption: "فروش تعدادی",
                width: "12%",
                dataType: "number",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.data.TotalSaleAmount?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "TotalGoodsPrice",
                caption: "فروش ریالی(p2)",
                width: "12%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalGoodsPrice < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.data.TotalGoodsPrice?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "countOfStock",
                caption: "موجودی تعدادی",
                width: "12%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.countOfStock < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.data.countOfStock?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "amountOfStock",
                caption: "موجودی ریالی(p1)",
                width: "12%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.amountOfStock < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.data.amountOfStock?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "totalTarget",
                caption: "تارگت تعدادی",
                width: "12%",
                cellTemplate: function (container, options) {
                    const totalTarget = options.data.totalTarget ?? 0;
                    const totalSale = options.data.TotalSaleAmount ?? 0;

                    const ratio = totalTarget > 0 ? totalSale / totalTarget : 0;
                    const clampedRatio = Math.min(ratio, 1);

                    const percentText = (ratio * 100).toFixed(0) + '%';
                    const formattedValue = threeDigit(totalTarget.toFixed(0));

                    // Remove the yellow-like background by setting transparent
                    let bgColor = 'transparent';

                    const fillWidth = clampedRatio * 100;

                    const progressBar = `
                          <div style="position: relative; width: 100%; height: 100%; background-color: ${bgColor}; border-radius: 4px;">
                            <div style="
                              position: absolute;
                              top: 0; left: 0; bottom: 0;
                              width: ${fillWidth}%;
                              background-color: #c1e3c3;
                              border-radius: 4px 0 0 4px;">
                            </div>
                            <div class="dashboardCellTaget">
                                <div>\u200E${formattedValue}</div>
                                <div class="dashboardCellTagetPercentage">(${percentText})</div>
                            </div>
                          </div>
                        `;

                    container.html(progressBar);
                }
            },
            {
                dataField: "totalTargetAmount",
                caption: "تارگت ریالی(p2)",
                width: "12%",
                cellTemplate: function (container, options) {
                    const totalTarget = options.data.totalTargetAmount ?? 0;
                    const totalSale = options.data.TotalGoodsPrice ?? 0;

                    const ratio = totalTarget > 0 ? totalSale / totalTarget : 0;
                    const clampedRatio = Math.min(ratio, 1);

                    const percentText = (ratio * 100).toFixed(0) + '%';
                    const formattedValue = threeDigit(totalTarget.toFixed(0));

                    // Remove the yellow-like background by setting transparent
                    let bgColor = 'transparent';

                    const fillWidth = clampedRatio * 100;

                    const progressBar = `
                          <div style="position: relative; width: 100%; height: 100%; background-color: ${bgColor}; border-radius: 4px;">
                            <div style="
                              position: absolute;
                              top: 0; left: 0; bottom: 0;
                              width: ${fillWidth}%;
                              background-color: #c1e3c3;
                              border-radius: 4px 0 0 4px;">
                            </div>
                            <div class="dashboardCellTaget">
                                <div>\u200E${formattedValue}</div>
                                <div class="dashboardCellTagetPercentage">(${percentText})</div>
                            </div>
                          </div>
                        `;

                    container.html(progressBar);
                }
            }

        ],
        summary: {
            totalItems: [
                {
                    column: "brandName_EN",
                    displayFormat: "جمع",
                },
                {
                    column: "TotalSaleAmount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "TotalGoodsPrice",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "countOfStock",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "amountOfStock",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "totalTarget",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "totalTargetAmount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
            ]
        },
        paging: { enabled: false },
        sorting: { mode: "single" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        scrolling: {
            mode: "virtual" // Enables internal scrolling inside the DataGrid
        },
        export: {
            enabled: false,
            fileName: "گزارش فروش-موجودی به تفکیک برند",
            excelFilterEnabled: true
        },
        onCellPrepared: function (e) {
            if (e.rowType === "totalFooter" && e.column.dataField === "totalTarget") {
                const $cell = $(e.cellElement);
                if ($cell && $cell.length) {
                    const saleAmount = e.component.getTotalSummaryValue("TotalSaleAmount");
                    const targetAmount = e.component.getTotalSummaryValue("totalTarget");

                    const percentage = targetAmount
                        ? Math.min(100, (saleAmount / targetAmount) * 100)
                        : 0;

                    const formattedTarget = threeDigit(targetAmount || 0);
                    const formattedPercentage = percentage.toFixed(0);

                    const progressHTML = `
                <div style="position: relative; width: 100%; height: 100%; background-color: transparent; border-radius: 4px;">
                    <div style="
                        position: absolute;
                        top: 0; left: 0; bottom: 0;
                        width: ${percentage}%;
                        background-color: #ffffff59;
                        border-radius: 4px 0 0 4px;">
                    </div>
                   <div class="dashboardCellTagetFooter">
                        <div>\u200E${formattedTarget}</div>
                        <div class="dashboardCellTagetPercentageFooter">(${formattedPercentage}%)</div>
                    </div>
                </div>
            `;

                    $cell.html(progressHTML); // Inject the full custom HTML
                }
            }
            if (e.rowType === "totalFooter" && e.column.dataField === "totalTargetAmount") {
                const $cell = $(e.cellElement);
                if ($cell && $cell.length) {
                    const goodsPrice = e.component.getTotalSummaryValue("TotalGoodsPrice");
                    const targetAmount = e.component.getTotalSummaryValue("totalTargetAmount");

                    const percentage = targetAmount
                        ? Math.min(100, (goodsPrice / targetAmount) * 100)
                        : 0;

                    const formattedTarget = threeDigit(targetAmount || 0);
                    const formattedPercentage = percentage.toFixed(0);

                    const progressHTML = `
                <div style="position: relative; width: 100%; height: 100%; background-color: transparent; border-radius: 4px;">
                    <div style="
                        position: absolute;
                        top: 0; left: 0; bottom: 0;
                        width: ${percentage}%;
                        background-color: #ffffff59;
                        border-radius: 4px 0 0 4px;">
                    </div>
                    <div class="dashboardCellTagetFooter">
                        <div>\u200E${formattedTarget}</div>
                        <div class="dashboardCellTagetPercentageFooter">(${formattedPercentage}%)</div>
                    </div>
                </div>
            `;

                    $cell.html(progressHTML);
                }
            }
        },
        onRowPrepared: function (e) {
            masterChildStyling(e, 'brand')
        },
        masterDetail: {
            enabled: true,
            template: function (container, options) {

                if (!options.key.brandID) return;
                var data = getcomboValues();
                data.brandId = options.key.brandID
                $.ajax({
                    url: '../controller/services.asmx/GetProductSaleSummary',
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ data: data }),
                    success: function (response) {
                        checkAccess(response)
                        response = JSON.parse(response.d)
                     //   console.log(response.productSalesSummary)
                        response.productSalesSummary.forEach(function (sale) {
                            var ss = response.productStockSummary.find(function (stock) {
                                return stock.financePrdtId == sale.financePrdtId
                            })
                            sale.amountOfStock = ss?.amountOfStock
                            sale.countOfStock = ss?.countOfStock
                            var ta = response.productTargetSummary.find(function (target) {
                                return target.financePrdtId == sale.financePrdtId
                            })
                            sale.totalTarget = ta?.TotalProductTarget
                            sale.totalTargetAmount = ta?.TotalProductTargetPrice
                        })
                        response.productStockSummary.forEach(function (stock) {
                            var ss = response.productSalesSummary.find(function (sale) {
                                return stock.financePrdtId == sale.financePrdtId
                            })
                            var ta = response.productTargetSummary.find(function (target) {
                                return target.financePrdtId == stock.financePrdtId
                            })

                            if (!ss) {
                                response.productSalesSummary.push({
                                    TotalGoodsPrice: 0,
                                    TotalSaleAmount: 0,
                                    Name: stock.Name,
                                    countOfStock: stock.countOfStock,
                                    amountOfStock: stock.amountOfStock,
                                    financePrdtId: stock.financePrdtId,
                                    totalTarget: ta?.TotalProductTarget,
                                    totalTargetAmount: ta?.TotalProductTargetPrice
                                })
                            }
                        })
                        response.productTargetSummary.forEach(function (target) {
                            const hasSale = response.productSalesSummary.some(function (sale) {
                                return sale.financePrdtId === target.financePrdtId;
                            });

                            const hasStock = response.productStockSummary.some(function (stock) {
                                return stock.financePrdtId === target.financePrdtId;
                            });

                            if (!hasSale && !hasStock) {
                                response.productSalesSummary.push({
                                    TotalGoodsPrice: 0,
                                    TotalSaleAmount: 0,
                                    Name: target.Name || "",  // Fallback if Name isn't provided
                                    countOfStock: 0,
                                    amountOfStock: 0,
                                    financePrdtId: target.financePrdtId,
                                    totalTarget: target.TotalProductTarget,
                                    totalTargetAmount: target.TotalProductTargetPrice
                                });
                            }
                        });
                        response.productSalesSummary = response.productSalesSummary.filter(o => {
                            return ((o.TotalSaleAmount || 0) + (o.countOfStock || 0) + (o.totalTarget || 0) != 0)
                        })
                        $(`<div id='br-pr-dist-${options.key.brandID}'>`)
                            .addClass("detail-container")
                            .appendTo(container)
                            .dxDataGrid({
                                dataSource: response.productSalesSummary, // Assuming 'details' is an array in your data
                                showBorders: true,
                                columnAutoWidth: true,
                                rtlEnabled: true,
                                paging: { enabled: false },
                                columns: [
                                    {
                                        dataField: "Name",
                                        caption: "محصول",
                                        width: "28%",
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            var displayClassTxt = options.data.Name
                                            if (!displayClassTxt) {
                                                displayClass = "text-danger"
                                                displayClassTxt = "نامعلوم"
                                            }
                                            container.html(`<span class="${displayClass}">\u200E${displayClassTxt}</span>`);
                                        }
                                    },
                                    {
                                        dataField: "TotalSaleAmount",
                                        caption: "فروش تعدادی",
                                        width: "12%",
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            if (options.data.TotalSaleAmount < 0) {
                                                displayClass = "text-danger"
                                            } 
                                            const formattedValue = threeDigit(options.data.TotalSaleAmount?.toFixed(0));
                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                        }
                                    },
                                    {
                                        dataField: "TotalGoodsPrice",
                                        caption: "فروش ریالی",
                                        width: "12%",
                                        cellTemplate: function (container, options) {
                                            let warnIcon = "";
                                            if (options.data.isMoghayerat == 1) {
                                                warnIcon = `
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                     fill="darkorange" class="bi bi-info-circle" viewBox="0 0 16 16"
                     style="cursor:pointer; margin-right:4px;"
                     onclick="alert('قیمت فروش در پخش با قیمت وارد شده در تب عملیات محصولات مالی مطابقت ندارد و یا قیمت فروش در همه پخش ها یکسان نیست ')"
                     title="قیمت فروش مغایرت دارد">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0
                             1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469
                             l-.738 3.468c-.194.897.105 1.319.808 1.319.545
                             0 1.178-.252 1.465-.598l.088-.416c-.2.176
                             -.492.246-.686.246-.275 0-.375-.193-.304-.533zM9
                             4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                </svg>`;
                                            }

                                         
                                            var displayClass = ""
                                            if (options.data.TotalGoodsPrice < 0) {
                                                displayClass = "text-danger"
                                            }
                                            const formattedValue = threeDigit(options.data.TotalGoodsPrice?.toFixed(0));
                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span> ${warnIcon}`);
                                        }
                                    },
                                    {
                                        dataField: "countOfStock",
                                        caption: "موجودی تعدادی",
                                        width: "12%",
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            if (options.data.countOfStock < 0) {
                                                displayClass = "text-danger"
                                            }
                                            const formattedValue = threeDigit(options.data.countOfStock?.toFixed(0));
                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                        }
                                    },
                                    {
                                        dataField: "amountOfStock",
                                        caption: "موجودی ریالی",
                                        width: "12%",
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            if (options.data.amountOfStock < 0) {
                                                displayClass = "text-danger"
                                            }
                                            const formattedValue = threeDigit(options.data.amountOfStock?.toFixed(0));
                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                        },

                                    },
                                    {
                                        dataField: "totalTarget",
                                        caption: "تارگت تعدادی",
                                        width: "12%",
                                        cellTemplate: function (container, options) {
                                            const totalTarget = options.data.totalTarget ?? 0;
                                            const totalSale = options.data.TotalSaleAmount ?? 0;

                                            const ratio = totalTarget > 0 ? totalSale / totalTarget : 0;
                                            const clampedRatio = Math.min(ratio, 1);

                                            const percentText = (ratio * 100).toFixed(0) + '%';
                                            const formattedValue = threeDigit(totalTarget.toFixed(0));

                                            // Remove the yellow-like background by setting transparent
                                            let bgColor = 'transparent';

                                            const fillWidth = clampedRatio * 100;

                                            const progressBar = `
                                                    <div style="position: relative; width: 100%; height: 100%; background-color: ${bgColor}; border-radius: 4px;">
                                                      <div style="
                                                        position: absolute;
                                                        top: 0; left: 0; bottom: 0;
                                                        width: ${fillWidth}%;
                                                        background-color: #ffdba3c2;
                                                        border-radius: 4px 0 0 4px;">
                                                      </div>
                                                      <div class="dashboardCellTaget">
                                                          <div>\u200E${formattedValue}</div>
                                                          <div class="dashboardCellTagetPercentage">(${percentText})</div>
                                                      </div>
                                                    </div>
                                                  `;
                                            container.html(progressBar);
                                        }
                                    },
                                    {
                                        dataField: "totalTargetAmount",
                                        caption: "تارگت ریالی",
                                        width: "12%",
                                        cellTemplate: function (container, options) {
                                            const ratioCnt = options.data.totalTarget > 0 ? options.data.TotalSaleAmount / options.data.totalTarget : 0;
                                            const clampedRatioCnt = Math.min(ratioCnt, 1);
                                            const percentCnt = (ratioCnt * 100).toFixed(0);


                                            const totalTarget = options.data.totalTargetAmount ?? 0;
                                            const totalSale = options.data.TotalGoodsPrice ?? 0;

                                            const ratio = totalTarget > 0 ? totalSale / totalTarget : 0;
                                            const clampedRatio = Math.min(ratio, 1);

                                            const percentText = (ratio * 100).toFixed(0);
                                            var msg = ''
                                            if (percentText != percentCnt) {
                                                msg = `<div onclick="alert('قیمت فروش در پخش با قیمت وارد شده در تب عملیات محصولات مالی مطابقت ندارد و یا قیمت فروش در همه پخش ها یکسان نیست ')" title="قیمت فروش در پخش با قیمت وارد شده در تب عملیات محصولات مالی مطابقت نداردو یا قیمت فروش در همه پخش ها یکسان نیست">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="darkorange" class="bi bi-info-circle" viewBox="0 0 16 16" >
                                                         <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                                         <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                                       </svg>
                                                       </div>`
                                            }
                                            const formattedValue = threeDigit(totalTarget.toFixed(0));

                                            // Remove the yellow-like background by setting transparent
                                            let bgColor = 'transparent';

                                            const fillWidth = clampedRatio * 100;

                                            const progressBar = `
                                               <div style="position: relative; width: 100%; height: 100%; background-color: ${bgColor}; border-radius: 4px;">
                                                 <div style="
                                                   position: absolute;
                                                   top: 0; left: 0; bottom: 0;
                                                   width: ${fillWidth}%;
                                                   background-color: #ffdba3c2;
                                                   border-radius: 4px 0 0 4px;">
                                                 </div>
                                                 <div class="dashboardCellTaget">
                                                     <div>\u200E${formattedValue}</div>
                                                     <div class="dashboardCellTagetPercentage">(${percentText}%)</div>
                                                     ${msg}
                                                 </div>
                                               </div>
                                             `;
                                            container.html(progressBar);
                                        },
                                        headerCellTemplate: function (container) {
                                            container.css("display", "flex").css("align-items", "center").css("justify-content", "space-between");
                                            const title = $("<span>").text("تارگت ریالی");
                                            const icon = $("<i>")
                                                .append(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                                                        </svg>`)
                                                .css({ cursor: "pointer", marginRight: "5px" })
                                                .attr("title", `گزارش فروش-موجودی برند ${options.key.brandName_EN} به تفکیک محصول`)
                                                .on("click", function (e) {
                                                    e.stopPropagation(); // prevent sort or filter trigger
                                                    const grid = $(`#br-pr-dist-${options.key.brandID}`).dxDataGrid("instance");
                                                    grid.exportToExcel(false);
                                                });
                                            container.append(title).append(icon);
                                        }

                                    },
                                ],
                                export: {
                                    enabled: false,
                                    fileName: `گزارش فروش-موجودی برند ${options.key.brandName_EN} به تفکیک محصول`,
                                    excelFilterEnabled: true
                                },
                                onRowPrepared: function (e) {
                                    masterChildStyling(e, 'product')
                                },
                                masterDetail: {
                                    enabled: true,
                                    template: function (container1, options1) {
                                        if (!options1.data.financePrdtId) return;
                                     //   console.log(options)
                                        var data1 = getcomboValues();
                                        data1.brandId = options.data.brandID
                                        data1.financePrdtId = options1.data.financePrdtId;
                                        $.ajax({
                                            url: '../controller/services.asmx/GetDistSaleSummary',
                                            type: 'POST',
                                            contentType: "application/json; charset=utf-8",
                                            dataType: "json",
                                            data: JSON.stringify({ data: data1 }),
                                            success: function (response) {
                                                checkAccess(response)
                                                response = JSON.parse(response.d)
                                                response.distSalesSummary.forEach(function (sale) {
                                                    var ss = response.distStockSummary.find(function (stock) {
                                                        return stock.distributorId == sale.distributorId
                                                    })
                                                    sale.amountOfStock = ss?.amountOfStock
                                                    sale.countOfStock = ss?.countOfStock
                                                    var ta = response.distTargetSummary.find(function (target) {
                                                        return target.distributorId == sale.distributorId
                                                    })
                                                    sale.totalTarget = ta?.TotalDistributorTarget
                                                    sale.totalTargetAmount = ta?.TotalDistributorTargetPrice
                                                })
                                                response.distStockSummary.forEach(function (stock) {
                                                    var ss = response.distSalesSummary.find(function (sale) {
                                                        return stock.distributorId == sale.distributorId
                                                    })
                                                    var ta = response.distTargetSummary.find(function (target) {
                                                        return target.distributorId == stock.distributorId
                                                    })
                                                    if (!ss) {
                                                        response.distSalesSummary.push({
                                                            TotalGoodsPrice: 0,
                                                            TotalSaleAmount: 0,
                                                            distributorName: stock.distributorName,
                                                            countOfStock: stock.countOfStock,
                                                            amountOfStock: stock.amountOfStock,
                                                            distributorId: stock.distributorId,
                                                            totalTarget: ta?.TotalDistributorTarget,
                                                            totalTargetAmount: ta?.TotalDistributorTargetPrice
                                                        })
                                                    }
                                                })
                                                response.distTargetSummary.forEach(function (target) {
                                                    var hasSale = response.distSalesSummary.some(function (sale) {
                                                        return sale.distributorId == target.distributorId;
                                                    });

                                                    var hasStock = response.distStockSummary.some(function (stock) {
                                                        return stock.distributorId == target.distributorId;
                                                    });

                                                    if (!hasSale && !hasStock) {
                                                        response.distSalesSummary.push({
                                                            TotalGoodsPrice: 0,
                                                            TotalSaleAmount: 0,
                                                            distributorName: target.distributorName, // ensure this exists
                                                            countOfStock: 0,
                                                            amountOfStock: 0,
                                                            distributorId: target.distributorId,
                                                            totalTarget: target.TotalDistributorTarget,
                                                            totalTargetAmount: target.TotalDistributorTargetPrice
                                                        });
                                                    }
                                                });
                                                response.distSalesSummary = response.distSalesSummary.filter(o => {
                                                    return ((o.TotalSaleAmount || 0) + (o.countOfStock || 0) + (o.totalTarget || 0) != 0)
                                                })
                                                $(`<div id="br-pr-dist-${options.key.brandID}-${options1.key.financePrdtId}">`)
                                                    .addClass("detail-container")
                                                    .appendTo(container1)
                                                    .dxDataGrid({
                                                        dataSource: response.distSalesSummary, // Assuming 'details' is an array in your data
                                                        showBorders: true,
                                                        columnAutoWidth: true,
                                                        rtlEnabled: true,
                                                        paging: { enabled: false },
                                                        columns: [
                                                            {
                                                                dataField: "distributorName",
                                                                caption: "پخش",
                                                                width: "28%",
                                                                cellTemplate: function (container, options) {
                                                                    var displayClass = ""
                                                                    var displayClassTxt = options.data.distributorName
                                                                    if (!displayClassTxt) {
                                                                        displayClass = "text-danger"
                                                                        displayClassTxt = "نامعلوم"
                                                                    }
                                                                    container.html(`<span class="${displayClass}">\u200E${displayClassTxt}</span>`);
                                                                }
                                                            },
                                                            {
                                                                dataField: "TotalSaleAmount",
                                                                caption: "فروش تعدادی",
                                                                width: "12%",
                                                                cellTemplate: function (container, options) {
                                                                    var displayClass = ""
                                                                    if (options.data.TotalSaleAmount < 0) {
                                                                        displayClass = "text-danger"
                                                                    }
                                                                    const formattedValue = threeDigit(options.data.TotalSaleAmount?.toFixed(0));
                                                                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                }
                                                            },
                                                            {
                                                                dataField: "TotalGoodsPrice",
                                                                caption: "فروش ریالی",
                                                                width: "12%",
                                                                cellTemplate: function (container, options) {
                                                                    let warnIcon = "";
                                                                    if (options.data.isMoghayerat == 1) {
                                                                        warnIcon = `
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
     fill="darkorange" class="bi bi-info-circle" viewBox="0 0 16 16"
     style="cursor:pointer; margin-right:4px;"
     onclick="alert('قیمت فروش در پخش با قیمت وارد شده در تب عملیات محصولات مالی مطابقت ندارد و یا قیمت فروش در همه پخش ها یکسان نیست ')"
     title="قیمت فروش مغایرت دارد">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0
             1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469
             l-.738 3.468c-.194.897.105 1.319.808 1.319.545
             0 1.178-.252 1.465-.598l.088-.416c-.2.176
             -.492.246-.686.246-.275 0-.375-.193-.304-.533zM9
             4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
</svg>`;
                                                                    }
                                                                //    options.data
                                                              //    console.log( options.data.isMoghayerat)
                                                                    var displayClass = ""
                                                                    if (options.data.TotalGoodsPrice < 0) {
                                                                        displayClass = "text-danger"
                                                                    }
                                                                    const formattedValue = threeDigit(options.data.TotalGoodsPrice?.toFixed(0));
                                                                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>${warnIcon}`);
                                                                }
                                                            },
                                                            {
                                                                dataField: "countOfStock",
                                                                caption: "موجودی تعدادی",
                                                                width: "12%",
                                                                cellTemplate: function (container, options) {
                                                                    var displayClass = ""
                                                                    if (options.data.countOfStock < 0) {
                                                                        displayClass = "text-danger"
                                                                    }
                                                                    const formattedValue = threeDigit(options.data.countOfStock?.toFixed(0));
                                                                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                }
                                                            },
                                                            {
                                                                dataField: "amountOfStock",
                                                                caption: "موجودی ریالی",
                                                                width: "12%",
                                                                cellTemplate: function (container, options) {
                                                                    
                                                                    var displayClass = ""
                                                                    if (options.data.amountOfStock < 0) {
                                                                        displayClass = "text-danger"
                                                                    }
                                                                    const formattedValue = threeDigit(options.data.amountOfStock?.toFixed(0));
                                                                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                },

                                                            },
                                                            {
                                                                dataField: "totalTarget",
                                                                caption: "تارگت تعدادی",
                                                                width: "12%",
                                                                cellTemplate: function (container, options) {
                                                                    const totalTarget = options.data.totalTarget ?? 0;
                                                                    const totalSale = options.data.TotalSaleAmount ?? 0;

                                                                    const ratio = totalTarget > 0 ? totalSale / totalTarget : 0;
                                                                    const clampedRatio = Math.min(ratio, 1);

                                                                    const percentText = (ratio * 100).toFixed(0) + '%';
                                                                    const formattedValue = threeDigit(totalTarget.toFixed(0));

                                                                    // Remove the yellow-like background by setting transparent
                                                                    let bgColor = 'transparent';

                                                                    const fillWidth = clampedRatio * 100;

                                                                    const progressBar = `
                                                                          <div style="position: relative; width: 100%; height: 100%; background-color: ${bgColor}; border-radius: 4px;">
                                                                            <div style="
                                                                              position: absolute;
                                                                              top: 0; left: 0; bottom: 0;
                                                                              width: ${fillWidth}%;
                                                                              background-color: rgba(100, 149, 237, 0.3);
                                                                              border-radius: 4px 0 0 4px;">
                                                                            </div>
                                                                            <div class="dashboardCellTaget">
                                                                                <div>\u200E${formattedValue}</div>
                                                                                <div class="dashboardCellTagetPercentage">(${percentText})</div>
                                                                            </div>
                                                                          </div>
                                                                        `;

                                                                    container.html(progressBar);
                                                                }
                                                            },
                                                            {
                                                                dataField: "totalTargetAmount",
                                                                caption: "تارگت ریالی(p2)",
                                                                width: "12%",
                                                                cellTemplate: function (container, options) {
                                                                    const totalTarget = options.data.totalTargetAmount ?? 0;
                                                                    const totalSale = options.data.TotalGoodsPrice ?? 0;

                                                                    const ratio = totalTarget > 0 ? totalSale / totalTarget : 0;
                                                                    const clampedRatio = Math.min(ratio, 1);

                                                                    const percentText = (ratio * 100).toFixed(0) + '%';
                                                                    const formattedValue = threeDigit(totalTarget.toFixed(0));

                                                                    // Remove the yellow-like background by setting transparent
                                                                    let bgColor = 'transparent';

                                                                    const fillWidth = clampedRatio * 100;

                                                                    const progressBar = `
                                                                          <div style="position: relative; width: 100%; height: 100%; background-color: ${bgColor}; border-radius: 4px;">
                                                                            <div style="
                                                                              position: absolute;
                                                                              top: 0; left: 0; bottom: 0;
                                                                              width: ${fillWidth}%;
                                                                              background-color: rgba(100, 149, 237, 0.3);
                                                                              border-radius: 4px 0 0 4px;">
                                                                            </div>
                                                                           <div class="dashboardCellTaget">
                                                                                <div>\u200E${formattedValue}</div>
                                                                                <div class="dashboardCellTagetPercentage">(${percentText})</div>
                                                                            </div>
                                                                          </div>
                                                                        `;

                                                                    container.html(progressBar);
                                                                },
                                                                headerCellTemplate: function (container) {
                                                                    container.css("display", "flex").css("align-items", "center").css("justify-content", "space-between");
                                                                    const title = $("<span>").text("موجودی ریالی");
                                                                    const icon = $("<i>")
                                                                        .append(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                                                                    <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                                                                                </svg>`)
                                                                        .css({ cursor: "pointer", marginRight: "5px" })
                                                                        .attr("title", `گزارش فروش-موجودی برند  ${options.key.brandName_EN} - محصول ${options1.key.Name} به تفکیک پخش`)
                                                                        .on("click", function (e) {
                                                                            e.stopPropagation(); // prevent sort or filter trigger
                                                                            const grid = $(`#br-pr-dist-${options.key.brandID}-${options1.key.financePrdtId}`).dxDataGrid("instance");
                                                                            grid.exportToExcel(false);
                                                                        });
                                                                    container.append(title).append(icon);
                                                                }

                                                            },
                                                        ],
                                                        export: {
                                                            enabled: false,
                                                            fileName: `گزارش فروش-موجودی برند  ${options.key.brandName_EN} - محصول ${options1.key.Name} به تفکیک پخش`,
                                                            excelFilterEnabled: true
                                                        },
                                                        onRowPrepared: function (e) {
                                                            masterChildStyling(e, 'dist')
                                                        },
                                                        masterDetail: {
                                                            enabled: true,
                                                            template: function (container2, options2) {
                                                                var data2 = getcomboValues();
                                                                data2.brandId = options.data.brandID
                                                                data2.financePrdtId = options1.data.financePrdtId
                                                                data2.distId = options2.data.distributorId;
                                                                $.ajax({
                                                                    url: '../controller/services.asmx/GetStateSaleSummary',
                                                                    type: 'POST',
                                                                    contentType: "application/json; charset=utf-8",
                                                                    dataType: "json",
                                                                    data: JSON.stringify({ data: data2 }),
                                                                    success: function (response) {
                                                                        checkAccess(response)
                                                                        response = JSON.parse(response.d)
                                                                        response.stateSalesSummary.forEach(function (sale) {
                                                                            var ss = response.stateStockSummary.find(function (stock) {
                                                                                return stock.cityId == sale.cityId
                                                                            })
                                                                            sale.amountOfStock = ss?.amountOfStock
                                                                            sale.countOfStock = ss?.countOfStock
                                                                            sale.onTheWayStock = ss?.onTheWayStock
                                                                        })
                                                                        response.stateStockSummary.forEach(function (stock) {
                                                                            var ss = response.stateSalesSummary.find(function (sale) {
                                                                                return stock.cityId == sale.cityId
                                                                            })
                                                                            if (!ss) {
                                                                                response.stateSalesSummary.push({
                                                                                    TotalGoodsPrice: 0,
                                                                                    TotalSaleAmount: 0,
                                                                                    countOfStock: stock.countOfStock,
                                                                                    amountOfStock: stock.amountOfStock,
                                                                                    onTheWayStock: stock.onTheWayStock,
                                                                                    cityId: stock.cityId
                                                                                })
                                                                            }
                                                                        })
                                                                        $(`<div id="br-pr-dist-${options.data.brandID}-${options1.data.financePrdtId}-${options2.data.distributorId}">`)
                                                                            .addClass("detail-container")
                                                                            .appendTo(container2)
                                                                            .dxDataGrid({
                                                                                dataSource: response.stateSalesSummary, // Assuming 'details' is an array in your data
                                                                                showBorders: true,
                                                                                columnAutoWidth: true,
                                                                                rtlEnabled: true,
                                                                                paging: { enabled: false },
                                                                                columns: [
                                                                                    {
                                                                                        dataField: "cityId",
                                                                                        caption: "مرکز پخش",
                                                                                        width: "29%",
                                                                                        lookup: {
                                                                                            dataSource: allData.cities,
                                                                                            valueExpr: "cityId",
                                                                                            displayExpr: "cityName"
                                                                                        },
                                                                                    },
                                                                                    {
                                                                                        dataField: "TotalSaleAmount",
                                                                                        caption: "فروش تعدادی",
                                                                                        width: "12%",
                                                                                        cellTemplate: function (container, options) {
                                                                                            var displayClass = ""
                                                                                            if (options.data.TotalSaleAmount < 0) {
                                                                                                displayClass = "text-danger"
                                                                                            }
                                                                                            const formattedValue = threeDigit(options.data.TotalSaleAmount?.toFixed(0));
                                                                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        dataField: "TotalGoodsPrice",
                                                                                        caption: "فروش ریالی",
                                                                                        width: "12%",
                                                                                        cellTemplate: function (container, options) {
                                                                                            var displayClass = ""
                                                                                            if (options.data.TotalGoodsPrice < 0) {
                                                                                                displayClass = "text-danger"
                                                                                            }
                                                                                            const formattedValue = threeDigit(options.data.TotalGoodsPrice?.toFixed(0));
                                                                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        dataField: "countOfStock",
                                                                                        caption: "موجودی تعدادی",
                                                                                        width: "6%",
                                                                                        cellTemplate: function (container, options) {
                                                                                            var displayClass = ""
                                                                                            if (options.data.countOfStock < 0) {
                                                                                                displayClass = "text-danger"
                                                                                            }
                                                                                            const formattedValue = threeDigit(options.data.countOfStock?.toFixed(0));
                                                                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        dataField: "onTheWayStock",
                                                                                        caption: "موجودی در راه",
                                                                                        width: "6%",
                                                                                        cellTemplate: function (container, options) {
                                                                                            var displayClass = ""
                                                                                            if (options.data.onTheWayStock < 0) {
                                                                                                displayClass = "text-danger"
                                                                                            }
                                                                                            const formattedValue = threeDigit(options.data.onTheWayStock?.toFixed(0));
                                                                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        dataField: "amountOfStock",
                                                                                        caption: "موجودی ریالی",
                                                                                        cellTemplate: function (container, options) {
                                                                                            var displayClass = ""
                                                                                            if (options.data.amountOfStock < 0) {
                                                                                                displayClass = "text-danger"
                                                                                            }
                                                                                            const formattedValue = threeDigit(options.data.amountOfStock?.toFixed(0));
                                                                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                                        },
                                                                                        headerCellTemplate: function (container) {

                                                                                            container.css("display", "flex").css("align-items", "center").css("justify-content", "space-between");
                                                                                            const title = $("<span>").text("موجودی ریالی");
                                                                                            const icon = $("<i>")
                                                                                                .append(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                                                                                            <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                                                                                                        </svg>`)
                                                                                                .css({ cursor: "pointer", marginRight: "5px" })
                                                                                                .attr("title", `گزارش فروش-موجودی برند ${options.key.brandName_EN} - محصول ${options1.key.Name} - پخش ${options2.key.distributorName} به تفکیک مرکزپخش`)
                                                                                                .on("click", function (e) {
                                                                                                    e.stopPropagation(); // prevent sort or filter trigger
                                                                                                    const grid = $(`#br-pr-dist-${options.data.brandID}-${options1.data.financePrdtId}-${options2.data.distributorId}`).dxDataGrid("instance");
                                                                                                    grid.exportToExcel(false);
                                                                                                });
                                                                                            container.append(title).append(icon);
                                                                                        }
                                                                                    }],
                                                                                export: {
                                                                                    enabled: false,
                                                                                    fileName: `گزارش فروش-موجودی برند ${options.key.brandName_EN} - محصول ${options1.key.Name} - پخش ${options2.key.distributorName} به تفکیک مرکزپخش`,
                                                                                    excelFilterEnabled: true
                                                                                },
                                                                                onRowPrepared: function (e) {
                                                                                    masterChildStyling(e, 'state')
                                                                                },
                                                                            }).parent().addClass("p-1");
                                                                    },
                                                                    error: function (xhr, status, error) {
                                                                        console.error("Error: " + error);
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    }).parent().addClass("p-1");
                                            },
                                            error: function (xhr, status, error) {
                                                console.error("Error: " + error);
                                            }
                                        });
                                    }
                                }
                            }).parent().addClass("p-1");
                    },
                    error: function (xhr, status, error) {
                        console.error("Error: " + error);
                    }
                });
            }
        },
    });
    $("#br-pr-dist").unbind().off('click').on('click', function () {
        const grid = $("#tbl-br-pr-dist").dxDataGrid("instance");
        grid.exportToExcel(false);
    })
}
function convertToShamsi(srcData) {
    var a = new Date(srcData);
    var shamsi = a.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    return shamsi
}



function matchProductTemp(){
    var data = getcomboValues()
    $.ajax({
        url: '../controller/services.asmx/GetProformaProductTemp',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            checkAccess(response)
            response = JSON.parse(response.d)
           // console.log(response)
            genProductTempHtml(response)
        },
        error: function (xhr, status, error) {
            alert('خطای دریافت لیست محصولات')
        },
        async: false
    });
    
}

function genProductTempHtml(response) {
    var selectedCompanies = $("#comboCo").dxTagBox('option', 'value')
    if (selectedCompanies.length != 1) {
        showToast("لطفا فقط یک شرکت انتخاب نمایید", "warning")
        $("#proformaProductTemp").hide()
        return
    }
    if ($("#proformaProductTemp").data("dxDataGrid")) {
        $("#proformaProductTemp").dxDataGrid("instance").dispose(); // Destroy the grid
        $("#proformaProductTemp").empty(); // Remove all elements inside the container
    }
    $("#proformaProductTemp").show()
    $("#proformaProductTemp").dxDataGrid({
        dataSource: response.tempProducts,
        rtlEnabled: true,
        height: "85vh",
        columns: [
            { dataField: "financePrdtId", caption: "financePrdtId", dataType: "number", visible: false },
            { dataField: "ptName", caption: "نام محصول", allowEditing: false },
            {
                dataField: "companyId",
                caption: "شرکت",
                allowEditing: false,
                lookup: {
                    dataSource: allData.companies,
                    valueExpr: "cId",
                    displayExpr: "cName_FA"
                },
            },
            {
                dataField: "fprId",
                caption: "متصل شده به محصول مالی",
                lookup: {
                    dataSource: response.fncProducts,
                    valueExpr: "financePrdtId",
                    displayExpr: "name"
                },
            },
        ],
        export: {
            enabled: true
        },
        onExporting: function (e) {
            const grid = e.component;
            grid.columnOption("financePrdtId", "visible", true);
        },
        onExported: function (e) {
            const grid = e.component;
            grid.columnOption("financePrdtId", "visible", false);
        },
        allowColumnResizing: true,
        showBorders: true,
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        editing: {
            mode: "row",
            allowUpdating: true,
            useIcons: true
        },
        scrolling: {
            mode: "virtual" // Enables internal scrolling inside the DataGrid
        },
        onRowUpdating: function (e) {
            $("#proformaProductTemp").dxDataGrid("instance").refresh();
            loader('show')
            var data = {
                pfPrdId: e.key.pfPrdId,
                fprId: (e.newData.hasOwnProperty("fprId")) ? e.newData.fprId : e.oldData.fprId,
            }
            $.ajax({
                url: '../controller/services.asmx/updateProductTemp',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ fprId: data.fprId, pfPrdId: data.pfPrdId,}),
                success: function (response) {
                    loader('hide')
                    checkAccess(response)
                    response = JSON.parse(response.d)
                    var msg = `تغییرات با موفقیت ذخیره شد`
                    toast(msg);
                },
                error: function (xhr, status, error) {
                    alert('خطای دریافت لیست محصولات')
                },
            })
        },
        onRowPrepared: function (e) {
            if (e.rowType === "data" && e.data.fprId === null) {
                e.rowElement.css("background-color", "#fea7a7"); // Set background color to red
                e.rowElement.css("color", "black"); // Make text readable
            }
        }
    });
}
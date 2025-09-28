var globe = {};
var allData = [];
var subTaskSelections = {};
var allFormData = [];
$(document).ready(function () {
    formDate();
    loadAction();
    logout();


})
function getUrlParam(paramName) {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var action = urlParams.get(paramName);
    return action
}
function toggleDropdown(event) {
    event.preventDefault();

    const currentDropdown = $(event.currentTarget).next(".dropdown-content");

    // بستن تمام dropdown-content های دیگر
    $(".dropdown-content").not(currentDropdown).slideUp();

    // باز و بسته کردن dropdown کلیک شده
    if (currentDropdown.is(":visible")) {
        currentDropdown.slideUp();
    } else {
        currentDropdown.slideDown();
    }

    // حذف کلاس 'active' از سایر منوها
    $(".menu-item").removeClass("active");

    // اضافه کردن کلاس 'active' به آیتم کلیک‌شده
    $(event.currentTarget).addClass("active");
}



function getFormData(filterType) {

    let filters = {};
    if (filterType == "25Days") {
        let month = $("#myMonth").dxSelectBox('option', "value");
        let yearM = $("#myYear").dxSelectBox('option', "value");

        if (!month || !yearM) {
            return;
        } else {
            filters = { month: month, year: yearM, formName: 'f25', formDataId: 0 };

        }
    } else if (filterType == "100Days") {
        let season = $("#mySeason").attr("data-value");
        let yearS = $("#myYear").attr("data-value");

        if (!season || !yearS) {
            return;
        } else {
            filters = { season: season, year: yearS, formName: 'f100', formDataId: 0 };
        }
    }
    else if (filterType == "400Days") {
        let yearS = $("#myYear").attr("data-value");

        if (!yearS) {
            return;
        } else {

            filters = { year: yearS, formName: 'f400', formDataId: 0 };
        }
    }
    else {
        console.error("نوع فیلتر نامعتبر است");
        return;
    }

    $.ajax({
        url: "controller/loadAction.asmx/getFormData",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: filters }),
        success: function (response) {

            var result = JSON.parse(response.d)
            var res = result.data
            // globe = result.month

            //var checkUserForm = res.some(item => item.statusForm === 'submit' || item.statusForm === 'sent');
            //var checkCeoFormOne = res.some(item => item.statusForm === 'submit');
            //var checkCeoFormTwo = res.some(item => item.statusForm === 'notSent') || res.length == 0;

            const fillFormId = `#fillForm${filterType}`;
            const viewFormId = `#viewForm${filterType}`;

            if ($(fillFormId).length) {

                //if (checkUserForm && roleId !== 4) {
                //    $("#toast").css("background", "#dc35452e");
                //    $("#toast").css("border", "2px solid #D40E00");
                //    showToast("این فرم قبلا ثبت شده است لطفا برای مشاهده فرم به قسمت مشاهده فرم ها بروید");
                //} else if (checkCeoFormOne && roleId == 4) {
                //    $("#toast").css("background", "#dc35452e");
                //    $("#toast").css("border", "2px solid #D40E00");
                //    showToast("این فرم قبلا ثبت شده است لطفا برای مشاهده فرم به قسمت مشاهده فرم ها بروید");
                //} else if (checkCeoFormTwo && roleId == 4) {
                //    $("#toast").css("background", "#dc35452e");
                //    $("#toast").css("border", "2px solid #D40E00");
                //    showToast("در حال حاظر فرم آماده مشاهده نیست");
                //} else {
                genFormData(res);//top form section(compbo,...)
                checkFormAccess();
                executeDynamicFunction(`createForm${filterType}`, result);//call the corespnding function f25 , f100,f400
                $(fillFormId).slideDown();//show grid container
                //updateRowNumbers();

                //}
                //;
            } else if ($(viewFormId).length) {
                executeDynamicFunction(`viewForm${filterType}`, res);
                genViewFormData(res)
                $(viewFormId).slideDown();
                checkFormAccess();
            }

        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: " + error);
        }
    });
}

function generateAllDateLookupFrom(selectedYear, selectedMonth) {
    const lookupData = [];

    allData.year
        .filter(y => y.value >= selectedYear && y.value <= selectedYear + 1) // فقط سال‌های بزرگتر یا مساوی
        .forEach(year => {
            const y = year.value;

            allData.month
                .filter(m => (y > selectedYear) || (m.value >= selectedMonth)) // ماه‌های بعدی
                .forEach(month => {
                    const m = month.value.toString().padStart(2, '0');

                    for (let d = 1; d <= month.dayNum; d++) {
                        const day = d.toString().padStart(2, '0');
                        const value = `${y}${m}${day}`;
                        lookupData.push({
                            value: value,
                            year: y,
                            month: month.value,
                            day: d,
                            displayValue: `${y}/${m}/${day}`
                        });
                    }
                });
        });

    return lookupData;
}



var expandedKeys = [];
function expandGrid(id, rowKeys) {
    var targetGrid = $("#" + id).dxDataGrid('instance')
    rowKeys.forEach(function (item) {
        targetGrid.expandRow(item)
    })
}
function createForm25Days(db) {


    var data = db.data
    allFormData = data.slice();
    var canAdd = (db.actions[0]?.canAdd === undefined) ? true : db.actions[0]?.canAdd;
    var canReturn = (db.actions[0]?.canReturn === undefined) ? false : db.actions[0]?.canReturn;
    var canSend = (db.actions[0]?.canSend === undefined) ? true : db.actions[0]?.canSend;
    var canSelect = (db.actions[0]?.canSelect === undefined) ? true : db.actions[0]?.canSelect;
    var canRemove = (db.actions[0]?.canRemove === undefined) ? true : db.actions[0]?.canRemove;
    var canEdit = (db.actions[0]?.canEdit === undefined) ? true : db.actions[0]?.canEdit;
    var canEditStatus = (db.actions[0]?.canEditStatus === undefined) ? true : db.actions[0]?.canEditStatus;


    let monthN = $("#myMonth").dxSelectBox("instance").option("text");
    let yearN = $("#myYear").dxSelectBox("instance").option("text");

    const selectedYear = $("#myYear").dxSelectBox('option', 'value');
    const selectedMonth = $("#myMonth").dxSelectBox('option', 'value');

    const lookupData = generateAllDateLookupFrom(selectedYear, selectedMonth);

    let row = `<div class="fillFormTitle">${monthN} ${yearN}</div>`
    $("#headerForm25Days").html(row);

    $("#btnActionTblStatus").html('')

    $("#btnSend").hide()
    $("#btnReturn").hide()
    if (canReturn) {
        $("#btnReturn").show()
    }
    if (canSend) {
        $("#btnSend").show()
    }


    //try {

    //    $("#form25Days").dxDataGrid('option', 'dataSource', data.filter(o => { return o.parentId===null }));
    //} catch (e) {
    var columns = [
        {
            dataField: "id",
            caption: "ردیف",
            alignment: "center",
            allowEditing: false,
            calculateCellValue: function (rowData) {
                return data.indexOf(rowData) + 1;
            }

        },
        {
            dataField: "activityDesc",
            caption: "شرح فعالیت",
            width: "200px",
            allowEditing: canEdit,
            validationRules: [
                {
                    type: "required",
                    message: "فیلد شرح فعالیت الزامی است"
                }
            ],
            cellTemplate: function (cellElement, cellInfo) {
                const text = cellInfo.value || '';
                const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;

                // قرار دادن متن کوتاه‌شده در سلول با title برای نمایش کامل در tooltip
                cellElement
                    .text(shortText)
                    .attr("title", text)         // نمایش کامل متن در tooltip هنگام hover
                    .css({
                        "white-space": "nowrap",
                        "overflow": "hidden",
                        "text-overflow": "ellipsis",
                        "direction": "rtl"
                    });
            }
        },
        {
            dataField: "urgeId",
            caption: "طبقه اهمیت",
            allowEditing: canEdit,
            width: "110px",
            editorOptions: {
                placeholder: "طبقه اهمیت"
            },
            validationRules: [
                {
                    type: "required",
                    message: "فیلد طبقه اهمیت الزامی است"
                }
            ],
            lookup: {
                dataSource: allData.urge,
                valueExpr: "value",
                displayExpr: "name"
            },
            cellTemplate: function (container, options) {
                let className = options.data.uC ? options.data.uC.trim() : ""; // گرفتن مقدار کلاس از داده

                $("<div>")
                    .addClass(className) // مقدار واقعی را به کلاس اضافه کن
                    .text(options.text)
                    .appendTo(container);
            }
        },

        {
            dataField: "userId",
            caption: "مسئول انجام",
            allowEditing: false,
            allowFiltering: true,
            lookup: {
                dataSource: allData.users,
                valueExpr: "value",
                displayExpr: "name"
            },
        },
        {
            dataField: "managerId",
            caption: "پاسخگو انجام",
            allowEditing: false,
            allowFiltering: true,
            lookup: {
                dataSource: allData.users,
                valueExpr: "value",
                displayExpr: "name"
            }
        },

        {
            dataField: "userAdId",
            caption: "مشاور و همکار ",
            width: "200px",
            allowEditing: canEdit,
        },
        {
            dataField: "userAwId",
            caption: "مطلع از نتیجه ",
            allowEditing: canEdit,
            cellTemplate: function (cellElement, cellInfo) {
                const rawValue = cellInfo.data.userAwId;

                // اطمینان از اینکه مقدار داریم
                const uids = rawValue
                    ? rawValue.split(',').map(x => Number(x.trim()))
                    : [];

                // استخراج اسامی کاربران از آیدی‌ها
                const selectedNames = allData.users
                    .filter(user => uids.includes(user.value))
                    .map(user => user.name);

                // ساخت رشته نهایی برای نمایش
                const displayText = selectedNames.length > 0
                    ? selectedNames.join('، ')
                    : "-";

                // نمایش در سلول
                cellElement
                    .text(displayText)
                    .css("font-weight", "normal")
                    .css("color", "#444");
            },
            editCellTemplate: function (cellElement, cellInfo) {
                let initialValue = cellInfo.value;
                if (typeof initialValue === "string") {
                    initialValue = initialValue.split(',').map(v => v.trim());
                }

                const tagBox = $("<div>").dxTagBox({
                    items: allData.users,
                    value: initialValue || [],
                    valueExpr: "value",
                    displayExpr: "name",
                    placeholder: "انتخاب کنید",
                    showSelectionControls: true,
                    applyValueMode: "useButtons",
                    searchEnabled: true,
                    onValueChanged: function (e) {
                        const newValue = Array.isArray(e.value) ? e.value.join(',') : e.value;
                        cellInfo.setValue(newValue);
                    }
                });

                // افزودن دستی آیکون فلش کنار tagBox
                const wrapper = $("<div>").css({
                    position: "relative",
                    width: "100%"
                });

                const arrowIcon = $(`
                          <span style="
                              position: absolute;
                              top: 50%;
                              left: 10px;
                              transform: translateY(-50%);
                              pointer-events: none;">
                             <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                             </svg>
                          </span>
                     `);

                tagBox.appendTo(wrapper);
                arrowIcon.appendTo(wrapper);
                wrapper.appendTo(cellElement);
            }
        },

        {
            dataField: "dayFrom",
            caption: "از تاریخ",
            allowEditing: canEdit,
            validationRules: [
                {
                    type: "required",
                    message: "فیلد از تاریخ الزامی است"
                }
            ],
            editorOptions: {
                placeholder: "از تاریخ" // Change placeholder text
            },

            lookup: {
                dataSource: lookupData,
                valueExpr: "value",
                displayExpr: "displayValue"
            }
        },
        {
            dataField: "dayTo",
            caption: "تا تاریخ",
            allowEditing: canEdit,
            editorOptions: {
                placeholder: "تا تاریخ" // Change placeholder text
            },
            validationRules: [
                {
                    type: "required",
                    message: "فیلد تا تاریخ الزامی است"
                }
            ],
            //calculateDisplayValue: function (rowData) {
            //    return rowData.dateTo ? rowData.dateTo : "بدون مقدار"; // نمایش مقدار تاریخ
            //},
            lookup: {
                dataSource: lookupData,
                valueExpr: "value",
                displayExpr: "displayValue"
            }

        },
        {
            dataField: "statusId",
            caption: "وضعیت",
            allowEditing: canEditStatus,
            editorOptions: {
                placeholder: " وضعیت" // Change placeholder text
            },
            validationRules: [
                {
                    type: "required",
                    message: "فیلد وضعیت الزامی است"
                }
            ],
            lookup: {
                dataSource: allData.status,
                valueExpr: "value",
                displayExpr: "name"
            }
        },
        {
            dataField: "comment",
            caption: "توضیحات",
            allowEditing: canEdit,
            cellTemplate: function (cellElement, cellInfo) {
                const text = cellInfo.value || '';
                const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;

                // قرار دادن متن کوتاه‌شده در سلول با title برای نمایش کامل در tooltip
                cellElement
                    .text(shortText)
                    .attr("title", text)         // نمایش کامل متن در tooltip هنگام hover
                    .css({
                        "white-space": "nowrap",
                        "overflow": "hidden",
                        "text-overflow": "ellipsis",
                        "direction": "rtl"
                    });
            }
        }
    ]

    var editing = {
        mode: "row",
        allowUpdating: canEditStatus,
        allowAdding: canAdd,
        allowDeleting: canRemove,
        useIcons: true,
        texts: {
            confirmDeleteMessage: "آیا مطمئن هستید که این ردیف حذف شود؟",
            deleteRow: "حذف"
        }
    }
    let dataGrid = $("#form25Days").dxDataGrid({
        dataSource: data.filter(o => { return o.parentId === null }),
        //dataSource: new DevExpress.data.DataSource({
        //    store: data,
        //    filter: ["parentId", "=", null]   // فقط تسک اصلی
        //}),
        keyExpr: "formDataId",
        rtlEnabled: true,
        columnAutoWidth: true,
        paging: { enabled: false },
        columns: columns,
        headerFilter: {
            visible: true   
        },
        onRowExpanding: function (e) {
            if (!expandedKeys.includes(e.key)) {
                expandedKeys.push(e.key);
            }
            console.log(e)
        },
        onRowCollapsing: function (e) {
            const index = expandedKeys.indexOf(e.key);
            if (index > -1) expandedKeys.splice(index, 1);
            console.log(e)
        },

        masterDetail: {
            enabled: true,
            template: function (container, options) {
                $("<div>")
                    .addClass("masterDetailGrid")
                    .dxDataGrid({
                        dataSource: data.filter(o => { return o.parentId == options.key }),
                        keyExpr: "formDataId",
                        editing: editing,
                        columns: columns,
                        onInitNewRow: function (e) {
                            e.data.parentId = options.data.formDataId;
                            e.data.dataId = options.data.dataId;
                        },
                        onRowInserting: function (e) {
                            let newData = e.data;
                            newData.month = $("#myMonth").dxSelectBox("option", "value");
                            newData.year = $("#myYear").dxSelectBox("option", "value");
                            newData.parentId = options.data.formDataId;

                            return $.ajax({
                                url: "controller/loadAction.asmx/saveForm25Data",
                                type: "POST",
                                contentType: "application/json; charset=utf-8",
                                data: JSON.stringify({ data: newData }),
                                dataType: "json",
                                success: function (response) {
                                    manageUrlParam();
                                    showToast("✅ با موفقیت ذخیره شد");

                                }
                            });
                        },
                        onRowUpdating: function (e) {
                            let updatedData = Object.assign({}, e.oldData, e.newData);
                            updatedData.month = $("#myMonth").dxSelectBox("option", "value");
                            updatedData.year = $("#myYear").dxSelectBox("option", "value");


                            return $.ajax({
                                url: "controller/loadAction.asmx/UpdateRowFormData25",
                                type: "POST",
                                contentType: "application/json; charset=utf-8",
                                data: JSON.stringify({ data: updatedData }),
                                dataType: "json",
                                success: function (response) {
                                    showToast("✅ ویرایش با موفقیت انجام شد!", "success");
                                    manageUrlParam();
                                },
                                error: function (xhr, status, error) {
                                    console.error("❌ AJAX Error: " + error);
                                }
                            });
                        },
                        onRowRemoving: function (e) {
                            console.log("📌 removing subtask", e);
                            let formDataId = e.key.formDataId;

                            return $.ajax({
                                url: "controller/loadAction.asmx/deleteRowFormData",
                                type: "POST",
                                contentType: "application/json; charset=utf-8",
                                data: JSON.stringify({ formDataId: formDataId }),
                                dataType: "json",
                                success: function (response) {
                                    let result = JSON.parse(response.d);
                                    if (result === "success") {
                                        showToast("✅ ردیف با موفقیت حذف شد.", "success");
                                        manageUrlParam();
                                    } else {
                                        console.log("❌ خطا در حذف: " + result);
                                    }
                                },
                                error: function (xhr, status, error) {
                                    console.error("❌ AJAX Error: " + error);
                                }
                            });
                        }
                    })
                    .appendTo(container);
            }
        },
        editing: editing,
        export: {
            enabled: true,
            fileName: `گزارش_${monthN}_${yearN}`,
            allowExportSelectedData: true
        },
        onEditorPreparing: function (e) {
            if (e.parentType === "dataRow" && e.dataField === "unitId") {
                e.editorOptions.disabled = true; // باعث میشه حتی اگه allowEditing کار نکنه، این کار کنه
            }

        },
        onRowPrepared: function (e) {
            if (e.rowType === "data") {
                let dayTo = e.data.dayTo;   // مثل 14040522
                let status = e.data.status; // وضعیت تسک (مثلا "انجام شد")

                // اگر وضعیت انجام شد باشه → نرمال بمونه
                if (status === "انجام شد" || status === "done") {
                    return; // دیگه کاری با رنگش نداشته باش
                }

                if (dayTo) {
                    // گرفتن تاریخ امروز به شمسی (yyyymmdd)
                    const today = new Date();
                    const [jy, jm, jd] = gregorianToJalali(
                        today.getFullYear(),
                        today.getMonth() + 1,
                        today.getDate()
                    );

                    const todayNum = parseInt(
                        `${jy}${String(jm).padStart(2, '0')}${String(jd).padStart(2, '0')}`
                    );

                    // مقایسه ساده عددی
                    if (dayTo < todayNum) {
                        // گذشته
                        e.rowElement.css("background-color", "#f8d7da");
                        e.rowElement.css("color", "#721c24");
                    } else if (dayTo === todayNum) {
                        // امروز سررسیدشه
                        e.rowElement.css("background-color", "#fff3cd");
                        e.rowElement.css("color", "#856404");
                    }
                }
            }
        },
        onExporting: function (e) {
            if (e.format === "pdf") {
                const doc = new jsPDF();
                doc.text(`گزارش ${monthN} ${yearN}`, 14, 16);
                doc.autoTable({ html: "#fillForm25Days .dx-datagrid-table" });
                doc.save(`گزارش_${monthN}_${yearN}.pdf`);
                e.cancel = true;
            }
        },

        onRowInserting: function (e) {
            let newData = e.data;
            newData.month = $("#myMonth").dxSelectBox("option", "value");
            newData.year = $("#myYear").dxSelectBox("option", "value");
            newData.parentId = null;

            return $.ajax({
                url: "controller/loadAction.asmx/saveForm25Data",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ data: newData }),
                dataType: "json",
                success: function (response) {
                    manageUrlParam()
                    showToast("✅ با موفقیت ذخیره شد");
                }
            });
        },

        onRowUpdating: function (e) {

            let month = $("#myMonth").dxSelectBox("option", "value");
            let year = $("#myYear").dxSelectBox("option", "value");
            let updatedData = Object.assign({}, e.oldData, e.newData);
            updatedData.month = month;
            updatedData.year = year;
            return $.ajax({
                url: "controller/loadAction.asmx/UpdateRowFormData25",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ data: updatedData }),
                dataType: "json",
                success: function (response) {
                    showToast("✅ ویرایش با موفقیت انجام شد!", "success");
                    if (dataGrid) {
                        manageUrlParam()
                    } else {
                        console.error("❌ dataGrid مقداردهی نشده است.");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("❌ AJAX Error: " + error);
                }
            });
        },

        onRowRemoving: function (e) {

            let formDataId = e.data.formDataId;

            return $.ajax({
                url: "controller/loadAction.asmx/deleteRowFormData",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ formDataId: formDataId }),
                dataType: "json",
                success: function (response) {
                    let result = JSON.parse(response.d);
                    if (result === "success") {
                        manageUrlParam();
                        showToast("✅ ردیف با موفقیت حذف شد.", "success");
                    } else {
                        console.log("❌ خطا در حذف: " + result);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("❌ AJAX Error: " + error);
                }
            });
        },
        //onEditorPreparing: function (e) {
        //    if (e.parentType !== "dataRow") return;

        //    // غیرفعال کردن فیلد واحد
        //    if (e.dataField === "unitId") {
        //        e.editorOptions.disabled = true;
        //        return;
        //    }

        //    // اعمال lookup سفارشی فقط برای dayFrom و dayTo
        //    if (["dayFrom", "dayTo"].includes(e.dataField)) {
        //        const rowData = e.row.data;
        //        const selectedYear = rowData.year || $("#myYear").dxSelectBox("option", "value");
        //        const selectedMonth = rowData.month || $("#myMonth").dxSelectBox("option", "value");

        //        // مقدار فعلی فیلد (که ممکنه در لیست نباشه)
        //        const currentValue = rowData[e.dataField];

        //        // ساخت لیست بر اساس سال و ماه
        //        let lookupData = generateDateLookupWithFallback(selectedYear, selectedMonth, []);

        //        // بررسی اینکه مقدار فعلی در لیست هست یا نه، اگر نیست، اضافه‌اش کن
        //        if (currentValue && !lookupData.some(d => d.value == currentValue)) {
        //            const valStr = String(currentValue);
        //            if (/^\d{8}$/.test(valStr)) {
        //                const yy = valStr.substring(0, 4);
        //                const mm = valStr.substring(4, 6);
        //                const dd = valStr.substring(6, 8);
        //                lookupData.push({
        //                    value: valStr,
        //                    name: Number(dd),
        //                    displayValue: `${yy}/${mm}/${dd}`
        //                });
        //            }
        //        }

        //        //// ست کردن dataSource و بقیه مشخصات
        //        //e.editorOptions.dataSource = lookupData;
        //        //e.editorOptions.valueExpr = "value";
        //        //e.editorOptions.displayExpr = "displayValue";
        //    }
        //},
        onContentReady: function (e) {
            expandGrid("form25Days", expandedKeys)
            console.log('here')
        },

        showBorders: true,
        paging: { enabled: false }
    }).dxDataGrid("instance");

    //dataGrid.columnOption("dayFrom", "lookup.dataSource", lookupData);
    //dataGrid.columnOption("dayTo", "lookup.dataSource", lookupData);

    //if (data.length && data[0].statusForm == 'submit') {
    //    const grid = $("#form25Days").dxDataGrid("instance");

    //    grid.option("editing", {
    //        mode: "row",
    //        allowAdding: false,
    //        allowDeleting: false,
    //        allowUpdating: true
    //    });

    //    const columns = grid.option("columns");
    //    columns.forEach(col => {
    //        col.allowEditing = col.dataField === "statusId";
    //    });

    //    grid.option("columns", columns);
    //}
    //}
}
function createForm100Days(data) {

    let seasonN = $("#mySeason").dxSelectBox("instance").option("text");
    let yearN = $("#myYear").dxSelectBox("instance").option("text");
    let season = $("#mySeason").attr("data-value")
    var monthOfDecades = allData.month.filter(function (item) {

        return item.paSeason == season
    });
    var decade = [
        { name: 'دهه اول', dFrom: "01", dTo: "10" },
        { name: 'دهه دوم', dFrom: "11", dTo: "20" },
        { name: 'دهه سوم', dFrom: "21", dTo: "31" }
    ];

    var lookupData = [];
    allData.year.forEach(function (year) {
        allData.month.forEach(function (month) {
            decade.forEach(function (dec) {
                lookupData.push({
                    name: `${dec.name} - ${month.name}`,
                    value: `${dec.dFrom}-${dec.dTo}`,
                    dayFrom: year.name + ('0' + month.value).slice(-2) + dec.dFrom,
                    dayTo: year.name + ('0' + month.value).slice(-2) + dec.dTo
                });
            });
        });
    })
    let row = `<div class="fillFormTitle">${seasonN} ${yearN}</div>`
    $("#headerForm100Days").html(row);

    let footer = ` <div class="btnActionTbl" id="btnActionTbl"></div>`
    $("#footerForm100Days").html(footer);


    let dataGrid = $("#form100Days").dxDataGrid({
        dataSource: data,
        keyExpr: "formDataId",
        rtlEnabled: true,
        columnAutoWidth: true,
        rowHeight: 50,
        paging: { enabled: false },
        selection: { mode: "single" },
        columns: [
            {
                dataField: "id",
                caption: "ردیف",
                width: 50,
                fixed: true,
                alignment: "center",
                allowEditing: false,
                calculateCellValue: function (rowData) {
                    return data.indexOf(rowData) + 1;
                }

            },
            {
                dataField: "activityDesc",
                caption: "شرح فعالیت",
                validationRules: [{ type: "required" }],
                editorOptions: {
                    placeholder: "شرح فعالیت" // Change placeholder text
                },
                width: "300",
                fixed: true
            },
            {
                dataField: "urgeId",
                caption: "طبقه اهمیت",
                lookup: {
                    dataSource: allData.urge,
                    valueExpr: "value",
                    displayExpr: "name",
                    width: "145",
                },
                editorOptions: {
                    placeholder: "اهمیت" // Change placeholder text
                },
                cellTemplate: function (container, options) {
                    let className = options.data.uC ? options.data.uC.trim() : "";

                    $("<div>")
                        .addClass(className)
                        .text(options.text)
                        .appendTo(container);
                },
                width: "145",
                fixed: true
            },
            {
                dataField: "userRId",
                caption: "مسئول انجام کار",
                lookup: {
                    dataSource: allData.users,
                    valueExpr: "value",
                    displayExpr: "name",
                    width: "145"

                },
                editorOptions: {
                    placeholder: "مسئول" // Change placeholder text
                },
                width: "145",
                fixed: true
            },

            {
                dataField: "dayFrom",
                caption: "از دهه",

                lookup: {
                    dataSource: lookupData, // مقدار داینامیک دریافت‌شده
                    valueExpr: "dayFrom",
                    displayExpr: "name",
                    width: "129",

                },
                editorOptions: {
                    placeholder: "شروع" // Change placeholder text
                },
                width: 129,
                fixed: true
            },
            {
                dataField: "dayTo",
                caption: "تا دهه",
                lookup: {
                    dataSource: lookupData, // مقدار داینامیک دریافت‌شده
                    valueExpr: "dayTo",
                    displayExpr: "name",
                    width: "129"

                },
                editorOptions: {
                    placeholder: "پایان" // Change placeholder text
                },
                width: "129",
                fixed: true

            },
            {
                dataField: "statusId",
                caption: "وضعیت",
                lookup: {
                    dataSource: allData.status,
                    valueExpr: "value",
                    displayExpr: "name",
                    width: "129"
                },
                editorOptions: {
                    placeholder: "وضعیت" // Change placeholder text
                },
                width: "129",
                fixed: true
            }
        ],


        masterDetail: {

            enabled: true, // فعال‌سازی قابلیت جزئیات
            template: function (container, options) {
                $("<div>")
                    .addClass("activity-details")
                    .text(options.data.activityDesc)
                    .css({
                        "width": "100%",
                        "overflow": "hidden",
                        "max-height": "150px"
                    })
                    .appendTo(container);
            }
        },
        editing: {
            mode: "row",
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: true,
            useIcons: true,
            texts: {
                confirmDeleteMessage: "آیا مطمئن هستید که این ردیف حذف شود؟",
                deleteRow: "حذف"
            }
        },
        export: {
            enabled: true,
            fileName: `گزارش_${seasonN}_${yearN}`,
            allowExportSelectedData: true
        },

        onExporting: function (e) {
            if (e.format === "pdf") {
                const doc = new jsPDF();
                doc.text(`گزارش ${seasonN} ${yearN}`, 14, 16);
                doc.autoTable({ html: "#fillForm25Days .dx-datagrid-table" });
                doc.save(`گزارش_${seasonN}_${yearN}.pdf`);
                e.cancel = true;
            }
        },

        onRowInserting: function (e) {

            let newData = e.data;
            let season = $("#mySeason").attr("data-value");
            let year = $("#myYear").attr("data-value");
            newData.season = season;
            newData.year = year;

            return $.ajax({
                url: "controller/loadAction.asmx/saveForm100Data",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ data: newData }),
                dataType: "json",
                success: function (response) {
                    showToast("✅ ردیف جدید با موفقیت اضافه شد!");
                    dataGrid.refresh();
                },
                error: function (xhr, status, error) {
                    console.error("❌ AJAX Error: " + error);
                }
            });
        },

        onRowUpdating: function (e) {

            let season = $("#mySeason").attr("data-value");
            let year = $("#myYear").attr("data-value");
            let updatedData = Object.assign({}, e.oldData, e.newData);
            updatedData.season = season;
            updatedData.year = year;

            return $.ajax({
                url: "controller/loadAction.asmx/UpdateRowFormData100",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ data: updatedData }),
                dataType: "json",
                success: function (response) {
                    showToast("✅ ویرایش با موفقیت انجام شد!", "success");
                    if (dataGrid) {
                        dataGrid.refresh();
                    } else {
                        console.error("❌ dataGrid مقداردهی نشده است.");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("❌ AJAX Error: " + error);
                }
            });
        },

        onRowRemoving: function (e) {
            let formDataId = e.key;

            return $.ajax({
                url: "controller/loadAction.asmx/deleteRowFormData",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ formDataId: formDataId }),
                dataType: "json",
                success: function (response) {
                    let result = JSON.parse(response.d);
                    if (result === "success") {
                        showToast("✅ ردیف با موفقیت حذف شد.", "success");
                    } else {
                        console.log("❌ خطا در حذف: " + result);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("❌ AJAX Error: " + error);
                }
            });
        },

        showBorders: true,
        paging: { enabled: false }
    }).dxDataGrid("instance");

    if (data.length && data[0].statusForm == 'submit') {
        const grid = $("#form100Days").dxDataGrid("instance");

        grid.option("editing", {
            mode: "row",
            allowAdding: false,
            allowDeleting: false,
            allowUpdating: true
        });

        const columns = grid.option("columns");
        columns.forEach(col => {
            col.allowEditing = col.dataField === "statusId";
        });

        grid.option("columns", columns);
    }
}
function createForm400Days(data) {

    let yearN = $("#myYear").dxSelectBox("instance").option("text");

    var centuries = [
        { name: '100 روز اول', mFrom: "1", mTo: "3", endDay: 31 },
        { name: '100 روز دوم', mFrom: "4", mTo: "6", endDay: 31 },
        { name: '100 روز سوم', mFrom: "7", mTo: "9", endDay: 30 },
        { name: '100 روز چهارم', mFrom: "10", mTo: "12", endDay: 30 }
    ];
    var seasons = allData.month
    let lookupData = [];
    seasons.forEach(function (season) {
        centuries.forEach(function (cent) {
            if (season.value >= cent.mFrom && season.value <= cent.mTo) {
                lookupData.push({
                    name: `${cent.name} - ماه ${season.name}`,
                    value: `${season.value}`,
                    dayFrom: yearN + ('0' + season.value).slice(-2) + "01",
                    dayTo: yearN + ('0' + season.value).slice(-2) + cent.endDay
                });
            }
        });
    });


    let row = `<div class="fillFormTitle"> ${yearN}</div>`
    $("#headerForm400Days").html(row);

    let footer = ` <div class="btnActionTbl" id="btnActionTbl"></div>`
    $("#footerForm400Days").html(footer);


    let dataGrid = $("#form400Days").dxDataGrid({
        dataSource: data,
        keyExpr: "formDataId",
        rtlEnabled: true,
        columnAutoWidth: true,
        rowHeight: 50,
        paging: { enabled: false },
        selection: { mode: "single" },
        columns: [
            {
                dataField: "id",
                caption: "ردیف",
                width: 50,
                alignment: "center",
                allowEditing: false,
                calculateCellValue: function (rowData) {
                    return data.indexOf(rowData) + 1;
                }
            },
            {
                caption: "نام پروژه/فعالیت",
                dataField: "activityDesc",
                alignment: "center",
                width: "500"
            },
            {
                dataField: "urgeId",
                caption: "طبقه اهمیت",
                editorOptions: {
                    placeholder: "طبقه اهمیت" // Change placeholder text
                },
                lookup: {
                    dataSource: allData.urge,
                    valueExpr: "value",
                    displayExpr: "name",
                    width: "145"
                },
                cellTemplate: function (container, options) {
                    let className = options.data.uC ? options.data.uC.trim() : "";

                    $("<div>")
                        .addClass(className)
                        .text(options.text)
                        .appendTo(container);
                },
                width: "145"
            },
            {
                dataField: "dayFrom",
                caption: "از صده",
                editorOptions: {
                    placeholder: "از صده" // Change placeholder text
                },
                lookup: {
                    dataSource: lookupData, // مقدار داینامیک دریافت‌شده
                    valueExpr: "dayFrom",
                    displayExpr: "name",
                    width: "300"
                },
                width: 300
            },
            {
                dataField: "dayTo",
                caption: "تا صده",
                editorOptions: {
                    placeholder: "تا صده" // Change placeholder text
                },
                lookup: {
                    dataSource: lookupData, // مقدار داینامیک دریافت‌شده
                    valueExpr: "dayTo",
                    displayExpr: "name",
                    width: "300"
                },
                width: 300
            },
            {
                dataField: "statusId",
                caption: "وضعیت",
                editorOptions: {
                    placeholder: "وضعیت"
                },
                lookup: {
                    dataSource: allData.status,
                    valueExpr: "value",
                    displayExpr: "name",
                },
                width: 145
            }
        ],
        masterDetail: {

            enabled: true, // فعال‌سازی قابلیت جزئیات
            template: function (container, options) {
                $("<div>")
                    .addClass("activity-details")
                    .text(options.data.activityDesc)
                    .css({
                        "width": "100%",
                        "overflow": "hidden",
                        "max-height": "150px"
                    })
                    .appendTo(container);
            }
        },
        editing: {
            mode: "row",
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: true,
            useIcons: true,
            texts: {
                confirmDeleteMessage: "آیا مطمئن هستید که این ردیف حذف شود؟",
                deleteRow: "حذف"
            }
        },
        export: {
            enabled: true,
            fileName: `گزارش_${yearN}`,
            allowExportSelectedData: true
        },

        onExporting: function (e) {
            if (e.format === "pdf") {
                const doc = new jsPDF();
                doc.text(`گزارش ${yearN}`, 14, 16);
                doc.autoTable({ html: "#fillForm25Days .dx-datagrid-table" });
                doc.save(`گزارش_${yearN}.pdf`);
                e.cancel = true;
            }
        }
        ,

        onRowInserting: function (e) {
            let newData = e.data;
            let year = $("#myYear").attr("data-value");
            newData.year = year;

            return $.ajax({
                url: "controller/loadAction.asmx/saveForm400Data",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ data: newData }),
                dataType: "json",
                success: function (response) {
                    showToast("✅ ردیف جدید با موفقیت اضافه شد!");
                    dataGrid.refresh();
                },
                error: function (xhr, status, error) {
                    console.error("❌ AJAX Error: " + error);
                }
            });
        },

        onRowUpdating: function (e) {

            let year = $("#myYear").attr("data-value");
            let updatedData = Object.assign({}, e.oldData, e.newData);
            updatedData.year = year;

            return $.ajax({
                url: "controller/loadAction.asmx/UpdateRowFormData400",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ data: updatedData }),
                dataType: "json",
                success: function (response) {
                    showToast("✅ ویرایش با موفقیت انجام شد!", "success");
                    if (dataGrid) {
                        dataGrid.refresh();
                    } else {
                        console.error("❌ dataGrid مقداردهی نشده است.");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("❌ AJAX Error: " + error);
                }
            });
        },

        onRowRemoving: function (e) {
            let formDataId = e.key;

            return $.ajax({
                url: "controller/loadAction.asmx/deleteRowFormData",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ formDataId: formDataId }),
                dataType: "json",
                success: function (response) {
                    let result = JSON.parse(response.d);
                    if (result === "success") {
                        showToast("✅ ردیف با موفقیت حذف شد.", "success");
                    } else {
                        console.log("❌ خطا در حذف: " + result);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("❌ AJAX Error: " + error);
                }
            });
        },

        showBorders: true,
        paging: { enabled: false }
    }).dxDataGrid("instance");

    if (data.length && data[0].statusForm == 'submit') {
        const grid = $("#form400Days").dxDataGrid("instance");

        grid.option("editing", {
            mode: "row",
            allowAdding: false,
            allowDeleting: false,
            allowUpdating: true
        });

        const columns = grid.option("columns");
        columns.forEach(col => {
            col.allowEditing = col.dataField === "statusId";
        });

        grid.option("columns", columns);
    }

}


function genFormData(arr) {
    let serverCreationDate = arr[0]?.creationDate || 0;
    let serverCompletedDate = arr[0]?.completedDate || 0;

    let htmlDate = ''
    if (arr.length) {
        htmlDate = `  <div class="createDate">
                                <p>تاریخ ایجاد فرم :</p>
                                <small class="crDate" id=crDate></small>
                            </div>
                            <div class="completeDate">
                                <div class="comp">
                                    <p>تاریخ تکمیل فرم :</p>
                                    <small class="ComDate" id="comDate"></small>
                                </div>`
        if (arr[0].completedDate) {
            htmlDate += `<div class="btnComDate">
                                                      تکمیل شده
                                                      </div>`
        } else {
            htmlDate += `<div class="btnDontComDate">
                                                      تکمیل نشده
                                                      </div>`
        }
        htmlDate += `</div>`
    }


    $("#introDate").html(htmlDate)
    formatDateToJalali(serverCreationDate, 'crDate');
    formatDateToJalali(serverCompletedDate, 'comDate');

}
////////////////////View Forms
function viewForm25Days(data) {
    let monthN = $("#myMonth").dxSelectBox("instance").option("text");
    let yearN = $("#myYear").dxSelectBox("instance").option("text");

    let row = `<div class="fillFormTitle">${monthN} ${yearN}</div>`;
    $("#headerViewForm25Days").html(row);

    // 📌 cellTemplate پیش‌فرض برای نشون دادن "-" وقتی مقدار خالیه
    function defaultCellTemplate(cellElement, cellInfo) {
        let value = (cellInfo.text && cellInfo.text.toString().trim() !== "")
            ? cellInfo.text
            : "-";
        cellElement.text(value);
    }

    // 📌 ستون‌های مشترک
    let mainColumns = [
        {
            dataField: "id",
            caption: "ردیف",
            alignment: "center",
            allowEditing: false,
            calculateCellValue: function (rowData) {
                return data.indexOf(rowData) + 1;
            }
        },
        {
            dataField: "unitId",
            caption: "واحد",
            allowEditing: false,
            calculateCellValue: function (rowData) {
                const unit = allData.units.find(u => u.value === rowData.unitId);
                return unit ? unit.name : "-";
            }
        },
        {
            dataField: "activityDesc",
            caption: "شرح فعالیت",
            width: "200px",
            cellTemplate: function (cellElement, cellInfo) {
                const text = cellInfo.value || '';
                if (!text.trim()) {
                    cellElement.text("-");
                    return;
                }
                const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;
                cellElement
                    .text(shortText)
                    .attr("title", text)
                    .css({
                        "white-space": "nowrap",
                        "overflow": "hidden",
                        "text-overflow": "ellipsis",
                        "direction": "rtl"
                    });
            }
        },
        {
            dataField: "urgeId",
            caption: "طبقه اهمیت",
            lookup: {
                dataSource: allData.urge,
                valueExpr: "value",
                displayExpr: "name"
            },
            cellTemplate: function (container, options) {
                if (!options.text) {
                    container.text("-");
                    return;
                }
                let className = options.data.uC ? options.data.uC.trim() : "";
                $("<div>").addClass(className).text(options.text).appendTo(container);
            }
        },
        {
            dataField: "userRId",
            caption: "مسئول انجام",
            lookup: { dataSource: allData.users, valueExpr: "value", displayExpr: "name" },
            cellTemplate: defaultCellTemplate
        },
        {
            dataField: "userAId",
            caption: "پاسخگو انجام",
            lookup: { dataSource: allData.users, valueExpr: "value", displayExpr: "name" },
            cellTemplate: defaultCellTemplate
        },
        {
            dataField: "userAdId",
            caption: "مشاور و همکار",
            cellTemplate: function (cellElement, cellInfo) {
                const rawValue = cellInfo.data.userAdId;
                const uids = rawValue ? rawValue.split(',').map(x => Number(x.trim())) : [];
                const selectedNames = allData.users
                    .filter(user => uids.includes(user.value))
                    .map(user => user.name);
                const displayText = selectedNames.length > 0 ? selectedNames.join('، ') : "-";
                cellElement.text(displayText).css("color", "#444");
            }
        },
        {
            dataField: "userAwId",
            caption: "مطلع از نتیجه",
            cellTemplate: function (cellElement, cellInfo) {
                const rawValue = cellInfo.data.userAwId;
                const uids = rawValue ? rawValue.split(',').map(x => Number(x.trim())) : [];
                const selectedNames = allData.users
                    .filter(user => uids.includes(user.value))
                    .map(user => user.name);
                const displayText = selectedNames.length > 0 ? selectedNames.join('، ') : "-";
                cellElement.text(displayText).css("color", "#444");
            }
        },
        {
            dataField: "dateFrom",   // ✅ همون چیزی که خودت داشتی
            caption: "بازه فعالیت",
            cellTemplate: function (container, options) {
                let html = genDaysBox(options.data);
                $(container).html(html || "-");
            }
        },
        {
            dataField: "statusId",
            caption: "وضعیت",
            lookup: { dataSource: allData.status, valueExpr: "value", displayExpr: "name" },
            cellTemplate: defaultCellTemplate
        },
        {
            dataField: "comment",
            caption: "توضیحات",
            cellTemplate: function (cellElement, cellInfo) {
                const text = cellInfo.value || '';
                if (!text.trim()) {
                    cellElement.text("-");
                    return;
                }
                const shortText = text.length > 50 ? text.substring(0, 50) + '...' : text;
                cellElement
                    .text(shortText)
                    .attr("title", text)
                    .css({
                        "white-space": "nowrap",
                        "overflow": "hidden",
                        "text-overflow": "ellipsis",
                        "direction": "rtl"
                    });
            }
        }
    ];

    // 📌 grid اصلی
    $("#viewForm25Days").dxDataGrid({
        dataSource: new DevExpress.data.DataSource({
            store: data,
            filter: ["parentId", "=", null]   // فقط تسک‌های اصلی
        }),
        keyExpr: "formDataId",
        rtlEnabled: true,
        columnAutoWidth: true,
        paging: { enabled: false },
        selection: { mode: "single" },
        columns: mainColumns,
        masterDetail: {
            enabled: true,
            autoExpandAll: false,
            template: function (container, options) {
                let hasChild = data.some(sub => sub.parentId === options.data.formDataId);

                if (hasChild) {
                    $("<div>")
                        .addClass("masterDetailGrid")
                        .dxDataGrid({
                            dataSource: new DevExpress.data.DataSource({
                                store: data,
                                filter: ["parentId", "=", options.key.formDataId]
                            }),
                            keyExpr: "formDataId",
                            rtlEnabled: true,
                            columnAutoWidth: true,
                            paging: { enabled: false },
                            selection: { mode: "single" },
                            columns: columns,
                            showBorders: true
                        })
                        .appendTo(container);
                } else {
                    $("<div>").addClass("masterDetailGrid").hide().appendTo(container);
                    $(".dx-datagrid-group-closed").hide()
                }
            },
            hasDetail: function (rowData) {
                // 🔹 فقط وقتی subTask داره فلش نشون بده
                return data.some(sub => sub.parentId === rowData.formDataId);
            }
        },
        export: {
            enabled: true,
            fileName: `گزارش_${monthN}_${yearN}`,
            allowExportSelectedData: true
        },
        onExporting: function (e) {
            if (e.format === "pdf") {
                const doc = new jsPDF();
                doc.text(`گزارش ${monthN} ${yearN}`, 14, 16);
                doc.autoTable({ html: "#viewForm25Days .dx-datagrid-table" });
                doc.save(`گزارش_${monthN}_${yearN}.pdf`);
                e.cancel = true;
            }
        },
        showBorders: true,
        paging: { enabled: false }
    }).dxDataGrid("instance");
}




function viewForm100Days(data) {
    let monthN = $("#mySeason").dxSelectBox("instance").option("text");
    let yearN = $("#myYear").dxSelectBox("instance").option("text");

    let row = `<div class="fillFormTitle">${monthN} ${yearN}</div>`
    $("#headerViewForm100Days").html(row);


    $("#viewForm100Days").dxDataGrid({
        dataSource: data,
        keyExpr: "formDataId",
        rtlEnabled: true,
        columnAutoWidth: true,
        paging: { enabled: false },
        selection: { mode: "single" },
        columns: [
            {
                dataField: "id",
                caption: "ردیف",
                width: 50,
                fixed: true,
                alignment: "center",
                allowEditing: false,
                calculateCellValue: function (rowData) {
                    return data.indexOf(rowData) + 1;
                }

            },
            {
                dataField: "activityDesc",
                caption: "شرح فعالیت",
                validationRules: [{ type: "required" }],
                width: "520",
                fixed: true
            },

            {
                dataField: "urgeId",
                caption: "طبقه اهمیت",
                lookup: {
                    dataSource: allData.urge,
                    valueExpr: "value",
                    displayExpr: "name"
                },
                cellTemplate: function (container, options) {
                    let className = options.data.uC ? options.data.uC.trim() : "";

                    $("<div>")
                        .addClass(className)
                        .text(options.text)
                        .appendTo(container);
                },
                width: "145",
                fixed: true
            },

            {
                dataField: "userRId",
                caption: "مسئول انجام",
                lookup: {
                    dataSource: allData.users,
                    valueExpr: "value",
                    displayExpr: "name"
                },
                width: "200",
                fixed: true
            },
            {
                dataField: "dayFrom",
                caption: "از دهه",
                width: "200",
                fixed: true
            },
            {
                dataField: "dayTo",
                caption: "تا دهه",
                width: "200",
                fixed: true
            },
            {
                dataField: "statusId",
                caption: "وضعیت",
                lookup: {
                    dataSource: allData.status,
                    valueExpr: "value",
                    displayExpr: "name"
                },

                width: "200",
                fixed: true
            }
        ],


        masterDetail: {

            enabled: true,
            template: function (container, options) {
                $("<div>")
                    .addClass("activity-details")
                    .text(options.data.activityDesc)
                    .css({
                        "width": "100%",
                        "overflow": "hidden",
                        "max-height": "150px"
                    })
                    .appendTo(container);
            }
        },
        export: {
            enabled: true,
            fileName: `گزارش_${monthN}_${yearN}`,
            allowExportSelectedData: true
        },

        onExporting: function (e) {
            if (e.format === "pdf") {
                const doc = new jsPDF();
                doc.text(`گزارش ${monthN} ${yearN}`, 14, 16);
                doc.autoTable({ html: "#fillForm25Days .dx-datagrid-table" });
                doc.save(`گزارش_${monthN}_${yearN}.pdf`);
                e.cancel = true;
            }
        },

        showBorders: true,
        paging: { enabled: false }
    }).dxDataGrid("instance");

}
function viewForm400Days(data) {
    let yearN = $("#myYear").dxSelectBox("instance").option("text");
    let row = `<div class="fillFormTitle">${yearN}</div>`
    $("#headerViewForm400Days").html(row);

    $("#viewForm400Days").dxDataGrid({
        dataSource: data,
        keyExpr: "formDataId",
        rtlEnabled: true,
        columnAutoWidth: true,
        paging: { enabled: false },
        selection: { mode: "single" },
        columns: [
            {
                dataField: "id",
                caption: "ردیف",
                width: 50,
                fixed: true,
                alignment: "center",
                allowEditing: false,
                calculateCellValue: function (rowData) {
                    return data.indexOf(rowData) + 1;
                }

            },
            {
                dataField: "activityDesc",
                caption: "شرح فعالیت",
                fixed: true
            },

            {
                dataField: "urgeId",
                caption: "طبقه اهمیت",
                lookup: {
                    dataSource: allData.urge,
                    valueExpr: "value",
                    displayExpr: "name"
                },
                cellTemplate: function (container, options) {
                    let className = options.data.uC ? options.data.uC.trim() : "";

                    $("<div>")
                        .addClass(className)
                        .text(options.text)
                        .appendTo(container);
                },
                width: "200",
                fixed: true
            },
            {
                dataField: "dayFrom",
                caption: "از صده",
                fixed: true
            },
            {
                dataField: "dayTo",
                caption: "تا صده",
                fixed: true
            },
            {
                dataField: "statusId",
                caption: "وضعیت",
                lookup: {
                    dataSource: allData.status,
                    valueExpr: "value",
                    displayExpr: "name"
                },
                fixed: true
            }
        ],


        masterDetail: {

            enabled: true,
            template: function (container, options) {
                $("<div>")
                    .addClass("activity-details")
                    .text(options.data.activityDesc)
                    .css({
                        "width": "100%",
                        "overflow": "hidden",
                        "max-height": "150px"
                    })
                    .appendTo(container);
            }
        },

        showBorders: true,
        paging: { enabled: false }
    }).dxDataGrid("instance");

}


function genViewFormData(arr) {

    let serverCreationDate = arr[0]?.creationDate || 0;
    let serverCompletedDate = arr[0]?.completedDate || 0;

    let htmlDate = ''
    if (arr.length) {
        htmlDate = `  <div class="createDate">
                                <p>تاریخ ایجاد فرم :</p>
                                <small class="crDate" id=crDate></small>
                            </div>
                            <div class="completeDate">
                                <div class="comp">
                                    <p>تاریخ تکمیل فرم :</p>
                                    <small class="ComDate" id="comDate"></small>
                                </div>`
        if (arr[0].completedDate) {
            htmlDate += `<div class="btnComDate">
                                                      تکمیل شده
                                                      </div>`
        } else {
            htmlDate += `<div class="btnDontComDate">
                                                      تکمیل نشده
                                                      </div>`
        }
        htmlDate += `</div>`
    }

    $("#introDate").html(htmlDate)
    formatDateToJalali(serverCreationDate, 'crDate');
    formatDateToJalali(serverCompletedDate, 'comDate');
}
function genDaysBox(result) {
    let day = "";
    let dayFrom = parseInt(JSON.stringify(result.dayFrom).slice(-2))
    let dayTo = parseInt(JSON.stringify(result.dayTo).slice(-2))
    for (let i = 1; i <= 31; i++) {
        const isHighlighted = (i >= dayFrom && i <= dayTo)
            ? `style="background-color: #${result.uColor}"`
            : '';
        day += `<div class="dateDay" ${isHighlighted}>${i}</div>`;
    }
    return `<div class="row bodyIntTime" id="bodyIntTime"> ${day}</div>`
}

function genProgressBar(result) {
    let progressBar = ""

}


//section of Forms
function updateRowNumbers() {
    $("#showRowBody").find(".RowBody").each(function (index) {
        $(this).find(".titleR").text(index + 1);
    });
    $("#showRowBody").find(".RowBody100").each(function (index) {
        $(this).find(".titleR").text(index + 1);
    });
    $("#bodyVFT").find(".bodyRow").each(function (index) {
        $(this).find(".titleR").text(index + 1);
    });
}
function deleteForm() {
    let month = $("#myMonth").attr("data-value");
    let season = $("#mySeason").attr("data-value");
    let year = $("#myYear").attr("data-value");
    let formName = '';

    if (month && month.length) {
        formName = 'f25';
    }
    else if (season && season.length) {
        formName = 'f100';
    }
    else {
        formName = 'f400';
    }
    let data = {
        month: month,
        season: season,
        year: year,
        formName: formName
    };
    openDialog("آیا از حذف فرم اطمینان دارید؟");


    $('#confirmAction').on('click', function () {
        $.ajax({
            url: "controller/loadAction.asmx/deleteForm25Days",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ data: data }),
            success: function (response) {
                var result = JSON.parse(response.d)
                $("#fillForm").css("display", "none")
                $("#toast").css("background", "#48bb782b")
                $("#toast").css("border", "2px solid #48BB78")
                showToast("فرم با موفقیت حذف گردید")
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error: " + error);
            }
        });
        $('#dialogOverlay').fadeOut(200);
    });



}
function submitForm() {
    const action = getUrlParam("action"); // e.g. "CreateForm25Days"
    const match = action.match(/\d+/);    // find digits
    const fCode = match ? `f${match[0]}` : null;


    var month = $("#myMonth").dxSelectBox('option', 'value')
    var year = $("#myYear").dxSelectBox('option', 'value')
    var season = $("#season").dxSelectBox('option', 'value')

    var mainGrid = $("#form25Days").dxDataGrid("instance");
    if (!mainGrid) {
        showToast("Grid پیدا نشد", "error");
        return;
    }

    var allFormData = mainGrid.getDataSource().items();
    if (!allFormData || allFormData.length === 0) {
        showToast("فرم خالی است", "error");
        return;
    }



    // 📌 انتخاب Master
    let idsTask = mainGrid.getSelectedRowKeys().map(r => r.formDataId);

    // 📌 انتخاب SubGridها (ذخیره شده در onSelectionChanged)
    let idsSubTask = Object.values(subTaskSelections || {})
        .reduce((acc, arr) => acc.concat(arr), []);

    let ids = [];

    if (idsTask.length === 0 && idsSubTask.length === 0) {
        // 📌 اگر هیچ انتخابی نشده → همه Master + همه Sub
        ids = allFormData.map(r => r.formDataId);
    } else {
        // 📌 اگر انتخاب شده → فقط انتخاب‌ها
        ids = [...idsTask, ...idsSubTask];
    }

    let idsStr = ids.join(",");

    var data = {
        month: month,
        year: year,
        season: season,
        formName: fCode,
        formDataIds: idsStr,

    };


    $.ajax({
        url: "controller/loadAction.asmx/submitForm",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data }),
        success: function (response) {
            var result = JSON.parse(response.d);
            result = result[0];
            if (result.success) {
                showToast(result.message, "success");
                manageUrlParam();
            } else if (!result.success) {
                showToast(result.message, "error");
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: " + error);
        }
    });
}
function returnForm() {
    const action = getUrlParam("action"); // e.g. "CreateForm25Days"
    const match = action.match(/\d+/);    // find digits
    const fCode = match ? `f${match[0]}` : null;
    var month = $("#myMonth").dxSelectBox('option', 'value')
    var year = $("#myYear").dxSelectBox('option', 'value')
    var season = $("#season").dxSelectBox('option', 'value')

    var mainGrid = $("#form25Days").dxDataGrid("instance");
    if (!mainGrid) {
        showToast("Grid پیدا نشد", "error");
        return;
    }

    var allFormData = mainGrid.getDataSource().items();
    if (!allFormData || allFormData.length === 0) {
        showToast("فرم خالی است", "error");
        return;
    }
    var data = {
        month: month,
        year: year,
        season: season,
        formName: fCode
    };

    $.ajax({
        url: "controller/loadAction.asmx/returnForm",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data }),
        success: function (response) {
            var result = JSON.parse(response.d);
            result = result[0];
            if (result.success) {
                showToast(result.message, "success");
                manageUrlParam();
            } else if (!result.success) {
                showToast(result.message, "error");
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: " + error);
        }
    });
}

function finalSubmitForm() {
    var mainGrid = $("#form25Days").dxDataGrid("instance");

    if (!mainGrid) {
        showToast("Grid پیدا نشد", "error");
        return;
    }

    // 📌 انتخاب Master
    let idsTask = mainGrid.getSelectedRowKeys().map(r => r.formDataId);

    // 📌 انتخاب SubGridها (ذخیره شده در onSelectionChanged)
    let idsSubTask = Object.values(subTaskSelections || {})
        .reduce((acc, arr) => acc.concat(arr), []);

    let ids = [];

    if (idsTask.length === 0 && idsSubTask.length === 0) {
        // 📌 اگر هیچ انتخابی نشده → همه Master + همه Sub
        ids = allFormData.map(r => r.formDataId);
    } else {
        // 📌 اگر انتخاب شده → فقط انتخاب‌ها
        ids = [...idsTask, ...idsSubTask];
    }

    let idsStr = ids.join(",");

    // 📌 گرفتن ماه/سال/فصل
    let month = $("#myMonth").dxSelectBox('option', 'value');
    let year = $("#myYear").dxSelectBox('option', 'value');
    let season = $("#mySeason").dxSelectBox('option', 'value');

    // 📌 نوع فرم
    let formName = '';
    if (month) formName = 'f25';
    else if (season) formName = 'f100';
    else if (year) formName = 'f400';

    let data = {
        month, season, year,
        formName,
        formDataIds: idsStr,
        actionType: "submit"
    };



    $.ajax({
        url: "controller/loadAction.asmx/finalSubmitForm",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data }),
        success: function (response) {
            let parsed = JSON.parse(response.d);
            let result = Array.isArray(parsed) ? parsed[0] : parsed;

            if (result.success) {
                showToast(result.message, "success");
                manageUrlParam();
            } else {
                showToast(result.message + (result?.extraMsg ? ` (${result.extraMsg})` : ""), "error");
            }
        },
        error: function (xhr, status, error) {
            console.error("❌ AJAX Error:", error);
            showToast("خطا در ارتباط با سرور", "error");
        }
    });

    $('#dialogOverlay').fadeOut(200);
}






function createCombo(data, id, item) {

    var value;
    if (id == "myMonth") {
        var today = displayCurrentJalaliDate()
        value = parseInt(today.split("/")[1])
    }
    if (id == "myYear") {
        var today = displayCurrentJalaliDate()
        value = parseInt(today.split("/")[0])
    }
    $("#" + id).dxSelectBox({
        dataSource: data,
        valueExpr: "value",
        displayExpr: "name",
        rtlEnabled: true,
        placeholder: item,
        searchEnabled: true,
        showClearButton: true,
        searchMode: "contains",
        value: value,
        width: "150",
        height: "30px",
        dropDownOptions: {
            height: "auto",
            minHeight: 100,
            maxHeight: 160,
        },

        itemTemplate: function (data) {
            return `<div data-value="${data.value}">${data.name}</div>`;
        },


        onValueChanged: function (e) {
            if (e.value) {
                // گرفتن نام گزینه انتخاب‌شده
                let selectedItem = data.find(item => item.value === e.value);
                //console.log("انتخاب شد:", selectedItem.name, " | مقدار: ", selectedItem.value);

                $("#" + id).attr("data-value", selectedItem.value);
                manageUrlParam()
                //var filterType = getUrlParam('action')
                //if (filterType.includes("25Days")) {
                //    getFormData("25Days");
                //} else if (filterType.includes("100Days")) {
                //    getFormData("100Days");
                //} else if (filterType.includes("400Days")) {
                //    getFormData("400Days");
                //}
                //else {

                //    $("#" + id).attr("data-value", "");
                //}
            }
        }
    });


    //var str = '';
    //str = `<input class="drDown" type="text" placeholder="جستجو ..." />`
    //$.each(data, function (index, item) {
    //    str += `<div class="a" data-value="${item.value}">${item.name}</div>`;
    //});
    //$(`#${id}`).html(str);
}
function manageUrlParam() {
    var filterType = getUrlParam('action')
    if (!filterType) return
    if (filterType.includes("25Days")) {
        getFormData("25Days");
    } else if (filterType.includes("100Days")) {
        getFormData("100Days");
    } else if (filterType.includes("400Days")) {
        getFormData("400Days");
    }
}
function createComboRow(data, id, item) {

    $("#" + id).dxSelectBox({
        dataSource: data,
        valueExpr: "value",
        displayExpr: "name",
        rtlEnabled: true,
        placeholder: item,
        searchEnabled: true,
        showClearButton: true,
        searchMode: "contains",
        width: "129",
        height: "30px",
        dropDownOptions: {
            height: "auto",
            minHeight: 100,
            maxHeight: 160,
        },

        itemTemplate: function (data) {
            return `<div data-value="${data.value}">${data.name}</div>`;
        },


        onValueChanged: function () {
            filterGrid()
        }
    });

    //var str = '';
    //str = `<input class="drDown" type="text" placeholder="جستجو ..." />`
    //$.each(data, function (index, item) {
    //    str += `<div class="a" data-value="${item.value}">${item.name}</div>`;
    //});
    //$(`#${id}`).html(str);
}


function generateNumbers(start, end) {
    let numbers = [];
    for (let i = start; i <= end; i++) {
        numbers.push({ value: i, name: i });
    }
    return numbers;
}
function formDate() {

    $.ajax({
        url: "controller/loadAction.asmx/getFormInitialInfo",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            let data = JSON.parse(response.d);
            allData = data;
            createCombo(data.year, "myYear", "سال");
            createCombo(data.month, "myMonth", "ماه");
            createCombo(data.season, "mySeason", "فصل");
            createComboRow(data.month, "month", "ماه");
            createComboRow(data.season, "season", "فصل");
            createComboRow(data.year, "year", "سال");
            createComboRow(data.companies, "companies", "شرکت");
            createComboRow(data.forms, "form", "فرم ها");
            setTimeout(function () { manageUrlParam() }, 500)//load the initial page
            addCompanyUnitRole();
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: " + error);
        },
        sync: false
    });
}

//Dashboard Data
function formNotification() {
    $.ajax({
        url: "controller/loadAction.asmx/formNotif",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (response) {
            let result = JSON.parse(response.d)
            let roleId = '<%= Session["roleId"] %'
            let html = ``;
            //if (result.notCompeleteFrom.length == 0) {
            //    $("#rightBox").css("display", "none");
            //} else {
            //    $("#rightBox").css("display", "block");
            //    html = `<div class="rightBox">
            //            <div class="titleFormNotif">
            //                <div class="titleNotif">فرم‌های تکمیل نشده:</div>
            //                <img src="image/icnW.png" class="imgNotif">
            //            </div>`

            //    result.notCompeleteFrom.forEach(function (item) {
            //        //let htmlTow = ``;
            //        html += `<div class="formNotif">
            //                <div class="icon">
            //                     <img src="image/Vector.png" alt="">
            //                 </div>
            //                 <div class="boxTitle">شما یک
            //                 ${item.formName} 
            //                 ${item.monthName ? item.monthName : ''} 
            //                 ${item.seasonName ? item.seasonName : ''} 
            //                 ${item.yearName}
            //                 تکمیل نشده دارید.</div>
            //                <div class="btnFormComplete">تکمیل فرم</div>
            //         </div>`
            //    })
            //    html += `</div>`
            //    $("#rightBox").append(html)
            //}

            if (roleId = 4 && result.subUserCompleteForm != 0) {
                //$("#rightBox").css("display", "none");
                $("#rightBox").css("display", "block");
                html = `<div class="rightBox">
                        <div class="titleFormNotif">
                            <div class="titleNotif">آخرین تغییرات :</div>
                        </div>`

                result.subUserCompleteForm.forEach(function (item) {
                    //let htmlTow = ``;
                    html += `<div class="formNotif">
                            <div class="icon">
                                 <img src="image/succ.png" alt="">
                             </div>
                             <div class="boxTitle">
                             ${item.formName} 
                             ${item.monthName ? item.monthName : ''} 
                             ${item.yearName}
                             ${item.label}  ${item.firstName}  ${item.lastName}
                             تکمیل شده و ارسال گردیده است.</div>
                     </div>`
                })
                html += `</div>`
                $("#rightBox").append(html)
            }

            result.latFormCompeleted.forEach(function (item) {
                html = `<div class="lastForm">
                        <div class="rightLastForm">
                            <p class="topRL">آخرین فرم ثبت شده ${item.formName}</p>
                            <p class="bottonRL">
                                ${item.monthName ? item.monthName : ''} 
                                ${item.seasonName ? item.seasonName : ''} 
                                ${item.yearName}
                             </p>
                        </div>
                        <div class="leftLastForm">
                            <img src="image/2.png" alt="">
                        </div>
                    </div>`
                $(".rightBox").append(html)
            })



        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: " + error);
        }
    });
}
function loadAction() {
    $.ajax({
        url: "controller/loadAction.asmx/Actions",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            let data = JSON.parse(response.d);


            let userType = data.actionData.filter(function (item) {
                return item.posType === "sideBar"
            })
            if (data.success) {
                renderMenu(userType); // ساخت منو 
                var profileImg = Array.isArray(data.userData) && data.userData.length > 0 ? data.userData[0] : null;
                var profileImg = data.userData[0]
                if (profileImg.uId && profileImg.pi) {
                    $(".proLogo").attr("src", "image/profileImage/" + profileImg.uId + "/" + profileImg.pi);
                } else {
                    console.warn("Missing profile image data");
                    $(".proLogo").attr("src", "image/avatar.png");
                }
                //globe.userInfo = data.userData[0]
                //userInfo = data.userData[0]
            } else {
                console.error("Error: " + data.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: " + error);
        }
    });
}
function renderMenu(data) {
    let menuContainer = $("#menuContainer");
    menuContainer.empty();

    // فیلتر والدها (Parent Items)
    let parents = data.filter(item => item.parentId === null);

    parents.forEach(parent => {
        const hasChildren = data.some(item => item.parentId === parent.actionId);
        const isActive = parent.actionTitle === "داشبورد" ? "active" : "";
        let dropdown = $(`
            <div class="dropdown">
                <a href="${parent.url}" class="menu-item ${isActive}">
                    ${parent.iconPath ? `<img src="${parent.iconPath}" alt="">` : ''}
                    <span>${parent.actionTitle}</span>
                   ${hasChildren
                ? `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                    </svg>`
                : ''
            }
                </a>
                <div class="dropdown-content"></div>
            </div>
        `);

        dropdown.find(".menu-item").on('click', function (event) {
            // اگر آیتم داشبورد است، اجازه بده به لینک بره
            if ($(this).find("span").text() === "داشبورد" || $(this).find("span").text() === "فرم ساز" || $(this).find("span").text() === "مشاهده فرم های شرکت ها ی هلدینگ" || $(this).find("span").text() === "خانه") {
                return true;  // هدایت به لینک
            }
            // اگر آیتم داشبورد نیست، toggleDropdown اجرا شود
            event.preventDefault();
            toggleDropdown(event);
        });

        // فیلتر فرزندان (Child Items)
        let children = data.filter(item => item.parentId === parent.actionId);
        let dropdownContent = dropdown.find(".dropdown-content");

        children.forEach(child => {

            let childItem = $(`
                <a href="${child.url || '#'}?action=${child.src}" class="child-item border" data-action="${child.src}">
                    ${child.iconPath ? `<img src="${child.iconPath}" alt="" >` : ''}
                    <span>${child.actionTitle}</span>
                </a>
            `);

            childItem.on('click', function (event) {
                event.preventDefault();

                const src = $(this).data("action"); // مقدار src
                if (child.url) {
                    // اگر URL وجود دارد، کاربر به لینک هدایت شود
                    window.location.href = `${child.url}?action=${child.src}`;
                } else {
                    handleAction(src); // فراخوانی تابع مرتبط با src
                }
            });

            dropdownContent.append(childItem);
        });

        menuContainer.append(dropdown);
    });
}
function handleAction(src) {

    if (typeof window[src] === "function") {
        window[src]();
    } else {
        console.warn(`src "${src}" is not defined.`);
    }
}

function executeDynamicFunction(functionName, data) {
    if (typeof window[functionName] === "function") {
        window[functionName](data);
    } else {
        console.error(`تابع ${functionName} پیدا نشد.`);
    }
}
function checkFormAccess() {

    $.ajax({
        url: "controller/loadAction.asmx/Actions",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            var data = JSON.parse(response.d);
            globe.actionData = data.actionData
            $("#btnActionTbl").html('')
            if (data.success) {
                let htmlTemplate = data.actionData.filter(action => action.template);
                htmlTemplate.forEach(function (action) {
                    let compiledTemplate = new Function('action', `return ${action.template}`)(action).replace(/\s{2,}/g, '');

                    if (action.actionTitle === "برگشت فرم و اصلاح") {
                        let $compiledTemplate = $(compiledTemplate);
                        $compiledTemplate.on('click', function (event) {
                            //console.log(action)
                            event.preventDefault();
                            let functionName = action.src;  // دریافت نام تابع
                            if (typeof window[functionName] === "function") {

                                window[functionName]();  // اجرای تابع
                            } else {
                                alert("تابع تعریف نشده است!");
                            }
                        });
                        $("#btnActionTbl").append($compiledTemplate)
                    }
                    if (action.actionTitle === "ارسال") {

                        let $compiledTemplate = $(compiledTemplate);
                        $compiledTemplate.on('click', function (event) {

                            event.preventDefault();
                            let functionName = action.src;
                            if (typeof window[functionName] === "function") {

                                window[functionName]();
                            } else {
                                alert("تابع تعریف نشده است!");
                            }
                        });
                        $("#btnActionTbl").append($compiledTemplate)
                    }

                    if (action.actionTitle.includes("دانلود")) {

                        let $compiledTemplate = $(compiledTemplate);

                        $("#filterLeft").on('click', '.exportExcel', function (event) {
                            event.stopPropagation();
                            event.preventDefault();
                            let functionName = action.src;

                            if (typeof window[functionName] === "function") {
                                window[functionName](); // اجرای تابع
                            } else {
                                alert("تابع تعریف نشده است!");
                            }
                        });

                        $("#filterLeft").append(compiledTemplate);
                    }

                    if (action.actionTitle === "حذف فرم") {

                        let $compiledTemplate = $(compiledTemplate);

                        $compiledTemplate.on('click', function (event) {

                            event.preventDefault();
                            let functionName = action.src;
                            if (typeof window[functionName] === "function") {

                                window[functionName]();
                            } else {
                                alert("تابع تعریف نشده است!");
                            }


                        });
                        $("#rowFilter").append($compiledTemplate);

                    }
                    if (action.actionTitle.includes("ردیف")) {


                        let $compiledTemplate = $(compiledTemplate);


                        $compiledTemplate.each(function () {
                            let formDataId = $(this).parents('.RowBody').data('value');
                            $(this).attr('data-value', formDataId);
                        });


                        $compiledTemplate.on('click', function (event) {

                            event.preventDefault();

                            let formDataId = $(this).data('value');
                            let functionName = action.src;

                            if (functionName && typeof window[functionName] === "function") {
                                window[functionName](formDataId);
                            } else {
                                alert("تابع تعریف نشده است!");
                            }
                        });

                        $(".editDelete").append($compiledTemplate);
                        $(".editDelete").find(".deleteRow").each(function () {
                            var dataValue = $(this).parents('.RowBody').attr('data-value')
                            $(this).attr('data-value', dataValue)

                        })
                        $(".editDelete").find(".editeRow").each(function () {
                            var dataValue = $(this).parents('.RowBody').attr('data-value')
                            $(this).attr('data-value', dataValue)
                            //$(this).on('click', )
                        })
                    }


                });
            } else {
                console.error("Error: " + data.error);
            }



        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: " + error);
        }

    });


}
function logout() {
    let logout = $("#logOut")
    logout.on('click', function () {
        window.location.href = 'login.aspx'
    })
}

function showToast(message, type) {
    var type = type || "success"
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("success", "error", "warning", "info");
    toast.classList.add("show", type);
    setTimeout(() => {
        toast.classList.remove("show");
    }, 10000);
}
function openDialog(message) {
    var dialog = $("#dialog-box");

    var content = `
        <h2 class="dialogTitle">کاربر عزیز</h2>
        <p>${message}</p> 
        <div class="dialog-buttons">
            <button class="confirm-btn" id="confirmAction">تایید</button>
            <button class="cancel-btn" id="cancelAction">لغو</button>
        </div>
    `;
    dialog.html(content);

    $('#dialogOverlay').fadeIn(200);

    $('#cancelAction').on('click', function () {
        $('#dialogOverlay').fadeOut(200);
    });
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
function formatDateToJalali(serverDate, elementId) {

    if (!serverDate) return '';

    let date = new Date(serverDate);
    const [jy, jm, jd] = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const jalaliDate = `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;

    $(`#${elementId}`).text(jalaliDate);
    return jalaliDate;
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
    return jalaliDate
}
function openProfileImage() {
    // باز کردن انتخاب‌کننده فایل
    $('#profileLogo').click(function () {
        $('#profileImage').click();
    });

    // تغییر عکس بعد از انتخاب فایل
    $('#profileImage').change(function () {
        var file = this.files[0];

        // بررسی نوع و اندازه فایل
        if (!file || file.size > 10485760) { // محدودیت 10 مگابایت
            alert("اندازه فایل بزرگ‌تر از حد مجاز است (حداکثر 10 مگابایت).");
            this.value = ""; // پاک کردن فایل انتخاب‌شده
            return;
        }
        if (!file.type.startsWith("image/")) {
            alert("فقط فایل‌های تصویری مجاز هستند.");
            this.value = "";
            return;
        }

        // خواندن تصویر و تغییر اندازه در صورت نیاز
        var reader = new FileReader();
        reader.onload = function (event) {
            var img = new Image();
            img.src = event.target.result;

            img.onload = function () {
                // تنظیمات محدودیت عرض و ارتفاع
                var maxWidth = 600;
                var maxHeight = 600;

                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");

                var width = img.width;
                var height = img.height;

                // تغییر اندازه تصویر
                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // پیش‌نمایش تصویر فشرده‌شده
                var dataUrl = canvas.toDataURL("image/jpeg", 0.8); // کیفیت 80%
                $('.proLogo').attr('src', dataUrl);

                // تبدیل تصویر به Blob و ارسال به سرور
                canvas.toBlob(function (blob) {
                    var formData = new FormData();
                    formData.append('profileImage', blob, file.name); // ذخیره با نام اصلی فایل

                    $.ajax({
                        url: 'controller/loadAction.asmx/SaveProfileImage',
                        type: 'POST',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            try {
                                var jsonResponse = $(response).find("string").text();
                                var data = JSON.parse(jsonResponse);

                                if (data.success) {
                                    $("#toast").css("background", "#48bb782b")
                                    $("#toast").css("border", "2px solid #48BB78")
                                    $("#toast").css("z-index", "999")
                                    showToast("تصویر پروفایل با موفقیت ذخیره شد!");
                                } else {
                                    showToast("خطا در ذخیره تصویر پروفایل: " + data.message);
                                }
                            } catch (error) {
                                console.error("خطا در پردازش پاسخ سرور:", error);
                                showToast("خطای غیرمنتظره در ذخیره تصویر پروفایل.");
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error('خطا در ارسال عکس به سرور:', error);
                            showToast("خطا در ارسال تصویر. لطفاً دوباره تلاش کنید.");
                        }
                    });
                }, file.type || "image/jpeg", 0.8); // کیفیت 80%
            };
        };
        reader.readAsDataURL(file);
    });
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
//function excel() {

//    // آرایه‌ای برای ذخیره داده‌های جدول
//    let data = [];

//    // افزودن هدرها
//    let headers = [];
//    $('.headerVFT > div').each(function () {
//        headers.push($(this).text().trim());
//    });
//    data.push(headers);

//    // سال و ماه مورد نظر (فرض کنید این داده‌ها از جایی دیگر گرفته شده)
//    const year = 1403; // سال
//    const month = 1; // ماه

//    // استخراج داده‌های سطرها
//    $('.bodyRow').each(function () {
//        let row = [];

//        // 1. ستون "ردیف"
//        let rowNumber = $(this).find('.titleR').text().trim();
//        row.push(rowNumber);

//        // 2. ستون "شرح فعالیت"
//        let description = $(this).find('.bodyDes').text().trim();
//        row.push(description);

//        // 3. ستون "طبقه‌بندی اهمیت"
//        let importance = $(this).find('.bodyUr').text().trim();
//        row.push(importance);

//        // 4. ستون "مسئول انجام"
//        let responsible = $(this).find('.bodyUre').text().trim();
//        row.push(responsible);

//        // 5. ستون "پاسخگو انجام"
//        let accountable = $(this).find('.bodyUAns').text().trim();
//        row.push(accountable);

//        // 6. ستون "مشاور و همکار"
//        let advisor = $(this).find('.bodyUAdv').text().trim();
//        row.push(advisor);

//        // 7. ستون "مطلع از نتیجه"
//        let informed = $(this).find('.bodyUAwa').text().trim();
//        row.push(informed);

//        // 8. ستون "بازه انجام فعالیت در ماه" (فقط اولین و آخرین خانه رنگی)
//        let firstColoredDay = null;
//        let lastColoredDay = null;

//        $(this).find('.bodyIntTime .dateDay').each(function (index) {
//            let backgroundColor = $(this).css('background-color');

//            // بررسی اگر خانه رنگی باشد
//            if (backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
//                let day = $(this).text().trim();

//                // تنظیم اولین و آخرین روز
//                if (!firstColoredDay) {
//                    firstColoredDay = day; // اولین روز
//                }
//                lastColoredDay = day; // آخرین روز
//            }
//        });


//        if (firstColoredDay && lastColoredDay) {
//            let formattedDateRange = `${year}/${month.toString().padStart(2, '0')}/${firstColoredDay.padStart(2, '0')} - ${year}/${month.toString().padStart(2, '0')}/${lastColoredDay.padStart(2, '0')}`;
//            row.push(formattedDateRange);
//        } else {
//            row.push("بدون بازه زمانی");
//        }


//        let status = $(this).find('.bodySt').text().trim();
//        row.push(status);


//        data.push(row);
//    });

//    try {
//        // ایجاد ورک‌بوک و شیت اکسل
//        let worksheet = XLSX.utils.aoa_to_sheet(data); // تبدیل آرایه به شیت اکسل
//        let workbook = XLSX.utils.book_new();
//        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//        // دانلود فایل اکسل
//        XLSX.writeFile(workbook, "table_data.xlsx");
//        $("#toast").css("background", "#48bb782b")
//        $("#toast").css("border", "2px solid #48BB78")
//        showToast("فایل اکسل با موفقیت دانلود شد!");
//    } catch (error) {
//        console.error("خطا در تولید اکسل:", error);
//    }

//}
function completeProfile() {
    let fName = $("#firstName").val().trim()
    let lName = $("#lastName").val().trim()
    let uName = $("#username").val().trim()
    let email = $("#email").val().trim()
    let phone = $("#phone").val().trim()
    let company = $("#company").attr("data-value")
    let unit = $("#unit").attr("data-value")
    let role = $("#role").attr("data-value")
    data = {
        firstName: fName,
        lastName: lName,
        username: uName,
        email: email,
        phone: phone,
        company: company,
        unit: unit,
        role: role
    }
    $.ajax({
        url: 'controller/loadAction.asmx/completeProfile',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var result = JSON.parse(response.d);


        },
        error: function (xhr, status, error) {
            console.error('خطا :', error);

        }
    });
}
function handleDropdown(dropdownButtonClass, dropdownContentClass, checkboxClass) {
    // مدیریت باز و بسته شدن Dropdown
    $(document).on('click', dropdownButtonClass, function (e) {
        e.stopPropagation(); // جلوگیری از بسته شدن ناگهانی
        let dropdownContent = $(this).next(dropdownContentClass);

        // بستن تمام dropdownهای دیگر
        $(dropdownContentClass).not(dropdownContent).hide();

        // نمایش یا مخفی‌سازی Dropdown فعلی
        dropdownContent.toggle();
    });

    // بستن Dropdown زمانی که روی فضای بیرون کلیک شود
    $(document).on('click', function (e) {
        if (!$(e.target).closest(dropdownButtonClass).length && !$(e.target).closest(dropdownContentClass).length) {
            $(dropdownContentClass).hide(); // بستن تمام dropdownها
        }
    });

    // مدیریت انتخاب چک‌باکس‌ها و ذخیره مقدار ماه و دهه
    $(document).on('change', checkboxClass, function () {
        let selectedRadio = $(this);
        let monthValue = selectedRadio.val(); // مقدار data-value ماه
        let decadeFrom = selectedRadio.data('from'); // مقدار دهه از
        let decadeTo = selectedRadio.data('to'); // مقدار دهه تا
        let dropdownButton = selectedRadio.closest('.custom-dropdown').find(dropdownButtonClass);

        // پیدا کردن نام ماه
        let monthText = selectedRadio.closest('.custom-dropdown').find(`.orderMonth[data-value="${monthValue}"]`).text().trim();

        // گرفتن نام دهه از متن لیبل
        let decadeLabel = selectedRadio.closest("label").text().trim();

        if (monthText && decadeLabel) {
            dropdownButton.text(`${decadeLabel} ${monthText} `);

            // تنظیم مقدار data-attribute های دکمه
            dropdownButton.attr("data-month", monthValue);
            dropdownButton.attr("data-from", decadeFrom);
            dropdownButton.attr("data-to", decadeTo);
        } else {
            dropdownButton.text("انتخاب کنید");

            // پاک کردن مقدار data-attribute های دکمه
            dropdownButton.attr("data-month", "");
            dropdownButton.attr("data-from", "");
            dropdownButton.attr("data-to", "");
        }
    });
}

function profile() {
    $.ajax({
        url: 'controller/loadAction.asmx/getProfile',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var result = JSON.parse(response.d)

            $("#firstName").val(result[0].firstName)
            $("#lastName").val(result[0].lastName)
            $("#username").val(result[0].username)
            $("#company").val(result[0].companyName)
            $("#units").val(result[0].unitName)
            $("#roles").val(result[0].roleName)
            $("#email").val(result[0].email)
            $("#phone").val(result[0].phoneNumber)
            $(".proLogo").attr("src", result[0].profileImg)

        },
        error: function (xhr, status, error) {

        }
    });
}

function changeProfile() {

    //let fName = $("#firstName").val()
    //let lName = $("#lastName").val()
    //let user = $("#username").val()
    //let co = $("#company").val()
    //let uni = $("#units").val()
    //let ro = $("#roles").val()
    let email = $("#email").val()
    let phone = $("#phone").val()
    let lastPass = $("#lastPass").val()
    let newPass = $("#passwordOne").val()
    let repeatPass = $("#passwordTwo").val()

    var data = {
        //fName: fName,
        //lName:lName, 
        //user:user ,
        //company:co ,
        //unite:uni, 
        //role:ro,
        email: email,
        phone: phone,
        lastPass: lastPass,
        newPass: newPass
    }

    if (newPass = !repeatPass || lastPass.length == "") {
        showToast("گذرواژه جدید و تکرار گذرواژه یکی نمی باشد یا گذرواژه قدیمی اشتباه می باشد.")
    }
    $.ajax({
        url: 'controller/loadAction.asmx/changeProfile',
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


}


//panel CEO


function showAllFormsOfCompanies() {

    $("#fFT").css("display", "none")
    $("#companyFormsDetails").css("display", "none");
    $("#formsHeader").css("display", "block")
    $("#companyForms").css("display", "block");
    $.ajax({
        url: "controller/loadAction.asmx/getAllFormData",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var result = JSON.parse(response.d)

            $("#companyForms").dxDataGrid({
                dataSource: result,
                keyExpr: "",
                rtlEnabled: true,
                columnAutoWidth: true,
                paging: { enabled: false },
                selection: { mode: "single" },
                columns: [
                    {
                        dataField: "id",
                        caption: "ردیف",
                        fixed: true,
                        alignment: "center",
                        allowEditing: false,
                        calculateCellValue: function (rowData) {
                            return result.indexOf(rowData) + 1;
                        }

                    },
                    {
                        dataField: "fName",
                        caption: "فرم",
                        fixed: true,

                    },

                    {
                        dataField: "coName",
                        caption: " شرکت/واحد",
                        fixed: true
                    },
                    {
                        dataField: "uName",
                        caption: " واحد",
                        fixed: true
                    },
                    {
                        dataField: "yearName",
                        caption: "سال",
                        fixed: true
                    },
                    {
                        dataField: "seasonName",
                        caption: "فصل",
                        fixed: true,
                        cellTemplate: function (container, options) {
                            let text = options.value ? options.value : "--";
                            $("<div>").text(text).appendTo(container);
                        }
                    },
                    {
                        dataField: "monthName",
                        caption: "ماه",
                        fixed: true,
                        cellTemplate: function (container, options) {
                            let text = options.value ? options.value : "--";
                            $("<div>").text(text).appendTo(container);
                        }
                    },
                    {
                        dataField: "closedPercent",
                        caption: "وضعیت فرم",
                        fixed: true,
                        cellTemplate: function (container, options) {
                            const percent = options.data.closedPercent;

                            $("<div>")
                                .addClass("progress-bar-container")
                                .append(
                                    $("<div>")
                                        .addClass("progress-bar-fill")
                                        .css("width", percent + "%")
                                )
                                .append(
                                    $("<div>")
                                        .addClass("progress-bar-label")
                                        .text(percent + "%")
                                )
                                .appendTo(container);

                        }
                    },
                    {
                        dataField: "",
                        caption: "مشاهده فرم",
                        fixed: true,
                        cellTemplate: function (container, options) {
                            $("<button>")
                                .addClass("showDataBtn")
                                .text("مشاهده")
                                .attr("data-month", options.data.mV)
                                .attr("data-season", options.data.sV)
                                .attr("data-year", options.data.yV)
                                .attr("data-form", options.data.formId)
                                .attr("data-company", options.data.companyId)
                                .attr("data-unit", options.data.unitId)
                                .on("click", function () {

                                    let mId = $(this).attr("data-month");
                                    let yId = $(this).attr("data-year");
                                    let sId = $(this).attr("data-season");
                                    let fId = $(this).attr("data-form");
                                    let coId = $(this).attr("data-company");
                                    let uId = $(this).attr("data-unit");

                                    let data = {
                                        month: mId,
                                        year: yId,
                                        season: sId,
                                        formId: fId,
                                        companyId: coId,
                                        unitId: uId

                                    }

                                    showTblForms(data)
                                })
                                .appendTo(container);
                        }
                    }
                ],
                showBorders: true,
                paging: { enabled: false }
            }).dxDataGrid("instance");

        },
        error: function (xhr, status, error) {
            console.error("❌ AJAX Error: " + error);
        }
    });


}


function showTblForms(data) {
    let columns = [];
    let result = [];

    // 📌 cellTemplate عمومی برای جایگزین کردن "-" وقتی مقدار خالی است
    function defaultCellTemplate(container, options) {
        let value = (options.text && options.text.toString().trim() !== "") ? options.text : "-";
        $(container).text(value);
    }

    if (data.month && data.year) {
        columns = [
            {
                dataField: "id",
                caption: "ردیف",
                alignment: "center",
                allowEditing: false,
                cellTemplate: function (container, options) {
                    $(container).text(options.row.rowIndex + 1);
                }
            },
            {
                dataField: "unitId",
                caption: "واحد",
                lookup: {
                    dataSource: allData.units,
                    valueExpr: "value",
                    displayExpr: "name"
                },
                cellTemplate: defaultCellTemplate
            },
            {
                dataField: "acDe",
                caption: "شرح فعالیت",
                cellTemplate: defaultCellTemplate
            },
            {
                dataField: "urgeId",
                caption: "طبقه اهمیت",
                lookup: {
                    dataSource: allData.urge,
                    valueExpr: "value",
                    displayExpr: "name"
                },
                cellTemplate: function (container, options) {
                    if (!options.text) {
                        $(container).text("-");
                        return;
                    }
                    let className = options.data.uC ? options.data.uC.trim() : "";
                    $("<div>").addClass(className).text(options.text).appendTo(container);
                }
            },
            {
                dataField: "userRId",
                caption: "مسئول انجام",
                lookup: { dataSource: allData.users, valueExpr: "value", displayExpr: "name" },
                cellTemplate: defaultCellTemplate
            },
            {
                dataField: "userAId",
                caption: "پاسخگو انجام",
                lookup: { dataSource: allData.users, valueExpr: "value", displayExpr: "name" },
                cellTemplate: defaultCellTemplate
            },
            {
                dataField: "userAdId",
                caption: "مشاور و همکار",
                cellTemplate: function (container, options) {
                    if (!options.value) {
                        $(container).text("-");
                        return;
                    }
                    const ids = options.value.toString().split(',').map(id => parseInt(id.trim()));
                    const names = allData.users
                        .filter(u => ids.includes(u.value))
                        .map(u => u.name)
                        .join('، ');
                    $("<div>").text(names || "-").appendTo(container);
                }
            },
            {
                dataField: "userAwId",
                caption: "مطلع از نتیجه",
                cellTemplate: function (container, options) {
                    if (!options.value) {
                        $(container).text("-");
                        return;
                    }
                    const ids = options.value.toString().split(',').map(id => parseInt(id.trim()));
                    const names = allData.users
                        .filter(u => ids.includes(u.value))
                        .map(u => u.name)
                        .join('، ');
                    $("<div>").text(names || "-").appendTo(container);
                }
            },
            {
                dataField: "dateFrom",
                caption: "بازه فعالیت",
                cellTemplate: function (container, options) {
                    let html = genDaysBox(options.data);
                    $(container).html(html || "-");
                }
            },
            {
                dataField: "statusId",
                caption: "وضعیت",
                lookup: { dataSource: allData.status, valueExpr: "value", displayExpr: "name" },
                cellTemplate: defaultCellTemplate
            },
            {
                dataField: "comment",
                caption: "توضیحات",
                cellTemplate: defaultCellTemplate
            }
        ];
    }
    // 📌 حالت‌های season/year هم می‌تونی مشابه همین بالا اصلاح کنی...

    let formId = data.formId;
    let companyId = data.companyId;
    let unitId = data.unitId;
    let month = data.month;
    let season = data.season;
    let year = data.year;
    var res = { formId, companyId, unitId, month, season, year };

    $.ajax({
        url: "controller/loadAction.asmx/showTblForms",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: res }),
        success: function (response) {
            result = JSON.parse(response.d);

            $("#companyForms").css("display", "none");
            $("#formsHeader").css("display", "none");

            $("#companyFormsDetails").dxDataGrid({
                dataSource: new DevExpress.data.DataSource({
                    store: result,
                    filter: ["parentId", "=", null]   // 🔹 فقط رکوردهای اصلی
                }),
                columns: columns,
                rtlEnabled: true,
                showBorders: true,
                masterDetail: {
                    enabled: true,
                    autoExpandAll: false,
                    template: function (container, options) {
                        let hasChild = result.some(sub => sub.parentId === options.data.formDataId);
                        if (hasChild) {
                            $("<div>")
                                .addClass("masterDetailGrid")
                                .dxDataGrid({
                                    dataSource: new DevExpress.data.DataSource({
                                        store: result,
                                        filter: ["parentId", "=", options.data.formDataId]
                                    }),
                                    keyExpr: "formDataId",
                                    rtlEnabled: true,
                                    columnAutoWidth: true,
                                    paging: { enabled: false },
                                    selection: { mode: "single" },
                                    columns: columns,
                                    showBorders: true
                                })
                                .appendTo(container);
                        } else {
                            $("<div>").addClass("masterDetailGrid").hide().appendTo(container);
                            $(".dx-datagrid-group-closed").hide()
                        }
                    },
                    hasDetail: function (rowData) {
                        // 🔹 فقط وقتی subTask داره فلش نشون بده
                        return data.some(sub => sub.parentId === rowData.formDataId);
                    }
                }
            });

            $("#fFT").css("display", "flex");
            $("#companyFormsDetails").css("display", "block");
        }
    });
}



function filterGrid() {
    const grid = $("#companyForms").dxDataGrid("instance");

    let filter = [];

    const companyVal = $("#companies").dxSelectBox("option", "value");
    const yearVal = $("#year").dxSelectBox("option", "value");
    const seasonVal = $("#season").dxSelectBox("option", "value");
    const monthVal = $("#month").dxSelectBox("option", "value");
    const formVal = $("#form").dxSelectBox("option", "value");

    if (companyVal)
        filter.push(["companyId", "=", companyVal]);
    if (yearVal)
        filter.push(["yV", "=", yearVal]);
    if (seasonVal)
        filter.push(["sV", "=", seasonVal]);
    if (monthVal)
        filter.push(["mV", "=", monthVal]);
    if (formVal)
        filter.push(["formId", "=", formVal]);

    grid.filter(filter.length ? filter : null);


    $("#clearFilter").on("click", function () {
        $("#companyForms").dxDataGrid("instance").clearFilter();

        const ids = ["companies", "form", "year", "season", "month"];
        ids.forEach(id => {
            const instance = $("#" + id).dxSelectBox("instance");
            if (instance) {
                instance.option("value", null);
            }
        });

    })
}


function firstDayOfMonth() {
    const today = new Date();
    const persian = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric' }).format(today);

    if (parseInt(persian) === 1) {

    } else {
        console.log("امروز اول ماه نیست");
    }
}




function getUserData() {
    $.ajax({
        url: "controller/loadAction.asmx/getUserData",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var result = JSON.parse(response.d)

            setTimeout(function () {
                userControl(result)
            }, 1000);
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: " + error);
        }
    });
}
function userControl(result) {
    var columns = [
        {
            caption: "ردیف",
            width: 70,
            alignment: "center",
            cellTemplate: function (container, options) {
                var grid = $("#panelAdmin").dxDataGrid("instance");
                var pageIndex = grid.pageIndex();   // شماره صفحه (0-based)
                var pageSize = grid.pageSize();     // تعداد رکورد در هر صفحه
                var rowIndex = options.rowIndex;    // شماره ردیف در همان صفحه (0-based)

                container.text(pageIndex * pageSize + rowIndex + 1);
            },
            allowSorting: false,
            allowEditing: false
        },
        { dataField: "UserInfoId", visible: false, allowEditing: false },
        {
            dataField: "profileImg",
            caption: "عکس پروفایل",
            width: 100,
            allowSorting: false,
            allowFiltering: false,
            cellTemplate: function (container, options) {
                var imgPath = options.data.profileImg
                    ? "image/profileImage/" + options.data.userId + "/" + options.data.profileImg
                    : "image/avatar.png";   // پیش‌فرض

                $("<img>")
                    .attr("src", imgPath)
                    .css({
                        "width": "50px",
                        "height": "50px",
                        "border-radius": "50%",
                        "object-fit": "cover",
                        "display": "flex",
                        "justify-content": "center",
                        "align - items": "center"
                    })
                    .appendTo(container);
            }
        },
        {
            dataField: "label",
            caption: "لیبل",
            visible: false,
            lookup: {
                dataSource: ["سرکار خانم", "جناب آقای"]
            }
        },
        {
            dataField: "fName",
            caption: "نام"
        },
        {
            dataField: "lName",
            caption: "نام خانوادگی"
        },
        {
            dataField: "gender",
            caption: "جنسیت",
            visible: false,
            lookup: {
                dataSource: ["زن", "مرد"]
            }
        },
        {
            dataField: "uName",
            caption: "نام کاربری"
        },
        {
            dataField: "password",
            caption: "گذرواژه"
        },
        {
            dataField: "Email",
            caption: "ایمیل",
            visible: false,
        },
        {
            dataField: "phone",
            caption: "شماره تلفن",
            visible: false,
        },
        {
            dataField: "coId",
            caption: "شرکت",
            lookup: {
                dataSource: allData.companies,
                valueExpr: "value",
                displayExpr: "name"

            },
            editCellTemplate: function (cellElement, cellInfo) {
                $("<div>").dxSelectBox({
                    dataSource: allData.companies,
                    value: cellInfo.value,
                    valueExpr: "value",
                    displayExpr: "name",
                    onValueChanged: function (e) {
                        cellInfo.setValue(e.value);

                        // ریست کردن واحد
                        cellInfo.row.data.uId = null;
                        cellInfo.component.cellValue(cellInfo.row.rowIndex, "uId", null);

                        // ریست کردن سمت
                        cellInfo.row.data.rId = null;
                        cellInfo.component.cellValue(cellInfo.row.rowIndex, "rId", null);
                    }
                }).appendTo(cellElement);
            }

        },
        {
            dataField: "uId",
            caption: "واحد",
            lookup: {
                dataSource: allData.unitsC,
                valueExpr: "value",
                displayExpr: "name"
            },
            editCellTemplate: function (cellElement, cellInfo) {
                $("<div>").dxSelectBox({
                    dataSource: new DevExpress.data.DataSource({
                        store: allData.unitsC,
                        filter: ["CompanyId", "=", cellInfo.row.data.coId]   // فیلتر بر اساس شرکت انتخاب شده
                    }),
                    value: cellInfo.value,
                    valueExpr: "value",
                    displayExpr: "name",
                    onValueChanged: function (e) {
                        cellInfo.setValue(e.value);

                        // ریست کردن سمت سازمانی
                        cellInfo.row.data.rId = null;
                        cellInfo.component.cellValue(cellInfo.row.rowIndex, "rId", null);
                    }
                }).appendTo(cellElement);
            }
        },
        {
            dataField: "rId",
            caption: "سمت سازمانی",
            lookup: {
                dataSource: allData.rolesC,
                valueExpr: "value",
                displayExpr: "name"
            },
            editCellTemplate: function (cellElement, cellInfo) {
                $("<div>").dxSelectBox({
                    dataSource: new DevExpress.data.DataSource({
                        store: allData.rolesC,
                        filter: ["UnitId", "=", cellInfo.row.data.uId]   // فیلتر بر اساس واحد انتخاب شده
                    }),
                    value: cellInfo.value,
                    valueExpr: "value",
                    displayExpr: "name"
                }).appendTo(cellElement);
            }
        },
        {
            dataField: "managerId",
            caption: "پاسخگو به",
            lookup: {
                dataSource: allData.users,
                valueExpr: "value",
                displayExpr: "name"

            },
        },

        {
            dataField: "isActived",
            caption: "وضعیت (فعال/غیرفعال)",
            dataType: "boolean"
        },
    ]

    $("#panelAdmin").dxDataGrid({
        dataSource: result.getUserData,
        keyExpr: "infoUserId",
        showBorders: true,
        rowAlternationEnabled: true,
        searchPanel: {
            visible: true,
            placeholder: "جستجوی کاربران..."
        },
        paging: {
            pageSize: 25
        },
        columns: columns,
        editing: {
            mode: "popup",
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: true,
            useIcons: true,
            popup: {

                title: "مدیریت کاربر",
                showTitle: true,
                width: 1000,
                height: 700,
            },
            form: {
                colCount: 1,
                items: [
                    {
                        itemType: "tabbed",
                        tabs: [
                            {
                                title: "اطلاعات کاربران",
                                colCount: 2,
                                items: [
                                    "label", "fName", "lName", "gender",
                                    "uName", "password", "Email", "phone",
                                    "coId", "uId", "rId", "managerId", "isActived"
                                ]
                            },

                            {
                                title: "دسترسی‌ها (شرکت )",
                                items: [
                                    {
                                        template: function (itemData, itemElement) {
                                            const $tree = $("<div>").appendTo(itemElement);
                                            const companies = window.currentCompaniesForUser || [];



                                            $tree.dxTreeView({
                                                items: companies,
                                                rtlEnabled: true,
                                                dataStructure: "plain",
                                                keyExpr: "companyId",
                                                displayExpr: "companyName_FA",
                                                selectionMode: "multiple",
                                                showCheckBoxesMode: "normal",
                                                selectNodesRecursive: true
                                            });
                                        }
                                    }
                                ],
                            },
                            {
                                title: "دسترسی‌ها (شیت ها)",
                                items: [
                                    {
                                        template: function (itemData, itemElement) {
                                            const $tree = $("<div>").appendTo(itemElement);
                                            const data = window.currentSheetsForUser || [];

                                            const treeItems = buildTreeData(data);

                                            $tree.dxTreeView({
                                                items: treeItems,
                                                rtlEnabled: true,
                                                dataStructure: "plain",
                                                keyExpr: "id",
                                                displayExpr: "text",
                                                parentIdExpr: "parentId",
                                                selectionMode: "multiple",
                                                showCheckBoxesMode: "normal",
                                                selectNodesRecursive: true
                                            });

                                        }
                                    }
                                ],
                            },

                        ]
                    }
                ]
            }
        },
        onEditingStart: function (e) {

            var userId = e.data.userId;
            return $.ajax({
                url: "controller/loadAction.asmx/getDataAccessBi",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ userId: userId }),
                dataType: "json",
                success: function (response) {
                    var result = JSON.parse(response.d)
                    var sheets = result.userSheet
                    var companies = result.userCompany
                    window.currentSheetsForUser = sheets || [];
                    window.currentCompaniesForUser = companies || [];
                    e.component.repaint();
                }
            });
        },
        onRowInserting: function (e) {
            let newData = e.data;
            return $.ajax({
                url: "controller/loadAction.asmx/saveUserData",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ data: newData }),
                dataType: "json",
                success: function (response) {
                    manageUrlParam();
                    showToast("✅ با موفقیت ذخیره شد", "success");
                }
            });
        },
        onRowUpdating: function (e) {
            let updatedData = Object.assign({}, e.oldData, e.newData);
            return $.ajax({
                url: "controller/loadAction.asmx/updateUserData",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ data: updatedData }),
                dataType: "json",
                success: function (response) {
                    showToast("✅ ویرایش با موفقیت انجام شد!", "success");
                    manageUrlParam();
                },
                error: function (xhr, status, error) {
                    console.error("❌ AJAX Error: " + error);
                }
            });
        },
        onRowRemoving: function (e) {
            let infoUserId = e.data.infoUserId;
            return $.ajax({
                url: "controller/loadAction.asmx/deleteUserData",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ infoUserId: infoUserId }),
                dataType: "json",
                success: function (response) {
                    let result = JSON.parse(response.d);
                    if (result === "success") {
                        showToast("✅ ردیف با موفقیت حذف شد.", "success");
                    } else {
                        console.log("❌ خطا در حذف: " + result);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("❌ AJAX Error: " + error);
                }
            });
        }
    });

    function editUser(user) {
        DevExpress.ui.notify("ویرایش " + user.name, "info", 2000);
    }

    function deleteUser(id) {
        DevExpress.ui.notify("کاربر حذف شد: " + id, "error", 2000);
    }
}

function buildTreeData(items) {
    const treeData = [];
    const tabMap = {};

    // اضافه کردن تب‌ها
    items.forEach(i => {
        if (!tabMap[i.tabId]) {
            tabMap[i.tabId] = {
                id: "tab-" + i.tabId,  // کلید یکتا برای تب
                text: i.tabTitle,
                parentId: null          // ریشه
            };
            treeData.push(tabMap[i.tabId]);
        }
    });

    // اضافه کردن شیت‌ها
    items.forEach(i => {
        treeData.push({
            id: "sheet-" + i.sheetId,
            text: i.sheetTitle,
            parentId: "tab-" + i.tabId
        });
    });

    return treeData;
}



function addCompanyUnitRole() {
    if (!allData) {

        setTimeout(addCompanyUnitRole, 50);
        return;
    }

    const tables = [
        { id: "#tCompanies", data: allData.companies, label: "شرکت" },
        { id: "#tUnits", data: allData.units, label: "واحد" },
        { id: "#tRoles", data: allData.roles, label: "سمت سازمانی" }
    ];

    tables.forEach(table => {
        if ($(table.id).length) {

            $(table.id).dxDataGrid({
                dataSource: table.data,
                keyExpr: "value",
                showBorders: true,
                rowAlternationEnabled: true,
                searchPanel: {
                    visible: true,
                    placeholder: `جستجو ....`,
                },
                scrolling: {
                    mode: "standard",
                    scrollByContent: true,
                    scrollByThumb: true,
                    showScrollbar: "always",
                    rowRenderingMode: "standard",

                },
                paging: {
                    enabled: false
                },
                height: 500,
                columns: [
                    {
                        caption: "ردیف",
                        width: 70,
                        alignment: "center",
                        cellTemplate: function (container, options) {
                            container.text(options.rowIndex + 1); // فقط شماره ردیف
                        },
                        allowSorting: false,
                        allowEditing: false
                    },
                    {
                        dataField: "value",
                        caption: table.label,
                        lookup: {
                            dataSource: table.data,
                            valueExpr: "value",
                            displayExpr: "name"
                        }
                    },

                ],
                editing: {
                    mode: "row",
                    allowUpdating: true,
                    allowAdding: true,
                    allowDeleting: true,
                    useIcons: true,

                },
                onToolbarPreparing: function (e) {
                    e.toolbarOptions.items = e.toolbarOptions.items.filter(item => item.name !== "addRowButton");
                    e.toolbarOptions.items.unshift({
                        location: "after", // می‌تونه "before", "after" یا "center" باشه
                        widget: "dxButton",
                        options: {
                            text: `افزودن ${table.label}`,  // متن دلخواه شما
                            icon: "plus",
                            onClick: function () {
                                e.component.addRow(); // عملکرد اضافه کردن ردیف
                            },
                            elementAttr: { class: "my-custom-button" } // کلاس دلخواه
                        }
                    });
                },
                onEditingStart: function (e) {

                    var userId = e.data.userId;
                    return $.ajax({
                        url: "controller/loadAction.asmx/",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({ data: '' }),
                        dataType: "json",
                        success: function (response) {
                            var result = JSON.parse(response.d)

                        }
                    });
                },
                onRowInserting: function (e) {
                    let newData = e.data;
                    return $.ajax({
                        url: "controller/loadAction.asmx/saveUserData",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({ data: newData }),
                        dataType: "json",
                        success: function (response) {
                            manageUrlParam();
                            showToast("✅ با موفقیت ذخیره شد", "success");
                        }
                    });
                },
                onRowUpdating: function (e) {
                    let updatedData = Object.assign({}, e.oldData, e.newData);
                    return $.ajax({
                        url: "controller/loadAction.asmx/updateUserData",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({ data: updatedData }),
                        dataType: "json",
                        success: function (response) {
                            showToast("✅ ویرایش با موفقیت انجام شد!", "success");
                            manageUrlParam();
                        },
                        error: function (xhr, status, error) {
                            console.error("❌ AJAX Error: " + error);
                        }
                    });
                },
                onRowRemoving: function (e) {
                    let infoUserId = e.data.infoUserId;
                    return $.ajax({
                        url: "controller/loadAction.asmx/deleteUserData",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({ infoUserId: infoUserId }),
                        dataType: "json",
                        success: function (response) {
                            let result = JSON.parse(response.d);
                            if (result === "success") {
                                showToast("✅ ردیف با موفقیت حذف شد.", "success");
                            } else {
                                console.log("❌ خطا در حذف: " + result);
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error("❌ AJAX Error: " + error);
                        }
                    });
                }
            });
        }
    })

}

function getConnectCompanyUnitRoleData() {
    $.ajax({
        url: "controller/loadAction.asmx/getConnect",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ data: updatedData }),
        dataType: "json",
        success: function (response) {
            let result = JSON.parse(response.d)
            connectCompanyUnitRole(result)
        },
        error: function (xhr, status, error) {
            console.error("❌ AJAX Error: " + error);
        }
    });
}
function connectCompanyUnitRole(data) {

    $("#connect").dxDataGrid({
        dataSource: data,
        keyExpr: "value",
        showBorders: true,
        rowAlternationEnabled: true,
        searchPanel: {
            visible: true,
            placeholder: `جستجو ....`,
        },
        scrolling: {
            mode: "standard",
            scrollByContent: true,
            scrollByThumb: true,
            showScrollbar: "always",
            rowRenderingMode: "standard",

        },
        paging: {
            enabled: false
        },
        height: 500,
        columns: [
            {
                caption: "ردیف",
                width: 70,
                alignment: "center",
                cellTemplate: function (container, options) {
                    container.text(options.rowIndex + 1); // فقط شماره ردیف
                },
                allowSorting: false,
                allowEditing: false
            },
            {
                dataField: "coId",
                caption: 'شرکت',
                lookup: {
                    dataSource: allData.companyId,
                    valueExpr: "value",
                    displayExpr: "name"
                }
            },
            {
                dataField: "uId",
                caption: 'واحد',
                lookup: {
                    dataSource: allData.unitId,
                    valueExpr: "value",
                    displayExpr: "name"
                }
            },
            {
                dataField: "rId",
                caption: 'سمت سازمانی',
                lookup: {
                    dataSource: allData.roleId,
                    valueExpr: "value",
                    displayExpr: "name"
                }
            },

        ],
        editing: {
            mode: "row",
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: true,
            useIcons: true,

        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items = e.toolbarOptions.items.filter(item => item.name !== "addRowButton");
            e.toolbarOptions.items.unshift({
                location: "after", // می‌تونه "before", "after" یا "center" باشه
                widget: "dxButton",
                options: {
                    text: `افزودن ${table.label}`,  // متن دلخواه شما
                    icon: "plus",
                    onClick: function () {
                        e.component.addRow(); // عملکرد اضافه کردن ردیف
                    },
                    elementAttr: { class: "my-custom-button" } // کلاس دلخواه
                }
            });
        },
        onEditingStart: function (e) {

            var userId = e.data.userId;
            return $.ajax({
                url: "controller/loadAction.asmx/",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ data: '' }),
                dataType: "json",
                success: function (response) {
                    var result = JSON.parse(response.d)

                }
            });
        },
        onRowInserting: function (e) {
            let newData = e.data;
            return $.ajax({
                url: "controller/loadAction.asmx/saveUserData",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ data: newData }),
                dataType: "json",
                success: function (response) {
                    manageUrlParam();
                    showToast("✅ با موفقیت ذخیره شد", "success");
                }
            });
        },
        onRowUpdating: function (e) {
            let updatedData = Object.assign({}, e.oldData, e.newData);
            return $.ajax({
                url: "controller/loadAction.asmx/updateUserData",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ data: updatedData }),
                dataType: "json",
                success: function (response) {
                    showToast("✅ ویرایش با موفقیت انجام شد!", "success");
                    manageUrlParam();
                },
                error: function (xhr, status, error) {
                    console.error("❌ AJAX Error: " + error);
                }
            });
        },
        onRowRemoving: function (e) {
            let infoUserId = e.data.infoUserId;
            return $.ajax({
                url: "controller/loadAction.asmx/deleteUserData",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ infoUserId: infoUserId }),
                dataType: "json",
                success: function (response) {
                    let result = JSON.parse(response.d);
                    if (result === "success") {
                        showToast("✅ ردیف با موفقیت حذف شد.", "success");
                    } else {
                        console.log("❌ خطا در حذف: " + result);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("❌ AJAX Error: " + error);
                }
            });
        }
    });
}
<%@ Page Title="" Language="C#" MasterPageFile="master.Master" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Hitco Control</title>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="page-container">
        <!-- Header -->
        <div class="page-header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h1 style="margin: 0; font-size: 18px;">کنترل پروژه</h1>
                <i id="settingsButton" class="dx-icon-preferences settings-btn" title="تنظیمات" ></i>
            </div>
        </div>

        <!-- Control Section -->
        <div class="control-section">
            <div class="control-row">
                <div class="control-group">
                    <div style="width: 350px;">
                        <div id="companySelectBox"></div>
                    </div>
                </div>
                
                <div class="control-group">
                    <div style="width: 150px;">
                        <div id="fiscalYearSelectBox"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs Section -->
        <div class="tabs-section">
            <div id="categoryTabs" class="simple-tabs">
                <!-- Tabs will be generated here -->
            </div>
        </div>

        <!-- Data Grids Section -->
        <div class="grids-section" id="gridsContainer">
            <div class="loading-message">
                <i class="fas fa-building"></i><br>
                لطفاً ابتدا یک شرکت و سال مالی انتخاب کنید
            </div>
        </div>
        <div id="settingsPopup"></div>
    </div>

    <script>
let selectedCompanyId = 0;
let selectedFiscalYear = 0;
let selectedCategoryId = 0;
let companySelectBox;
let fiscalYearSelectBox;
let sheets = [];
let items = [];
let timePeriods = [];
let sheetGrids = {};
let settingsPopup;
let settingsCompanySelectBox;
let settingsCategorySelectBox;
let sheetItemGrids = {};
let settingsSheets = [];
let settingsItems = [];
$(document).ready(function() {
    initializeControls();
    loadCompanies();
    setDefaultFiscalYear();
    initializeSettingsPopup();
});
function initializeSettingsPopup() {
    // Initialize the popup
    settingsPopup = $("#settingsPopup").dxPopup({
        title: "سرفصل‌ها",
        width: '90%',
        height: '85%',
        showCloseButton: true,
        rtlEnabled: true,
        contentTemplate: function(contentElement) {
            const scrollContainer = $("<div id='settingsScrollView'></div>");
            contentElement.append(scrollContainer);
            const content = $(`
                <div class="settings-popup-content">
                    <div class="settings-section">
                        <div class="settings-controls">
                            <div style="width: 300px;">
                                <div id="settingsCompanySelect"></div>
                            </div>
                            <div style="width: 300px;">
                                <div id="settingsCategorySelect"></div>
                            </div>
                            <div>** برای ویرایش روی سلول دبل کلیک کنید.</div>
                        </div>
                    </div>
                    <div id="sheetsManagementContainer">
                        <div style="text-align: center; padding: 50px; color: #666;">
                            لطفاً ابتدا شرکت و دسته‌بندی را انتخاب کنید
                        </div>
                    </div>
                </div>
            `);
            
        scrollContainer.dxScrollView({
            direction: "vertical",
            showScrollbar: "always",
            useNative: true,
            bounceEnabled: false
        });
        $("#settingsScrollView").dxScrollView("instance").content().append(content);
            initializeSettingsControls();
        },
        onHiding: function() {
            // Clear data when popup closes
            clearSettingsData();
        }
    }).dxPopup("instance");

    // Settings button click event
    $("#settingsButton").click(function() {
        settingsPopup.show();
        loadSettingsCompanies();
    });
}

function initializeSettingsControls() {
    // Settings Company SelectBox
    settingsCompanySelectBox = $("#settingsCompanySelect").dxSelectBox({
        placeholder: "انتخاب شرکت...",
        searchEnabled: true,
        displayExpr: "companyName",
        rtlEnabled: true,
        valueExpr: "companyId",
        onValueChanged: function(e) {
            settingsPopup._$title.text("");
            const companyId = e.value || 0;
            if (companyId > 0) {
                settingsPopup.option("title",settingsCompanySelectBox.option("displayValue"));
                loadSettingsCategories(companyId);
            } else {
                settingsCategorySelectBox.option({ dataSource: [], value: null });
                clearSheetsManagement();
            }
        }
    }).dxSelectBox("instance");

    // Settings Category SelectBox
    settingsCategorySelectBox = $("#settingsCategorySelect").dxSelectBox({
        placeholder: "انتخاب دسته‌بندی...",
        displayExpr: "CategoryNameFa",
        rtlEnabled: true,
        valueExpr: "CategoryID",
        onValueChanged: function(e) {
            const categoryId = e.value || 0;
            if (categoryId > 0) {
                settingsPopup.option("title",settingsCompanySelectBox.option("displayValue") + " > " +settingsCategorySelectBox.option("displayValue"));
                loadSheetsForManagement(categoryId);
            } else {
                clearSheetsManagement();
            }
        }
    }).dxSelectBox("instance");
}

function loadSettingsCompanies() {
    $.ajax({
        url: 'Controller/cApi.ashx?action=getcompanies',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success && response.data) {
                settingsCompanySelectBox.option({
                    dataSource: response.data,
                    placeholder: "-- انتخاب شرکت --"
                });
            }
        },
        error: function(xhr, status, error) {
            DevExpress.ui.notify('خطا در بارگیری شرکت‌ها: ' + error, 'error', 3000);
        }
    });
}

function loadSettingsCategories(companyId) {
    $.ajax({
        url: `Controller/cApi.ashx?action=getsheetcategories&companyId=${companyId}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success && response.data) {
                settingsCategorySelectBox.option({
                    dataSource: response.data,
                    placeholder: "-- انتخاب دسته‌بندی --"
                });
            }
        },
        error: function(xhr, status, error) {
            DevExpress.ui.notify('خطا در بارگیری دسته‌بندی‌ها: ' + error, 'error', 3000);
        }
    });
}

function loadSheetsForManagement(categoryId) {
    Promise.all([
        loadSettingsSheets(categoryId),
        loadSettingsItems(categoryId)
    ]).then(() => {
        createSheetsManagementGrids();
    }).catch(error => {
        DevExpress.ui.notify('خطا در بارگیری اطلاعات: ' + error, 'error', 3000);
    });
}

function loadSettingsSheets(categoryId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `Controller/cApi.ashx?action=getSheet&categoryId=${categoryId}`,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    settingsSheets = response.data || [];
                    resolve();
                } else {
                    reject(response.error || 'خطا در بارگیری شیت‌ها');
                }
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}

function loadSettingsItems(categoryId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `Controller/cApi.ashx?action=getItems&categoryId=${categoryId}`,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    settingsItems = response.data || [];
                    resolve();
                } else {
                    reject(response.error || 'خطا در بارگیری آیتم‌ها');
                }
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}
function createSheetsManagementGrids() {
    if (!settingsSheets.length) {
        $("#sheetsManagementContainer").html('<div style="text-align: center; padding: 50px; color: #666;">هیچ شیتی یافت نشد</div>');
        return;
    }

    let managementHtml = '';
    settingsSheets.forEach(sheet => {
        managementHtml += `
            <div class="sheet-management-grid">
                <div class="sheet-header">${sheet.SheetNameFa}</div>
                <div class="add-item-section">
                    <div style="font-weight: 600; margin-bottom: 10px; color: #495057;">اضافه کردن آیتم جدید:</div>
                    <div class="add-item-controls">
                        <div style="width: 200px;">
                            <div id="newItemNameFa_${sheet.SheetID}"></div>
                        </div>
                        <div style="width: 200px;">
                            <div id="newItemName_${sheet.SheetID}"></div>
                        </div>
                        <div style="width: 120px;">
                            <div id="newItemType_${sheet.SheetID}"></div>
                        </div>
                        <div style="width: 120px;">
                            <div id="newDataType_${sheet.SheetID}"></div>
                        </div>
                        <button id="addItemBtn_${sheet.SheetID}" class="dx-button dx-button-mode-contained dx-button-default ">+</button>
                    </div>
                </div>
                <div id="itemsGrid_${sheet.SheetID}"></div>
            </div>
        `;
    });

    $("#sheetsManagementContainer").html(managementHtml);

    // Initialize grids and controls for each sheet
    settingsSheets.forEach(sheet => {
        createItemManagementGrid(sheet);
        initializeAddItemControls(sheet);
    });
}

function createItemManagementGrid(sheet) {
    const sheetItems = settingsItems.filter(item => item.SheetID === sheet.SheetID);
    
    const grid = $(`#itemsGrid_${sheet.SheetID}`).dxDataGrid({
        dataSource: sheetItems,
        columns: [
            {
                dataField: 'OrderIndex',
                caption: 'ترتیب',
                width: 80,
                dataType: 'number'
            },
            {
                dataField: 'ItemNameFa',
                caption: 'نام فارسی',
                width: 250
            },
            {
                dataField: 'ItemName',
                caption: 'نام انگلیسی',
                width: 250
            },
            {
                dataField: 'ItemType',
                caption: 'نوع آیتم',
                width: 120,
                lookup: {
                    dataSource: [
                        { value: 'Header', text: 'سربرگ' },
                        { value: 'Data', text: 'داده' },
                        { value: 'Sum', text: 'جمع' }
                    ],
                    displayExpr: 'text',
                    valueExpr: 'value'
                }
            },
            {
                dataField: 'DataType',
                caption: 'نوع داده',
                width: 120,
                lookup: {
                    dataSource: [
                        { value: 'Amount', text: 'مبلغ' },
                        { value: 'String', text: 'متن' }
                    ],
                    displayExpr: 'text',
                    valueExpr: 'value'
                }
            },
            {
                dataField: 'IsActive',
                caption: 'فعال',
                width: 80,
                dataType: 'boolean'
            },
            /*{
                type: 'buttons',
                width: 100,
                buttons: [
                    {
                        hint: 'حذف',
                        icon: 'trash',
                        onClick: function(e) {
                            deleteStaticItem(e.row.data.ItemID, sheet.SheetID);
                        }
                    }
                ]
            }*/
        ],
        rtlEnabled: true,
        showBorders: true,
        showRowLines: true,
        showColumnLines: true,
        rowAlternationEnabled: true,
        editing: {
            mode: 'cell',
            allowUpdating: true,
            startEditAction: 'dblClick'
        },
        onRowUpdated: function(e) {
            updateStaticItem(e.data);
        },
        sorting: {
            mode: 'single'
        },
        paging: {
            pageSize: 10
        }
    }).dxDataGrid("instance");

    sheetItemGrids[sheet.SheetID] = grid;
}

function initializeAddItemControls(sheet) {
    // Item Name Farsi
    $(`#newItemNameFa_${sheet.SheetID}`).dxTextBox({
        placeholder: "نام فارسی آیتم",
        rtlEnabled: true
    });

    // Item Name English
    $(`#newItemName_${sheet.SheetID}`).dxTextBox({
        placeholder: "نام انگلیسی آیتم"
    });

    // Item Type
    $(`#newItemType_${sheet.SheetID}`).dxSelectBox({
        dataSource: [
            { value: 'Header', text: 'سربرگ' },
            { value: 'Data', text: 'داده' },
            { value: 'Sum', text: 'جمع' }
        ],
        displayExpr: 'text',
        valueExpr: 'value',
        placeholder: "نوع آیتم",
        rtlEnabled: true,
        value: 'Data'
    });

    // Data Type
    $(`#newDataType_${sheet.SheetID}`).dxSelectBox({
        dataSource: [
            { value: 'Amount', text: 'مبلغ' },
            { value: 'String', text: 'متن' }
        ],
        displayExpr: 'text',
        valueExpr: 'value',
        placeholder: "نوع داده",
        rtlEnabled: true,
        value: 'Amount'
    });

    // Add button
    $(`#addItemBtn_${sheet.SheetID}`).click(function() {
        addNewStaticItem(sheet.SheetID);
    });
}
function addNewStaticItem(sheetId) {
    const itemNameFa = $(`#newItemNameFa_${sheetId}`).dxTextBox("instance").option("value");
    const itemName = $(`#newItemName_${sheetId}`).dxTextBox("instance").option("value");
    const itemType = $(`#newItemType_${sheetId}`).dxSelectBox("instance").option("value");
    const dataType = $(`#newDataType_${sheetId}`).dxSelectBox("instance").option("value");

    if (!itemNameFa || !itemName) {
        DevExpress.ui.notify('لطفاً نام فارسی و انگلیسی آیتم را وارد کنید', 'warning', 3000);
        return;
    }

    const newItem = {
        SheetID: sheetId,
        ItemName: itemName,
        ItemNameFa: itemNameFa,
        ItemType: itemType,
        DataType: dataType,
        IsActive: true,
        OrderIndex: (settingsItems.filter(i => i.SheetID === sheetId).length + 1) * 10
    };

    // API call to save new item
    $.ajax({
        url: 'Controller/cApi.ashx?action=addstaticitem',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(newItem),
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                // Add to local array with new ID
                const addedItem = { ...newItem, ItemID: response.itemId };
                settingsItems.push(addedItem);
                sheetItemGrids[sheetId].option("dataSource", settingsItems.filter(item => item.SheetID === sheetId));
                
                // Clear form
                $(`#newItemNameFa_${sheetId}`).dxTextBox("instance").option("value", "");
                $(`#newItemName_${sheetId}`).dxTextBox("instance").option("value", "");
                
                DevExpress.ui.notify(response.message || 'آیتم جدید اضافه شد', 'success', 2000);
            } else {
                DevExpress.ui.notify('خطا در اضافه کردن آیتم: ' + response.error, 'error', 3000);
            }
        },
        error: function(xhr, status, error) {
            DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
        }
    });
}
function updateStaticItem(itemData) {
    $.ajax({
        url: 'Controller/cApi.ashx?action=updatestaticitem',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(itemData),
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                // Update local array
                const index = settingsItems.findIndex(item => item.ItemID === itemData.ItemID);
                if (index > -1) {
                    settingsItems[index] = { ...settingsItems[index], ...itemData };
                }
                DevExpress.ui.notify(response.message || 'آیتم به‌روزرسانی شد', 'success', 2000);
            } else {
                DevExpress.ui.notify('خطا در به‌روزرسانی آیتم: ' + response.error, 'error', 3000);
                // Refresh grid to revert changes
                const sheetId = itemData.SheetID;
                sheetItemGrids[sheetId].option("dataSource", settingsItems.filter(item => item.SheetID === sheetId));
            }
        },
        error: function(xhr, status, error) {
            DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
            // Refresh grid to revert changes
            const sheetId = itemData.SheetID;
            sheetItemGrids[sheetId].option("dataSource", settingsItems.filter(item => item.SheetID === sheetId));
        }
    });
}

function deleteStaticItem(itemId, sheetId) {
    DevExpress.ui.dialog.confirm("آیا از حذف این آیتم اطمینان دارید؟", "تأیید حذف").then(function(result) {
        if (result) {
            $.ajax({
                url: `Controller/cApi.ashx?action=deletestaticitem&itemId=${itemId}`,
                type: 'POST',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        // Update local array based on response
                        const index = settingsItems.findIndex(item => item.ItemID === itemId);
                        if (index > -1) {
                            if (response.message.includes('غیرفعال')) {
                                // Item was deactivated, not deleted - update IsActive status
                                settingsItems[index].IsActive = false;
                            } else {
                                // Item was actually deleted - remove from array
                                settingsItems.splice(index, 1);
                            }
                            // Refresh grid
                            sheetItemGrids[sheetId].option("dataSource", settingsItems.filter(item => item.SheetID === sheetId));
                        }
                        DevExpress.ui.notify(response.message, 'success', 2000);
                    } else {
                        DevExpress.ui.notify('خطا در حذف آیتم: ' + response.error, 'error', 3000);
                    }
                },
                error: function(xhr, status, error) {
                    DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
                }
            });
        }
    });
}
function clearSheetsManagement() {
    $("#sheetsManagementContainer").html('<div style="text-align: center; padding: 50px; color: #666;">لطفاً ابتدا شرکت و دسته‌بندی را انتخاب کنید</div>');
    sheetItemGrids = {};
}

function clearSettingsData() {
    settingsSheets = [];
    settingsItems = [];
    sheetItemGrids = {};
    if (settingsCompanySelectBox) {
        settingsCompanySelectBox.option("value", null);
    }
    if (settingsCategorySelectBox) {
        settingsCategorySelectBox.option("value", null);
    }
}
function initializeControls() {
    // Initialize Company SelectBox
    companySelectBox = $("#companySelectBox").dxSelectBox({
        placeholder: "در حال بارگیری...",
        searchEnabled: true,
        displayExpr: "companyName",
        rtlEnabled: true,
        valueExpr: "companyId",
        onValueChanged: function(e) {
            selectedCompanyId = e.value || 0;
            if (selectedCompanyId > 0) {
                const selectedItem = e.component.option('items').find(item => item.companyId === selectedCompanyId);
                loadSheetCategories();
            } else {
                clearData();
            }
        }
    }).dxSelectBox("instance");

    // Initialize Fiscal Year SelectBox
    fiscalYearSelectBox = $("#fiscalYearSelectBox").dxSelectBox({
        placeholder: "انتخاب سال",
        rtlEnabled: true,
        onValueChanged: function(e) {
            selectedFiscalYear = e.value || 0;
            if (selectedFiscalYear > 0 && selectedCompanyId > 0) {
                loadTimePeriods();
                if (selectedCategoryId > 0) {
                    loadCategoryData();
                }
            }
        }
    }).dxSelectBox("instance");
}

function setDefaultFiscalYear() {
    // Calculate current Persian year
    const today = new Date();
    const persianYear = today.getMonth() < 3 ? 
        (today.getFullYear() - 621) : 
        (today.getFullYear() - 620);
    
    const fiscalYears = [];
    for (let i = persianYear - 2; i <= persianYear + 2; i++) {
        fiscalYears.push(i);
    }
    
    fiscalYearSelectBox.option({
        dataSource: fiscalYears,
        value: persianYear
    });
    
    selectedFiscalYear = persianYear;
}

function loadCompanies() {
    $.ajax({
        url: 'Controller/cApi.ashx?action=getcompanies',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success && response.data && response.data.length > 0) {
                companySelectBox.option({
                    dataSource: response.data,
                    placeholder: "-- انتخاب شرکت --",
                    value: response.data[0].companyId // Select first company by default
                });
            } else {
                showError('خطا در بارگیری لیست شرکت‌ها: ' + (response.error || 'شرکتی یافت نشد'));
            }
        },
        error: function(xhr, status, error) {
            showError('خطا در ارتباط با سرور: ' + error);
        }
    });
}

function loadTimePeriods() {
    if (!selectedFiscalYear) return;
    
    $.ajax({
        url: `Controller/cApi.ashx?action=getTimePeriods&fiscalYear=${selectedFiscalYear}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success && response.data) {
                timePeriods = response.data.filter(p => p.PeriodType === 'Monthly');
                if (selectedCategoryId > 0) {
                    refreshGrids();
                }
            }
        },
        error: function(xhr, status, error) {
            console.error('خطا در بارگیری دوره‌ها:', error);
        }
    });
}

function loadSheetCategories() {
    if (!selectedCompanyId) return;
    
    $.ajax({
        url: `Controller/cApi.ashx?action=getsheetcategories&companyId=${selectedCompanyId}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success && response.data && response.data.length > 0) {
                buildTabs(response.data);
                loadTimePeriods();
            } else {
                showEmptyTabs();
            }
        },
        error: function(xhr, status, error) {
            showError('خطا در بارگیری دسته‌بندی‌ها: ' + error);
        }
    });
}

function buildTabs(categories) {
    const tabsHtml = categories.map(category => 
        `<button class="tab-item" data-category-id="${category.CategoryID}" onclick="selectCategory(${category.CategoryID})">${category.CategoryNameFa}</button>`
    ).join('');
    
    $('#categoryTabs').html(tabsHtml);
    
    // Select first tab by default
    if (categories.length > 0) {
        selectCategory(categories[0].CategoryID);
    }
}

function selectCategory(categoryId) {
    selectedCategoryId = categoryId;
    
    // Update active tab
    $('.tab-item').removeClass('active');
    $(`.tab-item[data-category-id="${categoryId}"]`).addClass('active');
    
    // Load category data
    loadCategoryData();
}
let historicalDataTwoYears = [];
let historicalDataPreviousYear = [];
let currentYearData = [];
function loadCategoryData() {
    if (!selectedCategoryId || !selectedCompanyId || !selectedFiscalYear) return;
    
    showLoading();
    
    // Load sheets and items in parallel
    Promise.all([
        loadSheets(),
        loadItems()
    ]).then(() => {
        createGrids();
    }).catch(error => {
        showError('خطا در بارگیری اطلاعات: ' + error);
    });
}

function loadSheets() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `Controller/cApi.ashx?action=getSheet&categoryId=${selectedCategoryId}`,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success && response.data) {
                    sheets = response.data;
                    resolve();
                } else {
                    reject(response.error || 'خطا در بارگیری شیت‌ها');
                }
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}

function loadItems() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `Controller/cApi.ashx?action=getItems&categoryId=${selectedCategoryId}`,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success && response.data) {
                    items = response.data;
                    resolve();
                } else {
                    reject(response.error || 'خطا در بارگیری آیتم‌ها');
                }
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}

function createGrids() {
    if (!sheets.length) {
        showEmptyMessage('هیچ شیتی برای این دسته‌بندی یافت نشد');
        return;
    }

    let gridsHtml = '';
    sheets.forEach(sheet => {
        gridsHtml += `
            <div class="sheet-grid">
                <div class="sheet-grid-header">${sheet.SheetNameFa}</div>
                <div class="sheet-grid-content">
                    <div id="grid_${sheet.SheetID}" class="grid_sheet" ></div>
                </div>
            </div>
        `;
    });
    
    $('#gridsContainer').html(gridsHtml);
    
    // Initialize grids
    sheets.forEach(sheet => {
        createSheetGrid(sheet);
    });
}

function createSheetGrid(sheet) {
    const sheetItems = items.filter(item => item.SheetID === sheet.SheetID).sort((a, b) => a.OrderIndex - b.OrderIndex);
    
    if (!sheetItems.length) {
        $(`#grid_${sheet.SheetID}`).html('<div class="empty-message">هیچ آیتمی برای این شیت تعریف نشده است</div>');
        return;
    }

    // Check if sheet has mixed data types
    const hasAmountData = sheetItems.some(item => item.DataType === 'Amount');
    const hasStringData = sheetItems.some(item => item.DataType === 'String');

    // Calculate years for columns
    const currentYear = selectedFiscalYear;
    const previousYear = currentYear - 1;
    const twoYearsAgo = currentYear - 2;

    // Build month columns
    const monthColumns = [];
    timePeriods.forEach(period => {
        if (hasAmountData && hasStringData) {
            monthColumns.push({
                dataField: `period_amount_${period.PeriodID}`,
                caption: `${getMonthName(period.PeriodNumber)} (مبلغ)`,
                dataType: 'number',
                format: { type: 'fixedPoint', precision: 0 },
                width: 130,
                alignment: 'left',
                customizeText: function(e) {
                    if (e.value === null || e.value === undefined) return '';
                    return e.value.toLocaleString();
                }
            });
            monthColumns.push({
                dataField: `period_string_${period.PeriodID}`,
                caption: `${getMonthName(period.PeriodNumber)} (متن)`,
                dataType: 'string',
                width: 130,
                alignment: 'center'
            });
        } else if (hasAmountData) {
            monthColumns.push({
                dataField: `period_${period.PeriodID}`,
                caption: getMonthName(period.PeriodNumber),
                dataType: 'number',
                format: { type: 'fixedPoint', precision: 0 },
                width: 120,
                alignment: 'left',
                customizeText: function(e) {
                    if (e.value === null || e.value === undefined) return '';
                    return e.value.toLocaleString();
                }
            });
        } else {
            monthColumns.push({
                dataField: `period_${period.PeriodID}`,
                caption: getMonthName(period.PeriodNumber),
                dataType: 'string',
                width: 120,
                alignment: 'center'
            });
        }
    });

    // Build data source with populated data
    const dataSource = sheetItems.map(item => {
        const row = {
            ItemID: item.ItemID,
            ItemNameFa: item.ItemNameFa,
            ItemType: item.ItemType,
            FormulaExpression: item.FormulaExpression,
            OrderIndex: item.OrderIndex,
            DataType: item.DataType,
            twoYearsAgo: getHistoricalValue(item.ItemID, twoYearsAgo),
            previousYear: getHistoricalValue(item.ItemID, previousYear),
            ratioToPreviousYear: null,
            ratioToTwoYearsAgo: null
        };

        // Initialize period data
        timePeriods.forEach(period => {
            if (hasAmountData && hasStringData) {
                if (item.DataType === 'Amount') {
                    row[`period_amount_${period.PeriodID}`] = getCurrentYearValue(item.ItemID, period.PeriodID, 'Amount');
                    row[`period_string_${period.PeriodID}`] = undefined;
                } else {
                    row[`period_amount_${period.PeriodID}`] = undefined;
                    row[`period_string_${period.PeriodID}`] = getCurrentYearValue(item.ItemID, period.PeriodID, 'String');
                }
            } else {
                row[`period_${period.PeriodID}`] = getCurrentYearValue(item.ItemID, period.PeriodID, item.DataType);
            }
        });

        return row;
    });

    // Initialize grid with band columns and custom header styling
    const grid = $(`#grid_${sheet.SheetID}`).dxDataGrid({
        dataSource: dataSource,
        columns: [
            {
                caption: 'شرح',
                alignment: 'center',
                
                headerCellTemplate: function(header, info) {
                    header.addClass('custom-header-level-0');
                    header.text(info.column.caption);
                },
                columns: [{
                    dataField: 'ItemNameFa',
                    caption: '',
                    width: 300,
                    allowEditing: false,
                    fixed: true,
                    fixedPosition: 'right',
                    cssClass: "item-cell", 
                    headerCellTemplate: function(header, info) {
                        header.addClass('custom-header-level-1');
                        //header.text('شرح');
                    }
                }]
            },
            {
                caption: `${twoYearsAgo}`,
                alignment: 'center',
                headerCellTemplate: function(header, info) {
                    header.addClass('custom-header-level-0');
                    header.text(info.column.caption);
                },
                columns: [{
                    dataField: 'twoYearsAgo',
                    caption: 'عملکرد',
                    dataType: hasAmountData ? 'number' : 'string',
                    width: 120,
                    alignment: hasAmountData ? 'left' : 'center',
                    allowEditing: false,
                    headerCellTemplate: function(header, info) {
                        header.addClass('custom-header-level-1');
                        header.text(info.column.caption);
                    },
                    customizeText: function(e) {
                        if (hasAmountData && e.value !== null && e.value !== undefined) {
                            return e.value.toLocaleString();
                        }
                        return e.value || '';
                    }
                }]
            },
            {
                caption: `${previousYear}`,
                alignment: 'center',
                headerCellTemplate: function(header, info) {
                    header.addClass('custom-header-level-0');
                    header.text(info.column.caption);
                },
                columns: [{
                    dataField: 'previousYear',
                    caption: 'عملکرد',
                    dataType: hasAmountData ? 'number' : 'string',
                    width: 120,
                    alignment: hasAmountData ? 'left' : 'center',
                    allowEditing: false,
                    cssClass: "l-b-col",
                    headerCellTemplate: function(header, info) {
                        header.addClass('custom-header-level-1');
                        header.text(info.column.caption);
                    },
                    customizeText: function(e) {
                        if (hasAmountData && e.value !== null && e.value !== undefined) {
                            return e.value.toLocaleString();
                        }
                        return e.value || '';
                    }
                }]
            },
            {
                caption: `${currentYear}`,
                alignment: 'center',
                headerCellTemplate: function(header, info) {
                    header.addClass('custom-header-level-0');
                    header.text(info.column.caption);
                },
                columns: monthColumns.map(col => ({
                    ...col,
                    headerCellTemplate: function(header, info) {
                        header.addClass('custom-header-level-1');
                        header.text(info.column.caption);
                    }
                    
                }))
            },
            {
                caption: 'نسبت ها',
                alignment: 'center',
                headerCellTemplate: function(header, info) {
                    header.addClass('custom-header-level-0');
                    header.text(info.column.caption);
                },
                columns: [
                    {
                        dataField: 'ratioToPreviousYear',
                        caption: `${previousYear}`,
                        dataType: 'number',
                        width: 120,
                        alignment: 'center',
                        allowEditing: false,
                        cssClass: "r-b-col",
                        headerCellTemplate: function(header, info) {
                            header.addClass('custom-header-level-1');
                            header.text(info.column.caption);
                        },
                        customizeText: function(e) {
                            if (e.value === null || e.value === undefined) return '';
                            return (e.value * 100).toFixed(1) + '%';
                        }
                    },
                    {
                        dataField: 'ratioToTwoYearsAgo',
                        caption: `${twoYearsAgo}`,
                        dataType: 'number',
                        width: 120,
                        alignment: 'center',
                        allowEditing: false,
                        headerCellTemplate: function(header, info) {
                            header.addClass('custom-header-level-1');
                            header.text(info.column.caption);
                        },
                        customizeText: function(e) {
                            if (e.value === null || e.value === undefined) return '';
                            return (e.value * 100).toFixed(1) + '%';
                        }
                    }
                ]
            }
        ],
        rtlEnabled: true,
        allowColumnReordering: false,
        allowColumnResizing: true,
        showBorders: false,
        showRowLines: true,
        showColumnLines: false,
        rowAlternationEnabled: true,
        columnResizingMode: 'widget',
        editing: {
            mode: 'batch',
            allowUpdating: true,
            startEditAction: 'click'
        },
        onCellPrepared: function(e) {
            if (e.rowType === 'data') {
                const item = e.data;
                
                if (item.ItemType === 'Header') {
                    e.cellElement.addClass('header-row');
                } else if (item.ItemType === 'Sum') {
                    e.cellElement.addClass('sum-row');
                }
                
                // Make calculated cells and wrong data type cells readonly
                if (e.column.dataField && e.column.dataField.startsWith('period_')) {
                    if (item.ItemType !== 'Data') {
                        e.cellElement.addClass('readonly-cell');
                    } else {
                        const isAmountColumn = e.column.dataField.includes('_amount_') || (!e.column.dataField.includes('_string_') && e.column.dataType === 'number');
                        const isStringColumn = e.column.dataField.includes('_string_') || (!e.column.dataField.includes('_amount_') && e.column.dataType === 'string');
                        
                        if ((item.DataType === 'Amount' && isStringColumn) || 
                            (item.DataType === 'String' && isAmountColumn)) {
                            e.cellElement.addClass('readonly-cell');
                        }
                    }
                }
            }
        },
        onEditorPreparing: function(e) {
            if (e.parentType === 'dataRow') {
                const item = e.row.data;
                
                if (item.ItemType !== 'Data') {
                    e.cancel = true;
                    return;
                }
                
                if (e.dataField && e.dataField.startsWith('period_')) {
                    const isAmountColumn = e.dataField.includes('_amount_') || (!e.dataField.includes('_string_') && hasAmountData && !hasStringData);
                    const isStringColumn = e.dataField.includes('_string_') || (!e.dataField.includes('_amount_') && hasStringData && !hasAmountData);
                    
                    if ((item.DataType === 'Amount' && isStringColumn) || 
                        (item.DataType === 'String' && isAmountColumn)) {
                        e.cancel = true;
                    }
                }
                
                if (e.dataField && e.dataField.includes('_string_') && item.DataType === 'String') {
                    e.editorOptions = {
                        rtlEnabled: true,
                        placeholder: 'متن را وارد کنید...'
                    };
                }
                
                if (e.dataField && (e.dataField.includes('_amount_') || (!e.dataField.includes('_string_') && item.DataType === 'Amount'))) {
                    e.editorOptions = {
                        format: { type: 'fixedPoint', precision: 0 },
                        placeholder: '0'
                    };
                }
            }
        },
        onCellValueChanged: function(e) {
            if (e.dataField && e.dataField.startsWith('period_')) {
                setTimeout(() => {
                    recalculateFormulas(e.component, hasAmountData, hasStringData);
                    calculateRatios(e.component);
                }, 50);
            }
        }
    }).dxDataGrid("instance");

    // Calculate initial ratios
    setTimeout(() => {
        calculateRatios(grid);
    }, 100);

    sheetGrids[sheet.SheetID] = grid;
}

    function recalculateFormulas(grid, hasAmountData, hasStringData) {
        const dataSource = grid.option('dataSource');
        
        dataSource.forEach(row => {
            if (row.ItemType === 'Sum' && row.DataType === 'Amount') {
                timePeriods.forEach(period => {
                    let sum = 0;
                    const periodField = hasAmountData && hasStringData ? 
                        `period_amount_${period.PeriodID}` : 
                        `period_${period.PeriodID}`;
                    
                    // Sum only Amount type data items
                    dataSource.forEach(sourceRow => {
                        if (sourceRow.ItemType === 'Data' && 
                            sourceRow.DataType === 'Amount' && 
                            sourceRow[periodField]) {
                            sum += sourceRow[periodField] || 0;
                        }
                    });
                    
                    row[periodField] = sum;
                });
            }
            // Note: String type sums would need custom logic based on business requirements
        });
        
        grid.refresh();
    }
function getHistoricalValue(itemId, fiscalYear) {
    let data = [];
    if (fiscalYear === selectedFiscalYear - 2) {
        data = historicalDataTwoYears;
    } else if (fiscalYear === selectedFiscalYear - 1) {
        data = historicalDataPreviousYear;
    }
    
    const record = data.find(item => item.ItemID === itemId);
    return record ? record.TotalAmount : null;
}

// Helper function to get current year value by ItemID, PeriodID and DataType
function getCurrentYearValue(itemId, periodId, dataType) {
    const record = currentYearData.find(item => item.ItemID === itemId && item.PeriodID === periodId);
    if (!record) return null;
    
    if (dataType === 'Amount') {
        return record.AmountValue;
    } else if (dataType === 'String') {
        return record.StringValue;
    }
    return null;
}
function calculateRatios(grid) {
    const dataSource = grid.option('dataSource');
    
    dataSource.forEach(row => {
        if (row.ItemType === 'Data' && row.DataType === 'Amount') {
            // Calculate current year total (sum of all months)
            let currentYearTotal = 0;
            timePeriods.forEach(period => {
                const periodField = `period_${period.PeriodID}`;
                const periodAmountField = `period_amount_${period.PeriodID}`;
                
                // Check which field exists
                const value = row[periodField] !== undefined ? row[periodField] : row[periodAmountField];
                if (value) {
                    currentYearTotal += value || 0;
                }
            });
            
            // Calculate ratios
            if (row.previousYear && row.previousYear !== 0) {
                row.ratioToPreviousYear = currentYearTotal / row.previousYear;
            }
            
            if (row.twoYearsAgo && row.twoYearsAgo !== 0) {
                row.ratioToTwoYearsAgo = currentYearTotal / row.twoYearsAgo;
            }
        }
    });
    
    grid.refresh();
}
function getMonthName(monthNumber) {
    const months = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
    return months[monthNumber - 1] || monthNumber.toString();
}

function refreshGrids() {
    if (selectedCategoryId > 0) {
        createGrids();
    }
}

function showLoading() {
    $('#gridsContainer').html(`
        <div class="loading-message">
            <i class="fas fa-spinner fa-spin"></i><br>
            در حال بارگیری اطلاعات...
        </div>
    `);
}

function showEmptyTabs() {
    $('#categoryTabs').html('<div class="empty-message">دسته‌بندی‌ای یافت نشد</div>');
    $('#gridsContainer').html('<div class="empty-message"><i class="fas fa-info-circle"></i><br>هیچ دسته‌بندی‌ای برای این شرکت تعریف نشده است</div>');
}

function showEmptyMessage(message) {
    $('#gridsContainer').html(`<div class="empty-message"><i class="fas fa-info-circle"></i><br>${message}</div>`);
}

function showError(message) {
    $('#gridsContainer').html(`
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i><br>
            ${message}
        </div>
    `);

    DevExpress.ui.notify({
        message: message,
        type: "error",
        displayTime: 5000,
        position: {
            my: "top center",
            at: "top center"
        }
    });
}

function clearData() {
    sheets = [];
    items = [];
    timePeriods = [];
    selectedCategoryId = 0;
    sheetGrids = {};
    $('#categoryTabs').empty();
    $('#gridsContainer').html(`
        <div class="loading-message">
            <i class="fas fa-building"></i><br>
            لطفاً ابتدا یک شرکت انتخاب کنید
        </div>
    `);
}
    </script>
</asp:Content>
function initializeSearchBox() {
    $("#searchBox").dxTextBox({
        placeholder: "Type and press Enter key to search...",
        rtlEnabled: true,
        stylingMode: "outlined",
        height: 36,
        width: 400,
        mode: "search",
        onValueChanged: function(e) {
            const currentTab = mainTabs ? mainTabs.option("selectedIndex") : 0;
            if (currentTab === 0 && bomGrid) {
                bomGrid.option("searchPanel.text", e.value);
            } else if (currentTab === 1 && bomDetailsGrid) {
                bomDetailsGrid.option("searchPanel.text", e.value);
            } else if (currentTab === 2 && productDefinitionGrid) {
                productDefinitionGrid.option("searchPanel.text", e.value);
            } else if (currentTab === 3 && productCategoryGrid) {
                productCategoryGrid.option("searchPanel.text", e.value);
            }
        }
    });
}

function initializeCompanySelect() {
    companySelectBox = $("#companySelectBox").dxTagBox({
        placeholder: "انتخاب شرکت...",
        searchEnabled: true,
        displayExpr: "companyName",
        valueExpr: "companyId",
        rtlEnabled: true,
        stylingMode: "outlined",
        showSelectionControls: true,
        applyValueMode: "useButtons",
        onValueChanged: function(e) {
            selectedCompanyIds = e.value || [];
            if (selectedCompanyIds.length > 0) {
                loadBomList("bomGrid");
                loadBomComboData();
                loadUnits();
                loadPartProforma();
                if (productDefinitionGrid) loadTempProductList();
                if (bomDetailsGrid) loadBomList("bomDetailsGrid");
            }
        }
    }).dxTagBox("instance");

    // دکمه‌های بروزرسانی
    $("#refreshBtnBottom").click(function() {
        if (selectedCompanyIds.length > 0) {
            loadBomList("bomGrid");
            loadBomComboData();
            loadUnits();
            loadPartProforma();
            if (productDefinitionGrid) loadTempProductList();
            if (bomDetailsGrid) loadBomList("bomDetailsGrid");
        }
    });
}
let mainTabs;
let productCategoryGrid;

function initializeTabs() {
    mainTabs = $("#mainTabs").dxTabPanel({
        rtlEnabled: true,
        height: 'auto',
        items: [
            {
                title: 'ثبت',
                template: function(itemData, itemIndex, itemElement) {
                    itemElement.append('<div id="bomGrid"></div>');
                    initializeBomGrid();
                }
            },
            {
                title: 'جزئیات',
                template: function(itemData, itemIndex, itemElement) {
                    itemElement.append('<div id="bomDetailsGrid"></div>');
                    initializeBomDetailsGrid();
                }
            },
            {
                title: 'محصولات',
                template: function(itemData, itemIndex, itemElement) {
                    itemElement.append('<div id="productDefinitionGrid"></div>');
                    initializeProductDefinitionGrid();
                }
            },
            /*{
                title: 'دسته‌بندی محصولات',
                template: function(itemData, itemIndex, itemElement) {
                    itemElement.append('<div id="productCategoryGrid"></div>');
                    initializeProductCategoryGrid();
                }
            }*/
        ],
        selectedIndex: 0,
        onSelectionChanged: function(e) {
            // Clear search when switching tabs
            $("#searchBox").dxTextBox("instance").option("value", "");
        }
    }).dxTabPanel("instance");
}

function initializeBomGrid() {
    bomGrid = $("#bomGrid").dxDataGrid({
        dataSource: [],
        rtlEnabled: true,
        showBorders: false,
        showRowLines: true,
        showColumnLines: false,
        rowAlternationEnabled: true,
        hoverStateEnabled: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        paging: {
            enabled: false
        },
        searchPanel: {
            visible: false,
            width: 240,
            placeholder: "جستجو..."
        },
        columns: createMainGridCols("main"),
        masterDetail: {
            enabled: true,
            template: function(container, options) {
                $('<div>').addClass('detail-grid').appendTo(container);
                if(options.data.BomCount == 1) createDetailGrid(container.find('.detail-grid'), options.data);
                else createHistoryGrid(container.find('.detail-grid'), options.data);
            }
        },
        onToolbarPreparing: function(e) {

        },
        noDataText: 'هیچ BOM ثبت شده‌ای یافت نشد'
    }).dxDataGrid("instance");
}

let bomDetailsGrid;

function initializeBomDetailsGrid() {
    bomDetailsGrid = $("#bomDetailsGrid").dxDataGrid({
        dataSource: [],
        rtlEnabled: true,
        showBorders: false,
        showRowLines: true,
        showColumnLines: false,
        rowAlternationEnabled: true,
        hoverStateEnabled: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        paging: {
            enabled: false
        },
        searchPanel: {
            visible: false,
            width: 240,
            placeholder: "جستجو..."
        },
        columns: createMainGridCols("details"),
        masterDetail: {
            enabled: false
        },
        onToolbarPreparing: function(e) {

        },
        noDataText: 'هیچ BOM پیش‌فرض یافت نشد'
    }).dxDataGrid("instance");

    loadBomList("bomDetailsGrid");
}

function initializeProductDefinitionGrid() {
    productDefinitionGrid = $("#productDefinitionGrid").dxDataGrid({
        dataSource: [],
        rtlEnabled: true,
        showBorders: false,
        showRowLines: true,
        showColumnLines: false,
        rowAlternationEnabled: true,
        hoverStateEnabled: true,
        height: "60vh",
        width: "100%",
        allowColumnResizing: true,
        columnAutoWidth: true,
        paging: {
            enabled: false
        },
        searchPanel: {
            visible: false,
            width: 240,
            placeholder: "جستجو..."
        },
        columns: createProductDefinitionGridCols(brandsData),
        toolbar: {
            items: [
                {
                    location: 'before',
                    widget: 'dxButton',
                    options: {
                        icon: 'plus',
                        text: 'افزودن محصول جدید',
                        type: 'success',
                        onClick: function() {
                            addNewProduct();
                        }
                    }
                }
            ]
        },
        noDataText: 'هیچ محصولی یافت نشد'
    }).dxDataGrid("instance");
    loadTempProductList();
}
function initializeBomPopup() {
    bomPopup = $("#bomPopup").dxPopup({
        title: "افزودن BOM ",
        width: '95%',
        height: '95%',
        maxWidth: 1400,
        maxHeight: 900,
        showCloseButton: true,
        rtlEnabled: true,
        onShowing: function(e) {
            ingredientCounter = 0;
            e.component.content().empty();
            createBomForm(e.component.content());
        }
    }).dxPopup("instance");

    $("#addProductBtn").click(function() { addNewProduct(); })
    $("#addBomBtn").click(function() {
        if (selectedCompanyIds.length === 0) {
            DevExpress.ui.notify('لطفاً ابتدا شرکت را انتخاب کنید', 'warning', 3000);
            return;
        }
        if (selectedCompanyIds.length > 1) {
            DevExpress.ui.notify('برای افزودن BOM فقط یک شرکت را انتخاب کنید', 'warning', 3000);
            return;
        }
        bomPopup.show();
    });
}

//function initializeApiGrid() {
function initializeInsertBomGrids(apiCategories, divId, updateCalcFunc) {
    return $(`#${divId}`).dxDataGrid({
        dataSource: [],
        rtlEnabled: true,
        showBorders: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        hoverStateEnabled: true,
        columnAutoWidth: true,
        keyExpr: 'id',
        height: "auto",
        editing: {
            mode: 'row',
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            useIcons: true
        },
        onRowInserted: function () {
            updateCalcFunc();
        },
        onRowUpdated: function () {
            updateCalcFunc();
        },
        columns: createBomInsertCols(apiCategories),
    }).dxDataGrid("instance");
    
}

let settingsPopup;
let categoryGrid;

function initializeSettingsPopup() {
    settingsPopup = $("#settingsPopup").dxPopup({
        title: "مدیریت دسته‌بندی‌های BOM",
        width: 800,
        height: 600,
        showCloseButton: true,
        rtlEnabled: true,
        contentTemplate: function(contentElement) {
            contentElement.append('<div id="categoryGrid"></div>');

            categoryGrid = $("#categoryGrid").dxDataGrid({
                dataSource: [],
                rtlEnabled: true,
                showBorders: true,
                columnAutoWidth: true,
                editing: {
                    mode: 'row',
                    allowAdding: true,
                    allowUpdating: true,
                    allowDeleting: true,
                    useIcons: true
                },
                columns: [
                    { dataField: 'productBomCategoryId', caption: 'شناسه', allowEditing: false, width: 50 },
                    { dataField: 'CategoryEn', caption: 'نام انگلیسی', validationRules: [{ type: 'required' }] },
                    { dataField: 'CategoryFa', caption: 'نام فارسی', validationRules: [{ type: 'required' }] },
                    {
                        type: 'buttons',
                        width: 110,
                        buttons: [
                            {
                                name: 'edit',
                                visible: function(e) {
                                    return e.row.data.productBomCategoryId > 2;
                                }
                            },
                            {
                                name: 'delete',
                                visible: function(e) {
                                    return e.row.data.productBomCategoryId > 2;
                                }
                            }
                        ]
                    }
                ],
                onRowInserted: function(e) {
                    saveCategoryData(e.data, 'insert');
                },
                onRowUpdated: function(e) {
                    saveCategoryData(e.data, 'update');
                },
                onRowRemoved: function(e) {
                    deleteCategoryData(e.data);
                },
                toolbar: {
                    items: [
                        {
                            location: 'after',
                            widget: 'dxButton',
                            options: {
                                icon: 'refresh',
                                text: 'بروزرسانی',
                                onClick: function() {
                                    loadCategoryGrid();
                                }
                            }
                        },
                        'addRowButton'
                    ]
                }
            }).dxDataGrid("instance");
        },
        onShowing: function() {
            loadCategoryGrid();
        }
    }).dxPopup("instance");

    $("#settingsBtn").click(function() {
        settingsPopup.show();
    });
}
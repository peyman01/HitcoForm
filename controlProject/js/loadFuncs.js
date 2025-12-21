function loadCurrencies() {
    $.ajax({
        url: 'Controller/cApiBom.ashx?action=getcurrencies',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                CurrencyData = response.currency;
                CurrencySrcData = response.currencySrc;
                currencyRates = response.currencyRates;
            }
        },
        error: function(xhr, status, error) {
            console.error('خطا در بارگیری لیست ارز:', error);
        }
    });
}
function loadCompanies() {
    loader("show");
    $.ajax({
        url: 'Controller/cApiBom.ashx?action=getcompaniesbi',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success && response.data) {
                companySelectBox.option({
                    dataSource: response.data,
                    value: response.data.length > 0 ? [response.data[0].companyId] : []
                });
            }
            loader("hide");
        }
        ,error: function(response){
            DevExpress.ui.notify('خطا در دریافت لیست شرکت ها', 'error', 3000);
            loader("hide");
        }
    });
}

function loadBomCategories() {
    loader("show");
    $.ajax({
        url: 'Controller/cApiBom.ashx?action=getbomcategories',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                bomCategories = response.data;
            }
            loader("hide");
        }
        ,error: function(response){
            DevExpress.ui.notify('خطا در دریافت نوع مواد اولیه', 'error', 3000);
            loader("hide");
        }
    });
}

function loadBomComboData() {
    if (selectedCompanyIds.length === 0) return;
    loader("show");
    $.ajax({
        url: `Controller/cApiBom.ashx?action=getbomcombo&companyId=${selectedCompanyIds[0]}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                bomComboData = response.data;
                if($("#mainProductSelect").dxSelectBox("option"))
                    $("#mainProductSelect").dxSelectBox("option", "dataSource", bomComboData.filter(bc => bc.productBomCategoryId==2 || ((bc.productBomCategoryId || "")==""))); //2: محصول نهایی (Finished Product)
            }
        loader("hide");
        }
        ,error: function(response){
            DevExpress.ui.notify('خطا در دریافت محصولات', 'error', 3000);
            loader("hide");
        }
    });
}

function loadUnits() {
    if (selectedCompanyIds.length === 0) return;
    loader("show");
    $.ajax({
        url: `Controller/cApiBom.ashx?action=getunits&companyId=${selectedCompanyIds[0]}`,
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function(response) {
            if (response.success) {
                unitsData = response.data;
            }
            loader("hide");
        },
        error: function(response){
            DevExpress.ui.notify('خطا در دریافت واحدها', 'error', 3000);
            loader("hide");
        }
    });
}
function loadBomList(targetGrid) {
    if (selectedCompanyIds.length === 0) return;
    loader("show");
    $.ajax({
        url: `Controller/cApiBom.ashx?action=getbomlist&companyId=${selectedCompanyIds.join(',')}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                $(`#${targetGrid}`).dxDataGrid('instance').option('dataSource', response.data);
            }
            loader("hide");
        },
        error: function(xhr, status, error) {
            DevExpress.ui.notify('خطا در بارگذاری لیست BOM: ' + error, 'error', 3000);
            loader("hide");
        }
    });
}
function loadPartProforma() {
    if (selectedCompanyIds.length === 0) return;
    partProformaData = [];
    loader("show");
    $.ajax({
        url: `Controller/cApiBom.ashx?action=getpartproformadata&companyId=${selectedCompanyIds.join(',')}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                partProformaData = response.data;
            }
            loader("hide");
        },
        error: function(xhr, status, error) {
            DevExpress.ui.notify('خطا در بارگذاری لیست Part Proforma: ' + error, 'error', 3000);
            loader("hide");
        }
    });
}

function loadCategoryGrid() {
    loader("show");
    $.ajax({
        url: 'Controller/cApiBom.ashx?action=getbomcategories',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            loader("hide");
            if (response.success) {
                categoryGrid.option('dataSource', response.data);
            }
        },
        error: function(xhr, status, error) {
            loader("hide");
            DevExpress.ui.notify('خطا در بارگذاری دسته‌بندی‌ها: ' + error, 'error', 3000);
        }
    });
}
function loadTempProductList() {
    loader("show");
    $.ajax({
        url: 'Controller/cApiBom.ashx?action=gettempproducts',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                if(productDefinitionGrid) productDefinitionGrid.option('dataSource', response.data);
            }
            loader("hide");
        },
        error: function(xhr, status, error) {
            loader("hide");
            DevExpress.ui.notify('خطا در بارگیری لیست محصولات: ' + error, 'error', 3000);
        }
    });
}

function loadBrands() {
    $.ajax({
        url: 'Controller/cApiBom.ashx?action=getbrands',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                brandsData = response.data;
            }
        },
        error: function(xhr, status, error) {
            console.error('خطا در بارگیری برندها:', error);
        }
    });
}
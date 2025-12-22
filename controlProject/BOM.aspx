<%@ Page Title="" Language="C#" MasterPageFile="master.Master" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Bill of Materials (BOM)</title>
    <script src="js/crudBomFuncs.js"></script>    
    <script src="js/bomInfoFuncs.js"></script>    
    <script src="js/categoryFuncs.js"></script>    
    <script src="js/loadFuncs.js"></script>    
    <script src="js/initilizeFuncs.js"></script>    
    <script src="js/bomGridColumns.js"></script>    
    <script src="js/addProductFuncs.js"></script>    
    <style>

    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="bom-container">
        <!-- Header -->
        <div class="bom-header">
            <div class="bom-title">Bill of Materials (BOM)</div>
            <div style="display: flex; gap: 8px;">
                <div>
                    <button id="settingsBtn" class="add-bom-btn" title="تنظیمات دسته‌بندی‌ها">
                        <i class="dx-icon-preferences" style="vertical-align: middle;"></i>
                    </button>
                    <button id="refreshBtnBottom" class="add-bom-btn" style="min-width: 100px;">
                        <i class="dx-icon-refresh" style="vertical-align: middle;"></i> بروزرسانی
                    </button>
                    <button id="addBomBtn" class="add-bom-btn">+ افزودن BOM</button>
                    <button id="addProductBtn" class="add-bom-btn"> + افزودن محصول</button>
                </div>
            </div>
        </div>
        <input type="hidden" id="actionMode" />
        <!-- Company Filter -->
        <div class="company-filter-container">
            <div style="display: flex; gap: 12px; align-items: flex-end;">
                <div style="flex: 1; max-width: 400px;">
                    <div id="companySelectBox"></div>
                </div>
                <div style="flex: 1; max-width: 300px;">
                    <div id="searchBox"></div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="grid-container">
            <div id="mainTabs"></div>
        </div>

        <!-- Add/Edit BOM Popup -->
        <div id="bomPopup"></div>

        <!-- Product Popup -->
        <div id="productPopup"></div>

        <!-- Settings Popup -->
        <div id="settingsPopup"></div>
        <input type="hidden" id="selectedBaseDate" />
    </div>

    <script>
        let selectedCompanyIds = [];
        let companySelectBox;
        let bomGrid;
        let bomPopup;
        let bomComboData = [];
        let bomCategories = [];
        let currentProductBomHeaderId = null; // برای ذخیره ID در حالت ویرایش
        let unitsData = []; // لیست واحدها
        let productDefinitionGrid;
        let productPopup;
        let brandsData = []; // لیست برندها
        let partProformaData = []; // لیست Part Proforma
        let CurrencyData = [];
        let CurrencySrcData = [];
        let currencyRates = [];
        const todayFa = new Intl.DateTimeFormat('fa-IR', {month: 'long',day: 'numeric'}).format(new Date());
        const packagingCategories = [
            {pkgEn: "PrimaryPackQty", pkgFa: 'تعداد در محصول اصلی'},
            {pkgEn: "SecondaryPackQty", pkgFa: 'تعداد بسته‌بندی ثانویه در بسته‌بندی مادر'},
            {pkgEn: "MasterPackQty", pkgFa: 'تعداد بسته‌بندی اولیه در بسته‌بندی ثانویه'}
        ];

        // تابع عمومی برای چک کردن session expired
        function handleResponse(response) {
            if (response && response.sessionExpired === true) {
                DevExpress.ui.notify('لطفاً دوباره وارد شوید.', 'warning', 3000);
                setTimeout(function() {
                    window.location.href = '../login.aspx?returnUrl=' + encodeURIComponent(window.location.pathname + window.location.search);
                }, 1000);
                return false;
            }
            return true;
        }

        // Global AJAX setup برای چک کردن session در همه response ها
        $.ajaxSetup({
            dataFilter: function(data, type) {
                if (type === 'json') {
                    try {
                        var response = JSON.parse(data);
                        if (response && response.sessionExpired === true) {
                            handleResponse(response);
                            return JSON.stringify({ success: false, error: 'Session expired' });
                        }
                    } catch (e) {
                        // اگر JSON نبود، همونطوری برگردون
                    }
                }
                return data;
            }
        });

        $(document).ready(function() {
            initializeSearchBox();
            initializeCompanySelect();
            initializeTabs();
            initializeBomPopup();
            initializeSettingsPopup();
            loadCompanies();
            loadBomCategories();
            loadBrands();
            loadCurrencies();
        });


        let apiGrid;
        let secondaryPackagingGrid;
        let masterPackagingGrid;
        let lastCategoryId = null;

        function getQuantityCaption() {
            const unitSelect = $("#mainProductUnit").dxSelectBox("instance");
            if (unitSelect) {
                const unitName = unitSelect.option("text");
                if (unitName && unitName !== 'واحد...') {
                    return `مقدار (در 1 ${unitName} محصول اصلی)`;
                }
            }
            return 'مقدار';
        }

        

        // Helper functions for grid calculations
        function updateApiGridCalculations() {
            if (!apiGrid) return;
            const mainQty = $("#mainProductQuantity").dxNumberBox("instance").option("value") || 1;
            
            apiGrid.getVisibleRows().forEach(row => {
                if (row.rowType === 'data' && row.data.Quantity) {

                    const totalQty = row.data.Quantity * mainQty;
                    const unitName = row.data.partUnitName || 'واحد';

                    apiGrid.cellValue(
                        row.rowIndex,
                        "calculationText",
                        //`معادل ${row.data.Quantity} × ${mainQty} = ${totalQty} ${unitName} در بسته‌بندی اولیه`
                        `معادل ${totalQty} ${unitName} در بسته‌بندی اولیه`
                    );
                }
                apiGrid.repaint();
            });
        }

        function updateSecondaryGridCalculations() {
            if (!secondaryPackagingGrid) return;
            const secondaryQty = $("#secondaryPackagingQuantity").dxNumberBox("instance").option("value") || 1;
            secondaryPackagingGrid.getVisibleRows().forEach(row => {
                if (row.rowType === 'data' && row.data.Quantity) {
                    const qtyPerMain = row.data.Quantity / secondaryQty;
                    const unitName = row.data.partUnitName || 'واحد';

                    secondaryPackagingGrid.cellValue(
                        row.rowIndex,
                        "calculationText",
                        `معادل ${qtyPerMain.toFixed(3)} ${unitName} در بسته‌بندی اولیه`
                    );
                }
                secondaryPackagingGrid.repaint();
            });
        }
        function updateMasterGridCalculations() {
            if (!masterPackagingGrid) return;
            const secondaryQty = $("#secondaryPackagingQuantity").dxNumberBox("instance").option("value") || 1;
            const masterQty = $("#masterPackagingQuantity").dxNumberBox("instance").option("value") || 1;
            masterPackagingGrid.getVisibleRows().forEach(row => {
                if (row.rowType === 'data' && row.data.Quantity) {
                    const qtyPerMain = row.data.Quantity / (secondaryQty * masterQty);
                    const unitName = row.data.partUnitName || 'واحد';
                    masterPackagingGrid.cellValue(
                        row.rowIndex,
                        "calculationText",
                        `معادل ${qtyPerMain.toFixed(3)} ${unitName} در بسته‌بندی ثانویه`);
                }
                masterPackagingGrid.repaint();
            });
        }




 


    </script>
</asp:Content>
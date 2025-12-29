function createHistoryGrid(container, masterData){
    loader("show");
    $.ajax({
        url: `Controller/cApiBom.ashx?action=getbomhistory&productBomHeaderId=${masterData.ProductBomHeaderId}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                container.dxDataGrid({
                dataSource: response.data,
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
                columns: createMainGridCols("history"),
                masterDetail: {
                    enabled: true,
                    template: function(container, options) {
                        $('<div>').addClass('history-detail-grid').appendTo(container);
                        createDetailGrid(container.find('.history-detail-grid'), options.data);
                    }
                },
                onToolbarPreparing: function(e) {

                },
                noDataText: 'هیچ BOM ثبت شده‌ای یافت نشد'
            })
            }
            loader("hide");
        }
        ,error: function(response){
            DevExpress.ui.notify('خطا در دریافت اطلاعات', 'error', 3000);
            loader("hide");
        }
    }); 
}
function createDetailGrid(container, masterData) {
    loader("show");
    $.ajax({
        url: `Controller/cApiBom.ashx?action=getbomdetail&productBomHeaderId=${masterData.ProductBomHeaderId}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                // Get main product unit name
                /*if (masterData.partUnitRef) {
                    const unit = unitsData.find(u => u.partUnitCode == masterData.partUnitRef);
                    mainUnitName = unit ? unit.partUnitName : '';
                }
                const quantityCaption = mainUnitName ? `مقدار در 1 ${mainUnitName} محصول اصلی` : 'مقدار';*/
                const quantityCaption = 'تعداد / مقدار';
                const packagesQty = {};
                packagesQty["PrimaryPackQty"] = response?.data?.find(d => d.RecordType === "PrimaryPackQty")?.Quantity || 1;
                packagesQty["SecondaryPackQty"] = response?.data?.find(d => d.RecordType === "SecondaryPackQty")?.Quantity || 1;
                packagesQty["MasterPackQty"] = response?.data?.find(d => d.RecordType === "MasterPackQty")?.Quantity || 1;
                
                container.dxDataGrid({
                    dataSource: response.data,
                    rtlEnabled: true,
                    showBorders: true,
                    allowColumnResizing: true,
                    columnAutoWidth: true,
                    columns: createBomDetailCols(quantityCaption, packagesQty),
                    paging: { enabled: false },
                    onRowPrepared: function(e) {
                        if (e.rowType === 'data') {
                            if (e.data.color && e.data.productBomCategoryId) {
                                e.rowElement.css('background-color', e.data.color);
                            }
                        }
                    }
                });
            }
            loader("hide");
        }
        ,error: function(response){
            DevExpress.ui.notify('خطا در دریافت اطلاعات', 'error', 3000);
            loader("hide");
        }
    });
}
function createBomForm(container) {
    $("#actionMode").val("create");

    // Create scroll view container
    const scrollViewDiv = $('<div id="bomFormScrollView">').appendTo(container);

    // Initialize dxScrollView
    scrollViewDiv.dxScrollView({
        height: '100%',
        width: '100%',
        direction: 'vertical',
        showScrollbar: 'always',
    });

    let sectionsHtml = `
        <div class="bom-popup-content">
            <div class="bom-section main-product-section">
                <div class="section-title">
                    <div class="section-title-text">محصول اصلی</div>
                    <button onclick="addNewProduct()" class="add-bom-btn" style="border:1px solid #667eea;"> + افزودن محصول</button>
                </div>
                <div style="display: grid; grid-template-columns: 15% 70% 10%; gap: 16px; align-items: start;">
                    <div>
                        <div id="brandSelect"></div>
                    </div>
                    <div>
                        <div id="mainProductSelect"></div>
                    </div>
                    <div>
                        <div id="mainProductUnit" style="opacity: 0.9 !important;"></div>
                    </div>
                </div>
            </div>
    `;

    // Grid 1: بسته‌بندی اولیه 
    sectionsHtml += `
        <div class="bom-section">
            <div class="section-title">
                <div class="section-title-text">بسته‌بندی اولیه</div>
            </div>
            <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 12px;">
                <label style="font-size: 13px; font-weight: 600; color: #475569;">تعداد/مقدار محصول اصلی در بسته‌بندی اولیه:</label>
                <div id="mainProductQuantity" style="width: 150px;"></div>
            </div>
            <div style="margin-bottom: 8px; font-size: 11px; color: #64748b;">
                مقادیر زیر را به ازای یک 
                <span style="font-weight: bold;" id="mainProductUnitText">واحد</span>
                از 
                <span style="font-weight: bold;" id="mainProductNameText">محصول اصلی</span>
                وارد کنید
            </div>
            <div id="apiGrid"></div>
        </div>
    `;

    // Grid 2: بسته‌بندی ثانویه
    sectionsHtml += `
        <div class="bom-section">
            <div class="section-title">
                <div class="section-title-text">بسته‌بندی ثانویه</div>
            </div>
            <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 12px;">
                <label style="font-size: 13px; font-weight: 600; color: #475569;">تعداد بسته‌بندی اولیه در بسته‌بندی ثانویه:</label>
                <div id="secondaryPackagingQuantity" style="width: 150px;"></div>
            </div>
            <div id="secondaryPackagingGrid"></div>
        </div>
    `;

    // Grid 3: بسته‌بندی مادر
    sectionsHtml += `
        <div class="bom-section">
            <div class="section-title">
                <div class="section-title-text">بسته‌بندی مادر</div>
            </div>
        
            <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 12px;">
                <label style="font-size: 13px; font-weight: 600; color: #475569;">تعداد بسته‌بندی ثانویه در بسته‌بندی مادر:</label>
                <div id="masterPackagingQuantity" style="width: 150px;"></div>
            </div>
            <div id="masterPackagingGrid"></div>
        </div>
    `;

    sectionsHtml += `
            <div style="margin-top: auto; background: #f5f7fa; padding: 20px; margin-left: -24px; margin-right: -24px; margin-bottom: -24px; border-top: 2px solid #e2e8f0; text-align: center; box-shadow: 0 -4px 12px rgba(0,0,0,0.05);">
                <button class="save-bom-btn" onclick="saveBomFromGrid()">ثبت</button>
            </div>
        </div>
    `;
    scrollViewDiv.dxScrollView("instance").content().append(sectionsHtml);

    const content = $(sectionsHtml);

    container.append(content);

    // Initialize unit select (disabled for user)
    $("#mainProductUnit").dxSelectBox({
        dataSource: unitsData,
        displayExpr: 'partUnitName',
        valueExpr: 'partUnitCode',
        placeholder: 'واحد...',
        rtlEnabled: true,
        stylingMode: "outlined",
        disabled: true,
        value: null,
        showClearButton: false
    });

    // Initialize brand select
    $("#brandSelect").dxSelectBox({
        dataSource: brandsData,
        displayExpr: 'brandName_EN',
        valueExpr: 'brandID',
        placeholder: 'انتخاب برند',
        rtlEnabled: true,
        searchEnabled: true,
        stylingMode: "outlined",
        showClearButton: true,
        itemTemplate: function(data, index, element) {
            const colorBox = data.colorCode
                ? `<span style="display: inline-block; width: 16px; height: 16px; border-radius: 3px; background: ${data.colorCode}; margin-left: 8px;"></span>`
                : '';
            element.append(`
                <div style="display: flex; align-items: center;">
                    ${colorBox}
                    <span>${data.brandName_EN}</span>
                </div>
            `);
        },
        onValueChanged: function(e) {
            const selectedBrandId = e.value;
            const mainProductSelect = $("#mainProductSelect").dxSelectBox("instance");

            // Filter products by selected brand
            if (selectedBrandId) {
                const filteredProducts = bomComboData.filter(bc =>
                    (bc.productBomCategoryId == 2 || ((bc.productBomCategoryId || "") == "")) &&
                    bc.brandID === brandsData.find(b => b.brandID === selectedBrandId)?.brandID
                );
                mainProductSelect.option("dataSource", filteredProducts);
            } else {
                // No brand selected, show all products
                mainProductSelect.option("dataSource", bomComboData.filter(bc =>
                    bc.productBomCategoryId == 2 || ((bc.productBomCategoryId || "") == "")
                ));
            }

            // Clear selected product when brand changes
            mainProductSelect.option("value", null);
        }
    });

    // Initialize main product select
    $("#mainProductSelect").dxSelectBox({
        dataSource: bomComboData.filter(bc => bc.productBomCategoryId==2 || ((bc.productBomCategoryId || "")=="")), //2: محصول نهایی (Finished Product)
        displayExpr: 'pName',
        valueExpr: 'SrcProductId',
        placeholder: 'نام، نام برند یا کد محصول را تایپ نمایید',
        rtlEnabled: true,
        searchEnabled: true,
        stylingMode: "outlined",
        searchExpr: ['pName', 'Number', 'brandName_EN'],
        disabled: false,
        wrapItemText: true,
        value: null,
        itemTemplate: function(data, index, element) {
            const color = data.SrcProduct === 'Finance' ? '#22c55e' : '#9ca3af';
            const bomCountBadge = data.cntBom > 0
                ? `<span title="تعداد BOM‌های موجود برای این محصول" style="background: #3b82f6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; margin-left: 8px;">${data.cntBom}</span>`
                : '';
            
            element.append(`
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background: ${color};"></span>
                    <span style="line-height: initial; flex: 1; font-size: small;">
                        ${data.pName} 
                        ${data.brandName_EN ? 
                        `<span>
                            (
                            <span style="color: ${(data.brandColor||"brown")};">${data.brandName_EN}</span>
                            )
                        </span>` : ``
                        }
                    </span>
                    ${bomCountBadge}
                </div>
            `);
        },
        onValueChanged: function(e) {
            if (e.value) {
                // پیدا کردن محصول انتخاب شده
                const selectedProduct = bomComboData.find(p => p.SrcProductId === e.value);
                if(selectedProduct) $("#mainProductNameText").text(selectedProduct.pName);
                else $("#mainProductNameText").text("محصول اصلی");
                if (selectedProduct && selectedProduct.partUnitRef) {
                    // تنظیم واحد بر اساس partUnitRef
                    const unitSelect = $("#mainProductUnit").dxSelectBox("instance");

                    unitSelect.option("value", selectedProduct.partUnitRef);

                    // بروز کردن متن واحد در label توضیحات
                    const unit = unitsData.find(u => u.partUnitCode == selectedProduct.partUnitRef);
                    if (unit) {
                        $("#mainProductUnitText").text(unit.partUnitName);
                    }
                } else {
                    // اگر واحد نداشت، خالی کن
                    const unitSelect = $("#mainProductUnit").dxSelectBox("instance");
                    unitSelect.option("value", null);
                    $("#mainProductUnitText").text("واحد");
                }
            }
        },
    });

    // Initialize quantity inputs for grids
    $("#mainProductQuantity").dxNumberBox({
        rtlEnabled: false,
        stylingMode: "outlined",
        min: 1,
        value: 1,
        format: '#,##0.###',
        onValueChanged: function(e) {
            updateApiGridCalculations();
        }
    });

    $("#secondaryPackagingQuantity").dxNumberBox({
        rtlEnabled: false,
        stylingMode: "outlined",
        min: 1,
        value: 1,
        format: '#,##0.###',
        onValueChanged: function(e) {
            updateSecondaryGridCalculations();
        }
    });



    $("#masterPackagingQuantity").dxNumberBox({
        rtlEnabled: false,
        stylingMode: "outlined",
        min: 1,
        value: 1,
        format: '#,##0.###',
        onValueChanged: function(e) {
            updateMasterGridCalculations();
        }
    });

    // Initialize 3 grids
    apiGrid = initializeInsertBomGrids(bomCategories.filter(x => x.categoryType != 'finished'), "apiGrid", updateApiGridCalculations)
    secondaryPackagingGrid = initializeInsertBomGrids(bomCategories.filter(x => x.categoryType == 'packaging'), "secondaryPackagingGrid", updateSecondaryGridCalculations)
    masterPackagingGrid = initializeInsertBomGrids(bomCategories.filter(x => x.categoryType == 'packaging'), "masterPackagingGrid", updateMasterGridCalculations)
}
let bomDetailsPopup;
let proformaCurrencyRates = {};
let currentLoadedChange = null; // برای ذخیره اطلاعات رکورد بارگذاری شده

function showBomDetails(data) {
    loader("show");

    // ذخیره ProductBomHeaderId برای استفاده بعدی
    $('#selectedBomHeaderId').val(data.ProductBomHeaderId);

    $.ajax({
        url: `Controller/cApiBom.ashx?action=getbomdetail&productBomHeaderId=${data.ProductBomHeaderId}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            loader("hide");
            getSaveBomChangeCount(data.ProductBomHeaderId);
            if (response.success) {
                // Reset current loaded change
                currentLoadedChange = null;
                if (!bomDetailsPopup) {
                    bomDetailsPopup = $('<div id="bomDetailsPopup">').appendTo('body').dxPopup({
                        title: "محاسبه هزینه",
                        width: "70%",
                        height: 'auto',
                        maxHeight: '90vh',
                        showCloseButton: true,
                        rtlEnabled: true,
                        resizeEnabled: true,
                    }).dxPopup("instance");
                }
                const PrimaryPackQty = response.data.find(p => p.RecordType == 'PrimaryPackQty')?.Quantity || 1;
                const SecondaryPackQty = response.data.find(p => p.RecordType == 'SecondaryPackQty')?.Quantity || 1;
                const MasterPackQty = response.data.find(p => p.RecordType == 'MasterPackQty')?.Quantity || 1;

                // اضافه کردن toolbar items به popup
                bomDetailsPopup.option('toolbarItems', [
                    {
                        widget: 'dxButton',
                        toolbar: 'bottom',
                        location: 'after',
                        options: {
                            text: 'بارگذاری',
                            icon: 'download',
                            disabled: true,
                            type: 'normal',
                            visible: true,
                            elementAttr: { id: 'loadBomChangeBtnToolbar' },
                            onClick: function() {
                                showLoadBomChangeDialog();
                            }
                        }
                    },
                    {
                        widget: 'dxButton',
                        toolbar: 'bottom',
                        location: 'after',
                        options: {
                            text: 'ذخیره',
                            icon: 'save',
                            type: 'default',
                            visible: true,
                            elementAttr: { id: 'saveBomChangeBtnToolbar' },
                            onClick: function() {
                                showSaveBomChangeDialog();
                            }
                        }
                    }
                ]);

                bomDetailsPopup.option('contentTemplate', function(contentElement) {
                    // ساخت TabPanel
                    const $tabPanel = $('<div>').dxTabPanel({
                        height: '100%',
                        rtlEnabled: true,
                        swipeEnabled: false,
                        animationEnabled: true,
                        onSelectionChanged: function(e) {
                            // تغییر عرض پاپاپ بر اساس تب انتخاب شده
                            if (e.addedItems && e.addedItems[0]) {
                                const selectedTab = e.addedItems[0].title;
                                if (selectedTab === 'جزئیات') {
                                    bomDetailsPopup.option('width', '70%');
                                    // نمایش دکمه‌ها
                                    $('#loadBomChangeBtnToolbar').dxButton('instance').option('visible', true);
                                    $('#saveBomChangeBtnToolbar').dxButton('instance').option('visible', true);
                                } else if (selectedTab === 'هزینه') {
                                    bomDetailsPopup.option('width', '90%');
                                    // مخفی کردن دکمه‌ها
                                    $('#loadBomChangeBtnToolbar').dxButton('instance').option('visible', false);
                                    $('#saveBomChangeBtnToolbar').dxButton('instance').option('visible', false);
                                }
                            }
                            // وقتی به تب هزینه می‌رویم، دوباره بسازیم
                            if (e.addedItems && e.addedItems[0] && e.addedItems[0].title === 'هزینه') {
                                setTimeout(() => {
                                    const tabContent = e.component.itemElements().eq(1);
                                    tabContent.empty();
                                    createAnalysisTab(tabContent);
                                }, 100);
                            }
                        },
                        items: [
                            {
                                title: 'جزئیات',
                                template: function(itemData, itemIndex, itemElement) {
                                    createDetailsTab(itemElement);
                                }
                            },
                            {
                                title: 'هزینه',
                                template: function(itemData, itemIndex, itemElement) {
                                    createAnalysisTab(itemElement);
                                }
                            }
                        ]
                    });

                    contentElement.append($tabPanel);

                    // تابع برای ساخت تب هزینه
                    function createAnalysisTab(container) {
                        const $scrollView = $('<div>').dxScrollView({
                            height: '100%',
                            width: '100%',
                            direction: 'both',
                            showScrollbar: 'onScroll'
                        });

                        let html = `
                            <div style="padding: 24px;" id="analysisTabContent">
                                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                                        <div>
                                            <label style="font-size: 12px; color: #64748b; margin-bottom: 4px; display: block;">تاریخ محاسبه</label>
                                            <div style="display: flex; align-items: center; gap: 4px; direction: ltr; float: right;">
                                                <div id="analysisDateYear" style="max-width: 120px;"></div>
                                                <span style="font-weight: bold; color: #64748b;">/</span>
                                                <div id="analysisDateMonth" style="max-width: 90px;"></div>
                                                <span style="font-weight: bold; color: #64748b;">/</span>
                                                <div id="analysisDateDay" style="max-width: 90px;"></div>
                                                <button id="resetToTodayBtn" style="margin-right: 8px; padding: 6px 12px; border: 1px solid #3b82f6; border-radius: 6px; background: white; color: #3b82f6; cursor: pointer; font-size: 12px; font-weight: 600;">امروز</button>
                                            </div>
                                        </div>
                                        <div>
                                            <label style="font-size: 12px; color: #64748b; margin-bottom: 4px; display: block;">نرخ دلار آزاد</label>
                                            <div style="display: flex; align-items: center; gap: 8px;">
                                                <div id="usdRateSlider" style="flex: 1;"></div>
                                                <button id="resetUsdRate" style="width: 32px; height: 32px; border: 1px solid #e2e8f0; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
                                                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                                                        <path d="M21 3v5h-5"/>
                                                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                                                        <path d="M3 21v-5h5"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style="display: grid; grid-template-columns: 45% 25% 30%; gap: 16px; margin-bottom: 16px;">
                                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
                                        <div style="font-size: 14px; font-weight: bold; color: #1e293b; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">مواد اولیه</div>
                                        <div id="analysisBomItems"></div>
                                    </div>

                                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
                                        <div style="font-size: 14px; font-weight: bold; color: #1e293b; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">هزینه‌ها</div>
                                        <div id="analysisCosts"></div>
                                    </div>

                                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
                                        <div style="font-size: 14px; font-weight: bold; color: #1e293b; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">سهم دسته‌بندی‌ها</div>
                                        <div id="categoryShares"></div>
                                    </div>
                                </div>
                            </div>
                        `;

                        const $content = $(html);
                        $scrollView.dxScrollView('instance').content().append($content);
                        container.append($scrollView);

                        // متغیرهای هزینه
                        let analysisCurrencyRates = currencyRates;
                        const baseUSDRate = currencyRates.find(cr => cr.baseId === 72)?.FreeRate || 0;
                        let currentUSDRate = baseUSDRate;
                        let sliderChanged = false;

                        const todayParts = YKN(new Intl.DateTimeFormat('fa-IR').format(new Date())).split('/');
                        const todayYear = parseInt(todayParts[0]);
                        const todayMonth = parseInt(todayParts[1]);
                        const todayDay = parseInt(todayParts[2]);

                        // تابع برای چک کردن آیا تاریخ فعلی برابر امروز است
                        const isToday = function() {
                            const year = $('#analysisDateYear').dxNumberBox('instance').option('value');
                            const month = $('#analysisDateMonth').dxNumberBox('instance').option('value');
                            const day = $('#analysisDateDay').dxNumberBox('instance').option('value');
                            return year === todayYear && month === todayMonth && day === todayDay;
                        };

                        // تابع برای فراخوانی API وقتی تاریخ تغییر می‌کند
                        const fetchCurrencyByDate = function() {
                            const year = $('#analysisDateYear').dxNumberBox('instance').option('value');
                            const month = $('#analysisDateMonth').dxNumberBox('instance').option('value');
                            let day = $('#analysisDateDay').dxNumberBox('instance').option('value');

                            // چک کردن که همه مقادیر معتبر باشند
                            if (year && month && day && year >= 1300 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                                loader('show');
                                if(month > 6) {
                                    let maxDayAlload = 30;
                                    if(month == 12) maxDayAlload = 29;
                                    if(day > maxDayAlload){
                                        day = maxDayAlload;
                                        $('#analysisDateDay').dxNumberBox('instance').option('value', maxDayAlload);
                                    }
                                }
                                const dateValue = year + '/' + String(month).padStart(2, '0') + '/' + String(day).padStart(2, '0');
                                $("#selectedBaseDate").val(dateValue);
                                $.ajax({
                                    url: 'Controller/cApiBom.ashx?action=getcurrencybydate&Date=' + dateValue,
                                    type: 'GET',
                                    dataType: 'json',
                                    success: function(response) {
                                        if (response.success && response.data) {
                                            analysisCurrencyRates = response.data;
                                            const newUSDRate = response.data.find(cr => cr.baseId == 72)?.FreeRate || baseUSDRate;

                                            // آپدیت slider
                                            const slider = $('#usdRateSlider').dxSlider('instance');
                                            slider.option({
                                                min: newUSDRate * 0.5,
                                                max: newUSDRate * 1.5,
                                                value: newUSDRate
                                            });

                                            // آپدیت currentUSDRate بعد از slider
                                            currentUSDRate = newUSDRate;
                                            sliderChanged = false;

                                            // فعال یا غیرفعال کردن slider بر اساس تاریخ
                                            if (isToday()) {
                                                slider.option('disabled', false);
                                            } else {
                                                slider.option('disabled', true);
                                            }

                                            recalculateAnalysis();
                                        }
                                        loader('hide');
                                    },
                                    error: function() {
                                        DevExpress.ui.notify('خطا در دریافت نرخ ارز', 'error', 3000);
                                        loader('show');
                                    }
                                });
                            }
                        };

                        // NumberBox برای سال (4 رقم)
                        $('#analysisDateYear').dxNumberBox({
                            value: parseInt(todayParts[0]),
                            min: 1300,
                            max: 1500,
                            format: '####',
                            showSpinButtons: true,
                            stylingMode: 'outlined',
                            placeholder: 'سال',
                            onValueChanged: function(e) {
                                if (e.value && String(e.value).length === 4) {
                                    fetchCurrencyByDate();
                                }
                            }
                        });

                        // NumberBox برای ماه (2 رقم)
                        $('#analysisDateMonth').dxNumberBox({
                            value: parseInt(todayParts[1]),
                            min: 1,
                            max: 12,
                            format: '00',
                            showSpinButtons: true,
                            stylingMode: 'outlined',
                            placeholder: 'ماه',
                            onValueChanged: function(e) {
                                if (e.value) {
                                    fetchCurrencyByDate();
                                }
                            }
                        });

                        // NumberBox برای روز (2 رقم)
                        $('#analysisDateDay').dxNumberBox({
                            value: parseInt(todayParts[2]),
                            min: 1,
                            max: 31,
                            format: '00',
                            showSpinButtons: true,
                            stylingMode: 'outlined',
                            placeholder: 'روز',
                            onValueChanged: function(e) {
                                if (e.value) {
                                    fetchCurrencyByDate();
                                }
                            }
                        });

                        // Slider برای نرخ دلار
                        $('#usdRateSlider').dxSlider({
                            min: baseUSDRate * 0.5,
                            max: baseUSDRate * 1.5,
                            value: baseUSDRate,
                            step: 100,
                            rtlEnabled: true,
                            disabled: false,
                            tooltip: {
                                enabled: true,
                                showMode: 'always',
                                position: 'bottom',
                                format: function(value) {
                                    return Number(value).toLocaleString() + ' ریال';
                                }
                            },
                            label: {
                                visible: true,
                                format: function(value) {
                                    return Number(value).toLocaleString();
                                }
                            },
                            onValueChanged: function(e) {
                                const oldValue = currentUSDRate;
                                currentUSDRate = e.value;

                                // اگر در تاریخ امروز هستیم و slider تغییر کرد
                                if (isToday()) {
                                    const baseRate = analysisCurrencyRates.find(cr => cr.baseId === 72)?.FreeRate || baseUSDRate;
                                    if (Math.abs(e.value - baseRate) > 100) { // اگر بیشتر از 100 ریال تفاوت داشت
                                        sliderChanged = true;
                                        // فقط بخش هزینه‌ها رو آپدیت کن
                                        recalculateAnalysis(true);
                                    } else {
                                        sliderChanged = false;
                                        recalculateAnalysis(true);
                                    }
                                } else {
                                    // اگر تاریخ تغییر کرده، همه چیز رو دوباره محاسبه کن
                                    recalculateAnalysis();
                                }
                            }
                        });

                        // دکمه reset برای slider دلار
                        $('#resetUsdRate').on('click', function() {
                            const slider = $('#usdRateSlider').dxSlider('instance');
                            const currentBaseRate = analysisCurrencyRates.find(cr => cr.baseId === 72)?.FreeRate || baseUSDRate;
                            sliderChanged = false;
                            slider.option('value', currentBaseRate);
                        });

                        // دکمه امروز برای برگرداندن تاریخ به امروز
                        $('#resetToTodayBtn').on('click', function() {
                            $('#analysisDateYear').dxNumberBox('instance').option('value', todayYear);
                            $('#analysisDateMonth').dxNumberBox('instance').option('value', todayMonth);
                            $('#analysisDateDay').dxNumberBox('instance').option('value', todayDay);
                        });

                        // آرایه برای نگهداری تغییرات قیمت هر آیتم
                        const itemPriceChanges = {};

                        // ذخیره مقادیر اصلی برای استفاده در slider
                        let baseTotalUSDFree = 0;
                        let baseTotalIRR = 0;

                        // تابع برای محاسبه مجدد
                        function recalculateAnalysis(onlyUpdateCosts = false) {
                            let totalIRR = 0;
                            let totalUSDFree = 0;
                            const categoryTotals = {};

                            // پیدا کردن تمام آیتم‌های BOM (MainLevel, SecondaryLevel, MasterLevel)
                            const bomItems = response.data.filter(item =>
                                item.RecordType === 'MainLevel' ||
                                item.RecordType === 'SecondaryLevel' ||
                                item.RecordType === 'MasterLevel'
                            );

                            // اگر فقط می‌خواهیم هزینه‌ها رو آپدیت کنیم (برای تغییرات slider در تاریخ امروز)
                            if (onlyUpdateCosts && isToday() && sliderChanged) {
                                // فقط برای نمایش: USD ثابت * نرخ جدید slider
                                const displayTotalIRR = baseTotalUSDFree * currentUSDRate;
                                updateAnalysisCosts(displayTotalIRR, baseTotalUSDFree);
                                return;
                            }

                            let itemsHTML = '';
                            bomItems.forEach((item, index) => {
                                // محاسبه TotalPackQty مثل تب جزئیات
                                let TotalPackQty = 0;
                                if(item.RecordType == 'MainLevel') TotalPackQty = (item.Quantity || 0) * PrimaryPackQty;
                                else if(item.RecordType == 'SecondaryLevel') TotalPackQty = (item.Quantity || 0) / SecondaryPackQty;
                                else if(item.RecordType == 'MasterLevel') TotalPackQty = (item.Quantity || 0) / (MasterPackQty * SecondaryPackQty);

                                // خواندن مقادیر از تب جزئیات
                                const priceUnitFXInstance = $(`#priceUnitFX_${index}`).dxNumberBox('instance');
                                const priceFXInstance = $(`#priceFX_${index}`).dxNumberBox('instance');
                                const priceIRRInstance = $(`#priceIRR_${index}`).dxNumberBox('instance');
                                const currencyInstance = $(`#currencySelect_${index}`).dxSelectBox('instance');
                                const currencySrcInstance = $(`#currencySrcSelect_${index}`).dxSelectBox('instance');

                                if (!priceUnitFXInstance || !currencyInstance) return;

                                const baseUnitPrice = priceUnitFXInstance.option('value') || 0;
                                const currencyId = currencyInstance.option('value');
                                const currencySrcId = currencySrcInstance.option('value');
                                const quantity = parseFloat($(`#item_Quantity_${index}`).val()) || 0;

                                // اعمال تغییر قیمت از slider
                                const priceChange = itemPriceChanges[index] || 1;
                                const adjustedUnitPrice = baseUnitPrice * priceChange;

                                // محاسبه قیمت کل ارزی مثل updatePrices
                                const totalFX = adjustedUnitPrice * TotalPackQty;

                                // تبدیل به ریال با نرخ جدید
                                let totalIRRItem = 0;
                                let totalUSDItem = 0;

                                const currencyRate = analysisCurrencyRates.find(cr => cr.baseId == currencyId);
                                if (currencyRate) {
                                    let rate = 0;
                                    if (currencySrcId == 53) rate = currencyRate.FreeRate;
                                    else if (currencySrcId == 51) rate = currencyRate.TarjihiRate;
                                    else if (currencySrcId == 52) rate = currencyRate.NimaRate;
                                    else if (currencySrcId == 147) rate = currencyRate.SanaRate;
                                    else if (currencySrcId == 148) rate = currencyRate.MobadeleRate;

                                    // توجه: در اینجا از نرخ اصلی استفاده می‌کنیم، نه از slider
                                    // slider فقط در بخش نمایش هزینه‌ها تاثیر می‌گذارد

                                    totalIRRItem = totalFX * rate;

                                    // تبدیل به دلار آزاد
                                    const isUSD = currencyId == 72;
                                    const isFree = currencySrcId == 53;
                                    if (isUSD && isFree) {
                                        totalUSDItem = totalFX;
                                    } else {
                                        // استفاده از نرخ اصلی دلار از analysisCurrencyRates
                                        const freeUSDRate = analysisCurrencyRates.find(cr => cr.baseId === 72)?.FreeRate || baseUSDRate;
                                        totalUSDItem = totalIRRItem / freeUSDRate;
                                    }
                                }

                                totalIRR += totalIRRItem;
                                totalUSDFree += totalUSDItem;

                                // محاسبه سهم دسته‌بندی
                                const categoryName = item.CategoryFa || 'سایر';
                                if (!categoryTotals[categoryName]) {
                                    categoryTotals[categoryName] = { totalUSD: 0, color: item.color || '#f8fafc' };
                                }
                                categoryTotals[categoryName].totalUSD += totalUSDItem;

                                // ساخت HTML آیتم
                                const unitName = item.partUnitRef ? (unitsData.find(u => u.partUnitCode == item.partUnitRef)?.partUnitName || '') : '';
                                const currency = CurrencyData.find(c => c.baseId == currencyId);
                                const currencySrc = CurrencySrcData.find(cs => cs.baseId == currencySrcId);
                                const currencyName = currency?.name || '';
                                const srcName = currencySrc?.name || '';

                                const isUSD = currencyId == 72;
                                const isFree = currencySrcId == 53;
                                const showUSDConversion = !isUSD || !isFree;

                                const colorClass = priceChange < 1 ? '#ef4444' : (priceChange > 1 ? '#10b981' : '#64748b');

                                itemsHTML += `
                                    <div style="padding: 12px; margin-bottom: 8px; background: ${item.color || '#f8fafc'}; border-radius: 8px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                            <div style="flex: 1;">
                                                <div style="font-weight: 600; color: #1e293b;">${item.Name || '-'}</div>
                                                <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
                                                    دسته‌بندی: ${item.CategoryFa || '-'}
                                                    ${item.RecordType == "SecondaryLevel" ? ` (بسته بندی ثانویه)`
                                                        :
                                                        item.RecordType == "MasterLevel" ? ` (بسته بندی مادر)`
                                                        :``
                                                    }
                                                    |
                                                    مقدار: ${quantity} ${unitName}
                                                    (معادل ${TotalPackQty.toFixed(4)} ${unitName} در محصول اصلی)
                                                </div>
                                            </div>
                                            <div style="display: flex; gap: 8px; align-items: center;">
                                                <div style="font-size: 12px; color: #64748b;">قیمت واحد:</div>
                                                <div style="font-weight: bold; color: ${colorClass}; direction: ltr;">${Number(adjustedUnitPrice.toFixed(3)).toLocaleString()} ${currencyName} ${srcName}</div>
                                                <div style="width: 120px;" id="priceNumberBox_${index}"></div>
                                                <button id="resetPrice_${index}" style="width: 28px; height: 28px; border: 1px solid #e2e8f0; border-radius: 4px; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
                                                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                                                        <path d="M21 3v5h-5"/>
                                                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                                                        <path d="M3 21v-5h5"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div style="font-size: 12px; color: #64748b; margin-right: 20px;">
                                            قیمت کل: ${Number(totalFX.toFixed(3)).toLocaleString()} ${currencyName} ${srcName},
                                            ${Number(totalIRRItem.toFixed()).toLocaleString()} ریال
                                            ${showUSDConversion ? `, ${Number(totalUSDItem.toFixed(3)).toLocaleString()} دلار آزاد` : ''}
                                        </div>
                                    </div>
                                `;
                            });

                            $('#analysisBomItems').html(itemsHTML);

                            // اضافه کردن sliderها
                            bomItems.forEach((item, index) => {
                                const priceUnitFXInstance = $(`#priceUnitFX_${index}`).dxNumberBox('instance');
                                if (!priceUnitFXInstance) return;

                                const baseUnitPrice = priceUnitFXInstance.option('value') || 0;
                                if (baseUnitPrice === 0) return;

                                $(`#priceNumberBox_${index}`).dxNumberBox({
                                    value: baseUnitPrice * (itemPriceChanges[index] || 1),
                                    min: baseUnitPrice * 0.5,
                                    max: baseUnitPrice * 1.5,
                                    step: baseUnitPrice * 0.01,
                                    format: '#,##0.###',
                                    showSpinButtons: true,
                                    rtlEnabled: true,
                                    stylingMode: 'outlined',
                                    onValueChanged: function(e) {
                                        itemPriceChanges[index] = e.value / baseUnitPrice;
                                        recalculateAnalysis();
                                    }
                                });

                                // دکمه reset برای هر آیتم
                                $(`#resetPrice_${index}`).on('click', function() {
                                    $(`#priceNumberBox_${index}`).dxNumberBox('instance').option('value', baseUnitPrice);
                                });
                            });

                            // نمایش سهم دسته‌بندی‌ها با نمودار دایره‌ای
                            const categoryChartData = [];
                            Object.keys(categoryTotals).forEach(categoryName => {
                                const categoryData = categoryTotals[categoryName];
                                categoryChartData.push({
                                    category: categoryName,
                                    value: categoryData.totalUSD,
                                    color: categoryData.color
                                });
                            });

                            $('#categoryShares').empty().append('<div id="categoryPieChart" style="height: auto;"></div>');

                            $('#categoryPieChart').dxPieChart({
                                dataSource: categoryChartData,
                                palette: categoryChartData.map(d => d.color),
                                series: [{
                                    argumentField: 'category',
                                    valueField: 'value',
                                    label: {
                                        visible: true,
                                        font: {
                                            color: '#000000',
                                            size: 12
                                        },
                                        connector: {
                                            visible: true,
                                            color: '#000000'
                                        },
                                        format: {
                                            type: 'percent',
                                            precision: 1
                                        },
                                        customizeText: function(arg) {
                                            return arg.argumentText + '\n' + arg.percentText;
                                        }
                                    }
                                }],
                                legend: {
                                    visible: false,
                                    orientation: 'horizontal',
                                    itemTextPosition: 'right',
                                    horizontalAlignment: 'center',
                                    verticalAlignment: 'bottom'
                                },
                                tooltip: {
                                    enabled: true,
                                    customizeTooltip: function(arg) {
                                        return {
                                            text: arg.argumentText + ': ' + Number(arg.value.toFixed(3)).toLocaleString() + ' USD (' + arg.percentText + ')'
                                        };
                                    }
                                },
                                rtlEnabled: true
                            });

                            // ذخیره مقادیر اصلی (قبل از اعمال تغییرات slider)
                            baseTotalUSDFree = totalUSDFree;
                            baseTotalIRR = totalIRR;

                            // اگر slider تغییر کرده و در تاریخ امروز هستیم، فقط برای نمایش هزینه‌ها از نرخ جدید استفاده کن
                            let displayTotalIRR = totalIRR;
                            if (isToday() && sliderChanged) {
                                // فقط برای نمایش: USD ثابت * نرخ جدید slider
                                displayTotalIRR = baseTotalUSDFree * currentUSDRate;
                            }

                            // نمایش هزینه‌های کل (استفاده از همان HTML تب جزئیات)
                            updateAnalysisCosts(displayTotalIRR, totalUSDFree);
                        }

                        function updateAnalysisCosts(totalIRR, totalUSDFree) {
                            const baseDate = $("#selectedBaseDate").val() || "امروز";
                            let titleText = '';

                            if (isToday()) {
                                if (sliderChanged) {
                                    titleText = `هزینه تمام شده خام محصول اصلی (با نرخ دلار ${Number(currentUSDRate).toLocaleString()} ریالی)`;
                                } else {
                                     titleText = 'هزینه تمام شده خام محصول اصلی (به نرخ امروز)';
                                }
                            } else {
                                titleText = `هزینه تمام شده خام محصول اصلی (به نرخ ${baseDate})`;
                            }

                            let costsHTML = `
                                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0; overflow: hidden; margin-bottom: 12px;">
                                    <div style="padding: 8px 12px; border-bottom: 2px solid #e2e8f0; background: #f9fafb;">
                                        <div style="font-size: 12px; font-weight: bold;">${titleText}</div>
                                    </div>
                                    <div style="padding: 12px;">
                                        <div style="margin-bottom: 8px;">
                                            <div style="font-size: 10px; color: #64748b;">ریالی</div>
                                            <div style="font-size: 16px; font-weight: bold; color: #10b981; direction: ltr;">${Number(totalIRR.toFixed()).toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div style="font-size: 10px; color: #64748b;">دلاری</div>
                                            <div style="font-size: 16px; font-weight: bold; color: #10b981; direction: ltr;">${Number(totalUSDFree.toFixed(3)).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0; overflow: hidden;">
                                    <div style="padding: 8px 12px; border-bottom: 2px solid #e2e8f0; background: #f9fafb;">
                                        <div style="font-size: 12px; font-weight: bold;">با احتساب سربار (${isToday() ? (sliderChanged ? `با نرخ دلار ${Number(currentUSDRate).toLocaleString()} ریالی` : 'به نرخ امروز') : `به نرخ ${baseDate}`})</div>
                                    </div>
                                    <div style="padding: 12px;">
                                        <div style="margin-bottom: 8px;">
                                            <div style="font-size: 10px; color: #64748b;">ریالی</div>
                                            <div style="font-size: 16px; font-weight: bold; color: #3b82f6; direction: ltr;">${Number(totalIRR.toFixed()).toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div style="font-size: 10px; color: #64748b;">دلاری</div>
                                            <div style="font-size: 16px; font-weight: bold; color: #3b82f6; direction: ltr;">${Number(totalUSDFree.toFixed(3)).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            `;

                            $('#analysisCosts').html(costsHTML);
                        }
                        
                        // محاسبه اولیه
                        setTimeout(() => recalculateAnalysis(), 500);
                        setTimeout(() => $('#bomDetailsPopup').dxPopup("option","position",{my: 'center', at: 'center'}), 800);
                        
                    }
                    // تابع برای ساخت تب جزئیات
                    function createDetailsTab(container) {  
                        proformaCurrencyRates = {};
                        // ساخت ScrollView برای محتوا
                        const $scrollView = $('<div>').dxScrollView({
                            height: '100%',
                            width: '100%',
                            direction: 'both',
                            showScrollbar: 'onScroll'
                        });

                        let html = `
                            <div style="padding: 24px;">
                                <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border: 2px solid #667eea; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                                    <div style="font-size: 16px; font-weight: bold; color: #1e293b; margin-bottom: 8px;">محصول اصلی:</div>
                                    <div style="font-size: 15px; color: #475569;">${data.pName}</div>
                        `;
                        let unitName = "واحد";
                        // نمایش واحد اگر وجود داشت
                        if (data.partUnitRef) {
                            const unit = unitsData.find(u => u.partUnitCode == data.partUnitRef);
                            unitName = unit ? unit.partUnitName : data.partUnitRef;
                            html += `<div style="font-size: 13px; color: #64748b; margin-top: 4px;">واحد: ${unitName}</div>`;
                        }

                        html += `</div>`;
                        html += `
                        <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border: 2px solid #667eea; border-radius:12px;padding:12px 16px;box-shadow:0 4px 12px rgba(16,185,129,0.2);margin-bottom:16px;">
                            <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;">
                                <div style="display:flex;align-items:center;gap:8px;">
                                    <svg style="width:20px;height:20px;fill:#059669;" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                                    </svg>
                                    <span style="font-size:13px;font-weight:600;">هزینه تمام‌شده محصول اصلی</span>
                                </div>
                                <div style="display:flex;gap:20px;align-items:center;">
                                    <div style="text-align:left;">
                                        <div id="totalProducrCostIrr" style="font-size:16px;font-weight:700; line-height:1.2;"></div>
                                        <div style="font-size:10px;color:rgba(0,0,0,0.8);margin-top:2px;">ریال (به نرخ تاریخ سفارش‌ها)</div>
                                    </div>
                                    <div style="width:1px;height:32px;background:rgba(0,0,0,0.3);"></div>
                                    <div style="text-align:left;">
                                        <div id="totalProducrCostIrrToday" style="font-size:16px;font-weight:700; line-height:1.2;"></div>
                                        <div style="font-size:10px;color:rgba(0,0,0,0.8);margin-top:2px;">ریال (به نرخ امروز)</div>
                                    </div>
                                    <div style="width:1px;height:32px;background:rgba(0,0,0,0.3);"></div>
                                    <div style="text-align:left;">
                                        <div id="totalProducrCostUsd" style="font-size:16px;font-weight:700; line-height:1.2;"></div>
                                        <div style="font-size:10px;color:rgba(0,0,0,0.8);margin-top:2px;">دلار آزاد (به نرخ تاریخ سفارش‌ها)</div>
                                    </div>
                                    <div style="width:1px;height:32px;background:rgba(0,0,0,0.3);"></div>
                                    <div style="text-align:left;">
                                        <div id="totalProducrCostUsdToday" style="font-size:16px;font-weight:700; line-height:1.2;"></div>
                                        <div style="font-size:10px;color:rgba(0,0,0,0.8);margin-top:2px;">دلار آزاد (به نرخ امروز)</div>
                                    </div>
                                </div>
                            </div>
                        </div>`;

                        html += `
                                <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border: 2px solid #667eea; border-radius:12px;padding:10px 16px;box-shadow:0 4px 12px rgba(59,130,246,0.2);margin-bottom:16px;">
                                    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                                        <div style="display:flex;align-items:center;gap:6px;">
                                            <svg style="width:18px;height:18px;fill:#2563eb;" viewBox="0 0 24 24">
                                                <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                                            </svg>
                                            <span style="font-size:12px;font-weight:600;">اطلاعات بسته‌بندی</span>
                                        </div>
                                        <div style="flex:1;display:flex;gap:12px;align-items:center;justify-content:flex-start;">
                                            <div style="display:flex;align-items:center;gap:6px;">
                                                <span style="color:rgba(0,0,0,0.9);font-size:11px;">تعداد/مقدار محصول اصلی در بسته‌بندی اولیه:</span>
                                                <span style="font-size:15px;font-weight:700;">${PrimaryPackQty}</span>
                                            </div>
                                            <div style="width:1px;height:20px;background:rgba(255,255,255,0.3);"></div>
                                            <div style="display:flex;align-items:center;gap:6px;">
                                                <span style="color:rgba(0,0,0,0.9);font-size:11px;">تعداد بسته‌بندی اولیه در بسته‌بندی ثانویه:</span>
                                                <span style="font-size:15px;font-weight:700;">${SecondaryPackQty}</span>
                                            </div>
                                            <div style="width:1px;height:20px;background:rgba(255,255,255,0.3);"></div>
                                            <div style="display:flex;align-items:center;gap:6px;">
                                                <span style="color:rgba(0,0,0,0.9);font-size:11px;">تعداد بسته‌بندی ثانویه در بسته‌بندی مادر:</span>
                                                <span style="font-size:15px;font-weight:700;">${MasterPackQty}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
                                    <div style="font-size: 14px; font-weight: bold; color: #1e293b; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">مواد اولیه:</div>
                                    <div id="bomItemsList" style="margin: 0;">
                        `;

                        // فیلتر کردن آیتم‌های اصلی (MainLevel, SecondaryLevel, MasterLevel)
                        const bomItems = response.data.filter(item =>
                            item.RecordType === 'MainLevel' ||
                            item.RecordType === 'SecondaryLevel' ||
                            item.RecordType === 'MasterLevel'
                        );


                        if (bomItems.length === 0) {
                            html += `<div style="padding: 12px; color: #94a3b8; text-align: center;">هیچ آیتمی ثبت نشده است</div>`;
                        }

                        html += `
                                    </div>
                                </div>
                            </div>
                        `;

                        const $itemsList = $(html);
                        const $bomItemsContainer = $itemsList.find('#bomItemsList');

                        const updatePrices = function(rowElement, sourceField, itemIndex, proformaCurrencyRates={}) {
                            
                            const $row = $(rowElement);

                            // فقط اگر قیمت دلخواه انتخاب شده باشه
                            const selectedProformaValue = $row.find(`#proformaSelect_${itemIndex}`).dxSelectBox('option', 'value');
                            if (selectedProformaValue !== 'manual' && sourceField !== 'currencySrc') {
                                return;
                            }
                            if ($row.data('updating')) return;
                            $row.data('updating', true);

                            try {
                                const productQuantity = parseFloat($row.find(`#item_Quantity_${itemIndex}`).val()) || 0;
                                const totalPackQty = $row.find(`#item_totalPackQty_${itemIndex}`).val() || 0;
                                let priceUnitFX = $row.find(`#priceUnitFX_${itemIndex}`).dxNumberBox('option', 'value') || 0;
                                let baseIdCurrency = $row.find(`#currencySelect_${itemIndex}`).dxSelectBox('option', 'value');
                                let baseIdCurrencySrc = $row.find(`#currencySrcSelect_${itemIndex}`).dxSelectBox('option', 'value');

                                // اگر ارز انتخاب نشده، دلار آزاد رو انتخاب کن
                                if (!baseIdCurrency) {
                                    $row.find(`#currencySelect_${itemIndex}`).dxSelectBox('option', 'value', 72); //USD
                                    baseIdCurrency = 72;
                                }

                                if (!baseIdCurrencySrc) {
                                    $row.find(`#currencySrcSelect_${itemIndex}`).dxSelectBox('option', 'value', 53); //Free
                                    baseIdCurrencySrc = 53;
                                }

                                const currencyRate = currencyRates.find(cr => cr.baseId === baseIdCurrency);

                                if (currencyRate && productQuantity > 0) {
                                    let rate = 0;
                                    let matchRateType = "FreeRate";
                                    if (baseIdCurrencySrc == 53) matchRateType = "FreeRate";
                                    else if (baseIdCurrencySrc == 51) matchRateType = "TarjihiRate";
                                    else if (baseIdCurrencySrc == 52) matchRateType = "NimaRate";
                                    else if (baseIdCurrencySrc == 147) matchRateType = "SanaRate";
                                    else if (baseIdCurrencySrc == 148) matchRateType = "MobadeleRate";
                                    rate = currencyRate[matchRateType] || 0;
                                    if (rate > 0) {
                                        const priceFX = priceUnitFX * totalPackQty;
                                        $row.find(`#priceFX_${itemIndex}`).dxNumberBox('option', 'value', priceFX);

                                        // محاسبه قیمت کل ریالی = قیمت کل ارزی × نرخ
                                        let priceIRR = priceFX * rate;
                                        $row.find(`#priceIRRToday_${itemIndex}`).dxNumberBox('option', 'value', priceIRR);
                                        if(selectedProformaValue == 'manual') $row.find(`#priceIRR_${itemIndex}`).dxNumberBox('option', 'value', priceIRR);
                                        else if(sourceField == 'currencySrc'){
                                            if(Object.keys(proformaCurrencyRates).length == 0) return;
                                            const curProformaCurrencyRate = proformaCurrencyRates?.[$row.find(`#proformaDate_${itemIndex}`).val()];
                                            if(curProformaCurrencyRate){
                                                const proformaDateCurrencyRate = curProformaCurrencyRate.find(cr => cr.baseId === baseIdCurrency);
                                                priceIRR = priceFX * proformaDateCurrencyRate?.[matchRateType] || 0;
                                                $row.find(`#priceIRR_${itemIndex}`).dxNumberBox('option', 'value', priceIRR);
                                            }
                                        }
                                    }
                                }
                                calculateTotalCosts(bomItems);

                            } finally {
                                setTimeout(() => {
                                    $row.data('updating', false);
                                }, 100);
                            }
                        };
                        if (bomItems.length > 0) {
                            proformaCurrencyRates = {};
                            bomItems.forEach((item, index) => {
                                const productTypeColor = item.SrcIngredients === 'Finance' ? '#22c55e' : '#9ca3af';
                                const unitName = item.partUnitRef ? (unitsData.find(u => u.partUnitCode == item.partUnitRef)?.partUnitName || '') : '';
                                const categoryColor = item.color || '#f8fafc';

                                const relatedProformas = partProformaData.filter(p =>
                                    p.SrcProduct === item.SrcIngredients &&
                                    p.SrcProductId === item.SrcIngredientsProductId
                                );
                                relatedProformas.forEach(rp => {
                                    if(!proformaCurrencyRates[rp.proformaDate])
                                    $.ajax({
                                        url: 'Controller/cApiBom.ashx?action=getcurrencybydate&Date=' + rp.proformaDate,
                                        type: 'GET',
                                        dataType: 'json',
                                        async: false,
                                        success: function(currencyResponse) {
                                            if (currencyResponse.success && currencyResponse.data) {
                                                proformaCurrencyRates[rp.proformaDate] = currencyResponse.data;
                                            }
                                            loader('hide');
                                        },
                                        error: function() {
                                            DevExpress.ui.notify('خطا در دریافت نرخ ارز', 'error', 3000);
                                            loader('show');
                                        }
                                    });
                                })
                                let TotalPackQty = 0;
                                if(item.RecordType == 'MainLevel') TotalPackQty = (item.Quantity || 0) * PrimaryPackQty;
                                else if(item.RecordType == 'SecondaryLevel') TotalPackQty = (item.Quantity || 0) / SecondaryPackQty;
                                else if(item.RecordType == 'MasterLevel') TotalPackQty = (item.Quantity || 0) / (MasterPackQty * SecondaryPackQty);
                                const $itemRow = $(`
                                    <div style="padding: 12px; margin-bottom: 8px; background: ${categoryColor}; border-radius: 8px;">
                                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${productTypeColor}; flex-shrink: 0;"></span>
                                            <div style="flex: 1;">
                                                <div style="font-weight: 600; color: #1e293b;">${item.Name || '-'}</div>
                                                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                                                    دسته‌بندی: ${item.CategoryFa || '-'} 
                                                    ${item.RecordType == "SecondaryLevel" ? ` (بسته بندی ثانویه)`
                                                        :
                                                        item.RecordType == "MasterLevel" ? ` (بسته بندی مادر)`
                                                        :``
                                                    }
                                                    |
                                                    مقدار: ${item.Quantity || 0} ${unitName}
                                                    (معادل ${TotalPackQty.toFixed(4)} ${unitName} در محصول اصلی)
                                                </div>
                                            </div>
                                            <input type="hidden" value="${item.Quantity}" id="item_Quantity_${index}" />
                                            <input type="hidden" value="${TotalPackQty}" id="item_totalPackQty_${index}" />
                                            <input type="hidden" value="${item.ProductBomDetailId}" id="productBomDetailId_${index}" />

                                        </div>
                                        <div style="display: flex; gap: 8px; align-items: flex-end; margin-right: 20px;">
                                            <div style="flex: 1; min-width: 250px;">
                                                <div style="font-size: 11px; color: #64748b; margin-bottom: 4px; font-weight: 500;">انتخاب سفارش</div>
                                                <div id="proformaSelect_${index}"></div>
                                            </div>
                                            <div style="width: 120px;">
                                                <div style="font-size: 11px; color: #64748b; margin-bottom: 4px; font-weight: 500;">قیمت واحد (ارزی)</div>
                                                <div id="priceUnitFX_${index}"></div>
                                            </div>
                                            <div style="width: 150px;">
                                                <div style="font-size: 11px; color: #64748b; margin-bottom: 4px; font-weight: 500;">قیمت کل ریالی 
                                                    <span id="proformaDataFa_${index}">(تاریخ سفارش)</span>
                                                </div>
                                                <div id="priceIRR_${index}"></div>
                                            </div>
                                            <div style="width: 120px;">
                                                <div style="font-size: 11px; color: #64748b; margin-bottom: 4px; font-weight: 500;">قیمت کل (ارزی)</div>
                                                <div id="priceFX_${index}"></div>
                                            </div>
                                            <div style="width: 120px;">
                                                <div style="font-size: 11px; color: #64748b; margin-bottom: 4px; font-weight: 500;">ارز</div>
                                                <div id="currencySelect_${index}"></div>
                                            </div>
                                            <div style="width: 120px;">
                                                <div style="font-size: 11px; color: #64748b; margin-bottom: 4px; font-weight: 500;">منبع ارز</div>
                                                <div id="currencySrcSelect_${index}"></div>
                                            </div>
                                            <div style="width: 150px;">
                                                <div style="font-size: 11px; color: #64748b; margin-bottom: 4px; font-weight: 500;">قیمت کل ریالی (به نرخ امروز)</div>
                                                <div id="priceIRRToday_${index}"></div>
                                                <input type="hidden" id="proformaDate_${index}" />
                                            </div>
                                        </div>
                                    </div>
                                `);
                                $bomItemsContainer.append($itemRow);
                                $itemRow.find(`#proformaSelect_${index}`).dxSelectBox({
                                    dataSource: [{partPrdId: 'manual',manual: true}].concat(relatedProformas),
                                    /*displayExpr: function(item) {
                                        if (!item) return '';
                                        return item.manual ? `قیمت دلخواه` :
                                        `${item.PINumber || '-'} | ${item.batchNo || '-'} | ${item.subPartNo || '-'}`;
                                    },*/
                                    itemTemplate: function(itemData, itemIndex, itemElement) {
                                        if (!itemData) return "";
                                        if (itemData.manual) {
                                            return $("<div>")
                                            .append($("<strong>").text("قیمت دلخواه"));
                                        } else {
                                            return $("<div>")
                                            .append(
                                            $("<span>").html("<font color='blue'>شماره سفارش: </font>"+itemData.PINumber || "-"),
                                            $("<br>"),
                                            $("<span>").html(
                                                "<font color='blue'>بچ: </font>"+(itemData.batchNo || "-") 
                                                + " | " + "<font color='blue'>پارت: </font>"+(itemData.partNo || "-") 
                                                + " | " + "<font color='blue'>بخش: </font>"+(itemData.subPartNo || "-")
                                                + " | " + "<font color='blue'>تاریخ: </font>"+(itemData.shamsi || "-")
                                            ),
                                            $("<br>"),
                                            $("<small>").html(
                                                "<font color='blue'>قیمت: </font>"
                                                + (itemData.FXProductUnitPrice ? 
                                                    itemData.FXProductUnitPrice + " " + (itemData.currencyName || "") + " " + (itemData.currencySrc || "")
                                                    + " | " + "<font color='blue'>معادل ریالی: </font>"+(itemData.FXProductUnitPriceIRR || "-").toLocaleString() + " (به نرخ تاریخ سفارش)"
                                                :"-")
                                            ),
                                            $("<br>"),
                                            $("<small>").html(
                                                "<font color='blue'>هزینه: </font>"
                                                + (itemData.partOtherCost ? 
                                                    itemData.partOtherCost + " " + (itemData.currencyName || "") + " " + (itemData.currencySrc || "")
                                                    + " | " + "<font color='blue'>معادل ریالی: </font>"+(itemData.partOtherCostIRR || "-").toLocaleString() + " (به نرخ امروز)"
                                                :"-")
                                            ),
                                            );
                                        }
                                    },
                                    fieldTemplate: function(selectedItem, container) {
                                        if (!selectedItem) {
                                            container.append(
                                                $("<div>").dxTextBox({ value: "", readOnly: true })
                                            );
                                            return;
                                        }

                                        if (selectedItem.manual) {
                                            container.append(
                                                $("<div>").dxTextBox({
                                                    value: "قیمت دلخواه",
                                                    readOnly: true
                                                })
                                            );
                                            return;
                                        }

                                        var text = 
                                            "شماره سفارش: " + (selectedItem.PINumber || "-") +
                                            " | بچ: " + (selectedItem.batchNo || "-") +
                                            " | پارت: " + (selectedItem.partNo || "-") +
                                            " | بخش: " + (selectedItem.subPartNo || "-");

                                        container.append(
                                            $("<div>").dxTextBox({
                                                value: text,
                                                readOnly: true,
                                                stylingMode: "outlined"
                                            })
                                        );
                                    },

                                    valueExpr: 'partPrdId',
                                    placeholder: 'انتخاب سفارش',
                                    rtlEnabled: true,
                                    searchEnabled: true,
                                    stylingMode: "outlined",
                                    
                                    onValueChanged: function(e) {
                                        $itemRow.find(`#priceUnitFX_${index}`).dxNumberBox('instance').option('value', null);
                                        $itemRow.find(`#priceIRR_${index}`).dxNumberBox('instance').option('value', null);
                                        $itemRow.find(`#priceIRRToday_${index}`).dxNumberBox('instance').option('value', null);
                                        $itemRow.find(`#proformaDate_${index}`).val('');
                                        $itemRow.find(`#priceFX_${index}`).dxNumberBox('instance').option('value', null);
                                        $itemRow.find(`#currencySrcSelect_${index}`).dxSelectBox('instance').option('value', null);
                                        $itemRow.find(`#currencySelect_${index}`).dxSelectBox('instance').option('value', null);
                                        $itemRow.find(`#proformaDataFa_${index}`).text('');
                                        $itemRow.find(`#priceUnitFX_${index}`).dxNumberBox('option', 'readOnly', true);
                                        //$itemRow.find(`#currencySrcSelect_${index}`).dxSelectBox('option', 'readOnly', true);
                                        $itemRow.find(`#currencySelect_${index}`).dxSelectBox('option', 'readOnly', true);
                                        $itemRow.find(`#priceIRR_${index}`).dxNumberBox('option', 'readOnly', true);
                                        $itemRow.find(`#priceIRRToday_${index}`).dxNumberBox('option', 'readOnly', true);
                                        $itemRow.find(`#priceFX_${index}`).dxNumberBox('option', 'readOnly', true);
                                        if (e.value) {
                                            if (e.value === 'manual') {
                                                // اگر قیمت دلخواه انتخاب شد - فقط قیمت واحد ارزی قابل ویرایش
                                                $itemRow.find(`#priceUnitFX_${index}`).dxNumberBox('option', 'readOnly', false);
                                                //$itemRow.find(`#currencySrcSelect_${index}`).dxSelectBox('option', 'readOnly', false);
                                                $itemRow.find(`#currencySelect_${index}`).dxSelectBox('option', 'readOnly', false);
                                                $itemRow.find(`#proformaDataFa_${index}`).text('(نرخ امروز)');
                                            }
                                            else{
                                                const selectedProforma = relatedProformas.find(p => p.partPrdId === e.value);
                                                if (selectedProforma) {
                                                    $itemRow.find(`#proformaDate_${index}`).val(selectedProforma.proformaDate);

                                                    //const productQuantity = parseFloat($itemRow.find(`#item_Quantity_${index}`).val()) || 0;
                                                    const totalPackQty = $itemRow.find(`#item_totalPackQty_${index}`).val() || "";

                                                    // ست کردن قیمت واحد ارزی
                                                    $itemRow.find(`#priceUnitFX_${index}`).dxNumberBox('instance').option('value', selectedProforma.FXProductUnitPrice);
                                                    const packagingItems = response.data.filter(item => item.RecordType === 'Packaging');
                                                    // محاسبه قیمت کل ریالی
                                                   
                                                    let irrVal = selectedProforma.FXProductUnitPriceIRR * totalPackQty;
                                                    $itemRow.find(`#priceIRR_${index}`).dxNumberBox('instance').option('value', irrVal);
                                                    let irrValToday = selectedProforma.FXProductUnitPriceIRRToday * totalPackQty;
                                                    $itemRow.find(`#priceIRRToday_${index}`).dxNumberBox('instance').option('value', irrValToday);

                                                    // محاسبه قیمت کل ارزی
                                                    let fxVal = selectedProforma.FXProductUnitPrice * totalPackQty;
                                                    $itemRow.find(`#priceFX_${index}`).dxNumberBox('instance').option('value', fxVal);

                                                    // انتخاب ارز (بر اساس FXTypeId)
                                                    const currencyItem = CurrencyData.find(c => c.baseId === selectedProforma.FXTypeId);
                                                    if (currencyItem) {
                                                        $itemRow.find(`#currencySelect_${index}`).dxSelectBox('instance').option('value', currencyItem.baseId);
                                                    }

                                                    // انتخاب منبع ارز (بر اساس FXTypeSrc)
                                                    
                                                    const currencySrcItem = CurrencySrcData.find(cs => cs.baseId == (selectedProforma.FXTypeSrc || 53));
                                                    
                                                    if (currencySrcItem) {
                                                        $itemRow.find(`#currencySrcSelect_${index}`).dxSelectBox('instance').option('value', currencySrcItem.baseId);
                                                    }
                                                }
                                                $itemRow.find(`#proformaDataFa_${index}`).text(`(${selectedProforma.shamsi})`);
                                            }
                                        }

                                        // محاسبه مجموع هزینه‌ها بعد از تغییر سفارش
                                        calculateTotalCosts(bomItems);
                                    }
                                });

                                // Input قیمت واحد ارزی
                                $itemRow.find(`#priceUnitFX_${index}`).dxNumberBox({
                                    rtlEnabled: true,
                                    stylingMode: "outlined",
                                    format: "#,##0.###",
                                    placeholder: 'قیمت واحد',
                                    readOnly: true,
                                    onValueChanged: function(e) {
                                        updatePrices($itemRow, 'priceUnitFX', index);
                                    }
                                });

                                // Input قیمت کل ریالی
                                $itemRow.find(`#priceIRR_${index}`).dxNumberBox({
                                    rtlEnabled: true,
                                    stylingMode: "outlined",
                                    format: "#,##0",
                                    placeholder: 'قیمت کل ریالی',
                                    readOnly: true
                                });
                                $itemRow.find(`#priceIRRToday_${index}`).dxNumberBox({
                                    rtlEnabled: true,
                                    stylingMode: "outlined",
                                    format: "#,##0",
                                    placeholder: 'قیمت کل ریالی',
                                    readOnly: true
                                });
                                // Input قیمت کل ارزی
                                $itemRow.find(`#priceFX_${index}`).dxNumberBox({
                                    rtlEnabled: true,
                                    stylingMode: "outlined",
                                    format: "#,##0.###",
                                    placeholder: 'قیمت کل ارزی',
                                    readOnly: true
                                });

                                // SelectBox ارز
                                $itemRow.find(`#currencySelect_${index}`).dxSelectBox({
                                    dataSource: CurrencyData,
                                    displayExpr: 'name',
                                    valueExpr: 'baseId',
                                    placeholder: 'ارز',
                                    rtlEnabled: true,
                                    searchEnabled: true,
                                    stylingMode: "outlined",
                                    onValueChanged: function(e) {
                                        updatePrices($itemRow, 'currency', index);
                                    }
                                });

                                // SelectBox منبع ارز
                                $itemRow.find(`#currencySrcSelect_${index}`).dxSelectBox({
                                    dataSource: CurrencySrcData,
                                    displayExpr: 'name',
                                    valueExpr: 'baseId',
                                    placeholder: 'منبع',
                                    rtlEnabled: true,
                                    stylingMode: "outlined",
                                    onValueChanged: function(e) {
                                        updatePrices($itemRow, 'currencySrc', index, proformaCurrencyRates);
                                    }
                                });
                                setTimeout(function() {
                                    const initialValue = relatedProformas.length > 0 ? relatedProformas[0].partPrdId : 'manual';
                                    $itemRow.find(`#proformaSelect_${index}`).dxSelectBox('instance').option('value', initialValue);
                                }, 100);
                            });
                        }

                        html = '';
                        $itemsList.append(html);

                        // اضافه کردن به ScrollView
                        $scrollView.dxScrollView('instance').content().append($itemsList);
                        container.append($scrollView);
                    }
                });

                bomDetailsPopup.show();
                $('#saveBomChangeBtn').on('click', function() {
                    showSaveBomChangeDialog();
                });

                $('#loadBomChangeBtn').on('click', function() {
                    showLoadBomChangeDialog();
                });
            } else {
                DevExpress.ui.notify('خطا در دریافت جزئیات: ' + response.error, 'error', 3000);
            }
        },
        error: function(xhr, status, error) {
            loader("hide");
            DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
        }
    });
}
function calculateTotalCosts(bomItems){
    
    let totalIRR = 0;
    let totalIRRToday = 0;
    let totalFX = 0;

    bomItems.forEach((item, index) => {
        // قیمت کل ریالی
        const priceIRRInstance = $(`#priceIRR_${index}`).dxNumberBox('instance');
        const priceIRRInstanceToday = $(`#priceIRRToday_${index}`).dxNumberBox('instance');
        if (priceIRRInstance) {
            const priceIRR = priceIRRInstance.option('value') || 0;
            totalIRR += priceIRR;
        }
        if (priceIRRInstanceToday) {
            const priceIRRToday = priceIRRInstanceToday.option('value') || 0;
            totalIRRToday += priceIRRToday;
        }

        // قیمت کل ارزی
        const proformaDate = $(`#proformaDate_${index}`).val();
        const currencySrcSelect = $(`#currencySrcSelect_${index}`).dxSelectBox('option', 'value');
        const currencySelect = $(`#currencySelect_${index}`).dxSelectBox('option', 'value');
        let rate = 1;
        let freeUsd = 1;
        if(!(currencySelect == 72 && currencySrcSelect == 53)){
            let prormaDateCurrencies = null;
            if(proformaDate) prormaDateCurrencies = proformaCurrencyRates[proformaDate];
            else prormaDateCurrencies = currencyRates;
            if(prormaDateCurrencies){
                freeUsd = (prormaDateCurrencies.find(c => c.baseId == 72)?.FreeRate) ||1; //USD
                const fxConvert = prormaDateCurrencies.find(c => c.baseId == currencySelect);
                
                if(fxConvert){
                    if (currencySrcSelect == 53) rate = fxConvert.FreeRate;
                    else if (currencySrcSelect == 51) rate = fxConvert.TarjihiRate;
                    else if (currencySrcSelect == 52) rate = fxConvert.NimaRate;
                    else if (currencySrcSelect == 147) rate = fxConvert.SanaRate;
                    else if (currencySrcSelect == 148) rate = fxConvert.MobadeleRate;
                }
            }
        }
        
        
        
        const priceFXInstance = $(`#priceFX_${index}`).dxNumberBox('instance');
        if (priceFXInstance) {
            const priceFX = (priceFXInstance.option('value') || 0) * rate / freeUsd;
            totalFX += priceFX;
        }
    });
    const freeUsdToday = currencyRates.find(c => c.baseId == 72)?.FreeRate;
    // نمایش مقادیر در المان‌های مربوطه
    $('#totalProducrCostIrr').text(threeDigit(totalIRR.toFixed(0)));
    $('#totalProducrCostIrrToday').text(threeDigit(totalIRRToday.toFixed(0)));
    $('#totalProducrCostUsd').text(totalFX.toFixed(3));
    $('#totalProducrCostUsdToday').text((totalIRRToday / freeUsdToday).toFixed(3));
}

// تابع برای نمایش دیالوگ ذخیره تغییرات
function showSaveBomChangeDialog() {
    // حذف دیالوگ قبلی اگر وجود داشته باشد
    if ($('#saveBomChangeDialog').length > 0) {
        $('#saveBomChangeDialog').remove();
    }

    const dialogContent = $('<div>').attr('id', 'saveBomChangeDialog');

    const formHtml = `
        <div style="padding: 20px;">
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b;">
                    نام ذخیره <span style="color: #ef4444;">*</span>
                </label>
                <div id="changeNameInput"></div>
            </div>
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b;">
                    شماره بچ
                </label>
                <div id="batchNoInput"></div>
            </div>
            <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b;">
                    توضیحات
                </label>
                <div id="descriptionInput"></div>
            </div>
        </div>
    `;

    dialogContent.html(formHtml);

    // اضافه کردن به body
    $('body').append(dialogContent);

    // Initialize inputs first
    dialogContent.find('#changeNameInput').dxTextBox({
        placeholder: 'نام برای این ذخیره را وارد کنید',
        rtlEnabled: true,
        stylingMode: 'outlined'
    });

    dialogContent.find('#batchNoInput').dxTextBox({
        placeholder: 'شماره بچ (اختیاری)',
        rtlEnabled: true,
        stylingMode: 'outlined'
    });

    dialogContent.find('#descriptionInput').dxTextArea({
        placeholder: 'توضیحات (اختیاری)',
        rtlEnabled: true,
        stylingMode: 'outlined',
        height: 100
    });

    // Create popup
    const saveDialog = dialogContent.dxPopup({
        title: 'ذخیره تغییرات',
        width: 500,
        height: 'auto',
        showCloseButton: true,
        rtlEnabled: true,
        toolbarItems: [{
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
                text: 'ذخیره',
                type: 'default',
                onClick: function() {
                    saveBomChange();
                }
            }
        }, {
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
                text: 'انصراف',
                onClick: function() {
                    saveDialog.hide();
                }
            }
        }]
    }).dxPopup('instance');
    saveDialog.show();
}

// تابع برای ذخیره تغییرات در دیتابیس
function saveBomChange() {
    const changeName = $('#changeNameInput').dxTextBox('instance').option('value');
    const batchNo = $('#batchNoInput').dxTextBox('instance').option('value');
    const description = $('#descriptionInput').dxTextArea('instance').option('value');

    if (!changeName || changeName.trim() === '') {
        DevExpress.ui.notify('لطفاً نام ذخیره را وارد کنید', 'warning', 3000);
        return;
    }

    // Get userId from session
    const userId = parseInt($('#userId').val()) || null;

    // Get ProductBomHeaderId from current BOM
    const productBomHeaderId = parseInt($('#selectedBomHeaderId').val());

    if (!productBomHeaderId) {
        DevExpress.ui.notify('خطا: شناسه BOM یافت نشد', 'error', 3000);
        return;
    }

    // جمع‌آوری اطلاعات تمام آیتم‌ها
    const bomItems = [];
    $('.dx-scrollview-content').find('[id^="proformaSelect_"]').each(function() {
        const index = $(this).attr('id').split('_')[1];
        const proformaSelectInstance = $(`#proformaSelect_${index}`).dxSelectBox('instance');
        const selectedValue = proformaSelectInstance.option('value');

        if (!selectedValue) return; // Skip if nothing selected

        const productBomDetailId = $(`#productBomDetailId_${index}`).val();

        const itemData = {
            ProductBomDetailId: parseInt(productBomDetailId),
            SelectedProformaType: selectedValue === 'manual' ? 'manual' : 'proforma',
            partPrdId: selectedValue !== 'manual' ? parseInt(selectedValue) : null,
            PriceUnitFX: null,
            CurrencyId: null,
            CurrencySrcId: null
        };

        // اگر manual انتخاب شده، قیمت‌های دستی رو بگیر
        if (selectedValue === 'manual') {
            const priceUnitFXInstance = $(`#priceUnitFX_${index}`).dxNumberBox('instance');
            const currencyInstance = $(`#currencySelect_${index}`).dxSelectBox('instance');
            const currencySrcInstance = $(`#currencySrcSelect_${index}`).dxSelectBox('instance');

            itemData.PriceUnitFX = priceUnitFXInstance ? priceUnitFXInstance.option('value') : null;
            itemData.CurrencyId = currencyInstance ? currencyInstance.option('value') : null;
            itemData.CurrencySrcId = currencySrcInstance ? currencySrcInstance.option('value') : null;
        }

        bomItems.push(itemData);
    });

    const saveData = {
        ProductBomHeaderId: productBomHeaderId,
        ChangeName: changeName.trim(),
        BatchNo: batchNo ? batchNo.trim() : null,
        ChangeDescription: description ? description.trim() : null,
        userId: userId,
        Items: bomItems
    };

    loader('show');

    $.ajax({
        url: 'Controller/cApiBom.ashx?action=savebomchange',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(saveData),
        dataType: 'json',
        success: function(response) {
            loader('hide');
            if (response.success) {
                DevExpress.ui.notify('تغییرات با موفقیت ذخیره شد', 'success', 3000);

                // بستن دیالوگ ذخیره
                const saveDialogInstance = $('#saveBomChangeDialog').dxPopup('instance');
                if (saveDialogInstance) {
                    saveDialogInstance.hide();
                }

                currentLoadedChange = {
                    BomDetailChangeId: response.BomDetailChangeId,
                    ChangeName: changeName.trim()
                };
                // Update popup title
                bomDetailsPopup.option('title', 'محاسبه هزینه  (' + changeName.trim() + ')');
                setLoadButtonDisabled(false);
            } else {
                DevExpress.ui.notify('خطا در ذخیره: ' + (response.error || 'خطای نامشخص'), 'error', 3000);
            }
        },
        error: function(xhr, status, error) {
            loader('hide');
            DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
        }
    });
}

// تابع برای نمایش دیالوگ بارگذاری تغییرات
function showLoadBomChangeDialog() {
    const userId = parseInt($('#userId').val()) || null;
    const productBomHeaderId = parseInt($('#selectedBomHeaderId').val());

    if (!productBomHeaderId) {
        DevExpress.ui.notify('خطا: شناسه BOM یافت نشد', 'error', 3000);
        return;
    }

    loader('show');

    // دریافت لیست تغییرات ذخیره شده
    $.ajax({
        url: `Controller/cApiBom.ashx?action=getbomchanges&productBomHeaderId=${productBomHeaderId}&userId=${userId || ''}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            loader('hide');

            if (response.success && response.data) {
                // حذف دیالوگ قبلی اگر وجود داشته باشد
                if ($('#loadBomChangeDialog').length > 0) {
                    $('#loadBomChangeDialog').remove();
                }

                const dialogContent = $('<div>').attr('id', 'loadBomChangeDialog');
                const gridHtml = '<div id="bomChangesGrid" style="height: 400px;"></div>';
                dialogContent.html(gridHtml);

                // اضافه کردن به body
                $('body').append(dialogContent);

                // Create popup first
                const loadDialog = dialogContent.dxPopup({
                    title: 'بارگذاری تغییرات ذخیره شده',
                    width: 700,
                    height: 600,
                    showCloseButton: true,
                    rtlEnabled: true,
                    onShown: function() {
                        // Initialize grid after popup is shown
                        dialogContent.find('#bomChangesGrid').dxDataGrid({
                            dataSource: response.data,
                            rtlEnabled: true,
                            showBorders: true,
                            showRowLines: true,
                            hoverStateEnabled: true,
                            columnAutoWidth: true,
                            selection: {
                                mode: 'single'
                            },
                            editing: {
                                mode: 'row',
                                allowUpdating: true,
                                allowDeleting: true,
                                useIcons: true
                            },
                            columns: [
                                {
                                    dataField: 'ChangeName',
                                    caption: 'نام',
                                    width: 200,
                                    validationRules: [{
                                        type: 'required',
                                        message: 'نام الزامی است'
                                    }]
                                },
                                {
                                    dataField: 'BatchNo',
                                    caption: 'شماره بچ',
                                    width: 120
                                },
                                {
                                    dataField: 'ChangeDescription',
                                    caption: 'توضیحات'
                                },
                                {
                                    dataField: 'CreatedDate',
                                    caption: 'تاریخ ایجاد',
                                    dataType: 'date',
                                    format: 'yyyy/MM/dd HH:mm',
                                    width: 150,
                                    allowEditing: false
                                },
                                {
                                    type: 'buttons',
                                    width: 110,
                                    buttons: [
                                        'edit',
                                        'delete',
                                        {
                                            hint: 'بارگذاری',
                                            icon: 'download',
                                            onClick: function(e) {
                                                loadBomChange(e.row.data.BomDetailChangeId, e.row.data.ChangeName);
                                                loadDialog.hide();
                                            }
                                        }
                                    ]
                                }
                            ],
                            onRowUpdating: function(e) {
                                updateBomChange(e.oldData.BomDetailChangeId, e.newData);
                            },
                            onRowRemoving: function(e) {
                                deleteBomChange(e.data.BomDetailChangeId, loadDialog);
                            }
                        });
                    },
                    toolbarItems: [{
                        widget: 'dxButton',
                        toolbar: 'bottom',
                        location: 'after',
                        options: {
                            text: 'انصراف',
                            onClick: function() {
                                loadDialog.hide();
                            }
                        }
                    }]
                }).dxPopup('instance');

                loadDialog.show();
            } else {
                DevExpress.ui.notify('هیچ تغییری ذخیره نشده است', 'info', 3000);
            }
        },
        error: function(xhr, status, error) {
            loader('hide');
            DevExpress.ui.notify('خطا در دریافت اطلاعات: ' + error, 'error', 3000);
        }
    });
}

// تابع برای بارگذاری یک تغییر خاص و پر کردن فرم
function loadBomChange(bomDetailChangeId, changeName) {
    loader('show');

    $.ajax({
        url: `Controller/cApiBom.ashx?action=getbomchangeitems&bomDetailChangeId=${bomDetailChangeId}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            loader('hide');

            if (response.success && response.data) {
                // پر کردن مقادیر
                response.data.forEach(function(item) {
                    // پیدا کردن index این آیتم
                    const index = findItemIndexByDetailId(item.ProductBomDetailId);

                    if (index !== -1) {
                        const proformaSelectInstance = $(`#proformaSelect_${index}`).dxSelectBox('instance');

                        if (item.SelectedProformaType === 'manual') {
                            proformaSelectInstance.option('value', 'manual');

                            // Set manual values
                            setTimeout(function() {
                                if (item.PriceUnitFX !== null) {
                                    $(`#priceUnitFX_${index}`).dxNumberBox('instance').option('value', item.PriceUnitFX);
                                }
                                if (item.CurrencyId !== null) {
                                    $(`#currencySelect_${index}`).dxSelectBox('instance').option('value', item.CurrencyId);
                                }
                                if (item.CurrencySrcId !== null) {
                                    $(`#currencySrcSelect_${index}`).dxSelectBox('instance').option('value', item.CurrencySrcId);
                                }
                            }, 200);
                        } else if (item.partPrdId !== null) {
                            proformaSelectInstance.option('value', item.partPrdId);
                        }
                    }
                });

                // Update current loaded change and popup title
                currentLoadedChange = {
                    BomDetailChangeId: bomDetailChangeId,
                    ChangeName: changeName
                };
                bomDetailsPopup.option('title', 'محاسبه هزینه (' + changeName + ')');

                DevExpress.ui.notify('تغییرات بارگذاری شد', 'success', 2000);
            } else {
                DevExpress.ui.notify('خطا در بارگذاری تغییرات', 'error', 3000);
            }
        },
        error: function(xhr, status, error) {
            loader('hide');
            DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
        }
    });
}

// تابع کمکی برای پیدا کردن index آیتم بر اساس ProductBomDetailId
function findItemIndexByDetailId(productBomDetailId) {
    let foundIndex = -1;

    $('.dx-scrollview-content').find('[id^="productBomDetailId_"]').each(function() {
        const index = $(this).attr('id').split('_')[1];
        const detailId = parseInt($(this).val());

        if (detailId === productBomDetailId) {
            foundIndex = parseInt(index);
            return false; // break loop
        }
    });

    return foundIndex;
}

// تابع برای به‌روزرسانی یک تغییر ذخیره شده
function updateBomChange(bomDetailChangeId, newData) {
    loader('show');

    const updateData = {
        BomDetailChangeId: bomDetailChangeId,
        ChangeName: newData.ChangeName || null,
        BatchNo: newData.BatchNo || null,
        ChangeDescription: newData.ChangeDescription || null
    };

    $.ajax({
        url: 'Controller/cApiBom.ashx?action=updatebomchange',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(updateData),
        dataType: 'json',
        success: function(response) {
            loader('hide');
            if (response.success) {
                DevExpress.ui.notify('تغییرات با موفقیت ذخیره شد', 'success', 2000);

                // اگر این رکورد همان رکوردی است که الان بارگذاری شده، عنوان را آپدیت کن
                if (currentLoadedChange && currentLoadedChange.BomDetailChangeId === bomDetailChangeId && newData.ChangeName) {
                    currentLoadedChange.ChangeName = newData.ChangeName;
                    bomDetailsPopup.option('title', 'محاسبه هزینه (' + newData.ChangeName + ')');
                }
            } else {
                DevExpress.ui.notify('خطا در ذخیره: ' + (response.error || 'خطای نامشخص'), 'error', 3000);
            }
        },
        error: function(xhr, status, error) {
            loader('hide');
            DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
        }
    });
}

// تابع برای حذف یک تغییر ذخیره شده
function deleteBomChange(bomDetailChangeId, loadDialog) {
    loader('show');

    $.ajax({
        url: `Controller/cApiBom.ashx?action=deletebomchange&bomDetailChangeId=${bomDetailChangeId}`,
        type: 'POST', // تغییر از DELETE به POST
        dataType: 'json',
        success: function(response) {
            loader('hide');
            if (response.success) {
                DevExpress.ui.notify('رکورد با موفقیت حذف شد', 'success', 2000);

                // اگر این رکورد همان رکوردی است که الان بارگذاری شده، عنوان را به حالت اولیه برگردان
                if (currentLoadedChange && currentLoadedChange.BomDetailChangeId === bomDetailChangeId) {
                    currentLoadedChange = null;
                    bomDetailsPopup.option('title', 'محاسبه هزینه');
                }

                // رفرش grid
                const grid = $('#bomChangesGrid').dxDataGrid('instance');
                if (grid) {
                    grid.refresh();
                }
            } else {
                DevExpress.ui.notify('خطا در حذف: ' + (response.error || 'خطای نامشخص'), 'error', 3000);
            }
        },
        error: function(xhr, status, error) {
            loader('hide');
            DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
        }
    });
}
function setLoadButtonDisabled(isDisabled) {
    try {
        if (!bomDetailsPopup) return;

        const toolbarItems = bomDetailsPopup.option('toolbarItems');
        if (!toolbarItems || !Array.isArray(toolbarItems)) return;

        const loadBtnItem = toolbarItems.find(item =>
            item.options?.elementAttr?.id === 'loadBomChangeBtnToolbar'
        );

        if (!loadBtnItem) return;

        loadBtnItem.options.disabled = isDisabled;

        bomDetailsPopup.option('toolbarItems', toolbarItems);

    } catch (error) {
        console.log('Error while setting Load button state:', error);
    }
}
function getSaveBomChangeCount(ProductBomHeaderId){
        $.ajax({
            url: `Controller/cApiBom.ashx?action=getsavebomchangecount&ProductBomHeaderId=${ProductBomHeaderId}`,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success && response.saveCount > 0) {
                    setLoadButtonDisabled(false);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error while getting save count:', error);
            }
        });
}
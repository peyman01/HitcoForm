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
                let mainUnitName = '';
                if (masterData.partUnitRef) {
                    const unit = unitsData.find(u => u.partUnitCode == masterData.partUnitRef);
                    mainUnitName = unit ? unit.partUnitName : '';
                }
                const quantityCaption = mainUnitName ? `مقدار در 1 ${mainUnitName} محصول اصلی` : 'مقدار';
                container.dxDataGrid({
                    dataSource: response.data,
                    rtlEnabled: true,
                    showBorders: true,
                    allowColumnResizing: true,
                    columns: createBomDetailCols(quantityCaption),
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

function showBomDetails(data) {
    loader("show");

    $.ajax({
        url: `Controller/cApiBom.ashx?action=getbomdetail&productBomHeaderId=${data.ProductBomHeaderId}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            loader("hide");
            if (response.success) {
                if (!bomDetailsPopup) {
                    bomDetailsPopup = $('<div id="bomDetailsPopup">').appendTo('body').dxPopup({
                        title: "محاسبه هزینه",
                        width: "70%",
                        height: 'auto',
                        maxHeight: '80vh',
                        showCloseButton: true,
                        rtlEnabled: true,
                        resizeEnabled: true
                    }).dxPopup("instance");
                }

                bomDetailsPopup.option('contentTemplate', function(contentElement) {
                    // ساخت TabPanel
                    const $tabPanel = $('<div>').dxTabPanel({
                        height: '100%',
                        rtlEnabled: true,
                        swipeEnabled: false,
                        animationEnabled: true,
                        onSelectionChanged: function(e) {
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

                                <div style="display: grid; grid-template-columns: 70% 30%; gap: 16px; margin-bottom: 16px;">
                                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
                                        <div style="font-size: 14px; font-weight: bold; color: #1e293b; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">مواد اولیه</div>
                                        <div id="analysisBomItems"></div>
                                    </div>

                                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
                                        <div style="font-size: 14px; font-weight: bold; color: #1e293b; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">سهم دسته‌بندی‌ها</div>
                                        <div id="categoryShares"></div>
                                    </div>
                                </div>

                                <div id="analysisCosts"></div>
                            </div>
                        `;

                        const $content = $(html);
                        $scrollView.dxScrollView('instance').content().append($content);
                        container.append($scrollView);

                        // متغیرهای هزینه
                        let analysisCurrencyRates = currencyRates;
                        const baseUSDRate = currencyRates.find(cr => cr.baseId === 72)?.FreeRate || 0;
                        let currentUSDRate = baseUSDRate;

                        const todayParts = YKN(new Intl.DateTimeFormat('fa-IR').format(new Date())).split('/');

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
                                            currentUSDRate = newUSDRate;
                                            // آپدیت slider
                                            $('#usdRateSlider').dxSlider('instance').option({
                                                value: newUSDRate,
                                                min: newUSDRate * 0.5,
                                                max: newUSDRate * 1.5
                                            });

                                            recalculateAnalysis();

                                            loader('hide');
                                        }
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
                                currentUSDRate = e.value;
                                recalculateAnalysis();
                            }
                        });

                        // دکمه reset برای slider دلار
                        $('#resetUsdRate').on('click', function() {
                            const slider = $('#usdRateSlider').dxSlider('instance');
                            const currentBaseRate = analysisCurrencyRates.find(cr => cr.baseId === 72)?.FreeRate || baseUSDRate;
                            slider.option('value', currentBaseRate);
                        });

                        // آرایه برای نگهداری تغییرات قیمت هر آیتم
                        const itemPriceChanges = {};

                        // تابع برای محاسبه مجدد
                        function recalculateAnalysis() {
                            let totalIRR = 0;
                            let totalUSDFree = 0;
                            const categoryTotals = {};

                            // پیدا کردن تمام آیتم‌های BOM از تب قبل
                            const bomItems = response.data.filter(item => !item.RecordType);

                            let itemsHTML = '';
                            bomItems.forEach((item, index) => {
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
                                const dividedBy = $(`#item_dividedBy_${index}`).val() || "";

                                // محاسبه devide
                                let devide = 1;
                                const packagingItems = response.data.filter(item => item.RecordType);
                                if (dividedBy) {
                                    devide = dividedBy.split("*")
                                    .map(type => packagingItems.find(p => p.RecordType === type)?.Quantity || 1)
                                    .reduce((acc, val) => acc * val, 1);
                                }

                                // اعمال تغییر قیمت از slider
                                const priceChange = itemPriceChanges[index] || 1;
                                const adjustedUnitPrice = baseUnitPrice * priceChange;

                                // محاسبه قیمت کل ارزی
                                const totalFX = adjustedUnitPrice * quantity / devide;

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
                                    else if (currencySrcId == 148) rate = currencyRate.Mobadele;

                                    // اگر دلار آزاد انتخاب شده، از نرخ slider استفاده کن
                                    if (currencyId == 72 && currencySrcId == 53) {
                                        rate = currentUSDRate;
                                    }

                                    totalIRRItem = totalFX * rate;

                                    // تبدیل به دلار آزاد
                                    const isUSD = currencyId == 72;
                                    const isFree = currencySrcId == 53;
                                    if (isUSD && isFree) {
                                        totalUSDItem = totalFX;
                                    } else {
                                        totalUSDItem = totalIRRItem / currentUSDRate;
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
                                            <div style="font-weight: 600; color: #1e293b;">${item.Name || '-'}</div>
                                            <div style="display: flex; gap: 8px; align-items: center;">
                                                <div style="font-size: 12px; color: #64748b;">قیمت واحد:</div>
                                                <div style="font-weight: bold; color: ${colorClass}; direction: ltr;">${Number(adjustedUnitPrice.toFixed(3)).toLocaleString()} ${currencyName}</div>
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
                                        <div style="font-size: 12px; color: #64748b;">
                                            مقدار: ${quantity} ${unitName} |
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

                            // نمایش هزینه‌های کل (استفاده از همان HTML تب جزئیات)
                            updateAnalysisCosts(totalIRR, totalUSDFree);
                        }

                        function updateAnalysisCosts(totalIRR, totalUSDFree) {
                            const packagingItems = response.data.filter(item => item.RecordType);
                            const primaryPkg = packagingItems.find(item => item.RecordType === packagingCategories[0].pkgEn);
                            const secondaryPkg = packagingItems.find(item => item.RecordType === packagingCategories[1].pkgEn);
                            const motherPkg = packagingItems.find(item => item.RecordType === packagingCategories[2].pkgEn);
                            const baseDate = $("#selectedBaseDate").val() || "امروز";
                            let costsHTML = `
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0; overflow: hidden;">
                                        <div style="padding: 10px 16px; border-bottom: 2px solid #e2e8f0;">
                                            <div style="font-size: 14px; font-weight: bold;">هزینه تمام شده خام (به نرخ ${baseDate})</div>
                                        </div>
                                        <div style="padding: 16px;">
                                            <div style="margin-bottom: 12px;">
                                                <div style="font-size: 11px; color: #64748b;">ریالی</div>
                                                <div style="font-size: 18px; font-weight: bold; color: #10b981; direction: ltr;">${Number(totalIRR.toFixed()).toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div style="font-size: 11px; color: #64748b;">دلاری</div>
                                                <div style="font-size: 18px; font-weight: bold; color: #10b981; direction: ltr;">${Number(totalUSDFree.toFixed(3)).toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0; overflow: hidden;">
                                        <div style="padding: 10px 16px; border-bottom: 2px solid #e2e8f0;">
                                            <div style="font-size: 14px; font-weight: bold;">با احتساب سربار (به نرخ ${baseDate})</div>
                                        </div>
                                        <div style="padding: 16px;">
                                            <div style="margin-bottom: 12px;">
                                                <div style="font-size: 11px; color: #64748b;">ریالی</div>
                                                <div style="font-size: 18px; font-weight: bold; color: #3b82f6; direction: ltr;">${Number(totalIRR.toFixed()).toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div style="font-size: 11px; color: #64748b;">دلاری</div>
                                                <div style="font-size: 18px; font-weight: bold; color: #3b82f6; direction: ltr;">${Number(totalUSDFree.toFixed(3)).toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;

                            // بسته‌بندی‌ها
                            if (packagingItems.length > 0) {
                                costsHTML += `
                                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
                                        <div style="font-size: 14px; font-weight: bold; color: #1e293b; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">هزینه هر بسته</div>
                                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
                                `;

                                if (primaryPkg) {
                                    const qty = parseFloat(primaryPkg.Quantity) || 0;
                                    const primaryRawIRR = totalIRR * qty;
                                    const primaryRawUSD = totalUSDFree * qty;

                                    costsHTML += `
                                        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 16px;">
                                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                                <div style="width: 40px; height: 40px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #f59e0b;">${qty}</div>
                                                <div>
                                                    <div style="font-size: 11px; color: #92400e;">بسته اولیه</div>
                                                    <div style="font-size: 9px; color: #92400e; opacity: 0.7;">شامل ${qty} واحد در بسته</div>
                                                </div>
                                            </div>
                                            <div style="background: white; border-radius: 8px; padding: 12px; margin-bottom: 8px;">
                                                <div style="font-size: 10px; color: #64748b; margin-bottom: 4px;">خام</div>
                                                <div style="font-weight: bold; color: #10b981; font-size: 14px; direction: ltr;">${Number(primaryRawIRR.toFixed()).toLocaleString()} <span style="font-size: 10px;">ریال</span></div>
                                                <div style="font-weight: bold; color: #10b981; font-size: 13px; direction: ltr; margin-top: 2px;">${Number(primaryRawUSD.toFixed(3)).toLocaleString()} <span style="font-size: 9px;">USD</span></div>
                                            </div>
                                            <div style="background: white; border-radius: 8px; padding: 12px;">
                                                <div style="font-size: 10px; color: #64748b; margin-bottom: 4px;">با سربار</div>
                                                <div style="font-weight: bold; color: #3b82f6; font-size: 14px; direction: ltr;">${Number(primaryRawIRR.toFixed()).toLocaleString()} <span style="font-size: 10px;">ریال</span></div>
                                                <div style="font-weight: bold; color: #3b82f6; font-size: 13px; direction: ltr; margin-top: 2px;">${Number(primaryRawUSD.toFixed(3)).toLocaleString()} <span style="font-size: 9px;">USD</span></div>
                                            </div>
                                        </div>
                                    `;

                                    if (secondaryPkg) {
                                        const secondaryQty = parseFloat(secondaryPkg.Quantity) || 0;
                                        const secondaryRawIRR = primaryRawIRR * secondaryQty;
                                        const secondaryRawUSD = primaryRawUSD * secondaryQty;

                                        costsHTML += `
                                            <div style="background: linear-gradient(135deg, #dbeafe 0%, #3b82f6 100%); border: 2px solid #2563eb; border-radius: 12px; padding: 16px;">
                                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                                    <div style="width: 40px; height: 40px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #2563eb;">${secondaryQty}</div>
                                                    <div>
                                                        <div style="font-size: 11px; color: #1e3a8a;">بسته ثانویه</div>
                                                        <div style="font-size: 9px; color: #1e3a8a; opacity: 0.7;">شامل ${secondaryQty} بسته اولیه</div>
                                                    </div>
                                                </div>
                                                <div style="background: white; border-radius: 8px; padding: 12px; margin-bottom: 8px;">
                                                    <div style="font-size: 10px; color: #64748b; margin-bottom: 4px;">خام</div>
                                                    <div style="font-weight: bold; color: #10b981; font-size: 14px; direction: ltr;">${Number(secondaryRawIRR.toFixed()).toLocaleString()} <span style="font-size: 10px;">ریال</span></div>
                                                    <div style="font-weight: bold; color: #10b981; font-size: 13px; direction: ltr; margin-top: 2px;">${Number(secondaryRawUSD.toFixed(3)).toLocaleString()} <span style="font-size: 9px;">USD</span></div>
                                                </div>
                                                <div style="background: white; border-radius: 8px; padding: 12px;">
                                                    <div style="font-size: 10px; color: #64748b; margin-bottom: 4px;">با سربار</div>
                                                    <div style="font-weight: bold; color: #3b82f6; font-size: 14px; direction: ltr;">${Number(secondaryRawIRR.toFixed()).toLocaleString()} <span style="font-size: 10px;">ریال</span></div>
                                                    <div style="font-weight: bold; color: #3b82f6; font-size: 13px; direction: ltr; margin-top: 2px;">${Number(secondaryRawUSD.toFixed(3)).toLocaleString()} <span style="font-size: 9px;">USD</span></div>
                                                </div>
                                            </div>
                                        `;

                                        if (motherPkg) {
                                            const motherQty = parseFloat(motherPkg.Quantity) || 0;
                                            const motherRawIRR = secondaryRawIRR * motherQty;
                                            const motherRawUSD = secondaryRawUSD * motherQty;

                                            costsHTML += `
                                                <div style="background: linear-gradient(135deg, #f3e8ff 0%, #a855f7 100%); border: 2px solid #9333ea; border-radius: 12px; padding: 16px;">
                                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                                        <div style="width: 40px; height: 40px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #9333ea;">${motherQty}</div>
                                                        <div>
                                                            <div style="font-size: 11px; color: #581c87;">بسته مادر</div>
                                                            <div style="font-size: 9px; color: #581c87; opacity: 0.7;">شامل ${motherQty} بسته ثانویه</div>
                                                        </div>
                                                    </div>
                                                    <div style="background: white; border-radius: 8px; padding: 12px; margin-bottom: 8px;">
                                                        <div style="font-size: 10px; color: #64748b; margin-bottom: 4px;">خام</div>
                                                        <div style="font-weight: bold; color: #10b981; font-size: 14px; direction: ltr;">${Number(motherRawIRR.toFixed()).toLocaleString()} <span style="font-size: 10px;">ریال</span></div>
                                                        <div style="font-weight: bold; color: #10b981; font-size: 13px; direction: ltr; margin-top: 2px;">${Number(motherRawUSD.toFixed(3)).toLocaleString()} <span style="font-size: 9px;">USD</span></div>
                                                    </div>
                                                    <div style="background: white; border-radius: 8px; padding: 12px;">
                                                        <div style="font-size: 10px; color: #64748b; margin-bottom: 4px;">با سربار</div>
                                                        <div style="font-weight: bold; color: #3b82f6; font-size: 14px; direction: ltr;">${Number(motherRawIRR.toFixed()).toLocaleString()} <span style="font-size: 10px;">ریال</span></div>
                                                        <div style="font-weight: bold; color: #3b82f6; font-size: 13px; direction: ltr; margin-top: 2px;">${Number(motherRawUSD.toFixed(3)).toLocaleString()} <span style="font-size: 9px;">USD</span></div>
                                                    </div>
                                                </div>
                                            `;
                                        }
                                    } else if (motherPkg) {
                                        const motherQty = parseFloat(motherPkg.Quantity) || 0;
                                        const motherRawIRR = primaryRawIRR * motherQty;
                                        const motherRawUSD = primaryRawUSD * motherQty;

                                        costsHTML += `
                                            <div style="background: linear-gradient(135deg, #f3e8ff 0%, #a855f7 100%); border: 2px solid #9333ea; border-radius: 12px; padding: 16px;">
                                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                                    <div style="width: 40px; height: 40px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #9333ea;">${motherQty}</div>
                                                    <div>
                                                        <div style="font-size: 11px; color: #581c87;">بسته مادر</div>
                                                        <div style="font-size: 9px; color: #581c87; opacity: 0.7;">${motherQty} بسته اولیه</div>
                                                    </div>
                                                </div>
                                                <div style="background: white; border-radius: 8px; padding: 12px; margin-bottom: 8px;">
                                                    <div style="font-size: 10px; color: #64748b; margin-bottom: 4px;">خام</div>
                                                    <div style="font-weight: bold; color: #10b981; font-size: 14px; direction: ltr;">${Number(motherRawIRR.toFixed()).toLocaleString()} <span style="font-size: 10px;">ریال</span></div>
                                                    <div style="font-weight: bold; color: #10b981; font-size: 13px; direction: ltr; margin-top: 2px;">${Number(motherRawUSD.toFixed(3)).toLocaleString()} <span style="font-size: 9px;">USD</span></div>
                                                </div>
                                                <div style="background: white; border-radius: 8px; padding: 12px;">
                                                    <div style="font-size: 10px; color: #64748b; margin-bottom: 4px;">با سربار</div>
                                                    <div style="font-weight: bold; color: #3b82f6; font-size: 14px; direction: ltr;">${Number(motherRawIRR.toFixed()).toLocaleString()} <span style="font-size: 10px;">ریال</span></div>
                                                    <div style="font-weight: bold; color: #3b82f6; font-size: 13px; direction: ltr; margin-top: 2px;">${Number(motherRawUSD.toFixed(3)).toLocaleString()} <span style="font-size: 9px;">USD</span></div>
                                                </div>
                                            </div>
                                        `;
                                    }
                                }

                                costsHTML += `
                                        </div>
                                    </div>
                                `;
                            }

                            $('#analysisCosts').html(costsHTML);
                        }

                        // محاسبه اولیه
                        setTimeout(() => recalculateAnalysis(), 500);
                    }

                    // تابع برای ساخت تب جزئیات
                    function createDetailsTab(container) {
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

                    html += `
                            </div>
                            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
                                <div style="font-size: 14px; font-weight: bold; color: #1e293b; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">مواد اولیه:</div>
                                <div id="bomItemsList" style="margin: 0;">
                    `;

                    // فیلتر کردن آیتم‌های غیر بسته‌بندی
                    const bomItems = response.data.filter(item => !item.RecordType);

                    if (bomItems.length === 0) {
                        html += `<div style="padding: 12px; color: #94a3b8; text-align: center;">هیچ آیتمی ثبت نشده است</div>`;
                    }

                    html += `
                                </div>
                            </div>
                    `;

                    const $itemsList = $(html);
                    const $bomItemsContainer = $itemsList.find('#bomItemsList');

                    const updatePrices = function(rowElement, sourceField, itemIndex) {
                        
                        const $row = $(rowElement);

                        // فقط اگر قیمت دلخواه انتخاب شده باشه
                        const selectedProformaValue = $row.find(`#proformaSelect_${itemIndex}`).dxSelectBox('option', 'value');
                        if (selectedProformaValue !== 'manual') {
                            return;
                        }
                        if ($row.data('updating')) return;
                        $row.data('updating', true);

                        try {
                            const productQuantity = parseFloat($row.find(`#item_Quantity_${itemIndex}`).val()) || 0;
                            const dividedBy = $row.find(`#item_dividedBy_${itemIndex}`).val() || "";
                            
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

                                if (baseIdCurrencySrc == 53) rate = currencyRate.FreeRate;
                                else if (baseIdCurrencySrc == 51) rate = currencyRate.TarjihiRate;
                                else if (baseIdCurrencySrc == 52) rate = currencyRate.NimaRate;
                                else if (baseIdCurrencySrc == 147) rate = currencyRate.SanaRate;
                                else if (baseIdCurrencySrc == 148) rate = currencyRate.Mobadele;
                                const packagingItems = response.data.filter(item => item.RecordType);
                                if (rate > 0) {
                                    // محاسبه قیمت کل ارزی = قیمت واحد × تعداد
                                    let devide = 1;
                                    if (dividedBy) {
                                        devide = dividedBy.split("*")
                                        .map(type => {
                                            return packagingItems.find(p => p.RecordType === type)?.Quantity || 1;
                                        })
                                        .reduce((acc, val) => acc * val, 1);
                                    }
                                    const priceFX = priceUnitFX * productQuantity / devide;
                                    $row.find(`#priceFX_${itemIndex}`).dxNumberBox('option', 'value', priceFX);

                                    // محاسبه قیمت کل ریالی = قیمت کل ارزی × نرخ
                                    const priceIRR = priceFX * rate;
                                    $row.find(`#priceIRR_${itemIndex}`).dxNumberBox('option', 'value', priceIRR);
                                }
                            }

                            // محاسبه مجموع هزینه‌ها
                            // calculateTotalCosts();

                        } finally {
                            setTimeout(() => {
                                $row.data('updating', false);
                            }, 100);
                        }
                    };

                    if (bomItems.length > 0) {
                        bomItems.forEach((item, index) => {
                            const productTypeColor = item.SrcIngredients === 'Finance' ? '#22c55e' : '#9ca3af';
                            const unitName = item.partUnitRef ? (unitsData.find(u => u.partUnitCode == item.partUnitRef)?.partUnitName || '') : '';
                            const categoryColor = item.color || '#f8fafc';

                            const relatedProformas = partProformaData.filter(p =>
                                p.SrcProduct === item.SrcIngredients &&
                                p.SrcProductId === item.SrcIngredientsProductId
                            );
                            const $itemRow = $(`
                                <div style="padding: 12px; margin-bottom: 8px; background: ${categoryColor}; border-radius: 8px;">
                                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                                        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${productTypeColor}; flex-shrink: 0;"></span>
                                        <div style="flex: 1;">
                                            <div style="font-weight: 600; color: #1e293b;">${item.Name || '-'}</div>
                                            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                                                دسته‌بندی: ${item.CategoryFa || '-'} |
                                                مقدار: ${item.Quantity || 0} ${unitName}
                                            </div>
                                        </div>
                                        <input type="hidden" value="${item.Quantity}" id="item_Quantity_${index}" />
                                        <input type="hidden" value="${(item.dividedBy || "")}" id="item_dividedBy_${index}" />
                                        
                                    </div>
                                    <div style="display: flex; gap: 8px; align-items: flex-end; margin-right: 20px;">
                                        <div style="flex: 1; min-width: 250px;">
                                            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px; font-weight: 500;">انتخاب سفارش</div>
                                            <div id="proformaSelect_${index}"></div>
                                        </div>
                                        <div style="width: 120px;">
                                            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px; font-weight: 500;">قیمت واحد ارزی</div>
                                            <div id="priceUnitFX_${index}"></div>
                                        </div>
                                        <div style="width: 150px;">
                                            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px; font-weight: 500;">قیمت کل ریالی (به نرخ امروز)</div>
                                            <div id="priceIRR_${index}"></div>
                                        </div>
                                        <div style="width: 120px;">
                                            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px; font-weight: 500;">قیمت کل ارزی</div>
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
                                    </div>
                                </div>
                            `);
                            $bomItemsContainer.append($itemRow);
                            $itemRow.find(`#proformaSelect_${index}`).dxSelectBox({
                                dataSource: [{partNo: 'manual',manual: true}].concat(relatedProformas),
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
                                        $("<span style='margin-right: 10px;'>").html(
                                            " | " +"<font color='blue'>بچ: </font>"+(itemData.batchNo || "-") 
                                            + " | " + "<font color='blue'>پارت: </font>"+(itemData.partNo || "-") 
                                            + " | " + "<font color='blue'>بخش: </font>"+(itemData.subPartNo || "-")
                                            + " | " + "<font color='blue'>تاریخ: </font>"+(itemData.shamsi || "-")
                                        ),
                                        $("<br>"),
                                        $("<small>").html(
                                            "<font color='blue'>قیمت: </font>"
                                            + (itemData.FXProductUnitPrice ? 
                                                itemData.FXProductUnitPrice + " " + (itemData.currencyName || "") + " " + (itemData.currencySrc || "")
                                                + " | " + "<font color='blue'>معادل ریالی: </font>"+(itemData.FXProductUnitPriceIRR || "-").toLocaleString() + " (به نرخ امروز)"
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

                                valueExpr: 'partNo',
                                placeholder: 'انتخاب سفارش',
                                rtlEnabled: true,
                                searchEnabled: true,
                                stylingMode: "outlined",
                                
                                onValueChanged: function(e) {
                                    $itemRow.find(`#priceUnitFX_${index}`).dxNumberBox('instance').option('value', null);
                                    $itemRow.find(`#priceIRR_${index}`).dxNumberBox('instance').option('value', null);
                                    $itemRow.find(`#priceFX_${index}`).dxNumberBox('instance').option('value', null);
                                    $itemRow.find(`#currencySrcSelect_${index}`).dxSelectBox('instance').option('value', null);
                                    $itemRow.find(`#currencySelect_${index}`).dxSelectBox('instance').option('value', null);
                                    $itemRow.find(`#priceUnitFX_${index}`).dxNumberBox('option', 'readOnly', true);
                                    $itemRow.find(`#currencySrcSelect_${index}`).dxSelectBox('option', 'readOnly', true);
                                    $itemRow.find(`#currencySelect_${index}`).dxSelectBox('option', 'readOnly', true);
                                    $itemRow.find(`#priceIRR_${index}`).dxNumberBox('option', 'readOnly', true);
                                    $itemRow.find(`#priceFX_${index}`).dxNumberBox('option', 'readOnly', true);
                                    if (e.value) {
                                        if (e.value === 'manual') {
                                            // اگر قیمت دلخواه انتخاب شد - فقط قیمت واحد ارزی قابل ویرایش
                                            $itemRow.find(`#priceUnitFX_${index}`).dxNumberBox('option', 'readOnly', false);
                                            $itemRow.find(`#currencySrcSelect_${index}`).dxSelectBox('option', 'readOnly', false);
                                            $itemRow.find(`#currencySelect_${index}`).dxSelectBox('option', 'readOnly', false);
                                        }
                                        else{
                                            const selectedProforma = relatedProformas.find(p => p.partNo === e.value);
                                            if (selectedProforma) {
                                                const productQuantity = parseFloat($itemRow.find(`#item_Quantity_${index}`).val()) || 0;
                                                const dividedBy = $itemRow.find(`#item_dividedBy_${index}`).val() || "";

                                                // ست کردن قیمت واحد ارزی
                                                $itemRow.find(`#priceUnitFX_${index}`).dxNumberBox('instance').option('value', selectedProforma.FXProductUnitPrice);

                                                // محاسبه قیمت کل ریالی
                                                let devide = 1;
                                                if (dividedBy) {
                                                    devide = dividedBy.split("*")
                                                    .map(type => {
                                                        return packagingItems.find(p => p.RecordType === type)?.Quantity || 1;
                                                    })
                                                    .reduce((acc, val) => acc * val, 1);
                                                }
                                                let irrVal = selectedProforma.FXProductUnitPriceIRR * productQuantity / devide;
                                                $itemRow.find(`#priceIRR_${index}`).dxNumberBox('instance').option('value', irrVal);

                                                // محاسبه قیمت کل ارزی
                                                let fxVal = selectedProforma.FXProductUnitPrice * productQuantity / devide;
                                                $itemRow.find(`#priceFX_${index}`).dxNumberBox('instance').option('value', fxVal);

                                                // انتخاب ارز (بر اساس FXTypeId)
                                                const currencyItem = CurrencyData.find(c => c.value === selectedProforma.FXTypeId);
                                                if (currencyItem) {
                                                    $itemRow.find(`#currencySelect_${index}`).dxSelectBox('instance').option('value', currencyItem.baseId);
                                                }

                                                // انتخاب منبع ارز (بر اساس FXTypeSrc)
                                                const currencySrcItem = CurrencySrcData.find(cs => cs.value === selectedProforma.FXTypeSrc);
                                                if (currencySrcItem) {
                                                    $itemRow.find(`#currencySrcSelect_${index}`).dxSelectBox('instance').option('value', currencySrcItem.baseId);
                                                }
                                            }
                                        }
                                    }

                                    // محاسبه مجموع هزینه‌ها بعد از تغییر سفارش
                                    // calculateTotalCosts();
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
                                searchEnabled: true,
                                stylingMode: "outlined",
                                onValueChanged: function(e) {
                                    updatePrices($itemRow, 'currencySrc', index);
                                }
                            });
                            setTimeout(function() {
                                const initialValue = relatedProformas.length > 0 ? relatedProformas[0].partNo : 'manual';
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
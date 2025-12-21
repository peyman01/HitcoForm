//////////////////////////////////////////////// Product Definition Functions ////////////////////////////////////////////////////////
function addNewProduct() {
    
    if (!productPopup) {
        productPopup = $("#productPopup").dxPopup({
            title: "افزودن محصول جدید",
            width: 600,
            height: 'auto',
            showCloseButton: true,
            rtlEnabled: true
        }).dxPopup("instance");
    }

    productPopup.option('title', 'افزودن محصول جدید');
    productPopup.option('contentTemplate', function(contentElement) {
        const formHtml = `
            <div style="padding: 20px;">
                <div style="margin-bottom: 16px;">
                    <div style="margin-bottom: 8px; font-weight: 600;">نام محصول <span style="color: red;">*</span></div>
                    <div id="productName"></div>
                </div>
                <div style="margin-bottom: 16px;">
                    <div style="margin-bottom: 8px; font-weight: 600;">برند</div>
                    <div id="productBrand"></div>
                </div>
                <div style="margin-bottom: 16px;">
                    <div style="margin-bottom: 8px; font-weight: 600;">دسته‌بندی <span style="color: red;">*</span></div>
                    <div id="productCategory"></div>
                </div>
                <div style="margin-bottom: 16px;">
                    <div style="margin-bottom: 8px; font-weight: 600;">واحد <span style="color: red;">*</span></div>
                    <div id="productUnit"></div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <button id="saveProductBtn" class="dx-button dx-button-success" style="min-width: 120px; margin-left: 10px;">ذخیره</button>
                    <button id="cancelProductBtn" class="dx-button dx-button-default" style="min-width: 120px;">انصراف</button>
                </div>
            </div>
        `;

        contentElement.append(formHtml);

        $("#productName").dxTextBox({
            rtlEnabled: true,
            stylingMode: "outlined"
        });

        $("#productBrand").dxSelectBox({
            dataSource: brandsData,
            displayExpr: 'brandName_EN',
            valueExpr: 'brandID',
            rtlEnabled: true,
            stylingMode: "outlined",
            searchEnabled: true,
            placeholder: 'انتخاب برند'
        });

        $("#productCategory").dxSelectBox({
            dataSource: bomCategories,
            displayExpr: 'CategoryFa',
            valueExpr: 'productBomCategoryId',
            rtlEnabled: true,
            stylingMode: "outlined",
            searchEnabled: true,
            placeholder: 'انتخاب دسته‌بندی'
        });

        $("#productUnit").dxSelectBox({
            dataSource: unitsData,
            displayExpr: 'partUnitName',
            valueExpr: 'partUnitCode',
            rtlEnabled: true,
            stylingMode: "outlined",
            searchEnabled: true,
            placeholder: 'انتخاب واحد'
        });

        $("#saveProductBtn").click(function() {
            const name = $("#productName").dxTextBox("instance").option("value");
            const brandId = $("#productBrand").dxSelectBox("instance").option("value");
            const productBomCategoryId = $("#productCategory").dxSelectBox("instance").option("value");
            const partUnitRef = $("#productUnit").dxSelectBox("instance").option("value");

            // Validation
            if (!name || !name.trim()) {
                DevExpress.ui.notify('نام محصول الزامی است', 'warning', 3000);
                return;
            }
            if (!productBomCategoryId) {
                DevExpress.ui.notify('دسته‌بندی الزامی است', 'warning', 3000);
                return;
            }
            if (!partUnitRef) {
                DevExpress.ui.notify('واحد الزامی است', 'warning', 3000);
                return;
            }

            saveProduct({
                name: name.trim(),
                brandID: brandId,
                productBomCategoryId: productBomCategoryId,
                partUnitRef: partUnitRef
            });
        });

        $("#cancelProductBtn").click(function() {
            productPopup.hide();
        });
    });

    productPopup.show();
}

function editProduct(data) {
    if (!productPopup) {
        productPopup = $("#productPopup").dxPopup({
            title: "ویرایش محصول",
            width: 600,
            height: 'auto',
            showCloseButton: true,
            rtlEnabled: true
        }).dxPopup("instance");
    }

    productPopup.option('title', 'ویرایش محصول');
    productPopup.option('contentTemplate', function(contentElement) {
        const formHtml = `
            <div style="padding: 20px;">
                <div style="margin-bottom: 16px;">
                    <div style="margin-bottom: 8px; font-weight: 600;">نام محصول <span style="color: red;">*</span></div>
                    <div id="productName"></div>
                </div>
                <div style="margin-bottom: 16px;">
                    <div style="margin-bottom: 8px; font-weight: 600;">برند</div>
                    <div id="productBrand"></div>
                </div>
                <div style="margin-bottom: 16px;">
                    <div style="margin-bottom: 8px; font-weight: 600;">دسته‌بندی <span style="color: red;">*</span></div>
                    <div id="productCategory"></div>
                </div>
                <div style="margin-bottom: 16px;">
                    <div style="margin-bottom: 8px; font-weight: 600;">واحد <span style="color: red;">*</span></div>
                    <div id="productUnit"></div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <button id="saveProductBtn" class="dx-button dx-button-success" style="min-width: 120px; margin-left: 10px;">ذخیره</button>
                    <button id="cancelProductBtn" class="dx-button dx-button-default" style="min-width: 120px;">انصراف</button>
                </div>
            </div>
        `;

        contentElement.append(formHtml);

        $("#productName").dxTextBox({
            value: data.name,
            rtlEnabled: true,
            stylingMode: "outlined"
        });

        $("#productBrand").dxSelectBox({
            dataSource: brandsData,
            displayExpr: 'brandName_EN',
            valueExpr: 'brandID',
            value: data.brandID,
            rtlEnabled: true,
            stylingMode: "outlined",
            searchEnabled: true,
            placeholder: 'انتخاب برند'
        });

        $("#productCategory").dxSelectBox({
            dataSource: bomCategories,
            displayExpr: 'CategoryFa',
            valueExpr: 'productBomCategoryId',
            value: data.productBomCategoryId,
            rtlEnabled: true,
            stylingMode: "outlined",
            searchEnabled: true,
            placeholder: 'انتخاب دسته‌بندی'
        });

        $("#productUnit").dxSelectBox({
            dataSource: unitsData,
            displayExpr: 'partUnitName',
            valueExpr: 'partUnitCode',
            value: data.partUnitRef,
            rtlEnabled: true,
            stylingMode: "outlined",
            searchEnabled: true,
            placeholder: 'انتخاب واحد'
        });

        $("#saveProductBtn").click(function() {
            const name = $("#productName").dxTextBox("instance").option("value");
            const brandId = $("#productBrand").dxSelectBox("instance").option("value");
            const productBomCategoryId = $("#productCategory").dxSelectBox("instance").option("value");
            const partUnitRef = $("#productUnit").dxSelectBox("instance").option("value");

            // Validation
            if (!name || !name.trim()) {
                DevExpress.ui.notify('نام محصول الزامی است', 'warning', 3000);
                return;
            }
            if (!productBomCategoryId) {
                DevExpress.ui.notify('دسته‌بندی الزامی است', 'warning', 3000);
                return;
            }
            if (!partUnitRef) {
                DevExpress.ui.notify('واحد الزامی است', 'warning', 3000);
                return;
            }

            saveProduct({
                pfPrdId: data.pfPrdId,
                name: name.trim(),
                brandID: brandId,
                productBomCategoryId: productBomCategoryId,
                partUnitRef: partUnitRef
            });
        });

        $("#cancelProductBtn").click(function() {
            productPopup.hide();
        });
    });

    productPopup.show();
}

function saveProduct(productData) {
    loader("show");

    $.ajax({
        url: 'Controller/cApiBom.ashx?action=savetempproduct',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(productData),
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                DevExpress.ui.notify('محصول با موفقیت ذخیره شد', 'success', 3000);
                productPopup.hide();
                loadTempProductList();
                loadBomComboData(); // Refresh product list in BOM
            } else {
                DevExpress.ui.notify('خطا در ذخیره محصول: ' + response.error, 'error', 5000);
            }
            loader("hide");
        },
        error: function(xhr, status, error) {
            loader("hide");
            DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
        }
    });
}

function deleteProduct(data) {
    DevExpress.ui.dialog.confirm("آیا از حذف این محصول اطمینان دارید؟", "تأیید حذف").then(function(result) {
        if (result) {
            loader("show");

            $.ajax({
                url: 'Controller/cApiBom.ashx?action=deletetempproduct',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ pfPrdId: data.pfPrdId }),
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        DevExpress.ui.notify('محصول با موفقیت حذف شد', 'success', 3000);
                        loadTempProductList();
                        loadBomComboData(); // Refresh product list in BOM
                    } else {
                        DevExpress.ui.notify('خطا در حذف محصول: ' + response.error, 'error', 3000);
                    }
                    loader("hide");
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
                }
            });
        }
    });
}

///////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////
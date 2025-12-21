function saveBomFromGrid() {
    // جمع‌آوری اطلاعات محصول اصلی
    const mainProductSelect = $("#mainProductSelect").dxSelectBox("instance");
    const mainSrcProductId = mainProductSelect.option("value");
    const mainProductData = bomComboData.find(x => x.SrcProductId == mainSrcProductId);

    if (!mainSrcProductId || !mainProductData) {
        DevExpress.ui.notify('لطفاً محصول اصلی را انتخاب کنید', 'warning', 3000);
        return;
    }

    const bomItems = [];
    const mainProductQty = $("#mainProductQuantity").dxNumberBox("instance").option("value") || 1;

    // جمع‌آوری از API Grid
    const apiGridData = apiGrid ? apiGrid.option("dataSource") : [];
    if(apiGridData.length)
        bomItems.push({
            SrcIngredients: null,
            SrcIngredientsProductId: null,
            partUnitRef: null,
            Quantity: mainProductQty,
            productBomCategoryId: null,
            RecordType: 'PrimaryPackQty'
        })
    apiGridData.forEach(row => {
        if (row.SrcIngredientsProductId && row.Quantity > 0) {
            const cat = bomCategories.find(c => c.categoryType == row.categoryType);
            bomItems.push({
                SrcIngredients: row.SrcIngredients,
                SrcIngredientsProductId: row.SrcIngredientsProductId,
                partUnitRef: row.partUnitRef,
                Quantity: row.Quantity,
                productBomCategoryId: cat ? cat.productBomCategoryId : null,
                RecordType: 'MainLevel'
            });
        }
    });
    
    // جمع‌آوری از Secondary Packaging Grid
    const secondaryGridData = secondaryPackagingGrid ? secondaryPackagingGrid.option("dataSource") : [];
    const secondaryQty = $("#secondaryPackagingQuantity").dxNumberBox("instance").option("value") || 1;
    if(secondaryGridData.length)
        bomItems.push({
            SrcIngredients: null,
            SrcIngredientsProductId: null,
            partUnitRef: null,
            Quantity: secondaryQty,
            productBomCategoryId: null,
            RecordType: 'SecondaryPackQty'
        })
    secondaryGridData.forEach(row => {
        if (row.SrcIngredientsProductId && row.Quantity > 0) {
            const cat = bomCategories.find(c => c.categoryType == row.categoryType);
            bomItems.push({
                SrcIngredients: row.SrcIngredients,
                SrcIngredientsProductId: row.SrcIngredientsProductId,
                partUnitRef: row.partUnitRef,
                Quantity: row.Quantity,
                productBomCategoryId: cat ? cat.productBomCategoryId : null,
                RecordType: 'SecondaryLevel'
            });
        }
    });

    // جمع‌آوری از Master Packaging Grid
    const masterGridData = masterPackagingGrid ? masterPackagingGrid.option("dataSource") : [];
    const motherQty = $("#masterPackagingQuantity").dxNumberBox("instance").option("value") || 1;
    if(masterGridData.length)
        bomItems.push({
            SrcIngredients: null,
            SrcIngredientsProductId: null,
            partUnitRef: null,
            Quantity: motherQty,
            productBomCategoryId: null,
            RecordType: 'MasterPackQty'
        })
    masterGridData.forEach(row => {
        if (row.SrcIngredientsProductId && row.Quantity > 0) {
            const cat = bomCategories.find(c => c.categoryType === row.categoryType);
            bomItems.push({
                SrcIngredients: row.SrcIngredients,
                SrcIngredientsProductId: row.SrcIngredientsProductId,
                partUnitRef: row.partUnitRef,
                Quantity: row.Quantity,
                productBomCategoryId: cat ? cat.productBomCategoryId : null,
                RecordType: 'MasterLevel'
            });
        }
    });

    // Check if at least one item exists
    if (bomItems.length === 0) {
        DevExpress.ui.notify('لطفاً حداقل یک آیتم اضافه کنید', 'warning', 3000);
        return;
    }

    loader("show");

    // ارسال به سرور
    const bomData = {
        companyId: selectedCompanyIds[0],
        mainProduct: {
            SrcProduct: mainProductData.SrcProduct,
            SrcProductId: mainProductData.SrcProductId,
            partUnitRef: mainProductData.partUnitRef
        },
        items: bomItems,
        actionMode: $("#actionMode").val()
    };

    // اضافه کردن ProductBomHeaderId در حالت Update
    if ($("#actionMode").val() === "update" && currentProductBomHeaderId) {
        bomData.ProductBomHeaderId = currentProductBomHeaderId;
    }

    $.ajax({
        url: 'Controller/cApiBom.ashx?action=savebom',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(bomData),
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                DevExpress.ui.notify('BOM با موفقیت ذخیره شد', 'success', 3000);
                bomPopup.hide();
                loadBomList("bomGrid");
                loadBomComboData();
            } else {
                DevExpress.ui.notify('خطا در ذخیره BOM: ' + response.error, 'error', 3000);
            }
            loader("hide");
        },
        error: function(xhr, status, error) {
            loader("hide");
            DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
        }
    });
}


function editBom(data) {
    loader("show");
    // ذخیره ProductBomHeaderId برای استفاده در save
    currentProductBomHeaderId = data.ProductBomHeaderId;

    $.ajax({
        url: `Controller/cApiBom.ashx?action=getbomdetail&productBomHeaderId=${data.ProductBomHeaderId}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            loader("hide");
            if (response.success) {
                // Open popup and load data
                bomPopup.show();
                setTimeout(function() {
                    $("#actionMode").val("update");

                    const brandSelect = $("#brandSelect").dxSelectBox("instance");
                    brandSelect.option("disabled", true);
                    if(data.brandId) brandSelect.option("value", data.brandId);
                    // Set main product
                    const mainProductSelect = $("#mainProductSelect").dxSelectBox("instance");
                    mainProductSelect.option("value", data.SrcProductId);
                    mainProductSelect.option("disabled", true);

                    // Set main product unit
                    const mainProductUnit = $("#mainProductUnit").dxSelectBox("instance");
                    if (data.partUnitRef) {
                        mainProductUnit.option("value", data.partUnitRef);
                    }

                    // Clear all grids
                    if (apiGrid) apiGrid.option("dataSource", []);
                    if (secondaryPackagingGrid) secondaryPackagingGrid.option("dataSource", []);
                    if (masterPackagingGrid) masterPackagingGrid.option("dataSource", []);

                    // تفکیک داده‌ها بر اساس RecordType
                    const allItems = response.data || [];

                    // بارگذاری MainLevel items به apiGrid
                    const mainLevelItems = allItems.filter(item => item.RecordType === 'MainLevel');
                    const apiGridData = mainLevelItems.map((item, index) => {
                        let partUnitName = '';
                        if (item.partUnitRef) {
                            const unit = unitsData.find(u => u.partUnitCode == item.partUnitRef);
                            partUnitName = unit ? unit.partUnitName : '';
                        }

                        // پیدا کردن categoryType از bomCategories
                        const category = bomCategories.find(c => c.productBomCategoryId == item.productBomCategoryId);

                        return {
                            id: new Date().getTime() + index,
                            categoryType: category ? category.categoryType : null,
                            CategoryFa: item.CategoryFa,
                            productBomCategoryId: item.productBomCategoryId,
                            SrcProductId: item.SrcIngredientsProductId,
                            SrcProduct: item.SrcIngredients,
                            SrcIngredients: item.SrcIngredients,
                            SrcIngredientsProductId: item.SrcIngredientsProductId,
                            pName: item.Name,
                            Quantity: item.Quantity,
                            partUnitRef: item.partUnitRef,
                            partUnitName: partUnitName
                        };
                    });
                    if (apiGrid) apiGrid.option("dataSource", apiGridData);

                    // بارگذاری SecondaryLevel items به secondaryPackagingGrid
                    const secondaryLevelItems = allItems.filter(item => item.RecordType === 'SecondaryLevel');
                    const secondaryGridData = secondaryLevelItems.map((item, index) => {
                        let partUnitName = '';
                        if (item.partUnitRef) {
                            const unit = unitsData.find(u => u.partUnitCode == item.partUnitRef);
                            partUnitName = unit ? unit.partUnitName : '';
                        }

                        const category = bomCategories.find(c => c.productBomCategoryId == item.productBomCategoryId);

                        return {
                            id: new Date().getTime() + index + 10000,
                            categoryType: category ? category.categoryType : 'packaging',
                            CategoryFa: item.CategoryFa,
                            productBomCategoryId: item.productBomCategoryId,
                            SrcProductId: item.SrcIngredientsProductId,
                            SrcProduct: item.SrcIngredients,
                            SrcIngredients: item.SrcIngredients,
                            SrcIngredientsProductId: item.SrcIngredientsProductId,
                            pName: item.Name,
                            Quantity: item.Quantity,
                            partUnitRef: item.partUnitRef,
                            partUnitName: partUnitName
                        };
                    });
                    if (secondaryPackagingGrid) secondaryPackagingGrid.option("dataSource", secondaryGridData);

                    // بارگذاری MasterLevel items به masterPackagingGrid
                    const masterLevelItems = allItems.filter(item => item.RecordType === 'MasterLevel');
                    const masterGridData = masterLevelItems.map((item, index) => {
                        let partUnitName = '';
                        if (item.partUnitRef) {
                            const unit = unitsData.find(u => u.partUnitCode == item.partUnitRef);
                            partUnitName = unit ? unit.partUnitName : '';
                        }

                        const category = bomCategories.find(c => c.productBomCategoryId == item.productBomCategoryId);

                        return {
                            id: new Date().getTime() + index + 20000,
                            categoryType: category ? category.categoryType : 'packaging',
                            CategoryFa: item.CategoryFa,
                            productBomCategoryId: item.productBomCategoryId,
                            SrcProductId: item.SrcIngredientsProductId,
                            SrcProduct: item.SrcIngredients,
                            SrcIngredients: item.SrcIngredients,
                            SrcIngredientsProductId: item.SrcIngredientsProductId,
                            pName: item.Name,
                            Quantity: item.Quantity,
                            partUnitRef: item.partUnitRef,
                            partUnitName: partUnitName
                        };
                    });
                    if (masterPackagingGrid) masterPackagingGrid.option("dataSource", masterGridData);

                    // بارگذاری مقادیر Quantity ها
                    const primaryPackQty = allItems.find(item => item.RecordType === 'PrimaryPackQty');
                    if (primaryPackQty) {
                        const mainQtyBox = $("#mainProductQuantity").dxNumberBox("instance");
                        if (mainQtyBox) mainQtyBox.option("value", primaryPackQty.Quantity);
                    }

                    const secondaryPackQty = allItems.find(item => item.RecordType === 'SecondaryPackQty');
                    if (secondaryPackQty) {
                        const secondaryQtyBox = $("#secondaryPackagingQuantity").dxNumberBox("instance");
                        if (secondaryQtyBox) secondaryQtyBox.option("value", secondaryPackQty.Quantity);
                    }

                    const masterPackQty = allItems.find(item => item.RecordType === 'MasterPackQty');
                    if (masterPackQty) {
                        const masterQtyBox = $("#masterPackagingQuantity").dxNumberBox("instance");
                        if (masterQtyBox) masterQtyBox.option("value", masterPackQty.Quantity);
                    }
                    setTimeout(function() {
                        updateApiGridCalculations();
                        updateSecondaryGridCalculations();
                        updateMasterGridCalculations();
                    }, 300);
                }, 300);

            } else {
                DevExpress.ui.notify('خطا در بارگیری اطلاعات: ' + response.error, 'error', 3000);
            }
        },
        error: function(xhr, status, error) {
            loader("hide");
            DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
        }
    });
}

function deleteBom(data) {
    DevExpress.ui.dialog.confirm("آیا از حذف این BOM اطمینان دارید؟", "تأیید حذف").then(function(result) {
        if (result) {
            loader("show");
            $.ajax({
                url: 'Controller/cApiBom.ashx?action=deletebom',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    ProductBomHeaderId: data.ProductBomHeaderId
                }),
                dataType: 'json',
                success: function(response) {
                    loader("hide");
                    if (response.success) {
                        DevExpress.ui.notify('BOM با موفقیت حذف شد', 'success', 2000);
                        loadBomList("bomGrid");
                        loadBomComboData();
                    } else {
                        DevExpress.ui.notify('خطا در حذف BOM: ' + response.error, 'error', 3000);
                    }
                },
                error: function(xhr, status, error) {
                    DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
                    loader("hide");
                }
            });
        }
    });
}

function setDefaultBom(data) {
    DevExpress.ui.dialog.confirm("آیا می‌خواهید این BOM را به عنوان پیش‌فرض تنظیم کنید؟", "تأیید تنظیم پیش‌فرض").then(function(result) {
        if (result) {
            loader("show");
            $.ajax({
                url: 'Controller/cApiBom.ashx?action=setdefaultbom',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    ProductBomHeaderId: data.ProductBomHeaderId
                }),
                dataType: 'json',
                success: function(response) {
                    loader("hide");
                    if (response.success) {
                        DevExpress.ui.notify('BOM با موفقیت به عنوان پیش‌فرض تنظیم شد', 'success', 2000);
                        loadBomList("bomGrid");
                    } else {
                        DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                    }
                },
                error: function(xhr, status, error) {
                    DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
                    loader("hide");
                }
            });
        }
    });
}
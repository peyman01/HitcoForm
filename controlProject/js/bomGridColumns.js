function createMainGridCols(mode){
    let mainGridCols=[
        {
            caption: '#',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function(container, options) {
                container.text(options.rowIndex + 1);
            }
        },
        { dataField: 'companyId', caption: 'companyId', visible: false },
        { dataField: 'companyName', caption: 'شرکت' },
        { dataField: 'brandName_EN', caption: 'برند' },
        { dataField: 'pName', caption: 'نام محصول' ,
            cellTemplate: function(container, options) {
                const color = options.data.SrcProduct === 'Finance' ? '#22c55e' : '#9ca3af';
                container.append(`
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${color};"></span>
                        <span>${options.value}</span>
                    </div>
                `);
            }
        },
        {
            dataField: 'partUnitRef',
            caption: 'واحد',
            calculateCellValue: function(rowData) {
                if (rowData.partUnitRef) {
                    const unit = unitsData.find(u => u.partUnitCode == rowData.partUnitRef);
                    return unit ? unit.partUnitName : rowData.partUnitRef;
                }
                return '';
            }
        },
        {
            dataField: 'BomCount',
            caption: 'تعداد BOM',
            alignment: 'center',
            cellTemplate: function(container, options) {
                const count = options.value || 0;
                const badge = count > 1
                    ? `<span style="background: #f59e0b; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">${count}</span>`
                    : `<span style="color: #64748b;">${count}</span>`;
                container.append(badge);
            }
        },
        ...((mode == "history") ?
            [{ dataField: 'CreatedBy', caption: 'کاربر' },
            { dataField: 'CreatedAt', caption: 'تاریخ' },]
        : []),
        {
            type: 'buttons',
            buttons: [
                ...(mode == "details" ? [{
                    hint: 'جزئیات',
                    icon: 'info',
                    onClick: function(e) {
                        showBomDetails(e.row.data);
                    }
                }] : []),
                ...(mode != "details" ? [{
                    hint: 'انتخاب به عنوان پیش‌فرض',
                    icon: 'check',
                    visible: function(e) {
                        return e.row.data.BomCount > 1 && !e.row.data.isDefault;
                    },
                    onClick: function(e) {
                        setDefaultBom(e.row.data);
                    }
                },
                {
                    hint: 'ویرایش',
                    icon: 'edit',
                    onClick: function(e) {
                        editBom(e.row.data);
                    }
                },
                {
                    hint: 'حذف',
                    icon: 'trash',
                    onClick: function(e) {
                        deleteBom(e.row.data);
                    }
                }] : [])
            ]
        },
    ]

    return mainGridCols;
}
function createProductDefinitionGridCols(brandsData){
    return [
        {
            caption: '#',
            width: 50,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function(container, options) {
                container.text(options.rowIndex + 1);
            }
        },
        { dataField: 'name', caption: 'نام محصول' ,},
        {
            dataField: 'brandID',
            caption: 'برند',
            lookup: {
                dataSource: brandsData,
                valueExpr: 'brandID',
                displayExpr: 'brandName_EN'
            }
        },
        {
            dataField: 'productBomCategoryId',
            caption: 'دسته‌بندی',
            lookup: {
                dataSource: bomCategories,
                valueExpr: 'productBomCategoryId',
                displayExpr: 'CategoryFa'
            }
        },
        {
            dataField: 'partUnitRef',
            caption: 'واحد',
            calculateCellValue: function(rowData) {
                if (rowData.partUnitRef) {
                    const unit = unitsData.find(u => u.partUnitCode == rowData.partUnitRef);
                    return unit ? unit.partUnitName : rowData.partUnitRef;
                }
                return '';
            }
        },
        {dataField: 'src', caption: 'منبع'},
        {dataField: 'Creator', caption: 'کاربر'},
        {
            type: 'buttons',
            buttons: [
                {
                    hint: 'ویرایش',
                    icon: 'edit',
                    onClick: function(e) {
                        editProduct(e.row.data);
                    }
                },
                {
                    hint: 'حذف',
                    icon: 'trash',
                    onClick: function(e) {
                        deleteProduct(e.row.data);
                    }
                }
            ]
        }
    ];
}
function createBomDetailCols(quantityCaption){
    return [
        {
            dataField: 'CategoryFa',
            caption: 'دسته‌بندی',
            width: 200,
            calculateCellValue: function(rowData) {
                if (rowData.RecordType) {
                    const match = packagingCategories.find(p => p.pkgEn === rowData.RecordType);
                    return match ? `تعداد در ${match.pkgFa}` : rowData.CategoryFa;
                }
                return rowData.CategoryFa;
            }
        },
        {   dataField: 'Name', caption: 'نام محصول' ,
            cellTemplate: function(container, options) {
                let color = "unset";
                if(options.data.SrcIngredients === 'Finance'){
                    color = '#22c55e';
                }else if(options.data.SrcIngredients === 'Temp'){
                    color = '#9ca3af';
                }
                container.append(`
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${color};"></span>
                        <span>${(options.value || '')}</span>
                    </div>
                `);
            }
        },
        {
            dataField: 'partUnitRef',
            caption: 'واحد',
            width: 100,
            calculateCellValue: function(rowData) {
                if (rowData.partUnitRef) {
                    const unit = unitsData.find(u => u.partUnitCode == rowData.partUnitRef);
                    return unit ? unit.partUnitName : rowData.partUnitRef;
                }
                return '';
            }
        },
        { dataField: 'Quantity', caption: quantityCaption, format: { type: 'fixedPoint', precision: 2 } }
    ]
}
function createBomInsertCols(categories){
    return [
        {
            dataField: 'categoryType',
            caption: 'دسته‌بندی',
            lookup: {
                dataSource: categories,
                valueExpr: 'categoryType',
                displayExpr: 'CategoryFa'
            },
            setCellValue: function(rowData, value) {
                rowData.categoryType = value;
                const cat = categories.find(c => c.categoryType === value);
                rowData.categoryType = cat ? cat.categoryType : null;
            }
        },
        {
            dataField: 'SrcProductId',
            caption: 'محصول',
            lookup: {
                dataSource: function(options) {
                    if (!options.data) return bomComboData;
                    const cat = categories.find(c => c.categoryType === options.data.categoryType);
                    const categoryId = cat ? cat.categoryType : "";
                    return bomComboData.filter(x => x.categoryType == categoryId || ((x.categoryType || "") == ""));
                },
                valueExpr: 'SrcProductId',
                displayExpr: 'pName'
            },
            setCellValue: function(rowData, value) {
                rowData.SrcProductId = value;
                const product = bomComboData.find(p => p.SrcProductId === value);
                if (product) {
                    rowData.pName = product.pName;
                    rowData.SrcProduct = product.SrcProduct;
                    rowData.SrcIngredients = product.SrcProduct;
                    rowData.SrcIngredientsProductId = product.SrcProductId;
                    if (product.partUnitRef) {
                        const unit = unitsData.find(u => u.partUnitCode == product.partUnitRef);
                        rowData.partUnitName = unit ? unit.partUnitName : '';
                        rowData.partUnitRef = unit ? unit.partUnitCode : '';
                    }
                }
            }
        },
        {
            dataField: 'Quantity',
            caption: 'مقدار',
            dataType: 'number',
            format: '#,##0.###',
            editorOptions: { min: 0 },
            setCellValue: function(rowData, value) {
                rowData.Quantity = value;
            }
        },
        {
            dataField: 'partUnitName',
            caption: 'واحد',
            allowEditing: false
        },
        {
            dataField: 'calculationText',
            caption: 'توضیح',
            allowEditing: false,
            cellTemplate: function(container, options) {
                if (options.value) {
                    container.html(`<span style="color: #dc2626;">${options.value}</span>`);
                }
            }
        }
    ]
}
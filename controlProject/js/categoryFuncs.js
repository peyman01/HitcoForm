
        function saveCategoryData(data, mode) {
            loader("show");
            const action = mode === 'insert' ? 'insertcategory' : 'updatecategory';
            $.ajax({
                url: 'Controller/cApiBom.ashx?action=' + action,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function(response) {
                    loader("hide");
                    if (response.success) {
                        DevExpress.ui.notify(mode === 'insert' ? 'دسته‌بندی با موفقیت اضافه شد' : 'دسته‌بندی با موفقیت ویرایش شد', 'success', 2000);
                        loadCategoryGrid();
                        loadBomCategories();
                    } else {
                        DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                        loadCategoryGrid();
                    }
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
                    loadCategoryGrid();
                }
            });
        }

        function deleteCategoryData(data) {
            loader("show");
            $.ajax({
                url: 'Controller/cApiBom.ashx?action=deletecategory',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ productBomCategoryId: data.productBomCategoryId }),
                dataType: 'json',
                success: function(response) {
                    loader("hide");
                    if (response.success) {
                        DevExpress.ui.notify('دسته‌بندی با موفقیت حذف شد', 'success', 2000);
                        loadCategoryGrid();
                        loadBomCategories();
                    } else {
                        DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                        loadCategoryGrid();
                    }
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
                    loadCategoryGrid();
                }
            });
        }
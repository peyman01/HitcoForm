<%@ Page Title="" Language="C#" MasterPageFile="master.Master" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Legal - Company Management</title>

    <style>
       
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="page-container">
        <div class="page-header">
            <div class="header-title">سامانه حقوقی</div>
            <button id="btnAttachmentSettings" class="header-btn">
                <i class="dx-icon-preferences" style="vertical-align: middle;"></i>
                مدیریت پیوست‌ها
            </button>
        </div>

        <div class="control-section">
            <div id="companiesGrid"></div>
            <input type="hidden" id="companyShareCount" />
        </div>

        <!-- Multi-Step Popup -->
        <div id="companyFormPopup"></div>

        <!-- Attachment Settings Popup -->
        <div id="attachmentSettingsPopup"></div>
    </div>

    <script>
        let companiesGrid;
        let companiesData = [];
        let companyFormPopup;
        let currentStep = 1;
        let currentCompanyId = 0;
        let companyTypesData = [];
        let companyStatusData = [];
        let attachmentTypesData = [];
        let pendingAttachments = {}; // {baseId: {file: File, date: string}}

        // Signatories form tracking variables
        let signatoriesFormInstance = null;
        let boardMemberTagBox = null;
        let signatureTypeSelectBox = null;
        let inputTypeRadioGroup = null;
        let customDescTextArea = null;
        let withOfficialStampCheckBox = null;

        // Board member file upload tracking
        let boardMembersGridInstance = null;
        let boardMembersFormInstance = null;

        // Custom attachments tracking
        let customAttachments = []; // Array of {attachmentTitle: string, file: File, attachmentId: int (for edit)}
        let customAttachmentCounter = 0;
        let deletedCustomAttachmentIds = []; // Track deleted attachment IDs

        // تابع عمومی برای چک کردن session expired
        function handleResponse(response) {
            if (response && response.sessionExpired === true) {
                DevExpress.ui.notify('نشست شما منقضی شده است. لطفاً دوباره وارد شوید.', 'warning', 3000);
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


            initializeCompaniesGrid();
            loadCompanies();
            loadBaseLookups();
            initializeAttachmentSettings();
        });

        function loadBaseLookups() {
            // Load company types
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=getbaselookup&groupName=companyType',
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        companyTypesData = response.data;
                        // Add "سایر" option
                        companyTypesData.push({ baseId: 0, nameBase: 'سایر', value: 0 });
                    }
                }
            });

            // Load company status
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=getbaselookup&groupName=companyStatus',
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        companyStatusData = response.data;
                    }
                }
            });

            // Load attachment types
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=getbaselookup&groupName=companyAttachments',
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        attachmentTypesData = response.data;
                    }
                }
            });
        }

        function initializeCompaniesGrid() {
            companiesGrid = $("#companiesGrid").dxDataGrid({
                dataSource: companiesData,
                rtlEnabled: true,
                showBorders: true,
                showRowLines: true,
                showColumnLines: true,
                rowAlternationEnabled: true,
                hoverStateEnabled: true,
                columnAutoWidth: true,
                wordWrapEnabled: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnResizingMode: 'widget',
                height: '80vh',
                keyExpr: 'companyId',
                editing: {
                    allowAdding: false,
                    allowUpdating: false,
                    allowDeleting: true,
                    useIcons: true
                },
                columns: [
                    {
                        dataField: 'companyId',
                        caption: 'شناسه',
                        visible: false,
                        alignment: 'center'
                    },
                    {
                        dataField: 'companyName',
                        caption: 'نام شرکت',
                    },
                    {
                        dataField: 'companyNameEn',
                        caption: 'نام انگلیسی',
                    },
                    {
                        dataField: 'abbCompanyName_EN',
                        caption: 'نام اختصاری',
                    },
                    {
                        dataField: 'businessActivity',
                        caption: 'فعالیت',
                        visible: false
                    },
                    {
                        dataField: 'nationalNo',
                        caption: 'شناسه ملی',
                    },
                    {
                        dataField: 'sharesCount',
                        caption: 'تعداد سهام',
                        customizeText: function(cellInfo) {
                            if (cellInfo.value == null) return "";
                            return Number(cellInfo.value).toLocaleString('fa-IR');
                        }
                    },
                    {
                        caption: 'تعداد اعضا',
                        
                        calculateCellValue: function(rowData) {
                            if (rowData.boardMembers && Array.isArray(rowData.boardMembers)) {
                                return rowData.boardMembers.length;
                            }
                            return 0;
                        }
                    },
                    {
                        caption: 'سهامداران',
                        cellTemplate: function(container, options) {
                            if (options.data.shareholders && options.data.shareholders.length > 0) {
                                const shareholdersText = options.data.shareholders
                                    .map(function(sh) {
                                        return sh.fullName + ' (' + Number(sh.sharesCount || 0).toLocaleString('fa-IR') + ')';
                                    })
                                    .join('<br>');
                                $('<span>').html(shareholdersText).appendTo(container);
                            } else {
                                $('<span>').text('-').appendTo(container);
                            }
                        }
                    },
                    {
                        dataField: 'isActive',
                        caption: 'فعال',
                        dataType: 'boolean',
                        alignment: 'center'
                    },
                    {
                        type: 'buttons',
                        buttons: [
                            {
                                hint: 'مشاهده مدارک',
                                icon: 'doc',
                                onClick: function(e) {
                                    showCompanyDocuments(e.row.data.companyId, e.row.data.companyName);
                                }
                            },
                            {
                                hint: 'ویرایش',
                                icon: 'edit',
                                onClick: function(e) {
                                    openCompanyForm(e.row.data.companyId);
                                }
                            },
                            {
                                name: 'delete',
                                hint: 'حذف',
                                icon: 'trash',
                                visible: function(e) {
                                    // Hide delete button if company is active
                                    return !e.row.data.isActive;
                                }
                            }
                        ]
                    }
                ],
                onRowRemoving: function(e) {
                    e.cancel = true;

                    const confirmResult = confirm('آیا از حذف این شرکت اطمینان دارید؟');
                    if (!confirmResult) return;

                    loader("show");

                    $.ajax({
                        url: 'Controller/cApiCompany.ashx?action=deletecompany&companyId=' + e.data.companyId,
                        type: 'GET',
                        dataType: 'json',
                        success: function(response) {
                            if (response.success) {
                                DevExpress.ui.notify('شرکت با موفقیت حذف شد', 'success', 3000);
                                loadCompanies();
                            } else {
                                DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                            }
                            loader("hide");
                        },
                        error: function(xhr, status, error) {
                            loader("hide");
                            DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
                        }
                    });
                },
                filterRow: {
                    visible: true
                },
                searchPanel: {
                    visible: true,
                    width: 240,
                    placeholder: 'جستجو...'
                },
                headerFilter: {
                    visible: true
                },
                onToolbarPreparing: function(e) {
                    e.toolbarOptions.items.unshift(
                        {
                            location: 'after',
                            widget: 'dxButton',
                            options: {
                                text: '',
                                hint: 'افزودن شرکت',
                                icon: 'add',
                                /*type: 'success',*/
                                onClick: function() {
                                    openCompanyForm(0);
                                }
                            }
                        },
                        {
                            location: 'after',
                            widget: 'dxButton',
                            options: {
                                icon: 'refresh',
                                hint: 'بارگیری مجدد',
                                onClick: function() {
                                    loadCompanies();
                                }
                            }
                        }
                    );
                }
            }).dxDataGrid("instance");
        }

        function openCompanyForm(companyId) {
            currentCompanyId = companyId;
            currentStep = 1;
            pendingAttachments = {}; // Clear pending attachments

            const popupContent = `
                <div class="step-wizard">
                    <div class="step-item active" data-step="1">
                        <div class="step-number">1</div>
                        <div class="step-label">اطلاعات عمومی</div>
                    </div>
                    <div class="step-item" data-step="2">
                        <div class="step-number">2</div>
                        <div class="step-label">پیوست‌ها</div>
                    </div>
                    <div class="step-item" data-step="3">
                        <div class="step-number">3</div>
                        <div class="step-label">اعضا</div>
                    </div>
                </div>

                <div class="step-content-wrapper" id="stepContentWrapper">
                    <div id="stepScrollView"></div>
                </div>

                <div class="wizard-buttons-container" id="wizardButtons"></div>
            `;

            companyFormPopup = $("#companyFormPopup").dxPopup({
                width: '95%',
                maxWidth: 1200,
                height: '90%',
                showTitle: true,
                title: companyId > 0 ? 'ویرایش شرکت' : 'افزودن شرکت جدید',
                contentTemplate: function() {
                    return $(popupContent);
                },
                rtlEnabled: true,
                dragEnabled: true,
                closeOnOutsideClick: false,
                showCloseButton: true,
                onShown: function() {
                    initializeStepContent();
                    if (companyId > 0) {
                        loadCompanyData(companyId);
                    }
                },
                toolbarItems: []
            }).dxPopup("instance");

            companyFormPopup.show();
        }

        function initializeStepContent() {
            $("#stepScrollView").dxScrollView({
                width: '100%',
                height: '100%',
                direction: 'vertical',
                showScrollbar: 'onScroll'
            });

            renderStep(currentStep);
        }

        function renderStep(step) {
            const scrollView = $("#stepScrollView").dxScrollView("instance");

            switch(step) {
                case 1:
                    scrollView.content().html(getStep1Content());
                    initializeStep1Controls();
                    // Load data if editing
                    if (currentCompanyId > 0) {
                        loadCompanyDataForStep1();
                    }
                    break;
                case 2:
                    scrollView.content().html(getStep2Content());
                    initializeStep2Controls();
                    break;
                case 3:
                    scrollView.content().html(getStep3Content());
                    initializeStep3Controls();
                    break;
            }

            updateStepIndicators();
            updateNavigationButtons();
        }

        function getStep1Content() {
            return `
                <div class="step-content active" data-step="1">
                    <div class="form-section">
                        <div class="form-section-title" onclick="toggleSection(this)">
                            <span>اطلاعات پایه</span>
                        </div>
                        <div class="form-section-content">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label required">نام شرکت (فارسی)</label>
                                    <div id="companyName"></div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">نام شرکت (انگلیسی)</label>
                                    <div id="companyNameEn" class="ltr-field"></div>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">نام اختصاری انگلیسی</label>
                                    <div id="abbCompanyName_EN" class="ltr-field"></div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label required">نوع شرکت</label>
                                    <div id="companyTypeNo"></div>
                                </div>
                            </div>
                            <div class="form-row" id="companyTypeManualRow" style="display: none;">
                                <div class="form-group">
                                    <label class="form-label required">نوع شرکت (دستی)</label>
                                    <div id="companyTypeManual"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <div class="form-section-title" onclick="toggleSection(this)">
                            <span>اطلاعات ثبتی</span>
                        </div>
                        <div class="form-section-content">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">شماره ثبت</label>
                                    <div id="registrationNumber" class="ltr-field"></div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">تاریخ تأسیس</label>
                                    <div id="establishmentDate" class="ltr-field"></div>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">کد اقتصادی</label>
                                    <div id="economicNo" class="ltr-field"></div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">شناسه ملی</label>
                                    <div id="nationalNo" class="ltr-field"></div>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">شماره کارگاه</label>
                                    <div id="workshopNo" class="ltr-field"></div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">وضعیت شرکت</label>
                                    <div id="companyStatus"></div>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">فعالیت تجاری</label>
                                    <div id="businessActivity"></div>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">تعداد سهام</label>
                                    <div id="sharesCount" class="ltr-field"></div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">کلاسه پرونده مالیات</label>
                                    <div id="taxCaseNumber" class="ltr-field"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <div class="form-section-title" onclick="toggleSection(this)">
                            <span>اطلاعات تماس</span>
                        </div>
                        <div class="form-section-content">
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">آدرس</label>
                                    <div id="address"></div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">کد پستی</label>
                                    <div id="postalCode" class="ltr-field"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            `;
        }

        function getStep2Content() {
            return `
                <div class="step-content active" data-step="2">
                    <div class="form-section">
                        <div class="form-section-title" onclick="toggleSection(this)">
                            <span>پیوست‌های شرکت</span>
                        </div>
                        <div class="form-section-content">
                            <div id="attachmentsContainer"></div>
                        </div>
                    </div>
                </div>
            `;
        }

        function getStep3Content() {
            return `
                <div class="step-content active" data-step="3">
                    <div class="form-section">
                        <div class="form-section-title" onclick="toggleSection(this)">
                            <span>اعضای هیئت مدیره</span>
                        </div>
                        <div class="form-section-content">
                            <div id="boardMembersGrid"></div>
                        </div>
                    </div>

                    <div class="form-section" style="margin-top: 20px;">
                        <div class="form-section-title" onclick="toggleSection(this)">
                            <span>حق امضا اوراق بهادار و اسناد تعهدآور</span>
                        </div>
                        <div class="form-section-content">
                            <div id="signatoriesGrid"></div>
                        </div>
                    </div>

                    <div class="form-section" style="margin-top: 20px;">
                        <div class="form-section-title" onclick="toggleSection(this)">
                            <span>مؤسسان</span>
                        </div>
                        <div class="form-section-content">
                            <div id="foundersGrid"></div>
                        </div>
                    </div>

                    <div class="form-section" style="margin-top: 20px;">
                        <div class="form-section-title" onclick="toggleSection(this)">
                            <span>سهامداران</span>
                        </div>
                        <div class="form-section-content">
                            <div id="shareholdersGrid"></div>
                        </div>
                    </div>

                    <div class="form-section" style="margin-top: 20px;">
                        <div class="form-section-title" onclick="toggleSection(this)">
                            <span>بازرسان</span>
                        </div>
                        <div class="form-section-content">
                            <div id="inspectorsGrid"></div>
                        </div>
                    </div>
                </div>
            `;
        }

        function initializeStep1Controls() {
            // Company Name
            $("#companyName").dxTextBox({
                rtlEnabled: true,
                placeholder: 'نام شرکت را وارد کنید'
            });

            $("#companyNameEn").dxTextBox({
                rtlEnabled: false,
                placeholder: 'Company Name'
            });

            $("#abbCompanyName_EN").dxTextBox({
                rtlEnabled: false,
                placeholder: 'ABC'
            });

            // Company Type
            $("#companyTypeNo").dxSelectBox({
                dataSource: companyTypesData,
                displayExpr: 'nameBase',
                valueExpr: 'value',
                rtlEnabled: true,
                searchEnabled: true,
                placeholder: 'نوع شرکت را انتخاب کنید',
                onValueChanged: function(e) {
                    if (e.value == 0) {
                        $("#companyTypeManualRow").show();
                    } else {
                        $("#companyTypeManualRow").hide();
                        $("#companyTypeManual").dxTextBox("instance").option("value", "");
                    }
                }
            });

            $("#companyTypeManual").dxTextBox({
                rtlEnabled: true,
                placeholder: 'نوع شرکت را وارد کنید'
            });

            // Registration info
            $("#registrationNumber").dxTextBox({
                rtlEnabled: true,
                placeholder: 'شماره ثبت'
            });

            $("#establishmentDate").dxTextBox({
                rtlEnabled: true,
                placeholder: '____/__/__',
                mask: '0000/00/00',
                maskRules: { '0': /[0-9]/ },
                maskInvalidMessage: 'تاریخ نامعتبر است'
            });

            $("#economicNo").dxTextBox({
                rtlEnabled: true,
                placeholder: 'کد اقتصادی'
            });

            $("#nationalNo").dxTextBox({
                rtlEnabled: true,
                placeholder: 'شناسه ملی'
            });

            $("#workshopNo").dxTextBox({
                rtlEnabled: true,
                placeholder: 'شماره کارگاه'
            });
            $("#taxCaseNumber").dxTextBox({
                rtlEnabled: true,
                placeholder: 'کلاسه پرونده مالیات'
            });

            $("#companyStatus").dxSelectBox({
                dataSource: companyStatusData,
                displayExpr: 'nameBase',
                valueExpr: 'value',
                rtlEnabled: true,
                searchEnabled: true,
                placeholder: 'وضعیت شرکت',
                onInitialized: function(e) {
                    e.component.option("value", parseInt(companyStatusData[0].value));
                },
                onOpened: function(e) {
                    // Set default to first item when adding new company
                    if (currentCompanyId == 0 && !e.component.option("value") && companyStatusData.length > 0) {
                        e.component.option("value", parseInt(companyStatusData[0].value));
                    }
                }
            });

            $("#businessActivity").dxTextArea({
                rtlEnabled: true,
                placeholder: 'فعالیت تجاری شرکت',
                height: 80
            });

            $("#sharesCount").dxNumberBox({
                rtlEnabled: false,
                placeholder: '0',
                format: '#,##0.##',
                min: 0,
                showSpinButtons: false,
                value: 0
            });

            $("#address").dxTextArea({
                rtlEnabled: true,
                placeholder: 'آدرس کامل شرکت',
                height: 100
            });

            $("#postalCode").dxTextBox({
                rtlEnabled: true,
                placeholder: 'کد پستی 10 رقمی',
                mask: '0000000000',
                maskRules: { '0': /[0-9]/ }
            });
        }

        function initializeStep2Controls() {
            let attachmentsHtml = '';

            attachmentTypesData.forEach(function(attType) {
                attachmentsHtml += `
                    <div class="attachment-section">
                        <div class="attachment-section-title">${attType.nameBase}</div>
                        <div id="attGrid_${attType.baseId}" style="margin-top: 12px;"></div>
                    </div>
                `;
            });

            $("#attachmentsContainer").html(attachmentsHtml);

            // Initialize grid for each attachment type
            attachmentTypesData.forEach(function(attType) {
                const gridId = `#attGrid_${attType.baseId}`;

                $(gridId).dxDataGrid({
                    dataSource: [],
                    width: '100%',
                    rtlEnabled: true,
                    showBorders: true,
                    rowAlternationEnabled: true,
                    hoverStateEnabled: true,
                    columnAutoWidth: true,
                    editing: {
                        mode: 'row',
                        allowAdding: true,
                        allowUpdating: true,
                        allowDeleting: true,
                        useIcons: true
                    },
                    columns: [
                        {
                            dataField: 'attachmentDate',
                            caption: 'تاریخ',
                            width: 250,
                            alignment: 'center',
                            allowEditing: true,
                            cssClass: 'ltr-field',
                            editorOptions: {
                                rtlEnabled: false,
                                placeholder: '____/__/__',
                                mask: '0000/00/00',
                                maskRules: { '0': /[0-9]/ },
                                useMaskedValue: true,
                                maskInvalidMessage: 'فرمت تاریخ نامعتبر است'
                            }
                        },
                        {
                            dataField: 'attachmentTitle',
                            caption: 'عنوان فایل',
                            width: 250,
                            allowEditing: true,
                            editorOptions: {
                                rtlEnabled: true,
                                placeholder: 'عنوان فایل را وارد کنید'
                            }
                        },
                        {
                            dataField: 'file',
                            caption: 'فایل',
                            //width: 250,
                            allowEditing: true,
                            editCellTemplate: function(container, options) {
                                // Only show file uploader for new rows
                                if (!options.data.companyAttachmentId) {
                                    $('<div>').dxFileUploader({
                                        rtlEnabled: true,
                                        uploadMode: 'useForm',
                                        selectButtonText: 'انتخاب فایل',
                                        accept: '*',
                                        multiple: false,
                                        onValueChanged: function(e) {
                                            options.setValue(e.value);
                                        }
                                    }).appendTo(container);
                                } else {
                                    // For existing rows, show file name (read-only)
                                    if (options.data.attachmentAddress) {
                                        const fileName = options.data.attachmentAddress.split('/').pop();
                                        $('<span>').text(fileName).appendTo(container);
                                    }
                                }
                            },
                            cellTemplate: function(container, options) {
                                if (options.data.attachmentAddress) {
                                    const fileName = options.data.attachmentAddress.split('/').pop();
                                    const fileExt = fileName.split('.').pop().toLowerCase();
                                    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExt);
                                    const isExcel = ['xls', 'xlsx', 'xlsm'].includes(fileExt);
                                    const isPdf = fileExt === 'pdf';
                                    const isWord = ['doc', 'docx'].includes(fileExt);
                                    $(container).css({
                                        display: 'flex',
                                        alignItems: 'center'
                                    });
                                    if (isImage) {
                                        $('<img>')
                                            .attr('src', '../' + options.data.attachmentAddress)
                                            .css({ width: '27px', height: '27px', marginRight: '8px', marginLeft: '8px', cursor: 'pointer' })
                                            .on('click', function() {
                                                showImagePreview('../' + options.data.attachmentAddress);
                                            })
                                            .appendTo(container);
                                    } else {
                                        // Show file type icon using image
                                        let iconSrc = '';

                                        if (isExcel) {
                                            iconSrc = '../Legal/img/excel.png';
                                        } else if (isPdf) {
                                            iconSrc = '../Legal/img/pdf.png';
                                        } else if (isWord) {
                                            iconSrc = '../Legal/img/word.png';
                                        } else {
                                            iconSrc = '../Legal/img/file.png';
                                        }

                                        $('<img>')
                                            .attr('src', iconSrc)
                                            .css({
                                                width: '27px',
                                                height: '27px',
                                                marginRight: '8px',
                                                marginLeft: '8px',
                                                cursor: 'pointer',
                                                objectFit: 'contain'
                                            })
                                            .on('click', function() {
                                                window.open('../' + options.data.attachmentAddress, '_blank');
                                            })
                                            .appendTo(container);
                                    }

                                    $('<a>')
                                        .attr('href', '../' + options.data.attachmentAddress)
                                        .attr('target', '_blank')
                                        .text("دانلود")
                                        .css({
                                            textDecoration: 'none',
                                            color: '#007bff',
                                            fontWeight: 'bold'
                                        })
                                    .appendTo(container);
                                }
                            }
                        },
                        {
                            dataField: 'isLatest',
                            caption: 'آخرین نسخه',
                            width: 120,
                            alignment: 'center',
                            dataType: 'boolean',
                            allowEditing: false,
                            visible: false,
                            customizeText: function(cellInfo) {
                                return cellInfo.value ? 'بله' : 'خیر';
                            }
                        },
                        {
                            type: 'buttons',
                            width: 150,
                            buttons: ['edit', 'delete', 'save', 'cancel']
                        }
                    ],
                    onRowInserting: function(e) {
                        e.cancel = true;

                        // Validate date format
                        const dateValue = e.data.attachmentDate;
                        if (dateValue && dateValue.length > 0 && dateValue.length < 10) {
                            DevExpress.ui.notify('فرمت تاریخ نامعتبر است. باید 10 رقم باشد (____/__/__)', 'error', 3000);
                            $(`#attGrid_${attType.baseId}`).dxDataGrid("instance").cancelEditData();
                            return;
                        }

                        const newData = {
                            companyId: currentCompanyId,
                            baseId: attType.baseId,
                            attachmentDate: e.data.attachmentDate || '',
                            attachmentTitle: e.data.attachmentTitle || '',
                            file: e.data.file
                        };
                        saveAttachmentImmediate(newData, attType.baseId);
                    },
                    onRowUpdating: function(e) {
                        e.cancel = true;

                        // Validate date format if date is being updated
                        if (e.newData.attachmentDate) {
                            const dateValue = e.newData.attachmentDate;
                            if (dateValue.length > 0 && dateValue.length < 10) {
                                DevExpress.ui.notify('فرمت تاریخ نامعتبر است. باید 10 رقم باشد (____/__/__)', 'error', 3000);
                                $(`#attGrid_${attType.baseId}`).dxDataGrid("instance").cancelEditData();
                                return;
                            }
                        }

                        const updatedData = {
                            companyAttachmentId: e.key.companyAttachmentId,
                            attachmentDate: e.newData.attachmentDate !== undefined ? e.newData.attachmentDate : e.oldData.attachmentDate,
                            attachmentTitle: e.newData.attachmentTitle !== undefined ? e.newData.attachmentTitle : e.oldData.attachmentTitle
                        };
                        updateAttachmentDate(updatedData, attType.baseId);
                    },
                    onRowRemoving: function(e) {
                        e.cancel = true;
                        deleteAttachment(e.data.companyAttachmentId);
                    },
                    onEditorPreparing: function(e) {
                        // Only allow editing date field
                        if (e.dataField === 'file' && e.row && e.row.data && e.row.data.companyAttachmentId) {
                            e.editorOptions.disabled = true;
                        }
                    }
                });
            });

            // Load all attachments once
            if (currentCompanyId > 0) {
                loadAllAttachments();
            }
        }


        function initializeStep3Controls() {
            if (!currentCompanyId) {
                DevExpress.ui.notify('ابتدا اطلاعات شرکت را ذخیره کنید', 'warning', 3000);
                return;
            }

            // Board Members Grid
            boardMembersGridInstance = $("#boardMembersGrid").dxDataGrid({
                dataSource: [],
                width: '100%',
                rtlEnabled: true,
                showBorders: true,
                showRowLines: true,
                showColumnLines: true,
                rowAlternationEnabled: true,
                hoverStateEnabled: true,
                columnAutoWidth: true,
                wordWrapEnabled: true,
                keyExpr: 'boardMemberId',
                editing: {
                    mode: 'popup',
                    allowAdding: true,
                    allowUpdating: true,
                    allowDeleting: true,
                    useIcons: true,
                    popup: {
                        title: 'عضو هیئت مدیره',
                        showTitle: true,
                        maxWidth: 1150,
                        height: 'auto'
                    },
                    form: {
					
                        itemType: 'group',
                        colCount: 2,
                        items: [
                            {
                                dataField: 'isLegalPerson',
                                label: { text: 'نوع شخص' },
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    rtlEnabled: true,
                                    valueExpr: 'value',
                                    displayExpr: 'text',
                                    items: [
                                        { value: 0, text: 'حقیقی' },
                                        { value: 1, text: 'حقوقی' }
                                    ]
                                }
                            },
                            {
                                dataField: 'fullName',
                                label: { text: 'نام و نام خانوادگی / نام شرکت' },
                                editorOptions: {
                                    rtlEnabled: true
                                },
                                colSpan: 2,
                                colCount: 2,
                                validationRules: [{ type: 'required', message: 'این فیلد الزامی است' }]
                            },
                            {
                                dataField: 'nationalNo',
                                label: { text: 'کد ملی (حقیقی)' },
								cssClass: 'ltr-field',
                                editorOptions: {
                                    maxLength: 10,
                                    placeholder: '10 رقم',
                                }
                            },
                            {
                                dataField: 'economicNo',
                                label: { text: 'شناسه اقتصادی (حقوقی)' },
                                cssClass: 'ltr-field',
                                editorOptions: {
                                    maxLength: 14,
                                    placeholder: '11 یا 14 رقم'
                                }
                            },
                            {
                                dataField: 'boardPosition',
                                label: { text: 'سمت در هیئت مدیره' },
                                editorOptions: {
                                    rtlEnabled: true
                                },
                                validationRules: [{ type: 'required', message: 'این فیلد الزامی است' }]
                            },
                            {
                                dataField: 'organizationPosition',
                                label: { text: 'سمت سازمانی' },
                                editorOptions: {
                                    rtlEnabled: true
                                },
                            },
                            {
                                dataField: 'activityStartDate',
                                label: { text: 'تاریخ شروع تصدی' },
                                cssClass: 'ltr-field',
                                editorOptions: {
                                    rtlEnabled: false,
                                    mask: '0000/00/00',
                                    //maskRules: { '0': /[0-9]/ },
                                    //useMaskedValue: true,
                                    placeholder: '____/__/__',
                                    maskInvalidMessage: 'فرمت تاریخ نامعتبر است'
                                },
                                /*validationRules: [{
                                    type: 'pattern',
                                    pattern: /^(\d{4}\/\d{2}\/\d{2}|)$/,
                                    message: 'فرمت تاریخ باید به صورت 1401/02/08 باشد'
                                }]*/
                            },
                            {
                                dataField: 'activityEndDate',
                                label: { text: 'تاريخ پايان تصدی' },
                                cssClass: 'ltr-field',
                                editorOptions: {
                                    rtlEnabled: false,
                                    mask: '0000/00/00',
                                    //maskRules: { '0': /[0-9]/ },
                                    //useMaskedValue: true,
                                    placeholder: '____/__/__',
                                    maskInvalidMessage: 'فرمت تاریخ نامعتبر است'
                                },
                                /*validationRules: [{
                                    type: 'pattern',
                                    pattern: /^(\d{4}\/\d{2}\/\d{2}|)$/,
                                    message: 'فرمت تاریخ باید به صورت 1401/02/08 باشد'
                                }]*/
                            },
                            {
                                dataField: 'sharesCount',
                                label: { text: 'تعداد سهام (از ' + Number($("#companyShareCount").val() || 0).toLocaleString('fa-IR') + ')' },
                                editorType: 'dxNumberBox',
                                cssClass: 'ltr-field',
                                editorOptions: {
                                    min: 0,
                                    format: '#,##0.##',
                                    step: 0.01
                                },
                                validationRules: [{ type: 'required', message: 'این فیلد الزامی است' }]
                            },
                            {
                                dataField: 'isExecutive',
                                label: { text: 'عضو موظف / غیر موظف' },
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    rtlEnabled: true,
                                    valueExpr: 'value',
                                    displayExpr: 'text',
                                    items: [
                                        { value: 0, text: 'غیر موظف' },
                                        { value: 1, text: 'موظف' }
                                    ]
                                }
                            },
                            {
                                dataField: '_changeDetector',
                                visible: false,
                                editorType: 'dxTextBox'
                            },
                            {
                                dataField: 'isShareTrustee',
                                label: { text: 'امین السهم' },
                                editorType: 'dxCheckBox',
                                editorOptions: {
                                    rtlEnabled: true,
                                    
                                }
                            },
                            {
                                dataField: 'shareTrusteeFile',
                                label: { text: 'قرارداد امین السهم' },
                                template: function(data, itemElement) {
                                    const container = $('<div>');

                                    // Container for current file link
                                    const fileLinkContainer = $('<span>')
                                        .attr('id', 'shareTrusteeFileLinkContainer')
                                        .css({ marginLeft: '5px' });
                                    container.append(fileLinkContainer);

                                    // File input - disabled by default
                                    const fileInput = $('<input>')
                                        .attr('type', 'file')
                                        .attr('id', 'shareTrusteeFileInput')
                                        .prop('disabled', true)
                                        .on('change', function() {
                                            //TODO: trigger change is not working
                                            // Trigger change detection
                                            /*if (data.component) {
                                                const editorInstance = data.component.getEditor('_changeDetector');
                                                if (editorInstance) {
                                                    editorInstance.option('value', new Date().getTime().toString());
                                                }
                                            }*/
                                           const file = this.files[0] || null;
                                            if (data && data.component) {
                                                data.component.updateData('shareTrusteeFile', file ? file.name : null);
                                            }
                                        });

                                    container.append(fileInput);
                                    itemElement.append(container);
                                }
                            },
                            {
                                dataField: 'hasCooperationCommitment',
                                label: { text: 'دارای تعهد همکاری' },
                                editorType: 'dxCheckBox',
                                editorOptions: {
                                    rtlEnabled: true,
                                }
                            },
                            {
                                dataField: 'cooperationCommitmentFile',
                                label: { text: 'قرارداد تعهد همکاری' },
                                template: function(data, itemElement) {
                                    const container = $('<div>');

                                    // Container for current file link
                                    const fileLinkContainer = $('<span>')
                                        .attr('id', 'cooperationCommitmentFileLinkContainer')
                                        .css({ marginLeft: '5px' });
                                    container.append(fileLinkContainer);

                                    // File input - disabled by default
                                    const fileInput = $('<input>')
                                        .attr('type', 'file')
                                        .attr('id', 'cooperationCommitmentFileInput')
                                        .prop('disabled', true)
                                        .on('change', function() {
                                            //TODO: trigger change is not working
                                            // Trigger change detection
                                            if (data.component) {
                                                const editorInstance = data.component.getEditor('_changeDetector');
                                                if (editorInstance) {
                                                    editorInstance.option('value', new Date().getTime().toString());
                                                }
                                            }
                                        });

                                    container.append(fileInput);
                                    itemElement.append(container);
                                }
                            },
                            {
                                itemType: 'simple',
                                colSpan: 2,
                                template: function(data, itemElement) {
                                    const container = $('<div>').css({ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' });

                                    // Header
                                    const header = $('<div>').css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' });
                                    header.append($('<h4>').text('پیوست‌ها').css({ margin: 0 }));

                                    // Add button
                                    const addBtn = $('<button>')
                                        .attr('type', 'button')
                                        .addClass('dx-button dx-button-success')
                                        .css({ padding: '5px 15px' })
                                        .html('<i class="dx-icon-add"></i> افزودن پیوست')
                                        .on('click', function() {
                                            addCustomAttachment(container);
                                        });
                                    header.append(addBtn);
                                    container.append(header);

                                    // Attachments list container
                                    const listContainer = $('<div>')
                                        .attr('id', 'customAttachmentsContainer')
                                        .css({ marginTop: '10px' });
                                    container.append(listContainer);

                                    itemElement.append(container);
                                }
                            }
                        ]
                    }
                },
                columns: [
                    {
                        dataField: '_changeDetector',
                        visible: false,
                        allowEditing: false
                    },
                    {
                        dataField: '_customAttachmentsChanged',
                        visible: false,
                        formItem: {
                            visible: false
                        }
                    },
                    {
                        dataField: 'isShareTrustee',
                        visible: false
                    },
                    {
                        dataField: 'shareTrusteeFile',
                        visible: false
                    },
                    {
                        dataField: 'hasCooperationCommitment',
                        visible: false
                    },
                    {
                        dataField: 'cooperationCommitmentFile',
                        visible: false
                    },
                    {
                        dataField: 'isLegalPerson',
                        caption: 'نوع',
                        alignment: 'center',
                        customizeText: function(cellInfo) {
                            return cellInfo.value ? 'حقوقی' : 'حقیقی';
                        }
                    },
                    {
                        dataField: 'fullName',
                        caption: 'نام',
                    },
                    {
                        dataField: 'nationalNo',
                        caption: 'کد ملی',
                        rtlEnabled: false,
                        visible: false,
                    },
                    {
                        dataField: 'economicNo',
                        caption: 'شناسه اقتصادی',
                        visible: false,
                    },
                    {
                        dataField: 'isExecutive',
                        caption: 'عضو موظف',
                        alignment: 'center',
                        visible: false,
                        dataType: 'boolean'
                    },
                    {
                        dataField: 'boardPosition',
                        caption: 'سمت هیئت مدیره',
                        visible: true,
                    },
                    {
                        dataField: 'organizationPosition',
                        caption: 'سمت سازمانی',
                        visible: false,
                    },
                    {
                        dataField: 'activityStartDate',
                        caption: 'شروع فعالیت',
                        visible: false,
                    },
                    {
                        dataField: 'activityEndDate',
                        caption: 'پایان فعالیت',
                        visible: false,
                    },
                    {
                        dataField: 'sharesCount',
                        caption: 'تعداد سهام',
                        
                        alignment: 'center',
                        customizeText: function(cellInfo) {
                            const total = Number($("#companyShareCount").val() || 0);
                            if (!cellInfo.value) return '-';
                            return Number(cellInfo.value).toLocaleString('fa-IR') + ' از ' + total.toLocaleString('fa-IR');
                        }
                    },
                    {
                        caption: 'حق امضا',
                        alignment: 'center',
                        cellTemplate: function(container, options) {
                            // Check if this board member has signature rights
                            $.ajax({
                                url: 'Controller/cApiCompany.ashx?action=getsignatories&companyId=' + currentCompanyId,
                                type: 'GET',
                                dataType: 'json',
                                success: function(response) {
                                    if (response.success) {
                                        const signatories = response.data || [];
                                        const boardMemberId = options.data.boardMemberId;

                                        // Find if this member is in any signatory record
                                        const signatory = signatories.find(function(s) {
                                            if (s.boardMemberIds) {
                                                const ids = s.boardMemberIds.split(',').map(function(id) {
                                                    return parseInt(id.trim());
                                                });
                                                return ids.indexOf(boardMemberId) !== -1;
                                            }
                                            return false;
                                        });

                                        if (signatory) {
                                            // Has signature rights - show green checkmark and type
                                            $('<i>')
                                                .addClass('dx-icon-check')
                                                .css({ color: 'green', fontSize: '16px', marginLeft: '5px' })
                                                .appendTo(container);
                                            $('<span>')
                                                .text(signatory.signatureTypeDesc || '')
                                                .css({ marginRight: '5px' })
                                                .appendTo(container);
                                        } else {
                                            $(container).text('-');
                                        }
                                    } else {
                                        $(container).text('-');
                                    }
                                },
                                error: function() {
                                    $(container).text('-');
                                }
                            });
                        }
                    },
                    {
                        type: 'buttons',
                        buttons: ['edit', 'delete']
                    }
                ],
                onEditorPreparing: function(e) {
                    if (e.parentType === "dataRow" && e.dataField === "hasCooperationCommitment") {
                        e.editorOptions.onValueChanged = function(ev) {
                            e.setValue(ev.value);
                            $('#cooperationCommitmentFileInput').prop('disabled', !ev.value);
                        };
                    }
                    if (e.parentType === "dataRow" && e.dataField === "isShareTrustee") {
                        e.editorOptions.onValueChanged = function(ev) {
                            e.setValue(ev.value);
                            $('#shareTrusteeFileInput').prop('disabled', !ev.value);
                        };
                    }
                },

                onInitNewRow: function(e) {
                    // Set default values for radio buttons
                    e.data.isLegalPerson = 0;
                    e.data.isExecutive = 1;
                    e.data.isShareTrustee = false;
                    e.data.hasCooperationCommitment = false;

                    // Capture form instance for new row
                    setTimeout(function() {
                        const popup = e.component.getController('editing')._editPopup;
                        if (popup) {
                            const contentElement = popup.$content();
                            const form = contentElement.find('.dx-form').dxForm('instance');
                            if (form) {
                                boardMembersFormInstance = form;
                            }
                        }
                    }, 100);
                },
                onEditingStart: function(e) {
                    // Capture form instance
                    setTimeout(function() {
                        const popup = e.component.getController('editing')._editPopup;
                        if (popup) {
                            const contentElement = popup.$content();
                            const form = contentElement.find('.dx-form').dxForm('instance');
                            if (form) {
                                boardMembersFormInstance = form;
                            }
                        }
                    }, 100);

                    // Show current files and enable/disable inputs when editing
                    setTimeout(function() {
                        // Clear previous file links
                        $('#shareTrusteeFileLinkContainer').empty();
                        $('#cooperationCommitmentFileLinkContainer').empty();

                        // Show shareTrusteeFile if exists
                        if (e.data.shareTrusteeFile) {
                            const shareLink = $('<a>')
                                .attr('href', e.data.shareTrusteeFile)
                                .attr('target', '_blank')
                                .text('دانلود فایل فعلی')
                                .css({ color: '#337ab7' });
                            $('#shareTrusteeFileLinkContainer').append(shareLink);
                        }

                        // Show cooperationCommitmentFile if exists
                        if (e.data.cooperationCommitmentFile) {
                            const cooperationLink = $('<a>')
                                .attr('href', e.data.cooperationCommitmentFile)
                                .attr('target', '_blank')
                                .text('دانلود فایل فعلی')
                                .css({ color: '#337ab7' });
                            $('#cooperationCommitmentFileLinkContainer').append(cooperationLink);
                        }

                        // Enable/disable file inputs based on checkbox values
                        $('#shareTrusteeFileInput').prop('disabled', !e.data.isShareTrustee);
                        $('#cooperationCommitmentFileInput').prop('disabled', !e.data.hasCooperationCommitment);

                        // Load custom attachments if exists
                        if (e.data.customAttachments) {
                            loadExistingCustomAttachments(e.data.customAttachments);
                        } else {
                            clearCustomAttachments();
                        }
                    }, 100);
                },
                onRowInserting: function(e) {
                    e.cancel = true;
                    const gridInstance = e.component;

                    // Get files from file inputs
                    const shareTrusteeFile = $('#shareTrusteeFileInput')[0]?.files[0];
                    const cooperationFile = $('#cooperationCommitmentFileInput')[0]?.files[0];

                    const newData = $.extend({}, e.data, {
                        companyId: currentCompanyId
                    });

                    // Validation
                    if (newData.isShareTrustee && !shareTrusteeFile) {
                        DevExpress.ui.notify('لطفا قرارداد امین السهم را بارگذاری نمایید', 'error', 3000);
                        return;
                    }

                    if (newData.hasCooperationCommitment && !cooperationFile) {
                        DevExpress.ui.notify('لطفا قرارداد تعهد همکاری را بارگذاری نمایید', 'error', 3000);
                        return;
                    }

                    // Validate custom attachments
                    for (let i = 0; i < customAttachments.length; i++) {
                        const att = customAttachments[i];
                        if (!att.attachmentTitle || att.attachmentTitle.trim() === '') {
                            DevExpress.ui.notify('لطفا عنوان پیوست ' + (i + 1) + ' را وارد نمایید', 'error', 3000);
                            return;
                        }
                        if (!att.file && !att.existingFile) {
                            DevExpress.ui.notify('لطفا فایل پیوست ' + (i + 1) + ' را انتخاب نمایید', 'error', 3000);
                            return;
                        }
                    }

                    // Add custom attachments and deleted IDs to data
                    newData.customAttachments = customAttachments;
                    newData.deletedCustomAttachmentIds = deletedCustomAttachmentIds;

                    // آپلود فایل‌ها
                    const uploadPromises = [];

                    if (shareTrusteeFile) {
                        uploadPromises.push(uploadBoardMemberFile(shareTrusteeFile, 'shareTrustee'));
                    }

                    if (cooperationFile) {
                        uploadPromises.push(uploadBoardMemberFile(cooperationFile, 'cooperationCommitment'));
                    }

                    // Upload custom attachments
                    customAttachments.forEach(function(att, index) {
                        if (att.file) {
                            uploadPromises.push(
                                uploadCustomAttachmentFile(att.file, att.attachmentTitle, index)
                            );
                        }
                    });

                    if (uploadPromises.length > 0) {
                        Promise.all(uploadPromises).then(function(results) {
                            // Add file paths to data
                            results.forEach(function(result) {
                                if (result.type === 'shareTrustee') {
                                    newData.shareTrusteeFile = result.filePath;
                                } else if (result.type === 'cooperationCommitment') {
                                    newData.cooperationCommitmentFile = result.filePath;
                                } else if (result.type === 'customAttachment') {
                                    // Update the custom attachment with uploaded file path
                                    customAttachments[result.index].uploadedPath = result.filePath;
                                }
                            });

                            // Update newData with processed custom attachments
                            newData.customAttachments = customAttachments;

                            saveBoardMember(newData).then(function() {
                                loadBoardMembers();
                                loadShareholders();
                                clearCustomAttachments();
                                gridInstance.cancelEditData();
                            });
                        }).catch(function(error) {
                            DevExpress.ui.notify('خطا در آپلود فایل: ' + error, 'error', 3000);
                        });
                    } else {
                        // No files to upload, save directly
                        saveBoardMember(newData).then(function() {
                            loadBoardMembers();
                            loadShareholders();
                            clearCustomAttachments();
                            gridInstance.cancelEditData();
                        });
                    }
                },
                onRowUpdating: function(e) {
                    e.cancel = true;
                    const gridInstance = e.component;

                    // Get files from file inputs
                    const shareTrusteeFile = $('#shareTrusteeFileInput')[0]?.files[0];
                    const cooperationFile = $('#cooperationCommitmentFileInput')[0]?.files[0];

                    const updatedData = $.extend({}, e.oldData, e.newData);

                    // Validation: check if checkbox is checked but no file (neither new nor old)
                    if (updatedData.isShareTrustee && !shareTrusteeFile && !updatedData.shareTrusteeFile) {
                        DevExpress.ui.notify('لطفا قرارداد امین السهم را بارگذاری نمایید', 'error', 3000);
                        return;
                    }

                    if (updatedData.hasCooperationCommitment && !cooperationFile && !updatedData.cooperationCommitmentFile) {
                        DevExpress.ui.notify('لطفا قرارداد تعهد همکاری را بارگذاری نمایید', 'error', 3000);
                        return;
                    }

                    // Validate custom attachments
                    for (let i = 0; i < customAttachments.length; i++) {
                        const att = customAttachments[i];
                        if (!att.attachmentTitle || att.attachmentTitle.trim() === '') {
                            DevExpress.ui.notify('لطفا عنوان پیوست ' + (i + 1) + ' را وارد نمایید', 'error', 3000);
                            return;
                        }
                        if (!att.file && !att.existingFile) {
                            DevExpress.ui.notify('لطفا فایل پیوست ' + (i + 1) + ' را انتخاب نمایید', 'error', 3000);
                            return;
                        }
                    }

                    // Add custom attachments and deleted IDs to data
                    updatedData.customAttachments = customAttachments;
                    updatedData.deletedCustomAttachmentIds = deletedCustomAttachmentIds;

                    // آپلود فایل‌های جدید در صورت وجود
                    const uploadPromises = [];

                    if (shareTrusteeFile) {
                        uploadPromises.push(uploadBoardMemberFile(shareTrusteeFile, 'shareTrustee'));
                    }

                    if (cooperationFile) {
                        uploadPromises.push(uploadBoardMemberFile(cooperationFile, 'cooperationCommitment'));
                    }

                    // Upload custom attachments
                    customAttachments.forEach(function(att, index) {
                        if (att.file) {
                            uploadPromises.push(
                                uploadCustomAttachmentFile(att.file, att.attachmentTitle, index)
                            );
                        }
                    });

                    if (uploadPromises.length > 0) {
                        Promise.all(uploadPromises).then(function(results) {
                            // Update file paths if new files were uploaded
                            results.forEach(function(result) {
                                if (result.type === 'shareTrustee') {
                                    updatedData.shareTrusteeFile = result.filePath;
                                } else if (result.type === 'cooperationCommitment') {
                                    updatedData.cooperationCommitmentFile = result.filePath;
                                } else if (result.type === 'customAttachment') {
                                    // Update the custom attachment with uploaded file path
                                    customAttachments[result.index].uploadedPath = result.filePath;
                                }
                            });

                            // Update updatedData with processed custom attachments
                            updatedData.customAttachments = customAttachments;

                            saveBoardMember(updatedData).then(function() {
                                loadBoardMembers();
                                loadShareholders();
                                clearCustomAttachments();
                                gridInstance.cancelEditData();
                            });
                        }).catch(function(error) {
                            DevExpress.ui.notify('خطا در آپلود فایل: ' + error, 'error', 3000);
                        });
                    } else {
                        // No files to upload, save directly
                        saveBoardMember(updatedData).then(function() {
                            loadBoardMembers();
                            loadShareholders();
                            clearCustomAttachments();
                            gridInstance.cancelEditData();
                        });
                    }
                },
                onRowRemoving: function(e) {
                    e.cancel = true;
                    deleteBoardMember(e.data.boardMemberId);
                },
            }).dxDataGrid('instance');

            // Founders Grid
            $("#foundersGrid").dxDataGrid({
                dataSource: [],
                width: '100%',
                rtlEnabled: true,
                showBorders: true,
                showRowLines: true,
                showColumnLines: true,
                rowAlternationEnabled: true,
                hoverStateEnabled: true,
                columnAutoWidth: true,
                wordWrapEnabled: true,
                keyExpr: 'founderId',
                editing: {
                    mode: 'popup',
                    allowAdding: true,
                    allowUpdating: true,
                    allowDeleting: true,
                    useIcons: true,
                    popup: {
                        title: 'مؤسس',
                        showTitle: true,
                        maxWidth: 1200,
                        height: 'auto'
                    },
                    form: {
                        itemType: 'group',
                        colCount: 2,
                        items: [
                            {
                                dataField: 'isLegalPerson',
                                label: { text: 'نوع شخص' },
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    rtlEnabled: true,
                                    valueExpr: 'value',
                                    displayExpr: 'text',
                                    items: [
                                        { value: 0, text: 'حقیقی' },
                                        { value: 1, text: 'حقوقی' }
                                    ]
                                }
                            },
                            {
                                dataField: 'fullName',
                                label: { text: 'نام و نام خانوادگی / نام شرکت' },
                                editorOptions: {
                                    rtlEnabled: true
                                },
                                validationRules: [{ type: 'required', message: 'این فیلد الزامی است' }]
                            },
                            {
                                dataField: 'nationalNo',
                                label: { text: 'کد ملی (حقیقی)' },
                                cssClass: 'ltr-field',
                                editorOptions: {
                                    maxLength: 10,
                                    placeholder: '10 رقم'
                                }
                            },
                            {
                                dataField: 'economicNo',
                                label: { text: 'شناسه اقتصادی (حقوقی)' },
                                cssClass: 'ltr-field',
                                editorOptions: {
                                    maxLength: 14,
                                    placeholder: '11-14 رقم'
                                }
                            }
                        ]


                    }
                },
                columns: [
                    {
                        dataField: 'isLegalPerson',
                        caption: 'نوع',
                        alignment: 'center',
                        dataType: 'boolean',
                        customizeText: function(cellInfo) {
                            return cellInfo.value ? 'حقوقی' : 'حقیقی';
                        }
                    },
                    {
                        dataField: 'fullName',
                        caption: 'نام کامل',
                    },
                    {
                        dataField: 'nationalNo',
                        caption: 'کد ملی',
                    },
                    {
                        dataField: 'economicNo',
                        caption: 'شناسه اقتصادی',
                    },
                    {
                        type: 'buttons',
                        buttons: ['edit', 'delete']
                    }
                ],
                onInitNewRow: function(e) {
                    // Set default value for isLegalPerson
                    e.data.isLegalPerson = 0;
                },
                onRowInserting: function(e) {
                    e.cancel = true;
                    const gridInstance = e.component;
                    const newData = $.extend({}, e.data, { companyId: currentCompanyId });
                    saveFounder(newData).then(function() {
                        loadFounders();
                        gridInstance.cancelEditData();
                    });
                },
                onRowUpdating: function(e) {
                    e.cancel = true;
                    const gridInstance = e.component;
                    const updatedData = $.extend({}, e.oldData, e.newData);
                    saveFounder(updatedData).then(function() {
                        loadFounders();
                        gridInstance.cancelEditData();
                    });
                },
                onRowRemoving: function(e) {
                    e.cancel = true;
                    deleteFounder(e.data.founderId);
                },
            });

            // Shareholders Grid (Read-only)
            $("#shareholdersGrid").dxDataGrid({
                dataSource: [],
                width: '100%',
                rtlEnabled: true,
                showBorders: true,
                showRowLines: true,
                showColumnLines: true,
                rowAlternationEnabled: true,
                hoverStateEnabled: true,
                columnAutoWidth: true,
                wordWrapEnabled: true,
                keyExpr: 'shareholderId',
                columns: [
                    {
                        dataField: 'boardMemberFullName',
                        caption: 'نام',
                        calculateCellValue: function(rowData) {
                            // If this is a board member record, show board member name
                            // Otherwise show the fullName from shareholders table
                            return rowData.boardMemberFullName || rowData.fullName || '';
                        }
                    },
                    {
                        dataField: 'boardMemberPosition',
                        caption: 'سمت ',
                        calculateCellValue: function(rowData) {
                            return rowData.boardMemberPosition || '';
                        }
                    },
                    {
                        dataField: 'sharesCount',
                        caption: 'تعداد سهام',
                        
                        alignment: 'center',
                        //format: '#,##0.##',
                        customizeText: function(cellInfo) {
                            const total = Number($("#companyShareCount").val() || 0);
                            if (!cellInfo.value) return '-';
                            return Number(cellInfo.value).toLocaleString('fa-IR') + ' از ' + total.toLocaleString('fa-IR');
                        }
                    }
                ]
            });

            // Inspectors Grid
            $("#inspectorsGrid").dxDataGrid({
                dataSource: [],
                width: '100%',
                rtlEnabled: true,
                showBorders: true,
                showRowLines: true,
                showColumnLines: true,
                rowAlternationEnabled: true,
                hoverStateEnabled: true,
                columnAutoWidth: true,
                wordWrapEnabled: true,
                keyExpr: 'inspectorId',
                editing: {
                    mode: 'popup',
                    allowAdding: true,
                    allowUpdating: true,
                    allowDeleting: true,
                    useIcons: true,
                    popup: {
                        title: 'بازرس',
                        showTitle: true,
                        maxWidth: 1200,
                        height: 'auto'
                    },
                    form: {
                        itemType: 'group',
                        colCount: 2,
                        items: [
                            {
                                dataField: 'isLegalPerson',
                                label: { text: 'نوع شخص' },
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    rtlEnabled: true,
                                    valueExpr: 'value',
                                    displayExpr: 'text',
                                    items: [
                                        { value: 0, text: 'حقیقی' },
                                        { value: 1, text: 'حقوقی' }
                                    ]
                                }
                            },
                            {
                                dataField: 'fullName',
                                label: { text: 'نام و نام خانوادگی / نام شرکت' },
                                editorOptions: {
                                    rtlEnabled: true
                                },
                                colSpan: 2,
                                validationRules: [{ type: 'required', message: 'این فیلد الزامی است' }]
                            },
                            {
                                dataField: 'nationalNo',
                                label: { text: 'کد ملی (حقیقی)' },
                                cssClass: 'ltr-field',
                                editorOptions: {
                                    maxLength: 10,
                                    placeholder: '10 رقم'
                                }
                            },
                            {
                                dataField: 'economicNo',
                                label: { text: 'شناسه اقتصادی (حقوقی)' },
                                cssClass: 'ltr-field',
                                editorOptions: {
                                    maxLength: 14,
                                    placeholder: '11 یا 14 رقم'
                                }
                            },
                            {
                                dataField: 'startDate',
                                label: { text: 'تاریخ شروع بازرسی' },
                                cssClass: 'ltr-field',
                                editorType: 'dxTextBox',
                                editorOptions: {
                                    mask: '0000/00/00',
                                    placeholder: 'YYYY/MM/DD'
                                }
                            },
                            {
                                dataField: 'endDate',
                                label: { text: 'تاریخ پایان بازرسی' },
                                cssClass: 'ltr-field',
                                editorType: 'dxTextBox',
                                editorOptions: {
                                    mask: '0000/00/00',
                                    placeholder: 'YYYY/MM/DD'
                                }
                            },
                            {
                                dataField: 'isMainInspector',
                                label: { text: 'نوع بازرس' },
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    rtlEnabled: true,
                                    valueExpr: 'value',
                                    displayExpr: 'text',
                                    items: [
                                        { value: 1, text: 'اصلی' },
                                        { value: 0, text: 'علی البدل' }
                                    ]
                                }
                            }
                        ]
                    }
                },
                columns: [
                    {
                        dataField: 'isLegalPerson',
                        caption: 'نوع',
                        alignment: 'center',
                        customizeText: function(cellInfo) {
                            return cellInfo.value ? 'حقوقی' : 'حقیقی';
                        }
                    },
                    {
                        dataField: 'fullName',
                        caption: 'نام',
                    },
                    {
                        dataField: 'nationalNo',
                        caption: 'کد ملی',
                    },
                    {
                        dataField: 'economicNo',
                        caption: 'شناسه اقتصادی',
                    },
                    {
                        dataField: 'isMainInspector',
                        caption: 'نوع بازرس',
                        alignment: 'center',
                        customizeText: function(cellInfo) {
                            return cellInfo.value ? 'اصلی' : 'علی البدل';
                        }
                    },
                    {
                        dataField: 'startDate',
                        caption: 'تاریخ شروع',
                        customizeText: function (cellInfo) {
                            if (!cellInfo.value) return "";

                            const v = cellInfo.value.toString();
                            if (v.length === 8) {
                                return v.substring(0, 4) + "/" + v.substring(4, 6) + "/" + v.substring(6, 8);
                            }

                            return cellInfo.value;
                        }
                    },
                    {
                        dataField: 'endDate',
                        caption: 'تاریخ پایان',
                        customizeText: function (cellInfo) {
                            if (!cellInfo.value) return "";

                            const v = cellInfo.value.toString();
                            if (v.length === 8) {
                                return v.substring(0, 4) + "/" + v.substring(4, 6) + "/" + v.substring(6, 8);
                            }

                            return cellInfo.value;
                        }
                    },
                    {
                        type: 'buttons',
                        buttons: ['edit', 'delete']
                    }
                ],
                onInitNewRow: function(e) {
                    // Set default values
                    e.data.isLegalPerson = 0;
                    e.data.isMainInspector = 1;
                },
                onRowInserting: function(e) {
                    e.cancel = true;
                    const gridInstance = e.component;
                    const newData = $.extend({}, e.data, { companyId: currentCompanyId });
                    saveInspector(newData).then(function() {
                        loadInspectors();
                        gridInstance.cancelEditData();
                    });
                },
                onRowUpdating: function(e) {
                    e.cancel = true;
                    const gridInstance = e.component;
                    const updatedData = $.extend({}, e.oldData, e.newData);
                    saveInspector(updatedData).then(function() {
                        loadInspectors();
                        gridInstance.cancelEditData();
                    });
                },
                onRowRemoving: function(e) {
                    e.cancel = true;
                    deleteInspector(e.data.inspectorId);
                }
            });

            // Signatories Grid
            let signatoriesGridInstance = $("#signatoriesGrid").dxDataGrid({
                dataSource: [],
                width: '100%',
                rtlEnabled: true,
                showBorders: true,
                showRowLines: true,
                showColumnLines: true,
                rowAlternationEnabled: true,
                hoverStateEnabled: true,
                columnAutoWidth: true,
                wordWrapEnabled: true,
                keyExpr: 'signatoryId',
                editing: {
                    mode: 'popup',
                    allowAdding: true,
                    allowUpdating: true,
                    allowDeleting: true,
                    useIcons: true,
                    popup: {
                        title: 'حق امضا',
                        showTitle: true,
                        maxWidth: 800,
                        height: 'auto'
                    },
                    form: {
                        itemType: 'group',
                        colCount: 1,
                        items: [
                            {
                                dataField: 'inputType',
                                label: { text: 'نوع ورودی' },
                                editorType: 'dxRadioGroup',
                                editorOptions: {
                                    rtlEnabled: true,
                                    items: [
                                        { value: 'boardMembers', text: 'اعضای هیئت مدیره' },
                                        { value: 'customDesc', text: 'توضیحات دستی' }
                                    ],
                                    valueExpr: 'value',
                                    displayExpr: 'text',
                                    layout: 'horizontal',
                                    onInitialized: function(e) {
                                        inputTypeRadioGroup = e.component;
                                    },
                                    onValueChanged: function(e) {
                                        // Only handle user-triggered changes when form is ready
                                        if (signatoriesFormInstance) {
                                            handleInputTypeChange(e.value);
                                        } else {
                                            console.log('Form not ready yet, skipping handleInputTypeChange');
                                        }
                                    }
                                }
                            },
                            {
                                dataField: 'boardMemberIds',
                                label: { text: 'انتخاب اعضا' },
                                editorType: 'dxTagBox',
                                editorOptions: {
                                    rtlEnabled: true,
                                    valueExpr: 'boardMemberId',
                                    displayExpr: function(item) {
                                        if (!item) return '';
                                        return item.fullName + (item.organizationPosition ? ' (' + item.organizationPosition + ')' : '');
                                    },
                                    dataSource: {
                                        load: function() {
                                            return $.ajax({
                                                url: 'Controller/cApiCompany.ashx?action=getboardmembers&companyId=' + currentCompanyId,
                                                type: 'GET',
                                                dataType: 'json'
                                            }).then(function(response) {
                                                if (response.success) {
                                                    return response.data || [];
                                                }
                                                return [];
                                            });
                                        }
                                    },
                                    searchEnabled: true,
                                    showSelectionControls: true,
                                    applyValueMode: 'useButtons',
                                    value: [],  // Default to empty array
                                    onInitialized: function(e) {
                                        boardMemberTagBox = e.component;
                                    }
                                },
                                // Convert between string (database) and array (TagBox)
                                calculateCellValue: function(rowData) {
                                    if (rowData.boardMemberIds && typeof rowData.boardMemberIds === 'string') {
                                        return rowData.boardMemberIds.split(',').map(function(id) {
                                            return parseInt(id.trim());
                                        }).filter(function(id) {
                                            return !isNaN(id);
                                        });
                                    }
                                    return [];
                                },
                                setCellValue: function(rowData, value) {
                                    // Convert array back to comma-separated string
                                    if (Array.isArray(value) && value.length > 0) {
                                        rowData.boardMemberIds = value.join(',');
                                    } else {
                                        rowData.boardMemberIds = null;
                                    }
                                }
                            },
                            {
                                dataField: 'signatureType',
                                label: { text: 'نوع حق امضا' },
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    rtlEnabled: true,
                                    valueExpr: 'value',
                                    displayExpr: 'text',
                                    items: [
                                        { value: 1, text: 'منفردا' },
                                        { value: 2, text: 'متفقا' }
                                    ],
                                    disabled: true,
                                    onInitialized: function(e) {
                                        signatureTypeSelectBox = e.component;
                                    }
                                }
                            },
                            {
                                dataField: 'WithOfficialStamp',
                                label: { text: 'همراه با مهر شرکت معتبر است' },
                                editorType: 'dxCheckBox',
                                editorOptions: {
                                    rtlEnabled: true,
                                    value: true,  // Default checked
                                    onInitialized: function(e) {
                                        withOfficialStampCheckBox = e.component;
                                    }
                                }
                            },
                            {
                                dataField: 'customDesc',
                                label: { text: 'توضیحات دستی' },
                                editorType: 'dxTextArea',
                                visible: false,  // Initially hidden
                                editorOptions: {
                                    rtlEnabled: true,
                                    height: 100,
                                    onInitialized: function(e) {
                                        customDescTextArea = e.component;
                                    }
                                }
                            }
                        ]
                    }
                },
                columns: [
                    {
                        dataField: '_changeDetector',
                        visible: false,
                        allowEditing: false
                    },
                    {
                        caption: 'اعضای هیئت مدیره',
                        calculateCellValue: function(rowData) {
                            if (rowData.customDesc) {
                                return '-';
                            }
                            if (!rowData.boardMemberIds) {
                                return '-';
                            }
                            // This will be populated by cellTemplate
                            return rowData.boardMemberIds;
                        },
                        cellTemplate: function(container, options) {
                            if (options.data.customDesc || !options.data.boardMemberIds) {
                                $('<span>').text('-').appendTo(container);
                                return;
                            }

                            // Load board members and display names
                            $.ajax({
                                url: 'Controller/cApiCompany.ashx?action=getboardmembers&companyId=' + currentCompanyId,
                                type: 'GET',
                                dataType: 'json',
                                success: function(response) {
                                    if (response.success) {
                                        const members = response.data || [];
                                        const ids = typeof options.data.boardMemberIds === 'string'
                                            ? options.data.boardMemberIds.split(',').map(function(id) { return parseInt(id.trim()); })
                                            : (Array.isArray(options.data.boardMemberIds) ? options.data.boardMemberIds : []);

                                        const names = ids.map(function(id) {
                                            const member = members.find(function(m) { return m.boardMemberId === id; });
                                            if (member) {
                                                return member.fullName + (member.organizationPosition ? ' (' + member.organizationPosition + ')' : '');
                                            }
                                            return id;
                                        }).join('، ');

                                        $(container).text(names || '-');
                                    } else {
                                        $(container).text(options.data.boardMemberIds);
                                    }
                                },
                                error: function() {
                                    $(container).text(options.data.boardMemberIds);
                                }
                            });
                        }
                    },
                    {dataField: 'boardMemberIds', visible: false},
                    {dataField: 'WithOfficialStamp', visible: false},
                    {
                        dataField: 'signatureTypeDesc',
                        caption: 'نوع حق امضا',
                    },
                    {
                        dataField: 'customDesc',
                        caption: 'توضیحات',
                    },
                    {
                        type: 'buttons',
                        buttons: ['edit', 'delete']
                    }
                ],
                onInitNewRow: function(e) {
                    // Set default values
                    e.data.inputType = 'boardMembers';
                    e.data.boardMemberIds = [];  // Initialize as empty array for TagBox
                    e.data.WithOfficialStamp = true;  // Default checked
                    e.data.rightType = 1;
                    e.data.rightTypeDesc = 'اوراق بهادار و اسناد تعهدآور';

                    // Set default input type and field states after initialization
                    setTimeout(function() {
                        // First get form instance
                        const popup = e.component.getController('editing')._editPopup;
                        if (popup) {
                            const contentElement = popup.$content();
                            const form = contentElement.find('.dx-form').dxForm('instance');
                            if (form) {
                                signatoriesFormInstance = form;
                            }
                        }

                        // Set radio value without triggering onValueChanged
                        if (inputTypeRadioGroup) {
                            // Temporarily disable the event, set value, then re-enable
                            inputTypeRadioGroup.option('value', 'boardMembers');
                        }

                        // Now safely call handleInputTypeChange after form is ready
                        setTimeout(function() {
                            handleInputTypeChange('boardMembers');
                        }, 100);
                    }, 300);
                },
                onEditingStart: function(e) {
                    // Convert boardMemberIds from string to array BEFORE popup opens
                    if (e.data.boardMemberIds && typeof e.data.boardMemberIds === 'string') {
                        e.data.boardMemberIds = e.data.boardMemberIds.split(',').map(function(id) {
                            return parseInt(id.trim());
                        }).filter(function(id) {
                            return !isNaN(id);
                        });
                    } else if (!e.data.boardMemberIds) {
                        e.data.boardMemberIds = [];
                    }

                    setTimeout(function() {
                        const popup = e.component.getController('editing')._editPopup;
                        if (popup) {
                            const contentElement = popup.$content();
                            const form = contentElement.find('.dx-form').dxForm('instance');
                            if (form) {
                                signatoriesFormInstance = form;
                            }
                        }

                        // Determine input type based on data
                        const inputType = e.data.customDesc ? 'customDesc' : 'boardMembers';

                        if (inputTypeRadioGroup) {
                            inputTypeRadioGroup.option('value', inputType);
                        }

                        // Set board member TagBox value
                        if (boardMemberTagBox && e.data.boardMemberIds && Array.isArray(e.data.boardMemberIds)) {
                            boardMemberTagBox.option('value', e.data.boardMemberIds);
                        }

                        // Set signatureType value
                        if (signatureTypeSelectBox && e.data.signatureType) {
                            signatureTypeSelectBox.option('value', parseInt(e.data.signatureType));
                        }

                        // Set customDesc value
                        if (customDescTextArea && e.data.customDesc) {
                            customDescTextArea.option('value', e.data.customDesc);
                        }

                        // Apply field visibility after a short delay
                        setTimeout(function() {
                            handleInputTypeChange(inputType);

                            // Re-set WithOfficialStamp value AFTER visibility change
                            if (withOfficialStampCheckBox) {
                                const stampValue = e.data.WithOfficialStamp !== undefined ? e.data.WithOfficialStamp : true;
                                withOfficialStampCheckBox.option('value', stampValue);
                            }
                        }, 150);
                    }, 300);
                },
                onRowInserting: function(e) {
                    e.cancel = true;
                    const gridInstance = e.component;

                    // Get input type
                    const inputType = inputTypeRadioGroup ? inputTypeRadioGroup.option('value') : 'boardMembers';

                    const newData = {
                        companyId: currentCompanyId,
                        rightType: 1,
                        rightTypeDesc: 'اوراق بهادار و اسناد تعهدآور'
                    };

                    if (inputType === 'customDesc') {
                        // Custom description mode
                        const customDesc = customDescTextArea ? customDescTextArea.option('value') : '';
                        if (!customDesc || customDesc.trim() === '') {
                            DevExpress.ui.notify('توضیحات دستی الزامی است', 'error', 3000);
                            return;
                        }
                        newData.customDesc = customDesc.trim();
                        newData.boardMemberIds = null;
                        newData.signatureType = null;
                        newData.signatureTypeDesc = null;
                        newData.WithOfficialStamp = null;
                    } else {
                        // Board members mode
                        const selectedIds = boardMemberTagBox ? boardMemberTagBox.option('value') : [];
                        if (!selectedIds || selectedIds.length === 0) {
                            DevExpress.ui.notify('انتخاب حداقل یک عضو هیئت مدیره الزامی است', 'error', 3000);
                            return;
                        }

                        const signatureType = selectedIds.length === 1 ? 1 : 2;
                        const signatureTypeDesc = signatureType === 1 ? 'منفردا' : 'متفقا';

                        newData.boardMemberIds = selectedIds.join(',');
                        newData.signatureType = signatureType;
                        newData.signatureTypeDesc = signatureTypeDesc;
                        newData.customDesc = null;

                        // Get WithOfficialStamp value from form
                        const withOfficialStamp = e.data.WithOfficialStamp !== undefined ? e.data.WithOfficialStamp : true;
                        newData.WithOfficialStamp = withOfficialStamp;
                    }

                    saveSignatory(newData).then(function() {
                        loadSignatories();
                        loadBoardMembers();  // Refresh board members grid to update signature rights column
                        gridInstance.cancelEditData();
                    });
                },
                onRowUpdating: function(e) {
                    e.cancel = true;
                    const gridInstance = e.component;

                    // Get input type
                    const inputType = inputTypeRadioGroup ? inputTypeRadioGroup.option('value') : 'boardMembers';
                    const updatedData = {
                        signatoryId: e.oldData.signatoryId,
                        companyId: e.oldData.companyId,
                        rightType: 1,
                        rightTypeDesc: 'اوراق بهادار و اسناد تعهدآور'
                    };

                    if (inputType === 'customDesc') {
                        // Custom description mode
                        const customDesc = customDescTextArea ? customDescTextArea.option('value') : '';
                        if (!customDesc || customDesc.trim() === '') {
                            DevExpress.ui.notify('توضیحات دستی الزامی است', 'error', 3000);
                            return;
                        }
                        updatedData.customDesc = customDesc.trim();
                        updatedData.boardMemberIds = null;
                        updatedData.signatureType = null;
                        updatedData.signatureTypeDesc = null;
                        updatedData.WithOfficialStamp = null;
                    } else {
                        // Board members mode
                        const selectedIds = boardMemberTagBox ? boardMemberTagBox.option('value') : [];
                        if (!selectedIds || selectedIds.length === 0) {
                            DevExpress.ui.notify('انتخاب حداقل یک عضو هیئت مدیره الزامی است', 'error', 3000);
                            return;
                        }

                        const signatureType = selectedIds.length === 1 ? 1 : 2;
                        const signatureTypeDesc = signatureType === 1 ? 'منفردا' : 'متفقا';

                        updatedData.boardMemberIds = selectedIds.join(',');
                        updatedData.signatureType = signatureType;
                        updatedData.signatureTypeDesc = signatureTypeDesc;
                        updatedData.customDesc = null;

                        // Get WithOfficialStamp value from newData (changed fields) or oldData (unchanged fields)
                        const withOfficialStamp = e.newData.WithOfficialStamp !== undefined ? e.newData.WithOfficialStamp :
                                                 (e.oldData.WithOfficialStamp !== undefined ? e.oldData.WithOfficialStamp : true);
                        updatedData.WithOfficialStamp = withOfficialStamp;
                    }


                    saveSignatory(updatedData).then(function() {
                        loadSignatories();
                        loadBoardMembers();  // Refresh board members grid to update signature rights column
                        gridInstance.cancelEditData();
                    });
                },
                
                onRowRemoving: function(e) {
                    e.cancel = true;
                    deleteSignatory(e.data.signatoryId);
                },

            });

            // Load data for all grids
            loadBoardMembers();
            loadFounders();
            loadShareholders();
            loadInspectors();
            loadSignatories();
        }

        function loadCompanyData(companyId) {
            loader("show");

            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=getcompanydetail&companyId=' + companyId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success && response.data) {
                        populateStep1Data(response.data);
                    } else {
                        DevExpress.ui.notify('خطا در بارگیری اطلاعات: ' + response.error, 'error', 3000);
                    }
                    loader("hide");
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
                }
            });
        }

        function loadCompanyDataForStep1() {
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=getcompanydetail&companyId=' + currentCompanyId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success && response.data) {
                        populateStep1Data(response.data);
                    }
                }
            });
        }

        function populateStep1Data(data) {
            $("#companyName").dxTextBox("instance").option("value", data.companyName || "");
            $("#companyNameEn").dxTextBox("instance").option("value", data.companyNameEn || "");
            $("#abbCompanyName_EN").dxTextBox("instance").option("value", data.abbCompanyName_EN || "");

            $("#companyTypeManual").dxTextBox("instance").option("value", data.companyTypeManual || "");
            $("#registrationNumber").dxTextBox("instance").option("value", data.registrationNumber || "");
            $("#establishmentDate").dxTextBox("instance").option("value", data.establishmentDate || "");
            $("#economicNo").dxTextBox("instance").option("value", data.economicNo || "");
            $("#nationalNo").dxTextBox("instance").option("value", data.nationalNo || "");
            $("#workshopNo").dxTextBox("instance").option("value", data.workshopNo || "");
            $("#taxCaseNumber").dxTextBox("instance").option("value", data.taxCaseNumber || "");
            $("#businessActivity").dxTextArea("instance").option("value", data.businessActivity || "");
            $("#sharesCount").dxNumberBox("instance").option("value", data.sharesCount || 0);
            $("#address").dxTextArea("instance").option("value", data.address || "");
            $("#postalCode").dxTextBox("instance").option("value", data.postalCode || "");

            // For selectboxes, set value with timeout to ensure dataSource is loaded
            setTimeout(function() {
                const companyTypeSelectBox = $("#companyTypeNo").dxSelectBox("instance");
                if (companyTypeSelectBox && data.companyTypeNo) {
                    companyTypeSelectBox.option("value", parseInt(data.companyTypeNo));
                }

                const companyStatusSelectBox = $("#companyStatus").dxSelectBox("instance");
                if (companyStatusSelectBox && data.companyStatus) {
                    companyStatusSelectBox.option("value", parseInt(data.companyStatus));
                }

                if (data.companyTypeNo == 0) {
                    $("#companyTypeManualRow").show();
                }
            }, 100);
        }

        function nextStep() {
            if (currentStep < 3) {
                saveCurrentStep().then(function() {
                    currentStep++;
                    renderStep(currentStep);
                });
            }
        }

        function previousStep() {
            if (currentStep > 1) {
                currentStep--;
                renderStep(currentStep);
            }
        }

        function saveCurrentStep() {
            return new Promise(function(resolve, reject) {
                if (currentStep === 1) {
                    saveStep1Data().then(resolve).catch(reject);
                } else {
                    resolve();
                }
            });
        }

        function saveStep1Data() {
            return new Promise(function(resolve, reject) {
                // Get establishment date and remove slashes
                const establishmentDateValue = $("#establishmentDate").dxTextBox("instance").option("value");
                const establishmentDateClean = establishmentDateValue ? establishmentDateValue.replace(/\//g, '') : '';
                $("#companyShareCount").val("");
                const data = {
                    companyId: currentCompanyId,
                    companyName: $("#companyName").dxTextBox("instance").option("value"),
                    companyNameEn: $("#companyNameEn").dxTextBox("instance").option("value"),
                    abbCompanyName_EN: $("#abbCompanyName_EN").dxTextBox("instance").option("value"),
                    companyTypeNo: $("#companyTypeNo").dxSelectBox("instance").option("value"),
                    companyTypeManual: $("#companyTypeManual").dxTextBox("instance").option("value"),
                    registrationNumber: $("#registrationNumber").dxTextBox("instance").option("value"),
                    establishmentDate: establishmentDateClean,
                    economicNo: $("#economicNo").dxTextBox("instance").option("value"),
                    nationalNo: $("#nationalNo").dxTextBox("instance").option("value"),
                    workshopNo: $("#workshopNo").dxTextBox("instance").option("value"),
                    taxCaseNumber: $("#taxCaseNumber").dxTextBox("instance").option("value"),
                    companyStatus: $("#companyStatus").dxSelectBox("instance").option("value"),
                    businessActivity: $("#businessActivity").dxTextArea("instance").option("value"),
                    sharesCount: $("#sharesCount").dxNumberBox("instance").option("value") || 0,
                    address: $("#address").dxTextArea("instance").option("value"),
                    postalCode: $("#postalCode").dxTextBox("instance").option("value")
                };

                // Validate required fields
                if (!data.companyName || !data.companyName.trim()) {
                    DevExpress.ui.notify('نام شرکت الزامی است', 'warning', 3000);
                    reject();
                    return;
                }

                if (!data.companyTypeNo) {
                    DevExpress.ui.notify('نوع شرکت الزامی است', 'warning', 3000);
                    reject();
                    return;
                }

                if (data.companyTypeNo === '0' && (!data.companyTypeManual || !data.companyTypeManual.trim())) {
                    DevExpress.ui.notify('نوع شرکت (دستی) الزامی است', 'warning', 3000);
                    reject();
                    return;
                }

                loader("show");
                $("#companyShareCount").val(data.sharesCount);
                $.ajax({
                    url: 'Controller/cApiCompany.ashx?action=savecompanystep1',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            currentCompanyId = response.companyId;
                            //DevExpress.ui.notify(response.message, 'success', 2000);
                            resolve();
                        } else {
                            DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                            reject();
                        }
                        loader("hide");
                    },
                    error: function(xhr, status, error) {
                        loader("hide");
                        DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
                        reject();
                    }
                });
            });
        }

        function loadAllAttachments() {
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=getattachments&companyId=' + currentCompanyId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success && response.data) {
                        // Group attachments by baseId and update each grid
                        attachmentTypesData.forEach(function(attType) {
                            const attachments = response.data.filter(a => a.baseId === attType.baseId);
                            const gridInstance = $(`#attGrid_${attType.baseId}`).dxDataGrid("instance");
                            if (gridInstance) {
                                gridInstance.option("dataSource", attachments);
                                // Cancel any pending edit operations to remove temporary row
                                gridInstance.cancelEditData();
                            }
                        });
                    }
                }
            });
        }

        function saveAttachmentImmediate(data, baseId) {
            if (!currentCompanyId) {
                DevExpress.ui.notify('ابتدا اطلاعات شرکت را ذخیره کنید', 'warning', 3000);
                $(`#attGrid_${baseId}`).dxDataGrid("instance").cancelEditData();
                return;
            }

            if (!data.file || data.file.length === 0) {
                DevExpress.ui.notify('لطفا فایل را انتخاب کنید', 'warning', 3000);
                $(`#attGrid_${baseId}`).dxDataGrid("instance").cancelEditData();
                return;
            }

            loader("show");

            const formData = new FormData();
            formData.append('file', data.file[0]);
            formData.append('companyId', data.companyId || currentCompanyId);
            formData.append('baseId', data.baseId);

            // Keep slashes in date (save as 1369/02/11)
            formData.append('attachmentDate', data.attachmentDate || '');
            formData.append('attachmentTitle', data.attachmentTitle || '');

            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=uploadattachment',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        DevExpress.ui.notify('فایل با موفقیت ذخیره شد', 'success', 2000);
                        loadAllAttachments();
                        // Ensure edit mode is cancelled after data is loaded
                        setTimeout(function() {
                            const gridInstance = $(`#attGrid_${baseId}`).dxDataGrid("instance");
                            if (gridInstance) {
                                gridInstance.cancelEditData();
                            }
                        }, 100);
                    } else {
                        DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                        $(`#attGrid_${baseId}`).dxDataGrid("instance").cancelEditData();
                    }
                    loader("hide");
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا در آپلود فایل: ' + error, 'error', 3000);
                    $(`#attGrid_${baseId}`).dxDataGrid("instance").cancelEditData();
                }
            });
        }

        function updateAttachmentDate(data, baseId) {
            loader("show");

            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=updateattachmentdate',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        DevExpress.ui.notify('تاریخ با موفقیت بروزرسانی شد', 'success', 2000);
                        loadAllAttachments();
                        // Ensure edit mode is cancelled after data is loaded
                        setTimeout(function() {
                            const gridInstance = $(`#attGrid_${baseId}`).dxDataGrid("instance");
                            if (gridInstance) {
                                gridInstance.cancelEditData();
                            }
                        }, 100);
                    } else {
                        DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                        const gridInstance = $(`#attGrid_${baseId}`).dxDataGrid("instance");
                        if (gridInstance) {
                            gridInstance.cancelEditData();
                        }
                    }
                    loader("hide");
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا در بروزرسانی: ' + error, 'error', 3000);
                    const gridInstance = $(`#attGrid_${baseId}`).dxDataGrid("instance");
                    if (gridInstance) {
                        gridInstance.cancelEditData();
                    }
                }
            });
        }

        function deleteAttachment(attachmentId) {
            loader("show");

            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=deleteattachment&attachmentId=' + attachmentId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        DevExpress.ui.notify('پیوست با موفقیت حذف شد', 'success', 2000);
                        loadAllAttachments();
                    } else {
                        DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                    }
                    loader("hide");
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا در حذف پیوست: ' + error, 'error', 3000);
                }
            });
        }

        function showImagePreview(imageUrl) {
            const popup = $('<div>').dxPopup({
                width: 'auto',
                height: 'auto',
                maxWidth: '90%',
                maxHeight: '90%',
                showTitle: true,
                title: 'پیش‌نمایش تصویر',
                contentTemplate: function() {
                    return $('<img>').attr('src', imageUrl).css({
                        maxWidth: '100%',
                        maxHeight: '80vh',
                        display: 'block'
                    });
                },
                rtlEnabled: true,
                showCloseButton: true
            }).dxPopup('instance');

            popup.show();
        }

        function saveAndClose() {
            // Tier 3 Validation: When closing Step 3, sum of members' shares must equal company total
            if (currentStep === 3) {
                validateTotalShares().then(function() {
                    saveCurrentStep().then(function() {
                        companyFormPopup.hide();
                        loadCompanies();
                    });
                }).catch(function(error) {
                    // Validation failed, error already shown to user
                });
            } else {
                saveCurrentStep().then(function() {
                    companyFormPopup.hide();
                    loadCompanies();
                });
            }
        }

        function validateTotalShares() {
            return new Promise(function(resolve, reject) {
                loader("show");

                // Get company's total shares
                $.ajax({
                    url: 'Controller/cApiCompany.ashx?action=getcompanydetail&companyId=' + currentCompanyId,
                    type: 'GET',
                    dataType: 'json',
                    success: function(companyResponse) {
                        if (!companyResponse.success || !companyResponse.data) {
                            loader("hide");
                            DevExpress.ui.notify('خطا در دریافت اطلاعات شرکت', 'error', 3000);
                            reject();
                            return;
                        }

                        const companySharesCount = companyResponse.data.sharesCount || 0;

                        // Get sum of all board members' shares
                        $.ajax({
                            url: 'Controller/cApiCompany.ashx?action=getboardmembers&companyId=' + currentCompanyId,
                            type: 'GET',
                            dataType: 'json',
                            success: function(membersResponse) {
                                loader("hide");

                                if (!membersResponse.success) {
                                    DevExpress.ui.notify('خطا در دریافت اطلاعات اعضای هیئت مدیره', 'error', 3000);
                                    reject();
                                    return;
                                }

                                const members = membersResponse.data || [];
                                let totalMembersShares = 0;

                                members.forEach(function(member) {
                                    totalMembersShares += parseFloat(member.sharesCount || 0);
                                });

                                // Check if sum equals company total (with small tolerance for floating point)
                                if (Math.abs(totalMembersShares - companySharesCount) > 0.01) {
                                    DevExpress.ui.notify(
                                        'مجموع سهام اعضای هیئت مدیره ( ' + totalMembersShares + ' ) باید برابر کل سهام شرکت ( ' + parseFloat(companySharesCount||0) + ' ) باشد',
                                        'error',
                                        5000
                                    );
                                    reject();
                                    return;
                                }

                                resolve();
                            },
                            error: function() {
                                loader("hide");
                                DevExpress.ui.notify('خطا در دریافت اطلاعات اعضای هیئت مدیره', 'error', 3000);
                                reject();
                            }
                        });
                    },
                    error: function() {
                        loader("hide");
                        DevExpress.ui.notify('خطا در دریافت اطلاعات شرکت', 'error', 3000);
                        reject();
                    }
                });
            });
        }

        function updateStepIndicators() {
            $(".step-item").removeClass("active completed");

            $(".step-item").each(function() {
                const stepNum = parseInt($(this).data("step"));
                if (stepNum < currentStep) {
                    $(this).addClass("completed");
                } else if (stepNum === currentStep) {
                    $(this).addClass("active");
                }
            });
        }

        function updateNavigationButtons() {
            const buttonsContainer = $('#wizardButtons');
            let buttonsHTML = '';

            if (currentStep === 1) {
                // Step 1: Only Next button
                buttonsHTML = '<div style="margin-right: auto;"><button class="btn-next" onclick="nextStep()">مرحله بعد ←</button></div>';
            } else if (currentStep === 2) {
                // Step 2: Previous and Next
                buttonsHTML = `
                    <button class="btn-prev" onclick="previousStep()">→ مرحله قبل</button>
                    <button class="btn-next" onclick="nextStep()">مرحله بعد ←</button>
                `;
            } else if (currentStep === 3) {
                // Step 3: Previous and Save
                buttonsHTML = `
                    <button class="btn-prev" onclick="previousStep()">→ مرحله قبل</button>
                    <button class="btn-save" onclick="saveAndClose()">ذخیره و بستن</button>
                `;
            }

            buttonsContainer.html(buttonsHTML);
        }

        function toggleSection(element) {
            const content = $(element).next('.form-section-content');
            $(element).toggleClass('collapsed');
            content.toggleClass('collapsed');
        }

        function loadCompanies() {
            loader("show");

            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=getcompanies',
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success && response.data) {
                        companiesData = response.data;
                        companiesGrid.option("dataSource", companiesData);
                        companiesGrid.refresh();
                    } else {
                        DevExpress.ui.notify('خطا در بارگیری اطلاعات: ' + response.error, 'error', 3000);
                    }
                    loader("hide");
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
                }
            });
        }

        // Board Members Functions
        function loadBoardMembers() {
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=getboardmembers&companyId=' + currentCompanyId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        // Convert values to integers for radio buttons (handle boolean, string, or number)
                        const convertedData = response.data.map(function(item) {
                            return $.extend({}, item, {
                                isLegalPerson: Number(item.isLegalPerson),
                                isExecutive: Number(item.isExecutive),
                                
                            });
                        });

                        $("#boardMembersGrid").dxDataGrid("instance").option("dataSource", convertedData);
                    }
                }
            });
        }

        function uploadBoardMemberFile(file, fileType) {
            return new Promise(function(resolve, reject) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('companyId', currentCompanyId);
                formData.append('fileType', fileType);

                $.ajax({
                    url: 'Controller/cApiCompany.ashx?action=uploadboardmemberfile',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            resolve({ type: fileType, filePath: response.filePath });
                        } else {
                            reject(response.error);
                        }
                    },
                    error: function(xhr, status, error) {
                        reject(error);
                    }
                });
            });
        }

        function uploadCustomAttachmentFile(file, attachmentTitle, index) {
            return new Promise(function(resolve, reject) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('companyId', currentCompanyId);
                formData.append('fileType', 'custom');
                formData.append('attachmentTitle', attachmentTitle);
                loader("show");
                $.ajax({
                    url: 'Controller/cApiCompany.ashx?action=uploadboardmemberfile',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    success: function(response) {
                        loader("hide");
                        if (response.success) {
                            resolve({ type: 'customAttachment', filePath: response.filePath, index: index });
                        } else {
                            reject(response.error);
                        }
                    },
                    error: function(xhr, status, error) {
                        loader("hide");
                        reject(error);
                    }
                });
            });
        }

        function saveBoardMember(data) {
            return new Promise(function(resolve, reject) {
                loader("show");
                $.ajax({
                    url: 'Controller/cApiCompany.ashx?action=saveboardmember',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            DevExpress.ui.notify(response.message, 'success', 2000);
                            resolve();
                        } else {
                            DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                            reject();
                        }
                        loader("hide");
                    },
                    error: function(xhr, status, error) {
                        loader("hide");
                        DevExpress.ui.notify('خطا: ' + error, 'error', 3000);
                        reject();
                    }
                });
            });
        }

        function deleteBoardMember(boardMemberId) {
            loader("show");
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=deleteboardmember&boardMemberId=' + boardMemberId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        DevExpress.ui.notify(response.message, 'success', 2000);
                        loadBoardMembers();
                        loadShareholders();
                    } else {
                        DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                    }
                    loader("hide");
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا: ' + error, 'error', 3000);
                }
            });
        }

        // Custom Attachments Functions
        function triggerBoardMemberFormChange() {
            return
            if (boardMembersGridInstance) {
                try {
                    // Get the currently editing row
                    const editRowKey = boardMembersGridInstance.option('editing.editRowKey');

                    if (editRowKey !== undefined && editRowKey !== null) {
                        // We're in edit mode
                        // Use cellValue to update the hidden field
                        boardMembersGridInstance.cellValue(
                            boardMembersGridInstance.getRowIndexByKey(editRowKey),
                            '_customAttachmentsChanged',
                            new Date().getTime()
                        );
                    } else {
                        // We're adding a new row - try with form instance
                        if (boardMembersFormInstance) {
                            const formData = boardMembersFormInstance.option('formData');
                            if (formData) {
                                formData._customAttachmentsChanged = new Date().getTime();
                            }
                        }
                    }
                } catch (e) {
                    console.log('Could not trigger form change:', e);
                }
            }
        }

        function addCustomAttachment(parentContainer) {
            
            const listContainer = parentContainer.find('#customAttachmentsContainer');
            const attachmentId = customAttachmentCounter++;
            const row = $('<div>')
                .attr('data-attachment-id', attachmentId)
                .css({
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '10px',
                    alignItems: 'center',
                    padding: '10px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9'
                });

            // Title input
            const titleInput = $('<input>')
                .attr('type', 'text')
                .attr('placeholder', 'عنوان پیوست (الزامی)')
                .css({
                    flex: '1',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    direction: 'rtl'
                })
                .on('change', function() {
                    updateCustomAttachment(attachmentId, 'title', $(this).val());
                });

            // File input
            const fileInput = $('<input>')
                .attr('type', 'file')
                .css({
                    flex: '1',
                    padding: '5px'
                })
                .on('change', function() {
                    const file = this.files[0];
                    if (file) {
                        updateCustomAttachment(attachmentId, 'file', file);
                    }
                });

            // Delete button
            const deleteBtn = $('<button>')
                .attr('type', 'button')
                .addClass('dx-button dx-button-danger')
                .html('<i class="dx-icon-trash"></i>')
                .css({
                    padding: '8px 12px',
                    cursor: 'pointer'
                })
                .on('click', function() {
                    removeCustomAttachment(attachmentId);
                    row.remove();
                });

            row.append(titleInput, fileInput, deleteBtn);
            listContainer.append(row);

            // Initialize empty attachment
            customAttachments.push({
                id: attachmentId,
                attachmentTitle: '',
                file: null,
                attachmentId: null // For edit mode
            });

            // Trigger form change
            triggerBoardMemberFormChange();
        }

        function updateCustomAttachment(id, field, value) {
            const attachment = customAttachments.find(a => a.id === id);
            if (attachment) {
                if (field === 'title') {
                    attachment.attachmentTitle = value;
                } else if (field === 'file') {
                    attachment.file = value;
                }
                // Trigger form change
                triggerBoardMemberFormChange();
            }
        }

        function removeCustomAttachment(id) {
            const index = customAttachments.findIndex(a => a.id === id);
            if (index !== -1) {
                const attachment = customAttachments[index];
                // If this is an existing attachment (has companyAttachmentId), track it for deletion
                if (attachment.attachmentId) {
                    deletedCustomAttachmentIds.push(attachment.attachmentId);
                }
                customAttachments.splice(index, 1);
                // Trigger form change
                triggerBoardMemberFormChange();
            }
        }

        function clearCustomAttachments() {
            customAttachments = [];
            customAttachmentCounter = 0;
            deletedCustomAttachmentIds = [];
            $('#customAttachmentsContainer').empty();
        }

        function loadExistingCustomAttachments(attachments) {
            clearCustomAttachments();
            if (attachments && attachments.length > 0) {
                attachments.forEach(function(att) {
                    const listContainer = $('#customAttachmentsContainer');
                    const attachmentId = customAttachmentCounter++;

                    const row = $('<div>')
                        .attr('data-attachment-id', attachmentId)
                        .css({
                            display: 'flex',
                            gap: '10px',
                            marginBottom: '10px',
                            alignItems: 'center',
                            padding: '10px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            backgroundColor: '#f9f9f9'
                        });

                    // Title display
                    const titleSpan = $('<span>')
                        .text(att.attachmentTitle)
                        .css({
                            flex: '1',
                            padding: '8px',
                            fontWeight: 'bold'
                        });

                    // File link
                    const fileLink = $('<a>')
                        .attr('href', att.attachmentAddress)
                        .attr('target', '_blank')
                        .text('مشاهده فایل')
                        .css({
                            flex: '1',
                            padding: '8px',
                            color: '#007bff'
                        });

                    // Delete button
                    const deleteBtn = $('<button>')
                        .attr('type', 'button')
                        .addClass('dx-button dx-button-danger')
                        .html('<i class="dx-icon-trash"></i>')
                        .css({
                            padding: '8px 12px',
                            cursor: 'pointer'
                        })
                        .on('click', function() {
                            removeCustomAttachment(attachmentId);
                            row.remove();
                        });

                    row.append(titleSpan, fileLink, deleteBtn);
                    listContainer.append(row);

                    customAttachments.push({
                        id: attachmentId,
                        attachmentTitle: att.attachmentTitle,
                        file: null,
                        attachmentId: att.companyAttachmentId,
                        existingFile: att.attachmentAddress
                    });
                });
            }
        }

        // Founders Functions
        function loadFounders() {
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=getfounders&companyId=' + currentCompanyId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        // Convert values to integers for radio buttons (handle boolean, string, or number)
                        const convertedData = response.data.map(function(item) {
                            return $.extend({}, item, {
                                isLegalPerson: Number(item.isLegalPerson)
                            });
                        });
                        $("#foundersGrid").dxDataGrid("instance").option("dataSource", convertedData);
                    }
                }
            });
        }

        function saveFounder(data) {
            return new Promise(function(resolve, reject) {
                loader("show");
                $.ajax({
                    url: 'Controller/cApiCompany.ashx?action=savefounder',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            DevExpress.ui.notify(response.message, 'success', 2000);
                            resolve();
                        } else {
                            DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                            reject();
                        }
                        loader("hide");
                    },
                    error: function(xhr, status, error) {
                        loader("hide");
                        DevExpress.ui.notify('خطا: ' + error, 'error', 3000);
                        reject();
                    }
                });
            });
        }

        function deleteFounder(founderId) {
            loader("show");
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=deletefounder&founderId=' + founderId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        DevExpress.ui.notify(response.message, 'success', 2000);
                        loadFounders();
                    } else {
                        DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                    }
                    loader("hide");
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا: ' + error, 'error', 3000);
                }
            });
        }

        // Shareholders Functions
        function loadShareholders() {
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=getshareholders&companyId=' + currentCompanyId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        // Convert values to integers for radio buttons (handle boolean, string, or number)
                        const convertedData = response.data.map(function(item) {
                            return $.extend({}, item, {
                                isLegalPerson: Number(item.isLegalPerson)
                            });
                        });
                        $("#shareholdersGrid").dxDataGrid("instance").option("dataSource", convertedData);
                    }
                }
            });
        }

        function saveShareholder(data) {
            return new Promise(function(resolve, reject) {
                loader("show");
                $.ajax({
                    url: 'Controller/cApiCompany.ashx?action=saveshareholder',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            DevExpress.ui.notify(response.message, 'success', 2000);
                            resolve();
                        } else {
                            DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                            reject();
                        }
                        loader("hide");
                    },
                    error: function(xhr, status, error) {
                        loader("hide");
                        DevExpress.ui.notify('خطا: ' + error, 'error', 3000);
                        reject();
                    }
                });
            });
        }

        function deleteShareholder(shareholderId) {
            loader("show");
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=deleteshareholder&shareholderId=' + shareholderId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        DevExpress.ui.notify(response.message, 'success', 2000);
                        loadShareholders();
                    } else {
                        DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                    }
                    loader("hide");
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا: ' + error, 'error', 3000);
                }
            });
        }

        // Inspectors Functions
        function loadInspectors() {
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=getinspectors&companyId=' + currentCompanyId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        // Convert values to integers for selectboxes
                        const convertedData = response.data.map(function(item) {
                            return $.extend({}, item, {
                                isLegalPerson: Number(item.isLegalPerson),
                                isMainInspector: Number(item.isMainInspector)
                            });
                        });
                        $("#inspectorsGrid").dxDataGrid("instance").option("dataSource", convertedData);
                    }
                }
            });
        }

        function saveInspector(data) {
            return new Promise(function(resolve, reject) {
                loader("show");
                $.ajax({
                    url: 'Controller/cApiCompany.ashx?action=saveinspector',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            DevExpress.ui.notify(response.message, 'success', 2000);
                            resolve();
                        } else {
                            DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                            reject();
                        }
                        loader("hide");
                    },
                    error: function(xhr, status, error) {
                        loader("hide");
                        DevExpress.ui.notify('خطا: ' + error, 'error', 3000);
                        reject();
                    }
                });
            });
        }

        function deleteInspector(inspectorId) {
            loader("show");
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=deleteinspector&inspectorId=' + inspectorId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        DevExpress.ui.notify(response.message, 'success', 2000);
                        loadInspectors();
                    } else {
                        DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                    }
                    loader("hide");
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا: ' + error, 'error', 3000);
                }
            });
        }

        // Signatories Functions
        function loadSignatories() {
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=getsignatories&companyId=' + currentCompanyId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        $("#signatoriesGrid").dxDataGrid("instance").option("dataSource", response.data);
                    }
                }
            });
        }

        function saveSignatory(data) {
            return new Promise(function(resolve, reject) {
                loader("show");
                $.ajax({
                    url: 'Controller/cApiCompany.ashx?action=savesignatory',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            DevExpress.ui.notify(response.message, 'success', 2000);
                            resolve();
                        } else {
                            DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                            reject();
                        }
                        loader("hide");
                    },
                    error: function(xhr, status, error) {
                        loader("hide");
                        DevExpress.ui.notify('خطا: ' + error, 'error', 3000);
                        reject();
                    }
                });
            });
        }

        function deleteSignatory(signatoryId) {
            loader("show");
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=deletesignatory&signatoryId=' + signatoryId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        DevExpress.ui.notify(response.message, 'success', 2000);
                        loadSignatories();
                        loadBoardMembers();  // Refresh board members grid to update signature rights column
                    } else {
                        DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                    }
                    loader("hide");
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا: ' + error, 'error', 3000);
                }
            });
        }

        function handleInputTypeChange(inputType) {

            if (!signatoriesFormInstance) {
                console.log('signatoriesFormInstance not available yet - returning');
                return;
            }


            try {
                if (inputType === 'customDesc') {
                    // Custom description mode - hide board members and signature type, show customDesc
                    signatoriesFormInstance.itemOption('boardMemberIds', 'visible', false);
                    signatoriesFormInstance.itemOption('signatureType', 'visible', false);
                    signatoriesFormInstance.itemOption('WithOfficialStamp', 'visible', false);
                    signatoriesFormInstance.itemOption('customDesc', 'visible', true);
                } else {
                    // Board members mode - show board members and signature type, hide customDesc
                    signatoriesFormInstance.itemOption('boardMemberIds', 'visible', true);
                    signatoriesFormInstance.itemOption('signatureType', 'visible', true);
                    signatoriesFormInstance.itemOption('WithOfficialStamp', 'visible', true);
                    signatoriesFormInstance.itemOption('customDesc', 'visible', false);
                }
            } catch (error) {
                console.error('Error in handleInputTypeChange:', error);
            }
        }

        // Attachment Settings Functions
        function initializeAttachmentSettings() {
            $('#btnAttachmentSettings').on('click', function() {
                openAttachmentSettingsPopup();
            });
        }

        function openAttachmentSettingsPopup() {
            const popup = $("#attachmentSettingsPopup").dxPopup({
                width: 800,
                height: "auto",
                showTitle: true,
                title: 'پیوست‌ها',
                contentTemplate: function() {
                    return $('<div>').attr('id', 'attachmentTypesGrid');
                },
                onShown: function() {
                    initializeAttachmentTypesGrid();
                    loadAttachmentTypes();
                },
                toolbarItems: [{
                    widget: 'dxButton',
                    location: 'after',
                    toolbar: 'bottom',
                    options: {
                        text: 'بستن',
                        onClick: function() {
                            popup.hide();
                            // Reload attachment types for the main form
                            loadBaseLookups();
                        }
                    }
                }]
            }).dxPopup("instance");

            popup.show();
        }

        function initializeAttachmentTypesGrid() {
            $("#attachmentTypesGrid").dxDataGrid({
                dataSource: [],
                rtlEnabled: true,
                showBorders: true,
                showRowLines: true,
                showColumnLines: true,
                rowAlternationEnabled: true,
                hoverStateEnabled: true,
                columnAutoWidth: true,
                wordWrapEnabled: true,
                height: "auto",
                keyExpr: 'baseId',
                editing: {
                    mode: 'row',
                    allowAdding: true,
                    allowUpdating: true,
                    allowDeleting: true,
                    useIcons: true
                },
                columns: [
                    {
                        dataField: 'baseId',
                        caption: 'شناسه',
                        width: 80,
                        alignment: 'center',
                        allowEditing: false,
                        visible: false
                    },
                    {
                        dataField: 'value',
                        caption: 'مقدار',
                        width: 100,
                        alignment: 'center',
                        allowEditing: false,
                        visible: false
                    },
                    {
                        dataField: 'urgeClass',
                        caption: 'اولویت نمایش',
                        width: 90,
                    },
                    {
                        dataField: 'nameBase',
                        caption: 'نوع پیوست',
                        validationRules: [
                            { type: 'required', message: 'نوع پیوست الزامی است' }
                        ]
                    },
                    {
                        dataField: 'isActive',
                        caption: 'فعال',
                        width: 80,
                        dataType: 'boolean',
                        alignment: 'center'
                    }
                ],
                onRowInserting: function(e) {
                    e.cancel = true;
                    saveAttachmentType(e.data, true).then(function() {
                        loadAttachmentTypes();
                    });
                },
                onRowUpdating: function(e) {
                    e.cancel = true;
                    const updatedData = $.extend({}, e.oldData, e.newData);
                    saveAttachmentType(updatedData, false).then(function() {
                        loadAttachmentTypes();
                    });
                },
                onRowRemoving: function(e) {
                    e.cancel = true;
                    deleteAttachmentType(e.data.baseId);
                }
            });
        }

        function loadAttachmentTypes() {
            loader("show");
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=getattachmenttypes',
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success && response.data) {
                        $("#attachmentTypesGrid").dxDataGrid("instance").option("dataSource", response.data);
                        setTimeout(function() {
                            $("#attachmentSettingsPopup").dxPopup("option","position",{my: 'center', at: 'center'});
                        }, 500);
                    } else {
                        DevExpress.ui.notify('خطا در بارگیری انواع پیوست: ' + response.error, 'error', 3000);
                    }
                    loader("hide");
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا در ارتباط با سرور: ' + error, 'error', 3000);
                }
            });
        }

        function saveAttachmentType(data, isNew) {
            return new Promise(function(resolve, reject) {
                loader("show");
                $.ajax({
                    url: 'Controller/cApiCompany.ashx?action=saveattachmenttype',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ data: data, isNew: isNew }),
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            DevExpress.ui.notify(response.message, 'success', 2000);
                            resolve();
                        } else {
                            DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                            reject();
                        }
                        loader("hide");
                    },
                    error: function(xhr, status, error) {
                        loader("hide");
                        DevExpress.ui.notify('خطا: ' + error, 'error', 3000);
                        reject();
                    }
                });
            });
        }

        function deleteAttachmentType(baseId) {
            loader("show");
            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=deleteattachmenttype&baseId=' + baseId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        DevExpress.ui.notify(response.message, 'success', 2000);
                        loadAttachmentTypes();
                    } else {
                        DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                    }
                    loader("hide");
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا: ' + error, 'error', 3000);
                }
            });
        }

        function showCompanyDocuments(companyId, companyName) {
            loader("show");

            $.ajax({
                url: 'Controller/cApiCompany.ashx?action=getcompanydocuments&companyId=' + companyId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    loader("hide");
                    if (response.success) {
                        // Create popup container and append to body
                        const popupContainer = $('<div>').appendTo('body');

                        // Show popup with documents
                        const popup = popupContainer.dxPopup({
                            title: 'مدارک شرکت ' + companyName,
                            width: 900,
                            height: 600,
                            rtlEnabled: true,
                            showCloseButton: true,
                            onHiding: function() {
                                // Remove popup from DOM when closed
                                setTimeout(function() {
                                    popupContainer.remove();
                                }, 500);
                            },
                            contentTemplate: function(contentElement) {
                                const grid = $('<div>').dxDataGrid({
                                    dataSource: response.data,
                                    rtlEnabled: true,
                                    showBorders: true,
                                    columnAutoWidth: true,
                                    columns: [
                                        {
                                            caption: 'دسته‌بندی',
                                            calculateCellValue: function(rowData) {
                                                if (rowData.boardMemberId) {
                                                    // Documents related to board members
                                                    if (rowData.attachmentType === 'shareTrusteeFile') {
                                                        return 'قرارداد امین السهم';
                                                    } else if (rowData.attachmentType === 'cooperationCommitmentFile') {
                                                        return 'قرارداد تعهد همکاری';
                                                    } else if (rowData.attachmentType === 'custom') {
                                                        return 'پیوست اعضای هیئت مدیره';
                                                    }
                                                    return 'مدارک اعضای هیئت مدیره';
                                                } else if (rowData.baseId) {
                                                    return 'پیوست‌ها';
                                                } else {
                                                    return 'سایر';
                                                }
                                            }
                                        },
                                        {
                                            dataField: 'documentName',
                                            caption: 'نام مدرک',
                                            calculateCellValue: function(rowData) {
                                                // If it's a board member document, show the member's name
                                                if (rowData.boardMemberId && rowData.boardMemberName) {
                                                    if (rowData.attachmentType === 'shareTrusteeFile') {
                                                        return 'قرارداد امین السهم - ' + rowData.boardMemberName;
                                                    } else if (rowData.attachmentType === 'cooperationCommitmentFile') {
                                                        return 'قرارداد تعهد همکاری - ' + rowData.boardMemberName;
                                                    } else if (rowData.attachmentType === 'custom') {
                                                        return rowData.attachmentTitle || 'پیوست';
                                                    }
                                                }
                                                // Otherwise show documentName from tbase or attachmentTitle
                                                return rowData.documentName || rowData.attachmentTitle || '-';
                                            }
                                        },
                                        {
                                            dataField: 'attachmentTitle',
                                            caption: 'عنوان',
                                        },
                                        {
                                            dataField: 'attachmentDate',
                                            caption: 'تاریخ',
                                            alignment: 'center',
                                            visible: false
                                        },
                                        {
                                            dataField: 'attachmentAddress',
                                            caption: 'فایل',
                                            cellTemplate: function(container, options) {
                                                if (options.value) {
                                                    const fileName = options.value.split('/').pop();
                                                    const fileExt = fileName.split('.').pop().toLowerCase();
                                                    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExt);
                                                    const isExcel = ['xls', 'xlsx', 'xlsm'].includes(fileExt);
                                                    const isPdf = fileExt === 'pdf';
                                                    const isWord = ['doc', 'docx'].includes(fileExt);

                                                    $(container).css({
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    });

                                                    if (isImage) {
                                                        $('<img>')
                                                            .attr('src', '../' + options.value)
                                                            .css({ width: '27px', height: '27px', marginRight: '8px', marginLeft: '8px', cursor: 'pointer' })
                                                            .on('click', function() {
                                                                window.open('../' + options.value, '_blank');
                                                            })
                                                            .appendTo(container);
                                                    } else {
                                                        let iconSrc = '';
                                                        if (isExcel) {
                                                            iconSrc = '../Legal/img/excel.png';
                                                        } else if (isPdf) {
                                                            iconSrc = '../Legal/img/pdf.png';
                                                        } else if (isWord) {
                                                            iconSrc = '../Legal/img/word.png';
                                                        } else {
                                                            iconSrc = '../Legal/img/file.png';
                                                        }

                                                        $('<img>')
                                                            .attr('src', iconSrc)
                                                            .css({
                                                                width: '27px',
                                                                height: '27px',
                                                                marginRight: '8px',
                                                                marginLeft: '8px',
                                                                cursor: 'pointer',
                                                                objectFit: 'contain'
                                                            })
                                                            .on('click', function() {
                                                                window.open('../' + options.value, '_blank');
                                                            })
                                                            .appendTo(container);
                                                    }

                                                    $('<a>')
                                                        .attr('href', '../' + options.value)
                                                        .attr('target', '_blank')
                                                        .text('دانلود')
                                                        .css({
                                                            textDecoration: 'none',
                                                            color: '#007bff',
                                                            fontWeight: 'bold'
                                                        })
                                                        .appendTo(container);
                                                }
                                            }
                                        }
                                    ]
                                }).appendTo(contentElement);
                            }
                        }).dxPopup('instance');

                        popup.show();
                    } else {
                        DevExpress.ui.notify('خطا: ' + response.error, 'error', 3000);
                    }
                },
                error: function(xhr, status, error) {
                    loader("hide");
                    DevExpress.ui.notify('خطا در بارگذاری مدارک: ' + error, 'error', 3000);
                }
            });
        }
    </script>
</asp:Content>

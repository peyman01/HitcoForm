<%@ Page Title="" Language="C#" MasterPageFile="~/master.Master" AutoEventWireup="true" CodeBehind="serviceAdmin.aspx.cs" Inherits="Web_Services.pages.WebForm1" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div id="toastContainer"></div>
    <div class="parentContainer">
        <!-- Tabs -->

        <div id="messagePopup"></div>
        <div id="versionDetails"></div>
        <div id="header" class="rootHeader">
            <div style="display: flex; width: 100%; justify-content: space-between;">
                <div id="captionContainer" style="padding-top: 3px; align-self: baseline;">
                    <span id="caption"></span>
                    <span id="captionIcon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" class="bi bi-info-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                        </svg>
                    </span>
                </div>
                <div class="mx-2 d-flex gap-2" title="صفحه نخست" onclick="window.location.href='http://dev-srv'">
                    <div id="profileName" class="text-white"></div>
                    <div class="" style="cursor: pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" class="bi bi-house-door" viewBox="0 0 16 16">
                            <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
                        </svg>
                    </div>
                    <div class="d-none" id="profileIcon" style="cursor: pointer" title="خروجی" onclick="logout()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                            <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div class="hedearFilt">
                <div class="action">

                    <div id="cmb">
                        <div id="cmbOp">
                        </div>
                        <div id="cmbCo">
                            <div id="comboCo"></div>
                        </div>
                        <div id="cmbDist">
                            <div id="comboDist"></div>

                        </div>
                        <div id="cmbBrand">
                            <div id="comboBrand"></div>
                        </div>
                        <div id="cmbPrd">
                            <div id="comboPrd">
                            </div>
                        </div>
                        <div id="cmbCust">
                            <div id="comboCust">
                            </div>
                        </div>


                        <div>
                            <div class="box">
                                <div class="px-2 text-secondary d-none">از تاریخ:</div>
                                <input class="form-control cmbFilter" id="cmbDateFrom" onchange="manageUrlParams('refresh')">
                            </div>
                        </div>
                        <div>
                            <div class="box">
                                <div class="px-2 text-secondary d-none">تا تاریخ:</div>
                                <input class="form-control cmbFilter" id="cmbDateTo" onchange="manageUrlParams('refresh')">
                            </div>
                        </div>
                        <div class="filterBtn">
                            <span id="filterBtn" title="حذف همه فیلتر ها" class="cmbFilter m-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" class="bi bi-funnel-fill" viewBox="0 0 16 16">
                                    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="text-white" onclick="initVersionDetails()">
                    12.6
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" class="bi bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Containers -->
        <div class="main-tab tab-container tabCnt" id="tab1">
            <div class="mainContainer">
                <div id="sheet-1-0" class="tab-container content-sheet">
                    <div class="dashBoard-container">
                        <div class="">
                            <div class="dashboardTblTtl bg-primary">
                                <div class="px-3">گزارش فروش موجودی به تفکیک پخش - برند - محصول</div>
                                <div id="dist-br-pr" title="گزارش فروش موجودی به تفکیک پخش" style="cursor: pointer;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="mb-5" id="tbl-dist-br-pr">
                            </div>

                            <div class="dashboardTblTtl bg-success mt-5">
                                <div class="px-3">گزارش فروش موجودی به تفکیک برند - محصول - پخش</div>
                                <div id="br-pr-dist" title="گزارش فروش موجودی به تفکیک برند" style="cursor: pointer;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="mb-5" id="tbl-br-pr-dist"></div>

                            <div style="height: 50px;">&nbsp;</div>
                        </div>
                    </div>
                    <div id="compareReportPopup"></div>

                </div>
                <div id="sheet-1-1" class="tab-container content-sheet">
                    <div id="ReportTbl" class=""></div>
                    <div style="height: 50px;">&nbsp;</div>
                </div>
                <div id="sheet-1-2" class="tab-container chart-container col-lg-11 col-md-12 col-sm-12 p-3 m-2 rounded border chartBackground">
                    <canvas id="chartMonthSaleDistributor"></canvas>
                    <div id="map" style="height: 500px;"></div>

                </div>
                <div id="sheet-1-3" class="tab-container chart-container col-lg-11 col-md-12 col-sm-12 p-3 m-2  rounded border chartBackground">
                    <canvas id="chartMonthSaleCompany"></canvas>

                </div>
                <div id="sheet-1-4" class="tab-container chart-container col-lg-11 col-md-12 col-sm-12 rounded my-2 border p-3 chartBackground">
                    <canvas id="chartMonthSaleBrand"></canvas>

                </div>
                <div id="sheet-1-5" class="tab-container chart-container col-lg-11 col-md-12 col-sm-12 p-3 m-2 rounded chartBackground">
                    <canvas id="chartMonthTotal"></canvas>
                </div>
                <div id="sheet-1-7" class="tab-container content-sheet">
                    <div class="dashBoard-container">
                        <div class="mx-2 my-3">
                            <div class="text-center mb-2">
                                <div id="saleStockRate"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="sheet-1-8" class="tab-container content-sheet">
                    <div class="dashBoard-container">
                        <div class="mx-2 my-4">
                            <div class="col-12 col-md-4 col-lg-3 bg-light">
                                <div class="text-center mb-2 text-white d-none"></div>
                                <label for="persian-date">تاریخ انقضا معیار:</label>

                                <input class="form-control cmbFilter" id="persian-date" onchange="manageUrlParams('combo','1','8')">
                            </div>
                            <!-- عنوان صفحه -->
                            <div class="text-center mb-2">
                                <div id="expiryReport"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="sheet-1-9" class="tab-container content-sheet">
                    <div class="dashBoard-container">
                        <div class="my-4 mr-4 px-2">
                            <!-- فیلترها -->
                            <div class="d-flex g-3 mb-4">
                                <div class="row col-11">
                                    <div class="col-lg-2">
                                        <div id="companyCmbMap"></div>
                                    </div>
                                    <div class="col-lg-2 ">
                                        <div id="yearsCmb"></div>
                                    </div>
                                    <div class="col-lg-2">
                                        <div id="monthsCmb"></div>
                                    </div>
                                    <div class="col-lg-1">
                                        <div id="reportTypeCmb"></div>
                                    </div>
                                    <div class="col-lg-2">
                                        <div id="breakDownCmb"></div>
                                    </div>
                                    <div class="col-lg-2 hidden">
                                        <div id="distCmbMap"></div>
                                    </div>
                                    <div class="col-lg-2 hidden">
                                        <div id="brandCmbMap"></div>
                                    </div>
                                    <div class="col-lg-3 hidden">
                                        <div id="productCmbMap"></div>
                                    </div>
                                </div>
                                <div class="col-1 d-flex justify-content-end">
                                    <div class="">
                                        <button class="btn btn-primary " id="fetchButton" type="button">دریافت گزارش</button>
                                    </div>
                                </div>
                            </div>
                            <div id="maps" style="height: 700px"></div>
                            <script src="..\scripts\proviences.js"></script>
                            <script src="..\scripts\leaflet.js"></script>
                        </div>
                    </div>


                </div>
                <div id="sheet-1-10" class="tab-container content-sheet">
                    <div class="dashBoard-container">
                        <div class="container mb-4">
                            <div class="dashBoard-container">
                                <div class="my
                                    b-4 mr-4 px-2">


                                    <!-- فیلترها -->
                                    <div id="filterTypeTr"></div>
                                    <p id="filter-description" class="filter-description text-muted mt-2"></p>
                                    <!-- فیلترها -->
                                    <div class="d-flex g-3">
                                        <div class="row col-11">
                                            <div class="col-lg-3">
                                                <div id="companyCmbTr"></div>
                                            </div>
                                            <div class="col-lg-3 ">
                                                <div id="yearsCmbTr"></div>
                                            </div>
                                            <div class="col-lg-3">
                                                <div id="monthsCmbTr"></div>
                                            </div>
                                            <div class="col-lg-3">
                                                <!-- فیلترها <div id="filterTypeTr"></div>-->
                                            </div>
                                        </div>
                                        <div class="col-1 d-flex justify-content-end">
                                            <div class="">
                                                <button class="btn btn-primary " id="trendFetchButton" type="button">نمایش  </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="loading" id="loading">در حال دریافت داده‌ها...</div>
                                <!-- نتایج -->
                                <div id="resultsBody" class="product-list"></div>
                                <canvas id="resultsChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="sheet-1-6" class="tab-container content-sheet">
                    <div class="drop-target col-12 d-flex justify-content-center">
                        <div class="drag-box col-auto bg-light border border-1 p-0 rounded align-items-center px-5 mx-1">
                            <h4 class="section-title">lists</h4>
                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="companyId" data-label="شرکت" data-target="companyName_FA" data-attr="companies.companyName_FA" data-alias="companyName_FA" data-type="">شرکت</div>
                            </div>
                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="distId" data-label="پخش" data-target="distributorName" data-attr="distributors.distributorName" data-alias="distributorName" data-type="">پخش</div>
                            </div>
                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="brandId" data-label="برند" data-target="brandName_EN" data-attr="brands.brandName_EN" data-alias="brandName_EN" data-type="">برند</div>
                            </div>
                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="saleAmount" data-label="فروش تعدادی" data-target="saleAmount" data-attr="sales.saleAmount" data-alias="saleAmount" data-type="sum">فروش تعدادی</div>
                            </div>
                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="goodsPrice" data-label="فروش ریالی" data-target="goodsPrice" data-attr="sales.goodsPrice" data-alias="goodsPrice" data-type="sum">فروش ریالی</div>
                            </div>
                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="month" data-label="ماه" data-target="monthName" data-attr="sales.month,months.monthName" data-alias="monthName">ماه</div>
                            </div>
                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="year" data-label="سال" data-target="year" data-attr="sales.year" data-type="" data-alias="year">سال</div>
                            </div>
                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="financePrdtId" data-label="محصول" data-target="name" data-attr="productFinance.name" data-type="" data-alias="name">محصول</div>
                            </div>
                            <!--<div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="pharmacy" data-label="داروخانه" data-target="Name" data-attr="pharmacies.Name" data-type="" data-alias="pharmacy">داروخانه</div>
                            </div>-->
                        </div>
                        <div class="drag-box col-auto bg-light border border-1 p-0 rounded align-items-center px-5 mx-1" id="columns-drop-area">
                            <h4 class="section-title">Columns</h4>
                        </div>
                        <div class="drag-box col-auto bg-light border border-1 p-0 rounded align-items-center px-5 mx-1" id="rows-drop-area">
                            <h4 class="section-title">Rows</h4>
                        </div>
                        <div class="drag-box col-auto bg-light border border-1 p-0 rounded align-items-center px-5 mx-1" id="values-drop-area">
                            <h4 class="section-title">Values</h4>
                        </div>
                    </div>
                    <div id="pivotTbl" class="pivotTblContainer my-2">
                        <div class="lblContainer px-1 my-2">
                            <div class="lblSum">
                                <span class="lblTotalPrice m-1 p-1 d-none">
                                    <span class="lblTotalQuantityTitle  px-2">مجموع فروش ریالی:</span>
                                    <span class="lblTotalQuantityValue"></span>
                                </span>
                                <span class="lblTotalQuantity m-1 p-1 d-none">
                                    <span class="lblTotalQuantityTitle px-2">مجموع فروش تعدادی:</span>
                                    <span class="lblTotalPriceValue"></span>
                                </span>
                            </div>

                        </div>
                        <table class="table table-sm mb-5">
                            <thead id="pivotHeadTbl">
                            </thead>
                            <tbody id="pivotBodyTbl">
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="sheet-1-15" class="tab-container content-sheet">
                    <div id="reportNamePopup"></div>

                    <div class="mb-2 d-flex justify-content-between">
                        <div>
                            <div id="chkSale"></div>
                            <div id="chkStock"></div>
                        </div>
                        <div id="pivotFavReportContainer"></div>
                        <div class="d-flex gap-1">
                            <div>
                                <div id="UserReportFavoritePivot" class="dx-pivotgrid-field-chooser-button dx-button dx-button-normal dx-button-mode-contained dx-widget dx-rtl dx-button-has-icon" aria-label="columnchooser" title="نمایش انتخاب گر فیلدها" tabindex="0" role="button">
                                    <div class="dx-button-content d-flex p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div id="popupReport"></div>
                            <div id="popupFavorite"></div>
                        </div>
                    </div>
                    <div class="sale">
                        <div id="pivotGrid"></div>
                        <div class="d-flex justify-content-start mt-5 mx-2">
                            <div id="chartTypeSelectorSale" style="max-width: 240px; margin-bottom: 8px;"></div>
                        </div>
                        <div id="pivotgrid-chart" class="pt-0 pb-5"></div>
                    </div>
                    <div class="stock">
                        <div id="pivotGridStock"></div>
                        <div class="d-flex justify-content-start mt-5 mx-2">
                            <div id="chartTypeSelectorStock" style="max-width: 240px; margin-bottom: 8px;"></div>
                        </div>
                        <div id="pivotgridStock-chart" class="pt-0 pb-5"></div>
                    </div>
                    <div class="saleStock">
                        <div id="pivotGridsaleStock"></div>
                        <div class="d-flex justify-content-start mt-5 mx-2">
                            <div id="chartTypeSelectorSaleStock" style="max-width: 240px; margin-bottom: 8px;"></div>
                        </div>
                        <div id="pivotgridsaleStock-chart" class="pt-0 pb-5"></div>
                    </div>
                </div>
            </div>
            <div class="sheet-tabs">
            </div>
        </div>
        <div class="main-tab tab-container tabCnt" id="tab2">
            <div class="mainContainer">
                <div id="sheet-2-0" class="tab-container content-sheet">
                    <div class="dashBoard-container">
                        <div class="">
                            <div class="dashboardTblTtl bg-success">
                                <div class="px-3">گزارش فروش موجودی به تفکیک برند</div>
                                <div id="xlsx-tbl-br-pr-fnc" title="گزارش فروش موجودی به تفکیک برند" style="cursor: pointer;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                                    </svg>
                                </div>
                            </div>

                            <div class="mb-4" id="tbl-br-pr-fnc"></div>
                            <div style="height: 50px;">&nbsp;</div>
                            <div class="dashboardTblTtl bg-primary">
                                <div class="px-3">گزارش فروش موجودی به تفکیک گروه مشتری - برند -محصول</div>
                                <div id="xlsx-tbl-of-pr-fnc" title="گزارش فروش موجودی به تفکیک گروه مشتری" style="cursor: pointer;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="mb-4" id="tbl-of-pr-fnc"></div>
                            <div style="height: 50px;">&nbsp;</div>
                        </div>
                    </div>
                </div>
                <div id="sheet-2-1" class="tab-container content-sheet">
                    <div id="ReportTblFinance" class=""></div>
                </div>
                <div id="sheet-2-3" class="tab-container content-sheet">
                    <canvas id="chartMonthSaleCompanyFinance"></canvas>
                </div>
                <div id="sheet-2-4" class="tab-container content-sheet">
                    <canvas id="chartMonthSaleBrandFinance"></canvas>

                </div>
                <div id="sheet-2-5" class="tab-container content-sheet">
                    <canvas id="chartMonthTotalFinance"></canvas>
                </div>
                <div id="sheet-2-6" class="tab-container content-sheet">
                    <div class="drop-target col-12 d-flex justify-content-center">
                        <div class="drag-box col-auto bg-light border border-1 p-0 rounded align-items-center px-5 mx-1">
                            <h4 class="section-title">lists</h4>
                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="companyId" data-label="شرکت" data-target="companyName_FA" data-attr="companies.companyName_FA" data-alias="companyName_FA" data-type="">شرکت</div>
                            </div>

                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="brandId" data-label="برند" data-target="brandName_EN" data-attr="brands.brandName_EN" data-alias="brandName_EN" data-type="">برند</div>
                            </div>
                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="saleAmount" data-label="فروش تعدادی" data-target="saleAmount" data-attr="sales.saleAmount" data-alias="saleAmount" data-type="sum">فروش تعدادی</div>
                            </div>
                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="goodsPrice" data-label="فروش ریالی" data-target="goodsPrice" data-attr="sales.goodsPrice" data-alias="goodsPrice" data-type="sum">فروش ریالی</div>
                            </div>
                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="month" data-label="ماه" data-target="monthName" data-attr="sales.month,months.monthName" data-alias="monthName">ماه</div>
                            </div>
                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="year" data-label="سال" data-target="year" data-attr="sales.year" data-type="" data-alias="year">سال</div>
                            </div>
                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="customer" data-label="داروخانه" data-target="fullName" data-attr="customerFinance.fullName" data-type="" data-alias="fullName">مشتری</div>
                            </div>
                            <div class="drag-card d-flex align-items-center justify-content-center">
                                <div class="drag-task p-1 border border-secondary rounded col-12 m-0 my-1 text-center" draggable="true" id="financePrdtId" data-label="محصول" data-target="name" data-attr="productFinance.name" data-type="" data-alias="name">محصول</div>
                            </div>
                        </div>
                        <div class="drag-box col-auto bg-light border border-1 p-0 rounded align-items-center px-5 mx-1" id="columns-drop-area">
                            <h4 class="section-title">Columns</h4>
                        </div>
                        <div class="drag-box col-auto bg-light border border-1 p-0 rounded align-items-center px-5 mx-1" id="rows-drop-area">
                            <h4 class="section-title">Rows</h4>
                        </div>
                        <div class="drag-box col-auto bg-light border border-1 p-0 rounded align-items-center px-5 mx-1" id="values-drop-area">
                            <h4 class="section-title">Values</h4>
                        </div>
                    </div>
                    <div id="pivotTblFinance" class="pivotTblContainer my-2">
                        <table class="table table-sm mb-5">
                            <thead id="pivotHeadTbl">
                            </thead>
                            <tbody id="pivotBodyTbl">
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="sheet-2-15" class="tab-container content-sheet">
                    <div id="pivotGridFinance"></div>
                      <div class="d-flex justify-content-start mt-5 mx-2">
      <div id="chartTypeSelectorFinance" style="max-width: 240px; margin-bottom: 8px;"></div>
  </div>
                    <div id="pivotgridFinance-chart" class="mt-5 pb-5"></div>
                </div>
            </div>
            <div class="sheet-tabs">
            </div>
        </div>
        <div class="main-tab tab-container tabCnt" id="tab3">
            <div class="mainContainer">
                <div id="sheet-3-1" class="tab-container content-sheet">
                    <div class="p-5" id="productFinanceBrand">
                        <div class="pfCmb">
                            <select class="p-1 border rounded" id="companyCombo">
                            </select>
                        </div>
                        <div class="pfBrand my-3  p-1">
                        </div>
                    </div>
                </div>
                <div id="sheet-3-2" class="tab-container content-sheet">
                    <div class="" id="productFinanceDist">
                        <div id="dcompanyTbl" class="pfProduct"></div>

                        <div class="pfProduct my-3  p-1">
                        </div>
                    </div>
                </div>
                <div id="sheet-3-3" class="tab-container content-sheet">
                    <div id="serviceLogTbl" class="pfProduct my-3  p-1"></div>
                </div>
                <div id="sheet-3-4" class="tab-container content-sheet">
                    <div class="" id="productFinancePrice">
                        <div id="priceCompanyTbl" class="pfProduct"></div>
                    </div>
                </div>
            </div>
            <div class="sheet-tabs">
            </div>
        </div>
        <div class="main-tab tab-container tabCnt" id="tab4">
            <div class="mainContainer">
                <div id="sheet-4-1" class="tab-container content-sheet sheet-4 ">
                    <div id="shipment"></div>
                </div>
                <div id="sheet-4-2" class="tab-container content-sheet sheet-4 ">
                    <div id="proformaProductTemp"></div>
                </div>
            </div>
            <div class="sheet-tabs">
            </div>
        </div>

        <div class="main-tab tab-container tabCnt" id="tab5">
            <div class="mainContainer">
                <div id="sheet-5-1" class="tab-container content-sheet">
                    <div id="prdTargetPopup"></div>
                    <div id="differenceBox" style="margin-top: 10px; font-weight: bold; font-size: 16px;"></div>
                    <div class="dashboardTblTtl bg-success">
                        <div class="px-3">🎯 تارگت گذاری محصولات در هر برند</div>
                        <div id="targetBrandProduct-excelBtn" title="گزارش فروش موجودی به تفکیک پخش" style="cursor: pointer;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                            </svg>
                        </div>
                    </div>

                    <div class="mb-3" id="targetBrandProduct"></div>
                    <div class="dashboardTblTtl monthHeaderBg mt-3">📅 تارگت گذاری محصولات در هر ماه</div>
                    <div class="mb-3" id="targetMonthProduct"></div>
                    <div class="dashboardTblTtl bg-primary mt-3">🚚 تارگت گذاری محصولات در هر پخش</div>
                    <div class="mb-3" id="targetDistProduct"></div>
                    <div class="dashboardTblTtl stateHeadBg mt-3">🗺️ تارگت گذاری محصولات در هر استان</div>
                    <div class="mb-3" id="targetStateProduct"></div>
                    <div class="m-5">&nbsp;</div>
                </div>
                <div id="sheet-5-2" class="tab-container content-sheet">
                    <div id="pivotGridTarget"></div>
                    <div class="d-flex justify-content-start mt-5 mx-2">
                        <div id="chartTypeSelectorTarget" style="max-width: 240px; margin-bottom: 8px;"></div>
                    </div>
                    <div id="pivotgridTarget-chart" class="mt-5 pb-5"></div>
                </div>
            </div>
            <div class="sheet-tabs">
            </div>
        </div>
        <div class="main-tab tab-container tabCnt" id="tab6">
            <div class="mainContainer">
                <div id="sheet-6-2" class="tab-container content-sheet sheet">
                    <div id="debitDashboard"></div>
                </div>
                <div id="sheet-6-1" class="tab-container content-sheet sheet">
                    <div id="debit"></div>
                </div>
                <div id="sheet-6-3" class="tab-container content-sheet sheet">
                    <div class="dashboardTblTtl bg-secondary" onclick="$('#ChequeTimeBreakdown').slideToggle()" style="cursor: pointer;">
                        <div class="px-3">شکست زمانی اسناد دریافتنی وصول نشده</div>
                    </div>
                    <div id="ChequeTimeBreakdown"></div>
                    <div class="dashboardTblTtl bg-secondary mt-5 " onclick="$('#invoiceData').slideToggle()" style="cursor: pointer;">
                        <div class="px-3">اطلاعات فاکتور فروش و مرجوعی</div>
                    </div>
                    <div id="invoiceData"></div>
                    <div class="dashboardTblTtl bg-secondary mt-5" onclick="$('#paymentData').slideToggle()" style="cursor: pointer;">
                        <div class="px-3">اطلاعات دریافت/پرداخت (چک - رسید - تخفیف و ...)</div>
                    </div>
                    <div id="paymentData"></div>
                    <div class="dashboardTblTtl bg-secondary mt-5" onclick="$('#receivableNote').slideToggle()" style="cursor: pointer;">
                        <div class="px-3">اطلاعات مربوط به اسناد دریافتنی (وصول شده - در جریان وصول و ...)</div>
                    </div>
                    <div id="receivableNote"></div>
                    <div style="height: 100px;">&nbsp;</div>
                </div>
                <div id="sheet-6-4" class="tab-container content-sheet sheet">
                    <div class="dashboardTblTtl bg-secondary" onclick="$('#ChequeTimeBreakdownSingle').slideToggle()" style="cursor: pointer;">
                        <div class="px-3">شکست زمانی اسناد دریافتنی وصول نشده</div>
                    </div>
                    <div id="ChequeTimeBreakdownSingle" class="mb-5"></div>
                    <div class="dashboardTblTtl bg-secondary mt-5 " onclick="$('#InvoiceBreakDown').slideToggle()" style="cursor: pointer;">
                        <div class="px-3">شکست زمانی فاکتورهای تسویه نشده</div>
                    </div>
                    <div id="InvoiceBreakDown"></div>
                    <div style="height: 100px;">&nbsp;</div>
                </div>
                <div id="chequePopup">
                    <div id="chequePopupGrid"></div>

                </div>
                <div id="invoicePopup">
                    <div id="invoicePopupGrid"></div>
                </div>

            </div>
            <div class="sheet-tabs">
            </div>
        </div>
        <div class="main-tab tab-container tabCnt" id="tab7">
            <div class="mainContainer">
                <div id="sheet-7-1" class="tab-container content-sheet sheet">
                    <div class="dashboardTblTtl bg-secondary">
                        <div class="px-3">اطلاعات پرداختنی ها (چک - رسید - تخفیف و ...)</div>
                    </div>
                    <div id="paymentVoucher" class="mb-5"></div>
                    <div class="dashboardTblTtl bg-secondary">
                        <div class="px-3">اطلاعات مربوط به اسناد پرداختنی (وصول شده - در جریان وصول و ...)</div>
                    </div>
                    <div id="payableNote" class="mb-5"></div>
                    <div class="dashboardTblTtl bg-secondary" onclick="$('#PaymentBreakDown').slideToggle()" style="cursor: pointer;">
                        <div class="px-3">شکست زمانی اسناد پرداختنی</div>
                    </div>
                    <div id="PaymentBreakDown"></div>
                    <div style="height: 100px;">&nbsp;</div>
                </div>
                <div id="paymentPopup">
                    <div id="paymentPopupGrid"></div>
                </div>
            </div>
            <div class="sheet-tabs">
            </div>
        </div>

    </div>

    <div id="loader" class="d-flex justify-content-center align-items-center d-none" style="position: fixed; top: 0; left: 0; height: 100%; width: 100%; background-color: rgba(255, 255, 255, 0.7); z-index: 9999;">

        <%--<span class="sr-only p-2 text-primary bg-white">در حال دریافت اطلاعات...</span>--%>
        <span class="sr-only p-2">
            <img style="width: 150px; height: 150px;" src="logo.gif" /></span>
    </div>


</asp:Content>

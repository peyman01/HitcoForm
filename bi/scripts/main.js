$(document).ready(function () {
    DevExpress.localization.loadMessages({
        en: {
            "dxDataGrid-headerFilterOK": "تایید",
            "dxDataGrid-headerFilterCancel": "لغو",
            "dxList-selectAll": "انتخاب همه",       // "Select All" checkbox
            "dxDataGrid-editingSaveRowChanges": "ذخیره",
            "dxDataGrid-editingCancelRowChanges": "لغو",
            "dxDataGrid-filterRowPlaceholder": "جست و جو در فیلتر",
            "dxPivotGrid-grandTotal": "جمع کل",
            "dxPivotGrid-total": "{0} جمع کل",
            "dxPivotGrid-fieldChooserTitle": "انتخاب فیلد",
            "dxPivotGrid-showFieldChooser": "نمایش انتخاب گر فیلدها",
            "dxPivotGrid-expandAll": "باز کردن همه",
            "dxPivotGrid-collapseAll": "بستن همه",
            "dxPivotGrid-sortColumnBySummary": 'مرتب‌سازی بر اساس: {0}',
            "dxPivotGrid-sortRowBySummary": 'مرتب‌سازی بر اساس: {0}',
            "dxPivotGrid-removeAllSorting": "حذف مرتب‌سازی‌ها",
            "dxPivotGrid-dataNotAvailable": "موجود نیست",
            "dxPivotGrid-rowFields": "فیلدهای ردیفی",
            "dxPivotGrid-columnFields": "فیلدهای ستونی",
            "dxPivotGrid-dataFields": "فیلدهای داده",
            "dxPivotGrid-filterFields": "فیلدهای فیلتر",
            "dxPivotGrid-allFields": "تمام فیلدها",
            "dxPivotGrid-columnFieldArea": "فیلدهای ستونی را به اینجا بکشید",
            "dxPivotGrid-dataFieldArea": "فیلدهای داده را به اینجا بکشید",
            "dxPivotGrid-rowFieldArea": "فیلدهای ردیفی را به اینجا بکشید",
            "dxPivotGrid-filterFieldArea": "فیلدهای فیلتر را به اینجا بکشید",
            "dxLookup-searchPlaceholder": "طول حداقل {0} کاراکتر",
            "Yes": "بله",
            "No": "نه",
            "Cancel": "لغو",
            "Clear": "پاک کردن",
            "Done": "تمام",
            "Loading": "در حال بارگذاری...",
            "Select": "انتخاب...",
            "Search": "جستجو...",
            "Back": "بازگشت",
            "OK": "تأیید",
            "dxTagBox-applyButton": "تأیید",   // replaces default OK
            "dxTagBox-cancel": "لغو",

        }
    });
    //DevExpress.localization.locale("fa");
    getInitialData();
    var customOptions = {
        placeholder: "روز / ماه / سال"
        , twodigit: true
        , closeAfterSelect: true
        , nextButtonIcon: ""
        , previousButtonIcon: ""
        , buttonsColor: "#187275"
        , forceFarsiDigits: true
        , markToday: true
        , markHolidays: true
        , highlightSelectedDay: true
        , sync: true
        , gotoToday: true
        , pastYearsCount: 4  // فقط 3 سال قبل
        , futureYearsCount: 3
    }
    kamaDatepicker('cmbDateFrom', customOptions);
    kamaDatepicker('cmbDateTo', customOptions);
    kamaDatepicker('persian-date', customOptions);
    manageUrlParams("refresh");
    $("#filterBtn").unbind().off('click').on('click', function () {
        location.reload()
    })
    initToast();
});
function initVersionDetails() {
    const messages = [
        { v: "10.1", title: "اضافه شدن هدف گذاری", message: "برای ثبت هدف به تفکیک ماه، استان، پخش و محصول به تب عملیات سپس شیت هدف گذاری بروید" },
        { v: "10.1", title: "رفع باگ", message: "حذف برندهای اضافی در فیلتر برندها" },
        { v: "10.2", title: "رفع باگ", message: "حل مشکل عدم نمایش استان در خروجی اکسل در تب جدول اطلاعات" },
        { v: "10.2", title: "ویژگی جدید", message: "امکان خروجی اکسل در تب جدول اطلاعات(گزارش پخش)" },
        { v: "10.2", title: "ویژگی جدید", message: "امکان خروجی اکسل در تب داشبورد(در تمامی سطوح)" },
        { v: "10.2", title: "رفع باگ", message: "اصلاح خروجی اکسل گزارش ساز جهت تحلیل مناسب تر" },
        { v: "10.2", title: "ویژگی جدید", message: "افزوده شدن ستون فروش تعدادی به گزارش روز فروش موجودی" },
        { v: "10.2", title: "رفع باگ", message: "اصلاح خروجی اکسل گزارش روز فروش موجودی(تبدیل مقادیر به عدد)" },
        { v: "10.3", title: "ویژگی جدید", message: "امکان ذخیره گزارشات دلخواه برای هر کاربر در تب گزارش ساز(با کلیک بر روی دکمه ستاره در گوشه سمت چپ بالا)" },
        { v: "10.3", title: "ویژگی جدید", message: "افزوده شدن دکمه خروج از حساب کاربری" },
        { v: "10.3", title: "ویژگی جدید", message: "حفظ آخرین وضعیت برای هر کاربر" },
        { v: "10.3", title: "رفع باگ", message: " رفع مشکل خالی نشان دادن صفحات هنگام جابه جایی بین تب ها " },
        { v: "10.4", title: "رفع باگ", message: "حذف فیلتر ها ی انتخابی در قسمت عملیات " },
        { v: "10.5", title: "رفع باگ", message: "اصلاح عدم نمایش همه محصولات مالی در تارگت گذاری " },
        { v: "10.5", title: "ویژگی جدید", message: "افزوده شدن جمع کلی به جداول تارگت " },
        { v: "10.5", title: "ویژگی جدید", message: "افزوده شدن روش فروش مستقیم در تارگت گذاری به تفکیک پخش" },
        { v: "10.5", title: "رفع باگ", message: "اصللاح عدم نمایش برخی برند ها در تب عملیات محصولات مالی" },
        { v: "10.5", title: "ویژگی جدید", message: "افزوده شدن موجودی مالی به تفکیک انبار" },
        { v: "10.5", title: "رفع باگ", message: "رفع مغایرت فروش و موجودی مالی در گزارش مالی" },
        { v: "10.5", title: "ویژگی جدید", message: "افزوده شدن فروش به تفکیکی گروه مشتری در گزارش مالی" },
        { v: "10.5", title: "ویژگی جدید", message: "اطلاعات مالی از ابتدای سال 1400 وارد سیستم گردید" },
        { v: "10.5", title: "ویژگی جدید", message: "افزودن پارامتر سال-ماه به تب گزارش ساز" },
        { v: "11", title: "ویژگی جدید", message: "ایجاد فرایند ثبت خرید خارجی(shipment)" },
        { v: "11", title: "ویژگی جدید", message: "اصلاح نمایش تارگت تعدادی و ریالی در قسمت تارگت" },
        { v: "11", title: "ویژگی جدید", message: "(فقط در سطح لایه اول)افزوده شدن میزان تحقق تارگت تعدادی در تب داشبورد" },
        {
            "v": "11.1",
            "title": "ویژگی جدید",
            "message": `در کنار هر محصول، آیکون <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="darkorange" class="bi bi-info-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg> نمایانگر **عدم تطابق قیمت فروش در پخش با قیمت ثبت‌شده در سامانه** است.
این عدم تطابق، بسته به نوع گزارش، می‌تواند دو دلیل داشته باشد:
<p class="mb-0 mt-1">1. قیمت محصول پس از افزایش، در سامانه ثبت نشده است.</p>
<p>2. محصول در همه پخش‌ها با قیمت یکسان به فروش نرفته است.</p>
قیمت‌ها از مسیر: «تب عملیات ← عملیات محصولات مالی» ثبت و مدیریت می‌شوند.
این امکان به شما کمک می‌کند تا در **گزارشات سطح محصول در قسمت داشبورد**، قیمت فروش در پخش را با قیمت داخلی سیستم مقایسه و تحلیل نمایید.
 مقایسه این دو عدد به شناسایی اختلاف‌ها و کنترل بهتر فرآیند قیمت‌گذاری کمک می‌کند.`
        },

        { v: "11.1", title: "رفع باگ", message: "مشکل عدم انتقال به تب مناسب در هنگام جابه‌جایی بین گزارش‌ها برطرف شده است. از این پس، هنگام انتخاب هر گزارش، مستقیماً به تب اول هدایت خواهید شد." },
        { v: "11.1", title: "ویژگی جدید", message: "قابلیت بارگذاری تصاویر به بخش ثبت خرید خارجی افزوده شد. همچنین، نام برخی فیلدها برای وضوح بیشتر اصلاح گردید." },
        { v: "11.1", title: "ویژگی جدید", message: "اطلاعات موجودی و فروش تعدادی هر محصول اکنون در قسمت تارگت‌گذاری محصولات در هر برند قابل مشاهده است. با باز کردن برند مورد نظر، این اطلاعات به‌صورت خودکار نمایش داده می‌شود تا بتوانید در زمان هدف‌گذاری تصمیم‌گیری دقیق‌تری داشته باشید." },
        { v: "11.1", title: "ویژگی جدید", message: "پس از هر به‌روزرسانی، آخرین تغییرات سیستم به‌صورت خودکار و بلافاصله پس از ورود کاربر به سامانه نمایش داده می‌شود. این امکان به کاربران کمک می‌کند از قابلیت‌ها و اصلاحات جدید مطلع شوند." },
        { v: "11.1", title: "بهبود", message: "داشبورد سریع‌تر از قبل! بهبود سرعت گزارش گیری در تب داشبورد." },
        { v: "11.1", title: "بهبود", message: "بهبود های ظاهری در برنامه" },
        { v: "11.1", title: "ویژگی جدید", message: "از هدف‌گذاری تا واقعیت، تنها یک نگاه فاصله است.اطلاعات تحقق تارگت اکنون در تمام لایه‌ها — سطح پخش، برند و محصول — قابل مشاهده است." },
        { v: "11.1", title: "ویژگی جدید", message: "از این پس می‌توانید فروش را به تفکیک گروه مشتری در بخش گزارش مالی و سپس در تب داشبورد مشاهده نمایید." },

        {
            "v": "12.0",
            "title": "ویژگی جدید",
            "message": "تب جدیدی با عنوان «مطالبات» افزوده شد که به‌صورت تجمیعی وضعیت حساب‌های دریافتنی مشتریان را نمایش می‌دهد."
        },
        {
            "v": "12.0",
            "title": "بهبود نمایش اطلاعات",
            "message": "در تب مطالبات، وضعیت حساب‌های دریافتنی به دسته‌هایی مانند سررسیدشده، معوق، در جریان وصول، مستردشده، واگذار شده به غیر و نزد صندوق تفکیک شده است تا دید دقیق‌تری از وضعیت مالی ارائه گردد."
        },
        {
            "v": "12.0",
            "title": "ویژگی جدید",
            "message": "در تب «شکست زمانی»، وضعیت مطالبات وصول‌نشده به‌صورت ماهانه و در قالب ماتریسی نمایش داده می‌شود. هر ردیف نمایانگر یک مشتری و هر ستون مربوط به یک تاریخ مشخص است."
        },
        {
            "v": "12.0",
            "title": "بهبود نمایش",
            "message": "در انتهای هر جدول، ردیف جمع نهایی برای نمایش مجموع مبالغ هر ستون اضافه شده است تا تحلیل کلی اطلاعات تسهیل گردد."
        },
        {
            "v": "12.0",
            "title": "افزایش تعامل",
            "message": "کاربر می‌تواند با کلیک بر روی هر سلول در جداول مطالبات، شکست زمانی یا اطلاعات، جزئیات دقیق مربوط به همان مقدار را مشاهده نماید."
        },
        {
            "v": "12.0",
            "title": "ویژگی جدید",
            "message": "در تب «جدول اطلاعات»، تمامی فاکتورهای فروش و مرجوعی مشتریان همراه با اطلاعاتی مانند مبلغ خالص، اضافات، کسورات، سررسید، تاریخ و شماره فاکتور به‌صورت کامل نمایش داده می‌شود."
        },
        {
            "v": "12.0",
            "title": "نمایش پیشرفته",
            "message": "شما می‌توانید با باز کردن هر ردیف از جدول اطلاعات، جزئیات کامل مربوط به آن فاکتور را مشاهده نمایید؛ شامل اقلام ثبت‌شده، تعداد، مبلغ و برند مربوطه."
        },
        {
            "v": "12.0",
            "title": "ویژگی جدید",
            "message": "در بخش جدول اطلاعات، وضعیت چک‌ها (وصول شده، نزد بانک، نزد صندوق، واگذار شده به غیر) به‌صورت مجزا برای هر ردیف نمایش داده می‌شود."
        },
        {
            "v": "12.0",
            "title": "ویژگی جدید",
            "message": "برای هر سند دریافتی، اطلاعاتی از قبیل شماره چک، وضعیت، شرکت، مشتری و شرح کامل در ستونی مجزا ارائه شده است."
        },
        {
            "v": "12.0",
            "title": "بهبود قابلیت جستجو",
            "message": "در تمامی تب‌های مطالبات، شکست زمانی و جدول اطلاعات، امکان فیلتر داده‌ها بر اساس شرکت یا مشتری فراهم شده تا دسترسی سریع‌تر به اطلاعات مورد نظر امکان‌پذیر باشد."
        },
        {
            "v": "12.0",
            "title": "اصلاح ساختار",
            "message": "ایرادات موجود در فایل‌ها و فیلدهای مربوط به پروفورما اصلاح شد و ساختار اطلاعات پارت‌ها و ردیف‌های Proforma Invoice بازنگری و بهینه‌سازی گردید."
        },
        {
            "v": "12.0",
            "title": "بهبود رابط کاربری",
            "message": "برای جلوگیری از ورود داده‌های ناهماهنگ، فیلدهای مهمی مانند نام بانک و بیمه به‌صورت انتخابی (DropDown) طراحی شدند تا فقط از مقادیر معتبر استفاده شود."
        },
        {
            "v": "12.0",
            "title": "ویژگی جدید",
            "message": "در ساختار جدید ثبت اطلاعات پارت، این امکان فراهم شده که کاربر بتواند چند محصول مجزا را برای هر پارت تعریف نماید."
        },


        {
            "v": "12.0",
            "title": "اصلاح ساختار",
            "message": "ایرادات موجود در فایل‌ها و فیلدهای مربوط به پروفورما اصلاح شد و ساختار اطلاعات مرتبط با پارت‌ها و ردیف‌های Proforma Invoice مورد بازنگری و بهینه‌سازی قرار گرفت."
        },
        {
            "v": "12.0",
            "title": "بهبود رابط کاربری",
            "message": "برای جلوگیری از ورود اطلاعات ناهماهنگ، فیلدهایی مانند نام بانک و بیمه به‌صورت انتخابی (DropDown) طراحی شده‌اند تا کاربران فقط از مقادیر استاندارد استفاده نمایند."
        },
        {
            "v": "12.0",
            "title": "ویژگی جدید",
            "message": "در ساختار جدید ثبت اطلاعات پارت، امکان اختصاص یک یا چند محصول به هر پارت فراهم شده است تا انعطاف‌پذیری در ثبت اطلاعات افزایش یابد."
        },
        {
            "v": "12.1",
            "title": "ویژگی جدید",
            "message": "در تب «شکست زمانی»، وضعیت فاکتورهای باز(دارای مانده بدهی) به‌صورت ماهانه و در قالب ماتریسی نمایش داده می‌شود. هر ردیف نمایانگر یک مشتری و هر ستون مربوط به یک تاریخ مشخص است."
        }
        , {
            "v": "12.1",
            "title": "ویژگی جدید",
            "message": "در تب «پرداخت»، وضعیت اسناد پرداختنی  به‌صورت ماهانه و در قالب ماتریسی نمایش داده می‌شود. هر ردیف نمایانگر یک مشتری و هر ستون مربوط به یک تاریخ مشخص است."
        },
        , {
            "v": "12.1",
            "title": "ویژگی جدید",
            "message": "از این پس موجودی محصولات شرکت آرادکو نیز به تفکیک انبارهای تعریف شده در سیستم مالی، نمایش داده میشود."
        },
        {
            "v": "12.1",
            "title": "بهبود نمایش اطلاعات",
            "message": "در تب مطالبات، به وضعیت اسناد دریافتنی ، اسناد دریافتنی واخواست شده نیز اضافه شده تا دید دقیق‌تری از وضعیت مالی ارائه گردد."
        },
        {
            "v": "12.1",
            "title": "رفع باگ",
            "message": " در شیت پرداخت، مشکلات مربوط به عدم نمایش فیلتر مشتری رفع شد و از این پس در کنار فیلتر شرکت، فیلتر نام مشتری نیز قرار دارد. "
        },
        {
            "v": "12.1",
            "title": "ویژگی جدید",
            "message": "در تب تامین خارجی بخش اتصال محصول به مالی اضافه گردید تا محصولاتی که جدید وارد میکنید در آینده به محصولات مالی متصل کنید."
        },
        {
            "v": "12.2",
            "title": "ویژگی جدید",
            "message": "نسخه اولیه گزارش‌ساز هدف گذاری منتشر شد. در این نسخه، کاربر می‌تواند اطلاعات مربوط به فروش و اهداف ماهانه محصولات را به تفکیک پخش و برند مشاهده نماید. داده‌ها به‌گونه‌ای طراحی شده‌اند که قابلیت Pivot داشته و امکان تحلیل مقایسه‌ای فروش و تارگت در سطوح مختلف (محصول، پخش، برند و ماه) به‌صورت پویا فراهم شده است. توجه داشته باشید که این نسخه هنوز نهایی نیست و ممکن است شامل برخی محدودیت‌ها و اشکالات جزئی باشد."
        },
        {
            "v": "12.2",
            "title": "بهبود قابلیت نمایش",
            "message": "گزارش‌ها به نحوی بازطراحی شده‌اند که حتی در صورت عدم تعریف تارگت برای یک محصول یا وجود فروش مستقل، همچنان اطلاعات مربوطه در خروجی قابل مشاهده باشد."
        },
        {
            "v": "12.2",
            "title": "نمایش پیشرفته",
            "message": "امکان مشاهده جزئیات کامل هر ترکیب محصول، پخش و ماه فراهم شده است؛ شامل مقدار تارگت، فروش واقعی و ارزش ریالی به‌صورت تجمیعی. این قابلیت در نسخه اولیه ارائه شده و ممکن است نیاز به بهبودهای آینده داشته باشد."
        },

        {
            "v": "12.2",
            "title": "رفع باگ",
            "message": "در شیت گزارش‌ساز (تب گزارش پخش)، مشکل بازنشانی گزارش هنگام تغییر فیلترها یا جابه‌جایی بین تب‌ها برطرف شد. اکنون می‌توانید پس از تغییر ستون و سطر، فیلترها را ویرایش نمایید بدون آنکه گزارش شما به حالت پیش‌فرض بازگردد."
        },
        {
            "v": "12.2",
            "title": "بهبود نمایش اطلاعات",
            "message": "در شیت مطالبات، برای ستون‌های مربوط به فاکتورها (حساب‌های دریافتنی، دریافتنی سررسید نشده و دریافتنی معوق)، برندهای مرتبط با هر فاکتور نیز در کنار سایر اطلاعات نمایش داده می‌شوند."
        },
        {
            "v": "12.2",
            "title": "ویژگی جدید",
            "message": "از این پس اطلاعات بدهکاری و بستانکاری مشتریان آرادکو نیز در سیستم قابل مشاهده است؛ شامل حساب‌های دریافتنی و پرداختنی و همچنین اسناد دریافتنی و پرداختنی."
        },
        {
            "v": "12.2",
            "title": "بهبود تجربه کاربری",
            "message": "رنگ سه ستون مربوط به اسناد دریافتنی نزد صندوق تغییر یافته تا تجربه بصری و درک بهتر داده‌ها برای کاربران فراهم گردد."
        },
        {
            "v": "12.3",
            "title": "ویژگی جدید",
            "message": "ستون گروه مشتری به تب گزارش مالی و شیت جدول اطلاعات افزوده شد."
        },
        {
            "v": "12.3",
            "title": "اصلاح ساختار",
            "message": "در پاپ‌آپ مطالبات، نمایش تاریخ فاکتور اصلاح گردید."
        },
        {
            "v": "12.3",
            "title": "افزایش تعامل",
            "message": "به درخواست واحد مالی، امکان دریافت خروجی اکسل از پاپ‌آپ مطالبات فراهم شد."
        },

        {
            "v": "12.4",
            "title": "بهبود گزارش پخش",
            "message": "در شیت داشبورد (تب گزارش پخش)، ردیف‌هایی که فروش، موجودی و تارگت آن‌ها صفر است دیگر نمایش داده نمی‌شوند. این تغییر باعث می‌شود تمرکز کاربر روی داده‌های واقعی و مهم‌تر قرار گیرد."
        },
        {
            "v": "12.4",
            "title": "نمایش موجودی تفکیکی",
            "message": "در لایه موجودی مراکز توزیع، موجودی تعدادی به‌صورت تفکیک‌شده نمایش داده می‌شود: «موجود در مرکز پخش» و «موجودی در راه». همچنین در لایه‌های بالاتر، موجودی در راه به محاسبات اضافه شده است."
        },
        {
            "v": "12.4",
            "title": "گزارش‌گیری بر اساس بچ و تاریخ انقضا",
            "message": "در شیت گزارش‌ساز (تب گزارش پخش)، زمانی که فقط موجودی انتخاب شده باشد، می‌توانید گزارش را به تفکیک بچ و تاریخ انقضا مشاهده کنید."
        },
        {
            "v": "12.4",
            "title": "اصلاح خروجی اکسل",
            "message": "در خروجی‌های اکسل مربوط به اعداد، ایرادات موجود اصلاح شد تا نمایش داده‌ها دقیق‌تر و خواناتر باشد."
        },
        {
            "v": "12.4",
            "title": "نمودارهای تحلیلی بیشتر",
            "message": "در شیت گزارش‌ساز (تب گزارش پخش)، امکان استفاده از نمودارهای تحلیلی متنوع‌تر فراهم شده است."
        },
        {
            "v": "12.4",
            "title": "اصلاح گروه مشتریان",
            "message": "در شیت داشبورد (تب گزارش مالی)، مشکل نمایش مشتریان با گروه «نامعلوم» برطرف شد."
        },
        {
            "v": "12.4",
            "title": "نمایش پویا برای وضعیت چک‌ها",
            "message": "در شیت مطالبات (تب مطالبات)، انواع وضعیت چک‌ها به‌صورت داینامیک و زنده قابل مشاهده است؛ شامل وصول‌شده، برگشتی، در جریان وصول، نزد بانک، نزد صندوق و سایر حالات. این نمایش همواره بر اساس آخرین وضعیت سیستم به‌روزرسانی می‌شود."
        },
        {
            "v": "12.4",
            "title": "اصلاح مقادیر مغایرت‌دار",
            "message": "در شیت مطالبات (تب مطالبات)، مقادیر دارای مغایرت اصلاح گردید و نمایش داده‌ها دقیق‌تر شد."
        },
        {
            "v": "12.4",
            "title": "نمایش اطلاعات جدید",
            "message": "اطلاعات مالی هلدینگ تأمین سرمایه سلامت از این پس در سیستم قابل مشاهده است."
        },
        {
            "v": "12.4",
            "title": "رفع مشکل نمایش فاکتور",
            "message": "در شیت جدول اطلاعات (تب مطالبات)، مشکل عدم نمایش برخی فاکتورها که به‌صورت مقطعی رخ می‌داد رفع گردید."
        },
        {
            "v": "12.4",
            "title": "نمایش لایه‌ای در تأمین خارجی",
            "message": "در شیت تأمین خارجی (تب تأمین خارجی)، نمایش داده‌ها به‌صورت لایه‌ای طراحی شد: لایه اول اطلاعات ثبت سفارش، لایه دوم اطلاعات پارت‌ها و لایه سوم محصولات موجود در هر پارت."
        },
        {
            "v": "12.4",
            "title": "رفع مشکل داده‌های تکراری",
            "message": "در پخش اکسیر (شرکت تأمین فارمد)، مشکل ایجاد مقادیر تکراری رفع شد."
        },
        {
            "v": "12.4",
            "title": "اصلاح نمایش هدف‌گذاری",
            "message": "در شیت گزارش‌ساز (تب هدف‌گذاری)، مشکل عدم نمایش مقادیر عددی برطرف گردید."
        },
        {
            "v": "12.4",
            "title": "اصلاح خروجی اکسل هدف‌گذاری",
            "message": "در شیت گزارش‌ساز (تب هدف‌گذاری)، مشکل خروجی اکسل رفع گردید و فایل‌ها با دقت بیشتری تولید می‌شوند."
        },
        {
            "v": "12.4",
            "title": "اصلاح تعیین تارگت محصول",
            "message": "در شیت هدف‌گذاری (تب هدف‌گذاری)، مشکل تعیین تارگت تعدادی برای محصولات برطرف شد."
        },
        {
            "v": "12.4",
            "title": "بهبود نمایش مغایرت قیمت",
            "message": "نوتیفیکیشن مربوط به مغایرت قیمت پخش با قیمت اعلامی از طرف شرکت‌ها اصلاح شد و به ستون مربوطه انتقال یافت تا خوانایی و وضوح داده‌ها بیشتر شود."
        },
        {
            "v": "12.5",
            "title": "ویژگی جدید در گزارش ساز هدف‌گذاری",
            "message": "در شیت گزارش‌ساز (تب هدف‌گذاری)، دو فیلد «درصد تحقق ریالی» و «درصد تحقق تعدادی» اضافه شد. این فیلدها امکان مشاهده درصد تحقق تارگت‌ها را در بازه‌های زمانی موردنظر و به تفکیک پخش، برند و محصول فراهم می‌کنند."
        },
        {
            "v": "12.5",
            "title": "وضعیت تارگت",
            "message": "فیلد جدیدی به نام «وضعیت تارگت» اضافه شد که هر سطر را به 5 دسته تقسیم می‌کند:<br>✔ (فروش و تارگت دارد)<br>✔ (هیچکدام ندارد)<br>⚠ (فروش دارد، تارگت ندارد)<br>⚠ (تارگت دارد، فروش ندارد)<br>⚠ (تارگت دارد، در هیچ پخشی تعریف نشده)<br>از این 5 وضعیت، سه حالت با ⚠ نیاز به توجه و پیگیری بیشتری دارند. سطرهای ⚠ (تارگت دارد، در هیچ پخشی تعریف نشده) باعث مغایرت مجموع تارگت در داشبورد گزارش پخش می‌شوند و برای رفع مغایرت، باید تارگت این سطرها را صفر کنید یا برای آن محصول یک پخش تعریف نمایید."
        },
        {
            "v": "12.5",
            "title": "نمودارهای بیشتر",
            "message": "در شیت گزارش‌ساز (هدف‌گذاری)، انواع نمودارهای جدید اضافه شد تا تحلیل داده‌ها آسان‌تر شود."
        },
        {
            "v": "12.5",
            "title": "نمایش چند فیلد در یک نمودار",
            "message": "قابلیت نمایش چندین فیلد داده‌ای روی یک نمودار در تمامی شیت‌های گزارش‌ساز (پخش، مالی و هدف‌گذاری) فراهم شد. به‌عنوان مثال می‌توان «تارگت ریالی» و «فروش ریالی» را در یک نمودار مشاهده کرد و روند و فاصله بین آن‌ها را با یک نگاه تشخیص داد."
        },
        {
            "v": "12.5",
            "title": "افزودن پخش نخبگان",
            "message": "پخش نخبگان به لیست پخش‌های موجود در شیت هدف‌گذاری اضافه شد و امکان ثبت تارگت برای این پخش نیز فراهم گردید."
        },
        {
            "v": "12.5",
            "title": "رفع مشکل فاکتورهای ابطالی",
            "message": "فاکتورهای ابطالی مربوط به سیستم مالی راهکاران از تمامی بخش‌های مرتبط با فاکتورها خارج شد و مشکل نمایش آن‌ها رفع گردید."
        },
        {
            "v": "12.5",
            "title": "افزوده شدن اطلاعات شرکت صنایع غذایی ژوبین مهر",
            "message": ""
        },
        {
            "v": "12.6",
            "title": "بهبود ناوبری گزارشات",
            "message": "امکان باز کردن گزارشات در تب‌های جدید با راست‌کلیک کردن و انتخاب 'Open in new tab' و یا با استفاده از دکمه اسکرول موس فراهم گردید."
        },
        {
            "v": "12.6",
            "title": "رفع مشکل ضریب موجودی در گزارش پخش",
            "message": "مشکل ضریب موجودی در گزارش پخش شیت عملیات رفع شد. اکنون امکان تعریف ضریب به صورت غیرعددی برای محصولاتی که در سیستم مالی به صورت بسته‌ای ولی در پخش به صورت عددی تعریف شده‌اند، فراهم است."
        },
        {
            "v": "12.6",
            "title": "نمایش کامل محصولات تعریف شده",
            "message": "مشکل عدم نمایش محصولاتی که در سیستم مالی تعریف شده‌اند ولی هنوز برای آن‌ها فاکتوری ثبت نگردیده است، رفع شد. از این پس می‌توانید تمامی محصولات را به محض تعریف در سیستم مالی در این سامانه مشاهده کنید."
        },
        {
            "v": "12.6",
            "title": "رفع مشکل جابه‌جایی بین گزارشات",
            "message": "مشکل جابه‌جایی بین گزارشات زمانی که فیلترها تغییر می‌کردند برطرف گردید و اکنون انتقال بین گزارشات به‌طور صحیح انجام می‌شود."
        }


    ];
    $("#versionDetails").dxPopup({
        title: `✨ نسخه ${messages[messages.length - 1].v} منتشر شد.
شما هم‌اکنون در حال مشاهده تغییرات این نسخه هستید.`,
        visible: true,
        showCloseButton: true,
        width: "50vw",
        height: "70vh",
        dragEnabled: true,
        rtlEnabled: true,
        contentTemplate: function (contentElement) {

            // 1. Create dxScrollView inside the popup
            const $scrollView = $("<div>")
                .appendTo(contentElement)
                .dxScrollView({
                    height: "55vh", // You can adjust this as needed
                    direction: "vertical",
                    showScrollbar: "onHover"
                });
            // 2. Get the content area of dxScrollView
            const $scrollContent = $scrollView.dxScrollView("instance").content();
            // 3. Group messages by version
            const grouped = messages.reduce((acc, item) => {
                acc[item.v] = acc[item.v] || [];
                acc[item.v].push(item);
                return acc;
            }, {});
            // 4. Sort version keys descending
            const sortedVersions = Object.keys(grouped).sort((a, b) => parseFloat(b) - parseFloat(a));
            // 5. Render each version section inside the scroll content
            sortedVersions.forEach(version => {
                $("<p class='mb-0 text-primary'>")
                    .text(`ورژن ${version}`)
                    .css({ fontWeight: "bold", marginTop: "15px" })
                    .appendTo($scrollContent);
                const ul = $("<ul>").css({ padding: "10px", margin: 0 });
                grouped[version].forEach(item => {
                    $("<li>")
                        .html(`<strong>${item.title}:</strong> <span>${item.message}</span>`)
                        .css({ marginBottom: "8px", listStyleType: "disc" })
                        .appendTo(ul);
                });
                $(ul).appendTo($scrollContent);
            });
        },
        onShowing: function () {
            popUpCss(); // Your custom CSS adjustments
        },
        onHidden: function (e) {
            var data = {}
            $.ajax({
                url: '../controller/services.asmx/updatesIsSeen',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ data: data }),
                success: function (response) {
                    checkAccess(response);
                },
                error: function (xhr, status, error) {
                    alert('خطای سیستمی')
                },
            });
        }

    });
}
function popUpCss(type = "") {
    var bg = "globalBg"
    if (type == 'month') {
        bg = "monthHeaderBg"
    }
    if (type == 'state') {
        bg = "stateHeadBg"
    }
    if (type == 'dist') {
        bg = "bg-primary"
    }
    if (type == 'proformaPart') {
        bg = "bg-proformaPart"
    }
    if (type == 'proforma') {
        bg = "bg-proforma"
    }
    if (type == 'proformaProduct') {
        bg = "bg-proformaProduct"
    }
    $(".dx-icon.dx-icon-close").css('color', 'white')
    $(".dx-item-content.dx-toolbar-item-content").css('color', 'white')
    $(".dx-toolbar.dx-widget.dx-rtl.dx-visibility-change-handler.dx-collection.dx-popup-title.dx-has-close-button").last().addClass(bg)
    setTimeout(function () {
        $(".dx-overlay-wrapper.dx-popup-wrapper.dx-overlay-modal.dx-overlay-shader").last().css('background', '#1872755e')
    }, 10)
    $(".dx-popup-title").last().find('.dx-item.dx-toolbar-item.dx-toolbar-label').css("font-size", "15px");
    $(".globalItem").last().addClass(bg)
}
function initToast() {
    $("#toastContainer").dxToast({
        message: "",
        rtlEnabled: true,
        type: "success", // Default type
        displayTime: 3000, // Toast will disappear after 3 seconds
        position: {
            at: "bottom center",  // Position at bottom center
            my: "bottom center",
            offset: "0 -50"  // Move it 50px up from the bottom
        }
    });
}
function toast(msg = "", type = "success", delay = 3000) {
    var toastInstance = $("#toastContainer").dxToast("instance");
    toastInstance.option({
        message: msg,
        width: "auto",
        type: type,
        displayTime: delay
    });
    toastInstance.show();
}
let allData = {};
function productOperations() {
    getCompanyProductDist()
}
function priceOperations() {
    GetLinkedProductFinanace()
}
function getServiceLog() {
    getServiceLogData()
}
function getServiceLogData(data) {
    var data = getcomboValues()
    $.ajax({
        url: '../controller/services.asmx/GetServiceLog',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            checkAccess(response);
            response = JSON.parse(response.d);
            genServiceLogDataTbl(response);
        },
        error: function (xhr, status, error) {
            alert('خطای دریافت سوابق')
        },
    });
}
function genServiceLogDataTbl(data) {
    var grid = $("#serviceLogTbl").data("dxDataGrid");
    if (grid) {
        // If dxDataGrid exists, just update the dataSource
        grid.option("dataSource", data);
        grid.refresh();
        return
    }
    $("#serviceLogTbl").dxDataGrid({
        dataSource: data,
        rtlEnabled: true,
        height: "85vh",
        columns: [
            {
                dataField: "companyName_FA", caption: "شرکت"
            },
            {
                dataField: "srcIsDist", caption: "سرویس",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    var displayClassTxt = (options.data.srcIsDist == 1) ? "وب سرویس" : "مالی";
                    if (options.data.serviceType == 1) {
                        displayClassTxt += " فروش"
                    }
                    if (options.data.serviceType == 2) {
                        displayClassTxt += " موجودی"
                    }
                    container.html(`<span>\u200E${displayClassTxt}</span>`);
                }
            },
            {
                dataField: "distributorName", caption: "پخش"
            },
            {
                dataField: "actionStart", caption: "شروع به روز رسانی",
                cellTemplate: function (container, options) {
                    var formattedDate = "";
                    if (options.data.actionStart) {
                        var a = new Date(options.data.actionStart);
                        var formattedDate = a.toLocaleString('fa-IR');
                    }
                    else {
                        formattedDate = "خطا"
                    }
                    container.html(`<span>\u200E${formattedDate}</span>`);
                }
            },
            {
                dataField: "actionEnd", caption: "پایان به روزر سانی",
                cellTemplate: function (container, options) {
                    var formattedDate = "";
                    if (options.data.actionEnd) {
                        var a = new Date(options.data.actionEnd);
                        var formattedDate = a.toLocaleString('fa-IR');
                    }
                    else {
                        formattedDate = "خطا"
                    }
                    container.html(`<span>\u200E${formattedDate}</span>`);
                }
            },
            {
                dataField: "updateType", caption: "نوع به روزرسانی"
            },
            {
                dataField: "success", caption: "وضعیت",
                cellTemplate: function (container, options) {
                    var displayTxt = ""
                    if (options.data.success == 1) {
                        displayTxt = "موفق"
                    }
                    if (options.data.success == 0) {
                        displayTxt = "ناموفق"
                    }
                    container.html(`<span>\u200E${displayTxt}</span>`);
                }
            }
        ],
        onRowPrepared: function (e) {
            if (e.rowType === "data") {
                if (e.data.success == 1) {
                    e.rowElement.css("background-color", "#E8F5E9");
                }
                if (e.data.success == 0) {
                    e.rowElement.css("background-color", "#fcd2d2");
                }
            }
        },
        allowColumnResizing: true,
        showBorders: true,
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        scrolling: {
            mode: "virtual" // Enables internal scrolling inside the DataGrid
        },
        masterDetail: {
            enabled: true,
            template: function (container, options) {
                //var data = { financePrdtId: options.key.financePrdtId }
                loader('show')
                $.ajax({
                    url: '../controller/services.asmx/GetServiceLogDetail',
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ data: options.data }),
                    success: function (response) {
                        loader('hide')
                        checkAccess(response)
                        var dataDb = JSON.parse(response.d)
                        if (data.length) {
                            // Create a container for the details
                            $("<div>")
                                .addClass("detail-container")
                                .appendTo(container)
                                .dxDataGrid({
                                    dataSource: dataDb,
                                    rtlEnabled: true,
                                    columns: [
                                        {
                                            dataField: "companyName_FA", caption: "شرکت"
                                        },
                                        {
                                            dataField: "srcIsDist", caption: "سرویس",
                                            cellTemplate: function (container, options) {
                                                var displayClass = ""
                                                var displayClassTxt = (options.data.srcIsDist == 1) ? "وب سرویس" : "مالی";
                                                if (options.data.serviceType == 1) {
                                                    displayClassTxt += " فروش"
                                                }
                                                if (options.data.serviceType == 2) {
                                                    displayClassTxt += " موجودی"
                                                }
                                                container.html(`<span>\u200E${displayClassTxt}</span>`);
                                            }
                                        },
                                        {
                                            dataField: "distributorName", caption: "پخش"
                                        },
                                        {
                                            dataField: "actionStart", caption: "شروع به روز رسانی",
                                            cellTemplate: function (container, options) {
                                                var formattedDate = "";
                                                if (options.data.actionStart) {
                                                    var a = new Date(options.data.actionStart);
                                                    var formattedDate = a.toLocaleString('fa-IR');
                                                }
                                                else {
                                                    formattedDate = "خطا"
                                                }
                                                container.html(`<span>\u200E${formattedDate}</span>`);
                                            }
                                        },
                                        {
                                            dataField: "actionEnd", caption: "پایان به روزر سانی",
                                            cellTemplate: function (container, options) {
                                                var formattedDate = "";
                                                if (options.data.actionEnd) {
                                                    var a = new Date(options.data.actionEnd);
                                                    var formattedDate = a.toLocaleString('fa-IR');
                                                }
                                                else {
                                                    formattedDate = "خطا"
                                                }
                                                container.html(`<span>\u200E${formattedDate}</span>`);
                                            }
                                        },
                                        {
                                            dataField: "updateType", caption: "نوع به روزرسانی"
                                        },
                                        {
                                            dataField: "success", caption: "وضعیت",
                                            cellTemplate: function (container, options) {
                                                var displayTxt = ""
                                                if (options.data.success == 1) {
                                                    displayTxt = "موفق"
                                                }
                                                if (options.data.success == 0) {
                                                    displayTxt = "ناموفق"
                                                }
                                                container.html(`<span>\u200E${displayTxt}</span>`);
                                            }
                                        }
                                    ],
                                    onRowPrepared: function (e) {
                                        if (e.rowType === "data") {
                                            if (e.data.success == 1) {
                                                e.rowElement.css("background-color", "#8ea08f").css("color", "#ffffff");
                                            }
                                            if (e.data.success == 0) {
                                                e.rowElement.css("background-color", "#a27c7c").css("color", "#ffffff");;
                                            }
                                        }
                                    },
                                    allowColumnResizing: true,
                                    showBorders: false,
                                    paging: { enabled: false },
                                    sorting: { mode: "multiple" },
                                    filterRow: { visible: false },
                                    scrolling: {
                                        mode: "virtual" // Enables internal scrolling inside the DataGrid
                                    }
                                }).parent().addClass("p-3");
                        }
                        else {
                            var msg = ` تاکنون قیمتی برای محصول ${options.data.name} ثبت نشده است`
                            $("<div>").addClass("px-3").appendTo(container).html(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-return-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5"/>
                            </svg><span class="text-danger">${msg}</span>`).parent().addClass("p-1")
                        }
                    },
                    error: function (xhr, status, error) {
                        alert('خطای دریافت لیست محصولات')
                    },
                    async: false
                });
            }
        },
    });
}
function GetLinkedProductFinanace() {
    var data = getcomboValues()
    $.ajax({
        url: '../controller/services.asmx/GetLinkedProductFinanace',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            checkAccess(response);
            response = JSON.parse(response.d);
            genProductPriceTbl(response);
        },
        error: function (xhr, status, error) {
            alert('خطای دریافت لیست محصولات')
        },
    });
}
function getCompanyProductDist() {
    var data = getcomboValues()
    $.ajax({
        url: '../controller/services.asmx/GetCompanyProductDist',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            checkAccess(response)
            response = JSON.parse(response.d)
            genProductDistHtml(response)
        },
        error: function (xhr, status, error) {
            alert('خطای دریافت لیست محصولات')
        },
        async: false
    });
}

function genProductDistHtml(data) {
    var selectedCompanies = $("#comboCo").dxTagBox('option', 'value')
    if (selectedCompanies.length != 1) {
        showToast("لطفا فقط یک شرکت انتخاب نمایید", "warning")
        $("#dcompanyTbl").hide()
        return
    }
    if ($("#dcompanyTbl").data("dxDataGrid")) {
        $("#dcompanyTbl").dxDataGrid("instance").dispose(); // Destroy the grid
        $("#dcompanyTbl").empty(); // Remove all elements inside the container
    }
    $("#dcompanyTbl").show()
    $("#dcompanyTbl").dxDataGrid({
        dataSource: data.distProducts,
        rtlEnabled: true,
        height: "85vh",
        columns: [
            { dataField: "financePrdtId", caption: "financePrdtId", dataType: "number", visible: false },
            { dataField: "dprName", caption: "نام محصول در پخش", allowEditing: false },
            {
                dataField: "companyId",
                caption: "شرکت",
                allowEditing: false,
                lookup: {
                    dataSource: allData.companies,
                    valueExpr: "cId",
                    displayExpr: "cName_FA"
                },
            },
            { dataField: "distributorName", caption: "پخش", allowEditing: false },
            {
                dataField: "fprId",
                caption: "متصل شده به محصول مالی",
                lookup: {
                    dataSource: data.fncProducts,
                    valueExpr: "financePrdtId",
                    displayExpr: "name"
                },
            },
            //{ dataField: "ratio", caption: "ضریب محاسبه در موجودی تعدادی", type: "number", allowEditing: true }
            {
                dataField: "ratio",
                caption: "ضریب محاسبه در موجودی تعدادی",
                editorType: "dxNumberBox",
                allowEditing: true,
                editorOptions: {
                    format: "#,##0.###",  // نمایش تا 3 رقم اعشار
                    showSpinButtons: false,
                    rtlEnabled: true,
                    precision: 3,
                    useMaskBehavior: true,
                    min: 0,
                    step: 0.1
                }
            }
        ],
        export: {
            enabled: true
        },
        onExporting: function (e) {
            const grid = e.component;
            grid.columnOption("financePrdtId", "visible", true);
        },
        onExported: function (e) {
            const grid = e.component;
            grid.columnOption("financePrdtId", "visible", false);
        },
        allowColumnResizing: true,
        showBorders: true,
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        editing: {
            mode: "row",
            allowUpdating: true,
            useIcons: true
        },
        scrolling: {
            mode: "virtual" // Enables internal scrolling inside the DataGrid
        },
        onRowUpdating: function (e) {
            $("#dcompanyTbl").dxDataGrid("instance").refresh();
            loader('show')
            var data = {
                dprId: e.key.dprId,
                fprId: (e.newData.hasOwnProperty("fprId")) ? e.newData.fprId : e.oldData.fprId,
                ratio: (e.newData.hasOwnProperty("ratio")) ? e.newData.ratio : e.oldData.ratio
            }
            $.ajax({
                url: '../controller/services.asmx/updateProductFinanceDist',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ fprId: data.fprId, dprId: data.dprId, ratio: data.ratio }),
                success: function (response) {
                    loader('hide')
                    checkAccess(response)
                    response = JSON.parse(response.d)
                    var msg = `تغییرات با موفقیت ذخیره شد`
                    toast(msg);
                },
                error: function (xhr, status, error) {
                    alert('خطای دریافت لیست محصولات')
                },
            })
        },
        onRowPrepared: function (e) {
            if (e.rowType === "data" && e.data.fprId === null) {
                e.rowElement.css("background-color", "#fea7a7"); // Set background color to red
                e.rowElement.css("color", "black"); // Make text readable
            }
        }
    });
}
function genProductPriceTbl(data) {
    var grid = $("#priceCompanyTbl").data("dxDataGrid");
    if (grid) {
        grid.option("dataSource", data);
        grid.refresh();
        return
    }
    $("#priceCompanyTbl").dxDataGrid({
        dataSource: data,
        rtlEnabled: true,
        height: "85vh",
        columns: [
            { dataField: "financePrdtId", caption: "financePrdtId", dataType: "number", visible: false },
            { dataField: "name", caption: "نام محصول", width: "auto", allowEditing: false },
            { dataField: "number", caption: "کد محصول", allowEditing: false },
            {
                dataField: "brandId",
                caption: "برند",
                lookup: {
                    dataSource: allData.brands,
                    valueExpr: "bId",
                    displayExpr: "bName_FA"
                }
                , cellTemplate: function (container, options) {
                    var color = allData.brands.find(o => { return o.bId == options.data.brandId })?.colorCode
                    container.html(`<span style="color: ${color}; letter-spacing: -3px;padding:2px;">■■■</span>&nbsp;<span>${options.displayValue}</span>`);
                }
            },
            {
                dataField: "p1",
                caption: "قیمت P1 بدون مالیات(ریال)",
                calculateDisplayValue: function (rowData) {
                    return threeDigit(rowData.p1);
                }
            },
            {
                dataField: "p2",
                caption: "قیمت P2 بدون مالیات(ریال)",
                calculateDisplayValue: function (rowData) {
                    return threeDigit(rowData.p2);
                }
            },
            {
                dataField: "p3",
                caption: "قیمت P3 بدون مالیات(ریال)",
                calculateDisplayValue: function (rowData) {
                    return threeDigit(rowData.p3);
                }
            },
        ],
        allowColumnResizing: true,
        showBorders: true,
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        export: {
            enabled: true
        },
        onExporting: function (e) {
            const grid = e.component;
            grid.columnOption("financePrdtId", "visible", true);
        },
        onExported: function (e) {
            const grid = e.component;
            grid.columnOption("financePrdtId", "visible", false);
        },
        editing: {
            mode: "row",
            allowUpdating: true,
            useIcons: true
        },
        scrolling: {
            mode: "virtual" // Enables internal scrolling inside the DataGrid
        },
        onRowUpdating: function (e) {
            $("#priceCompanyTbl").dxDataGrid("instance").refresh();
            var data = {
                p1: (e.newData.hasOwnProperty("p1")) ? e.newData.p1 : e.oldData.p1,
                p2: (e.newData.hasOwnProperty("p2")) ? e.newData.p2 : e.oldData.p2,
                p3: (e.newData.hasOwnProperty("p3")) ? e.newData.p3 : e.oldData.p3,
                brandId: (e.newData.hasOwnProperty("brandId")) ? e.newData.brandId : e.oldData.brandId,
                financePrdtId: e.key.financePrdtId
            }
            loader('show')
            $.ajax({
                url: '../controller/services.asmx/updateProductFinancePrice',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ data: data }),
                success: function (response) {
                    loader('hide')
                    checkAccess(response)
                    response = JSON.parse(response.d)
                    if (response[0]?.success) {
                        $("#priceCompanyTbl").dxDataGrid("instance").refresh();
                        $("#priceCompanyTbl").dxDataGrid("instance").cancelEditData();
                        var msg = `تغییرات برای محصول ${e.key.name} با موفقیت ذخیره شد`
                        toast(msg);
                    }
                    else {
                        e.cancel = true;
                        $("#priceCompanyTbl").dxDataGrid("instance").cancelEditData();
                        var msg = ` خطای ذخیره تغییرات برای محصول ${e.key.name} `
                        toast(msg, "error");
                    }
                },
                error: function (xhr, status, error) {
                    alert('خطای دریافت لیست محصولات')
                },
                async: false
            });
            // Prevent default saving behavior (because we're handling it via AJAX)
            //e.cancel = true;
        },
        masterDetail: {
            enabled: true,
            template: function (container, options) {
                var data = { financePrdtId: options.key.financePrdtId }
                loader('show')
                $.ajax({
                    url: '../controller/services.asmx/getProductFinancePriceLog',
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ data: data }),
                    success: function (response) {
                        loader('hide')
                        checkAccess(response)
                        var data = JSON.parse(response.d)
                        if (data.length) {
                            // Create a container for the details
                            $("<div>")
                                .addClass("detail-container")
                                .appendTo(container)
                                .dxDataGrid({
                                    dataSource: data, // Assuming 'details' is an array in your data
                                    showBorders: true,
                                    columnAutoWidth: true,
                                    rtlEnabled: true,
                                    columns: [
                                        { dataField: "fullName", caption: "ویرایش کننده" },
                                        {
                                            dataField: "uidt",
                                            caption: "زمان ویرایش",
                                            calculateDisplayValue: function (rowData) {
                                                var a = new Date(rowData.uidt);
                                                var time = a.toLocaleString('fa-IR');
                                                return time;
                                            }
                                        },
                                        {
                                            dataField: "brandId",
                                            caption: "برند",
                                            lookup: {
                                                dataSource: allData.brands,
                                                valueExpr: "bId",
                                                displayExpr: "bName_FA"
                                            }
                                            , cellTemplate: function (container, options) {
                                                var color = allData.brands.find(o => { return o.bId == options.data.brandId })?.colorCode
                                                container.html(`<span style="color: ${color}; letter-spacing: -3px;padding:2px;">■■■</span>&nbsp;<span>${options.displayValue}</span>`);
                                            }
                                        },
                                        {
                                            dataField: "p1",
                                            caption: "قیمت P1 (ریال)",
                                            calculateDisplayValue: function (rowData) {
                                                return threeDigit(rowData.p1);
                                            }
                                        }, {
                                            dataField: "p2",
                                            caption: "قیمت P2 (ریال)",
                                            calculateDisplayValue: function (rowData) {
                                                return threeDigit(rowData.p2);
                                            }
                                        }, {
                                            dataField: "p3",
                                            caption: "قیمت P3 (ریال)",
                                            calculateDisplayValue: function (rowData) {
                                                return threeDigit(rowData.p3);
                                            }
                                        }
                                    ]
                                }).parent().addClass("p-3");
                        }
                        else {
                            var msg = ` تاکنون قیمتی برای محصول ${options.data.name} ثبت نشده است`
                            $("<div>").addClass("px-3").appendTo(container).html(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-return-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5"/>
                            </svg><span class="text-danger">${msg}</span>`).parent().addClass("p-1")
                        }
                    },
                    error: function (xhr, status, error) {
                        alert('خطای دریافت لیست محصولات')
                    },
                    async: false
                });
            }
        },
    });
}
function genProductFinanceCmb(element, dprId, fprId) {
    if ($(element).find('select').length > 0) {
        return;
    }
    else {
    }
    var selectId = `dp-${dprId || "0"}`;
    var html = `<select id="${selectId}" class="selectpicker" data-live-search="true"></select>`;
    $(element).html(html);
    var selected = '';
    var options = `<option value="0" class="d-none" disabled>
                       انتخاب محصول از سیستم مالی
                   </option>`;
    var cId = $("#dcompanyCombo").val();
    var data = GetCompanyProductFinanace(cId, async = false)
    var sItem = { Name: 'نامشخص', financePrdtId: '0' }
    data.unshift(sItem)
    data.forEach(p => {
        selected = '';
        if (p.financePrdtId == fprId) selected = 'selected'
        options += `<option value="${p.financePrdtId}" ${selected}>
                        <span>&rlm;${p.Name}  ${p.number || ""}</span>
                    </option>`;
    });
    $(`#${selectId}`).html(options);
    $(`#${selectId}`).selectpicker('destroy').selectpicker();
    $(`#${selectId}`).selectpicker('toggle');
    $(`#${selectId}`).on('change', function () {
        var id = $(this).val();
        updateProductFinanceDist(id, dprId)
    });
}
function manageUrlParams(mode, tb, sht) {
    if (mode == "refresh") {
        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        var initialTabSheet = urlParams.get('sheet')
        var lTab;
        var lSheet;
        if (initialTabSheet === null) {
            lTab = allData.userUiElements.tabs[0].tabNo
            lSheet = allData.userUiElements.sheets.find(o => { return o.tabNo == lTab })?.sheetNo
            tb = lTab
            sht = lSheet
        }
        else {
            lTab = initialTabSheet.split("-")[0]
            lSheet = initialTabSheet.split("-")[1]
            tb = allData.userUiElements.tabs.find(o => { return o.tabNo == lTab })?.tabNo
            sht = allData.userUiElements.sheets.find(o => { return (o.sheetNo == lSheet && o.tabNo == lTab) })?.sheetNo

            if (tb === undefined || sht === undefined) {
                tb = allData.userUiElements.tabs[0].tabNo
                sht = allData.userUiElements.sheets[0].sheetNo
            }
            else {
                tb = lTab
                sht = lSheet
            }
        }

    }
    else if (mode == "combo") {

        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        var initialTabSheet = urlParams.get('sheet')
        //tb = initialTabSheet.split("-")[0]
        tb = $("#cmbOp").dxSelectBox('option', 'selectedItem').value
        sht = initialTabSheet.split("-")[1]
        //sht = allData.userUiElements.sheets.find(o => { return o.tabNo == tb })?.sheetNo;
    }
    else if (mode == "click") {
        tb = tb;
        sht = sht;
    }
    sht = sht.toString();

    $("#cmbDateFrom").show()
    $("#cmbDateTo").show()
    $("#cmbBrand").show()
    $("#cmbPrd").show()
    $("#cmbCust").hide()
    $("#cmbCo").show()
    $("#cmbDist").show()

    var tab = tb;
    var sheet = sht;
    displayGroupMessages(sheet, allData.notifs);
    if (tab == 1) {
        $("#comboDist").show()
        $(".main-tab").hide()
        switch (sheet) {
            case "0":
                getDashboardData();
                break;
            case "1":
                getReportDist();
                break;
            case "7":
                getSaleStockRate();
                break;
            case "8":
                $("#cmbDateFrom").hide()
                $("#cmbDateTo").hide()
                getExpiryDateStock();
                break;
            case "9":
                $("#cmbDateFrom").hide()
                $("#cmbDateTo").hide()
                $("#cmbCo").hide()
                $("#cmbDist").hide()
                $("#cmbBrand").hide()
                $("#cmbPrd").hide()
                GetCustomerStateMap();
            case "10":
                $("#cmbDateFrom").hide()
                $("#cmbDateTo").hide()
                $("#cmbCo").hide()
                $("#cmbDist").hide()
                $("#cmbBrand").hide()
                $("#cmbPrd").hide()
                GetTrendingProducts();
                break;
            case "15":
                initPivotChk();
                break;

        }
    }
    if (tab == 2) {
        $("#cmbDist").hide()
        $(".main-tab").hide()
        switch (sheet) {
            case "0":
                getDashboardDataFinance();
                break;
            case "1":
                getReportFinance();
                break;
            case "15":
                getPivotDataFinance();
                break;

        }
    }
    if (tab == 3) {
        $("#comboDist").show()
        $(".main-tab").hide();
        switch (sheet) {
            case "2":
                $("#cmbDateFrom").hide()
                $("#cmbDateTo").hide()
                $("#cmbBrand").hide()
                $("#cmbPrd").hide()
                productOperations()
                break;
            case "3":
                $("#cmbDateFrom").hide()
                $("#cmbDateTo").hide()
                $("#cmbBrand").hide()
                $("#cmbPrd").hide()
                getServiceLog();
                break;
            case "4":
                $("#cmbDateFrom").hide()
                $("#cmbDateTo").hide()
                $("#cmbBrand").hide()
                $("#cmbPrd").hide()
                $("#cmbDist").hide()
                priceOperations()
                break;

        }
    }
    if (tab == 4) {
        //alert('در حال به روز رسانی...')
        //return
        switch (sheet) {
            case "1":
                $("#cmbDateFrom").hide()
                $("#cmbDateTo").hide()
                $("#cmbBrand").hide()
                $("#cmbPrd").hide()
                $("#cmbDist").hide()
                $(".main-tab").hide()
                $("#tab4").show();
                initProformaReport();
            case "2":
                $("#cmbDateFrom").hide()
                $("#cmbDateTo").hide()
                $("#cmbBrand").hide()
                $("#cmbPrd").hide()
                $("#cmbDist").hide()
                $(".main-tab").hide()
                $("#tab4").show();
                matchProductTemp();
                break;
        }
    }
    if (tab == 5) {
        $("#comboDist").show()
        $(".main-tab").hide();
        switch (sheet) {
            case "1":
                $("#cmbDateFrom").hide()
                $("#cmbDateTo").hide()
                $("#cmbDist").hide()
                targetOperations()
                break;
            case "2":
                getPivotDataTarget();
                break;

        }
    }
    if (tab == 6) {
        $("#comboDist").hide()
        $(".main-tab").hide();
        $("#cmbDateFrom").hide()
        $("#cmbDateTo").hide()
        $("#cmbDist").hide()
        $("#cmbBrand").hide()
        $("#cmbPrd").hide()

        switch (sheet) {
            //case "1":
            //    $("#cmbDateFrom").hide()
            //    $("#cmbDateTo").hide()
            //    $("#cmbDist").hide()
            //    GetDebitData()
            //    break;
            case "2":
                GetDebitDashboardData()
                break;
            case "3":
                $("#cmbCust").show()
                GetCustomerAnalyzeData("multiple")
                break;
            case "4":
                $("#cmbCust").show()
                GetCustomerAnalyzeData("single")
                GetInvoiceBreakDownData()
                break;

        }

    }
    if (tab == 7) {
        $("#comboDist").hide()
        $(".main-tab").hide();
        $("#cmbDateFrom").hide()
        $("#cmbDateTo").hide()
        $("#cmbDist").hide()
        $("#cmbBrand").hide()
        $("#cmbPrd").hide()

        switch (sheet) {
            case "1":
                $("#cmbCust").show()
                GetPayableGridData()
                GetPaymentTimeBreakDownData()
                break;
        }

    }
    $("#tab" + tab).show();
    //$("#cmbOp").dxSelectBox('option', 'value', tab)
    updateUrlParameter('sheet', tab + '-' + sheet)
    $("#tab" + tab).find(".active").removeClass("active");
    $("#tab" + tab).find(`[data-target="#sheet-${tab}-${sheet}"]`).addClass("active");
    $("#tab" + tab).find('[id^="sheet-"]').hide();
    $("#tab" + tab).find(`#sheet-${tab}-${sheet}`).show();

    setSetting("lastTab", tab, false)
    setSetting("lastSheet", sheet)
}
function GetCustomerAnalyzeData(mode = "multiple") {

    var data = getcomboValues();
    // console.log(data);
    loader('show')
    $.ajax({
        url: '../controller/services.asmx/GetCustomerAnalyzeData',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),

        success: function (response) {
            loader('hide');
            checkAccess(response)
            response = JSON.parse(response.d)

            genCustomerAnalyzeHtml(response, mode)
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function GetInvoiceBreakDownData() {

    var data = getcomboValues();
    // console.log(data);
    loader('show')
    $.ajax({
        url: '../controller/services.asmx/GetInvoiceBreakDownData',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),

        success: function (response) {
            loader('hide');
            checkAccess(response)
            response = JSON.parse(response.d)
            //  console.log(response)

            initBreakDownGrid(response.InvoiceBreakDownData, "InvoiceBreakDown")
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function GetPaymentTimeBreakDownData() {

    var data = getcomboValues();
    //console.log(data);
    loader('show')
    $.ajax({
        url: '../controller/services.asmx/GetPaymentTimeBreakDownData',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),

        success: function (response) {
            loader('hide');
            checkAccess(response)
            response = JSON.parse(response.d)
            //  console.log(response)

            initBreakDownGrid(response.PaymentTimeBreakDownData, "PaymentBreakDown")
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function GetDebitDashboardData() {
    var data = getcomboValues();
    loader('show')
    $.ajax({
        url: '../controller/services.asmx/GetDebitDashboardData',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            loader('hide');
            checkAccess(response)
            response = JSON.parse(response.d)

            genDebitDashboardHtml(response.debitDashboardData, response.ChequeStatusData)
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function GetPayableGridData() {

    var data = getcomboValues();
    // console.log(data);
    loader('show')
    $.ajax({
        url: '../controller/services.asmx/GetPayableGridData',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),

        success: function (response) {
            loader('hide');
            checkAccess(response)
            response = JSON.parse(response.d)
            //console.log(response)
            genPayableGridDataHtml(response)
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function GetDebitData() {
    var data = getcomboValues();
    loader('show')
    $.ajax({
        url: '../controller/services.asmx/GetDebitData',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            loader('hide');
            checkAccess(response)
            response = JSON.parse(response.d)

            genDebitHtml(response.debitData)
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function genCustomerAnalyzeHtml(customerAnalyzeData, mode = "multiple") {
    if (mode == "single") {
        initBreakDownGrid(customerAnalyzeData.ChequeTimeBreakdown, "ChequeTimeBreakdownSingle")
        return
    }
    $("#invoiceData").dxDataGrid({
        dataSource: customerAnalyzeData.invoiceData,
        allowColumnResizing: true,
        columns: [
            {
                dataField: "companyId",
                caption: "شرکت",
                allowFiltering: false,
                allowGrouping: false,
                lookup: {
                    dataSource: allData.companies,
                    valueExpr: "cId",
                    displayExpr: "cName_FA"
                },
            },
            {
                dataField: "partyId",
                caption: "مشتری",
                allowFiltering: false,
                allowGrouping: false,
                //lookup: {
                //    dataSource: allData.customers,
                //    valueExpr: "PartyID",
                //    displayExpr: "FullName"
                //},
                cellTemplate: function (cellElement, cellInfo) {
                    const customer = allData.customers.find(c => c.PartyID === cellInfo.value && c.companyId === cellInfo.row.data.companyId);
                    cellElement.text(customer ? customer.FullName : "");
                }
            },
            {
                dataField: "number",
                caption: "شماره فاکتور",
                width: "",
                allowGrouping: false,
                allowFiltering: false,
            },
            {
                dataField: "price",
                caption: "مبلغ ناخالص فاکتور",
                allowGrouping: false,
                allowFiltering: false,
                cellTemplate: function (container, options) {
                    container.html(`<span class="">\u200E${threeDigit(options.value)}</span>`);
                }
            },
            {
                dataField: "AdditionAmount",
                caption: "اضافات",
                allowGrouping: false,
                allowFiltering: false,
                cellTemplate: function (container, options) {
                    container.html(`<span class="">\u200E${threeDigit(options.value)}</span>`);
                }
            },
            {
                dataField: "ReductionAmount",
                caption: "کسورات",
                allowGrouping: false,
                allowFiltering: false,
                cellTemplate: function (container, options) {
                    container.html(`<span class="">\u200E${threeDigit(options.value)}</span>`);
                }
            },
            {
                dataField: "netPrice",
                caption: "مبلغ خالص فاکتور",
                allowGrouping: false,
                allowFiltering: false,
                cellTemplate: function (container, options) {
                    container.html(`<span class="">\u200E${threeDigit(options.value)}</span>`);
                }
            },
            {
                dataField: "isReturned",
                caption: "نوع فاکتور",
                allowGrouping: false,
                lookup: {
                    dataSource: [
                        { value: 0, name: "فاکتور فروش" },
                        { value: 1, name: "مرجوعی" }
                    ],
                    valueExpr: "value",
                    displayExpr: "name"
                },
                cellTemplate: function (container, options) {
                    let text = options.value === 1 ? "مرجوعی" : "فاکتور فروش";
                    // Optional: اضافه‌کردن استایل یا رنگ‌بندی
                    let color = options.value === 1 ? "red" : "green";
                    $("<span>")
                        .text(text)
                        .css({ color: color, fontWeight: "bold" })
                        .appendTo(container);
                }
            },
            {
                dataField: "date",
                caption: "تاریخ",
                allowFiltering: false,
                allowGrouping: false,
                cellTemplate: function (container, options) {
                    if (options.value) {
                        const miladiDate = new Date(options.value);
                        const shamsiParts = miladiDate
                            .toLocaleDateString('fa-IR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            })
                            .split('/');

                        // Ensure format is yyyy/mm/dd even if locale uses different separator
                        const formatted = `${shamsiParts[0]}/${shamsiParts[1]}/${shamsiParts[2]}`;
                        $("<span>").text(formatted).appendTo(container);
                    } else {
                        container.text("-");
                    }
                }
            },
            {
                dataField: "SettlementRespite",
                caption: "فرجه",
                allowFiltering: false,
                allowGrouping: false
            },
            {
                dataField: "SettlementDate",
                caption: "سررسید",
                allowFiltering: false,
                allowGrouping: false,
                cellTemplate: function (container, options) {
                    if (options.value) {
                        const miladiDate = new Date(options.value);
                        const shamsiParts = miladiDate
                            .toLocaleDateString('fa-IR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            })
                            .split('/');

                        // Ensure format is yyyy/mm/dd even if locale uses different separator
                        const formatted = `${shamsiParts[0]}/${shamsiParts[1]}/${shamsiParts[2]}`;
                        $("<span>").text(formatted).appendTo(container);
                    } else {
                        container.text("-");
                    }
                }
            }
        ],
        summary: {
            totalItems: [
                {
                    column: "companyId",
                    displayFormat: "جمع",
                },
                {
                    column: "unMaturedAmount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "netPrice",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "price",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "ReductionAmount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "AdditionAmount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },

            ]
        },
        height: "85vh",
        rtlEnabled: true,
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        scrolling: {
            mode: "virtual" // Enables internal scrolling inside the DataGrid
        },
        grouping: {
            autoExpandAll: false
        },
        groupPanel: {
            visible: false,
            allowColumnDragging: true
        },
        masterDetail: {
            enabled: true,
            template: function (container, options) {


                var data = { companyId: options.key.companyId, invoiceId: options.key.invoiceId, isReturned: options.data.isReturned }
                loader('show')
                $.ajax({
                    url: '../controller/services.asmx/getInvoiceItems',
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ data: data }),
                    success: function (response) {
                        loader('hide')
                        checkAccess(response)
                        var data = JSON.parse(response.d)
                        // Create a container for the details
                        $("<div>")
                            .addClass("detail-container")
                            .appendTo(container)
                            .dxDataGrid({
                                dataSource: data.invoiceItemData, // Assuming 'details' is an array in your data
                                showBorders: true,
                                columnAutoWidth: true,
                                rtlEnabled: true,
                                columns: [
                                    {
                                        dataField: "GoodsName",
                                        caption: "محصول",
                                        width: "860px"
                                    },
                                    {
                                        dataField: "saleAmount",
                                        caption: "تعداد",
                                        width: "160px",
                                        calculateDisplayValue: function (rowData) {
                                            return threeDigit(rowData.saleAmount);
                                        }
                                    },
                                    {
                                        dataField: "goodsPrice",
                                        caption: "مبلغ کل",
                                        width: "160px",
                                        calculateDisplayValue: function (rowData) {
                                            return threeDigit(rowData.goodsPrice);
                                        }
                                    },
                                    {
                                        dataField: "brandId",
                                        caption: "برند",
                                        width: "160px",
                                        lookup: {
                                            dataSource: allData.brands,
                                            valueExpr: "bId",
                                            displayExpr: "bName_FA"
                                        }
                                        , cellTemplate: function (container, options) {
                                            var color = allData.brands.find(o => { return o.bId == options.data.brandId })?.colorCode
                                            container.html(`<span style="color: ${color}; letter-spacing: -3px;padding:2px;">■■■</span>&nbsp;<span>${options.displayValue}</span>`);
                                        }
                                    }
                                ]
                            }).parent().addClass("p-3");

                    },
                    error: function (xhr, status, error) {
                        alert('خطای دریافت لیست محصولات')
                    },
                    async: false
                });
            }
        },
        onRowPrepared: function (e) {
            if (e.rowType === "data") {
                if (e.data.isReturned === 0) {
                    e.rowElement.css("background-color", "rgba(0, 128, 0, 0.05)"); // light green
                } else if (e.data.isReturned === 1) {
                    e.rowElement.css("background-color", "rgba(255, 0, 0, 0.05)"); // light red
                }
            }
            masterChildStyling(e, 'debit')
        }
    })
    $("#paymentData").dxDataGrid({
        dataSource: customerAnalyzeData.paymentData,
        allowColumnResizing: true,
        columns: [
            {
                dataField: "companyId",
                caption: "شرکت",
                lookup: {
                    dataSource: allData.companies,
                    valueExpr: "cId",
                    displayExpr: "cName_FA"
                },
                allowFiltering: false
            },
            {
                dataField: "partyId",
                caption: "مشتری",
                allowFiltering: false,
                allowGrouping: false,
                //lookup: {
                //    dataSource: allData.customers,
                //    valueExpr: "PartyID",
                //    displayExpr: "FullName"
                //},
                cellTemplate: function (cellElement, cellInfo) {
                    const customer = allData.customers.find(c => c.PartyID === cellInfo.value && c.companyId === cellInfo.row.data.companyId);
                    cellElement.text(customer ? customer.FullName : "");
                }
            },
            {
                dataField: "Credit",
                caption: "بستانکار",
                cellTemplate: function (container, options) {
                    container.html(`<span class="">\u200E${threeDigit(options.value)}</span>`);
                },
                allowFiltering: false,
            },
            {
                dataField: "Debit",
                caption: "بدهکار",
                cellTemplate: function (container, options) {
                    container.html(`<span class="">\u200E${threeDigit(options.value)}</span>`);
                },
                allowFiltering: false,
            },
            {
                dataField: "voucherItemDescription",
                caption: "شرح",
                allowGrouping: false
            },
            {
                dataField: "voucherDescription",
                caption: "توضیح",
                allowGrouping: false
            },
            {
                dataField: "creationDate",
                caption: "تاریخ",
                allowFiltering: false,
                allowGrouping: false,
                cellTemplate: function (container, options) {
                    if (options.value) {
                        const miladiDate = new Date(options.value);
                        const shamsiParts = miladiDate
                            .toLocaleDateString('fa-IR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            })
                            .split('/');

                        // Ensure format is yyyy/mm/dd even if locale uses different separator
                        const formatted = `${shamsiParts[0]}/${shamsiParts[1]}/${shamsiParts[2]}`;
                        $("<span>").text(formatted).appendTo(container);
                    } else {
                        container.text("-");
                    }
                }
            },
            {
                dataField: "VoucherTypeRef",
                caption: "نوع سند پرداخت",
                allowGrouping: false,
            }
        ],
        summary: {
            totalItems: [
                {
                    column: "companyId",
                    displayFormat: "جمع",
                },
                {
                    column: "unMaturedAmount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "Credit",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "Debit",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },

            ]
        },
        height: "85vh",
        rtlEnabled: true,
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        scrolling: {
            mode: "virtual" // Enables internal scrolling inside the DataGrid
        },
        onRowPrepared: function (e) {
            if (e.rowType === "data") {
                const credit = e.data.Credit || 0;
                const debit = e.data.Debit || 0;

                if (credit > 0 && debit === 0) {
                    // ✅ Light green for Credit only
                    e.rowElement.css("background-color", "rgba(0, 128, 0, 0.05)");
                } else if (debit > 0 && credit === 0) {
                    // ✅ Light red for Debit only
                    e.rowElement.css("background-color", "rgba(255, 0, 0, 0.05)");
                } else if (credit > 0 && debit > 0) {
                    // 🟡 Optional: handle both have value (mixed)
                    e.rowElement.css("background-color", "rgba(255, 165, 0, 0.05)"); // light orange
                }
            }
            masterChildStyling(e, 'debit')
        },


    })
    $("#receivableNote").dxDataGrid({
        dataSource: customerAnalyzeData.receivableNote,
        allowColumnResizing: true,
        columns: [
            {
                dataField: "companyId",
                caption: "شرکت",
                lookup: {
                    dataSource: allData.companies,
                    valueExpr: "cId",
                    displayExpr: "cName_FA"
                },
                allowFiltering: false
            },
            {
                dataField: "partyId",
                caption: "مشتری",
                allowFiltering: false,
                allowGrouping: false,
                //lookup: {
                //    dataSource: allData.customers,
                //    valueExpr: "PartyID",
                //    displayExpr: "FullName"
                //},
                cellTemplate: function (cellElement, cellInfo) {
                    const customer = allData.customers.find(c => c.PartyID === cellInfo.value && c.companyId === cellInfo.row.data.companyId);
                    cellElement.text(customer ? customer.FullName : "");
                }
            },
            {
                dataField: "Description",
                caption: "شرح",
            },
            {
                dataField: "OperationalCurrencyAmount",
                caption: "مبلغ چک",
                allowFiltering: false,
                cellTemplate: function (container, options) {
                    container.html(`<span class="">\u200E${threeDigit(options.value)}</span>`);
                },
            },
            {
                dataField: "SerialNumber",
                caption: "شماره چک",
            },
            //{
            //    dataField: "AgreementDate",
            //    caption: "تاریخ دریافت",                
            //    allowFiltering: false,
            //    cellTemplate: function (container, options) {
            //        if (options.value) {
            //            const miladiDate = new Date(options.value);
            //            const shamsiParts = miladiDate
            //                .toLocaleDateString('fa-IR', {
            //                    year: 'numeric',
            //                    month: '2-digit',
            //                    day: '2-digit'
            //                })
            //                .split('/');

            //            // Ensure format is yyyy/mm/dd even if locale uses different separator
            //            const formatted = `${shamsiParts[0]}/${shamsiParts[1]}/${shamsiParts[2]}`;
            //            $("<span>").text(formatted).appendTo(container);
            //        } else {
            //            container.text("-");
            //        }
            //    }
            //},
            {
                dataField: "DueDate",
                caption: "موعد چک",
                allowFiltering: false,
                cellTemplate: function (container, options) {
                    if (options.value) {
                        container.html(convertToShamsi(options.value));
                    } else {
                        container.text("-");
                    }
                }
            },
            {
                dataField: "State",
                caption: "وضعیت چک",
            },
        ],
        summary: {
            totalItems: [
                {
                    column: "companyId",
                    displayFormat: "جمع",
                },
                {
                    column: "OperationalCurrencyAmount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },


            ]
        },
        height: "85vh",
        rtlEnabled: true,
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        scrolling: {
            mode: "virtual" // Enables internal scrolling inside the DataGrid
        },
        onRowPrepared: function (e) {
            if (e.rowType === "data" && e.data.DueDate) {
                const dueDate = new Date(e.data.DueDate);
                const today = new Date();

                // Normalize times
                dueDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);

                const diffInDays = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)); // days difference

                if (dueDate.getTime() === today.getTime() || (diffInDays > 0 && diffInDays <= 3)) {
                    // 🔶 Due today or within 3 days before today → orange
                    e.rowElement.css("background-color", "rgba(255, 165, 0, 0.08)");
                } else if (dueDate < today) {
                    // 🔴 Overdue → red
                    e.rowElement.css("background-color", "rgba(255, 0, 0, 0.05)");
                } else if (dueDate > today) {
                    // ✅ Future → green
                    e.rowElement.css("background-color", "rgba(0, 128, 0, 0.05)");
                }
            }
            masterChildStyling(e, 'debit')
        }


    })
    initBreakDownGrid(customerAnalyzeData.ChequeTimeBreakdown, "ChequeTimeBreakdown")
}
function initBreakDownGrid(customerAnalyzeData, id) {
    const data = customerAnalyzeData;

    const keys = data.length > 0 ? Object.keys(data[0]) : [];
    const columns = [];
    // ستون‌های ثابت
    columns.push({
        dataField: "companyId",
        caption: "شرکت",
        lookup: {
            dataSource: allData.companies,
            valueExpr: "cId",
            displayExpr: "cName_FA"
        },
        allowFiltering: false
    });

    columns.push({
        dataField: "partyId",
        caption: "مشتری",
        allowFiltering: false,
        allowGrouping: false,
        cellTemplate: function (cellElement, cellInfo) {
            const customer = allData.customers.find(c => c.PartyID === cellInfo.value && c.companyId === cellInfo.row.data.companyId);
            cellElement.text(customer ? customer.FullName : "");
        }
    });

    // ستون‌های داینامیک (غیر از companyId و partyId)
    const dynamicFields = keys.filter(k => !["companyId", "partyId"].includes(k));

    dynamicFields.forEach(field => {
        columns.push({
            dataField: field,
            caption: field === "Overdue" ? "معوق شده" : field,
            dataType: "number",
            format: "#,##0",
            alignment: "center",
            allowFiltering: false,
            allowGrouping: false
        });
    });

    // ساختن خلاصه جمع
    const totalItems = [
        {
            column: "companyId",
            displayFormat: "جمع",
        }
    ];

    dynamicFields.forEach(field => {
        totalItems.push({
            column: field,
            summaryType: "sum",
            customizeText: function (data) {
                return `${threeDigit(data.value)}`
            }
        });
    });

    // ساخت گرید
    $("#" + id).dxDataGrid({
        dataSource: data,
        columns: columns,
        showBorders: true,
        columnAutoWidth: true,
        wordWrapEnabled: true,
        rtlEnabled: true,
        height: "85vh",
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        allowColumnResizing: true,
        scrolling: {
            mode: "virtual",
            columnRenderingMode: "virtual"
        },
        summary: {
            totalItems: totalItems
        },
        onRowPrepared: function (e) {
            if (e.rowType === "data") {

            }
            masterChildStyling(e, 'debit')
        },
        onCellClick: function (e) {
            // console.log(e)
            if (e.rowType == "header") return
            // فیلتر کنیم فقط روی سلول‌های داینامیک واکنش نشون بده
            if (["companyId", "partyId"].includes(e.column.dataField)) return;

            const companyId = e.data.companyId;
            const partyId = e.data.partyId;
            const timeLabel = e.column.dataField; // همون '1404/01' یا 'Overdue'
            const amount = e.value; // اگه خواستی مبلغ رو هم داشته باشی

            if (amount === 0 || amount == null) return; // فقط وقتی مقدار داره واکنش نشون بده
            //alert(timeLabel)
            // باز کردن Popup و ارسال دیتا

            if (id.startsWith("ChequeTimeBreakdown")) {
                showChequePopup({
                    companyId: companyId,
                    partyId: partyId,
                    timeLabel: timeLabel
                });

            } else if (id.startsWith("InvoiceBreakDown")) {

                showInvoicePopup({
                    companyId: companyId,
                    partyId: partyId,
                    timeLabel: timeLabel
                });
            } else if (id.startsWith("PaymentBreakDown")) {

                showPaymentPopup({
                    companyId: companyId,
                    partyId: partyId,
                    timeLabel: timeLabel
                });
            }



        }

    });

}

function genPayableGridDataHtml(payableGridData) {
    $("#paymentVoucher").dxDataGrid({
        dataSource: payableGridData.paymentVoucher,
        allowColumnResizing: true,
        columns: [
            {
                dataField: "companyId",
                caption: "شرکت",
                lookup: {
                    dataSource: allData.companies,
                    valueExpr: "cId",
                    displayExpr: "cName_FA"
                },
                allowFiltering: false
            },
            {
                dataField: "partyId",
                caption: "مشتری",
                allowFiltering: false,
                allowGrouping: false,
                //lookup: {
                //    dataSource: allData.customers,
                //    valueExpr: "PartyID",
                //    displayExpr: "FullName"
                //},
                cellTemplate: function (cellElement, cellInfo) {
                    const customer = allData.customers.find(c => c.PartyID === cellInfo.value && c.companyId === cellInfo.row.data.companyId);
                    cellElement.text(customer ? customer.FullName : "");
                }
            },
            {
                dataField: "Credit",
                caption: "بستانکار",
                cellTemplate: function (container, options) {
                    container.html(`<span class="">\u200E${threeDigit(options.value)}</span>`);
                },
                allowFiltering: false,
            },
            {
                dataField: "Debit",
                caption: "بدهکار",
                cellTemplate: function (container, options) {
                    container.html(`<span class="">\u200E${threeDigit(options.value)}</span>`);
                },
                allowFiltering: false,
            },
            {
                dataField: "voucherItemDescription",
                caption: "شرح",
                allowGrouping: false
            },
            {
                dataField: "voucherDescription",
                caption: "توضیح",
                allowGrouping: false
            },
            {
                dataField: "creationDate",
                caption: "تاریخ",
                allowFiltering: false,
                allowGrouping: false,
                cellTemplate: function (container, options) {
                    if (options.value) {
                        const miladiDate = new Date(options.value);
                        const shamsiParts = miladiDate
                            .toLocaleDateString('fa-IR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            })
                            .split('/');

                        // Ensure format is yyyy/mm/dd even if locale uses different separator
                        const formatted = `${shamsiParts[0]}/${shamsiParts[1]}/${shamsiParts[2]}`;
                        $("<span>").text(formatted).appendTo(container);
                    } else {
                        container.text("-");
                    }
                }
            },
            {
                dataField: "VoucherTypeRef",
                caption: "نوع سند پرداخت",
                allowGrouping: false,
            }
        ],
        summary: {
            totalItems: [
                {
                    column: "companyId",
                    displayFormat: "جمع",
                },
                {
                    column: "unMaturedAmount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "Credit",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "Debit",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },

            ]
        },
        height: "60vh",
        rtlEnabled: true,
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        scrolling: {
            mode: "virtual" // Enables internal scrolling inside the DataGrid
        },
        onRowPrepared: function (e) {
            if (e.rowType === "data") {
                const credit = e.data.Credit || 0;
                const debit = e.data.Debit || 0;

                if (credit > 0 && debit === 0) {
                    // ✅ Light green for Credit only
                    e.rowElement.css("background-color", "rgba(0, 128, 0, 0.05)");
                } else if (debit > 0 && credit === 0) {
                    // ✅ Light red for Debit only
                    e.rowElement.css("background-color", "rgba(255, 0, 0, 0.05)");
                } else if (credit > 0 && debit > 0) {
                    // 🟡 Optional: handle both have value (mixed)
                    e.rowElement.css("background-color", "rgba(255, 165, 0, 0.05)"); // light orange
                }
            }
            masterChildStyling(e, 'debit')
        },


    })
    $("#payableNote").dxDataGrid({
        dataSource: payableGridData.payableNote,
        allowColumnResizing: true,
        columns: [
            {
                dataField: "companyId",
                caption: "شرکت",
                lookup: {
                    dataSource: allData.companies,
                    valueExpr: "cId",
                    displayExpr: "cName_FA"
                },
                allowFiltering: false
            },
            {
                dataField: "partyId",
                caption: "مشتری",
                allowFiltering: false,
                allowGrouping: false,
                //lookup: {
                //    dataSource: allData.customers,
                //    valueExpr: "PartyID",
                //    displayExpr: "FullName"
                //},
                cellTemplate: function (cellElement, cellInfo) {
                    const customer = allData.customers.find(c => c.PartyID === cellInfo.value && c.companyId === cellInfo.row.data.companyId);
                    cellElement.text(customer ? customer.FullName : "");
                }
            },
            {
                dataField: "Description",
                caption: "شرح",
            },
            {
                dataField: "OperationalCurrencyAmount",
                caption: "مبلغ چک",
                allowFiltering: false,
                cellTemplate: function (container, options) {
                    container.html(`<span class="">\u200E${threeDigit(options.value)}</span>`);
                },
            },
            {
                dataField: "SerialNumber",
                caption: "شماره چک",
            },
            //{
            //    dataField: "AgreementDate",
            //    caption: "تاریخ دریافت",                
            //    allowFiltering: false,
            //    cellTemplate: function (container, options) {
            //        if (options.value) {
            //            const miladiDate = new Date(options.value);
            //            const shamsiParts = miladiDate
            //                .toLocaleDateString('fa-IR', {
            //                    year: 'numeric',
            //                    month: '2-digit',
            //                    day: '2-digit'
            //                })
            //                .split('/');

            //            // Ensure format is yyyy/mm/dd even if locale uses different separator
            //            const formatted = `${shamsiParts[0]}/${shamsiParts[1]}/${shamsiParts[2]}`;
            //            $("<span>").text(formatted).appendTo(container);
            //        } else {
            //            container.text("-");
            //        }
            //    }
            //},
            {
                dataField: "DueDate",
                caption: "موعد چک",
                allowFiltering: false,
                cellTemplate: function (container, options) {
                    if (options.value) {
                        container.html(convertToShamsi(options.value));
                    } else {
                        container.text("-");
                    }
                }
            },
            {
                dataField: "State",
                caption: "وضعیت چک",
            },
        ],
        summary: {
            totalItems: [
                {
                    column: "companyId",
                    displayFormat: "جمع",
                },
                {
                    column: "OperationalCurrencyAmount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },


            ]
        },
        height: "60vh",
        rtlEnabled: true,
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        scrolling: {
            mode: "virtual" // Enables internal scrolling inside the DataGrid
        },
        onRowPrepared: function (e) {
            if (e.rowType === "data" && e.data.DueDate) {
                const dueDate = new Date(e.data.DueDate);
                const today = new Date();

                // Normalize times
                dueDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);

                // const diffInDays = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)); // days difference

                //  if (dueDate.getTime() === today.getTime() || (diffInDays > 0 && diffInDays <= 3)) {
                // 🔶 Due today or within 3 days before today → orange
                //     e.rowElement.css("background-color", "rgba(255, 165, 0, 0.08)");
                //} else if (dueDate < today) {
                // 🔴 Overdue → red
                //    e.rowElement.css("background-color", "rgba(255, 0, 0, 0.05)");
                // } else if (dueDate > today) {
                // ✅ Future → green
                //    e.rowElement.css("background-color", "rgba(0, 128, 0, 0.05)");
                // }
            }
            masterChildStyling(e, 'debit')
        }


    })
}

function showChequePopup(params) {


    var data = { companyId: params.companyId, partyId: params.partyId, timeLabel: params.timeLabel }
    loader('show')
    // ارسال به بک‌اند با AJAX
    $.ajax({
        url: '../controller/services.asmx/GetChequeTimeBreakdownDetails',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            loader('hide');
            checkAccess(response)
            response = JSON.parse(response.d)
            //  console.log(response)
            // console.log(response.ChequeTimeBreakdownDetails)
            showChequePopupGrid(response.ChequeTimeBreakdownDetails);
            // console.log(response)
            // genBrandSaleHtmlFinance(response)
        },
        error: function () {
            DevExpress.ui.dialog.alert("خطا در دریافت اطلاعات", "خطا");
        }
    });
}
function showPaymentPopup(params) {


    var data = { companyId: params.companyId, partyId: params.partyId, timeLabel: params.timeLabel }
    loader('show')
    // ارسال به بک‌اند با AJAX
    $.ajax({
        url: '../controller/services.asmx/GetPaymentTimeBreakdownDetails',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            loader('hide');
            checkAccess(response)
            response = JSON.parse(response.d)
            // console.log(response)
            // console.log(response.PaymentTimeBreakdownDetails)
            showPaymentPopupGrid(response.PaymentTimeBreakdownDetails);
            // console.log(response)
            // genBrandSaleHtmlFinance(response)
        },
        error: function () {
            DevExpress.ui.dialog.alert("خطا در دریافت اطلاعات", "خطا");
        }
    });
}
function showInvoicePopup(params) {

    // console.log(params)
    var data = { companyId: params.companyId, partyId: params.partyId, timeLabel: params.timeLabel }
    loader('show')
    // ارسال به بک‌اند با AJAX
    $.ajax({
        url: '../controller/services.asmx/GetInvoiceBreakdownDetails',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            loader('hide');
            checkAccess(response)
            response = JSON.parse(response.d)


            showInvoicePopupGrid(response.InvoiceBreakdownDetails);
            // console.log(response)
            // genBrandSaleHtmlFinance(response)
        },
        error: function () {
            DevExpress.ui.dialog.alert("خطا در دریافت اطلاعات", "خطا");
        }
    });
}
function showChequePopupGrid(data) {
    if (!data || data.length === 0) {
        // DevExpress.ui.dialog.alert("داده‌ای برای نمایش وجود ندارد", "خطا");
        showToast("در این فیلد دیتایی برای نمایش وجود ندارد!", "warning");
        return;
    }

    const companyId = data[0].companyId;
    const partyId = data[0].partyId;
    const timeLabel = data[0].timeLabel == 'Overdue' ? 'معوق شده' : data[0].timeLabel;

    const company = allData.companies.find(c => c.cId === companyId);
    const companyName = company ? company.cName_FA : `شرکت ${companyId}`;

    const customer = allData.customers.find(c => c.companyId === companyId && c.PartyID === partyId);
    const partyName = customer ? customer.FullName : `مشتری ${partyId}`;

    const popupTitle = `جزئیات چک‌های ${partyName} (${companyName}) - سررسید ${timeLabel}`;

    // نمایش Popup و ساخت گرید داخل contentTemplate
    $("#chequePopup").dxPopup({
        title: popupTitle,
        visible: true,
        width: $(window).width() > 768 ? "50vw" : "70vw",
        height: "60vh",
        maxHeight: "90vh",
        resizeEnabled: true,
        dragEnabled: true,
        showCloseButton: true,
        rtlEnabled: true,
        closeOnOutsideClick: true,
        contentTemplate: function () {
            const gridContainer = $("<div>");
            gridContainer.dxDataGrid({
                dataSource: data,
                keyExpr: "SerialNumber",
                showBorders: true,
                wordWrapEnabled: true,
                rtlEnabled: true,
                columnAutoWidth: true,
                height: "calc(100% - 20px)",
                rowAlternationEnabled: true,
                hoverStateEnabled: true,
                showRowLines: true,
                scrolling: {
                    mode: "virtual"
                },
                summary: {
                    totalItems: [
                        {
                            column: "Amount",
                            summaryType: "sum",
                            displayFormat: "جمع: {0}",
                            valueFormat: "#,##0"
                        }
                    ]
                },
                noDataText: "چکی برای این بازه زمانی یافت نشد.",
                columns: [
                    {
                        dataField: "SerialNumber",
                        caption: "شماره سریال"
                    },
                    {
                        dataField: "DueDate",
                        caption: "تاریخ سررسید",
                        dataType: "string",
                        alignment: "center"
                    },
                    {
                        dataField: "Amount",
                        caption: "مبلغ",
                        dataType: "number",
                        format: "#,##0",
                        alignment: "center"
                    },
                    {
                        dataField: "StatusTitle",
                        caption: "وضعیت",

                    },
                    {
                        dataField: "Description",
                        caption: "توضیحات"
                    }
                ]
            });
            return gridContainer;
        }
    }).dxPopup("instance").show();
}
function showPaymentPopupGrid(data) {
    if (!data || data.length === 0) {
        // DevExpress.ui.dialog.alert("داده‌ای برای نمایش وجود ندارد", "خطا");
        showToast("در این فیلد دیتایی برای نمایش وجود ندارد!", "warning");
        return;
    }

    const companyId = data[0].companyId;
    const partyId = data[0].partyId;
    const timeLabel = data[0].timeLabel == 'Overdue' ? 'معوق شده' : data[0].timeLabel;

    const company = allData.companies.find(c => c.cId === companyId);
    const companyName = company ? company.cName_FA : `شرکت ${companyId}`;

    const customer = allData.customers.find(c => c.companyId === companyId && c.PartyID === partyId);
    const partyName = customer ? customer.FullName : `مشتری ${partyId}`;

    const popupTitle = `جزئیات چک‌های ${partyName} (${companyName}) - سررسید ${timeLabel}`;

    // نمایش Popup و ساخت گرید داخل contentTemplate
    $("#paymentPopup").dxPopup({
        title: popupTitle,
        visible: true,
        width: $(window).width() > 768 ? "50vw" : "70vw",
        height: "60vh",
        maxHeight: "90vh",
        resizeEnabled: true,
        dragEnabled: true,
        showCloseButton: true,
        rtlEnabled: true,
        closeOnOutsideClick: true,
        contentTemplate: function () {
            const gridContainer = $("<div>");
            gridContainer.dxDataGrid({
                dataSource: data,
                keyExpr: "SerialNumber",
                showBorders: true,
                wordWrapEnabled: true,
                rtlEnabled: true,
                columnAutoWidth: true,
                height: "calc(100% - 20px)",
                rowAlternationEnabled: true,
                hoverStateEnabled: true,
                showRowLines: true,
                scrolling: {
                    mode: "virtual"
                },
                summary: {
                    totalItems: [
                        {
                            column: "Amount",
                            summaryType: "sum",
                            displayFormat: "جمع: {0}",
                            valueFormat: "#,##0"
                        }
                    ]
                },
                noDataText: "چکی برای این بازه زمانی یافت نشد.",
                columns: [
                    {
                        dataField: "SerialNumber",
                        caption: "شماره سریال"
                    },
                    {
                        dataField: "DueDate",
                        caption: "تاریخ سررسید",
                        dataType: "string",
                        alignment: "center"
                    },
                    {
                        dataField: "Amount",
                        caption: "مبلغ",
                        dataType: "number",
                        format: "#,##0",
                        alignment: "center"
                    },
                    {
                        dataField: "StatusTitle",
                        caption: "وضعیت",

                    },
                    {
                        dataField: "Description",
                        caption: "توضیحات"
                    }
                ]
            });
            return gridContainer;
        }
    }).dxPopup("instance").show();
}
function showInvoicePopupGrid(data) {
    if (!data || data.length === 0) {
        // DevExpress.ui.dialog.alert("داده‌ای برای نمایش وجود ندارد", "خطا");
        showToast("در این فیلد دیتایی برای نمایش وجود ندارد!", "warning");
        return;
    }

    const companyId = data[0].companyId;
    const partyId = data[0].partyId;
    const timeLabel = data[0].timeLabel == 'Overdue' ? 'معوق شده' : data[0].timeLabel;

    const company = allData.companies.find(c => c.cId === companyId);
    const companyName = company ? company.cName_FA : `شرکت ${companyId}`;

    const customer = allData.customers.find(c => c.companyId === companyId && c.PartyID === partyId);
    const partyName = customer ? customer.FullName : `مشتری ${partyId}`;

    const popupTitle = `فاکتورهای  ${partyName} (${companyName}) - سررسید ${timeLabel}`;

    // نمایش Popup و ساخت گرید داخل contentTemplate
    $("#invoicePopup").dxPopup({
        title: popupTitle,
        visible: true,
        width: $(window).width() > 768 ? "50vw" : "70vw",
        height: "60vh",
        maxHeight: "90vh",
        resizeEnabled: true,
        dragEnabled: true,
        showCloseButton: true,
        rtlEnabled: true,
        closeOnOutsideClick: true,
        contentTemplate: function () {
            const gridContainer = $("<div>");
            gridContainer.dxDataGrid({
                dataSource: data,
                keyExpr: "number",
                showBorders: true,
                wordWrapEnabled: true,
                rtlEnabled: true,
                columnAutoWidth: true,
                height: "calc(100% - 20px)",
                rowAlternationEnabled: true,
                hoverStateEnabled: true,
                showRowLines: true,
                scrolling: {
                    mode: "virtual"
                },
                summary: {
                    totalItems: [
                        {
                            column: "Amount",
                            summaryType: "sum",
                            displayFormat: "جمع: {0}",
                            valueFormat: "#,##0"
                        },
                        {
                            column: "NetPrice",
                            summaryType: "sum",
                            displayFormat: "جمع: {0}",
                            valueFormat: "#,##0"
                        }
                    ]
                },
                noDataText: " فاکتوری برای این بازه زمانی یافت نشد.",
                columns: [
                    {
                        dataField: "number",
                        caption: "شماره فاکتور"
                    },
                    {
                        dataField: "date",
                        caption: "تاریخ فاکتور",
                        dataType: "string",
                        alignment: "center",
                        cellTemplate: function (container, options) {
                            if (options.value) {
                                container.html(convertToShamsi(options.value));
                            } else {
                                container.text("-");
                            }
                        }
                    },
                    {
                        dataField: "NetPrice",
                        caption: "مبلغ فاکتور",
                        dataType: "number",
                        format: "#,##0",
                        alignment: "center"
                    },
                    {
                        dataField: "Amount",
                        caption: " بدهی اختصاص یافته",
                        dataType: "number",
                        format: "#,##0",
                        alignment: "center"
                    },
                    {
                        dataField: "DueDate",
                        caption: "تاریخ سررسید",
                        dataType: "string",
                        alignment: "center"
                    },
                    {
                        dataField: "SettlementRespite",
                        caption: "فرجه (روز)",
                        dataType: "string",
                        alignment: "center"
                    }
                ]
            });
            return gridContainer;
        }
    }).dxPopup("instance").show();
}
function getCaptionForField(field, chequeState) {

    if (chequeState && chequeState[field]) {
        return chequeState[field] || field;
    }


    const map = {
        Number: "شماره فاکتور",
        NetPrice: "مبلغ",
        SerialNumber: "شماره سریال",
        AllocatedAmount: "بدهی تخصیص‌یافته",
        SettlementDate: "تاریخ سررسید",
        SettlementRespite: "فرجه (روز)",
        maturityStatus: "وضعیت سررسید",
        receivableNoteId: "شناسه یادداشت",
        dueDate: "تاریخ سررسید",
        amount: "مبلغ",
        chequeStatus: "وضعیت چک",
        CreationDate: "تاریخ فاکتور",
        description: "توضیحات",
        timeLabel: "برچسب زمان",
        unMaturedAmount: "حساب های دریافتنی سررسید نشده",
        maturedAmount: "حساب های دریافتنی معوق",
        totalReceivableAmount: "کل حساب های دریافتنی",
        AtCashbox: "نزد صندوق",
        AtBank: "نزد بانک",
        Collected: "وصول شده",
        AssignedToOthers: "واگذار شده به غیر",
        ReturnedToPayer: "دریافتی مسترد شده",
        Protested: "واخواست شده",
        ForgottenCashbox: "چک های معوق نزد صندوق",
        AtCashboxr: "اسناد سررسید نشده نزد صندوق",
        brandNames: "برند"

    };


    return map[field] || field;
}
function getDataTypeForField(value) {
    if (typeof value === "number") return "number";
    if (value instanceof Date) return "date";
    return "string";
}

function getFormatForField(field, value) {
    const lowerField = field.toLowerCase();

    if (typeof value === "number" && (lowerField.includes("amount") || lowerField.includes("netprice"))) {
        return "#,##0";
    }
    if (lowerField.includes("date")) {
        return "yyyy/MM/dd";
    }
    return null;
}


function showDebitPopup(params) {


    var data = { companyId: params.companyId, partyId: params.partyId, timeLabel: params.timeLabel }

    loader('show')
    // ارسال به بک‌اند با AJAX
    $.ajax({
        url: '../controller/services.asmx/GetReceivableDetailsByType',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            loader('hide');
            checkAccess(response)
            response = JSON.parse(response.d)
            // console.log(params.chequeState)
            showDebitPopupGrid(response.ReceivableDetailsByType, params.chequeState);
            // console.log(response)
            // genBrandSaleHtmlFinance(response)
        },
        error: function () {
            DevExpress.ui.dialog.alert("خطا در دریافت اطلاعات", "خطا");
        }
    });
}
function showDebitPopupGrid(data, chequeState) {
    if (!data || data.length === 0) {
        // DevExpress.ui.dialog.alert("داده‌ای برای نمایش وجود ندارد", "خطا");
        showToast("در این فیلد دیتایی برای نمایش وجود ندارد!", "warning");
        return;
    }
    //console.log(data)
    //console.log(data[0].timeLabel)
    const companyId = data[0].companyId;
    const partyId = data[0].partyId;
    const timeLabel = data[0].timeLabel === 'Overdue' ? 'معوق شده' : getCaptionForField(data[0].timeLabel, chequeState);

    const company = allData.companies.find(c => c.cId === companyId);
    const companyName = company ? company.cName_FA : `شرکت ${companyId}`;

    const customer = allData.customers.find(c => c.companyId === companyId && c.PartyID === partyId);
    const partyName = customer ? customer.FullName : `مشتری ${partyId}`;

    const popupTitle = `جزئیات دریافتی‌های ${partyName} (${companyName}) - ${timeLabel}`;

    // استخراج ستون‌ها بر اساس ساختار داده
    const allowedFields = [
        "Number",
        "SerialNumber",
        "CreationDate",
        "NetPrice",
        "AllocatedAmount",
        "SettlementDate",
        "SettlementRespite",
        "brandNames",
        "maturityStatus",
        "dueDate",
        "amount",
        "chequeStatus",

        "description"
    ];

    const sampleRow = data[0];
    const columns = allowedFields
        .filter(field => field in sampleRow)
        .map(field => {
            const column = {
                dataField: field,
                caption: getCaptionForField(field, chequeState),
                alignment: typeof sampleRow[field] === "number" ? "right" : "center",
                dataType: getDataTypeForField(sampleRow[field]),
                format: getFormatForField(field, sampleRow[field])
            };

            if (["CreationDate", "dueDate", "SettlementDate"].includes(field)) {
                column.cellTemplate = function (container, options) {
                    if (options.value) {
                        const miladiDate = new Date(options.value);
                        const shamsiParts = miladiDate
                            .toLocaleDateString('fa-IR', {
                                numberingSystem: "latn",
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            })
                            .split('/');

                        const formatted = `${shamsiParts[0]}/${shamsiParts[1]}/${shamsiParts[2]}`;
                        $("<span>").text(formatted).appendTo(container);
                    } else {
                        container.text("-");
                    }
                };
                column.customizeText = function (cellInfo) {
                    if (!cellInfo.value) return "-";

                    var a = new Date(cellInfo.value);

                    var datePart = a.toLocaleDateString("fa-IR", {
                        numberingSystem: "latn",
                        year: "numeric",
                        month: "2-digit",   // 👈 دو رقمی
                        day: "2-digit"      // 👈 دو رقمی
                    });

                    var timePart = a.toLocaleTimeString("fa-IR", {
                        numberingSystem: "latn",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    });

                    var final = datePart;
                    return final
                }
            }

            return column;
        });


    $("#debitPopup").remove(); // در صورتی که قبلاً وجود داشته باشد
    $("body").append('<div id="debitPopup"></div>');

    $("#debitPopup").dxPopup({
        title: popupTitle,
        visible: true,
        width: $(window).width() > 768 ? "50vw" : "70vw",
        height: "60vh",
        maxHeight: "90vh",
        resizeEnabled: true,
        dragEnabled: true,
        showCloseButton: true,
        rtlEnabled: true,
        closeOnOutsideClick: true,
        contentTemplate: function () {
            return $("<div>").dxDataGrid({
                dataSource: data,
                showBorders: true,
                wordWrapEnabled: true,
                rtlEnabled: true,
                columnAutoWidth: true,
                rowAlternationEnabled: true,
                hoverStateEnabled: true,
                showRowLines: true,
                height: "calc(100% - 20px)",
                scrolling: { mode: "virtual" },
                columns: columns,
                summary: {
                    totalItems: columns
                        .filter(c => c.dataType === "number" && c.dataField != "Number" && c.dataField != "SettlementRespite")
                        .map(c => ({
                            column: c.dataField,
                            summaryType: "sum",
                            displayFormat: "جمع: {0}",
                            valueFormat: "#,##0"
                        }))
                },
                noDataText: "موردی برای نمایش وجود ندارد.",
                // 🔽 اضافه کردن بخش خروجی اکسل
                export: {
                    enabled: true,
                    fileName: popupTitle + allData.today,
                    allowExportSelectedData: false
                },
                toolbar: {
                    items: [
                        "exportButton" // دکمه خروجی اکسل
                    ]
                }, onExporting: function (e) {
                    // const fileName = sanitizeFileName(popupTitle + "_" + allData.today);
                    // console.log(allData.today)
                    const fileName = `${popupTitle}-${allData.today.split("/").join("")}`;
                    var workbook = new ExcelJS.Workbook();
                    var worksheet = workbook.addWorksheet("Data");

                    DevExpress.excelExporter.exportDataGrid({
                        component: e.component,
                        worksheet: worksheet,
                        autoFilterEnabled: true,
                        customizeExcelCell: function (options) {
                            const { gridCell, excelCell } = options;
                            if (
                                gridCell.column &&
                                ["amount", "NetPrice"].includes(gridCell.column.dataField)
                            ) {
                                const val = parseFloat(gridCell.value);
                                if (!isNaN(val)) {
                                    excelCell.value = val; // ✅ عدد بمونه
                                }
                            }
                        }
                    }).then(function () {
                        workbook.xlsx.writeBuffer().then(function (buffer) {
                            saveAs(
                                new Blob([buffer], { type: "application/octet-stream" }),
                                fileName + ".xlsx"
                            );
                        });
                    });

                    e.cancel = true; // جلوگیری از export پیش‌فرض
                }
            });
        }
    }).dxPopup("instance").show();
}

function genDebitDashboardHtml(debitDashboardData, ChequeStatusData) {
    //console.log(ChequeStatusData)
    debitDashboardData.forEach(function (item) {
        item.AtCashboxr = item.AtCashbox - item.ForgottenCashbox
    })
    let existingFields = debitDashboardData.length > 0 ? Object.keys(debitDashboardData[0]) : [];
    // console.log(debitDashboardData[0])
    //$("#debitDashboard").dxDataGrid({
    //    dataSource: debitDashboardData,
    //    allowColumnResizing: true,
    // ستون‌های ثابت
    let fixedColumns = [
        {
            dataField: "CustomerID",
            caption: "کد مشتری",
            visible: false
        },
        {
            dataField: "FullName",
            caption: "مشتری",
            width: "170px",
            fixed: true,
            fixedPosition: "right"
        },
        {
            dataField: "companyId",
            caption: "شرکت",
            width: "120px",
            fixed: true,
            fixedPosition: "right",
            lookup: {
                dataSource: allData.companies,
                valueExpr: "cId",
                displayExpr: "cName_FA"
            }
        },
        {
            dataField: "unMaturedAmount",
            caption: "حساب‌دریافتنی سررسید نشده",
            width: "auto",
            cellTemplate: function (container, options) {
                container.html(`<span>\u200E${threeDigit(options.data.unMaturedAmount)}</span>`);
            }
        },
        {
            dataField: "maturedAmount",
            caption: "حساب‌دریافتنی معوق",
            width: "auto",
            cellTemplate: function (container, options) {
                container.html(`<span>\u200E${threeDigit(options.data.maturedAmount)}</span>`);
            }
        },
        {
            dataField: "totalReceivableAmount",
            caption: "کل حساب‌دریافتنی",
            width: "auto",
            cellTemplate: function (container, options) {
                container.html(`<span>\u200E${threeDigit(options.data.totalReceivableAmount)}</span>`);
            }
        }
    ]; // ستون‌های داینامیک بر اساس ChequeStatusData
    let chequeColumns = ChequeStatusData
        .filter(col => existingFields.includes(col.stateEn))
        .map(function (col) {
            return {
                dataField: col.stateEn,
                caption: `اسناد ${col.title}`,
                width: "auto",
                cellTemplate: function (container, options) {
                    container.html(`<span class="cheque-cell">\u200E${threeDigit(options.value)}</span>`);
                }
            };
        });

    // ستون‌های محاسباتی اضافه (مثل AtCashboxr و ...)
    let extraColumns = [
        {
            dataField: "AtCashboxr",
            caption: "اسناد سررسیدنشده نزدصندوق",
            width: "auto",
            cellTemplate: function (container, options) {
                container.html(`<span class="cheque-cell">\u200E${threeDigit(options.value)}</span>`);
            }
        },
        {
            dataField: "ForgottenCashbox",
            caption: "اسناد معوق نزدصندوق",
            width: "auto",
            cellTemplate: function (container, options) {
                container.html(`<span>\u200E${threeDigit(options.value)}</span>`);
            }
        }
    ];
    let chequeMap = chequeColumns.reduce((acc, item) => {
        acc[item.dataField] = item.caption;
        return acc;
    }, {});

    console.log(chequeMap)
    // ترکیب همه ستون‌ها
    let allColumns = [...fixedColumns, ...chequeColumns, ...extraColumns];
    let columnOrder = [
        "FullName",
        "companyId",
        "unMaturedAmount",
        "maturedAmount",
        "totalReceivableAmount",

        "AtBank",                   // نزد بانک
        "With Agent",               // نزد مأمور وصول
        "With Agent - Delphi",      // نزد مأمور وصول - دلفی
        "AssignedToOthers",         // واگذار شده به غیر

        // --- حالت‌های Pending (در انتظار) ---
        "Pending Receipt",          // در انتظار دریافت
        "Pending Payment",          // در انتظار پرداخت
        "PendingCollection",        // در انتظار وصول
        "PendingBankAssignment",    // در انتظار واگذاری بانک
        "Pending Assignment to Agent", // در انتظار واگذاری به مأمور وصول
        "Pending Agent Collection", // در انتظار نقد شدن توسط مأمور وصول
        "Pending Endorsement",      // در انتظار واگذار به غیر
        "Pending Endorsement Order",// در انتظار دستور واگذار به غیر
        "Pending Transfer",         // در انتظار انتقال
        "Pending Transfer Payment", // در انتظار پرداخت انتقالی
        "Pending Transfer Reciept", // در انتظار دریافت انتقالی
        "Pending Settlement",       // در انتظار تسویه
        "Pending Term Change",      // در انتظار تغییر مدت
        "Pending Refund Request",   // در انتظار درخواست پرداخت استرداد
        "Pending Refund Order",     // در انتظار دستور پرداخت استرداد
        "Pending Payment Refund",   // پرداختی در انتظار استرداد
        "Pending Payment Transfer", // در انتظار انتقال پرداخت
        "Pending Guarantee to Payment", // در انتظار تضمینی به پرداختی
        "Pending Guarantee to Receipt", // در انتظار تضمینی به دریافتی
        "Pending Protest",          // در انتظار واخواست
        "Pending Protest - No Action", // در انتظار واخواست بدون اقدام
        "Pending Legal Action",     // در انتظار حقوقی شدن
        "Pending Legal Collection", // در انتظار نقد شدن حقوقی
        "Pending Return from Third Party", // در انتظار برگشت از واگذار به غیر
        "Pending Return to Treasury", // در انتظار مسترد شدن به صندوق
        "Pending Receipt Refund",
        // --- حالت‌های برگشتی / مشکل‌دار ---
        "ReturnedToPayer",          // دریافتی مسترد شده
        "ReturnedPaid",             // پرداختی مسترد شده
        "Returned - Treasury",      // مسترد شده نزد صندوق
        "Returned Payment Request", // درخواست پرداخت مسترد شده
        "Returned Payment Order",   // دستور پرداخت مسترد شده
        "Protested",                // واخواست شده
        "Defaced",                  // مخدوش
        "Unpaid",                   // پرداخت نشده

        // --- حالت‌های نهایی / خاتمه ---
        "Collected",                // وصول شده
        "CollectedByAgent",         // نقد شده توسط مامور وصول
        "Legal Collected",          // نقد شده حقوقی
        "Paid",                     // پرداخت شده
        "PaidTransferred",          // انتقال پرداخت شده
        "Settled",                  // تسویه شده
        "To Third Party",           // دستور واگذار به غیر شده
        "Legal Action",             // حقوقی شده
        "Cancelled",          // ابطال شده

        "AtCashboxr",
        "ForgottenCashbox",
        "AtCashbox"               // نزد صندوق
    ];

    allColumns.forEach(col => {
        let index = columnOrder.indexOf(col.dataField);
        if (index !== -1) {
            col.visibleIndex = index; // ترتیب نمایش
        } else {
            col.visibleIndex = 999; // ستون‌های اضافی آخر
        }
    });
    let sumColumns = allColumns
        .map(c => c.dataField) // گرفتن اسم ستون‌ها
        .filter(c => c !== "companyId" && c !== "FullName");

    // ساخت summary داینامیک
    let totalItems = [
        {
            column: "company",
            displayFormat: "جمع"
        },
        {
            column: "customer",
            displayFormat: ""   // خالی باشه
        },
        ...sumColumns.map(col => ({
            column: col,
            summaryType: "sum",
            customizeText: function (data) {
                return data.value ? threeDigit(data.value) : "0";
            }
        }))
    ];
    // ساخت گرید
    $("#debitDashboard").dxDataGrid({
        dataSource: debitDashboardData,
        allowColumnResizing: true,
        columns: allColumns,


        //columns: [
        //    {
        //        dataField: "CustomerID",
        //        caption: "کد مشتری",
        //        width: "",
        //        visible: false
        //    },
        //    {
        //        dataField: "FullName",
        //        caption: "مشتری",
        //        width: "170px",
        //        fixed: true,
        //        fixedPosition: "right"

        //    },
        //    {
        //        dataField: "companyId",
        //        caption: "شرکت",
        //        width: "120px",
        //        fixed: true,
        //        fixedPosition: "right",
        //        lookup: {
        //            dataSource: allData.companies,
        //            valueExpr: "cId",
        //            displayExpr: "cName_FA"
        //        },

        //    },
        //    {
        //        dataField: "unMaturedAmount",
        //        caption: "حساب‌دریافتنی سررسید نشده",
        //        cellTemplate: function (container, options) {
        //            container.html(`<span class="">\u200E${threeDigit(options.data.unMaturedAmount)}</span>`);
        //        },
        //        width: "auto",
        //    },
        //    {
        //        dataField: "maturedAmount",
        //        caption: "حساب‌دریافتنی معوق",
        //        cellTemplate: function (container, options) {
        //            container.html(`<span class="">\u200E${threeDigit(options.data.maturedAmount)}</span>`);
        //        },
        //        width: "auto",
        //    },
        //    {
        //        dataField: "totalReceivableAmount",
        //        caption: "کل حساب‌دریافتنی",
        //        cellTemplate: function (container, options) {
        //            container.html(`<span class="">\u200E${threeDigit(options.data.totalReceivableAmount)}</span>`);
        //        },
        //        width: "auto",
        //    },
        //    {
        //        dataField: "PendingCollection",
        //        caption: " اسناد در‌انتظار وصول",
        //        //visible: false,
        //        cellTemplate: function (container, options) {
        //            container.html(`<span class="cheque-cell">\u200E${threeDigit(options.value)}</span>`);
        //        },
        //        width: "auto",
        //    },
        //    {
        //        dataField: "PendingBankAssignment",
        //        caption: "اسناد درانتظار واگذاری بانک",
        //        visible: false,
        //        cellTemplate: function (container, options) {
        //            container.html(`<span class="cheque-cell">\u200E${threeDigit(options.value)}</span>`);
        //        },
        //        width: "auto",
        //    },
        //    {
        //        dataField: "AtBank",
        //        caption: "اسناد نزدبانک",
        //        cellTemplate: function (container, options) {
        //            container.html(`<span class="cheque-cell">\u200E${threeDigit(options.value)}</span>`);
        //        },
        //        width: "auto",
        //    },
        //    {
        //        dataField: "Collected",
        //        caption: "اسناد وصول‌شده",
        //        cellTemplate: function (container, options) {
        //            container.html(`<span class="cheque-cell">\u200E${threeDigit(options.value)}</span>`);
        //        },
        //        width: "auto",
        //    },
        //    {
        //        dataField: "AssignedToOthers",
        //        caption: "اسناد واگذار شده‌به‌غیر",
        //        cellTemplate: function (container, options) {
        //            container.html(`<span class="cheque-cell">\u200E${threeDigit(options.value)}</span>`);
        //        },
        //        width: "auto",
        //    },
        //    {
        //        dataField: "Pending Receipt Refund",
        //        caption: "اسناد در انتظار استرداد",
        //        cellTemplate: function (container, options) {
        //            container.html(`<span class="cheque-cell">\u200E${threeDigit(options.value)}</span>`);
        //        },
        //        width: "auto",
        //    },
        //    {
        //        dataField: "ReturnedToPayer",
        //        caption: "اسناد دریافتی مستردشده",
        //        cellTemplate: function (container, options) {
        //            container.html(`<span class="cheque-cell">\u200E${threeDigit(options.value)}</span>`);
        //        },
        //        width: "auto",
        //    },
        //    {
        //        dataField: "Protested",
        //        caption: "اسناد واخواستی",
        //        cellTemplate: function (container, options) {
        //            container.html(`<span class="cheque-cell">\u200E${threeDigit(options.value)}</span>`);
        //        },
        //        width: "auto",
        //    },
        //    {
        //        dataField: "CollectedByAgent",
        //        caption: "اسناد نقد شده توسط مامور وصول",
        //       // visible: false,
        //        cellTemplate: function (container, options) {
        //            container.html(`<span class="cheque-cell">\u200E${threeDigit(options.value)}</span>`);
        //        },
        //        width: "auto",
        //    },
        //    {
        //        dataField: "AtCashboxr",
        //        caption: "اسناد سررسیدنشده نزدصندوق",

        //        cellTemplate: function (container, options) {
        //            container.html(`<span class="cheque-cell">\u200E${threeDigit(options.value)}</span>`);
        //        },

        //        width: "auto",
        //    },
        //    {
        //        dataField: "ForgottenCashbox",
        //        caption: "اسنادمعوق نزدصندوق",

        //        cellTemplate: function (container, options) {
        //            container.html(`<span class="">\u200E${threeDigit(options.value)}</span>`);
        //        },
        //        width: "auto",
        //    },
        //    {
        //        dataField: "AtCashbox",
        //        caption: "اسناد نزدصندوق",
        //        cellTemplate: function (container, options) {
        //            container.html(`<span class="cheque-cell">\u200E${threeDigit(options.value)}</span>`);
        //        },
        //        width: "auto",
        //    },
        //],
        height: "85vh",

        rtlEnabled: true,
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        scrolling: {
            mode: "virtual" // Enables internal scrolling inside the DataGrid
        },
        onRowPrepared: function (e) {
            if (e.rowType === "data") {

            }
            masterChildStyling(e, 'debit')
        },
        onCellPrepared: function (e) {
            if (e.rowType !== "data") return;

            const receivableCols = ["unMaturedAmount", "maturedAmount"];
            const totalReceivableCols = ["totalReceivableAmount"];
            const softWarningCols = [
                "AtBank", "Collected", "ReturnedToPayer", "Protested",
                "AssignedToOthers", "CollectedByAgent", "PendingBankAssignment", "PendingCollection",
            ];
            const criticalWarningCols = [];
            const darkWarningCols = ["ForgottenCashbox", "AtCashboxr"]
            const totalDarkWarningCols = ["AtCashbox"]

            if (receivableCols.includes(e.column.dataField)) {
                e.cellElement.css({
                    backgroundColor: "#e8f5fc",
                    color: "#003a63"
                });
            } else if (totalReceivableCols.includes(e.column.dataField)) {
                e.cellElement.css({
                    backgroundColor: "#d0ebff",
                    fontWeight: "500",
                    color: "#002b54"
                });
            } else if (softWarningCols.includes(e.column.dataField)) {
                e.cellElement.css({
                    backgroundColor: "#fff1cc",
                    color: "#805b00"
                });
            } else if (criticalWarningCols.includes(e.column.dataField)) {
                e.cellElement.css({
                    backgroundColor: "#ffe2cc",
                    fontWeight: "600",
                    color: "#993300"
                });
            }
            else if (darkWarningCols.includes(e.column.dataField)) {
                e.cellElement.css({
                    backgroundColor: "#e6f4ea", // سبز پاستلی ملایم
                    fontWeight: "600",
                    color: "#335c33" // سبز خاکستری برای متن
                });
            }
            else if (totalDarkWarningCols.includes(e.column.dataField)) {
                e.cellElement.css({
                    backgroundColor: "#d9ead3", // کمی پررنگ‌تر
                    fontWeight: "600",
                    color: "#2e4d2e" // سبز تیره‌تر برای متن
                });
            }
            else if (e.column.dataField === "FullName") {
                e.cellElement.css({
                    backgroundColor: "#f5f7fa",
                    fontWeight: "500",
                    color: "#333"
                });
            } else if (e.column.dataField === "companyId") {
                e.cellElement.css({
                    backgroundColor: "#f0f0f0",
                    color: "#444"
                });
            }
            else {
                e.cellElement.css({
                    backgroundColor: "#fff1cc",
                    color: "#805b00"
                });
            }
        }

        ,
        onCellClick: function (e) {

            if (e.rowType == "header") return
            if (["companyId", "partyId"].includes(e.column.dataField)) return;

            const companyId = e.data.companyId;
            const partyId = e.data.partyId;
            const timeLabel = e.column.dataField; // همون '1404/01' یا 'Overdue'
            // const amount = e.value; // اگه خواستی مبلغ رو هم داشته باشی
            // console.log(e)
            if (e.displayValue == null) return; // فقط وقتی مقدار داره واکنش نشون بده

            // باز کردن Popup و ارسال دیتا
            showDebitPopup({
                companyId: companyId,
                partyId: partyId,
                timeLabel: timeLabel,
                chequeState: chequeMap
            });
        },
        summary: {
            totalItems: totalItems
        },
        //summary: {
        //    totalItems: [
        //        {
        //            column: "FullName",
        //            displayFormat: "جمع",
        //        },
        //        {
        //            column: "unMaturedAmount",
        //            summaryType: "sum",
        //            customizeText: function (data) {
        //                return `${threeDigit(data.value)}`
        //            }
        //        },
        //        {
        //            column: "maturedAmount",
        //            summaryType: "sum",
        //            customizeText: function (data) {
        //                return `${threeDigit(data.value)}`
        //            }
        //        },
        //        {
        //            column: "totalReceivableAmount",
        //            summaryType: "sum",
        //            customizeText: function (data) {
        //                return `${threeDigit(data.value)}`
        //            }
        //        },
        //        {
        //            column: "AtCashboxr",
        //            summaryType: "sum",
        //            customizeText: function (data) {
        //               // console.log(data)
        //                return `${threeDigit(data.value)}`
        //            }
        //        },
        //        {
        //            column: "PendingCollection",
        //            summaryType: "sum",
        //            customizeText: function (data) {
        //                return `${threeDigit(data.value)}`
        //            }
        //        },
        //        {
        //            column: "PendingBankAssignment",
        //            summaryType: "sum",
        //            customizeText: function (data) {
        //                return `${threeDigit(data.value)}`
        //            }
        //        },
        //        {
        //            column: "AtCashbox",
        //            summaryType: "sum",
        //            customizeText: function (data) {
        //                return `${threeDigit(data.value)}`
        //            }
        //        },
        //        {
        //            column: "AtBank",
        //            summaryType: "sum",
        //            customizeText: function (data) {
        //                return `${threeDigit(data.value)}`
        //            }
        //        },
        //        {
        //            column: "Collected",
        //            summaryType: "sum",
        //            customizeText: function (data) {
        //                return `${threeDigit(data.value)}`
        //            }
        //        },
        //        {
        //            column: "AssignedToOthers",
        //            summaryType: "sum",
        //            customizeText: function (data) {
        //                return `${threeDigit(data.value)}`
        //            }
        //        },
        //        {
        //            column: "ReturnedToPayer",
        //            summaryType: "sum",
        //            customizeText: function (data) {
        //                return `${threeDigit(data.value)}`
        //            }
        //        },
        //        {
        //            column: "Protested",
        //            summaryType: "sum",
        //            customizeText: function (data) {
        //                return `${threeDigit(data.value)}`
        //            }
        //        },
        //        {
        //            column: "CollectedByAgent",
        //            summaryType: "sum",
        //            customizeText: function (data) {
        //                return `${threeDigit(data.value)}`
        //            }
        //        },
        //        {
        //            column: "ForgottenCashbox",
        //            summaryType: "sum",
        //            customizeText: function (data) {
        //                return `${threeDigit(data.value)}`
        //            }
        //        },

        //    ]
        //},
    })
}
function genDebitHtml(debitData) {
    $("#debit").dxDataGrid({
        dataSource: debitData,
        columns: [
            {
                dataField: "FullName",
                caption: "مشتری",
                width: "",
            },
            {
                dataField: "companyId",
                caption: "شرکت",
                lookup: {
                    dataSource: allData.companies,
                    valueExpr: "cId",
                    displayExpr: "cName_FA"
                },
            },
            {
                dataField: "PersianMonth",
                caption: "سررسید",

                cellTemplate: function (container, options) {

                    var displayClass = ""
                    if (options.data.PersianMonth <= allData.today) {
                        displayClass = "text-danger"
                    }
                    container.html(`<span class="${displayClass}">\u200E${options.data.PersianMonth || "سررسید ثبت نشده است"}</span>`);
                }
            },
            {
                dataField: "TotalAmount",
                caption: "مجموع مبالغ",
                cellTemplate: function (container, options) {
                    const formattedValue = threeDigit(options.data.TotalAmount?.toFixed(0));
                    container.html(`<span class="">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "AllocatedAmount",
                caption: "بدهی/بستانکاری",
                cellTemplate: function (container, options) {
                    const formattedValue = threeDigit(options.data.AllocatedAmount?.toFixed(0));
                    container.html(`<span class="">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "TotalAllocatedUpToThisMonth",
                caption: "بدهی/بستانکاری" + "(تجمیعی)",
                cellTemplate: function (container, options) {
                    const formattedValue = threeDigit(options.data.TotalAllocatedUpToThisMonth?.toFixed(0));
                    container.html(`<span class="">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "CustomerStatus",
                caption: "وضعیت",
            },
            {
                dataField: "InvoiceNumbers",
                caption: "شماره فاکتورها",
            },
        ],
        height: "85vh",
        rtlEnabled: true,
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        scrolling: {
            mode: "virtual" // Enables internal scrolling inside the DataGrid
        },
        summary: {
            totalItems: [
                {
                    column: "FullName",
                    displayFormat: "جمع",
                },
                {
                    column: "TotalAmount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "AllocatedAmount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },

            ]
        },
    })
}

function getcomboValues() {
    var dateTo = $("#cmbDateTo").val().replaceAll('\/', '') || "0";
    var dateFrom = $("#cmbDateFrom").val().replaceAll('\/', '') || allData.curDate.replaceAll('\/', '');
    var max_expiry_date = $("#persian-date").val().replaceAll('\/', '') || allData.defaultExpDate.replaceAll('\/', '');
    var companyId = $("#comboCo").dxTagBox('option', 'value').join(",") || "0";
    var distId = $("#comboDist").dxTagBox('option', 'value').join(",") || "0";
    var brandId = $("#comboBrand").dxTagBox('option', 'value').join(",") || "0";
    var srcIsDist = ($("#cmbOp").dxSelectBox('option', 'value') == 2) ? 0 : 1;
    var financePrdtId = $("#comboPrd").dxTagBox('option', 'value').join(",") || "0";
    var partyId = $("#comboCust").dxTagBox('option', 'value').join(",") || "0";
    var CurrentStockDate = "0";
    var SalesOfficeID = 0
    var data = {
        companyId: companyId, distId: distId, dateTo: dateTo, dateFrom: dateFrom, brandId: brandId, srcIsDist: srcIsDist,
        financePrdtId: financePrdtId, CurrentStockDate: CurrentStockDate, max_expiry_date: max_expiry_date, SalesOfficeID: SalesOfficeID,
        partyId: partyId
    };
    handleCmb(data)
    return data;
}
function getDashboardDataFinance() {
    getBrandSaleDataFinance();
    getOfficeSaleDataFinance();
}
function getBrandSaleDataFinance() {
    var data = getcomboValues();
    loader('show')
    $.ajax({
        url: '../controller/services.asmx/GetBrandSalesSummaryFinance',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            loader('hide');
            checkAccess(response)
            response = JSON.parse(response.d)

            genBrandSaleHtmlFinance(response)
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function genBrandSaleHtmlFinance(data) {

    $("#tbl-br-pr-fnc").dxDataGrid({
        dataSource: data.brandSalesSummary,
        rtlEnabled: true,
        keyExpr: "brandID",
        columns: [
            {
                dataField: "brandName_EN",
                caption: "برند",
                width: "40%",
            },
            {
                dataField: "TotalSaleAmount",
                caption: "فروش تعدادی",
                width: "15%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.data.TotalSaleAmount?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "TotalGoodsPrice",
                caption: "فروش ریالی",
                width: "15%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalGoodsPrice < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.data.TotalGoodsPrice?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "countOfStock",
                caption: "موجودی تعدادی",
                width: "15%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.countOfStock < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.data.countOfStock?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "amountOfStockP1",
                caption: "موجودی ریالی (p1)",
                width: "15%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.amountOfStockP1 < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.data.amountOfStockP1?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "amountOfStockP2",
                caption: "موجودی ریالی (p2)",
                width: "15%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.amountOfStockP2 < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.data.amountOfStockP2?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                }
            }
        ],
        summary: {
            totalItems: [
                {
                    column: "brandName_EN",
                    displayFormat: "جمع",
                },
                {
                    column: "TotalSaleAmount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "TotalGoodsPrice",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "countOfStock",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "amountOfStockP1",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                }
                ,
                {
                    column: "amountOfStockP2",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                }
            ]
        },
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        scrolling: {
            mode: "virtual" // Enables internal scrolling inside the DataGrid
        },
        onRowPrepared: function (e) {
            if (e.rowType === "data") {
                e.rowElement.css("background-color", "#E8F5E9");
            }
            if (e.rowType === "header") {
                e.rowElement.addClass("bg-success").addClass("text-white");
            }
            if (e.rowType === "totalFooter") {
                e.rowElement.addClass("bg-success")
                $(e.rowElement).find(".dx-datagrid-summary-item").addClass("text-white").css("font-weight", "normal")
            }
        },
        masterDetail: {
            enabled: true,
            template: function (container, options) {
                var data = getcomboValues();
                data.brandId = options.key
                $.ajax({
                    url: '../controller/services.asmx/GetProductSaleSummaryFinance',
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ data: data }),
                    success: function (response) {
                        checkAccess(response)
                        response = JSON.parse(response.d)
                        $(`<div id='fnce-detail-${options.key}'>`)
                            .addClass("detail-container")
                            .appendTo(container)
                            .dxDataGrid({
                                dataSource: response.productSalesSummary, // Assuming 'details' is an array in your data
                                showBorders: true,
                                keyExpr: "financePrdtId",
                                columnAutoWidth: true,
                                rtlEnabled: true,
                                paging: { enabled: false },
                                columns: [
                                    { dataField: "Name", caption: "محصول", width: "41%" },
                                    {
                                        dataField: "TotalSaleAmount",
                                        caption: "فروش تعدادی",
                                        width: "14.55%",
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            if (options.data.TotalSaleAmount < 0) {
                                                displayClass = "text-danger"
                                            }
                                            const formattedValue = threeDigit(options.data.TotalSaleAmount?.toFixed(0));
                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                        }
                                    },
                                    {
                                        dataField: "TotalGoodsPrice",
                                        caption: "فروش ریالی",
                                        width: "14.75%",
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            if (options.data.TotalGoodsPrice < 0) {
                                                displayClass = "text-danger"
                                            }
                                            const formattedValue = threeDigit(options.data.TotalGoodsPrice?.toFixed(0));
                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                        }
                                    },
                                    {
                                        dataField: "countOfStock",
                                        caption: "موجودی تعدادی",
                                        width: "15%",
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            if (options.data.countOfStock < 0) {
                                                displayClass = "text-danger"
                                            }
                                            const formattedValue = threeDigit(options.data.countOfStock?.toFixed(0));
                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                        }
                                    },
                                    {
                                        dataField: "amountOfStockP1",
                                        caption: "موجودی ریالی (p1)",
                                        width: "15%",
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            if (options.data.amountOfStockP1 < 0) {
                                                displayClass = "text-danger"
                                            }
                                            const formattedValue = threeDigit(options.data.amountOfStockP1?.toFixed(0));
                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                        }
                                    },
                                    {
                                        dataField: "amountOfStockP2",
                                        caption: "موجودی ریالی (p2)",
                                        width: "15%",
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            if (options.data.amountOfStockP2 < 0) {
                                                displayClass = "text-danger"
                                            }
                                            const formattedValue = threeDigit(options.data.amountOfStockP2?.toFixed(0));
                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                        },
                                        headerCellTemplate: function (container) {
                                            container.css("display", "flex").css("align-items", "center").css("justify-content", "space-between");
                                            const title = $("<span>").text("موجودی ریالی (p2)");
                                            const icon = $("<i>")
                                                .append(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                                                    </svg>`)
                                                .css({ cursor: "pointer", marginRight: "5px" })
                                                .attr("title", `گزارش فروش موجودی محصولات ${options.data.brandName_EN}`)
                                                .on("click", function (e) {
                                                    e.stopPropagation(); // prevent sort or filter trigger
                                                    const grid = $(`#fnce-detail-${options.key}`).dxDataGrid("instance");
                                                    grid.exportToExcel(false);
                                                });
                                            container.append(title).append(icon);
                                        }
                                    }
                                ],
                                onRowPrepared: function (e) {
                                    masterChildStyling(e, 'product')
                                },

                                masterDetail: {
                                    enabled: true,
                                    template: function (container2, options2) {
                                        var data = getcomboValues();
                                        data.financePrdtId = options2.key
                                        $.ajax({
                                            url: '../controller/services.asmx/GetStoreSaleSummaryFinance',
                                            type: 'POST',
                                            contentType: "application/json; charset=utf-8",
                                            dataType: "json",
                                            data: JSON.stringify({ data: data }),
                                            success: function (response) {
                                                checkAccess(response)
                                                response = JSON.parse(response.d)

                                                $(`<div id='fnce-detail-${options.key}-${options2.key}'>`)
                                                    .addClass("detail-container")
                                                    .appendTo(container2)
                                                    .dxDataGrid({
                                                        dataSource: response.storeSaleSummary,
                                                        showBorders: true,
                                                        keyExpr: "financePrdtId",
                                                        columnAutoWidth: true,
                                                        rtlEnabled: true,
                                                        paging: { enabled: false },
                                                        columns: [
                                                            { dataField: "StoreName", caption: "انبار", width: "41%" },
                                                            {
                                                                dataField: "TotalSaleAmount",
                                                                caption: "فروش تعدادی",
                                                                width: "14.55%",
                                                                cellTemplate: function (container, options) {
                                                                    var displayClass = ""
                                                                    if (options.data.TotalSaleAmount < 0) {
                                                                        displayClass = "text-danger"
                                                                    }
                                                                    const formattedValue = threeDigit(options.data.TotalSaleAmount?.toFixed(0));
                                                                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                }
                                                            },
                                                            {
                                                                dataField: "TotalGoodsPrice",
                                                                caption: "فروش ریالی",
                                                                width: "14.75%",
                                                                cellTemplate: function (container, options) {
                                                                    var displayClass = ""
                                                                    if (options.data.TotalGoodsPrice < 0) {
                                                                        displayClass = "text-danger"
                                                                    }
                                                                    const formattedValue = threeDigit(options.data.TotalGoodsPrice?.toFixed(0));
                                                                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                }
                                                            },
                                                            {
                                                                dataField: "countOfStock",
                                                                caption: "موجودی تعدادی",
                                                                width: "15%",
                                                                cellTemplate: function (container, options) {
                                                                    var displayClass = ""
                                                                    if (options.data.countOfStock < 0) {
                                                                        displayClass = "text-danger"
                                                                    }
                                                                    const formattedValue = threeDigit(options.data.countOfStock?.toFixed(0));
                                                                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                }
                                                            },
                                                            {
                                                                dataField: "amountOfStockP1",
                                                                caption: "موجودی ریالی (p1)",
                                                                width: "15%",
                                                                cellTemplate: function (container, options) {
                                                                    var displayClass = ""
                                                                    if (options.data.amountOfStockP1 < 0) {
                                                                        displayClass = "text-danger"
                                                                    }
                                                                    const formattedValue = threeDigit(options.data.amountOfStockP1?.toFixed(0));
                                                                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                }
                                                            },
                                                            {
                                                                dataField: "amountOfStockP2",
                                                                caption: "موجودی ریالی (p2)",
                                                                width: "15%",
                                                                cellTemplate: function (container, options) {
                                                                    var displayClass = ""
                                                                    if (options.data.amountOfStockP2 < 0) {
                                                                        displayClass = "text-danger"
                                                                    }
                                                                    const formattedValue = threeDigit(options.data.amountOfStockP2?.toFixed(0));
                                                                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                },
                                                                headerCellTemplate: function (container) {
                                                                    container.css("display", "flex").css("align-items", "center").css("justify-content", "space-between");
                                                                    const title = $("<span>").text("موجودی ریالی (p2)");
                                                                    const icon = $("<i>")
                                                                        .append(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                                                    </svg>`)
                                                                        .css({ cursor: "pointer", marginRight: "5px" })
                                                                        .attr("title", `گزارش فروش موجودی ${options2.data.Name} به تفکیک انبار`)
                                                                        .on("click", function (e) {
                                                                            e.stopPropagation(); // prevent sort or filter trigger
                                                                            const grid = $(`#fnce-detail-${options.key}-${options2.key}`).dxDataGrid("instance");
                                                                            grid.exportToExcel(false);
                                                                        });
                                                                    container.append(title).append(icon);
                                                                }
                                                            }
                                                        ],
                                                        onRowPrepared: function (e) {
                                                            if (e.rowType === "data" && e.data.effect === 0 && e.data.TotalSaleAmount == 0) {
                                                                $(e.rowElement).css("color", "#c96c6c"); // light gray
                                                            }
                                                            masterChildStyling(e, 'state')
                                                        },
                                                    }).parent().addClass("p-1");
                                            },
                                            error: function (xhr, status, error) {
                                                console.error("Error: " + error);
                                            }
                                        })
                                    }
                                }
                            }).parent().addClass("p-1");
                    },
                    error: function (xhr, status, error) {
                        console.error("Error: " + error);
                    }
                });
            }
        },
    });
    $("#xlsx-tbl-br-pr-fnc").unbind().off('click').on('click', function () {
        const grid = $("#tbl-br-pr-fnc").dxDataGrid("instance");
        grid.exportToExcel(false);
    })
}
function genOfficeSaleHtmlFinance(data) {
    $("#tbl-of-pr-fnc").dxDataGrid({
        dataSource: data.officeSalesSummary,
        rtlEnabled: true,
        keyExpr: "SalesOfficeID",
        columns: [
            {
                dataField: "Name",
                caption: "گروه مشتری",
                width: "40%",
            },
            {
                dataField: "TotalSaleAmount",
                caption: "فروش تعدادی",
                width: "15%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalSaleAmount < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.data.TotalSaleAmount?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                }
            },
            {
                dataField: "TotalGoodsPrice",
                caption: "فروش ریالی",
                width: "15%",
                cellTemplate: function (container, options) {
                    var displayClass = ""
                    if (options.data.TotalGoodsPrice < 0) {
                        displayClass = "text-danger"
                    }
                    const formattedValue = threeDigit(options.data.TotalGoodsPrice?.toFixed(0));
                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                }
            }
        ],
        summary: {
            totalItems: [
                {
                    column: "Name",
                    displayFormat: "جمع",
                },
                {
                    column: "TotalSaleAmount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                },
                {
                    column: "TotalGoodsPrice",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return `${threeDigit(data.value)}`
                    }
                }
            ]
        },
        paging: { enabled: false },
        sorting: { mode: "multiple" },
        filterRow: { visible: false },
        headerFilter: { visible: true, allowSearch: true },
        scrolling: {
            mode: "virtual" // Enables internal scrolling inside the DataGrid
        },
        onRowPrepared: function (e) {
            masterChildStyling(e, 'dist')
        },
        masterDetail: {
            enabled: true,
            template: function (container, options) {
                var data = getcomboValues();
                data.SalesOfficeID = options.data.SalesOfficeID
                $.ajax({
                    url: '../controller/services.asmx/GetBrandSalesSummaryFinance',
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ data: data }),
                    success: function (response) {
                        checkAccess(response)
                        response = JSON.parse(response.d)

                        $(`<div id="detail-salesOffice-${options.data.SalesOfficeID}">`)
                            .addClass("detail-container")
                            .appendTo(container)
                            .dxDataGrid({
                                columns: [
                                    {
                                        dataField: "brandName_EN",
                                        caption: "برند",
                                        width: "40%",
                                    },
                                    {
                                        dataField: "TotalSaleAmount",
                                        caption: "فروش تعدادی",
                                        width: "15%",
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            if (options.data.TotalSaleAmount < 0) {
                                                displayClass = "text-danger"
                                            }
                                            const formattedValue = threeDigit(options.data.TotalSaleAmount?.toFixed(0));
                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                        }
                                    },
                                    {
                                        dataField: "TotalGoodsPrice",
                                        caption: "فروش ریالی",
                                        width: "15%",
                                        allowFiltering: false,
                                        cellTemplate: function (container, options) {
                                            var displayClass = ""
                                            if (options.data.TotalGoodsPrice < 0) {
                                                displayClass = "text-danger"
                                            }
                                            const formattedValue = threeDigit(options.data.TotalGoodsPrice?.toFixed(0));
                                            container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                        },
                                        headerCellTemplate: function (container) {
                                            container.css("display", "flex").css("align-items", "center").css("justify-content", "space-between");
                                            const title = $("<span>").text("فروش ریالی");
                                            const icon = $("<i>")
                                                .append(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                                                </svg>`)
                                                .css({ cursor: "pointer", marginRight: "5px" })
                                                .attr("title", `گزارش فروش موجودی مشتریان ${options.data.Name} به تفکیک برند`)
                                                .on("click", function (e) {
                                                    e.stopPropagation(); // prevent sort or filter trigger
                                                    const grid = $(`#detail-salesOffice-${options.data.SalesOfficeID}`).dxDataGrid("instance");
                                                    grid.exportToExcel(false);
                                                });
                                            container.append(title).append(icon);
                                        }
                                    }
                                ],
                                dataSource: response.brandSalesSummary,
                                rtlEnabled: true,
                                keyExpr: "brandID",
                                paging: { enabled: false },
                                sorting: { mode: "multiple" },
                                filterRow: { visible: false },
                                headerFilter: { visible: true, allowSearch: true },
                                scrolling: {
                                    mode: "virtual" // Enables internal scrolling inside the DataGrid
                                },
                                onRowPrepared: function (e) {
                                    masterChildStyling(e, 'brand')
                                },
                                masterDetail: {
                                    enabled: true,
                                    template: function (container2, options2) {
                                        // console.log(options2)
                                        var data = getcomboValues();
                                        data.brandId = options2.data.brandID
                                        data.SalesOfficeID = options.data.SalesOfficeID
                                        $.ajax({
                                            url: '../controller/services.asmx/GetProductSaleSummaryFinance',
                                            type: 'POST',
                                            contentType: "application/json; charset=utf-8",
                                            dataType: "json",
                                            data: JSON.stringify({ data: data }),
                                            success: function (response) {
                                                checkAccess(response)
                                                response = JSON.parse(response.d)

                                                $(`<div id="detail-salesOffice-${options.data.SalesOfficeID}-${options2.data.brandID}">`)
                                                    .addClass("detail-container")
                                                    .appendTo(container2)
                                                    .dxDataGrid({
                                                        dataSource: response.productSalesSummary, // Assuming 'details' is an array in your data
                                                        showBorders: true,
                                                        keyExpr: "financePrdtId",
                                                        columnAutoWidth: true,
                                                        rtlEnabled: true,
                                                        paging: { enabled: false },
                                                        columns: [
                                                            { dataField: "Name", caption: "محصول", width: "41%" },
                                                            {
                                                                dataField: "TotalSaleAmount",
                                                                caption: "فروش تعدادی",
                                                                width: "14.55%",
                                                                cellTemplate: function (container, options) {
                                                                    var displayClass = ""
                                                                    if (options.data.TotalSaleAmount < 0) {
                                                                        displayClass = "text-danger"
                                                                    }
                                                                    const formattedValue = threeDigit(options.data.TotalSaleAmount?.toFixed(0));
                                                                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                }
                                                            },
                                                            {
                                                                dataField: "TotalGoodsPrice",
                                                                caption: "فروش ریالی",
                                                                width: "14.75%",
                                                                cellTemplate: function (container, options) {
                                                                    var displayClass = ""
                                                                    if (options.data.TotalGoodsPrice < 0) {
                                                                        displayClass = "text-danger"
                                                                    }
                                                                    const formattedValue = threeDigit(options.data.TotalGoodsPrice?.toFixed(0));
                                                                    container.html(`<span class="${displayClass}">\u200E${formattedValue}</span>`);
                                                                },
                                                                headerCellTemplate: function (container) {
                                                                    container.css("display", "flex").css("align-items", "center").css("justify-content", "space-between");
                                                                    const title = $("<span>").text("فروش ریالی");
                                                                    const icon = $("<i>")
                                                                        .append(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                                                                <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                                                                            </svg>`)
                                                                        .css({ cursor: "pointer", marginRight: "5px" })
                                                                        .attr("title", `گزارش فروش موجودی مشتریان ${options.data.Name} به تفکیک محصول برای برند ${options2.data.brandName_EN}`)
                                                                        .on("click", function (e) {
                                                                            e.stopPropagation(); // prevent sort or filter trigger
                                                                            const grid = $(`#detail-salesOffice-${options.data.SalesOfficeID}-${options2.data.brandID}`).dxDataGrid("instance");
                                                                            grid.exportToExcel(false);
                                                                        });
                                                                    container.append(title).append(icon);
                                                                }
                                                            }

                                                        ],
                                                        onRowPrepared: function (e) {
                                                            masterChildStyling(e, 'product')
                                                        },
                                                    }).parent().addClass("p-1");
                                            },
                                            error: function (xhr, status, error) {
                                                console.error("Error: " + error);
                                            }
                                        })
                                    }
                                }
                            }).parent().addClass("p-1");
                    },
                    error: function (xhr, status, error) {
                        console.error("Error: " + error);
                    }
                });
            }
        },
    });
    $("#xlsx-tbl-of-pr-fnc").unbind().off('click').on('click', function () {
        const grid = $("#tbl-of-pr-fnc").dxDataGrid("instance");
        grid.exportToExcel(false);
    })
}
function getOfficeSaleDataFinance() {
    var data = getcomboValues();
    loader('show')
    $.ajax({
        url: '../controller/services.asmx/GetOfficeSalesSummaryFinance',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            loader('hide');
            checkAccess(response)
            response = JSON.parse(response.d)

            genOfficeSaleHtmlFinance(response)
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function getDashboardData() {
    getDistSaleData();
    getBrandSaleData();
}
function getSaleStockRate() {
    getSaleStockRateData();
}
function getExpiryDateStock() {
    getExpiryDateStockData();
}
function GetCustomerStateMap() {
    GetCustomerStateMapData();
}
function GetTrendingProducts() {
    fillSelectionTrendBar();
}
function getTodayShamsiDate() {
    const formatter = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const parts = formatter.formatToParts(new Date());
    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;
    const currentStockDate = `${year}${month}${day}`;
    return currentStockDate;
}
function jalaliToDays(jy, jm, jd) {
    const j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    let totalDays = 0;
    // حساب تعداد روزها از سال 1 شمسی
    totalDays += (jy - 1) * 365 + Math.floor((jy - 1) / 4);
    // اضافه کردن روزهای ماه‌های قبل از ماه مورد نظر
    for (let i = 0; i < jm - 1; i++) {
        totalDays += j_days_in_month[i];
    }
    // اضافه کردن روزهای روز مورد نظر
    totalDays += jd;
    return totalDays;
}
function calculateDaysBetween(jalaliDateFrom, jalaliDateTo) {
    // jalaliDateFrom and jalaliDateTo are in format "yyyyMMdd"
    const jyFrom = parseInt(jalaliDateFrom.slice(0, 4));
    const jmFrom = parseInt(jalaliDateFrom.slice(4, 6));
    const jdFrom = parseInt(jalaliDateFrom.slice(6, 8));
    const jyTo = parseInt(jalaliDateTo.slice(0, 4));
    const jmTo = parseInt(jalaliDateTo.slice(4, 6));
    const jdTo = parseInt(jalaliDateTo.slice(6, 8));
    // تبدیل تاریخ شمسی به تعداد روزها
    const daysFrom = jalaliToDays(jyFrom, jmFrom, jdFrom);
    const daysTo = jalaliToDays(jyTo, jmTo, jdTo);
    // تفاوت در تعداد روزها
    return (daysTo - daysFrom) + 1;
}
function getSaleStockRateData() {
    var data = getcomboValues();
    data.branchCode = "0";
    data.today = getTodayShamsiDate()
    data.date_limit = '14031122'
    data.interval = calculateDaysBetween(data.dateFrom, data.dateTo).toString()
    loader('show')
    $.ajax({
        url: '../controller/services.asmx/rateSaleStock',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            loader('hide')
            checkAccess(response)
            response = JSON.parse(response.d)
            var dataSource = response.rateSaleStock
            $("#saleStockRate").dxDataGrid({
                dataSource: dataSource,
                columnAutoWidth: true, // تنظیم خودکار عرض ستون‌ها بر اساس محتوا
                wordWrapEnabled: true, // اگر متن طولانی باشد، در چند خط نمایش داده شود
                allowColumnResizing: true, // امکان تغییر اندازه ستون توسط کاربر
                rtlEnabled: true,
                showBorders: true,
                headerFilter: { visible: false, allowSearch: true },
                searchPanel: {
                    visible: true,
                    placeholder: "جست‌و‌جو ..." // تغییر متن فیلد جستجو
                },
                noDataText: "هیچ داده‌ای برای نمایش در بازه انتخابی وجود ندارد. لطفا تاریخ شروع و پایان معتبر وارد کنید  ", // تغییر متن "No data"
                //paging: { enabled: false },  // غیرفعال کردن صفحه‌بندی
                scrolling: {
                    mode: "virtual",  // فعال کردن اسکرول مجازی برای بارگذاری داده‌ها به صورت پویا
                    rowRenderingMode: "virtual"  // استفاده از رندرینگ مجازی برای ردیف‌ها
                },
                // ارتفاع جدول به اندازه‌ای که قابلیت اسکرول را فراهم کند
                height: $(window).height() - 138,
                groupPanel: {
                    visible: true,
                    emptyPanelText: "برای گروه‌بندی، سرستون‌ها را اینجا بکشید"  // تغییر متن پیش‌فرض
                },
                grouping: {
                    autoExpandAll: true   // Start with groups collapsed (optional)
                },
                headerFilter: { visible: true, allowSearch: true },
                allowColumnReordering: true,
                allowColumnResizing: true,
                rowAlternationEnabled: false,  // غیرفعال کردن راه‌راه بودن پیش‌فرض
                columns: [
                    { dataField: "companyName", caption: " شرکت", dataType: "string", alignment: "center" },
                    { dataField: "distributorName", caption: " پخش", dataType: "string", alignment: "center" },
                    { dataField: "cityName", caption: " مرکز پخش", dataType: "string", alignment: "center" },
                    { dataField: "productName", caption: "محصول", dataType: "string", alignment: "center" },
                    {
                        dataField: "bId",
                        caption: "برند",
                        alignment: "center",
                        lookup: {
                            dataSource: allData.brands,
                            valueExpr: "bId",
                            displayExpr: "bName_FA"
                        }
                    },
                    { dataField: "totalStock", caption: "موجودی تعدادی", dataType: "number", alignment: "center" },
                    {
                        dataField: "totalSale",
                        caption: "مجموع فروش تعدادی",
                        dataType: "number",
                        visible: true,
                        alignment: "center",
                        cellTemplate: function (container, options) {
                            container.html(`<span>\u200E${options.value}</span>`);
                        }
                    },
                    {
                        dataField: "avgDailySale",
                        caption: "میانگین فروش روزانه تعدادی",
                        dataType: "number",
                        alignment: "center",
                        format: {
                            type: "fixedPoint",
                            precision: 3
                        },
                        cellTemplate: function (container, options) {
                            container.html(`<span>\u200E${options.value}</span>`);
                        }
                    },
                    {
                        dataField: "rateStockSale",
                        caption: "نرخ روز فروش موجودی",
                        dataType: "number",
                        alignment: "center",
                        format: {
                            type: "fixedPoint",
                            precision: 0
                        },
                        cellTemplate: function (container, options) {
                            // console.log(options.data)
                            if (options.data.totalSale == 0) {
                                container.html(`<span>غیرقابل محاسبه</span>`);
                            }
                            else {
                                container.html(`<span>\u200E${options.value}</span>`);
                            }

                        }
                    }
                    , {
                        dataField: "daysCount", caption: "تعداد روزهای فروش در بازه انتخابی", visible: false, alignment: "center"
                    }
                ],
                onRowPrepared: function (e) {
                    if (e.rowType === "data") {
                        if (e.data.avgDailySale < 0) {
                            $(e.rowElement).css("background-color", "#ffcccc");
                        } else if (e.rowIndex % 2 === 0) { // راه‌راه دستی
                            $(e.rowElement).css("background-color", "#f9f9f9");
                        }
                    }
                },
                export: {
                    enabled: true,
                    fileName: "گزارش  روز فروش موجودی",
                    allowExportSelectedData: true
                },
                onExporting: function (e) {
                    var workbook = new ExcelJS.Workbook();
                    var worksheet = workbook.addWorksheet("Data");
                    DevExpress.excelExporter.exportDataGrid({
                        component: e.component,
                        worksheet: worksheet,
                        autoFilterEnabled: true,
                        customizeExcelCell: function (options) {
                            const { gridCell, excelCell } = options;
                            if (
                                gridCell.column &&
                                ["rateStockSale", "avgDailySale"].includes(gridCell.column.dataField)
                            ) {
                                const val = parseFloat(gridCell.value);
                                if (!isNaN(val)) {
                                    excelCell.value = val; // مهم: عدد بمونه، نه string
                                }
                            }
                        }
                    }).then(function () {
                        workbook.xlsx.writeBuffer().then(function (buffer) {
                            saveAs(new Blob([buffer], { type: "application/octet-stream" }), e.fileName + ".xlsx");
                        });
                    });
                    e.cancel = true;
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function getExpiryDateStockData() {
    var data = getcomboValues();
    data.branchCode = "0";
    data.today = getTodayShamsiDate()
    data.date_limit = '14031122'
    loader('show')
    $.ajax({
        url: '../controller/services.asmx/getExpiryDateStock',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            loader('hide')
            checkAccess(response)
            response = JSON.parse(response.d)
            var dataSource = response.getExpiryDateStock
            $("#expiryReport").dxDataGrid({
                dataSource: dataSource,
                columnAutoWidth: true, // تنظیم خودکار عرض ستون‌ها بر اساس محتوا
                wordWrapEnabled: true, // اگر متن طولانی باشد، در چند خط نمایش داده شود
                allowColumnResizing: true, // امکان تغییر اندازه ستون توسط کاربر
                rtlEnabled: true,
                showBorders: true,
                headerFilter: { visible: true, allowSearch: true },
                columns: [
                    { dataField: "companyName", caption: " شرکت", dataType: "string", alignment: "center" },
                    { dataField: "distributorName", caption: " پخش", dataType: "string", alignment: "center" },
                    { dataField: "cityName", caption: " مرکز پخش", dataType: "string", alignment: "center" },
                    { dataField: "productName", caption: "محصول", dataType: "string", alignment: "center" },
                    { dataField: "countOfStock", caption: "موجودی تعدادی", dataType: "number", alignment: "center" },
                    {
                        dataField: "ExpireDate", caption: "تاریخ انقضا", dataType: "string", alignment: "center",
                        customizeText: function (cellInfo) {
                            if ((!cellInfo.value) || (cellInfo.value == "01")) {
                                return "برای این رکورد تاریخ انقضا ثبت نشده.";
                            }
                            let dateStr = cellInfo.value.toString();
                            if (dateStr.length === 8) {  // فرض اینکه تاریخ به‌صورت 14050225 است
                                let year = dateStr.substring(0, 4);
                                let month = dateStr.substring(4, 6);
                                let day = dateStr.substring(6, 8);
                                return `${year}/${month}/${day}`;
                            }
                            return dateStr;
                        }
                    }
                ],
                export: {
                    enabled: true,
                    fileName: "گزارش تاریخ انقضا محصولات موجود در انبار پخش ",
                    allowExportSelectedData: true
                },
                onExporting: function (e) {
                    var workbook = new ExcelJS.Workbook();
                    var worksheet = workbook.addWorksheet("Data");
                    // Export داده‌ها به اکسل حتی اگر ستون‌ها مخفی باشند
                    DevExpress.excelExporter.exportDataGrid({
                        component: e.component,
                        worksheet: worksheet,
                        autoFilterEnabled: true  // فعال کردن فیلتر
                    }).then(function () {
                        workbook.xlsx.writeBuffer().then(function (buffer) {
                            saveAs(new Blob([buffer], { type: "application/octet-stream" }), e.fileName + ".xlsx");
                        });
                    });
                    e.cancel = true; // جلوگیری از خروجی پیش‌فرض
                },
                noDataText: "هیچ داده‌ای برای نمایش با فیلترهای انتخابی وجود ندارد   ", // تغییر متن "No data"
                searchPanel: {
                    visible: true,
                    placeholder: "جست‌و‌جو..." // تغییر متن فیلد جستجو
                },
                filterRow: {
                    visible: true
                },
                groupPanel: {
                    visible: true,
                    emptyPanelText: "برای گروه‌بندی، سرستون‌ها را اینجا بکشید"  // تغییر متن پیش‌فرض
                },
                grouping: {
                    autoExpandAll: true   // Start with groups collapsed (optional)
                },
                filterRow: {
                    visible: true,  // Enables the filter row
                    applyFilter: "auto",  // Filters as the user types (optional)
                    filterOperations: ["contains"]   // حذف همه عملیات‌های فیلتر  // 
                },
                allowColumnReordering: true,
                allowColumnResizing: true,
                paging: { enabled: false },  // غیرفعال کردن صفحه‌بندی
                scrolling: {
                    mode: "virtual",  // فعال کردن اسکرول مجازی برای بارگذاری داده‌ها به صورت پویا
                    rowRenderingMode: "virtual"  // استفاده از رندرینگ مجازی برای ردیف‌ها
                }, allowColumnReordering: true,
                allowColumnResizing: true,
                paging: { enabled: false },  // غیرفعال کردن صفحه‌بندی
                scrolling: {
                    mode: "virtual",  // فعال کردن اسکرول مجازی برای بارگذاری داده‌ها به صورت پویا
                    rowRenderingMode: "virtual"  // استفاده از رندرینگ مجازی برای ردیف‌ها
                },
                // ارتفاع جدول به اندازه‌ای که قابلیت اسکرول را فراهم کند
                height: $(window).height() - 200
            });
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function fillSelectionBar() {
    var curDateClean = allData.curDate.replaceAll('\/', ''); // حذف '/'
    var defaultYear = curDateClean.substring(0, 4); // گرفتن 4 رقم اول برای سال
    var defaultMonth = curDateClean.substring(4, 6); // گرفتن 2 رقم بعدی برای ماه
    var years = [
        { name: "1402", value: "1402" },
        { name: "1403", value: "1403" },
        { name: "1404", value: "1404" },
    ]
    $("#companyCmbMap").dxSelectBox({
        dataSource: allData.companies,
        displayExpr: "cName_FA",
        valueExpr: "cId",
        placeholder: "انتخاب شرکت",
        rtlEnabled: true,
        value: allData.companies.length > 0 ? allData.companies[0].cId : null,
        onValueChanged: function (e) {
            var dbBrands = allData.brands.filter(b => {
                return b.companyId.includes(e.value)
            })
            $("#brandCmbMap").dxSelectBox('option', 'dataSource', dbBrands)
            var dbProducts = allData.products.filter(p => {
                return p.cId == e.value
            })
            $("#productCmbMap").dxSelectBox('option', 'dataSource', dbProducts)
        }
    })
    $("#yearsCmb").dxTagBox({
        dataSource: years,
        displayExpr: "name",
        valueExpr: "value",
        placeholder: "سال",
        rtlEnabled: true,
        value: years.length > 0 ? [defaultYear] : [],
        showSelectionControls: true,
        applyValueMode: "useButtons",
    });
    $("#monthsCmb").dxTagBox({
        dataSource: allData.months,
        displayExpr: "name",
        valueExpr: "value",
        placeholder: "ماه",
        rtlEnabled: true,
        value: allData.months.length > 0 ? [defaultMonth] : [],
        showSelectionControls: true,
        applyValueMode: "useButtons",
    });
    $("#distCmbMap").dxSelectBox({
        dataSource: allData.distributors,
        displayExpr: "distName_FA",
        valueExpr: "id",
        placeholder: "انتخاب پخش",
        rtlEnabled: true,
    })
    $("#brandCmbMap").dxSelectBox({
        dataSource: allData.brands.filter(b => {
            return b.companyId.includes(allData.companies[0].cId)
        }),
        displayExpr: "bName_FA",
        valueExpr: "bId",
        placeholder: "انتخاب برند",
        rtlEnabled: true
    })
    $("#productCmbMap").dxSelectBox({
        dataSource: allData.products.filter(p => {
            return p.cId == allData.companies[0].cId
        }),
        width: 400,
        displayExpr: "name",
        valueExpr: "value",
        placeholder: "انتخاب محصول",
        rtlEnabled: true,
        searchEnabled: true,
    })
    var breakDownDb = [
        { name: "بر اساس توزیع‌کننده", value: "1" },
        { name: "بر اساس برند", value: "2" },
        { name: "بر اساس محصول", value: "3" },
        { name: "بدون تفکیک", value: "4" }
    ]
    $("#breakDownCmb").dxSelectBox({
        dataSource: breakDownDb,
        displayExpr: "name",
        valueExpr: "value",
        placeholder: "نوع تفکیک",
        rtlEnabled: true,
        value: breakDownDb.length > 0 ? "4" : null,
        onValueChanged: function (e) {
            $("#distCmbMap").parent().hide()
            $("#brandCmbMap").parent().hide()
            $("#productCmbMap").parent().hide()
            $("#distCmbMap").dxSelectBox('option', 'value', 0)
            $("#brandCmbMap").dxSelectBox('option', 'value', 0)
            $("#productCmbMap").dxSelectBox('option', 'value', 0)
            if (e.value == 1) {
                $("#distCmbMap").parent().slideDown()
            }
            if (e.value == 2) {
                $("#brandCmbMap").parent().slideDown()
            }
            if (e.value == 3) {
                $("#productCmbMap").parent().slideDown()
            }
        }
    })
    var reportTypeDb = [
        { name: "فروش ریالی", value: "1" },
        { name: "فروش تعدادی", value: "2" }
    ]
    $("#reportTypeCmb").dxSelectBox({
        dataSource: reportTypeDb,
        displayExpr: "name",
        valueExpr: "value",
        placeholder: "نوع گزارش",
        rtlEnabled: true,
        value: reportTypeDb.length > 0 ? "2" : null,
    })
    $("#fetchButton").off('click').on('click', function () {
        var companyId = $("#companyCmbMap").dxSelectBox('option', 'value');
        var year = $("#yearsCmb").dxTagBox('option', 'value') || [];
        var month = $("#monthsCmb").dxTagBox('option', 'value') || [];
        var breakdownType = $("#breakDownCmb").dxSelectBox('option', 'value');
        var reportType = $("#reportTypeCmb").dxSelectBox('option', 'value');
        var distId = $("#distCmbMap").dxSelectBox('option', 'value') || "0";
        var brandId = $("#brandCmbMap").dxSelectBox('option', 'value') || "0";
        var financePrdtId = $("#productCmbMap").dxSelectBox('option', 'value') || "0";
        if (companyId == null || year == null || month == null || breakdownType == null || reportType == null || (breakdownType == 1 && distId == 0) || (breakdownType == 2 && brandId == 0) || (breakdownType == 3 && financePrdtId == 0)) {
            showToast('لطفا همه موارد را انتخاب نمایید', 'warning')
            $("#maps").hide()
            return
        }
        var data = {}
        data.companyId = companyId
        data.distId = distId
        data.brandId = brandId
        data.financePrdtId = financePrdtId
        data.year = year
        data.month = month
        data.breakdownType = breakdownType
        data.reportType = reportType
        $.ajax({
            url: '../controller/services.asmx/GetCustomerStateMap',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ data: data }),
            success: function (response) {
                loader('hide')
                checkAccess(response)
                response = JSON.parse(response.d)
                var dataSource = response.GetCustomerStateMap
                createSaleStateMap(dataSource)
            },
            error: function (xhr, status, error) {
                console.error("Error: " + error);
            }
        });
    })
    //return
    // ارسال درخواست برای دریافت داده‌های اولیه
}
function GetCustomerStateMapData() {
    fillSelectionBar()
}
function fillSelectionTrendBar() {
    var curDateClean = allData.curDate.replaceAll('\/', ''); // حذف '/'
    var defaultYear = curDateClean.substring(0, 4); // گرفتن 4 رقم اول برای سال
    var defaultMonth = curDateClean.substring(4, 6); // گرفتن 2 رقم بعدی برای ماه
    var years = [
        { name: "1402", value: "1402" },
        { name: "1403", value: "1403" },
        { name: "1404", value: "1404" },
    ];
    $("#companyCmbTr").dxSelectBox({
        dataSource: allData.companies,
        displayExpr: "cName_FA",
        valueExpr: "cId",
        placeholder: "انتخاب شرکت",
        rtlEnabled: true,
        value: allData.companies.length > 0 ? allData.companies[0].cId : null,
        onValueChanged: function () {
            showToast('برای مشاهده گزارش دکمه نمایش را کلیک کنید.', 'warning');
            $("#resultsBody, #resultsChart").hide();
        }
    });
    $("#yearsCmbTr").dxSelectBox({
        dataSource: years,
        displayExpr: "name",
        valueExpr: "value",
        placeholder: "سال",
        rtlEnabled: true,
        value: defaultYear,
        onValueChanged: function () {
            showToast('برای مشاهده گزارش دکمه نمایش را کلیک کنید.', 'warning');
            $("#resultsBody, #resultsChart").hide();
        }
    });
    $("#monthsCmbTr").dxSelectBox({
        dataSource: allData.months,
        displayExpr: "name",
        valueExpr: "value",
        placeholder: "ماه",
        rtlEnabled: true,
        value: defaultMonth,
        onValueChanged: function () {
            showToast('برای مشاهده گزارش دکمه نمایش را کلیک کنید.', 'warning');
            $("#resultsBody, #resultsChart").hide();
        }
    });
    var filterTypes = [
        { name: " پرفروش‌ ترین‌ها", value: 1 },
        { name: " بیشترین سرعت رشد نسبت به ماه قبل", value: 2 },
        { name: " محبوب ترین ها", value: 3 }
    ];
    $("#filterTypeTr").dxSelectBox({
        dataSource: filterTypes,
        displayExpr: "name",
        valueExpr: "value",
        placeholder: "انتخاب معیار",
        rtlEnabled: true,
        value: 1, // مقدار پیش‌فرض
        onValueChanged: function (e) {
            showToast('برای مشاهده گزارش دکمه نمایش را کلیک کنید.', 'warning');
            $("#resultsBody, #resultsChart").hide();
            updateFilterDescription(e.value);
        }
    });
    // مقداردهی اولیه توضیحات
    updateFilterDescription(1);
    $("#trendFetchButton").off('click').on('click', function () {
        var companyId = $("#companyCmbTr").dxSelectBox("instance").option("value");
        var year = $("#yearsCmbTr").dxSelectBox("instance").option("value");
        var month = $("#monthsCmbTr").dxSelectBox("instance").option("value");
        var filterType = $("#filterTypeTr").dxSelectBox("instance").option("value");
        $("#resultsBody, #resultsChart").hide();
        if (!companyId || !year || !month || !filterType) {
            showToast('لطفا همه موارد را انتخاب نمایید', 'warning');
            return;
        }
        var data = { companyId, year, month, filterType };
        $.ajax({
            url: '../controller/services.asmx/GetTrendingProducts',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ data }),
            success: function (response) {
                loader('hide');
                checkAccess(response);
                response = JSON.parse(response.d);
                var dataSource = response.GetTrendingProducts;
                $("#loading").fadeIn();
                setTimeout(() => {
                    $("#loading").fadeOut();
                    showToast("گزارش با موفقیت بارگذاری شد", "success");
                    displayResults(dataSource);
                }, 1000);
            },
            error: function (xhr, status, error) {
                console.error("Error: " + error);
            }
        });
    });
}
function updateFilterDescription(filterType) {
    const descriptions = {
        1: "📊 پرفروش‌ترین‌ها: محصولاتی با بیشترین تعداد فروش در بازه‌ی زمانی انتخابی.",
        2: "📈 نرخ رشد: شامل محصولاتی است که در ماه قبل نیز توزیع شده‌اند و رشد مثبت فروش نسبت به ماه قبل داشته‌اند.",
        3: "👥 محبوب‌ترین‌ها: محصولاتی که بیشترین تعداد مشتریان یکتا را داشته‌اند."
    };
    $("#filter-description").text(descriptions[filterType] || "");
}
function displayResults(response) {
    $("#resultsBody").show();
    $("#resultsChart").show();
    if (!response || !Array.isArray(response) || response.length === 0) {
        showToast("  با فیلدهای انتخابی دیتایی برای نمایش وجود ندارد . لطفا مقادیر معتبر انتخاب کنید   .", "warning");
        $("#resultsBody").hide();
        $("#resultsChart").hide();
        return;
    }
    showToast("گزارش با موفقیت بارگذاری شد  ", "success");
    var filterType = $("#filterTypeTr").dxSelectBox('option', 'value');
    const labelMap = { 1: "فروش تعدادی", 2: "نرخ رشد", 3: "تعداد مشتری‌ها" };
    const resultsBody = $("#resultsBody").html("");
    // فیلتر کردن داده‌ها بر اساس نوع فیلتر
    const filteredResponse = response.filter(item => !(filterType == 2 && item.Numbers <= 0));
    // اگر هیچ داده‌ای پس از فیلتر باقی نماند
    if (filteredResponse.length === 0) {
        $("#resultsChart").hide();  // مخفی کردن نمودار
        showToast("  نرخ رشد مثبت در بازه زمانی انتخاب شده وجود ندارد. ", "warning");  // نمایش پیام
        return;
    }
    filteredResponse.forEach((item, index) => {
        let numberValue = filterType == 2 ? Math.round(item.Numbers) : item.Numbers;
        const formattedNumber = numberValue.toLocaleString() + (filterType == 2 ? "%" : "");
        $(`<div class='product-card'>
                <div class='product-rank'>${index + 1}</div>
                <h6>${item.Name}</h6>
                <p>${labelMap[filterType]}: ${formattedNumber}</p>
            </div>`).appendTo(resultsBody);
    });
    // ارسال مقدار صحیح برای label
    updateChart(filteredResponse, labelMap[filterType], filterType);
}
let chartInstance = null;
function updateChart(data, label, filterType) {
    if (chartInstance) chartInstance.destroy();
    // فیلتر کردن داده‌ها بر اساس شرط مورد نظر
    const filteredData = data.filter(item => !(filterType == 2 && item.Numbers <= 0));
    // استخراج داده‌های برچسب‌ها و مقادیر پس از فیلتر کردن
    const filteredLabels = filteredData.map(item => item.Name);
    const filteredFormattedData = filteredData.map(item => filterType == 2 ? Math.round(item.Numbers) : item.Numbers);
    // اگر هیچ داده‌ای پس از فیلتر باقی نماند، فقط نمودار را نادیده بگیر
    // ایجاد نمودار جدید
    chartInstance = new Chart(document.getElementById('resultsChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: filteredLabels,  // استفاده از برچسب‌های فیلتر شده
            datasets: [{
                label: label,
                data: filteredFormattedData,  // استفاده از داده‌های فیلتر شده
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let value = context.raw;
                            return filterType == 2 ? `${value}%` : value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}
/////////////////////////////////////////////////////////////////

function getReportDist(pageNumber = 1, pageSize = 10) {
    var data = getcomboValues();
    $("#ReportTbl").dxDataGrid({
        //dataSource: [],
        stateStoring: {
            enabled: true,
            type: "localStorage",   // or "sessionStorage"
            storageKey: "ReportTbl" // unique key for this grid
        },
        dataSource: new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                if (loadOptions.skip === undefined) {
                    loadOptions.skip = 0;
                    loadOptions.take = 10
                }
                var params = {
                    companyId: data.companyId || 0,
                    distId: data.distId,
                    brandId: data.brandId,
                    dateFrom: data.dateFrom,
                    dateTo: data.dateTo,
                    srcIsDist: 1,
                    financePrdtId: data.financePrdtId,
                    pageNumber: (loadOptions.skip / loadOptions.take) + 1,
                    pageSize: loadOptions.take,
                    sortColumn: loadOptions.sort ? loadOptions.sort[0].selector : 'itemDate',
                    sortOrder: loadOptions.sort ? (loadOptions.sort[0].desc ? 'DESC' : 'ASC') : 'DESC',
                    filterCustomerNames: null,
                    filterProductIds: null,
                    filterCompanyIds: null,
                    filterBrands: getSelectedFilterValues(loadOptions.filter, "brandId"),
                    filterDistributorIds: getSelectedFilterValues(loadOptions.filter, "distributorId"),
                    filterProductIds: getSelectedFilterValues(loadOptions.filter, "ProductFinanceId"),
                    filterCustomerNames: getSelectedFilterValues(loadOptions.filter, "CustomerName"),
                    filterCompanyIds: getSelectedFilterValues(loadOptions.filter, "companyId"),
                    filterStateId: getSelectedFilterValues(loadOptions.filter, "stateId")
                };
                return $.ajax({
                    url: '../controller/services.asmx/GetReport',
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ data: params })
                }).then(response => {
                    var parsedResponse = JSON.parse(response.d);
                    window.totalSale = parsedResponse.totalRecords[0].totalSale
                    window.totalQty = parsedResponse.totalRecords[0].totalSaleAmount
                    window.totalPrizeQty = parsedResponse.totalRecords[0].totalPrizeQuantity
                    setTimeout(function () {
                        var html1 = `<div id="reportTblTotalSum" class="dx-datagrid-total-footer dx-datagrid-nowrap" style="padding-left: 0px;"><div class="" role="presentation"><table class="dx-datagrid-table dx-datagrid-table-fixed" role="presentation"><colgroup><col style="width: 61.734px;"><col style="width: 235.641px;"><col style="width: auto;"><col style="width: 102.328px;"><col style="width: 112.672px;"><col style="width: 79.016px;"><col style="width: 62.156px;"><col style="width: 116.063px;"><col style="width: 95.25px;"><col style="width: 82.281px;"></colgroup><tbody role="presentation" class=""><tr class="dx-row" role="row"><td aria-selected="false" role="gridcell" aria-colindex="1" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="2" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">جمع</div></td><td aria-selected="false" role="gridcell" aria-colindex="3" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="4" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="5" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="6" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="7" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">${threeDigit(window.totalQty)}</div></td><td aria-selected="false" role="gridcell" aria-colindex="8" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">${threeDigit(window.totalSale)}</div></td><td aria-selected="false" role="gridcell" aria-colindex="9" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">${threeDigit(window.totalPrizeQty)}</div></td><td aria-selected="false" role="gridcell" aria-colindex="10" style="text-align: right;"></td></tr></tbody></table></div></div>`
                        var html2 = `<div class="" role="presentation"><table class="dx-datagrid-table dx-datagrid-table-fixed" role="presentation"><colgroup><col style="width: 61.734px;"><col style="width: 235.641px;"><col style="width: auto;"><col style="width: 102.328px;"><col style="width: 112.672px;"><col style="width: 79.016px;"><col style="width: 62.156px;"><col style="width: 116.063px;"><col style="width: 95.25px;"><col style="width: 82.281px;"></colgroup><tbody role="presentation" class=""><tr class="dx-row" role="row"><td aria-selected="false" role="gridcell" aria-colindex="1" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="2" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">جمع</div></td><td aria-selected="false" role="gridcell" aria-colindex="3" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="4" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="5" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="6" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="7" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">${threeDigit(window.totalQty)}</div></td><td aria-selected="false" role="gridcell" aria-colindex="8" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">${threeDigit(window.totalSale)}</div></td><td aria-selected="false" role="gridcell" aria-colindex="9" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">${threeDigit(window.totalPrizeQty)}</div></td><td aria-selected="false" role="gridcell" aria-colindex="10" style="text-align: right;"></td></tr></tbody></table></div>`
                        if ($("#reportTblTotalSum").length) {
                            $("#reportTblTotalSum").html(html2)
                        }
                        else {
                            $(".dx-datagrid-rowsview.dx-datagrid-nowrap.dx-last-row-border").after(html1)
                        }
                    }, 100)
                    return {
                        data: parsedResponse.services,
                        totalCount: parseInt(parsedResponse.totalRecords[0].totalRecords, 10) || 0
                    };
                });
            }
        }),
        columns: [
            {
                dataField: "RowNum",
                caption: "ردیف",
                allowFiltering: false,
                width: "auto"
            },
            {
                dataField: "CustomerName",
                caption: "نام مشتری",
                width: "auto",
                allowSorting: true,
                lookup: {
                    dataSource: allData.customerDist || getDistinctValues("CustomerName"),
                    valueExpr: "CustomerName",
                    displayExpr: "CustomerName"
                },
                cellTemplate: function (container, options) {
                    container.html(`<div>${options.value}</div><div class="text-secondary" style="font-size: 10px;">${options.data.CustomerAddress}</div>`);
                }
            },
            {
                dataField: "ProductFinanceId",
                caption: "نام کالا",
                lookup: {
                    dataSource: allData.products || getDistinctValues("ProductFinanceName"),
                    valueExpr: "value",
                    displayExpr: "name"
                },
                cellTemplate: function (container, options) {
                    container.html(`<span>${(options.displayValue) ? options.displayValue : "<span class='text-danger'>(متصل نشده)&nbsp;</span>" + options.data.GoodsName}</span>`);
                }
            },
            {
                dataField: "brandId",
                caption: "برند",
                width: "auto",
                lookup: {
                    dataSource: allData.brands,
                    valueExpr: "bId",
                    displayExpr: "bName_FA"
                }
            },
            {
                dataField: "companyId",
                caption: "نام شرکت",
                width: "auto",
                lookup: {
                    dataSource: allData.companies || getDistinctValues("companyName_en"),
                    valueExpr: "cId",
                    displayExpr: "cName_FA"
                }
            },
            {
                dataField: "distributorId",
                caption: "پخش",
                width: "auto",
                lookup: {
                    dataSource: allData.distributors || getDistinctValues("distributorName"),
                    valueExpr: "id",
                    displayExpr: "distName_FA"
                }
            },
            {
                dataField: "saleAmount", // ✅ Ensure it matches the actual data field name
                caption: "تعداد",
                width: "auto",
                allowFiltering: false,
                cellTemplate: function (container, options) {
                    container.html(`<span>\u200E${threeDigit(options.value)}</span>`);
                }
            },
            {
                dataField: "goodsPrice",
                caption: "مبلغ",
                width: "200px",
                allowFiltering: false,
                cellTemplate: function (container, options) {
                    container.html(`<span>\u200E${threeDigit(options.value)}</span>`);
                }
            },
            {
                dataField: "prizeQuantity",
                caption: "تعداد جایزه",
                width: "auto",
                allowFiltering: false,
                cellTemplate: function (container, options) {
                    container.html(`<span>\u200E${threeDigit(options.value)}</span>`);
                }
            },
            {
                dataField: "stateId",
                caption: "استان",
                width: "auto",
                lookup: {
                    dataSource: provinces,
                    valueExpr: "Id",
                    displayExpr: "StateName"
                }
            },
            {
                dataField: "itemDate",
                caption: "تاریخ",
                width: "auto",
                allowFiltering: false
            },
        ],
        remoteOperations: {
            paging: true,
            sorting: true,
            filtering: true
        },
        headerFilter: { visible: true, allowSearch: true },
        showBorders: true,
        showColumnLines: true,
        showRowLines: true,
        rtlEnabled: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        groupPanel: {
            visible: false
        },
        grouping: {
            autoExpandAll: false
        },
        columnChooser: {
            enabled: false,
            mode: "select"
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css({
                    "background-color": "#524e4e",
                    "color": "white",
                });
            }
            if (e.rowType === "data") {
                let bgColor = "";
                let textColor = "#333";
                if (e.data.goodsPrice > 0) bgColor = "#e6f4ea";
                if (e.data.goodsPrice < 0) bgColor = "#f8d7da";
                if (e.data.prizeQuantity > 0) bgColor = "#ddeeff";
                if (e.data.prizeQuantity < 0) bgColor = "#fff3cd";
                e.rowElement.css({
                    "background-color": bgColor,
                    "color": textColor
                });
            }
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift(
                {
                    widget: "dxButton",
                    location: "after", // ✅ Ensures the button appears at the right
                    options: {
                        text: "",
                        icon: "refresh",
                        hint: "لغو تمامی فیلترها و مرتب سازی ها",
                        onClick: function () {
                            let grid = $("#ReportTbl").dxDataGrid("instance");
                            grid.clearFilter();  // ✅ Clears all column filters
                            grid.clearSorting(); // ✅ Clears all sorting
                        }
                    }
                },
                {
                    widget: "dxButton",
                    location: "after",
                    options: {
                        hint: "خروجی اکسل",
                        icon: "export",
                        onClick: function () {
                            getSaleFullData()
                            //$("#ReportTbl").dxDataGrid("instance").showColumnChooser();
                        }
                    }
                }
            );
        },
    });
}
function getSelectedFilterValues(filterArray, columnName) {
    if (!filterArray) return null;
    let values = [];
    if (Array.isArray(filterArray) && filterArray.length > 1) {
        filterArray.forEach((item) => {
            if (Array.isArray(item) && item[0] === columnName && item[1] === "=") {
                values.push(item[2]);
            }
        });
    }
    if (Array.isArray(filterArray) && filterArray[0] === columnName && filterArray[1] === "=") {
        values.push(filterArray[2]);
    }
    return values.length ? values.join(",") : null;
}
function getDistinctValues(columnName) {
    var data
    $.ajax({
        url: '../controller/services.asmx/GetDistinctValues',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        data: JSON.stringify({ column: columnName }),
        success: function (response) {
            let parsedResponse = JSON.parse(response.d);
            if (columnName == "CustomerName") {
                allData.customerDist = parsedResponse
            }
            if (columnName == "CustomerNameFinance") {
                allData.customerFinance = parsedResponse
            }
            data = parsedResponse
        },
        error: function (xhr, status, error) {
            console.error("Error fetching distinct values:", status, error);
            reject(error); // Handle errors properly
        }
    });
    return data
}
function getReportFinance(pageNumber = 1, pageSize = 20) {
    var data = getcomboValues();
    $("#ReportTblFinance").dxDataGrid({
        dataSource: new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                if (loadOptions.skip === undefined) {
                    loadOptions.skip = 0;
                    loadOptions.take = 20
                }
                var params = {
                    companyId: data.companyId || 0,
                    brandId: data.brandId,
                    dateFrom: data.dateFrom,
                    dateTo: data.dateTo,
                    financePrdtId: data.financePrdtId,
                    srcIsDist: 0,
                    pageNumber: (loadOptions.skip / loadOptions.take) + 1,
                    pageSize: loadOptions.take,
                    sortColumn: loadOptions.sort ? loadOptions.sort[0].selector : 'itemDate',
                    sortOrder: loadOptions.sort ? (loadOptions.sort[0].desc ? 'DESC' : 'ASC') : 'DESC',
                    filterCustomerNames: null,
                    filterProductIds: null,
                    filterCompanyIds: null,
                    filterBrands: getSelectedFilterValues(loadOptions.filter, "brandId"),
                    filterProductIds: getSelectedFilterValues(loadOptions.filter, "ProductFinanceId"),
                    filterCustomerNames: getSelectedFilterValues(loadOptions.filter, "CustomerName"),
                    filterCustomerGroup: getSelectedFilterValues(loadOptions.filter, "CustomerGroup"),
                    filterCompanyIds: getSelectedFilterValues(loadOptions.filter, "companyId"),

                };
                return $.ajax({
                    url: '../controller/services.asmx/GetReportFinance',
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ data: params })
                }).then(response => {
                    var parsedResponse = JSON.parse(response.d);
                    window.totalSale = parsedResponse.totalRecords[0].totalSale
                    window.totalQty = parsedResponse.totalRecords[0].totalSaleAmount
                    window.totalPrizeQty = parsedResponse.totalRecords[0].totalPrizeQuantity
                    setTimeout(function () {
                        var html1 = `<div id="reportTblFncTotalSum" class="dx-datagrid-total-footer dx-datagrid-nowrap" style="padding-left: 0px;"><div class="" role="presentation"><table class="dx-datagrid-table dx-datagrid-table-fixed" role="presentation"><colgroup><col style="width: 61.734px;"><col style="width: 235.641px;"><col style="width: auto;"><col style="width: 102.328px;"><col style="width: 112.672px;"><col style="width: 79.016px;"><col style="width: 62.156px;"><col style="width: 116.063px;"><col style="width: 95.25px;"><col style="width: 82.281px;"></colgroup><tbody role="presentation" class=""><tr class="dx-row" role="row"><td aria-selected="false" role="gridcell" aria-colindex="1" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="2" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">جمع</div></td><td aria-selected="false" role="gridcell" aria-colindex="3" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="4" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="5" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="6" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="7" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">${threeDigit(window.totalQty)}</div></td><td aria-selected="false" role="gridcell" aria-colindex="8" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">${threeDigit(window.totalSale)}</div></td><td aria-selected="false" role="gridcell" aria-colindex="9" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">${threeDigit(window.totalPrizeQty)}</div></td><td aria-selected="false" role="gridcell" aria-colindex="10" style="text-align: right;"></td></tr></tbody></table></div></div>`
                        var html2 = `<div class="" role="presentation"><table class="dx-datagrid-table dx-datagrid-table-fixed" role="presentation"><colgroup><col style="width: 61.734px;"><col style="width: 235.641px;"><col style="width: auto;"><col style="width: 102.328px;"><col style="width: 112.672px;"><col style="width: 79.016px;"><col style="width: 62.156px;"><col style="width: 116.063px;"><col style="width: 95.25px;"><col style="width: 82.281px;"></colgroup><tbody role="presentation" class=""><tr class="dx-row" role="row"><td aria-selected="false" role="gridcell" aria-colindex="1" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="2" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">جمع</div></td><td aria-selected="false" role="gridcell" aria-colindex="3" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="4" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="5" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="6" style="text-align: right;"></td><td aria-selected="false" role="gridcell" aria-colindex="7" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">${threeDigit(window.totalQty)}</div></td><td aria-selected="false" role="gridcell" aria-colindex="8" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">${threeDigit(window.totalSale)}</div></td><td aria-selected="false" role="gridcell" aria-colindex="9" style="text-align: right;"><div class="dx-datagrid-summary-item dx-datagrid-text-content" style="text-align: right;">${threeDigit(window.totalPrizeQty)}</div></td><td aria-selected="false" role="gridcell" aria-colindex="10" style="text-align: right;"></td></tr></tbody></table></div>`
                        if ($("#reportTblFncTotalSum").length) {
                            $("#reportTblFncTotalSum").html(html2)
                        }
                        else {
                            $(".dx-datagrid-rowsview.dx-datagrid-nowrap.dx-last-row-border").after(html1)
                        }
                    }, 100)
                    return {
                        data: parsedResponse.services,
                        totalCount: parseInt(parsedResponse.totalRecords[0].totalRecords, 10) || 0
                    };
                });
            }
        }),
        columns: [
            {
                dataField: "RowNum",
                caption: "ردیف",
                allowFiltering: false,
                width: "auto"
            },
            {
                dataField: "CustomerName",
                caption: "نام مشتری",
                width: "auto",
                allowSorting: true,
                lookup: {
                    dataSource: getDistinctValues("CustomerNameFinance"),
                    valueExpr: "CustomerName",
                    displayExpr: "CustomerName"
                },
                cellTemplate: function (container, options) {
                    container.html(`<span>${options.value}</span>`);
                }
            },
            {
                dataField: "CustomerGroup",
                caption: "گروه مشتری",
                width: "auto",
                allowSorting: true,
                lookup: {
                    dataSource: getDistinctValues("CustomerGroupFinance"),
                    valueExpr: "CustomerGroup",
                    displayExpr: "CustomerGroup"
                },
                cellTemplate: function (container, options) {
                    container.html(`<span>${options.value}</span>`);
                }
            },
            {
                dataField: "ProductFinanceId",
                caption: "نام کالا",
                lookup: {
                    dataSource: allData.products || getDistinctValues("ProductFinanceName"),
                    valueExpr: "value",
                    displayExpr: "name"
                },
                cellTemplate: function (container, options) {
                    container.html(`<span>${options.data.GoodsName}</span>`);
                }
            },
            {
                dataField: "brandId",
                caption: "برند",
                width: "auto",
                lookup: {
                    dataSource: allData.brands,
                    valueExpr: "bId",
                    displayExpr: "bName_FA"
                }
            },
            {
                dataField: "companyId",
                caption: "نام شرکت",
                width: "auto",
                lookup: {
                    dataSource: allData.companies || getDistinctValues("companyName_en"),
                    valueExpr: "cId",
                    displayExpr: "cName_FA"
                }
            },
            {
                dataField: "saleAmount", // ✅ Ensure it matches the actual data field name
                caption: "تعداد",
                width: "auto",
                allowFiltering: false,
                cellTemplate: function (container, options) {
                    container.html(`<span>\u200E${threeDigit(options.value)}</span>`);
                }
            },
            {
                dataField: "goodsPrice",
                caption: "مبلغ",
                width: "200px",
                allowFiltering: false,
                cellTemplate: function (container, options) {
                    container.html(`<span>\u200E${threeDigit(options.value)}</span>`);
                }
            },
            {
                dataField: "itemDate",
                caption: "تاریخ",
                width: "auto",
                allowFiltering: false
            },
        ],
        remoteOperations: {
            paging: true,
            sorting: true,
            filtering: true
        },
        headerFilter: { visible: true, allowSearch: true },
        showBorders: true,
        showColumnLines: true,
        showRowLines: true,
        rtlEnabled: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        groupPanel: {
            visible: false
        },
        grouping: {
            autoExpandAll: false
        },
        columnChooser: {
            enabled: false,
            mode: "select"
        },
        onRowPrepared: function (e) {
            if (e.rowType === "header") {
                e.rowElement.css({
                    "background-color": "#524e4e",
                    "color": "white",
                });
            }
            if (e.rowType === "data") {
                let bgColor = "";
                let textColor = "#333";
                if (e.data.goodsPrice > 0) bgColor = "#e6f4ea";
                if (e.data.goodsPrice < 0) bgColor = "#f8d7da";
                if (e.data.prizeQuantity > 0) bgColor = "#ddeeff";
                if (e.data.prizeQuantity < 0) bgColor = "#fff3cd";
                e.rowElement.css({
                    "background-color": bgColor,
                    "color": textColor
                });
            }
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift(
                {
                    widget: "dxButton",
                    location: "after", // ✅ Ensures the button appears at the right
                    options: {
                        text: "",
                        icon: "refresh",
                        hint: "لغو تمامی فیلترها و مرتب سازی ها",
                        onClick: function () {
                            let grid = $("#ReportTblFinance").dxDataGrid("instance");
                            grid.clearFilter();  // ✅ Clears all column filters
                            grid.clearSorting(); // ✅ Clears all sorting
                        }
                    }
                },
                {
                    widget: "dxButton",
                    location: "after",
                    options: {
                        hint: "خروجی اکسل",
                        icon: "export",
                        onClick: function () {
                            getSaleFullDataFinance()
                            //$("#ReportTbl").dxDataGrid("instance").showColumnChooser();
                        }
                    }
                }
            );
        },
    });
}
function getInitialData() {
    $.ajax({
        url: '../controller/services.asmx/GetInitialData',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            checkAccess(response)
            response = JSON.parse(response.d)
            allData.companies = response.companies;
            allData.distributors = response.distributors;
            allData.brands = response.brands;
            allData.brands.forEach(function (item) {
                item.companyId = item.companyId
                    .split(",")
                    .map(id => parseInt(id.trim(), 10)); // ensures integers
            });
            allData.curDate = response.curDate;
            allData.defaultExpDate = response.defaultExpDate;
            allData.today = response.today;
            allData.months = response.months;
            allData.products = response.products;
            allData.notifs = response.notifs;
            allData.customers = response.customers;
            allData.cities = response.cities;
            allData.userSetting = response.userSetting[0];
            allData.userSetting.userSettings = JSON.parse(allData.userSetting.userSettings)
            allData.userUiElements = response.userUiElements
            initProfileSection()
            $("#cmbDateFrom").val(response.startDate)
            $("#cmbDateTo").val(response.endDate)
            $("#persian-date").val(allData.defaultExpDate)
            //$("#cmbDateTo").val(allData.curDate)
            genCmbCompanies(response.companies);
            genCmbDistributors(response.distributors);
            genCmbBrands(response.brands);
            gencmbProducts(response.products);
            gencmbCustomers(response.customers);
            genReportCmb();

            if (allData.userSetting.showUpdate == 1) {
                setTimeout(function () {
                    initVersionDetails();
                    localStorage.clear();
                }, 6000)

            }
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        },
        async: false
    });
}
function initProfileSection() {
    var userData = allData.userSetting
    $("#profileName").html(userData.firstName + ' ' + userData.lastName)
}
function saveUserSettings() {
    $.ajax({
        url: '../controller/services.asmx/saveUserSetting',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: allData.userSetting.userSettings }),
        success: function (response) {
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function logout() {
    var data = {}
    $.ajax({
        url: '../controller/services.asmx/logOut',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
            window.location.href = 'login.aspx'
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}
function genReportCmb() {
    var obj = allData.userUiElements.tabs.map(o => {
        var sheet = allData.userUiElements.sheets.filter(s => { return s.tabNo == o.tabNo })
        return {
            target: `#tab${o.tabNo}`, value: `${o.tabNo}`, text: `${o.icon} ${o.tabTitle}`, sheet: `${sheet[0].sheetNo}`
        }
    })
    //[
    //       { target: "#tab1", value: "1", text: "🚚 گزارش پخش", sheet: 0 },
    //       { target: "#tab2", value: "2", text: "💵 گزارش مالی", sheet: 0 },
    //       { target: "#tab6", value: "6", text: "🧾 مطالبات", sheet: 0 },
    //       { target: "#tab4", value: "4", text: "🛳️ خرید خارجی", sheet: 1 },
    //       { target: "#tab5", value: "5", text: "🎯 هدف گذاری", sheet: 1 },
    //       { target: "#tab3", value: "3", text: "⚙️ عملیات محصولات", sheet: 2 },
    //       //{ target: "", api: true, apiName: "form", text: "فرم ها" },
    //]
    $("#cmbOp").dxSelectBox({
        dataSource: obj,
        valueExpr: "value",
        displayExpr: "text",
        rtlEnabled: true,
        width: 200,
        value: allData?.userSetting?.userSettings?.operationValue || "1",
        placeholder: "انتخاب",
       
        
        itemTemplate: function (itemData) {
            const url = `serviceAdmin.aspx?sheet=${itemData.value}-${allData.userUiElements.sheets.find(o => o.tabNo == itemData.value)?.sheetNo}`;
            return $("<a>")
                .attr("href", url)
                .text(itemData.text)
                .css({
                    'text-decoration': 'none',
                    'color': 'inherit',
                    'display': 'block',
                    'width': '100%',
                    'font-size': '14px',
                    'font-weight': '500',
                    'letter-spacing': '0.025em',
                    'transition': 'all 0.2s ease'
                })
                .on("click", function (e) {
                    e.preventDefault();
                    setSetting("operationValue", itemData.value, false);
                    manageUrlParams("click", itemData.value, allData.userUiElements.sheets.find(o => o.tabNo == itemData.value)?.sheetNo);
                })             
        }
    });
    $('[data-target^="#sheet-"]').hide();
    allData.userUiElements.sheets.forEach(function (item) {
        $(`[data-target="#sheet-${item.tabNo}-${item.sheetNo}"]`).show()
    })
    allData.userUiElements.tabs.forEach(function (item) {
        var html = ''
        var sheetsHtml = allData.userUiElements.sheets.filter(o => { return o.tabNo == item.tabNo })

        if (sheetsHtml.length) {
            sheetsHtml.forEach(function (sh) {
                const url = `serviceAdmin.aspx?sheet=${item.tabNo}-${sh.sheetNo}`;
                html += `
                    <a href="${url}" 
                       class="sheet-tab" 
                       data-target="#sheet-${item.tabNo}-${sh.sheetNo}"
                       onclick="manageUrlParams('click','${item.tabNo}','${sh.sheetNo}'); return false;">
                        ${sh.sheetTitle}
                    </a>`;
            });

        }
        $(`#tab${item.tabNo}`).find(".sheet-tabs").html(html)
    })

}
function apiLogin(apiName) {
    var data = {}
    data.apiName = apiName
    $.ajax({
        url: '../controller/apiLogin.asmx/apiRequest',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ data: data }),
        success: function (response) {
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    })
}
function genCmbCompanies(data) {
    var initialValue = (allData.companies.length === 1)
        ? [allData.companies[0].cId]
        : (allData?.userSetting?.userSettings?.companyFilters || []);
    $("#comboCo").dxTagBox({
        dataSource: data,
        value: initialValue,
        valueExpr: "cId",
        displayExpr: "cName_FA",
        rtlEnabled: true,
        searchEnabled: true,
        width: 200,
        placeholder: "همه شرکت ها",
        showSelectionControls: true,
        showSelectAll: false,
        maxDisplayedTags: 0,
        showDropDownButton: true,
        applyValueMode: "useButtons",
        onMultiTagPreparing: function (e) {
            e.text = e.selectedItems.length + " شرکت";
            e.cancel = false;
        },
        onContentReady: function (e) {
            $(e.element).find(".dx-list-select-all").hide();
        },
        onValueChanged: function (e) {
            //var dbBrands = (e.value.length) ? allData.brands.filter(o => { return e.value.includes(o.companyId) }) : allData.brands
            var dbBrands = e.value.length
                ? allData.brands.filter(brand =>
                    brand.companyId.some(id => e.value.includes(id))
                )
                : allData.brands;
            $("#comboBrand").dxTagBox('option', 'dataSource', dbBrands)
            var dbProducts = (e.value.length) ? allData.products.filter(o => { return e.value.includes(o.cId) }) : allData.products
            $("#comboPrd").dxTagBox('option', 'dataSource', dbProducts)
            var selectedValues = e.value;
            var allItems = e.component.option("dataSource");
            if (selectedValues.length === allItems.length) {
                e.component.option("value", []);
            }
            var dbCustomers = e.value.length ? allData.customers.filter(function (co) { return e.value.includes(co.companyId) }) : allData.customers

            //        //co.companyId.some(id => e.value.includes(id))
            //) : allData.customers;
            //$("#comboCust").dxTagBox('option', 'dataSource', dbCustomers)
            $("#comboCust").dxTagBox("option", 'value', [])
            $("#comboCust").dxTagBox("option", "dataSource", new DevExpress.data.DataSource({
                store: new DevExpress.data.ArrayStore({
                    data: dbCustomers,
                    key: "keyExpr"
                }),
                paginate: true,
                pageSize: 30
            }));
            manageUrlParams("combo");
            setSetting("companyFilters", e.value)
        },
    })
    if (data.length == 1) {
        $("#comboCo").hide()
    }
}
function setSetting(path, value, shouldUpdateDb = true) {
    if (typeof path === 'string') {
        // Support dot and bracket syntax, e.g. a.b["c-d"]
        path = path
            .replace(/\[(\w+)\]/g, '.$1')         // convert [key] to .key
            .replace(/\["([^"]+)"\]/g, '.$1')     // convert ["key"] to .key
            .replace(/\['([^']+)'\]/g, '.$1')     // convert ['key'] to .key
            .split('.');                          // split into array
    }
    let current = allData.userSetting.userSettings;
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
            current[key] = {}; // create intermediate object
        }
        current = current[key];
    }
    current[path[path.length - 1]] = value;
    if (shouldUpdateDb) {
        saveUserSettings()
    }
}
function genCmbDistributors(data) {
    $("#comboDist").dxTagBox({
        dataSource: data,
        valueExpr: "id",
        displayExpr: "distName_FA",
        rtlEnabled: true,
        searchEnabled: true,
        width: 180,
        placeholder: "همه پخش ها",
        showSelectionControls: true,
        showSelectAll: false,
        maxDisplayedTags: 0,
        showDropDownButton: true,
        applyValueMode: "useButtons",
        // Called when TagBox is about to show the multi-tag
        onMultiTagPreparing: function (e) {
            // Customize the multi-tag text
            e.text = e.selectedItems.length + " پخش";
            e.cancel = false; // ensure the multi-tag is displayed
        },
        onContentReady: function (e) {
            // This selector targets the "Select All" item in the dropdown
            $(e.element).find(".dx-list-select-all").hide();
        },
        onValueChanged: function (e) {
            var selectedValues = e.value;
            var allItems = e.component.option("dataSource");
            if (selectedValues.length === allItems.length) {
                e.component.option("value", []);
            }
            manageUrlParams("combo");
        },
    })
}
function genCmbBrands(data) {
    //    data.push({ cId: -1, bName_FA: "نامعلوم" })
    $("#comboBrand").dxTagBox({
        dataSource: data,
        valueExpr: "bId",
        displayExpr: "bName_FA",
        rtlEnabled: true,
        searchEnabled: true,
        width: 220,
        placeholder: "همه برند ها",
        showSelectionControls: true,
        showSelectAll: false,
        maxDisplayedTags: 0,
        showDropDownButton: true,
        applyValueMode: "useButtons",
        // Called when TagBox is about to show the multi-tag
        onMultiTagPreparing: function (e) {
            // Customize the multi-tag text
            e.text = e.selectedItems.length + " برند";
            e.cancel = false; // ensure the multi-tag is displayed
        },
        onContentReady: function (e) {
            // This selector targets the "Select All" item in the dropdown
            $(e.element).find(".dx-list-select-all").hide();
        },
        onValueChanged: function (e) {
            var dbProducts = (e.value.length) ? allData.products.filter(o => { return e.value.includes(o.bId) }) : allData.products
            $("#comboPrd").dxTagBox('option', 'dataSource', dbProducts)
            var selectedValues = e.value;
            var allItems = e.component.option("dataSource");
            if (selectedValues.length === allItems.length) {
                e.component.option("value", []);
            }
            manageUrlParams("combo");
        },
    });
}
function gencmbCustomers(data) {
    $("#comboCust").dxTagBox({
        valueExpr: "keyExpr",
        displayExpr: "FullName",
        rtlEnabled: true,
        searchEnabled: true,
        width: 150,
        placeholder: "همه مشتریان",
        showSelectionControls: true,
        showSelectAll: false,
        maxDisplayedTags: 0,
        dropDownOptions: {
            height: 600,
            width: 700,
            scrollable: true
        },
        dataSource: new DevExpress.data.DataSource({
            store: data,
            paginate: true,
            pageSize: 30 // ← فقط 100 آیتم در هر بار لود
        }),
        showDropDownButton: true,
        applyValueMode: "useButtons",
        // Called when TagBox is about to show the multi-tag
        onMultiTagPreparing: function (e) {
            // Customize the multi-tag text
            e.text = e.selectedItems.length + " مشتری";
            e.cancel = false; // ensure the multi-tag is displayed
        },
        onContentReady: function (e) {
            // This selector targets the "Select All" item in the dropdown
            $(e.element).find(".dx-list-select-all").hide();
        },
        onValueChanged: function (e) {
            var selectedValues = e.value;
            var allItems = e.component.option("dataSource");
            if (selectedValues.length === allItems.length) {
                e.component.option("value", []);
            }
            manageUrlParams("combo");
        },
        itemTemplate: function (itemData) {
            var companyName = allData.companies.find(o => { return o.cId == itemData.companyId })?.cName_FA
            return `<div style="display:flex;justify-content:space-between">
                    <span>${itemData.FullName}<span style="font-size:11px;color:#7f7e7e">(${companyName})</span>
                </div>`;
        }

    });
}

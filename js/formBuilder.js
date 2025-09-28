let currentWidget = null;


$(document).ready(function () {
    $("#submitForm").on("click", function () {
        const data = exportFormAsJson();
        console.log("Form JSON:", JSON.stringify(data, null, 2));
    });
});


function recalculateColumnWidths(row) {
    const cols = row.find(".column");
    const colWidth = (100 / cols.length) + "%";
    cols.css("width", colWidth);
}

function addRow(colCount) {
    const rowWrapper = $('<div class="row-wrapper"></div>');
    const rowControls = $(`<div class="row-controls"><div class="delete-row"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg></div></div>`);
    const row = $('<div class="frow"></div>');

    for (let i = 0; i < colCount; i++) {
        const col = $(`
          <div class="column connectedSortable">
            <div class="delete-column">×</div>
          </div>
        `);
        row.append(col);
    }

    rowWrapper.append(rowControls).append(row);
    $('#formBuild').append(rowWrapper);

    rowControls.find(".delete-row").on("click", function () {
        rowWrapper.remove();
    });

    row.find(".delete-column").on("click", function () {
        $(this).parent().remove();
        recalculateColumnWidths(row);
    });

    recalculateColumnWidths(row);
    makeSortable();
}

function makeSortable() {
    $(".column").sortable({
        connectWith: ".connectedSortable",
        placeholder: "widget-placeholder",
        tolerance: "pointer",
        revert: true
    }).droppable({
        accept: ".widget",
        drop: function (event, ui) {
            const type = ui.helper.data("type");
            const col = $(this);
            addWidgetToColumn(col, type);
        }
    });
}

$(function () {
    $(".widget").draggable({
        helper: "clone"

    });

    $("#applySettingsBtn").on("click", function () {
        if (!currentWidget) return;

        const newLabel = $("#widgetLabel").val();
        const newPlaceholder = $("#widgetPlaceholder").val();
        const newOptions = $("#widgetOptions").val();
        const newInputType = $("#widgetInputType").val();
        const newBtnType = $("#widgetButtonType").val();

        const labelEl = currentWidget.find("label.form-label");
        labelEl.text(newLabel);

        const realInput = currentWidget.find("input[type='text'], input[type='number'], input[type='email'], input[type='password']").filter(function () {
            return !$(this).closest(".dx-selectbox").length;
        }).last();

        if (realInput.length) {
            realInput.attr("placeholder", newPlaceholder);
            if (newInputType) {
                realInput.attr("type", newInputType);
            }
        }

        const selectBox = currentWidget.find(".dx-selectbox");
        if (selectBox.length && newOptions) {
            const instance = selectBox.dxSelectBox("instance");
            const opts = newOptions.split(",").map(opt => opt.trim());
            instance.option("items", opts);
        }

        if (newBtnType) {
            const btn = currentWidget.find("button").not(".remove-widget").first();
            btn.attr("type", newBtnType);
        }

        $("#widgetSettingsPanel").css("right", "-400px");
    });

});

function addWidgetToColumn(col, type) {
    let widget;
    switch (type) {
        case "text":
            widget = $(`
            <div class="form-item">
              <div class="remove-widget">×</div>
              <label class="form-label">لیبل(پیش فرض)‌</label>
              <input type="text" placeholder="متن وارد کنید">
            </div>
          `);
            break;
        case "number":
            widget = $(`
            <div class="form-item">
              <div class="remove-widget">×</div>
              <label class="form-label">لیبل(پیش فرض)</label>
              <input type="number" placeholder="متن وارد کنید">
            </div>
          `);
            break;
        case "email":
            widget = $(`
            <div class="form-item">
              <div class="remove-widget">×</div>
              <label class="form-label">لیبل(پیش فرض)</label>
              <input type="email" placeholder="متن وارد کنید">
            </div>
          `);
            break;
        case "button":
            widget = $(`
            <div class="form-item">
              <div class="remove-widget">×</div>
              <button>ارسال</button>
            </div>
          `);
            break;
        case "select":
            widget = $(`
            <div class="form-item">
              <div class="remove-widget">×</div>
              <label class="form-label">لیبل(پیش فرض)</label>
              <div class="dx-select"></div>
            </div>
          `);
            break;
    }
    if (widget) {
        widget.find(".remove-widget").on("click", function () {
            widget.remove();
        });

        widget.on("click", function () {
            openWidgetSettings(widget);
        });

        col.append(widget);

        if (type === "select") {
            widget.find(".dx-select").dxSelectBox({
                items: ["گزینه ۱", "گزینه ۲"],
                rtlEnabled: true,
                placeholder: "انتخاب کنید"
            });
        }
    }
}

function openWidgetSettings(container) {
    currentWidget = container;
    const labelText = container.find("label.form-label").text() || "";

    // پیدا کردن input واقعی (نه dxSelectBox)
    const realInput = container.find("input[type='text'], input[type='number'], input[type='email'], input[type='password']").filter(function () {
        return !$(this).closest(".dx-selectbox").length;
    }).last();

    const placeholder = realInput.attr("placeholder") || "";

    let html = `
        <label>Label:</label>
        <input type="text" id="widgetLabel" value="${labelText}" />
        <div class="selectLable">
             <label>Placeholder:</label>
             <input type="text" id="widgetPlaceholder" value="${placeholder}" />
        </div>
    `;

    // 🎯 تنظیم نوع input واقعی
    if (realInput.length) {
        const inputType = realInput.attr("type") || "text";
        html += `<div class="selectLable">
            <label>نوع ورودی:</label>
                 <select id="widgetInputType">
                     <option value="text" ${inputType === "text" ? "selected" : ""}>متن</option>
                     <option value="number" ${inputType === "number" ? "selected" : ""}>عدد</option>
                     <option value="email" ${inputType === "email" ? "selected" : ""}>ایمیل</option>
                     <option value="password" ${inputType === "password" ? "selected" : ""}>رمز عبور</option>
                 </select>
            </div>
        `;
    }

    // 🎯 تنظیم گزینه‌های dropdown (dxSelectBox)
    const selectBox = container.find(".dx-selectbox");
    if (selectBox.length) {
        const items = selectBox.dxSelectBox("instance").option("items").join(", ");
        html += `
            <label>گزینه‌ها (با , جدا کنید):</label>
            <input type="text" id="widgetOptions" value="${items}" />
        `;
    }

    // 🎯 تنظیم نوع دکمه (submit, reset, button)
    const buttonEl = container.find("button").not(".remove-widget").first();
    if (buttonEl.length && !buttonEl.hasClass("dx-button")) {
        const btnType = buttonEl.attr("type") || "button";
        html += `<div class="selectLable">
            <label>نوع دکمه:</label>
                 <select id="widgetButtonType">
                     <option value="button" ${btnType === "button" ? "selected" : ""}>عادی</option>
                     <option value="submit" ${btnType === "submit" ? "selected" : ""}>ارسال فرم (submit)</option>
                     <option value="reset" ${btnType === "reset" ? "selected" : ""}>ریست فرم (reset)</option>
                 </select>
            </div>
        `;
    }

    $("#settingsContent").html(html);
    $("#widgetSettingsPanel").css("right", "0");
    $("#closeBtn").on("click", function () {
        $("#widgetSettingsPanel").css("right", "-400px");
    })
}

function exportFormAsJson() {
    const formJson = [];

    $(".row-wrapper").each(function () {
        const row = [];

        $(this).find(".column").each(function () {
            const column = [];

            $(this).find(".form-item").each(function () {
                const widget = {};
                const label = $(this).find("label.form-label").text().trim();

                const input = $(this).find("input, select, button, .dx-selectbox").last();

                if (input.is("input")) {
                    widget.type = input.attr("type");
                    widget.placeholder = input.attr("placeholder") || "";
                } else if (input.is("button")) {
                    widget.type = "button";
                    widget.text = input.text();
                } else if (input.hasClass("dx-selectbox")) {
                    widget.type = "select";
                    const items = input.dxSelectBox("instance").option("items");
                    widget.items = items;
                    widget.placeholder = input.dxSelectBox("instance").option("placeholder");
                }

                widget.label = label;

                column.push(widget);
            });

            row.push(column);
        });

        formJson.push(row);
    });

    return formJson;
}



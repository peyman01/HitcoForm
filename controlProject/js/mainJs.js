function loader(mode, id = "loader") {
    if (mode == 'hide') $("#" + id).css("display","none");
    if (mode == 'show') $("#" + id).css("display","flex");
}
YKN = function (txt) {
    const sts = 'یک۰۱۲۳۴۵۶۷۸۹';
    const str = 'يك0123456789';
    var ret = ""
        txt = txt || "";
    for (var i = 0; i < txt.length; i++) {
        var ch = txt.charAt(i);
        if (sts.indexOf(ch) >= 0)
            ch = str.charAt(sts.indexOf(ch));
        ret += ch;
    }
    return ret;
};
function threeDigit(nu) {
    if (nu == null || isNaN(nu)) return "";
    let num = parseFloat(nu);
    if (isNaN(num)) return "";
    num = num.toFixed(0);
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
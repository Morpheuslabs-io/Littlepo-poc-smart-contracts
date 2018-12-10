(function ($) {
    // USE STRICT
    "use strict";

    applyCancelAction();
    applyBackAction();
    applyLogoutAction();
    applyPrintQR();
})(jQuery);

function applyCancelAction() {
    $("#cancel").click(function() {
        window.location.href = "/menu";
    });
}
function applyBackAction() {
    $("#back").click(function() {
        let url = $(this).attr('url');
        url = (!url || url=="")?"/menu":url;
        // alert($(this).val());
        // console.log($(this).val());
        window.location.href = url;
    });
}
function applyLogoutAction() {
    $("#logout").click(function() {
        window.location.href = '/login';
    });
}
function applyPrintQR() {
    $("#printQR").click(function() {
        $("#qrcode").print();
    });
}
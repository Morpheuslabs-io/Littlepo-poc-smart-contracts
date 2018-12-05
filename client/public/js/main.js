(function ($) {
    // USE STRICT
    "use strict";

    applyCancelAction();
    applyBackAction();
    applyLogoutAction();
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

function applySelectBoxType(selectorId) {
    let newSelector = "new"+selectorId;

    let newSelectorBox = $("<ul></ul>").addClass("list-item").attr("id", newSelector).attr("name", newSelector);
    let selector = "#"+selectorId;
    $(selector).parent().append(newSelectorBox);
    
    $(selector+' option').each(function(){
        newSelectorBox.append('<li value="' + $(this).val() + '">'+$(this).text()+'</li>');
    });

    $(selector).remove();

    newSelectorBox.attr('id', selectorId);
    $(selector+' li').first().addClass('init');
    $(selector).on("click", ".init", function() {
        $(this).closest(selector).children('li:not(.init)').toggle('slow');
    });

    var allOptions = $(selector).children('li:not(.init)');
    $(selector).on("click", "li:not(.init)", function() {
        allOptions.removeClass('selected');
        $(this).addClass('selected');
        $(selector).children('.init').html($(this).html());
        allOptions.toggle('slow');
    });
}
let infoboxTimeout = null;

function infobox_close(){
    let $box = $(".m-infobox");
    $box.css("bottom", "");
    $box.css("display", "");
    clearTimeout(infoboxTimeout);
    infoboxTimeout = null;
}

function infobox_show(message, delay=4000){
    if(infoboxTimeout !== null){
        clearTimeout(infoboxTimeout);
    }

    let $box = $(".m-infobox");
    if($box.length == 0){
        let $div = $("<div>", {class: "d-flex justify-content-center m-infobox"});
        $('body').append($div);
        $box = $div;
    }

    $box.html(`<div class="pb-3 pt-3 pe-5 ps-5">${message}</div>`);
    $box.css("bottom", "15px");
    $box.css("display", "flex");

    if(delay !== null){
        infoboxTimeout = setTimeout(infobox_close, delay);
    }
}
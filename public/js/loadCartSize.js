function loadCartSize(){
    let $indicators = $(".header-cart-size-preview");
    $.ajax({
        type: "post",
        url: "/cart/size"
    }).then((success)=>{
        $indicators.eq(0).text(success);
        $indicators.eq(1).text(success);
    }).fail(()=>{
        infobox_show("Cannot load cart size...");
    });
}
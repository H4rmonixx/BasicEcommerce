let GlobalCartContent = null;
let GlobalPersonalData = null;
let GlobalShipmentData = null;

function refreshCart(){
    return $.ajax({
        method: "post",
        url: "/cart/load"
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            GlobalCartContent = json;
            return json;
        } catch (e) {
            console.log("Unable to load cart");
            return $.Deferred().reject("Error occurred").promise();
        }
        
    }).then((cart) => {
        let $root = $("#prods-in-cart-container");
        $root.empty();

        if(cart.length == 0){
            let $info = $("<div>", {
                class: "m-b-500 fs-4 d-flex justify-content-center p-2",
                text: "Nothing in cart yet."
            })
            $root.append($info);
            return;
        }

        cart.forEach((product_variant, index) => {

            $.ajax({
                url: "/product/load/variant/" + product_variant.product_variant_id,
                method: "post"
            }).then((success) => {

                let prod = null;
                try{
                    prod = JSON.parse(success);
                    GlobalCartContent[index].product = prod;
                } catch (e) {
                    return $.Deferred().reject("All products not loaded.").promise();
                }

                let $main = $("<div>", {class: "prod-in-cart position-relative row mb-4 gx-0"});

                let $soldDiv = $("<div>", {
                    class: "prod-in-cart-sold rounded d-none position-absolute start-0 top-0 w-100 h-100 justify-content-center align-items-center flex-column"
                });
                $soldDiv.append($("<p>", {class: "fs-4 fw-bold text-white", text: "SOLD OUT"}));
                let $soldDivA = $("<button>", {type: "button", class: "btn btn-link text-white btn-sm", text: "Delete from cart"});
                $soldDivA.on("click", ()=>{deleteFromCart(index)});
                $soldDiv.append($soldDivA);

                let $imgDiv = $("<div>", {class: "col-2 d-flex align-items-center"});
                $imgDiv.append($("<img>", {class: "w-100 rounded p-2", src: "/assets/products/" + prod.photos[0], alt: "Product photo"}));

                let $txtDiv = $("<div>", {class: "col-10 col-sm-4 ps-3 ps-sm-3 d-flex align-items-center justify-content-sm-center"});
                let $txtDivInner = $("<div>");
                $txtDivInner.append($("<div>", {class: "m-b-800 fs-5", text: prod.name}));
                $txtDivInner.append($("<div>", {html: `Size: <span style="text-transform: uppercase;">${prod.variants[0].name}</span>`}));
                $txtDiv.append($txtDivInner);

                let $quantityDiv = $("<div>", {class: "col-4 col-sm-2 d-flex align-items-center justify-content-sm-center column-gap-2"});
                let $quantityDivMinus = $("<div>", {class: "p-1 prod-in-cart-quantity-btn", text: "-"});
                let $quantityDivPlus = $("<div>", {class: "p-1 prod-in-cart-quantity-btn", text: "+"});
                let $quantityDivIndicator = $("<span>", {class: "prod-in-cart-quantity", text: product_variant.quantity});
                $quantityDiv.append($quantityDivMinus);
                $quantityDiv.append($quantityDivIndicator);
                $quantityDiv.append($quantityDivPlus);
                $quantityDivPlus.on("click", ()=>{changeQuantity(index, 1);});
                $quantityDivMinus.on("click", ()=>{changeQuantity(index, -1);});

                let $priceDiv = $("<div>", {class: "col-4 col-sm-2 d-flex align-items-center justify-content-sm-center prod-in-cart-price", text: prod.price + " PLN"});

                let $closeDiv = $("<div>", {class: "col-4 col-sm-2 d-flex align-items-center justify-content-sm-center"});
                let $closeDivBtn = $("<button>", {class: "btn-close", type: "button"});
                $closeDiv.append($closeDivBtn);
                $closeDivBtn.on("click", ()=>{deleteFromCart(index)});

                $main.append($soldDiv);
                $main.append($imgDiv);
                $main.append($txtDiv);
                $main.append($quantityDiv);
                $main.append($priceDiv);
                $main.append($closeDiv);

                if(prod.variants[0].quantity < 1){
                    $soldDiv.removeClass("d-none");
                    $soldDiv.addClass("d-flex");
                }

                $root.append($main);

            }).then(calcValues).catch((error) => {
                if(error.statusText)
                    infobox_show(error.statusText, 5000);
                else
                    infobox_show(error, 5000)
            });

        });

    });
}

function calcValues(){
    $("#estimated-ship-date").text("-");
    $("#cart-products").text("---");
    $("#cart-shipment").text("---");
    $("#cart-total").text("---");
    if(GlobalCartContent == null) {
        return;
    }

    let totalCartValue = 0;
    GlobalCartContent.forEach((variant, index) => {
        if(!variant.product) return;
        if(variant.product.variants[0].quantity < 1) return;
        totalCartValue += parseFloat(variant.product.price) * variant.quantity;
    });

    $("#cart-products").text(totalCartValue.toFixed(2) + " PLN");
    $("#cart-shipment").text("22 PLN");
    $("#cart-total").text((totalCartValue + 22).toFixed(2) + " PLN");

    const date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    $("#estimated-ship-date").text(date.toLocaleDateString());

}

function deleteFromCart(index){

    $.ajax({
        method: 'POST',
        url: "/cart/delete/" + index
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            refreshCart();
            loadCartSize();
        } catch (e) {
            console.log("Unable to delete from cart");
            return $.Deferred().reject("Error occurred").promise();
        }
    }).catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

}

function changeQuantity(index, x){
    
    if(GlobalCartContent[index].quantity <= 1 && x < 0){
        return;
    }
    
    $.ajax({
        method: 'POST',
        url: "/cart/change/" + index,
        data: JSON.stringify({
            velocity: x
        })
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            if(json[0]){
                refreshCart();
                loadCartSize();
            }
        } catch (e) {
            console.log("Unable to change product quantity in cart");
            return $.Deferred().reject("Error occurred").promise();
        }
    }).catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

}

function getUserAdress(){
    return $.ajax({
        url: "/user/address/load",
        method: "post"
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            $("#input-postcode").val(json.post_code);
            $("#input-city").val(json.city);
            $("#input-address").val(json.address);
            $("#input-building").val(json.building);
            $("#input-country").val(json.country);
            $("#user-stage").addClass("d-none");
            $("#shipment-stage").removeClass("d-none");
        } catch (e){
            // Guest, no action
        }
    });
}

function initPage(){
    return new Promise((resolve, reject) => {
        
        $("#btn-set-personal-info").on("click", () => {
            GlobalPersonalData = {
                firstname: $("#input-fname").val(),
                lastname: $("#input-lname").val(),
                email: $("#input-email").val(),
                phone: $("#input-tel").val(),
            }
            if(GlobalPersonalData.firstname.length && GlobalPersonalData.lastname.length && GlobalPersonalData.email.length && GlobalPersonalData.phone.length){
                $("#user-stage").addClass("d-none");
                $("#shipment-stage").removeClass("d-none");
            } else {
                infobox_show("Fill personal details.", 5000)
            }
        });
        
        $("#take-order-button").on("click", () => {
            if(GlobalCartContent.length === 0){ 
                infobox_show("The cart is empty.", 5000);
                return;
            }
            let GlobalShipmentData = {
                postcode: $("#input-postcode").val(),
                city: $("#input-city").val(),
                address: $("#input-address").val(),
                building: $("#input-building").val(),
                country: $("#input-country").val()
            }
            let $selector = $('input[name="payment-method-radio"]:checked');
            if($selector && GlobalShipmentData.postcode.length && GlobalShipmentData.city.length && GlobalShipmentData.address.length && GlobalShipmentData.building.length && GlobalShipmentData.country.length){
                let payment = $selector.val();
                $.ajax({
                    url: "/order/new",
                    type: 'post',
                    data: JSON.stringify({
                        personal: GlobalPersonalData,
                        shipment: GlobalShipmentData,
                        payment: payment
                    })
                }).then((success) => {
                    try{
                        let json = JSON.parse(success);
                        if(json.payment == "CASH"){
                            alert("order placed");
                        }
                    } catch (e) {
                        console.log("Unable to place order");
                        return $.Deferred().reject("Error occured").promise();
                    }
                }).catch((error) => {
                    if(error.statusText)
                        infobox_show(error.statusText, 5000);
                    else
                        infobox_show(error, 5000)
                });

            } else {
                infobox_show("Fill shipment details.", 5000)
            }
        });

    });
}

$(document).ready(() => {

    refreshCart().then(getUserAdress).then(initPage).catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

    loadCartSize();

});
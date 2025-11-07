let GlobalCartContent = null;
let GlobalPersonalData = null;

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
            return $.Deferred().reject("Error occurred while loading cart...").promise();
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

                let $main = $("<div>", {class: "prod-in-cart row mb-3 gy-4 mb-5 gx-0"});

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

                $main.append($imgDiv);
                $main.append($txtDiv);
                $main.append($quantityDiv);
                $main.append($priceDiv);
                $main.append($closeDiv);

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
    $("#cart-discount").text("---");
    $("#cart-total").text("---");
    if(GlobalCartContent == null) {
        return;
    }

    let totalCartValue = 0;
    GlobalCartContent.forEach((variant, index) => {
        if(!variant.product) return;
        totalCartValue += parseFloat(variant.product.price) * variant.quantity;
    });

    $("#cart-products").text(totalCartValue.toFixed(2) + " PLN");
    $("#cart-shipment").text("22 PLN");
    $("#cart-discount").text("0 PLN");
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
            return $.Deferred().reject("Error occurred while deleting from cart.").promise();
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
            refreshCart();
            loadCartSize();
        } catch (e) {
            return $.Deferred().reject("Error occurred while changing cart.").promise();
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
            // There is no logged user
        }
    });
}

function checkPromoCode(){
    
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
            let shipment = {
                postcode: $("#input-postcode").val(),
                city: $("#input-city").val(),
                address: $("#input-address").val(),
                building: $("#input-building").val(),
                country: $("#input-country").val()
            }
            let selector = document.querySelector('input[name="payment-method-radio"]:checked');
            if(selector && shipment.postcode.length && shipment.city.length && shipment.address.length && shipment.building.length){
                // zloz order, przejdz do platnosci jesli nie gotowkowo
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
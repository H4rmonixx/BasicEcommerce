function loadUserData(){
    return $.ajax({
        url: "/user/load",
        type: "post"
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            $("#input-fname").val(json.firstname);
            $("#input-lname").val(json.lastname);
            $("#input-tel").val(json.phone_number);
            $("#input-postcode").val(json.post_code);
            $("#input-city").val(json.city);
            $("#input-address").val(json.address);
            $("#input-building").val(json.building);
            $("#input-country").val(json.country);
        } catch (e) {
            console.log("Unable to load user");
            return $.Deferred().reject("Error occurred").promise();
        }
    });
}

function loadUserOrders(){
    return $.ajax({
        url: "/user/orders/load",
        type: "post"
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            
            let $root = $("#order-table-tbody");
            json.forEach((order) => {
                let $maintr = $("<tr>");
                $maintr.append($("<td>", {text: order.order_id}));
                $maintr.append($("<td>", {text: order.date}));
                $maintr.append($("<td>", {html: '<a class="link-primary button-details">Details</a>'}));
                let $detailtr = $("<tr>", {class: "d-none"});
                let $detailtd = $("<td>", {colspan: 3})
                let $detaildiv = $("<div>", {class: "row mb-4"});

                let $detaildivtop = $("<div>", {class: "col-12 mb-2"});
                let $prodlist = $("<table>", {class: "table"});
                $prodlist.append($("<thead>", {html: '<tr><th>Name</th><th class="d-none d-md-table-cell">Size</th><th class="d-none d-md-table-cell">Price</th><th>Quantity</th><th>Value</th></tr>'}))
                let $prodlistbody = $("<tbody>");
                $prodlist.append($prodlistbody);

                let $detaildivleft = $("<div>", {class: "col-md-6"});
                $detaildivleft.append($("<div>", {html: `<span class="fw-bold">Status: </span> ${order.status}`}));
                $detaildivleft.append($("<div>", {html: `<span class="fw-bold">Payment: </span> ${order.payment_method}`}))

                let $detaildivright = $("<div>", {class: "col-md-6"});
                let $productsPriceDiv = $("<div>", {class: "text-md-end"});
                let $shipmentDiv = $("<div>", {class: "text-md-end", html: `<span class="fw-bold">Shipment: </span> ${order.shipping_price} PLN`});
                let $totalPriceDiv = $("<div>", {class: "text-md-end"});
                $detaildivright.append($productsPriceDiv);
                $detaildivright.append($shipmentDiv);
                $detaildivright.append($totalPriceDiv);

                order.products_price = parseFloat(order.products_price);
                $productsPriceDiv.html(`<span class="fw-bold">Products price: </span> ${order.products_price} PLN`);
                $totalPriceDiv.html(`<span class="fw-bold">Total price: </span> ${order.products_price+parseFloat(order.shipping_price)} PLN`);

                $detaildivtop.append($prodlist);
                $detaildiv.append($detaildivtop);
                $detaildiv.append($detaildivleft);
                $detaildiv.append($detaildivright);
                $detailtd.append($detaildiv);
                $detailtr.append($detailtd);
                $root.append($maintr);
                $root.append($detailtr);

                order.products.forEach((variant) => {

                    $.ajax({
                        url: "/product/load/variant/"+variant.product_variant_id,
                        type: "post"
                    }).then((success) => {
                        try{
                            let json = JSON.parse(success);
                            let $tmp = $("<tr>");
                            $tmp.append($("<td>", {text: json.name, class: "fw-bold"}));
                            $tmp.append($("<td>", {text: json.variants[0].name, class: "d-none d-md-table-cell"}));
                            $tmp.append($("<td>", {text: json.price + " PLN", class: "d-none d-md-table-cell"}));
                            $tmp.append($("<td>", {text: variant.quantity + "x"}));
                            $tmp.append($("<td>", {text: (variant.quantity * json.price) + " PLN"}));
                            $prodlistbody.append($tmp);                            
                        } catch(e) {
                            let $tmp = $("<tr>");
                            $tmp.append($("<td>", {text: "Product deleted", class: "fw-bold text-start", colspan: 5}));
                            $prodlistbody.append($tmp);
                        }
                    }).catch((error)=>{
                        if(error.statusText)
                            infobox_show(error.statusText, 5000);
                        else
                            infobox_show(error, 5000)
                    });

                });

            });

        } catch (e) {
            console.log("Unable to load orders");
            return $.Deferred().reject("Error occurred").promise();
        }
    });
}

$(document).ready(()=>{
    
    loadUserData().then(loadUserOrders).then(()=>{

        $(".button-details").on("click", function() {
            $(this).closest("tr").next().toggleClass("d-none");
        });

    }).catch((error)=>{
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

    loadCartSize();

    $("#button-logout").on("click", () => {

        $.ajax({
            url: "/user/logout",
            type: "post"
        }).then((success) => {

            try{
                let json = JSON.parse(success);
                if(json[0]){
                    window.location.replace("/");
                } else {
                    console.log("Unable to logout");
                    return $.Deferred().reject("Error occurred").promise();
                }
            } catch (e) {
                console.log("Unable to logout");
                return $.Deferred().reject("Error occurred").promise();
            }

        }).catch((error)=>{
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });

    });

    $("#list-account-form").on("submit", function(e){
        e.preventDefault();

        let data = {
            firstname: $("#input-fname").val(),
            lastname: $("#input-lname").val(),
            phone_number: $("#input-tel").val(),
            address: $("#input-address").val(),
            building: $("#input-building").val(),
            city: $("#input-city").val(),
            post_code: $("#input-postcode").val(),
            country: $("#input-country").val()
        };

        const phonePattern = /^\+?[0-9\s\-]{7,15}$/;
        if(!phonePattern.test(data.phone_number)){
            infobox_show("Invalid phone number", 5000);
            return;
        }

        $.ajax({
            url: "/user/update/data",
            type: "post",
            data: JSON.stringify(data)
        }).then((success) => {

            try{
                let json = JSON.parse(success);
                if(json[0]){
                    infobox_show("Data updated", 4000, [8, 100, 48]);
                } else {
                    console.log("Unable to edit data");
                    return $.Deferred().reject("Error occurred").promise();
                }
            } catch (e) {
                console.log("Unable to edit data");
                return $.Deferred().reject("Error occurred").promise();
            }

        }).catch((error)=>{
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });

    });

    $("#list-security-form").on("submit", function(e){
        e.preventDefault();

        let data = {
            password_old: $("#input-password-old").val(),
            password_new: $("#input-password-new1").val(),
            password_repeated: $("#input-password-new2").val()
        };

        if(data.password_new != data.password_repeated){
            infobox_show("New passwords are not the same", 4000);
            return;
        }

        $.ajax({
            url: "/user/update/password",
            type: "post",
            data: JSON.stringify(data)
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    infobox_show("Password updated", 4000, [8, 100, 48]);
                } else {
                    return $.Deferred().reject("Wrong current password").promise();
                }
            } catch (e) {
                console.log("Unable to edit password");
                return $.Deferred().reject("Error occurred").promise();
            }

        }).catch((error)=>{
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });

    });

})
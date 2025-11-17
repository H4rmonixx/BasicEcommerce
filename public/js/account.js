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
            
            let $root = $("#order-table");
            json.forEach((order) => {
                let $maintr = $("<tr>");
                $maintr.append($("<td>", {text: order.order_id}));
                $maintr.append($("<td>", {text: order.date}));
                $maintr.append($("<td>", {html: '<button class="btn btn-link button-details">Details</button>'}));

                $root.append($maintr);
            });

        } catch (e) {
            console.log("Unable to load orders");
            return $.Deferred().reject("Error occurred").promise();
        }
    });
}

$(document).ready(()=>{
    
    loadUserData().then(loadUserOrders).catch((error)=>{
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

    $(".button-details").on("click", function() {
        $(this).closest("tr").next().toggleClass("d-none");
    });

})
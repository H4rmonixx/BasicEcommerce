$(document).ready(()=>{
    
    loadCartSize();

    $("#to-login-change-button").on("click", ()=>{
        $("#form-register").toggleClass("d-none");
        $("#form-login").toggleClass("d-none");
    });
    $("#to-register-change-button").on("click", ()=>{
        $("#form-register").toggleClass("d-none");
        $("#form-login").toggleClass("d-none");
    });

    $("#form-login").on("submit", function(e){
        e.preventDefault();

        $.ajax({
            url: "/user/login/try",
            type: "post",
            data: JSON.stringify({
                email: $("#login-email").val(),
                password: $("#login-password").val()
            })
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]) window.location.replace("/account");
                else{
                    $("#login-callback").text("Wrong email or password!");
                }
            } catch (e) {
                return $.Deferred().reject("Error occurred.").promise();
            }
        }).catch((error) => {
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });

    });

    $("#form-register").on("submit", function(e){
        e.preventDefault();
        

        if($("#register-password1").val() != $("#register-password2").val()){
            $("#register-callback").text("Password must be the same");
            return;
        }

        let data = {
            firstname: $("#register-fname").val(),
            lastname: $("#register-lname").val(),
            phone_number: $("#register-tel").val(),
            email: $("#register-email").val(),
            address: $("#register-address").val(),
            building: $("#register-building").val(),
            city: $("#register-city").val(),
            post_code: $("#register-postcode").val(),
            country: $("#register-country").val(),
            password: $("#register-password1").val()
        };


        const phonePattern = /^\+?[0-9\s\-]{7,15}$/;
        if(!phonePattern.test(data.phone_number)){
            $("#register-callback").text("Phone number invalid");
            return;
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailPattern.test(data.email)){
            $("#register-callback").text("Email does not exist");
            return;
        }

        $.ajax({
            url: "/user/register/try",
            type: "post",
            data: JSON.stringify(data)
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]) window.location.replace("/account");
                else{
                    $("#register-callback").text(json[1]);
                }
            } catch (e) {
                console.log(success, e);
                return $.Deferred().reject("Error occurred.").promise();
            }
        }).catch((error) => {
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });

    });
    
});
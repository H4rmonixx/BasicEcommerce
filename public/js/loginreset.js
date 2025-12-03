$(document).ready(()=>{
    
    loadCartSize();

    $("#form-reset").on("submit", function(e){
        e.preventDefault();

        $.ajax({
            url: "/user/reset/setup",
            type: "post",
            data: JSON.stringify({
                email: $("#input-email").val()
            })
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    infobox_show("Reset link sent to your email", 5000, [50, 100, 50]);
                } else {
                    console.log("Unable to setup reset");
                    return $.Deferred().reject(json[1]).promise();
                }
            } catch (e) {
                console.log("Unable to setup reset");
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
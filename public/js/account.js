$(document).ready(()=>{
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

    $(".button-details").on("click", function() {
        $(this).closest("tr").next().toggleClass("d-none");
    });

})
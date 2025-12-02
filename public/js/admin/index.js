function loadConfig(){
    return $.ajax({
        type: "post",
        url: "/configuration/list",
    })
    .then((success) => {
        try{
            let json = JSON.parse(success);
            json.forEach((config) => {
                $(`#input-${config.configuration_id}`).val(config.value);
            });
        } catch(e){
            console.log("Unable to load configuration");
            return $.Deferred().reject("Error occurred").promise();
        }
    });
}

$(document).ready(()=>{
    loadConfig().catch((error)=>{
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

    $(".form-update-config").on("submit", function(e){
        e.preventDefault();
        let cid = $(this).find(".input-configuration-id").val();
        $.ajax({
            type: "post",
            url: "/configuration/update/"+cid,
            data: JSON.stringify({
                value: $(this).find(".input-configuration-value").val()
            })
        })
        .then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    infobox_show("Config updated", 3000, [50, 100, 50]);
                } else {
                    console.log("Unable to update config");
                    return $.Deferred().reject("Error occurred").promise();
                }
            } catch(e){
                console.log("Unable to update config");
                return $.Deferred().reject("Error occurred").promise();
            }
        }).catch((error)=>{
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });
    })

});
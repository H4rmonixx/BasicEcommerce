function decodeIDFromURL(){
    let path = $(location).prop("pathname");
    let matches = path.match(/\/login\/reset\/(?<id>[\w-]+)/);
    if(matches == null){
        return null;
    }
    if(matches.groups.id != undefined){
        return matches.groups.id;
    }
    return null;
}

$(document).ready(()=>{
    
    loadCartSize();

    $("#form-reset").on("submit", function(e){
        e.preventDefault();

        let pass1 = $("#input-pass").val();
        let pass2 = $("#input-pass2").val();
        let rid = decodeIDFromURL();
        if(rid == null){
            infobox_show("Cant read reset id", 3000);
            return;
        }

        if(pass1 != pass2){
            infobox_show("Passwords are not the same", 3000);
            return;
        }

        $.ajax({
            url: "/user/reset/try",
            type: "post",
            data: JSON.stringify({
                password_new: pass1,
                id:  rid
            })
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    window.location.replace("/login");
                } else {
                    console.log("Unable to reset");
                    return $.Deferred().reject(json[1]).promise();
                }
            } catch (e) {
                console.log("Unable to reset");
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
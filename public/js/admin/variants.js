variants_data = null;

function loadVariants(){
    return $.ajax({
        type: "post",
        url: "/variants/load"
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            variants_data = json;
            $("#variants-count").html(`<b>Variants count: </b>${json.length}`);
            let $root = $("#variants-tbody");
            json.forEach((variant, index) => {
                let $tr = $("<tr>");
                $tr.append($("<td>", {class: "d-none d-lg-table-cell", text: variant.variant_id}));
                $tr.append($("<td>", {text: variant.name}));
                let $btntd = $("<td>", {class: "d-flex column-gap-2 row-gap-2 flex-wrap"});
                let $btn = $("<button>", {type: "button", class: "btn btn-warning btn-sm", html: '<i class="bi bi-pencil-square"></i>'});
                $btn.on("click", ()=>{openEditModal(index)});
                let $btn2 = $("<button>", {type: "button", class: "btn btn-danger btn-sm", html: '<i class="bi bi-trash"></i>'});
                $btn2.on("click", ()=>{deleteVariant(index)});

                $btntd.append($btn);
                $btntd.append($btn2);
                $tr.append($btntd);

                $root.append($tr);
            })
        } catch(e) {
            console.log("Unable to load variants");
            return $.Deferred().reject("Error occurred.").promise();
        }
    });
}

function openEditModal(index){
    $("#input-edit-name").val(variants_data[index].name);
    $("#input-edit-id").val(variants_data[index].variant_id);
    bootstrap.Modal.getOrCreateInstance('#modal-edit').show();
}

function deleteVariant(index){
    $("#modal-delete-name").text(variants_data[index].name);
    $("#modal-delete-id").val(variants_data[index].variant_id);
    bootstrap.Modal.getOrCreateInstance('#modal-delete').show();
}

$(document).ready(()=>{
    loadVariants().catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

    $("#button-new-variant").on("click", ()=>{
        $("#input-new-name").val("");
        bootstrap.Modal.getOrCreateInstance('#modal-new').show();
    });

    $("#modal-new-form").on("submit", function(e){
        e.preventDefault();
        $.ajax({
            url: "/variant/new",
            type: "post",
            data: JSON.stringify({
                name: $("#input-new-name").val()
            })
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    window.location.reload();
                } else {
                    console.log("Unable to add variant");
                    return $.Deferred().reject("Error occurred.").promise();
                }
            } catch(e){
                console.log("Unable to add variant");
                return $.Deferred().reject("Error occurred.").promise();
            }
        }).catch((error) => {
            bootstrap.Modal.getOrCreateInstance('#modal-new').hide();
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });
    });

    $("#modal-edit-form").on("submit", function(e){
        e.preventDefault();
        let varid = $("#input-edit-id").val();
        $.ajax({
            url: "/variant/edit/"+varid,
            type: "post",
            data: JSON.stringify({
                name: $("#input-edit-name").val()
            })
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    window.location.reload();
                } else {
                    console.log("Unable to edit variant");
                    return $.Deferred().reject("Error occurred.").promise();
                }
            } catch(e){
                console.log("Unable to edit variant");
                return $.Deferred().reject("Error occurred.").promise();
            }
        }).catch((error) => {
            bootstrap.Modal.getOrCreateInstance('#modal-edit').hide();
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });
    });

    $("#modal-delete-form").on("submit", function(e){
        e.preventDefault();
        let varid = $("#modal-delete-id").val();
        $.ajax({
            url: "/variant/delete/"+varid,
            type: "post"
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    window.location.reload();
                } else {
                    console.log("Unable to delete variant");
                    return $.Deferred().reject(json[1]).promise();
                }
            } catch(e){
                console.log("Unable to delete variant");
                return $.Deferred().reject("Error occurred.").promise();
            }
        }).catch((error) => {
            bootstrap.Modal.getOrCreateInstance('#modal-delete').hide();
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });
    });

});
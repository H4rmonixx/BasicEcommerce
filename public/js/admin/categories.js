function loadCategories(){
    return $.ajax({
        type: "post",
        url: "/categories/load"
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            $("#categories-count").html(`<b>Categories count: </b>${json.length}`);
            let $root = $("#categories-tbody");
            json.forEach((cat) => {
                let $tr = $("<tr>");
                $tr.append($("<td>", {text: cat.category_id}));
                $tr.append($("<td>", {text: cat.name}));
                let $btntd = $("<td>", {class: "d-flex column-gap-2"});
                let $btn = $("<button>", {type: "button", class: "btn btn-warning btn-sm", html: '<i class="bi bi-pencil-square"></i>'});
                $btn.on("click", ()=>{openEditModal(cat.category_id)});
                let $btn2 = $("<button>", {type: "button", class: "btn btn-danger btn-sm", html: '<i class="bi bi-trash"></i>'});
                $btn2.on("click", ()=>{deleteCat(cat.category_id)});

                $btntd.append($btn);
                $btntd.append($btn2);
                $tr.append($btntd);

                $root.append($tr);
            })
        } catch(e) {
            console.log("Unable to load categories");
            return $.Deferred().reject("Error occurred.").promise();
        }
    });
}

function openEditModal(category_id){
    $.ajax({
        url: "/category/load/"+category_id,
        type: "post"
    }).then((success)=>{
        try{
            let json = JSON.parse(success);
            $("#input-category-edit-name").val(json.name);
            $("#input-category-edit-id").val(json.category_id);
            let modal = new bootstrap.Modal(document.getElementById('modal-category-edit'));
            modal.show();
        } catch (e) {
            console.log("Unable to load category");
            return $.Deferred().reject("Error occurred.").promise();
        }
    }).catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });
}

function deleteCat(category_id){

}

$(document).ready(()=>{
    loadCategories().catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

    $("#button-new-category").on("click", ()=>{
        let modal = new bootstrap.Modal(document.getElementById('modal-category-new'));
        modal.show();
    });

    $("#modal-category-new-form").on("submit", function(e){
        e.preventDefault();
        $.ajax({
            url: "/category/new",
            type: "post",
            data: JSON.stringify({
                name: $("#input-category-new-name").val()
            })
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    window.location.reload();
                } else {
                    console.log("Unable to add category");
                    return $.Deferred().reject("Error occurred.").promise();
                }
            } catch(e){
                console.log("Unable to add category");
                return $.Deferred().reject("Error occurred.").promise();
            }
        }).catch((error) => {
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });
    });

    $("#modal-category-edit-form").on("submit", function(e){
        e.preventDefault();
        let catid = $("#input-category-edit-id").val();
        $.ajax({
            url: "/category/edit/"+catid,
            type: "post",
            data: JSON.stringify({
                name: $("#input-category-edit-name").val()
            })
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    window.location.reload();
                } else {
                    console.log("Unable to edit category");
                    return $.Deferred().reject("Error occurred.").promise();
                }
            } catch(e){
                console.log("Unable to edit category");
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
product_data = null;

function decodeIDFromURL(){
    return new Promise((resolve, reject) => {
        let path = $(location).prop("pathname");
        let matches = path.match(/\/admin\/product\/(?<id>[\d]+)/);
        if(matches == null){
            reject("Wrong product ID");
            return;
        }
        if(matches.groups.id != undefined){
            resolve(matches.groups.id);
        }
        reject("Wrong product ID");
    });
}

function loadProduct(id){
    return $.ajax({
        type: "post",
        url: "/product/load/"+id
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            product_data = json;
            
            tinymce.init({
                selector: 'textarea#desc-editor',
                plugins: [
                'anchor', 'autolink', 'charmap', 'codesample', 'emoticons',
                'link', 'lists', 'media', 'searchreplace', 'table',
                'visualblocks', 'wordcount', 'code'
                ],
                toolbar: [
                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough |',
                'alignleft aligncenter alignright alignjustify | lineheight |',
                'forecolor backcolor | bullist numlist indent outdent |',
                'link anchor | table media |',
                'emoticons charmap codesample hr |',
                'searchreplace visualblocks | removeformat'
                ].join(' '),
                menubar: false,
                setup: function(editor){
                    editor.on('init', function() {
                        editor.setContent(json.description);
                    });
                }

            });

            $(document).prop("title", "H.R.M.X Admin / " + json.name);
            showPhotos();
            $(`option[value="${json.category_id}"]`).prop("selected", "selected");
            $("#input-name").val(json.name);
            $("#input-price").val(parseFloat(json.price));
            if(json.visible == 1) $("#input-visible").prop("checked", "checked");

            let $variants_root = $("#tbody-variants");
            json.variants.forEach((variant, index) => {
                let $tr = $("<tr>");
                $tr.append($("<td>", {text: variant.name}));
                $tr.append($("<td>", {text: variant.quantity}));
                let $steertd = $("<td>");
                let $deletebtn = $("<i>", {class: "bi bi-trash fs-6 bg-danger rounded text-white photo-btn"})
                $steertd.append($deletebtn);
                $tr.append($steertd);

                $variants_root.append($tr);
            });

        } catch(e) {
            console.log("Unable to load product");
            return $.Deferred().reject("Error occurred.").promise();
        }
    });
}

function loadCategories(prodid){
    return $.ajax({
        type: "post",
        url: "/categories/load"
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            let $root = $("#input-category");
            json.forEach((cat) => {
                $root.append($("<option>", {value: cat.category_id, text: cat.name}));
            });
            return prodid;
        } catch(e) {
            console.log("Unable to load categories");
            return $.Deferred().reject("Error occurred.").promise();
        }
    });
}

function showPhotos(){
    let $photosroot = $("#photos-list");
    $photosroot.empty();
    product_data.photos.forEach((photo, index) => {
        let $container = $("<div>", {class: "col-xxl-2 col-md-3 col-4"});
        let $pos = $("<div>", {class: "position-relative d-flex justify-content-center align-items-center h-100 photo-tile"});
        $container.append($pos);

        $pos.append($("<img>", {class: "w-100", src: "/assets/products/" + photo.filename, alt: "Product photo"}));
        $pos.append($("<div>", {class: "position-absolute p-1 bg-white top-0 start-0 border", text: index+1}));
        let $steer = $("<div>", {class: "position-absolute d-none align-items-center justify-content-center column-gap-1 top-0 start-0 w-100 h-100 bg-white border photo-tile-steer"});
        let $steerleft = $("<i>", {class: "bi bi-arrow-left-square-fill fs-6 text-black photo-btn"});
        let $steerright = $("<i>", {class: "bi bi-arrow-right-square-fill fs-6 text-black photo-btn"});
        let $steerdel = $("<i>", {class: "bi bi-trash fs-6 bg-danger rounded text-white photo-btn position-absolute top-0 end-0"});

        $steerleft.on("click", ()=>{changeTilePos(index, -1)});
        $steerright.on("click", ()=>{changeTilePos(index, 1)});
        $steerdel.on("click", ()=>{delPhoto(index, photo.photo_id)});

        $steer.append($steerleft);
        $steer.append($steerright);
        $steer.append($steerdel);
        $pos.append($steer);

        $photosroot.append($container);
    });
    if(product_data.photos.length == 0){
        let $container = $("<div>", {class: "col-xxl-2 col-md-3 col-4"});
        let $pos = $("<div>", {class: "position-relative p-3 photo-tile"});
        let $addbtn = $("<div>", {text: "No photos"});

        $container.append($pos);
        $pos.append($addbtn);
        $photosroot.append($container);
    }

    let $container = $("<div>", {class: "col-xxl-2 col-md-3 col-4"});
    let $pos = $("<div>", {class: "position-relative h-100 w-100 d-flex justify-content-center align-items-center photo-tile"});
    let $addbtn = $("<i>", {class: "bi bi-plus-lg p-1 photo-btn border rounded"});

    $addbtn.on("click", () => {
        $("#input-file")[0].click();
    });

    $container.append($pos);
    $pos.append($addbtn);
    $photosroot.append($container);

}

function delPhoto(index, photo_id){
    if(index < 0 || index >= product_data.photos.length) return;
    $.ajax({
        url: "/product/photo/delete/"+photo_id,
        type: "post"
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            if(json[0]){
                product_data.photos.splice(index, 1);
                showPhotos();
                infobox_show("Photo deleted", 3000, [50, 100, 50]);
            } else {
                return $.Deferred().reject(json[1]).promise();
            }
        } catch (e){
            console.log("Unable to delete photo");
            return $.Deferred().reject("Error occurred.").promise();
        }
    }).catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });
    
}

function changeTilePos(index, x){
    if(x < 0 && index <= 0) return;
    if(x > 0 && index >= product_data.photos.length-1) return;

    [product_data.photos[index], product_data.photos[index + x]] = [product_data.photos[index + x], product_data.photos[index]];
    $.ajax({
        url: "/product/photos/reorder/"+product_data.product_id,
        type: "post",
        data: JSON.stringify(product_data.photos)
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            if(json[0]){
                showPhotos();
                infobox_show("Photos reordered", 2000, [50, 100, 50]);
            } else {
                [product_data.photos[index], product_data.photos[index + x]] = [product_data.photos[index + x], product_data.photos[index]];
                console.log("Unable to reorder photos");
                return $.Deferred().reject(json[1]).promise();
            }
        } catch (e){
            [product_data.photos[index], product_data.photos[index + x]] = [product_data.photos[index + x], product_data.photos[index]];
            console.log("Unable to reorder photos");
            return $.Deferred().reject("Error occurred.").promise();
        }
    }).catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });
    
}

$(document).ready(()=>{
    decodeIDFromURL().then(loadCategories).then(loadProduct).catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

    $("#input-file").on("change", function(){

        if($(this)[0].files.length == 0) return;
        let fd = new FormData();
        fd.append("product-file", $(this)[0].files[0]);
        fd.append("product-id", product_data.product_id);
        fd.append("order-number", product_data.photos.length+1);

        $.ajax({
            url: "/product/photo/new",
            type: "post",
            data: fd,
            processData: false,
            contentType: false
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    product_data.photos.push({photo_id: json[1], filename: json[2]});
                    showPhotos();
                    infobox_show("Photo uploaded", 3000, [50, 100, 50]);
                } else {
                    return $.Deferred().reject(json[1]).promise();
                }
            } catch (e){
                console.log("Unable to upload photo");
                return $.Deferred().reject("Error occurred.").promise();
            }
        }).catch((error) => {
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });

    });

    $("#form-desc").on("submit", function(e){
        e.preventDefault();
        const content = tinymce.get('desc-editor').getContent();
        let fd = new FormData();
        fd.append("content", content);

        $.ajax({
            url: "/product/edit/desc/"+product_data.product_id,
            type: "post",
            data: fd,
            processData: false,
            contentType: false
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    infobox_show("Description edited", 3000, [50, 100, 50]);
                } else {
                    console.log("Unable to edit description");
                    return $.Deferred().reject("Error occurred.").promise();
                }
            } catch (e){
                console.log("Unable to edit description");
                return $.Deferred().reject("Error occurred.").promise();
            }
        }).catch((error) => {
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });

    });

    $("#form-info").on("submit", function(e){
        e.preventDefault();

        $.ajax({
            url: "/product/edit/info/"+product_data.product_id,
            type: "post",
            data: JSON.stringify({
                name: $("#input-name").val(),
                category_id: $("#input-category").val(),
                price: $("#input-price").val(),
                visible: $("#input-visible").prop("checked")
            })
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    infobox_show("Info edited", 3000, [50, 100, 50]);
                } else {
                    console.log("Unable to edit info");
                    return $.Deferred().reject("Error occurred.").promise();
                }
            } catch (e){
                console.log("Unable to edit info");
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
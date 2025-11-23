function loadProducts(){
    return $.ajax({
        type: "post",
        url: "/products/list"
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            $("#products-count").html(`<b>Products count: </b>${json.length}`);
            let $root = $("#products-tbody");
            json.forEach((product) => {
                let variantslist = "";
                product.variants.forEach((v, index) => {
                    variantslist += v.name ;
                    if(index < product.variants.length - 1) variantslist += ", ";
                });
                let $tr = $("<tr>");
                $tr.append($("<td>", {class: "d-none d-lg-table-cell", text: product.product_id}));
                $tr.append($("<td>", {text: product.name}));
                $tr.append($("<td>", {class: "d-none d-lg-table-cell", text: variantslist}));
                $tr.append($("<td>", {class: "d-none d-sm-table-cell", text: product.price + " PLN"}));
                $tr.append($("<td>", {html: `<a class="link-dark" href="/admin/product/${product.product_id}">Manage</a>`}));
                $root.append($tr);
            })
        } catch(e) {
            alert(e);
            console.log("Unable to load products");
            return $.Deferred().reject("Error occurred.").promise();
        }
    });
}

function loadCategories(){
    return $.ajax({
        type: "post",
        url: "/categories/load"
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            let $root = $("#input-product-category");
            json.forEach((cat) => {
                $root.append($("<option>", {value: cat.category_id, text: cat.name}));

            });
        } catch(e) {
            console.log("Unable to load categories");
            return $.Deferred().reject("Error occurred.").promise();
        }
    });
}

$(document).ready(()=>{
    loadProducts().then(loadCategories).catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

    $("#button-new-product").on("click", ()=>{
        let modal = new bootstrap.Modal(document.getElementById('modal-new-product'));
        modal.show();
    });

    $("#modal-new-product-form").on("submit", function(e){
        e.preventDefault();
        $.ajax({
            url: "/product/new",
            type: "post",
            data: JSON.stringify({
                name: $("#input-product-name").val(),
                category_id: $("#input-product-category").val(),
                price: $("#input-product-price").val(),
                visible: $("#input-product-visible").prop("checked")
            })
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    window.location.replace("/admin/product/"+json[1]);
                } else {
                    console.log("Unable to add product");
                    return $.Deferred().reject("Error occurred.").promise();
                }
            } catch(e){
                console.log("Unable to add product");
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
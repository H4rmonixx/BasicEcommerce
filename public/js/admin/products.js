let tbodies = {};

function loadProducts(s){
    return $.ajax({
        type: "post",
        url: "/products/list",
        data: JSON.stringify({
            search: s
        })
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            $("#products-count").html(`<b>Products count: </b>${json.length}`);
            
            for(let key in tbodies){
                tbodies[key].content.empty();
                tbodies[key].counter.text(0);
            }

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
                let $steer = $("<td>", {class: "d-flex column-gap-2"});
                $steer.append($("<a>", {class: "btn btn-warning btn-sm", href: `/admin/product/${product.product_id}`, html: '<i class="bi bi-pencil-square"></i>'}));
                let $deletebtn = $("<button>", {class: "btn btn-danger btn-sm", html: '<i class="bi bi-trash"></i>'});
                $deletebtn.on("click", ()=>{deleteProduct(product.product_id, product.name)});
                $steer.append($deletebtn);
                $tr.append($steer);
                
                tbodies[product.category_id].content.append($tr);
                tbodies[product.category_id].content.addClass("show");
                tbodies[product.category_id].counter.text(parseInt(tbodies[product.category_id].counter.text())+1);
            })
        } catch(e) {
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
            let $table_products = $("#table-products");
            $root.empty();
            json.forEach((cat) => {
                $root.append($("<option>", {value: cat.category_id, text: cat.name}));
                let $tbody_header = $("<tbody>", {"data-bs-toggle": "collapse", "data-bs-target": `#products-${cat.category_id}`, class: "group-header"});
                $tbody_header.append($("<tr>", {html: `<td colspan="5" class="bg-light"><b>Category:</b> ${cat.name} (<span id="products-${cat.category_id}-count">0</span>)</td>`}));
                let $tbody_content = $("<tbody>", {id: `products-${cat.category_id}`, class: "collapse"});
                $tbody_content.append($("<tr>", {html: `<td colspan="5">Loading...</td>`}));
                $table_products.append($tbody_header);
                $table_products.append($tbody_content);
                tbodies[cat.category_id] = {
                    content: $tbody_content,
                    counter: $tbody_header.find(`#products-${cat.category_id}-count`)
                };
            });
        } catch(e) {
            console.log("Unable to load categories");
            return $.Deferred().reject("Error occurred.").promise();
        }
    });
}

function deleteProduct(product_id, name){
    $("#modal-product-delete-name").text(name);
    $("#modal-product-delete-input-id").val(product_id);
    bootstrap.Modal.getOrCreateInstance('#modal-product-delete').show();
}

$(document).ready(()=>{
    
    $("#search-form").on("submit", function(e) {
        e.preventDefault();
        loadProducts($("#search-form-input").val()).catch((error) => {
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });
    });
    loadCategories().then(()=>{
        $("#search-form-btn")[0].click();
    });

    $("#button-new-product").on("click", ()=>{
        bootstrap.Modal.getOrCreateInstance('#modal-new-product').show();
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

    $("#modal-product-delete-form").on("submit", function(e){
        e.preventDefault();
        let prodid = $("#modal-product-delete-input-id").val();
        $.ajax({
            url: "/product/delete/"+prodid,
            type: "post"
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    window.location.reload();
                } else {
                    console.log("Unable to delete product");
                    return $.Deferred().reject(json[1]).promise();
                }
            } catch(e){
                console.log("Unable to add product");
                return $.Deferred().reject("Error occurred.").promise();
            }
        }).catch((error) => {
            bootstrap.Modal.getOrCreateInstance('#modal-product-delete').hide();
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });
    });

});
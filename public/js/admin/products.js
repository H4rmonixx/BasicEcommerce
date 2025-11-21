function loadProducts(){
    return $.ajax({
        type: "post",
        url: "/products/load",
        data: JSON.stringify({
            categories: [],
            sizes: [],
            price_from: null,
            price_to: null,
            omit_id: null,
            limit: null,
            page: null
        })
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
            console.log("Unable to load products");
            return $.Deferred().reject("Error occurred.").promise();
        }
    });
}

$(document).ready(()=>{
    loadProducts().catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

    $("#button-new-product").on("click", ()=>{
        let modal = new bootstrap.Modal(document.getElementById('modal-new-product'));
        modal.show();
    });

});
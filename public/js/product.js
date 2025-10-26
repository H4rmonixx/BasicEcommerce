let product_data = null;

function decodeFilterFromURL(){
    return new Promise((resolve, reject) => {
        let path = $(location).prop("pathname");
        let matches = path.match(/\/product\/(?<id>[\d]+)/);
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

function get_related_products(product) {
    return new Promise((resolve, reject) => {
        if(product === null){
            resolve(null);
            return;
        }

        server_request("POST", "php/get_products_preview.php", (result) => {
            try{
                let json = JSON.parse(result);
                resolve(json);
            } catch (e) {
                infobox_show_message("ERROR OCCURRED WHILE LOADING RELATED PRODUCTS");
                resolve(null);
            }
        }, JSON.stringify({
            collections: [product.collection],
            categories: [],
            size: {
                tops: [],
                pants: [],
                footwear: []
            },
            price: {
                from: "none",
                to: "none"
            },
            omit_ids: [product.id]
        }));
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
            return json;
        } catch(e) {
            return $.Deferred().reject("Error occurred while loading product...").promise();
        }
    });
}

function showProductData(product){
    return new Promise((resolve, reject) => {
        if(product === null){
            reject("Product data empty")
            return;
        }

        $("#product-price-container").text(product.price + " PLN");
        $("#product-title-container").text(product.name);

        let $photos = $("#product-photos-container");
        let $desc = $("#product-description-container");
        let $size = $(".product-size");
        let width_con = document.getElementById("product-sizechart-widths");
        let length_con = document.getElementById("product-sizechart-lengths");

        product.photos.forEach((path) => {
            let $img = $("<img>", {
                src: "/assets/products/" + path,
                alt: "Product photo",
                name: "product-photo"
            });
            $photos.append($img);
        });

        $desc.html(product.description);

        /*
        product.sizes_widths.forEach((x) => {
            let new_td = document.createElement("td");
            new_td.textContent = x;
            width_con.appendChild(new_td);
        });

        product.sizes_lengths.forEach((x) => {
            let new_td = document.createElement("td");
            new_td.textContent = x;
            length_con.appendChild(new_td);
        });
        */


        product.variants.forEach((variant) => {
            let $newsize = $("<fieldset>");
            let $label = $("<label>");
            let $input = $("<input>", {
                type: "radio",
                name: "size-select",
                value: variant.product_variant_id
            });
            let $a = $("<a>", {class: "p-size"});
            $a.text(variant.name);

            $label.append($input);
            $label.append($a);
            $newsize.append($label);

            $size.prepend($newsize);

            if(variant.quantity == 0) $newsize.prop("disabled", true);

        });

        resolve(product);
    });
}

function loadRelatedProducts(product){
    return $.ajax({
        type: "post",
        url: "/products/load",
        data: JSON.stringify({
            categories: [product.category_id],
            sizes: [],
            price_from: null,
            price_to: null,
            omit_ids: [product.id],
            limit: null
        })
    })
    .then((success) => {
        try{
            let json = JSON.parse(success);
            return json;
        } catch(e){
            return $.Deferred().reject("Error occurred while loading related items...").promise();
        }
    })
    .then(loadProductTiles);
}

function initPage(){

    loadCartSize();

    $(document).prop("title", product_data.name);

    let $photos = $('[name="product-photo"]');
    for(let i=0; i<$photos.length; i++){
        $($photos[i]).on('click', ()=>{
            for(let x=0; x<$photos.length; x++){
                if(x === i){
                    $($photos[x]).removeClass("order-2");
                    $($photos[x]).removeClass("col-3");
                    $($photos[x]).addClass("order-1");
                    $($photos[x]).addClass("col-12");
                } else {
                    $($photos[x]).removeClass("order-1");
                    $($photos[x]).removeClass("col-12");
                    $($photos[x]).addClass("order-2");
                    $($photos[x]).addClass("col-3");
                }
            }
        }); 
    }
    $photos[0].click();

    $("#to-cart-button").on("click", () => {
        let $inputs = $('input[name="size-select"]:checked');
        if($inputs.length > 0){
            $.ajax({
                type: "post",
                url: "/api/cart/add",
                data: JSON.stringify({
                    id: product_data.id,
                    quantity: 1,
                    variant: $($inputs[0]).val()
                })
            }).then((success) => {

                //

            }).catch((error) => {
                if(error.statusText)
                    infobox_show(error.statusText, 5000);
                else
                    infobox_show(error, 5000)
            });
        } else {
            infobox_show("No size selected");
        }
    });

}

$(document).ready(() => {
    decodeFilterFromURL().then(loadProduct).then(showProductData).then(loadRelatedProducts).then(initPage).catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });
});
let product_data = null;

function decodeIDFromURL(){
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
        let $sizechart = $("#product-sizechart-table");

        product.photos.forEach((path) => {
            let $img = $("<img>", {
                src: "/assets/products/" + path,
                alt: "Product photo",
                name: "product-photo"
            });
            $photos.append($img);
        });

        $desc.html(product.description);

        product.variants.forEach((variant) => {

            // SIZE BUTTON
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

            // SIZE CHART
            let $tr = $("<tr>");
            $tr.html(`<td class="fw-bold">${variant.name}</td><td>${variant.width}</td><td>${variant.height}</td>`);
            $sizechart.append($tr);

        });

        resolve(product);
    });
}

function loadRelatedProducts(product){
    $.ajax({
        type: "post",
        url: "/products/load",
        data: JSON.stringify({
            categories: [product.category_id],
            sizes: [],
            price_from: null,
            price_to: null,
            omit_id: product.product_id,
            limit: 4,
            page: 1
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
    .then(loadProductTiles)
    .catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });
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
                url: "/cart/add",
                data: JSON.stringify({
                    product_variant_id: $($inputs[0]).val(),
                    quantity: 1
                })
            }).then((success) => {

                if(success == "Success"){
                    infobox_show("Product added to cart.", 4000, [8, 100, 48]);
                    loadCartSize();
                } else {
                    infobox_show("Error occured while adding product to cart!");
                }

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
    decodeIDFromURL().then(loadProduct).then(showProductData).then(loadRelatedProducts).then(initPage).catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });
});
function loadProductTiles(products_data){

    if(products_data === null){
        return;
    }

    let $root = $("#m-product-tile-container");
    $root.empty();

    products_data.forEach((product) => {
        let $a_tag = $("<a>", {
            class: "col-6 col-sm-6 col-md-4 col-lg-3 m-product-tile",
            href: "/product/"+product.id
        });
        let $img_first = $("<img>", {
            src: "/assets/products/"+product.photos[0],
            alt: "Product photo"
        });
        let $img_second = $("<img>", {
            src: "/assets/products/"+product.photos[1],
            alt: "Product photo"
        });
        let $div_name = $("<div>", {
            class: "fs-6",
            text: product.name
        });
        let $div_price = $("<div>", {
            class: "m-b-800",
            text: product.price + " PLN"
        });

        $a_tag.append($img_first);
        $a_tag.append($img_second);
        $a_tag.append($div_name);
        $a_tag.append($div_price);

        $root.append($a_tag);
    });

    return;
}
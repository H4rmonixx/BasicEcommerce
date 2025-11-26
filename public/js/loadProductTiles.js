function loadProductTiles(products_data){

    return new Promise((resolve, reject) => {
        if(products_data === null){
            reject("Products data empty");
            return;
        }

        let $root = $("#m-product-tile-container");
        $root.empty();

        if(products_data.length == 0){
            let $div = $("<div>", {
                class: "col-12 fs-3 fw-bold"
            });
            $div.text("No products found!");

            $root.append($div);
        }

        products_data.forEach((product) => {
            let $a_tag = $("<a>", {
                class: "col-12 col-sm-6 col-md-4 col-lg-3 m-product-tile d-flex flex-column justify-content-between text-black text-decoration-none",
                href: "/product/"+product.product_id
            });

            let $img_cont = $("<div>", {
                class: "m-product-tile-img-cont rounded d-flex justify-content-center mb-3 p-4"
            });

            let $img_first = $("<img>", {
                src: "/assets/products/"+product.photos[0].filename,
                alt: "Product photo"
            });
            let $img_second = $("<img>", {
                src: "/assets/products/"+product.photos[1].filename,
                alt: "Product photo"
            });

            let $desc = $("<div>");
            let $div_name = $("<div>", {
                class: "fs-6 text-center",
                text: product.name
            });
            let $div_price = $("<div>", {
                class: "m-b-800 text-center p-1",
                text: product.price + " PLN"
            });


            $img_cont.append($img_first);
            $img_cont.append($img_second);

            $desc.append($div_name);
            $desc.append($div_price);

            $a_tag.append($img_cont);
            $a_tag.append($desc);

            $root.append($a_tag);
        });

        resolve();
    });

}
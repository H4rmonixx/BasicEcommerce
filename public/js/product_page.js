let product_data = null;

function process_url(){
    return new Promise((resolve, reject) => {
        let url_get = window.location.search.substring(1);
        if(url_get.length === 0) {resolve(null); return;}
        url_get.split("&").forEach((query) => {
            if(query.length === 0) {resolve(null); return;}
            let set = query.split("=");
            if(set[0] === "id") {
                resolve(set[1]);
            }
        });
        resolve(null);
    });
}

function load_product_data(product_id){
    return new Promise((resolve, reject) => {

        server_request("POST", "php/get_product_data.php", (result) => {
            try{
                let json = JSON.parse(result);
                product_data = json;
                resolve(json);
            } catch (e) {
                infobox_show_message("ERROR OCCURRED WHILE LOADING THE PRODUCT");
                resolve(null)
            }

        }, product_id);

    });
}

function insert_product_data(product){
    return new Promise((resolve, reject) => {
        if(product === null){
            resolve(null);
            return;
        }

        document.getElementById("product-price-container").textContent = product.price+" PLN";
        document.getElementById("product-title-container").textContent = product.name;
        let photos_con = document.getElementById("product-photos-container");
        let desc_list = document.getElementById("product-description-list");
        let width_con = document.getElementById("product-sizechart-widths");
        let length_con = document.getElementById("product-sizechart-lengths");

        product.photos.forEach((path) => {
            let new_img = document.createElement("img");
            new_img.src="assets/products/"+path;
            new_img.alt="Product photo";
            new_img.name="product-photo";
            photos_con.appendChild(new_img);
        });

        product.description.forEach((txt) => {
            let new_li = document.createElement("li");
            new_li.textContent = txt;
            desc_list.appendChild(new_li);
        });

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

        ["s", "m", "l", "xl"].forEach((size) => {
            if(!product.sizes_available.includes(size)){
                document.getElementById("p-size-fieldset-"+size).setAttribute("disabled", "");
            }
        })

        resolve(product);
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

function product_page_init(){
    process_url().then(load_product_data).then(insert_product_data).then(get_related_products).then(generate_product_tiles).then(() => {
        set_cart_size_indicators();

        let photo_display = document.getElementsByName("product-photo");
        for(let i=0; i<photo_display.length; i++){
            photo_display[i].addEventListener('click', ()=>{
                for(let x=0; x<photo_display.length; x++){
                    if(x === i){
                        photo_display[x].classList.remove("order-2");
                        photo_display[x].classList.remove("col-3");
                        photo_display[x].classList.add("order-1");
                        photo_display[x].classList.add("col-12");
                    } else {
                        photo_display[x].classList.remove("order-1");
                        photo_display[x].classList.remove("col-12");
                        photo_display[x].classList.add("order-2");
                        photo_display[x].classList.add("col-3");
                    }
                }
            });
            photo_display[0].click();
        }

        let to_cart_button = document.getElementById("to-cart-button");
        to_cart_button.addEventListener("click", () => {
            let selector = document.querySelector('input[name="size-select"]:checked');
            if(selector){

                server_request("POST", "php/add_to_cart.php", (result) => {
                    if(result === "success"){
                        infobox_show_message("PRODUCT HAS BEEN ADDED TO CART!");
                        set_cart_size_indicators();
                    }
                    else infobox_show_message("ERROR OCCURRED WHILE ADDING TO CART")

                }, JSON.stringify({
                    id: product_data.id,
                    photo: product_data.photos[0],
                    name: product_data.name,
                    price: product_data.price,
                    quantity: 1,
                    size: selector.value
                }));

            } else {
                infobox_show_message("YOU HAVE TO CHOOSE PREFERENCED SIZE");
            }

        });
    });

}
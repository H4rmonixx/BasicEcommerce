let GlobalCartContent = null;

function load_cart(){
    return new Promise((resolve, reject) => {

        server_request("POST", "php/get_cart.php", (result) => {
            try{
                let json = JSON.parse(result);
                GlobalCartContent = json;
                if(json.length === 0) resolve(null);
                resolve(json);
            } catch (e) {
                infobox_show_message("Error occured with loading cart content");
                resolve(null);
            }
        });

    });
}

function generate_cart_preview(cart_content){
    return new Promise((resolve, reject) => {
       let root = document.getElementById("prods-in-cart-container");
       while(root.hasChildNodes()) root.removeChild(root.childNodes[0]);

       let give_null_info = () => {
           let info_div = document.createElement("div");
           info_div.classList.add("m-b-500", "fs-4", "d-flex", "justify-content-center", "p-2");
           info_div.setAttribute("style", "background-color:black; color:white;");
           info_div.textContent = "Nothing in cart yet."
           document.getElementById("prods-in-cart-container").appendChild(info_div);
       };

       if(cart_content === null){
           give_null_info();
           resolve(null);
           return;
       }

       if(cart_content.length === 0){
           give_null_info();
           resolve(null);
           return;
       }

       cart_content.forEach((product) => {
           let main_div = document.createElement("div");
           main_div.classList.add("prod-in-cart", "row", "mb-3", "gy-4", "mb-5", "gx-0");

           let img_div = document.createElement("div");
           img_div.classList.add("col-2", "d-flex", "align-items-center")
           let img = document.createElement("img");
           img.src="assets/products/"+product.photo; img.alt="Product photo"; img.classList.add("w-100");
           img_div.appendChild(img);

           let txt_div = document.createElement("div");
           txt_div.classList.add("col-10", "col-sm-4", "ps-3", "ps-sm-3", "d-flex", "align-items-center", "justify-content-sm-center");
           let txt_div_inner = document.createElement("div");
           let txt_div_inner_title = document.createElement("div");
           txt_div_inner_title.classList.add("m-b-800", "fs-5");
           txt_div_inner_title.textContent = product.name;
           let txt_div_inner_size = document.createElement("div");
           txt_div_inner_size.innerHTML = `Size: <span style="text-transform: uppercase;">${product.size}</span>`;
           txt_div_inner.appendChild(txt_div_inner_title);
           txt_div_inner.appendChild(txt_div_inner_size);
           txt_div.appendChild(txt_div_inner);

           let quantity_div = document.createElement("div");
           quantity_div.classList.add("col-4", "col-sm-2", "d-flex", "align-items-center", "justify-content-sm-center", "column-gap-2");
           let quantity_div_minus = document.createElement("div");
           quantity_div_minus.classList.add("p-1", "prod-in-cart-quantity-btn");
           quantity_div_minus.textContent = "-";
           let quantity_div_plus = document.createElement("div");
           quantity_div_plus.classList.add("p-1", "prod-in-cart-quantity-btn");
           quantity_div_plus.textContent = "+";
           let quantity_div_indicator = document.createElement("span");
           quantity_div_indicator.classList.add("prod-in-cart-quantity");
           quantity_div_indicator.textContent = product.quantity;
           quantity_div.appendChild(quantity_div_minus);
           quantity_div.appendChild(quantity_div_indicator);
           quantity_div.appendChild(quantity_div_plus);

           quantity_div_plus.addEventListener("click", ()=>{
               change_quantity(product.id, product.size, 1);
           });
           quantity_div_minus.addEventListener("click", ()=>{
               change_quantity(product.id, product.size, -1);
           });

           let price_div = document.createElement("div");
           price_div.classList.add("col-4", "col-sm-2", "d-flex", "align-items-center", "justify-content-sm-center", "prod-in-cart-price");
           price_div.textContent = product.price + " PLN";

           let close_div = document.createElement("div");
           close_div.classList.add("col-4", "col-sm-2", "d-flex", "align-items-center", "justify-content-sm-center")
           let close_div_btn = document.createElement("button");
           close_div_btn.classList.add("btn-close");
           close_div_btn.type="button";
           close_div_btn.addEventListener("click", ()=>{delete_from_cart(product.id, product.size)});
           close_div.appendChild(close_div_btn);

           main_div.appendChild(img_div);
           main_div.appendChild(txt_div);
           main_div.appendChild(quantity_div);
           main_div.appendChild(price_div);
           main_div.appendChild(close_div);

           root.appendChild(main_div);
       });
       resolve(cart_content);
    });
}

function calc_values(cart_content){
    return new Promise((resolve, reject) => {
        document.getElementById("estimated-ship-date").textContent = "-";
        document.getElementById("cart-products").textContent = "---";
        document.getElementById("cart-shipment").textContent = "---";
        document.getElementById("cart-discount").textContent = "---";
        document.getElementById("cart-total").textContent = "---";

        if(cart_content === null){
            resolve();
            return;
        }

        let totalCartValue = 0;
        cart_content.forEach((product) => {
            totalCartValue += product.price * product.quantity;
        });

        document.getElementById("cart-products").textContent = totalCartValue + " PLN";
        document.getElementById("cart-shipment").textContent = "22 PLN";
        document.getElementById("cart-discount").textContent = "0 PLN";
        document.getElementById("cart-total").textContent = (totalCartValue + 22) + " PLN";

        const date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        document.getElementById("estimated-ship-date").textContent = date.toLocaleDateString();
        resolve();
    });
}

function delete_from_cart(id, size){
    let p_index = -1;
    for(let i=0; i<GlobalCartContent.length; i++){
        let product = GlobalCartContent[i];
        if(product.id === id && product.size === size) {
            p_index = i;
            break;
        }
    }

    if(p_index !== -1) server_request("POST", "php/delete_from_cart.php", (result) => {
        try{
            let json = JSON.parse(result);
            GlobalCartContent = json;
            set_cart_size_indicators();
            generate_cart_preview(json).then(calc_values);
        } catch (e) {
            infobox_show_message("ERROR OCCURED WHILE DELETING PRODUCT FROM CART");
        }
    }, p_index);
}

function change_quantity(id, size, x){
    let change_done = false;
    let prod = null;
    GlobalCartContent.forEach((product) => {
        if(product.id === id && product.size === size){
            if(product.quantity > 1 || x > 0){
                product.quantity += x;
                prod = product;
                change_done = true;
            }
        }
    });
    if(change_done){
        server_request("POST", "php/add_to_cart.php", (result) => {
            if(result === "success"){
                generate_cart_preview(GlobalCartContent).then(calc_values).then(set_cart_size_indicators);
            } else {
                infobox_show_message("ERROR OCCURED WHILE CHANING PRODUCT QUANTITY");
            }
        }, JSON.stringify(prod));
    }
}

function init_shoppingcart_page(){
    load_cart().then(generate_cart_preview).then(calc_values).then(()=>{
        set_cart_size_indicators();

        document.getElementById("take-order-button").addEventListener("click", ()=>{

            if(GlobalCartContent === null){
                infobox_show_message("THE CART IS EMPTY");
                return;
            }
            if(GlobalCartContent.length === 0){
                infobox_show_message("THE CART IS EMPTY");
                return;
            }

            let shipment = {
                postcode: document.getElementById("input-postcode").value,
                city: document.getElementById("input-city").value,
                address: document.getElementById("input-address").value,
                building: document.getElementById("input-building").value
            }
            let selector = document.querySelector('input[name="payment-method-radio"]:checked');
            if(selector && shipment.postcode.length && shipment.city.length && shipment.address.length && shipment.building.length){
                window.location.href = "ordersummary_page.php";
            } else {
                infobox_show_message("FILL IN ALL DELIVERY DETAILS")
            }
        });
    });
}
function ordersummary_page_init(){

    server_request("GET", "php/get_cart.php", (result) => {
       try{
           let json = JSON.parse(result);
           if(json.length === 0){
               infobox_show_message("ERROR OCCURRED WHILE LOADING THE ORDER");
               setTimeout(()=>{window.location.href="index.php"}, 1500);
               return;
           }

           let root = document.getElementById("order-content-container");
           json.forEach((product) => {
               let maindiv = document.createElement("div");
               maindiv.classList.add("d-flex", "mb-2", "flex-wrap");
               let namediv = document.createElement("div");
               namediv.classList.add("m-b-700", "pe-4");
               namediv.textContent = product.name;
               let sizediv = document.createElement("div");
               sizediv.classList.add("pe-4");
               sizediv.innerHTML = 'Size: <span style="text-transform: uppercase">'+product.size+'</span>';
               let quantitydiv = document.createElement("div");
               quantitydiv.classList.add("pe-4");
               quantitydiv.textContent = product.quantity;
               let pricediv = document.createElement("div");
               pricediv.textContent = `${product.price * product.quantity} PLN`;

               maindiv.appendChild(namediv);
               maindiv.appendChild(sizediv);
               maindiv.appendChild(quantitydiv);
               maindiv.appendChild(pricediv);
               root.appendChild(maindiv);
           });

           server_request("GET", "php/empty_cart.php", (result) => {
                set_cart_size_indicators();
           });

       } catch (e) {
            infobox_show_message("ERROR OCCURRED WHILE LOADING THE ORDER");
            setTimeout(()=>{window.location.href="index.php"}, 1500);
       }
    });

    document.getElementById("return-button").addEventListener("click", ()=>{
        window.location.href = "index.php";
    });
}
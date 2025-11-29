function decodeIDFromURL(){
    return new Promise((resolve, reject) => {
        let path = $(location).prop("pathname");
        let matches = path.match(/\/summary\/(?<id>[\d]+)/);
        if(matches == null){
            reject("Wrong order ID");
            return;
        }
        if(matches.groups.id != undefined){
            resolve(matches.groups.id);
        }
        reject("Wrong order ID");
    });
}

function loadSummary(id){
    return $.ajax({
        url: "/order/load/"+id,
        type: "post"
    }).then((success)=>{
        try{
            let json = JSON.parse(success);
            $("#title").text("ORDER NO. " + json.order_id);
            let $root = $("#order-content");
            $("#order-price").append($("<div>", {text: "Total " + json.products_price + " PLN"}));
            json.products.forEach((variant) => {
                
                $.ajax({
                    url: "/product/load/variant/"+variant.product_variant_id,
                    type: "post"
                }).then((res)=>{
                    try{
                        let product = JSON.parse(res);
                        let $main = $("<div>", {class: "row mb-2"});
                        $main.append($("<div>", {class: "m-b-700 col-12", text: product.name}));
                        $main.append($("<div>", {class: "col-4", html: `Size: <span style="text-transform: uppercase;">${product.variants[0].name}</span>`}));
                        $main.append($("<div>", {class: "col-4", text: variant.quantity}));
                        $main.append($("<div>", {class: "col-4", text: `${product.price * variant.quantity} PLN`}));
                        $root.append($main);
                    } catch(e) {
                        let $main = $("<div>", {class: "row mb-2"});
                        $main.append($("<div>", {class: "m-b-700 col-12", text: "[-] Product deleted"}));
                        $root.append($main);
                    }
                }).catch((error) => {
                    if(error.statusText)
                        infobox_show(error.statusText, 5000);
                    else
                        infobox_show(error, 5000)
                });
                
            });
        } catch (e) {
            console.log("Unable to load order");
            return $.Deferred().reject("Error occured").promise();
        }
    });
}

$(document).ready(()=>{
    decodeIDFromURL().then(loadSummary).catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

    loadCartSize();

});
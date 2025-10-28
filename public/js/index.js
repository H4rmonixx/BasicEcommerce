$(document).ready(()=>{
    $.ajax({
        type: "post",
        url: "/products/load",
        data: JSON.stringify({
            categories: [],
            sizes: [],
            price_from: null,
            price_to: null,
            omit_id: null,
            limit: 8
        })
    })
    .then((success) => {
        try{
            let json = JSON.parse(success);
            return json;
        } catch(e){
            return $.Deferred().reject("Error occurred while loading items...").promise();
        }
    })
    .then(loadProductTiles)
    .catch((error)=>{
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

    
    loadCartSize();

});
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
            limit: 8,
            page: 1
        })
    })
    .then((success) => {
        try{
            let json = JSON.parse(success);
            return json;
        } catch(e){
            console.log("Unable to load items");
            return $.Deferred().reject("Error occurred").promise();
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
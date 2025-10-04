function signToNewsletter(){
    let mail = document.getElementById("newsletter-input-mail").value;
    if(mail.length > 0){
        // zapisz na newsletter
    } else {
        document.getElementById("newsletter-callback").textContent = "Wrong email address!";
    }
}

$(document).ready(()=>{
    $.ajax({
        type: "post",
        url: "/api/load/products/latest",
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
    .then(()=>{
        $("#newsletter-button").on("click", signToNewsletter);
        loadCartSize();
    })
    .fail((error)=>{
        infobox_show(error, 5000);
    });
});
product_data = null;

function decodeIDFromURL(){
    return new Promise((resolve, reject) => {
        let path = $(location).prop("pathname");
        let matches = path.match(/\/admin\/product\/(?<id>[\d]+)/);
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
            $(document).prop("title", "H.R.M.X Admin / " + json.name);
            showPhotos();
        } catch(e) {
            console.log("Unable to load product");
            return $.Deferred().reject("Error occurred.").promise();
        }
    });
}

function loadCategories(prodid){
    return $.ajax({
        type: "post",
        url: "/categories/load"
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            
            return prodid;
        } catch(e) {
            console.log("Unable to load categories");
            return $.Deferred().reject("Error occurred.").promise();
        }
    });
}

function showPhotos(){
    let $photosroot = $("#photos-list");
    $photosroot.empty();
    product_data.photos.forEach((photo, index) => {
        let $container = $("<div>", {class: "col-xxl-2 col-md-3 col-4"});
        let $pos = $("<div>", {class: "position-relative h-100 photo-tile"});
        $container.append($pos);

        $pos.append($("<img>", {class: "w-100", src: "/assets/products/" + photo, alt: "Product photo"}));
        $pos.append($("<div>", {class: "position-absolute p-1 bg-white top-0 start-0 border", text: index+1}));
        let $steer = $("<div>", {class: "position-absolute d-none align-items-center justify-content-center column-gap-1 top-0 start-0 w-100 h-100 bg-white border photo-tile-steer"});
        let $steerleft = $("<i>", {class: "bi bi-arrow-left-square-fill fs-6 text-black photo-btn"});
        let $steerright = $("<i>", {class: "bi bi-arrow-right-square-fill fs-6 text-black photo-btn"});

        $steerleft.on("click", ()=>{changeTilePos(index, -1)});
        $steerright.on("click", ()=>{changeTilePos(index, 1)});

        $steer.append($steerleft);
        $steer.append($steerright);
        $pos.append($steer);

        $photosroot.append($container);
    });
}

function changeTilePos(index, x){
    if(x < 0 && index <= 0) return;
    if(x > 0 && index >= product_data.photos.length) return;

    [product_data.photos[index], product_data.photos[index + x]] = [product_data.photos[index + x], product_data.photos[index]];
    showPhotos();
}

$(document).ready(()=>{
    decodeIDFromURL().then(loadCategories).then(loadProduct).catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });



});
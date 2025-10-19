function decodeFilterFromURL(){
    return new Promise((resolve, reject) => {
        let path = $(location).prop("pathname");
        let matches = path.match(/\/products\/(?<category>category=[\w\.]*)*[&]*(?<size>size=[\w\.]*)*[&]*(?<price>price=[\w\.]*)*/);
        if(matches == null){
            resolve();
            return;
        }
        if(matches.groups.category != undefined){
            let cats = matches.groups.category.substring("category=".length).split(".");
            cats.forEach(element => {
                $("#filter-category-"+element).prop("checked", true);
            });
        }
        if(matches.groups.size != undefined){
            let sizes = matches.groups.size.substring("size=".length).split(".");
            sizes.forEach(element => {
                $("#filter-size-"+element).prop("checked", true);
            });
        }
        resolve();
    });
    
}

function get_filters(){
    
    let active_filters = {
        categories: [],
        sizes: [],
        price_from: null,
        price_to: null,
        omit_ids: []
    };

    let checkboxes = document.getElementsByClassName("filter-checkbox");
    for(let i=0; i<checkboxes.length; i++){
        if(checkboxes[i].checked){
            let id = checkboxes[i].id.split("-");
            if(id[0] + id[1]==="filtercategory"){
                active_filters.categories.push(id[2]);
            }
            if(id[0] + id[1]==="filtersize"){
                active_filters.sizes.push(id[2]);
            }
        }
    }

    let input_numbers = document.getElementsByClassName("filter-number");
    for(let i=0; i<input_numbers.length; i++){
        if(input_numbers[i].value){
            if(input_numbers[i].id==="filter-price-from") active_filters.price_from = parseInt(input_numbers[i].value);
            if(input_numbers[i].id==="filter-price-to") active_filters.price_to = parseInt(input_numbers[i].value);
        }
    }

    let new_url = "/products/";
    if(active_filters.categories.length > 0) new_url += "category=" + active_filters.categories.join(".");
    if(active_filters.sizes.length > 0) new_url += "&size=" + active_filters.sizes.join(".");

    history.pushState(active_filters, "", new_url);

    return active_filters;
}

function refreshList(){
    $.ajax({
        type: "post",
        url: "/products/load",
        data: JSON.stringify(get_filters())
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
    .fail((error)=>{
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000);
    });
}

$(document).ready(()=>{
    
    $(".filter-number").on("input", function () {
        if($(this).val())
            $(this).val(parseInt($(this).val()));
    })

    decodeFilterFromURL().then(refreshList);
    loadCartSize();

    let $submitBtns = $(".filter-submit");
    $submitBtns.on("click", refreshList);

});
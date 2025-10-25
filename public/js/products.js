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
        if(matches.groups.price != undefined){
            let prices = matches.groups.price.substring("price=".length).split(".");
            if(prices.length > 0) $("#filter-price-from").val(prices[0]);
            if(prices.length > 1) $("#filter-price-to").val(prices[1]);
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
        omit_ids: [],
        limit: null
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
    let filter_added = false;
    if(active_filters.categories.length > 0){
        if(filter_added) new_url += "&";
        new_url += "category=" + active_filters.categories.join(".");
        filter_added = true;
    }
    if(active_filters.sizes.length > 0) {
        if(filter_added) new_url += "&";
        new_url += "size=" + active_filters.sizes.join(".");
        filter_added = true;
    }
    if(active_filters.price_from != null || active_filters.price_to != null){
        if(filter_added) new_url += "&";
        new_url += "price=" + (active_filters.price_from != null ? active_filters.price_from : 0) + (active_filters.price_to != null ? "." + active_filters.price_to : "");
        filter_added = true;
    }
    

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
            infobox_show(error, 5000)
    });
}

function loadCategories(){
    return $.ajax({
        type: "post",
        url: "/categories/load"
    }).then((success) => {

        let json;
        try{
            json = JSON.parse(success);
        } catch(e){
            return $.Deferred().reject("Error occurred while loading categories...").promise();
        }
        let $root = $("#filter-category-container");
        json.forEach((category) => {
            let $div = $("<div>", {class: "form-check"});
            let $input = $("<input>", {
                class: "form-check-input filter-checkbox",
                type: "checkbox",
                id: "filter-category-" + category.category_id
            });
            let $label = $("<label>", {
                class: "form-check-label",
                for: "filter-category-" + category.category_id
            })
            $label.text(category.name.toUpperCase());
            
            $div.append($input);
            $div.append($label);

            $root.append($div);
        });

    });
}

function loadSizes(){
    return $.ajax({
        type: "post",
        url: "/sizes/load"
    }).then((success) => {

        let json;
        try{
            json = JSON.parse(success);
        } catch(e){
            return $.Deferred().reject("Error occurred while loading sizes...").promise();
        }
        let $root = $(".filter-size-grid");
        json.forEach((size) => {
            let $div = $("<div>", {class: "form-check"});
            let $input = $("<input>", {
                class: "form-check-input filter-checkbox",
                type: "checkbox",
                id: "filter-size-" + size.variant_id
            });
            let $label = $("<label>", {
                class: "form-check-label",
                for: "filter-size-" + size.variant_id
            })
            $label.text(size.name.toUpperCase());
            
            $div.append($input);
            $div.append($label);

            $root.append($div);
        });

    });
}

$(document).ready(()=>{
    
    $(".filter-number").on("input", function () {
        if($(this).val())
            $(this).val(parseInt($(this).val()));
    })

    loadCategories().then(loadSizes).then(()=>{
        decodeFilterFromURL().then(refreshList);
        loadCartSize();
    }).fail((error)=>{
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });
    
    let $submitBtns = $(".filter-submit");
    $submitBtns.on("click", refreshList);

});
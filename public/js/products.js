let page = 1;
let pagesCount = null;
let filters = null;
let filters_url = "";

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

function decodePageFromURL(){
    return new Promise((resolve, reject) => {
        let path = $(location).prop("pathname");
        let matches = path.match(/\/products\/[\w\.&=\/]*(?<page>p=[\d]+)/);
        if(matches == null){
            resolve();
            return;
        }
        if(matches.groups.page != undefined){
            page = parseInt(matches.groups.page.substring("p=".length));
        }
        resolve();
    });
}

function getFilters(){
    return new Promise((resolve, reject) => {
        let active_filters = {
            categories: [],
            sizes: [],
            price_from: null,
            price_to: null,
            omit_id: null,
            limit: 8,
            page: page
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

        let new_url = "";
        let filter_added = false;
        if(active_filters.categories.length > 0){
            if(!filter_added) new_url += "/";
            if(filter_added) new_url += "&";
            new_url += "category=" + active_filters.categories.join(".");
            filter_added = true;
        }
        if(active_filters.sizes.length > 0) {
            if(!filter_added) new_url += "/";
            if(filter_added) new_url += "&";
            new_url += "size=" + active_filters.sizes.join(".");
            filter_added = true;
        }
        if(active_filters.price_from != null || active_filters.price_to != null){
            if(!filter_added) new_url += "/";
            if(filter_added) new_url += "&";
            new_url += "price=" + (active_filters.price_from != null ? active_filters.price_from : 0) + (active_filters.price_to != null ? "." + active_filters.price_to : "");
            filter_added = true;
        }

        filters = active_filters;
        filters_url = new_url;

        history.pushState(null, "", "/products" + new_url + "/p=" + page);

        resolve();
    });
}

function refreshList(){
    return $.ajax({
        type: "post",
        url: "/products/load",
        data: JSON.stringify(filters)
    })
    .then((success) => {
        try{
            let json = JSON.parse(success);
            return json;
        } catch(e){
            return $.Deferred().reject("Error occurred while loading items...").promise();
        }
    })
    .then(loadProductTiles);
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

function loadPagesCount(){
    return $.ajax({
        type: "post",
        url: "/pages/count",
        data: JSON.stringify(filters)
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            pagesCount = json.pagesCount;
            setPagesButtons();
        } catch(e){
            return $.Deferred().reject("Error occurred while loading pages...").promise();
        }
    });
}

function setPagesButtons(){
    let $root = $("#page-link-container");
    $root.empty();
    let c = 0;
    let i = page - 1;
    while(c < 4 && i <= pagesCount){
        
        if(i < 1) {
            i += 1;
            continue;
        }

        let $li = $("<li>", {class: "page-item"});
        let $a = $("<a>", {class: "page-link"});
        $a.text(i);
        $a.on("click", function () {
            page = parseInt($(this).text());
            filters.page = page;
            history.pushState(null, "", "/products" + filters_url + "/p=" + page);
            loadPagesCount().then(refreshList);
        });
        if(page == i) $a.addClass("active");
        
        $li.append($a);
        $root.append($li);

        i += 1;
        c += 1;
    }
}

$(document).ready(()=>{
    
    $(".filter-number").on("input", function () {
        if($(this).val())
            $(this).val(parseInt($(this).val()));
    })

    loadCategories().then(loadSizes).then(decodeFilterFromURL).then(decodePageFromURL).then(getFilters).then(loadPagesCount).then(refreshList).catch((error)=>{
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

    loadCartSize();
    
    $(".filter-submit").on("click", () => {
        page = 1;
        pagesCount = null;
        getFilters().then(loadPagesCount).then(refreshList);
    });

    $("#page-link-left").on("click", function(){
        if(page == 1) return;
        page -= 1;
        filters.page = page;
        history.pushState(null, "", "/products" + filters_url + "/p=" + page);
        loadPagesCount().then(refreshList);
    });
    $("#page-link-right").on("click", function(){
        if(page == pagesCount) return;
        page += 1;
        filters.page = page;
        history.pushState(null, "", "/products" + filters_url + "/p=" + page);
        loadPagesCount().then(refreshList);
    });

});
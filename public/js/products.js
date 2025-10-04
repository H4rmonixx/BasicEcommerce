let linkCategory = "";

function get_filters(){
    let active_filters = {
        categories: [],
        size: {
            tops: [],
            pants: [],
            footwear: []
        },
        price: {
            from: "none",
            to: "none"
        },
        omit_ids: []
    };

    let checkboxes = document.getElementsByClassName("filter-checkbox");
    for(let i=0; i<checkboxes.length; i++){
        if(checkboxes[i].checked){
            let id = checkboxes[i].id.split("-");
            if(id[0] + id[1]==="filtercategory"){
                active_filters.categories.push(id[2]);
            }
            if(id[0] + id[1]==="filtertops_size"){
                active_filters.size.tops.push(id[2]);
            }
            if(id[0] + id[1]==="filterpants_size"){
                active_filters.size.pants.push(id[2]);
            }
            if(id[0] + id[1]==="filterfootwear_size"){
                active_filters.size.footwear.push(id[2]);
            }
        }
    }

    let input_numbers = document.getElementsByClassName("filter-number");
    for(let i=0; i<input_numbers.length; i++){
        if(input_numbers[i].value){
            if(input_numbers[i].id==="filter-price-from") active_filters.price.from = parseInt(input_numbers[i].value);
            if(input_numbers[i].id==="filter-price-to") active_filters.price.to = parseInt(input_numbers[i].value);
        }
    }

    if(active_filters.size.tops.length > 0 && !active_filters.categories.includes("tops")) active_filters.categories.push("tops");
    if(active_filters.size.pants.length > 0 && !active_filters.categories.includes("pants")) active_filters.categories.push("pants");
    if(active_filters.size.footwear.length > 0 && !active_filters.categories.includes("footwear")) active_filters.categories.push("footwear");

    return active_filters;
}

function refreshList(){
    $.ajax({
        type: "post",
        url: "/api/load/products/all",
        data: JSON.stringify(get_filters())
    })
    .then((success) => {
        try{
            alert(success);
            let json = JSON.parse(success);
            return json;
        } catch(e){
            return $.Deferred().reject("Error occurred while loading items...").promise();
        }
    })
    .then(loadProductTiles)
    .fail((error)=>{
        infobox_show(error, 5000);
    });
}

$(document).ready(()=>{
    
    if(linkCategory.length > 0){
        $(`#filter-category-${linkCategory}`).prop("checked", true);
    }
    
    refreshList();
    loadCartSize();

    let $submitBtns = $(".filter-submit");
    $submitBtns.on("click", refreshList);

});
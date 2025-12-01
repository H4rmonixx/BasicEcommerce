let page = 1;
let pagesCount = null;
let filters = null;

function decodePageFromURL(){
    return new Promise((resolve, reject) => {
        let path = $(location).prop("pathname");
        let matches = path.match(/\/articles\/(?<page>p=[\d]+)/);
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

        filters = {
            search: $("#search-form-input").val(),
            omit_id: null,
            limit: 8,
            page: page
        }
        history.pushState(null, "", "/articles/p=" + page);

        resolve();
    });
}

function refreshList(){
    return $.ajax({
        type: "post",
        url: "/articles/load",
        data: JSON.stringify(filters)
    })
    .then((success) => {
        try{
            let json = JSON.parse(success);
            let $root = $("#articles-container");
            $root.empty();

            if(json.length == 0){
                let $div = $("<div>", {
                    class: "col-12 fs-3 fw-bold"
                });
                $div.text("No articles found!");

                $root.append($div);
            }

            json.forEach((article) => {
                let $a_tag = $("<a>", {
                    class: "col-12 col-sm-6 col-md-4 col-lg-3 d-flex flex-column justify-content-between text-white text-decoration-none",
                    href: "/article/"+article.article_id
                });

                let $desc = $("<div>", {
                    class: "border p-2 bg-dark rounded"
                });
                let $div_title = $("<div>", {
                    class: "fw-bold fs-6 text-center",
                    text: article.title
                });
                let $div_data = $("<div>", {
                    class: "text-center p-1",
                    text: "POSTED " + article.date
                });

                $desc.append($div_title);
                $desc.append($div_data);
                $a_tag.append($desc);

                $root.append($a_tag);
            });
            
        } catch(e){
            console.log("Unable to load articles");
            return $.Deferred().reject("Error occurred").promise();
        }
    })
}

function loadPagesCount(){
    return $.ajax({
        type: "post",
        url: "/articles/pages",
        data: JSON.stringify(filters)
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            if(json == null){
                console.log("Unable to load articles count");
                return $.Deferred().reject("Error occurred").promise();
            }
            pagesCount = json.pagesCount;
            setPagesButtons();
        } catch(e){
            console.log("Unable to load articles count");
            return $.Deferred().reject("Error occurred").promise();
        }
    });
}

function setPagesButtons(){
    let $root = $("#page-link-container");
    $root.empty();
    let c = 0;
    let i = page - 1;
    while(c < 3 && i <= pagesCount){
        
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
            history.pushState(null, "", "/articles/p=" + page);
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

    decodePageFromURL().then(getFilters).then(loadPagesCount).then(refreshList).catch((error)=>{
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

    loadCartSize();

    $("#search-form").on("submit", function(e){
        e.preventDefault();
        page = 1;
        pagesCount = null;
        getFilters().then(loadPagesCount).then(refreshList);
    });

    $("#page-link-left").on("click", function(){
        if(page == 1) return;
        page -= 1;
        filters.page = page;
        history.pushState(null, "", "/articles/p=" + page);
        loadPagesCount().then(refreshList);
    });
    $("#page-link-right").on("click", function(){
        if(page == pagesCount) return;
        page += 1;
        filters.page = page;
        history.pushState(null, "", "/articles/p=" + page);
        loadPagesCount().then(refreshList);
    });

});
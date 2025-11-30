articles_data = null;

function loadArticles(){
    return $.ajax({
        type: "post",
        url: "/articles/list"
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            articles_data = json;
            $("#articles-count").html(`<b>Articles count: </b>${json.length}`);
            let $root = $("#articles-tbody");
            $root.empty();
            json.forEach((article, index) => {
                let $tr = $("<tr>");
                $tr.append($("<td>", {class: "d-none d-lg-table-cell", text: article.article_id}));
                $tr.append($("<td>", {text: article.title}));
                $tr.append($("<td>", {text: article.date}));
                let $btntd = $("<td>", {class: "d-flex column-gap-2 row-gap-2 flex-wrap"});
                let $btn = $("<button>", {type: "button", class: "btn btn-warning btn-sm", html: '<i class="bi bi-pencil-square"></i>'});
                $btn.on("click", ()=>{window.location.href = "/admin/article/"+article.article_id});
                let $btn2 = $("<button>", {type: "button", class: "btn btn-danger btn-sm", html: '<i class="bi bi-trash"></i>'});
                $btn2.on("click", ()=>{deleteArticle(index)});

                $btntd.append($btn);
                $btntd.append($btn2);
                $tr.append($btntd);

                $root.append($tr);
            })
        } catch(e) {
            console.log("Unable to load articles");
            return $.Deferred().reject("Error occurred.").promise();
        }
    });
}

function deleteArticle(index){
    $("#modal-delete-name").text(articles_data[index].title);
    $("#modal-delete-id").val(articles_data[index].article_id);
    bootstrap.Modal.getOrCreateInstance('#modal-delete').show();
}

$(document).ready(()=>{
    loadArticles().catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

    $("#button-new-article").on("click", ()=>{
        $("#input-new-name").val("");
        $("#input-new-visible").prop("checked", false);
        bootstrap.Modal.getOrCreateInstance('#modal-new').show();
    });

    $("#modal-new-form").on("submit", function(e){
        e.preventDefault();
        $.ajax({
            url: "/article/new",
            type: "post",
            data: JSON.stringify({
                title: $("#input-new-name").val(),
                public: $("#input-new-visible").prop("checked")
            })
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    window.location.href = "/admin/article/"+json[1];
                } else {
                    console.log("Unable to add article");
                    return $.Deferred().reject("Error occurred.").promise();
                }
            } catch(e){
                console.log("Unable to add article");
                return $.Deferred().reject("Error occurred.").promise();
            }
        }).catch((error) => {
            bootstrap.Modal.getOrCreateInstance('#modal-new').hide();
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });
    });

    $("#modal-delete-form").on("submit", function(e){
        e.preventDefault();
        let artid = $("#modal-delete-id").val();
        $.ajax({
            url: "/article/delete/"+artid,
            type: "post"
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    window.location.reload();
                } else {
                    console.log("Unable to delete article");
                    return $.Deferred().reject(json[1]).promise();
                }
            } catch(e){
                console.log("Unable to delete article");
                return $.Deferred().reject("Error occurred.").promise();
            }
        }).catch((error) => {
            bootstrap.Modal.getOrCreateInstance('#modal-delete').hide();
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });
    });

});
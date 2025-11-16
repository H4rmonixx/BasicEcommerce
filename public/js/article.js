function decodeIDFromURL(){
    return new Promise((resolve, reject) => {
        let path = $(location).prop("pathname");
        let matches = path.match(/\/article\/(?<id>[\d]+)/);
        if(matches == null){
            reject("Wrong article ID");
            return;
        }
        if(matches.groups.id != undefined){
            resolve(matches.groups.id);
        }
        reject("Wrong article ID");
    });
}

function loadArticle(id){
    return $.ajax({
        type: "post",
        url: "/article/load/" + id,
    })
    .then((success) => {
        try{
            let json = JSON.parse(success);
            return json;
        } catch(e){
            console.log("Unable to load article");
            return $.Deferred().reject("Error occurred").promise();
        }
    });
}

function showArticle(art){
    return new Promise((resolve, reject) => {
        $(document).prop("title", art.title);
        $(".article-content").html(art.content);
        resolve();
    });
}

$(document).ready(()=>{
    
    decodeIDFromURL().then(loadArticle).then(showArticle)
    .catch((error)=>{
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

    loadCartSize();

});
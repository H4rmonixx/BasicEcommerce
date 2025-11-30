article_data = null;

function decodeIDFromURL(){
    return new Promise((resolve, reject) => {
        let path = $(location).prop("pathname");
        let matches = path.match(/\/admin\/article\/(?<id>[\d]+)/);
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

function loadArticle(id){
    return $.ajax({
        type: "post",
        url: "/article/load/"+id
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            article_data = json;
            
            tinymce.init({
                selector: 'textarea#desc-editor',
                height: 600,
                content_style: 'body { padding-bottom: 30px; }',
                plugins: [
                'anchor', 'autolink', 'charmap', 'codesample', 'emoticons',
                'link', 'lists', 'media', 'searchreplace', 'table',
                'visualblocks', 'wordcount', 'code', 'fullscreen'
                ],
                toolbar: [
                'fullscreen undo redo | blocks fontfamily fontsize | bold italic underline strikethrough |',
                'alignleft aligncenter alignright alignjustify | lineheight |',
                'forecolor backcolor | bullist numlist indent outdent |',
                'link anchor | table media |',
                'emoticons charmap codesample hr |',
                'searchreplace visualblocks | removeformat'
                ].join(' '),
                menubar: true,
                setup: function(editor){
                    editor.on('init', function() {
                        if(json.content)
                            editor.setContent(json.content);
                    });
                }

            });

            $(document).prop("title", "H.R.M.X Admin / " + json.title);
            $("#article-site-link").prop("href", "/article/"+json.article_id);
            $("#input-title").val(json.title);
            $("#input-date").val(json.date);
            if(json.public == 1) $("#input-visible").prop("checked", "checked");

        } catch(e) {
            console.log("Unable to load article");
            return $.Deferred().reject("Error occurred.").promise();
        }
    });
}


$(document).ready(()=>{
    decodeIDFromURL().then(loadArticle).catch((error) => {
        if(error.statusText)
            infobox_show(error.statusText, 5000);
        else
            infobox_show(error, 5000)
    });

    $("#form-desc").on("submit", function(e){
        e.preventDefault();
        const content = tinymce.get('desc-editor').getContent();
        let fd = new FormData();
        fd.append("content", content);

        $.ajax({
            url: "/article/edit/content/"+article_data.article_id,
            type: "post",
            data: fd,
            processData: false,
            contentType: false
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    infobox_show("Content edited", 3000, [50, 100, 50]);
                } else {
                    console.log("Unable to edit content");
                    return $.Deferred().reject("Error occurred.").promise();
                }
            } catch (e){
                console.log("Unable to edit content");
                return $.Deferred().reject("Error occurred.").promise();
            }
        }).catch((error) => {
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });

    });

    $("#form-info").on("submit", function(e){
        e.preventDefault();

        $.ajax({
            url: "/article/edit/info/"+article_data.article_id,
            type: "post",
            data: JSON.stringify({
                title: $("#input-name").val(),
                public: $("#input-visible").prop("checked")
            })
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    infobox_show("Info edited", 3000, [50, 100, 50]);
                } else {
                    console.log("Unable to edit info");
                    return $.Deferred().reject(json[1]).promise();
                }
            } catch (e){
                console.log("Unable to edit info");
                return $.Deferred().reject("Error occurred.").promise();
            }
        }).catch((error) => {
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });

    });

});
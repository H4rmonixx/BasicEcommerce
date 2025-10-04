function get_id_from_url(){
    return new Promise((resolve, reject) => {
        let search = window.location.search.substring(1);
        if(search.length === 0) {resolve(null); return;}
        search.split("&").forEach((query) => {
            if(query.length > 0){
                let set = query.split("=");
                if(set[0] === "p"){
                    resolve(set[1]);
                    return;
                }
            }
        });
        resolve(null);
    });
}

function load_page_data(page_id){
    return new Promise((resolve, reject) => {
        if(page_id === null){
            resolve({title: "Error while loading...", content: "Page id was not provided"});
            return;
        }

        server_request("POST", "php/get_info_page.php", (result) => {
            try{
                let json = JSON.parse(result);
                resolve(json);
            } catch (e) {
                infobox_show_message("ERROR OCCURRED WHILE LOADING PAGE");
                resolve({title: "Error while loading...", content: "Server sent bad response."});
            }
        }, page_id);

    });
}

function insert_page_data(data){
    return new Promise((resolve, reject) => {
        document.getElementById("title-container").textContent = data.title;
        document.getElementById("content-container").innerHTML = data.content;
        document.title = data.title;
        resolve();
    });
}

function load_other_links(){
    return new Promise((resolve, reject) => {

        server_request("GET", "php/get_info_pages_links.php", (result) => {
            try{
                let json = JSON.parse(result);
                resolve(json);
            } catch (e) {
                infobox_show_message("ERROR OCCURRED WHILE LOADING ARTICLES LINKS");
                resolve(null);
            }
        });
    });
}

function insert_links(links){
    return new Promise((resolve, reject) => {
        if(links === null){
            resolve();
            return;
        }
        let root = document.getElementsByClassName("other-links")[0];
        links.forEach((x) => {
            let a = document.createElement("a");
            a.href="info_page.php?p="+x.id;
            a.textContent = x.title;
            root.appendChild(a);
        });
        resolve();
    });
}

function init_info_page(){
    get_id_from_url().then(load_page_data).then(insert_page_data).then(load_other_links).then(insert_links)
        .then(()=>{
            set_cart_size_indicators();
        });
}
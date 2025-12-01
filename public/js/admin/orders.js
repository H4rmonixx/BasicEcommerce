function loadOrders(s){
    return $.ajax({
        type: "post",
        url: "/orders/list",
        data: JSON.stringify({
            search: s
        })
    }).then((success) => {
        try{
            let json = JSON.parse(success);
            $("#orders-count").html(`<b>Orders count: </b>${json.length}`);
            let $root = $("#orders-tbody");
            $root.empty();
            json.forEach((order) => {
                let $tr = $("<tr>");
                $tr.append($("<td>", {class: "d-none d-lg-table-cell", text: order.order_id}));
                $tr.append($("<td>", {text: order.date}));
                $tr.append($("<td>", {class: "d-none d-lg-table-cell", text: order.firstname + " " + order.lastname}));
                $tr.append($("<td>", {class: "d-none d-sm-table-cell", text: parseFloat(order.shipping_price) + parseFloat(order.products_price) + " PLN"}));
                let $steer = $("<td>", {class: "d-flex column-gap-2"});
                let $deletebtn = $("<button>", {class: "btn btn-link btn-sm", html: '<i class="bi bi-three-dots"></i>'});
                $deletebtn.on("click", ()=>{

                });
                $steer.append($deletebtn);
                $tr.append($steer);
                
                $root.append($tr);
            })
        } catch(e) {
            console.log("Unable to load orders");
            return $.Deferred().reject("Error occurred.").promise();
        }
    });
}

$(document).ready(()=>{
    
    $("#search-form").on("submit", function(e) {
        e.preventDefault();
        loadOrders($("#search-form-input").val()).catch((error) => {
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });
    });
    $("#search-form-btn")[0].click();

});
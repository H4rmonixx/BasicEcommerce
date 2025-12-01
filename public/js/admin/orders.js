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

            let $roots = {
                PENDING: $("#orders-status-pending"),
                PAID: $("#orders-status-paid"),
                PREPARING: $("#orders-status-preparing"),
                SHIPPED: $("#orders-status-shipped"),
                CANCELED: $("#orders-status-canceled"),
            }

            let $counters = {
                PENDING: $("#orders-status-pending-count"),
                PAID: $("#orders-status-paid-count"),
                PREPARING: $("#orders-status-preparing-count"),
                SHIPPED: $("#orders-status-shipped-count"),
                CANCELED: $("#orders-status-canceled-count"),
            }

            $roots.PENDING.empty();
            $roots.PAID.empty();
            $roots.PREPARING.empty();
            $roots.SHIPPED.empty();
            $roots.CANCELED.empty();

            $counters.PENDING.text(0);
            $counters.PAID.text(0);
            $counters.PREPARING.text(0);
            $counters.SHIPPED.text(0);
            $counters.CANCELED.text(0);

            json.forEach((order) => {
                let $tr = $("<tr>");
                $tr.append($("<td>", {class: "d-none d-lg-table-cell", text: order.order_id}));
                $tr.append($("<td>", {text: order.date}));
                $tr.append($("<td>", {text: order.firstname + " " + order.lastname}));
                $tr.append($("<td>", {class: "d-none d-lg-table-cell", text: parseFloat(order.shipping_price) + parseFloat(order.products_price) + " PLN"}));
                let $steer = $("<td>", {class: "d-flex column-gap-2"});
                let $morebtn = $("<button>", {class: "btn btn-link btn-sm", html: '<i class="bi bi-three-dots"></i>'});
                $morebtn.on("click", function(){
                    $(this).closest("tr").next().toggleClass("d-none");
                });
                $steer.append($morebtn);
                $tr.append($steer);

                let $product_list = $("<table>", {class: "table table-striped"});
                $product_list.append($("<thead>", {html: '<tr><th>Name</th><th class="d-none d-lg-table-cell">Size</th><th class="d-none d-lg-table-cell">Price</th><th>Quantity</th><th>Value</th></tr>'}));
                let $product_list_tbody = $("<tbody>");
                $product_list.append($product_list_tbody);
                order.products.forEach((product_variant) => {
                    $.ajax({
                        url: "/product/load/variant/"+product_variant.product_variant_id,
                        type: "post"
                    }).then((success) => {
                        try{
                            let json = JSON.parse(success);
                            let $tmp = $("<tr>");
                            $tmp.append($("<td>", {text: json.name, class: "fw-bold"}));
                            $tmp.append($("<td>", {text: json.variants[0].name, class: "d-none d-md-table-cell"}));
                            $tmp.append($("<td>", {text: json.price + " PLN", class: "d-none d-md-table-cell"}));
                            $tmp.append($("<td>", {text: product_variant.quantity + "x"}));
                            $tmp.append($("<td>", {text: (product_variant.quantity * json.price) + " PLN"}));
                            $product_list_tbody.append($tmp);                            
                        } catch(e) {
                            let $tmp = $("<tr>");
                            $tmp.append($("<td>", {text: "Product deleted", class: "fw-bold text-start", colspan: 5}));
                            $product_list_tbody.append($tmp);
                        }
                    }).catch((error)=>{
                        if(error.statusText)
                            infobox_show(error.statusText, 5000);
                        else
                            infobox_show(error, 5000)
                    });
                });

                let $cont = $("<div>", {class: "d-flex column-gap-3 row-gap-3 flex-wrap justify-content-between mb-4"});

                let $div_left = $("<div>");
                $div_left.append($("<div>", {class: "mb-3", html: `<b>Payment:</b> ${order.payment_method}`}));
                let $status_form = $("<form>");
                let $status_form_fieldset = $("<fieldset>", {disabled: (order.status == 'PENDING'), class: "d-flex flex-column row-gap-1"});
                let $status_form_select = $("<select>", {class: "form-control form-control-sm", required: true});
                ['PENDING', 'PAID', 'PREPARING', 'SHIPPED', 'CANCELED'].forEach((status_value) => {
                    let is_dis = ['PENDING', 'PAID'].includes(status_value);
                    let is_sel = order.status == status_value;
                    $status_form_select.append($("<option>", {value: status_value, text: status_value, disabled: is_dis, selected: is_sel}));
                });
                $status_form_fieldset.append($status_form_select);
                $status_form_fieldset.append($("<button>", {type: "submit", class: "btn btn-dark btn-sm", text: "Update"}))
                if($status_form_fieldset.prop("disabled")) $status_form_fieldset.append($("<div>", {class: "form-text text-danger", text: "Status can be changed if order is paid."}));
                $status_form.append($status_form_fieldset);
                $div_left.append($status_form);

                $status_form.on("submit", function(e){
                    e.preventDefault();
                    if(!$(this).find("select").val() && $(this).find("select").val() != order.status){
                        infobox_show("Pick new status", 3000);
                        return;
                    }
                    $.ajax({
                        url: "/order/edit/status/"+order.order_id,
                        type: "post",
                        data: JSON.stringify({
                            status: $(this).find("select").val()
                        })
                    }).then((success) => {
                        try{
                            let json = JSON.parse(success);
                            if(json[0]){
                                infobox_show("Status changed", 3000, [50, 100, 50]);
                            } else {
                                console.log("Unable to edit order status");
                                return $.Deferred().reject("Error occurred.").promise();
                            }                       
                        } catch(e) {
                            console.log("Unable to edit order status");
                            return $.Deferred().reject("Error occurred.").promise();
                        }
                    }).catch((error)=>{
                        if(error.statusText)
                            infobox_show(error.statusText, 5000);
                        else
                            infobox_show(error, 5000)
                    });
                })

                let $div_right = $("<div>");
                $div_right.append($("<div>", {html: `<b>Products price:</b> ${order.products_price} PLN`}));
                $div_right.append($("<div>", {html: `<b>Shipment:</b> ${order.shipping_price} PLN`}));
                $div_right.append($("<div>", {html: `<b>Total price:</b> ${parseFloat(order.products_price) + parseFloat(order.shipping_price)} PLN`}));

                $cont.append($div_left);
                $cont.append($div_right);

                let $tr2 = $("<tr>", {class: "d-none"});
                let $tr2td = $("<td>", {colspan: 5});
                $tr2td.append($product_list);
                $tr2td.append($cont);
                $tr2.append($tr2td);
                
                $roots[order.status].append($tr);
                $roots[order.status].append($tr2);
                $counters[order.status].text(parseInt($counters[order.status].text())+1);
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
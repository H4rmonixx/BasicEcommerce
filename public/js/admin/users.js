function loadUsers(s){
    return $.ajax({
        type: "post",
        url: "/users/list",
        data: JSON.stringify({
            search: s
        })
    }).then((success) => {
        try{
            let json = JSON.parse(success);

            let $roots = {
                ADMIN: $("#users-admin"),
                CUSTOMER: $("#users-user")
            }

            let $counters = {
                ADMIN: $("#users-admin-count"),
                CUSTOMER: $("#users-user-count")
            }

            $roots.ADMIN.empty();
            $roots.CUSTOMER.empty();

            $counters.ADMIN.text(0);
            $counters.CUSTOMER.text(0);

            json.forEach((user) => {
                let $tr = $("<tr>");
                $tr.append($("<td>", {class: "d-none d-lg-table-cell", text: user.user_id}));
                $tr.append($("<td>", {text: user.firstname + " " + user.lastname}));
                $tr.append($("<td>", {text: user.email}));
                let $steer = $("<td>", {class: "d-flex column-gap-2"});
                let $morebtn = $("<button>", {class: "btn btn-link btn-sm", html: '<i class="bi bi-three-dots"></i>'});
                $morebtn.on("click", function(){
                    $(this).closest("tr").next().toggleClass("d-none");
                });
                $steer.append($morebtn);
                $tr.append($steer);

                let $cont = $("<div>", {class: ""});
                $cont.append($("<div>", {class: "fw-bold mb-3 fs-4", text: "User settings"}));

                let $info_form = $("<form>", {class: "row gy-1 mb-3"});
                $info_form.append($("<div>", {class: "col-12", text: "First name"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" value="${user.firstname}" class="form-control form-control-sm input-fname">`}));
                $info_form.append($("<div>", {class: "col-12", text: "Last name"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" value="${user.lastname}" class="form-control form-control-sm input-lname">`}));
                $info_form.append($("<div>", {class: "col-12", text: "Email"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" value="${user.email}" class="form-control form-control-sm input-email">`}));
                $info_form.append($("<div>", {class: "col-12", text: "Phone number"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" value="${user.phone_number}" class="form-control form-control-sm input-phone">`}));
                $info_form.append($("<div>", {class: "col-12", text: "Address"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" value="${user.address}" class="form-control form-control-sm input-address">`}));
                $info_form.append($("<div>", {class: "col-12", text: "Building"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" value="${user.building}" class="form-control form-control-sm input-building">`}));
                $info_form.append($("<div>", {class: "col-12", text: "City"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" value="${user.city}" class="form-control form-control-sm input-city">`}));
                $info_form.append($("<div>", {class: "col-12", text: "Post code"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" value="${user.post_code}" class="form-control form-control-sm input-post-code">`}));
                $info_form.append($("<div>", {class: "col-12", text: "Country"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" value="${user.country}" class="form-control form-control-sm input-country">`}));
                $info_form.append($("<div>", {class: "col-12 py-2", html: `<button type="submit" class="btn btn-sm btn-dark">Update</button>`}));
                $cont.append($info_form);

                $info_form.on("submit", function(e){
                    e.preventDefault();
                    $.ajax({
                        url: "",
                        type: "post",
                    }).then((success) => {
                        try{
                            let json = JSON.parse(success);
                                     
                        } catch(e) {
                            console.log("Unable to edit user info");
                            return $.Deferred().reject("Error occurred.").promise();
                        }
                    }).catch((error)=>{
                        if(error.statusText)
                            infobox_show(error.statusText, 5000);
                        else
                            infobox_show(error, 5000)
                    });
                })

                let $pass_form = $("<form>", {class: "row gy-1 mb-3"});
                $pass_form.append($("<div>", {class: "col-12", text: "New password"}));
                $pass_form.append($("<div>", {class: "col-md-8", html: `<input type="password" class="form-control form-control-sm input-password">`}));
                $pass_form.append($("<div>", {class: "col-12 py-2", html: `<button type="submit" class="btn btn-sm btn-dark">Update</button>`}));
                $cont.append($pass_form);

                $pass_form.on("submit", function(e){
                    e.preventDefault();
                    $.ajax({
                        url: "",
                        type: "post",
                    }).then((success) => {
                        try{
                            let json = JSON.parse(success);
                                     
                        } catch(e) {
                            console.log("Unable to edit user password");
                            return $.Deferred().reject("Error occurred.").promise();
                        }
                    }).catch((error)=>{
                        if(error.statusText)
                            infobox_show(error.statusText, 5000);
                        else
                            infobox_show(error, 5000)
                    });
                })

                let $btns = $("<div>", {class: "d-flex column-gap-3 flex-wrap row-gap-2 mb-4"});
                $btns.append($("<button>", {type: "button", class: "btn btn-sm btn-danger", text: "Delete user"}));
                if(user.type == "CUSTOMER"){
                    $btns.append($("<button>", {type: "button", class: "btn btn-sm btn-danger", text: "Convert to admin"}));
                } else if (user.type == "ADMIN"){
                    $btns.append($("<button>", {type: "button", class: "btn btn-sm btn-danger", text: "Degrade to customer"}));
                }
                
                $cont.append($btns);

                let $tr2 = $("<tr>", {class: "d-none"});
                let $tr2td = $("<td>", {colspan: 5});
                $tr2td.append($cont);
                $tr2.append($tr2td);
                
                $roots[user.type].append($tr);
                $roots[user.type].append($tr2);
                $counters[user.type].text(parseInt($counters[user.type].text())+1);
            });

            if(parseInt($counters.CUSTOMER.text()) == 0){
                $roots.CUSTOMER.append($("<tr>", {html: `<td colspan="4">No results</td>`}));
            }

        } catch(e) {
            console.log("Unable to load users");
            return $.Deferred().reject("Error occurred.").promise();
        }
    });
}

$(document).ready(()=>{
    
    $("#search-form").on("submit", function(e) {
        e.preventDefault();
        loadUsers($("#search-form-input").val()).catch((error) => {
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });
    });
    $("#search-form-btn")[0].click();

});
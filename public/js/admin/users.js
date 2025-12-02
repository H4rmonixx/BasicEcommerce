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
                $info_form.append($("<div>", {class: "col-md-8",  html: `<input type="text" required minlength="3" maxlength="32" value="${user.firstname}" class="form-control form-control-sm input-fname">`}));
                $info_form.append($("<div>", {class: "col-12", text: "Last name"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" required minlength="3" maxlength="32" value="${user.lastname}" class="form-control form-control-sm input-lname">`}));
                $info_form.append($("<div>", {class: "col-12", text: "Email"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="email" required minlength="3" maxlength="150" value="${user.email}" class="form-control form-control-sm input-email">`}));
                $info_form.append($("<div>", {class: "col-12", text: "Phone number"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" required minlength="7" maxlength="15" value="${user.phone_number}" class="form-control form-control-sm input-phone">`}));
                $info_form.append($("<div>", {class: "col-12", text: "Address"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" required minlength="3" maxlength="64" value="${user.address}" class="form-control form-control-sm input-address">`}));
                $info_form.append($("<div>", {class: "col-12", text: "Building"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" required minlength="1" maxlength="6" value="${user.building}" class="form-control form-control-sm input-building">`}));
                $info_form.append($("<div>", {class: "col-12", text: "City"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" required minlength="3" maxlength="32" value="${user.city}" class="form-control form-control-sm input-city">`}));
                $info_form.append($("<div>", {class: "col-12", text: "Post code"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" required minlength="3" maxlength="20" value="${user.post_code}" class="form-control form-control-sm input-post-code">`}));
                $info_form.append($("<div>", {class: "col-12", text: "Country"}));
                $info_form.append($("<div>", {class: "col-md-8", html: `<input type="text" required minlength="3" maxlength="64" value="${user.country}" class="form-control form-control-sm input-country">`}));
                $info_form.append($("<div>", {class: "col-12 py-2", html: `<button type="submit" class="btn btn-sm btn-dark">Update</button>`}));
                $cont.append($info_form);

                $info_form.on("submit", function(e){
                    e.preventDefault();
                    let data = {
                        firstname: $(this).find(".input-fname").val(),
                        lastname: $(this).find(".input-lname").val(),
                        phone_number: $(this).find(".input-phone").val(),
                        address: $(this).find(".input-address").val(),
                        building: $(this).find(".input-building").val(),
                        city: $(this).find(".input-city").val(),
                        post_code: $(this).find(".input-post-code").val(),
                        country: $(this).find(".input-country").val()
                    };
                    const phonePattern = /^\+?[0-9\s\-]{7,15}$/;
                    if(!phonePattern.test(data.phone_number)){
                        infobox_show("Invalid phone number", 5000);
                        return;
                    }

                    $.ajax({
                        url: "/user/update/data/"+user.user_id,
                        type: "post",
                        data: JSON.stringify(data)
                    }).then((success) => {

                        try{
                            let json = JSON.parse(success);
                            if(json[0]){
                                infobox_show("Data updated", 4000, [8, 100, 48]);
                            } else {
                                console.log("Unable to edit data");
                                return $.Deferred().reject("Error occurred").promise();
                            }
                        } catch (e) {
                            console.log("Unable to edit data");
                            return $.Deferred().reject("Error occurred").promise();
                        }

                    }).catch((error)=>{
                        if(error.statusText)
                            infobox_show(error.statusText, 5000);
                        else
                            infobox_show(error, 5000)
                    });
                })

                let $pass_form = $("<form>", {class: "row gy-1 mb-4"});
                $pass_form.append($("<div>", {class: "col-12", text: "New password"}));
                $pass_form.append($("<div>", {class: "col-md-8", html: `<input type="password" required minlength="8" maxlength="32" class="form-control form-control-sm input-password">`}));
                $pass_form.append($("<div>", {class: "col-12", text: "Retype password"}));
                $pass_form.append($("<div>", {class: "col-md-8", html: `<input type="password" required minlength="8" maxlength="32" class="form-control form-control-sm input-password2">`}));
                $pass_form.append($("<div>", {class: "col-12 py-2", html: `<button type="submit" class="btn btn-sm btn-dark">Update</button>`}));
                $cont.append($pass_form);

                $pass_form.on("submit", function(e){
                    e.preventDefault();
                    let data = {
                        password_new: $(this).find(".input-password").val(),
                        password_repeated: $(this).find(".input-password2").val()
                    };
                    if(data.password_new != data.password_repeated){
                        infobox_show("New passwords are not the same", 4000);
                        return;
                    }

                    $.ajax({
                        url: "/user/update/password/"+user.user_id,
                        type: "post",
                        data: JSON.stringify(data)
                    }).then((success) => {
                        try{
                            let json = JSON.parse(success);
                            if(json[0]){
                                infobox_show("Password updated", 4000, [8, 100, 48]);
                            } else {
                                return $.Deferred().reject("Wrong current password").promise();
                            }
                        } catch (e) {
                            console.log("Unable to edit password");
                            return $.Deferred().reject("Error occurred").promise();
                        }

                    }).catch((error)=>{
                        if(error.statusText)
                            infobox_show(error.statusText, 5000);
                        else
                            infobox_show(error, 5000)
                    });
                })

                let $btns = $("<div>", {class: "d-flex column-gap-3 flex-wrap row-gap-2 mb-4"});
                let $btndel = $("<button>", {type: "button", class: "btn btn-sm btn-danger", text: "Delete user"});
                $btndel.on("click", ()=>{
                    $("#modal-user-delete-id").val(user.user_id);
                    $("#modal-user-delete-name").text(user.firstname + " " + user.lastname);
                    bootstrap.Modal.getOrCreateInstance('#modal-user-delete').show();
                });

                let $btnconv = null;
                
                if(user.type == "CUSTOMER"){
                    $btnconv = $("<button>", {type: "button", class: "btn btn-sm btn-danger", text: "Convert to admin"});
                    $btnconv.on("click", ()=>{
                        $("#modal-user-convert-id").val(user.user_id);
                        $("#modal-user-convert-type").val('ADMIN');
                        $("#modal-user-convert-name").text(user.firstname + " " + user.lastname);
                        $("#modal-user-convert-name-type").text('ADMIN');
                        bootstrap.Modal.getOrCreateInstance('#modal-user-convert').show();
                    });
                } else if (user.type == "ADMIN"){
                    $btnconv = $("<button>", {type: "button", class: "btn btn-sm btn-danger", text: "Degrade to customer"});
                    $btnconv.on("click", ()=>{
                        $("#modal-user-convert-id").val(user.user_id);
                        $("#modal-user-convert-type").val('CUSTOMER');
                        $("#modal-user-convert-name").text(user.firstname + " " + user.lastname);
                        $("#modal-user-convert-name-type").text('CUSTOMER');
                        bootstrap.Modal.getOrCreateInstance('#modal-user-convert').show();
                    });
                }
                
                $btns.append($btndel);
                $btns.append($btnconv);
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

    $("#modal-user-delete-form").on("submit", function(e){
        e.preventDefault();
        let uid = $(this).find("#modal-user-delete-id").val();
        $.ajax({
            url: "/user/delete/"+uid,
            type: "post",
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    window.location.reload();
                } else {
                    console.log("Unable to delete user");
                    return $.Deferred().reject("Error occured").promise();
                }
            } catch (e) {
                console.log("Unable to delete user");
                return $.Deferred().reject("Error occurred").promise();
            }

        }).catch((error)=>{
            bootstrap.Modal.getOrCreateInstance('#modal-user-delete').hide();
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });
    });

    $("#modal-user-convert-form").on("submit", function(e){
        e.preventDefault();
        let uid = $(this).find("#modal-user-convert-id").val();
        let newtype = $(this).find("#modal-user-convert-type").val();
        $.ajax({
            url: "/user/update/type/"+uid,
            type: "post",
            data: JSON.stringify({
                type: newtype
            })
        }).then((success) => {
            try{
                let json = JSON.parse(success);
                if(json[0]){
                    window.location.reload();
                } else {
                    console.log("Unable to convert user");
                    return $.Deferred().reject("Error occured").promise();
                }
            } catch (e) {
                console.log("Unable to convert user");
                return $.Deferred().reject("Error occurred").promise();
            }

        }).catch((error)=>{
            bootstrap.Modal.getOrCreateInstance('#modal-user-convert').hide();
            if(error.statusText)
                infobox_show(error.statusText, 5000);
            else
                infobox_show(error, 5000)
        });
    });

});
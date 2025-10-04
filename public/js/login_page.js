function login_page_init(){
    document.getElementById("to-login-change-button").addEventListener("click", ()=>{
       document.getElementById("form-register").classList.add("d-none");
       document.getElementById("form-login").classList.remove("d-none");
    });
    document.getElementById("to-register-change-button").addEventListener("click", ()=>{
        document.getElementById("form-register").classList.remove("d-none");
        document.getElementById("form-login").classList.add("d-none");
    });

    set_cart_size_indicators();
}
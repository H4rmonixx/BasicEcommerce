function signToNewsletter(){
    let mail = document.getElementById("newsletter-input-mail").value;
    if(mail.length > 0){
        // zapisz na newsletter
    } else {
        document.getElementById("newsletter-callback").textContent = "Wrong email address!";
    }
}
$('.sign-in-modal').click(function() {
    $('.sign-in-modal').removeClass('active');
    $('.inner--sign-in-modal').removeClass('active');
});

$('.inner--sign-in-modal').click(function(e){
    e.stopPropagation();
})

$('.inner--new-org-modal').click(function(e){
    e.stopPropagation();
})

$('.close-login').click(function(){
    $('.sign-in-modal').removeClass('active');
    $('.inner--sign-in-modal').removeClass('active');
})

/* MODAL */
$('.modal-sign').click(function(){
    $('.sign-in-modal').addClass('active');
    $('.inner--sign-in-modal').addClass('active');
    setTimeout(function(){
    $('.overlay').removeClass('sign-up-side');
    $('.overlay').addClass('sign-in-side');
    $('.tab-sign-up').removeClass('active');
    $('.tab-sign-in').addClass('active');
    $('.content-sign-up').removeClass('active');
    $('.content-sign-in').addClass('active');
    }, 400);
});

$('.modal-sign2').click(function(){
    $('.sign-in-modal').addClass('active');
    $('.inner--sign-in-modal').addClass('active');
    setTimeout(function(){
    $('.overlay').removeClass('sign-in-side');
    $('.overlay').addClass('sign-up-side');
    $('.tab-sign-in').removeClass('active');
    $('.tab-sign-up').addClass('active');
    $('.content-sign-in').removeClass('active');
    $('.content-sign-up').addClass('active');
    }, 400);
});

$('.neworg').click(function(){
    $('.new-org-modal').addClass('active');
    $('.inner--new-org-modal').addClass('active');
    $('.content-sign-in').addClass('active');
});

$('.inner--sign-in-modal .close-modal').click(function(){
    $('.sign-in-modal').removeClass('active');
    $('.inner--sign-in-modal').removeClass('active');
});

$('.new-org-modal').click(function(){
    $('.new-org-modal').removeClass('active');
    $('.inner--new-org-modal').removeClass('active');
});

$('.val-info .tab').click(function(){
    if($(this).hasClass('tab-sign-in') == true){
    $('.overlay').removeClass('sign-up-side');
    $('.overlay').addClass('sign-in-side');
    $('.tab-sign-up').removeClass('active');
    $('.tab-sign-in').addClass('active');
    $('.content-sign-up').removeClass('active');
    $('.content-sign-in').addClass('active');
    } else {
    $('.overlay').removeClass('sign-in-side');
    $('.overlay').addClass('sign-up-side');
    $('.tab-sign-in').removeClass('active');
    $('.tab-sign-up').addClass('active');
    $('.content-sign-in').removeClass('active');
    $('.content-sign-up').addClass('active');
    }
});

//Greetings
$('.input-firstname').keyup(function(){
    var getText = $(this).val();
    console.log(getText);
    $('.greetings-name').html(getText);
});

$('.input-lastname').keyup(function(){
    var getText = $(this).val();
    console.log(getText);
    $('.greetings-surname').html(getText);
});

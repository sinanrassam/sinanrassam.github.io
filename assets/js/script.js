var delay = 500;
$( document ).ready(function() {
    window.setTimeout(function () {
        $('.container').toggleClass('hidden');
        $('body').toggleClass('animate');
    }, delay);
});

$('.special-link').on('click', function () {
    $('.card').toggleClass('flipped');
    window.setTimeout(function () {
        $('.card-face').toggleClass('hidden');
    }, delay);
});
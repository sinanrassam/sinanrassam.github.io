var delay = 500;
$('.special-link').on('click', function () {
    $('.card').toggleClass('flipped');
    window.setTimeout(function () {
        $('.card-face').toggleClass('hidden');
    }, delay);
});
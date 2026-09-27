$(document).ready(function () {
  $('.btn-like').on('click', function () {
    if ($(this).hasClass('liked')) {
      return; 
    }
    let $spanAngka = $(this).find('.like-count');
    let jumlahLike = parseInt($spanAngka.text()) + 1;
    $spanAngka.text(jumlahLike);
    $(this).addClass('liked');
  });
});
$(document).ready(function () {
  $('.faq-question').on('click', function () {
    var $jawaban = $(this).next('.faq-answer');
    $('.faq-answer').not($jawaban).slideUp();
    $jawaban.slideToggle();
  });
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
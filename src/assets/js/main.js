/*global $, alert, console*/

$(function () {
  'use strict';
  var $window, $navBar, $stick, windowTop, navTop, introTop, $topLink;

  // // sticky nav on scroll
  // $window = $(window);
  // $navBar = $('nav');
  // $stick = $('.stick');
  // $topLink = $('.nav-top-link');

  // $window.scroll(function () {
  //   windowTop = $window.scrollTop();
  //   navTop = $navBar.offset().top;
  //   introTop = $stick.offset().top;

  //   if (windowTop >= navTop) {
  //     $navBar.addClass('nav-sticky');
  //     if ($window.width() >= 440) {
  //       $topLink.fadeIn();
  //     }
  //   }

  //   if ((introTop - $navBar.height()) >= windowTop) {
  //     $navBar.removeClass('nav-sticky');
  //     $topLink.hide();
  //   }
  // });

  // Mobile menu
  var options = {
    label: '',
    brand: '<a href="/"><img class="mobile-logo" src="assets/images/alex-baker-logo.png" alt="Alex Baker\'s logo"></a>'
  };
  $('#main-nav').slicknav(options);
});

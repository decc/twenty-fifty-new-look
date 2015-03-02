//INTRO

$('.btn-start').click(function() {
  $('.start').addClass('hidden');
});

$('.btn-skip-guide').click(function() {
  $('.guide').addClass('hidden');
});

$('.btn-end-guide').click(function() {
  $('.guide').addClass('hidden');
});



//MAIN NAV

$('.main-nav li').click(function() {
  $('.content').addClass('hidden');
  $('.main-nav li').removeClass('active');
  $(this).addClass('active');
});

$('.main-nav li.energy').click(function() {
  $('.content').addClass('hidden');
  $('.energy').removeClass('hidden');
});

$('.main-nav li.electricity').click(function() {
  $('.content').addClass('hidden');
  $('.electricity').removeClass('hidden');
});

$('.main-nav li.emissions').click(function() {
  $('.content').addClass('hidden');
  $('.emissions').removeClass('hidden');
});

$('.main-nav li.flows').click(function() {
  $('.content').addClass('hidden');
  $('.flows').removeClass('hidden');
});

$('.main-nav li.map').click(function() {
  $('.content').addClass('hidden');
  $('.map').removeClass('hidden');
});

$('.main-nav li.air').click(function() {
  $('.content').addClass('hidden');
  $('.air').removeClass('hidden');
});

$('.main-nav li.security').click(function() {
  $('.content').addClass('hidden');
  $('.security').removeClass('hidden');
});

$('.main-nav li.costs').click(function() {
  $('.content').addClass('hidden');
  $('.costs').removeClass('hidden');
});

//OFF CANVAS MENU

$('.fa-navicon').click(function() {
  $('body').toggleClass('show-off-canvas-left');
  $('.navicon').toggleClass('fa-navicon');
  $('.navicon').toggleClass('fa-close');
});

//FULL SCREEN SLIDERS

$('.maximise-button').click(function() {
  $('body').toggleClass('show-off-canvas-right');
});

//CHANGE SLIDER CATEGORY

$('.slider-nav li').click(function() {
  $('.slider-nav li').removeClass('active');
  $(this).addClass('active'); 
});

$('.slider-nav li.demand').click(function() {
  $('.ranges-sml').addClass('hidden');
  $('.ranges.demand').removeClass('hidden');
});

$('.slider-nav li.supply').click(function() {
  $('.ranges-sml').addClass('hidden');
  $('.ranges.supply').removeClass('hidden');
});

$('.slider-nav li.other').click(function() {
  $('.ranges-sml').addClass('hidden');
  $('.ranges.other').removeClass('hidden');
});

//EDIT SLIDERS

$('.sliders .fa-pencil').click(function() {
  $('.slider').toggleClass('hidden');
  $(this).toggleClass('active');
});


//TOGGLE SHOW INFO

$('.btn-show-info').click(function() {
  $('.info-popup').toggleClass('hidden');
});

$('.btn-hide-info').click(function() {
  $('.info-popup').addClass('hidden');
});

//FINSHED

$('.finish').click(function() {
  $('.finished').toggleClass('hidden');
});

$('.not-finish').click(function() {
  $('.finished').removeClass('hidden');
});


//LANDSCAPE

$('.landscape').mousemove(function(e){
    var fgAmountMovedX = (e.pageX * -1 / 3);
    var fgAmountMovedY = (e.pageY * 1 / 6);
    //$('.level1').css('background-position', fgAmountMovedX + 'px ' + fgAmountMovedY + 'px');
    $('.level1').css('left', fgAmountMovedX + 'px ');
    //$('.level1').css('top', -fgAmountMovedY + 'px ');
    var mgAmountMovedX = (e.pageX * -1 / 6);
    //var mgAmountMovedY = (e.pageY * 1 / 12);
    $('.level2').css('left', mgAmountMovedX + 'px ');
    //$('.level2').css('top', -mgAmountMovedY + 'px ');
    var bgAmountMovedX = (e.pageX * -1 / 12);
    //var bgAmountMovedY = (e.pageY * 1 / 96);
    $('.level3').css('left', bgAmountMovedX + 'px ');
    //$('.level3').css('top', -bgAmountMovedY + 'px ');
    var farAmountMovedX = (e.pageX * -1 / 36);
    //var farAmountMovedY = (e.pageY * -1 / 48);
    $('.level4').css('left', farAmountMovedX + 'px ');
    //$('.level4').css('top', -fgAmountMovedY + 'px ');
});


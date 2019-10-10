// Load jQuery from NPM

import $ from 'jquery';
import '../stylesheets/styles.scss';
import 'bootstrap';
import 'simplelightbox';
import SmoothScroll from 'smooth-scroll';

const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
/* eslint no-underscore-dangle: 0 */
/* eslint-disable no-unused-vars */
window.jQuery = $;
window.$ = $;

$(document).ready(() => {
  function toggleDropdown(e) {
    const _d = $(e.target).closest('.dropdown');
    const _m = $('.dropdown-menu', _d);
    setTimeout(
      () => {
        const shouldOpen = e.type !== 'click' && _d.is(':hover');
        _m.toggleClass('show', shouldOpen);
        _d.toggleClass('show', shouldOpen);
        $('[data-toggle="dropdown"]', _d).attr('aria-expanded', shouldOpen);
      },
      e.type === 'mouseleave' ? 300 : 0,
    );
  }

  $('body')
    .on('mouseenter mouseleave', '.dropdown', toggleDropdown)
    .on('click', '.dropdown-menu a', toggleDropdown);

  const navbarDropdown = document.getElementById('navbarDropdown');
  navbarDropdown.addEventListener('focus', () => {
    navbarDropdown.style.color = 'black';
  });
  navbarDropdown.addEventListener('focusout', () => {
    navbarDropdown.style.color = '';
  });

  if ($('.filter a').length > 0) {
    const $images = $('.filter a');
    const $imagesIdeje = $('.gallery a');
    const $imagesIdejeGrouped = $imagesIdeje.filter('[data-group]');
    const $imagesIdejeAlone = $imagesIdeje.not($imagesIdejeGrouped);
    const $imagesGrouped = $images.filter('[data-group]');
    const $imagesAlone = $images.not($imagesGrouped);
    const params = {
      showCounter: false,
    };
    // Handle standalone images
    $imagesAlone.each((index, element) => {
      $(element).simpleLightbox(params);
    });
    $imagesIdejeAlone.each((index, element) => {
      $(element).simpleLightbox(params);
    });
    // Handle grouped imags
    if ($imagesGrouped.length > 0) {
      // Select all groups
      let groupNames = $imagesGrouped.map(function () {
        return $(this).data('group');
      }).get();
      groupNames = $.unique(groupNames);

      // Apply on each group
      $.each(groupNames, (key, value) => {
        $imagesGrouped.filter(function () {
          return $(this).data('group') === value;
        })
          .simpleLightbox(params);
      });
    }
  }
  $('.filter-button').click(function () {
    const value = $(this).attr('data-filter');
    console.log(value);
    if (value === '*') {
      $('.filter').fadeIn(1000);
    } else {
      $('.filter').not(value).fadeOut(1000);
      $('.filter').filter(value).fadeIn(2000);
    }
    if ($('.filter-button').removeClass('current')) {
      $(this).removeClass('current');
    }
    $(this).addClass('current');
  });
  const scroll = new SmoothScroll('[data-scroll]');
  const navFromTop = $('.navbar').offset().top;
  window.onscroll = function () {
    if (window.pageYOffset > navFromTop) {
      $('.navbar').addClass('sticky');
      $('.slider').css('margin-top', '120px');
      $('#idejeAjax').css('margin-top', '120px');
    } else {
      $('.navbar').removeClass('sticky');
      $('.slider').css('margin-top', '0px');
      $('#idejeAjax').css('margin-top', '0px');
    }
  };
  $('.ideje').on('click', function (e) {
    e.preventDefault();
    const url = this.href;
    $('.slider').remove();
    $('#idejeAjax').load(url).hide().fadeIn('slow');
  });
  mapboxgl.accessToken = 'pk.eyJ1IjoibmVuYWRkanVyaWNpYyIsImEiOiJjam4zODNiYzAwYTdtM3BvMmJ4MWtudGZ3In0.J8uoD1a0g6PpmB6WAH8mqA';
  const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-74.50, 40], 
    zoom: 9
  });
});

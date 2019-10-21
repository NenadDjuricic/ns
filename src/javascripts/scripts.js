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
  $('.ideje').on('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    $('.slider').css('display', 'none');
    $('#idejeAjax').show(1000);
  });
  $('.home').on('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    $('.slider').show(1000);
    $('#idejeAjax').css('display', 'none');
  });
  mapboxgl.accessToken = 'pk.eyJ1IjoibmVuYWRkanVyaWNpYyIsImEiOiJjam4zODNiYzAwYTdtM3BvMmJ4MWtudGZ3In0.J8uoD1a0g6PpmB6WAH8mqA';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [20.525984, 44.782180],
    zoom: 15,
  });
  map.on('load', () => {
    map.loadImage('https://img.icons8.com/plasticine/45/000000/marker.png', (error, image) => {
      if (error) throw error;
      map.addImage('mark', image);
      // Add a layer showing the places.
      map.addLayer({
        id: 'places',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {
                  description:
                  '<strong>NS STYLE</strong><p>RADNO VREME<br>Ponedeljak-Subota: 7:00-19:00 <br> Nedelja: 9:00-14:00</p>',
                },
                geometry: {
                  type: 'Point',
                  coordinates: [20.525984, 44.782180],
                },
              },
            ],
          },
        },
        layout: {
          'icon-image': 'mark',
          'icon-allow-overlap': true,
          'icon-size': 1,
          'icon-padding': 10,
        },


      });
    });
  });
  map.on('click', 'places', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const { description } = e.features[0].properties;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
  });
});

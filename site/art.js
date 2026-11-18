/* Crayon-style scene drawings for The Patient's Route.
   Plain inline SVG, drawn by hand in code. The "crayon" look comes from one SVG filter
   (wobbly edges plus waxy grain) defined in index.html as #crayon.
   No drawing on the shock scene or the death ending, on purpose. */
(function () {
  'use strict';
  var K = {
    ink: '#3A2A1A', sky: '#CFE3EF', night: '#3E4A78', nightG: '#4F6B3C', sun: '#F2B53A', grass: '#86AE58',
    wall: '#F6E3D0', roof: '#D4502A', wood: '#9A6440', white: '#FFFDF8', skin: '#C98B62', blue: '#5B86B8',
    pink: '#E58C7A', road: '#7A6E62', star: '#F6D36B', dawn: '#F7D9B9', glass: '#B9D5E6', grey: '#D9D2C5', city: '#7C84AE'
  };
  var S = ' stroke="' + K.ink + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';

  function bg(c) { return '<rect x="-8" y="-8" width="336" height="166" fill="' + c + '"/>'; }
  function ground(c, y) { y = y || 116; return '<path d="M-8 ' + y + 'Q80 ' + (y - 9) + ' 160 ' + (y - 1) + 'T328 ' + (y - 3) + 'V158H-8Z" fill="' + c + '"' + S + '/>'; }
  function road(y) {
    return '<path d="M-8 ' + y + 'H328V158H-8Z" fill="' + K.road + '"' + S + '/>' +
      '<path d="M6 ' + (y + 18) + 'H40M70 ' + (y + 18) + 'H104M134 ' + (y + 18) + 'H168M198 ' + (y + 18) + 'H232M262 ' + (y + 18) + 'H296" stroke="' + K.white + '" stroke-width="4" stroke-linecap="round"/>';
  }
  function moon(x, y, bgc) {
    return '<circle cx="' + x + '" cy="' + y + '" r="15" fill="' + K.white + '"/><circle cx="' + (x + 8) + '" cy="' + (y - 5) + '" r="13" fill="' + bgc + '"/>';
  }
  function stars(pts) {
    return pts.map(function (p) {
      var x = p[0], y = p[1];
      return '<path d="M' + x + ' ' + (y - 6) + 'L' + (x + 2) + ' ' + (y - 2) + 'L' + (x + 6) + ' ' + y + 'L' + (x + 2) + ' ' + (y + 2) + 'L' + x + ' ' + (y + 6) + 'L' + (x - 2) + ' ' + (y + 2) + 'L' + (x - 6) + ' ' + y + 'L' + (x - 2) + ' ' + (y - 2) + 'Z" fill="' + K.star + '"/>';
    }).join('');
  }
  function sun(x, y) {
    var r = '';
    for (var a = 0; a < 8; a++) {
      var t = a * Math.PI / 4, c = Math.cos(t), s = Math.sin(t);
      r += 'M' + (x + c * 24).toFixed(1) + ' ' + (y + s * 24).toFixed(1) + 'L' + (x + c * 33).toFixed(1) + ' ' + (y + s * 33).toFixed(1);
    }
    return '<path d="' + r + '" stroke="' + K.sun + '" stroke-width="4" stroke-linecap="round"/><circle cx="' + x + '" cy="' + y + '" r="17" fill="' + K.sun + '"' + S + '/>';
  }
  function house(x, y, lit, scale) {
    var k = scale || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')">' +
      '<rect x="0" y="30" width="70" height="48" fill="' + K.wall + '"' + S + '/>' +
      '<path d="M-8 32L35 0L78 32Z" fill="' + K.roof + '"' + S + '/>' +
      '<rect x="28" y="52" width="16" height="26" fill="' + K.wood + '"' + S + '/>' +
      '<rect x="8" y="42" width="14" height="13" fill="' + (lit ? K.sun : K.glass) + '"' + S + '/>' +
      '<rect x="50" y="42" width="14" height="13" fill="' + (lit ? K.sun : K.glass) + '"' + S + '/></g>';
  }
  function person(x, y, body, small) {
    var k = small ? 0.8 : 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')">' +
      '<path d="M-5 46V56M5 46V56" stroke="' + K.ink + '" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M-13 48L-9 18Q0 11 9 18L13 48Z" fill="' + body + '"' + S + '/>' +
      '<circle cx="0" cy="2" r="10" fill="' + K.skin + '"' + S + '/>' +
      '<circle cx="-3.5" cy="0" r="1.4" fill="' + K.ink + '"/><circle cx="3.5" cy="0" r="1.4" fill="' + K.ink + '"/>' +
      '<path d="M-3.5 5Q0 8 3.5 5" fill="none" stroke="' + K.ink + '" stroke-width="2" stroke-linecap="round"/></g>';
  }
  function cross(x, y, s, c) {
    var h = s / 2, w = s / 6;
    return '<path d="M' + (x - w) + ' ' + (y - h) + 'H' + (x + w) + 'V' + (y - w) + 'H' + (x + h) + 'V' + (y + w) + 'H' + (x + w) + 'V' + (y + h) + 'H' + (x - w) + 'V' + (y + w) + 'H' + (x - h) + 'V' + (y - w) + 'H' + (x - w) + 'Z" fill="' + (c || K.roof) + '"/>';
  }
  function wheel(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="8" fill="' + K.ink + '"/><circle cx="' + x + '" cy="' + y + '" r="3" fill="' + K.grey + '"/>'; }
  function ambulance(x, y, k) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + (k || 1) + ')">' +
      '<path d="M0 6H64V44H0Z" fill="' + K.white + '"' + S + '/>' +
      '<path d="M64 16H84L96 30V44H64Z" fill="' + K.white + '"' + S + '/>' +
      '<path d="M70 21H82L89 30H70Z" fill="' + K.glass + '"' + S + '/>' +
      cross(32, 25, 20) +
      '<path d="M0 36H96" stroke="' + K.roof + '" stroke-width="4"/>' +
      '<rect x="24" y="-3" width="14" height="9" rx="3" fill="' + K.blue + '"' + S + '/>' +
      '<path d="M18 -8L14 -13M44 -8L48 -13M31 -10V-16" stroke="' + K.sun + '" stroke-width="3" stroke-linecap="round"/>' +
      wheel(20, 46) + wheel(76, 46) + '</g>';
  }
  function car(x, y, c) {
    return '<g transform="translate(' + x + ' ' + y + ')">' +
      '<path d="M84 26L150 6L150 46L84 34Z" fill="' + K.sun + '" opacity=".45"/>' +
      '<path d="M0 26Q2 14 14 14L24 2H58L72 14Q84 15 86 26V36H0Z" fill="' + c + '"' + S + '/>' +
      '<path d="M28 6H42V14H20ZM46 6H56L66 14H46Z" fill="' + K.glass + '"' + S + '/>' +
      wheel(18, 38) + wheel(68, 38) + '</g>';
  }
  function hospital(x, y, w, h, wallc, lit) {
    var win = '', cols = Math.floor((w - 12) / 22), rows = Math.floor((h - 34) / 20);
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      win += '<rect x="' + (x + 10 + c * 22) + '" y="' + (y + 28 + r * 20) + '" width="12" height="11" fill="' + (lit ? K.sun : K.glass) + '"' + S.replace('3"', '2"') + '/>';
    }
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + (wallc || K.white) + '"' + S + '/>' +
      '<rect x="' + (x + w / 2 - 13) + '" y="' + (y - 22) + '" width="26" height="26" rx="5" fill="' + K.white + '"' + S + '/>' +
      cross(x + w / 2, y - 9, 18) + win;
  }
  function heart(x, y, k, c) {
    return '<path transform="translate(' + x + ' ' + y + ') scale(' + (k || 1) + ')" d="M0 12C-14 2-22-6-16-14C-11-20-3-18 0-11C3-18 11-20 16-14C22-6 14 2 0 12Z" fill="' + (c || K.roof) + '"' + S + '/>';
  }
  function ecg(x, y, w, c) {
    return '<path d="M' + x + ' ' + y + 'H' + (x + w * .3) + 'L' + (x + w * .38) + ' ' + (y - 8) + 'L' + (x + w * .46) + ' ' + (y + 14) + 'L' + (x + w * .54) + ' ' + (y - 26) + 'L' + (x + w * .62) + ' ' + (y + 6) + 'L' + (x + w * .7) + ' ' + y + 'H' + (x + w) + '" fill="none" stroke="' + (c || K.roof) + '" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>';
  }
  function phone(x, y, label, pin) {
    return '<g transform="translate(' + x + ' ' + y + ')"><rect x="0" y="0" width="42" height="72" rx="8" fill="' + K.ink + '"/>' +
      '<rect x="5" y="9" width="32" height="50" rx="3" fill="' + K.white + '"/>' +
      (pin ? '<path d="M21 56C13 46 12 42 12 38A9 9 0 0 1 30 38C30 42 29 46 21 56Z" fill="' + K.roof + '"' + S.replace('3"', '2"') + '/><circle cx="21" cy="38" r="3" fill="' + K.white + '"/>' : '') +
      '<text x="21" y="' + (pin ? 24 : 40) + '" text-anchor="middle" font-family="Mukta,sans-serif" font-weight="700" font-size="' + (pin ? 11 : 15) + '" fill="' + K.roof + '">' + label + '</text>' +
      '<path d="M50 14Q58 22 50 30M57 8Q70 22 57 36" fill="none" stroke="' + K.sun + '" stroke-width="3.5" stroke-linecap="round"/></g>';
  }

  var SCENES = {
    road: function () {
      return bg(K.sky) + sun(196, 30) + ground(K.grass, 104) + house(14, 34, false, 0.85) +
        '<path d="M86 118C140 100 190 130 246 112" fill="none" stroke="' + K.roof + '" stroke-width="4" stroke-dasharray="1 11" stroke-linecap="round"/>' +
        ambulance(124, 66, 0.62) + hospital(246, 58, 62, 64, K.white, false) +
        '<text x="112" y="40" text-anchor="middle" font-family="Mukta,sans-serif" font-weight="700" font-size="18" fill="' + K.ink + '">80 km</text>';
    },
    home_day: function () {
      return bg(K.sky) + sun(278, 32) + ground(K.grass) +
        '<circle cx="132" cy="128" r="4" fill="' + K.sun + '"/><circle cx="146" cy="134" r="4" fill="' + K.sun + '"/><circle cx="290" cy="130" r="4" fill="' + K.sun + '"/><circle cx="304" cy="124" r="4" fill="' + K.sun + '"/>' +
        house(28, 40) + person(186, 62, K.sun) + person(218, 64, K.pink) + person(248, 74, K.blue, true);
    },
    night_house: function () {
      return bg(K.night) + moon(262, 34, K.night) + stars([[40, 22], [120, 30], [196, 16], [300, 70], [88, 60]]) +
        ground(K.nightG) + house(110, 40, true);
    },
    ambulance: function () {
      return bg(K.night) + moon(282, 28, K.night) + stars([[150, 20], [220, 34], [100, 40]]) + road(108) +
        phone(18, 20, '108') + ambulance(150, 56);
    },
    car: function () {
      return bg(K.night) + moon(60, 30, K.night) + stars([[140, 18], [210, 30], [280, 22]]) + road(108) +
        house(10, 34, true, 0.8) + car(110, 70, K.sun);
    },
    centre: function () {
      return bg(K.night) + stars([[30, 24], [290, 30], [250, 14]]) + ground(K.nightG) +
        '<rect x="70" y="56" width="120" height="62" fill="' + K.white + '"' + S + '/>' +
        '<path d="M62 58H198V46H62Z" fill="' + K.roof + '"' + S + '/>' +
        '<rect x="80" y="70" width="22" height="18" fill="' + K.sun + '"' + S + '/><rect x="158" y="70" width="22" height="18" fill="' + K.sun + '"' + S + '/>' +
        '<rect x="118" y="84" width="24" height="34" fill="' + K.wood + '"' + S + '/>' + cross(130, 70, 16) +
        ecg(200, 40, 110, K.star);
    },
    tele: function () {
      return bg(K.night) + stars([[160, 20], [30, 22], [300, 18]]) + ground(K.nightG) +
        '<rect x="14" y="72" width="80" height="46" fill="' + K.white + '"' + S + '/>' + cross(54, 90, 16) +
        '<path d="M8 74H100V62H8Z" fill="' + K.roof + '"' + S + '/>' +
        hospital(220, 52, 86, 66, K.white, true) +
        '<path d="M96 60Q160 0 218 46" fill="none" stroke="' + K.star + '" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>' +
        ecg(128, 44, 60, K.star);
    },
    hospital: function () {
      return bg(K.night) + moon(42, 30, K.night) + stars([[110, 20], [280, 26]]) + ground(K.nightG) +
        hospital(120, 46, 110, 72, K.white, true) + ambulance(236, 86, 0.5);
    },
    city: function () {
      return bg(K.night) + moon(296, 24, K.night) + stars([[150, 14], [230, 22]]) +
        '<path d="M-8 120V80H4V72H14V80H28V72H38V80H52V66H60V58H70V66H78V80H92V72H102V80H116V120Z" fill="#E2C68E"' + S + '/>' +
        '<path d="M58 66Q65 50 72 66M8 120V104Q16 94 24 104V120M80 120V104Q88 94 96 104V120" fill="' + K.night + '"' + S + '/>' +
        '<rect x="128" y="52" width="34" height="68" fill="' + K.city + '"' + S + '/><rect x="250" y="62" width="40" height="58" fill="' + K.city + '"' + S + '/>' +
        hospital(168, 46, 76, 74, K.white, true) + road(118);
    },
    morning: function () {
      return bg(K.dawn) + '<circle cx="250" cy="112" r="34" fill="' + K.sun + '"' + S + '/>' + ground(K.grass) +
        '<path d="M60 28q6-6 12 0q6-6 12 0M110 44q5-5 10 0q5-5 10 0" fill="none" stroke="' + K.ink + '" stroke-width="2.5" stroke-linecap="round"/>' +
        house(70, 40);
    },
    two_hosp: function () {
      return bg(K.sky) + sun(40, 30) + ground(K.grass) +
        hospital(90, 50, 92, 68, K.grey, false) + hospital(200, 40, 92, 78, K.glass, false);
    },
    home_again: function () {
      return bg(K.sky) + sun(276, 32) + ground(K.grass) + house(26, 40) +
        '<path d="M150 78L138 62M234 88L246 72" stroke="' + K.ink + '" stroke-width="3.5" stroke-linecap="round"/>' +
        person(160, 62, K.sun) + person(192, 64, K.pink) + person(222, 74, K.blue, true) +
        heart(192, 30, 0.8);
    },
    phone: function () {
      return bg(K.night) + moon(270, 30, K.night) + stars([[200, 20], [40, 26], [130, 18]]) + ground(K.nightG) +
        house(20, 44, true, 0.85) + phone(150, 34, '112', true);
    },
    map: function () {
      return bg('#E8F0D8') +
        '<path d="M-8 40H328M-8 100H328M80 -8V158M220 -8V158" stroke="' + K.white + '" stroke-width="10"/>' +
        '<path d="M40 120C80 120 80 70 140 70S210 30 276 34" fill="none" stroke="' + K.roof + '" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/>' +
        '<path d="M276 46C266 34 265 30 265 25A11 11 0 0 1 287 25C287 30 286 34 276 46Z" fill="' + K.roof + '"' + S + '/><circle cx="276" cy="25" r="4" fill="' + K.white + '"/>' +
        house(14, 92, false, 0.5) + ambulance(118, 46, 0.5);
    },
    heart: function () {
      return bg(K.sky) + ground(K.grass) + heart(160, 72, 2.2) +
        '<circle cx="250" cy="44" r="22" fill="' + K.white + '"' + S + '/><path d="M250 30V44L260 50" fill="none" stroke="' + K.ink + '" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M60 110l6-12 6 12M84 112l6-12 6 12" fill="none" stroke="' + K.sun + '" stroke-width="3" stroke-linecap="round"/>';
    },
    together: function () {
      return bg(K.sky) + sun(40, 30) + ground(K.grass) +
        person(88, 62, K.blue) + person(136, 60, K.roof) + person(184, 62, K.sun) + person(232, 64, K.pink) +
        '<path d="M100 92H124M148 92H172M196 92H220" stroke="' + K.ink + '" stroke-width="3.5" stroke-linecap="round"/>' +
        heart(160, 26, 0.7);
    }
  };

  var NODE = {
    card: 'home_day', symptoms: 'night_house', amb108: 'ambulance', neighbour: 'car', chc: 'centre',
    dh_early: 'hospital', dh_neighbour: 'hospital', dh_late: 'hospital', gwalior_pci: 'city', gwalior_car: 'city',
    wait: 'morning', gwalior_hospital: 'two_hosp'
  };
  var BETTER = ['phone', 'map', 'tele', 'centre', 'city'];

  function draw(key) {
    var f = SCENES[key];
    if (!f) return '';
    return '<svg class="art" viewBox="0 0 320 150" aria-hidden="true" focusable="false"><g filter="url(#crayon)">' + f() + '</g></svg>';
  }
  window.CrayonArt = {
    node: function (id) { return draw(NODE[id]); },
    ending: function (path) { return path === 'death' ? '' : draw('home_again'); },
    better: function (i) { return i === 0 ? draw('night_house') : draw(BETTER[i - 1]); },
    start: function () { return draw('road'); },
    lessons: function () { return draw('heart'); },
    playbook: function () { return draw('together'); }
  };
})();

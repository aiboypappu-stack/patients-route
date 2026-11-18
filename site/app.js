/* The Patient's Route · इलाज तक का सफ़र
   Vanilla JS, no build step. All story text comes from journey.json.
   UI text added by this file lives in the `ui` dictionary below. */
(function () {
  'use strict';

  // ---------- UI text (both languages) ----------
  var ui = {
    chooseLang: { en: 'Choose your language', hi: 'अपनी भाषा चुनें' },
    begin: { en: 'Begin', hi: 'शुरू करें' },
    skip: { en: 'Skip to story', hi: 'कहानी पर जाएँ' },
    langGroup: { en: 'Language', hi: 'भाषा' },
    emergencyFoot: { en: 'Emergency: 108', hi: 'आपातकाल: 108' },
    footPlaybook: { en: 'Who can change this', hi: 'कौन बदल सकता है' },
    footSources: { en: 'Sources', hi: 'स्रोत' },
    footStart: { en: 'Start over', hi: 'शुरू से' },
    startOver: { en: 'Start over', hi: 'शुरू से' },
    tryAgain: { en: 'Try a different route', hi: 'दूसरा रास्ता आज़माएँ' },
    share: { en: 'Share', hi: 'शेयर करें' },
    shareWa: { en: 'Share on WhatsApp', hi: 'WhatsApp पर भेजें' },
    copyLink: { en: 'Copy link', hi: 'लिंक कॉपी करें' },
    copied: { en: 'Link copied.', hi: 'लिंक कॉपी हो गया।' },
    copyFail: { en: 'Could not copy. Press and hold the address bar to copy the link.', hi: 'कॉपी नहीं हो पाया। लिंक कॉपी करने के लिए ऊपर पता वाली पट्टी को दबाकर रखें।' },
    moreShare: { en: 'More ways to share', hi: 'और तरीक़ों से भेजें' },
    clockAria: { en: 'Time since the pain began', hi: 'दर्द शुरू हुए कितना समय हुआ' },
    hShort: { en: 'h', hi: 'घं' },
    reported: { en: 'Reported cases (single news reports)', hi: 'ख़बरों में आए मामले (अलग-अलग ख़बरें)' },
    caveat: { en: 'Please note', hi: 'ध्यान दें' },
    ghTitle: { en: 'Extra lives saved for every 1,000 people given the clot-dissolving drug, by hours after the pain began', hi: 'थक्का घोलने वाली दवा दर्द शुरू होने के कितने घंटे बाद मिली, उसके हिसाब से हर 1,000 में बची अतिरिक्त जानें' },
    ghHere: { en: 'Ramesh is here', hi: 'रमेश यहाँ है' },
    ghSource: { en: 'Sources', hi: 'स्रोत' },
    refAria: { en: 'Source', hi: 'स्रोत' },
    sourceOf: { en: 'Source', hi: 'स्रोत' },
    openSource: { en: 'Open the source', hi: 'स्रोत खोलें' },
    noLink: { en: 'No link. This is our own estimate.', hi: 'कोई लिंक नहीं। यह हमारा अपना अनुमान है।' },
    close: { en: 'Close', hi: 'बंद करें' },
    ourEstimate: { en: 'Our estimate', hi: 'हमारा अनुमान' },
    fixesTitle: { en: 'What could change this step?', hi: 'यह क़दम कैसे बदल सकता है?' },
    whoCanAct: { en: 'Who can act', hi: 'कौन कर सकता है' },
    gridAria: { en: 'Out of 100 figures, {n} are filled in.', hi: '100 में से {n} आकृतियाँ भरी हुई हैं।' },
    turning: { en: 'Where the night could have turned', hi: 'जहाँ रात का रुख़ बदल सकता था' },
    costTitle: { en: 'What it costs the family', hi: 'परिवार का ख़र्च' },
    sc_card_government: { en: 'With an Ayushman card, government hospital', hi: 'आयुष्मान कार्ड के साथ, सरकारी अस्पताल' },
    sc_card_private: { en: 'With an Ayushman card, private hospital', hi: 'आयुष्मान कार्ड के साथ, निजी अस्पताल' },
    sc_nocard_government: { en: 'Without a card, government hospital', hi: 'बिना कार्ड के, सरकारी अस्पताल' },
    sc_nocard_private: { en: 'Without a card, private hospital', hi: 'बिना कार्ड के, निजी अस्पताल' },
    total: { en: 'Total', hi: 'कुल' },
    to: { en: 'to', hi: 'से' },
    lakh: { en: 'lakh', hi: 'लाख' },
    wageDays: { en: 'That is up to {n} days of work at the minimum wage.', hi: 'यह न्यूनतम मज़दूरी पर {n} दिन तक की कमाई है।' },
    yourRoute: { en: 'Your route', hi: 'आपका रास्ता' },
    before: { en: 'Before', hi: 'पहले' },
    illustrative: { en: 'Illustrative', hi: 'उदाहरण के लिए' },
    next: { en: 'Next', hi: 'आगे' },
    seeCompare: { en: 'Compare with your route', hi: 'अपने रास्ते से तुलना करें' },
    stepOf: { en: 'Step {i} of {n}', hi: 'क़दम {i} / {n}' },
    compareTitle: { en: 'Your night and the better system', hi: 'आपकी रात और बेहतर व्यवस्था' },
    colYours: { en: 'Your route', hi: 'आपका रास्ता' },
    colBetter: { en: 'Better system', hi: 'बेहतर व्यवस्था' },
    rowTreat: { en: 'Treatment to open the blocked artery began', hi: 'बंद नस खोलने का इलाज कब शुरू हुआ' },
    rowEnd: { en: 'How the night ended', hi: 'रात कैसे ख़त्म हुई' },
    never: { en: 'Never', hi: 'कभी नहीं' },
    noRun: { en: 'Play the story first to compare.', hi: 'तुलना के लिए पहले कहानी खेलें।' },
    injection: { en: 'Clot-dissolving injection', hi: 'थक्का घोलने वाला इंजेक्शन' },
    angioplasty: { en: 'Angioplasty', hi: 'एंजियोप्लास्टी' },
    approx: { en: 'about', hi: 'लगभग' },
    afterPain: { en: '{t} after the pain began', hi: 'दर्द शुरू होने के {t} बाद' },
    sincePain: { en: '{t} since the pain began', hi: 'दर्द शुरू हुए {t}' },
    atStart: { en: 'The pain has just begun', hi: 'दर्द अभी शुरू हुआ है' },
    hours: { en: '{h} h', hi: '{h} घंटे' },
    mins: { en: '{m} min', hi: '{m} मिनट' },
    legendYours: { en: 'Your route', hi: 'आपका रास्ता' },
    legendBetter: { en: 'Better system', hi: 'बेहतर व्यवस्था' },
    backEnding: { en: 'Back to your ending', hi: 'अपने अंत पर लौटें' },
    toLessons: { en: 'Five things to remember', hi: 'याद रखने की पाँच बातें' },
    toPlaybook: { en: "Who can change Ramesh's route", hi: 'रमेश का रास्ता कौन बदल सकता है' },
    toSources: { en: 'All sources', hi: 'सभी स्रोत' },
    shareAct: { en: 'Share this with someone who can act', hi: 'जो बदल सकते हैं उन्हें भेजें' },
    sourcesTitle: { en: 'Sources', hi: 'स्रोत' },
    sourcesIntro: { en: 'Every number in the story links to one of these. Links open the original source.', hi: 'कहानी का हर आँकड़ा इनमें से किसी स्रोत से जुड़ा है। लिंक पर टैप करके असली स्रोत देखें।' },
    g_C: { en: 'Clinical', hi: 'इलाज और चिकित्सा' },
    g_T: { en: 'Access and travel', hi: 'पहुँच और सफ़र' },
    g_F: { en: 'Costs', hi: 'ख़र्च' },
    g_P: { en: 'Policy and programmes', hi: 'नीतियाँ और कार्यक्रम' },
    g_E: { en: 'Estimate', hi: 'अनुमान' },
    backStory: { en: 'Back', hi: 'पीछे जाएँ' },
    errTitle: { en: 'The story could not load. Check your internet and try again.', hi: 'कहानी लोड नहीं हो पाई। इंटरनेट देखकर फिर से कोशिश करें।' },
    retry: { en: 'Try again', hi: 'फिर से कोशिश करें' },
    loading: { en: 'Loading the story', hi: 'कहानी लोड हो रही है' }
  };

  var GH = [ // Boersma 1996 (C17) and FTT (C16). Lives saved per 1,000 treated.
    { label: '0-1', v: 65 }, { label: '1-2', v: 37 }, { label: '2-3', v: 26 }, { label: '3-6', v: 29 }, { label: '7-12', v: 20 }
  ];
  var BETTER_TREAT_STEP = 3; // better_route.steps[3]: injection at the centre (clock 70 min)
  var BAND_COLORS = ['var(--b0)', 'var(--b1)', 'var(--b2)', 'var(--b3)', 'var(--b4)'];
  var BANDS = [[0, 60], [60, 120], [120, 180], [180, 360], [360, 480]];
  var CLOCK_MAX = 480;

  // ---------- state ----------
  var J = null;
  var lang = 'hi';
  var S = freshState();
  var lastClock = null;
  var refMap = {};
  var refCount = 0;
  var $screen = document.getElementById('screen');
  var sheet = document.getElementById('sheet');
  var sheetOpener = null;

  function freshState(keepCard) {
    return { screen: { t: 'start' }, card: keepCard, hospital: null, path: null, trail: [], ended: null };
  }
  function T(o) { return o == null ? '' : (typeof o === 'string' ? o : (o[lang] != null ? o[lang] : o.en)); }
  function U(k, vars) {
    var s = T(ui[k]);
    if (vars) for (var v in vars) s = s.split('{' + v + '}').join(vars[v]);
    return s;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function paras(s) {
    return String(s).split(/\n\n+/).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
  }

  // ---------- URL and history ----------
  function baseUrl() { return location.origin + location.pathname; }
  function urlFor(screen, l) {
    var u = '?lang=' + (l || lang);
    if (screen && screen.t === 'playbook') u += '#playbook';
    if (screen && screen.t === 'sources') u += '#sources';
    return u;
  }
  function shareUrl(withHash) { return baseUrl() + '?lang=' + lang + (withHash || ''); }
  function snapshot() { return JSON.parse(JSON.stringify({ s: S, lang: lang })); }
  function go(screen, mutate) {
    if (mutate) mutate(S);
    S.screen = screen;
    history.pushState(snapshot(), '', urlFor(screen));
    render(true);
  }
  window.addEventListener('popstate', function (e) {
    closeSheet();
    if (e.state && e.state.s) {
      S = e.state.s;
      if (e.state.lang && e.state.lang !== lang) setLang(e.state.lang, true);
      render(true);
    } else {
      var q = readQuery();
      if (!q.lang) { S = freshState(); S.screen = { t: 'lang' }; render(true); }
      else { setLang(q.lang, true); S = freshState(); if (q.hash) S.screen = { t: q.hash }; render(true); }
    }
  });
  function readQuery() {
    var m = /[?&]lang=(hi|en)\b/.exec(location.search);
    var h = location.hash.replace('#', '');
    return { lang: m ? m[1] : null, hash: (h === 'playbook' || h === 'sources') ? h : null };
  }

  // ---------- language ----------
  function setLang(l, silent) {
    lang = l === 'en' ? 'en' : 'hi';
    document.documentElement.lang = lang;
    document.title = J ? (T(J.meta.title) + ' · ' + (lang === 'hi' ? J.meta.title.en : J.meta.title.hi)) : document.title;
    var tg = document.getElementById('langtoggle');
    tg.hidden = false;
    tg.setAttribute('aria-label', U('langGroup'));
    Array.prototype.forEach.call(tg.querySelectorAll('button'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    if (J) document.getElementById('brand').textContent = T(J.meta.title);
    document.getElementById('skip').textContent = U('skip');
    document.getElementById('sheet-close').textContent = U('close');
    renderFooter();
    if (!silent) {
      history.replaceState(snapshot(), '', urlFor(S.screen));
    }
  }
  document.getElementById('langtoggle').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-lang]');
    if (!b || b.getAttribute('data-lang') === lang) return;
    setLang(b.getAttribute('data-lang'));
    lastClock = null;
    render(false);
  });

  // ---------- footer ----------
  function renderFooter() {
    var f = document.querySelector('#foot .foot-in');
    f.innerHTML =
      '<a class="foot-emerg" href="tel:108">' + esc(U('emergencyFoot')) + '</a>' +
      (J ? '<a href="' + urlFor({ t: 'playbook' }) + '" data-go="playbook">' + esc(U('footPlaybook')) + '</a>' +
        '<a href="' + urlFor({ t: 'sources' }) + '" data-go="sources">' + esc(U('footSources')) + '</a>' +
        '<a href="' + urlFor({ t: 'start' }) + '" data-go="restart">' + esc(U('footStart')) + '</a>' : '');
  }
  document.getElementById('foot').addEventListener('click', function (e) {
    var a = e.target.closest('[data-go]');
    if (!a || !J) return;
    e.preventDefault();
    var g = a.getAttribute('data-go');
    if (g === 'restart') go({ t: 'start' }, function (s) { var n = freshState(); for (var k in n) s[k] = n[k]; });
    else go({ t: g });
  });

  // ---------- refs and source sheet ----------
  function refsHtml(refs) {
    if (!refs || !refs.length) return '';
    return '<span class="refs">' + refs.map(function (id) {
      if (id === 'ASSUMPTION') {
        return '<button type="button" class="ref est" data-ref="' + id + '">' + esc(U('ourEstimate')) + '</button>';
      }
      if (!refMap[id]) refMap[id] = ++refCount;
      return '<button type="button" class="ref" data-ref="' + id + '" aria-label="' + esc(U('refAria') + ' ' + refMap[id] + ', ' + id) + '">' + refMap[id] + '</button>';
    }).join('') + '</span>';
  }
  function openSheet(id, opener) {
    var s = J.sources[id];
    if (!s) return;
    sheetOpener = opener || null;
    document.getElementById('sheet-title').textContent = id === 'ASSUMPTION' ? U('ourEstimate') : U('sourceOf') + ' ' + id;
    document.getElementById('sheet-cite').textContent = s.cite;
    document.getElementById('sheet-period').textContent = s.period || '';
    var a = document.getElementById('sheet-link');
    if (s.url) {
      a.href = s.url; a.textContent = U('openSource');
      a.setAttribute('aria-label', U('openSource') + ': ' + s.url.replace(/^https?:\/\//, '').split('/')[0]);
      a.parentNode.hidden = false;
    } else {
      a.parentNode.hidden = false; a.removeAttribute('href'); a.removeAttribute('aria-label'); a.textContent = U('noLink');
    }
    if (typeof sheet.showModal === 'function') { if (!sheet.open) sheet.showModal(); }
    else sheet.setAttribute('open', '');
    document.getElementById('sheet-close').focus();
  }
  function closeSheet() {
    if (!sheet.open) return;
    if (typeof sheet.close === 'function') sheet.close(); else sheet.removeAttribute('open');
  }
  sheet.addEventListener('close', function () {
    if (sheetOpener && document.body.contains(sheetOpener)) sheetOpener.focus();
    sheetOpener = null;
  });
  document.getElementById('sheet-close').addEventListener('click', closeSheet);
  sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
  sheet.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); closeSheet(); return; }
    if (e.key !== 'Tab') return;
    var f = Array.prototype.filter.call(sheet.querySelectorAll('a[href],button'), function (x) { return x.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // ---------- small helpers ----------
  function art(kind, arg) {
    var A = window.CrayonArt;
    try { return A && A[kind] ? A[kind](arg) : ''; } catch (e) { return ''; }
  }
  function duration(min) {
    var h = Math.floor(min / 60), m = min % 60, parts = [];
    if (h) parts.push(U('hours', { h: h }));
    if (m || !h) parts.push(U('mins', { m: m }));
    return parts.join(' ');
  }
  function clockHtml(min, label, alt) {
    var bands = BANDS.map(function (b, i) {
      return '<span style="width:' + ((b[1] - b[0]) / CLOCK_MAX * 100) + '%;background:' + BAND_COLORS[i] + '"></span>';
    }).join('');
    var ticks = [0, 1, 2, 3, 6, 8].map(function (h) {
      return '<span style="left:' + (h * 60 / CLOCK_MAX * 100) + '%">' + h + ' ' + esc(U('hShort')) + '</span>';
    }).join('');
    var since = min === 0 ? U('atStart') : U('sincePain', { t: duration(min) });
    var start = lastClock == null ? min : lastClock;
    var markers = '<span class="clock-marker" data-to="' + pct(min) + '" style="left:' + pct(start) + '%"></span>';
    if (alt != null) markers += '<span class="clock-marker alt" style="left:' + pct(alt) + '%"></span>';
    return '<div class="clock" role="group" aria-label="' + esc(U('clockAria')) + '">' +
      '<div class="clock-top"><span class="clock-time">' + esc(T(label)) + '</span><span class="clock-since">' + esc(since) + '</span></div>' +
      '<div class="clock-bar" aria-hidden="true">' + bands + '</div>' +
      '<div class="clock-track" aria-hidden="true">' + markers + '</div>' +
      '<div class="clock-ticks" aria-hidden="true">' + ticks + '</div></div>';
  }
  function pct(min) { return Math.max(0, Math.min(100, min / CLOCK_MAX * 100)); }
  function animateMarkers() {
    var ms = $screen.querySelectorAll('.clock-marker[data-to]');
    if (!ms.length) return;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        Array.prototype.forEach.call(ms, function (m) { m.style.left = m.getAttribute('data-to') + '%'; });
      });
    });
  }
  function ghBand(min) {
    if (min < 60) return 0; if (min < 120) return 1; if (min < 180) return 2; if (min <= 360) return 3; if (min >= 420) return 4; return -1;
  }
  function ghHtml(min) {
    var here = min == null ? -1 : ghBand(min);
    var rows = GH.map(function (b, i) {
      var on = i === here;
      return '<div class="gh-row' + (on ? ' here' : '') + '"><span>' + b.label + ' ' + esc(U('hShort')) + '</span>' +
        '<span class="bar" style="width:' + (b.v / 65 * 100) + '%"></span><span>' + b.v + '</span>' +
        (on ? '<span class="gh-here">' + esc(U('ghHere')) + '</span>' : '') + '</div>';
    }).join('');
    return '<div class="gh"><div class="gh-title">' + esc(U('ghTitle')) + ' ' + refsHtml(['C17', 'C16']) + '</div>' +
      '<div role="list">' + rows.replace(/<div class="gh-row/g, '<div role="listitem" class="gh-row') + '</div></div>';
  }
  var ICON = {
    info: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="9" y="8.5" width="2" height="6" rx="1" fill="currentColor"/><circle cx="10" cy="5.8" r="1.2" fill="currentColor"/></svg>',
    news: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="3.5" width="15" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5.5 7.5h9M5.5 10.5h9M5.5 13.5h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    government: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 7.5 10 3l8 4.5z" fill="currentColor"/><path d="M4 9v6M8 9v6M12 9v6M16 9v6" stroke="currentColor" stroke-width="1.8"/><rect x="2" y="15.5" width="16" height="2" fill="currentColor"/></svg>',
    hospitals: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 6.5v7M6.5 10h7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    private: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><rect x="5.5" y="2" width="9" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 11h1.5l1-2.5 1.5 5 1-2.5H13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    community: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><circle cx="6.5" cy="6.5" r="2.5" fill="currentColor"/><circle cx="13.5" cy="6.5" r="2.5" fill="currentColor"/><path d="M2 16c0-3 2-5 4.5-5S11 13 11 16zM9 16c0-3 2-5 4.5-5S18 13 18 16z" fill="currentColor"/></svg>'
  };
  function actorChip(a) {
    return '<span class="actor ' + a + '">' + (ICON[a] || '') + esc(T(J.actors[a])) + '</span>';
  }
  function factHtml(f, min) {
    var cls = 'card fact', tag = '';
    if (f.kind === 'caveat') { cls += ' caveat'; tag = '<div class="tag">' + ICON.info + esc(U('caveat')) + '</div>'; }
    if (f.kind === 'reported_cases') { cls += ' reported'; tag = '<div class="tag">' + ICON.news + esc(U('reported')) + '</div>'; }
    var body = tag + '<p>' + esc(T(f)) + ' ' + refsHtml(f.refs) + '</p>';
    if (f.kind === 'golden_hour') body += ghHtml(min);
    return '<div class="' + cls + '">' + body + '</div>';
  }
  function fixesFor(id) {
    var v = J.system_fixes && J.system_fixes[id];
    if (typeof v === 'string') v = J.system_fixes[v];
    return Array.isArray(v) ? v : null;
  }
  function fixesHtml(id, forceOpen) {
    var cards = fixesFor(id);
    if (!cards) return '';
    var open = forceOpen || ssGet('fixesOpen') === '1';
    return '<details class="fixes" data-fixes' + (forceOpen ? ' data-force' : '') + (open ? ' open' : '') + '><summary>' + esc(U('fixesTitle')) + '</summary><div class="fixes-body">' +
      cards.map(function (c) {
        return '<div class="fix"><h3>' + esc(T(c.title)) + '</h3><p>' + esc(T(c.text)) + ' ' + refsHtml(c.refs) + '</p>' +
          '<div class="actors" aria-label="' + esc(U('whoCanAct')) + '">' + (c.actors || []).map(actorChip).join('') + '</div></div>';
      }).join('') + '</div></details>';
  }
  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  $screen.addEventListener('toggle', function (e) {
    var d = e.target;
    if (d && d.matches && d.matches('details[data-fixes]') && !d.hasAttribute('data-force')) ssSet('fixesOpen', d.open ? '1' : '0');
  }, true);

  function inr(v) {
    if (v >= 100000) {
      var l = (Math.round(v / 1000) / 100).toFixed(2).replace(/\.?0+$/, '');
      return '₹' + l + ' ' + U('lakh');
    }
    return '₹' + v.toLocaleString('en-IN');
  }
  function range(min, max) {
    if (min === max) return inr(min);
    return inr(min) + ' ' + U('to') + ' ' + inr(max);
  }

  function shareHtml(hash, text) {
    var url = shareUrl(hash || '');
    var wa = 'https://wa.me/?text=' + encodeURIComponent((text || T(J.share)) + ' ' + url);
    return '<div class="share"><h2 class="h2">' + esc(U('share')) + '</h2><div class="stack">' +
      '<a class="btn btn-quiet" href="' + esc(wa) + '" target="_blank" rel="noopener noreferrer">' + esc(U('shareWa')) + '</a>' +
      '<button type="button" class="btn btn-quiet" data-act="copy" data-url="' + esc(url) + '">' + esc(U('copyLink')) + '</button>' +
      (navigator.share ? '<button type="button" class="btn btn-quiet" data-act="native" data-url="' + esc(url) + '" data-text="' + esc(text || T(J.share)) + '">' + esc(U('moreShare')) + '</button>' : '') +
      '</div><p class="status" role="status"></p></div>';
  }
  function copyText(s, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(s).then(function () { done(true); }, function () { done(fallbackCopy(s)); });
    } else done(fallbackCopy(s));
  }
  function fallbackCopy(s) {
    var t = document.createElement('textarea');
    t.value = s; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select();
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(t); return ok;
  }

  // ---------- screens ----------
  function render(isNav) {
    refMap = {}; refCount = 0;
    var sc = S.screen || { t: 'start' };
    var html = '';
    if (sc.t === 'lang') html = langScreen();
    else if (sc.t === 'start') html = startScreen();
    else if (sc.t === 'node') html = nodeScreen(sc.id);
    else if (sc.t === 'ending') html = endingScreen();
    else if (sc.t === 'lessons') html = lessonsScreen();
    else if (sc.t === 'better') html = betterScreen(sc.i || 0);
    else if (sc.t === 'playbook') html = playbookScreen();
    else if (sc.t === 'sources') html = sourcesScreen();
    else html = startScreen();
    $screen.innerHTML = html;
    document.getElementById('langtoggle').hidden = sc.t === 'lang';
    if (isNav) {
      $screen.classList.remove('enter'); void $screen.offsetWidth; $screen.classList.add('enter');
      window.scrollTo(0, 0);
      var h = $screen.querySelector('h1,h2');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
    animateMarkers();
    var c = $screen.querySelector('.clock-marker[data-to]');
    lastClock = c ? currentClock() : null;
  }
  function currentClock() {
    var sc = S.screen;
    if (sc.t === 'node') return J.nodes[sc.id].clock_min;
    if (sc.t === 'better') { var st = J.better_route.steps[(sc.i || 0) - 1]; return st ? st.clock_min : null; }
    return null;
  }

  function langScreen() {
    var nav = (navigator.language || '').toLowerCase().indexOf('hi') === 0 ? 'hi' : 'en';
    return '<section class="langpick"><h1 class="bigtitle"><span lang="hi">' + esc(J.meta.title.hi) + '</span><span class="sub" lang="en">' + esc(J.meta.title.en) + '</span></h1>' +
      '<p class="lead"><span lang="hi">' + esc(ui.chooseLang.hi) + '</span> · <span lang="en">' + esc(ui.chooseLang.en) + '</span></p><div class="stack">' +
      ['hi', 'en'].map(function (l) {
        return '<button type="button" class="btn btn-lang' + (l === nav ? ' suggested' : '') + '" lang="' + l + '" data-act="lang" data-lang="' + l + '">' + (l === 'hi' ? 'हिंदी' : 'English') + '</button>';
      }).join('') + '</div></section>';
  }

  function emergencyHtml() {
    var t = esc(T(J.meta.emergency));
    t = t.replace(/108/, '<a href="tel:108">108</a>').replace(/112/, '<a href="tel:112">112</a>');
    return '<div class="emergency" role="note">' + t + '</div>';
  }

  function startScreen() {
    var m = J.meta;
    return emergencyHtml() +
      '<h1 class="bigtitle">' + esc(T(m.title)) + '</h1>' + art('start') +
      '<p class="lead">' + esc(T(m.subtitle)) + '</p>' +
      '<p class="byline">' + esc(T(m.byline)) + '</p>' +
      '<div class="card"><p>' + esc(T(m.fiction_note)) + '</p></div>' +
      '<p class="muted small">' + esc(T(m.disclaimer)) + '</p>' +
      '<div class="stack"><button type="button" class="btn btn-primary" data-act="begin">' + esc(U('begin')) + '</button></div>';
  }

  function nodeScreen(id) {
    var n = J.nodes[id];
    if (!n) return startScreen();
    var h = '';
    if (n.clock_min != null) h += clockHtml(n.clock_min, n.clock_label);
    h += art('node', id);
    h += '<h2 class="scene">' + esc(T(n.scene)) + '</h2><div class="prose">' + paras(T(n.text)) + '</div>';
    (n.facts || []).forEach(function (f) { h += factHtml(f, n.clock_min); });
    h += '<div class="stack">' + n.choices.map(function (c, i) {
      return '<button type="button" class="btn btn-choice" data-act="choose" data-i="' + i + '"><span>' + esc(T(c.label)) + '</span></button>';
    }).join('') + '</div>';
    h += fixesHtml(id);
    return h;
  }

  function choose(i) {
    var id = S.screen.id, n = J.nodes[id], c = n.choices[i];
    if (!c) return;
    go(c.next === 'ending' ? { t: 'ending' } : { t: 'node', id: c.next }, function (s) {
      s.trail.push({ node: id, i: i });
      var set = c.set || {};
      for (var k in set) if (k === 'card' || k === 'hospital' || k === 'path') s[k] = set[k];
      if (c.next === 'ending') s.ended = s.path;
    });
  }

  function personGrid(n) {
    var out = '<svg class="grid100" viewBox="0 0 300 330" role="img" aria-label="' + esc(U('gridAria', { n: n })) + '"><defs><g id="pp"><circle cx="10" cy="6" r="4.6"/><path d="M3.5 28V17a6.5 6.5 0 0 1 13 0v11z"/></g></defs>';
    for (var k = 0; k < 100; k++) {
      var x = (k % 10) * 30 + 5, y = Math.floor(k / 10) * 33 + 1;
      out += k < n
        ? '<use href="#pp" x="' + x + '" y="' + y + '" fill="#D4502A"/>'
        : '<use href="#pp" x="' + x + '" y="' + y + '" fill="none" stroke="#5C5145" stroke-width="1.4"/>';
    }
    return out + '</svg>';
  }
  function scenarioKey() { return (S.card ? 'card' : 'nocard') + '_' + S.hospital; }
  function costHtml() {
    var key = scenarioKey(), lines = J.costs.scenarios[key];
    if (!lines) return '';
    var min = 0, max = 0;
    var rows = lines.map(function (k) {
      var l = J.costs.lines[k];
      min += l.min; max += l.max;
      return '<div class="cost-row" data-line="' + k + '" data-min="' + l.min + '" data-max="' + l.max + '"><div class="cost-head"><span class="cost-name">' + esc(T(l)) + ' ' + refsHtml(l.refs) + '</span><span class="cost-val">' + esc(range(l.min, l.max)) + '</span></div>' +
        (l.detail ? '<p class="cost-detail">' + esc(T(l.detail)) + '</p>' : '') + '</div>';
    }).join('');
    var days = Math.ceil(max / J.meta.wage_basis.daily_wage_inr);
    return '<section class="card" id="costs" data-scenario="' + key + '" data-total-min="' + min + '" data-total-max="' + max + '" data-days="' + days + '">' +
      '<h2 class="h2" style="margin-top:4px">' + esc(U('costTitle')) + '</h2><p class="chip">' + esc(U('sc_' + key)) + '</p>' + rows +
      '<div class="cost-total"><span>' + esc(U('total')) + '</span><span>' + esc(range(min, max)) + '</span></div>' +
      '<p class="wage">' + esc(U('wageDays', { n: days })) + ' ' + refsHtml([J.meta.wage_basis.fact]) + '</p>' +
      '<p class="muted small">' + esc(T(J.costs.note)) + '</p>' +
      '<p class="small">' + esc(T(J.costs.borrowing)) + ' ' + refsHtml(J.costs.borrowing.refs) + '</p></section>';
  }
  function trailHtml() {
    if (!S.trail.length) return '';
    return '<h2 class="h2">' + esc(U('yourRoute')) + '</h2><ol class="route">' + S.trail.map(function (st) {
      var n = J.nodes[st.node], c = n.choices[st.i];
      var t = n.clock_min == null ? '' : T(n.clock_label);
      return '<li><span class="t">' + esc(t) + '</span><span><span class="s">' + esc(T(n.scene)) + '</span><span class="c">' + esc(T(c.label)) + '</span></span></li>';
    }).join('') + '</ol>';
  }
  function endingScreen() {
    var key = S.path, e = J.endings[key];
    if (!e) return startScreen();
    var death = key === 'death';
    var h = '<section class="ending' + (death ? ' quiet' : '') + '" data-ending="' + key + '">';
    h += art('ending', key);
    h += '<h2 class="ending-title">' + esc(T(e.title)) + '</h2><div class="prose">' + paras(T(e.text)) + '</div>';
    if (typeof e.stat.survivors_per_100 === 'number') {
      h += '<div class="card">' + personGrid(e.stat.survivors_per_100) + '<p class="stat">' + esc(T(e.stat)) + ' ' + refsHtml(e.stat.refs) + '</p></div>';
    } else {
      h += '<p class="stat">' + esc(T(e.stat)) + ' ' + refsHtml(e.stat.refs) + '</p>';
    }
    if (death && e.turning_points) {
      h += '<h3 class="h2">' + esc(U('turning')) + '</h3><ol class="tp">' + e.turning_points[lang].map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>';
      h += fixesHtml('road_late', true);
    }
    h += '</section>';
    if (!death) h += costHtml();
    h += '<div class="stack"><button type="button" class="btn btn-secondary" data-act="better">' + esc(T(J.better_route.label)) + '</button></div>';
    h += trailHtml();
    h += '<div class="stack">' +
      '<button type="button" class="btn btn-primary" data-act="lessons">' + esc(T(J.lessons.title)) + '</button>' +
      '<button type="button" class="btn" data-act="retry">' + esc(U('tryAgain')) + '</button>' +
      '<button type="button" class="btn btn-quiet" data-act="restart">' + esc(U('startOver')) + '</button>' +
      '<button type="button" class="btn btn-quiet" data-act="sources">' + esc(U('toSources')) + '</button></div>';
    h += shareHtml();
    return h;
  }

  function lessonsScreen() {
    var h = art('lessons') + '<h2 class="scene">' + esc(T(J.lessons.title)) + '</h2>';
    h += '<ol class="lessons">' + J.lessons.items.map(function (it, i) {
      return '<li class="card lesson"><span class="n" aria-hidden="true">' + (i + 1) + '</span><p>' + esc(T(it)) + ' ' + refsHtml(it.refs) + '</p></li>';
    }).join('') + '</ol>';
    h += '<div class="stack"><button type="button" class="btn btn-primary" data-act="playbook">' + esc(T(J.playbook.title)) + '</button>' +
      (S.ended ? '<button type="button" class="btn btn-secondary" data-act="better">' + esc(T(J.better_route.label)) + '</button>' : '') +
      '<button type="button" class="btn" data-act="retry">' + esc(U('tryAgain')) + '</button>' +
      '<button type="button" class="btn btn-quiet" data-act="restart">' + esc(U('startOver')) + '</button></div>';
    h += shareHtml();
    return h;
  }

  function treatInfo() {
    // When treatment to open the artery began on the reader's route, from the node that set the path.
    if (!S.ended) return null;
    if (S.ended === 'death') return { never: true };
    for (var k = S.trail.length - 1; k >= 0; k--) {
      var st = S.trail[k], n = J.nodes[st.node], c = n.choices[st.i];
      if (c.set && c.set.path) return { min: n.clock_min, label: n.clock_label, kind: S.ended === 'direct_pci' ? 'angioplasty' : 'injection' };
    }
    return null;
  }
  function betterScreen(i) {
    var br = J.better_route, steps = br.steps, n = steps.length;
    var h = '<span class="illus">' + esc(U('illustrative')) + '</span>';
    var btnNext = function (label) { return '<div class="stack"><button type="button" class="btn btn-primary" data-act="bnext">' + esc(label || U('next')) + '</button></div>'; };
    if (i === 0) {
      h += art('better', 0) + '<h2 class="scene">' + esc(T(br.label)) + '</h2><div class="prose">' + paras(T(br.intro)) + '</div>' + btnNext();
    } else if (i <= n) {
      var st = steps[i - 1];
      h += '<p class="stepn">' + esc(U('stepOf', { i: i, n: n })) + '</p>' + clockHtml(st.clock_min, st.clock_label) + art('better', i) +
        '<h2 class="scene">' + esc(T(st.title)) + '</h2><div class="prose"><p>' + esc(T(st.text)) + ' ' + refsHtml(st.refs) + '</p></div>' + btnNext();
    } else if (i === n + 1) {
      h += '<h2 class="scene">' + esc(T(br.label)) + '</h2><div class="card fact"><p>' + esc(T(br.outcome)) + ' ' + refsHtml(br.outcome.refs) + '</p></div>' + btnNext(U('seeCompare'));
    } else {
      var ti = treatInfo(), bt = steps[BETTER_TREAT_STEP], last = steps[n - 1];
      var yours = !ti ? U('noRun') : ti.never ? U('never') :
        U(ti.kind) + ', ' + U('approx') + ' ' + T(ti.label) + ' (' + U('afterPain', { t: duration(ti.min) }) + ')';
      var better = U('injection') + ', ' + T(bt.clock_label) + ' (' + U('afterPain', { t: duration(bt.clock_min) }) + ')';
      h += '<h2 class="scene">' + esc(U('compareTitle')) + '</h2>';
      if (ti && !ti.never) {
        lastClock = null;
        h += '<div class="card">' + clockHtml(bt.clock_min, bt.clock_label, ti.min).replace('clock-since', 'clock-since" hidden data-x="') +
          '<div class="legend"><span><i style="background:var(--accent)"></i>' + esc(U('legendBetter')) + '</span><span><i style="background:var(--muted)"></i>' + esc(U('legendYours')) + '</span></div></div>';
      }
      h += '<table class="compare"><thead><tr><th scope="col"><span hidden>.</span></th><th scope="col">' + esc(U('colYours')) + '</th><th scope="col">' + esc(U('colBetter')) + '</th></tr></thead><tbody>' +
        '<tr><th scope="row">' + esc(U('rowTreat')) + '</th><td data-yours-treat>' + esc(yours) + '</td><td class="b">' + esc(better) + '</td></tr>' +
        '<tr><th scope="row">' + esc(U('rowEnd')) + '</th><td>' + esc(S.ended ? T(J.endings[S.ended].title) : '') + '</td><td class="b">' + esc(T(last.title)) + ', ' + esc(T(last.clock_label)) + '</td></tr>' +
        '</tbody></table>';
      h += '<div class="stack"><button type="button" class="btn btn-primary" data-act="playbook">' + esc(T(J.playbook.title)) + '</button>' +
        (S.ended ? '<button type="button" class="btn" data-act="toending">' + esc(U('backEnding')) + '</button>' : '') +
        '<button type="button" class="btn btn-quiet" data-act="lessons">' + esc(T(J.lessons.title)) + '</button></div>';
    }
    return h;
  }

  function playbookScreen() {
    var h = art('playbook') + '<h2 class="scene">' + esc(T(J.playbook.title)) + '</h2>';
    J.playbook.groups.forEach(function (g) {
      h += '<section class="pb-group"><h3>' + actorChip(g.actor) + '</h3>' + g.items.map(function (it) {
        return '<div class="card pb-item"><p>' + esc(T(it)) + ' ' + refsHtml(it.refs) + '</p></div>';
      }).join('') + '</section>';
    });
    h += shareHtml('#playbook', T(J.playbook.title) + '.').replace('<h2 class="h2">' + esc(U('share')) + '</h2>', '<h2 class="h2">' + esc(U('shareAct')) + '</h2>');
    h += '<div class="stack">' + (S.ended ? '<button type="button" class="btn" data-act="toending">' + esc(U('backEnding')) + '</button>' : '<button type="button" class="btn btn-primary" data-act="restart">' + esc(U('begin')) + '</button>') +
      '<button type="button" class="btn btn-quiet" data-act="sources">' + esc(U('toSources')) + '</button></div>';
    return h;
  }

  function sourcesScreen() {
    var groups = { C: [], T: [], F: [], P: [], E: [] };
    Object.keys(J.sources).forEach(function (id) {
      var g = id === 'ASSUMPTION' ? 'E' : id.charAt(0);
      (groups[g] || groups.E).push(id);
    });
    var num = function (id) { return parseInt(id.slice(1), 10) || 0; };
    var h = '<h2 class="scene">' + esc(U('sourcesTitle')) + '</h2><p class="muted">' + esc(U('sourcesIntro')) + '</p>';
    ['C', 'T', 'F', 'P', 'E'].forEach(function (g) {
      if (!groups[g].length) return;
      groups[g].sort(function (a, b) { return num(a) - num(b); });
      h += '<section class="src-group"><h3>' + esc(U('g_' + g)) + '</h3>' + groups[g].map(function (id) {
        var s = J.sources[id];
        return '<div class="src" id="src-' + id + '"><b>' + (id === 'ASSUMPTION' ? esc(U('ourEstimate')) : id) + '</b> ' + esc(s.cite) +
          (s.period ? ' <span class="muted">(' + esc(s.period) + ')</span>' : '') +
          (s.url ? '<br><a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.url.replace(/^https?:\/\//, '')) + '</a>' : '') + '</div>';
      }).join('') + '</section>';
    });
    h += '<div class="stack"><button type="button" class="btn" data-act="back">' + esc(U('backStory')) + '</button></div>';
    return h;
  }

  // ---------- actions ----------
  $screen.addEventListener('click', function (e) {
    var r = e.target.closest('[data-ref]');
    if (r) { e.preventDefault(); openSheet(r.getAttribute('data-ref'), r); return; }
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var a = b.getAttribute('data-act');
    if (a === 'lang') { setLang(b.getAttribute('data-lang'), true); go({ t: 'start' }); }
    else if (a === 'begin') go({ t: 'node', id: J.start }, function (s) { var n = freshState(); for (var k in n) s[k] = n[k]; });
    else if (a === 'choose') choose(+b.getAttribute('data-i'));
    else if (a === 'retry') {
      var keep = S.card;
      go({ t: 'node', id: 'symptoms' }, function (s) {
        var n = freshState(keep); for (var k in n) s[k] = n[k];
        if (typeof keep === 'boolean') {
          var ci = 0; J.nodes[J.start].choices.forEach(function (c, i) { if (c.set && c.set.card === keep) ci = i; });
          s.trail.push({ node: J.start, i: ci });
        }
      });
    }
    else if (a === 'restart') go({ t: 'start' }, function (s) { var n = freshState(); for (var k in n) s[k] = n[k]; });
    else if (a === 'better') go({ t: 'better', i: 0 });
    else if (a === 'bnext') go({ t: 'better', i: (S.screen.i || 0) + 1 });
    else if (a === 'lessons') go({ t: 'lessons' });
    else if (a === 'playbook') go({ t: 'playbook' });
    else if (a === 'sources') go({ t: 'sources' });
    else if (a === 'toending') go({ t: 'ending' });
    else if (a === 'back') { if (history.length > 1 && history.state) history.back(); else go({ t: 'start' }); }
    else if (a === 'copy') {
      var st = b.parentNode.parentNode.querySelector('.status');
      copyText(b.getAttribute('data-url'), function (ok) { st.textContent = ok ? U('copied') : U('copyFail'); });
    } else if (a === 'native') {
      navigator.share({ title: T(J.meta.title), text: b.getAttribute('data-text'), url: b.getAttribute('data-url') }).catch(function () { /* cancelled */ });
    }
  });

  // ---------- boot ----------
  function showError() {
    $screen.innerHTML = '<section class="err" role="alert"><p lang="hi">' + esc(ui.errTitle.hi) + '</p><p lang="en">' + esc(ui.errTitle.en) + '</p>' +
      '<div class="stack"><button type="button" class="btn btn-primary" id="retry-load"><span lang="hi">' + esc(ui.retry.hi) + '</span>&nbsp;·&nbsp;<span lang="en">' + esc(ui.retry.en) + '</span></button></div></section>';
    document.getElementById('retry-load').addEventListener('click', function () {
      $screen.setAttribute('aria-busy', 'true'); load();
    });
  }
  function start() {
    var q = readQuery();
    var hs = history.state;
    if (hs && hs.s) {
      S = hs.s; setLang(hs.lang || q.lang || 'hi', true);
    } else if (q.lang) {
      setLang(q.lang, true);
      S = freshState(); S.screen = q.hash ? { t: q.hash } : { t: 'start' };
      history.replaceState(snapshot(), '', urlFor(S.screen));
    } else {
      var nav = (navigator.language || '').toLowerCase().indexOf('hi') === 0 ? 'hi' : 'en';
      setLang(nav, true);
      S = freshState();
      S.screen = q.hash ? { t: q.hash } : { t: 'lang' };
      if (q.hash) history.replaceState(snapshot(), '', urlFor(S.screen));
      else history.replaceState(snapshot(), '', location.pathname);
      if (!q.hash) document.getElementById('langtoggle').hidden = true;
    }
    $screen.removeAttribute('aria-busy');
    render(false);
  }
  function cssReady() {
    // styles.css loads without blocking first paint; wait for it before drawing the story.
    var l = document.getElementById('css');
    if (!l || l.media === 'all' || l.sheet && l.media !== 'print') return Promise.resolve();
    return new Promise(function (res) {
      l.addEventListener('load', function () { l.media = 'all'; res(); });
      l.addEventListener('error', function () { res(); });
      setTimeout(function () { l.media = 'all'; res(); }, 8000);
    });
  }
  function load() {
    Promise.all([fetch('journey.json', { credentials: 'same-origin', mode: 'cors' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }), cssReady()])
      .then(function (res) { J = res[0]; start(); })
      .catch(function () { $screen.removeAttribute('aria-busy'); showError(); });
  }
  // The static language screen links work before JS; enhance them now.
  load();
})();

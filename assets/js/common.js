(function(window, document, $, undefined) {
  "use strict";

  const SOUND_PATH = 'assets/sounds/';
  const CATE_NAME = ['打招呼', '吃飯', '購物', '飯店', '交通', '髒話'];
  const DEFAULT_CATE = 0;
  var vocsData = [];
  var cateVocsData = {};
  var sound = document.createElement('audio');
  var currentPlayingItem;

  function init() {
    sound.addEventListener("loadeddata", hideSoundIcons, false);
    sound.addEventListener("canplay", playSound, false);
    sound.addEventListener("ended", hideSoundIcons, false);

    // change cate
    $(document).on('click', '.navbar a', function(e) {
      var target = $(e.currentTarget);
      showVocsByCate(target.data('cate'));
    });

    // play sound
    $(document).on('click', 'tbody tr', function(e) {
      var target = $(e.currentTarget);
      
      ga('send', 'event', 'Vocabulary', 'click', target.find('td:eq(0)').text());

      // 避免重複按時重load
      if (currentPlayingItem) {
        if (currentPlayingItem.find('td:eq(0)').text() == target.find('td:eq(0)').text()) {
          playSound();
          return;
        }
      }

      hideSoundIcons();
      target.find('.loading-icon').show();
      
      currentPlayingItem = target;

      var filename = target.find('td:eq(1) small').text().replace(/OO /g, '').replace(/ /g, '_') + '.mp3';
      sound.src = SOUND_PATH + filename;
      sound.load();
    });

    loadVocs(DEFAULT_CATE);
  }

  function hideSoundIcons(e) {
    $('.loading-icon, .playing-icon').hide();
  }

  function playSound(e) {
    sound.currentTime = 0;
    sound.play();
    currentPlayingItem.find('.playing-icon').show();
  }

  function loadVocs(cate) {
    $.getJSON('assets/data/vocs').done(function(data){
      vocsData = data;
      
      if(cate!=null) {
        showVocsByCate(cate);
      }

      var list = new Vue({
        el: '#vocsList',
        data: cateVocsData
      });

      $('html').removeClass('splash');
    });
  }

  function showVocsByCate(cate) {
    $('.navbar li').removeClass('active');
    $('.navbar li').eq(cate).addClass('active');

    cateVocsData.cateName = CATE_NAME[cate];
    cateVocsData.vocs = [];

    for(var i = 0; i < vocsData.length; i++) {
      if (vocsData[i].cates.includes(cate)) {
        cateVocsData.vocs.push(vocsData[i])
      }
    }

    ga('send', 'event', 'Category', 'click', CATE_NAME[cate]);
  }

  init();



}(window, document, jQuery));

(function(window, document, $, undefined) {
  "use strict";

  const SOUND_PATH = 'assets/sounds/';
  const CATE_NAME = ['打招呼', '吃飯', '購物', '飯店', '交通', '髒話'];
  const DEFAULT_CATE = 0;
  var vocsData = [];
  var cateVocsData = {};
  var sound = document.createElement('audio');

  function init() {
    
    $(document).on('click', '.navbar a', function(e) {
      var target = $(e.currentTarget);
      showVocsByCate(target.data('cate'));
    });
    
    $(document).on('click', 'tbody tr', function(e) {
      var target = $(e.currentTarget);
      var filename = target.find('td:eq(2)').text().replace(/OO /g, '').replace(/ /g, '_') + '.mp3';
      // console.log(filename)
      sound.src = SOUND_PATH + filename;
      sound.load();
      sound.play();
      // 彈出視窗 顯示比較大的韓文，下面是相關詞彙
      ga('send', 'event', 'Vocabulary', 'click', target.find('td:eq(0)').text());
    });

    loadVocs(DEFAULT_CATE);
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

/*
  var vocs = []
  $('tbody tr').each(function(index, item) {
    var row = $(item);
    vocs.push({
      ch: row.find('td:eq(0)').text(),
      kr: row.find('td:eq(1)').text(),
      pinyin: row.find('td:eq(2)').text()
    })
  })
  console.log(JSON.stringify(vocs));
*/


}(window, document, jQuery));

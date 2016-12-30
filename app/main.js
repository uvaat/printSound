import Sound from './Sound';
import paper from 'paper';

window.addEventListener('load', function(){

  var sound = new Sound();

  if(!window.AudioContext){

    if (!window.webkitAudioContext){
      alert('no audiocontext found');
    }

    window.AudioContext = window.webkitAudioContext;

  }

  sound.setupAudioNodes();

  sound.loadSound("https://ia801404.us.archive.org/16/items/FREE_background_music_dhalius/BloodCity.mp3")
  .then(function(){

    sound.playSound();
    paper.setup('myCanvas');

    var path = new paper.Path({
      segments: new paper.Point(0, 0),
      strokeColor: '#2c3e50'
    });

    var volume = sound.getVolume(0);

    var step = 2*Math.PI/60;
    var h = 200;
    var k = 200;
    var r = 100;
    var theta = 0;

    paper.view.onFrame = function(event) {

      theta += step;

      var r = sound.getVolume(0) * 3;
      var x = h + r * Math.cos(theta);
      var y = k - r * Math.sin(theta);
      path.add(x, y);

      //path.simplify(10);

    }

    setTimeout(function(){

      sound.stopSound();

    }, 2000)


  }, function(){

    console.log('lala');

  })


}, false);

import { Promise } from 'es6-promise';

class Sound {

  constructor() {

    this.context = new AudioContext();
    this.javascriptNode = null;
    this.sourceNode = null;
    this.buffer = null;
    this.splitter = null;
    this.analysers = [];

  }

  stopSound() {
    this.sourceNode.stop();
  }

  playSound() {

    this.sourceNode.buffer = this.buffer;
    this.sourceNode.start(0);

  }

  onError(e) {
    console.log(e);
  }

  loadSound(url){

    var self = this;

    return new Promise(function(resolve, reject){

      var request = new XMLHttpRequest();

      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      // When loaded decode the data
      request.onload = function() {

        // decode the data
        self.context.decodeAudioData(request.response, function(buffer) {
          // when the audio is decoded play the sound
          //self.playSound(buffer);
          self.buffer = buffer;
          resolve(buffer);

        }, function(e){

          reject(e);

        });
      }

      request.send();

    })


  }

  getAverageVolume(array){

      var values = 0;
      var average;
      var length = array.length;
      // get all the frequency amplitudes
      for (var i = 0; i < length; i++) {
          values += array[i];
      }
      average = values / length;
      return average;

  }

  getVolume(key){

    var array =  new Uint8Array(this.analysers[key].frequencyBinCount);
    this.analysers[key].getByteFrequencyData(array);
    return this.getAverageVolume(array);

  }

  setupAudioNodes() {

    // setup a javascript node
    this.javascriptNode = this.context.createScriptProcessor(2048, 1, 1);

    // connect to destination, else it isn't called
    this.javascriptNode.connect(this.context.destination);

    // setup a analyzer
    var analyser = this.context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024;

    analyser.connect(this.javascriptNode);

    this.analysers.push(analyser);

    // create a buffer source node
    this.sourceNode = this.context.createBufferSource();
    this.splitter = this.context.createChannelSplitter();

    // connect the source to the analyser and the splitter
    this.sourceNode.connect(this.splitter);

    // connect one of the outputs from the splitter to
    // the analyser
    this.splitter.connect(analyser,0,0);

    // and connect to destination
    this.sourceNode.connect(this.context.destination);

  }


}

export default Sound;

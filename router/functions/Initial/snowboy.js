const debug = require('debug')('snowboy')
const path = require ('path')


debug('Loading in SNOWBOY')
const record = require('node-record-lpcm16')
debug('Loaded in record')
const Detector = require('snowboy').Detector;
debug('Loaded in detector')
const Models = require('snowboy').Models;
debug('Loaded in snowboy')

debug('PATH: ', __dirname)
const models = new Models();

models.add({
  file: path.join(__dirname, 'resources/snowboy.umdl'),
  sensitivity: '0.5',
  hotwords : 'snowboy'
});

const detector = new Detector({
  resource: path.join(__dirname, 'resources/common.res'),
  models: models,
  audioGain: 2.0
});

detector.on('silence', function () {
  console.log('silence');
});

detector.on('sound', function () {
  console.log('sound');
});

detector.on('error', function () {
  console.log('error');
});

detector.on('hotword', function (index, hotword) {
  console.log('hotword', index, hotword);
});

const mic = record.start({
  threshold: 0,
  verbose: true,
  recordProgram: 'arecord'
});

mic.pipe(detector);
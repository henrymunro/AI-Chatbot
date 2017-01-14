var rec = require('node-record-lpcm16')
var request = require('request')
const debug = require('debug')('witSpeech')
const path = require ('path')

const witToken = 'WD7T6CL6TYJICOOB3LHCHJY2B55H5BPZ'


debug('Loading in WITSPEECH')


exports.parseResult = function (err, resp, body) {
  if (err) console.error(err)
  console.log(body)
}

const formData = {
  "config": {
    projectId: 'nimble-gearing-155318',
    keyFilename: path.join(__dirname, 'resources/keyfile.json')
  }
}

rec.start({
  verbose: true,
  recordProgram: 'arecord'
}).pipe(request.post({
  'url': 'https://speech.googleapis.com/v1beta1/speech:syncrecognize',
  'headers': {
    // 'Accept': 'application/vnd.wit+json',
    'Authorization': 'Bearer ' + witToken,
    'Content-Type': 'audio/wav'
  }
  // formData: formData
}, exports.parseResult))


debug('Starting speech recording')
setTimeout(()=>{ 
  debug('Stopping speech recording')
  rec.stop() 

  }, 3000) // Stop after 2 seconds of recording
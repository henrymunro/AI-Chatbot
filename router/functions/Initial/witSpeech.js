var rec = require('node-record-lpcm16')
var request = require('request')
const debug = require('debug')('witSpeech')

const witToken = 'WD7T6CL6TYJICOOB3LHCHJY2B55H5BPZ'


debug('Loading in WITSPEECH')


exports.parseResult = function (err, resp, body) {
  if (err) console.error(err)
  console.log(body)
}

rec.start({
  verbose: true,
  recordProgram: 'arecord'
}).pipe(request.post({
  'url': 'https://api.wit.ai/speech?lang=en-uk&output=json&v=20160526',
  'headers': {
    // 'Accept': 'application/vnd.wit+json',
    'Authorization': 'Bearer ' + witToken,
    'Content-Type': 'audio/wav'
  }
}, exports.parseResult))


debug('Starting speech recording')
setTimeout(()=>{ 
  debug('Stopping speech recording')
  rec.stop() 

  }, 3000) // Stop after 2 seconds of recording
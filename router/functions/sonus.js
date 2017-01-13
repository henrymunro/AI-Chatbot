const path = require ('path')
const debug = require('debug')('sonus')
const Sonus = require('sonus')
const speech = require('@google-cloud/speech')({
  projectId: 'nimble-gearing-155318',
  keyFilename: path.join(__dirname, 'resources/My First Project-b7ffd0f15029')
})

debug('Loading in SONUS')

const hotwords = [{ file: path.join(__dirname, 'resources/alexa.umdl'), hotword: 'alexa' }]
const language = "en-UK"
const sonus = Sonus.init({ hotwords, language }, speech)

try{
  Sonus.trigger(sonus, 1)
} catch (e) {
  console.log('Triggering Sonus before starting it will throw the following exception:', e)
}

Sonus.start(sonus)

sonus.on('hotword', (index, keyword) => console.log("!" + keyword))

sonus.on('partial-result', result => console.log("Partial", result))

sonus.on('error', (error) => console.log(error))

sonus.on('final-result', result => {
  console.log("Final", result)
  if (result.includes("stop")) {
    Sonus.stop()
  }
})

try{
  Sonus.trigger(sonus, 2)
} catch (e) {
  console.log('Triggering Sonus with an invalid index will throw the following error:', e)
}

//Will use index 0 with a hotword of "triggered" and start streaming immedietly
Sonus.trigger(sonus, 0, "some hotword")
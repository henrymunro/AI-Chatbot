const path = require ('path')
const debug = require('debug')('sonus')
const Sonus = require('sonus')


  
const speech = require('@google-cloud/speech')({projectId: 'nimble-gearing-155318',
  keyFilename: path.join(__dirname, 'resources/keyfile.json'),
})
const {Wit, log} = require('node-wit')
var say = require('say')





/*
Alan - Scottish male.
Nick - English RP male.
Roger - English RP male
Nina - English RP female.
KAL - American male.
SLT - American female.
*/

debug('Loading in SONUS')

const hotwords = [{ file: path.join(__dirname, 'resources/jeeves.pmdl'), hotword: 'jeeves' }]
const language = "en-GB"
const sonus = Sonus.init({ hotwords, language }, speech)
const client = new Wit({accessToken: 'WD7T6CL6TYJICOOB3LHCHJY2B55H5BPZ'})




// Fire a callback once the text has completed being spoken
say.speak('whats up, dog?'//' They call me J Man but you can call be jeeves'
  , 'Nick', 1.0, function(err) {
  if (err) {
    return console.error(err);
  }

  Sonus.start(sonus)
  console.log('Text has been spoken.');
});




debug('Say "' + hotwords[0].hotword + '"...')
sonus.on('hotword', (index, keyword) => {
  say.speak('yo', 'Alex', 1)
  console.log("!" + keyword + ' , '+index)
})
sonus.on('partial-result', result => console.log("Partial", result))

sonus.on('final-result', result => {
  debug(result)
  if (result.includes("stop")) {
    debug('Stopping')
    say.speak('Bye bye, Shutting down', 'Alex', 1)
    setTimeout(()=>{say.speak('down', 'Alex', 0.75)}, 1600)  
    setTimeout(()=>{say.speak('down', 'Alex', 0.5)}, 2300)      
    setTimeout(()=>{say.speak('down', 'Alex', 0.2)}, 2900)  
    Sonus.stop()
  }else if(result){
    // Sonus.stop()
    client.converse('my-user-session-44', result, {})
          .then((data) => {
            const drink = ((data.entities||{}).drink||[{value:''}])[0].value
            const intent = ((data.entities||{}).intent||[{value:''}])[0].value
            debug('INTENT: '+ intent)
            debug('DRINK: '+ drink)
            if (intent === 'order_drink' && drink){
              debug('Pausing recognition')
              Sonus.pause(sonus)
              say.speak(drink+' coming right up you filthy animal!', 'Nick', 1.0, function(err) {
                if (err) {
                  return console.error(err);
                }

                debug('Resuming recognition')
                Sonus.resume(sonus)
              })
            } else if (intent === 'recommend_drink'){
              debug('Pausing recognition')
              Sonus.pause(sonus)
              
              say.speak("I'll tell you what a tequila sunrise always hit's the spot you son of a gun", "alex", 1, function(err) {
                if (err) {
                  return console.error(err);
                }
                debug('Resuming recognition')
                Sonus.resume(sonus)
              })
            }
            else { 
              say.speak("Sorry I didn't catch that, keep on trucking!")
              // Sonus.start(sonus)
            }

          })
          .catch(console.error)
  }
  
})
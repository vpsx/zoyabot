// Zoyabot :)
// Wow why is javascript so... :| 

// TODO: Figure out how to write log files for spyware Kappa

// NPM stuff
const tmi = require('tmi.js')
const haikudos = require('haikudos')
const request = require('request')

// Configurables here
const config = require('./config.js')
const knowns = require('./knowns.js')

// Timer
const timer_url = "http://127.0.0.1:3000" //ho

// Create a client with our options:
let client = new tmi.client(config.return_options_object())

// Register our event handlers (defined below):
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.on('disconnected', onDisconnectedHandler)
client.on('join', onJoinHandler) 

// Connect to Trubka:
client.connect()

// Kanaly
let k0 = config.return_c0()

// Fun 
let commandPrefix = '!' //valid commands start with !
let knownCommands = { echo, haiku, хайзоябот, мат, МАТ }
var knowns_map = new Map(knowns.return_knowns_pairs())
var already_greeted_list = []
var spyware_list_kappa = []

function sendMessage (target, context, message) {
  // Helper fn to send correct type of message. 
  if (context['message-type'] === 'whisper') {
    client.whisper(target, message)
  } else {
    client.say(target, message)
  }
}

function onMessageHandler (target, context, msg, self) {
  if (self) { return } // Ignore messages from the bot

  // Knowns greeter functionality 
  // Currently greets even if first msg was a command. 
  // No particular reason; had to decide one way or the other...
  msgstring = knowns_map.get(context.username)
  if (msgstring) {
    if (!already_greeted_list.includes(context.username)) {
      console.log(`Sending greeting to ${context.username}`)
      client.say("k0", msgstring)
      already_greeted_list.push(context.username)
      //Could pull the @'s out of dict and program it in here, but 
      //for now I would rather have finer control over who gets @'d and who doesn't
    }
  }

  // This isn't a command since it has no prefix:
  if (msg.substr(0, 1) !== commandPrefix) {
    console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`)
    return
  }

  // Split the message into individual words:
  const parse = msg.slice(1).split(' ')
  // The command name is the first (0th) one:
  const commandName = parse[0]
  // The rest (if any) are the parameters:
  const params = parse.splice(1)

  // If the command is known, let's execute it:
  if (commandName in knownCommands) {
    // Retrieve the function by its name:
    const command = knownCommands[commandName]
    // Then call the command with parameters:
    command(target, context, params)
    console.log(`* Executed ${commandName} command for ${context.username}`)
  } else {
    console.log(`* Unknown command ${commandName} from ${context.username}`)
  }
}

function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
  client.color("BlueViolet") 
  client.say("k0", "Я здесь я работаю всем хай")
}


function onDisconnectedHandler (reason) {
  console.log(`Disconnected: ${reason}`)
  process.exit(1)
}


function onJoinHandler (channel, username, self) {
  console.log(`${username} just dropped by...`)
  if (!spyware_list_kappa.includes(username)) {
    spyware_list_kappa.push(username)
  }
}



//***************************************************************************************
// COMMAND HANDLERS 
//***************************************************************************************


function echo (target, context, params) {
  if (params.length) { //if there's something to echo 
    var msg = params.join(' ')
    // Interrupt attempted slash and dot commands:
    if (msg.charAt(0) == '/' || msg.charAt(0) == '.') {
      msg = 'Nice try...'
    }
    sendMessage(target, context, msg)
  } else { 
    console.log(`* Nothing to echo`)
  }
}

function haiku (target, context) {
  // Generate a new haiku:
  haikudos((newHaiku) => {
    // Split it line-by-line:
    newHaiku.split('\n').forEach((h) => {
    // Send each line separately:
    sendMessage(target, context, h)
    })
  })
}

function хайзоябот (target, context) {
  client.say("k0", "@" + context.username + " HeyGuys")
}

function МАТ (target, context) {
  мат(target, context);
}

function мат (target, context) {
  request(timer_url + "/get", function (error, response, body) {
    console.log("Hit timer GET endpoint!")
    //console.log('error:', error); 
    //console.log('statusCode:', response && response.statusCode);
    //console.log('body:', body);
    client.say("k0", "SMOrc SMOrc МАТ!!! Время без мата было: " + body);
  });
  request(timer_url + "/reset", function (error, response, body) {
    console.log("Hit timer RESET endpoint!")
    //console.log('error:', error);
    //console.log('statusCode:', response && response.statusCode);
    //console.log('body:', body);
    client.say("k0", "Таймер обнулился Kappa"); 
  });
}



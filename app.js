// Zoyabot :)


// NPM stuff
const tmi = require('tmi.js')
const haikudos = require('haikudos')
const request = require('request')

// Configurables here
const config = require('./config.js')
const knowns = require('./knowns.js')

// Timer
const timer_url = "http://127.0.0.1:3000" //ho

// Peredatchik
const WebSocket = require('ws');
const ws = new WebSocket("ws://127.0.0.1:8080");

// Tostrero
// NOTE: Changes with every router reset
const tostrero_url = "http://192.168.1.4:5000"

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

// Some time and uptime stuff
var stream_went_up_at = Date.now();
var time_options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: '2-digit',
  timeZoneName: 'short',
  hourCycle: 'h24',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
};

// Fun 
let commandPrefix = '!' //valid commands start with !
let knownCommands = {
    echo, haiku,
    хайзоябот,
    мат, МАТ,
    kappa, каппа,
    pepega, пепега,
    xrr, хрр, kkkkkkkkkk, k, kk, kkk, kkkk, kkkkk, к, кк, ккк, кккк, ккккк, кккккккккк,
    чикаго, chicago,
    время, time,
    up, uptime, ап, стримап,
    cleanup,
    го, go, то, to,
    смотри, look,
}
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
      client.say(k0, msgstring)
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
  client.say(k0, "Я здесь я работаю всем хай")
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
  client.say(k0, "@" + context.username + " HeyGuys")
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
    client.say(k0, "SMOrc SMOrc МАТ!!! Время без мата было: " + body);
  });
  request(timer_url + "/reset", function (error, response, body) {
    console.log("Hit timer RESET endpoint!")
    //console.log('error:', error);
    //console.log('statusCode:', response && response.statusCode);
    //console.log('body:', body);
    client.say(k0, "Таймер обнулился Kappa");
  });
}


// undocumented; just gpio cleanup convenience
function cleanup(target, context, params) {
    argstring = `/cleanup`
    request(tostrero_url + argstring, function (error, response, body) {
        client.say(k0, body);
    });
}


function go (target, context, params) {
    // go l r speed duration
    for (i=0; i<4; i++) {
        if (params[i] && isNaN(Number(params[i]))) {
            client.say(k0, context.username +  ", Каво? Цифры нужны, братан");
            return
        }
    }
    client.say(k0, context.username + " за рулём...");
    l = params[0] ? params[0] : 1
    r = params[1] ? params[1] : 1
    s = params[2] ? params[2] : 50
    d = params[3] ? params[3] : 3
    argstring = `/go?l=${l}&r=${r}&lspeed=${s}&rspeed=${s}&duration=${d}`
    request(tostrero_url + argstring, function (error, response, body) {
        client.say(k0, "Погнали с " + context.username + " за рулём: " + body);
    });
}
function го (target, context, params) {
    go(target, context, params)
}


function to (target, context, params) {
    // tfw u realize ur api говно :P вот лучше наверное
    // !to l r duration
    // where l/r is just left/right wheel speed and -ve means backwards
    for(i=0; i<3; i++) {
        if (params[i] && isNaN(Number(params[i]))) {
            client.say(k0, context.username +  ", Каво? Цифры нужны, братан");
            return
        }
    }
    client.say(k0, context.username + " за рулём...");
    // divide by own absolute value... wat is that in js :P Я В САМОЛЁТЕ БЛЯ
    left = params[0] ? params[0] : 40
    right = params[1] ? params[1] : left
    duration = params[2] ? params[2] : 3
    l = left/abs(left) //fix
    r = right/abs(right) //fix
    ls = abs(left)
    rs = abs(right)
    d = duration
    argstring = `/go?l=${l}&r=${r}&lspeed=${ls}&rspeed=${rs}&duration=${d}`
    request(tostrero_url + argstring, function (error, response, body) {
        client.say(k0, "Погнали с " + context.username + " за рулём: " + body);
    });
}
function то (target, context, params) {
    to(target, context, params)
}


function look(target, context, params) {
    // look height
    if (params.length == 0) {
        client.say(k0, context.username + ", пожалуйста, дай высоту с 0 до 10~");
        return
    }
    if (isNaN(Number(params[0]))) {
        client.say(k0, context.username +  ", Каво? Цифра нужна, братан");
        return
    }
    h = params[0]
    argstring = `/look?height=${h}`
    request(tostrero_url + argstring, function (error, response, body) {
        client.say(k0, body + "--установлены " + context.username);
    });
}
function смотри(target, context, params) {
    look(target, context, params)
}


function kappa (target, context) {
  ws.send('kappa');
}
function pepega (target, context) {
  ws.send('pepega');
}
function xrr (target, context) {
  ws.send('xrr');
}
function каппа (target, context) {
  ws.send('kappa');
}
function пепега (target, context) {
  ws.send('pepega');
}
function хрр (target, context) {
  ws.send('xrr');
}
// Jesus
function k (target, context) {
  ws.send('xrr');
}
function kk (target, context) {
  ws.send('xrr');
}
function kkk (target, context) {
  ws.send('xrr');
}
function kkkk (target, context) {
  ws.send('xrr');
}
function kkkkk (target, context) {
  ws.send('xrr');
}
function kkkkkkkkkk (target, context) {
  ws.send('xrr');
}
function к (target, context) {
  ws.send('xrr');
}
function кк (target, context) {
  ws.send('xrr');
}
function ккк (target, context) {
  ws.send('xrr');
}
function кккк (target, context) {
  ws.send('xrr');
}
function ккккк (target, context) {
  ws.send('xrr');
}
function кккккккккк (target, context) {
  ws.send('xrr');
}



function чикаго (target, context) { время(target, context) }
function время (target, context) {
  var сейчас = new Date();
  client.say(k0, "В Чикаго сейчас: " + сейчас.toLocaleDateString('ru-RU', time_options));
}
function chicago (target, context) { time(target, context) }
function time (target, context) {
  var сейчас = new Date();
  client.say(k0, "Time in Chicago: " + сейчас.toLocaleDateString('en-GB', time_options));
}
// So actually these uptime functions are скорее bot up, чем stream up...
// But Zoyabot never seems to crash, so this only breaks if I deliberately kill her
function ап (target, context) { uptime(target, context) }
function стримап (target, context) { uptime(target, context) }
function up (target, context) { uptime(target, context) }
function uptime (target, context) {
  var сейчас = Date.now();
  var elapsed_milliseconds = сейчас - stream_went_up_at;
  client.say(k0, "Стрим ап: " + millisecs_to_sensible_string(elapsed_milliseconds));
}

function millisecs_to_sensible_string(ms) {

  s = Math.floor(ms/1000)
  secs = s % 60;
  mins = Math.floor(s/60);
  hrs = Math.floor(mins/60);
  mins = mins % 60;

  mins = mins < 10 ? "0" + mins : mins;
  secs = secs < 10 ? "0" + secs : secs;

  return hrs+":"+mins+":"+secs;
}


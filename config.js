// This is just where the options object lives. 
// I've taken it out of app.js so that app.js doesn't contain 
// secrets. 
// Upd: Also other stuff now I guess

// Define configuration options:
exports.return_options_object = function () {
  let opts = {
    options: {
      debug: true
    },
    identity: {
      username: 'blahblahblah',
      password: 'blehblehbleh'
    },
    channels: [
      'tralala', 'trolololol'
    ]
  }
  return opts
}

// Define other (my own) configuration options: 
exports.return_c0 = function () {
  return 'haihedgehog'
}

var Config = {
  "SSL" : false,
  "env" : "Developpment",
  "api" : {
    "url" : "http://localhost:4242",
    "key" : 4242
  },
  "Facebook" : {
    "callbackURL": "/auth/facebook/callback"
  },
  "Google" : {
    "callbackURL": "/auth/google/callback"
  }
};

module.exports = Config;
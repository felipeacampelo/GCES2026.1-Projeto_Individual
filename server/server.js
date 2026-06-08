var express = require('express'),
    http = require('http'),
    path = require('path'),
    persistence = require('./db.js'),
    app = express(),
    server = http.createServer(app),
    Server = require('socket.io').Server,
    io = new Server(server),
    port = process.env.PORT || 55555,
    GameCollection = require('./games.js').GameCollection,
    games = new GameCollection({
      onGameCreated: function (gameName) {
        persistence.createGameSession(gameName).catch(logPersistenceError);
      },
      onGameJoined: function (gameName) {
        persistence.markGameJoined(gameName).catch(logPersistenceError);
      },
      onGameRemoved: function (gameName) {
        persistence.markGameClosed(gameName).catch(logPersistenceError);
      }
    });

function logPersistenceError(error) {
  console.error('Persistence error:', error.message);
}

app.use(express.static(path.join(__dirname, '../game')));
app.get('/api/game-sessions', function (req, res) {
  persistence.listGameSessions()
    .then(function (sessions) {
      res.json({
        enabled: persistence.isEnabled(),
        sessions: sessions
      });
    })
    .catch(function (error) {
      res.status(500).json({
        error: error.message
      });
    });
});

var Responses = {
    SUCCESS: 0,
    GAME_EXISTS: 1,
    GAME_NOT_EXISTS: 2,
    GAME_FULL: 3
  },
  Requests = {
    CREATE_GAME: 'create-game',
    JOIN_GAME: 'join-game'
  };

io.on('connection', function (socket) {
  socket.on(Requests.CREATE_GAME, function (gameName) {
    if (games.createGame(gameName)) {
      games.getGame(gameName).addPlayer(socket);
      socket.emit('response', Responses.SUCCESS);
    } else {
      socket.emit('response', Responses.GAME_EXISTS);
    }
  });
  socket.on(Requests.JOIN_GAME, function (gameName) {
    var game = games.getGame(gameName);
    if (!game) {
      socket.emit('response', Responses.GAME_NOT_EXISTS);
    } else {
      if (game.addPlayer(socket)) {
        socket.emit('response', Responses.SUCCESS);
      } else {
        socket.emit('response', Responses.GAME_FULL);
      }
    }
  });
});

persistence.init()
  .then(function () {
    server.listen(port);
  })
  .catch(function (error) {
    console.error('Failed to initialize persistence:', error.message);
    process.exit(1);
  });

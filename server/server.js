var express = require('express'),
    http = require('http'),
    path = require('path'),
    persistence = require('./db.js'),
    Server = require('socket.io').Server,
    GameCollection = require('./games.js').GameCollection;

function logPersistenceError(error) {
  console.error('Persistence error:', error.message);
}

var Responses = {
    SUCCESS: 0,
    GAME_EXISTS: 1,
    GAME_NOT_EXISTS: 2,
    GAME_FULL: 3,
    INVALID_PAYLOAD: 4
  },
  Requests = {
    CREATE_GAME: 'create-game',
    JOIN_GAME: 'join-game'
  };

function validateGameName(gameName) {
  return typeof gameName === 'string' &&
    gameName.trim().length > 0 &&
    gameName.length <= 64;
}

function createGames(persistenceLayer) {
  return new GameCollection({
    onGameCreated: function (gameName) {
      persistenceLayer.createGameSession(gameName).catch(logPersistenceError);
    },
    onGameJoined: function (gameName) {
      persistenceLayer.markGameJoined(gameName).catch(logPersistenceError);
    },
    onGameRemoved: function (gameName) {
      persistenceLayer.markGameClosed(gameName).catch(logPersistenceError);
    }
  });
}

function createApp(persistenceLayer) {
  var app = express();

  app.use(express.static(path.join(__dirname, '../game')));
  app.get('/api/game-sessions', function (req, res) {
    persistenceLayer.listGameSessions()
      .then(function (sessions) {
        res.json({
          enabled: persistenceLayer.isEnabled(),
          sessions: sessions
        });
      })
      .catch(function (error) {
        res.status(500).json({
          error: error.message
        });
      });
  });

  return app;
}

function attachRealtime(io, games) {
  io.on('connection', function (socket) {
    socket.on(Requests.CREATE_GAME, function (gameName) {
      if (!validateGameName(gameName)) {
        socket.emit('response', Responses.INVALID_PAYLOAD);
        return;
      }
      if (games.createGame(gameName)) {
        games.getGame(gameName).addPlayer(socket);
        socket.emit('response', Responses.SUCCESS);
      } else {
        socket.emit('response', Responses.GAME_EXISTS);
      }
    });
    socket.on(Requests.JOIN_GAME, function (gameName) {
      if (!validateGameName(gameName)) {
        socket.emit('response', Responses.INVALID_PAYLOAD);
        return;
      }
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
}

function createServer(persistenceLayer) {
  var app = createApp(persistenceLayer);
  var server = http.createServer(app);
  var io = new Server(server);
  var games = createGames(persistenceLayer);

  attachRealtime(io, games);

  return {
    app: app,
    games: games,
    io: io,
    server: server
  };
}

function startServer() {
  var port = process.env.PORT || 55555;

  persistence.init()
    .then(function () {
      var runtime = createServer(persistence);
      runtime.server.listen(port);
    })
    .catch(function (error) {
      console.error('Failed to initialize persistence:', error.message);
      process.exit(1);
    });
}

module.exports = {
  createApp: createApp,
  createGames: createGames,
  createServer: createServer,
  validateGameName: validateGameName,
  startServer: startServer
};

if (require.main === module) {
  startServer();
}

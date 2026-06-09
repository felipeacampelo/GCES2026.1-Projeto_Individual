var test = require('node:test');
var assert = require('node:assert/strict');
var GameCollection = require('../games.js').GameCollection;

function createSocket() {
  return {
    connected: true,
    emitted: [],
    handlers: {},
    disconnected: false,
    emit: function (event, payload) {
      this.emitted.push({ event: event, payload: payload });
    },
    on: function (event, handler) {
      this.handlers[event] = handler;
    },
    disconnect: function () {
      this.connected = false;
      this.disconnected = true;
    }
  };
}

test('GameCollection evita duplicidade e dispara callback de criação uma vez', function () {
  var created = [];
  var collection = new GameCollection({
    onGameCreated: function (gameName) {
      created.push(gameName);
    }
  });

  assert.equal(collection.createGame('arena-1'), true);
  assert.equal(collection.createGame('arena-1'), false);
  assert.deepEqual(created, ['arena-1']);
});

test('GameCollection registra entrada do segundo jogador e encerra a sessão', function () {
  var joined = [];
  var removed = [];
  var collection = new GameCollection({
    onGameJoined: function (gameName) {
      joined.push(gameName);
    },
    onGameRemoved: function (gameName) {
      removed.push(gameName);
    }
  });

  collection.createGame('arena-2');

  var game = collection.getGame('arena-2');
  var playerOne = createSocket();
  var playerTwo = createSocket();

  assert.equal(game.addPlayer(playerOne), true);
  assert.equal(game.addPlayer(playerTwo), true);
  assert.deepEqual(joined, ['arena-2']);
  assert.equal(playerOne.emitted[0].event, 'player-connected');

  game.endGame(0);

  assert.equal(playerTwo.disconnected, true);
  assert.equal(collection.getGame('arena-2'), undefined);
  assert.deepEqual(removed, ['arena-2']);
});

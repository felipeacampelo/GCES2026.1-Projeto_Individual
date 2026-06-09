var test = require('node:test');
var assert = require('node:assert/strict');
var request = require('supertest');
var serverModule = require('../server.js');

test('GET /api/game-sessions retorna sessões do backend', async function () {
  assert.equal(typeof serverModule.createApp, 'function');

  var app = serverModule.createApp({
    isEnabled: function () {
      return false;
    },
    listGameSessions: async function () {
      return [];
    }
  });

  var response = await request(app)
    .get('/api/game-sessions')
    .expect(200);

  assert.deepEqual(response.body, {
    enabled: false,
    sessions: []
  });
});

test('validateGameName aceita nomes válidos e rejeita payloads inválidos', function () {
  assert.equal(serverModule.validateGameName('arena-1'), true);
  assert.equal(serverModule.validateGameName('   '), false);
  assert.equal(serverModule.validateGameName(''), false);
  assert.equal(serverModule.validateGameName(123), false);
  assert.equal(serverModule.validateGameName({ game: 'arena-1' }), false);
});

var test = require('node:test');
var assert = require('node:assert/strict');
var fc = require('fast-check');
var serverModule = require('../server.js');
var GameCollection = require('../games.js').GameCollection;

test('validateGameName rejeita payloads inesperados sem lançar erro', async function () {
  await fc.assert(
    fc.asyncProperty(fc.anything(), async function (value) {
      assert.doesNotThrow(function () {
        serverModule.validateGameName(value);
      });

      if (typeof value === 'string' && value.trim().length > 0 && value.length <= 64) {
        assert.equal(serverModule.validateGameName(value), true);
      } else {
        assert.equal(serverModule.validateGameName(value), false);
      }
    }),
    { numRuns: 500 }
  );
});

test('GameCollection não lança exceção com ids arbitrários', async function () {
  await fc.assert(
    fc.asyncProperty(fc.anything(), async function (value) {
      var collection = new GameCollection();

      assert.doesNotThrow(function () {
        collection.createGame(value);
      });

      assert.doesNotThrow(function () {
        collection.getGame(value);
      });
    }),
    { numRuns: 500 }
  );
});

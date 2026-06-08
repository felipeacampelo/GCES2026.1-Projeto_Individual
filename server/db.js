var Pool = require('pg').Pool;

var databaseUrl = process.env.DATABASE_URL;
var pool = null;
var enabled = Boolean(databaseUrl);

function isEnabled() {
  return enabled;
}

async function init() {
  if (!enabled) {
    return false;
  }

  pool = new Pool({
    connectionString: databaseUrl
  });

  await pool.query(
    'CREATE TABLE IF NOT EXISTS game_sessions (' +
      'id SERIAL PRIMARY KEY,' +
      'game_name TEXT NOT NULL UNIQUE,' +
      'host_connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),' +
      'guest_connected_at TIMESTAMPTZ,' +
      'closed_at TIMESTAMPTZ,' +
      'status TEXT NOT NULL DEFAULT \'waiting\'' +
    ')'
  );

  return true;
}

async function createGameSession(gameName) {
  if (!pool) return;

  await pool.query(
    'INSERT INTO game_sessions (game_name) VALUES ($1) ' +
    'ON CONFLICT (game_name) DO NOTHING',
    [gameName]
  );
}

async function markGameJoined(gameName) {
  if (!pool) return;

  await pool.query(
    'UPDATE game_sessions ' +
    'SET guest_connected_at = COALESCE(guest_connected_at, NOW()), status = \'active\' ' +
    'WHERE game_name = $1',
    [gameName]
  );
}

async function markGameClosed(gameName) {
  if (!pool) return;

  await pool.query(
    'UPDATE game_sessions ' +
    'SET closed_at = NOW(), status = \'closed\' ' +
    'WHERE game_name = $1 AND closed_at IS NULL',
    [gameName]
  );
}

async function listGameSessions() {
  if (!pool) return [];

  var result = await pool.query(
    'SELECT game_name, host_connected_at, guest_connected_at, closed_at, status ' +
    'FROM game_sessions ' +
    'ORDER BY id DESC'
  );

  return result.rows;
}

module.exports = {
  createGameSession: createGameSession,
  init: init,
  isEnabled: isEnabled,
  listGameSessions: listGameSessions,
  markGameClosed: markGameClosed,
  markGameJoined: markGameJoined
};

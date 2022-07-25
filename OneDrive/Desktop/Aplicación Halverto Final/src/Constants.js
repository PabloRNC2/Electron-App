const path = require('path')

module.exports = {
	LOG_FILE_PATH: `${path.join(process.env.APPDATA, '..\\LocalLow\\Mediatonic\\FallGuys_client\\Player.log')}`,
	PLAYER_TARGET_STRING: '[CameraDirector] Adding Spectator target',
	WINNER_TARGET_STRING: 'VictoryScene',
}
async function deleteLog(){
	const Constants = require('./Constants')
	const { writeFileSync } = require('fs')
	const LOG = Constants.LOG_FILE_PATH

	await writeFileSync(LOG, '', 'utf-8')
}

module.exports = deleteLog